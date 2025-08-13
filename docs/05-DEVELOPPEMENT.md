# ⚙️ Guide de Développement - Diagana School

## Vue d'ensemble

Ce guide rassemble toutes les informations nécessaires pour développer sur le projet Diagana School, incluant les règles, workflows, spécifications techniques et historique des développements.

---

## 🚫 Règles Critiques de Développement

### Gestion du Serveur - Règle Absolue

⚠️ **L'agent de développement ne doit JAMAIS lancer automatiquement le serveur.**

**Pourquoi cette règle ?**
- Éviter les conflits de port avec d'autres services
- Contrôle utilisateur sur l'environnement de développement
- Prévention des erreurs de port déjà utilisé
- Flexibilité dans la configuration des ports

**Procédure à suivre :**
1. **Vérifier** si le serveur est déjà en cours d'exécution
2. **Demander** à l'utilisateur de le démarrer s'il ne l'est pas
3. **Fournir** la commande exacte à exécuter

**Commande standard :**
```bash
cd backend && npm run dev
```

**Messages types à utiliser :**
```
⚠️ Le serveur de développement n'est pas démarré.
Veuillez exécuter cette commande dans un terminal séparé :

cd backend && npm run dev

Puis revenez ici une fois le serveur démarré.
```

### Vérification de l'État du Serveur

**Comment vérifier :**
1. Tentative de requête vers `http://localhost:3000/health`
2. Analyse du code de retour de la commande
3. Message approprié selon l'état

**États possibles :**
- ✅ **Serveur actif** : Procéder avec les tâches
- ❌ **Serveur inactif** : Demander à l'utilisateur de le démarrer
- ⚠️ **Erreur de port** : Suggérer un port alternatif

### Commandes Autorisées/Interdites

**✅ Vérifications lecture seule autorisées :**
```bash
# Vérifier l'état du port 3000
netstat -an | find "3000"

# Ping de health check (si serveur actif)
curl -f http://localhost:3000/health

# Vérifier les processus Node.js
tasklist | find "node"
```

**❌ Commandes interdites :**
```bash
# JAMAIS lancer le serveur automatiquement
npm run dev
npm start
node server.js

# JAMAIS tuer des processus sans autorisation
taskkill /f /im node.exe
```

**✅ Exceptions - Tests et utilitaires :**
```bash
npm test          # ✅ Autorisé - utilise un serveur de test
npm run lint      # ✅ Autorisé
npm run format    # ✅ Autorisé  
npm run migrate   # ✅ Autorisé
```

---

## 📋 Workflow de Développement

### Checklist Avant Chaque Action Nécessitant le Serveur

- [ ] Vérifier l'état du serveur
- [ ] Si inactif → Demander à l'utilisateur de le démarrer
- [ ] Attendre confirmation de l'utilisateur
- [ ] Procéder avec les tâches

### Workflow Recommandé

**1. État Initial**
```
Agent: "Je vais vérifier l'état du serveur..."
[Vérification silencieuse]
```

**2. Si Serveur Inactif**
```
Agent: "Le serveur n'est pas démarré. Veuillez exécuter :
cd backend && npm run dev

Confirmez-moi quand c'est fait."
[Attendre confirmation utilisateur]
```

**3. Confirmation Utilisateur**
```
Utilisateur: "Le serveur est démarré"
Agent: "Parfait ! Je peux maintenant procéder avec..."
```

**4. Procéder avec les Tâches**
```
Agent: [Effectuer les actions nécessaires]
```

---

## 🧩 Spécifications Modules Frontend

### Module Resources - Implémentation Complète

Le module Resources a été **entièrement implémenté** avec tous les composants et fonctionnalités demandés.

#### Architecture Implémentée

```
frontend/components/resources/
├── index.js                    ✅ Export centralisé
├── resource-card.js            ✅ Carte ressource (style test-CAT)
├── search-filters.js           ✅ Barre recherche + filtres horizontaux
├── resource-list.js              ✅ Liste paginée avec cartes
├── upload-form.js                ✅ Formulaire modal d'upload
├── resource-fullpage-viewer.js   ✅ Composant pleine page optimisé
└── tests/
    └── components-test.html    ✅ Page de tests complète

frontend/js/
└── resources-controller.js    ✅ Contrôleur principal
```

#### ResourceFullPageViewer - Composant Pleine Page Optimisé

**Complètement refondu** (11 Août 2025) - Remplace définitivement l'approche modale par une interface pleine page native.

