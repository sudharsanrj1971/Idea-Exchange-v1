const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const http = require('http');
const logger = require('./utils/logger');
const cron = require('./services/cron.service');
const globalErrorHandler = require('./middleware/error.middleware');
const { verifyCsrf } = require('./middleware/csrf.middleware');
const { apiLimiter } = require('./middleware/rateLimit.middleware');

const path = require('path');
const { createServer: createViteServer } = require('vite');

const app = express();
const server = http.createServer(app);
const PORT = 3000;

/**
 * FIX: Vite Integration
 * Ensures the Express server handles both API and Frontend in the same process.
 */
async function startServer() {
  console.log('[DEBUG] Starting startServer()...');
  try {
    // 1. API routes FIRST
    console.log('[DEBUG] Setting up body parsers...');
    app.use(express.json({ limit: '10kb' }));
    app.use(cookieParser());
    app.use(mongoSanitize({ replaceWith: '_' })); 
    app.use(xss()); 
    app.use(hpp());

    console.log('[DEBUG] Setting up Helmet and CORS...');
    // CORS & Helmet
    app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // unsafe-eval needed for some dev tools
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          imgSrc: ["'self'", "data:", "https://picsum.photos", "https://lh3.googleusercontent.com"], // allow google profile pics
          objectSrc: ["'none'"],
          frameAncestors: ["*"], // Allow framing in AI Studio
          connectSrc: ["'self'", "ws:", "wss:"]
        }
      },
      crossOriginEmbedderPolicy: false, // Can interfere with cross-origin assets in iframes
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      referrerPolicy: { policy: 'no-referrer-when-downgrade' }
    }));
    app.set('trust proxy', 1);
    app.use(cors({
      origin: true,
      credentials: true
    }));

    console.log('[DEBUG] Setting up CSRF and Rate Limiting...');
    // CSRF & Rate Limiting
    app.use(verifyCsrf);
    app.use('/api/', apiLimiter);

    console.log('[DEBUG] Mounting routes...');
    // API Mounting
    app.use('/api/v1/auth', require('./routes/auth.routes'));
    app.use('/api/v1/users', require('./routes/user.routes'));
    app.use('/api/v1/projects', require('./routes/project.routes'));
    app.use('/api/v1/contributions', require('./routes/contribution.routes'));
    app.use('/api/v1/scoring', require('./routes/scoring.routes'));
    app.use('/api/v1/governance', require('./routes/governance.routes'));
    app.use('/api/v1/ledger', require('./routes/ledger.routes'));
    app.use('/api/v1/funding', require('./routes/funding.routes'));
    app.use('/api/v1/admin', require('./routes/admin.routes'));
    app.use('/raft', require('./routes/raft.routes'));

    // Global Error Handler for API
    app.use(globalErrorHandler);

    console.log('[DEBUG] Setting up Vite middleware...');
    // 2. Vite Middleware or Static Assets
    if (process.env.NODE_ENV !== 'production') {
      const vite = await createViteServer({
        server: { 
          middlewareMode: true,
          hmr: false // Always disable HMR in this environment
        },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } else {
      const distPath = path.join(process.cwd(), 'dist');
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }

    console.log('[DEBUG] Initializing Socket.io...');
    // 3. Socket.io
    const { initSocket } = require('./socket/index');
    initSocket(server);

    console.log('[DEBUG] Connecting to MongoDB...');
    // 4. Database Connection
    mongoose.set('bufferCommands', false); // Disable globally to prevent hangs
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/ideaxchange';
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000 // Don't hang forever
    });
    logger.info('[CORE] Database connection secured.');
    console.log('[DEBUG] Database connection secured.');
    
    cron.init();
    
    server.listen(PORT, '0.0.0.0', () => {
      logger.info(`[CORE] IdeaXchange Node running on port ${PORT}`);
      console.log(`[CORE] IdeaXchange Node running on port ${PORT}`);
    });
  } catch (err) {
    logger.error('[CORE] Critical startup failure:', err);
    console.error('[CORE] Critical startup failure:', err);
    
    // If it's just a DB error, try to start anyway in dev for UI preview
    if (process.env.NODE_ENV !== 'production' && !server.listening) {
      console.warn('[DEBUG] Server starting without DB for preview...');
      server.listen(PORT, '0.0.0.0', () => {
        console.log(`[CORE] IdeaXchange Node (NO DB) running on port ${PORT}`);
      });
    } else {
      process.exit(1);
    }
  }
}

startServer();

// Graceful Shutdown Protocol
const shutdown = () => {
  logger.info('[SHUTDOWN] Terminating node services...');
  server.close(() => {
    mongoose.connection.close(false, () => {
      logger.info('[SHUTDOWN] Connections drained. Exit status 0.');
      process.exit(0);
    });
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
