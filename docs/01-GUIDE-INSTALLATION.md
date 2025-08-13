# 🚀 Guide d'Installation - Diagana School

## Vue d'ensemble

Ce guide vous accompagne dans l'installation complète de Diagana School, de la configuration initiale jusqu'au premier démarrage de l'application.

---

## 📋 Prérequis Système

### Logiciels Requis
- **Node.js 18+** et npm
- **Git** pour le versioning
- Compte [Supabase](https://supabase.com) (base de données PostgreSQL)
- Compte [Wasabi](https://wasabi.com) (stockage S3)

### Outils Recommandés
- **VS Code** avec extensions :
  - ES6 modules
  - SQLite/PostgreSQL viewers
  - Tailwind CSS IntelliSense

---

## 🔧 Installation

### 1. Clonage du Projet

```bash
# Cloner le projet
git clone https://github.com/ASD25042003/diagana-school.git
cd diagana-school

# Installer les dépendances backend
cd backend
npm install
```

### 2. Configuration des Variables d'Environnement

```bash
# Copier le fichier d'environnement
cp .env.example .env

# Éditer .env avec vos clés
```

**Fichier `.env` complet :**

```env
# Serveur
NODE_ENV=development
PORT=3000

# Supabase (Base de données PostgreSQL)
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_public_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Wasabi S3 (Stockage fichiers)
WASABI_ACCESS_KEY=your_access_key
WASABI_SECRET_KEY=your_secret_key
WASABI_BUCKET=diagana-school-files
WASABI_REGION=eu-west-2

# JWT (Sessions utilisateur)
JWT_SECRET=your-super-secure-secret-key
JWT_EXPIRES_IN=7d

# Upload (Limites fichiers)
MAX_FILE_SIZE=50MB
ALLOWED_FILE_TYPES=pdf,docx,txt,jpg,jpeg,png,gif,mp4,avi,mov
```

### 3. Configuration des Services Externes

#### Supabase (Base de données)
1. Créer un nouveau projet sur [supabase.com](https://supabase.com)
2. Récupérer l'URL du projet et les clés API
3. Activer le provider email dans Authentication > Settings

#### Wasabi (Stockage S3)
1. Créer un compte sur [wasabi.com](https://wasabi.com)
2. Créer un bucket `diagana-school-files` en région `eu-west-2`
3. Générer les clés d'accès et secret

---

## 🗄️ Configuration Base de Données

### Migrations Manuelles Supabase

Les migrations doivent être exécutées **manuellement** dans votre dashboard Supabase, **dans l'ordre exact** suivant :

### Procédure d'Exécution

1. **Accéder à Supabase**
   - Aller sur [supabase.com](https://supabase.com)
   - Se connecter et sélectionner votre projet
   - Aller dans **SQL Editor**

2. **Exécuter les migrations dans l'ordre**

#### Migration 1 : Tables Principales
**Fichier :** `backend/migrations/mig-1.sql`
**Contenu :** Tables utilisateurs, ressources, collections, interactions

```bash
# Copier le contenu de backend/migrations/mig-1.sql
# Coller dans SQL Editor de Supabase
# Cliquer "Run"
```

#### Migration 2 : Triggers et Fonctions
**Fichier :** `backend/migrations/mig-2.sql`
**Contenu :** Fonctions automatiques, triggers timestamps

#### Migration 3 : Données Initiales
**Fichier :** `backend/migrations/mig-3.sql`
**Contenu :** 30 clés d'inscription, vues optimisées, index

#### Migration 4 : Optimisations
**Fichier :** `backend/migrations/mig-4.sql`
**Contenu :** Politiques RLS, index performance

### Vérification des Migrations

Après exécution, vérifier :

```sql
-- Vérifier les tables créées
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Vérifier les clés d'inscription (doit retourner 30)
SELECT COUNT(*) FROM registration_keys;

-- Vérifier les triggers
SELECT trigger_name, event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema = 'public';
```

**Résultat attendu :**
- **15 tables** créées dans le schéma public
- **30 clés d'inscription** insérées
- **Triggers actifs** sur toutes les tables principales
- **Politiques RLS** configurées

---

## 🎮 Premier Démarrage

### 1. Lancement du Serveur

```bash
# En développement
cd backend
npm run dev

# En production
npm start
```

### 2. Vérification du Fonctionnement

**L'application sera accessible sur :**
- **Page d'accueil :** http://localhost:3000/
- **Authentification :** http://localhost:3000/auth
- **Application SPA :** http://localhost:3000/home
- **API Backend :** http://localhost:3000/api

### 3. Tests de Validation

```bash
# Tests complets (doit afficher 83/84 réussis)
npm test

# Tests de configuration uniquement
npm test test/config/

# Tests par module
npm test test/api/auth/auth.test.js
npm test test/api/ressources/
npm test test/api/collections/
npm test test/api/profil/
```

**Résultats attendus :**
- ✅ **Tests config** : 64/65 réussis (98,5%)
- ✅ **Tests API** : 83/84 réussis (99%)
- ✅ **Connexion Supabase** : Opérationnelle
- ✅ **Connexion Wasabi** : Upload/download fonctionnels

---

## 🔐 Clés d'Inscription Pré-générées

Le système utilise **30 clés d'inscription uniques** pour contrôler l'accès :

### Clés Professeurs (10)
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

### Clés Élèves (20)
```
ELEVE_2024_E1F2G3    ELEVE_2024_H4I5J6    ELEVE_2024_K7L8M9    ELEVE_2024_N0O1P2
ELEVE_2024_Q3R4S5    ELEVE_2024_T6U7V8    ELEVE_2024_W9X0Y1    ELEVE_2024_Z2A3B4
ELEVE_2024_C5D6E7    ELEVE_2024_F8G9H0    ELEVE_2024_I1J2K3    ELEVE_2024_L4M5N6
ELEVE_2024_O7P8Q9    ELEVE_2024_R0S1T2    ELEVE_2024_U3V4W5    ELEVE_2024_X6Y7Z8
ELEVE_2024_A9B0C1    ELEVE_2024_D2E3F4    ELEVE_2024_G5H6I7    ELEVE_2024_J8K9L0
```

### Test d'Inscription

**Données de test valides :**
```json
{
  "keyValue": "PROF_2024_A1B2C3",
  "email": "test.prof@diagana.com",
  "password": "TestPassword123",
  "nom": "Dupont",
  "prenom": "Jean",
  "matiere": "Mathématiques"
}
```

---

## ⚠️ Dépannage

### Erreurs Courantes

#### Erreur "relation already exists"
```
ERROR: relation "users" already exists
```
**Solution :** La migration a déjà été exécutée, passer au fichier suivant

#### Erreur de contrainte
```
ERROR: constraint "users_email_key" already exists
```
**Solution :** Nettoyer la base et recommencer les migrations

#### Serveur ne démarre pas
```
Error: Port 3000 already in use
```
**Solutions :**
1. Arrêter l'autre processus sur le port 3000
2. Changer la variable `PORT` dans `.env`
3. Vérifier avec `netstat -an | find "3000"`

#### Tests qui échouent
**Causes communes :**
- Variables d'environnement manquantes
- Services Supabase/Wasabi non configurés
- Migrations non exécutées

### Reset Complet (Dernier Recours)

Si vous devez recommencer complètement :

```sql
-- ⚠️ ATTENTION: Cela supprime TOUTES les données !
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
```

Puis ré-exécuter toutes les migrations dans l'ordre.

---

## ✅ Checklist Post-Installation

- [ ] **Node.js 18+** installé
- [ ] **Dépendances backend** installées (`npm install`)
- [ ] **Variables d'environnement** configurées (`.env`)
- [ ] **Compte Supabase** créé et configuré
- [ ] **Compte Wasabi** créé et bucket configuré
- [ ] **4 migrations** exécutées dans l'ordre
- [ ] **15 tables** créées en base
- [ ] **30 clés d'inscription** présentes
- [ ] **Serveur backend** démarre sans erreur
- [ ] **Tests** passent (83/84 minimum)
- [ ] **Pages web** accessibles (auth, home, api)
- [ ] **Inscription test** fonctionne

---

## 🚀 Prochaines Étapes

Une fois l'installation terminée avec succès :

1. **Tester l'inscription** avec une clé professeur
2. **Explorer l'interface** sur http://localhost:3000/home
3. **Consulter la documentation** des modules API
4. **Lire le guide de développement** pour contribuer

---

⚠️ **IMPORTANT - Gestion du serveur :**  
Pour éviter les conflits de port, ne jamais lancer le serveur automatiquement.  
Toujours demander à l'utilisateur de le démarrer manuellement :  
`cd backend && npm run dev`

---

**🎓 Installation Diagana School**  
*Version 1.0 - Août 2025*
