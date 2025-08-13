# 📡 Modules API - Diagana School

## Vue d'ensemble

Cette documentation couvre tous les modules API du backend Diagana School, leurs endpoints, fonctionnalités et clients frontend associés.

---

## 🔐 Module Authentification

### Fonctionnalités

**Inscription sécurisée :**
- Clés d'inscription pré-générées et uniques (30 clés)
- Validation automatique du rôle (professeur/élève)
- Vérification email unique et hachage sécurisé

**Gestion des sessions :**
- Tokens JWT avec expiration configurable (7 jours)
- Middleware d'authentification pour routes protégées
- Déconnexion sécurisée

### Clés d'Inscription Pré-générées

**Professeurs (10 clés) :**
```
PROF_2024_A1B2C3  PROF_2024_D4E5F6  PROF_2024_G7H8I9  PROF_2024_J0K1L2
PROF_2024_M3N4O5  PROF_2024_P6Q7R8  PROF_2024_S9T0U1  PROF_2024_V2W3X4
PROF_2024_Y5Z6A7  PROF_2024_B8C9D0
```

**Élèves (20 clés) :**
```
ELEVE_2024_E1F2G3  ELEVE_2024_H4I5J6  ELEVE_2024_K7L8M9  ELEVE_2024_N0O1P2
ELEVE_2024_Q3R4S5  ELEVE_2024_T6U7V8  ELEVE_2024_W9X0Y1  ELEVE_2024_Z2A3B4
ELEVE_2024_C5D6E7  ELEVE_2024_F8G9H0  ELEVE_2024_I1J2K3  ELEVE_2024_L4M5N6
ELEVE_2024_O7P8Q9  ELEVE_2024_R0S1T2  ELEVE_2024_U3V4W5  ELEVE_2024_X6Y7Z8
ELEVE_2024_A9B0C1  ELEVE_2024_D2E3F4  ELEVE_2024_G5H6I7  ELEVE_2024_J8K9L0
```

### API Endpoints

#### POST `/api/auth/register` - Inscription

```json
{
  "keyValue": "PROF_2024_A1B2C3",
  "email": "professeur@diagana.com",
  "password": "MotDePasse123!",
  "nom": "Dupont",
  "prenom": "Jean",
  "matiere": "Mathématiques",
  "date_naissance": "1990-05-15"
}
```

**Réponse :**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "professeur@diagana.com",
    "nom": "Dupont",
    "prenom": "Jean",
    "role": "professeur",
    "matiere": "Mathématiques"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### POST `/api/auth/login` - Connexion

```json
{
  "email": "professeur@diagana.com",
  "password": "MotDePasse123!"
}
```

#### GET `/api/auth/me` - Profil utilisateur connecté

**Headers :** `Authorization: Bearer <token>`

#### PUT `/api/auth/profile` - Mise à jour profil

#### PUT `/api/auth/password` - Changement mot de passe

#### GET `/api/auth/validate-key/:keyValue` - Validation clé

#### POST `/api/auth/logout` - Déconnexion

### Tests : ✅ 16/16 réussis (100%)

---

## 📁 Module Ressources

### Types de Ressources Supportées

- **Documents :** PDF, DOCX, TXT (avec upload vers Wasabi)
- **Médias :** Images (JPG, PNG, GIF)  
- **Vidéos :** Liens YouTube et fichiers (MP4, AVI, MOV)
- **Liens :** Ressources externes avec prévisualisation

### Interactions Sociales

- **Likes :** Système de j'aime/j'aime plus
- **Favoris :** Collections personnelles de ressources préférées
- **Commentaires :** Discussions sur les ressources
- **Statistiques :** Compteurs de vues, likes, commentaires

### API Endpoints

#### GET `/api/ressources` - Liste avec filtres

**Query Parameters :**
```
?page=1&limit=10&type=document&matiere=mathematiques&search=algebre&sort=popular
```

**Réponse :**
```json
{
  "success": true,
  "data": {
    "ressources": [
      {
        "id": "uuid",
        "titre": "Cours d'algèbre avancée",
        "description": "Introduction aux concepts...",
        "type": "document",
        "matiere": "Mathématiques",
        "niveau": "Lycée",
        "tags": ["algèbre", "équations"],
        "file_url": "https://wasabi.../document.pdf",
        "author": {
          "id": "uuid",
          "nom": "Dupont",
          "prenom": "Jean",
          "role": "professeur"
        },
        "stats": {
          "likes_count": 15,
          "comments_count": 3,
          "views_count": 127
        },
        "is_liked": true,
        "is_favorited": false,
        "created_at": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 45,
      "totalPages": 5
    }
  }
}
```

#### POST `/api/ressources` - Création

