const { Router } = require('express');
const { login } = require('../controllers/auth.controller');
const { validate } = require('../middleware/validate');
const { loginValidator } = require('../validators/auth.validator');

const router = Router();

// POST /api/v1/auth/login
router.post('/login', validate(loginValidator), login);

module.exports = router;
