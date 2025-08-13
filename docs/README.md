# 📚 Diagana School - Index Documentation

Ce dossier contient la documentation technique complète du projet Diagana School.

## 📋 Organisation des Documents

Chaque fichier de documentation couvre un aspect spécifique :
- **Vue d'ensemble** : Voir [README.md principal](../README.md)
- **Modules spécialisés** : Fichiers détaillés par fonctionnalité
- **Guides opérationnels** : Installation et déploiement

## 🗂️ Structure des Documents

```
docs/
├── etat-projet.md                    # 📊 État actuel et plan d'action
├── interface-cat-specifications.md   # 🎨 Guide réplication interface CAT
├── auth.md                          # 🔐 Authentification et sécurité
├── ressources.md                    # 📚 Gestion des ressources
├── collections.md                   # 📁 Organisation en collections
├── profil.md                       # 👤 Profils et interactions sociales
├── frontend.md                     # 💻 Architecture frontend
├── ui-ux-guide.md                  # 🎨 Guide de design
├── MIGRATIONS.md                   # 🛠️ Installation base de données
├── arborescence.md                 # 🌳 Structure des fichiers
└── rapport-analyse-backend.md       # 📅 Audit technique
```

## 🎯 État Actuel du Projet

⚠️ **Pour une vue détaillée de l'état actuel et le plan d'action, consultez [etat-projet.md](etat-projet.md)**

### Backend - À Vérifier 🟡
- **4 modules API** structurellement complets
- **Suite de 83 tests** à relancer et valider
- **Architecture sécurisée** avec JWT + RLS
- **Intégrations** Supabase + Wasabi à vérifier

### Frontend - Minimaliste ⚠️
- **Module authentification** seul fonctionnel
- **Autres modules supprimés** et à reconstruire
- **Architecture SPA** de base en place

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

## 🌐 Frontend Intégré

### ✅ Application SPA Complète

**Application principale :** `http://localhost:3000/home`

### ✅ Module Authentification Complet

**Page d'authentification :** `http://localhost:3000/auth`

**Fonctionnalités :**
- ✅ **Formulaires** Login/Register avec validation temps réel  
- ✅ **Validation** mot de passe renforcée (8+ chars, min/maj/chiffre)
- ✅ **Gestion d'état** avec localStorage et JWT
- ✅ **Messages d'erreur** contextuels et friendly
- ✅ **Animations** fluides et responsive mobile-first

### ✅ Clients API Frontend Complets

**Documentation complète :** `frontend/api/README.md`

**Structure implémentée :**
```
frontend/api/
├── index.js          # Client API central + JWT
├── auth.js          # Authentification (11 méthodes)
├── resources.js     # Ressources (12 méthodes) ✅
├── collections.js   # Collections (11 méthodes) ✅
├── profile.js       # Profils (10 méthodes) ✅
├── comments.js      # Commentaires (4 méthodes + utils) ✅
├── clients.js       # Export centralisé ✅
└── tests/           # Tests de cohérence ✅
```

**Fonctionnalités :**
- ✅ **CRUD complet** pour tous les modules backend
- ✅ **Validation côté client** cohérente avec le backend
- ✅ **Upload de fichiers** avec validation de type/taille
- ✅ **Gestion d'erreurs** centralisée avec ApiError
- ✅ **Tests unitaires** et de cohérence backend-frontend
- ✅ **Page de tests interactive** : `http://localhost:3000/static/api/test-runner.html`

## 🔨 Modules Frontend à Développer

**Architecture SPA prête :** `http://localhost:3000/home`

### Modules Prioritaires
1. **Dashboard** - Interface d'accueil avec statistiques
2. **Ressources** - Gestion complète (liste, upload, interactions)
3. **Collections** - Organisation de ressources
4. **Profils** - Interactions sociales

### Routes Disponibles
- `GET /auth` → Authentification ✅
- `GET /home` → Application SPA ✅
- `GET /home#dashboard` → À développer 🔨
- `GET /home#resources` → À développer 🔨
- `GET /home#collections` → À développer 🔨
- `GET /home#profile` → À développer 🔨

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
cd backend
npm run dev

# Démarrer en production
npm start
```

**Frontend intégré :** Aucune installation séparée nécessaire, servi automatiquement par Express.

> ⚠️ **IMPORTANT - Serveur de développement :**  
> Pour éviter les conflits de port, l'agent de développement ne doit **jamais lancer automatiquement le serveur**.  
> Toujours demander à l'utilisateur de le démarrer manuellement : `cd backend && npm run dev`

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

### ✅ Suite de Tests Backend - Validés (9 Août 2025)

| Module | Tests | État | Résultats |
|--------|-------|------|----------|
| **Auth** | **16 tests** | ✅ **VALIDÉ** | 16/16 réussis |
| **Ressources** | **23 tests** | ✅ **VALIDÉ** | 23/23 réussis |
| **Collections** | **21 tests** | ✅ **VALIDÉ** | 21/21 réussis |
| **Profils** | **23 tests** | ✅ **VALIDÉ** | 23/23 réussis |
| **TOTAL API** | **83 tests** | ✅ **CONFIRMÉ** | **83/84 tests réussis (99%)** |

### ✅ Tests Frontend - Clients API Implémentés

| Module | Client API | Tests | État |
|--------|------------|-------|------|
| **Resources** | ✅ 12 méthodes | ✅ Tests unitaires | ✅ Validé |
| **Collections** | ✅ 11 méthodes | ✅ Tests unitaires | ✅ Validé |
| **Profile** | ✅ 10 méthodes | ✅ Tests unitaires | ✅ Validé |
| **Comments** | ✅ 4 méthodes + utils | ✅ Tests unitaires | ✅ Validé |
| **Auth** | ✅ 11 méthodes | ✅ Existant | ✅ Validé |

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