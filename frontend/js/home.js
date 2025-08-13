/**
 * DiaganaApp - Application SPA principale
 * Gère la navigation, l'authentification et le chargement dynamique des modules
 */
class DiaganaApp {
    constructor() {
        this.currentModule = 'dashboard';
        this.userData = null;
        this.isAuthenticated = false;
        this.modules = new Map();
        this.apiClients = null;
        
        this.init();
    }

    async init() {
        console.log('🚀 Initialisation de DiaganaApp...');
        
        try {
            // Vérifier l'authentification
            await this.checkAuth();
            
            // Charger les clients API
            await this.loadApiClients();
            
            // Initialiser la navigation
            this.initNavigation();
            
            // Charger le module initial depuis l'URL
            this.loadModuleFromUrl();
            
            console.log('✅ DiaganaApp initialisé avec succès');
        } catch (error) {
            console.error('❌ Erreur lors de l\'initialisation:', error);
            this.showError('Erreur d\'initialisation de l\'application');
        }
    }

    async checkAuth() {
        const token = localStorage.getItem('authToken');
        
        if (!token) {
            this.redirectToAuth();
            return;
        }

        // Essayer d'abord le cache local
        const cachedUser = localStorage.getItem('currentUser');
        if (cachedUser) {
            try {
                this.userData = JSON.parse(cachedUser);
                this.isAuthenticated = true;
                this.updateUserInfo();
                console.log('✅ Utilisateur chargé depuis le cache:', this.userData.prenom, this.userData.nom);
                // Vérifier quand même le token en arrière-plan
                this.verifyTokenInBackground();
                return;
            } catch (error) {
                console.warn('Cache utilisateur corrompu, vérification via API');
            }
        }

        try {
            // Vérifier la validité du token avec l'API existante
            const response = await fetch('/api/auth/me', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.userData = data.user;
                this.isAuthenticated = true;
                // Mettre à jour le cache
                localStorage.setItem('currentUser', JSON.stringify(data.user));
                this.updateUserInfo();
                console.log('✅ Utilisateur authentifié:', this.userData.prenom, this.userData.nom);
            } else {
                throw new Error('Token invalide');
            }
        } catch (error) {
            console.warn('⚠️ Erreur d\'authentification:', error);
            localStorage.removeItem('authToken');
            localStorage.removeItem('currentUser');
            this.redirectToAuth();
        }
    }

    async verifyTokenInBackground() {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        try {
            const response = await fetch('/api/auth/me', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                // Token invalide, nettoyer et rediriger
                localStorage.removeItem('authToken');
                localStorage.removeItem('currentUser');
                this.redirectToAuth();
            }
        } catch (error) {
            console.warn('⚠️ Vérification du token en arrière-plan échouée');
        }
    }

    async loadApiClients() {
        try {
            // Essayer de charger les clients API
            const { getApi } = await import('/static/api/clients.js');
            this.apiClients = await getApi();
            console.log('✅ Clients API chargés');
        } catch (error) {
            console.warn('⚠️ Clients API non disponibles, utilisation de fetch direct');
            // Les appels API fonctionneront quand même avec fetch direct
            this.apiClients = null;
        }
    }

