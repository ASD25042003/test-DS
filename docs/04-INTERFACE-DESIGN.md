# 🎨 Interface et Design - Diagana School

## Vue d'ensemble

Ce guide définit l'identité visuelle complète et l'expérience utilisateur de Diagana School, avec réplication exacte de l'interface CAT (École Cheikh Ahmed Tijane) adaptée en architecture SPA moderne.

---

## 🎯 Philosophie de Design

### Principes Fondamentaux

- **Minimalisme épuré** : Chaque élément a sa raison d'être
- **Clarté totale** : L'information est hiérarchisée et accessible
- **Élégance moderne** : Sophistication sans complexité
- **Cohérence absolue** : Uniformité dans tous les composants
- **Accessibilité universelle** : Design inclusif pour tous

### Inspirations Anthropic

- **Espacement généreux** : Beaucoup d'air entre les éléments
- **Typographie soignée** : Police Inter lisible et moderne
- **Couleurs subtiles** : Palette beige/orange avec accents délicats
- **Formes organiques** : Bordures arrondies et courbes douces
- **Animations fluides** : Transitions élégantes et naturelles

---

## 🎨 Palette de Couleurs

### Variables CSS Obligatoires

```css
:root {
  /* Tons de beige - Base neutre inspirée Anthropic */
  --color-beige-50: #fefdfb;     /* Blanc cassé - fond principal */
  --color-beige-100: #f7f5f0;    /* Beige très clair - cartes */
  --color-beige-200: #f0ebe0;    /* Beige clair - bordures */
  --color-beige-300: #e8ddd0;    /* Beige moyen - hover */
  --color-beige-400: #d4c4a8;    /* Beige soutenu */
  --color-beige-500: #b8a082;    /* Beige foncé */

  /* Accents colorés - Diagana */
  --color-accent-primary: #d97706;    /* Orange Diagana principal */
  --color-accent-secondary: #059669;  /* Vert sauge validation */
  --color-accent-tertiary: #7c3aed;   /* Violet subtil */
  --color-accent-info: #0ea5e9;       /* Bleu calme information */
  --color-accent-warning: #f59e0b;    /* Jaune miel avertissement */
  --color-accent-danger: #dc2626;     /* Rouge discret erreur */

  /* Grays - Texte et contraste */
  --color-gray-900: #1a1a1a;     /* Noir principal - titres */
  --color-gray-800: #2d2d2d;     /* Gris très foncé */
  --color-gray-700: #404040;     /* Gris foncé - texte */
  --color-gray-600: #525252;     /* Gris moyen */
  --color-gray-500: #737373;     /* Gris clair - métadonnées */
  --color-gray-400: #a3a3a3;     /* Gris très clair - placeholders */
}
```

### Usage des Couleurs

**Arrière-plans :**
- `beige-50` : Fond principal de l'application
- `beige-100` : Fond des cartes et sections élevées
- `beige-200` : Fond des éléments interactifs au hover
- `beige-300` : Bordures et séparateurs

**Textes :**
- `gray-900` : Titres et texte principal important
- `gray-700` : Texte secondaire courant
- `gray-500` : Métadonnées, labels et informations

**Interactions :**
- `accent-primary` : Boutons d'action principale, liens actifs
- `accent-secondary` : Boutons de validation, succès
- `accent-info` : Liens informationnels, badges neutres
- `accent-warning` : Alertes et avertissements
- `accent-danger` : Erreurs et suppressions

---

## ✍️ Typographie

### Police Principale - Type Anthropic

```css
body {
  font-family: 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  background: var(--color-beige-50);
  color: var(--color-gray-700);
  line-height: 1.6;
}
```

### Hiérarchie Typographique

```css
/* Titres principaux - Pages */
.text-h1 {
  font-size: 2.5rem;      /* 40px */
  font-weight: 700;       /* Bold */
  line-height: 1.2;
  letter-spacing: -0.025em;
  color: var(--color-gray-900);
  margin-bottom: 1rem;
}

/* Sous-titres - Sections */
.text-h2 {
  font-size: 2rem;        /* 32px */
  font-weight: 600;       /* Semi-bold */
  line-height: 1.3;
  letter-spacing: -0.02em;
  color: var(--color-gray-900);
  margin-bottom: 0.75rem;
}

/* Titres de contenu */
.text-h3 {
  font-size: 1.5rem;      /* 24px */
  font-weight: 600;
  line-height: 1.4;
  color: var(--color-gray-800);
  margin-bottom: 0.5rem;
}

/* Texte corps principal */
.text-body {
  font-size: 1rem;        /* 16px */
  font-weight: 400;       /* Regular */
  line-height: 1.6;
  color: var(--color-gray-700);
}

/* Texte secondaire */
.text-secondary {
  font-size: 0.875rem;    /* 14px */
  font-weight: 400;
  line-height: 1.5;
  color: var(--color-gray-500);
}

/* Labels et métadonnées */
.text-label {
  font-size: 0.75rem;     /* 12px */
  font-weight: 500;       /* Medium */
  line-height: 1.4;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-gray-600);
}
```

