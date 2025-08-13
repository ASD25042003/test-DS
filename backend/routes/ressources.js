const express = require('express');
const RessourcesController = require('../controllers/ressources');
const { 
  authenticateToken, 
  optionalAuth, 
  rateLimitByUser 
} = require('../middlewares/auth');
const { uploadSingle, uploadResourceMiddleware, handleUploadError } = require('../config/multer');

const router = express.Router();

router.get('/popular', 
  RessourcesController.getPopular
);

router.get('/recent', 
  RessourcesController.getRecent
);

router.get('/search', 
  RessourcesController.search
);

router.get('/my', 
  authenticateToken,
  RessourcesController.getMy
);

router.get('/favorites', 
  authenticateToken,
  RessourcesController.getFavorites
);

router.get('/', 
  optionalAuth,
  RessourcesController.getAll
);

router.post('/', 
  authenticateToken,
  rateLimitByUser(15 * 60 * 1000, 20),
  uploadResourceMiddleware,  // Nouveau middleware qui gère champs texte + fichier
  handleUploadError,
  RessourcesController.create
);

router.get('/:id', 
  optionalAuth,
  RessourcesController.getById
);

router.put('/:id', 
  authenticateToken,
  rateLimitByUser(15 * 60 * 1000, 30),
  uploadResourceMiddleware,  // Nouveau middleware qui gère champs texte + fichier
  handleUploadError,
  RessourcesController.update
);

router.delete('/:id', 
  authenticateToken,
  RessourcesController.delete
);

router.post('/:id/like', 
  authenticateToken,
  rateLimitByUser(15 * 60 * 1000, 100),
  RessourcesController.toggleLike
);

router.post('/:id/favorite', 
  authenticateToken,
  rateLimitByUser(15 * 60 * 1000, 100),
  RessourcesController.toggleFavorite
);

router.get('/:id/download', 
  optionalAuth,
  RessourcesController.download
);

router.post('/:id/view', 
  optionalAuth,
  rateLimitByUser(15 * 60 * 1000, 200),
  RessourcesController.incrementView
);

module.exports = router;