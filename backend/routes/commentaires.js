const express = require('express');
const CommentairesController = require('../controllers/commentaires');
const { 
  authenticateToken, 
  optionalAuth, 
  rateLimitByUser 
} = require('../middlewares/auth');

const router = express.Router();

router.get('/ressource/:ressourceId', 
  optionalAuth,
  CommentairesController.getByRessource
);

router.post('/', 
  authenticateToken,
  rateLimitByUser(15 * 60 * 1000, 30),
  CommentairesController.create
);

router.put('/:id', 
  authenticateToken,
  rateLimitByUser(15 * 60 * 1000, 20),
  CommentairesController.update
);

router.delete('/:id', 
  authenticateToken,
  CommentairesController.delete
);

module.exports = router;