---

## 🏛️ Interface Référence CAT

### École Cheikh Ahmed Tijane - Réplication Exacte

Le frontend Diagana School doit **répliquer pixel-perfect** l'interface validée de l'École Cheikh Ahmed Tijane située dans `test-CAT/`.

### Contrainte Architecturale

```
❌ Architecture Test CAT (Pages HTML statiques multiples)
test-CAT/
├── index.html           # Landing page statique
├── dashboard.html       # Dashboard page complète
├── resources.html       # Page ressources complète
├── collections.html     # Page collections complète
└── profiles.html        # Page profils complète

✅ Architecture Diagana (SPA Modulaire)
frontend/pages/home.html # Coquille SPA unique
+ modules JavaScript chargés dynamiquement
```

**Objectif :** Transformer l'interface multi-pages CAT en modules SPA tout en **conservant exactement** le même rendu visuel et comportement.

### Pages de Référence Détaillées

#### 1. Dashboard CAT → Module Dashboard

**Référence :** `test-CAT/dashboard.html`
**Target :** `frontend/js/dashboard.js`

**Éléments UI à répliquer :**
- ✅ **Header personnalisé** : "Bonjour [Nom] ! 👋" + avatar utilisateur
- ✅ **Grid statistiques** : 2×2 (mobile) / 4×1 (desktop)
- ✅ **Section ressources récentes** : Cards avec interactions
- ✅ **Sidebar actions** : Boutons d'action + collections populaires
- ✅ **Feed activité** : Notifications sociales temps réel

```html
<!-- Structure Dashboard CAT exacte -->
<main class="max-w-6xl mx-auto px-6 py-8">
  <!-- Header personnalisé -->
  <div class="mb-8 animate-fade-in">
    <div class="flex items-center justify-between mb-2">
      <h1 class="text-3xl font-bold">Bonjour Mohamed ! 👋</h1>
      <div class="user-avatar">MB</div>
    </div>
    <p class="text-gray-500">
      Voici un aperçu de votre activité sur l'École Cheikh Ahmed Tijane
    </p>
  </div>

  <!-- Grid statistiques responsive -->
  <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
    <div class="card stats-card">
      <div class="stats-number">25</div>
      <div class="text-gray-500">Ressources créées</div>
    </div>
    <!-- Répéter pour 4 statistiques -->
  </div>

  <!-- Layout principal: Ressources récentes + Sidebar -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <!-- Ressources récentes (2/3) -->
    <div class="lg:col-span-2">
      <div class="card">
        <div class="card-header">
          <div class="flex justify-between items-center">
            <h2>📁 Ressources récentes</h2>
            <a href="#resources" class="btn-secondary">Voir tout</a>
          </div>
        </div>
        <!-- Resource cards dynamiques -->
      </div>
    </div>
    
    <!-- Sidebar actions (1/3) -->
    <div class="space-y-6">
      <div class="card">
        <h2>⚡ Actions rapides</h2>
        <div class="space-y-3">
          <button class="btn-primary">📄 Nouvelle ressource</button>
          <button class="btn-secondary">📚 Créer une collection</button>
        </div>
      </div>
    </div>
  </div>
</main>
```

#### 2. Resources CAT → Module Resources

**Référence :** `test-CAT/resources.html`
**Target :** `frontend/js/resources.js`

**Éléments UI à répliquer :**
- ✅ **Barre de recherche** responsive avec focus states
- ✅ **Filtres horizontaux** : Pills avec scroll mobile
- ✅ **Dropdown tri** : Par date, popularité, vues
- ✅ **Grid cards** : Layout responsive 1→2→3 colonnes
- ✅ **Resource cards** : Type badges + métadonnées + interactions
- ✅ **FAB upload** : Bouton flottant pour création
- ✅ **Pagination** : Navigation bas de page

