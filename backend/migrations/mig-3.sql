-- Migration 3: Données initiales et clés d'inscription

-- Insertion des 30 clés d'inscription (10 professeurs, 20 élèves)
INSERT INTO registration_keys (key_value, role) VALUES
-- Clés professeurs
('PROF_2024_A1B2C3', 'professeur'),
('PROF_2024_D4E5F6', 'professeur'),
('PROF_2024_G7H8I9', 'professeur'),
('PROF_2024_J0K1L2', 'professeur'),
('PROF_2024_M3N4O5', 'professeur'),
('PROF_2024_P6Q7R8', 'professeur'),
('PROF_2024_S9T0U1', 'professeur'),
('PROF_2024_V2W3X4', 'professeur'),
('PROF_2024_Y5Z6A7', 'professeur'),
('PROF_2024_B8C9D0', 'professeur'),

-- Clés élèves
('ELEVE_2024_E1F2G3', 'eleve'),
('ELEVE_2024_H4I5J6', 'eleve'),
('ELEVE_2024_K7L8M9', 'eleve'),
('ELEVE_2024_N0O1P2', 'eleve'),
('ELEVE_2024_Q3R4S5', 'eleve'),
('ELEVE_2024_T6U7V8', 'eleve'),
('ELEVE_2024_W9X0Y1', 'eleve'),
('ELEVE_2024_Z2A3B4', 'eleve'),
('ELEVE_2024_C5D6E7', 'eleve'),
('ELEVE_2024_F8G9H0', 'eleve'),
('ELEVE_2024_I1J2K3', 'eleve'),
('ELEVE_2024_L4M5N6', 'eleve'),
('ELEVE_2024_O7P8Q9', 'eleve'),
('ELEVE_2024_R0S1T2', 'eleve'),
('ELEVE_2024_U3V4W5', 'eleve'),
('ELEVE_2024_X6Y7Z8', 'eleve'),
('ELEVE_2024_A9B0C1', 'eleve'),
('ELEVE_2024_D2E3F4', 'eleve'),
('ELEVE_2024_G5H6I7', 'eleve'),
('ELEVE_2024_J8K9L0', 'eleve')
ON CONFLICT (key_value) DO NOTHING;

-- Vues utiles pour les statistiques et requêtes fréquentes
CREATE OR REPLACE VIEW user_stats AS
SELECT 
    u.id,
    u.nom,
    u.prenom,
    u.role,
    COUNT(DISTINCT r.id) as ressources_count,
    COUNT(DISTINCT c.id) as collections_count,
    COUNT(DISTINCT l.id) as likes_received,
    COUNT(DISTINCT f1.id) as followers_count,
    COUNT(DISTINCT f2.id) as following_count
FROM users u
LEFT JOIN ressources r ON u.id = r.author_id
LEFT JOIN collections c ON u.id = c.author_id
LEFT JOIN likes l ON r.id = l.ressource_id
LEFT JOIN follows f1 ON u.id = f1.following_id
LEFT JOIN follows f2 ON u.id = f2.follower_id
WHERE u.is_active = true
GROUP BY u.id, u.nom, u.prenom, u.role;

-- Vue pour les ressources populaires
CREATE OR REPLACE VIEW popular_ressources AS
SELECT 
    r.*,
    u.nom as author_nom,
    u.prenom as author_prenom,
    u.role as author_role
FROM ressources r
JOIN users u ON r.author_id = u.id
WHERE r.is_public = true
ORDER BY r.likes_count DESC, r.views_count DESC, r.created_at DESC;

-- Vue pour les collections populaires
CREATE OR REPLACE VIEW popular_collections AS
SELECT 
    c.*,
    u.nom as author_nom,
    u.prenom as author_prenom,
    u.role as author_role
FROM collections c
JOIN users u ON c.author_id = u.id
WHERE c.is_public = true
ORDER BY c.ressources_count DESC, c.created_at DESC;

-- Fonction pour la recherche full-text
CREATE OR REPLACE FUNCTION search_ressources(search_term TEXT)
RETURNS TABLE (
    id UUID,
    titre VARCHAR,
    description TEXT,
    type VARCHAR,
    author_nom VARCHAR,
    author_prenom VARCHAR,
    likes_count INTEGER,
    views_count INTEGER,
    created_at TIMESTAMP,
    rank REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.id,
        r.titre,
        r.description,
        r.type,
        u.nom,
        u.prenom,
        r.likes_count,
        r.views_count,
        r.created_at,
        ts_rank_cd(
            ressources_search_vector(r.titre, r.description, r.tags),
            plainto_tsquery('french', search_term)
        ) as rank
    FROM ressources r
    JOIN users u ON r.author_id = u.id
    WHERE r.is_public = true
    AND (
        ressources_search_vector(r.titre, r.description, r.tags)
        @@ plainto_tsquery('french', search_term)
    )
    ORDER BY rank DESC, r.likes_count DESC;
END;
$$ LANGUAGE plpgsql;

-- Index pour la recherche full-text
-- Note: Index créé avec une fonction immutable
CREATE OR REPLACE FUNCTION ressources_search_vector(titre TEXT, description TEXT, tags TEXT[])
RETURNS tsvector AS $$
BEGIN
    RETURN to_tsvector('french', titre || ' ' || COALESCE(description, '') || ' ' || array_to_string(COALESCE(tags, ARRAY[]::TEXT[]), ' '));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE INDEX IF NOT EXISTS idx_ressources_search 
ON ressources USING GIN(ressources_search_vector(titre, description, tags));