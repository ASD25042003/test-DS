const express = require('express');
const AuthController = require('../controllers/auth');
const { authenticateToken, rateLimitByUser } = require('../middlewares/auth');

const router = express.Router();

router.post('/register', 
  rateLimitByUser(15 * 60 * 1000, 5),
  AuthController.register
);

router.post('/login', 
  rateLimitByUser(15 * 60 * 1000, 10),
  AuthController.login
);

router.post('/logout', 
  authenticateToken, 
  AuthController.logout
);

router.get('/me', 
  authenticateToken, 
  AuthController.getCurrentUser
);

router.put('/profile', 
  authenticateToken,
  rateLimitByUser(15 * 60 * 1000, 20),
  AuthController.updateProfile
);

router.put('/password', 
  authenticateToken,
  rateLimitByUser(15 * 60 * 1000, 3),
  AuthController.changePassword
);

router.get('/validate-key/:keyValue', 
  rateLimitByUser(15 * 60 * 1000, 20),
  AuthController.validateKey
);

module.exports = router;