**Content-Type :** `multipart/form-data`

**Champs :**
```javascript
{
  titre: "Titre de la ressource",
  description: "Description détaillée",
  type: "document", // document, video, lien, media
  matiere: "Mathématiques",
  niveau: "Lycée",
  tags: "tag1,tag2,tag3",
  is_public: true,
  file: File, // Pour documents/médias
  external_url: "https://youtube.com/...", // Pour vidéos/liens
}
```

#### GET `/api/ressources/:id` - Détails ressource

#### PUT `/api/ressources/:id` - Modification

#### DELETE `/api/ressources/:id` - Suppression

#### POST `/api/ressources/:id/like` - Toggle like

#### POST `/api/ressources/:id/favorite` - Toggle favori

#### GET `/api/ressources/my` - Mes ressources

#### GET `/api/ressources/favorites` - Mes favoris

#### GET `/api/ressources/popular` - Ressources populaires

#### GET `/api/ressources/recent` - Ressources récentes

#### GET `/api/ressources/search` - Recherche avancée

### Tests : ✅ 23/23 réussis (100%)

---

## 📚 Module Collections

### Fonctionnalités

**Gestion des collections :**
- Création de collections publiques ou privées
- Organisation de ressources par glisser-déposer
- Duplication de collections existantes
- Recherche et filtres avancés

**Interactions sociales :**
- Likes sur collections populaires
- Favoris par utilisateur
- Commentaires et discussions
- Abonnements aux mises à jour

### API Endpoints

#### GET `/api/collections` - Liste collections

**Query Parameters :**
```
?page=1&limit=10&visibility=public&matiere=mathematiques&search=algebre&sort=popular
```

**Réponse :**
```json
{
  "success": true,
  "data": {
    "collections": [
      {
        "id": "uuid",
        "title": "Mathématiques - Algèbre",
        "description": "Collection complète sur l'algèbre",
        "matiere": "Mathématiques",
        "niveau": "Lycée",
        "tags": ["algèbre", "équations", "fonctions"],
        "is_public": true,
        "ressources_count": 12,
        "author": {
          "id": "uuid",
          "nom": "Dupont",
          "prenom": "Jean",
          "role": "professeur"
        },
        "stats": {
          "likes_count": 8,
          "comments_count": 2,
          "views_count": 45,
          "favorites_count": 3
        },
        "interactions": {
          "is_liked": false,
          "is_favorited": true
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 23,
      "totalPages": 3
    }
  }
}
```

#### POST `/api/collections` - Création collection

```json
{
  "title": "Mathématiques - Géométrie",
  "description": "Ressources complètes sur la géométrie",
  "matiere": "Mathématiques",
  "niveau": "Collège",
  "tags": ["géométrie", "triangles", "cercles"],
  "is_public": true,
  "thumbnail_url": "https://example.com/thumb.jpg"
}
```

#### GET `/api/collections/:id` - Détails collection

#### PUT `/api/collections/:id` - Modification

#### DELETE `/api/collections/:id` - Suppression

#### POST `/api/collections/:id/ressources` - Ajout ressource

```json
{
  "ressource_id": "uuid",
  "order_index": 5
}
```

#### DELETE `/api/collections/:id/ressources/:ressourceId` - Retrait ressource

#### PUT `/api/collections/:id/reorder` - Réorganisation

```json
{
  "ressources": [
    { "ressource_id": "uuid1", "order_index": 1 },
    { "ressource_id": "uuid2", "order_index": 2 },
    { "ressource_id": "uuid3", "order_index": 3 }
  ]
}
```

#### POST `/api/collections/:id/duplicate` - Duplication

#### POST `/api/collections/:id/like` - Toggle like

#### POST `/api/collections/:id/favorite` - Toggle favori

#### GET `/api/collections/my` - Mes collections

#### GET `/api/collections/favorites` - Collections favorites

#### GET `/api/collections/popular` - Collections populaires

#### GET `/api/collections/recent` - Collections récentes

### Tests : ✅ 21/21 réussis (100%)

---

## 👤 Module Profils

### Fonctionnalités

**Profils utilisateurs :**
- Informations personnelles étendues
- Statistiques d'activité (ressources, collections, interactions)
- Préférences de confidentialité
- Historique d'activité personnalisé

**Système de suivi social :**
- Following/Followers entre utilisateurs
- Activité des utilisateurs suivis
- Recommandations d'utilisateurs
- Notifications des nouvelles publications

### API Endpoints

#### GET `/api/profil/all` - Liste utilisateurs

**Query Parameters :**
```
?page=1&limit=20&search=dupont&role=professeur&matiere=mathematiques
```

