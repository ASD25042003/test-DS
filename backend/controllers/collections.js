const CollectionsService = require('../services/collections');
const Joi = require('joi');
const logger = require('../utils/logger');

const createCollectionSchema = Joi.object({
  nom: Joi.string().min(3).max(255).required().messages({
    'string.min': 'Le nom doit contenir au moins 3 caractères',
    'string.max': 'Le nom ne peut pas dépasser 255 caractères',
    'string.empty': 'Le nom est requis',
    'any.required': 'Le nom est requis'
  }),
  description: Joi.string().max(2000).allow(''),
  is_public: Joi.boolean().default(true)
});

const updateCollectionSchema = Joi.object({
  nom: Joi.string().min(3).max(255),
  description: Joi.string().max(2000).allow(''),
  is_public: Joi.boolean()
});

const querySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(20),
  author_id: Joi.string().uuid(),
  search: Joi.string().max(100),
  sortBy: Joi.string().valid('created_at', 'updated_at', 'ressources_count', 'nom').default('created_at'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc')
});

const addRessourceSchema = Joi.object({
  ressource_id: Joi.string().uuid().required().messages({
    'string.guid': 'ID de ressource invalide',
    'any.required': 'ID de ressource requis'
  }),
  ordre: Joi.number().integer().min(0).allow(null)
});

const reorderSchema = Joi.object({
  ressources: Joi.array().items(
    Joi.object({
      ressource_id: Joi.string().uuid().required(),
      ordre: Joi.number().integer().min(0).required()
    })
  ).min(1).required().messages({
    'array.min': 'Au moins une ressource requise',
    'any.required': 'Liste des ressources requise'
  })
});

const duplicateSchema = Joi.object({
  nom: Joi.string().min(3).max(255).required().messages({
    'string.min': 'Le nom doit contenir au moins 3 caractères',
    'string.max': 'Le nom ne peut pas dépasser 255 caractères',
    'string.empty': 'Le nom est requis',
    'any.required': 'Le nom est requis'
  })
});

