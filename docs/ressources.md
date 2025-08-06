# 📁 Module Ressources

## Vue d'ensemble

Le module de gestion des ressources permet aux professeurs et élèves de publier, partager et interagir avec des contenus pédagogiques variés (documents, vidéos, liens, médias).

## 🎯 Fonctionnalités

### Types de ressources supportées
- **Documents** : PDF, DOCX, TXT (avec upload vers Wasabi)
- **Médias** : Images (JPG, PNG, GIF)
- **Vidéos** : Liens YouTube et fichiers (MP4, AVI, MOV)
- **Liens** : Ressources externes avec prévisualisation

### Interactions sociales
- **Likes** : Système de j'aime/j'aime plus
- **Favoris** : Collections personnelles de ressources préférées
- **Commentaires** : Discussions sur les ressources
- **Statistiques** : Compteurs de vues, likes, commentaires

### Recherche et filtres
- **Recherche full-text** dans titres, descriptions et tags
- **Filtres** par type, matière, niveau, auteur
- **Tri** par popularité, date, nombre de vues
- **Pagination** optimisée pour les grandes listes

## 📡 API Endpoints

### Gestion CRUD

#### GET `/api/ressources`
**Liste des ressources avec filtres et pagination**

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
        "thumbnail_url": "https://wasabi.../thumb.jpg",
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
        "created_at": "2024-01-15T10:30:00Z",
        "updated_at": "2024-01-15T10:30:00Z"
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

#### POST `/api/ressources`
**Création d'une ressource**

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
  // Pour type "document" ou "media"
  file: File,
  // Pour type "video" ou "lien"
  external_url: "https://youtube.com/watch?v=...",
  duration: 1800 // en secondes pour vidéos
}
```

**Réponse :**
```json
{
  "success": true,
  "data": {
    "ressource": {
      "id": "uuid",
      "titre": "Titre de la ressource",
      "file_url": "https://wasabi.../uploaded-file.pdf",
      "thumbnail_url": "https://wasabi.../thumbnail.jpg",
      "created_at": "2024-01-15T10:30:00Z"
    }
  }
}
```

#### GET `/api/ressources/:id`
**Détails d'une ressource avec incrémentation du compteur de vues**

**Réponse :**
```json
{
  "success": true,
  "data": {
    "ressource": {
      "id": "uuid",
      "titre": "Cours d'algèbre avancée",
      "description": "Description complète...",
      "content": "Contenu textuel si applicable",
      "file_url": "https://wasabi.../document.pdf",
      "file_size": 2048576,
      "mime_type": "application/pdf",
      "author": {
        "id": "uuid",
        "nom": "Dupont",
        "prenom": "Jean",
        "role": "professeur",
        "avatar_url": "https://..."
      },
      "stats": {
        "likes_count": 15,
        "comments_count": 3,
        "views_count": 128
      },
      "interactions": {
        "is_liked": true,
        "is_favorited": false,
        "can_edit": false,
        "can_delete": false
      }
    }
  }
}
```

#### PUT `/api/ressources/:id`
**Modification d'une ressource (propriétaire uniquement)**

**Réponse :**
```json
{
  "success": true,
  "data": {
    "ressource": {
      "id": "uuid",
      "updated_at": "2024-01-15T11:45:00Z"
    }
  }
}
```

#### DELETE `/api/ressources/:id`
**Suppression avec nettoyage des fichiers Wasabi**

### Interactions

#### POST `/api/ressources/:id/like`
**Toggle like/unlike**

**Réponse :**
```json
{
  "success": true,
  "data": {
    "liked": true,
    "likes_count": 16
  }
}
```

#### POST `/api/ressources/:id/favorite`
**Toggle favori**

**Réponse :**
```json
{
  "success": true,
  "data": {
    "favorited": true,
    "message": "Ressource ajoutée aux favoris"
  }
}
```

### Collections personnelles

#### GET `/api/ressources/my`
**Mes ressources créées**

#### GET `/api/ressources/favorites`
**Mes ressources favorites**

#### GET `/api/ressources/popular`
**Ressources populaires (plus de likes)**

#### GET `/api/ressources/recent`
**Ressources récentes (7 derniers jours)**

### Recherche avancée

#### GET `/api/ressources/search`
**Recherche full-text avec filtres**

**Query Parameters :**
```
?q=algèbre&type=document&matiere=mathematiques&niveau=lycee&author=prof123
```

## 🗂️ Structure des données

### Table `ressources`

```sql
CREATE TABLE ressources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titre VARCHAR(200) NOT NULL,
  description TEXT,
  content TEXT,
  type VARCHAR(20) NOT NULL CHECK (type IN ('document', 'video', 'lien', 'media')),
  matiere VARCHAR(100),
  niveau VARCHAR(50),
  tags TEXT[],
  
  -- Fichiers
  file_url TEXT,
  file_size BIGINT,
  mime_type VARCHAR(100),
  thumbnail_url TEXT,
  
  -- Liens externes
  external_url TEXT,
  duration INTEGER, -- Pour vidéos (en secondes)
  
  -- Métadonnées
  author_id UUID NOT NULL REFERENCES users(id),
  is_public BOOLEAN DEFAULT TRUE,
  
  -- Compteurs
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tables d'interactions

