const SecurityAuditLog = require('../models/SecurityAuditLog.model');
const logger = require('./logger');

/**
 * Unified Security Event Logger.
 * Persists to MongoDB for Admin UI and streams to Winston (LogDNA/StandardOut).
 */
const logSecurityEvent = async (event, severity, userId, req, metadata = {}) => {
  const ipAddress = req?.ip || req?.headers?.['x-forwarded-for'] || req?.connection?.remoteAddress || '0.0.0.0';
  const userAgent = req?.headers?.['user-agent'] || 'unknown';

  // 1. Stream to Winston (Always do this first, it's non-blocking)
  const logMsg = `[SECURITY] [${severity.toUpperCase()}] ${event} | IP: ${ipAddress} | User: ${userId || 'anonymous'}`;
  if (severity === 'critical') {
    logger.error(logMsg, metadata);
  } else if (severity === 'warn') {
    logger.warn(logMsg, metadata);
  } else {
    logger.info(logMsg, metadata);
  }

  // 2. Persist to DB (Only if connected)
  const mongoose = require('mongoose');
  if (mongoose.connection.readyState === 1) {
    try {
      await SecurityAuditLog.create({
        userId: userId || (req.user ? req.user._id : null),
        ipAddress,
        userAgent,
        event,
        severity,
        metadata
      });
    } catch (err) {
      logger.error('CRITICAL: Failed to write security audit log to DB', { error: err.message });
    }
  } else {
    logger.debug('Security log omitted from DB: Database not connected');
  }
};

module.exports = { logSecurityEvent };
