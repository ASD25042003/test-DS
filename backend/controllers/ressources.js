const RessourcesService = require('../services/ressources');
const Joi = require('joi');
const logger = require('../utils/logger');

const createRessourceSchema = Joi.object({
  titre: Joi.string().min(3).max(255).required().messages({
    'string.min': 'Le titre doit contenir au moins 3 caractères',
    'string.max': 'Le titre ne peut pas dépasser 255 caractères',
    'string.empty': 'Le titre est requis',
    'any.required': 'Le titre est requis'
  }),
  description: Joi.string().max(2000).allow(''),
  type: Joi.string().valid('document', 'media', 'video', 'lien').required().messages({
    'any.only': 'Le type doit être: document, media, video ou lien',
    'any.required': 'Le type est requis'
  }),
  contenu: Joi.object().required().messages({
    'any.required': 'Le contenu est requis'
  }),
  tags: Joi.array().items(Joi.string().max(50)).max(10),
  matiere: Joi.string().max(100).allow(''),
  niveau: Joi.string().max(50).allow(''),
  is_public: Joi.boolean().default(true)
});

const updateRessourceSchema = Joi.object({
  titre: Joi.string().min(3).max(255),
  description: Joi.string().max(2000).allow(''),
  contenu: Joi.object(),
  tags: Joi.array().items(Joi.string().max(50)).max(10),
  matiere: Joi.string().max(100).allow(''),
  niveau: Joi.string().max(50).allow(''),
  is_public: Joi.boolean()
});

const querySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(20),
  type: Joi.string().valid('document', 'media', 'video', 'lien'),
  matiere: Joi.string().max(100),
  niveau: Joi.string().max(50),
  author_id: Joi.string().uuid(),
  search: Joi.string().max(100),
  tags: Joi.string(),
  sortBy: Joi.string().valid('created_at', 'updated_at', 'likes_count', 'views_count', 'titre').default('created_at'),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc')
});

class RessourcesController {
  static async create(req, res) {
    try {
      // Parser le champ contenu si c'est un string JSON
      const bodyData = { ...req.body };
      if (typeof bodyData.contenu === 'string') {
        try {
          bodyData.contenu = JSON.parse(bodyData.contenu);
        } catch (parseError) {
          console.log('Contenu n\'est pas du JSON valide, traitement en tant qu\'objet:', bodyData.contenu);
          // Si ce n'est pas du JSON, créer un objet contenu basique
          bodyData.contenu = { raw: bodyData.contenu };
        }
      }
      
      // S'assurer qu'il y a au moins un objet contenu vide
      if (!bodyData.contenu) {
        bodyData.contenu = {};
      }
      
      // Parser les tags si c'est une string
      if (typeof bodyData.tags === 'string' && bodyData.tags.length > 0) {
        bodyData.tags = bodyData.tags.split(',').map(tag => tag.trim()).filter(Boolean);
      } else if (!bodyData.tags) {
        bodyData.tags = [];
      }
      
      // Parser le booléen is_public
      if (typeof bodyData.is_public === 'string') {
        bodyData.is_public = bodyData.is_public === 'true';
      }
      
      console.log('Données reçues côté serveur:', {
        titre: bodyData.titre,
        type: bodyData.type,
        matiere: bodyData.matiere,
        niveau: bodyData.niveau,
        contenu: bodyData.contenu,
        tags: bodyData.tags,
        hasFile: !!req.file,
        fileDetails: req.file ? {
          originalname: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
          buffer: req.file.buffer ? 'Buffer présent' : 'Buffer manquant'
        } : 'Aucun fichier',
        rawBody: req.body // Debug: voir toutes les données brutes
      });

      const { error, value } = createRessourceSchema.validate(bodyData);
      if (error) {
        return res.status(400).json({
          success: false,
          error: error.details[0].message
        });
      }

      const result = await RessourcesService.createRessource(
        value,
        req.file,
        req.user.userId
      );
      
      res.status(201).json(result);
    } catch (error) {
      logger.error('Erreur controller création ressource:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  static async getById(req, res) {
    try {
      const { id } = req.params;
      const trackView = req.query.track_view === 'true';

      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'ID de ressource requis'
        });
      }

      const result = await RessourcesService.getRessource(
        id,
        req.user?.userId,
        trackView
      );
      
      res.json(result);
    } catch (error) {
      logger.error('Erreur controller récupération ressource:', error);
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

      if (value.tags) {
        value.tags = value.tags.split(',').map(tag => tag.trim());
      }

      const result = await RessourcesService.getRessources(
        value,
        req.user?.userId
      );
      
      res.json(result);
    } catch (error) {
      logger.error('Erreur controller récupération ressources:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération des ressources'
      });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const { error, value } = updateRessourceSchema.validate(req.body);
      
