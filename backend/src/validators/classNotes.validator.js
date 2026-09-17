const { body } = require('express-validator');

const createClassNoteValidator = [
  body('studentId')
    .notEmpty().withMessage('Student ID is required.'),
  body('topic')
    .notEmpty().withMessage('Topic is required.')
    .isLength({ max: 255 }).withMessage('Topic must not exceed 255 characters.'),
  body('understanding')
    .notEmpty().withMessage('Understanding level is required.')
    .isIn(['Excellent', 'Good Understanding', 'Needs Practice', 'Struggling'])
    .withMessage("Understanding must be one of: 'Excellent', 'Good Understanding', 'Needs Practice', 'Struggling'."),
  body('duration')
    .optional()
    .isString().withMessage('Duration must be a string.'),
  body('subject')
    .optional()
    .isString().withMessage('Subject must be a string.'),
  body('homework')
    .optional()
    .isString().withMessage('Homework must be a string.'),
  body('tutorNote')
    .optional()
    .isString().withMessage('Tutor note must be a string.'),
];

module.exports = { createClassNoteValidator };
