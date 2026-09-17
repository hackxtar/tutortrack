const { body } = require('express-validator');

const loginValidator = [
  body('email')
    .notEmpty().withMessage('Email is required.')
    .isEmail().withMessage('Must be a valid email format.'),
  body('password')
    .notEmpty().withMessage('Password is required.')
    .isString().withMessage('Password must be a string.')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
];

module.exports = { loginValidator };
