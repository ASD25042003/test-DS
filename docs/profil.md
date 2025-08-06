# 👤 Module Profils

## Vue d'ensemble

Le module Profils gère les informations utilisateurs étendues et les interactions sociales entre professeurs et élèves, créant une dimension collaborative à la plateforme.

## 🎯 Fonctionnalités

### Profils utilisateurs
- **Informations personnelles** étendues (nom, prénom, bio, avatar)
- **Statistiques** d'activité (ressources, collections, interactions)
- **Préférences** de confidentialité et notifications
- **Historique** d'activité personnalisé

### Système de suivi social
- **Following/Followers** entre utilisateurs
- **Activité** des utilisateurs suivis
- **Recommandations** d'utilisateurs à suivre
- **Notifications** des nouvelles publications

### Recherche et découverte
- **Recherche** d'utilisateurs par nom, matière, classe
- **Filtrage** par rôle (professeur/élève)
- **Suggestions** basées sur les intérêts communs
- **Annuaire** de l'établissement

## 📡 API Endpoints

### Profils utilisateurs

#### GET `/api/profil/all`
**Liste de tous les utilisateurs actifs**

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
        "last_activity": "2024-01-15T09:30:00Z",
        "created_at": "2024-01-01T00:00:00Z"
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

#### GET `/api/profil/role/:role`
**Utilisateurs par rôle (professeur/eleve)**

**Réponse :**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "uuid",
        "nom": "Martin",
        "prenom": "Marie",
        "role": "eleve",
        "classe": "3ème A",
        "avatar_url": null,
        "stats": {
          "ressources_count": 5,
          "collections_count": 2,
          "likes_received": 12
        }
      }
    ],
    "total": 89,
    "filters": {
      "role": "eleve",
      "classes": ["6ème A", "6ème B", "5ème A", "4ème A", "3ème A", "3ème B"]
    }
  }
}
```

#### GET `/api/profil/search`
**Recherche d'utilisateurs**

**Query Parameters :**
```
?q=jean martin&role=professeur&matiere=sciences&classe=3eme
```

**Réponse :**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "uuid",
        "nom": "Martin",
        "prenom": "Jean",
        "role": "professeur",
        "matiere": "Sciences",
        "match_score": 0.95,
        "highlighted": {
          "nom": "<mark>Jean</mark> <mark>Martin</mark>",
          "matiere": "<mark>Sciences</mark>"
        }
      }
    ],
    "suggestions": [
      "jean dupont",
      "marie martin",
      "sciences physiques"
    ]
  }
}
```

### Profils détaillés

#### GET `/api/profil/:userId`
**Profil détaillé d'un utilisateur**

