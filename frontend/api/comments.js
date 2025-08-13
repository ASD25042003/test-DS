/**
 * 💬 Client API Commentaires - Diagana School
 * Communication avec l'API backend /api/commentaires
 */

import { apiClient, ApiError, API_CONFIG } from '/static/api/index.js';

class CommentsApi {
    constructor() {
        this.baseEndpoint = API_CONFIG.ENDPOINTS.COMMENTS;
    }

    /**
     * Récupérer tous les commentaires d'une ressource
     * @param {string} ressourceId - ID de la ressource
     * @param {Object} options - Options de pagination
     * @param {number} options.page - Numéro de page (défaut: 1)
     * @param {number} options.limit - Limite par page (défaut: 20)
     * @param {string} options.sortBy - Tri (created_at, updated_at)
     * @param {string} options.sortOrder - Ordre (asc, desc)
     * @returns {Promise<Object>} Liste paginée des commentaires
     */
    async getByRessource(ressourceId, options = {}) {
        try {
            const queryParams = new URLSearchParams();
            
            if (options.page) queryParams.append('page', options.page.toString());
            if (options.limit) queryParams.append('limit', options.limit.toString());
            if (options.sortBy) queryParams.append('sortBy', options.sortBy);
            if (options.sortOrder) queryParams.append('sortOrder', options.sortOrder);
            
            const endpoint = queryParams.toString() 
                ? `${this.baseEndpoint}/ressource/${ressourceId}?${queryParams.toString()}`
                : `${this.baseEndpoint}/ressource/${ressourceId}`;
                
            return await apiClient.get(endpoint);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Créer un nouveau commentaire
     * @param {Object} commentData - Données du commentaire
     * @param {string} commentData.ressource_id - ID de la ressource
     * @param {string} commentData.contenu - Contenu du commentaire
     * @param {string} commentData.parent_id - ID du commentaire parent (pour les réponses)
     * @returns {Promise<Object>} Commentaire créé
     */
    async create(commentData) {
        try {
            return await apiClient.post(this.baseEndpoint, commentData);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Mettre à jour un commentaire
     * @param {string} id - ID du commentaire
     * @param {Object} commentData - Nouvelles données
     * @param {string} commentData.contenu - Nouveau contenu
     * @returns {Promise<Object>} Commentaire mis à jour
     */
    async update(id, commentData) {
        try {
            return await apiClient.put(`${this.baseEndpoint}/${id}`, commentData);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Supprimer un commentaire
     * @param {string} id - ID du commentaire
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
     * Créer une réponse à un commentaire
     * @param {string} parentId - ID du commentaire parent
     * @param {Object} replyData - Données de la réponse
     * @param {string} replyData.ressource_id - ID de la ressource
     * @param {string} replyData.contenu - Contenu de la réponse
     * @returns {Promise<Object>} Réponse créée
     */
    async reply(parentId, replyData) {
        try {
            return await this.create({
                ...replyData,
                parent_id: parentId
            });
        } catch (error) {
            throw error;
        }
    }

    /**
     * Organiser les commentaires en arbre hiérarchique
     * @param {Array} comments - Liste plate des commentaires
     * @returns {Array} Commentaires organisés en arbre
     */
    buildCommentsTree(comments) {
        if (!Array.isArray(comments)) return [];

        const commentMap = new Map();
        const rootComments = [];

        // Créer une map des commentaires par ID
        comments.forEach(comment => {
            commentMap.set(comment.id, { ...comment, replies: [] });
        });

        // Organiser en arbre
        comments.forEach(comment => {
            const commentWithReplies = commentMap.get(comment.id);
            
            if (comment.parent_id) {
                // C'est une réponse
                const parent = commentMap.get(comment.parent_id);
                if (parent) {
                    parent.replies.push(commentWithReplies);
                }
            } else {
                // C'est un commentaire racine
                rootComments.push(commentWithReplies);
            }
        });

        return rootComments;
    }

    /**
     * Compter le nombre total de réponses dans un arbre de commentaires
     * @param {Object} comment - Commentaire avec ses réponses
     * @returns {number} Nombre total de réponses
     */
    countReplies(comment) {
        if (!comment.replies || comment.replies.length === 0) {
            return 0;
        }

        let count = comment.replies.length;
        comment.replies.forEach(reply => {
            count += this.countReplies(reply);
        });

        return count;
    }

    /**
     * Aplatir un arbre de commentaires en liste
     * @param {Array} commentsTree - Arbre de commentaires
     * @returns {Array} Liste plate de commentaires
     */
    flattenCommentsTree(commentsTree) {
        const flatComments = [];

        const flatten = (comments, level = 0) => {
            comments.forEach(comment => {
                flatComments.push({ ...comment, level });
                if (comment.replies && comment.replies.length > 0) {
                    flatten(comment.replies, level + 1);
                }
            });
        };

        flatten(commentsTree);
        return flatComments;
    }

    /**
     * Valider les données d'un commentaire avant création/modification
     * @param {Object} commentData - Données à valider
     * @returns {Object} Erreurs de validation
     */
    validateCommentData(commentData) {
        const errors = {};

        // Contenu obligatoire
        if (!commentData.contenu || commentData.contenu.trim().length === 0) {
            errors.contenu = 'Le contenu du commentaire est obligatoire';
        } else if (commentData.contenu.trim().length < 3) {
            errors.contenu = 'Le commentaire doit contenir au moins 3 caractères';
        } else if (commentData.contenu.length > 2000) {
            errors.contenu = 'Le commentaire ne peut pas dépasser 2000 caractères';
        }

        // ID de ressource obligatoire pour nouveau commentaire
        if (!commentData.parent_id && !commentData.ressource_id) {
            errors.ressource_id = 'L\'ID de la ressource est obligatoire';
        }

        // Vérifier format UUID si IDs fournis
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        
        if (commentData.ressource_id && !uuidRegex.test(commentData.ressource_id)) {
            errors.ressource_id = 'Format d\'ID de ressource invalide';
        }

        if (commentData.parent_id && !uuidRegex.test(commentData.parent_id)) {
            errors.parent_id = 'Format d\'ID de commentaire parent invalide';
        }

        return errors;
    }

    /**
     * Détecter les mentions d'utilisateurs dans un commentaire
     * @param {string} content - Contenu du commentaire
     * @returns {Array} Liste des mentions trouvées
     */
    extractMentions(content) {
        if (!content || typeof content !== 'string') return [];

        // Pattern pour @username ou @"Nom Prénom"
        const mentionRegex = /@(?:"([^"]+)"|([a-zA-Z0-9_.]+))/g;
        const mentions = [];
        let match;

        while ((match = mentionRegex.exec(content)) !== null) {
            const mention = match[1] || match[2]; // Nom entre guillemets ou simple
            mentions.push({
                mention: match[0], // @"Nom" ou @username
                name: mention,
                start: match.index,
                end: match.index + match[0].length
            });
        }

        return mentions;
    }

    /**
     * Formater un commentaire pour l'affichage
     * @param {Object} comment - Commentaire brut
     * @returns {Object} Commentaire formaté
     */
    formatComment(comment) {
        if (!comment) return null;

        return {
            ...comment,
            // Formater les dates
            created_at_formatted: this.formatDate(comment.created_at),
            updated_at_formatted: comment.updated_at ? this.formatDate(comment.updated_at) : null,
            
            // Détecter les mentions
            mentions: this.extractMentions(comment.contenu),
            
            // Indicateurs
            isEdited: comment.updated_at && comment.updated_at !== comment.created_at,
            hasReplies: comment.replies && comment.replies.length > 0,
            repliesCount: this.countReplies(comment)
        };
    }

    /**
     * Formater une date en format relatif
     * @param {string} dateString - Date au format ISO
     * @returns {string} Date formatée
     */
    formatDate(dateString) {
        if (!dateString) return '';

        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffMs = now - date;
            const diffMins = Math.floor(diffMs / (1000 * 60));
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

            if (diffMins < 1) {
                return 'À l\'instant';
            } else if (diffMins < 60) {
                return `Il y a ${diffMins} min`;
            } else if (diffHours < 24) {
                return `Il y a ${diffHours}h`;
            } else if (diffDays < 7) {
                return `Il y a ${diffDays}j`;
            } else {
                return date.toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
                });
            }
        } catch (error) {
            return dateString;
        }
    }

    /**
     * Calculer les statistiques d'un fil de commentaires
     * @param {Array} commentsTree - Arbre de commentaires
     * @returns {Object} Statistiques
     */
    getCommentsStats(commentsTree) {
        if (!Array.isArray(commentsTree)) return {};

        let totalComments = 0;
        let totalReplies = 0;
        let maxDepth = 0;
        const authors = new Set();

        const analyzeComments = (comments, depth = 0) => {
            maxDepth = Math.max(maxDepth, depth);
            
            comments.forEach(comment => {
                totalComments++;
                authors.add(comment.author_id);

                if (comment.replies && comment.replies.length > 0) {
                    totalReplies += comment.replies.length;
                    analyzeComments(comment.replies, depth + 1);
                }
            });
        };

        analyzeComments(commentsTree);

        return {
            totalComments,
            totalReplies,
            uniqueAuthors: authors.size,
            maxDepth,
            threadsCount: commentsTree.length
        };
    }
}

const commentsApi = new CommentsApi();

export { commentsApi, CommentsApi };