const { supabase, supabaseAdmin } = require('../config/supabase');
const logger = require('../utils/logger');

class CommentairesModel {
  static async create(commentData) {
    try {
      const { data, error } = await supabaseAdmin
        .from('commentaires')
        .insert(commentData)
        .select(`
          *,
          users!commentaires_author_id_fkey(nom, prenom, role, avatar_url)
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erreur création commentaire:', error);
      throw error;
    }
  }

  static async findByRessource(ressourceId, options = {}) {
    try {
      const { page = 1, limit = 20 } = options;
      const offset = (page - 1) * limit;

      const { data, error, count } = await supabaseAdmin
        .from('commentaires')
        .select(`
          *,
          users!commentaires_author_id_fkey(id, nom, prenom, role, avatar_url)
        `, { count: 'exact' })
        .eq('ressource_id', ressourceId)
        .is('parent_id', null)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      const commentsWithReplies = await Promise.all(
        (data || []).map(async (comment) => {
          const { data: replies } = await supabaseAdmin
            .from('commentaires')
            .select(`
              *,
              users!commentaires_author_id_fkey(id, nom, prenom, role, avatar_url)
            `)
            .eq('parent_id', comment.id)
            .order('created_at', { ascending: true });

          return {
            ...comment,
            replies: replies || []
          };
        })
      );

      return {
        commentaires: commentsWithReplies,
        pagination: {
          page,
          limit,
          total: count || 0,
          pages: Math.ceil((count || 0) / limit)
        }
      };
    } catch (error) {
      logger.error('Erreur récupération commentaires:', error);
      throw error;
    }
  }

  static async update(id, updates, userId) {
    try {
      const { data, error } = await supabaseAdmin
        .from('commentaires')
        .update({
          contenu: updates.contenu,
          is_edited: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('author_id', userId)
        .select(`
          *,
          users!commentaires_author_id_fkey(nom, prenom, role, avatar_url)
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erreur mise à jour commentaire:', error);
      throw error;
    }
  }

  static async delete(id, userId) {
    try {
      const { error } = await supabaseAdmin
        .from('commentaires')
        .delete()
        .eq('id', id)
        .eq('author_id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Erreur suppression commentaire:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const { data, error } = await supabaseAdmin
        .from('commentaires')
        .select(`
          *,
          users!commentaires_author_id_fkey(nom, prenom, role, avatar_url)
        `)
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }

      return data;
    } catch (error) {
      logger.error('Erreur recherche commentaire:', error);
      throw error;
    }
  }
}

module.exports = CommentairesModel;