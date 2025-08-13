# 🏗️ Architecture - Diagana School

## Vue d'ensemble

Diagana School suit une architecture moderne full-stack avec séparation claire entre backend (API Node.js) et frontend (SPA Vanilla JavaScript), intégrée dans un serveur Express unique.

---

## 🌳 Structure Complète du Projet

```
diagana-school/
├── .claude/
│   └── settings.local.json
├── .gitignore
├── backend/                             # 🔧 API Node.js MVC
│   ├── config/                          # Configuration services
│   │   ├── index.js                     # Config centralisée
│   │   ├── jwt.js                       # JWT tokens
│   │   ├── multer.js                    # Upload fichiers
│   │   ├── supabase.js                  # Base de données
│   │   └── wasabi.js                    # Stockage S3
│   ├── controllers/                     # 🎮 Contrôleurs métier
│   │   ├── auth.js                      # Authentification
│   │   ├── collections.js               # Collections ressources
│   │   ├── commentaires.js              # Commentaires
│   │   ├── profil.js                    # Profils utilisateurs
│   │   └── ressources.js                # Ressources pédagogiques
│   ├── middlewares/
│   │   └── auth.js                      # Middleware authentification
│   ├── migrations/                      # 🗄️ Scripts base de données
│   │   ├── mig-1.sql                    # Tables principales
│   │   ├── mig-2.sql                    # Triggers et fonctions
│   │   ├── mig-3.sql                    # Données initiales
│   │   └── mig-4.sql                    # Optimisations
│   ├── models/                          # 📊 Modèles de données
│   │   ├── auth.js                      # Modèle utilisateurs
│   │   ├── collections.js               # Modèle collections
│   │   ├── commentaires.js              # Modèle commentaires
│   │   ├── profil.js                    # Modèle profils
│   │   └── ressources.js                # Modèle ressources
│   ├── routes/                          # 🛤️ Routes API
│   │   ├── auth.js                      # Routes authentification
│   │   ├── collections.js               # Routes collections
│   │   ├── commentaires.js              # Routes commentaires
│   │   ├── index.js                     # Routes centrales
│   │   ├── profil.js                    # Routes profils
│   │   └── ressources.js                # Routes ressources
│   ├── services/                        # 🔧 Services métier
│   │   ├── auth.js                      # Service authentification
│   │   ├── collections.js               # Service collections
│   │   ├── commentaires.js              # Service commentaires
│   │   ├── profil.js                    # Service profils
│   │   └── ressources.js                # Service ressources
│   ├── test/                           # 🧪 Tests automatisés
│   │   ├── api/                        # Tests endpoints
│   │   │   ├── auth/auth.test.js       # Tests authentification
│   │   │   ├── collections/collections.test.js
│   │   │   ├── profil/profil.test.js
│   │   │   └── ressources/ressources.test.js
│   │   ├── config/                     # Tests configuration
│   │   │   ├── jwt.test.js             # Tests JWT
│   │   │   ├── multer.test.js          # Tests upload
│   │   │   ├── supabase.test.js        # Tests base données
│   │   │   └── wasabi.test.js          # Tests stockage
│   │   └── setup.js                    # Configuration tests
│   ├── utils/
│   │   └── logger.js                   # Système de logs
│   ├── logs/                           # 📋 Journaux système
│   │   ├── access/                     # Logs accès
│   │   ├── error/                      # Logs erreurs
│   │   └── info/                       # Logs info
│   ├── jest.config.js                  # Configuration tests
│   ├── package.json                    # Dépendances backend
│   └── server.js                       # 🚀 Serveur principal
├── frontend/                           # 🎨 Interface utilisateur
│   ├── api/                            # 📡 Clients API JavaScript
│   │   ├── auth.js                     # Client authentification
│   │   ├── collections.js              # Client collections
│   │   ├── comments.js                 # Client commentaires
│   │   ├── index.js                    # Client API central
│   │   ├── profile.js                  # Client profils
│   │   ├── resources.js                # Client ressources
│   │   ├── clients.js                  # Export centralisé
│   │   ├── tests/                      # Tests clients API
│   │   └── README.md                   # Documentation API
│   ├── components/                     # 🧩 Composants modulaires
│   │   ├── auth/                       # Composants authentification
│   │   │   ├── index.js                # Export centralisé
│   │   │   ├── login-form.js           # Formulaire connexion
│   │   │   ├── register-form.js        # Formulaire inscription
│   │   │   └── user-profile.js         # Profil utilisateur
│   │   ├── navigations/                # Composants navigation
│   │   │   ├── index.js                # Export centralisé
│   │   │   ├── navbar-des.js           # Navigation desktop
│   │   │   └── navbar-mob.js           # Navigation mobile
│   │   ├── resources/                  # Composants ressources
│   │   │   └── index.js                # Placeholder
│   │   ├── collections/                # Composants collections
│   │   │   └── index.js                # Placeholder
│   │   └── profile/                    # Composants profils
│   │       └── index.js                # Placeholder
│   ├── js/                            # 🎮 Contrôleurs JavaScript
│   │   ├── auth.js                     # Contrôleur authentification
│   │   ├── collections.js              # Contrôleur collections
│   │   ├── dashboard.js                # Contrôleur dashboard
│   │   ├── home.js                     # Orchestrateur SPA
│   │   ├── index.js                    # Page d'accueil
│   │   ├── navigations.js              # Gestionnaire navigation
│   │   ├── profile.js                  # Contrôleur profils
│   │   └── resources.js                # Contrôleur ressources
│   ├── pages/                          # 📄 Pages HTML
│   │   ├── auth.html                   # Page authentification
│   │   ├── home.html                   # Application SPA
│   │   └── index.html                  # Page d'accueil
│   ├── styles/
│   │   └── main.css                    # Design system complet
│   ├── favicon.svg                     # Icône application
│   └── README.md                       # Documentation frontend
├── docs/                              # 📚 Documentation
│   └── [fichiers de documentation]
├── inspiration/                       # 🎨 Images de référence
│   └── [7 fichiers PNG design]
├── temp/                             # 🗂️ Fichiers temporaires
│   └── [notes de développement]
├── test-DS/                          # 🧪 Pages de démonstration CAT
│   ├── auth.html                     # Interface auth référence
│   ├── dashboard.html                # Interface dashboard référence
│   ├── resources.html                # Interface ressources référence
│   ├── collections.html              # Interface collections référence
│   ├── profiles.html                 # Interface profils référence
│   └── [autres fichiers CAT]
├── DEPLOYMENT.md                     # Guide déploiement
├── Procfile                         # Configuration Heroku
├── render.yaml                      # Configuration Render
└── README.md                        # Documentation principale
```

