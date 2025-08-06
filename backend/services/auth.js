const AuthModel = require('../models/auth');
const { generateToken } = require('../config/jwt');
const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');

class AuthService {
  static async register(registrationData) {
    const { keyValue, email, password, nom, prenom, classe, matiere, date_naissance } = registrationData;

    try {
      const registrationKey = await AuthModel.findRegistrationKey(keyValue);
      if (!registrationKey) {
        throw new Error('Clé d\'inscription invalide ou déjà utilisée');
      }

      const existingUser = await AuthModel.findUserByEmail(email);
      if (existingUser) {
        throw new Error('Un utilisateur avec cet email existe déjà');
      }

      const authUser = await AuthModel.createAuthUser(email, password);

      const userProfile = await AuthModel.createUserProfile({
        id: authUser.id,
        email,
        nom,
        prenom,
        role: registrationKey.role,
        classe: registrationKey.role === 'eleve' ? classe : null,
        matiere: registrationKey.role === 'professeur' ? matiere : null,
        date_naissance
      });

      await AuthModel.markKeyAsUsed(registrationKey.id, authUser.id);

      const token = generateToken({
        userId: userProfile.id,
        email: userProfile.email,
        role: userProfile.role
      });

      logger.info(`Nouvel utilisateur inscrit: ${email} (${userProfile.role})`);

      return {
        success: true,
        user: {
          id: userProfile.id,
          email: userProfile.email,
          nom: userProfile.nom,
          prenom: userProfile.prenom,
          role: userProfile.role,
          classe: userProfile.classe,
          matiere: userProfile.matiere
        },
        token
      };
    } catch (error) {
      logger.error('Erreur service inscription:', error);
      throw error;
    }
  }

  static async login(email, password) {
    try {
      const user = await AuthModel.findUserByEmail(email);
      if (!user) {
        throw new Error('Email ou mot de passe incorrect');
      }

      const authResult = await AuthModel.signInUser(email, password);
      if (!authResult.user) {
        throw new Error('Email ou mot de passe incorrect');
      }

      await AuthModel.updateLastLogin(user.id);

      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role
      });

      logger.info(`Utilisateur connecté: ${email}`);

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          nom: user.nom,
          prenom: user.prenom,
          role: user.role,
          classe: user.classe,
          matiere: user.matiere,
          avatar_url: user.avatar_url,
          last_login: new Date().toISOString()
        },
        token
      };
    } catch (error) {
      logger.error('Erreur service connexion:', error);
      throw error;
    }
  }

  static async logout(userId) {
    try {
      logger.info(`Utilisateur déconnecté: ${userId}`);
      return { success: true, message: 'Déconnexion réussie' };
    } catch (error) {
      logger.error('Erreur service déconnexion:', error);
      throw error;
    }
  }

  static async getCurrentUser(userId) {
    try {
      const user = await AuthModel.findUserById(userId);
      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          nom: user.nom,
          prenom: user.prenom,
          role: user.role,
          classe: user.classe,
          matiere: user.matiere,
          avatar_url: user.avatar_url,
          bio: user.bio,
          date_naissance: user.date_naissance,
          created_at: user.created_at,
          last_login: user.last_login
        }
      };
    } catch (error) {
      logger.error('Erreur récupération utilisateur actuel:', error);
      throw error;
    }
  }

  static async updateProfile(userId, updates) {
    try {
      const allowedUpdates = ['nom', 'prenom', 'bio', 'avatar_url', 'classe', 'matiere', 'date_naissance'];
      const filteredUpdates = {};

      Object.keys(updates).forEach(key => {
        if (allowedUpdates.includes(key) && updates[key] !== undefined) {
          filteredUpdates[key] = updates[key];
        }
      });

      if (Object.keys(filteredUpdates).length === 0) {
        throw new Error('Aucune donnée valide à mettre à jour');
      }

      const updatedUser = await AuthModel.updateUserProfile(userId, filteredUpdates);

      logger.info(`Profil mis à jour: ${updatedUser.email}`);

      return {
        success: true,
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          nom: updatedUser.nom,
          prenom: updatedUser.prenom,
          role: updatedUser.role,
          classe: updatedUser.classe,
          matiere: updatedUser.matiere,
          avatar_url: updatedUser.avatar_url,
          bio: updatedUser.bio,
          date_naissance: updatedUser.date_naissance,
          updated_at: updatedUser.updated_at
        }
      };
    } catch (error) {
      logger.error('Erreur mise à jour profil:', error);
      throw error;
    }
  }

  static async changePassword(userId, currentPassword, newPassword) {
    try {
      const user = await AuthModel.findUserById(userId);
      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      const authResult = await AuthModel.signInUser(user.email, currentPassword);
      if (!authResult.user) {
        throw new Error('Mot de passe actuel incorrect');
      }

      await AuthModel.changePassword(userId, newPassword);

      logger.info(`Mot de passe changé: ${user.email}`);

      return {
        success: true,
        message: 'Mot de passe mis à jour avec succès'
      };
    } catch (error) {
      logger.error('Erreur changement mot de passe:', error);
      throw error;
    }
  }

  static async validateRegistrationKey(keyValue) {
    try {
      const key = await AuthModel.findRegistrationKey(keyValue);
      
      return {
        success: true,
        valid: !!key,
        role: key?.role || null
      };
    } catch (error) {
      logger.error('Erreur validation clé:', error);
      return {
        success: false,
        valid: false,
        error: error.message
      };
    }
  }
}

module.exports = AuthService;