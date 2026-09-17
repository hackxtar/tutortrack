const followUpsService = require('../services/followUps.service');

/**
 * GET /api/v1/follow-ups
 */
async function listFollowUps(req, res, next) {
  try {
    const { filter, studentId } = req.query;
    const result = followUpsService.listFollowUps(req.tutorId, { filter, studentId });

    res.status(200).json({
      success: true,
      total: result.total,
      data: result.data,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/v1/follow-ups
 */
async function createFollowUp(req, res, next) {
  try {
    const result = followUpsService.createFollowUp(req.tutorId, req.body);

    if (result.error) {
      return res.status(result.status).json({
        success: false,
        message: result.error,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Follow-up scheduled successfully',
      data: result.data,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /api/v1/follow-ups/:id/status
 */
async function toggleStatus(req, res, next) {
  try {
    const result = followUpsService.toggleFollowUpStatus(req.tutorId, req.params.id, req.body.isDone);

    if (result.error) {
      return res.status(result.status).json({
        success: false,
        message: result.error,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Follow-up status updated',
      data: result.data,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { listFollowUps, createFollowUp, toggleStatus };