**Statistiques :**
- **~150 fichiers** organisés en structure modulaire
- **Séparation claire** des responsabilités
- **Architecture évolutive** et maintenable

---

## 🏛️ Architecture Backend (API)

### Structure en Couches MVC

```
┌─────────────────────────────────────────┐
│              Routes Layer               │
│        (Définition endpoints)           │
├─────────────────────────────────────────┤
│            Controllers Layer            │
│      (Logique HTTP + Validation)       │
├─────────────────────────────────────────┤
│             Services Layer              │
│         (Logique métier)                │
├─────────────────────────────────────────┤
│              Models Layer               │
│       (Accès base de données)          │
├─────────────────────────────────────────┤
│          Infrastructure Layer           │
│    (Supabase, Wasabi, JWT, Logs)      │
└─────────────────────────────────────────┘
```

### Stack Technique Backend

**Runtime et Framework :**
- **Node.js 18+** - Runtime JavaScript
- **Express.js** - Framework web minimaliste
- **Vanilla JavaScript** - Pas de TypeScript

**Base de Données :**
- **Supabase** - PostgreSQL as a Service
- **Row Level Security (RLS)** - Sécurité granulaire
- **Triggers automatiques** - Gestion compteurs

**Stockage :**
- **Wasabi S3** - Stockage fichiers compatible AWS S3
- **URLs signées** - Accès sécurisé temporaire

**Authentification :**
- **JWT** - Tokens stateless
- **bcrypt** - Hachage mots de passe (via Supabase)
- **Clés d'inscription** - Contrôle accès

**Qualité et Tests :**
- **Jest** - Framework de tests
- **Supertest** - Tests API HTTP
- **Winston** - Système de logs
- **Joi** - Validation des données

### 4 Modules Fonctionnels

| Module | Endpoints | Fonctionnalités |
|--------|-----------|----------------|
| **Auth** | 7 endpoints | Inscription, connexion, profils, JWT |
| **Ressources** | 21 endpoints | CRUD, upload, likes, favoris, recherche |
| **Collections** | 15 endpoints | Organisation, duplication, partage |
| **Profils** | 12 endpoints | Utilisateurs, suivi social, statistiques |
| **Commentaires** | 4 endpoints | Discussions, modération |

**Total : 59 endpoints API documentés**

### Base de Données (15 Tables)

**Tables Principales :**
- `users` - Utilisateurs étendus
- `registration_keys` - Clés d'inscription
- `ressources` - Ressources pédagogiques  
- `collections` - Collections de ressources
- `collection_ressources` - Association M-N

**Tables d'Interactions :**
- `likes` - Système de likes
- `favoris` - Système de favoris
- `commentaires` - Commentaires avec threads
- `follows` - Suivi social
- `resource_views` - Statistiques consultation

