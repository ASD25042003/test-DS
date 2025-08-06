const CollectionsModel = require('../models/collections');
const logger = require('../utils/logger');

class CollectionsService {
  static async createCollection(collectionData, userId) {
    try {
      const newCollection = await CollectionsModel.create({
        nom: collectionData.nom,
        description: collectionData.description,
        is_public: collectionData.is_public !== false,
        author_id: userId
      });

      logger.info(`Nouvelle collection créée: ${newCollection.id} par ${userId}`);

      return {
        success: true,
        collection: newCollection
      };
    } catch (error) {
      logger.error('Erreur service création collection:', error);
      throw error;
    }
  }

  static async getCollection(id, userId = null) {
    try {
      const collection = await CollectionsModel.findById(id, userId);
      
      if (!collection) {
        throw new Error('Collection non trouvée');
      }

      return {
        success: true,
        collection
      };
    } catch (error) {
      logger.error('Erreur service récupération collection:', error);
      throw error;
    }
  }

  static async getCollections(options = {}, userId = null) {
    try {
      const result = await CollectionsModel.findAll({
        ...options,
        userId
      });

      return {
        success: true,
        ...result
      };
    } catch (error) {
      logger.error('Erreur service récupération collections:', error);
      throw error;
    }
  }

  static async updateCollection(id, updates, userId) {
    try {
      const existingCollection = await CollectionsModel.findById(id, userId);
      
      if (!existingCollection) {
        throw new Error('Collection non trouvée');
      }

      if (existingCollection.author_id !== userId) {
        throw new Error('Permissions insuffisantes');
      }

      const allowedUpdates = ['nom', 'description', 'is_public'];
      const filteredUpdates = {};

      Object.keys(updates).forEach(key => {
        if (allowedUpdates.includes(key) && updates[key] !== undefined) {
          filteredUpdates[key] = updates[key];
        }
      });

      if (Object.keys(filteredUpdates).length === 0) {
        throw new Error('Aucune donnée valide à mettre à jour');
      }

      const updatedCollection = await CollectionsModel.update(id, filteredUpdates, userId);

      logger.info(`Collection mise à jour: ${id} par ${userId}`);

      return {
        success: true,
        collection: updatedCollection
      };
    } catch (error) {
      logger.error('Erreur service mise à jour collection:', error);
      throw error;
    }
  }

  static async deleteCollection(id, userId) {
    try {
      const collection = await CollectionsModel.findById(id, userId);
      
      if (!collection) {
        throw new Error('Collection non trouvée');
      }

      if (collection.author_id !== userId) {
        throw new Error('Permissions insuffisantes');
      }

      await CollectionsModel.delete(id, userId);

      logger.info(`Collection supprimée: ${id} par ${userId}`);

      return {
        success: true,
        message: 'Collection supprimée avec succès'
      };
    } catch (error) {
      logger.error('Erreur service suppression collection:', error);
      throw error;
    }
  }

  static async addRessourceToCollection(collectionId, ressourceId, userId, ordre = null) {
    try {
      const collection = await CollectionsModel.findById(collectionId, userId);
      
      if (!collection) {
        throw new Error('Collection non trouvée');
      }

      if (collection.author_id !== userId) {
        throw new Error('Permissions insuffisantes');
      }

      const hasAccess = await CollectionsModel.validateRessourceAccess(ressourceId, userId);
      if (!hasAccess) {
        throw new Error('Ressource non trouvée ou non accessible');
      }

      const finalOrdre = ordre !== null ? ordre : collection.ressources_count;

      await CollectionsModel.addRessource(collectionId, ressourceId, finalOrdre);

      logger.info(`Ressource ${ressourceId} ajoutée à collection ${collectionId} par ${userId}`);

      return {
        success: true,
        message: 'Ressource ajoutée à la collection'
      };
    } catch (error) {
      logger.error('Erreur service ajout ressource à collection:', error);
      throw error;
    }
  }

  static async removeRessourceFromCollection(collectionId, ressourceId, userId) {
    try {
      await CollectionsModel.removeRessource(collectionId, ressourceId, userId);

      logger.info(`Ressource ${ressourceId} supprimée de collection ${collectionId} par ${userId}`);

      return {
        success: true,
        message: 'Ressource supprimée de la collection'
      };
    } catch (error) {
      logger.error('Erreur service suppression ressource de collection:', error);
      throw error;
    }
  }

  static async reorderCollectionRessources(collectionId, ressourceOrders, userId) {
    try {
      if (!Array.isArray(ressourceOrders) || ressourceOrders.length === 0) {
        throw new Error('Liste d\'ordre des ressources requise');
      }

      for (const item of ressourceOrders) {
        if (!item.ressource_id || typeof item.ordre !== 'number') {
          throw new Error('Format d\'ordre invalide');
        }
      }

      await CollectionsModel.reorderRessources(collectionId, ressourceOrders, userId);

      logger.info(`Ressources réorganisées dans collection ${collectionId} par ${userId}`);

      return {
        success: true,
        message: 'Ordre des ressources mis à jour'
      };
    } catch (error) {
      logger.error('Erreur service réorganisation collection:', error);
      throw error;
    }
  }

  static async getCollectionsByRessource(ressourceId) {
    try {
      const collections = await CollectionsModel.getCollectionsByRessource(ressourceId);

      return {
        success: true,
        collections
      };
    } catch (error) {
      logger.error('Erreur service collections par ressource:', error);
      throw error;
    }
  }

  static async getPopularCollections(limit = 10) {
    try {
      const collections = await CollectionsModel.getPopular(limit);

      return {
        success: true,
        collections
      };
    } catch (error) {
      logger.error('Erreur service collections populaires:', error);
      throw error;
    }
  }

  static async getRecentCollections(limit = 10) {
    try {
      const collections = await CollectionsModel.getRecent(limit);

      return {
        success: true,
        collections
      };
    } catch (error) {
      logger.error('Erreur service collections récentes:', error);
      throw error;
    }
  }

  static async duplicateCollection(collectionId, newName, userId) {
    try {
      if (!newName || newName.trim().length < 3) {
        throw new Error('Le nom de la collection doit contenir au moins 3 caractères');
      }

      const newCollection = await CollectionsModel.duplicateCollection(
        collectionId, 
        newName.trim(), 
        userId
      );

      logger.info(`Collection ${collectionId} dupliquée vers ${newCollection.id} par ${userId}`);

      return {
        success: true,
        collection: newCollection,
        message: 'Collection dupliquée avec succès'
      };
    } catch (error) {
      logger.error('Erreur service duplication collection:', error);
      throw error;
    }
  }

  static async getMyCollections(userId, options = {}) {
    try {
      const result = await CollectionsModel.findAll({
        ...options,
        author_id: userId,
        userId
      });

      return {
        success: true,
        ...result
      };
    } catch (error) {
      logger.error('Erreur service mes collections:', error);
      throw error;
    }
  }

  static async searchCollections(searchTerm, options = {}) {
    try {
      if (!searchTerm || searchTerm.trim().length < 2) {
        throw new Error('Terme de recherche requis (minimum 2 caractères)');
      }

      const result = await CollectionsModel.findAll({
        ...options,
        search: searchTerm.trim()
      });

      return {
        success: true,
        ...result,
        search_term: searchTerm.trim()
      };
    } catch (error) {
      logger.error('Erreur service recherche collections:', error);
      throw error;
    }
  }
}

module.exports = CollectionsService;