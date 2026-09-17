const { Router } = require('express');
const { listClassNotes, createClassNote } = require('../controllers/classNotes.controller');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { createClassNoteValidator } = require('../validators/classNotes.validator');

const router = Router();

// GET /api/v1/class-notes
router.get('/', authenticate, listClassNotes);

// POST /api/v1/class-notes
router.post('/', authenticate, validate(createClassNoteValidator), createClassNote);

module.exports = router;
