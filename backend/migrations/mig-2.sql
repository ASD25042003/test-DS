-- Migration 2: Triggers et fonctions pour maintenir la cohérence des données

-- Fonction pour mettre à jour le timestamp updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ressources_updated_at BEFORE UPDATE ON ressources
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_collections_updated_at BEFORE UPDATE ON collections
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_commentaires_updated_at BEFORE UPDATE ON commentaires
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour mettre à jour le compteur de likes
CREATE OR REPLACE FUNCTION update_likes_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE ressources 
        SET likes_count = likes_count + 1 
        WHERE id = NEW.ressource_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE ressources 
        SET likes_count = likes_count - 1 
        WHERE id = OLD.ressource_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Triggers pour les likes
CREATE TRIGGER update_ressource_likes_count_insert
    AFTER INSERT ON likes
    FOR EACH ROW EXECUTE FUNCTION update_likes_count();

CREATE TRIGGER update_ressource_likes_count_delete
    AFTER DELETE ON likes
    FOR EACH ROW EXECUTE FUNCTION update_likes_count();

-- Fonction pour mettre à jour le compteur de commentaires
CREATE OR REPLACE FUNCTION update_comments_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE ressources 
        SET comments_count = comments_count + 1 
        WHERE id = NEW.ressource_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE ressources 
        SET comments_count = comments_count - 1 
        WHERE id = OLD.ressource_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Triggers pour les commentaires
CREATE TRIGGER update_ressource_comments_count_insert
    AFTER INSERT ON commentaires
    FOR EACH ROW EXECUTE FUNCTION update_comments_count();

CREATE TRIGGER update_ressource_comments_count_delete
    AFTER DELETE ON commentaires
    FOR EACH ROW EXECUTE FUNCTION update_comments_count();

-- Fonction pour mettre à jour le compteur de ressources dans les collections
CREATE OR REPLACE FUNCTION update_collection_ressources_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE collections 
        SET ressources_count = ressources_count + 1 
        WHERE id = NEW.collection_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE collections 
        SET ressources_count = ressources_count - 1 
        WHERE id = OLD.collection_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Triggers pour collection_ressources
CREATE TRIGGER update_collection_ressources_count_insert
    AFTER INSERT ON collection_ressources
    FOR EACH ROW EXECUTE FUNCTION update_collection_ressources_count();

CREATE TRIGGER update_collection_ressources_count_delete
    AFTER DELETE ON collection_ressources
    FOR EACH ROW EXECUTE FUNCTION update_collection_ressources_count();

-- Fonction RLS (Row Level Security) helper
CREATE OR REPLACE FUNCTION get_current_user_id() RETURNS UUID AS $$
  SELECT COALESCE(
    current_setting('request.jwt.claims', true)::json ->> 'sub',
    (current_setting('request.jwt.claims', true)::json ->> 'user_id')
  )::UUID
$$ LANGUAGE SQL STABLE;

-- Activation de RLS sur les tables sensibles
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE ressources ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE commentaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE favoris ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour users
CREATE POLICY "Les utilisateurs peuvent voir tous les profils publics" ON users
    FOR SELECT USING (is_active = true);

CREATE POLICY "Les utilisateurs peuvent modifier leur propre profil" ON users
    FOR UPDATE USING (get_current_user_id() = id);

-- Politiques RLS pour ressources
CREATE POLICY "Tout le monde peut voir les ressources publiques" ON ressources
    FOR SELECT USING (is_public = true);

CREATE POLICY "Les utilisateurs peuvent voir leurs propres ressources" ON ressources
    FOR SELECT USING (get_current_user_id() = author_id);

CREATE POLICY "Les utilisateurs peuvent créer des ressources" ON ressources
    FOR INSERT WITH CHECK (get_current_user_id() = author_id);

CREATE POLICY "Les utilisateurs peuvent modifier leurs ressources" ON ressources
    FOR UPDATE USING (get_current_user_id() = author_id);

CREATE POLICY "Les utilisateurs peuvent supprimer leurs ressources" ON ressources
    FOR DELETE USING (get_current_user_id() = author_id);

-- Politiques RLS pour collections
CREATE POLICY "Tout le monde peut voir les collections publiques" ON collections
    FOR SELECT USING (is_public = true);

CREATE POLICY "Les utilisateurs peuvent voir leurs propres collections" ON collections
    FOR SELECT USING (get_current_user_id() = author_id);

CREATE POLICY "Les utilisateurs peuvent créer des collections" ON collections
    FOR INSERT WITH CHECK (get_current_user_id() = author_id);

CREATE POLICY "Les utilisateurs peuvent modifier leurs collections" ON collections
    FOR UPDATE USING (get_current_user_id() = author_id);

CREATE POLICY "Les utilisateurs peuvent supprimer leurs collections" ON collections
    FOR DELETE USING (get_current_user_id() = author_id);