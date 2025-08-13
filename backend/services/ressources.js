const RessourcesModel = require('../models/ressources');
const { uploadFile, deleteFile } = require('../config/wasabi');
const { generateFileName } = require('../config/multer');
const logger = require('../utils/logger');

class RessourcesService {
  static async createRessource(ressourceData, file = null, userId) {
    try {
      let contenu = ressourceData.contenu;

      // Traiter l'upload de fichier pour les types document, media et video
      if (file && ['document', 'media', 'video'].includes(ressourceData.type)) {
        const fileName = generateFileName(file.originalname, userId);
        const uploadResult = await uploadFile(file, fileName);
        
        if (!uploadResult.success) {
          throw new Error('Erreur lors de l\'upload du fichier');
        }

        contenu = {
          ...contenu,
          file_url: uploadResult.url,
          file_key: uploadResult.key,
          file_name: file.originalname,
          file_size: file.size,
          file_type: file.mimetype
        };
      }

      const newRessource = await RessourcesModel.create({
        titre: ressourceData.titre,
        description: ressourceData.description,
        type: ressourceData.type,
        contenu: contenu,
        tags: ressourceData.tags || [],
        matiere: ressourceData.matiere,
        niveau: ressourceData.niveau,
        author_id: userId,
        is_public: ressourceData.is_public !== false
      });

      logger.info(`Nouvelle ressource créée: ${newRessource.id} par ${userId}`);

      return {
        success: true,
        data: newRessource
      };
    } catch (error) {
      logger.error('Erreur service création ressource:', error);
      throw error;
    }
  }

  static async getRessource(id, userId = null, trackView = false) {
    try {
      const ressource = await RessourcesModel.findById(id, userId);
      
      if (!ressource) {
        throw new Error('Ressource non trouvée');
      }

      if (trackView && ressource.author_id !== userId) {
        await RessourcesModel.incrementViews(id, { userId });
      }

      return {
        success: true,
        ressource
      };
    } catch (error) {
      logger.error('Erreur service récupération ressource:', error);
      throw error;
    }
  }

  static async getRessources(options = {}, userId = null) {
    try {
      const result = await RessourcesModel.findAll({
        ...options,
        userId
      });

      return {
        success: true,
        ...result
      };
    } catch (error) {
      logger.error('Erreur service récupération ressources:', error);
      throw error;
    }
  }

  static async updateRessource(id, updates, file = null, userId) {
    try {
      const existingRessource = await RessourcesModel.findById(id, userId);
      
      if (!existingRessource) {
        throw new Error('Ressource non trouvée');
      }

      if (existingRessource.author_id !== userId) {
        throw new Error('Permissions insuffisantes');
      }

      let contenu = updates.contenu || existingRessource.contenu;

      // Traiter l'upload de fichier pour les types document, media et video lors de la mise à jour
      const resourceType = updates.type || existingRessource.type;
      if (file && ['document', 'media', 'video'].includes(resourceType)) {
        // Supprimer l'ancien fichier s'il existe
        if (existingRessource.contenu?.file_key) {
          await deleteFile(existingRessource.contenu.file_key);
        }

        const fileName = generateFileName(file.originalname, userId);
        const uploadResult = await uploadFile(file, fileName);
        
        if (!uploadResult.success) {
          throw new Error('Erreur lors de l\'upload du fichier');
        }

        contenu = {
          ...contenu,
          file_url: uploadResult.url,
          file_key: uploadResult.key,
          file_name: file.originalname,
          file_size: file.size,
          file_type: file.mimetype
        };
      }

      const allowedUpdates = ['titre', 'description', 'tags', 'matiere', 'niveau', 'is_public'];
      const filteredUpdates = {};

      Object.keys(updates).forEach(key => {
        if (allowedUpdates.includes(key) && updates[key] !== undefined) {
          filteredUpdates[key] = updates[key];
        }
      });

      filteredUpdates.contenu = contenu;

      const updatedRessource = await RessourcesModel.update(id, filteredUpdates, userId);

      logger.info(`Ressource mise à jour: ${id} par ${userId}`);

      return {
        success: true,
        data: updatedRessource
      };
    } catch (error) {
      logger.error('Erreur service mise à jour ressource:', error);
      throw error;
    }
  }

