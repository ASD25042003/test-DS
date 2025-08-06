const CommentairesService = require('../services/commentaires');
const Joi = require('joi');
const logger = require('../utils/logger');

const createCommentSchema = Joi.object({
  ressource_id: Joi.string().uuid().required().messages({
    'string.guid': 'ID de ressource invalide',
    'any.required': 'ID de ressource requis'
  }),
  contenu: Joi.string().min(1).max(1000).required().messages({
    'string.min': 'Le commentaire ne peut pas être vide',
    'string.max': 'Le commentaire ne peut pas dépasser 1000 caractères',
    'any.required': 'Le contenu du commentaire est requis'
  }),
  parent_id: Joi.string().uuid().allow(null)
});

const updateCommentSchema = Joi.object({
  contenu: Joi.string().min(1).max(1000).required().messages({
    'string.min': 'Le commentaire ne peut pas être vide',
    'string.max': 'Le commentaire ne peut pas dépasser 1000 caractères',
    'any.required': 'Le contenu du commentaire est requis'
  })
});

const querySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(20)
});

class CommentairesController {
  static async create(req, res) {
    try {
      const { error, value } = createCommentSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          error: error.details[0].message
        });
      }

      const result = await CommentairesService.createComment(value, req.user.userId);
      
      res.status(201).json(result);
    } catch (error) {
      logger.error('Erreur controller création commentaire:', error);
      const status = error.message.includes('non trouvée') ? 404 : 400;
      
      res.status(status).json({
        success: false,
        error: error.message
      });
    }
  }

  static async getByRessource(req, res) {
    try {
      const { ressourceId } = req.params;
      const { error, value } = querySchema.validate(req.query);
      
      if (error) {
        return res.status(400).json({
          success: false,
          error: error.details[0].message
        });
      }

      if (!ressourceId) {
        return res.status(400).json({
          success: false,
          error: 'ID de ressource requis'
        });
      }

      const result = await CommentairesService.getCommentsByRessource(
        ressourceId,
        value,
        req.user?.userId
      );
      
      res.json(result);
    } catch (error) {
      logger.error('Erreur controller récupération commentaires:', error);
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const { error, value } = updateCommentSchema.validate(req.body);
      
      if (error) {
        return res.status(400).json({
          success: false,
          error: error.details[0].message
        });
      }

      const result = await CommentairesService.updateComment(id, value, req.user.userId);
      
      res.json(result);
    } catch (error) {
      logger.error('Erreur controller mise à jour commentaire:', error);
      const status = error.message.includes('non trouvé') ? 404 :
                   error.message.includes('Permissions') ? 403 : 400;
      
      res.status(status).json({
        success: false,
        error: error.message
      });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;

      const result = await CommentairesService.deleteComment(id, req.user.userId);
      
      res.json(result);
    } catch (error) {
      logger.error('Erreur controller suppression commentaire:', error);
      const status = error.message.includes('non trouvé') ? 404 :
                   error.message.includes('Permissions') ? 403 : 400;
      
      res.status(status).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = CommentairesController;