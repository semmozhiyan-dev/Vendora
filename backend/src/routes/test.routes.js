const express = require('express');
const { slow, fast } = require('../controllers/test.controller');

const router = express.Router();

/**
 * ⚠️ TEMPORARY TEST ROUTES - Remove before production
 */

// Test timeout middleware - should respond with 503 after 10s
router.get('/slow', slow);

// Test fast response - should complete normally
router.get('/fast', fast);

module.exports = router;
