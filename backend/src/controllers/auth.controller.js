const authService = require('../services/auth.service');

/**
 * POST /api/v1/auth/login
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = authService.loginTutor(email, password);

    if (result.error) {
      return res.status(result.status).json({
        success: false,
        message: result.error,
      });
    }

    res.status(200).json({
      success: true,
      token: result.token,
      tutor: result.tutor,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { login };