**Réponse :**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "nom": "Dupont",
      "prenom": "Jean",
      "email": "jean.dupont@diagana.com", // Si c'est son profil
      "role": "professeur",
      "matiere": "Mathématiques",
      "bio": "Professeur passionné par l'enseignement des mathématiques...",
      "avatar_url": "https://example.com/avatar.jpg",
      "date_naissance": "1980-05-15", // Si c'est son profil
      "created_at": "2024-01-01T00:00:00Z",
      "last_login": "2024-01-15T08:30:00Z"
    },
    "stats": {
      "ressources_count": 25,
      "collections_count": 8,
      "likes_received": 120,
      "comments_received": 35,
      "total_views": 1250,
      "followers_count": 15,
      "following_count": 22
    },
    "activity_summary": {
      "last_ressource": "2024-01-14T16:20:00Z",
      "last_collection": "2024-01-12T10:15:00Z",
      "most_liked_ressource": {
        "id": "uuid",
        "titre": "Algèbre avancée",
        "likes_count": 28
      }
    },
    "relationship": {
      "is_following": true,
      "is_followed_by": false,
      "can_message": true
    },
    "permissions": {
      "can_see_email": false,
      "can_see_birth_date": false,
      "can_edit": false
    }
  }
}
```

### Ressources et collections utilisateur

#### GET `/api/profil/:userId/ressources`
**Ressources publiques d'un utilisateur**

**Query Parameters :**
```
?page=1&limit=10&type=document&matiere=mathematiques
```

#### GET `/api/profil/:userId/collections`
**Collections publiques d'un utilisateur**

### Système de suivi

#### GET `/api/profil/:userId/followers`
**Liste des followers**

**Réponse :**
```json
{
  "success": true,
  "data": {
    "followers": [
      {
        "id": "uuid",
        "nom": "Martin",
        "prenom": "Marie",
        "role": "eleve",
        "avatar_url": null,
        "followed_at": "2024-01-10T14:30:00Z",
        "mutual_following": true
      }
    ],
    "pagination": {
      "total": 15,
      "page": 1
    }
  }
}
```

#### GET `/api/profil/:userId/following`
**Liste des utilisateurs suivis**

#### POST `/api/profil/:userId/follow`
**Suivre un utilisateur**

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

#### DELETE `/api/profil/:userId/follow`
**Ne plus suivre un utilisateur**

**Réponse :**
```json
{
  "success": true,
  "data": {
    "following": false,
    "followers_count": 14,
    "message": "Vous ne suivez plus Jean Dupont"
  }
}
```

### Activité utilisateur

#### GET `/api/profil/:userId/activity`
**Journal d'activité (visible si c'est son profil ou si autorisé)**

**Query Parameters :**
```
?page=1&limit=20&type=ressource,collection&since=2024-01-01
```

**Réponse :**
```json
{
  "success": true,
  "data": {
    "activities": [
      {
        "id": "uuid",
        "type": "ressource_created",
        "object": {
          "id": "uuid",
          "titre": "Nouveau cours d'algèbre",
          "type": "document"
        },
        "created_at": "2024-01-15T10:30:00Z"
      },
      {
        "id": "uuid",
        "type": "collection_updated",
        "object": {
          "id": "uuid",
          "title": "Mathématiques 3ème",
          "ressources_added": 2
        },
        "created_at": "2024-01-14T15:20:00Z"
      },
      {
        "id": "uuid",
        "type": "comment_posted",
        "object": {
          "ressource_id": "uuid",
          "ressource_title": "Introduction géométrie",
          "comment": "Excellent cours, très clair..."
        },
        "created_at": "2024-01-13T09:45:00Z"
      }
    ],
    "pagination": {
      "total": 156,
      "page": 1
    },
    "summary": {
      "this_week": {
        "ressources_created": 3,
        "collections_updated": 1,
        "comments_posted": 5,
        "likes_given": 12
      }
    }
  }
}
```

## 🗂️ Structure des données

### Table `users` (étendue)

```sql
-- Table déjà créée dans mig-1, utilisée pour les profils
SELECT 
  id, email, nom, prenom, role,
  avatar_url, bio, date_naissance,
  classe, matiere, is_active,
  last_login, created_at, updated_at
FROM users;
```

### Table `follows` (relations sociales)

```sql
CREATE TABLE follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Contraintes
  UNIQUE(follower_id, following_id),
  CHECK(follower_id != following_id) -- Pas d'auto-follow
);
```

### Table `user_activities` (journal d'activité)

```sql
CREATE TABLE user_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  activity_type VARCHAR(50) NOT NULL, -- ressource_created, collection_updated, etc.
  object_id UUID, -- ID de l'objet concerné
  object_type VARCHAR(50), -- ressource, collection, comment
  metadata JSONB, -- Données supplémentaires
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Vue `user_stats` (statistiques)

```sql
CREATE VIEW user_stats AS
SELECT 
  u.id,
  u.nom,
  u.prenom,
  u.role,
  
  -- Compteurs ressources
  COALESCE(r.ressources_count, 0) as ressources_count,
  COALESCE(r.total_likes_received, 0) as likes_received,
  COALESCE(r.total_views_received, 0) as views_received,
  
  -- Compteurs collections
  COALESCE(c.collections_count, 0) as collections_count,
  
  -- Compteurs commentaires
  COALESCE(cm.comments_posted, 0) as comments_posted,
  COALESCE(cm.comments_received, 0) as comments_received,
  
  -- Compteurs sociaux
  COALESCE(f.followers_count, 0) as followers_count,
  COALESCE(f.following_count, 0) as following_count,
  
  -- Activité récente
  COALESCE(r.last_ressource_created, u.created_at) as last_activity

FROM users u

-- Statistiques ressources
LEFT JOIN (
  SELECT 
    author_id,
    COUNT(*) as ressources_count,
    SUM(likes_count) as total_likes_received,
    SUM(views_count) as total_views_received,
    MAX(created_at) as last_ressource_created
  FROM ressources 
  WHERE is_public = true
  GROUP BY author_id
) r ON u.id = r.author_id

-- Statistiques collections
LEFT JOIN (
  SELECT 
    author_id,
    COUNT(*) as collections_count
  FROM collections 
  WHERE is_public = true
  GROUP BY author_id
) c ON u.id = c.author_id

-- Statistiques commentaires
LEFT JOIN (
  SELECT 
    user_id,
    COUNT(*) as comments_posted,
    0 as comments_received -- À calculer séparément
  FROM commentaires
  GROUP BY user_id
) cm ON u.id = cm.user_id

-- Statistiques followers
LEFT JOIN (
  SELECT 
    u.id,
    COALESCE(followers.count, 0) as followers_count,
    COALESCE(following.count, 0) as following_count
  FROM users u
  LEFT JOIN (
    SELECT following_id, COUNT(*) as count
    FROM follows 
    GROUP BY following_id
  ) followers ON u.id = followers.following_id
  LEFT JOIN (
    SELECT follower_id, COUNT(*) as count  
    FROM follows
    GROUP BY follower_id
  ) following ON u.id = following.follower_id
) f ON u.id = f.id

WHERE u.is_active = true;
```

