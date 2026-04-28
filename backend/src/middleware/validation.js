// src/middleware/validation.js
const { body, validationResult, query } = require('express-validator');

/**
 * Validation middleware to check results and return errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }
  next();
};

// Auth validation rules
const validateRegister = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  handleValidationErrors,
];

const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];

// Trip validation rules
const validateTripCreation = [
  body('title').trim().notEmpty().withMessage('Trip title is required'),
  body('destination').trim().notEmpty().withMessage('Destination is required'),
  body('startDate').isISO8601().toDate().withMessage('Start date must be valid'),
  body('endDate').isISO8601().toDate().withMessage('End date must be valid'),
  handleValidationErrors,
];

const validateItineraryItem = [
  body('title').trim().notEmpty().withMessage('Activity title is required'),
  body('date').isISO8601().toDate().withMessage('Date must be valid'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  handleValidationErrors,
];

// Destination search validation
const validateDestinationSearch = [
  query('city').trim().notEmpty().withMessage('City is required'),
  handleValidationErrors,
];

module.exports = {
  validateRegister,
  validateLogin,
  validateTripCreation,
  validateItineraryItem,
  validateDestinationSearch,
  handleValidationErrors,
};
