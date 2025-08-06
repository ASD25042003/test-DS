// Configurer l'environnement de test
process.env.NODE_ENV = 'test';
process.env.PORT = '3001';

const { supabase, supabaseAdmin, testConnection } = require('../../config/supabase');
const { s3, bucket, testConnection: testWasabiConnection } = require('../../config/wasabi');
const { generateToken, verifyToken } = require('../../config/jwt');

describe('Tests de configuration simplifiés', () => {
  
  describe('Configuration Supabase', () => {
    it('devrait avoir les variables d\'environnement', () => {
      expect(process.env.SUPABASE_URL).toBeDefined();
      expect(process.env.SUPABASE_ANON_KEY).toBeDefined();
      expect(process.env.SUPABASE_SERVICE_ROLE_KEY).toBeDefined();
    });

    it('devrait créer les clients Supabase', () => {
      expect(supabase).toBeDefined();
      expect(supabaseAdmin).toBeDefined();
    });

    it('devrait se connecter à Supabase', async () => {
      const isConnected = await testConnection();
      expect(isConnected).toBe(true);
    }, 10000);
  });

  describe('Configuration Wasabi', () => {
    it('devrait avoir les variables d\'environnement', () => {
      expect(process.env.WASABI_ACCESS_KEY).toBeDefined();
      expect(process.env.WASABI_SECRET_KEY).toBeDefined();
      expect(process.env.WASABI_BUCKET).toBeDefined();
    });

    it('devrait créer le client S3', () => {
      expect(s3).toBeDefined();
      expect(bucket).toBeDefined();
    });

    it('devrait se connecter à Wasabi', async () => {
      const isConnected = await testWasabiConnection();
      expect(isConnected).toBe(true);
    }, 15000);
  });

  describe('Configuration JWT', () => {
    it('devrait avoir le secret JWT', () => {
      expect(process.env.JWT_SECRET).toBeDefined();
      expect(process.env.JWT_SECRET.length).toBeGreaterThan(20);
    });

    it('devrait générer et vérifier un token', () => {
      const payload = {
        userId: 'test-user-id',
        email: 'test@diagana.com',
        role: 'professeur'
      };

      const token = generateToken(payload);
      expect(token).toBeDefined();

      const decoded = verifyToken(token);
      expect(decoded.userId).toBe(payload.userId);
      expect(decoded.email).toBe(payload.email);
      expect(decoded.role).toBe(payload.role);
    });
  });

  describe('Configuration Multer', () => {
    it('devrait avoir les constantes définies', () => {
      const { ALLOWED_TYPES, MAX_FILE_SIZE } = require('../../config/multer');
      
      expect(ALLOWED_TYPES).toBeDefined();
      expect(Array.isArray(ALLOWED_TYPES)).toBe(true);
      expect(ALLOWED_TYPES.length).toBeGreaterThan(0);
      
      expect(MAX_FILE_SIZE).toBeDefined();
      expect(typeof MAX_FILE_SIZE).toBe('number');
      expect(MAX_FILE_SIZE).toBeGreaterThan(0);
    });
  });
});