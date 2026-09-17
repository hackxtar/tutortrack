const tutorService = require('../services/tutor.service');

/**
 * GET /api/v1/tutor/profile
 */
async function getProfile(req, res, next) {
  try {
    const result = tutorService.getTutorProfile(req.tutorId);

    if (result.error) {
      return res.status(result.status).json({
        success: false,
        message: result.error,
      });
    }

    res.status(200).json({
      success: true,
      data: result.data,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/v1/tutor/profile
 */
async function updateProfile(req, res, next) {
  try {
    const result = tutorService.updateTutorProfile(req.tutorId, req.body);

    if (result.error) {
      return res.status(result.status).json({
        success: false,
        message: result.error,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Preferences saved successfully',
      data: result.data,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getProfile, updateProfile };
