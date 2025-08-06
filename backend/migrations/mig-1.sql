-- Migration 1: Tables principales du système
-- Création des tables users, registration_keys, ressources, collections, et tables de liaison

-- Table des clés d'inscription
CREATE TABLE IF NOT EXISTS registration_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key_value VARCHAR(50) UNIQUE NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('professeur', 'eleve')),
  is_used BOOLEAN DEFAULT FALSE,
  used_by UUID REFERENCES auth.users(id),
  used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des utilisateurs étendus
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('professeur', 'eleve')),
  avatar_url TEXT,
  bio TEXT,
  date_naissance DATE,
  classe VARCHAR(50),
  matiere VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des ressources
CREATE TABLE IF NOT EXISTS ressources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titre VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50) NOT NULL CHECK (type IN ('document', 'media', 'video', 'lien')),
  contenu JSONB NOT NULL,
  tags TEXT[],
  matiere VARCHAR(100),
  niveau VARCHAR(50),
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_public BOOLEAN DEFAULT TRUE,
  likes_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  downloads_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des collections
CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom VARCHAR(255) NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT TRUE,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ressources_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table de liaison collections-ressources
CREATE TABLE IF NOT EXISTS collection_ressources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  ressource_id UUID NOT NULL REFERENCES ressources(id) ON DELETE CASCADE,
  ordre INTEGER DEFAULT 0,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(collection_id, ressource_id)
);

-- Table des likes
CREATE TABLE IF NOT EXISTS likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ressource_id UUID NOT NULL REFERENCES ressources(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, ressource_id)
);

-- Table des favoris
CREATE TABLE IF NOT EXISTS favoris (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ressource_id UUID NOT NULL REFERENCES ressources(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, ressource_id)
);

-- Table des commentaires
CREATE TABLE IF NOT EXISTS commentaires (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ressource_id UUID NOT NULL REFERENCES ressources(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  contenu TEXT NOT NULL,
  parent_id UUID REFERENCES commentaires(id) ON DELETE CASCADE,
  is_edited BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des suivis entre utilisateurs
CREATE TABLE IF NOT EXISTS follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(follower_id, following_id),
  CHECK(follower_id != following_id)
);

-- Table des statistiques de consultation
CREATE TABLE IF NOT EXISTS resource_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ressource_id UUID NOT NULL REFERENCES ressources(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  ip_address INET,
  user_agent TEXT,
  viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_ressources_author ON ressources(author_id);
CREATE INDEX IF NOT EXISTS idx_ressources_type ON ressources(type);
CREATE INDEX IF NOT EXISTS idx_ressources_public ON ressources(is_public);
CREATE INDEX IF NOT EXISTS idx_ressources_created ON ressources(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ressources_tags ON ressources USING GIN(tags);

CREATE INDEX IF NOT EXISTS idx_collections_author ON collections(author_id);
CREATE INDEX IF NOT EXISTS idx_collections_public ON collections(is_public);

CREATE INDEX IF NOT EXISTS idx_likes_ressource ON likes(ressource_id);
CREATE INDEX IF NOT EXISTS idx_favoris_user ON favoris(user_id);
CREATE INDEX IF NOT EXISTS idx_commentaires_ressource ON commentaires(ressource_id);
CREATE INDEX IF NOT EXISTS idx_follows_follower ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following ON follows(following_id);

CREATE INDEX IF NOT EXISTS idx_resource_views_ressource ON resource_views(ressource_id);
CREATE INDEX IF NOT EXISTS idx_resource_views_date ON resource_views(viewed_at DESC);