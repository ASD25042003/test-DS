/**
 * ResourceFullPageViewer - Composant pleine page pour la consultation des ressources
 * Version optimisée avec design moderne et UX améliorée
 */

class ResourceFullPageViewer {
    constructor(containerSelector, options = {}) {
        this.container = document.querySelector(containerSelector);
        this.options = {
            onBack: options.onBack || (() => window.history.back()),
            onEdit: options.onEdit || (() => {}),
            onDelete: options.onDelete || (() => {}),
            onLike: options.onLike || (() => {}),
            onFavorite: options.onFavorite || (() => {}),
            onDownload: options.onDownload || (() => {}),
            onComment: options.onComment || (() => {}),
            onShare: options.onShare || (() => {}),
            onAddToCollection: options.onAddToCollection || (() => {}),
            loadSimilarResources: options.loadSimilarResources || (() => Promise.resolve([])),
            showActions: options.showActions !== false,
            ...options
        };

        this.currentResource = null;
        this.similarResources = [];
        this.isOwner = false;
        this.isLiked = false;
        this.isFavorited = false;
        this.comments = [];
        
        this.init();
    }

    init() {
        if (!this.container) {
            console.error('ResourceFullPageViewer: Container non trouvé');
            return;
        }
    }

    async showResource(resourceData, isOwner = false) {
        if (!resourceData || !resourceData.id) {
            console.error('ResourceFullPageViewer: Ressource invalide ou sans ID', resourceData);
            return;
        }
        
        this.currentResource = resourceData;
        this.isOwner = isOwner;
        this.isLiked = resourceData.liked || false;
        this.isFavorited = resourceData.favorited || false;
        
        // Charger les ressources similaires
        this.similarResources = await this.options.loadSimilarResources(resourceData);
        
        this.render();
        this.attachEventListeners();
        
        // Incrémenter le compteur de vues seulement si l'ID est présent
        if (resourceData.id) {
            this.incrementViewCount();
        }
        
        // Mettre à jour l'URL
        this.updateURL(resourceData.id);
        
        // Scroll to top
        window.scrollTo(0, 0);
    }

    render() {
        const resource = this.currentResource;
        if (!resource) return;

        const template = `
            <div id="resource-fullpage-viewer" class="min-h-screen bg-white animate-fade-in">
                <!-- Bouton retour uniquement, sans header -->
                <div class="fixed top-4 left-4 z-50">
                    <button id="back-btn" class="flex items-center text-gray-600 hover:text-gray-900 transition-colors py-2 px-3 rounded-lg bg-white/90 backdrop-blur-sm shadow-md hover:shadow-lg">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span class="font-medium">Retour aux ressources</span>
                    </button>
                </div>

                <!-- Contenu principal -->
                <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
                    <!-- En-tête de la ressource -->
                    <div class="mb-8">
                        ${this.renderResourceHeader()}
                    </div>

                    <!-- Zone de contenu principal -->
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                        <!-- Visualiseur de document (2/3 sur desktop) -->
                        <div class="lg:col-span-2">
                            ${this.renderMainContent()}
                        </div>

                        <!-- Panneau latéral d'informations (1/3 sur desktop) -->
                        <div class="space-y-6">
                            ${this.renderSidebar()}
                        </div>
                    </div>
                </main>

                <!-- Section commentaires (pleine largeur) -->
                ${this.renderCommentsSection()}

                <!-- Barre d'actions flottante mobile -->
                ${this.renderMobileActions()}
            </div>
        `;

        this.container.innerHTML = template;
    }


    renderHeaderActions() {
        // Cette méthode n'est plus utilisée dans le header mais gardée pour les actions du sidebar
        if (!this.options.showActions) return '';

        return `
            <button id="like-btn" class="action-btn btn-secondary ${this.isLiked ? 'liked' : ''}">
                <svg class="w-4 h-4" fill="${this.isLiked ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
                J'aime
            </button>
            
            <button id="favorite-btn" class="action-btn btn-secondary ${this.isFavorited ? 'favorited' : ''}">
                <svg class="w-4 h-4" fill="${this.isFavorited ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                </svg>
                Sauvegarder
            </button>
        `;
    }