    initNavigation() {
        // Gestion des liens de navigation
        document.addEventListener('click', (e) => {
            const link = e.target.closest('[data-module]');
            if (link) {
                e.preventDefault();
                const module = link.getAttribute('data-module');
                this.navigateTo(module);
            }
        });

        // Gestion du back/forward du navigateur
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.module) {
                this.loadModule(e.state.module, false);
            } else {
                this.loadModuleFromUrl();
            }
        });

        console.log('✅ Navigation SPA initialisée');
    }

    loadModuleFromUrl() {
        const hash = window.location.hash.slice(1);
        
        // Gérer les URLs avec segments supplémentaires (ex: resources/view/id)
        if (hash.startsWith('resources/view/')) {
            // Charger d'abord le module resources puis la vue détaillée
            this.loadModule('resources', false, () => {
                // Après le chargement du module, attendre que les composants soient initialisés
                setTimeout(() => {
                    if (this.modules.get('resources')) {
                        const resourcesModule = this.modules.get('resources');
                        // Attendre que le module soit complètement initialisé
                        const checkAndLoad = () => {
                            if (resourcesModule.isInitialized) {
                                resourcesModule.handleDirectResourceAccess();
                            } else {
                                setTimeout(checkAndLoad, 100);
                            }
                        };
                        checkAndLoad();
                    }
                }, 200);
            });
        } else {
            // Extraire seulement le module principal (premier segment)
            const module = hash.split('/')[0] || 'dashboard';
            this.loadModule(module, false);
        }
    }

    navigateTo(module) {
        window.history.pushState({ module }, '', `#${module}`);
        this.loadModule(module);
    }

    async loadModule(moduleName, updateHistory = true, callback = null) {
        // Ne pas recharger si c'est déjà le module actuel, sauf si on a un callback
        if (this.currentModule === moduleName && !callback) return;

        console.log(`🔄 Chargement du module: ${moduleName}`);
        
        try {
            // Mettre à jour la navigation active
            this.updateActiveNavigation(moduleName);
            
            // Afficher le loading
            this.showLoading();
            
            // Charger le module approprié
            let moduleContent;
            let moduleInstance = null;
            
            switch (moduleName) {
                case 'dashboard':
                    moduleContent = await this.loadDashboardModule();
                    break;
                case 'resources':
                    const result = await this.loadResourcesModule();
                    moduleContent = result.content;
                    moduleInstance = result.instance;
                    break;
                case 'collections':
                    moduleContent = await this.loadCollectionsModule();
                    break;
                case 'profile':
                    moduleContent = await this.loadProfileModule();
                    break;
                default:
                    moduleContent = await this.loadDashboardModule();
                    moduleName = 'dashboard';
            }
            
            // Injecter le contenu
            this.renderModule(moduleContent);
            
            // Sauvegarder l'instance du module si elle existe
            if (moduleInstance) {
                this.modules.set(moduleName, moduleInstance);
            }
            
            this.currentModule = moduleName;
            
            // Fermer le menu mobile si ouvert
            this.closeMobileMenu();
            
            console.log(`✅ Module ${moduleName} chargé`);
            
            // Exécuter le callback si fourni
            if (callback) {
                callback();
            }
            
        } catch (error) {
            console.error(`❌ Erreur lors du chargement du module ${moduleName}:`, error);
            this.showError(`Impossible de charger le module ${moduleName}`);
        }
    }

    async loadDashboardModule() {
        // Module Dashboard avec statistiques et activité récente
        return `
            <div class="animate-fade-in">
                <!-- Header avec salutation -->
                <div class="mb-8">
                    <div class="flex items-center justify-between mb-2">
                        <h1 class="text-3xl font-bold" style="color: var(--color-gray-900);">
                            Bonjour ${this.userData?.prenom || 'Utilisateur'} ! 👋
                        </h1>
                    </div>
                    <p style="color: var(--color-gray-500); font-size: 1.1rem;">
                        Voici un aperçu de votre activité sur Diagana School
                    </p>
                </div>

                <!-- Statistiques rapides -->
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                    <div class="card stats-card" style="padding: 1rem;">
                        <div class="stats-number" style="color: var(--color-accent-primary); font-size: 1.5rem;">-</div>
                        <div style="color: var(--color-gray-500); font-size: 0.75rem;">Ressources créées</div>
                    </div>
                    <div class="card stats-card" style="padding: 1rem;">
                        <div class="stats-number" style="color: var(--color-accent-secondary); font-size: 1.5rem;">-</div>
                        <div style="color: var(--color-gray-500); font-size: 0.75rem;">Collections</div>
                    </div>
                    <div class="card stats-card" style="padding: 1rem;">
                        <div class="stats-number" style="color: var(--color-accent-info); font-size: 1.5rem;">-</div>
                        <div style="color: var(--color-gray-500); font-size: 0.75rem;">Vues totales</div>
                    </div>
                    <div class="card stats-card" style="padding: 1rem;">
                        <div class="stats-number" style="color: var(--color-accent-primary); font-size: 1.5rem;">-</div>
                        <div style="color: var(--color-gray-500); font-size: 0.75rem;">Likes reçus</div>
                    </div>
                </div>

                <!-- Actions rapides -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div class="lg:col-span-2">
                        <div class="card">
                            <div class="card-header">
                                <h2 class="text-xl font-semibold" style="color: var(--color-gray-900);">
                                    📚 Bienvenue sur Diagana School
                                </h2>
                            </div>
                            <div class="space-y-4">
                                <p style="color: var(--color-gray-600);">
                                    Votre plateforme éducative moderne est prête ! Explorez les différents modules pour commencer à créer et organiser vos ressources pédagogiques.
                                </p>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div class="p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors cursor-pointer" onclick="window.diaganaApp.navigateTo('resources')">
                                        <div class="flex items-center space-x-3">
                                            <div class="text-2xl">📁</div>
                                            <div>
                                                <div class="font-medium">Ressources</div>
                                                <div class="text-sm text-gray-500">Gérer vos contenus</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors cursor-pointer" onclick="window.diaganaApp.navigateTo('collections')">
                                        <div class="flex items-center space-x-3">
                                            <div class="text-2xl">📚</div>
                                            <div>
                                                <div class="font-medium">Collections</div>
                                                <div class="text-sm text-gray-500">Organiser en thèmes</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors cursor-pointer" onclick="window.diaganaApp.navigateTo('profile')">
                                        <div class="flex items-center space-x-3">
                                            <div class="text-2xl">👥</div>
                                            <div>
                                                <div class="font-medium">Profils</div>
                                                <div class="text-sm text-gray-500">Communauté</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors">
                                        <div class="flex items-center space-x-3">
                                            <div class="text-2xl">⚙️</div>
                                            <div>
                                                <div class="font-medium">Paramètres</div>
                                                <div class="text-sm text-gray-500">Configuration</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="space-y-6">
                        <!-- Actions rapides -->
                        <div class="card">
                            <div class="card-header">
                                <h2 class="text-lg font-semibold" style="color: var(--color-gray-900);">
                                    ⚡ Actions rapides
                                </h2>
                            </div>
                            <div class="space-y-3">
                                <button class="btn-primary w-full text-center" onclick="alert('Module en développement')">
                                    📄 Nouvelle ressource
                                </button>
                                <button class="btn-secondary w-full text-center" onclick="alert('Module en développement')">
                                    📚 Créer une collection
                                </button>
                            </div>
                        </div>

                        <!-- Statut du système -->
                        <div class="card">
                            <div class="card-header">
                                <h2 class="text-lg font-semibold" style="color: var(--color-gray-900);">
                                    🚀 Statut du système
                                </h2>
                            </div>
                            <div class="space-y-3">
                                <div class="flex items-center justify-between">
                                    <span class="text-sm">Backend API</span>
                                    <span class="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">✅ Opérationnel</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-sm">Base de données</span>
                                    <span class="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">✅ Connectée</span>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="text-sm">Stockage fichiers</span>
                                    <span class="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">✅ Disponible</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async loadResourcesModule() {
        try {
            console.log('🔄 Chargement du module Ressources complet...');
            const { ResourcesModule } = await import('/static/js/resources.js');
            const resourcesModule = new ResourcesModule();
            const content = await resourcesModule.init();
            return { content, instance: resourcesModule };
        } catch (error) {
            console.error('❌ Erreur lors du chargement du module Ressources:', error);
            // Fallback vers placeholder en cas d'erreur
            return { content: `
                <div class="animate-fade-in">
                    <div class="text-center py-12">
                        <div style="font-size: 4rem; margin-bottom: 1rem;">⚠️</div>
                        <h2 class="text-2xl font-semibold mb-4" style="color: var(--color-gray-900);">
                            Erreur de chargement
                        </h2>
                        <p class="text-lg mb-6" style="color: var(--color-gray-600);">
                            Impossible de charger le module Ressources
                        </p>
                        <div class="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
                            <p class="text-sm" style="color: var(--color-gray-700);">
                                Erreur: ${error.message || 'Erreur inconnue'}
                            </p>
                        </div>
                        <div class="mt-8">
                            <button class="btn-primary mr-4" onclick="window.diaganaApp.navigateTo('dashboard')">
                                🏠 Retour au Dashboard
                            </button>
                            <button class="btn-secondary" onclick="location.reload()">
                                🔄 Recharger
                            </button>
                        </div>
                    </div>
                </div>
            `, instance: null };
        }
    }

    async loadCollectionsModule() {
        return `
            <div class="animate-fade-in">
                <div class="text-center py-12">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">🔨</div>
                    <h2 class="text-2xl font-semibold mb-4" style="color: var(--color-gray-900);">
                        Module Collections
                    </h2>
                    <p class="text-lg mb-6" style="color: var(--color-gray-600);">
                        Ce module est en cours de développement
                    </p>
                    <div class="bg-green-50 border border-green-200 rounded-lg p-6 max-w-2xl mx-auto">
                        <h3 class="font-semibold mb-3" style="color: var(--color-accent-secondary);">
                            📚 Fonctionnalités à venir :
                        </h3>
                        <ul class="text-left space-y-2" style="color: var(--color-gray-700);">
                            <li>• 📁 Organisation de ressources en collections thématiques</li>
                            <li>• 🎯 Collections publiques et privées</li>
                            <li>• 📊 Suivi de progression</li>
                            <li>• 🔄 Duplication et réorganisation</li>
                            <li>• 👥 Partage et collaboration</li>
                        </ul>
                    </div>
                    <div class="mt-8">
                        <button class="btn-primary mr-4" onclick="window.diaganaApp.navigateTo('dashboard')">
                            🏠 Retour au Dashboard
                        </button>
                        <button class="btn-secondary" onclick="window.diaganaApp.navigateTo('profile')">
                            👥 Voir Profils
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    async loadProfileModule() {
        try {
            const { ProfileModule } = await import('/static/js/profile.js');
            const profileModule = new ProfileModule();
            return await profileModule.init(this.userData);
        } catch (error) {
            console.warn('Impossible de charger le module Profil, utilisation du fallback');
            return `
                <div class="animate-fade-in">
                    <div class="text-center py-12">
                        <div style="font-size: 4rem; margin-bottom: 1rem;">🔨</div>
                        <h2 class="text-2xl font-semibold mb-4" style="color: var(--color-gray-900);">
                            Module Profils
                        </h2>
                        <p class="text-lg mb-6" style="color: var(--color-gray-600);">
                            Ce module est en cours de développement
                        </p>
                        <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto">
                            <h3 class="font-semibold mb-3" style="color: var(--color-accent-info);">
                                👥 Fonctionnalités à venir :
                            </h3>
                            <ul class="text-left space-y-2" style="color: var(--color-gray-700);">
                                <li>• 👤 Gestion de profil personnalisé</li>
                                <li>• 🔍 Recherche d'utilisateurs par rôle/matière</li>
                                <li>• 👨‍🏫 Annuaire professeurs et élèves</li>
                                <li>• 📈 Système de suivi et statistiques</li>
                                <li>• 💬 Journal d'activité personnalisé</li>
                            </ul>
                        </div>
                        <div class="mt-8">
                            <button class="btn-primary mr-4" onclick="window.diaganaApp.navigateTo('dashboard')">
                                🏠 Retour au Dashboard
                            </button>
                            <button class="btn-secondary" onclick="window.diaganaApp.navigateTo('resources')">
                                📁 Voir Ressources
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    updateActiveNavigation(activeModule) {
        // Mettre à jour la navigation desktop
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-module') === activeModule) {
                link.classList.add('active');
            }
        });

        // Mettre à jour la navigation mobile (menu latéral)
        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-module') === activeModule) {
                link.classList.add('active');
            }
        });

        // Mettre à jour la bottom navigation
        document.querySelectorAll('.bottom-nav-item').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-module') === activeModule) {
                link.classList.add('active');
            }
        });
    }

    updateUserInfo() {
        if (!this.userData) return;

        const initials = `${this.userData.prenom?.[0] || ''}${this.userData.nom?.[0] || ''}`.toUpperCase();
        const fullName = `${this.userData.prenom || ''} ${this.userData.nom || ''}`.trim();
        const role = this.userData.role === 'professeur' ? 'Professeur' : 'Élève';

        // Mettre à jour l'avatar et info desktop
        const desktopAvatar = document.querySelector('#userInfoDesktop .user-avatar');
        const desktopInfo = document.querySelector('#userInfoDesktop .user-info-desktop');
        
        if (desktopAvatar) desktopAvatar.textContent = initials;
        if (desktopInfo) {
            desktopInfo.innerHTML = `
                <div style="color: var(--color-gray-900); font-weight: 500;">${fullName}</div>
                <div style="color: var(--color-gray-500);">${role}</div>
            `;
        }

        // Mettre à jour l'info mobile
        const mobileUserInfo = document.querySelector('#mobileUserInfo');
        if (mobileUserInfo) {
            mobileUserInfo.innerHTML = `
                <div class="user-avatar">${initials}</div>
                <div>
                    <div style="color: var(--color-gray-900); font-weight: 600;">${fullName}</div>
                    <div style="color: var(--color-gray-500); font-size: 0.875rem;">${role}</div>
                </div>
            `;
        }
    }

    showLoading() {
        const container = document.getElementById('app-content');
        if (container) {
            container.innerHTML = `
                <div class="loading animate-fade-in">
                    <div>
                        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mr-3"></div>
                        Chargement...
                    </div>
                </div>
            `;
        }
    }

    renderModule(content) {
        const container = document.getElementById('app-content');
        if (container) {
            container.innerHTML = content;
            
            // Réappliquer l'observer pour les animations
            if (window.scrollObserver) {
                container.querySelectorAll('.animate-fade-in').forEach(el => {
                    el.style.opacity = '0';
                    el.style.transform = 'translateY(20px)';
                    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
                    window.scrollObserver.observe(el);
                });
            }
        }
    }

    showError(message) {
        const container = document.getElementById('app-content');
        if (container) {
            container.innerHTML = `
                <div class="animate-fade-in">
                    <div class="card" style="border-color: #ef4444; background: rgba(239, 68, 68, 0.05);">
                        <div class="text-center">
                            <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
                            <h2 class="text-xl font-semibold mb-4" style="color: #ef4444;">
                                Erreur
                            </h2>
                            <p style="color: var(--color-gray-600); margin-bottom: 2rem;">
                                ${message}
                            </p>
                            <button class="btn-primary" onclick="location.reload()">
                                🔄 Recharger la page
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    closeMobileMenu() {
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    logout() {
        if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
            localStorage.removeItem('authToken');
            this.redirectToAuth();
        }
    }

    redirectToAuth() {
        window.location.href = '/auth';
    }
}

// Initialiser l'application quand le DOM est prêt
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.diaganaApp = new DiaganaApp();
    });
} else {
    window.diaganaApp = new DiaganaApp();
}

// Export pour utilisation externe
export { DiaganaApp };