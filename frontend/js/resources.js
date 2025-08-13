/**
 * Module Ressources - Diagana School
 * Gestion complète des ressources pédagogiques
 * Réplication exacte de l'interface test-CAT avec navigation SPA unifiée
 */

import { SearchFilters, ResourcesList, UploadForm, ResourceFullPageViewer } from '/static/components/resources/index.js';
import { resourcesApi } from '/static/api/resources.js';
import { authApi } from '/static/api/auth.js';
import { apiClient } from '/static/api/index.js';

console.log('📁 Module Ressources - Version complète chargée');

class ResourcesModule {
    constructor() {
        this.searchFilters = null;
        this.resourcesList = null;
        this.uploadForm = null;
        this.resourceFullPageViewer = null;
        this.currentUser = null;
        this.isInitialized = false;
        
        // Données demo pour développement
        this.demoResources = this.generateDemoData();
    }

    async init() {
        // Vérifier l'authentification
        this.currentUser = await this.getCurrentUser();
        
        const content = `
            <div class="w-full">
                <!-- Zone de recherche et filtres (avec header intégré) -->
                <div id="search-filters-container"></div>

                <!-- Zone de contenu principal -->
                <div id="resources-list-container"></div>

                <!-- Modals et overlays -->
                <div id="upload-form-container"></div>
            </div>

            <!-- Bouton flottant pour ajouter une ressource -->
            <div class="fab" id="add-resource-fab" title="Ajouter une ressource">
                ➕
            </div>
        `;

        // Initialiser les composants après le rendu
        setTimeout(() => this.initializeComponents(), 100);
        
        return content;
    }

    async initializeComponents() {
        // Vérifier que les containers existent avant d'initialiser
        const searchContainer = document.querySelector('#search-filters-container');
        const listContainer = document.querySelector('#resources-list-container');
        
        if (!searchContainer || !listContainer) {
            console.warn('⚠️ Containers manquants, annulation de l\'initialisation');
            this.isInitialized = false;
            return;
        }
        
        // Ne pas skip si déjà initialisé pour permettre la ré-attache des event listeners
        if (this.isInitialized) {
            console.log('🔄 Réinitialisation des event listeners après restauration');
            // Ré-attacher uniquement les event listeners critiques
            this.attachFabListener();
            return;
        }
        
        try {
            this.isInitialized = true;
            
            // Initialisation des filtres de recherche
            this.searchFilters = new SearchFilters('#search-filters-container', {
                onSearch: (filters) => this.handleSearch(filters),
                onFilter: (filters) => this.handleFilter(filters),
                onSort: (filters) => this.handleSort(filters),
                onAddResource: () => this.showUploadForm(),
                showHeader: true
            });

            // Initialisation de la liste des ressources
            this.resourcesList = new ResourcesList('#resources-list-container', {
                onResourceClick: (resource) => this.viewResource(resource),
                onLike: (resourceId, isLiked) => this.toggleLike(resourceId, isLiked),
                onFavorite: (resourceId, isFavorited) => this.toggleFavorite(resourceId, isFavorited),
                onPageChange: (page) => this.handlePageChange(page),
                showStats: true
            });

            // Chargement initial des ressources
            await this.loadResources();

            // Bouton d'ajout de ressource
            this.attachFabListener();

            // Gérer la navigation directe vers une ressource
            this.handleDirectResourceAccess();

            console.log('✅ Module Ressources initialisé avec succès');
            
            // Vérification finale
            this.verifyUIElements();

        } catch (error) {
            console.error('❌ Erreur lors de l\'initialisation du module Ressources:', error);
            this.isInitialized = false;
            this.showError('Erreur lors du chargement du module');
        }
    }

