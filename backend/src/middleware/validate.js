const { validationResult } = require('express-validator');

/**
 * Validation middleware factory.
 * Takes an array of express-validator chains and returns middleware
 * that runs them and returns 400 with errors if validation fails.
 */
function validate(validations) {
  return async (req, res, next) => {
    // Run all validations
    for (const validation of validations) {
      await validation.run(req);
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map((e) => ({
          field: e.path,
          message: e.msg,
        })),
      });
    }

    next();
  };
}

module.exports = { validate };
