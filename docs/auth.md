# 🔐 Module Authentification

## Vue d'ensemble

Le module d'authentification gère l'inscription, la connexion et la gestion des profils utilisateurs avec un système de clés d'inscription unique pour garantir l'accès contrôlé à la plateforme.

## 🎯 Fonctionnalités

### Inscription sécurisée
- **Clés d'inscription** pré-générées et uniques
- **Validation** automatique du rôle (professeur/élève)
- **Vérification** email unique
- **Hachage** sécurisé des mots de passe

### Gestion des sessions
- **Tokens JWT** avec expiration configurable
- **Refresh tokens** automatique
- **Déconnexion** sécurisée
- **Validation** middleware pour routes protégées

### Profils utilisateurs
- **Informations** personnelles complètes
- **Mise à jour** contrôlée des données
- **Changement** de mot de passe sécurisé
- **Désactivation** de compte

## 🔑 Système de clés d'inscription

### Clés pré-générées

**Professeurs (10 clés) :**
```
PROF_2024_A1B2C3
PROF_2024_D4E5F6
PROF_2024_G7H8I9
PROF_2024_J0K1L2
PROF_2024_M3N4O5
PROF_2024_P6Q7R8
PROF_2024_S9T0U1
PROF_2024_V2W3X4
PROF_2024_Y5Z6A7
PROF_2024_B8C9D0
```

**Élèves (20 clés) :**
```
ELEVE_2024_E1F2G3
ELEVE_2024_H4I5J6
ELEVE_2024_K7L8M9
ELEVE_2024_N0O1P2
ELEVE_2024_Q3R4S5
... (15 autres)
```

### Validation des clés

```javascript
// Vérification clé valide et non utilisée
const key = await AuthModel.findRegistrationKey(keyValue);
if (!key) {
  throw new Error('Clé d\'inscription invalide ou déjà utilisée');
}

// Marquage comme utilisée après inscription réussie
await AuthModel.markKeyAsUsed(key.id, userId);
```

## 📡 API Endpoints

### POST `/api/auth/register`

**Inscription avec clé d'inscription**

```json
{
  "keyValue": "PROF_2024_A1B2C3",
  "email": "professeur@diagana.com",
  "password": "MotDePasse123!",
  "nom": "Dupont",
  "prenom": "Jean",
  "classe": "3ème A",          // Pour élèves uniquement
  "matiere": "Mathématiques",  // Pour professeurs uniquement
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

### POST `/api/auth/login`

**Connexion utilisateur**

```json
{
  "email": "professeur@diagana.com",
  "password": "MotDePasse123!"
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
    "last_login": "2024-01-15T10:30:00Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### GET `/api/auth/me`

**Profil utilisateur connecté**

**Headers :**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
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
    "avatar_url": "https://...",
    "bio": "Professeur de mathématiques...",
    "created_at": "2024-01-01T00:00:00Z",
    "last_login": "2024-01-15T10:30:00Z"
  }
}
```

### PUT `/api/auth/profile`

**Mise à jour profil**

```json
{
  "nom": "Martin",
  "prenom": "Marie",
  "bio": "Passionnée par l'enseignement des sciences",
  "avatar_url": "https://example.com/avatar.jpg",
  "classe": "2nde B",
  "date_naissance": "1985-03-20"
}
```

### PUT `/api/auth/password`

**Changement mot de passe**

```json
{
  "currentPassword": "AncienMotDePasse123!",
  "newPassword": "NouveauMotDePasse456!"
}
```

### GET `/api/auth/validate-key/:keyValue`

**Validation clé d'inscription**

**Réponse :**
```json
{
  "success": true,
  "valid": true,
  "role": "professeur"
}
```

### POST `/api/auth/logout`

**Déconnexion utilisateur**

```json
{
  "success": true,
  "message": "Déconnexion réussie"
}
```

## 🛡️ Sécurité

### Configuration Supabase
**✅ Provider Email activé** - Nécessaire pour l'authentification
- Connexions par email/mot de passe activées
- Clés RLS (Row Level Security) configurées
- Tables `auth.users` et `public.users` synchronisées

### Validation des données

**Mot de passe :**
- Minimum 8 caractères
- Au moins 1 minuscule, 1 majuscule, 1 chiffre
- Hachage bcrypt avec salt

**Email :**
- Format valide requis
- Unicité vérifiée
- Normalisation automatique

**Données personnelles :**
- Nom/prénom : 2-100 caractères
- Bio : Maximum 500 caractères
- Date naissance : Validation cohérence

### Middleware d'authentification

```javascript
const authenticateToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Token d\'authentification requis'
    });
  }

  try {
    const decoded = verifyToken(token);
    const user = await AuthModel.findUserById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Utilisateur non trouvé'
      });
    }

    req.user = {
      userId: user.id,
      email: user.email,
      role: user.role
    };
    
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Token invalide ou expiré'
    });
  }
};
```

### Rate limiting

- **Inscription** : 5 tentatives / 15 minutes
- **Connexion** : 10 tentatives / 15 minutes
- **Changement profil** : 20 modifications / 15 minutes
- **Changement mot de passe** : 3 tentatives / 15 minutes

## 🗂️ Structure des données

### Table `users`

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email VARCHAR(255) UNIQUE NOT NULL,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('professeur', 'eleve')),
  avatar_url TEXT,
  bio TEXT,
  date_naissance DATE,
  classe VARCHAR(50),      -- Pour élèves
  matiere VARCHAR(100),    -- Pour professeurs
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Table `registration_keys`

```sql
CREATE TABLE registration_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key_value VARCHAR(50) UNIQUE NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('professeur', 'eleve')),
  is_used BOOLEAN DEFAULT FALSE,
  used_by UUID REFERENCES auth.users(id),
  used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🧪 Tests

