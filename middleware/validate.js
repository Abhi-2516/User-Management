const { body, param, validationResult } = require('express-validator');

/**
 * Middleware to evaluate express-validator results and return standardized error format.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((err) => ({
        field: err.path || err.param,
        message: err.msg
      }))
    });
  }
  next();
};

/**
 * Validation rules for POST /api/users (User creation).
 */
const createUserRules = [
  body('fullName')
    .exists({ checkFalsy: true })
    .withMessage('Full name is required')
    .isString()
    .withMessage('Full name must be a string')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters long'),

  body('email')
    .exists({ checkFalsy: true })
    .withMessage('Email address is required')
    .isString()
    .withMessage('Email address must be a string')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('password')
    .exists({ checkFalsy: true })
    .withMessage('Password is required')
    .isString()
    .withMessage('Password must be a string')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

/**
 * Validation rules for PATCH /api/users/:id (User update).
 */
const updateUserRules = [
  // Validate that request body is not empty
  body().custom((value, { req }) => {
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
      throw new Error('Request body must be a valid JSON object');
    }
    const keys = Object.keys(req.body);
    if (keys.length === 0) {
      throw new Error('Request body cannot be empty. At least one field (fullName, email, or password) must be provided.');
    }

    // Reject unsupported fields
    const allowedFields = ['fullName', 'email', 'password'];
    const unsupportedFields = keys.filter((key) => !allowedFields.includes(key));
    if (unsupportedFields.length > 0) {
      throw new Error(`Unsupported field(s) provided: ${unsupportedFields.join(', ')}. Only fullName, email, and password may be updated.`);
    }

    return true;
  }),

  body('fullName')
    .optional()
    .isString()
    .withMessage('Full name must be a string')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Full name must be between 2 and 100 characters long'),

  body('email')
    .optional()
    .isString()
    .withMessage('Email address must be a string')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('password')
    .optional()
    .isString()
    .withMessage('Password must be a string')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

/**
 * Validation rules for MongoDB ObjectId parameters.
 */
const validateUserIdRules = [
  param('id')
    .isMongoId()
    .withMessage('Invalid user ID format. Must be a 24-character hexadecimal string.')
];

module.exports = {
  validate,
  createUserRules,
  updateUserRules,
  validateUserIdRules
};
