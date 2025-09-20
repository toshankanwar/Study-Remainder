// backend/services/cronService.js
const cron = require('node-cron');
const StudySchedule = require('../models/StudySchedule');
const User = require('../models/User');
const EmailService = require('./emailService');

class CronService {
  constructor() {
    this.jobs = new Map();
  }

  start() {
    console.log('🚀 Starting Study Reminder Cron Service...');
    
    // Test email connection first
    EmailService.testConnection();

    // Run every minute to check for study reminders
    const reminderJob = cron.schedule('* * * * *', async () => {
      await this.checkAndSendReminders();
    }, {
      scheduled: true
    });

    this.jobs.set('studyReminder', reminderJob);
    
    // Cleanup old reminder records every day at midnight
    const cleanupJob = cron.schedule('0 0 * * *', async () => {
      await this.cleanupOldReminders();
    }, {
      scheduled: true
    });

    this.jobs.set('cleanup', cleanupJob);

    console.log('✅ Cron jobs started successfully');
  }

  async checkAndSendReminders() {
    try {
      const now = new Date();
      const currentDay = this.getCurrentDayName();
      const currentTime = this.formatTime(now);
      
      // Calculate time 10 minutes from now
      const tenMinutesLater = new Date(now.getTime() + 10 * 60 * 1000);
      const reminderTime = this.formatTime(tenMinutesLater);
      
      console.log(`🔍 Checking for reminders at ${currentTime} for ${reminderTime} on ${currentDay}`);

      // Find active schedules that need reminders
      const schedules = await StudySchedule.find({
        isActive: true,
        days: currentDay,
        studyTime: reminderTime,
        $or: [
          { reminderSent: null },
          { 
            reminderSent: { 
              $lt: new Date(now.toDateString()) // Not sent today
            }
          }
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
            // Update reminder sent timestamp
            schedule.reminderSent = now;
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
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      
      const result = await StudySchedule.updateMany(
        { 
          reminderSent: { $lt: thirtyDaysAgo },
          isActive: false 
        },
        { $unset: { reminderSent: 1 } }
      );

      console.log(`🧹 Cleaned up ${result.modifiedCount} old reminder records`);
    } catch (error) {
      console.error('❌ Error in cleanup cron job:', error.message);
    }
  }

  getCurrentDayName() {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[new Date().getDay()];
  }

  formatTime(date) {
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
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
