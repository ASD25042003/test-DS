require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');

const logger = require('./utils/logger');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting désactivé en développement
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 100 : 999999,
  message: 'Trop de requêtes depuis cette IP, réessayez plus tard.',
  skip: () => process.env.NODE_ENV !== 'production'
});

const staticLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 200 : 999999,
  message: 'Trop de requêtes pour les fichiers statiques.',
  skip: () => process.env.NODE_ENV !== 'production'
});

app.use(compression());
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'", 
        "'unsafe-inline'",
        "'unsafe-eval'",
        "https://cdn.tailwindcss.com"
      ],
      scriptSrcAttr: ["'unsafe-inline'"],
      styleSrc: [
        "'self'", 
        "'unsafe-inline'",
        "https://fonts.googleapis.com",
        "https://cdn.tailwindcss.com"
      ],
      fontSrc: [
        "'self'",
        "https://fonts.gstatic.com"
      ],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      frameSrc: [
        "'self'",
        "https://docs.google.com",
        "https://www.youtube.com",
        "https://youtube.com",
        "https://*.wasabisys.com",
        "data:",
        "blob:"
      ],
      childSrc: [
        "'self'",
        "https://docs.google.com",
        "https://www.youtube.com",
        "https://youtube.com",
        "https://*.wasabisys.com",
        "data:",
        "blob:"
      ]
    }
  }
}));
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? true // Accepter toutes les origines en production (Render gère la sécurité)
    : ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5500'],
  credentials: true
}));
app.use(limiter);
app.use(morgan('combined', {
  stream: { write: message => logger.info(message.trim()) }
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir les fichiers statiques frontend avec rate limiting spécifique
app.use('/static', staticLimiter, express.static(path.join(__dirname, '..', 'frontend'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css; charset=utf-8');
    }
    if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'text/javascript; charset=utf-8');
    }
    if (filePath.endsWith('.mjs')) {
      res.setHeader('Content-Type', 'text/javascript; charset=utf-8');
    }
  }
}));

app.use('/api', routes);

// Route pour la page d'authentification
app.get('/auth', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'pages', 'auth.html'));
});

// Route pour la page d'accueil (optionnelle)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'pages', 'index.html'));
});

// Route pour le dashboard (redirige vers SPA)
app.get('/dashboard', (req, res) => {
  res.redirect('/home#dashboard');
});

// Route pour la page principale SPA
app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'pages', 'home.html'));
});

// Routes pour les favicons
app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'favicon.ico'));
});

app.get('/favicon.svg', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'favicon.svg'));
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route non trouvée',
    path: req.originalUrl
  });
});

app.use((error, req, res, next) => {
  logger.error(`Erreur serveur: ${error.message}`, {
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip
  });

  res.status(error.status || 500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Erreur interne du serveur' 
      : error.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: error.stack })
  });
});

// Ne démarrer le serveur que si ce fichier est exécuté directement
if (require.main === module) {
  const server = app.listen(PORT, () => {
    logger.info(`🚀 Serveur Diagana School démarré sur le port ${PORT}`);
    logger.info(`🌍 Environnement: ${process.env.NODE_ENV}`);
    logger.info(`📊 Health check: http://localhost:${PORT}/health`);
  });

  process.on('SIGTERM', () => {
    logger.info('Signal SIGTERM reçu, arrêt du serveur...');
    server.close(() => {
      logger.info('Serveur arrêté proprement');
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    logger.info('Signal SIGINT reçu, arrêt du serveur...');
    server.close(() => {
      logger.info('Serveur arrêté proprement');
      process.exit(0);
    });
  });
}

module.exports = app;