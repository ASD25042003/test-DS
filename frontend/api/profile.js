/**
 * 👤 Client API Profil - Diagana School
 * Communication avec l'API backend /api/profil
 */

import { apiClient, ApiError, API_CONFIG } from '/static/api/index.js';

class ProfileApi {
    constructor() {
        this.baseEndpoint = API_CONFIG.ENDPOINTS.PROFILE;
    }

    /**
     * Récupérer tous les utilisateurs avec pagination
     * @param {Object} options - Options de pagination et filtrage
     * @param {number} options.page - Numéro de page (défaut: 1)
     * @param {number} options.limit - Limite par page (défaut: 20)
     * @param {string} options.sortBy - Tri (created_at, nom, prenom)
     * @param {string} options.sortOrder - Ordre (asc, desc)
     * @returns {Promise<Object>} Liste paginée des utilisateurs
     */
    async getAllUsers(options = {}) {
        try {
            const queryParams = new URLSearchParams();
            
            if (options.page) queryParams.append('page', options.page.toString());
            if (options.limit) queryParams.append('limit', options.limit.toString());
            if (options.sortBy) queryParams.append('sortBy', options.sortBy);
            if (options.sortOrder) queryParams.append('sortOrder', options.sortOrder);
            
            const endpoint = queryParams.toString() 
                ? `${this.baseEndpoint}/all?${queryParams.toString()}`
                : `${this.baseEndpoint}/all`;
                
            return await apiClient.get(endpoint);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Récupérer les utilisateurs par rôle
     * @param {string} role - Rôle (professeur, eleve)
     * @param {Object} options - Options de pagination
     * @returns {Promise<Object>} Utilisateurs par rôle
     */
    async getUsersByRole(role, options = {}) {
        try {
            const queryParams = new URLSearchParams();
            
            if (options.page) queryParams.append('page', options.page.toString());
            if (options.limit) queryParams.append('limit', options.limit.toString());
            if (options.sortBy) queryParams.append('sortBy', options.sortBy);
            if (options.sortOrder) queryParams.append('sortOrder', options.sortOrder);
            
            const endpoint = queryParams.toString() 
                ? `${this.baseEndpoint}/role/${role}?${queryParams.toString()}`
                : `${this.baseEndpoint}/role/${role}`;
                
            return await apiClient.get(endpoint);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Rechercher des utilisateurs
     * @param {Object} options - Critères de recherche
     * @param {string} options.q - Terme de recherche (nom, prénom, email)
     * @param {string} options.role - Rôle à filtrer
     * @param {string} options.matiere - Matière (professeurs)
     * @param {string} options.classe - Classe (élèves)
     * @param {number} options.page - Page
     * @param {number} options.limit - Limite
     * @returns {Promise<Object>} Résultats de recherche
     */
    async searchUsers(options = {}) {
        try {
            const queryParams = new URLSearchParams();
            
            if (options.q) queryParams.append('q', options.q);
            if (options.role && options.role !== 'all') queryParams.append('role', options.role);
            if (options.matiere && options.matiere !== 'all') queryParams.append('matiere', options.matiere);
            if (options.classe && options.classe !== 'all') queryParams.append('classe', options.classe);
            if (options.page) queryParams.append('page', options.page.toString());
            if (options.limit) queryParams.append('limit', options.limit.toString());
            
            return await apiClient.get(`${this.baseEndpoint}/search?${queryParams.toString()}`);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Récupérer le profil d'un utilisateur
     * @param {string} userId - ID de l'utilisateur
     * @returns {Promise<Object>} Profil utilisateur
     */
    async getProfile(userId) {
        try {
            return await apiClient.get(`${this.baseEndpoint}/${userId}`);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Récupérer les ressources d'un utilisateur
     * @param {string} userId - ID de l'utilisateur
     * @param {Object} options - Options de pagination et filtrage
     * @returns {Promise<Object>} Ressources de l'utilisateur
     */
    async getUserRessources(userId, options = {}) {
        try {
            const queryParams = new URLSearchParams();
            
            if (options.page) queryParams.append('page', options.page.toString());
            if (options.limit) queryParams.append('limit', options.limit.toString());
            if (options.type && options.type !== 'all') queryParams.append('type', options.type);
            if (options.matiere && options.matiere !== 'all') queryParams.append('matiere', options.matiere);
            
            const endpoint = queryParams.toString() 
                ? `${this.baseEndpoint}/${userId}/ressources?${queryParams.toString()}`
                : `${this.baseEndpoint}/${userId}/ressources`;
                
            return await apiClient.get(endpoint);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Récupérer les collections d'un utilisateur
     * @param {string} userId - ID de l'utilisateur
     * @param {Object} options - Options de pagination et filtrage
     * @returns {Promise<Object>} Collections de l'utilisateur
     */
    async getUserCollections(userId, options = {}) {
        try {
            const queryParams = new URLSearchParams();
            
            if (options.page) queryParams.append('page', options.page.toString());
            if (options.limit) queryParams.append('limit', options.limit.toString());
            if (options.visibility && options.visibility !== 'all') queryParams.append('visibility', options.visibility);
            if (options.matiere && options.matiere !== 'all') queryParams.append('matiere', options.matiere);
            
            const endpoint = queryParams.toString() 
                ? `${this.baseEndpoint}/${userId}/collections?${queryParams.toString()}`
                : `${this.baseEndpoint}/${userId}/collections`;
                
            return await apiClient.get(endpoint);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Récupérer les followers d'un utilisateur
     * @param {string} userId - ID de l'utilisateur
     * @param {Object} options - Options de pagination
     * @returns {Promise<Object>} Followers de l'utilisateur
     */
    async getFollowers(userId, options = {}) {
        try {
            const queryParams = new URLSearchParams();
            
            if (options.page) queryParams.append('page', options.page.toString());
            if (options.limit) queryParams.append('limit', options.limit.toString());
            
            const endpoint = queryParams.toString() 
                ? `${this.baseEndpoint}/${userId}/followers?${queryParams.toString()}`
                : `${this.baseEndpoint}/${userId}/followers`;
                
            return await apiClient.get(endpoint);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Récupérer les utilisateurs suivis par un utilisateur
     * @param {string} userId - ID de l'utilisateur
     * @param {Object} options - Options de pagination
     * @returns {Promise<Object>} Utilisateurs suivis
     */
    async getFollowing(userId, options = {}) {
        try {
            const queryParams = new URLSearchParams();
            
            if (options.page) queryParams.append('page', options.page.toString());
            if (options.limit) queryParams.append('limit', options.limit.toString());
            
            const endpoint = queryParams.toString() 
                ? `${this.baseEndpoint}/${userId}/following?${queryParams.toString()}`
                : `${this.baseEndpoint}/${userId}/following`;
                
            return await apiClient.get(endpoint);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Récupérer l'activité d'un utilisateur
     * @param {string} userId - ID de l'utilisateur
     * @param {Object} options - Options de pagination et filtrage
     * @returns {Promise<Object>} Activité de l'utilisateur
     */
    async getUserActivity(userId, options = {}) {
        try {
            const queryParams = new URLSearchParams();
            
            if (options.page) queryParams.append('page', options.page.toString());
            if (options.limit) queryParams.append('limit', options.limit.toString());
            if (options.type && options.type !== 'all') queryParams.append('type', options.type);
            if (options.dateFrom) queryParams.append('dateFrom', options.dateFrom);
            if (options.dateTo) queryParams.append('dateTo', options.dateTo);
            
            const endpoint = queryParams.toString() 
                ? `${this.baseEndpoint}/${userId}/activity?${queryParams.toString()}`
                : `${this.baseEndpoint}/${userId}/activity`;
                
            return await apiClient.get(endpoint);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Suivre un utilisateur
     * @param {string} userId - ID de l'utilisateur à suivre
     * @returns {Promise<Object>} Confirmation de suivi
     */
    async followUser(userId) {
        try {
            return await apiClient.post(`${this.baseEndpoint}/${userId}/follow`);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Ne plus suivre un utilisateur
     * @param {string} userId - ID de l'utilisateur à ne plus suivre
     * @returns {Promise<Object>} Confirmation d'arrêt de suivi
     */
    async unfollowUser(userId) {
        try {
            return await apiClient.delete(`${this.baseEndpoint}/${userId}/follow`);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Vérifier si l'utilisateur connecté suit un autre utilisateur
     * @param {string} userId - ID de l'utilisateur à vérifier
     * @returns {Promise<boolean>} État du suivi
     */
    async checkIfFollowing(userId) {
        try {
            const profile = await this.getProfile(userId);
            return profile.user?.isFollowed || false;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Obtenir les statistiques d'un utilisateur
     * @param {string} userId - ID de l'utilisateur
     * @returns {Promise<Object>} Statistiques de l'utilisateur
     */
    async getUserStats(userId) {
        try {
            const profile = await this.getProfile(userId);
            return {
                ressourcesCount: profile.user?.ressources_count || 0,
                collectionsCount: profile.user?.collections_count || 0,
                followersCount: profile.user?.followers_count || 0,
                followingCount: profile.user?.following_count || 0,
                likesCount: profile.user?.likes_count || 0,
                viewsCount: profile.user?.views_count || 0
            };
        } catch (error) {
            throw error;
        }
    }

    /**
     * Valider les critères de recherche d'utilisateurs
     * @param {Object} searchOptions - Options de recherche à valider
     * @returns {Object} Erreurs de validation
     */
    validateSearchOptions(searchOptions) {
        const errors = {};

        // Terme de recherche minimum 2 caractères
        if (searchOptions.q && searchOptions.q.trim().length < 2) {
            errors.q = 'Le terme de recherche doit contenir au moins 2 caractères';
        }

        // Rôle valide
        const validRoles = ['professeur', 'eleve', 'all'];
        if (searchOptions.role && !validRoles.includes(searchOptions.role)) {
            errors.role = `Le rôle doit être: ${validRoles.join(', ')}`;
        }

        // Pagination valide - CORRECTION pour détecter page: 0
        if (searchOptions.page !== undefined && (isNaN(Number(searchOptions.page)) || Number(searchOptions.page) < 1)) {
            errors.page = 'La page doit être un nombre positif';
        }

        if (searchOptions.limit !== undefined && (isNaN(Number(searchOptions.limit)) || Number(searchOptions.limit) < 1 || Number(searchOptions.limit) > 100)) {
            errors.limit = 'La limite doit être entre 1 et 100';
        }

        return errors;
    }

    /**
     * Formater le nom complet d'un utilisateur
     * @param {Object} user - Objet utilisateur
     * @returns {string} Nom complet formaté
     */
    formatFullName(user) {
        if (!user) return '';
        
        const prenom = user.prenom || '';
        const nom = user.nom || '';
        
        return `${prenom} ${nom}`.trim();
    }

    /**
     * Formater les informations de rôle d'un utilisateur
     * @param {Object} user - Objet utilisateur
     * @returns {string} Information de rôle formatée
     */
    formatRoleInfo(user) {
        if (!user) return '';
        
        if (user.role === 'professeur') {
            return `Professeur${user.matiere ? ` - ${user.matiere}` : ''}`;
        } else if (user.role === 'eleve') {
            return `Élève${user.classe ? ` - ${user.classe}` : ''}`;
        }
        
        return user.role || '';
    }

    /**
     * Calculer l'âge d'un utilisateur
     * @param {string} dateNaissance - Date de naissance (format ISO)
     * @returns {number|null} Âge calculé ou null
     */
    calculateAge(dateNaissance) {
        if (!dateNaissance) return null;
        
        try {
            const birthDate = new Date(dateNaissance);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            
            return age >= 0 ? age : null;
        } catch {
            return null;
        }
    }

    /**
     * Obtenir l'avatar par défaut basé sur le nom
     * @param {Object} user - Objet utilisateur
     * @returns {string} Initiales pour l'avatar
     */
    getAvatarInitials(user) {
        if (!user) return '';
        
        const prenom = user.prenom || '';
        const nom = user.nom || '';
        
        const prenomInitial = prenom.charAt(0).toUpperCase();
        const nomInitial = nom.charAt(0).toUpperCase();
        
        return `${prenomInitial}${nomInitial}`;
    }

    /**
     * Vérifier si un utilisateur est visible (profil public ou autorisé)
     * @param {Object} user - Objet utilisateur
     * @param {Object} currentUser - Utilisateur connecté
     * @returns {boolean} Visibilité du profil
     */
    isProfileVisible(user, currentUser) {
        if (!user) return false;
        
        // L'utilisateur peut toujours voir son propre profil
        if (currentUser && user.id === currentUser.id) return true;
        
        // Profils publics visibles par tous
        if (user.profil_public !== false) return true;
        
        // Profils privés visibles seulement si on suit l'utilisateur
        return user.isFollowed === true;
    }
}

const profileApi = new ProfileApi();

export { profileApi, ProfileApi };