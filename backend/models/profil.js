const { supabase, supabaseAdmin } = require('../config/supabase');
const logger = require('../utils/logger');

class ProfilModel {
  static async findUserProfile(userId, viewerId = null) {
    try {
      const { data, error } = await supabaseAdmin
        .from('users')
        .select(`
          id,
          nom,
          prenom,
          role,
          avatar_url,
          bio,
          classe,
          matiere,
          created_at,
          last_login,
          ${viewerId ? 'email,' : ''}
          ${viewerId && viewerId !== userId ? '' : 'date_naissance,'}
          followers:follows!follows_following_id_fkey(follower_id),
          following:follows!follows_follower_id_fkey(following_id)
        `)
        .eq('id', userId)
        .eq('is_active', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }

      const isFollowing = viewerId && viewerId !== userId ? 
        data.followers.some(f => f.follower_id === viewerId) : false;

      return {
        ...data,
        followers_count: data.followers.length,
        following_count: data.following.length,
        is_following: isFollowing,
        followers: undefined,
        following: undefined,
        is_own_profile: viewerId === userId
      };
    } catch (error) {
      logger.error('Erreur recherche profil utilisateur:', error);
      throw error;
    }
  }

  static async getUserStats(userId) {
    try {
      const { data, error } = await supabaseAdmin
        .from('user_stats')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return {
            ressources_count: 0,
            collections_count: 0,
            likes_received: 0,
            followers_count: 0,
            following_count: 0
          };
        }
        throw error;
      }

