/**
 * 🔧 Configuration API Commune - Diagana School
 * Base URL, intercepteurs, gestion d'erreurs, tokens JWT
 */

const API_CONFIG = {
    BASE_URL: '/api',
    ENDPOINTS: {
        AUTH: '/auth',
        PROFILE: '/profil',
        RESOURCES: '/ressources', // Note: 'ressources' comme dans le backend
        COLLECTIONS: '/collections',
        COMMENTS: '/commentaires'
    },
    // Tailles maximales des fichiers
    MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
    // Types de fichiers autorisés
    ALLOWED_FILE_TYPES: [
        'pdf', 'docx', 'txt', 'jpg', 'jpeg', 'png', 'gif', 
        'mp4', 'avi', 'mov'
    ]
};

class ApiClient {
    constructor() {
        this.baseURL = API_CONFIG.BASE_URL;
        this.token = localStorage.getItem('authToken');
    }

    getAuthHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };
        
        if (this.token) {
            headers.Authorization = `Bearer ${this.token}`;
        }
        
        return headers;
    }

    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('authToken', token);
        } else {
            localStorage.removeItem('authToken');
        }
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: this.getAuthHeaders(),
            ...options
        };

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                const error = await response.json();
                console.error(`❌ Erreur ${response.status} sur ${endpoint}:`, error);
                throw new ApiError(error.message || 'Erreur API', response.status, error);
            }

            return await response.json();
        } catch (error) {
            if (error instanceof ApiError) {
                throw error;
            }
            
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new ApiError('Erreur de connexion au serveur', 500);
            }
            
            throw new ApiError('Erreur inconnue', 500, error);
        }
    }

    async get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }

    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }

    /**
     * Méthode spécialisée pour l'upload de fichiers avec FormData
     * @param {string} endpoint - Endpoint de l'API
     * @param {FormData} formData - Données du formulaire
     * @param {string} method - Méthode HTTP (POST ou PUT)
     * @returns {Promise<Object>} Réponse de l'API
     */
    async uploadFile(endpoint, formData, method = 'POST') {
        const headers = {};
        
        // Ajouter uniquement le token d'autorisation, pas Content-Type
        if (this.token) {
            headers.Authorization = `Bearer ${this.token}`;
        }
        
        return this.request(endpoint, {
            method: method,
            body: formData,
            headers: headers
        });
    }

    /**
     * Valider la taille et le type d'un fichier
     * @param {File} file - Fichier à valider
     * @returns {Object} Résultat de validation
     */
    validateFile(file) {
        const result = {
            valid: true,
            errors: []
        };
        
        if (!file) {
            result.valid = false;
            result.errors.push('Aucun fichier sélectionné');
            return result;
        }
        
        // Vérifier la taille
        if (file.size > API_CONFIG.MAX_FILE_SIZE) {
            result.valid = false;
            result.errors.push(`Le fichier est trop volumineux. Taille maximale: ${this.formatFileSize(API_CONFIG.MAX_FILE_SIZE)}`);
        }
        
        // Vérifier le type
        const fileExtension = file.name.split('.').pop().toLowerCase();
        if (!API_CONFIG.ALLOWED_FILE_TYPES.includes(fileExtension)) {
            result.valid = false;
            result.errors.push(`Type de fichier non autorisé. Types acceptés: ${API_CONFIG.ALLOWED_FILE_TYPES.join(', ')}`);
        }
        
        return result;
    }

    /**
     * Formater la taille d'un fichier en octets
     * @param {number} bytes - Taille en octets
     * @returns {string} Taille formatée
     */
    formatFileSize(bytes) {
        const units = ['B', 'KB', 'MB', 'GB'];
        let size = bytes;
        let unitIndex = 0;
        
        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }
        
        return `${size.toFixed(1)} ${units[unitIndex]}`;
    }

    /**
     * Vérifier si l'utilisateur est authentifié
     * @returns {boolean} État de connexion
     */
    isAuthenticated() {
        return !!this.token;
    }

    /**
     * Déconnecter l'utilisateur
     */
    logout() {
        this.setToken(null);
        // Rediriger vers la page de connexion si nécessaire
        if (window.location.hash !== '#auth') {
            window.location.hash = '#auth';
        }
    }

    /**
     * Gérer les erreurs 401 (non autorisé)
     * @param {ApiError} error - Erreur API
     */
    handleUnauthorized(error) {
        if (error.status === 401) {
            console.warn('Session expirée, redirection vers la connexion');
            this.logout();
        }
    }
}

class ApiError extends Error {
    constructor(message, status, details = null) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.details = details;
    }
}

const apiClient = new ApiClient();

export { apiClient, ApiError, API_CONFIG };