    async loadResources() {
        try {
            // Debug de l'authentification
            console.log('🔐 État de l\'authentification:', {
                currentUser: this.currentUser,
                token: localStorage.getItem('authToken') ? 'présent' : 'absent',
                isAuthenticated: apiClient.isAuthenticated()
            });

            // Chargement réel depuis l'API
            console.log('🔄 Chargement des ressources depuis l\'API...');
            console.log('📡 URL de l\'API:', `${apiClient.baseURL}${resourcesApi.baseEndpoint}`);
            
            const response = await resourcesApi.getAll({
                page: 1,
                limit: 50,
                include_stats: true
            });

            console.log('📊 Réponse complète de l\'API:', response);

            if (response && response.success && response.data) {
                await this.resourcesList.loadResources(response.data);
                console.log(`✅ ${response.data.length} ressources chargées depuis Supabase`);
            } else {
                console.error('❌ Réponse API invalide:', response);
                throw new Error(`Réponse API invalide: success=${response?.success}, data=${response?.data?.length || 'undefined'}`);
            }

        } catch (error) {
            console.error('❌ Erreur lors du chargement des ressources:', error);
            console.error('🔍 Détails de l\'erreur:', {
                name: error.name,
                message: error.message,
                status: error.status,
                details: error.details
            });
            console.log('⚠️ Fallback vers les données de démonstration');
            // Fallback vers les données demo seulement en cas d'erreur
            await this.resourcesList.loadResources(this.demoResources);
        }
    }

    handleSearch(filters) {
        console.log('🔍 Recherche:', filters);
        this.resourcesList.applyFilters(filters);
    }

    handleFilter(filters) {
        console.log('🎯 Filtres appliqués:', filters);
        this.resourcesList.applyFilters(filters);
    }

    handleSort(filters) {
        console.log('📊 Tri appliqué:', filters.sortBy);
        this.resourcesList.sortResources(filters.sortBy);
    }

    handlePageChange(page) {
        console.log('📄 Changement de page:', page);
        // Scroll smooth vers le haut de la liste
        document.querySelector('#resources-list-container').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }

