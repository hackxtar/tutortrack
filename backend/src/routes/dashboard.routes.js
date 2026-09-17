const { Router } = require('express');
const { getMetrics } = require('../controllers/dashboard.controller');
const { authenticate } = require('../middleware/auth');

const router = Router();

// GET /api/v1/dashboard/metrics
router.get('/metrics', authenticate, getMetrics);

module.exports = router;
