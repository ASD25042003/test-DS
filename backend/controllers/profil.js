const ProfilService = require('../services/profil');
const Joi = require('joi');
const logger = require('../utils/logger');

const querySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(20),
  type: Joi.string().valid('document', 'media', 'video', 'lien'),
  matiere: Joi.string().max(100),
  role: Joi.string().valid('professeur', 'eleve')
});

const searchSchema = Joi.object({
  q: Joi.string().min(2).max(100),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(20),
  role: Joi.string().valid('professeur', 'eleve')
});

class ProfilController {
  static async getProfile(req, res) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'ID utilisateur requis'
        });
      }

      const result = await ProfilService.getUserProfile(userId, req.user?.userId);
      
      res.json(result);
    } catch (error) {
      logger.error('Erreur controller profil:', error);
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

  static async getUserRessources(req, res) {
    try {
      const { userId } = req.params;
      const { error, value } = querySchema.validate(req.query);
      
      if (error) {
        return res.status(400).json({
          success: false,
          error: error.details[0].message
        });
      }

      const result = await ProfilService.getUserRessources(
        userId, 
        value, 
        req.user?.userId
      );
      
      res.json(result);
    } catch (error) {
      logger.error('Erreur controller ressources utilisateur:', error);
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

  static async getUserCollections(req, res) {
    try {
      const { userId } = req.params;
      const { error, value } = querySchema.validate(req.query);
      
      if (error) {
        return res.status(400).json({
          success: false,
          error: error.details[0].message
        });
      }

      const result = await ProfilService.getUserCollections(
        userId, 
        value, 
        req.user?.userId
      );
      
      res.json(result);
    } catch (error) {
      logger.error('Erreur controller collections utilisateur:', error);
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

  static async followUser(req, res) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'ID utilisateur requis'
        });
      }

      if (userId === req.user.userId) {
        return res.status(400).json({
          success: false,
          error: 'Impossible de se suivre soi-même'
        });
      }

      const result = await ProfilService.followUser(req.user.userId, userId);
      
      res.json(result);
    } catch (error) {
      logger.error('Erreur controller suivi utilisateur:', error);
      const status = error.message.includes('non trouvé') ? 404 :
                   error.message.includes('déjà') ? 409 : 400;
      
      res.status(status).json({
        success: false,
        error: error.message
      });
    }
  }

  static async unfollowUser(req, res) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: 'ID utilisateur requis'
        });
      }

      const result = await ProfilService.unfollowUser(req.user.userId, userId);
      
      res.json(result);
    } catch (error) {
      logger.error('Erreur controller arrêt suivi utilisateur:', error);
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

  static async getFollowers(req, res) {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 20 } = req.query;

      const result = await ProfilService.getFollowers(userId, {
        page: parseInt(page),
        limit: parseInt(limit)
      });
      
      res.json(result);
    } catch (error) {
      logger.error('Erreur controller followers:', error);
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

  static async getFollowing(req, res) {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 20 } = req.query;

      const result = await ProfilService.getFollowing(userId, {
        page: parseInt(page),
        limit: parseInt(limit)
      });
      
      res.json(result);
    } catch (error) {
      logger.error('Erreur controller following:', error);
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

  static async getUserActivity(req, res) {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 20 } = req.query;

      const result = await ProfilService.getUserActivity(
        userId, 
        {
          page: parseInt(page),
          limit: parseInt(limit)
        },
        req.user?.userId
      );
      
      res.json(result);
    } catch (error) {
      logger.error('Erreur controller activité utilisateur:', error);
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

  static async searchUsers(req, res) {
    try {
      const { error, value } = searchSchema.validate(req.query);
      
      if (error) {
        return res.status(400).json({
          success: false,
          error: error.details[0].message
        });
      }

      const result = await ProfilService.searchUsers(value.q, {
        page: value.page,
        limit: value.limit,
        role: value.role
      });
      
      res.json(result);
    } catch (error) {
      logger.error('Erreur controller recherche utilisateurs:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  static async getAllUsers(req, res) {
    try {
      const { error, value } = querySchema.validate(req.query);
      
      if (error) {
        return res.status(400).json({
          success: false,
          error: error.details[0].message
        });
      }

      const result = await ProfilService.getAllUsers(value);
      
      res.json(result);
    } catch (error) {
      logger.error('Erreur controller tous les utilisateurs:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération des utilisateurs'
      });
    }
  }

  static async getUsersByRole(req, res) {
    try {
      const { role } = req.params;
      const { error, value } = querySchema.validate(req.query);
      
      if (error) {
        return res.status(400).json({
          success: false,
          error: error.details[0].message
        });
      }

      if (!['professeur', 'eleve'].includes(role)) {
        return res.status(400).json({
          success: false,
          error: 'Rôle invalide (professeur ou eleve attendu)'
        });
      }

      const result = await ProfilService.getUsersByRole(role, value);
      
      res.json(result);
    } catch (error) {
      logger.error('Erreur controller utilisateurs par rôle:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération des utilisateurs'
      });
    }
  }
}

module.exports = ProfilController;