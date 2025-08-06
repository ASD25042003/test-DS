# 🎨 Guide UI/UX - Diagana School

## Vue d'ensemble

Ce guide définit l'identité visuelle et l'expérience utilisateur de Diagana School, inspirée du design épuré et artistique d'Anthropic. L'objectif est de créer une interface minimaliste, aérée et raffinée qui favorise la concentration et l'apprentissage.

---

## 🎯 Philosophie Design

### Principes fondamentaux
- **Minimalisme** : Chaque élément a sa raison d'être
- **Clarté** : L'information est hiérarchisée et accessible
- **Élégance** : Sophistication sans complexité
- **Cohérence** : Uniformité dans tous les composants
- **Accessibilité** : Design inclusif et universellement utilisable

### Inspirations clés d'Anthropic
- **Espacement généreux** : Beaucoup d'air entre les éléments
- **Typographie soignée** : Police lisible et moderne
- **Couleurs subtiles** : Palette neutre avec accents délicats  
- **Formes organiques** : Bordures arrondies et courbes douces
- **Animations fluides** : Transitions élégantes et naturelles

---

## 🎨 Palette de couleurs

### Couleurs principales (inspirées Anthropic)

```css
:root {
  /* Tons de beige - Base neutre */
  --color-beige-50: #fefdfb;     /* Blanc cassé */
  --color-beige-100: #f7f5f0;    /* Beige très clair */
  --color-beige-200: #f0ebe0;    /* Beige clair */
  --color-beige-300: #e8ddd0;    /* Beige moyen */
  --color-beige-400: #d4c4a8;    /* Beige soutenu */
  --color-beige-500: #b8a082;    /* Beige foncé */

  /* Accents noirs - Texte et contraste */
  --color-gray-900: #1a1a1a;     /* Noir principal */
  --color-gray-800: #2d2d2d;     /* Gris très foncé */
  --color-gray-700: #404040;     /* Gris foncé */
  --color-gray-600: #525252;     /* Gris moyen */
  --color-gray-500: #737373;     /* Gris clair */
  --color-gray-400: #a3a3a3;     /* Gris très clair */

  /* Couleurs de touches - Accents colorés */
  --color-accent-primary: #d97706;    /* Orange doux */
  --color-accent-secondary: #059669;  /* Vert sauge */
  --color-accent-tertiary: #7c3aed;   /* Violet subtil */
  --color-accent-info: #0ea5e9;       /* Bleu calme */
  --color-accent-warning: #f59e0b;    /* Jaune miel */
  --color-accent-danger: #dc2626;     /* Rouge discret */
}
```

### Usage des couleurs

**Arrière-plans :**
- `beige-50` : Fond principal de l'application
- `beige-100` : Fond des cartes et sections
- `beige-200` : Fond des éléments interactifs au hover

**Textes :**
- `gray-900` : Titres et texte principal
- `gray-700` : Texte secondaire
- `gray-500` : Texte de métadonnées et labels

**Interactions :**
- `accent-primary` : Boutons d'action principale
- `accent-secondary` : Boutons de validation
- `accent-info` : Liens et éléments informationnels

---

## ✍️ Typographie

### Police principale

**Famille :** `Inter` ou `SF Pro Display` (type Anthropic)
```css
font-family: 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
```

### Hiérarchie typographique

```css
/* Titres principaux */
.text-h1 {
  font-size: 2.5rem;      /* 40px */
  font-weight: 700;       /* Bold */
  line-height: 1.2;
  letter-spacing: -0.025em;
  color: var(--color-gray-900);
}

/* Sous-titres */
.text-h2 {
  font-size: 2rem;        /* 32px */
  font-weight: 600;       /* Semi-bold */
  line-height: 1.3;
  letter-spacing: -0.02em;
  color: var(--color-gray-900);
}

/* Titres de section */
.text-h3 {
  font-size: 1.5rem;      /* 24px */
  font-weight: 600;
  line-height: 1.4;
  color: var(--color-gray-800);
}

/* Texte corps */
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

## 🔧 Composants UI

### 1. Cartes (Cards)

**Style Anthropic :** Bordures subtiles, ombres douces, espacement généreux

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

### 2. Boutons

**Style Anthropic :** Formes arrondies, couleurs subtiles, états clairs

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

### 3. Formulaires

**Style Anthropic :** Champs épurés, focus subtil, validation élégante

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

### 4. Navigation

**Style Anthropic :** Navigation épurée, états subtils, hiérarchie claire

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

## 📱 Layout et Espacement

### Grille et conteneurs

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

/* Responsivité */
@media (max-width: 768px) {
  .grid-cols-2,
  .grid-cols-3,
  .grid-cols-4 {
    grid-template-columns: 1fr;
  }
}
```

