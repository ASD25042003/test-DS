const { supabase, supabaseAdmin } = require('../config/supabase');
const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');

class AuthModel {
  static async findRegistrationKey(keyValue) {
    try {
      const { data, error } = await supabaseAdmin
        .from('registration_keys')
        .select('*')
        .eq('key_value', keyValue)
        .eq('is_used', false)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }

      return data;
    } catch (error) {
      logger.error('Erreur recherche clé inscription:', error);
      throw error;
    }
  }

  static async markKeyAsUsed(keyId, userId) {
    try {
      const { error } = await supabaseAdmin
        .from('registration_keys')
        .update({
          is_used: true,
          used_by: userId,
          used_at: new Date().toISOString()
        })
        .eq('id', keyId);

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Erreur marquage clé utilisée:', error);
      throw error;
    }
  }

  static async createAuthUser(email, password) {
    try {
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true
      });

      if (error) throw error;
      return data.user;
    } catch (error) {
      logger.error('Erreur création utilisateur auth:', error);
      throw error;
    }
  }

  static async createUserProfile(userData) {
    try {
      const { data, error } = await supabaseAdmin
        .from('users')
        .insert({
          id: userData.id,
          email: userData.email,
          nom: userData.nom,
          prenom: userData.prenom,
          role: userData.role,
          classe: userData.classe,
          matiere: userData.matiere,
          date_naissance: userData.date_naissance
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erreur création profil utilisateur:', error);
      throw error;
    }
  }

  static async findUserByEmail(email) {
    try {
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('is_active', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }

      return data;
    } catch (error) {
      logger.error('Erreur recherche utilisateur:', error);
      throw error;
    }
  }

  static async findUserById(id) {
    try {
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }

      return data;
    } catch (error) {
      logger.error('Erreur recherche utilisateur par ID:', error);
      throw error;
    }
  }

  static async signInUser(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erreur connexion utilisateur:', error);
      throw error;
    }
  }

  static async updateLastLogin(userId) {
    try {
      const { error } = await supabaseAdmin
        .from('users')
        .update({
          last_login: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Erreur mise à jour dernière connexion:', error);
      return false;
    }
  }

  static async signOutUser(token) {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Erreur déconnexion:', error);
      throw error;
    }
  }

  static async updateUserProfile(userId, updates) {
    try {
      const { data, error } = await supabaseAdmin
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erreur mise à jour profil:', error);
      throw error;
    }
  }

  static async changePassword(userId, newPassword) {
    try {
      const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        password: newPassword
      });

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Erreur changement mot de passe:', error);
      throw error;
    }
  }

  static async deactivateUser(userId) {
    try {
      const { error } = await supabaseAdmin
        .from('users')
        .update({ is_active: false })
        .eq('id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Erreur désactivation utilisateur:', error);
      throw error;
    }
  }

  static async getAllUsers(limit = 50, offset = 0) {
    try {
      const { data, error, count } = await supabaseAdmin
        .from('users')
        .select('id, email, nom, prenom, role, created_at, last_login, is_active', { count: 'exact' })
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return { users: data, total: count };
    } catch (error) {
      logger.error('Erreur récupération utilisateurs:', error);
      throw error;
    }
  }
}

module.exports = AuthModel;