-- Migration 4: Support complet des interactions sur collections
-- Ajout des tables pour likes, favoris et commentaires sur collections

-- Table des likes sur collections
CREATE TABLE IF NOT EXISTS collection_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, collection_id)
);

-- Table des favoris sur collections
CREATE TABLE IF NOT EXISTS collection_favoris (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, collection_id)
);

-- Table des commentaires sur collections
CREATE TABLE IF NOT EXISTS collection_commentaires (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  contenu TEXT NOT NULL CHECK (length(contenu) BETWEEN 1 AND 1000),
  parent_id UUID REFERENCES collection_commentaires(id) ON DELETE CASCADE,
  is_edited BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des vues sur collections
CREATE TABLE IF NOT EXISTS collection_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  ip_address INET,
  user_agent TEXT,
  viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ajout des compteurs manquants dans la table collections
ALTER TABLE collections 
ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS comments_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS views_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS favorites_count INTEGER DEFAULT 0;

-- Fonction pour mettre à jour le compteur de likes sur collections
CREATE OR REPLACE FUNCTION update_collection_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE collections 
        SET likes_count = likes_count + 1 
        WHERE id = NEW.collection_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE collections 
        SET likes_count = likes_count - 1 
        WHERE id = OLD.collection_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Fonction pour mettre à jour le compteur de favoris sur collections
CREATE OR REPLACE FUNCTION update_collection_favorites_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE collections 
        SET favorites_count = favorites_count + 1 
        WHERE id = NEW.collection_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE collections 
        SET favorites_count = favorites_count - 1 
        WHERE id = OLD.collection_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Fonction pour mettre à jour le compteur de commentaires sur collections
CREATE OR REPLACE FUNCTION update_collection_comments_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE collections 
        SET comments_count = comments_count + 1 
        WHERE id = NEW.collection_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE collections 
        SET comments_count = comments_count - 1 
        WHERE id = OLD.collection_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Triggers pour collection_likes
CREATE TRIGGER update_collection_likes_count_insert
    AFTER INSERT ON collection_likes
    FOR EACH ROW EXECUTE FUNCTION update_collection_likes_count();

CREATE TRIGGER update_collection_likes_count_delete
    AFTER DELETE ON collection_likes
    FOR EACH ROW EXECUTE FUNCTION update_collection_likes_count();

-- Triggers pour collection_favoris
CREATE TRIGGER update_collection_favorites_count_insert
    AFTER INSERT ON collection_favoris
    FOR EACH ROW EXECUTE FUNCTION update_collection_favorites_count();

CREATE TRIGGER update_collection_favorites_count_delete
    AFTER DELETE ON collection_favoris
    FOR EACH ROW EXECUTE FUNCTION update_collection_favorites_count();

-- Triggers pour collection_commentaires
CREATE TRIGGER update_collection_comments_count_insert
    AFTER INSERT ON collection_commentaires
    FOR EACH ROW EXECUTE FUNCTION update_collection_comments_count();

CREATE TRIGGER update_collection_comments_count_delete
    AFTER DELETE ON collection_commentaires
    FOR EACH ROW EXECUTE FUNCTION update_collection_comments_count();

-- Trigger pour updated_at sur collection_commentaires
CREATE TRIGGER update_collection_commentaires_updated_at 
    BEFORE UPDATE ON collection_commentaires
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Index pour optimiser les performances
CREATE INDEX IF NOT EXISTS idx_collection_likes_collection ON collection_likes(collection_id);
CREATE INDEX IF NOT EXISTS idx_collection_likes_user ON collection_likes(user_id);

CREATE INDEX IF NOT EXISTS idx_collection_favoris_collection ON collection_favoris(collection_id);
CREATE INDEX IF NOT EXISTS idx_collection_favoris_user ON collection_favoris(user_id);

CREATE INDEX IF NOT EXISTS idx_collection_commentaires_collection ON collection_commentaires(collection_id);
CREATE INDEX IF NOT EXISTS idx_collection_commentaires_author ON collection_commentaires(author_id);
CREATE INDEX IF NOT EXISTS idx_collection_commentaires_parent ON collection_commentaires(parent_id);

CREATE INDEX IF NOT EXISTS idx_collection_views_collection ON collection_views(collection_id);
CREATE INDEX IF NOT EXISTS idx_collection_views_date ON collection_views(viewed_at DESC);

-- Politiques RLS pour les nouvelles tables
ALTER TABLE collection_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_favoris ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_commentaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_views ENABLE ROW LEVEL SECURITY;

-- Politiques pour collection_likes
CREATE POLICY "Lecture des likes sur collections" ON collection_likes
    FOR SELECT USING (true);

CREATE POLICY "Créer ses propres likes sur collections" ON collection_likes
    FOR INSERT WITH CHECK (get_current_user_id() = user_id);

CREATE POLICY "Supprimer ses propres likes sur collections" ON collection_likes
    FOR DELETE USING (get_current_user_id() = user_id);

-- Politiques pour collection_favoris
CREATE POLICY "Lecture des favoris sur collections" ON collection_favoris
    FOR SELECT USING (get_current_user_id() = user_id);

CREATE POLICY "Créer ses propres favoris sur collections" ON collection_favoris
    FOR INSERT WITH CHECK (get_current_user_id() = user_id);

CREATE POLICY "Supprimer ses propres favoris sur collections" ON collection_favoris
    FOR DELETE USING (get_current_user_id() = user_id);

-- Politiques pour collection_commentaires
CREATE POLICY "Lecture des commentaires sur collections publiques" ON collection_commentaires
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM collections c 
            WHERE c.id = collection_commentaires.collection_id 
            AND (c.is_public = true OR c.author_id = get_current_user_id())
        )
    );

