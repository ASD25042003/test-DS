# 🚀 Guide de Déploiement - Diagana School

## Déploiement sur Render (Recommandé)

### Étape 1 : Prérequis

✅ **Comptes requis :**
- [Render](https://render.com) (gratuit)
- [Supabase](https://supabase.com) (configuré)
- [Wasabi](https://wasabi.com) (configuré)

### Étape 2 : Déploiement automatique

1. **Se connecter à Render**
   - Aller sur [render.com](https://render.com)
   - Se connecter avec GitHub

2. **Créer un nouveau service Web**
   - Cliquer sur "New +"
   - Sélectionner "Web Service"
   - Connecter le repository `diagana-school`

3. **Configuration du service**
   ```
   Name: diagana-school-backend
   Environment: Node
   Build Command: cd backend && npm ci
   Start Command: cd backend && npm start
   ```

### Étape 3 : Variables d'environnement

**Variables obligatoires à configurer dans Render Dashboard :**

```env
# Base
NODE_ENV=production
PORT=3000

# Supabase (récupérer depuis votre projet Supabase)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Wasabi S3 Storage
WASABI_ACCESS_KEY=your-wasabi-access-key
WASABI_SECRET_KEY=your-wasabi-secret-key
WASABI_BUCKET=your-bucket-name
WASABI_REGION=eu-west-2

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRES_IN=7d

# Upload
MAX_FILE_SIZE=50MB
ALLOWED_FILE_TYPES=pdf,docx,txt,jpg,jpeg,png,gif,mp4,avi,mov
```

### Étape 4 : Configuration avancée

**Health Check :**
- Path: `/health`
- Le backend expose automatiquement ce endpoint

**Auto-Deploy :**
- ✅ Activé par défaut
- Chaque push sur `main` déclenche un redéploiement

### Étape 5 : Post-déploiement

1. **Vérifier le déploiement**
   ```bash
   curl https://your-app.onrender.com/health
   # Doit retourner: {"status": "OK", "timestamp": "..."}
   ```

2. **Tester l'API**
   ```bash
   curl https://your-app.onrender.com/api
   # Doit retourner les infos de l'API
   ```

3. **Configurer la base de données manuellement**
   - Aller sur votre dashboard Supabase
   - Exécuter les fichiers SQL dans l'ordre :
     * `backend/migrations/mig-1.sql` (tables principales)
     * `backend/migrations/mig-2.sql` (triggers et fonctions)
     * `backend/migrations/mig-3.sql` (données initiales)
     * `backend/migrations/mig-4.sql` (optimisations)

## 📊 Monitoring

### Logs Render
- Consultables dans le dashboard Render
- Logs temps réel pendant le déploiement

### Métriques
- CPU, Mémoire, Réseau dans Render
- Logs applicatifs avec Winston

### Alertes
- Configurer les notifications Render
- Health check automatique

## 🔧 Maintenance

### Mise à jour
```bash
# Développer localement
git add .
git commit -m "feat: nouvelle fonctionnalité"
git push origin main
# Render redéploie automatiquement
```

### Rollback
```bash
# Dans le dashboard Render
# Aller dans "Deployments" 
# Cliquer "Rollback" sur une version précédente
```

## 🛡️ Sécurité en production

### Variables sensibles
- ❌ **Ne jamais commiter** les vraies variables d'environnement
- ✅ **Utiliser** le système de secrets Render
- ✅ **Vérifier** que `.env` est dans `.gitignore`

### HTTPS
- ✅ **Automatique** avec Render (Let's Encrypt)
- ✅ **Redirection** HTTP vers HTTPS

### Rate Limiting
- ✅ **Configuré** dans le backend (100 req/15min)
- ✅ **Headers** de sécurité avec Helmet

## 📋 Checklist de déploiement

- [ ] Repository GitHub créé et poussé
- [ ] Service Render créé et connecté
- [ ] Variables d'environnement configurées
- [ ] Health check fonctionnel
- [ ] Tests API passent en production
- [ ] Logs de déploiement OK
- [ ] URLs publiques fonctionnelles
- [ ] Performance acceptable (< 2s response time)

## 🆘 Troubleshooting

### Erreur de build
```
# Vérifier les logs dans Render Dashboard
# Problèmes courants:
# - Variables d'environnement manquantes
# - Version Node.js incompatible
# - Dépendances manquantes
```

### Erreur de démarrage
```
# Vérifier:
# - PORT défini
# - SUPABASE_URL accessible
# - JWT_SECRET défini (32+ caractères)
```

### Erreur de base de données
```
# Vérifier:
# - Connexion Supabase
# - Tables créées (run migrations)
# - RLS policies activées
```

## 🔄 Alternatives de déploiement

### Heroku
- Plus cher que Render
- Configuration similaire
- Dynos au lieu de services

### Railway
- Interface similaire à Render
- Pricing compétitif
- Bon pour projets Node.js

### Vercel (pour frontend uniquement)
- Parfait pour le futur frontend
- Intégration GitHub excellente
- CDN global

---

**🎉 Votre backend Diagana School est prêt pour la production !**

L'API sera accessible sur : `https://your-app-name.onrender.com`