```html
<!-- Interface Resources CAT -->
<main class="max-w-6xl mx-auto px-6 py-8">
  <!-- Header avec titre -->
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-3xl font-bold">📁 Ressources pédagogiques</h1>
    <button class="btn-primary">➕ Nouvelle ressource</button>
  </div>

  <!-- Barre de recherche -->
  <div class="relative mb-6">
    <input type="text" 
           class="search-input" 
           placeholder="Rechercher une ressource...">
    <div class="absolute right-3 top-1/2 transform -translate-y-1/2">🔍</div>
  </div>

  <!-- Filtres horizontaux scrollables -->
  <div class="filters-container mb-6">
    <div class="filter-pill active">🔥 Tous</div>
    <div class="filter-pill">📄 Documents</div>
    <div class="filter-pill">🖼️ Images</div>
    <div class="filter-pill">🎥 Vidéos</div>
    <div class="filter-pill">🔗 Liens</div>
    <!-- Filtres matières -->
    <div class="filter-pill">📐 Mathématiques</div>
    <div class="filter-pill">🔬 Sciences</div>
    <div class="filter-pill">📚 Français</div>
  </div>

  <!-- Dropdown tri + résultats count -->
  <div class="flex justify-between items-center mb-6">
    <span class="text-gray-500">247 ressources trouvées</span>
    <select class="sort-dropdown">
      <option>📅 Plus récent</option>
      <option>❤️ Plus aimé</option>
      <option>👁 Plus vu</option>
    </select>
  </div>

  <!-- Grid responsive resources -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
    <!-- Resource cards - structure CAT exacte -->
  </div>

  <!-- Pagination -->
  <div class="flex justify-center">
    <div class="pagination">
      <button class="page-btn">←</button>
      <button class="page-btn active">1</button>
      <button class="page-btn">2</button>
      <button class="page-btn">→</button>
    </div>
  </div>
</main>

<!-- FAB flottant mobile -->
<button class="fab">➕</button>
```

#### 3. Collections CAT → Module Collections

**Référence :** `test-CAT/collections.html`

**Éléments UI à répliquer :**
- ✅ **Header avec actions** : Titre + bouton "Nouvelle collection"
- ✅ **Filtres visibilité** : Public/Privé/Mes collections
- ✅ **Grid collections** : Cards avec prévisualisations
- ✅ **Collection cards** : Miniatures + stats + auteur
- ✅ **États vides** : Messages quand pas de contenu

#### 4. Profiles CAT → Module Profile

**Référence :** `test-CAT/profiles.html`

**Éléments UI à répliquer :**
- ✅ **Grid utilisateurs** : Cards profils avec rôles
- ✅ **Filtres rôles** : Professeurs/Élèves/Tous
- ✅ **Barre recherche** : Recherche utilisateurs
- ✅ **User cards** : Avatar + infos + bouton follow
- ✅ **Stats utilisateur** : Ressources, collections, followers

---

## 🧩 Composants UI Standards

### 1. Cartes (Cards) - Style Anthropic

```css
.card {
  background: var(--color-beige-100);
  border: 1px solid var(--color-beige-200);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.card:hover {
  border-color: var(--color-beige-300);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
}

.card-header {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-beige-200);
}

.card-content {
  color: var(--color-gray-700);
  line-height: 1.6;
}
```

### 2. Boutons - Formes Arrondies Anthropic

```css
/* Bouton principal */
.btn-primary {
  background: var(--color-accent-primary);
  color: white;
  font-weight: 500;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: #b45309;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(217, 119, 6, 0.25);
}

/* Bouton secondaire */
.btn-secondary {
  background: var(--color-beige-200);
  color: var(--color-gray-800);
  font-weight: 500;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: 1px solid var(--color-beige-300);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: var(--color-beige-300);
  border-color: var(--color-beige-400);
}

/* Bouton fantôme */
.btn-ghost {
  background: transparent;
  color: var(--color-gray-700);
  font-weight: 500;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-ghost:hover {
  background: var(--color-beige-100);
  color: var(--color-gray-900);
}
```

### 3. Formulaires - Focus Subtil

```css
.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--color-gray-800);
}

.form-input {
  width: 100%;
  padding: 0.875rem 1rem;
  font-size: 1rem;
  background: var(--color-beige-50);
  border: 1px solid var(--color-beige-300);
  border-radius: 8px;
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-accent-primary);
  background: white;
  box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.1);
}

.form-input::placeholder {
  color: var(--color-gray-400);
}

/* États de validation */
.form-input.error {
  border-color: var(--color-accent-danger);
  background: #fef2f2;
}

.form-input.success {
  border-color: var(--color-accent-secondary);
  background: #f0fdf4;
}
```