    viewResource(resource) {
        console.log('👁️ Visualisation de la ressource en pleine page:', resource?.id, resource?.titre);
        
        // Méthode améliorée : sauvegarder et créer le viewer sans casser l'application
        const mainContent = document.getElementById('app-content');
        if (!mainContent) {
            console.error('Container app-content non trouvé!');
            return;
        }
        
        // Ajouter une classe au body pour indiquer que le viewer est actif
        document.body.classList.add('resource-viewer-active');
        
        // Sauvegarder le contenu actuel du module
        this.savedModuleContent = mainContent.innerHTML;
        
        // Créer le container pour le viewer dans app-content
        mainContent.innerHTML = '<div id="fullpage-viewer-container"></div>';
        
        // Masquer TOUS les éléments de navigation et headers potentiels
        const elementsToHide = [
            '.navbar',
            '#desktopNav',
            '.bottom-nav',
            '#bottomNav',
            '.mobile-header',
            '#main-header',
            '.page-header',
            '.header-section',
            '.sticky-header',
            '.fab',
            '#add-resource-fab'
        ];
        
        this.hiddenElements = [];
        elementsToHide.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (element && element.style.display !== 'none') {
                    this.hiddenElements.push({ element, originalDisplay: element.style.display });
                    element.style.display = 'none';
                }
            });
        });
        
        // Créer le viewer
        this.resourceFullPageViewer = new ResourceFullPageViewer('#fullpage-viewer-container', {
            onBack: () => {
                console.log('🔙 Retour à la liste des ressources');
                this.hideResourceViewer();
            },
            onEdit: (resource) => this.editResource(resource),
            onDelete: (resourceId) => this.deleteResource(resourceId),
            onLike: (resourceId) => this.toggleLike(resourceId),
            onFavorite: (resourceId) => this.toggleFavorite(resourceId),
            onDownload: (resourceId) => this.incrementDownloadCount(resourceId),
            onShare: () => this.shareResource(resource),
            onAddToCollection: (resourceId) => this.addToCollection(resourceId),
            loadSimilarResources: (resource) => this.loadSimilarResources(resource)
        });

        const isOwner = this.isResourceOwner(resource);
        this.resourceFullPageViewer.showResource(resource, isOwner);
        
        // Mettre à jour l'URL
        window.history.pushState({}, '', `/home#resources/view/${resource.id}`);
    }

    restoreResourcesList() {
        const mainContainer = document.getElementById('app-content');
        if (mainContainer && this.savedResourcesContent) {
            mainContainer.innerHTML = this.savedResourcesContent;
            // Réinitialiser les composants après restauration
            this.isInitialized = false;
            setTimeout(() => this.initializeComponents(), 100);
        }
    }

    hideResourceViewer() {
        const mainContent = document.getElementById('app-content');
        
        if (!mainContent) {
            console.error('❌ Container app-content non trouvé');
            return;
        }
        
        // Retirer la classe du body
        document.body.classList.remove('resource-viewer-active');
        
        // Nettoyer le viewer avant de restaurer
        if (this.resourceFullPageViewer) {
            this.resourceFullPageViewer = null;
        }
        
        // Si on n'a pas de contenu sauvegardé (cas après actualisation), recréer le module
        if (!this.savedModuleContent) {
            console.log('⚠️ Pas de contenu sauvegardé, régénération du module');
            // Régénérer le contenu du module
            const content = `
                <div class="w-full">
                    <!-- Zone de recherche et filtres (avec header intégré) -->
                    <div id="search-filters-container"></div>

                    <!-- Zone de contenu principal -->
                    <div id="resources-list-container"></div>

                    <!-- Modals et overlays -->
                    <div id="upload-form-container"></div>
                </div>

                <!-- Bouton flottant pour ajouter une ressource -->
                <div class="fab" id="add-resource-fab" title="Ajouter une ressource">
                    ➕
                </div>
            `;
            mainContent.innerHTML = content;
        } else {
            // Supprimer le header existant pour éviter la duplication
            const existingHeader = document.querySelector('#resources-module-header');
            if (existingHeader) {
                existingHeader.remove();
            }
            
            // Restaurer le contenu sauvegardé
            mainContent.innerHTML = this.savedModuleContent;
            this.savedModuleContent = null;
        }
        
        // Réafficher tous les éléments masqués avec leur display original
        if (this.hiddenElements && this.hiddenElements.length > 0) {
            this.hiddenElements.forEach(({ element, originalDisplay }) => {
                if (element) {
                    element.style.display = originalDisplay || '';
                }
            });
            this.hiddenElements = [];
        }
        
        // Fallback pour s'assurer que navbar et bottom-nav sont visibles
        const navbar = document.querySelector('.navbar');
        const bottomNav = document.querySelector('.bottom-navigation');
        if (navbar && navbar.style.display === 'none') navbar.style.display = '';
        if (bottomNav && bottomNav.style.display === 'none') bottomNav.style.display = '';
        
        // IMPORTANT : Réinitialiser avec requestAnimationFrame pour s'assurer que le DOM est prêt
        this.isInitialized = false;
        requestAnimationFrame(() => {
            this.initializeComponents();
        });
        
        // Mettre à jour l'URL
        window.history.pushState({}, '', '/home#resources');
    }
    
    restoreFullApplication() {
        // Méthode de secours si nécessaire
        this.hideResourceViewer();
    }

    async loadSimilarResources(resource) {
        try {
            // Charger des ressources similaires basées sur la matière et le niveau
            const filters = {
                matiere: resource.matiere,
                niveau: resource.niveau,
                exclude_id: resource.id,
                limit: 3
            };
            
            const response = await resourcesApi.getAll(filters);
            if (response && response.success && response.data) {
                return response.data;
            }
        } catch (error) {
            console.error('Erreur lors du chargement des ressources similaires:', error);
        }
        
        // Fallback: retourner quelques ressources de démo
        return this.demoResources.slice(0, 3).filter(r => r.id !== resource.id);
    }

    showUploadForm(editMode = false, resourceData = null) {
        console.log(editMode ? '✏️ Mode édition' : '📤 Nouveau formulaire');

        if (!this.uploadForm) {
            this.uploadForm = new UploadForm('#upload-form-container', {
                onSubmit: (formData, file) => this.handleResourceSubmit(formData, file, editMode, resourceData?.id),
                onCancel: () => console.log('❌ Annulation du formulaire'),
                showModal: true,
                editMode: editMode,
                resourceData: resourceData
            });
        } else {
            // Réinitialiser le formulaire existant
            this.uploadForm.close();
            this.uploadForm = new UploadForm('#upload-form-container', {
                onSubmit: (formData, file) => this.handleResourceSubmit(formData, file, editMode, resourceData?.id),
                onCancel: () => console.log('❌ Annulation du formulaire'),
                showModal: true,
                editMode: editMode,
                resourceData: resourceData
            });
        }
    }

    editResource(resource) {
        console.log('✏️ Édition de la ressource:', resource.titre);
        this.showUploadForm(true, resource);
    }

    async handleResourceSubmit(formData, file, editMode = false, resourceId = null) {
        try {
            console.log(editMode ? '💾 Mise à jour...' : '📤 Création...', formData);

            if (editMode && resourceId) {
                // Mise à jour
                const response = await resourcesApi.update(resourceId, formData, file);
                if (response.success) {
                    console.log('✅ Ressource mise à jour');
                    await this.loadResources(); // Recharger la liste
                    this.showSuccess('Ressource mise à jour avec succès');
                } else {
                    throw new Error(response.message);
                }
            } else {
                // Création
                const response = await resourcesApi.create(formData, file);
                if (response.success) {
                    console.log('✅ Nouvelle ressource créée');
                    // Ajouter la nouvelle ressource en tête de liste
                    this.resourcesList.addResource(response.data);
                    this.showSuccess('Ressource créée avec succès');
                } else {
                    throw new Error(response.message);
                }
            }

        } catch (error) {
            console.error('❌ Erreur lors de la soumission:', error);
            this.showError(error.message || 'Erreur lors de l\'enregistrement');
            throw error; // Propager l'erreur pour que le formulaire puisse la gérer
        }
    }

    async toggleLike(resourceId, isLiked) {
        try {
            console.log(isLiked ? '❤️ Like' : '💔 Unlike', resourceId);

            const response = await resourcesApi.toggleLike(resourceId);
            if (response.success) {
                // Mettre à jour l'interface
                this.resourcesList.updateResourceLikeStatus(resourceId, isLiked, response.data.likes_count);
                if (this.resourceViewer) {
                    this.resourceViewer.updateLikeStatus(isLiked, response.data.likes_count);
                }
            }

        } catch (error) {
            console.error('❌ Erreur lors du like:', error);
            this.showError('Erreur lors de la mise à jour du like');
        }
    }

    async toggleFavorite(resourceId, isFavorited) {
        try {
            console.log(isFavorited ? '⭐ Favori ajouté' : '☆ Favori retiré', resourceId);

            const response = await resourcesApi.toggleFavorite(resourceId);
            if (response.success) {
                // Mettre à jour l'interface
                this.resourcesList.updateResourceFavoriteStatus(resourceId, isFavorited);
                if (this.resourceViewer) {
                    this.resourceViewer.updateFavoriteStatus(isFavorited);
                }
            }

        } catch (error) {
            console.error('❌ Erreur lors du favori:', error);
            this.showError('Erreur lors de la mise à jour du favori');
        }
    }

    async deleteResource(resourceId) {
        try {
            console.log('🗑️ Suppression de la ressource:', resourceId);

            const response = await resourcesApi.delete(resourceId);
            if (response.success) {
                // Retirer de la liste
                this.resourcesList.removeResource(resourceId);
                // Fermer le viewer si ouvert
                if (this.resourceViewer) {
                    this.resourceViewer.close();
                }
                this.showSuccess('Ressource supprimée avec succès');
            }

        } catch (error) {
            console.error('❌ Erreur lors de la suppression:', error);
            this.showError('Erreur lors de la suppression');
        }
    }

    async incrementDownloadCount(resourceId) {
        try {
            // Incrémenter le compteur de téléchargements
            await resourcesApi.incrementDownloads(resourceId);
            console.log('📥 Téléchargement comptabilisé:', resourceId);

        } catch (error) {
            console.error('❌ Erreur lors de l\'incrémentation:', error);
        }
    }

    shareResource(resource) {
        const url = `${window.location.origin}/home#resources/view/${resource.id}`;
        
        if (navigator.share) {
            navigator.share({
                title: resource.titre,
                text: resource.description || 'Ressource pédagogique - Diagana School',
                url: url
            }).catch(() => {
                this.copyToClipboard(url);
            });
        } else {
            this.copyToClipboard(url);
        }
    }

    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showSuccess('Lien copié dans le presse-papiers!');
        }).catch(() => {
            this.showError('Impossible de copier le lien');
        });
    }

    async addToCollection(resourceId) {
        try {
            console.log('📚 Ajout à une collection:', resourceId);
            // TODO: Implémenter la logique d'ajout à une collection
            // Pour l'instant, afficher un message
            this.showSuccess('Fonctionnalité en cours de développement');
        } catch (error) {
            console.error('❌ Erreur lors de l\'ajout à la collection:', error);
            this.showError('Erreur lors de l\'ajout à la collection');
        }
    }

    attachFabListener() {
        const fab = document.querySelector('#add-resource-fab');
        if (fab) {
            // Retirer les anciens listeners avant d'en ajouter de nouveaux
            const newFab = fab.cloneNode(true);
            fab.parentNode.replaceChild(newFab, fab);
            
            newFab.addEventListener('click', () => {
                // Animation du bouton
                newFab.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    newFab.style.transform = 'scale(1.1)';
                    setTimeout(() => {
                        newFab.style.transform = 'scale(1)';
                    }, 100);
                }, 100);

                // Afficher le formulaire
                this.showUploadForm();
            });
            
            // Vérifier que le FAB est visible
            newFab.style.display = 'flex';
            console.log('✅ FAB attaché et visible');
        } else {
            console.warn('⚠️ FAB non trouvé');
        }
    }

    // Méthodes utilitaires
    async getCurrentUser() {
        try {
            const user = await authApi.getCurrentUser();
            return user.success ? user.data : null;
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'utilisateur:', error);
            return null;
        }
    }

    isResourceOwner(resource) {
        return this.currentUser && resource.auteur && 
               resource.auteur.id === this.currentUser.id;
    }

    showSuccess(message) {
        // Notification de succès simple
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        notification.textContent = `✅ ${message}`;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    showError(message) {
        // Notification d'erreur simple
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        notification.textContent = `❌ ${message}`;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    generateDemoData() {
        // Données de démonstration répliquant exactement test-CAT
        return [
            {
                id: 'demo-1',
                titre: 'Cours d\'algèbre - Équations du 2nd degré',
                description: 'Cours complet sur les équations du second degré avec méthodes de résolution et exercices corrigés.',
                type: 'document',
                matiere: 'Mathématiques',
                niveau: '3ème',
                tags: ['algèbre', 'équations', 'exercices'],
                auteur: {
                    id: 'demo-user-1',
                    nom: 'Ba',
                    prenom: 'Mohamed',
                    role: 'professeur'
                },
                stats: {
                    vues: 156,
                    likes: 24,
                    commentaires: 7,
                    telechargements: 45
                },
                created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // Il y a 2h
                is_liked: false,
                is_favorited: false,
                is_public: true,
                contenu: {
                    description: 'Document PDF de 25 pages avec exercices progressifs'
                }
            },
            {
                id: 'demo-2',
                titre: 'Schémas du système solaire',
                description: 'Collection d\'images haute qualité présentant les planètes et leurs caractéristiques principales.',
                type: 'media',
                matiere: 'Sciences',
                niveau: '4ème',
                tags: ['astronomie', 'planètes', 'système solaire'],
                auteur: {
                    id: 'demo-user-2',
                    nom: 'Dubois',
                    prenom: 'Marie',
                    role: 'professeur'
                },
                stats: {
                    vues: 89,
                    likes: 18,
                    commentaires: 3,
                    telechargements: 32
                },
                created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Hier
                is_liked: true,
                is_favorited: false,
                is_public: true,
                contenu: {
                    description: 'Images haute résolution avec légendes explicatives'
                }
            },
            {
                id: 'demo-3',
                titre: 'Analyse littéraire - Les Misérables',
                description: 'Vidéo d\'analyse des thèmes principaux et des personnages du roman de Victor Hugo.',
                type: 'video',
                matiere: 'Français',
                niveau: '1ère',
                tags: ['littérature', 'hugo', 'analyse'],
                auteur: {
                    id: 'demo-user-3',
                    nom: 'Martin',
                    prenom: 'Pierre',
                    role: 'professeur'
                },
                stats: {
                    vues: 203,
                    likes: 32,
                    commentaires: 12,
                    telechargements: 67
                },
                created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // Il y a 3j
                is_liked: false,
                is_favorited: true,
                is_public: true,
                contenu: {
                    description: 'Vidéo de 45 minutes avec support de présentation'
                }
            },
            {
                id: 'demo-4',
                titre: 'Musée virtuel - Seconde Guerre Mondiale',
                description: 'Visite interactive du mémorial avec documents d\'époque et témoignages authentiques.',
                type: 'lien',
                matiere: 'Histoire',
                niveau: 'Terminale',
                tags: ['guerre mondiale', 'histoire', 'mémoire'],
                auteur: {
                    id: 'demo-user-4',
                    nom: 'Leroy',
                    prenom: 'Sophie',
                    role: 'professeur'
                },
                stats: {
                    vues: 67,
                    likes: 15,
                    commentaires: 8,
                    telechargements: 0
                },
                created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // Il y a 1sem
                is_liked: false,
                is_favorited: false,
                is_public: true,
                contenu: {
                    url: 'https://musee-virtuel.exemple.fr/ww2',
                    description: 'Lien vers la visite virtuelle interactive'
                }
            },
            {
                id: 'demo-5',
                titre: 'Grammar Guide - Present Perfect',
                description: 'Guide complet sur l\'utilisation du present perfect avec exercices pratiques et règles détaillées.',
                type: 'document',
                matiere: 'Anglais',
                niveau: '2nde',
                tags: ['grammaire', 'present perfect', 'anglais'],
                auteur: {
                    id: 'demo-user-5',
                    nom: 'Lambert',
                    prenom: 'Anna',
                    role: 'professeur'
                },
                stats: {
                    vues: 134,
                    likes: 21,
                    commentaires: 5,
                    telechargements: 58
                },
                created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // Il y a 2sem
                is_liked: true,
                is_favorited: true,
                is_public: true,
                contenu: {
                    description: 'PDF interactif avec exercices auto-correctifs'
                }
            },
            {
                id: 'demo-6',
                titre: 'Figures géométriques 3D',
                description: 'Représentations visuelles des solides géométriques avec formules de volume et surface.',
                type: 'media',
                matiere: 'Mathématiques',
                niveau: '5ème',
                tags: ['géométrie', '3d', 'solides'],
                auteur: {
                    id: 'demo-user-1',
                    nom: 'Ba',
                    prenom: 'Mohamed',
                    role: 'professeur'
                },
                stats: {
                    vues: 98,
                    likes: 19,
                    commentaires: 4,
                    telechargements: 41
                },
                created_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(), // Il y a 3sem
                is_liked: false,
                is_favorited: false,
                is_public: true,
                contenu: {
                    description: 'Schémas détaillés avec animations 3D'
                }
            }
        ];
    }

    // Gérer l'accès direct aux ressources via URL avec hash
    handleDirectResourceAccess() {
        const hash = window.location.hash;
        const match = hash.match(/^#resources\/view\/([^\/\?]+)/);
        
        if (match) {
            const resourceId = match[1];
            console.log('🎯 Accès direct à la ressource via hash:', resourceId);
            
            // Charger et afficher la ressource
            this.loadAndViewResource(resourceId);
        }
    }

    async loadAndViewResource(resourceId) {
        try {
            console.log('📥 Chargement de la ressource:', resourceId);
            
            // Charger la ressource depuis l'API
            const resource = await resourcesApi.getById(resourceId);
            console.log('📦 Ressource chargée:', resource);
            
            if (resource && resource.id) {
                // Afficher la ressource en pleine page
                this.viewResource(resource);
            } else {
                console.error('Ressource non trouvée ou invalide:', resourceId, resource);
                this.showError('Ressource non trouvée');
                // Rediriger vers la liste des ressources
                window.history.pushState({}, '', '/home#resources');
            }
        } catch (error) {
            console.error('❌ Erreur lors du chargement de la ressource:', error);
            this.showError('Impossible de charger la ressource');
            // Rediriger vers la liste des ressources
            window.history.pushState({}, '', '/resources');
        }
    }

    // Méthode de vérification des éléments UI
    verifyUIElements() {
        const checks = [
            { name: 'Container principal', selector: '.max-w-6xl' },
            { name: 'Barre de recherche', selector: '#search-input' },
            { name: 'Bouton tri', selector: '#sort-button' },
            { name: 'Filtres', selector: '.filter-pill' },
            { name: 'Bouton "Nouvelle ressource"', selector: '#add-resource-btn' },
            { name: 'FAB', selector: '#add-resource-fab' },
            { name: 'Container ressources', selector: '#resources-list-container' }
        ];
        
        checks.forEach(check => {
            const element = document.querySelector(check.selector);
            if (element) {
                console.log(`✅ ${check.name}: trouvé`);
            } else {
                console.warn(`⚠️ ${check.name}: MANQUANT (${check.selector})`);
            }
        });
    }

    // Méthode de nettoyage
    destroy() {
        if (this.searchFilters) {
            this.searchFilters = null;
        }
        if (this.resourcesList) {
            this.resourcesList = null;
        }
        if (this.uploadForm) {
            this.uploadForm.close();
            this.uploadForm = null;
        }
        if (this.resourceViewer) {
            this.resourceViewer.close();
            this.resourceViewer = null;
        }
        this.isInitialized = false;
    }
}

// Export pour utilisation dans la SPA
export { ResourcesModule };