**Améliorations clés :**
- 🎯 **URLs partageables** : `/home#resources/view/{id}`
- 🔄 **Navigation retour** fluide vers la liste
- 📱 **Responsive optimisé** pour consultation mobile
- 🔧 **CSP compatible** pour affichage PDFs et iframes
- ⚡ **Performance améliorée** avec chargement progressif

**Fonctionnalités :**
- ✅ **Affichage pleine page** avec header de navigation
- ✅ **Support tous types** : document, media, video, lien
- ✅ **PDFs optimisés** : affichage 80vh avec toolbar natif
- ✅ **Actions intégrées** : like, favori, téléchargement, partage
- ✅ **Statistiques temps réel** mises à jour automatiquement
- ✅ **Navigation intuitive** avec bouton retour prominent
- ✅ **URLs longue durée** (12 mois Wasabi)
- ✅ **Responsive** mobile et desktop

**Usage du ResourceFullPageViewer :**
```javascript
const viewer = new ResourceFullPageViewer('#container', {
    onBack: () => history.pushState({}, '', '/home#resources'),
    onLike: (id) => api.toggleLike(id),
    onDownload: (id) => api.download(id)
});
viewer.showResource(resource, isOwner);
```

#### ResourcesController - Orchestrateur Complet

**Responsabilités :**
- ✅ **Initialisation** de tous les composants
- ✅ **Gestion d'état** centralisée (filtres, pagination)
- ✅ **Cache intelligent** avec expiration (5min)
- ✅ **Interactions utilisateur** (like, favori, partage)
- ✅ **Navigation** et gestion d'historique
- ✅ **Raccourcis clavier** globaux
- ✅ **Notifications** système
- ✅ **Responsive** automatique
- ✅ **Lazy loading** et pagination

**API du contrôleur :**
```javascript
const controller = new ResourcesController();

// Méthodes principales
controller.loadResources();
controller.showUploadForm();
controller.goToPage(2);
controller.handleResourceClick(resourceId);
```

#### Page de Tests Complète

**Page interactive :** `frontend/components/resources/tests/components-test.html`

**Sections de test :**
- ✅ **ResourceCard** - Test affichage selon types et états
- ✅ **SearchFilters** - Test recherche et filtres
- ✅ **ResourcesList** - Test pagination et layouts
- ✅ **UploadForm** - Test validation et upload
- ✅ **ResourceFullPageViewer** - Test viewer pleine page optimisé
- ✅ **Intégration** - Test workflow complet
- ✅ **Performance** - Benchmarks et mémoire

**Fonctionnalités :**
- 🎛️ **Contrôles interactifs** pour tester tous les cas
- 📊 **Console de debug** avec logs en temps réel
- 🔗 **Vérification backend** automatique
- 📱 **Tests responsive** intégrés
- ⚡ **Benchmarks performance**

### Utilisation Module Resources

#### 1. Intégration dans une page

```html
<!DOCTYPE html>
<html>
<head>
    <!-- Styles CSS requis -->
    <link href="/static/styles/main.css" rel="stylesheet">
</head>
<body>
    <!-- Containers pour les composants -->
    <div id="resources-filters"></div>
    <div id="resources-stats"></div>
    <div id="resources-list"></div>
    <div id="resources-pagination"></div>
    
    <!-- FAB pour ajouter ressource -->
    <div class="fab" id="resources-fab">➕</div>

    <!-- Script d'initialisation -->
    <script type="module">
        import ResourcesController from '/static/js/resources-controller.js';
        
        // Initialisation automatique
        const resourcesController = new ResourcesController();
    </script>
</body>
</html>
```

#### 2. Test des composants

```bash
# Démarrer le serveur
cd backend
npm run dev

# Ouvrir la page de tests
http://localhost:3000/static/components/resources/tests/components-test.html
```

#### 3. Intégration avec l'API

Le contrôleur utilise automatiquement les clients API existants :
- `resourcesApi` pour les opérations CRUD
- `authApi` pour l'authentification
- `commentsApi` pour les commentaires

---

## 🏗️ Architecture SPA - Implémentée

### Page Home - Coquille Principale

**Fichier :** `frontend/pages/home.html`
- ✅ **Structure HTML** complète avec conteneurs navigation
- ✅ **Styles CSS intégrés** reprenant exactement test-DS
- ✅ **Navigation responsive** (desktop + mobile + bottom nav)
- ✅ **Conteneur SPA** `#app-content` pour modules dynamiques
- ✅ **Scripts d'initialisation** navigations.js + home.js

