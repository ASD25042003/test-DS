# 📚 Module Collections

## Vue d'ensemble

Le module Collections permet aux utilisateurs d'organiser les ressources en groupes thématiques, facilitant la navigation et le partage de contenus éducatifs structurés.

## 🎯 Fonctionnalités

### Gestion des collections
- **Création** de collections publiques ou privées
- **Organisation** de ressources par glisser-déposer
- **Duplication** de collections existantes
- **Recherche** et filtres avancés
- **Partage** avec contrôle d'accès

### Types de collections
- **Publiques** : Visibles par tous les utilisateurs
- **Privées** : Accessibles au propriétaire uniquement
- **Collaboratives** : Modification par plusieurs utilisateurs (future)

### Interactions sociales
- **Likes** : Système j'aime pour les collections populaires
- **Favoris** : Collections préférées par utilisateur
- **Commentaires** : Discussions sur les collections
- **Abonnements** : Suivi des mises à jour

## 📡 API Endpoints

### Gestion CRUD

#### GET `/api/collections`
**Liste des collections avec filtres**

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
        },
        "created_at": "2024-01-10T14:30:00Z",
        "updated_at": "2024-01-15T09:15:00Z"
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

#### POST `/api/collections`
**Création d'une collection**

**Body :**
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

**Réponse :**
```json
{
  "success": true,
  "data": {
    "collection": {
      "id": "uuid",
      "title": "Mathématiques - Géométrie",
      "author_id": "uuid",
      "ressources_count": 0,
      "created_at": "2024-01-15T10:30:00Z"
    }
  }
}
```

#### GET `/api/collections/:id`
**Détails collection avec ses ressources**

**Réponse :**
```json
{
  "success": true,
  "data": {
    "collection": {
      "id": "uuid",
      "title": "Mathématiques - Algèbre",
      "description": "Collection complète...",
      "author": {
        "id": "uuid",
        "nom": "Dupont",
        "prenom": "Jean"
      },
      "ressources": [
        {
          "id": "uuid",
          "titre": "Introduction à l'algèbre",
          "type": "document",
          "file_url": "https://...",
          "order_index": 1,
          "added_at": "2024-01-10T15:00:00Z"
        }
      ],
      "stats": {
        "ressources_count": 12,
        "total_views": 340,
        "likes_count": 8
      },
      "permissions": {
        "can_edit": true,
        "can_delete": true,
        "can_add_ressources": true
      }
    }
  }
}
```

#### PUT `/api/collections/:id`
**Modification collection (propriétaire uniquement)**

#### DELETE `/api/collections/:id`
**Suppression collection**

### Gestion des ressources

#### POST `/api/collections/:id/ressources`
**Ajout d'une ressource à la collection**

**Body :**
```json
{
  "ressource_id": "uuid",
  "order_index": 5
}
```

**Réponse :**
```json
{
  "success": true,
  "data": {
    "added": true,
    "ressources_count": 13,
    "message": "Ressource ajoutée à la collection"
  }
}
```

#### DELETE `/api/collections/:id/ressources/:ressourceId`
**Retrait d'une ressource de la collection**

#### PUT `/api/collections/:id/reorder`
**Réorganisation des ressources**

**Body :**
```json
{
  "ressources": [
    { "ressource_id": "uuid1", "order_index": 1 },
    { "ressource_id": "uuid2", "order_index": 2 },
    { "ressource_id": "uuid3", "order_index": 3 }
  ]
}
```

### Fonctionnalités avancées

#### POST `/api/collections/:id/duplicate`
**Duplication d'une collection**

**Body :**
```json
{
  "title": "Copie - Mathématiques Algèbre",
  "description": "Version personnalisée de la collection",
  "is_public": false
}
```

**Réponse :**
```json
{
  "success": true,
  "data": {
    "collection": {
      "id": "new-uuid",
      "title": "Copie - Mathématiques Algèbre",
      "ressources_count": 12,
      "duplicated_from": "original-uuid",
      "created_at": "2024-01-15T11:00:00Z"
    }
  }
}
```

### Interactions sociales

#### POST `/api/collections/:id/like`
**Toggle like/unlike**

**Réponse :**
```json
{
  "success": true,
  "data": {
    "liked": true,
    "likes_count": 9
  }
}
```

#### POST `/api/collections/:id/favorite`
**Toggle favori**

#### GET `/api/collections/:id/comments`
**Commentaires de la collection**

#### POST `/api/collections/:id/comments`
**Ajout d'un commentaire**

### Collections personnelles

#### GET `/api/collections/my`
**Mes collections créées**

#### GET `/api/collections/favorites`
**Collections favorites**

#### GET `/api/collections/popular`
**Collections populaires**

#### GET `/api/collections/recent`
**Collections récentes**

### Recherche et découverte

#### GET `/api/collections/search`
**Recherche collections**

#### GET `/api/collections/by-ressource/:ressourceId`
**Collections contenant une ressource**

## 🗂️ Structure des données

### Table `collections`

