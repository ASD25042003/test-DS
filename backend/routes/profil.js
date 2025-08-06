const express = require('express');
const ProfilController = require('../controllers/profil');
const { 
  authenticateToken, 
  optionalAuth, 
  rateLimitByUser 
} = require('../middlewares/auth');

const router = express.Router();

router.get('/search', 
  ProfilController.searchUsers
);

router.get('/all', 
  ProfilController.getAllUsers
);

router.get('/role/:role', 
  ProfilController.getUsersByRole
);

router.get('/:userId', 
  optionalAuth,
  ProfilController.getProfile
);

router.get('/:userId/ressources', 
  optionalAuth,
  ProfilController.getUserRessources
);

router.get('/:userId/collections', 
  optionalAuth,
  ProfilController.getUserCollections
);

router.get('/:userId/followers', 
  ProfilController.getFollowers
);

router.get('/:userId/following', 
  ProfilController.getFollowing
);

router.get('/:userId/activity', 
  optionalAuth,
  ProfilController.getUserActivity
);

router.post('/:userId/follow', 
  authenticateToken,
  rateLimitByUser(15 * 60 * 1000, 50),
  ProfilController.followUser
);

router.delete('/:userId/follow', 
  authenticateToken,
  ProfilController.unfollowUser
);

module.exports = router;