### Sécurité Backend

**Authentification :**
- JWT avec expiration configurable (7 jours)
- Middleware d'authentification sur routes protégées
- Clés d'inscription à usage unique

**Autorisation :**
- Row Level Security (RLS) Supabase
- Vérification de propriété des ressources
- Contrôle d'accès granulaire

**Protection :**
- Rate limiting (100 req/15min global)
- Validation stricte avec Joi
- CORS configuré par environnement
- Helmet pour headers sécurisés

---

## 🎨 Architecture Frontend (SPA)

### Approche SPA Modulaire

```
┌─────────────────────────────────────────┐
│             Pages Layer                 │
│    (auth.html, home.html, index.html)   │
├─────────────────────────────────────────┤
│           Controllers Layer             │
│     (Orchestration des modules)         │
├─────────────────────────────────────────┤
│           Components Layer              │
│        (Composants réutilisables)       │
├─────────────────────────────────────────┤
│             API Layer                   │
│      (Clients HTTP vers backend)        │
├─────────────────────────────────────────┤
│            Services Layer               │
│     (Logique métier frontend)           │
└─────────────────────────────────────────┘
```

### Stack Technique Frontend

**Architecture :**
- **SPA Vanilla JavaScript** - Pas de framework
- **ES6 Modules** - Import/export natif
- **Dynamic Imports** - Chargement à la demande

**Style et UI :**
- **Tailwind CSS** - Framework CSS utilitaire
- **Variables CSS personnalisées** - Design system
- **Responsive Mobile-First** - Breakpoints adaptatifs

**Navigation :**
- **Hash-based routing** - Navigation sans rechargement
- **History API** - Gestion historique navigateur
- **Progressive enhancement** - Amélioration progressive

### Architecture SPA Détaillée

#### Orchestrateur Principal (home.js)

```javascript
class DiaganaApp {
    constructor() {
        this.modules = {
            dashboard: () => import('./dashboard.js'),
            resources: () => import('./resources.js'),
            collections: () => import('./collections.js'),
            profile: () => import('./profile.js')
        };
        this.currentModule = null;
        this.container = document.getElementById('app-content');
    }
    
    async loadModule(moduleName) {
        // Chargement dynamique des modules
        // Navigation SPA sans rechargement
    }
}
```

#### Gestionnaire Navigation (navigations.js)

```javascript
class NavigationManager {
    constructor(app) {
        this.app = app;
        this.desktopNav = new DesktopNavigation();
        this.mobileNav = new MobileNavigation();
    }
    
    init() {
        // Gestion événements navigation
        // Responsive desktop/mobile
        // Intégration SPA
    }
}
```

### Navigation Responsive

**Desktop Navigation :**
- Navigation horizontale avec brand
- Liens directs vers modules
- Profil utilisateur intégré

**Mobile Navigation :**
- Hamburger menu avec sidebar overlay
- Bottom navigation avec icônes
- Navigation tactile optimisée

**Breakpoints :**
```css
/* Mobile first */
@media (max-width: 768px) {
    .navbar { display: none; }
    .bottom-nav { display: flex; }
}

@media (min-width: 768px) {
    .navbar { display: flex; }
    .bottom-nav { display: none; }
}
```

### Modules Frontend

| Module | Statut | Description |
|--------|--------|------------|
| **Authentication** | ✅ Complet | Page dédiée + validation complète |
| **Dashboard** | ✅ Opérationnel | Interface + statistiques + navigation |
| **Resources** | ✅ Architecture complète | Composants modulaires + API + demo |
| **Collections** | 🔨 Placeholder | Message "en développement" |
| **Profils** | 🔨 Placeholder | Message "en développement" |

### Clients API Frontend

**Structure complète :**
```
frontend/api/
├── index.js          # Client API central + JWT automatique
├── auth.js          # 11 méthodes authentification
├── resources.js     # 12 méthodes + validation
├── collections.js   # 11 méthodes + réorganisation
├── profile.js       # 10 méthodes + utilitaires
├── comments.js      # 4 méthodes + arbre hiérarchique
├── clients.js       # Export centralisé
└── tests/           # Tests unitaires + cohérence
```

**Fonctionnalités clés :**
- Gestion JWT automatique
- Validation côté client cohérente avec backend
- Upload de fichiers avec validation
- Gestion d'erreurs centralisée

---

## 🔗 Intégrations et Services

### Services Externes

**Supabase (Base de Données) :**
- PostgreSQL hébergé avec dashboard web
- Authentication provider intégré
- Row Level Security (RLS)
- Real-time subscriptions (prévu)

**Wasabi (Stockage S3) :**
- Stockage compatible AWS S3
- URLs signées pour accès sécurisé
- Upload direct depuis client
- ACL public-read pour ressources