  static async deleteRessource(id, userId) {
    try {
      const ressource = await RessourcesModel.findById(id, userId);
      
      if (!ressource) {
        throw new Error('Ressource non trouvée');
      }

      if (ressource.author_id !== userId) {
        throw new Error('Permissions insuffisantes');
      }

      if (ressource.contenu?.file_key) {
        await deleteFile(ressource.contenu.file_key);
      }

      await RessourcesModel.delete(id, userId);

      logger.info(`Ressource supprimée: ${id} par ${userId}`);

      return {
        success: true,
        message: 'Ressource supprimée avec succès'
      };
    } catch (error) {
      logger.error('Erreur service suppression ressource:', error);
      throw error;
    }
  }

  static async toggleLike(ressourceId, userId) {
    try {
      const ressource = await RessourcesModel.findById(ressourceId, userId);
      
      if (!ressource) {
        throw new Error('Ressource non trouvée');
      }

      const result = await RessourcesModel.toggleLike(ressourceId, userId);

      logger.info(`Like ${result.liked ? 'ajouté' : 'retiré'}: ressource ${ressourceId} par ${userId}`);

      return {
        success: true,
        liked: result.liked,
        message: result.liked ? 'Ressource likée' : 'Like retiré'
      };
    } catch (error) {
      logger.error('Erreur service toggle like:', error);
      throw error;
    }
  }

  static async toggleFavorite(ressourceId, userId) {
    try {
      const ressource = await RessourcesModel.findById(ressourceId, userId);
      
      if (!ressource) {
        throw new Error('Ressource non trouvée');
      }

      const result = await RessourcesModel.toggleFavorite(ressourceId, userId);

      logger.info(`Favori ${result.favorited ? 'ajouté' : 'retiré'}: ressource ${ressourceId} par ${userId}`);

      return {
        success: true,
        favorited: result.favorited,
        message: result.favorited ? 'Ressource ajoutée aux favoris' : 'Ressource retirée des favoris'
      };
    } catch (error) {
      logger.error('Erreur service toggle favori:', error);
      throw error;
    }
  }

  static async getUserFavorites(userId, options = {}) {
    try {
      const result = await RessourcesModel.getUserFavorites(userId, options);

      return {
        success: true,
        ...result
      };
    } catch (error) {
      logger.error('Erreur service récupération favoris:', error);
      throw error;
    }
  }

  static async searchRessources(searchTerm, options = {}) {
    try {
      const ressources = await RessourcesModel.search(searchTerm, options);

      return {
        success: true,
        ressources,
        search_term: searchTerm
      };
    } catch (error) {
      logger.error('Erreur service recherche ressources:', error);
      throw error;
    }
  }

  static async getPopularRessources(limit = 10) {
    try {
      const ressources = await RessourcesModel.getPopular(limit);

      return {
        success: true,
        ressources
      };
    } catch (error) {
      logger.error('Erreur service ressources populaires:', error);
      throw error;
    }
  }

  static async getRecentRessources(limit = 10) {
    try {
      const ressources = await RessourcesModel.getRecent(limit);

      return {
        success: true,
        ressources
      };
    } catch (error) {
      logger.error('Erreur service ressources récentes:', error);
      throw error;
    }
  }

  static async downloadRessource(id, userId = null) {
    try {
      const ressource = await RessourcesModel.findById(id, userId);
      
      if (!ressource) {
        throw new Error('Ressource non trouvée');
      }

      // Autoriser le téléchargement pour les types document, media et video qui ont un fichier
      const downloadableTypes = ['document', 'media', 'video'];
      if (!downloadableTypes.includes(ressource.type) || !ressource.contenu?.file_url) {
        throw new Error('Cette ressource n\'est pas téléchargeable');
      }

      await RessourcesModel.incrementDownloads(id);

      return {
        success: true,
        download_url: ressource.contenu.file_url,
        filename: ressource.contenu.file_name || ressource.titre
      };
    } catch (error) {
      logger.error('Erreur service téléchargement ressource:', error);
      throw error;
    }
  }

  static async getMyRessources(userId, options = {}) {
    try {
      const result = await RessourcesModel.findAll({
        ...options,
        author_id: userId,
        userId
      });

      return {
        success: true,
        ...result
      };
    } catch (error) {
      logger.error('Erreur service mes ressources:', error);
      throw error;
    }
  }

  static async incrementView(ressourceId) {
    try {
      const updatedRessource = await RessourcesModel.incrementViews(ressourceId);

      if (!updatedRessource) {
        return {
          success: false,
          error: 'Erreur lors de la mise à jour'
        };
      }

      logger.info(`Vues incrémentées pour ressource ${ressourceId}: ${updatedRessource.views_count}`);

      return {
        success: true,
        vues: updatedRessource.views_count
      };
    } catch (error) {
      logger.error('Erreur service increment view:', error);
      throw error;
    }
  }
}

module.exports = RessourcesService;