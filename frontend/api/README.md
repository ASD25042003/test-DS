# 📡 Clients API Frontend - Diagana School

Cette documentation décrit l'implémentation complète des clients API frontend pour communiquer avec le backend Diagana School.

## 🎯 Vue d'ensemble

Les clients API frontend fournissent une interface JavaScript complète pour tous les endpoints du backend, avec :
- **Validation côté client** cohérente avec le backend
- **Gestion d'erreurs** centralisée
- **Upload de fichiers** avec validation
- **Authentification JWT** automatique
- **Tests de cohérence** backend-frontend

## 📁 Structure

```
frontend/api/
├── index.js              # Client API central + configuration
├── auth.js               # Authentification (✅ Existant)
├── resources.js          # Ressources pédagogiques (✅ Implémenté)
├── collections.js        # Collections de ressources (✅ Implémenté)
├── profile.js            # Profils utilisateurs (✅ Implémenté)
├── comments.js           # Commentaires (✅ Implémenté)
├── clients.js            # Export centralisé (✅ Implémenté)
├── tests/                # Tests de cohérence
│   └── api-clients.test.js
└── README.md            # Cette documentation
```

## 🔧 Configuration API (index.js)

### Classe ApiClient

Client central qui gère :
- **Base URL** et endpoints
- **Headers JWT** automatiques
- **Gestion d'erreurs** unifiée
- **Upload de fichiers** avec FormData
- **Validation de fichiers** (taille, type)

```javascript
import { apiClient, ApiError, API_CONFIG } from '/static/api/index.js';

// Configuration automatique
const client = apiClient; // Instance pré-configurée
```

### Endpoints Backend

```javascript
const API_CONFIG = {
    BASE_URL: '/api',
    ENDPOINTS: {
        AUTH: '/auth',
        PROFILE: '/profil',           // ⚠️ 'profil' pas 'profile'
        RESOURCES: '/ressources',     // ⚠️ 'ressources' pas 'resources'
        COLLECTIONS: '/collections',
        COMMENTS: '/commentaires'     // ⚠️ 'commentaires' pas 'comments'
    }
};
```

## 🔐 API Authentification (auth.js)

### Fonctionnalités

- ✅ **11 méthodes complètes** couvrant tous les endpoints backend
- ✅ **Validation clés d'inscription** (PROF_2024_XXX, ELEVE_2024_XXX)
- ✅ **Gestion JWT** automatique avec localStorage
- ✅ **Validation mot de passe** selon règles backend

### Exemple d'usage

```javascript
import { authApi } from '/static/api/auth.js';

// Inscription
const userData = {
    keyValue: 'PROF_2024_A1B2C3',
    email: 'jean.dupont@diagana.edu',
    password: 'MonMotDePasse123',
    nom: 'Dupont',
    prenom: 'Jean',
    matiere: 'Mathématiques'
};

try {
    const result = await authApi.register(userData);
    console.log('Utilisateur créé:', result.user);
} catch (error) {
    console.error('Erreur inscription:', error.message);
}

// Connexion
const credentials = {
    email: 'jean.dupont@diagana.edu',
    password: 'MonMotDePasse123'
};

const loginResult = await authApi.login(credentials);
```

## 📚 API Ressources (resources.js)

### Fonctionnalités

- ✅ **CRUD complet** avec upload de fichiers
- ✅ **Recherche et filtres** avancés
- ✅ **Interactions sociales** (likes, favoris)
- ✅ **Validation cohérente** avec backend
- ✅ **Types corrects** : `document`, `media`, `video`, `lien`

### Exemple d'usage

```javascript
import { resourcesApi } from '/static/api/resources.js';

// Recherche de ressources
const ressources = await resourcesApi.getAll({
    search: 'mathématiques',
    type: 'document',
    matiere: 'Mathématiques',
    page: 1,
    limit: 20
});

// Création avec fichier
const resourceData = {
    titre: 'Cours de Géométrie',
    description: 'Introduction aux formes géométriques',
    type: 'document',
    contenu: { 
        description: 'Document PDF de 25 pages'
    },
    tags: ['géométrie', 'mathématiques'],
    matiere: 'Mathématiques',
    niveau: '6ème',
    is_public: true
};

const fileInput = document.getElementById('file-upload');
const file = fileInput.files[0];

try {
    const result = await resourcesApi.create(resourceData, file);
    console.log('Ressource créée:', result.data);
} catch (error) {
    console.error('Erreur création:', error.message);
}

// Toggle like
await resourcesApi.toggleLike('resource-id-123');
```

### Validation

```javascript
const errors = resourcesApi.validateResourceData({
    titre: 'Tr', // ❌ Trop court (min 3)
    type: 'pdf',  // ❌ Type invalide
    contenu: 'string' // ❌ Doit être un objet
});

console.log(errors);
// {
//   titre: 'Le titre doit contenir au moins 3 caractères',
//   type: 'Le type doit être: document, media, video, lien',
//   contenu: 'Le contenu est obligatoire et doit être un objet'
// }
```

## 📁 API Collections (collections.js)