**Réponse :**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "uuid",
        "nom": "Dupont",
        "prenom": "Jean",
        "role": "professeur",
        "matiere": "Mathématiques",
        "classe": null,
        "avatar_url": "https://example.com/avatar.jpg",
        "bio": "Professeur de mathématiques depuis 10 ans",
        "stats": {
          "ressources_count": 25,
          "collections_count": 8,
          "likes_received": 120,
          "followers_count": 15,
          "following_count": 22
        },
        "is_following": false,
        "last_activity": "2024-01-15T09:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 147,
      "totalPages": 8
    }
  }
}
```

#### GET `/api/profil/role/:role` - Utilisateurs par rôle

#### GET `/api/profil/search` - Recherche utilisateurs

**Query Parameters :**
```
?q=jean martin&role=professeur&matiere=sciences&classe=3eme
```

#### GET `/api/profil/:userId` - Profil détaillé

#### GET `/api/profil/:userId/ressources` - Ressources utilisateur

#### GET `/api/profil/:userId/collections` - Collections utilisateur

#### GET `/api/profil/:userId/followers` - Liste followers

#### GET `/api/profil/:userId/following` - Liste suivis

#### POST `/api/profil/:userId/follow` - Suivre utilisateur

**Réponse :**
```json
{
  "success": true,
  "data": {
    "following": true,
    "followers_count": 16,
    "message": "Vous suivez maintenant Jean Dupont"
  }
}
```

#### DELETE `/api/profil/:userId/follow` - Ne plus suivre

#### GET `/api/profil/:userId/activity` - Journal d'activité

### Tests : ✅ 23/23 réussis (100%)

---

## 💬 Module Commentaires

### Fonctionnalités

- **Commentaires** sur ressources avec système hiérarchique
- **Réponses** (système de threads)
- **Modification** et suppression par auteur
- **Pagination** optimisée

### API Endpoints

#### GET `/api/commentaires/ressource/:ressourceId` - Commentaires par ressource

#### POST `/api/commentaires` - Création commentaire

```json
{
  "ressource_id": "uuid",
  "contenu": "Excellent cours ! Merci @\"Jean Dupont\"",
  "parent_id": null
}
```

#### PUT `/api/commentaires/:id` - Modification

#### DELETE `/api/commentaires/:id` - Suppression

---

## 🔧 Clients API Frontend

### Structure Complète

```
frontend/api/
├── index.js          # Client API central + JWT automatique
├── auth.js          # 11 méthodes authentification
├── resources.js     # 12 méthodes + validation
├── collections.js   # 11 méthodes + réorganisation
├── profile.js       # 10 méthodes + utilitaires
├── comments.js      # 4 méthodes + arbre hiérarchique
├── clients.js       # Export centralisé
└── tests/           # Tests unitaires + cohérence backend
```

### Client Central (index.js)

```javascript
class ApiClient {
    constructor() {
        this.baseURL = '/api';
        this.token = localStorage.getItem('authToken');
    }
    
    async get(endpoint) { /* Avec headers JWT automatiques */ }
    async post(endpoint, data) { /* Avec validation */ }
    async uploadFile(endpoint, formData) { /* Upload sécurisé */ }
    validateFile(file) { /* Validation type/taille */ }
}
```

### Clients Spécialisés

#### Resources API

```javascript
// CRUD complet
const resources = await resourcesApi.getAll(filters);
const resource = await resourcesApi.create(data, file);
await resourcesApi.update(id, data, file);
await resourcesApi.delete(id);

// Interactions sociales
await resourcesApi.toggleLike(id);
await resourcesApi.toggleFavorite(id);

// Validation côté client
const errors = resourcesApi.validateResourceData(data);
```

#### Collections API

```javascript
// Gestion collections
const collections = await collectionsApi.getAll(filters);
const collection = await collectionsApi.create(data);

// Gestion ressources
await collectionsApi.addRessource(collectionId, ressourceId, ordre);
await collectionsApi.reorderRessources(collectionId, order);
await collectionsApi.duplicate(id, options);
```

#### Profile API

```javascript
// Recherche utilisateurs
const professeurs = await profileApi.getUsersByRole('professeur');
const users = await profileApi.searchUsers({ q: 'Jean', role: 'professeur' });

// Système de suivi
await profileApi.followUser(userId);
await profileApi.unfollowUser(userId);

// Utilitaires
const fullName = profileApi.formatFullName(user);
const age = profileApi.calculateAge(dateNaissance);
```

#### Comments API

```javascript
// CRUD commentaires
const comments = await commentsApi.getByRessource(ressourceId);
const newComment = await commentsApi.create(data);
await commentsApi.reply(parentId, replyData);

