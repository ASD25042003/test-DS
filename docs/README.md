# 📚 Diagana School - Documentation

## Vue d'ensemble

Diagana School est une **plateforme web centralisée** pour la gestion des ressources pédagogiques dans un établissement scolaire. Elle permet aux **professeurs** et aux **élèves** de partager, organiser et accéder facilement à une variété de ressources éducatives.

## 🎯 Objectifs

- **Centraliser** les ressources pédagogiques
- **Faciliter** le partage entre enseignants et élèves
- **Organiser** les contenus par collections thématiques
- **Favoriser** les interactions et le suivi entre utilisateurs
- **Proposer** une interface moderne et intuitive

## 🧩 Architecture

### Backend (Node.js/Express)

- **Base de données** : Supabase (PostgreSQL)
- **Stockage fichiers** : Wasabi (S3-compatible)
- **Authentification** : JWT + clés d'inscription
- **Logs** : Winston avec rotation quotidienne
- **Tests** : Jest avec Supertest

### Structure des modules

```
backend/
├── config/          # Configurations (Supabase, Wasabi, JWT, Multer)
├── models/          # Modèles de données
├── services/        # Logique métier
├── controllers/     # Contrôleurs API
├── routes/          # Définition des routes
├── middlewares/     # Middleware Express
├── migrations/      # Scripts SQL de migration
├── test/           # Tests automatisés
├── utils/          # Utilitaires (logger)
└── docs/           # Documentation
```

## 🔐 Authentification

### Système de clés d'inscription

- **30 clés pré-générées** (10 professeurs, 20 élèves)
- **Usage unique** par clé
- **Rôle automatique** selon la clé utilisée
- **Vérification** avant inscription

### Gestion des sessions

- **Tokens JWT** avec expiration (7 jours par défaut)
- **Middleware** d'authentification
- **Contrôle d'accès** par rôle (professeur/élève)
- **Rate limiting** par utilisateur

## 📁 Modules fonctionnels

### 1. Authentification (`auth`)

**Endpoints :**
- `POST /api/auth/register` - Inscription avec clé
- `POST /api/auth/login` - Connexion
- `POST /api/auth/logout` - Déconnexion
- `GET /api/auth/me` - Profil utilisateur
- `PUT /api/auth/profile` - Mise à jour profil
- `PUT /api/auth/password` - Changement mot de passe
- `GET /api/auth/validate-key/:key` - Validation clé

### 2. Ressources (`ressources`)

**Types supportés :**
- **Documents** : PDF, DOCX, TXT (avec upload)
- **Médias** : Images (JPG, PNG, GIF)
- **Vidéos** : Liens YouTube, fichiers MP4/AVI/MOV
- **Liens** : Ressources externes

**Fonctionnalités :**
- CRUD complet avec permissions
- **Likes** et **favoris**
- **Commentaires** avec réponses
- **Statistiques** de consultation
- **Recherche** full-text
- **Filtres** par type, matière, niveau
- **Tags** pour classification

**Endpoints :**
- `GET /api/ressources` - Liste des ressources
- `POST /api/ressources` - Création (avec upload)
- `GET /api/ressources/:id` - Détails ressource
- `PUT /api/ressources/:id` - Modification
- `DELETE /api/ressources/:id` - Suppression
- `POST /api/ressources/:id/like` - Toggle like
- `POST /api/ressources/:id/favorite` - Toggle favori
- `GET /api/ressources/my` - Mes ressources
- `GET /api/ressources/favorites` - Mes favoris
- `GET /api/ressources/popular` - Ressources populaires
- `GET /api/ressources/recent` - Ressources récentes
- `GET /api/ressources/search` - Recherche

### 3. Collections (`collections`)

**Fonctionnalités :**
- **Regroupement** de ressources
- **Visibilité** publique/privée
- **Réorganisation** par glisser-déposer
- **Duplication** de collections existantes
- **Recherche** et filtres

**Endpoints :**
- `GET /api/collections` - Liste des collections
- `POST /api/collections` - Création
- `GET /api/collections/:id` - Détails collection
- `PUT /api/collections/:id` - Modification
- `DELETE /api/collections/:id` - Suppression
- `POST /api/collections/:id/ressources` - Ajout ressource
- `DELETE /api/collections/:id/ressources/:ressourceId` - Suppression ressource
- `PUT /api/collections/:id/reorder` - Réorganisation
- `POST /api/collections/:id/duplicate` - Duplication
- `GET /api/collections/my` - Mes collections
- `GET /api/collections/popular` - Collections populaires
- `GET /api/collections/recent` - Collections récentes

### 4. Profils (`profil`)

**Fonctionnalités :**
- **Informations** personnelles
- **Système de suivi** (followers/following)
- **Activité** utilisateur
- **Statistiques** personnelles
- **Recherche** d'utilisateurs

**Endpoints :**
- `GET /api/profil/all` - Tous les utilisateurs
- `GET /api/profil/role/:role` - Par rôle (professeur/élève)
- `GET /api/profil/search` - Recherche utilisateurs
- `GET /api/profil/:userId` - Profil utilisateur
- `GET /api/profil/:userId/ressources` - Ressources utilisateur
- `GET /api/profil/:userId/collections` - Collections utilisateur
- `GET /api/profil/:userId/followers` - Followers
- `GET /api/profil/:userId/following` - Suivis
- `GET /api/profil/:userId/activity` - Activité
- `POST /api/profil/:userId/follow` - Suivre
- `DELETE /api/profil/:userId/follow` - Ne plus suivre

