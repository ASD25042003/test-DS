/**
 * Composant ResourceCard - Module Ressources
 * Carte de ressource pédagogique
 * Réplication exacte de l'interface test-CAT avec intégration backend
 */

class ResourceCard {
    constructor(resourceData, options = {}) {
        this.data = resourceData;
        this.options = {
            onClick: options.onClick || (() => {}),
            onLike: options.onLike || (() => {}),
            onFavorite: options.onFavorite || (() => {}),
            showActions: options.showActions !== false,
            ...options
        };
    }

    render() {
        const {
            id,
            titre,
            description,
            type,
            tags = [],
            matiere,
            niveau,
            auteur,
            stats = {},
            created_at,
            is_liked = false,
            is_favorited = false
        } = this.data;

        const timeAgo = this.formatTimeAgo(created_at);
        const typeInfo = this.getTypeInfo(type);
        const authorInitials = this.getAuthorInitials(auteur);
        const matiereColor = this.getMatiereColor(matiere);

        return `
            <div class="resource-card animate-fade-in cursor-pointer" 
                 data-resource-id="${id}"
                 data-type="${type}" 
                 data-subject="${this.normalizeSubject(matiere)}">
                
                <!-- En-tête avec badge de type et date -->
                <div class="flex justify-between items-start mb-2">
                    <span class="resource-type-badge ${type}">
                        ${typeInfo.icon} ${typeInfo.label}
                    </span>
                    <div class="text-xs" style="color: var(--color-gray-500);">
                        ${timeAgo}
                    </div>
                </div>
                
                <!-- Titre -->
                <h3 class="text-base font-semibold mb-2 hover:text-orange-600 transition-colors line-clamp-2" 
                    style="color: var(--color-gray-900); line-height: 1.3;">
                    ${this.escapeHtml(titre)}
                </h3>
                
                <!-- Description -->
                <p class="text-sm mb-3 line-clamp-2 flex-grow" style="color: var(--color-gray-600); line-height: 1.4;">
                    ${this.escapeHtml(description)}
                </p>
                
                <!-- Tags matière et niveau -->
                <div class="flex flex-wrap gap-1 mb-3">
                    ${matiere ? `
                        <span class="px-2 py-1 text-xs font-medium rounded-full" 
                              style="background: ${matiereColor.bg}; color: ${matiereColor.text};">
                            ${this.escapeHtml(matiere)}
                        </span>
                    ` : ''}
                    ${niveau ? `
                        <span class="px-2 py-1 text-xs font-medium rounded-full" 
                              style="background: ${matiereColor.bg}; color: ${matiereColor.text};">
                            ${this.escapeHtml(niveau)}
                        </span>
                    ` : ''}
                </div>
                
                <!-- Footer avec auteur et stats -->
                <div class="flex justify-between items-center mt-auto">
                    <div class="flex items-center space-x-2">
                        <div class="user-avatar-small" title="${this.escapeHtml(auteur?.nom || '')} ${this.escapeHtml(auteur?.prenom || '')}">
                            ${authorInitials}
                        </div>
                        <span class="text-xs truncate max-w-20" style="color: var(--color-gray-600);">
                            ${this.escapeHtml(this.getAuthorDisplayName(auteur))}
                        </span>
                    </div>
                    
                    <div class="flex items-center space-x-2 text-xs" style="color: var(--color-gray-500);">
                        ${this.options.showActions ? `
                            <button class="like-btn hover:text-red-500 transition-colors flex items-center ${is_liked ? 'text-red-500' : ''}" 
                                    data-resource-id="${id}" 
                                    title="${is_liked ? 'Retirer le like' : 'Aimer cette ressource'}">
                                👍 <span class="ml-1">${stats.likes || 0}</span>
                            </button>
                            <button class="favorite-btn hover:text-yellow-500 transition-colors ${is_favorited ? 'text-yellow-500' : ''}"
                                    data-resource-id="${id}"
                                    title="${is_favorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}">
                                ${is_favorited ? '⭐' : '☆'}
                            </button>
                        ` : `
                            <span class="flex items-center">
                                👍 <span class="ml-1">${stats.likes || 0}</span>
                            </span>
                        `}
                        <span title="Commentaires" class="flex items-center">
                            💬 <span class="ml-1">${stats.commentaires || 0}</span>
                        </span>
                        <span title="Vues" class="flex items-center">
                            👁 <span class="ml-1">${stats.vues || 0}</span>
                        </span>
                    </div>
                </div>
            </div>
        `;
    }

    // Méthodes utilitaires
    getTypeInfo(type) {
        const types = {
            'document': { icon: '📄', label: 'Document' },
            'media': { icon: '🖼️', label: 'Média' },
            'video': { icon: '🎥', label: 'Vidéo' },
            'lien': { icon: '🔗', label: 'Lien' }
        };
        return types[type] || { icon: '📄', label: 'Document' };
    }

