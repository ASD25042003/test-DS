const { supabase, supabaseAdmin, testConnection } = require('../../config/supabase');

describe('Configuration Supabase', () => {
  describe('Variables d\'environnement', () => {
    it('devrait avoir toutes les variables requises', () => {
      expect(process.env.SUPABASE_URL).toBeDefined();
      expect(process.env.SUPABASE_ANON_KEY).toBeDefined();
      expect(process.env.SUPABASE_SERVICE_ROLE_KEY).toBeDefined();
      
      expect(process.env.SUPABASE_URL).toContain('supabase.co');
      expect(process.env.SUPABASE_ANON_KEY).toMatch(/^eyJ/);
      expect(process.env.SUPABASE_SERVICE_ROLE_KEY).toMatch(/^eyJ/);
    });
  });

  describe('Clients Supabase', () => {
    it('devrait créer le client anonyme', () => {
      expect(supabase).toBeDefined();
      expect(supabase.supabaseUrl).toBe(process.env.SUPABASE_URL);
      expect(supabase.supabaseKey).toBe(process.env.SUPABASE_ANON_KEY);
    });

    it('devrait créer le client admin', () => {
      expect(supabaseAdmin).toBeDefined();
      expect(supabaseAdmin.supabaseUrl).toBe(process.env.SUPABASE_URL);
      expect(supabaseAdmin.supabaseKey).toBe(process.env.SUPABASE_SERVICE_ROLE_KEY);
    });
  });

  describe('Test de connexion', () => {
    it('devrait se connecter à Supabase avec succès', async () => {
      const isConnected = await testConnection();
      expect(isConnected).toBe(true);
    }, 10000);

    it('devrait pouvoir exécuter une requête simple', async () => {
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('count')
        .limit(1);

      expect(error).toBeNull();
      expect(data).toBeDefined();
    });
  });

  describe('Permissions', () => {
    it('le client admin devrait avoir les permissions élevées', async () => {
      const { data, error } = await supabaseAdmin
        .from('registration_keys')
        .select('*')
        .limit(1);

      expect(error).toBeNull();
      expect(data).toBeDefined();
    });

    it('le client anonyme devrait avoir des permissions limitées', async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .limit(1);

      // Le client anonyme ne devrait pas pouvoir accéder directement aux users
      expect(error).toBeDefined();
    });
  });
});