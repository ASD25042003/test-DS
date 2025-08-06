const express = require('express');
const CollectionsController = require('../controllers/collections');
const { 
  authenticateToken, 
  optionalAuth, 
  rateLimitByUser 
} = require('../middlewares/auth');

const router = express.Router();

router.get('/popular', 
  CollectionsController.getPopular
);

router.get('/recent', 
  CollectionsController.getRecent
);

router.get('/search', 
  CollectionsController.search
);

router.get('/my', 
  authenticateToken,
  CollectionsController.getMy
);

router.get('/by-ressource/:ressourceId', 
  CollectionsController.getCollectionsByRessource
);

router.get('/', 
  optionalAuth,
  CollectionsController.getAll
);

router.post('/', 
  authenticateToken,
  rateLimitByUser(15 * 60 * 1000, 10),
  CollectionsController.create
);

router.get('/:id', 
  optionalAuth,
  CollectionsController.getById
);

router.put('/:id', 
  authenticateToken,
  rateLimitByUser(15 * 60 * 1000, 20),
  CollectionsController.update
);

router.delete('/:id', 
  authenticateToken,
  CollectionsController.delete
);

router.post('/:id/ressources', 
  authenticateToken,
  rateLimitByUser(15 * 60 * 1000, 50),
  CollectionsController.addRessource
);

router.delete('/:id/ressources/:ressourceId', 
  authenticateToken,
  CollectionsController.removeRessource
);

router.put('/:id/reorder', 
  authenticateToken,
  rateLimitByUser(15 * 60 * 1000, 20),
  CollectionsController.reorderRessources
);

router.post('/:id/duplicate', 
  authenticateToken,
  rateLimitByUser(15 * 60 * 1000, 5),
  CollectionsController.duplicate
);

module.exports = router;