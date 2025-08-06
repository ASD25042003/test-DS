const express = require('express');
const authRoutes = require('./auth');
const ressourcesRoutes = require('./ressources');
const collectionsRoutes = require('./collections');
const profilRoutes = require('./profil');
const commentairesRoutes = require('./commentaires');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/ressources', ressourcesRoutes);
router.use('/collections', collectionsRoutes);
router.use('/profil', profilRoutes);
router.use('/commentaires', commentairesRoutes);

router.get('/', (req, res) => {
  res.json({
    message: 'API Diagana School',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      ressources: '/api/ressources',
      collections: '/api/collections',
      profil: '/api/profil'
    }
  });
});

module.exports = router;