### Communication Frontend-Backend

**API REST :**
- 59 endpoints documentés
- Format JSON standardisé
- Gestion d'erreurs cohérente
- Rate limiting et authentification

**Upload de Fichiers :**
- Multipart/form-data vers backend
- Upload direct vers Wasabi S3
- Validation type MIME et taille
- Génération thumbnails (prévu)

### Flux de Données Typique

```
1. Frontend → API Request (JWT) → Backend
2. Backend → Validation → Service Layer
3. Service → Model → Supabase Query
4. Supabase → Response → Backend
5. Backend → JSON Response → Frontend
6. Frontend → Update UI
```

---

## 🎯 Design System et Interface

### Référence CAT (École Cheikh Ahmed Tijane)

Le frontend réplique exactement l'interface de référence située dans `test-CAT/` :

**Pages de référence :**
- `test-CAT/index.html` - Landing page
- `test-CAT/dashboard.html` - Dashboard complet
- `test-CAT/resources.html` - Page ressources
- `test-CAT/collections.html` - Page collections
- `test-CAT/profiles.html` - Page profils

### Adaptation SPA

**Différence architecture :**
```
❌ Interface Test CAT (Pages HTML multiples)
test-CAT/dashboard.html, resources.html, etc.

✅ Architecture Diagana (SPA Modulaire)
frontend/pages/home.html (coquille unique)
+ modules JavaScript chargés dynamiquement
```

### Variables CSS Standardisées

```css
:root {
    /* Palette beige/orange Diagana */
    --color-beige-50: #fefdfb;
    --color-beige-100: #f7f5f0;
    --color-accent-primary: #d97706;
    --color-accent-secondary: #059669;
    
    /* Typographie */
    font-family: 'Inter', 'SF Pro Display', system-ui, sans-serif;
}
```

### Composants Réutilisables

**Cartes :**
- `.card` - Carte de base
- `.resource-card` - Carte ressource spécialisée
- `.collection-card` - Carte collection

**Navigation :**
- `.navbar` - Navigation desktop
- `.bottom-nav` - Navigation mobile
- `.nav-link` - Liens navigation

**Formulaires :**
- `.form-input` - Champs de saisie
- `.btn-primary` - Bouton principal
- `.btn-secondary` - Bouton secondaire

---

## ⚡ Performance et Optimisation

### Backend

**Base de Données :**
- Index optimisés sur colonnes fréquentes
- Pagination LIMIT/OFFSET
- Vues matérialisées pour requêtes complexes
- Triggers automatiques pour compteurs

**Serveur :**
- Compression gzip
- Logs avec rotation quotidienne
- Rate limiting par utilisateur
- Cache des métadonnées

### Frontend

**Chargement :**
- Lazy loading des modules SPA
- Dynamic imports ES6
- Compression des assets
- Minification CSS/JS (prévu)

**UX :**
- Loading states et skeletons
- Transitions fluides
- Responsive mobile-first
- Progressive enhancement

---

## 🧪 Architecture de Tests

### Backend (83/84 tests)

**Structure de tests :**
```
test/
├── api/                    # Tests endpoints (83 tests)
│   ├── auth/              # 16 tests authentification
│   ├── ressources/        # 23 tests ressources
│   ├── collections/       # 21 tests collections
│   └── profil/            # 23 tests profils
└── config/                # Tests infrastructure (64/65)
    ├── supabase.test.js   # Tests base de données
    ├── wasabi.test.js     # Tests stockage
    ├── jwt.test.js        # Tests authentification
    └── multer.test.js     # Tests upload
```

**Couverture :**
- Tests unitaires (fonctions)
- Tests d'intégration (workflows)
- Tests de sécurité (authentification, permissions)
- Tests de performance (pagination, recherche)

### Frontend

**Tests clients API :**
- Tests unitaires pour chaque client
- Tests de cohérence backend-frontend
- Page interactive de tests
- Validation des données côté client

---

## 🚀 Évolutions Architecturales

### Court Terme
- Finalisation modules Collections et Profils
- Tests frontend automatisés
- Optimisations mobile identifiées
- Métriques applicatives

### Moyen Terme
- Notifications temps réel (WebSocket)
- PWA avec mode hors-ligne
- Cache Redis pour performances
- Microservices si nécessaire

### Long Terme
- Multi-établissements
- Intégrations LMS externes
- IA pour recommandations
- Internationalisation

---

**Cette architecture modulaire et évolutive permet un développement maîtrisé et une maintenance facilitée, tout en offrant des performances optimales et une expérience utilisateur moderne.**

---

**🏗️ Architecture Diagana School**  
*Version 1.0 - Août 2025*