### 4. Navigation - Style CAT

```css
.navbar {
  background: rgba(254, 253, 251, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--color-beige-200);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 50;
}

.nav-brand {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-gray-900);
  text-decoration: none;
}

.nav-link {
  color: var(--color-gray-600);
  font-weight: 500;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.nav-link:hover {
  color: var(--color-gray-900);
  background: var(--color-beige-100);
}

.nav-link.active {
  color: var(--color-accent-primary);
  background: rgba(217, 119, 6, 0.1);
}
```

---

## 🧱 Composants Spécialisés Diagana

### 1. Resource Card - Réplication CAT Exacte

```css
.resource-card {
  background: var(--color-beige-100);
  border: 1px solid var(--color-beige-200);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.2s ease;
}

.resource-card:hover {
  border-color: var(--color-accent-primary);
  box-shadow: 0 8px 25px -5px rgba(217, 119, 6, 0.1);
  transform: translateY(-2px);
}

.resource-type-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  background: rgba(217, 119, 6, 0.1);
  color: var(--color-accent-primary);
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
}

.resource-type-badge.document { 
  background: rgba(217, 119, 6, 0.1);
  color: var(--color-accent-primary);
}

.resource-type-badge.media { 
  background: rgba(124, 58, 237, 0.1);
  color: var(--color-accent-tertiary);
}

.resource-type-badge.video { 
  background: rgba(14, 165, 233, 0.1);
  color: var(--color-accent-info);
}

.resource-type-badge.lien { 
  background: rgba(5, 150, 105, 0.1);
  color: var(--color-accent-secondary);
}
```

**Structure Resource Card CAT :**
```html
<div class="resource-card">
  <!-- Header avec badge type + date -->
  <div class="flex justify-between items-start mb-4">
    <span class="resource-type-badge document">📄 Document</span>
    <span class="text-sm text-gray-500">Il y a 2 heures</span>
  </div>
  
  <!-- Titre + description -->
  <h3 class="text-lg font-semibold mb-2">
    Cours d'algèbre - Niveau 3ème
  </h3>
  <p class="text-sm text-gray-500 mb-4">
    Introduction aux équations du second degré avec exercices pratiques...
  </p>
  
  <!-- Footer: auteur + interactions -->
  <div class="flex justify-between items-center">
    <div class="flex items-center space-x-2">
      <div class="user-avatar">MB</div>
      <span class="text-sm text-gray-600">Mohamed Ba</span>
    </div>
    
    <div class="flex space-x-4 text-sm text-gray-500">
      <span>👍 12</span>
      <span>💬 3</span>
      <span>👁 89</span>
    </div>
  </div>
</div>
```

### 2. Collection Card - Avec Prévisualisations

```css
.collection-card {
  background: var(--color-beige-50);
  border: 1px solid var(--color-beige-300);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.2s ease;
}

.collection-card:hover {
  border-color: var(--color-accent-primary);
  box-shadow: 0 6px 20px rgba(217, 119, 6, 0.08);
}

.collection-preview {
  margin-bottom: 1rem;
}

.preview-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  height: 80px;
}

.preview-item {
  background: var(--color-beige-200);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.preview-more {
  background: var(--color-accent-primary);
  color: white;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
}
```

### 3. User Profile Card

```css
.user-card {
  background: var(--color-beige-100);
  border: 1px solid var(--color-beige-200);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.2s ease;
}

.user-avatar {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: var(--color-beige-300);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: var(--color-gray-700);
  margin: 0 auto 1rem;
}

.user-avatar.large {
  width: 4rem;
  height: 4rem;
  font-size: 1.25rem;
}

.user-role-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  margin-bottom: 1rem;
}

.user-role-badge.professeur {
  background: var(--color-accent-secondary);
  color: white;
}

.user-role-badge.eleve {
  background: var(--color-accent-info);
  color: white;
}
```

---

## 📱 Navigation Mobile - Bottom Nav CAT

### Structure Bottom Navigation Exacte

