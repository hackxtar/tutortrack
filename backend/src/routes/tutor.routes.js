const { Router } = require('express');
const { getProfile, updateProfile } = require('../controllers/tutor.controller');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { updateProfileValidator } = require('../validators/tutor.validator');

const router = Router();

// GET /api/v1/tutor/profile
router.get('/profile', authenticate, getProfile);

// PUT /api/v1/tutor/profile
router.put('/profile', authenticate, validate(updateProfileValidator), updateProfile);

module.exports = router;
