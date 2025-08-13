/**
 * 📁 Client API Collections - Diagana School
 * Communication avec l'API backend /api/collections
 */

import { apiClient, ApiError, API_CONFIG } from '/static/api/index.js';

class CollectionsApi {
    constructor() {
        this.baseEndpoint = API_CONFIG.ENDPOINTS.COLLECTIONS;
    }

    /**
     * Récupérer toutes les collections avec filtres et pagination
     * @param {Object} options - Options de filtrage et pagination
     * @param {string} options.search - Terme de recherche
     * @param {boolean} options.is_public - Visibilité publique (backend utilise is_public)
     * @param {number} options.page - Numéro de page (défaut: 1)
     * @param {number} options.limit - Limite par page (défaut: 20)
     * @param {string} options.sortBy - Tri (created_at, ressources_count, nom)
     * @param {string} options.sortOrder - Ordre (asc, desc)
     * @returns {Promise<Object>} Liste paginée des collections
     */
    async getAll(options = {}) {
        try {
            const queryParams = new URLSearchParams();
            
            if (options.search) queryParams.append('search', options.search);
            if (typeof options.is_public === 'boolean') queryParams.append('is_public', options.is_public.toString());
            if (options.page) queryParams.append('page', options.page.toString());
            if (options.limit) queryParams.append('limit', options.limit.toString());
            if (options.sortBy) queryParams.append('sortBy', options.sortBy);
            if (options.sortOrder) queryParams.append('sortOrder', options.sortOrder);
            
            const endpoint = queryParams.toString() 
                ? `${this.baseEndpoint}?${queryParams.toString()}`
                : this.baseEndpoint;
                
            return await apiClient.get(endpoint);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Récupérer une collection par ID
     * @param {string} id - ID de la collection
     * @returns {Promise<Object>} Détails de la collection
     */
    async getById(id) {
        try {
            return await apiClient.get(`${this.baseEndpoint}/${id}`);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Créer une nouvelle collection
     * @param {Object} collectionData - Données de la collection
     * @param {string} collectionData.nom - Nom de la collection
     * @param {string} collectionData.description - Description
     * @param {boolean} collectionData.is_public - Visibilité publique
     * @returns {Promise<Object>} Collection créée
     */
    async create(collectionData) {
        try {
            return await apiClient.post(this.baseEndpoint, collectionData);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Mettre à jour une collection
     * @param {string} id - ID de la collection
     * @param {Object} collectionData - Nouvelles données
     * @returns {Promise<Object>} Collection mise à jour
     */
    async update(id, collectionData) {
        try {
            return await apiClient.put(`${this.baseEndpoint}/${id}`, collectionData);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Supprimer une collection
     * @param {string} id - ID de la collection
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
     * Ajouter une ressource à une collection
     * @param {string} collectionId - ID de la collection
     * @param {Object} ressourceData - Données de la ressource à ajouter
     * @param {string} ressourceData.ressource_id - ID de la ressource (backend utilise ressource_id)
     * @param {number} ressourceData.ordre - Ordre dans la collection (optionnel)
     * @returns {Promise<Object>} Confirmation d'ajout
     */
    async addRessource(collectionId, ressourceData) {
        try {
            return await apiClient.post(`${this.baseEndpoint}/${collectionId}/ressources`, ressourceData);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Supprimer une ressource d'une collection
     * @param {string} collectionId - ID de la collection
     * @param {string} ressourceId - ID de la ressource à supprimer
     * @returns {Promise<Object>} Confirmation de suppression
     */
    async removeRessource(collectionId, ressourceId) {
        try {
            return await apiClient.delete(`${this.baseEndpoint}/${collectionId}/ressources/${ressourceId}`);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Réorganiser les ressources dans une collection
     * @param {string} collectionId - ID de la collection
     * @param {Array} ressources - Tableau avec l'ordre des ressources (backend format)
     * @param {string} ressources[].ressource_id - ID de la ressource
     * @param {number} ressources[].ordre - Nouvel ordre
     * @returns {Promise<Object>} Confirmation de réorganisation
     */
    async reorderRessources(collectionId, ressources) {
        try {
            return await apiClient.put(`${this.baseEndpoint}/${collectionId}/reorder`, {
                ressources
            });
        } catch (error) {
            throw error;
        }
    }

    /**
     * Dupliquer une collection
     * @param {string} collectionId - ID de la collection à dupliquer
     * @param {Object} options - Options de duplication
     * @param {string} options.nouveauNom - Nouveau nom (optionnel)
     * @param {boolean} options.includeRessources - Inclure les ressources (défaut: true)
     * @returns {Promise<Object>} Collection dupliquée
     */
    async duplicate(collectionId, options = {}) {
        try {
            return await apiClient.post(`${this.baseEndpoint}/${collectionId}/duplicate`, options);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Récupérer les collections populaires
     * @param {Object} options - Options de pagination
     * @returns {Promise<Object>} Collections populaires
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
     * Récupérer les collections récentes
     * @param {Object} options - Options de pagination
     * @returns {Promise<Object>} Collections récentes
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
     * Rechercher des collections
     * @param {Object} options - Critères de recherche
     * @param {string} options.q - Terme de recherche
     * @param {number} options.page - Page
     * @param {number} options.limit - Limite
     * @returns {Promise<Object>} Résultats de recherche
     */
    async search(options = {}) {
        try {
            const queryParams = new URLSearchParams();
            
            if (options.q) queryParams.append('q', options.q);
            if (options.page) queryParams.append('page', options.page.toString());
            if (options.limit) queryParams.append('limit', options.limit.toString());
            
            return await apiClient.get(`${this.baseEndpoint}/search?${queryParams.toString()}`);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Récupérer mes collections (utilisateur connecté)
     * @param {Object} options - Options de pagination
     * @returns {Promise<Object>} Mes collections
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
     * Récupérer les collections contenant une ressource spécifique
     * @param {string} ressourceId - ID de la ressource
     * @returns {Promise<Object>} Collections contenant la ressource
     */
    async getCollectionsByRessource(ressourceId) {
        try {
            return await apiClient.get(`${this.baseEndpoint}/by-ressource/${ressourceId}`);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Valider les données d'une collection avant création/modification
     * @param {Object} collectionData - Données à valider
     * @returns {Object} Erreurs de validation
     */
    validateCollectionData(collectionData) {
        const errors = {};

        // Nom obligatoire (backend: min 3 caractères, max 255)
        if (!collectionData.nom || collectionData.nom.trim().length < 3) {
            errors.nom = 'Le nom doit contenir au moins 3 caractères';
        } else if (collectionData.nom.length > 255) {
            errors.nom = 'Le nom ne peut pas dépasser 255 caractères';
        }

        // Description optionnelle (backend: max 2000 caractères)
        if (collectionData.description && collectionData.description.length > 2000) {
            errors.description = 'La description ne peut pas dépasser 2000 caractères';
        }

        // is_public optionnel (backend: boolean, défaut true)
        if (collectionData.is_public !== undefined && typeof collectionData.is_public !== 'boolean') {
            errors.is_public = 'La visibilité doit être un boolean';
        }

        return errors;
    }

    /**
     * Valider l'ordre des ressources
     * @param {Array} ressources - Tableau d'ordre des ressources
     * @returns {Object} Erreurs de validation
     */
    validateRessourcesOrder(ressources) {
        const errors = {};

        if (!Array.isArray(ressources)) {
            errors.global = 'L\'ordre des ressources doit être un tableau';
            return errors;
        }

        ressources.forEach((item, index) => {
            if (!item.ressource_id) {
                errors[`item_${index}`] = 'ID de ressource manquant';
            }
            if (typeof item.ordre !== 'number' || item.ordre < 0) {
                errors[`ordre_${index}`] = 'L\'ordre doit être un nombre positif';
            }
        });

        // Vérifier les doublons d'ID
        const ressourceIds = ressources.map(item => item.ressource_id);
        const uniqueIds = [...new Set(ressourceIds)];
        if (ressourceIds.length !== uniqueIds.length) {
            errors.global = 'Ressources dupliquées détectées';
        }

        // Vérifier les doublons d'ordre
        const ordres = ressources.map(item => item.ordre);
        const uniqueOrdres = [...new Set(ordres)];
        if (ordres.length !== uniqueOrdres.length) {
            errors.global = 'Ordres dupliqués détectés';
        }

        return errors;
    }

    /**
     * Trier les ressources d'une collection par ordre
     * @param {Array} ressources - Ressources à trier
     * @returns {Array} Ressources triées
     */
    sortRessourcesByOrder(ressources) {
        return [...ressources].sort((a, b) => {
            const orderA = a.ordre || 0;
            const orderB = b.ordre || 0;
            return orderA - orderB;
        });
    }

    /**
     * Générer un nouvel ordre pour ajouter une ressource
     * @param {Array} existingRessources - Ressources existantes
     * @returns {number} Nouvel ordre
     */
    generateNextOrder(existingRessources) {
        if (!existingRessources || existingRessources.length === 0) {
            return 1;
        }

        const maxOrder = Math.max(...existingRessources.map(r => r.ordre || 0));
        return maxOrder + 1;
    }
}

const collectionsApi = new CollectionsApi();

export { collectionsApi, CollectionsApi };