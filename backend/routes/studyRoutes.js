const express = require('express');
const { body } = require('express-validator');
const {
  createStudySchedule,
  getUserStudySchedules,
  getStudySchedule,
  updateStudySchedule,
  deleteStudySchedule,
  toggleScheduleStatus
} = require('../controllers/studyController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const scheduleValidation = [
  body('studyTopic')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Study topic must be between 1 and 100 characters'),
  body('studyTime')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Please provide time in HH:MM format (e.g., 09:30)'),
  body('days')
    .isArray({ min: 1 })
    .withMessage('Please select at least one day'),
  body('days.*')
    .isIn(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])
    .withMessage('Invalid day selected'),
  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters')
];

// All routes require authentication
router.use(protect);

// Routes
router.post('/', scheduleValidation, createStudySchedule);
router.get('/', getUserStudySchedules);
router.get('/:id', getStudySchedule);
router.put('/:id', scheduleValidation, updateStudySchedule);
router.delete('/:id', deleteStudySchedule);
router.patch('/:id/toggle', toggleScheduleStatus);

module.exports = router;
