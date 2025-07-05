const rateLimit = require('express-rate-limit');

const customLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: (req, res) => {
    return req.user ? 200 : 50;
  },
  keyGenerator: (req) => req.ip,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many requests. Please wait before retrying.',
    });
  },
});

module.exports = customLimiter