### Fonctionnalités

- ✅ **CRUD complet** pour collections
- ✅ **Gestion des ressources** (ajout, suppression, réorganisation)
- ✅ **Duplication** de collections
- ✅ **Champs corrects** : `nom` (pas `titre`), `is_public` (pas `visibility`)

### Exemple d'usage

```javascript
import { collectionsApi } from '/static/api/collections.js';

// Création de collection
const collectionData = {
    nom: 'Ma Collection Mathématiques',
    description: 'Ressources pour le niveau 6ème',
    is_public: true  // ⚠️ Backend utilise 'is_public' boolean
};

const collection = await collectionsApi.create(collectionData);

// Ajouter une ressource
await collectionsApi.addRessource(collection.data.id, {
    ressource_id: 'resource-123',  // ⚠️ Backend utilise 'ressource_id'
    ordre: 1
});

// Réorganiser les ressources
await collectionsApi.reorderRessources(collection.data.id, [
    { ressource_id: 'resource-123', ordre: 1 },
    { ressource_id: 'resource-456', ordre: 2 }
]);
```

## 👤 API Profils (profile.js)

### Fonctionnalités

- ✅ **Recherche d'utilisateurs** par rôle, matière, classe
- ✅ **Système de suivi** (follow/unfollow)
- ✅ **Activité utilisateur** et statistiques
- ✅ **Utilitaires** formatage, calcul âge
- ✅ **Rôles corrects** : `professeur`, `eleve`

### Exemple d'usage

```javascript
import { profileApi } from '/static/api/profile.js';

// Recherche d'utilisateurs
const professeurs = await profileApi.getUsersByRole('professeur', {
    page: 1,
    limit: 10
});

// Recherche avancée
const utilisateurs = await profileApi.searchUsers({
    q: 'Jean',
    role: 'professeur',
    matiere: 'Mathématiques'
});

// Suivre un utilisateur
await profileApi.followUser('user-id-123');

// Utilitaires
const user = { prenom: 'Jean', nom: 'Dupont' };
const nomComplet = profileApi.formatFullName(user); // "Jean Dupont"

const age = profileApi.calculateAge('1990-06-15'); // 33
```

## 💬 API Commentaires (comments.js)

### Fonctionnalités

- ✅ **CRUD complet** pour commentaires
- ✅ **Système hiérarchique** avec réponses
- ✅ **Arbre de commentaires** avec utilitaires
- ✅ **Détection mentions** (@username)
- ✅ **Formatage dates** relatif (il y a 2h, etc.)

### Exemple d'usage

```javascript
import { commentsApi } from '/static/api/comments.js';

// Récupérer les commentaires d'une ressource
const comments = await commentsApi.getByRessource('resource-id-123', {
    page: 1,
    limit: 20,
    sortOrder: 'asc'
});

// Créer un commentaire
const commentData = {
    ressource_id: 'resource-id-123',
    contenu: 'Excellent cours ! Merci @"Jean Dupont"'
};

const newComment = await commentsApi.create(commentData);

// Répondre à un commentaire
const replyData = {
    ressource_id: 'resource-id-123',
    contenu: 'Je suis d\'accord avec toi !'
};

await commentsApi.reply('comment-id-456', replyData);

// Organiser en arbre hiérarchique
const flatComments = comments.data;
const commentsTree = commentsApi.buildCommentsTree(flatComments);

// Utilitaires
const mentions = commentsApi.extractMentions('Salut @jean et @"Marie Martin"');
// [{ mention: '@jean', name: 'jean' }, { mention: '@"Marie Martin"', name: 'Marie Martin' }]

const formatted = commentsApi.formatComment(comment);
// Ajoute: created_at_formatted, mentions, isEdited, etc.

const stats = commentsApi.getCommentsStats(commentsTree);
// { totalComments: 15, totalReplies: 8, uniqueAuthors: 5, maxDepth: 3 }
```

## 🧪 Tests de Cohérence

### Tests Automatisés

Le fichier `tests/api-clients.test.js` contient :

- ✅ **Tests unitaires** pour chaque client API
- ✅ **Validation des données** selon règles backend
- ✅ **Vérification endpoints** et paramètres
- ✅ **Tests de cohérence** frontend-backend

### Exécution des Tests

#### Méthode 1 : Tests dans le navigateur (recommandé)

```bash
# 1. Démarrer le serveur de développement
cd backend
npm run dev

# 2. Ouvrir http://localhost:3000/auth dans le navigateur
# 3. Ouvrir la console développeur (F12)
# 4. Coller et exécuter ce code :
```

```javascript
// Charger et exécuter les tests
const script = document.createElement('script');
script.src = '/static/api/tests/api-clients.test.js';
script.onload = () => {
    console.log('🧪 Tests des clients API chargés et exécutés');
};
document.head.appendChild(script);
```

#### Méthode 2 : Tests avec Node.js

