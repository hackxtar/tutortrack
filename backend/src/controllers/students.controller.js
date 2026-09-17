const studentsService = require('../services/students.service');

/**
 * GET /api/v1/students
 */
async function listStudents(req, res, next) {
  try {
    const { status, search, page, limit } = req.query;
    const result = studentsService.listStudents(req.tutorId, { status, search, page, limit });

    res.status(200).json({
      success: true,
      total: result.total,
      page: result.page,
      data: result.data,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/v1/students
 */
async function createStudent(req, res, next) {
  try {
    const result = studentsService.createStudent(req.tutorId, req.body);

    res.status(201).json({
      success: true,
      message: 'Student added successfully',
      data: result.data,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/v1/students/:id
 */
async function getStudentDetail(req, res, next) {
  try {
    const result = studentsService.getStudentDetail(req.tutorId, req.params.id);

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

module.exports = { listStudents, createStudent, getStudentDetail };