### ✅ État des tests
**TOUS LES TESTS PASSENT** (16/16) ✅

### Corrections apportées

#### 1. **Problème JWT - Audience property**
**Erreur :** `Bad "options.audience" option. The payload already has an "aud" property`

**Solution :** Nettoyage des propriétés JWT lors du refresh
```javascript
const refreshToken = (token) => {
  const decoded = jwt.verify(token, JWT_SECRET, { ignoreExpiration: true });
  delete decoded.iat;  // Timestamp
  delete decoded.exp;  // Expiration
  delete decoded.aud;  // Audience - CORRECTION
  delete decoded.iss;  // Issuer - CORRECTION
  return generateToken(decoded);
};
```

#### 2. **Clés d'inscription à usage unique**
**Problème :** Clés marquées `used=true` après premier test

**Solution :** Nettoyage automatique des clés de test
```javascript
const cleanupTestData = async () => {
  // Remettre les clés de test à unused
  await supabaseAdmin
    .from('registration_keys')
    .update({ is_used: false, used_by: null, used_at: null })
    .in('key_value', [
      'PROF_2024_G7H8I9', 
      'PROF_2024_A1B2C3', 
      'PROF_2024_D4E5F6',
      'ELEVE_2024_E1F2G3'
    ]);
};
```

#### 3. **Validation des données**
**Erreur :** `"role" is not allowed`

**Solution :** Suppression du champ `role` des données de test
```javascript
// ❌ AVANT - Erreur
const testUser = {
  email: 'test@diagana.com',
  password: 'Test123!',
  role: 'professeur' // ❌ Ne doit pas être envoyé
};

// ✅ APRÈS - Correct  
const testUser = {
  email: 'test@diagana.com',
  password: 'Test123!',
  // Le rôle est déterminé par la clé d'inscription
};
```

### Tests complets

**Suite de tests d'inscription :**
```javascript
describe('POST /api/auth/register', () => {
  it('✅ devrait créer un nouvel élève avec une clé valide');
  it('✅ devrait créer un nouveau professeur avec une clé valide');
  it('✅ devrait rejeter une inscription avec une clé invalide');
  it('✅ devrait rejeter une inscription avec un email déjà utilisé');
  it('✅ devrait valider les données d\'entrée');
});
```

