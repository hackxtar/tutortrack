const { body } = require('express-validator');

const createFollowUpValidator = [
  body('studentId')
    .notEmpty().withMessage('Student ID is required.'),
  body('dueDate')
    .notEmpty().withMessage('Due date is required.')
    .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage('Due date must be in YYYY-MM-DD format.'),
  body('objective')
    .notEmpty().withMessage('Objective is required.'),
  body('dueTime')
    .optional()
    .isString().withMessage('Due time must be a string.'),
  body('parentPhone')
    .optional()
    .isString().withMessage('Parent phone must be a string.'),
  body('draftMessage')
    .optional()
    .isString().withMessage('Draft message must be a string.'),
];

const toggleFollowUpValidator = [
  body('isDone')
    .notEmpty().withMessage('isDone is required.')
    .isBoolean().withMessage('isDone must be a boolean.'),
];

module.exports = { createFollowUpValidator, toggleFollowUpValidator };
