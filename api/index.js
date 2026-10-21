const app = require('../app');
const { connectDB } = require('../config/db');

/**
 * Vercel Serverless Function entry point.
 * Exports an async handler that ensures database connectivity,
 * normalizes serverless rewrite URLs, and executes the Express application.
 */
module.exports = async (req, res) => {
  // If req.url was replaced with internal entrypoint file path, recover original request path
  if (req.url === '/api/index.js' || req.url === '/api/index') {
    const original = req.headers?.['x-matched-path'] || req.headers?.['x-forwarded-uri'] || req.headers?.['x-now-route-matches'];
    if (original && original !== '/api/index.js' && original !== '/api/index') {
      req.url = original;
    }
  }

  // Normalize req.url to ensure Express route matching works regardless of rewrite style
  if (req.originalUrl && req.originalUrl.startsWith('/api') && req.originalUrl !== '/api/index.js') {
    req.url = req.originalUrl;
  } else if (req.url && !req.url.startsWith('/api')) {
    req.url = `/api${req.url.startsWith('/') ? '' : '/'}${req.url}`;
  }

  try {
    // Reuses cached Mongoose connection across warm invocations
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error('[Serverless Error] Database connection failure:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to connect to database',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