**Suite de tests de connexion :**
```javascript
describe('POST /api/auth/login', () => {
  it('✅ devrait connecter un utilisateur avec des identifiants valides');
  it('✅ devrait rejeter une connexion avec un mot de passe incorrect');
  it('✅ devrait rejeter une connexion avec un email inexistant');
});
```

**Suite de tests d'authentification :**
```javascript
describe('GET /api/auth/me', () => {
  it('✅ devrait retourner les informations de l\'utilisateur connecté');
  it('✅ devrait rejeter une requête sans token');
  it('✅ devrait rejeter une requête avec un token invalide');
});

describe('PUT /api/auth/profile', () => {
  it('✅ devrait mettre à jour le profil utilisateur');
  it('✅ devrait rejeter les champs non autorisés');
});

describe('POST /api/auth/logout', () => {
  it('✅ devrait déconnecter l\'utilisateur');
});

describe('GET /api/auth/validate-key/:keyValue', () => {
  it('✅ devrait valider une clé d\'inscription existante');
  it('✅ devrait rejeter une clé d\'inscription invalide');
});
```

### Configuration de test

**Variables de test :**
```javascript
const testUsers = {
  professeur: {
    email: 'test.prof@diagana.com',
    password: 'TestProf123!',
    keyValue: 'PROF_2024_G7H8I9',
    // role supprimé - déterminé par la clé
  },
  eleve: {
    email: 'test.eleve@diagana.com', 
    password: 'TestEleve123!',
    keyValue: 'ELEVE_2024_E1F2G3',
    // role supprimé - déterminé par la clé
  }
};
```

**Nettoyage automatique :**
- Suppression des utilisateurs de test après chaque suite
- Réinitialisation des clés d'inscription à `unused`
- Nettoyage des données associées (likes, favoris, etc.)

## 🚨 Gestion d'erreurs

### Erreurs courantes

| Code | Erreur | Description |
|------|--------|-------------|
| 400 | `INVALID_KEY` | Clé d'inscription invalide ou utilisée |
| 400 | `EMAIL_EXISTS` | Email déjà enregistré |
| 400 | `WEAK_PASSWORD` | Mot de passe trop faible |
| 401 | `INVALID_CREDENTIALS` | Email/mot de passe incorrect |
| 401 | `TOKEN_EXPIRED` | Token JWT expiré |
| 401 | `TOKEN_INVALID` | Token JWT malformé |
| 429 | `RATE_LIMIT` | Trop de tentatives |

### Exemple gestion d'erreur

```javascript
try {
  const result = await AuthService.register(userData);
  res.status(201).json(result);
} catch (error) {
  logger.error('Erreur inscription:', error);
  
  const status = error.message.includes('clé') ? 400 :
                error.message.includes('existe') ? 409 : 500;
  
  res.status(status).json({
    success: false,
    error: error.message
  });
}
```

## 📊 Monitoring

### Métriques importantes

- **Inscriptions** par jour/semaine
- **Connexions** réussies vs échouées
- **Tokens** expirés vs valides
- **Clés** utilisées vs disponibles
- **Tentatives** de force brute

### Logs de sécurité

```javascript
// Inscription réussie
logger.info(`Nouvel utilisateur inscrit: ${email} (${role})`);

// Tentative connexion échouée
logger.warn(`Tentative connexion échouée: ${email} depuis ${ip}`);

// Token expiré
logger.info(`Token expiré pour utilisateur: ${userId}`);
```

## 🔄 Évolutions futures

### Fonctionnalités prévues

- **2FA** (authentification à deux facteurs)
- **Récupération** mot de passe par email
- **Sessions** multiples par utilisateur
- **OAuth** (Google, Microsoft)
- **Audit trail** des connexions
- **Blocage** temporaire après échecs

### Améliorations sécurité

- **Rotation** automatique des clés JWT
- **Détection** d'anomalies de connexion
- **Géolocalisation** des connexions
- **Notifications** de sécurité
- **Expiration** forcée des sessions

---

*Documentation mise à jour : 6 Août 2025*
*✅ Tous les tests d'authentification passent (16/16)*