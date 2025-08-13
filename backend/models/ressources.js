const { supabase, supabaseAdmin } = require('../config/supabase');
const logger = require('../utils/logger');

class RessourcesModel {
  static async create(ressourceData) {
    try {
      const { data, error } = await supabaseAdmin
        .from('ressources')
        .insert(ressourceData)
        .select(`
          *,
          users!ressources_author_id_fkey(nom, prenom, role)
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erreur création ressource:', error);
      throw error;
    }
  }

  static async findById(id, userId = null) {
    try {
      let query = supabaseAdmin
        .from('ressources')
        .select(`
          *,
          users!ressources_author_id_fkey(id, nom, prenom, role, avatar_url),
          likes!likes_ressource_id_fkey(user_id),
          favoris!favoris_ressource_id_fkey(user_id)
        `)
        .eq('id', id);

      if (userId) {
        query = query.or(`is_public.eq.true,author_id.eq.${userId}`);
      } else {
        query = query.eq('is_public', true);
      }

      const { data, error } = await query.single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }

      const isLiked = userId ? data.likes.some(like => like.user_id === userId) : false;
      const isFavorited = userId ? data.favoris.some(fav => fav.user_id === userId) : false;

      return {
        ...data,
        is_liked: isLiked,
        is_favorited: isFavorited,
        likes: undefined,
        favoris: undefined
      };
    } catch (error) {
      logger.error('Erreur recherche ressource:', error);
      throw error;
    }
  }

  static async findAll(options = {}) {
    try {
      const {
        page = 1,
        limit = 20,
        type = null,
        matiere = null,
        niveau = null,
        author_id = null,
        search = null,
        tags = null,
        sortBy = 'created_at',
        sortOrder = 'desc',
        userId = null
      } = options;

      const offset = (page - 1) * limit;

      let query = supabaseAdmin
        .from('ressources')
        .select(`
          *,
          users!ressources_author_id_fkey(id, nom, prenom, role, avatar_url)
        `, { count: 'exact' });

      if (userId) {
        query = query.or(`is_public.eq.true,author_id.eq.${userId}`);
      } else {
        query = query.eq('is_public', true);
      }

      if (type) query = query.eq('type', type);
      if (matiere) query = query.eq('matiere', matiere);
      if (niveau) query = query.eq('niveau', niveau);
      if (author_id) query = query.eq('author_id', author_id);
      if (tags && tags.length > 0) {
        query = query.overlaps('tags', tags);
      }

      if (search) {
        query = query.or(`titre.ilike.%${search}%,description.ilike.%${search}%`);
      }

      const validSortFields = ['created_at', 'updated_at', 'likes_count', 'views_count', 'titre'];
      const sortField = validSortFields.includes(sortBy) ? sortBy : 'created_at';
      const order = sortOrder === 'asc' ? { ascending: true } : { ascending: false };

      query = query
        .order(sortField, order)
        .range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        ressources: data || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          pages: Math.ceil((count || 0) / limit)
        }
      };
    } catch (error) {
      logger.error('Erreur récupération ressources:', error);
      throw error;
    }
  }

  static async update(id, updates, userId) {
    try {
      const { data, error } = await supabaseAdmin
        .from('ressources')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('author_id', userId)
        .select(`
          *,
          users!ressources_author_id_fkey(nom, prenom, role)
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erreur mise à jour ressource:', error);
      throw error;
    }
  }

  static async delete(id, userId) {
    try {
      const { error } = await supabaseAdmin
        .from('ressources')
        .delete()
        .eq('id', id)
        .eq('author_id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Erreur suppression ressource:', error);
      throw error;
    }
  }

  static async incrementViews(id, userInfo = {}) {
    try {
      await supabaseAdmin
        .from('resource_views')
        .insert({
          ressource_id: id,
          user_id: userInfo.userId || null,
          ip_address: userInfo.ip || null,
          user_agent: userInfo.userAgent || null
        });

      const { error } = await supabaseAdmin
        .from('ressources')
        .update({ views_count: supabaseAdmin.raw('views_count + 1') })
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Erreur incrémentation vues:', error);
      return false;
    }
  }

  static async incrementDownloads(id) {
    try {
      const { error } = await supabaseAdmin
        .from('ressources')
        .update({ downloads_count: supabaseAdmin.raw('downloads_count + 1') })
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Erreur incrémentation téléchargements:', error);
      return false;
    }
  }

  static async toggleLike(ressourceId, userId) {
    try {
      const { data: existingLike } = await supabaseAdmin
        .from('likes')
        .select('id')
        .eq('ressource_id', ressourceId)
        .eq('user_id', userId)
        .single();

      if (existingLike) {
        const { error } = await supabaseAdmin
          .from('likes')
          .delete()
          .eq('ressource_id', ressourceId)
          .eq('user_id', userId);

        if (error) throw error;
        return { liked: false };
      } else {
        const { error } = await supabaseAdmin
          .from('likes')
          .insert({
            ressource_id: ressourceId,
            user_id: userId
          });

        if (error) throw error;
        return { liked: true };
      }
    } catch (error) {
      logger.error('Erreur toggle like:', error);
      throw error;
    }
  }

  static async toggleFavorite(ressourceId, userId) {
    try {
      const { data: existingFav } = await supabaseAdmin
        .from('favoris')
        .select('id')
        .eq('ressource_id', ressourceId)
        .eq('user_id', userId)
        .single();

      if (existingFav) {
        const { error } = await supabaseAdmin
          .from('favoris')
          .delete()
          .eq('ressource_id', ressourceId)
          .eq('user_id', userId);

        if (error) throw error;
        return { favorited: false };
      } else {
        const { error } = await supabaseAdmin
          .from('favoris')
          .insert({
            ressource_id: ressourceId,
            user_id: userId
          });

        if (error) throw error;
        return { favorited: true };
      }
    } catch (error) {
      logger.error('Erreur toggle favori:', error);
      throw error;
    }
  }

  static async getUserFavorites(userId, options = {}) {
    try {
      const { page = 1, limit = 20 } = options;
      const offset = (page - 1) * limit;

      const { data, error, count } = await supabaseAdmin
        .from('favoris')
        .select(`
          ressource_id,
          created_at,
          ressources!favoris_ressource_id_fkey(
            *,
            users!ressources_author_id_fkey(nom, prenom, role, avatar_url)
          )
        `, { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return {
        ressources: data?.map(item => item.ressources) || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          pages: Math.ceil((count || 0) / limit)
        }
      };
    } catch (error) {
      logger.error('Erreur récupération favoris:', error);
      throw error;
    }
  }

  static async search(searchTerm, options = {}) {
    try {
      const { data, error } = await supabaseAdmin
        .rpc('search_ressources', {
          search_term: searchTerm
        });

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Erreur recherche ressources:', error);
      throw error;
    }
  }

  static async getPopular(limit = 10) {
    try {
      const { data, error } = await supabaseAdmin
        .from('ressources')
        .select(`
          *,
          users!ressources_author_id_fkey(nom, prenom, role, avatar_url)
        `)
        .eq('is_public', true)
        .order('likes_count', { ascending: false })
        .order('views_count', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Erreur récupération ressources populaires:', error);
      throw error;
    }
  }

  static async getRecent(limit = 10) {
    try {
      const { data, error } = await supabaseAdmin
        .from('ressources')
        .select(`
          *,
          users!ressources_author_id_fkey(nom, prenom, role, avatar_url)
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Erreur récupération ressources récentes:', error);
      throw error;
    }
  }

  // Incrémenter les vues (sans restriction d'auteur)
  static async incrementViews(id) {
    try {
      // D'abord récupérer la ressource actuelle
      const { data: ressource, error: fetchError } = await supabaseAdmin
        .from('ressources')
        .select('views_count')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      // Incrémenter et mettre à jour
      const { data, error } = await supabaseAdmin
        .from('ressources')
        .update({
          views_count: (ressource.views_count || 0) + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select(`
          *,
          users!ressources_author_id_fkey(nom, prenom, role)
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erreur incrémentation vues:', error);
      throw error;
    }
  }
}

module.exports = RessourcesModel;