      return data;
    } catch (error) {
      logger.error('Erreur récupération stats utilisateur:', error);
      throw error;
    }
  }

  static async getUserRessources(userId, options = {}) {
    try {
      const {
        page = 1,
        limit = 20,
        type = null,
        matiere = null,
        viewerId = null
      } = options;

      const offset = (page - 1) * limit;

      let query = supabaseAdmin
        .from('ressources')
        .select(`
          id,
          titre,
          description,
          type,
          matiere,
          niveau,
          likes_count,
          views_count,
          created_at,
          is_public,
          users!ressources_author_id_fkey(nom, prenom, role, avatar_url)
        `, { count: 'exact' })
        .eq('author_id', userId);

      if (viewerId !== userId) {
        query = query.eq('is_public', true);
      }

      if (type) query = query.eq('type', type);
      if (matiere) query = query.eq('matiere', matiere);

      query = query
        .order('created_at', { ascending: false })
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
      logger.error('Erreur récupération ressources utilisateur:', error);
      throw error;
    }
  }

  static async getUserCollections(userId, options = {}) {
    try {
      const {
        page = 1,
        limit = 20,
        viewerId = null
      } = options;

      const offset = (page - 1) * limit;

      let query = supabaseAdmin
        .from('collections')
        .select(`
          id,
          nom,
          description,
          ressources_count,
          created_at,
          is_public,
          users!collections_author_id_fkey(nom, prenom, role, avatar_url)
        `, { count: 'exact' })
        .eq('author_id', userId);

      if (viewerId !== userId) {
        query = query.eq('is_public', true);
      }

      query = query
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        collections: data || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          pages: Math.ceil((count || 0) / limit)
        }
      };
    } catch (error) {
      logger.error('Erreur récupération collections utilisateur:', error);
      throw error;
    }
  }

  static async followUser(followerId, followingId) {
    try {
      if (followerId === followingId) {
        throw new Error('Impossible de se suivre soi-même');
      }

      const { data: existing } = await supabaseAdmin
        .from('follows')
        .select('id')
        .eq('follower_id', followerId)
        .eq('following_id', followingId)
        .single();

      if (existing) {
        throw new Error('Vous suivez déjà cet utilisateur');
      }

      const { error } = await supabaseAdmin
        .from('follows')
        .insert({
          follower_id: followerId,
          following_id: followingId
        });

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Erreur suivi utilisateur:', error);
      throw error;
    }
  }

  static async unfollowUser(followerId, followingId) {
    try {
      const { error } = await supabaseAdmin
        .from('follows')
        .delete()
        .eq('follower_id', followerId)
        .eq('following_id', followingId);

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Erreur arrêt suivi utilisateur:', error);
      throw error;
    }
  }

  static async getFollowers(userId, options = {}) {
    try {
      const { page = 1, limit = 20 } = options;
      const offset = (page - 1) * limit;

      const { data, error, count } = await supabaseAdmin
        .from('follows')
        .select(`
          follower_id,
          created_at,
          users!follows_follower_id_fkey(
            id,
            nom,
            prenom,
            role,
            avatar_url
          )
        `, { count: 'exact' })
        .eq('following_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return {
        followers: data?.map(item => ({
          ...item.users,
          followed_at: item.created_at
        })) || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          pages: Math.ceil((count || 0) / limit)
        }
      };
    } catch (error) {
      logger.error('Erreur récupération followers:', error);
      throw error;
    }
  }

  static async getFollowing(userId, options = {}) {
    try {
      const { page = 1, limit = 20 } = options;
      const offset = (page - 1) * limit;

      const { data, error, count } = await supabaseAdmin
        .from('follows')
        .select(`
          following_id,
          created_at,
          users!follows_following_id_fkey(
            id,
            nom,
            prenom,
            role,
            avatar_url
          )
        `, { count: 'exact' })
        .eq('follower_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;

      return {
        following: data?.map(item => ({
          ...item.users,
          followed_at: item.created_at
        })) || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          pages: Math.ceil((count || 0) / limit)
        }
      };
    } catch (error) {
      logger.error('Erreur récupération following:', error);
      throw error;
    }
  }

  static async searchUsers(searchTerm, options = {}) {
    try {
      const { page = 1, limit = 20, role = null } = options;
      const offset = (page - 1) * limit;

      let query = supabaseAdmin
        .from('users')
        .select(`
          id,
          nom,
          prenom,
          role,
          avatar_url,
          classe,
          matiere
        `, { count: 'exact' })
        .eq('is_active', true);

      if (searchTerm) {
        query = query.or(`nom.ilike.%${searchTerm}%,prenom.ilike.%${searchTerm}%`);
      }

      if (role) {
        query = query.eq('role', role);
      }

      query = query
        .order('nom', { ascending: true })
        .range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        users: data || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          pages: Math.ceil((count || 0) / limit)
        }
      };
    } catch (error) {
      logger.error('Erreur recherche utilisateurs:', error);
      throw error;
    }
  }

  static async getActivity(userId, options = {}) {
    try {
      const { page = 1, limit = 20 } = options;
      const offset = (page - 1) * limit;

      const activities = [];

      const [ressources, collections, comments] = await Promise.all([
        supabaseAdmin
          .from('ressources')
          .select('id, titre, created_at, type')
          .eq('author_id', userId)
          .eq('is_public', true)
          .order('created_at', { ascending: false })
          .limit(10),

        supabaseAdmin
          .from('collections')
          .select('id, nom, created_at')
          .eq('author_id', userId)
          .eq('is_public', true)
          .order('created_at', { ascending: false })
          .limit(10),

        supabaseAdmin
          .from('commentaires')
          .select(`
            id, contenu, created_at,
            ressources!commentaires_ressource_id_fkey(id, titre, is_public)
          `)
          .eq('author_id', userId)
          .order('created_at', { ascending: false })
          .limit(10)
      ]);

      if (ressources.data) {
        ressources.data.forEach(r => {
          activities.push({
            type: 'ressource_created',
            id: r.id,
            title: r.titre,
            resource_type: r.type,
            created_at: r.created_at
          });
        });
      }

      if (collections.data) {
        collections.data.forEach(c => {
          activities.push({
            type: 'collection_created',
            id: c.id,
            title: c.nom,
            created_at: c.created_at
          });
        });
      }

      if (comments.data) {
        comments.data.forEach(c => {
          if (c.ressources?.is_public) {
            activities.push({
              type: 'comment_posted',
              id: c.id,
              content: c.contenu.substring(0, 100),
              resource_title: c.ressources.titre,
              resource_id: c.ressources.id,
              created_at: c.created_at
            });
          }
        });
      }

      activities.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      const startIndex = offset;
      const endIndex = offset + limit;
      const paginatedActivities = activities.slice(startIndex, endIndex);

      return {
        activities: paginatedActivities,
        pagination: {
          page,
          limit,
          total: activities.length,
          pages: Math.ceil(activities.length / limit)
        }
      };
    } catch (error) {
      logger.error('Erreur récupération activité utilisateur:', error);
      throw error;
    }
  }
}

module.exports = ProfilModel;