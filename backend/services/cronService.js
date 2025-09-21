const cron = require('node-cron');
const StudySchedule = require('../models/StudySchedule');
const User = require('../models/User');
const EmailService = require('./emailService');
const { DateTime } = require('luxon'); // Add Luxon for timezone handling

class CronService {
  constructor() {
    this.jobs = new Map();
  }

  start() {
    console.log('🚀 Starting Study Reminder Cron Service...');

    EmailService.testConnection();

    // Every minute
    const reminderJob = cron.schedule('* * * * *', async () => {
      await this.checkAndSendReminders();
    }, { scheduled: true });
    this.jobs.set('studyReminder', reminderJob);

    // Daily cleanup at 00:00 IST
    const cleanupJob = cron.schedule('0 0 * * *', async () => {
      await this.cleanupOldReminders();
    }, { scheduled: true });

    this.jobs.set('cleanup', cleanupJob);

    console.log('✅ Cron jobs started successfully');
  }

  async checkAndSendReminders() {
    try {
      // ---- Use IST time everywhere ----
      const now = DateTime.now().setZone('Asia/Kolkata');
      const currentDay = this.getCurrentDayName(now);
      const currentTime = this.formatTime(now);

      // Time 10 minutes from now in IST
      const reminderTimeObj = now.plus({ minutes: 10 });
      const reminderTime = this.formatTime(reminderTimeObj);

      console.log(`🔍 Checking for reminders at ${currentTime} for ${reminderTime} on ${currentDay} (Asia/Kolkata)`);

      // Only treat dates/times as IST when querying!
      const todayIST = now.startOf('day').toJSDate(); // midnight IST

      const schedules = await StudySchedule.find({
        isActive: true,
        days: currentDay,
        studyTime: reminderTime,
        $or: [
          { reminderSent: null },
          { reminderSent: { $lt: todayIST } }
        ]
      }).populate('userId', 'name email isActive');

      console.log(`📧 Found ${schedules.length} schedules requiring reminders`);

      for (const schedule of schedules) {
        if (schedule.userId && schedule.userId.isActive) {
          const emailResult = await EmailService.sendStudyReminder(
            schedule.userId.email,
            schedule.userId.name,
            schedule.studyTopic,
            schedule.studyTime,
            schedule.description
          );

          if (emailResult.success) {
            // Save reminderSent as current IST time
            schedule.reminderSent = now.toJSDate();
            await schedule.save();
            console.log(`✅ Reminder sent for: ${schedule.studyTopic} to ${schedule.userId.email}`);
          } else {
            console.error(`❌ Failed to send reminder for: ${schedule.studyTopic} to ${schedule.userId.email}`);
          }
        }
      }
    } catch (error) {
      console.error('❌ Error in reminder cron job:', error.message);
    }
  }

  async cleanupOldReminders() {
    try {
      // Use IST for date math!
      const istNow = DateTime.now().setZone('Asia/Kolkata');
      const thirtyDaysAgo = istNow.minus({ days: 30 }).toJSDate();

      const result = await StudySchedule.updateMany(
        { reminderSent: { $lt: thirtyDaysAgo }, isActive: false },
        { $unset: { reminderSent: 1 } }
      );
      console.log(`🧹 Cleaned up ${result.modifiedCount} old reminder records`);
    } catch (error) {
      console.error('❌ Error in cleanup cron job:', error.message);
    }
  }

  // Accepts a luxon DateTime
  getCurrentDayName(dt = DateTime.now().setZone('Asia/Kolkata')) {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[dt.weekday % 7]; // luxon: 1=Mon,...7=Sun
  }

  // Accepts a luxon DateTime
  formatTime(dt) {
    return dt.toFormat('HH:mm');
  }

  stop() {
    console.log('🛑 Stopping cron jobs...');
    this.jobs.forEach((job, name) => {
      job.destroy();
      console.log(`✅ Stopped ${name} cron job`);
    });
    this.jobs.clear();
  }

  getStatus() {
    return {
      totalJobs: this.jobs.size,
      jobs: Array.from(this.jobs.keys()),
      isRunning: this.jobs.size > 0
    };
  }
}

module.exports = new CronService();
