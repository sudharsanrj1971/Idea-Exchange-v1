const crypto = require('crypto');
const { logSecurityEvent } = require('../utils/securityLogger');

/**
 * Generate a cryptographically secure CSRF token.
 */
const generateCsrfToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Set a non-HttpOnly cookie for the client to read and mirror in headers.
 */
const setCsrfCookie = (res) => {
  const token = generateCsrfToken();
  res.cookie('csrf-token', token, {
    httpOnly: false, // Must be readable by axios
    secure: true,
    sameSite: 'none'
  });
  return token;
};

/**
 * CSRF Double-Submit Verification Middleware.
 */
const verifyCsrf = (req, res, next) => {
  // 1. Skip Safe Methods
  const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
  if (safeMethods.includes(req.method)) {
    return next();
  }

  // 2. Extract tokens
  const tokenFromHeader = req.headers['x-csrf-token'];
  const tokenFromCookie = req.cookies['csrf-token'];

  if (!tokenFromHeader || !tokenFromCookie) {
    logSecurityEvent('CSRF_VIOLATION', 'warn', null, req, { reason: 'Missing token' });
    return res.status(403).json({ success: false, code: 'CSRF_INVALID', message: 'CSRF token missing' });
  }

  // 3. Timing-Safe Comparison
  try {
    const isValid = crypto.timingSafeEqual(
      Buffer.from(tokenFromHeader),
      Buffer.from(tokenFromCookie)
    );

    if (!isValid) {
      logSecurityEvent('CSRF_VIOLATION', 'critical', null, req, { reason: 'Token mismatch' });
      return res.status(403).json({ success: false, code: 'CSRF_INVALID', message: 'CSRF token mismatch' });
    }

    // Success, continue
    next();
  } catch (err) {
    return res.status(403).json({ success: false, code: 'CSRF_INVALID' });
  }
};

module.exports = { setCsrfCookie, verifyCsrf };
