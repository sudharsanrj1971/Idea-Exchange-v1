const User = require('../models/User.model');
const jwt = require('jsonwebtoken');
const { success, error } = require('../utils/apiResponse');
const { logSecurityEvent } = require('../utils/securityLogger');
const { setCsrfCookie } = require('../middleware/csrf.middleware');

/**
 * Signs JWT Tokens.
 */
const signTokens = (userId) => {
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

/**
 * Sets secure httpOnly cookies.
 */
const setAuthCookies = (res, tokens) => {
  const cookieOptions = {
    httpOnly: true,
    secure: true, // Required for SameSite=None
    sameSite: 'none' // Required for cross-origin iframe
  };

  res.cookie('accessToken', tokens.accessToken, { 
    ...cookieOptions, 
    maxAge: 15 * 60 * 1000 // 15 min 
  });
  
  res.cookie('refreshToken', tokens.refreshToken, { 
    ...cookieOptions, 
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/api/v1/auth/refresh' // Restrict path for token rotation
  });
};

exports.register = async (req, res) => {
  try {
    const { email, name, studentId, department, batchYear, role, password } = req.body;

    // Check DB connection
    if (require('mongoose').connection.readyState !== 1) {
      return error(res, 'Infrastructure: Secure database connection unavailable. Please wait while the platform initializes.', 503);
    }

    const existingUser = await User.findOne({ institutionalEmail: email });
    if (existingUser) return error(res, 'Institutional identity already exists', 409);

    const user = await User.create({
      name,
      institutionalEmail: email,
      studentId,
      department,
      batchYear,
      role: role || 'student',
      password
    });

    user.password = undefined;
    success(res, { user }, 201);
  } catch (err) {
    logger.error('Registration Error:', err);
    error(res, err.name === 'ValidationError' ? err.message : 'Registration failed. The innovation network is experiencing high latency.', 500);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check DB connection
    if (require('mongoose').connection.readyState !== 1) {
      return error(res, 'Authentication service temporarily offline. Database handshake failed.', 503);
    }

    const user = await User.findOne({ institutionalEmail: email }).select('+password');
    if (!user || !(await user.comparePassword(password, user.password))) {
      await logSecurityEvent('LOGIN_FAIL', 'warn', null, req, { email });
      return error(res, 'Invalid credentials', 401);
    }

    if (user.isBanned) {
      await logSecurityEvent('SYBIL_ATTEMPT', 'critical', user._id, req, { reason: 'Banned user login' });
      return error(res, 'Account suspended for platform integrity violations', 403);
    }

    const tokens = signTokens(user._id);
    setAuthCookies(res, tokens);
    setCsrfCookie(res); // Regenerate CSRF on login

    user.password = undefined;
    await logSecurityEvent('LOGIN_SUCCESS', 'info', user._id, req);
    
    success(res, { user });
  } catch (err) {
    error(res, 'Authentication engine failure', 500);
  }
};

exports.refresh = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return error(res, 'Refresh session expired', 401);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.isBanned) return error(res, 'Session invalid', 401);

    const tokens = signTokens(user._id);
    setAuthCookies(res, tokens);
    
    success(res, { message: 'Session extended' });
  } catch (err) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    error(res, 'Invalid session', 401);
  }
};

exports.logout = (req, res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.clearCookie('csrf-token');
  success(res, { message: 'Secure logout completed' });
};

exports.getCsrfToken = (req, res) => {
  const token = setCsrfCookie(res);
  success(res, { csrfToken: token });
};

const { getGoogleAuthUrl, verifyGoogleCode } = require('../utils/googleAuth');
const logger = require('../utils/logger');

exports.getGoogleUrl = (req, res) => {
  const redirectUri = req.query.redirectUri;
  if (!redirectUri) return error(res, 'Redirect URI required', 400);
  
  if (!process.env.OAUTH_GOOGLE_CLIENT_ID || !process.env.OAUTH_GOOGLE_CLIENT_SECRET) {
    logger.error('[OAUTH] Google Credentials missing in environment');
    return error(res, 'Infrastructure: Google OAuth identity secrets are not configured in environment variables.', 501);
  }

  try {
    const url = getGoogleAuthUrl(redirectUri);
    success(res, { url });
  } catch (err) {
    logger.error('[OAUTH] Failed to generate auth URL', err);
    error(res, 'Failed to generate identity handshake mirror.', 500);
  }
};

exports.googleCallback = async (req, res) => {
  const { code, redirectUri } = req.query;
  
  try {
    if (!code || !redirectUri) throw new Error('Missing parameters');
    
    // 1. Verify code with Google
    const payload = await verifyGoogleCode(code, redirectUri);
    const { email, name, picture, sub: googleId } = payload;
    
    // 2. Find or create user
    let user = await User.findOne({ institutionalEmail: email });
    
    if (!user) {
      // In IdeaXchange, we enforce institutional email. 
      // If the email is not institutional, we could block it, but for demo we allow.
      user = await User.create({
        name,
        institutionalEmail: email,
        role: 'student', // Default
        password: require('crypto').randomBytes(16).toString('hex'), // Random password for OAuth users
      });
    }

    if (user.isBanned) {
      return res.send(`
        <html><body><script>
          window.opener.postMessage({ type: 'OAUTH_AUTH_FAIL', message: 'Account suspended' }, '*');
          window.close();
        </script></body></html>
      `);
    }

    // 3. Issue tokens
    const tokens = signTokens(user._id);
    setAuthCookies(res, tokens);
    setCsrfCookie(res);

    await logSecurityEvent('LOGIN_OAUTH_SUCCESS', 'info', user._id, req, { provider: 'google' });

    // 4. Send success to parent and close
    res.send(`
      <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS' }, '*');
              window.close();
            } else {
              window.location.href = '/dashboard';
            }
          </script>
          <p>Authentication successful. Closing window...</p>
        </body>
      </html>
    `);
  } catch (err) {
    logger.error('[OAUTH] Google Callback Error', err);
    res.send(`
      <html><body><script>
        window.opener.postMessage({ type: 'OAUTH_AUTH_FAIL', message: 'Internal authentication failure' }, '*');
        window.close();
      </script></body></html>
    `);
  }
};