```css
.bottom-nav {
  display: none;
  position: fixed;
  bottom: 1rem;
  left: 1rem;
  right: 1rem;
  background: rgba(254, 253, 251, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid var(--color-beige-200);
  border-radius: 20px;
  padding: 0.75rem 0;
  z-index: 50;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .bottom-nav { 
    display: flex; 
  }
  
  /* Navigation desktop cachée */
  .navbar { 
    display: none; 
  }
  
  /* Padding bottom pour contenu principal */
  main { 
    padding-bottom: 6rem; 
  }
}

.bottom-nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: var(--color-gray-500);
  padding: 0.5rem;
  transition: all 0.2s ease;
}

.bottom-nav-item.active {
  color: var(--color-accent-primary);
}

.bottom-nav-icon {
  font-size: 1.25rem;
  margin-bottom: 0.25rem;
}

.bottom-nav-label {
  font-size: 0.75rem;
  font-weight: 500;
}
```

### Responsive Breakpoints CAT

```css
/* Mobile first approach - Exactement comme CAT */

/* xs: 0px - Très petits écrans */
@media (max-width: 480px) {
  .filter-pill { font-size: 0.75rem; }
  .resource-card { padding: 0.75rem; }
  .stats-grid { grid-template-columns: 1fr; }
}

/* sm: 640px - Mobiles */
@media (max-width: 768px) {
  /* Navigation */
  .navbar { display: none; }
  .bottom-nav { display: flex; }
  
  /* Grids responsive */
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .resources-grid { grid-template-columns: 1fr; }
  
  /* Filtres horizontaux scroll */
  .filters-container {
    overflow-x: auto;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
  }
  
  /* FAB positioning */
  .fab {
    position: fixed;
    bottom: 6rem; /* Au-dessus bottom nav */
    right: 1.5rem;
    z-index: 40;
  }
}

/* md: 768px - Tablettes */
@media (min-width: 768px) {
  .navbar { display: flex; }
  .bottom-nav { display: none; }
  .stats-grid { grid-template-columns: repeat(4, 1fr); }
  .resources-grid { grid-template-columns: repeat(2, 1fr); }
}

/* lg: 1024px - Desktop */
@media (min-width: 1024px) {
  .resources-grid { grid-template-columns: repeat(3, 1fr); }
  .collections-grid { grid-template-columns: repeat(3, 1fr); }
}
```

---

## 🎭 Animations et États

### Transitions Fluides - Style Anthropic

```css
/* Transitions de base */
.transition {
  transition: all 0.2s ease;
}

.transition-fast {
  transition: all 0.15s ease;
}

.transition-slow {
  transition: all 0.3s ease;
}

/* Animations d'entrée */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

/* Hover effects */
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.1);
}

.hover-scale:hover {
  transform: scale(1.02);
}

/* États de chargement */
.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-beige-200) 25%,
    var(--color-beige-300) 50%,
    var(--color-beige-200) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

---

## 📐 Layout et Espacement

### Grille et Conteneurs

```css
/* Container principal */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Sections avec espacement */
.section {
  padding: 3rem 0;
}

.section-sm { padding: 2rem 0; }
.section-lg { padding: 4rem 0; }

/* Grille responsive */
.grid {
  display: grid;
  gap: 1.5rem;
}

.grid-cols-1 { grid-template-columns: 1fr; }
.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
.grid-cols-4 { grid-template-columns: repeat(4, 1fr); }

/* Responsivité automatique */
@media (max-width: 768px) {
  .grid-cols-2,
  .grid-cols-3,
  .grid-cols-4 {
    grid-template-columns: 1fr;
  }
}
```

### Espacements Standardisés

```css
/* Système d'espacement (rem) */
.spacing-xs { gap: 0.5rem; }   /* 8px */
.spacing-sm { gap: 0.75rem; }  /* 12px */
.spacing-md { gap: 1rem; }     /* 16px */
.spacing-lg { gap: 1.5rem; }   /* 24px */
.spacing-xl { gap: 2rem; }     /* 32px */
.spacing-2xl { gap: 3rem; }    /* 48px */
```

---

## 🎨 Configuration Tailwind CSS

### Personnalisation Diagana

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        beige: {
          50: '#fefdfb',
          100: '#f7f5f0',
          200: '#f0ebe0',
          300: '#e8ddd0',
          400: '#d4c4a8',
          500: '#b8a082',
        },
        accent: {
          primary: '#d97706',
          secondary: '#059669',
          tertiary: '#7c3aed',
          info: '#0ea5e9',
          warning: '#f59e0b',
          danger: '#dc2626',
        }
      },
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '12px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      }
    }
  }
}
```

---

## ✅ Guidelines d'Utilisation

### À Faire ✅