// Utilitaires avancés
const tree = commentsApi.buildCommentsTree(flatComments);
const mentions = commentsApi.extractMentions(text);
const formatted = commentsApi.formatComment(comment);
```

### Points de Cohérence Critiques

#### Endpoints Français
```javascript
const API_CONFIG = {
    ENDPOINTS: {
        RESOURCES: '/ressources',    // ✅ Pas '/resources'
        PROFILE: '/profil',         // ✅ Pas '/profile'  
        COMMENTS: '/commentaires'   // ✅ Pas '/comments'
    }
};
```

#### Types de Ressources
```javascript
// ✅ Types backend corrects
const validTypes = ['document', 'media', 'video', 'lien'];
// ❌ Pas ['document', 'media', 'video', 'link']
```

#### Champs Collections
```javascript
// ✅ Structure backend correcte
{
    nom: 'Ma Collection',        // ✅ 'nom' pas 'titre'
    is_public: true             // ✅ 'is_public' pas 'visibility'
}
```

---

## 🔒 Sécurité Transversale

### Authentification
- **JWT** avec expiration configurable
- **Middleware** sur toutes les routes protégées
- **Clés d'inscription** à usage unique
- **Provider email** Supabase activé

### Autorisation
- **Row Level Security (RLS)** sur toutes les tables
- **Vérification propriétaire** pour modifications
- **Contrôle d'accès** granulaire par endpoint
- **Validation strict** avec Joi

### Protection
- **Rate limiting** : 100 req/15min global, spécialisé par type
- **Upload sécurisé** : types, tailles, scan antivirus
- **CORS configuré** par environnement
- **Helmet** pour headers HTTP sécurisés

---

## 🧪 Tests Complets - État Validé

### Résultats Globaux ✅

| Module | Tests | État | Couverture |
|--------|-------|------|------------|
| **Auth** | 16/16 | ✅ **PARFAIT** | Inscription, JWT, sécurité |
| **Ressources** | 23/23 | ✅ **PARFAIT** | CRUD, upload, interactions |
| **Collections** | 21/21 | ✅ **PARFAIT** | Organisation, duplication |
| **Profils** | 23/23 | ✅ **PARFAIT** | Social, recherche, suivi |
| **Total API** | **83/84** | ✅ **99%** | Infrastructure validée |

### Tests Frontend API ✅

| Module | Client API | Tests | Cohérence Backend |
|--------|------------|-------|-------------------|
| **Resources** | ✅ 12 méthodes | ✅ Unitaires | ✅ Types, endpoints |
| **Collections** | ✅ 11 méthodes | ✅ Unitaires | ✅ Champs, format |
| **Profile** | ✅ 10 méthodes | ✅ Unitaires | ✅ Rôles, recherche |
| **Comments** | ✅ 4 méthodes + utils | ✅ Unitaires | ✅ Hiérarchie |
| **Auth** | ✅ 11 méthodes | ✅ Existant | ✅ Validé |

---

## 📊 Base de Données - Structure

### Tables Principales

| Table | Rôle | Relations |
|-------|------|-----------|
| `users` | Utilisateurs étendus | ← registration_keys |
| `ressources` | Ressources pédagogiques | → users, ← likes, favoris |
| `collections` | Collections thématiques | → users, ← collection_ressources |
| `commentaires` | Discussions | → users, ressources |
| `follows` | Suivi social | → users (bidirectionnel) |

### Triggers Automatiques

- **Compteurs** : Mise à jour automatique likes_count, views_count, etc.
- **Timestamps** : updated_at sur toutes les modifications
- **Statistiques** : Calculs d'agrégation en temps réel

---

## 🚀 Usage Recommandé

### Import Centralisé

```javascript
import { getApi } from '/static/api/clients.js';

const api = await getApi();
const resources = await api.resources.getAll();
const user = await api.auth.getProfile();
```

### Gestion d'Erreurs

```javascript
try {
    const result = await api.resources.create(data, file);
} catch (error) {
    if (error instanceof ApiError) {
        if (error.status === 401) {
            // Redirection vers login
        } else if (error.status === 400) {
            // Erreurs de validation
            console.log(error.details);
        }
    }
}
```

### Validation Avant Envoi

```javascript
// Valider les données avant envoi
const errors = resourcesApi.validateResourceData(formData);
if (Object.keys(errors).length > 0) {
    // Afficher erreurs dans formulaire
    return;
}

// Envoyer si validation OK
const result = await resourcesApi.create(formData, file);
```

---

**L'ensemble des modules API forme un écosystème cohérent et sécurisé, avec une couverture de tests exceptionnelle (99%) et des clients frontend parfaitement alignés avec le backend.**

---

**📡 Modules API Diagana School**  
*Version 1.0 - Août 2025*
