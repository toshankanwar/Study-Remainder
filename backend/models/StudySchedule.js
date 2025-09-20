const mongoose = require('mongoose');

const studyScheduleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  studyTopic: {
    type: String,
    required: [true, 'Study topic is required'],
    trim: true,
    maxlength: [100, 'Study topic cannot exceed 100 characters']
  },
  studyTime: {
    type: String,
    required: [true, 'Study time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter time in HH:MM format']
  },
  days: [{
    type: String,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    required: true
  }],
  timezone: {
    type: String,
    default: 'Asia/Kolkata'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  reminderSent: {
    type: Date,
    default: null
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  }
}, {
  timestamps: true
});

// Index for efficient querying
studyScheduleSchema.index({ userId: 1, studyTime: 1, days: 1 });
studyScheduleSchema.index({ studyTime: 1, days: 1, isActive: 1 });

module.exports = mongoose.model('StudySchedule', studyScheduleSchema);
