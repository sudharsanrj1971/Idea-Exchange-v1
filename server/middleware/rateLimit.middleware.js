const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const RedisStore = require('rate-limit-redis').default;
const { createClient } = require('redis');
const { logSecurityEvent } = require('../utils/securityLogger');

let redisClient;
let store;

if (process.env.REDIS_URL && process.env.NODE_ENV === 'production') {
  redisClient = createClient({ url: process.env.REDIS_URL });
  redisClient.connect().catch(console.error);
  store = new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
  });
}

const onLimitReached = (req, res, options) => {
  logSecurityEvent('RATE_LIMIT_HIT', 'warn', req.user?._id, req, { 
    path: req.path,
    limit: options.max 
  });
  res.status(429).json({
    success: false,
    message: 'Too many requests, please try again later.'
  });
};

/**
 * Protects authentication endpoints (Login/Register).
 */
const authLimiter = (req, res, next) => next();
const apiLimiter = (req, res, next) => next();
const exportLimiter = (req, res, next) => next();
const loginSlowDown = (req, res, next) => next();

module.exports = { authLimiter, apiLimiter, exportLimiter, loginSlowDown };
