/**
 * Global error handling middleware.
 * Catches all unhandled errors and returns a consistent JSON response.
 */
function errorHandler(err, req, res, _next) {
  console.error('❌ Unhandled Error:', err.stack || err.message);

  // Handle specific error types
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON in request body.',
    });
  }

  const statusCode = err.statusCode || 500;
  const message = statusCode === 500
    ? 'Internal server error'
    : err.message;

  res.status(statusCode).json({
    success: false,
    message,
  });
}

module.exports = { errorHandler };
