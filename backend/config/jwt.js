const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

if (!JWT_SECRET) {
  logger.error('JWT_SECRET manquant dans les variables d\'environnement');
  throw new Error('JWT_SECRET manquant');
}

const generateToken = (payload) => {
  try {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
      issuer: 'diagana-school',
      audience: 'diagana-school-users'
    });
  } catch (error) {
    logger.error('Erreur génération token JWT:', error);
    throw new Error('Erreur génération token');
  }
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET, {
      issuer: 'diagana-school',
      audience: 'diagana-school-users'
    });
  } catch (error) {
    logger.error('Erreur vérification token JWT:', error);
    
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token expiré');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Token invalide');
    } else {
      throw new Error('Erreur vérification token');
    }
  }
};

const refreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, { ignoreExpiration: true });
    delete decoded.iat;
    delete decoded.exp;
    delete decoded.aud; // Supprimer l'audience existante
    delete decoded.iss; // Supprimer l'issuer existant
    
    return generateToken(decoded);
  } catch (error) {
    logger.error('Erreur refresh token JWT:', error);
    throw new Error('Impossible de rafraîchir le token');
  }
};

module.exports = {
  generateToken,
  verifyToken,
  refreshToken
};