## 🔒 Sécurité et permissions

### Contrôle d'accès aux profils
- **Profils publics** : Informations de base visibles par tous
- **Profil personnel** : Accès complet aux informations privées
- **Données sensibles** : Email, date naissance limités au propriétaire
- **Activité** : Journal personnel privé par défaut

### Validation des données
```javascript
// Validation mise à jour profil
const profileUpdateSchema = Joi.object({
  nom: Joi.string().min(2).max(100),
  prenom: Joi.string().min(2).max(100),
  bio: Joi.string().max(500).allow(''),
  avatar_url: Joi.string().uri().allow(''),
  classe: Joi.string().max(50).when('role', { 
    is: 'eleve', 
    then: Joi.required() 
  }),
  matiere: Joi.string().max(100).when('role', { 
    is: 'professeur', 
    then: Joi.required() 
  })
});
```

### Politiques RLS
```sql
-- Accès aux profils
CREATE POLICY "Tous peuvent voir les profils actifs" ON users
    FOR SELECT USING (is_active = true);

-- Modification profil
CREATE POLICY "Modification de son propre profil" ON users
    FOR UPDATE USING (get_current_user_id() = id);

-- Follows
CREATE POLICY "Lecture des relations de suivi" ON follows
    FOR SELECT USING (true);

CREATE POLICY "Créer des relations de suivi" ON follows
    FOR INSERT WITH CHECK (get_current_user_id() = follower_id);

CREATE POLICY "Supprimer ses propres follows" ON follows
    FOR DELETE USING (get_current_user_id() = follower_id);
```

## 🧪 Tests

### ✅ État des tests - **PARFAIT** 🎉
**23 tests sur 23 passent** ✅ (avec 1 correction apportée)

| Test Suite | Tests | État | Fonctionnalités |
|------------|-------|------|-----------------|
| **User Listings** | 2/2 | ✅ | Liste utilisateurs, pagination |
| **Role Filtering** | 3/3 | ✅ | Professeurs, élèves, validation rôle |
| **User Search** | 3/3 | ✅ | Recherche, filtres, validation longueur |
| **Profile Access** | 3/3 | ✅ | Profil public, 404, confidentialité |
| **Follow System** | 3/3 | ✅ | Suivre, auto-follow, duplication |
| **Social Features** | 2/2 | ✅ | Followers, following |
| **User Content** | 2/2 | ✅ | Ressources utilisateur, filtres |
| **Collections** | 1/1 | ✅ | Collections utilisateur |
| **Activity Tracking** | 2/2 | ✅ | Activité propriétaire, confidentialité |
| **Unfollow System** | 2/2 | ✅ | Arrêt suivi, vérification existence |

### 🔧 Correction apportée
**Problème :** Test "devrait retourner 404 pour un utilisateur non suivi" échouait
**Solution :** Vérification de l'existence du follow avant suppression dans `services/profil.js`

```javascript
// Avant la suppression, vérifier si le follow existe
const { data: existingFollow } = await supabaseAdmin
  .from('follows')
  .select('id')
  .eq('follower_id', followerId)
  .eq('following_id', followingId)
  .single();

if (!existingFollow) {
  throw new Error('Vous ne suivez pas cet utilisateur'); // → 404
}
```

### Tests de profils
```javascript
describe('GET /api/profil/:userId', () => {
  it('✅ devrait récupérer un profil utilisateur', async () => {
    // Test réussi - Profil complet avec stats
  });
  it('✅ devrait retourner 404 pour un utilisateur inexistant', async () => {
    // Test réussi - 404 Not Found
  });
  it('✅ devrait masquer les informations privées', async () => {
    // Test réussi - Email/date privés masqués
  });
});
```

