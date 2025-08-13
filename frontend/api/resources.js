/**
 * 📚 Client API Ressources - Diagana School
 * Communication avec l'API backend /api/ressources
 */

import { apiClient, ApiError, API_CONFIG } from '/static/api/index.js';

class ResourcesApi {
    constructor() {
        this.baseEndpoint = API_CONFIG.ENDPOINTS.RESOURCES;
    }

    /**
     * Récupérer toutes les ressources avec filtres et pagination
     * @param {Object} options - Options de filtrage et pagination
     * @param {string} options.search - Terme de recherche
     * @param {string} options.type - Type de ressource (document, media, video, lien)
     * @param {string} options.matiere - Matière
     * @param {string} options.niveau - Niveau scolaire
     * @param {number} options.page - Numéro de page (défaut: 1)
     * @param {number} options.limit - Limite par page (défaut: 20)
     * @param {string} options.sortBy - Tri (created_at, likes_count, views_count)
     * @param {string} options.sortOrder - Ordre (asc, desc)
     * @returns {Promise<Object>} Liste paginée des ressources
     */
    async getAll(options = {}) {
        try {
            const queryParams = new URLSearchParams();
            
            if (options.search) queryParams.append('search', options.search);
            if (options.type && options.type !== 'all') queryParams.append('type', options.type);
            if (options.matiere && options.matiere !== 'all') queryParams.append('matiere', options.matiere);
            if (options.niveau && options.niveau !== 'all') queryParams.append('niveau', options.niveau);
            if (options.page) queryParams.append('page', options.page.toString());
            if (options.limit) queryParams.append('limit', options.limit.toString());
            if (options.sortBy) queryParams.append('sortBy', options.sortBy);
            if (options.sortOrder) queryParams.append('sortOrder', options.sortOrder);
            
            const endpoint = queryParams.toString() 
                ? `${this.baseEndpoint}?${queryParams.toString()}`
                : this.baseEndpoint;
                
            const response = await apiClient.get(endpoint);
            
            // Adapter la réponse backend au format attendu par le frontend
            if (response && response.success && response.ressources) {
                const adaptedResources = response.ressources.map(resource => ({
                    ...resource,
                    auteur: resource.users, // Conversion users -> auteur pour compatibilité frontend
                    stats: {
                        vues: resource.views_count || 0,
                        likes: resource.likes_count || 0,
                        commentaires: resource.comments_count || 0,
                        telechargements: resource.downloads_count || 0
                    }
                }));
                
                return {
                    success: response.success,
                    data: adaptedResources,
                    pagination: response.pagination
                };
            }
            
            return response;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Récupérer une ressource par ID
     * @param {string} id - ID de la ressource
     * @returns {Promise<Object>} Détails de la ressource
     */
    async getById(id) {
        try {
            const response = await apiClient.get(`${this.baseEndpoint}/${id}`);
            
            // Adapter la réponse backend au format attendu par le frontend
            if (response && response.success && response.ressource) {
                const adaptedResource = {
                    ...response.ressource,
                    auteur: response.ressource.users, // Conversion users -> auteur pour compatibilité frontend
                    stats: {
                        vues: response.ressource.views_count || 0,
                        likes: response.ressource.likes_count || 0,
                        commentaires: response.ressource.comments_count || 0,
                        telechargements: response.ressource.downloads_count || 0
                    }
                };
                
                return adaptedResource;
            }
            
            return response;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Créer une nouvelle ressource
     * @param {Object} resourceData - Données de la ressource
     * @param {File} file - Fichier à uploader (optionnel)
     * @returns {Promise<Object>} Ressource créée
     */
    async create(resourceData, file = null) {
        try {
            const formData = new FormData();
            
            // Ajouter les données texte
            Object.keys(resourceData).forEach(key => {
                if (resourceData[key] !== null && resourceData[key] !== undefined) {
                    if (Array.isArray(resourceData[key])) {
                        formData.append(key, JSON.stringify(resourceData[key]));
                    } else if (typeof resourceData[key] === 'object') {
                        formData.append(key, JSON.stringify(resourceData[key]));
                    } else {
                        formData.append(key, resourceData[key]);
                    }
                }
            });
            
            // Ajouter le fichier si présent
            if (file) {
                const validation = apiClient.validateFile(file);
                if (!validation.valid) {
                    throw new ApiError(`Fichier invalide: ${validation.errors.join(', ')}`, 400);
                }
                formData.append('file', file);
            }
            
            const response = await apiClient.uploadFile(this.baseEndpoint, formData, 'POST');
            
            // Adapter la réponse backend au format attendu par le frontend
            if (response && response.success && response.data && response.data.users) {
                const adaptedResource = {
                    ...response.data,
                    auteur: response.data.users, // Conversion users -> auteur pour compatibilité frontend
                    stats: {
                        vues: response.data.views_count || 0,
                        likes: response.data.likes_count || 0,
                        commentaires: response.data.comments_count || 0,
                        telechargements: response.data.downloads_count || 0
                    }
                };
                
                return {
                    success: response.success,
                    data: adaptedResource
                };
            }
            
            return response;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Mettre à jour une ressource
     * @param {string} id - ID de la ressource
     * @param {Object} resourceData - Nouvelles données
     * @param {File} file - Nouveau fichier (optionnel)
     * @returns {Promise<Object>} Ressource mise à jour
     */
    async update(id, resourceData, file = null) {
        try {
            const formData = new FormData();
            
            // Ajouter les données texte
            Object.keys(resourceData).forEach(key => {
                if (resourceData[key] !== null && resourceData[key] !== undefined) {
                    if (Array.isArray(resourceData[key])) {
                        formData.append(key, JSON.stringify(resourceData[key]));
                    } else if (typeof resourceData[key] === 'object') {
                        formData.append(key, JSON.stringify(resourceData[key]));
                    } else {
                        formData.append(key, resourceData[key]);
                    }
                }
            });
            
            // Ajouter le fichier si présent
            if (file) {
                const validation = apiClient.validateFile(file);
                if (!validation.valid) {
                    throw new ApiError(`Fichier invalide: ${validation.errors.join(', ')}`, 400);
                }
                formData.append('file', file);
            }
            
            const response = await apiClient.uploadFile(`${this.baseEndpoint}/${id}`, formData, 'PUT');
            
            // Adapter la réponse backend au format attendu par le frontend
            if (response && response.success && response.data && response.data.users) {
                const adaptedResource = {
                    ...response.data,
                    auteur: response.data.users, // Conversion users -> auteur pour compatibilité frontend
                    stats: {
                        vues: response.data.views_count || 0,
                        likes: response.data.likes_count || 0,
                        commentaires: response.data.comments_count || 0,
                        telechargements: response.data.downloads_count || 0
                    }
                };
                
                return {
                    success: response.success,
                    data: adaptedResource
                };
            }
            
            return response;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Supprimer une ressource
     * @param {string} id - ID de la ressource
     * @returns {Promise<Object>} Confirmation de suppression
     */
    async delete(id) {
        try {
            return await apiClient.delete(`${this.baseEndpoint}/${id}`);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Toggle like sur une ressource
     * @param {string} id - ID de la ressource
     * @returns {Promise<Object>} Statut du like
     */
    async toggleLike(id) {
        try {
            return await apiClient.post(`${this.baseEndpoint}/${id}/like`);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Toggle favori sur une ressource
     * @param {string} id - ID de la ressource
     * @returns {Promise<Object>} Statut du favori
     */
    async toggleFavorite(id) {
        try {
            return await apiClient.post(`${this.baseEndpoint}/${id}/favorite`);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Récupérer les ressources populaires
     * @param {Object} options - Options de pagination
     * @returns {Promise<Object>} Ressources populaires
     */
    async getPopular(options = {}) {
        try {
            const queryParams = new URLSearchParams();
            if (options.page) queryParams.append('page', options.page.toString());
            if (options.limit) queryParams.append('limit', options.limit.toString());
            
            const endpoint = queryParams.toString() 
                ? `${this.baseEndpoint}/popular?${queryParams.toString()}`
                : `${this.baseEndpoint}/popular`;
                
            return await apiClient.get(endpoint);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Récupérer les ressources récentes
     * @param {Object} options - Options de pagination
     * @returns {Promise<Object>} Ressources récentes
     */
    async getRecent(options = {}) {
        try {
            const queryParams = new URLSearchParams();
            if (options.page) queryParams.append('page', options.page.toString());
            if (options.limit) queryParams.append('limit', options.limit.toString());
            
            const endpoint = queryParams.toString() 
                ? `${this.baseEndpoint}/recent?${queryParams.toString()}`
                : `${this.baseEndpoint}/recent`;
                
            return await apiClient.get(endpoint);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Rechercher des ressources
     * @param {Object} options - Critères de recherche
     * @param {string} options.q - Terme de recherche
     * @param {string} options.type - Type de ressource
     * @param {string} options.matiere - Matière
     * @param {string} options.niveau - Niveau
     * @param {number} options.page - Page
     * @param {number} options.limit - Limite
     * @returns {Promise<Object>} Résultats de recherche
     */
    async search(options = {}) {
        try {
            const queryParams = new URLSearchParams();
            
            if (options.q) queryParams.append('q', options.q);
            if (options.type && options.type !== 'all') queryParams.append('type', options.type);
            if (options.matiere && options.matiere !== 'all') queryParams.append('matiere', options.matiere);
            if (options.niveau && options.niveau !== 'all') queryParams.append('niveau', options.niveau);
            if (options.page) queryParams.append('page', options.page.toString());
            if (options.limit) queryParams.append('limit', options.limit.toString());
            
            return await apiClient.get(`${this.baseEndpoint}/search?${queryParams.toString()}`);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Récupérer mes ressources (utilisateur connecté)
     * @param {Object} options - Options de pagination
     * @returns {Promise<Object>} Mes ressources
     */
    async getMy(options = {}) {
        try {
            const queryParams = new URLSearchParams();
            if (options.page) queryParams.append('page', options.page.toString());
            if (options.limit) queryParams.append('limit', options.limit.toString());
            
            const endpoint = queryParams.toString() 
                ? `${this.baseEndpoint}/my?${queryParams.toString()}`
                : `${this.baseEndpoint}/my`;
                
            return await apiClient.get(endpoint);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Récupérer mes favoris
     * @param {Object} options - Options de pagination
     * @returns {Promise<Object>} Mes favoris
     */
    async getFavorites(options = {}) {
        try {
            const queryParams = new URLSearchParams();
            if (options.page) queryParams.append('page', options.page.toString());
            if (options.limit) queryParams.append('limit', options.limit.toString());
            
            const endpoint = queryParams.toString() 
                ? `${this.baseEndpoint}/favorites?${queryParams.toString()}`
                : `${this.baseEndpoint}/favorites`;
                
            return await apiClient.get(endpoint);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Télécharger une ressource
     * @param {string} id - ID de la ressource
     * @returns {Promise<Blob>} Fichier à télécharger
     */
    async download(id) {
        try {
            const url = `${apiClient.baseURL}${this.baseEndpoint}/${id}/download`;
            const headers = {};
            
            if (apiClient.token) {
                headers.Authorization = `Bearer ${apiClient.token}`;
            }
            
            const response = await fetch(url, { headers });
            
            if (!response.ok) {
                const error = await response.json();
                throw new ApiError(error.message || 'Erreur de téléchargement', response.status, error);
            }
            
            return await response.blob();
        } catch (error) {
            throw error;
        }
    }

    /**
     * Valider les données d'une ressource avant création/modification
     * @param {Object} resourceData - Données à valider
     * @returns {Object} Erreurs de validation
     */
    validateResourceData(resourceData) {
        const errors = {};

        // Titre obligatoire (backend: min 3 caractères)
        if (!resourceData.titre || resourceData.titre.trim().length < 3) {
            errors.titre = 'Le titre doit contenir au moins 3 caractères';
        }

        // Description optionnelle (backend: max 2000 caractères)
        if (resourceData.description && resourceData.description.length > 2000) {
            errors.description = 'La description ne peut pas dépasser 2000 caractères';
        }

        // Type obligatoire (backend: document, media, video, lien)
        const validTypes = ['document', 'media', 'video', 'lien'];
        if (!resourceData.type || !validTypes.includes(resourceData.type)) {
            errors.type = `Le type doit être: ${validTypes.join(', ')}`;
        }

        // Contenu obligatoire (backend: objet requis)
        if (!resourceData.contenu || typeof resourceData.contenu !== 'object') {
            errors.contenu = 'Le contenu est obligatoire et doit être un objet';
        }

        // Tags optionnels (backend: max 10 tags de 50 caractères chacun)
        if (resourceData.tags && Array.isArray(resourceData.tags)) {
            if (resourceData.tags.length > 10) {
                errors.tags = 'Maximum 10 tags autorisés';
            }
            resourceData.tags.forEach((tag, index) => {
                if (typeof tag !== 'string' || tag.length > 50) {
                    errors[`tag_${index}`] = 'Chaque tag doit être un texte de maximum 50 caractères';
                }
            });
        }

        return errors;
    }

    /**
     * Valider une URL
     * @param {string} url - URL à valider
     * @returns {boolean} Validité de l'URL
     */
    isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Générer les métadonnées d'un fichier pour l'upload
     * @param {File} file - Fichier à analyser
     * @returns {Object} Métadonnées du fichier
     */
    generateFileMetadata(file) {
        return {
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified,
            extension: file.name.split('.').pop().toLowerCase()
        };
    }
}

const resourcesApi = new ResourcesApi();

export { resourcesApi, ResourcesApi };