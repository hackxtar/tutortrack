const { body } = require('express-validator');

const createStudentValidator = [
  body('name')
    .notEmpty().withMessage('Student name is required.')
    .isString().withMessage('Name must be a string.'),
  body('grade')
    .notEmpty().withMessage('Grade is required.'),
  body('course')
    .notEmpty().withMessage('Course is required.'),
  body('parentPhone')
    .notEmpty().withMessage('Parent phone is required.')
    .matches(/^\+?[0-9\s\-]{10,15}$/).withMessage('Parent phone format is invalid.'),
  body('parentName')
    .optional()
    .isString().withMessage('Parent name must be a string.'),
  body('schedule')
    .optional()
    .isString().withMessage('Schedule must be a string.'),
];

module.exports = { createStudentValidator };
