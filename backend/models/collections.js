const { supabase, supabaseAdmin } = require('../config/supabase');
const logger = require('../utils/logger');

class CollectionsModel {
  static async create(collectionData) {
    try {
      const { data, error } = await supabaseAdmin
        .from('collections')
        .insert(collectionData)
        .select(`
          *,
          users!collections_author_id_fkey(nom, prenom, role, avatar_url)
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erreur création collection:', error);
      throw error;
    }
  }

  static async findById(id, userId = null) {
    try {
      let query = supabaseAdmin
        .from('collections')
        .select(`
          *,
          users!collections_author_id_fkey(id, nom, prenom, role, avatar_url),
          collection_ressources(
            ordre,
            ressources(
              id,
              titre,
              description,
              type,
              contenu,
              tags,
              matiere,
              niveau,
              likes_count,
              views_count,
              created_at,
              users!ressources_author_id_fkey(nom, prenom, role, avatar_url)
            )
          )
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

      const ressources = data.collection_ressources
        .sort((a, b) => a.ordre - b.ordre)
        .map(cr => cr.ressources);

      return {
        ...data,
        ressources,
        collection_ressources: undefined
      };
    } catch (error) {
      logger.error('Erreur recherche collection:', error);
      throw error;
    }
  }

  static async findAll(options = {}) {
    try {
      const {
        page = 1,
        limit = 20,
        author_id = null,
        search = null,
        sortBy = 'created_at',
        sortOrder = 'desc',
        userId = null
      } = options;

      const offset = (page - 1) * limit;

      let query = supabaseAdmin
        .from('collections')
        .select(`
          *,
          users!collections_author_id_fkey(id, nom, prenom, role, avatar_url)
        `, { count: 'exact' });

      if (userId) {
        query = query.or(`is_public.eq.true,author_id.eq.${userId}`);
      } else {
        query = query.eq('is_public', true);
      }

      if (author_id) query = query.eq('author_id', author_id);

      if (search) {
        query = query.or(`nom.ilike.%${search}%,description.ilike.%${search}%`);
      }

      const validSortFields = ['created_at', 'updated_at', 'ressources_count', 'nom'];
      const sortField = validSortFields.includes(sortBy) ? sortBy : 'created_at';
      const order = sortOrder === 'asc' ? { ascending: true } : { ascending: false };

      query = query
        .order(sortField, order)
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
      logger.error('Erreur récupération collections:', error);
      throw error;
    }
  }

  static async update(id, updates, userId) {
    try {
      const { data, error } = await supabaseAdmin
        .from('collections')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('author_id', userId)
        .select(`
          *,
          users!collections_author_id_fkey(nom, prenom, role, avatar_url)
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erreur mise à jour collection:', error);
      throw error;
    }
  }

  static async delete(id, userId) {
    try {
      const { error } = await supabaseAdmin
        .from('collections')
        .delete()
        .eq('id', id)
        .eq('author_id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Erreur suppression collection:', error);
      throw error;
    }
  }

  static async addRessource(collectionId, ressourceId, ordre = 0) {
    try {
      const { data: existing } = await supabaseAdmin
        .from('collection_ressources')
        .select('id')
        .eq('collection_id', collectionId)
        .eq('ressource_id', ressourceId)
        .single();

      if (existing) {
        throw new Error('Cette ressource est déjà dans la collection');
      }

      const { data, error } = await supabaseAdmin
        .from('collection_ressources')
        .insert({
          collection_id: collectionId,
          ressource_id: ressourceId,
          ordre
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Erreur ajout ressource à collection:', error);
      throw error;
    }
  }

  static async removeRessource(collectionId, ressourceId, userId) {
    try {
      const { data: collection } = await supabaseAdmin
        .from('collections')
        .select('author_id')
        .eq('id', collectionId)
        .single();

      if (!collection || collection.author_id !== userId) {
        throw new Error('Permissions insuffisantes');
      }

      const { error } = await supabaseAdmin
        .from('collection_ressources')
        .delete()
        .eq('collection_id', collectionId)
        .eq('ressource_id', ressourceId);

      if (error) throw error;
      return true;
    } catch (error) {
      logger.error('Erreur suppression ressource de collection:', error);
      throw error;
    }
  }

  static async reorderRessources(collectionId, ressourceOrders, userId) {
    try {
      const { data: collection } = await supabaseAdmin
        .from('collections')
        .select('author_id')
        .eq('id', collectionId)
        .single();

      if (!collection || collection.author_id !== userId) {
        throw new Error('Permissions insuffisantes');
      }

      const updatePromises = ressourceOrders.map(({ ressource_id, ordre }) =>
        supabaseAdmin
          .from('collection_ressources')
          .update({ ordre })
          .eq('collection_id', collectionId)
          .eq('ressource_id', ressource_id)
      );

      await Promise.all(updatePromises);
      return true;
    } catch (error) {
      logger.error('Erreur réorganisation ressources collection:', error);
      throw error;
    }
  }

  static async getCollectionsByRessource(ressourceId) {
    try {
      const { data, error } = await supabaseAdmin
        .from('collection_ressources')
        .select(`
          collections!collection_ressources_collection_id_fkey(
            id,
            nom,
            description,
            is_public,
            author_id,
            users!collections_author_id_fkey(nom, prenom, role, avatar_url)
          )
        `)
        .eq('ressource_id', ressourceId);

      if (error) throw error;

      return data?.map(item => item.collections).filter(col => col.is_public) || [];
    } catch (error) {
      logger.error('Erreur récupération collections par ressource:', error);
      throw error;
    }
  }

  static async getPopular(limit = 10) {
    try {
      const { data, error } = await supabaseAdmin
        .from('collections')
        .select(`
          *,
          users!collections_author_id_fkey(nom, prenom, role, avatar_url)
        `)
        .eq('is_public', true)
        .order('ressources_count', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Erreur récupération collections populaires:', error);
      throw error;
    }
  }

  static async getRecent(limit = 10) {
    try {
      const { data, error } = await supabaseAdmin
        .from('collections')
        .select(`
          *,
          users!collections_author_id_fkey(nom, prenom, role, avatar_url)
        `)
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      logger.error('Erreur récupération collections récentes:', error);
      throw error;
    }
  }

  static async duplicateCollection(collectionId, newName, userId) {
    try {
      const originalCollection = await this.findById(collectionId);
      
      if (!originalCollection || (!originalCollection.is_public && originalCollection.author_id !== userId)) {
        throw new Error('Collection non trouvée ou non accessible');
      }

      const { data: newCollection, error: createError } = await supabaseAdmin
        .from('collections')
        .insert({
          nom: newName,
          description: originalCollection.description + ' (copie)',
          is_public: false,
          author_id: userId
        })
        .select()
        .single();

      if (createError) throw createError;

      if (originalCollection.ressources && originalCollection.ressources.length > 0) {
        const ressourceInserts = originalCollection.ressources.map((ressource, index) => ({
          collection_id: newCollection.id,
          ressource_id: ressource.id,
          ordre: index
        }));

        const { error: insertError } = await supabaseAdmin
          .from('collection_ressources')
          .insert(ressourceInserts);

        if (insertError) throw insertError;
      }

      return newCollection;
    } catch (error) {
      logger.error('Erreur duplication collection:', error);
      throw error;
    }
  }

  static async validateRessourceAccess(ressourceId, userId) {
    try {
      const { data, error } = await supabaseAdmin
        .from('ressources')
        .select('is_public, author_id')
        .eq('id', ressourceId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return false;
        }
        throw error;
      }

      return data.is_public || data.author_id === userId;
    } catch (error) {
      logger.error('Erreur validation accès ressource:', error);
      return false;
    }
  }
}

module.exports = CollectionsModel;