# 🎨 Frontend Diagana School

## Vue d'ensemble

Frontend **SPA (Single Page Application)** modulaire pour Diagana School, utilisant HTML5, CSS3, JavaScript ES6+ et Tailwind CSS. Design inspiré d'Anthropic avec une approche minimaliste et élégante.

---

## 🏗️ Architecture

```
frontend/
├── api/              # Clients API pour communication backend
│   ├── index.js      # Configuration commune (base URL, tokens, intercepteurs)
│   ├── auth.js       # API authentification
│   ├── resources.js  # API ressources
│   ├── collections.js # API collections
│   └── profile.js    # API profils
│
├── components/       # Composants réutilisables par module
│   ├── auth/         # Composants authentification
│   ├── resources/    # Composants ressources
│   ├── collections/  # Composants collections
│   ├── profile/      # Composants profils
│   └── common/       # Composants transversaux
│
├── js/               # Contrôleurs/logique métier par page
│   ├── index.js      # Router SPA + état global
│   ├── auth.js       # Logique authentification
│   ├── home.js       # Logique dashboard
│   ├── resources.js  # Logique ressources
│   ├── collections.js # Logique collections
│   └── profile.js    # Logique profils
│
├── pages/            # Pages HTML principales
│   ├── index.html    # Point d'entrée SPA
│   ├── auth.html     # Page connexion/inscription
│   ├── home.html     # Dashboard principal
│   ├── resources.html # Page ressources
│   ├── collections.html # Page collections
│   └── profile.html  # Page profil
│
└── styles/           # Styles CSS
    └── main.css      # CSS principal avec variables UI/UX
```

---

## 🎯 Philosophie de développement

### Principes techniques
- **Modularité** : Chaque composant est indépendant et réutilisable
- **Séparation** : API / Composants / Logique / Présentation séparés
- **Performance** : Chargement des composants à la demande
- **Maintenabilité** : Code structuré et documenté

### Approche SPA
- **Router** custom dans `js/index.js`
- **État global** centralisé (authentification, utilisateur)
- **Navigation** dynamique sans rechargement
- **Composants** chargés selon la route active

---

## 🎨 Design System

### Inspiration Anthropic
Le design suit les principes d'Anthropic :
- **Minimalisme** élégant
- **Espacement** généreux
- **Typographie** soignée (Inter/SF Pro Display)
- **Couleurs** subtiles (tons beige + accents colorés)
- **Interactions** fluides

### Palette de couleurs
```css
/* Base neutre */
--color-beige-50: #fefdfb;   /* Fond principal */
--color-beige-100: #f7f5f0;  /* Cartes */
--color-beige-200: #f0ebe0;  /* Hover */

/* Accents */
--color-accent-primary: #d97706;   /* Orange principal */
--color-accent-secondary: #059669; /* Vert validation */
--color-accent-info: #0ea5e9;      /* Bleu informatif */
```

Voir [Guide UI/UX complet](../docs/ui-ux-guide.md) pour tous les détails.

---

## 🔧 Stack technique

### Technologies
- **HTML5** : Structure sémantique
- **CSS3** : Variables, Grid, Flexbox, animations
- **JavaScript ES6+** : Modules, Promises, async/await
- **Tailwind CSS** : Framework utilitaire avec config custom

### Aucune dépendance externe
- Pas de React, Vue ou Angular
- Pas de jQuery
- JavaScript vanilla moderne
- Tailwind CSS via CDN

---

## 🚀 Utilisation

### Développement local

1. **Serveur local** (recommandé) :
```bash
# Avec Node.js
npx http-server frontend/ -p 3001

# Avec Python
cd frontend && python -m http.server 3001

# Avec PHP
cd frontend && php -S localhost:3001
```

2. **Ouvrir** : `http://localhost:3001`

### Structure des composants

**Exemple de composant :**
```javascript
// components/resources/resource-card.js
export class ResourceCard {
  constructor(data) {
    this.data = data;
  }

  render() {
    return `
      <div class="card hover-lift">
        <div class="flex justify-between items-start mb-4">
          <span class="resource-type-badge">${this.data.type}</span>
          <span class="text-secondary">${this.formatDate(this.data.created_at)}</span>
        </div>
        
        <h3 class="text-h3 mb-2">${this.data.titre}</h3>
        <p class="text-secondary mb-4">${this.data.description}</p>
        
        <div class="flex justify-between items-center">
          <div class="user-avatar">${this.getUserInitials()}</div>
          <div class="flex gap-4">
            <span class="text-secondary">👍 ${this.data.likes_count}</span>
            <span class="text-secondary">💬 ${this.data.comments_count}</span>
            <span class="text-secondary">👁 ${this.data.views_count}</span>
          </div>
        </div>
      </div>
    `;
  }

  formatDate(date) {
    // Logique formatage date
  }

  getUserInitials() {
    // Logique initiales utilisateur
  }
}
```

