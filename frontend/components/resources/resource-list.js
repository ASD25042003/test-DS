/**
 * Composant ResourcesList - Module Ressources
 * Grille de ressources avec pagination
 * Réplication exacte de l'interface test-CAT avec données du backend
 */

import ResourceCard from './resource-card.js';

class ResourcesList {
    constructor(containerSelector, options = {}) {
        this.container = document.querySelector(containerSelector);
        this.options = {
            itemsPerPage: options.itemsPerPage || 12,
            showPagination: options.showPagination !== false,
            showStats: options.showStats !== false,
            onResourceClick: options.onResourceClick || (() => {}),
            onLike: options.onLike || (() => {}),
            onFavorite: options.onFavorite || (() => {}),
            onPageChange: options.onPageChange || (() => {}),
            ...options
        };

        this.allResources = [];
        this.filteredResources = [];
        this.currentPage = 1;
        this.totalPages = 1;
        this.isLoading = false;

        this.init();
    }

    init() {
        if (!this.container) {
            console.error('ResourcesList: Container non trouvé');
            return;
        }
        
        this.render();
    }

    render() {
        this.container.innerHTML = `
            <!-- Résultats et stats -->
            <div class="flex justify-between items-center mb-6 animate-fade-in" id="results-header">
                <div style="color: var(--color-gray-500); font-size: 0.875rem;">
                    <span id="results-count">0</span> ressources trouvées
                </div>
                ${this.options.showStats ? `
                    <div class="flex items-center space-x-3 text-xs" style="color: var(--color-gray-500);" id="global-stats">
                        <span title="Vues totales">👁 <span id="total-views">0</span></span>
                        <span title="Likes totaux">👍 <span id="total-likes">0</span></span>
                        <span title="Commentaires totaux">💬 <span id="total-comments">0</span></span>
                    </div>
                ` : ''}
            </div>

            <!-- Zone de chargement -->
            <div id="loading-indicator" class="text-center py-12 hidden">
                <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
                <p class="mt-2 text-gray-500">Chargement des ressources...</p>
            </div>

            <!-- Message quand aucun résultat -->
            <div id="no-results" class="text-center py-12 hidden">
                <div style="font-size: 4rem; margin-bottom: 1rem;">😔</div>
                <h3 class="text-xl font-semibold mb-2" style="color: var(--color-gray-900);">
                    Aucune ressource trouvée
                </h3>
                <p class="text-gray-600 mb-4">
                    Essayez de modifier vos critères de recherche ou filtres
                </p>
                <button id="clear-filters-btn" class="btn-primary">
                    🔄 Réinitialiser les filtres
                </button>
            </div>

            <!-- Grille de ressources -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-96" id="resources-grid">
                <!-- Les cartes seront insérées ici dynamiquement -->
            </div>

            <!-- Pagination -->
            <div class="flex justify-center mt-12" id="pagination-container" style="display: none;">
                <div class="flex items-center space-x-2" id="pagination-controls">
                    <!-- Les contrôles de pagination seront générés ici -->
                </div>
            </div>
        `;

        this.attachEventListeners();
    }

    attachEventListeners() {
        // Bouton réinitialiser filtres
        const clearFiltersBtn = this.container.querySelector('#clear-filters-btn');
        clearFiltersBtn?.addEventListener('click', () => {
            const event = new CustomEvent('clearFilters');
            this.container.dispatchEvent(event);
        });
    }

    async loadResources(resources = []) {
        this.showLoading(true);
        
        try {
            this.allResources = Array.isArray(resources) ? resources : [];
            this.filteredResources = [...this.allResources];
            this.currentPage = 1;
            this.updatePagination();
            this.renderCurrentPage();
            this.updateStats();
            
        } catch (error) {
            console.error('Erreur lors du chargement des ressources:', error);
            this.showError('Erreur lors du chargement des ressources');
        } finally {
            this.showLoading(false);
        }
    }

    applyFilters(filters) {
        const { search = '', type = 'all', subjects = [] } = filters;

        this.filteredResources = this.allResources.filter(resource => {
            // Filtre de recherche textuelle
            if (search) {
                const searchTerms = search.toLowerCase();
                const matchTitle = resource.titre?.toLowerCase().includes(searchTerms);
                const matchDescription = resource.description?.toLowerCase().includes(searchTerms);
                const matchTags = resource.tags?.some(tag => 
                    tag.toLowerCase().includes(searchTerms)
                );
                
                if (!matchTitle && !matchDescription && !matchTags) {
                    return false;
                }
            }

            // Filtre par type
            if (type !== 'all' && resource.type !== type) {
                return false;
            }

            // Filtre par matières
            if (subjects.length > 0) {
                const resourceSubject = this.normalizeSubject(resource.matiere);
                const hasMatchingSubject = subjects.some(subject => 
                    resourceSubject.includes(subject.toLowerCase())
                );
                if (!hasMatchingSubject) {
                    return false;
                }
            }

            return true;
        });

        this.currentPage = 1;
        this.updatePagination();
        this.renderCurrentPage();
        this.updateResultsCount();
    }

