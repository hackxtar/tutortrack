const { body } = require('express-validator');

const updateProfileValidator = [
  body('name')
    .notEmpty().withMessage('Name is required.')
    .isString().withMessage('Name must be a string.')
    .isLength({ max: 100 }).withMessage('Name must not exceed 100 characters.'),
  body('phone')
    .notEmpty().withMessage('Phone is required.')
    .matches(/^\+?[0-9\s\-]{10,15}$/).withMessage('Phone must match format: +91 98201 54321'),
  body('autoReminderHours')
    .optional()
    .isInt().withMessage('autoReminderHours must be an integer.')
    .isIn([1, 2, 4, 24]).withMessage('autoReminderHours must be one of: 1, 2, 4, 24.'),
  body('email')
    .optional()
    .isEmail().withMessage('Must be a valid email format.'),
  body('subjects')
    .optional()
    .isString().withMessage('Subjects must be a string.'),
  body('autoDraftMissedSession')
    .optional()
    .isBoolean().withMessage('autoDraftMissedSession must be a boolean.'),
  body('monthlyRenewalAlert')
    .optional()
    .isBoolean().withMessage('monthlyRenewalAlert must be a boolean.'),
];

module.exports = { updateProfileValidator };
