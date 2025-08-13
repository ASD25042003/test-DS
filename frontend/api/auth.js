/**
 * 🔐 Client API Authentification - Diagana School
 * Communication avec l'API backend /api/auth
 */

import { apiClient, ApiError, API_CONFIG } from '/static/api/index.js';

class AuthApi {
    constructor() {
        this.baseEndpoint = API_CONFIG.ENDPOINTS.AUTH;
    }

    /**
     * Inscription d'un nouvel utilisateur avec clé d'inscription
     * @param {Object} userData - Données d'inscription
     * @param {string} userData.keyValue - Clé d'inscription (PROF_2024_XXX ou ELEVE_2024_XXX)
     * @param {string} userData.email - Adresse email unique
     * @param {string} userData.password - Mot de passe (min 8 chars, 1 maj, 1 min, 1 chiffre)
     * @param {string} userData.nom - Nom de famille
     * @param {string} userData.prenom - Prénom
     * @param {string} userData.classe - Classe (élèves uniquement)
     * @param {string} userData.matiere - Matière (professeurs uniquement)
     * @param {string} userData.date_naissance - Date de naissance (format ISO)
     * @returns {Promise<Object>} Utilisateur créé avec token JWT
     */
    async register(userData) {
        try {
            const response = await apiClient.post(`${this.baseEndpoint}/register`, {
                keyValue: userData.keyValue,
                email: userData.email,
                password: userData.password,
                nom: userData.nom,
                prenom: userData.prenom,
                classe: userData.classe,
                matiere: userData.matiere,
                date_naissance: userData.date_naissance
            });

            if (response.token) {
                // Sauvegarder le token dans localStorage
                localStorage.setItem('authToken', response.token);
                if (apiClient && apiClient.setToken) {
                    apiClient.setToken(response.token);
                }
                // Sauvegarder les infos utilisateur en local
                localStorage.setItem('currentUser', JSON.stringify(response.user));
            }

            return response;
        } catch (error) {
            this.handleAuthError(error);
        }
    }

    /**
     * Connexion utilisateur
     * @param {Object} credentials - Identifiants de connexion
     * @param {string} credentials.email - Adresse email
     * @param {string} credentials.password - Mot de passe
     * @returns {Promise<Object>} Utilisateur connecté avec token JWT
     */
    async login(credentials) {
        try {
            const response = await apiClient.post(`${this.baseEndpoint}/login`, {
                email: credentials.email,
                password: credentials.password
            });

            if (response.token) {
                // Sauvegarder le token dans localStorage
                localStorage.setItem('authToken', response.token);
                if (apiClient && apiClient.setToken) {
                    apiClient.setToken(response.token);
                }
                // Sauvegarder les infos utilisateur en local
                localStorage.setItem('currentUser', JSON.stringify(response.user));
            }

            return response;
        } catch (error) {
            this.handleAuthError(error);
        }
    }

    /**
     * Déconnexion utilisateur
     * @returns {Promise<void>} Confirmation de déconnexion
     */
    async logout() {
        try {
            await apiClient.post(`${this.baseEndpoint}/logout`);
        } catch (error) {
            console.warn('Erreur lors de la déconnexion:', error.message);
        } finally {
            if (apiClient && apiClient.setToken) {
                apiClient.setToken(null);
            }
            localStorage.removeItem('authToken');
            localStorage.removeItem('currentUser');
        }
    }

    /**
     * Récupérer le profil de l'utilisateur connecté
     * @returns {Promise<Object>} Profil utilisateur complet
     */
    async getProfile() {
        try {
            const response = await apiClient.get(`${this.baseEndpoint}/me`);
            // Mettre à jour le cache local
            if (response.user) {
                localStorage.setItem('currentUser', JSON.stringify(response.user));
            }
            return response;
        } catch (error) {
            this.handleAuthError(error);
        }
    }

    /**
     * Valider une clé d'inscription
     * @param {string} keyValue - Clé d'inscription à valider
     * @returns {Promise<Object>} Statut de validation avec rôle
     */
    async validateKey(keyValue) {
        try {
            return await apiClient.get(`${this.baseEndpoint}/validate-key/${encodeURIComponent(keyValue)}`);
        } catch (error) {
            // Ne pas rediriger pour les erreurs de validation de clé
            throw error;
        }
    }

    async updateProfile(profileData) {
        try {
            return await apiClient.put(`${this.baseEndpoint}/profile`, profileData);
        } catch (error) {
            this.handleAuthError(error);
        }
    }

