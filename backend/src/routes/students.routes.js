const { Router } = require('express');
const { listStudents, createStudent, getStudentDetail } = require('../controllers/students.controller');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { createStudentValidator } = require('../validators/students.validator');

const router = Router();

// GET /api/v1/students
router.get('/', authenticate, listStudents);

// POST /api/v1/students
router.post('/', authenticate, validate(createStudentValidator), createStudent);

// GET /api/v1/students/:id
router.get('/:id', authenticate, getStudentDetail);

module.exports = router;