    sortResources(sortBy) {
        const sortFunctions = {
            recent: (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0),
            popular: (a, b) => (b.stats?.vues || 0) - (a.stats?.vues || 0),
            likes: (a, b) => (b.stats?.likes || 0) - (a.stats?.likes || 0),
            views: (a, b) => (b.stats?.vues || 0) - (a.stats?.vues || 0),
            alphabetical: (a, b) => (a.titre || '').localeCompare(b.titre || '')
        };

        if (sortFunctions[sortBy]) {
            this.filteredResources.sort(sortFunctions[sortBy]);
            this.renderCurrentPage();
        }
    }

    renderCurrentPage() {
        const grid = this.container.querySelector('#resources-grid');
        const startIndex = (this.currentPage - 1) * this.options.itemsPerPage;
        const endIndex = startIndex + this.options.itemsPerPage;
        const currentResources = this.filteredResources.slice(startIndex, endIndex);

        if (currentResources.length === 0) {
            this.showNoResults(true);
            grid.innerHTML = '';
            return;
        }

        this.showNoResults(false);
        grid.innerHTML = '';

        currentResources.forEach(resource => {
            const cardElement = this.createResourceCard(resource);
            grid.appendChild(cardElement);
        });

        // Animation d'apparition
        this.animateCards();
    }

    createResourceCard(resource) {
        const card = new ResourceCard(resource, {
            onClick: (data, element) => {
                this.options.onResourceClick(data, element);
            },
            onLike: async (resourceId, isLiked) => {
                try {
                    await this.options.onLike(resourceId, isLiked);
                    this.updateResourceLikeStatus(resourceId, isLiked);
                } catch (error) {
                    console.error('Erreur lors du like:', error);
                }
            },
            onFavorite: async (resourceId, isFavorited) => {
                try {
                    await this.options.onFavorite(resourceId, isFavorited);
                    this.updateResourceFavoriteStatus(resourceId, isFavorited);
                } catch (error) {
                    console.error('Erreur lors du favori:', error);
                }
            }
        });

        const cardElement = document.createElement('div');
        cardElement.innerHTML = card.render();
        const cardNode = cardElement.firstElementChild;
        
        card.attachEventListeners(cardNode);
        return cardNode;
    }

    updatePagination() {
        this.totalPages = Math.ceil(this.filteredResources.length / this.options.itemsPerPage);
        
        if (!this.options.showPagination || this.totalPages <= 1) {
            this.container.querySelector('#pagination-container').style.display = 'none';
            return;
        }

        this.container.querySelector('#pagination-container').style.display = 'flex';
        this.renderPaginationControls();
    }