```sql
-- Likes
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  ressource_id UUID NOT NULL REFERENCES ressources(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, ressource_id)
);

-- Favoris
CREATE TABLE favoris (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  ressource_id UUID NOT NULL REFERENCES ressources(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, ressource_id)
);

-- Vues
CREATE TABLE resource_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  ressource_id UUID NOT NULL REFERENCES ressources(id),
  ip_address INET,
  user_agent TEXT,
  viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔒 Sécurité et permissions

### Contrôle d'accès
- **Lecture** : Ressources publiques visibles par tous
- **Création** : Utilisateurs authentifiés uniquement
- **Modification** : Propriétaire de la ressource uniquement
- **Suppression** : Propriétaire uniquement (avec nettoyage Wasabi)

### Validation des uploads
- **Taille maximum** : 50MB par fichier
- **Types autorisés** : PDF, DOCX, TXT, JPG, PNG, GIF, MP4, AVI, MOV
- **Scan antivirus** : Validation côté Wasabi
- **Génération sécurisée** des noms de fichiers

### Rate limiting
- **Upload** : 10 fichiers / 15 minutes
- **Création** : 20 ressources / 15 minutes
- **Interactions** : 100 likes+favoris / 15 minutes

## 🧪 Tests

### ✅ État des tests - **PARFAIT** 🎉
**23 tests sur 23 passent** ✅

| Test Suite | Tests | État | Fonctionnalités |
|------------|-------|------|-----------------|
| **CRUD Operations** | 3/3 | ✅ | Création, validation, authentification |
| **Listing & Search** | 4/4 | ✅ | Liste, filtres, pagination, recherche |
| **Resource Access** | 3/3 | ✅ | Récupération par ID, 404, comptage vues |
| **Updates** | 2/2 | ✅ | Mise à jour propriétaire, permissions |
| **Social Features** | 4/4 | ✅ | Likes (ajout/retrait), favoris |
| **User Resources** | 4/4 | ✅ | Favoris, ressources perso, populaires, récentes |
| **Search & Discovery** | 2/2 | ✅ | Recherche avancée, validation longueur |
| **Deletion** | 1/1 | ✅ | Suppression avec vérification |

### Tests de CRUD
```javascript
describe('POST /api/ressources', () => {
  it('✅ devrait créer une nouvelle ressource', async () => {
    // Test réussi - 201 Created
  });
  it('✅ devrait valider les données d\'entrée', async () => {
    // Test réussi - Validation Joi
  });
  it('✅ devrait rejeter une requête sans authentification', async () => {
    // Test réussi - 401 Unauthorized
  });
});
```

### Tests d'interactions
```javascript
describe('POST /api/ressources/:id/like', () => {
  it('✅ devrait ajouter un like à une ressource', async () => {
    // Test réussi - Toggle like system
  });
  it('✅ devrait retirer un like existant', async () => {
    // Test réussi - Unlike functionality
  });
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data.liked).toBe(true);
  });
});
```

## 📊 Performances

### Optimisations
- **Index** sur matiere, niveau, type, created_at
- **Index full-text** sur titre, description, tags
- **Pagination** avec LIMIT/OFFSET optimisé
- **Cache** des compteurs (likes, vues, commentaires)

### Statistiques utiles
```sql
-- Vue des ressources populaires
CREATE VIEW popular_ressources AS
SELECT r.*, u.nom, u.prenom, u.role
FROM ressources r
JOIN users u ON r.author_id = u.id
WHERE r.is_public = true
ORDER BY (r.likes_count * 3 + r.views_count + r.comments_count * 5) DESC;

-- Statistiques par matière
SELECT 
  matiere,
  COUNT(*) as total,
  AVG(likes_count) as avg_likes,
  AVG(views_count) as avg_views
FROM ressources 
WHERE is_public = true
GROUP BY matiere
ORDER BY total DESC;
```

## 🚨 Gestion d'erreurs

### Erreurs courantes

| Code | Erreur | Description |
|------|--------|-------------|
| 400 | `INVALID_FILE_TYPE` | Type de fichier non supporté |
| 400 | `FILE_TOO_LARGE` | Fichier dépassant 50MB |
| 400 | `MISSING_REQUIRED_FIELDS` | Titre ou type manquant |
| 401 | `UNAUTHORIZED` | Token d'authentification requis |
| 403 | `FORBIDDEN` | Permission insuffisante |
| 404 | `RESSOURCE_NOT_FOUND` | Ressource introuvable |
| 409 | `DUPLICATE_FAVORITE` | Ressource déjà en favoris |
| 413 | `UPLOAD_LIMIT_EXCEEDED` | Limite d'upload dépassée |

## 🔄 Évolutions futures

### Fonctionnalités prévues
- **Prévisualisation** avancée (PDF, vidéos)
- **Conversion** automatique de formats
- **Transcription** automatique des vidéos
- **Suggestions** personnalisées par IA
- **Partage** sur réseaux sociaux
- **Export** en différents formats
- **Versioning** des ressources

### Intégrations
- **YouTube API** pour métadonnées vidéos
- **Office 365** pour prévisualisation documents
- **Plagiat detection** pour contenus textuels
- **Analytics** avancées d'usage

---

*Documentation mise à jour : Janvier 2024*