      if (error) {
        return res.status(400).json({
          success: false,
          error: error.details[0].message
        });
      }

      const result = await RessourcesService.updateRessource(
        id,
        value,
        req.file,
        req.user.userId
      );
      
      res.json(result);
    } catch (error) {
      logger.error('Erreur controller mise à jour ressource:', error);
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

      const result = await RessourcesService.deleteRessource(id, req.user.userId);
      
      res.json(result);
    } catch (error) {
      logger.error('Erreur controller suppression ressource:', error);
      const status = error.message.includes('non trouvée') ? 404 :
                   error.message.includes('Permissions') ? 403 : 400;
      
      res.status(status).json({
        success: false,
        error: error.message
      });
    }
  }

  static async toggleLike(req, res) {
    try {
      const { id } = req.params;

      const result = await RessourcesService.toggleLike(id, req.user.userId);
      
      res.json(result);
    } catch (error) {
      logger.error('Erreur controller toggle like:', error);
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

  static async toggleFavorite(req, res) {
    try {
      const { id } = req.params;

      const result = await RessourcesService.toggleFavorite(id, req.user.userId);
      
      res.json(result);
    } catch (error) {
      logger.error('Erreur controller toggle favori:', error);
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

  static async getFavorites(req, res) {
    try {
      const { page = 1, limit = 20 } = req.query;

      const result = await RessourcesService.getUserFavorites(req.user.userId, {
        page: parseInt(page),
        limit: parseInt(limit)
      });
      
      res.json(result);
    } catch (error) {
      logger.error('Erreur controller récupération favoris:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération des favoris'
      });
    }
  }

  static async search(req, res) {
    try {
      const { q: searchTerm } = req.query;

      if (!searchTerm || searchTerm.trim().length < 2) {
        return res.status(400).json({
          success: false,
          error: 'Terme de recherche requis (minimum 2 caractères)'
        });
      }

      const result = await RessourcesService.searchRessources(searchTerm.trim());
      
      res.json(result);
    } catch (error) {
      logger.error('Erreur controller recherche ressources:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la recherche'
      });
    }
  }

  static async getPopular(req, res) {
    try {
      const { limit = 10 } = req.query;

      const result = await RessourcesService.getPopularRessources(parseInt(limit));
      
      res.json(result);
    } catch (error) {
      logger.error('Erreur controller ressources populaires:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération des ressources populaires'
      });
    }
  }

  static async getRecent(req, res) {
    try {
      const { limit = 10 } = req.query;

      const result = await RessourcesService.getRecentRessources(parseInt(limit));
      
      res.json(result);
    } catch (error) {
      logger.error('Erreur controller ressources récentes:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération des ressources récentes'
      });
    }
  }

  static async download(req, res) {
    try {
      const { id } = req.params;

      const result = await RessourcesService.downloadRessource(id, req.user?.userId);
      
      res.json(result);
    } catch (error) {
      logger.error('Erreur controller téléchargement:', error);
      res.status(404).json({
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

      if (value.tags) {
        value.tags = value.tags.split(',').map(tag => tag.trim());
      }

      const result = await RessourcesService.getMyRessources(req.user.userId, value);
      
      res.json(result);
    } catch (error) {
      logger.error('Erreur controller mes ressources:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération de vos ressources'
      });
    }
  }

  // Incrémenter le compteur de vues
  static async incrementView(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: 'ID de ressource requis'
        });
      }

      const result = await RessourcesService.incrementView(id);

      if (!result.success) {
        return res.status(404).json({
          success: false,
          error: result.error || 'Ressource non trouvée'
        });
      }

      logger.info(`Vue incrémentée pour ressource ${id}`);

      res.json({
        success: true,
        message: 'Vue incrémentée avec succès',
        vues: result.vues
      });

    } catch (error) {
      logger.error('Erreur controller increment view:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de l\'incrémentation des vues'
      });
    }
  }
}

module.exports = RessourcesController;