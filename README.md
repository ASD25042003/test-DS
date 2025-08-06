# 📚 Diagana School - Plateforme Éducative

Une plateforme éducative moderne et intuitive conçue avec un design **mobile-first** inspiré d'Anthropic.

> **Démo Live :** [https://asd25042003.github.io/test-ds/](https://asd25042003.github.io/test-ds/)

## 🌟 Fonctionnalités

### ✨ Interface Utilisateur
- **Design mobile-first** optimisé pour tous les appareils
- **Palette de couleurs** beige/crème avec accents orange, vert, bleu, violet
- **Animations fluides** et interactions visuelles
- **Interface responsive** avec Tailwind CSS

### 🔧 Pages Disponibles

#### 🏠 Landing Page (`index.html`)
- Page d'accueil attrayante avec sections Hero, Fonctionnalités, À propos
- Navigation smooth scroll
- Design entièrement responsive

#### 🔐 Authentification (`test/auth.html`)
- Formulaires de connexion et inscription
- **Connexion automatique** : accepte n'importe quelles informations
- Redirection vers le dashboard après connexion
- Animations et transitions fluides

#### 📊 Dashboard (`test/dashboard.html`)
- Tableau de bord principal avec statistiques
- Cartes d'activités récentes
- Actions rapides et collections populaires
- Responsive design avec navigation mobile

#### 📁 Ressources (`test/resources.html`)
- Gestion et recherche de ressources éducatives
- Filtres par type et matière
- Système de tri avancé
- Upload de documents, images, vidéos, liens

#### 📚 Collections (`test/collections.html`)
- Organisation en collections thématiques
- Système de progression visuel avec anneaux
- Badges de visibilité (public/privé)
- Onglets de navigation (Toutes, Mes collections, Favoris, etc.)

#### 👥 Profils (`test/profiles.html`)
- Annuaire des membres (professeurs, étudiants, administrateurs)
- Recherche et filtrage par rôle
- Indicateurs de statut (en ligne/hors ligne)
- Interface de messagerie

## 🚀 Test en Direct

### 🌐 GitHub Pages
Le projet est déployé sur GitHub Pages :
**[https://asd25042003.github.io/test-ds/](https://asd25042003.github.io/test-ds/)**

### 📱 Test Mobile
Pour tester l'interface mobile :
1. Ouvrir le lien ci-dessus
2. Utiliser les outils de développement du navigateur (F12)
3. Activer la vue mobile ou utiliser un appareil mobile

### 🔑 Connexion
- **Connexion** : Accepte n'importe quelle adresse email et mot de passe
- **Navigation** : Tous les liens entre les pages fonctionnent
- **Mobile** : Interface entièrement optimisée

### 📋 Instructions de Test

#### 1. Accès Direct
Aller sur : **https://asd25042003.github.io/test-ds/**

#### 2. Navigation
- **Landing** : Cliquer sur "Commencer maintenant"
- **Connexion** : Entrer n'importe quelles informations
- **Dashboard** : Explorer les différentes sections
- **Navigation** : Utiliser les liens de navigation

#### 3. Test Mobile
- Réduire la taille de la fenêtre ou utiliser un mobile
- Tester le menu hamburger
- Vérifier la responsivité de toutes les pages

### 🔍 Fonctionnalités Interactives

- ✅ **Connexion automatique** (test/auth.html)
- ✅ **Navigation fluide** entre toutes les pages
- ✅ **Recherche et filtres** fonctionnels
- ✅ **Animations au scroll** et interactions
- ✅ **Menu mobile** avec hamburger
- ✅ **Boutons flottants** (FAB)
- ✅ **États visuels** (hover, focus, active)

## 🌎 Technologies Frontend Test

- **HTML5** - Structure moderne
- **Tailwind CSS** - Framework CSS utility-first
- **JavaScript Vanilla** - Interactions et animations
- **Inter Font** - Typographie moderne
- **Mobile-First Design** - Optimisation prioritaire mobile

## 📁 Structure des Pages Test

```
diagana-school/
├── index.html                 # Landing page principale
├── test/                      # Pages de démonstration
│   ├── auth.html             # Authentification
│   ├── dashboard.html        # Tableau de bord
│   ├── resources.html        # Gestion des ressources
│   ├── collections.html      # Collections thématiques
│   └── profiles.html         # Profils utilisateurs
├── frontend/                 # Code frontend (structure avancée)
├── backend/                  # Code backend (Node.js/Express)
└── docs/                     # Documentation
```

### 🎨 Design System

#### Couleurs
- **Base** : Beige (#fefdfb, #f7f5f0, #f0ebe0)
- **Accent Principal** : Orange (#d97706)
- **Accent Secondaire** : Vert (#059669)
- **Accent Info** : Bleu (#0ea5e9)
- **Accent Tertiaire** : Violet (#7c3aed)

#### Breakpoints
- **Mobile** : < 768px
- **Tablet** : 768px - 1024px
- **Desktop** : > 1024px

## 🏗️ Architecture

### Backend (Node.js/Express) - ✅ COMPLET

- **Base de données :** Supabase (PostgreSQL)
- **Stockage fichiers :** Wasabi (S3-compatible)
- **Authentification :** JWT + clés d'inscription
- **Tests :** Jest (83/83 tests passent)
- **Documentation :** Complète dans `/docs`

### Structure du projet

```
diagana-school/
├── backend/          # 🚀 API Node.js complète
├── docs/            # 📖 Documentation technique
├── temp/            # 📝 Notes temporaires
└── README.md        # 📋 Ce fichier
```

## 🚀 Installation rapide

### Prérequis

- **Node.js** 16+ 
- **Git**
- Compte **Supabase**
- Compte **Wasabi** (stockage)

### 1. Cloner le projet

```bash
git clone https://github.com/ASD25042003/diagana-school.git
cd diagana-school/backend
```

### 2. Configuration

```bash
# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos clés Supabase et Wasabi
```

### 3. Base de données

```bash
# Exécuter manuellement les migrations SQL dans Supabase:
# 1. backend/migrations/mig-1.sql (tables principales)
# 2. backend/migrations/mig-2.sql (triggers et fonctions)
# 3. backend/migrations/mig-3.sql (données initiales)
# 4. backend/migrations/mig-4.sql (optimisations)
```

### 4. Démarrage

```bash
# Développement
npm run dev

# Production
npm start

# Tests
npm test
```

## 📊 État du développement

### ✅ Backend API - 100% FONCTIONNEL

| Module | Endpoints | Tests | Statut |
|--------|-----------|-------|--------|
| **Authentification** | 7 | 16/16 ✅ | Complet |
| **Ressources** | 21 | 23/23 ✅ | Complet |
| **Collections** | 15 | 21/21 ✅ | Complet |
| **Profils** | 12 | 23/23 ✅ | Complet |
| **Commentaires** | 4 | 4/4 ✅ | Complet |
| **TOTAL** | **59** | **87/87** | **🎉 100%** |

### 🔄 Frontend - À venir

- Interface web moderne (HTML5/CSS3/JS/talwind(cdn))
- Dashboard intuitif
- Interface mobile first responsive
- Intégration API backend

## 🛠️ Technologies

**Backend :**
- Node.js + Express
- Supabase (PostgreSQL)
- Wasabi S3 Storage
- JWT Authentication
- Winston Logging
- Jest Testing

**À venir :**
- Frontend HTML5/CSS3/JS
- Tailwind CSS
- Architecture SPA

## 📖 Documentation

- 📋 [**Vue d'ensemble**](docs/README.md) - Documentation complète
- 🔐 [**Authentification**](docs/auth.md) - Module auth détaillé  
- 📁 [**Ressources**](docs/ressources.md) - Gestion des fichiers
- 📚 [**Collections**](docs/collections.md) - Organisation de contenu
- 👤 [**Profils**](docs/profil.md) - Utilisateurs et social
- 📈 [**Évolution**](docs/evolution.md) - Journal du développement
- 🌳 [**Arborescence**](docs/arborescence.md) - Structure du projet

## 🔒 Sécurité

- ✅ JWT avec expiration configurable
- ✅ Clés d'inscription à usage unique
- ✅ Row Level Security (RLS) Supabase
- ✅ Rate limiting par utilisateur
- ✅ Validation stricte des données
- ✅ Logs de sécurité complets

## 📈 Performances

- ✅ Index de base de données optimisés
- ✅ Pagination sur tous les endpoints
- ✅ Compression gzip
- ✅ Cache intelligent
- ✅ Upload optimisé vers Wasabi S3

## 🧪 Tests

```bash
# Lancer tous les tests
npm test

# Tests avec couverture
npm test -- --coverage

# Tests en mode watch
npm run test:watch

# Test module spécifique
npm test test/api/auth/auth.test.js
```

**Couverture actuelle :** 100% des endpoints testés

## 🚀 Déploiement

### Render (recommandé)

1. Fork le projet sur GitHub
2. Connecter à Render
3. Configurer les variables d'environnement
4. Déployer automatiquement

### Variables d'environnement requises

```env
# Base
NODE_ENV=production
PORT=3000

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# Wasabi
WASABI_ACCESS_KEY=your_access_key
WASABI_SECRET_KEY=your_secret_key
WASABI_BUCKET=your_bucket_name
WASABI_REGION=eu-west-2

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
```

## 🤝 Contribution

1. **Fork** le projet
2. **Branche** feature (`git checkout -b feature/nom-feature`)
3. **Commit** (`git commit -m 'Ajout feature'`)
4. **Push** (`git push origin feature/nom-feature`)
5. **Pull Request**

## 📊 Statistiques du projet

- **8,100+ lignes** de code backend
- **61 fichiers** créés
- **83 tests** automatisés
- **87 endpoints** API
- **15 tables** de base de données
- **4 modules** fonctionnels complets

## 📝 Licence

MIT - Voir [LICENSE](LICENSE) pour plus de détails.

## 🎉 Équipe

**Développé par :** ASD25042003  
**Période :** Janvier 2024 - Août 2025  
**Statut :** Backend 100% fonctionnel ✅  

---

> 💡 **Prêt pour production !** Le backend est entièrement fonctionnel et testé. 
> 🚀 **Prochaine étape :** Développement du frontend web.

[![Backend Tests](https://img.shields.io/badge/Backend%20Tests-87%2F87%20✅-brightgreen)]()
[![API Endpoints](https://img.shields.io/badge/API%20Endpoints-59-blue)]()
[![Documentation](https://img.shields.io/badge/Documentation-✅%20Complete-green)]()