    async changePassword(passwordData) {
        try {
            return await apiClient.put(`${this.baseEndpoint}/password`, {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
        } catch (error) {
            this.handleAuthError(error);
        }
    }

    async requestPasswordReset(email) {
        try {
            return await apiClient.post(`${this.baseEndpoint}/forgot-password`, { email });
        } catch (error) {
            this.handleAuthError(error);
        }
    }

    async resetPassword(resetData) {
        try {
            return await apiClient.post(`${this.baseEndpoint}/reset-password`, {
                token: resetData.token,
                newPassword: resetData.newPassword
            });
        } catch (error) {
            this.handleAuthError(error);
        }
    }

    async verifyEmail(token) {
        try {
            return await apiClient.post(`${this.baseEndpoint}/verify-email`, { token });
        } catch (error) {
            this.handleAuthError(error);
        }
    }

    async resendVerification() {
        try {
            return await apiClient.post(`${this.baseEndpoint}/resend-verification`);
        } catch (error) {
            this.handleAuthError(error);
        }
    }

    async deleteAccount() {
        try {
            const response = await apiClient.delete(`${this.baseEndpoint}/account`);
            this.clearAuthData();
            return response;
        } catch (error) {
            this.handleAuthError(error);
        }
    }

    /**
     * Vérifier si l'utilisateur est authentifié
     * @returns {boolean} État de connexion
     */
    isAuthenticated() {
        return !!localStorage.getItem('authToken');
    }

    /**
     * Récupérer le token JWT actuel
     * @returns {string|null} Token JWT ou null
     */
    getToken() {
        return localStorage.getItem('authToken');
    }

    /**
     * Récupérer les informations utilisateur en cache
     * @returns {Object|null} Informations utilisateur ou null
     */
    getCurrentUser() {
        const userData = localStorage.getItem('currentUser');
        return userData ? JSON.parse(userData) : null;
    }

    /**
     * Valider les données d'inscription
     * @param {Object} userData - Données à valider
     * @returns {Object} Erreurs de validation
     */
    validateRegistrationData(userData) {
        const errors = {};

        // Clé d'inscription
        if (!userData.keyValue || !this.isValidKey(userData.keyValue)) {
            errors.keyValue = 'Clé d\'inscription invalide';
        }

        // Email
        if (!userData.email || !this.isValidEmail(userData.email)) {
            errors.email = 'Adresse email invalide';
        }

        // Mot de passe
        const passwordValidation = this.validatePassword(userData.password);
        if (!passwordValidation.valid) {
            errors.password = passwordValidation.errors.join(', ');
        }

        // Nom et prénom
        if (!userData.nom || userData.nom.trim().length < 2) {
            errors.nom = 'Le nom doit contenir au moins 2 caractères';
        }

        if (!userData.prenom || userData.prenom.trim().length < 2) {
            errors.prenom = 'Le prénom doit contenir au moins 2 caractères';
        }

        return errors;
    }

    /**
     * Valider un mot de passe selon les règles
     * @param {string} password - Mot de passe à valider
     * @returns {Object} Résultat de validation
     */
    validatePassword(password) {
        const errors = [];
        const result = { valid: true, errors };

        if (!password) {
            errors.push('Le mot de passe est obligatoire');
            result.valid = false;
            return result;
        }

        if (password.length < 8) {
            errors.push('Au moins 8 caractères');
            result.valid = false;
        }

        if (!/[a-z]/.test(password)) {
            errors.push('Au moins une minuscule');
            result.valid = false;
        }

        if (!/[A-Z]/.test(password)) {
            errors.push('Au moins une majuscule');
            result.valid = false;
        }

        if (!/[0-9]/.test(password)) {
            errors.push('Au moins un chiffre');
            result.valid = false;
        }

        return result;
    }

    /**
     * Valider le format d'une adresse email
     * @param {string} email - Email à valider
     * @returns {boolean} Validité de l'email
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Valider le format d'une clé d'inscription
     * @param {string} keyValue - Clé à valider
     * @returns {boolean} Validité du format
     */
    isValidKey(keyValue) {
        if (!keyValue || typeof keyValue !== 'string') return false;
        
        const profKeyRegex = /^PROF_2024_[A-Z0-9]{6}$/;
        const eleveKeyRegex = /^ELEVE_2024_[A-Z0-9]{6}$/;
        
        return profKeyRegex.test(keyValue) || eleveKeyRegex.test(keyValue);
    }

    /**
     * Déterminer le rôle basé sur la clé d'inscription
     * @param {string} keyValue - Clé d'inscription
     * @returns {string|null} Rôle ('professeur' ou 'eleve')
     */
    getRoleFromKey(keyValue) {
        if (!keyValue || typeof keyValue !== 'string') return null;
        
        if (keyValue.startsWith('PROF_')) return 'professeur';
        if (keyValue.startsWith('ELEVE_')) return 'eleve';
        
        return null;
    }

    /**
     * Nettoyer les données d'authentification en cas de déconnexion forcée
     */
    clearAuthData() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('currentUser');
        if (apiClient && apiClient.setToken) {
            apiClient.setToken(null);
        }
    }

    handleAuthError(error) {
        if (error.status === 401) {
            this.clearAuthData();
            if (typeof window !== 'undefined' && !window.location.pathname.includes('auth')) {
                window.location.href = '/auth';
            }
        }
        
        throw error;
    }
}

const authApi = new AuthApi();

export { authApi, AuthApi };