### Tests de suivi
```javascript
describe('POST /api/profil/:userId/follow', () => {
  it('✅ devrait suivre un utilisateur', async () => {
    // Test réussi - 200 Follow success
  });
  it('✅ devrait rejeter de se suivre soi-même', async () => {
    // Test réussi - 400 Bad Request  
  });
  it('✅ devrait rejeter de suivre un utilisateur déjà suivi', async () => {
    // Test réussi - 409 Conflict
  });

    expect(response.status).toBe(200);
    expect(response.body.data.following).toBe(true);
  });

  it('devrait empêcher l\'auto-suivi', async () => {
    const response = await request(app)
      .post(`/api/profil/${ownUserId}/follow`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
  });
});
```

### Tests de recherche
```javascript
describe('Recherche utilisateurs', () => {
  it('devrait rechercher par nom et prénom', async () => {
    const response = await request(app)
      .get('/api/profil/search?q=jean dupont')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.data.users).toHaveLength(1);
    expect(response.body.data.users[0].highlighted).toBeDefined();
  });
});
```

## 📊 Analytics et monitoring

### Métriques sociales importantes
- **Utilisateurs actifs** par jour/semaine
- **Relations de suivi** nouvelles
- **Recherches d'utilisateurs** populaires
- **Profils les plus consultés**
- **Activité** par rôle (professeur vs élève)

### Requêtes analytics
```sql
-- Utilisateurs les plus suivis
SELECT u.nom, u.prenom, u.role, COUNT(f.follower_id) as followers
FROM users u
LEFT JOIN follows f ON u.id = f.following_id
WHERE u.is_active = true
GROUP BY u.id, u.nom, u.prenom, u.role
ORDER BY followers DESC
LIMIT 10;

-- Activité par rôle
SELECT 
  role,
  COUNT(*) as total_users,
  AVG(ressources_count) as avg_ressources,
  AVG(followers_count) as avg_followers
FROM user_stats
GROUP BY role;

-- Utilisateurs les plus actifs cette semaine
SELECT u.nom, u.prenom, COUNT(ua.id) as activities
FROM users u
JOIN user_activities ua ON u.id = ua.user_id
WHERE ua.created_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY u.id, u.nom, u.prenom
ORDER BY activities DESC
LIMIT 10;
```

## 🔄 Notifications et activité

### Types d'activités trackées
- **ressource_created** : Nouvelle ressource publiée
- **collection_created** : Nouvelle collection créée
- **collection_updated** : Collection mise à jour
- **comment_posted** : Commentaire posté
- **like_given** : Like donné
- **followed_user** : Nouvel utilisateur suivi

### Système de notifications (future)
```javascript
// Service de notification (à implémenter)
const NotificationService = {
  async notifyFollowers(userId, activity) {
    const followers = await ProfilModel.getFollowers(userId);
    
    for (const follower of followers) {
      await this.createNotification({
        user_id: follower.id,
        type: 'follower_activity',
        data: {
          actor: userId,
          activity: activity
        }
      });
    }
  }
};
```

## 🚨 Gestion d'erreurs

### Erreurs courantes

| Code | Erreur | Description |
|------|--------|-------------|
| 400 | `INVALID_USER_DATA` | Données utilisateur invalides |
| 400 | `CANNOT_FOLLOW_SELF` | Impossible de se suivre soi-même |
| 400 | `ALREADY_FOLLOWING` | Utilisateur déjà suivi |
| 401 | `UNAUTHORIZED` | Authentification requise |
| 403 | `PROFILE_ACCESS_DENIED` | Accès profil refusé |
| 404 | `USER_NOT_FOUND` | Utilisateur introuvable |
| 404 | `INACTIVE_USER` | Compte utilisateur désactivé |

## 🔄 Évolutions futures

### Fonctionnalités sociales avancées
- **Messages privés** entre utilisateurs
- **Groupes** par classe ou matière
- **Forums** de discussion
- **Events** et calendrier partagé
- **Badges** et gamification
- **Recommandations** personnalisées

### Intégrations
- **LDAP/AD** pour authentification unique
- **Google/Microsoft** synchronisation contacts
- **Moodle/Chamilo** import données
- **Teams/Discord** notifications

### Analytics avancées
- **Graphique social** de l'établissement
- **Influence** et leaders d'opinion
- **Communautés** et clusters
- **Recommandations** basées sur le réseau

---

*Documentation mise à jour : Janvier 2024*