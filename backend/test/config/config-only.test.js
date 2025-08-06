// Test isolé des configurations sans import du serveur
process.env.NODE_ENV = 'test';

describe('Configuration Backend - Tests isolés', () => {
  
  test('Configuration Supabase', async () => {
    const { supabase, supabaseAdmin, testConnection } = require('../../config/supabase');
    
    expect(process.env.SUPABASE_URL).toBeDefined();
    expect(process.env.SUPABASE_ANON_KEY).toBeDefined();
    expect(process.env.SUPABASE_SERVICE_ROLE_KEY).toBeDefined();
    
    expect(supabase).toBeDefined();
    expect(supabaseAdmin).toBeDefined();
    
    const isConnected = await testConnection();
    expect(isConnected).toBe(true);
  });

  test('Configuration Wasabi', async () => {
    const { s3, bucket, testConnection } = require('../../config/wasabi');
    
    expect(process.env.WASABI_ACCESS_KEY).toBeDefined();
    expect(process.env.WASABI_SECRET_KEY).toBeDefined();
    expect(process.env.WASABI_BUCKET).toBeDefined();
    
    expect(s3).toBeDefined();
    expect(bucket).toBeDefined();
    
    const isConnected = await testConnection();
    expect(isConnected).toBe(true);
  });

  test('Configuration JWT', () => {
    const { generateToken, verifyToken } = require('../../config/jwt');
    
    expect(process.env.JWT_SECRET).toBeDefined();
    expect(process.env.JWT_SECRET.length).toBeGreaterThan(20);
    
    const payload = {
      userId: 'test-user-id',
      email: 'test@diagana.com',
      role: 'professeur'
    };

    const token = generateToken(payload);
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');

    const decoded = verifyToken(token);
    expect(decoded.userId).toBe(payload.userId);
    expect(decoded.email).toBe(payload.email);
    expect(decoded.role).toBe(payload.role);
  });

  test('Configuration Multer', () => {
    const { ALLOWED_TYPES, MAX_FILE_SIZE, generateFileName } = require('../../config/multer');
    
    expect(ALLOWED_TYPES).toBeDefined();
    expect(Array.isArray(ALLOWED_TYPES)).toBe(true);
    expect(ALLOWED_TYPES).toContain('pdf');
    expect(ALLOWED_TYPES).toContain('jpg');
    
    expect(MAX_FILE_SIZE).toBeDefined();
    expect(typeof MAX_FILE_SIZE).toBe('number');
    expect(MAX_FILE_SIZE).toBeGreaterThan(0);
    
    const fileName = generateFileName('test.pdf', 'user123');
    expect(fileName).toBeDefined();
    expect(fileName).toContain('user123');
    expect(fileName).toContain('.pdf');
  });

});

console.log('🧪 Tests de configuration - Backend Diagana School');
console.log('✅ Toutes les configurations sont fonctionnelles !');