### Utilisation des API

**Exemple d'appel API :**
```javascript
// api/resources.js
import { ApiClient } from './index.js';

export class ResourcesApi {
  static async getAll(filters = {}) {
    return ApiClient.get('/api/ressources', { params: filters });
  }

  static async create(data) {
    return ApiClient.post('/api/ressources', data);
  }

  static async like(id) {
    return ApiClient.post(`/api/ressources/${id}/like`);
  }
}
```

### Gestion de l'état

**État global dans index.js :**
```javascript
// js/index.js
export const AppState = {
  user: null,
  token: localStorage.getItem('token'),
  currentRoute: '/',
  
  setUser(userData) {
    this.user = userData;
    this.emit('userChanged', userData);
  },

  logout() {
    this.user = null;
    this.token = null;
    localStorage.removeItem('token');
    this.navigateTo('/auth');
  }
};
```

---

## 📱 Responsive Design

### Breakpoints
- **Mobile** : < 640px
- **Tablet** : 640px - 1024px  
- **Desktop** : > 1024px

### Approche Mobile First
Tous les composants sont conçus mobile d'abord, puis adaptés aux écrans plus grands avec Tailwind CSS :

```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <!-- Cards responsives -->
</div>
```

---

## 🧩 Exemples d'implémentation

### Page de connexion
```html
<!-- pages/auth.html -->
<div class="min-h-screen flex items-center justify-center bg-beige-50">
  <div class="card max-w-md w-full">
    <h1 class="text-h2 text-center mb-6">Connexion</h1>
    <form id="login-form" class="space-y-4">
      <div>
        <label class="block text-gray-800 font-medium mb-2">Email</label>
        <input type="email" class="form-input" placeholder="votre.email@diagana.com" required>
      </div>
      <div>
        <label class="block text-gray-800 font-medium mb-2">Mot de passe</label>
        <input type="password" class="form-input" placeholder="••••••••" required>
      </div>
      <button type="submit" class="btn btn-primary w-full">
        Se connecter
      </button>
    </form>
  </div>
</div>
```

### Card de ressource
```html
<div class="card hover-lift">
  <div class="flex justify-between items-start mb-4">
    <span class="px-3 py-1 bg-accent-primary/10 text-accent-primary rounded-full text-sm font-medium">
      📄 Document
    </span>
    <span class="text-gray-500 text-sm">Il y a 2h</span>
  </div>
  
  <h3 class="text-h3 text-gray-900 mb-2">Cours d'algèbre - Niveau 3ème</h3>
  <p class="text-gray-600 mb-4">Introduction aux équations du second degré...</p>
  
  <div class="flex justify-between items-center">
    <div class="flex items-center gap-2">
      <div class="w-8 h-8 bg-beige-300 rounded-full flex items-center justify-center text-sm font-semibold">
        JD
      </div>
      <span class="text-sm text-gray-600">Jean Dupont</span>
    </div>
    
    <div class="flex items-center gap-4 text-sm text-gray-500">
      <span>👍 12</span>
      <span>💬 3</span>
      <span>👁 89</span>
    </div>
  </div>
</div>
```

---

## 🚦 État d'avancement

### ✅ Créé
- [x] **Architecture** complète du frontend
- [x] **Arborescence** des fichiers et dossiers
- [x] **Guide UI/UX** détaillé inspiré d'Anthropic
- [x] **Configuration** Tailwind CSS personnalisée
- [x] **Variables CSS** et styles de base
- [x] **Pages HTML** squelettes
- [x] **Fichiers JS** squelettes pour chaque module

### 🔄 À développer
- [ ] **Implémentation** des clients API
- [ ] **Développement** des composants
- [ ] **Logique** des contrôleurs
- [ ] **Router** SPA
- [ ] **Gestion d'état** avancée
- [ ] **Tests** frontend
- [ ] **Optimisations** de performance

---

## 📖 Documentation

- **[Guide UI/UX](../docs/ui-ux-guide.md)** : Design system complet
- **[Documentation Backend](../docs/README.md)** : API endpoints
- **[Guide API](../backend/docs/)** : Référence complète des endpoints

---

*Frontend Diagana School - Architecture SPA modulaire*  
*Design inspiré d'Anthropic - Août 2025*
