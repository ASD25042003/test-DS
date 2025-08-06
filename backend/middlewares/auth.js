const { verifyToken } = require('../config/jwt');
const AuthModel = require('../models/auth');
const logger = require('../utils/logger');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Token d\'authentification requis'
      });
    }

    const decoded = verifyToken(token);
    
    const user = await AuthModel.findUserById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Utilisateur non trouvé'
      });
    }

    req.user = {
      userId: user.id,
      email: user.email,
      role: user.role,
      nom: user.nom,
      prenom: user.prenom
    };

    next();
  } catch (error) {
    logger.error('Erreur authentification token:', error);
    return res.status(401).json({
      success: false,
      error: 'Token invalide ou expiré'
    });
  }
};

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentification requise'
      });
    }

    const userRole = req.user.role;
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        error: 'Permissions insuffisantes',
        required: allowedRoles,
        current: userRole
      });
    }

    next();
  };
};

const requireProfesseur = requireRole(['professeur']);
const requireEleve = requireRole(['eleve']);
const requireAnyRole = requireRole(['professeur', 'eleve']);

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      try {
        const decoded = verifyToken(token);
        const user = await AuthModel.findUserById(decoded.userId);
        
        if (user) {
          req.user = {
            userId: user.id,
            email: user.email,
            role: user.role,
            nom: user.nom,
            prenom: user.prenom
          };
        }
      } catch (error) {
        logger.warn('Token optionnel invalide:', error.message);
      }
    }

    next();
  } catch (error) {
    logger.error('Erreur auth optionnelle:', error);
    next();
  }
};

const checkResourceOwnership = (resourceIdParam = 'id', authorField = 'author_id') => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Authentification requise'
        });
      }

      const resourceId = req.params[resourceIdParam];
      if (!resourceId) {
        return res.status(400).json({
          success: false,
          error: 'ID de ressource requis'
        });
      }

      req.resourceId = resourceId;
      req.authorField = authorField;
      
      next();
    } catch (error) {
      logger.error('Erreur vérification propriété:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur de vérification des permissions'
      });
    }
  };
};

const rateLimitByUser = (windowMs = 15 * 60 * 1000, maxRequests = 100) => {
  const userRequests = new Map();

  return (req, res, next) => {
    const userId = req.user?.userId || req.ip;
    const now = Date.now();
    
    if (!userRequests.has(userId)) {
      userRequests.set(userId, []);
    }

    const requests = userRequests.get(userId);
    const windowStart = now - windowMs;
    
    const recentRequests = requests.filter(time => time > windowStart);
    
    if (recentRequests.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        error: 'Trop de requêtes, réessayez plus tard',
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }

    recentRequests.push(now);
    userRequests.set(userId, recentRequests);

    const expiredUsers = [];
    for (const [id, timestamps] of userRequests.entries()) {
      if (timestamps.length === 0 || Math.max(...timestamps) < windowStart) {
        expiredUsers.push(id);
      }
    }
    expiredUsers.forEach(id => userRequests.delete(id));

    next();
  };
};

module.exports = {
  authenticateToken,
  requireRole,
  requireProfesseur,
  requireEleve,
  requireAnyRole,
  optionalAuth,
  checkResourceOwnership,
  rateLimitByUser
};