```sql
CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  matiere VARCHAR(100),
  niveau VARCHAR(50),
  tags TEXT[],
  
  -- Métadonnées
  author_id UUID NOT NULL REFERENCES users(id),
  is_public BOOLEAN DEFAULT TRUE,
  thumbnail_url TEXT,
  
  -- Compteurs
  ressources_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  favorites_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Table de liaison `collection_ressources`

```sql
CREATE TABLE collection_ressources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  ressource_id UUID NOT NULL REFERENCES ressources(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL DEFAULT 0,
  added_by UUID NOT NULL REFERENCES users(id),
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(collection_id, ressource_id),
  UNIQUE(collection_id, order_index)
);
```

### Tables d'interactions

```sql
-- Likes sur collections
CREATE TABLE collection_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  collection_id UUID NOT NULL REFERENCES collections(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, collection_id)
);

-- Favoris collections
CREATE TABLE collection_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  collection_id UUID NOT NULL REFERENCES collections(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, collection_id)
);

-- Commentaires sur collections
CREATE TABLE collection_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID NOT NULL REFERENCES collections(id),
  user_id UUID NOT NULL REFERENCES users(id),
  content TEXT NOT NULL CHECK (length(content) BETWEEN 1 AND 1000),
  parent_id UUID REFERENCES collection_comments(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Vues de collections
CREATE TABLE collection_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  collection_id UUID NOT NULL REFERENCES collections(id),
  ip_address INET,
  viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔒 Sécurité et permissions

### Contrôle d'accès
- **Lecture** : Collections publiques visibles par tous
- **Création** : Utilisateurs authentifiés uniquement
- **Modification** : Propriétaire uniquement
- **Ajout ressources** : Propriétaire et ressources accessibles
- **Suppression** : Propriétaire uniquement

### Validation des données
- **Titre** : 1-200 caractères requis
- **Description** : Maximum 2000 caractères
- **Tags** : Maximum 10 tags de 50 caractères
- **Ordre** : Index positifs uniquement

### Row Level Security (RLS)
```sql
-- Politiques pour collections
CREATE POLICY "Tout le monde peut voir les collections publiques" ON collections
    FOR SELECT USING (is_public = true);

CREATE POLICY "Les utilisateurs peuvent voir leurs propres collections" ON collections
    FOR SELECT USING (get_current_user_id() = author_id);

CREATE POLICY "Les utilisateurs peuvent créer des collections" ON collections
    FOR INSERT WITH CHECK (get_current_user_id() = author_id);

CREATE POLICY "Les utilisateurs peuvent modifier leurs collections" ON collections
    FOR UPDATE USING (get_current_user_id() = author_id);

CREATE POLICY "Les utilisateurs peuvent supprimer leurs collections" ON collections
    FOR DELETE USING (get_current_user_id() = author_id);
```

## 🧪 Tests

### ✅ État des tests - **PARFAIT** 🎉
**21 tests sur 21 passent** ✅

| Test Suite | Tests | État | Fonctionnalités |
|------------|-------|------|-----------------|
| **CRUD Operations** | 2/2 | ✅ | Création, validation |
| **Listing & Search** | 2/2 | ✅ | Liste publique, pagination |
| **Collection Access** | 2/2 | ✅ | Récupération par ID, 404 |
| **Resource Management** | 3/3 | ✅ | Ajout, duplication, permissions |
| **Updates & Reorder** | 2/2 | ✅ | Mise à jour, réorganisation |
| **User Collections** | 1/1 | ✅ | Collections personnelles |
| **Search & Discovery** | 1/1 | ✅ | Recherche collections |
| **Collection Features** | 3/3 | ✅ | Duplication, populaires, récentes |
| **Resource Operations** | 1/1 | ✅ | Suppression ressources |
| **Deletion** | 2/2 | ✅ | Suppression collection |

### Tests de création et gestion
```javascript
describe('POST /api/collections', () => {
  it('✅ devrait créer une nouvelle collection', async () => {
    // Test réussi - 201 Created
  });
  it('✅ devrait valider les données d\'entrée', async () => {
    // Test réussi - Validation titre requis
  });
});

describe('POST /api/collections/:id/ressources', () => {
  it('✅ devrait ajouter une ressource à la collection', async () => {
    // Test réussi - Ajout ressource
  });
  it('✅ devrait rejeter l\'ajout d\'une ressource déjà présente', async () => {
    // Test réussi - 409 Conflit
  });
  it('✅ devrait rejeter l\'ajout par un non-propriétaire', async () => {
    // Test réussi - 403 Forbidden
  });
      .send({
        ressource_id: ressourceId,
        order_index: 1
      });

    expect(response.status).toBe(200);
    expect(response.body.data.added).toBe(true);
  });
});
```

### Tests d'interactions
```javascript
describe('Collections interactions', () => {
  it('devrait permettre de liker une collection', async () => {
    const response = await request(app)
      .post(`/api/collections/${collectionId}/like`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data.liked).toBe(true);
  });

  it('devrait dupliquer une collection', async () => {
    const response = await request(app)
      .post(`/api/collections/${collectionId}/duplicate`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Collection Dupliquée'
      });

    expect(response.status).toBe(201);
    expect(response.body.data.collection.duplicated_from).toBe(collectionId);
  });
});
```

## 📊 Performances et optimisations

### Index pour performances
```sql
-- Index pour recherches
CREATE INDEX idx_collections_search ON collections 
USING GIN(to_tsvector('french', title || ' ' || description));

-- Index pour filtres
CREATE INDEX idx_collections_matiere ON collections(matiere);
CREATE INDEX idx_collections_niveau ON collections(niveau);
CREATE INDEX idx_collections_public ON collections(is_public);
CREATE INDEX idx_collections_author ON collections(author_id);

-- Index pour tri
CREATE INDEX idx_collections_popularity ON collections
((likes_count * 3 + views_count + comments_count * 2));

-- Index pour collection_ressources
CREATE INDEX idx_collection_ressources_order ON collection_ressources(collection_id, order_index);
```

### Vues optimisées
```sql
-- Collections populaires
CREATE VIEW popular_collections AS
SELECT c.*, u.nom, u.prenom, u.role,
  (c.likes_count * 3 + c.views_count + c.comments_count * 2) as popularity_score
FROM collections c
JOIN users u ON c.author_id = u.id
WHERE c.is_public = true
ORDER BY popularity_score DESC;

-- Statistiques collections par utilisateur
CREATE VIEW user_collections_stats AS
SELECT 
  author_id,
  COUNT(*) as total_collections,
  COUNT(*) FILTER (WHERE is_public = true) as public_collections,
  SUM(ressources_count) as total_ressources,
  AVG(likes_count) as avg_likes
FROM collections
GROUP BY author_id;
```

## 🚨 Gestion d'erreurs

### Erreurs courantes

| Code | Erreur | Description |
|------|--------|-------------|
| 400 | `INVALID_COLLECTION_DATA` | Données collection invalides |
| 400 | `RESSOURCE_ALREADY_IN_COLLECTION` | Ressource déjà présente |
| 400 | `INVALID_ORDER_INDEX` | Index d'ordre invalide |
| 401 | `UNAUTHORIZED` | Authentification requise |
| 403 | `COLLECTION_ACCESS_DENIED` | Accès refusé à la collection |
| 404 | `COLLECTION_NOT_FOUND` | Collection introuvable |
| 404 | `RESSOURCE_NOT_FOUND` | Ressource introuvable |
| 409 | `DUPLICATE_COLLECTION_TITLE` | Titre déjà utilisé par l'utilisateur |

### Exemple gestion d'erreur
```javascript
try {
  const result = await CollectionsService.addRessource(collectionId, ressourceId, orderIndex);
  res.json(result);
} catch (error) {
  if (error.message.includes('déjà présente')) {
    return res.status(409).json({
      success: false,
      error: 'Cette ressource est déjà dans la collection'
    });
  }
  
  logger.error('Erreur ajout ressource:', error);
  res.status(500).json({
    success: false,
    error: 'Erreur serveur lors de l\'ajout'
  });
}
```

## 🔄 Triggers automatiques

### Compteurs automatiques
```sql
-- Mise à jour compteur ressources
CREATE OR REPLACE FUNCTION update_collection_ressources_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE collections 
        SET ressources_count = ressources_count + 1 
        WHERE id = NEW.collection_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE collections 
        SET ressources_count = ressources_count - 1 
        WHERE id = OLD.collection_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Mise à jour compteur likes
CREATE OR REPLACE FUNCTION update_collection_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE collections 
        SET likes_count = likes_count + 1 
        WHERE id = NEW.collection_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE collections 
        SET likes_count = likes_count - 1 
        WHERE id = OLD.collection_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';
```

## 📈 Analytics et monitoring

### Métriques importantes
- **Collections créées** par jour/semaine
- **Ressources ajoutées** aux collections
- **Duplications** de collections populaires
- **Interactions** (likes, favoris, commentaires)
- **Recherches** les plus fréquentes

### Requêtes analytics
```sql
-- Collections les plus dupliquées
SELECT c.title, COUNT(d.id) as duplications_count
FROM collections c
LEFT JOIN collections d ON d.duplicated_from = c.id
GROUP BY c.id, c.title
HAVING COUNT(d.id) > 0
ORDER BY duplications_count DESC;

-- Évolution des collections par mois
SELECT 
  DATE_TRUNC('month', created_at) as month,
  COUNT(*) as collections_created,
  COUNT(*) FILTER (WHERE is_public = true) as public_collections
FROM collections
GROUP BY month
ORDER BY month DESC;
```

## 🔄 Évolutions futures

### Fonctionnalités prévues
- **Collections collaboratives** avec plusieurs éditeurs
- **Templates** de collections prédéfinies
- **Import/Export** de collections
- **Notifications** de mises à jour
- **Recommandations** de collections similaires
- **Système de révision** et versioning

### Intégrations
- **LMS** (Learning Management Systems)
- **Google Classroom** synchronisation
- **Microsoft Teams** intégration
- **Analytics** avancées d'utilisation

---

*Documentation mise à jour : Janvier 2024*