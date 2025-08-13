/**
 * Composant SearchFilters - Module Ressources
 * Barre de recherche et filtres pour les ressources pédagogiques
 * Réplication exacte de l'interface test-CAT
 */

class SearchFilters {
    constructor(containerSelector, options = {}) {
        this.container = document.querySelector(containerSelector);
        this.options = {
            onSearch: options.onSearch || (() => {}),
            onFilter: options.onFilter || (() => {}),
            onSort: options.onSort || (() => {}),
            onAddResource: options.onAddResource || (() => {}),
            showHeader: options.showHeader !== false,
            ...options
        };
        
        this.currentFilters = {
            search: '',
            type: 'all',
            subjects: [],
            sortBy: 'recent'
        };
        
        this.init();
    }

    init() {
        if (!this.container) {
            console.error('SearchFilters: Container non trouvé');
            return;
        }
        
        // Ajouter le header si demandé
        if (this.options.showHeader) {
            this.addHeader();
        }
        
        this.render();
        this.attachEventListeners();
    }

    render() {
        this.container.innerHTML = `
            <div class="mb-8 animate-fade-in">
                <div class="flex flex-col lg:flex-row gap-4 mb-6">
                    <!-- Barre de recherche -->
                    <div class="flex-1 relative">
                        <input 
                            type="text" 
                            class="search-input" 
                            placeholder="Rechercher des ressources..." 
                            id="search-input"
                        >
                        <div class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            🔍
                        </div>
                    </div>

                    <!-- Bouton de tri -->
                    <div class="sort-dropdown">
                        <button class="filter-pill" id="sort-button">
                            📊 Trier par: Plus récent ▼
                        </button>
                        <div id="sort-dropdown" class="dropdown-content">
                            <div class="dropdown-item" data-sort="recent">📅 Plus récent</div>
                            <div class="dropdown-item" data-sort="popular">🔥 Plus populaire</div>
                            <div class="dropdown-item" data-sort="likes">👍 Plus de likes</div>
                            <div class="dropdown-item" data-sort="views">👁 Plus de vues</div>
                            <div class="dropdown-item" data-sort="alphabetical">🔤 Alphabétique</div>
                        </div>
                    </div>
                </div>

                <!-- Filtres en défilement horizontal -->
                <div class="filters-container mb-4">
                    <div class="filter-pill active" data-filter-type="all">📋 Tout</div>
                    <div class="filter-pill" data-filter-type="document">📄 Documents</div>
                    <div class="filter-pill" data-filter-type="media">🖼️ Médias</div>
                    <div class="filter-pill" data-filter-type="video">🎥 Vidéos</div>
                    <div class="filter-pill" data-filter-type="lien">🔗 Liens</div>
                    <div class="filter-pill" data-filter-subject="mathematiques">📐 Mathématiques</div>
                    <div class="filter-pill" data-filter-subject="sciences">🔬 Sciences</div>
                    <div class="filter-pill" data-filter-subject="francais">📚 Français</div>
                    <div class="filter-pill" data-filter-subject="histoire">🏛️ Histoire</div>
                    <div class="filter-pill" data-filter-subject="anglais">🇬🇧 Anglais</div>
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        // Recherche en temps réel
        const searchInput = this.container.querySelector('#search-input');
        let searchTimeout;
        
        searchInput?.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.currentFilters.search = e.target.value.toLowerCase();
                this.options.onSearch(this.currentFilters);
            }, 300);
        });

        // Bouton de tri
        const sortButton = this.container.querySelector('#sort-button');
        const sortDropdown = this.container.querySelector('#sort-dropdown');
        
        sortButton?.addEventListener('click', () => {
            sortDropdown.classList.toggle('show');
        });

        // Options de tri
        sortDropdown?.addEventListener('click', (e) => {
            if (e.target.classList.contains('dropdown-item')) {
                const sortBy = e.target.dataset.sort;
                this.currentFilters.sortBy = sortBy;
                
                sortButton.textContent = `📊 Trier par: ${this.getSortDisplayName(sortBy)} ▼`;
                sortDropdown.classList.remove('show');
                
                this.options.onSort(this.currentFilters);
            }
        });

        // Filtres par type
        const typeFilters = this.container.querySelectorAll('[data-filter-type]');
        typeFilters.forEach(filter => {
            filter.addEventListener('click', () => {
                // Reset active state for type filters
                typeFilters.forEach(f => f.classList.remove('active'));
                filter.classList.add('active');
                
                this.currentFilters.type = filter.dataset.filterType;
                this.options.onFilter(this.currentFilters);
            });
        });

        // Filtres par matière
        const subjectFilters = this.container.querySelectorAll('[data-filter-subject]');
        subjectFilters.forEach(filter => {
            filter.addEventListener('click', () => {
                filter.classList.toggle('active');
                
                // Mise à jour de la liste des matières actives
                this.currentFilters.subjects = Array.from(
                    this.container.querySelectorAll('[data-filter-subject].active')
                ).map(f => f.dataset.filterSubject);
                
                this.options.onFilter(this.currentFilters);
            });
        });

        // Fermer dropdown en cliquant ailleurs
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.sort-dropdown')) {
                sortDropdown?.classList.remove('show');
            }
        });
    }

    getSortDisplayName(criteria) {
        const names = {
            'recent': 'Plus récent',
            'popular': 'Plus populaire',
            'likes': 'Plus de likes',
            'views': 'Plus de vues',
            'alphabetical': 'Alphabétique'
        };
        return names[criteria] || criteria;
    }

    // Méthodes publiques pour contrôler les filtres
    setSearchValue(value) {
        const searchInput = this.container.querySelector('#search-input');
        if (searchInput) {
            searchInput.value = value;
            this.currentFilters.search = value.toLowerCase();
        }
    }

    setTypeFilter(type) {
        const typeFilters = this.container.querySelectorAll('[data-filter-type]');
        typeFilters.forEach(f => f.classList.remove('active'));
        
        const targetFilter = this.container.querySelector(`[data-filter-type="${type}"]`);
        if (targetFilter) {
            targetFilter.classList.add('active');
            this.currentFilters.type = type;
        }
    }

    clearSubjectFilters() {
        const subjectFilters = this.container.querySelectorAll('[data-filter-subject]');
        subjectFilters.forEach(f => f.classList.remove('active'));
        this.currentFilters.subjects = [];
    }

    getFilters() {
        return { ...this.currentFilters };
    }

    updateResultsCount(count, stats = null) {
        // Laisser ResourcesList gérer l'affichage des résultats
        // Émettre seulement l'événement pour le parent
        const event = new CustomEvent('filtersChanged', {
            detail: { count, filters: this.currentFilters, stats }
        });
        this.container.dispatchEvent(event);
    }

    // Méthode pour ajouter le header avec bouton "Nouvelle ressource"
    addHeader() {
        // Vérifier si le header existe déjà pour éviter la duplication
        if (document.querySelector('#resources-module-header')) {
            return;
        }
        
        const headerHtml = `
            <!-- Header avec titre et bouton -->
            <div id="resources-module-header" class="flex justify-between items-center mb-6 animate-fade-in">
                <div class="header-content">
                    <h1 class="header-title" style="color: var(--color-gray-900);">
                        📁 Ressources pédagogiques
                    </h1>
                    <p class="header-subtitle" style="color: var(--color-gray-500);">
                        Explorez et partagez des ressources éducatives de qualité
                    </p>
                </div>
                <button class="btn-primary" id="add-resource-btn">
                    ➕ Nouvelle ressource
                </button>
            </div>
        `;
        
        // Insérer avant le contenu existant
        this.container.insertAdjacentHTML('beforebegin', headerHtml);
        
        // Attacher l'événement au bouton
        const addBtn = document.querySelector('#add-resource-btn');
        if (addBtn && this.options.onAddResource) {
            // Retirer l'ancien listener s'il existe
            const newBtn = addBtn.cloneNode(true);
            addBtn.parentNode.replaceChild(newBtn, addBtn);
            newBtn.addEventListener('click', this.options.onAddResource);
        }
    }
}

export default SearchFilters;