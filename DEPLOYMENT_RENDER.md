# 🚀 Guide de Déploiement Render - Diagana School

## Vue d'Ensemble

Ce guide vous accompagne étape par étape pour déployer Diagana School sur **Render.com**, une plateforme moderne et fiable pour les applications Node.js.

> **Prérequis** : Avoir configuré **Supabase** et **Wasabi S3** (voir [docs/01-GUIDE-INSTALLATION.md](docs/01-GUIDE-INSTALLATION.md))

---

## 🏗️ Préparation Pre-Déploiement

### ✅ Vérifications Obligatoires

**Avant de déployer, vérifiez que :**

- [ ] Les migrations Supabase sont exécutées (4 fichiers dans l'ordre)
- [ ] Le compte Wasabi S3 est configuré avec le bucket `diagana-school-files`
- [ ] Les 30 clés d'inscription sont présentes en base de données
- [ ] Le projet est pushé sur GitHub (branche main/master)
- [ ] Les dossiers `temp/`, `temp-image/`, `test-CAT/` sont ignorés

### 📋 Checklist Fichiers Prêts

- [x] `render.yaml` - Configuration Render
- [x] `backend/.env.example` - Template variables
- [x] `Procfile` - Alternative Heroku
- [x] `.gitignore` - Dossiers sensibles ignorés
- [x] `backend/package.json` - Dépendances définies

---

## 🌐 Étapes de Déploiement sur Render

### 1. Création du Compte et Connexion Repository

1. **Aller sur [render.com](https://render.com)**
2. **S'inscrire** ou se connecter
3. **Connecter GitHub** dans les paramètres
4. **Cliquer "New +"** → **"Web Service"**

### 2. Configuration du Service Web

#### Étape 1 : Repository Selection
```
GitHub Repository: diagana-school
Branch: main (ou master)
```

#### Étape 2 : Service Settings
```
Name: diagana-school          👈 NOM SIMPLE !
Environment: Node
Build Command: cd backend && npm ci
Start Command: cd backend && npm start
```

#### Étape 3 : Instance Type
```
Instance Type: Free (pour tests) ou Starter (pour production)
Region: Frankfurt (EU) - recommandé pour Wasabi eu-west-2
```

### 3. Configuration des Variables d'Environnement

Dans **Environment**, ajouter toutes ces variables :

#### Variables Serveur
```env
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://VOTRE-SERVICE-NAME.onrender.com
```

#### Variables Supabase
```env
SUPABASE_URL=https://votre-project-ref.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> **Comment récupérer les clés Supabase :**
> 1. Aller sur [app.supabase.com](https://app.supabase.com)
> 2. Sélectionner votre projet → **Settings** → **API**
> 3. Copier `URL`, `anon public` et `service_role`

#### Variables Wasabi S3
```env
WASABI_ACCESS_KEY=VOTRE_ACCESS_KEY
WASABI_SECRET_KEY=VOTRE_SECRET_KEY
WASABI_BUCKET=diagana-school-files
WASABI_REGION=eu-west-2
```

> **Comment récupérer les clés Wasabi :**
> 1. Aller sur [console.wasabisys.com](https://console.wasabisys.com)
> 2. **Access Keys** → **Create New Access Key**
> 3. Copier les clés générées

#### Variables JWT et Upload
```env
JWT_SECRET=votre-clé-super-sécurisée-minimum-32-caractères
JWT_EXPIRES_IN=7d
MAX_FILE_SIZE=50MB
ALLOWED_FILE_TYPES=pdf,docx,txt,jpg,jpeg,png,gif,mp4,avi,mov
```

> **Générer une clé JWT sécurisée :**
> ```bash
> # Sur votre machine locale
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

### 4. Déploiement et Vérification

1. **Cliquer "Create Web Service"**
2. **Attendre la construction** (~3-5 minutes)
3. **Vérifier les logs** pour détecter d'éventuelles erreurs
4. **Tester l'URL générée** : `https://votre-service.onrender.com`

---

## 🔍 Tests Post-Déploiement

### Vérifications Essentielles

#### 1. Health Check
```bash
curl https://votre-service.onrender.com/health
```
**Réponse attendue :**
```json
{
  "status": "OK",
  "timestamp": "2025-08-13T19:58:25.000Z",
  "uptime": 42.123
}
```

#### 2. Pages Frontend
- **Accueil** : `https://votre-service.onrender.com/`
- **Authentification** : `https://votre-service.onrender.com/auth`
- **Application SPA** : `https://votre-service.onrender.com/home`

#### 3. Test d'Inscription
Utiliser une clé d'inscription valide :
```json
{
  "keyValue": "PROF_2024_A1B2C3",
  "email": "test@diagana-school.com",
  "password": "TestPassword123",
  "nom": "Test",
  "prenom": "Utilisateur",
  "matiere": "Test"
}
```

### Diagnostic des Erreurs Courantes

#### Erreur 500 au Démarrage
**Cause probable :** Variables d'environnement manquantes
**Solution :**
1. Vérifier toutes les variables dans Dashboard Render
2. Redéployer avec **Manual Deploy**

#### Erreur Base de Données
**Cause probable :** Migrations Supabase non exécutées
**Solution :**
1. Exécuter les 4 migrations dans Supabase SQL Editor
2. Vérifier la présence des 30 clés d'inscription

#### Erreur Upload Fichiers
**Cause probable :** Configuration Wasabi incorrecte
**Solution :**
1. Vérifier les clés d'accès Wasabi
2. Confirmer que le bucket existe en région `eu-west-2`

---

## ⚙️ Configuration Avancée

### Optimisations Production

#### 1. Scaling et Performance
```
Instance Type: Starter ($7/mois)
Auto-scaling: Activé
Health Check: /health (déjà configuré)
```

#### 2. Domaine Personnalisé
1. **Settings** → **Custom Domains**
2. Ajouter votre domaine : `app.votre-domaine.com`
3. Configurer DNS CNAME vers l'URL Render

#### 3. SSL et Sécurité
- **SSL automatique** : Activé par défaut sur Render
- **Headers sécurisés** : Déjà configurés via Helmet
- **CORS** : Automatiquement configuré pour votre domaine

### Variables d'Environnement Avancées

#### Logging et Monitoring
```env
LOG_LEVEL=info
SENTRY_DSN=https://your-sentry-dsn (optionnel)
```

#### Performance
```env
NODE_OPTIONS=--max-old-space-size=1024
```

---

## 🚨 Dépannage

### Logs et Debugging

#### Accès aux Logs
1. Dashboard Render → Votre Service → **Logs**
2. Logs en temps réel disponibles
3. Recherche par mot-clé possible

#### Commandes de Debug Utiles
```bash
# Redéploiement manuel
Manual Deploy (bouton dans Dashboard)

# Vérification variables
curl https://votre-service.onrender.com/api/health

# Test connexion base
# (Les logs montreront les erreurs Supabase)
```

### Solutions aux Problèmes Fréquents

#### Build Failed
```bash
# Erreur: Cannot find module
Solution: Vérifier package.json dans /backend
Build Command: cd backend && npm ci (pas npm install)
```

#### Service Won't Start
```bash
# Port déjà utilisé
Solution: Render gère automatiquement le PORT
Ne pas configurer PORT autre que 3000
```

#### 404 sur Routes Frontend
```bash
# Routes non trouvées
Cause: Express serve les pages depuis /backend
Solution: Vérifier les paths relatifs dans server.js
```

### Support et Contact

**Si vous rencontrez des difficultés :**

1. **Documentation Render** : [docs.render.com](https://docs.render.com)
2. **Support Render** : Via dashboard ou communauté
3. **Logs détaillés** : Toujours disponibles dans l'interface

---

## 📊 Monitoring Post-Déploiement

### Métriques à Surveiller

1. **Uptime** : > 99.5%
2. **Response Time** : < 2 secondes
3. **Memory Usage** : < 80% de l'instance
4. **CPU Usage** : < 70% en continu

### Alertes Recommandées

- **Down Alert** : Service indisponible > 2 minutes
- **Performance Alert** : Response time > 5 secondes
- **Memory Alert** : Usage > 90%

---

## 🎯 Récapitulatif

### ✅ Checklist Finale Déploiement Réussi

- [ ] Service Render créé et configuré
- [ ] 13 variables d'environnement définies
- [ ] Build et déploiement réussis sans erreurs
- [ ] Health check répond OK
- [ ] Pages frontend accessibles
- [ ] Test d'inscription/connexion fonctionnel
- [ ] Upload de fichiers opérationnel
- [ ] Logs sans erreurs critiques

### 🚀 Votre Application en Production

Une fois toutes les étapes complétées :

- **Application accessible** : `https://votre-service.onrender.com`
- **Interface complète** : Authentification + SPA
- **Backend API** : 59 endpoints opérationnels
- **Stockage sécurisé** : Supabase + Wasabi S3
- **Monitoring** : Logs et métriques disponibles

---

**🎓 Diagana School Deployment**  
*Version 1.0 - Production Ready*

**URL de votre service :** À compléter après déploiement  
**Dernière mise à jour :** Août 2025