class CollectionsController {
  static async create(req, res) {
    try {
      const { error, value } = createCollectionSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          error: error.details[0].message
        });
      }

      const result = await CollectionsService.createCollection(value, req.user.userId);
      
      res.status(201).json(result);
    } catch (error) {
      logger.error('Erreur controller création collection:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'ID de collection requis'
        });
      }

      const result = await CollectionsService.getCollection(id, req.user?.userId);
      
      res.json(result);
    } catch (error) {
      logger.error('Erreur controller récupération collection:', error);
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

  static async getAll(req, res) {
    try {
      const { error, value } = querySchema.validate(req.query);
      if (error) {
        return res.status(400).json({
          success: false,
          error: error.details[0].message
        });
      }

      const result = await CollectionsService.getCollections(value, req.user?.userId);
      
      res.json(result);
    } catch (error) {
      logger.error('Erreur controller récupération collections:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération des collections'
      });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const { error, value } = updateCollectionSchema.validate(req.body);
      
      if (error) {
        return res.status(400).json({
          success: false,
          error: error.details[0].message
        });
      }

      const result = await CollectionsService.updateCollection(id, value, req.user.userId);
      
      res.json(result);
    } catch (error) {
      logger.error('Erreur controller mise à jour collection:', error);
      const status = error.message.includes('non trouvée') ? 404 :
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

      const result = await CollectionsService.deleteCollection(id, req.user.userId);
      
      res.json(result);
    } catch (error) {
      logger.error('Erreur controller suppression collection:', error);
      const status = error.message.includes('non trouvée') ? 404 :
                   error.message.includes('Permissions') ? 403 : 400;
      
      res.status(status).json({
        success: false,
        error: error.message
      });
    }
  }

  static async addRessource(req, res) {
    try {
      const { id } = req.params;
      const { error, value } = addRessourceSchema.validate(req.body);
      
      if (error) {
        return res.status(400).json({
          success: false,
          error: error.details[0].message
        });
      }

      const result = await CollectionsService.addRessourceToCollection(
        id,
        value.ressource_id,
        req.user.userId,
        value.ordre
      );
      
      res.json(result);
    } catch (error) {
      logger.error('Erreur controller ajout ressource:', error);
      const status = error.message.includes('non trouvée') ? 404 :
                   error.message.includes('Permissions') ? 403 :
                   error.message.includes('déjà dans') ? 409 : 400;
      
      res.status(status).json({
        success: false,
        error: error.message
      });
    }
  }

  static async removeRessource(req, res) {
    try {
      const { id, ressourceId } = req.params;

      const result = await CollectionsService.removeRessourceFromCollection(
        id,
        ressourceId,
        req.user.userId
      );
      
      res.json(result);
    } catch (error) {
      logger.error('Erreur controller suppression ressource:', error);
      const status = error.message.includes('Permissions') ? 403 : 400;
      
      res.status(status).json({
        success: false,
        error: error.message
      });
    }
  }

  static async reorderRessources(req, res) {
    try {
      const { id } = req.params;
      const { error, value } = reorderSchema.validate(req.body);
      
      if (error) {
        return res.status(400).json({
          success: false,
          error: error.details[0].message
        });
      }

      const result = await CollectionsService.reorderCollectionRessources(
        id,
        value.ressources,
        req.user.userId
      );
      
      res.json(result);
    } catch (error) {
      logger.error('Erreur controller réorganisation collection:', error);
      const status = error.message.includes('Permissions') ? 403 : 400;
      
      res.status(status).json({
        success: false,
        error: error.message
      });
    }
  }

  static async getCollectionsByRessource(req, res) {
    try {
      const { ressourceId } = req.params;

      if (!ressourceId) {
        return res.status(400).json({
          success: false,
          error: 'ID de ressource requis'
        });
      }

      const result = await CollectionsService.getCollectionsByRessource(ressourceId);
      
      res.json(result);
    } catch (error) {
      logger.error('Erreur controller collections par ressource:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération des collections'
      });
    }
  }

  static async getPopular(req, res) {
    try {
      const { limit = 10 } = req.query;

      const result = await CollectionsService.getPopularCollections(parseInt(limit));
      
      res.json(result);
    } catch (error) {
      logger.error('Erreur controller collections populaires:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération des collections populaires'
      });
    }
  }

  static async getRecent(req, res) {
    try {
      const { limit = 10 } = req.query;

      const result = await CollectionsService.getRecentCollections(parseInt(limit));
      
      res.json(result);
    } catch (error) {
      logger.error('Erreur controller collections récentes:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération des collections récentes'
      });
    }
  }

  static async duplicate(req, res) {
    try {
      const { id } = req.params;
      const { error, value } = duplicateSchema.validate(req.body);
      
      if (error) {
        return res.status(400).json({
          success: false,
          error: error.details[0].message
        });
      }

      const result = await CollectionsService.duplicateCollection(
        id,
        value.nom,
        req.user.userId
      );
      
      res.status(201).json(result);
    } catch (error) {
      logger.error('Erreur controller duplication collection:', error);
      const status = error.message.includes('non trouvée') ? 404 : 400;
      
      res.status(status).json({
        success: false,
        error: error.message
      });
    }
  }

  static async getMy(req, res) {
    try {
      const { error, value } = querySchema.validate(req.query);
      if (error) {
        return res.status(400).json({
          success: false,
          error: error.details[0].message
        });
      }

      const result = await CollectionsService.getMyCollections(req.user.userId, value);
      
      res.json(result);
    } catch (error) {
      logger.error('Erreur controller mes collections:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération de vos collections'
      });
    }
  }

  static async search(req, res) {
    try {
      const { q: searchTerm, ...queryParams } = req.query;
      const { error: queryError, value: queryValue } = querySchema.validate(queryParams);
      
      if (queryError) {
        return res.status(400).json({
          success: false,
          error: queryError.details[0].message
        });
      }

      const result = await CollectionsService.searchCollections(searchTerm, queryValue);
      
      res.json(result);
    } catch (error) {
      logger.error('Erreur controller recherche collections:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = CollectionsController;