    renderResourceHeader() {
        const resource = this.currentResource;
        if (!resource) return '';
        
        return `
            <!-- Tags de catégorie -->
            <div class="flex flex-wrap items-center gap-2 mb-4">
                <span class="tag ${resource.type}">
                    ${this.getTypeLabel(resource.type)}
                </span>
                ${resource.matiere ? `
                    <span class="tag subject">
                        ${this.escapeHtml(resource.matiere)}
                    </span>
                ` : ''}
                ${resource.niveau ? `
                    <span class="tag level">
                        ${this.escapeHtml(resource.niveau)}
                    </span>
                ` : ''}
            </div>
            
            <!-- Titre -->
            <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                ${this.escapeHtml(resource.titre)}
            </h1>
            
            <!-- Description -->
            ${resource.description ? `
                <p class="text-lg text-gray-600 leading-relaxed mb-6 break-all overflow-wrap-anywhere">
                    ${this.escapeHtml(resource.description)}
                </p>
            ` : ''}
            
            <!-- Métadonnées importantes -->
            <div class="flex flex-wrap items-center gap-6 text-sm text-gray-500">
                <!-- Auteur -->
                <div class="flex items-center gap-2">
                    ${this.renderAuthorAvatar(resource.auteur)}
                    <div>
                        <div class="font-medium text-gray-700">
                            ${this.getAuthorDisplayName(resource.auteur)}
                        </div>
                        <div class="text-xs">
                            ${resource.auteur?.role || 'Membre'}
                        </div>
                    </div>
                </div>
                
                <!-- Date -->
                <div class="flex items-center gap-1">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path>
                    </svg>
                    ${this.formatTimeAgo(resource.created_at)}
                </div>
                
                <!-- Statistiques -->
                <div class="flex items-center gap-4">
                    <span>👁 ${this.formatNumber(resource.views_count || resource.stats?.vues || 0)} vues</span>
                    <span>❤️ ${this.formatNumber(resource.likes_count || resource.stats?.likes || 0)} j'aime</span>
                    <span>💬 ${this.formatNumber(resource.comments_count || resource.stats?.commentaires || 0)} commentaires</span>
                    <span>⬇️ ${this.formatNumber(resource.downloads_count || resource.stats?.telechargements || 0)} téléchargements</span>
                </div>
            </div>
        `;
    }

    renderMainContent() {
        const resource = this.currentResource;
        if (!resource) return '';
        
        return `
            <div class="primary-card">
                <div class="p-6">
                    ${this.renderResourceContent(resource)}
                </div>
                
                ${this.renderViewerToolbar(resource)}
            </div>
        `;
    }

    renderViewerToolbar(resource) {
        if (resource.type !== 'document' && resource.type !== 'media') return '';
        
        return `
            <div class="flex items-center justify-between p-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
                <div class="flex items-center gap-2">
                    <button class="p-2 hover:bg-gray-200 rounded transition-colors" title="Zoom avant">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path>
                        </svg>
                    </button>
                    <button class="p-2 hover:bg-gray-200 rounded transition-colors" title="Zoom arrière">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"></path>
                        </svg>
                    </button>
                    <span class="px-3 py-1 bg-white rounded border text-sm">100%</span>
                </div>
                
                <button class="action-btn btn-secondary text-sm" onclick="window.open('${resource.contenu?.file_url || resource.contenu?.url || ''}', '_blank')">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                    </svg>
                    Ouvrir dans un nouvel onglet
                </button>
            </div>
        `;
    }

    renderSidebar() {
        return `
            <!-- Actions rapides -->
            ${this.renderActionsBox()}
            
            <!-- Ressources similaires -->
            ${this.renderSimilarResources()}
            
            <!-- Tags -->
            ${this.renderTags()}
        `;
    }