    renderPaginationControls() {
        const paginationContainer = this.container.querySelector('#pagination-controls');
        let controls = '';

        // Bouton précédent
        if (this.currentPage > 1) {
            controls += `
                <button class="px-4 py-2 border border-gray-300 rounded-lg pagination-btn" 
                        style="background: var(--color-beige-200);" 
                        data-page="${this.currentPage - 1}">
                    ← Précédent
                </button>
            `;
        }

        // Numéros de page
        const startPage = Math.max(1, this.currentPage - 2);
        const endPage = Math.min(this.totalPages, this.currentPage + 2);

        if (startPage > 1) {
            controls += `
                <button class="px-4 py-2 border border-gray-300 rounded-lg pagination-btn" 
                        style="background: var(--color-beige-200);" 
                        data-page="1">1</button>
            `;
            if (startPage > 2) {
                controls += '<span class="px-2">...</span>';
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            controls += `
                <button class="px-4 py-2 rounded-lg pagination-btn" 
                        style="background: ${i === this.currentPage ? 'var(--color-accent-primary)' : 'var(--color-beige-200)'}; 
                               color: ${i === this.currentPage ? 'white' : 'inherit'};" 
                        data-page="${i}">
                    ${i}
                </button>
            `;
        }

        if (endPage < this.totalPages) {
            if (endPage < this.totalPages - 1) {
                controls += '<span class="px-2">...</span>';
            }
            controls += `
                <button class="px-4 py-2 border border-gray-300 rounded-lg pagination-btn" 
                        style="background: var(--color-beige-200);" 
                        data-page="${this.totalPages}">
                    ${this.totalPages}
                </button>
            `;
        }

        // Bouton suivant
        if (this.currentPage < this.totalPages) {
            controls += `
                <button class="px-4 py-2 border border-gray-300 rounded-lg pagination-btn" 
                        style="background: var(--color-beige-200);" 
                        data-page="${this.currentPage + 1}">
                    Suivant →
                </button>
            `;
        }

        paginationContainer.innerHTML = controls;

        // Attacher les événements
        paginationContainer.querySelectorAll('.pagination-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const page = parseInt(e.target.dataset.page);
                this.goToPage(page);
            });
        });
    }

    goToPage(page) {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
            this.renderCurrentPage();
            this.renderPaginationControls();
            this.options.onPageChange(page);
            
            // Scroll vers le haut de la grille
            this.container.querySelector('#resources-grid').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    // Méthodes utilitaires
    showLoading(show) {
        const loadingIndicator = this.container.querySelector('#loading-indicator');
        const grid = this.container.querySelector('#resources-grid');
        
        if (show) {
            loadingIndicator.classList.remove('hidden');
            grid.style.opacity = '0.5';
        } else {
            loadingIndicator.classList.add('hidden');
            grid.style.opacity = '1';
        }
        
        this.isLoading = show;
    }

    showNoResults(show) {
        const noResults = this.container.querySelector('#no-results');
        const grid = this.container.querySelector('#resources-grid');
        const pagination = this.container.querySelector('#pagination-container');
        
        if (show) {
            noResults.classList.remove('hidden');
            pagination.style.display = 'none';
        } else {
            noResults.classList.add('hidden');
        }
    }

    showError(message) {
        const grid = this.container.querySelector('#resources-grid');
        grid.innerHTML = `
            <div class="col-span-full text-center py-12">
                <div style="font-size: 4rem; margin-bottom: 1rem;">⚠️</div>
                <h3 class="text-xl font-semibold mb-2 text-red-600">Erreur</h3>
                <p class="text-gray-600">${message}</p>
            </div>
        `;
    }

    updateStats() {
        if (!this.options.showStats) return;

        const stats = this.allResources.reduce((acc, resource) => {
            acc.totalViews += resource.stats?.vues || 0;
            acc.totalLikes += resource.stats?.likes || 0;
            acc.totalComments += resource.stats?.commentaires || 0;
            return acc;
        }, { totalViews: 0, totalLikes: 0, totalComments: 0 });

        this.container.querySelector('#total-views').textContent = stats.totalViews.toLocaleString();
        this.container.querySelector('#total-likes').textContent = stats.totalLikes.toLocaleString();
        this.container.querySelector('#total-comments').textContent = stats.totalComments.toLocaleString();
    }

    updateResultsCount() {
        const count = this.filteredResources.length;
        const resultsCount = this.container.querySelector('#results-count');
        if (resultsCount) {
            resultsCount.textContent = count.toLocaleString();
        }
    }

    animateCards() {
        const cards = this.container.querySelectorAll('.resource-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
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

    // Méthodes de mise à jour en temps réel
    updateResourceLikeStatus(resourceId, isLiked, newCount) {
        const resource = this.allResources.find(r => r.id === resourceId);
        if (resource) {
            resource.is_liked = isLiked;
            if (newCount !== undefined) {
                resource.stats = resource.stats || {};
                resource.stats.likes = newCount;
            }
            this.updateStats();
        }
    }

    updateResourceFavoriteStatus(resourceId, isFavorited) {
        const resource = this.allResources.find(r => r.id === resourceId);
        if (resource) {
            resource.is_favorited = isFavorited;
        }
    }

    addResource(resource) {
        this.allResources.unshift(resource);
        this.applyFilters({}); // Réappliquer les filtres actuels
    }

    removeResource(resourceId) {
        this.allResources = this.allResources.filter(r => r.id !== resourceId);
        this.filteredResources = this.filteredResources.filter(r => r.id !== resourceId);
        this.updatePagination();
        this.renderCurrentPage();
        this.updateStats();
        this.updateResultsCount();
    }

    // Getters publics
    getCurrentResources() {
        return this.filteredResources;
    }

    getTotalCount() {
        return this.allResources.length;
    }

    getFilteredCount() {
        return this.filteredResources.length;
    }
}

export default ResourcesList;