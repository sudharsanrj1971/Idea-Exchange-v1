const { OAuth2Client } = require('google-auth-library');
const logger = require('./logger');

const client = new OAuth2Client(
  process.env.OAUTH_GOOGLE_CLIENT_ID,
  process.env.OAUTH_GOOGLE_CLIENT_SECRET
);

/**
 * Generates the Google OAuth authorization URL.
 */
exports.getGoogleAuthUrl = (redirectUri) => {
  return client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
    redirect_uri: redirectUri,
    prompt: 'select_account'
  });
};

/**
 * Exchanges authorization code for tokens and verifies the ID token.
 */
exports.verifyGoogleCode = async (code, redirectUri) => {
  try {
    const { tokens } = await client.getToken({
      code,
      redirect_uri: redirectUri
    });
    
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.OAUTH_GOOGLE_CLIENT_ID,
    });
    
    return ticket.getPayload();
  } catch (err) {
    logger.error('[OAUTH] Google verification failed', err);
    throw err;
  }
};
