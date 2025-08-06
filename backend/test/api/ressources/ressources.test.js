const { request, app, testData, authenticateUser, cleanupTestData, waitForServer } = require('../../setup');

describe('Ressources API Tests', () => {
  let profAuth, eleveAuth;
  let testRessourceId;

  beforeAll(async () => {
    await waitForServer();
    await cleanupTestData();
    
    profAuth = await authenticateUser('professeur');
    eleveAuth = await authenticateUser('eleve');
  });

  afterAll(async () => {
    await cleanupTestData();
  });

  describe('POST /api/ressources', () => {
    it('devrait créer une nouvelle ressource', async () => {
      const response = await request(app)
        .post('/api/ressources')
        .set('Authorization', `Bearer ${profAuth.token}`)
        .send(testData.ressource);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.ressource).toBeDefined();
      expect(response.body.ressource.titre).toBe(testData.ressource.titre);
      
      testRessourceId = response.body.ressource.id;
    });

    it('devrait valider les données d\'entrée', async () => {
      const response = await request(app)
        .post('/api/ressources')
        .set('Authorization', `Bearer ${profAuth.token}`)
        .send({
          titre: 'A',
          type: 'invalid_type'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('devrait rejeter une requête sans authentification', async () => {
      const response = await request(app)
        .post('/api/ressources')
        .send(testData.ressource);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/ressources', () => {
    it('devrait récupérer toutes les ressources publiques', async () => {
      const response = await request(app)
        .get('/api/ressources');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.ressources).toBeDefined();
      expect(Array.isArray(response.body.ressources)).toBe(true);
      expect(response.body.pagination).toBeDefined();
    });

    it('devrait filtrer par type', async () => {
      const response = await request(app)
        .get('/api/ressources?type=document');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('devrait supporter la pagination', async () => {
      const response = await request(app)
        .get('/api/ressources?page=1&limit=5');

      expect(response.status).toBe(200);
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(5);
    });

    it('devrait supporter la recherche', async () => {
      const response = await request(app)
        .get('/api/ressources?search=test');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('GET /api/ressources/:id', () => {
    it('devrait récupérer une ressource par ID', async () => {
      const response = await request(app)
        .get(`/api/ressources/${testRessourceId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.ressource).toBeDefined();
      expect(response.body.ressource.id).toBe(testRessourceId);
    });

    it('devrait retourner 404 pour une ressource inexistante', async () => {
      const response = await request(app)
        .get('/api/ressources/00000000-0000-0000-0000-000000000000');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    it('devrait compter les vues', async () => {
      const response = await request(app)
        .get(`/api/ressources/${testRessourceId}?track_view=true`)
        .set('Authorization', `Bearer ${eleveAuth.token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('PUT /api/ressources/:id', () => {
    it('devrait mettre à jour une ressource du propriétaire', async () => {
      const updates = {
        titre: 'Titre mis à jour',
        description: 'Description mise à jour'
      };

      const response = await request(app)
        .put(`/api/ressources/${testRessourceId}`)
        .set('Authorization', `Bearer ${profAuth.token}`)
        .send(updates);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.ressource.titre).toBe(updates.titre);
    });

    it('devrait rejeter la mise à jour par un non-propriétaire', async () => {
      const response = await request(app)
        .put(`/api/ressources/${testRessourceId}`)
        .set('Authorization', `Bearer ${eleveAuth.token}`)
        .send({ titre: 'Tentative de modification' });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/ressources/:id/like', () => {
    it('devrait ajouter un like à une ressource', async () => {
      const response = await request(app)
        .post(`/api/ressources/${testRessourceId}/like`)
        .set('Authorization', `Bearer ${eleveAuth.token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.liked).toBe(true);
    });

    it('devrait retirer un like existant', async () => {
      const response = await request(app)
        .post(`/api/ressources/${testRessourceId}/like`)
        .set('Authorization', `Bearer ${eleveAuth.token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.liked).toBe(false);
    });
  });

  describe('POST /api/ressources/:id/favorite', () => {
    it('devrait ajouter une ressource aux favoris', async () => {
      const response = await request(app)
        .post(`/api/ressources/${testRessourceId}/favorite`)
        .set('Authorization', `Bearer ${eleveAuth.token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.favorited).toBe(true);
    });
  });

  describe('GET /api/ressources/favorites', () => {
    it('devrait récupérer les favoris de l\'utilisateur', async () => {
      const response = await request(app)
        .get('/api/ressources/favorites')
        .set('Authorization', `Bearer ${eleveAuth.token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.ressources).toBeDefined();
      expect(Array.isArray(response.body.ressources)).toBe(true);
    });
  });

  describe('GET /api/ressources/my', () => {
    it('devrait récupérer les ressources de l\'utilisateur', async () => {
      const response = await request(app)
        .get('/api/ressources/my')
        .set('Authorization', `Bearer ${profAuth.token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.ressources).toBeDefined();
      expect(response.body.ressources.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/ressources/popular', () => {
    it('devrait récupérer les ressources populaires', async () => {
      const response = await request(app)
        .get('/api/ressources/popular');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.ressources).toBeDefined();
    });
  });

  describe('GET /api/ressources/recent', () => {
    it('devrait récupérer les ressources récentes', async () => {
      const response = await request(app)
        .get('/api/ressources/recent');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.ressources).toBeDefined();
    });
  });

  describe('GET /api/ressources/search', () => {
    it('devrait rechercher des ressources', async () => {
      const response = await request(app)
        .get('/api/ressources/search?q=test');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.ressources).toBeDefined();
    });

    it('devrait rejeter une recherche trop courte', async () => {
      const response = await request(app)
        .get('/api/ressources/search?q=a');

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/ressources/:id', () => {
    it('devrait supprimer une ressource du propriétaire', async () => {
      const response = await request(app)
        .delete(`/api/ressources/${testRessourceId}`)
        .set('Authorization', `Bearer ${profAuth.token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('devrait retourner 404 pour une ressource déjà supprimée', async () => {
      const response = await request(app)
        .get(`/api/ressources/${testRessourceId}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
});