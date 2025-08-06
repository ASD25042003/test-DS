const { request, app, testUsers, cleanupTestData, waitForServer } = require('../../setup');

describe('Auth API Tests', () => {
  beforeAll(async () => {
    await waitForServer();
    await cleanupTestData();
  });

  afterAll(async () => {
    await cleanupTestData();
  });

  describe('POST /api/auth/register', () => {
    it('devrait créer un nouvel élève avec une clé valide', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(testUsers.eleve);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.user).toBeDefined();
      expect(response.body.user.role).toBe('eleve');
      expect(response.body.token).toBeDefined();
    });

    it('devrait créer un nouveau professeur avec une clé valide', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          ...testUsers.professeur,
          email: 'prof.unique@diagana.com',
          keyValue: 'PROF_2024_A1B2C3' // Utiliser une clé différente
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.user).toBeDefined();
      expect(response.body.user.role).toBe('professeur');
      expect(response.body.token).toBeDefined();
    });

    it('devrait rejeter une inscription avec une clé invalide', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          ...testUsers.professeur,
          email: 'autre@test.com',
          keyValue: 'INVALID_KEY'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('invalide');
    });

    it('devrait rejeter une inscription avec un email déjà utilisé', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          ...testUsers.eleve, // Utiliser l'email de l'élève qui a été inscrit
          keyValue: 'PROF_2024_D4E5F6'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('existe déjà');
    });

    it('devrait valider les données d\'entrée', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'email-invalide',
          password: '123',
          nom: 'A',
          prenom: 'B'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    it('devrait connecter un utilisateur avec des identifiants valides', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUsers.eleve.email, // Utiliser l'email de l'élève qui a été inscrit
          password: testUsers.eleve.password
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.user).toBeDefined();
      expect(response.body.token).toBeDefined();
    });

    it('devrait rejeter une connexion avec un mot de passe incorrect', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUsers.professeur.email,
          password: 'MauvaisMotDePasse'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('devrait rejeter une connexion avec un email inexistant', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'inexistant@test.com',
          password: 'MotDePasse123!'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/validate-key/:keyValue', () => {
    it('devrait valider une clé d\'inscription existante', async () => {
      const response = await request(app)
        .get('/api/auth/validate-key/PROF_2024_G7H8I9');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.valid).toBe(true);
      expect(response.body.role).toBe('professeur');
    });

    it('devrait rejeter une clé d\'inscription invalide', async () => {
      const response = await request(app)
        .get('/api/auth/validate-key/INVALID_KEY');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.valid).toBe(false);
    });
  });

  describe('GET /api/auth/me', () => {
    let authToken;

    beforeAll(async () => {
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUsers.eleve.email, // Utiliser l'élève déjà inscrit
          password: testUsers.eleve.password
        });
      
      authToken = loginResponse.body.token;
    });

    it('devrait retourner les informations de l\'utilisateur connecté', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe(testUsers.eleve.email);
    });

    it('devrait rejeter une requête sans token', async () => {
      const response = await request(app)
        .get('/api/auth/me');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('devrait rejeter une requête avec un token invalide', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid_token');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/auth/profile', () => {
    let authToken;

    beforeAll(async () => {
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'prof.unique@diagana.com', // Utiliser le professeur déjà inscrit
          password: testUsers.professeur.password
        });
      
      authToken = loginResponse.body.token;
    });

    it('devrait mettre à jour le profil utilisateur', async () => {
      const updates = {
        bio: 'Bio de test mise à jour',
        classe: '2nde B'
      };

      const response = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updates);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.user.bio).toBe(updates.bio);
      expect(response.body.user.classe).toBe(updates.classe);
    });

    it('devrait rejeter les champs non autorisés', async () => {
      const response = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          email: 'nouveau@email.com',
          role: 'professeur'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/logout', () => {
    let authToken;

    beforeAll(async () => {
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'prof.unique@diagana.com', // Utiliser le professeur déjà inscrit
          password: testUsers.professeur.password
        });
      
      authToken = loginResponse.body.token;
    });

    it('devrait déconnecter l\'utilisateur', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});