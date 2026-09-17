const dashboardService = require('../services/dashboard.service');

/**
 * GET /api/v1/dashboard/metrics
 */
async function getMetrics(req, res, next) {
  try {
    const result = dashboardService.getDashboardMetrics(req.tutorId);

    res.status(200).json({
      success: true,
      data: result.data,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getMetrics };
