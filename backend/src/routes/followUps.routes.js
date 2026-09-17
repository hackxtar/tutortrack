const { Router } = require('express');
const { listFollowUps, createFollowUp, toggleStatus } = require('../controllers/followUps.controller');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { createFollowUpValidator, toggleFollowUpValidator } = require('../validators/followUps.validator');

const router = Router();

// GET /api/v1/follow-ups
router.get('/', authenticate, listFollowUps);

// POST /api/v1/follow-ups
router.post('/', authenticate, validate(createFollowUpValidator), createFollowUp);

// PATCH /api/v1/follow-ups/:id/status
router.patch('/:id/status', authenticate, validate(toggleFollowUpValidator), toggleStatus);

module.exports = router;
