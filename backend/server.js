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

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Trop de requêtes depuis cette IP, réessayez plus tard.'
});

app.use(compression());
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://diagana-school.com'] 
    : ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5500'],
  credentials: true
}));
app.use(limiter);
app.use(morgan('combined', {
  stream: { write: message => logger.info(message.trim()) }
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api', routes);

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