const AuthService = require('../services/auth');
const Joi = require('joi');
const logger = require('../utils/logger');

const registerSchema = Joi.object({
  keyValue: Joi.string().required().messages({
    'string.empty': 'La clé d\'inscription est requise',
    'any.required': 'La clé d\'inscription est requise'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Format email invalide',
    'string.empty': 'L\'email est requis',
    'any.required': 'L\'email est requis'
  }),
  password: Joi.string().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)')).required().messages({
    'string.min': 'Le mot de passe doit contenir au moins 8 caractères',
    'string.pattern.base': 'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre',
    'string.empty': 'Le mot de passe est requis',
    'any.required': 'Le mot de passe est requis'
  }),
  nom: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Le nom doit contenir au moins 2 caractères',
    'string.max': 'Le nom ne peut pas dépasser 100 caractères',
    'string.empty': 'Le nom est requis',
    'any.required': 'Le nom est requis'
  }),
  prenom: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Le prénom doit contenir au moins 2 caractères',
    'string.max': 'Le prénom ne peut pas dépasser 100 caractères',
    'string.empty': 'Le prénom est requis',
    'any.required': 'Le prénom est requis'
  }),
  classe: Joi.string().max(50).allow('', null),
  matiere: Joi.string().max(100).allow('', null),
  date_naissance: Joi.date().max('now').allow(null)
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Format email invalide',
    'string.empty': 'L\'email est requis',
    'any.required': 'L\'email est requis'
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Le mot de passe est requis',
    'any.required': 'Le mot de passe est requis'
  })
});

const updateProfileSchema = Joi.object({
  nom: Joi.string().min(2).max(100),
  prenom: Joi.string().min(2).max(100),
  bio: Joi.string().max(500).allow(''),
  avatar_url: Joi.string().uri().allow(''),
  classe: Joi.string().max(50).allow(''),
  matiere: Joi.string().max(100).allow(''),
  date_naissance: Joi.date().max('now').allow(null)
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    'string.empty': 'Le mot de passe actuel est requis',
    'any.required': 'Le mot de passe actuel est requis'
  }),
  newPassword: Joi.string().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)')).required().messages({
    'string.min': 'Le nouveau mot de passe doit contenir au moins 8 caractères',
    'string.pattern.base': 'Le nouveau mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre',
    'string.empty': 'Le nouveau mot de passe est requis',
    'any.required': 'Le nouveau mot de passe est requis'
  })
});

class AuthController {
  static async register(req, res) {
    try {
      const { error, value } = registerSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          error: error.details[0].message
        });
      }

      const result = await AuthService.register(value);
      
      res.status(201).json(result);
    } catch (error) {
      logger.error('Erreur controller inscription:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  static async login(req, res) {
    try {
      const { error, value } = loginSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          error: error.details[0].message
        });
      }

      const result = await AuthService.login(value.email, value.password);
      
      res.json(result);
    } catch (error) {
      logger.error('Erreur controller connexion:', error);
      res.status(401).json({
        success: false,
        error: error.message
      });
    }
  }

  static async logout(req, res) {
    try {
      const result = await AuthService.logout(req.user.userId);
      res.json(result);
    } catch (error) {
      logger.error('Erreur controller déconnexion:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la déconnexion'
      });
    }
  }

  static async getCurrentUser(req, res) {
    try {
      const result = await AuthService.getCurrentUser(req.user.userId);
      res.json(result);
    } catch (error) {
      logger.error('Erreur controller utilisateur actuel:', error);
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

  static async updateProfile(req, res) {
    try {
      const { error, value } = updateProfileSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          error: error.details[0].message
        });
      }

      const result = await AuthService.updateProfile(req.user.userId, value);
      res.json(result);
    } catch (error) {
      logger.error('Erreur controller mise à jour profil:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  static async changePassword(req, res) {
    try {
      const { error, value } = changePasswordSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          error: error.details[0].message
        });
      }

      const result = await AuthService.changePassword(
        req.user.userId,
        value.currentPassword,
        value.newPassword
      );
      
      res.json(result);
    } catch (error) {
      logger.error('Erreur controller changement mot de passe:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  static async validateKey(req, res) {
    try {
      const { keyValue } = req.params;
      
      if (!keyValue) {
        return res.status(400).json({
          success: false,
          error: 'Clé d\'inscription requise'
        });
      }

      const result = await AuthService.validateRegistrationKey(keyValue);
      res.json(result);
    } catch (error) {
      logger.error('Erreur controller validation clé:', error);
      res.status(500).json({
        success: false,
        error: 'Erreur lors de la validation de la clé'
      });
    }
  }
}

module.exports = AuthController;