    renderActionsBox() {
        const resource = this.currentResource;
        
        return `
            <div class="secondary-card">
                <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
                    <span>⚡</span> Actions
                </h3>
                <div class="space-y-2">
                    <button id="download-action" class="w-full action-btn btn-primary">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        Télécharger le fichier
                    </button>
                    
                    <button id="share-action" class="w-full action-btn btn-secondary">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
                        </svg>
                        Partager
                    </button>
                    
                    <button id="collection-action" class="w-full action-btn btn-secondary">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                        </svg>
                        Ajouter à une collection
                    </button>
                    
                    ${this.isOwner ? `
                        <hr class="my-2 border-gray-200">
                        <button id="edit-action" class="w-full action-btn btn-secondary text-green-600">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                            Modifier
                        </button>
                        <button id="delete-action" class="w-full action-btn btn-secondary text-red-600">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                            Supprimer
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }

    renderSimilarResources() {
        if (!this.similarResources || this.similarResources.length === 0) return '';
        
        return `
            <div class="secondary-card">
                <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
                    <span>📚</span> Ressources similaires
                </h3>
                <div class="space-y-3">
                    ${this.similarResources.slice(0, 3).map(res => `
                        <a href="#resources/view/${res.id}" class="block p-3 bg-white rounded-lg hover:shadow-md transition-all">
                            <div class="flex items-start gap-3">
                                <span class="text-2xl">${this.getTypeIcon(res.type)}</span>
                                <div class="flex-1 min-w-0">
                                    <h4 class="font-medium text-sm text-gray-900 truncate">
                                        ${this.escapeHtml(res.titre)}
                                    </h4>
                                    <p class="text-xs text-gray-500 mt-1">
                                        Par ${this.getAuthorDisplayName(res.auteur)}
                                    </p>
                                </div>
                            </div>
                        </a>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderTags() {
        const resource = this.currentResource;
        const tags = resource.tags || [];
        
        // Ajouter des tags basés sur les métadonnées
        if (resource.matiere) tags.push(resource.matiere);
        if (resource.niveau) tags.push(resource.niveau);
        
        if (tags.length === 0) return '';
        
        return `
            <div class="secondary-card">
                <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
                    <span>🏷️</span> Tags
                </h3>
                <div class="flex flex-wrap gap-2">
                    ${tags.map(tag => `
                        <span class="tag-chip">
                            #${this.escapeHtml(tag.toLowerCase())}
                        </span>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderCommentsSection() {
        const resource = this.currentResource;
        const commentsCount = resource.comments_count || resource.stats?.commentaires || 0;
        
        return `
            <section class="comment-section py-12">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <span>💬</span> Commentaires (${commentsCount})
                    </h2>
                    
                    <!-- Formulaire d'ajout de commentaire -->
                    <div class="bg-white rounded-lg p-6 mb-6">
                        <div class="flex gap-4">
                            ${this.renderUserAvatar()}
                            <div class="flex-1">
                                <textarea 
                                    id="comment-input"
                                    placeholder="Ajouter un commentaire..."
                                    class="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    rows="3"></textarea>
                                <div class="flex justify-end mt-3 gap-2">
                                    <button class="action-btn btn-secondary" onclick="this.previousElementSibling.previousElementSibling.value=''">
                                        Annuler
                                    </button>
                                    <button id="post-comment-btn" class="action-btn btn-primary">
                                        Publier
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Liste des commentaires -->
                    <div id="comments-list" class="space-y-4">
                        ${this.renderCommentsList()}
                    </div>
                </div>
            </section>
        `;
    }

    renderCommentsList() {
        // Pour l'instant, afficher un message par défaut
        // Dans une vraie implémentation, charger les commentaires depuis l'API
        return `
            <div class="text-center py-8 text-gray-500">
                <p class="mb-4">Soyez le premier à commenter cette ressource !</p>
            </div>
        `;
    }

    renderMobileActions() {
        return `
            <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 md:hidden">
                <div class="flex gap-2">
                    <button class="flex-1 action-btn btn-secondary text-sm ${this.isLiked ? 'liked' : ''}" id="mobile-like">
                        ❤️ J'aime
                    </button>
                    <button class="flex-1 action-btn btn-secondary text-sm ${this.isFavorited ? 'favorited' : ''}" id="mobile-favorite">
                        ⭐ Sauvegarder
                    </button>
                    <button class="flex-1 action-btn btn-primary text-sm" id="mobile-download">
                        ⬇️ Télécharger
                    </button>
                </div>
            </div>
        `;
    }

    renderResourceContent(resource) {
        if (!resource.contenu) {
            return '<p class="text-gray-500">Aucun contenu disponible</p>';
        }

        const { type, contenu } = resource;

        switch (type) {
            case 'document':
                return this.renderDocument(contenu);
            case 'media':
                return this.renderMedia(contenu);
            case 'video':
                return this.renderVideo(contenu);
            case 'lien':
                return this.renderLink(contenu);
            default:
                return '<p class="text-gray-500">Type de contenu non pris en charge</p>';
        }
    }

    renderDocument(contenu) {
        const fichier_url = contenu.file_url;
        const file_type = contenu.file_type;
        
        if (!fichier_url) {
            return '<p class="text-red-500">Fichier non disponible</p>';
        }

        if (file_type === 'application/pdf' || fichier_url.toLowerCase().includes('.pdf')) {
            return `
                <div class="w-full bg-gray-50 rounded-lg overflow-hidden">
                    <iframe 
                        src="${fichier_url}#toolbar=1&navpanes=1&scrollbar=1&view=FitH" 
                        class="w-full border-0" 
                        style="height: 80vh; min-height: 600px;"
                        title="Document PDF">
                        <p class="p-4 text-center">
                            Votre navigateur ne supporte pas l'affichage des PDFs. 
                            <a href="${fichier_url}" target="_blank" class="text-blue-600 hover:underline">
                                Téléchargez le fichier
                            </a>
                        </p>
                    </iframe>
                </div>
            `;
        }

        // Pour les documents Word/Excel via Google Docs Viewer
        if (file_type?.includes('word') || file_type?.includes('excel') || 
            fichier_url.includes('.docx') || fichier_url.includes('.xlsx')) {
            return `
                <div class="w-full bg-gray-50 rounded-lg overflow-hidden">
                    <iframe 
                        src="https://docs.google.com/gview?url=${encodeURIComponent(fichier_url)}&embedded=true" 
                        class="w-full border-0" 
                        style="height: 80vh; min-height: 600px;"
                        title="Document Office">
                        <p class="p-4 text-center">
                            Impossible d'afficher le document. 
                            <a href="${fichier_url}" target="_blank" class="text-blue-600 hover:underline">
                                Téléchargez le fichier
                            </a>
                        </p>
                    </iframe>
                </div>
            `;
        }

        return `
            <div class="text-center py-8">
                <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                    <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                </div>
                <h3 class="text-lg font-medium text-gray-900 mb-2">Document disponible</h3>
                <p class="text-gray-600 mb-4">Cliquez pour télécharger et consulter le fichier</p>
                <a href="${fichier_url}" 
                   target="_blank" 
                   class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                    Télécharger
                </a>
            </div>
        `;
    }

    renderMedia(contenu) {
        const fichier_url = contenu.file_url;
        const file_type = contenu.file_type;

        if (!fichier_url) {
            return '<p class="text-red-500">Média non disponible</p>';
        }

        if (file_type?.startsWith('image/')) {
            return `
                <div class="text-center">
                    <img src="${fichier_url}" 
                         alt="Image" 
                         class="max-w-full h-auto rounded-lg shadow-lg mx-auto"
                         style="max-height: 80vh;" />
                </div>
            `;
        }

        if (file_type?.startsWith('audio/')) {
            return `
                <div class="bg-gray-50 p-6 rounded-lg text-center">
                    <div class="mb-4">
                        <svg class="w-12 h-12 text-blue-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
                        </svg>
                    </div>
                    <audio controls class="w-full">
                        <source src="${fichier_url}" type="${file_type}">
                        Votre navigateur ne supporte pas l'audio.
                    </audio>
                </div>
            `;
        }

        return `
            <div class="text-center py-8">
                <p class="text-gray-600 mb-4">Type de média non pris en charge pour l'affichage</p>
                <a href="${fichier_url}" 
                   target="_blank" 
                   class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Télécharger le fichier
                </a>
            </div>
        `;
    }

    renderVideo(contenu) {
        const url = contenu.url || contenu.file_url;
        
        if (!url) {
            return '<p class="text-red-500">Vidéo non disponible</p>';
        }

        // YouTube
        const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
        if (youtubeMatch) {
            const videoId = youtubeMatch[1];
            return `
                <div class="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                    <iframe 
                        src="https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1" 
                        class="w-full h-full" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen
                        title="Vidéo YouTube">
                    </iframe>
                </div>
            `;
        }

        // Fichier vidéo direct
        if (contenu.file_type?.startsWith('video/')) {
            return `
                <div class="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                    <video controls class="w-full h-full">
                        <source src="${url}" type="${contenu.file_type}">
                        Votre navigateur ne supporte pas la vidéo.
                    </video>
                </div>
            `;
        }

        return `
            <div class="text-center py-8">
                <div class="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                    <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                    </svg>
                </div>
                <h3 class="text-lg font-medium text-gray-900 mb-2">Vidéo</h3>
                <a href="${url}" 
                   target="_blank" 
                   class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Ouvrir la vidéo
                </a>
            </div>
        `;
    }

    renderLink(contenu) {
        const url = contenu.url;
        
        if (!url) {
            return '<p class="text-red-500">Lien non disponible</p>';
        }

        return `
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div class="flex items-start space-x-4">
                    <div class="flex-shrink-0">
                        <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                        </svg>
                    </div>
                    <div class="flex-1">
                        <h3 class="text-lg font-medium text-gray-900 mb-2">Lien externe</h3>
                        <p class="text-gray-600 mb-4 break-all">${this.escapeHtml(url)}</p>
                        <a href="${url}" 
                           target="_blank" 
                           rel="noopener noreferrer"
                           class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                            </svg>
                            Ouvrir le lien
                        </a>
                    </div>
                </div>
            </div>
        `;
    }

    renderStats(resource) {
        return `
            <div class="bg-white rounded-lg shadow p-6">
                <h3 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                    </svg>
                    Statistiques
                </h3>
                
                <div class="space-y-3">
                    <div class="flex justify-between">
                        <span class="text-gray-600">Vues</span>
                        <span class="font-medium">${resource.views_count || resource.stats?.vues || 0}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Likes</span>
                        <span class="font-medium">${resource.likes_count || resource.stats?.likes || 0}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Commentaires</span>
                        <span class="font-medium">${resource.comments_count || resource.stats?.commentaires || 0}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Téléchargements</span>
                        <span class="font-medium">${resource.downloads_count || resource.stats?.telechargements || 0}</span>
                    </div>
                </div>
            </div>
        `;
    }

    renderDetails(resource) {
        return `
            <div class="bg-white rounded-lg shadow p-6">
                <h3 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    Détails
                </h3>
                
                <div class="space-y-3 text-sm">
                    <div>
                        <span class="text-gray-600">ID:</span>
                        <span class="font-mono text-xs block text-gray-800 mt-1">${resource.id}</span>
                    </div>
                    
                    <div>
                        <span class="text-gray-600">Type:</span>
                        <span class="ml-2 font-medium">${this.getTypeLabel(resource.type)}</span>
                    </div>
                    
                    <div>
                        <span class="text-gray-600">Visibilité:</span>
                        <span class="ml-2">
                            <span class="inline-flex items-center px-2 py-1 rounded-full text-xs ${
                                resource.visibilite === 'public' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }">
                                ${resource.visibilite === 'public' ? '🌍 Public' : '🔒 Privé'}
                            </span>
                        </span>
                    </div>

                    ${resource.contenu?.file_name ? `
                        <div>
                            <span class="text-gray-600">Fichier:</span>
                            <span class="font-mono text-xs block text-gray-800 mt-1 break-all">${resource.contenu.file_name}</span>
                        </div>
                    ` : ''}

                    ${resource.contenu?.file_size ? `
                        <div>
                            <span class="text-gray-600">Taille:</span>
                            <span class="ml-2 font-medium">${this.formatFileSize(resource.contenu.file_size)}</span>
                        </div>
                    ` : ''}

                    <div>
                        <span class="text-gray-600">Créé le:</span>
                        <span class="ml-2 font-medium">${this.formatDate(resource.created_at)}</span>
                    </div>

                    ${resource.updated_at && resource.updated_at !== resource.created_at ? `
                        <div>
                            <span class="text-gray-600">Modifié le:</span>
                            <span class="ml-2 font-medium">${this.formatDate(resource.updated_at)}</span>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }


    renderComments(resource) {
        return `
            <div class="bg-white rounded-lg shadow p-6">
                <h3 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                    </svg>
                    Commentaires (${resource.comments_count || resource.stats?.commentaires || 0})
                </h3>
                
                <div class="text-center py-4">
                    <p class="text-gray-500 mb-4">Aucun commentaire pour le moment</p>
                    <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Ajouter un commentaire
                    </button>
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        // Bouton retour
        const backBtn = this.container.querySelector('#back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => this.options.onBack());
        }

        // Actions dans le header et la sidebar
        this.attachActionListeners('#like-btn, #like-action', () => this.handleLike());
        this.attachActionListeners('#favorite-btn, #favorite-action', () => this.handleFavorite());
        this.attachActionListeners('#download-btn, #download-action', () => this.handleDownload());
        this.attachActionListeners('#share-btn, #share-action', () => this.handleShare());
        this.attachActionListeners('#edit-btn', () => this.options.onEdit(this.currentResource));
        this.attachActionListeners('#delete-btn', () => this.handleDelete());
    }

    attachActionListeners(selector, callback) {
        const elements = this.container.querySelectorAll(selector);
        elements.forEach(element => {
            element.addEventListener('click', callback);
        });
    }

    async handleLike() {
        try {
            const result = await this.options.onLike(this.currentResource.id);
            if (result) {
                this.isLiked = !this.isLiked;
                this.currentResource.likes_count = (this.currentResource.likes_count || 0) + (this.isLiked ? 1 : -1);
                this.updateLikeButtons();
            }
        } catch (error) {
            console.error('Erreur lors du like:', error);
        }
    }

    async handleFavorite() {
        try {
            const result = await this.options.onFavorite(this.currentResource.id);
            if (result) {
                this.isFavorited = !this.isFavorited;
                this.updateFavoriteButtons();
            }
        } catch (error) {
            console.error('Erreur lors de l\'ajout aux favoris:', error);
        }
    }

    async handleDownload() {
        try {
            await this.options.onDownload(this.currentResource.id);
            this.currentResource.downloads_count = (this.currentResource.downloads_count || 0) + 1;
            this.updateStats();
        } catch (error) {
            console.error('Erreur lors du téléchargement:', error);
        }
    }

    async handleShare() {
        const url = `${window.location.origin}/home#resources/view/${this.currentResource.id}`;
        
        if (navigator.share) {
            try {
                await navigator.share({
                    title: this.currentResource.titre,
                    text: this.currentResource.description || 'Ressource pédagogique - Diagana School',
                    url: url
                });
            } catch (error) {
                this.copyToClipboard(url);
            }
        } else {
            this.copyToClipboard(url);
        }
    }

    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showNotification('Lien copié dans le presse-papiers!', 'success');
        }).catch(() => {
            this.showNotification('Impossible de copier le lien', 'error');
        });
    }

    async handleDelete() {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette ressource ?')) {
            try {
                await this.options.onDelete(this.currentResource.id);
                this.options.onBack();
            } catch (error) {
                console.error('Erreur lors de la suppression:', error);
                this.showNotification('Erreur lors de la suppression', 'error');
            }
        }
    }

    updateLikeButtons() {
        const likeButtons = this.container.querySelectorAll('#like-btn, #like-action');
        likeButtons.forEach(btn => {
            btn.className = btn.className.replace(
                this.isLiked ? 'bg-gray-100 text-gray-600' : 'bg-red-100 text-red-600',
                this.isLiked ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
            );
            
            const svg = btn.querySelector('svg');
            if (svg) {
                svg.setAttribute('fill', this.isLiked ? 'currentColor' : 'none');
            }
            
            const text = btn.textContent.trim();
            if (text.includes('plus aimer') || text.includes('Aimer')) {
                btn.innerHTML = btn.innerHTML.replace(
                    /Ne plus aimer|Aimer/,
                    this.isLiked ? 'Ne plus aimer' : 'Aimer'
                );
            }
        });
        
        this.updateStats();
    }

    updateFavoriteButtons() {
        const favoriteButtons = this.container.querySelectorAll('#favorite-btn, #favorite-action');
        favoriteButtons.forEach(btn => {
            btn.className = btn.className.replace(
                this.isFavorited ? 'bg-gray-100 text-gray-600' : 'bg-yellow-100 text-yellow-600',
                this.isFavorited ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-600'
            );
            
            const svg = btn.querySelector('svg');
            if (svg) {
                svg.setAttribute('fill', this.isFavorited ? 'currentColor' : 'none');
            }

            const text = btn.textContent.trim();
            if (text.includes('Retirer') || text.includes('Ajouter')) {
                btn.innerHTML = btn.innerHTML.replace(
                    /Retirer des favoris|Ajouter aux favoris/,
                    this.isFavorited ? 'Retirer des favoris' : 'Ajouter aux favoris'
                );
            }
        });
    }

    updateStats() {
        const statsContainer = this.container.querySelector('.bg-white.rounded-lg.shadow');
        if (statsContainer) {
            const resource = this.currentResource;
            const statsHTML = `
                <div class="space-y-3">
                    <div class="flex justify-between">
                        <span class="text-gray-600">Vues</span>
                        <span class="font-medium">${resource.views_count || resource.stats?.vues || 0}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Likes</span>
                        <span class="font-medium">${resource.likes_count || resource.stats?.likes || 0}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Commentaires</span>
                        <span class="font-medium">${resource.comments_count || resource.stats?.commentaires || 0}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-600">Téléchargements</span>
                        <span class="font-medium">${resource.downloads_count || resource.stats?.telechargements || 0}</span>
                    </div>
                </div>
            `;
            
            const statsContent = statsContainer.querySelector('.space-y-3');
            if (statsContent) {
                statsContent.outerHTML = statsHTML;
            }
        }
    }

    async incrementViewCount() {
        if (!this.currentResource || !this.currentResource.id) {
            console.error('Impossible d\'incrémenter les vues: ressource ou ID manquant');
            return;
        }
        
        try {
            // Incrémenter via l'API
            await fetch(`/api/ressources/${this.currentResource.id}/view`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            this.currentResource.views_count = (this.currentResource.views_count || 0) + 1;
            this.updateStats();
        } catch (error) {
            console.error('Erreur lors de l\'incrémentation des vues:', error);
        }
    }

    updateURL(resourceId) {
        const newURL = `/home#resources/view/${resourceId}`;
        window.history.pushState({ resourceId }, '', newURL);
    }

    hide() {
        const viewer = this.container.querySelector('#resource-fullpage-viewer');
        if (viewer) {
            viewer.remove();
        }
        // Nettoyer le container
        this.container.innerHTML = '';
    }

    // Utilitaires
    getTypeLabel(type) {
        const labels = {
            'document': '📄 Document',
            'media': '🎵 Média',
            'video': '🎬 Vidéo',
            'lien': '🔗 Lien'
        };
        return labels[type] || '📄 Ressource';
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    formatDate(dateString) {
        if (!dateString) return 'Non spécifié';
        try {
            return new Date(dateString).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return 'Date invalide';
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
    }

    // Nouvelles méthodes utilitaires pour la refonte
    formatTimeAgo(dateString) {
        if (!dateString) return 'Date inconnue';
        
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now - date;
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInHours / 24);
        const diffInWeeks = Math.floor(diffInDays / 7);

        if (diffInHours < 1) return 'À l\'instant';
        if (diffInHours === 1) return 'Il y a 1 heure';
        if (diffInHours < 24) return `Il y a ${diffInHours} heures`;
        if (diffInDays === 1) return 'Hier';
        if (diffInDays < 7) return `Il y a ${diffInDays} jours`;
        if (diffInWeeks === 1) return 'Il y a 1 semaine';
        if (diffInWeeks < 4) return `Il y a ${diffInWeeks} semaines`;
        
        return date.toLocaleDateString('fr-FR', { 
            day: 'numeric', 
            month: 'long',
            year: 'numeric'
        });
    }

    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1).replace('.0', '') + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1).replace('.0', '') + 'k';
        }
        return num.toString();
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

    renderAuthorAvatar(auteur) {
        const name = this.getAuthorDisplayName(auteur);
        const initials = this.getAuthorInitials(auteur);
        
        return `
            <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-700" title="${this.escapeHtml(name)}">
                ${initials}
            </div>
        `;
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
        
        return 'AN';
    }

    renderUserAvatar() {
        // Récupérer l'utilisateur actuel depuis le localStorage ou une autre source
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const name = `${user.prenom || ''} ${user.nom || ''}`.trim() || 'Utilisateur';
        const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
        
        return `
            <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-700" title="${this.escapeHtml(name)}">
                ${initials}
            </div>
        `;
    }

    getTypeIcon(type) {
        const icons = {
            'document': '📄',
            'media': '🖼️',
            'video': '🎥',
            'lien': '🔗'
        };
        return icons[type] || '📄';
    }

    showNotification(message, type = 'info') {
        // Simple notification toast
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg ${
            type === 'success' ? 'bg-green-600 text-white' :
            type === 'error' ? 'bg-red-600 text-white' :
            'bg-blue-600 text-white'
        }`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Ajouter les styles CSS nécessaires au chargement
if (!document.querySelector('#resource-viewer-styles')) {
    const style = document.createElement('style');
    style.id = 'resource-viewer-styles';
    style.textContent = `
        /* Styles pour le nouveau design */
        .primary-card {
            background: white;
            border-radius: 16px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
            transition: all 0.2s ease;
        }
        
        .secondary-card {
            background: var(--color-beige-100, #f7f5f0);
            border: 1px solid var(--color-beige-200, #f0ebe0);
            border-radius: 12px;
            padding: 1.5rem;
            transition: all 0.2s ease;
        }
        
        .action-btn {
            padding: 0.5rem 1rem;
            border-radius: 8px;
            font-weight: 500;
            transition: all 0.2s ease;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            border: none;
            cursor: pointer;
        }
        
        .action-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        
        .btn-primary {
            background: var(--color-accent-primary, #d97706);
            color: white;
        }
        
        .btn-secondary {
            background: var(--color-beige-200, #f0ebe0);
            color: var(--color-gray-700, #404040);
        }
        
        .btn-secondary.liked {
            background: #fee2e2;
            color: #dc2626;
        }
        
        .btn-secondary.favorited {
            background: #fef3c7;
            color: #d97706;
        }
        
        .tag {
            display: inline-flex;
            align-items: center;
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 500;
        }
        
        .tag.document {
            background: rgba(217, 119, 6, 0.1);
            color: var(--color-accent-primary, #d97706);
        }
        
        .tag.media {
            background: rgba(124, 58, 237, 0.1);
            color: #7c3aed;
        }
        
        .tag.video {
            background: rgba(14, 165, 233, 0.1);
            color: #0ea5e9;
        }
        
        .tag.lien {
            background: rgba(5, 150, 105, 0.1);
            color: #059669;
        }
        
        .tag.subject {
            background: rgba(14, 165, 233, 0.1);
            color: #0ea5e9;
        }
        
        .tag.level {
            background: rgba(5, 150, 105, 0.1);
            color: #059669;
        }
        
        .tag-chip {
            padding: 0.25rem 0.5rem;
            background: #f3f4f6;
            color: #6b7280;
            border-radius: 6px;
            font-size: 0.75rem;
        }
        
        .comment-section {
            background: var(--color-beige-50, #fefdfb);
            border-top: 2px solid var(--color-beige-200, #f0ebe0);
        }
        
        .animate-fade-in {
            animation: fadeIn 0.3s ease-out;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);
}

export { ResourceFullPageViewer };
