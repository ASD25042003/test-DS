const { request, app, authenticateUser, cleanupTestData, waitForServer } = require('../../setup');

describe('Profil API Tests', () => {
  let profAuth, eleveAuth;
  let profUserId, eleveUserId;

  beforeAll(async () => {
    await waitForServer();
    await cleanupTestData();
    
    profAuth = await authenticateUser('professeur');
    eleveAuth = await authenticateUser('eleve');
    
    profUserId = profAuth.user.id;
    eleveUserId = eleveAuth.user.id;
  });

  afterAll(async () => {
    await cleanupTestData();
  });

  describe('GET /api/profil/all', () => {
    it('devrait récupérer tous les utilisateurs', async () => {
      const response = await request(app)
        .get('/api/profil/all');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.users).toBeDefined();
      expect(Array.isArray(response.body.users)).toBe(true);
      expect(response.body.users.length).toBeGreaterThanOrEqual(2);
    });

    it('devrait supporter la pagination', async () => {
      const response = await request(app)
        .get('/api/profil/all?page=1&limit=1');

      expect(response.status).toBe(200);
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(1);
    });
  });

  describe('GET /api/profil/role/:role', () => {
    it('devrait récupérer les professeurs', async () => {
      const response = await request(app)
        .get('/api/profil/role/professeur');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.role).toBe('professeur');
      expect(response.body.users).toBeDefined();
    });

    it('devrait récupérer les élèves', async () => {
      const response = await request(app)
        .get('/api/profil/role/eleve');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.role).toBe('eleve');
    });

    it('devrait rejeter un rôle invalide', async () => {
      const response = await request(app)
        .get('/api/profil/role/invalid');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/profil/search', () => {
    it('devrait rechercher des utilisateurs', async () => {
      const response = await request(app)
        .get('/api/profil/search?q=test');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.users).toBeDefined();
    });

    it('devrait filtrer par rôle', async () => {
      const response = await request(app)
        .get('/api/profil/search?q=test&role=professeur');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('devrait rejeter une recherche trop courte', async () => {
      const response = await request(app)
        .get('/api/profil/search?q=a');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/profil/:userId', () => {
    it('devrait récupérer un profil utilisateur', async () => {
      const response = await request(app)
        .get(`/api/profil/${profUserId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.profile).toBeDefined();
      expect(response.body.profile.id).toBe(profUserId);
      expect(response.body.profile.stats).toBeDefined();
    });

    it('devrait retourner 404 pour un utilisateur inexistant', async () => {
      const response = await request(app)
        .get('/api/profil/00000000-0000-0000-0000-000000000000');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    it('devrait masquer les informations privées pour les autres utilisateurs', async () => {
      const response = await request(app)
        .get(`/api/profil/${profUserId}`)
        .set('Authorization', `Bearer ${eleveAuth.token}`);

      expect(response.status).toBe(200);
      expect(response.body.profile.is_own_profile).toBe(false);
    });
  });

  describe('POST /api/profil/:userId/follow', () => {
    it('devrait suivre un utilisateur', async () => {
      const response = await request(app)
        .post(`/api/profil/${profUserId}/follow`)
        .set('Authorization', `Bearer ${eleveAuth.token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.following).toBe(true);
    });

    it('devrait rejeter de se suivre soi-même', async () => {
      const response = await request(app)
        .post(`/api/profil/${profUserId}/follow`)
        .set('Authorization', `Bearer ${profAuth.token}`);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('devrait rejeter de suivre un utilisateur déjà suivi', async () => {
      const response = await request(app)
        .post(`/api/profil/${profUserId}/follow`)
        .set('Authorization', `Bearer ${eleveAuth.token}`);

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/profil/:userId/followers', () => {
    it('devrait récupérer les followers d\'un utilisateur', async () => {
      const response = await request(app)
        .get(`/api/profil/${profUserId}/followers`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.followers).toBeDefined();
      expect(response.body.followers.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/profil/:userId/following', () => {
    it('devrait récupérer les utilisateurs suivis', async () => {
      const response = await request(app)
        .get(`/api/profil/${eleveUserId}/following`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.following).toBeDefined();
    });
  });

  describe('GET /api/profil/:userId/ressources', () => {
    it('devrait récupérer les ressources d\'un utilisateur', async () => {
      const response = await request(app)
        .get(`/api/profil/${profUserId}/ressources`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.ressources).toBeDefined();
      expect(response.body.user).toBeDefined();
    });

    it('devrait supporter les filtres', async () => {
      const response = await request(app)
        .get(`/api/profil/${profUserId}/ressources?type=document`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('GET /api/profil/:userId/collections', () => {
    it('devrait récupérer les collections d\'un utilisateur', async () => {
      const response = await request(app)
        .get(`/api/profil/${profUserId}/collections`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.collections).toBeDefined();
      expect(response.body.user).toBeDefined();
    });
  });

  describe('GET /api/profil/:userId/activity', () => {
    it('devrait récupérer l\'activité d\'un utilisateur (propriétaire)', async () => {
      const response = await request(app)
        .get(`/api/profil/${profUserId}/activity`)
        .set('Authorization', `Bearer ${profAuth.token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.activities).toBeDefined();
    });

    it('devrait masquer l\'activité pour les autres utilisateurs', async () => {
      const response = await request(app)
        .get(`/api/profil/${profUserId}/activity`)
        .set('Authorization', `Bearer ${eleveAuth.token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.activities).toEqual([]);
      expect(response.body.message).toContain('pas publique');
    });
  });

  describe('DELETE /api/profil/:userId/follow', () => {
    it('devrait arrêter de suivre un utilisateur', async () => {
      const response = await request(app)
        .delete(`/api/profil/${profUserId}/follow`)
        .set('Authorization', `Bearer ${eleveAuth.token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.following).toBe(false);
    });

    it('devrait retourner 404 pour un utilisateur non suivi', async () => {
      const response = await request(app)
        .delete(`/api/profil/${profUserId}/follow`)
        .set('Authorization', `Bearer ${eleveAuth.token}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
});