    getMatiereColor(matiere) {
        if (!matiere) return { bg: 'rgba(217, 119, 6, 0.1)', text: 'var(--color-accent-primary)' };
        
        const matiereKey = matiere.toLowerCase();
        const colors = {
            'mathématiques': { bg: 'rgba(217, 119, 6, 0.1)', text: '#d97706' },
            'mathematiques': { bg: 'rgba(217, 119, 6, 0.1)', text: '#d97706' },
            'sciences': { bg: 'rgba(5, 150, 105, 0.1)', text: '#059669' },
            'français': { bg: 'rgba(14, 165, 233, 0.1)', text: '#0ea5e9' },
            'francais': { bg: 'rgba(14, 165, 233, 0.1)', text: '#0ea5e9' },
            'histoire': { bg: 'rgba(124, 58, 237, 0.1)', text: '#7c3aed' },
            'anglais': { bg: 'rgba(168, 85, 247, 0.1)', text: '#a855f7' },
            'géographie': { bg: 'rgba(34, 197, 94, 0.1)', text: '#22c55e' },
            'geographie': { bg: 'rgba(34, 197, 94, 0.1)', text: '#22c55e' }
        };
        
        return colors[matiereKey] || { bg: 'rgba(107, 114, 128, 0.1)', text: '#6b7280' };
    }

    getAuthorInitials(auteur) {
        if (!auteur) return 'AN';
        
        const prenom = auteur.prenom || '';
        const nom = auteur.nom || '';
        
        if (prenom && nom) {
            return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
        }
        
        if (nom) {
            return nom.substring(0, 2).toUpperCase();
        }
        
        return 'AN'; // Auteur Anonyme
    }

    getAuthorDisplayName(auteur) {
        if (!auteur) return 'Auteur inconnu';
        
        const prenom = auteur.prenom || '';
        const nom = auteur.nom || '';
        
        if (prenom && nom) {
            return `${prenom} ${nom}`;
        }
        
        return nom || prenom || 'Auteur inconnu';
    }

    normalizeSubject(matiere) {
        if (!matiere) return '';
        return matiere.toLowerCase()
            .replace('é', 'e')
            .replace('è', 'e')
            .replace('à', 'a')
            .replace('ç', 'c')
            .replace(/\s+/g, '');
    }

    formatTimeAgo(dateString) {
        if (!dateString) return 'Date inconnue';
        
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now - date;
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInHours / 24);
        const diffInWeeks = Math.floor(diffInDays / 7);

        if (diffInHours < 1) return 'À l\'instant';
        if (diffInHours === 1) return 'Il y a 1h';
        if (diffInHours < 24) return `Il y a ${diffInHours}h`;
        if (diffInDays === 1) return 'Hier';
        if (diffInDays < 7) return `Il y a ${diffInDays}j`;
        if (diffInWeeks === 1) return 'Il y a 1sem';
        if (diffInWeeks < 4) return `Il y a ${diffInWeeks}sem`;
        
        return date.toLocaleDateString('fr-FR', { 
            day: 'numeric', 
            month: 'short' 
        });
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Méthode statique pour créer et insérer une carte
    static create(resourceData, containerSelector, options = {}) {
        const container = document.querySelector(containerSelector);
        if (!container) {
            console.error('ResourceCard: Container non trouvé');
            return null;
        }

        const card = new ResourceCard(resourceData, options);
        const cardElement = document.createElement('div');
        cardElement.innerHTML = card.render();
        const cardNode = cardElement.firstElementChild;

        // Attacher les événements
        card.attachEventListeners(cardNode);
        
        container.appendChild(cardNode);
        return cardNode;
    }

    attachEventListeners(cardElement) {
        // Clic sur la carte pour voir le détail
        cardElement.addEventListener('click', (e) => {
            // Ne pas déclencher si on clique sur les boutons d'action
            if (e.target.classList.contains('like-btn') || 
                e.target.classList.contains('favorite-btn') ||
                e.target.closest('.like-btn') ||
                e.target.closest('.favorite-btn')) {
                return;
            }
            this.options.onClick(this.data, cardElement);
        });

        // Bouton like
        const likeBtn = cardElement.querySelector('.like-btn');
        likeBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.options.onLike(this.data.id, !this.data.is_liked);
        });

        // Bouton favori
        const favoriteBtn = cardElement.querySelector('.favorite-btn');
        favoriteBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            this.options.onFavorite(this.data.id, !this.data.is_favorited);
        });
    }

    // Méthode pour mettre à jour les stats en temps réel
    updateStats(newStats) {
        this.data.stats = { ...this.data.stats, ...newStats };
    }

    updateLikeStatus(isLiked, newCount) {
        this.data.is_liked = isLiked;
        if (newCount !== undefined) {
            this.data.stats.likes = newCount;
        }
    }

    updateFavoriteStatus(isFavorited) {
        this.data.is_favorited = isFavorited;
    }
}

export default ResourceCard;