CREATE POLICY "Créer des commentaires sur collections accessibles" ON collection_commentaires
    FOR INSERT WITH CHECK (
        get_current_user_id() = author_id AND
        EXISTS (
            SELECT 1 FROM collections c 
            WHERE c.id = collection_commentaires.collection_id 
            AND (c.is_public = true OR c.author_id = get_current_user_id())
        )
    );

CREATE POLICY "Modifier ses propres commentaires sur collections" ON collection_commentaires
    FOR UPDATE USING (get_current_user_id() = author_id);

CREATE POLICY "Supprimer ses propres commentaires sur collections" ON collection_commentaires
    FOR DELETE USING (get_current_user_id() = author_id);

-- Politiques pour collection_views
CREATE POLICY "Créer des vues sur collections accessibles" ON collection_views
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM collections c 
            WHERE c.id = collection_views.collection_id 
            AND (c.is_public = true OR c.author_id = get_current_user_id())
        )
    );

-- Vue actualisée pour les collections populaires
DROP VIEW IF EXISTS popular_collections;
CREATE VIEW popular_collections AS
SELECT 
    c.*,
    u.nom as author_nom,
    u.prenom as author_prenom,
    u.role as author_role,
    (c.likes_count * 3 + c.views_count + c.comments_count * 2 + c.favorites_count * 4) as popularity_score
FROM collections c
JOIN users u ON c.author_id = u.id
WHERE c.is_public = true
ORDER BY popularity_score DESC, c.created_at DESC;

-- Fonction de recherche pour collections
CREATE OR REPLACE FUNCTION collections_search_vector(nom TEXT, description TEXT)
RETURNS tsvector AS $$
BEGIN
    RETURN to_tsvector('french', nom || ' ' || COALESCE(description, ''));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Fonction pour la recherche full-text des collections
CREATE OR REPLACE FUNCTION search_collections(search_term TEXT)
RETURNS TABLE (
    id UUID,
    nom VARCHAR,
    description TEXT,
    author_nom VARCHAR,
    author_prenom VARCHAR,
    likes_count INTEGER,
    views_count INTEGER,
    ressources_count INTEGER,
    created_at TIMESTAMP,
    rank REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.nom,
        c.description,
        u.nom,
        u.prenom,
        c.likes_count,
        c.views_count,
        c.ressources_count,
        c.created_at,
        ts_rank_cd(
            collections_search_vector(c.nom, c.description),
            plainto_tsquery('french', search_term)
        ) as rank
    FROM collections c
    JOIN users u ON c.author_id = u.id
    WHERE c.is_public = true
    AND (
        collections_search_vector(c.nom, c.description)
        @@ plainto_tsquery('french', search_term)
    )
    ORDER BY rank DESC, c.likes_count DESC;
END;
$$ LANGUAGE plpgsql;

-- Index pour la recherche full-text des collections
CREATE INDEX IF NOT EXISTS idx_collections_search 
ON collections USING GIN(collections_search_vector(nom, description));

-- Mise à jour des compteurs existants pour les collections
UPDATE collections SET 
    likes_count = (SELECT COUNT(*) FROM collection_likes WHERE collection_id = collections.id),
    comments_count = (SELECT COUNT(*) FROM collection_commentaires WHERE collection_id = collections.id),
    favorites_count = (SELECT COUNT(*) FROM collection_favoris WHERE collection_id = collections.id),
    views_count = (SELECT COUNT(*) FROM collection_views WHERE collection_id = collections.id)
WHERE id IN (SELECT id FROM collections);

-- Vue mise à jour des statistiques utilisateurs incluant les collections
DROP VIEW IF EXISTS user_stats;
CREATE VIEW user_stats AS
SELECT 
    u.id,
    u.nom,
    u.prenom,
    u.role,
    COALESCE(ressources_stats.ressources_count, 0) as ressources_count,
    COALESCE(ressources_stats.ressources_likes_received, 0) as ressources_likes_received,
    COALESCE(collections_stats.collections_count, 0) as collections_count,
    COALESCE(collections_stats.collections_likes_received, 0) as collections_likes_received,
    COALESCE(social_stats.followers_count, 0) as followers_count,
    COALESCE(social_stats.following_count, 0) as following_count,
    GREATEST(
        COALESCE(ressources_stats.last_ressource_created, u.created_at),
        COALESCE(collections_stats.last_collection_created, u.created_at)
    ) as last_activity
FROM users u

-- Stats ressources
LEFT JOIN (
    SELECT 
        author_id,
        COUNT(*) as ressources_count,
        SUM(likes_count) as ressources_likes_received,
        MAX(created_at) as last_ressource_created
    FROM ressources 
    WHERE is_public = true
    GROUP BY author_id
) ressources_stats ON u.id = ressources_stats.author_id

-- Stats collections  
LEFT JOIN (
    SELECT 
        author_id,
        COUNT(*) as collections_count,
        SUM(likes_count) as collections_likes_received,
        MAX(created_at) as last_collection_created
    FROM collections 
    WHERE is_public = true
    GROUP BY author_id
) collections_stats ON u.id = collections_stats.author_id

-- Stats sociales
LEFT JOIN (
    SELECT 
        u.id,
        COALESCE(followers.count, 0) as followers_count,
        COALESCE(following.count, 0) as following_count
    FROM users u
    LEFT JOIN (
        SELECT following_id, COUNT(*) as count
        FROM follows 
        GROUP BY following_id
    ) followers ON u.id = followers.following_id
    LEFT JOIN (
        SELECT follower_id, COUNT(*) as count  
        FROM follows
        GROUP BY follower_id
    ) following ON u.id = following.follower_id
) social_stats ON u.id = social_stats.id

WHERE u.is_active = true;