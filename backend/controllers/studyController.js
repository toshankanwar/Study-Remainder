// backend/controllers/studyController.js
const { validationResult } = require('express-validator');
const StudySchedule = require('../models/StudySchedule');
const { sendSuccessResponse, sendErrorResponse } = require('../utils/responseHandler');

// Create Study Schedule
const createStudySchedule = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendErrorResponse(res, 'Validation failed', 400, errors.array());
    }

    const { studyTopic, studyTime, days, timezone, description } = req.body;

    const studySchedule = await StudySchedule.create({
      userId: req.user._id,
      studyTopic,
      studyTime,
      days,
      timezone: timezone || 'Asia/Kolkata',
      description
    });

    const populatedSchedule = await StudySchedule.findById(studySchedule._id)
      .populate('userId', 'name email');

    sendSuccessResponse(res, 'Study schedule created successfully', {
      schedule: populatedSchedule
    }, 201);

  } catch (error) {
    console.error('Create schedule error:', error);
    sendErrorResponse(res, 'Server error creating schedule', 500, error.message);
  }
};

// Get All Study Schedules for User
const getUserStudySchedules = async (req, res) => {
  try {
    const { page = 1, limit = 10, active } = req.query;
    
    const query = { userId: req.user._id };
    if (active !== undefined) {
      query.isActive = active === 'true';
    }

    const schedules = await StudySchedule.find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await StudySchedule.countDocuments(query);

    sendSuccessResponse(res, 'Study schedules retrieved successfully', {
      schedules,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get schedules error:', error);
    sendErrorResponse(res, 'Server error retrieving schedules', 500, error.message);
  }
};

// Get Single Study Schedule
const getStudySchedule = async (req, res) => {
  try {
    const schedule = await StudySchedule.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).populate('userId', 'name email');

    if (!schedule) {
      return sendErrorResponse(res, 'Study schedule not found', 404);
    }

    sendSuccessResponse(res, 'Study schedule retrieved successfully', {
      schedule
    });

  } catch (error) {
    console.error('Get schedule error:', error);
    sendErrorResponse(res, 'Server error retrieving schedule', 500, error.message);
  }
};

// Update Study Schedule
const updateStudySchedule = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendErrorResponse(res, 'Validation failed', 400, errors.array());
    }

    const schedule = await StudySchedule.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { ...req.body, reminderSent: null }, // Reset reminder when updated
      { new: true, runValidators: true }
    ).populate('userId', 'name email');

    if (!schedule) {
      return sendErrorResponse(res, 'Study schedule not found', 404);
    }

    sendSuccessResponse(res, 'Study schedule updated successfully', {
      schedule
    });

  } catch (error) {
    console.error('Update schedule error:', error);
    sendErrorResponse(res, 'Server error updating schedule', 500, error.message);
  }
};

// Delete Study Schedule
const deleteStudySchedule = async (req, res) => {
  try {
    const schedule = await StudySchedule.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!schedule) {
      return sendErrorResponse(res, 'Study schedule not found', 404);
    }

    sendSuccessResponse(res, 'Study schedule deleted successfully');

  } catch (error) {
    console.error('Delete schedule error:', error);
    sendErrorResponse(res, 'Server error deleting schedule', 500, error.message);
  }
};

// Toggle Schedule Active Status
const toggleScheduleStatus = async (req, res) => {
  try {
    const schedule = await StudySchedule.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!schedule) {
      return sendErrorResponse(res, 'Study schedule not found', 404);
    }

    schedule.isActive = !schedule.isActive;
    schedule.reminderSent = null; // Reset reminder status
    await schedule.save();

    sendSuccessResponse(res, `Study schedule ${schedule.isActive ? 'activated' : 'deactivated'} successfully`, {
      schedule
    });

  } catch (error) {
    console.error('Toggle status error:', error);
    sendErrorResponse(res, 'Server error toggling schedule status', 500, error.message);
  }
};

module.exports = {
  createStudySchedule,
  getUserStudySchedules,
  getStudySchedule,
  updateStudySchedule,
  deleteStudySchedule,
  toggleScheduleStatus
};