- **Utiliser** exclusivement les couleurs de la palette définie
- **Respecter** la hiérarchie typographique Inter
- **Maintenir** des espacements cohérents avec le système
- **Privilégier** la simplicité et clarté avant tout
- **Répliquer** exactement les interfaces CAT
- **Tester** l'accessibilité (contraste WCAG AA)
- **Valider** sur mobile et desktop

### À Éviter ❌

- **Ne pas** utiliser plus de 3 couleurs d'accent simultanément
- **Ne pas** mélanger différentes familles de polices
- **Ne pas** surcharger l'interface d'éléments decoratifs
- **Ne pas** oublier les états hover/focus/active
- **Ne pas** négliger la version mobile (mobile-first)
- **Ne pas** dévier du design CAT sans justification
- **Ne pas** ignorer les animations et transitions

---

## 🧪 Exemples d'Implémentation

### Page d'Authentification

```html
<div class="min-h-screen bg-beige-50 flex items-center justify-center px-6">
  <div class="card max-w-md w-full">
    <h1 class="text-h2 mb-6 text-center">Connexion à Diagana School</h1>
    
    <div class="form-group">
      <label class="form-label">Email</label>
      <input type="email" class="form-input" placeholder="votre.email@diagana.com">
    </div>
    
    <div class="form-group">
      <label class="form-label">Mot de passe</label>
      <input type="password" class="form-input" placeholder="••••••••">
    </div>
    
    <button class="btn-primary w-full">Se connecter</button>
  </div>
</div>
```

### Resource Card Complète

```html
<div class="resource-card">
  <div class="flex justify-between items-start mb-4">
    <span class="resource-type-badge document">📄 Document</span>
    <span class="text-secondary">Il y a 2 heures</span>
  </div>
  
  <h3 class="text-h3 mb-2">Cours d'algèbre - Niveau 3ème</h3>
  <p class="text-secondary mb-4">
    Introduction aux équations du second degré avec exercices pratiques...
  </p>
  
  <div class="flex justify-between items-center">
    <div class="flex items-center space-x-2">
      <div class="user-avatar">MB</div>
      <span class="text-secondary">Mohamed Ba</span>
    </div>
    
    <div class="flex space-x-4 text-secondary">
      <span class="flex items-center">👍 12</span>
      <span class="flex items-center">💬 3</span>
      <span class="flex items-center">👁 89</span>
    </div>
  </div>
</div>
```

---

## 📖 ResourceFullPageViewer - Interface Pleine Page

### Nouveau Composant Optimisé (11 Août 2025)

Le `ResourceFullPageViewer` remplace définitivement l'approche modale pour offrir une expérience de consultation optimale.

#### Design Principles

```css
.resource-fullpage-viewer {
  position: fixed;
  inset: 0;
  background: white;
  z-index: 50;
  overflow: auto;
}

.resource-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: white;
  border-bottom: 1px solid var(--color-beige-200);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.resource-back-button {
  display: flex;
  align-items: center;
  color: var(--color-text-secondary);
  transition: color 0.2s ease;
}

.resource-back-button:hover {
  color: var(--color-text-primary);
}

.resource-content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  max-width: 7xl;
  margin: 0 auto;
  padding: 2rem;
}

@media (max-width: 1024px) {
  .resource-content-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

.resource-document-viewer {
  background: var(--color-beige-50);
  border-radius: 0.5rem;
  overflow: hidden;
}

.resource-document-iframe {
  width: 100%;
  border: none;
  height: 80vh;
  min-height: 600px;
}
```

#### Features UI/UX

- **Navigation intuitive** : Bouton retour proéminent avec icône
- **Grid responsive** : 2/3 contenu + 1/3 sidebar sur desktop
- **Sidebar adaptative** : Stack vertical sur mobile
- **Actions contextuelles** : Toolbar flottante avec interactions
- **Statistiques temps réel** : Mise à jour automatique des compteurs
- **URLs partageables** : Navigation browser native

#### Integration CAT Style

Le composant respecte parfaitement l'identité visuelle CAT avec :
- Palette beige/orange cohérente
- Espacement généreux selon grille 8px
- Typographie Inter harmonisée
- Animations de transition fluides
- États hover/focus accessibles

---

**Ce système de design assure une cohérence visuelle parfaite avec l'interface CAT tout en offrant la flexibilité d'une architecture SPA moderne. Chaque composant respecte les principes Anthropic de simplicité, élégance et accessibilité.**

---

**🎨 Interface et Design Diagana School**  
*Version 1.1 - 11 Août 2025*  
*Réplication fidèle École Cheikh Ahmed Tijane + ResourceFullPageViewer*