```bash
# 1. Installer Jest si pas encore fait
cd frontend
npm install --save-dev jest

# 2. Créer package.json si nécessaire
cat > package.json << 'EOF'
{
  "name": "diagana-frontend-tests",
  "version": "1.0.0",
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch"
  },
  "devDependencies": {
    "jest": "^29.0.0"
  }
}
EOF

# 3. Exécuter les tests
npm test api/tests/api-clients.test.js
```

#### Méthode 3 : Tests manuels rapides

```bash
# Ouvrir le navigateur sur la page auth
# Dans la console, tester directement :
```

```javascript
// Test quick des imports
import('/static/api/clients.js').then(({ getApi }) => {
    getApi().then(api => {
        console.log('✅ API clients chargés:', Object.keys(api));
        
        // Test validation resources
        const errors = api.resources.validateResourceData({
            titre: 'Te', // Trop court
            type: 'invalid'
        });
        console.log('❌ Erreurs détectées:', errors);
        
        // Test validation collections  
        const colErrors = api.collections.validateCollectionData({
            nom: 'Collection Test',
            is_public: 'invalid' // Doit être boolean
        });
        console.log('❌ Erreurs collections:', colErrors);
    });
});
```

### Couverture de Tests

| Module | Méthodes | Validation | Cohérence Backend |
|--------|----------|------------|-------------------|
| **Resources** | ✅ 12/12 | ✅ Complète | ✅ Types, limites |
| **Collections** | ✅ 11/11 | ✅ Complète | ✅ Champs, format |
| **Profile** | ✅ 10/10 | ✅ Complète | ✅ Rôles, endpoints |
| **Comments** | ✅ 4/4 + utils | ✅ Complète | ✅ Hiérarchie, mentions |
| **Auth** | ✅ 11/11 | ✅ Existante | ✅ Validé |

## 🔍 Points de Cohérence Critiques

### Types de Ressources
```javascript
// ✅ Correct (backend)
['document', 'media', 'video', 'lien']

// ❌ Incorrect
['document', 'media', 'video', 'link'] // 'link' au lieu de 'lien'
```

### Champs Collections
```javascript
// ✅ Correct (backend)
{
    nom: 'Ma Collection',        // 'nom' pas 'titre'
    is_public: true             // 'is_public' pas 'visibility'
}
```

### Rôles Utilisateurs
```javascript
// ✅ Correct (backend)
['professeur', 'eleve']

// ❌ Incorrect
['teacher', 'student'] // Termes anglais
```

### Endpoints
```javascript
// ✅ Correct (backend français)
{
    RESOURCES: '/ressources',    // Pas '/resources'
    PROFILE: '/profil',         // Pas '/profile'
    COMMENTS: '/commentaires'   // Pas '/comments'
}
```

## 📋 Usage Recommandé

### 1. Import des Modules

```javascript
// Client central
import { apiClient, ApiError, API_CONFIG } from '/static/api/index.js';

// Modules spécialisés
import { authApi } from '/static/api/auth.js';
import { resourcesApi } from '/static/api/resources.js';
import { collectionsApi } from '/static/api/collections.js';
import { profileApi } from '/static/api/profile.js';
```

### 2. Gestion d'Erreurs

```javascript
try {
    const result = await resourcesApi.create(data, file);
    // Succès
} catch (error) {
    if (error instanceof ApiError) {
        console.error(`Erreur ${error.status}:`, error.message);
        if (error.status === 401) {
            // Redirection vers login
        } else if (error.status === 400) {
            // Erreur de validation
            console.log('Détails:', error.details);
        }
    }
}
```

### 3. Validation Avant Envoi

```javascript
// Valider les données avant envoi
const errors = resourcesApi.validateResourceData(formData);
if (Object.keys(errors).length > 0) {
    // Afficher les erreurs dans le formulaire
    Object.entries(errors).forEach(([field, message]) => {
        showFieldError(field, message);
    });
    return;
}

// Envoyer si validation OK
const result = await resourcesApi.create(formData, file);
```

## 🚀 Prochaines Étapes

### Modules à Ajouter
- [x] **Commentaires API** (`/api/commentaires`) ✅ **Terminé**
- [ ] **Notifications API** (si implémenté)
- [ ] **Dashboard API** (statistiques)

### Améliorations
- [ ] **Tests E2E** avec serveur backend réel
- [ ] **Cache client** pour données fréquentes
- [ ] **Retry automatique** sur erreurs réseau
- [ ] **Monitoring** des performances API

## 📞 Support

- **Documentation Backend** : `backend/routes/` et `backend/controllers/`
- **Tests Backend** : `backend/test/api/`
- **Configuration** : `frontend/api/index.js`

---

## 🎯 Lancement Rapide des Tests

**Page de tests interactive** : `frontend/api/test-runner.html`

```bash
# 1. Démarrer le serveur (si pas déjà fait)
cd backend && npm run dev

# 2. Ouvrir dans le navigateur
http://localhost:3000/static/api/test-runner.html

# 3. Les tests s'exécutent automatiquement !
```

---

**✅ Status : Implémentation Complète**  
**📅 Dernière mise à jour** : 9 Août 2025  
**🧪 Tests** : Cohérence backend-frontend validée  
**🚀 Prêt** : Page de tests interactive disponible