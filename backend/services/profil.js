const ProfilModel = require('../models/profil');
const { supabaseAdmin } = require('../config/supabase');
const logger = require('../utils/logger');

class ProfilService {
  static async getUserProfile(userId, viewerId = null) {
    try {
      const profile = await ProfilModel.findUserProfile(userId, viewerId);
      
      if (!profile) {
        throw new Error('Utilisateur non trouvé');
      }

      const stats = await ProfilModel.getUserStats(userId);

      return {
        success: true,
        profile: {
          ...profile,
          stats
        }
      };
    } catch (error) {
      logger.error('Erreur service profil utilisateur:', error);
      throw error;
    }
  }

  static async getUserRessources(userId, options = {}, viewerId = null) {
    try {
      const profile = await ProfilModel.findUserProfile(userId, viewerId);
      
      if (!profile) {
        throw new Error('Utilisateur non trouvé');
      }

      const result = await ProfilModel.getUserRessources(userId, {
        ...options,
        viewerId
      });

      return {
        success: true,
        user: {
          id: profile.id,
          nom: profile.nom,
          prenom: profile.prenom,
          role: profile.role,
          avatar_url: profile.avatar_url
        },
        ...result
      };
    } catch (error) {
      logger.error('Erreur service ressources utilisateur:', error);
      throw error;
    }
  }

  static async getUserCollections(userId, options = {}, viewerId = null) {
    try {
      const profile = await ProfilModel.findUserProfile(userId, viewerId);
      
      if (!profile) {
        throw new Error('Utilisateur non trouvé');
      }

      const result = await ProfilModel.getUserCollections(userId, {
        ...options,
        viewerId
      });

      return {
        success: true,
        user: {
          id: profile.id,
          nom: profile.nom,
          prenom: profile.prenom,
          role: profile.role,
          avatar_url: profile.avatar_url
        },
        ...result
      };
    } catch (error) {
      logger.error('Erreur service collections utilisateur:', error);
      throw error;
    }
  }

  static async followUser(followerId, followingId) {
    try {
      const targetUser = await ProfilModel.findUserProfile(followingId);
      
      if (!targetUser) {
        throw new Error('Utilisateur à suivre non trouvé');
      }

      await ProfilModel.followUser(followerId, followingId);

      logger.info(`Utilisateur ${followerId} suit maintenant ${followingId}`);

      return {
        success: true,
        message: `Vous suivez maintenant ${targetUser.nom} ${targetUser.prenom}`,
        following: true
      };
    } catch (error) {
      logger.error('Erreur service suivi utilisateur:', error);
      throw error;
    }
  }

  static async unfollowUser(followerId, followingId) {
    try {
      const targetUser = await ProfilModel.findUserProfile(followingId);
      
      if (!targetUser) {
        throw new Error('Utilisateur non trouvé');
      }

      // Vérifier si l'utilisateur suit réellement la cible
      const { data: existingFollow } = await supabaseAdmin
        .from('follows')
        .select('id')
        .eq('follower_id', followerId)
        .eq('following_id', followingId)
        .single();

      if (!existingFollow) {
        throw new Error('Vous ne suivez pas cet utilisateur');
      }

      await ProfilModel.unfollowUser(followerId, followingId);

      logger.info(`Utilisateur ${followerId} ne suit plus ${followingId}`);

      return {
        success: true,
        message: `Vous ne suivez plus ${targetUser.nom} ${targetUser.prenom}`,
        following: false
      };
    } catch (error) {
      logger.error('Erreur service arrêt suivi utilisateur:', error);
      throw error;
    }
  }

  static async getFollowers(userId, options = {}) {
    try {
      const profile = await ProfilModel.findUserProfile(userId);
      
      if (!profile) {
        throw new Error('Utilisateur non trouvé');
      }

      const result = await ProfilModel.getFollowers(userId, options);

      return {
        success: true,
        user: {
          id: profile.id,
          nom: profile.nom,
          prenom: profile.prenom,
          role: profile.role,
          avatar_url: profile.avatar_url
        },
        ...result
      };
    } catch (error) {
      logger.error('Erreur service followers:', error);
      throw error;
    }
  }

  static async getFollowing(userId, options = {}) {
    try {
      const profile = await ProfilModel.findUserProfile(userId);
      
      if (!profile) {
        throw new Error('Utilisateur non trouvé');
      }

      const result = await ProfilModel.getFollowing(userId, options);

      return {
        success: true,
        user: {
          id: profile.id,
          nom: profile.nom,
          prenom: profile.prenom,
          role: profile.role,
          avatar_url: profile.avatar_url
        },
        ...result
      };
    } catch (error) {
      logger.error('Erreur service following:', error);
      throw error;
    }
  }

  static async searchUsers(searchTerm, options = {}) {
    try {
      if (searchTerm && searchTerm.trim().length < 2) {
        throw new Error('Le terme de recherche doit contenir au moins 2 caractères');
      }

      const result = await ProfilModel.searchUsers(searchTerm?.trim(), options);

      return {
        success: true,
        search_term: searchTerm?.trim() || '',
        ...result
      };
    } catch (error) {
      logger.error('Erreur service recherche utilisateurs:', error);
      throw error;
    }
  }

  static async getUserActivity(userId, options = {}, viewerId = null) {
    try {
      const profile = await ProfilModel.findUserProfile(userId, viewerId);
      
      if (!profile) {
        throw new Error('Utilisateur non trouvé');
      }

      if (!profile.is_own_profile && viewerId !== userId) {
        return {
          success: true,
          user: {
            id: profile.id,
            nom: profile.nom,
            prenom: profile.prenom,
            role: profile.role,
            avatar_url: profile.avatar_url
          },
          activities: [],
          pagination: {
            page: 1,
            limit: 20,
            total: 0,
            pages: 0
          },
          message: 'L\'activité de cet utilisateur n\'est pas publique'
        };
      }

      const result = await ProfilModel.getActivity(userId, options);

      return {
        success: true,
        user: {
          id: profile.id,
          nom: profile.nom,
          prenom: profile.prenom,
          role: profile.role,
          avatar_url: profile.avatar_url
        },
        ...result
      };
    } catch (error) {
      logger.error('Erreur service activité utilisateur:', error);
      throw error;
    }
  }

  static async getAllUsers(options = {}) {
    try {
      const result = await ProfilModel.searchUsers('', options);

      return {
        success: true,
        ...result
      };
    } catch (error) {
      logger.error('Erreur service tous les utilisateurs:', error);
      throw error;
    }
  }

  static async getUsersByRole(role, options = {}) {
    try {
      const validRoles = ['professeur', 'eleve'];
      if (!validRoles.includes(role)) {
        throw new Error('Rôle invalide');
      }

      const result = await ProfilModel.searchUsers('', {
        ...options,
        role
      });

      return {
        success: true,
        role,
        ...result
      };
    } catch (error) {
      logger.error('Erreur service utilisateurs par rôle:', error);
      throw error;
    }
  }
}

module.exports = ProfilService;