### 5. Commentaires (`commentaires`)

**Fonctionnalités :**
- **Commentaires** sur ressources
- **Réponses** (système de threads)
- **Modification** et suppression
- **Pagination**

**Endpoints :**
- `GET /api/commentaires/ressource/:ressourceId` - Par ressource
- `POST /api/commentaires` - Création
- `PUT /api/commentaires/:id` - Modification
- `DELETE /api/commentaires/:id` - Suppression

## 🛠️ Installation et configuration

### Prérequis

- Node.js 16+
- Compte Supabase
- Compte Wasabi
- Git

### Installation

```bash
# Cloner le projet
git clone <repository-url>
cd diagana-school/backend

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos clés

# Exécuter les migrations
npm run migrate

# Démarrer en développement
npm run dev

# Démarrer en production
npm start
```

### Variables d'environnement

```env
# Serveur
NODE_ENV=development
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

# Upload
MAX_FILE_SIZE=50MB
ALLOWED_FILE_TYPES=pdf,docx,txt,jpg,jpeg,png,gif,mp4,avi,mov
```

## 🧪 Tests

### ✅ État final des tests - **100% RÉUSSITE** 🎉

| Module | Tests | État | Détails |
|--------|-------|------|---------|
| **Auth** | **16/16** | ✅ **PARFAIT** | Inscription, connexion, JWT, profils |
| **Ressources** | **23/23** | ✅ **PARFAIT** | CRUD, likes, favoris, recherche |
| **Collections** | **21/21** | ✅ **PARFAIT** | Création, organisation, duplication |
| **Profils** | **23/23** | ✅ **PARFAIT** | Utilisateurs, suivi, activités |
| **TOTAL API** | **83/83** | 🏆 **100%** | **Backend 100% fonctionnel** |

### 🚀 Corrections finalisées (6 août 2025)

**Tous les modules API corrigés ✅**
- ✅ **Auth** : JWT, clés d'inscription, validation des données
- ✅ **Ressources** : Fonctionnaient déjà parfaitement
- ✅ **Collections** : Fonctionnaient déjà parfaitement  
- ✅ **Profils** : Correction vérification unfollow
- ✅ **Infrastructure** : Provider email, nettoyage automatique

### Lancer les tests

```bash
# Tests complets
npm test

# Test module spécifique
npm test test/api/auth/auth.test.js

# Tests en mode watch
npm run test:watch

# Coverage
npm test -- --coverage
```

### Structure des tests

- **Tests d'API** : Validation endpoints
- **Tests d'intégration** : Flux complets
- **Mocks** : Données de test
- **Cleanup** : Nettoyage automatique

## 📊 Base de données

### Tables principales

- **users** : Profils utilisateurs étendus
- **registration_keys** : Clés d'inscription
- **ressources** : Ressources pédagogiques
- **collections** : Collections de ressources
- **collection_ressources** : Association M-N
- **likes/favoris** : Interactions utilisateur
- **commentaires** : Système de commentaires
- **follows** : Suivi entre utilisateurs
- **resource_views** : Statistiques consultation

### Migrations

Le système de migration automatique :
1. **Détecte** les fichiers SQL dans `/migrations`
2. **Vérifie** l'état d'exécution
3. **Applique** les migrations manquantes
4. **Logs** les résultats

## 🔒 Sécurité

### Mesures implémentées

- **Rate limiting** par utilisateur
- **Validation** stricte des données (Joi)
- **Sanitisation** des entrées
- **Row Level Security** (RLS) Supabase
- **Tokens JWT** sécurisés
- **Logs** de sécurité
- **CORS** configuré
- **Helmet** pour headers sécurisés

### Permissions

- **Ressources** : Créateur = modification/suppression
- **Collections** : Propriétaire = gestion complète
- **Commentaires** : Auteur = modification/suppression
- **Profils** : Utilisateur = modification propre profil

## 📈 Monitoring

### Logs

- **Rotation quotidienne** avec Winston
- **Niveaux** : error, warn, info, debug
- **Dossiers séparés** : error/, info/, access/
- **Format JSON** pour parsing

### Endpoints utiles

- `GET /health` - État serveur
- `GET /api` - Info API

## 🚀 Déploiement

### Production

```bash
# Build
npm run build

# Variables d'environnement production
NODE_ENV=production

# Démarrage
npm start
```

### Recommandations

- **Process manager** : PM2
- **Reverse proxy** : Nginx
- **SSL/TLS** : Let's Encrypt
- **Monitoring** : Logs centralisés
- **Backup** : Base de données régulier

## 📝 Changelog

Voir [evolution.md](./evolution.md) pour l'historique détaillé des modifications.

## 🤝 Contribution

1. **Fork** le projet
2. **Branche** feature (`git checkout -b feature/nom-feature`)
3. **Commit** (`git commit -m 'Ajout feature'`)
4. **Push** (`git push origin feature/nom-feature`)
5. **Pull Request**

## 📄 Licence

MIT - Voir fichier [LICENSE](../LICENSE) pour plus de détails.

---

**Diagana School Team**  
Version 1.0.0 - 2024