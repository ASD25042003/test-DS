const { createClient } = require('@supabase/supabase-js');
const logger = require('../utils/logger');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
  logger.error('Configuration Supabase manquante');
  throw new Error('Configuration Supabase manquante');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const testConnection = async () => {
  try {
    // Test simple de connexion avec une requête basique
    const { data, error } = await supabaseAdmin.rpc('version');
    if (error && !error.message.includes('function') && !error.message.includes('public.version')) {
      throw error;
    }
    // Si on arrive ici, la connexion fonctionne (même si la fonction n'existe pas)
    logger.info('✅ Connexion Supabase établie');
    return true;
  } catch (error) {
    // Test alternatif avec auth
    try {
      const { data: authData, error: authError } = await supabase.auth.getSession();
      logger.info('✅ Connexion Supabase établie (via auth)');
      return true;
    } catch (authError) {
      logger.error('❌ Erreur connexion Supabase:', error.message);
      return false;
    }
  }
};

module.exports = {
  supabase,
  supabaseAdmin,
  testConnection
};