### Espacements standardisés

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

## 🎭 États et interactions

### Animations et transitions

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
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-in {
  animation: slideIn 0.3s ease-out;
}

/* Hover effects */
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.1);
}

.hover-scale:hover {
  transform: scale(1.02);
}
```

### États de chargement

```css
/* Skeleton loading */
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

## 🌐 Responsive Design

### Breakpoints

```css
/* Mobile first approach */
/* xs: 0px */
/* sm: 640px */
/* md: 768px */
/* lg: 1024px */
/* xl: 1280px */
/* 2xl: 1536px */

/* Styles pour tablette */
@media (min-width: 768px) {
  .container {
    padding: 0 2rem;
  }
  
  .section {
    padding: 4rem 0;
  }
}

/* Styles pour desktop */
@media (min-width: 1024px) {
  .container {
    padding: 0 3rem;
  }
  
  .section {
    padding: 5rem 0;
  }
}
```

---

## 🎨 Composants spécifiques Diagana School

### 1. Resource Card

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
```

### 2. Collection Grid

```css
.collection-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.collection-item {
  background: var(--color-beige-50);
  border: 2px dashed var(--color-beige-300);
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  transition: all 0.2s ease;
  cursor: pointer;
}

.collection-item:hover {
  border-color: var(--color-accent-primary);
  background: rgba(217, 119, 6, 0.02);
}
```

### 3. User Profile

```css
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
}

.user-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  background: var(--color-accent-secondary);
  color: white;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}
```

---

## 🎯 Guidelines d'utilisation

### ✅ À faire
- **Utiliser** les couleurs de la palette définie
- **Respecter** la hiérarchie typographique
- **Maintenir** des espacements cohérents
- **Privilégier** la simplicité et la clarté
- **Tester** l'accessibilité (contraste, focus)

### ❌ À éviter
- **Ne pas** utiliser plus de 3 couleurs d'accent simultanément
- **Ne pas** mélanger différentes familles de polices
- **Ne pas** surcharger l'interface d'éléments
- **Ne pas** oublier les états hover/focus/active
- **Ne pas** négliger la version mobile

---

## 🔍 Exemples d'implémentation

### Page de connexion
```html
<div class="card" style="max-width: 400px; margin: 0 auto;">
  <h1 class="text-h2" style="margin-bottom: 1.5rem;">Connexion</h1>
  
  <div class="form-group">
    <label class="form-label">Email</label>
    <input type="email" class="form-input" placeholder="votre.email@diagana.com">
  </div>
  
  <div class="form-group">
    <label class="form-label">Mot de passe</label>
    <input type="password" class="form-input" placeholder="••••••••">
  </div>
  
  <button class="btn-primary" style="width: 100%;">Se connecter</button>
</div>
```

### Carte ressource
```html
<div class="resource-card">
  <div style="display: flex; justify-content: between; align-items: start; margin-bottom: 1rem;">
    <span class="resource-type-badge">📄 Document</span>
    <span class="text-secondary">Il y a 2 heures</span>
  </div>
  
  <h3 class="text-h3" style="margin-bottom: 0.5rem;">Cours d'algèbre - Niveau 3ème</h3>
  <p class="text-secondary" style="margin-bottom: 1rem;">Introduction aux équations du second degré avec exercices pratiques...</p>
  
  <div style="display: flex; justify-content: between; align-items: center;">
    <div class="user-avatar">JD</div>
    <div style="display: flex; gap: 1rem;">
      <span class="text-secondary">👍 12</span>
      <span class="text-secondary">💬 3</span>
      <span class="text-secondary">👁 89</span>
    </div>
  </div>
</div>
```

---

## 🚀 Implémentation avec Tailwind CSS

Pour utiliser ce guide avec Tailwind CSS, personnaliser le fichier `tailwind.config.js` :

```javascript
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
        }
      },
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '12px',
      }
    }
  }
}
```

---

*Guide UI/UX Diagana School - Inspiré du design Anthropic*  
*Version 1.0 - Août 2025*
