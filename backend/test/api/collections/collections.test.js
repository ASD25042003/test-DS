const { request, app, testData, authenticateUser, cleanupTestData, waitForServer } = require('../../setup');

describe('Collections API Tests', () => {
  let profAuth, eleveAuth;
  let testCollectionId, testRessourceId;

  beforeAll(async () => {
    await waitForServer();
    await cleanupTestData();
    
    profAuth = await authenticateUser('professeur');
    eleveAuth = await authenticateUser('eleve');

    const ressourceResponse = await request(app)
      .post('/api/ressources')
      .set('Authorization', `Bearer ${profAuth.token}`)
      .send(testData.ressource);
    
    testRessourceId = ressourceResponse.body.ressource.id;
  });

  afterAll(async () => {
    await cleanupTestData();
  });

  describe('POST /api/collections', () => {
    it('devrait créer une nouvelle collection', async () => {
      const response = await request(app)
        .post('/api/collections')
        .set('Authorization', `Bearer ${profAuth.token}`)
        .send(testData.collection);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.collection).toBeDefined();
      expect(response.body.collection.nom).toBe(testData.collection.nom);
      
      testCollectionId = response.body.collection.id;
    });

    it('devrait valider les données d\'entrée', async () => {
      const response = await request(app)
        .post('/api/collections')
        .set('Authorization', `Bearer ${profAuth.token}`)
        .send({
          nom: 'AB'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/collections', () => {
    it('devrait récupérer toutes les collections publiques', async () => {
      const response = await request(app)
        .get('/api/collections');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.collections).toBeDefined();
      expect(Array.isArray(response.body.collections)).toBe(true);
    });

    it('devrait supporter la pagination', async () => {
      const response = await request(app)
        .get('/api/collections?page=1&limit=5');

      expect(response.status).toBe(200);
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(5);
    });
  });

  describe('GET /api/collections/:id', () => {
    it('devrait récupérer une collection par ID', async () => {
      const response = await request(app)
        .get(`/api/collections/${testCollectionId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.collection).toBeDefined();
      expect(response.body.collection.id).toBe(testCollectionId);
    });

    it('devrait retourner 404 pour une collection inexistante', async () => {
      const response = await request(app)
        .get('/api/collections/00000000-0000-0000-0000-000000000000');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/collections/:id/ressources', () => {
    it('devrait ajouter une ressource à la collection', async () => {
      const response = await request(app)
        .post(`/api/collections/${testCollectionId}/ressources`)
        .set('Authorization', `Bearer ${profAuth.token}`)
        .send({
          ressource_id: testRessourceId,
          ordre: 0
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('devrait rejeter l\'ajout d\'une ressource déjà présente', async () => {
      const response = await request(app)
        .post(`/api/collections/${testCollectionId}/ressources`)
        .set('Authorization', `Bearer ${profAuth.token}`)
        .send({
          ressource_id: testRessourceId
        });

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
    });

    it('devrait rejeter l\'ajout par un non-propriétaire', async () => {
      const response = await request(app)
        .post(`/api/collections/${testCollectionId}/ressources`)
        .set('Authorization', `Bearer ${eleveAuth.token}`)
        .send({
          ressource_id: testRessourceId
        });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/collections/:id', () => {
    it('devrait mettre à jour une collection du propriétaire', async () => {
      const updates = {
        nom: 'Collection mise à jour',
        description: 'Description mise à jour'
      };

      const response = await request(app)
        .put(`/api/collections/${testCollectionId}`)
        .set('Authorization', `Bearer ${profAuth.token}`)
        .send(updates);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.collection.nom).toBe(updates.nom);
    });

    it('devrait rejeter la mise à jour par un non-propriétaire', async () => {
      const response = await request(app)
        .put(`/api/collections/${testCollectionId}`)
        .set('Authorization', `Bearer ${eleveAuth.token}`)
        .send({ nom: 'Tentative de modification' });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/collections/:id/reorder', () => {
    it('devrait réorganiser les ressources d\'une collection', async () => {
      const response = await request(app)
        .put(`/api/collections/${testCollectionId}/reorder`)
        .set('Authorization', `Bearer ${profAuth.token}`)
        .send({
          ressources: [
            { ressource_id: testRessourceId, ordre: 1 }
          ]
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('devrait valider le format des données', async () => {
      const response = await request(app)
        .put(`/api/collections/${testCollectionId}/reorder`)
        .set('Authorization', `Bearer ${profAuth.token}`)
        .send({
          ressources: []
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/collections/my', () => {
    it('devrait récupérer les collections de l\'utilisateur', async () => {
      const response = await request(app)
        .get('/api/collections/my')
        .set('Authorization', `Bearer ${profAuth.token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.collections).toBeDefined();
      expect(response.body.collections.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/collections/search', () => {
    it('devrait rechercher des collections', async () => {
      const response = await request(app)
        .get('/api/collections/search?q=test');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.collections).toBeDefined();
    });
  });

  describe('POST /api/collections/:id/duplicate', () => {
    it('devrait dupliquer une collection', async () => {
      const response = await request(app)
        .post(`/api/collections/${testCollectionId}/duplicate`)
        .set('Authorization', `Bearer ${eleveAuth.token}`)
        .send({
          nom: 'Collection dupliquée'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.collection.nom).toBe('Collection dupliquée');
    });
  });

  describe('GET /api/collections/popular', () => {
    it('devrait récupérer les collections populaires', async () => {
      const response = await request(app)
        .get('/api/collections/popular');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.collections).toBeDefined();
    });
  });

  describe('GET /api/collections/recent', () => {
    it('devrait récupérer les collections récentes', async () => {
      const response = await request(app)
        .get('/api/collections/recent');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.collections).toBeDefined();
    });
  });

  describe('DELETE /api/collections/:id/ressources/:ressourceId', () => {
    it('devrait supprimer une ressource de la collection', async () => {
      const response = await request(app)
        .delete(`/api/collections/${testCollectionId}/ressources/${testRessourceId}`)
        .set('Authorization', `Bearer ${profAuth.token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('DELETE /api/collections/:id', () => {
    it('devrait supprimer une collection du propriétaire', async () => {
      const response = await request(app)
        .delete(`/api/collections/${testCollectionId}`)
        .set('Authorization', `Bearer ${profAuth.token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('devrait retourner 404 pour une collection déjà supprimée', async () => {
      const response = await request(app)
        .get(`/api/collections/${testCollectionId}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
});