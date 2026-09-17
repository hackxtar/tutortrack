const classNotesService = require('../services/classNotes.service');

/**
 * GET /api/v1/class-notes
 */
async function listClassNotes(req, res, next) {
  try {
    const { studentId, limit } = req.query;
    const result = classNotesService.listClassNotes(req.tutorId, { studentId, limit });

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
 * POST /api/v1/class-notes
 */
async function createClassNote(req, res, next) {
  try {
    const result = classNotesService.createClassNote(req.tutorId, req.body);

    if (result.error) {
      return res.status(result.status).json({
        success: false,
        message: result.error,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Class note saved successfully',
      data: result.data,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { listClassNotes, createClassNote };
