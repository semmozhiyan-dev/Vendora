/**
 * Test controller for middleware testing
 * ⚠️ TEMPORARY - Remove before production
 */

// Test slow endpoint to verify timeout middleware
exports.slow = async (req, res) => {
  const requestId = req.id || 'NO-ID';
  console.log(`[${requestId}] Slow endpoint called, will respond in 15s...`);
  
  setTimeout(() => {
    // This should not be reached due to timeout middleware
    res.json({ success: true, message: 'Slow request completed' });
  }, 15000); // 15 seconds
};

// Test fast endpoint for sanity check
exports.fast = (req, res) => {
  res.json({ success: true, message: 'Fast request completed' });
};