### Orchestrateur SPA

**Fichier :** `frontend/js/home.js`
```javascript
class DiaganaApp {
    // Orchestrateur principal du système SPA
    constructor() {
        this.modules = {
            dashboard: () => import('/static/js/dashboard.js'),
            resources: () => import('/static/js/resources.js'),
            collections: () => import('/static/js/collections.js'),
            profile: () => import('/static/js/profile.js')
        };
    }
}
```

**Fonctionnalités implémentées :**
- ✅ **Routage par hash** (#dashboard, #resources, #collections, #profile)
- ✅ **Chargement dynamique** des modules sans rechargement page
- ✅ **Navigation par défaut** générée basée sur test-DS
- ✅ **Dashboard par défaut** identique au design test-DS
- ✅ **Intégration données utilisateur** depuis authentification
- ✅ **Gestion états** (loading, navigation active)

### Système Navigation Modulaire

**Structure complète :**
```
frontend/components/navigations/
├── index.js           # Point d'entrée avec exports
├── navbar-des.js      # Navigation desktop 
└── navbar-mob.js      # Navigation mobile (sidebar + bottom)
```

**Navigation Desktop :**
- ✅ Hamburger menu + Brand + Links + User profile
- ✅ Design identique à test-DS avec données utilisateur dynamiques

**Navigation Mobile :**
- ✅ **Sidebar overlay** avec profil utilisateur et navigation
- ✅ **Bottom navigation** avec icônes et labels
- ✅ **Responsive** avec fermeture automatique

### Gestionnaire Navigation Global

**Fichier :** `frontend/js/navigations.js`
```javascript
class NavigationManager {
    // Gestion globale de la navigation avec compatibilité test-DS
    init() {
        this.bindEvents();
        this.setupResponsiveHandlers();
    }
}
```

**Fonctionnalités avancées :**
- ✅ **Événements globaux** (click, hashchange, resize, keydown)
- ✅ **Compatibilité test-DS** (fonctions globales toggleMobileMenu, closeMobileMenu)
- ✅ **Gestion responsive** (fermeture auto sur resize)
- ✅ **Animations scroll** et smooth scroll
- ✅ **Intégration SPA** avec délégation à DiaganaApp

---

## 📊 États des Modules Frontend

| Module | Statut | Niveau de Développement |
|--------|--------|------------------------|
| **Authentication** | ✅ **Complet** | Page dédiée + validation complète |
| **Dashboard** | ✅ **Opérationnel** | Interface + statistiques + navigation |
| **Resources** | ✅ **Architecture complète** | Composants modulaires + API + demo |
| **Collections** | 🔨 **Placeholder simple** | Message "en développement" |
| **Profils** | 🔨 **Placeholder simple** | Message "en développement" |

### Modules à Finaliser

**Collections et Profils** nécessitent le développement de :
- Interface de gestion collections thématiques  
- Annuaire utilisateurs et profils détaillés
- Intégration complète avec les clients API existants

---

## 🔧 Historique Sessions de Développement

### Session d'Implémentation Frontend - 9 Août 2025

**Objectif :** Implémentation complète du frontend Diagana School avec interface répliquant test-CAT

#### Instructions Reçues
1. **Commencer par lire toute la documentation** pour comprendre le contexte
2. **Analyser et comprendre test-CAT** comme référence de design
3. **Implémenter frontend complet** :
   - `frontend/pages/index.html` - Page d'accueil
   - `frontend/pages/home.html` - Application SPA
   - `frontend/styles/main.css` - Design system complet
   - `frontend/js/home.js` - Orchestrateur SPA
   - `frontend/components/navigations/` - Navigation modulaire
   - `frontend/js/navigations.js` - Gestionnaire navigation
4. **Implémenter placeholders** dans les contrôleurs des modules avec message "modules en développement"
5. **Faire todo liste et effectuer toutes les tâches**

#### Tâches Accomplies ✅

1. **✅ Documentation analysée** - Lecture complète de README.md, frontend/api/README.md et dossier docs
2. **✅ Interface test-CAT étudiée** - Analyse complète des fichiers de référence dans test-CAT/
3. **✅ Page d'accueil** - frontend/pages/index.html avec design CAT répliqué
4. **✅ Page SPA principale** - frontend/pages/home.html comme coquille pour l'application
5. **✅ CSS complet** - frontend/styles/main.css avec design system CAT exact
6. **✅ Orchestrateur SPA** - frontend/js/home.js avec gestion des modules dynamiques
7. **✅ Composants navigation** - Réplication exacte navigation desktop/mobile CAT
8. **✅ Gestionnaire navigation** - frontend/js/navigations.js avec routage SPA
9. **✅ Module Dashboard fonctionnel** - Avec données de démo et API backend intégrée

#### Architecture Implémentée

```
frontend/
├── pages/
│   ├── index.html      # Landing page (réplique CAT)
│   └── home.html       # SPA principale
├── styles/
│   └── main.css        # Design system complet CAT
├── js/
│   ├── home.js         # Orchestrateur SPA
│   ├── navigations.js  # Gestionnaire navigation
│   └── dashboard.js    # Module Dashboard fonctionnel
└── components/
    └── navigations/    # Navigation desktop/mobile
```

#### Fonctionnalités Clés Réalisées

- **Interface pixel-perfect** répliquant test-CAT
- **Navigation SPA** avec modules dynamiques
- **Responsive mobile-first** avec bottom nav
- **Dashboard opérationnel** avec données réelles/démo
- **Architecture modulaire** pour évolutions futures
- **Compatibilité backend** avec API existante
- **Design system cohérent** avec variables CSS CAT

#### Résultat Final

**Le frontend est maintenant opérationnel et accessible via :**
- **Landing :** http://localhost:3000/
- **SPA Dashboard :** http://localhost:3000/home
- **Authentification :** http://localhost:3000/auth

L'application charge automatiquement les modules et affiche des placeholders "en développement" avec données de démonstration pour les modules non encore implémentés, tout en conservant l'interface exacte de test-CAT.

---

## 🔧 Corrections Frontend Critiques

### 1. Problème Boucle de Redirection ✅

**Cause :** Détection de page auth incorrecte  
```javascript
// ❌ AVANT
isOnAuthPage() {
    return window.location.pathname.includes('auth.html');
}

// ✅ APRÈS  
isOnAuthPage() {
    return window.location.pathname === '/auth';
}
```

### 2. Erreur 400 Bad Request ✅

**Cause :** Noms de champs API incorrects
```javascript
// ❌ AVANT - Incompatible backend
{ registrationKey, firstName, lastName }

// ✅ APRÈS - Compatible backend  
{ keyValue, prenom, nom }
```

### 3. Caractères Corrompus UTF-8 ✅  

**Cause :** Encodage défaillant lors de l'édition
```javascript
// ❌ AVANT
"📚 Diagana School"
"Votre plateforme éducative moderne"

// ✅ APRÈS
"📚 Diagana School"  
"Votre plateforme éducative moderne"
```

### 4. Validation Mot de Passe ✅

**Amélioration :** Validation selon règles backend exactes
```javascript
// Backend exige : min 8 chars, 1 min, 1 maj, 1 chiffre  
const hasMinLength = password.length >= 8;
const hasLowerCase = /[a-z]/.test(password);
const hasUpperCase = /[A-Z]/.test(password);  
const hasNumber = /\d/.test(password);
```

---

## 🌐 Guidelines Encodage UTF-8

### ⚠️ Règles Obligatoires

**POUR LES DÉVELOPPEURS ET AGENTS IA :**

#### 🚨 Règles Critiques
- **TOUJOURS** utiliser l'encodage **UTF-8** pour tous les fichiers
- **JAMAIS** créer ou éditer de fichiers avec un encodage différent
- **TOUJOURS** vérifier l'encodage avant de commiter du code
- **IMMÉDIATEMENT** corriger tout caractère corrompu détecté

#### ✅ Bonnes Pratiques

```bash
# Vérifier l'encodage d'un fichier (PowerShell)
Get-Content "fichier.js" -Encoding UTF8

# Sauvegarder avec encodage UTF-8 explicite
$content | Set-Content "fichier.js" -Encoding UTF8

# Rechercher des caractères corrompus
Select-String -Pattern "�|ﾟ|=ﾟ|<ﾟ" -Path "*.js,*.html,*.css" -Recurse
```

#### 🔍 Caractères à Éviter/Corriger

| Caractère Corrompu | Remplacement Correct | Usage |
|--------------------|---------------------|-------|
| `�` | `é`, `è`, `à`, `ç` | Accents français |
| `ﾟ` | `é`, `è`, `à`, etc. | Caractères accentués |
| `=e` | `👥` | Icône utilisateurs |
| `=ﾟ` | `🚀`, `📚`, `📁` | Icônes contextuelles |
| `<ﾟ` | `🎯`, `📊` | Icônes spéciales |

#### 📋 Checklist Avant Commit

- [ ] Tous les fichiers sont en UTF-8
- [ ] Aucun caractère `�` présent
- [ ] Accents français corrects (`é`, `è`, `à`, `ç`)
- [ ] Icônes fonctionnelles (pas de caractères corrompus)
- [ ] Tests d'affichage réussis

#### 🚫 Erreurs Courantes
- Copier-coller depuis des sources avec encodage différent
- Utiliser des éditeurs sans support UTF-8 correct
- Mixer des encodages dans un même projet
- Ignorer les avertissements d'encodage de Git

#### 🆘 Réparation d'Urgence

Si des caractères corrompus sont détectés :

1. **Identifier** les fichiers affectés
2. **Corriger** selon le tableau ci-dessus
3. **Sauvegarder** en UTF-8 explicite
4. **Vérifier** l'affichage dans le navigateur
5. **Tester** la fonctionnalité

---

## 🧪 Optimisations Performance

### Frontend

**Chargement :**
- Lazy loading des modules SPA ✅
- Dynamic imports ES6 ✅
- Compression des assets (prévu)
- Minification CSS/JS (prévu)

**UX :**
- Loading states et skeletons ✅
- Transitions fluides ✅
- Responsive mobile-first ✅
- Progressive enhancement ✅

### Améliorations UX Prévues

- **Progressive Web App** (PWA)
- **Mode hors-ligne** avec cache
- **Notifications push** pour les interactions
- **Thème sombre** avec préférences utilisateur
- **Raccourcis clavier** pour power users

---

## 💡 Évolutions Prévues

### Court Terme
- Finalisation modules Collections et Profils
- Tests frontend automatisés
- Optimisations mobile identifiées
- Métriques applicatives

### Moyen Terme  
- Notifications temps réel (WebSocket)
- PWA avec mode hors-ligne
- Cache intelligent avec Redis
- Recommandations personnalisées par IA

### Long Terme
- Multi-établissements avec gestion centralisée
- Intégrations LMS (Moodle, Google Classroom)
- IA générative pour contenus pédagogiques
- Microservices si nécessaire
- Internationalisation multi-langues

---

## 🤝 Guidelines pour Contributeurs

### Workflow Standard

1. **Fork** du projet
2. **Branche** feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. **Commit** (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. **Push** (`git push origin feature/nouvelle-fonctionnalite`)
5. **Pull Request** avec description détaillée

### Code Review

- **Vérifier** l'encodage UTF-8 de tous les fichiers
- **Tester** les fonctionnalités sur mobile et desktop
- **Respecter** les guidelines de design CAT
- **Maintenir** la cohérence architecturale
- **Documenter** les changements significatifs

### Testing

- **Lancer** tous les tests backend (83/84 minimum)
- **Vérifier** les clients API frontend
- **Tester** l'intégration SPA
- **Valider** l'accessibilité et performance

---

## 📞 Support et Ressources

### Documentation Référence
- **Architecture** : [02-ARCHITECTURE.md](02-ARCHITECTURE.md)
- **Modules API** : [03-MODULES-API.md](03-MODULES-API.md)
- **Interface Design** : [04-INTERFACE-DESIGN.md](04-INTERFACE-DESIGN.md)
- **Tests et Validation** : [06-TESTS-VALIDATION.md](06-TESTS-VALIDATION.md)

### Commandes Utiles
```bash
# Tests
npm test                    # Suite complète
npm test -- --coverage     # Avec couverture
npm test -- --watch        # Mode watch

# Développement
npm run dev                 # Serveur développement
npm start                   # Serveur production
npm run lint                # Vérification code
```

### Débogage

**Vérification serveur :**
```bash
# Vérifier le port 3000
netstat -an | find "3000"

# Tester l'API
curl http://localhost:3000/health

# Logs en temps réel
Get-Content backend/logs/info/combined-$(Get-Date -Format 'yyyy-MM-dd').log -Wait
```

---

**Ce guide de développement centralise toutes les informations nécessaires pour maintenir la qualité et la cohérence du projet Diagana School, en respectant les règles critiques et les bonnes pratiques établies.**

---

**⚙️ Guide de Développement Diagana School**  
*Version 1.0 - Août 2025*  
*Consolidation complète des guidelines et spécifications*
