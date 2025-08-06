const CommentairesModel = require('../models/commentaires');
const RessourcesModel = require('../models/ressources');
const logger = require('../utils/logger');

class CommentairesService {
  static async createComment(commentData, userId) {
    try {
      const ressource = await RessourcesModel.findById(commentData.ressource_id, userId);
      
      if (!ressource) {
        throw new Error('Ressource non trouvée ou non accessible');
      }

      if (commentData.parent_id) {
        const parentComment = await CommentairesModel.findById(commentData.parent_id);
        if (!parentComment || parentComment.ressource_id !== commentData.ressource_id) {
          throw new Error('Commentaire parent invalide');
        }
      }

      const newComment = await CommentairesModel.create({
        ressource_id: commentData.ressource_id,
        author_id: userId,
        contenu: commentData.contenu,
        parent_id: commentData.parent_id || null
      });

      logger.info(`Nouveau commentaire créé: ${newComment.id} par ${userId}`);

      return {
        success: true,
        commentaire: newComment
      };
    } catch (error) {
      logger.error('Erreur service création commentaire:', error);
      throw error;
    }
  }

  static async getCommentsByRessource(ressourceId, options = {}, userId = null) {
    try {
      const ressource = await RessourcesModel.findById(ressourceId, userId);
      
      if (!ressource) {
        throw new Error('Ressource non trouvée ou non accessible');
      }

      const result = await CommentairesModel.findByRessource(ressourceId, options);

      return {
        success: true,
        ressource: {
          id: ressource.id,
          titre: ressource.titre
        },
        ...result
      };
    } catch (error) {
      logger.error('Erreur service récupération commentaires:', error);
      throw error;
    }
  }

  static async updateComment(id, updates, userId) {
    try {
      const existingComment = await CommentairesModel.findById(id);
      
      if (!existingComment) {
        throw new Error('Commentaire non trouvé');
      }

      if (existingComment.author_id !== userId) {
        throw new Error('Permissions insuffisantes');
      }

      if (!updates.contenu || updates.contenu.trim().length === 0) {
        throw new Error('Le contenu du commentaire ne peut pas être vide');
      }

      const updatedComment = await CommentairesModel.update(id, updates, userId);

      logger.info(`Commentaire mis à jour: ${id} par ${userId}`);

      return {
        success: true,
        commentaire: updatedComment
      };
    } catch (error) {
      logger.error('Erreur service mise à jour commentaire:', error);
      throw error;
    }
  }

  static async deleteComment(id, userId) {
    try {
      const comment = await CommentairesModel.findById(id);
      
      if (!comment) {
        throw new Error('Commentaire non trouvé');
      }

      if (comment.author_id !== userId) {
        throw new Error('Permissions insuffisantes');
      }

      await CommentairesModel.delete(id, userId);

      logger.info(`Commentaire supprimé: ${id} par ${userId}`);

      return {
        success: true,
        message: 'Commentaire supprimé avec succès'
      };
    } catch (error) {
      logger.error('Erreur service suppression commentaire:', error);
      throw error;
    }
  }
}

module.exports = CommentairesService;