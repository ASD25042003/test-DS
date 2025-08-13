/**
 * 📡 Export centralisé des clients API - Diagana School
 * Point d'entrée unique pour tous les clients API frontend
 */

// Import du client de base et configuration
export { apiClient, ApiError, API_CONFIG } from '/static/api/index.js';

// Import des clients API spécialisés
export { authApi, AuthApi } from '/static/api/auth.js';
export { resourcesApi, ResourcesApi } from '/static/api/resources.js';
export { collectionsApi, CollectionsApi } from '/static/api/collections.js';
export { profileApi, ProfileApi } from '/static/api/profile.js';
export { commentsApi, CommentsApi } from '/static/api/comments.js';

/**
 * Instance globale des clients API
 * Usage recommandé pour l'application
 */
const api = {
    // Client de base
    client: undefined, // sera initialisé après import
    
    // Clients spécialisés
    auth: undefined,
    resources: undefined,
    collections: undefined,
    profile: undefined,
    comments: undefined
};

// Initialisation asynchrone (pour éviter les erreurs de circular imports)
const initializeApi = async () => {
    try {
        const { apiClient } = await import('/static/api/index.js');
        const { authApi } = await import('/static/api/auth.js');
        const { resourcesApi } = await import('/static/api/resources.js');
        const { collectionsApi } = await import('/static/api/collections.js');
        const { profileApi } = await import('/static/api/profile.js');
        const { commentsApi } = await import('/static/api/comments.js');
        
        api.client = apiClient;
        api.auth = authApi;
        api.resources = resourcesApi;
        api.collections = collectionsApi;
        api.profile = profileApi;
        api.comments = commentsApi;
        
        console.log('✅ Clients API initialisés');
        return api;
    } catch (error) {
        console.error('❌ Erreur initialisation API:', error);
        throw error;
    }
};

/**
 * Utilitaire pour obtenir une instance complète des APIs
 * @returns {Promise<Object>} Objet avec tous les clients API
 */
export const getApi = async () => {
    if (!api.client) {
        await initializeApi();
    }
    return api;
};

/**
 * Usage recommandé dans les modules de l'application
 * 
 * @example
 * import { getApi } from '/static/api/clients.js';
 * 
 * const api = await getApi();
 * const resources = await api.resources.getAll();
 * const user = await api.auth.getProfile();
 */

export default api;