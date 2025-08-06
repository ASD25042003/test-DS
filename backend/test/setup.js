const request = require('supertest');
const app = require('../server');
const { supabaseAdmin } = require('../config/supabase');

const testUsers = {
  professeur: {
    email: 'test.prof@diagana.com',
    password: 'TestProf123!',
    nom: 'Professeur',
    prenom: 'Test',
    keyValue: 'PROF_2024_G7H8I9',
    matiere: 'Mathématiques'
  },
  eleve: {
    email: 'test.eleve@diagana.com',
    password: 'TestEleve123!',
    nom: 'Élève',
    prenom: 'Test',
    keyValue: 'ELEVE_2024_E1F2G3',
    classe: '3ème A'
  }
};

const testData = { 
  ressource: {
    titre: 'Test Ressource',
    description: 'Description de test',
    type: 'document',
    contenu: { url: 'https://example.com/test.pdf' },
    tags: ['test', 'mathematics'],
    matiere: 'Mathématiques',
    niveau: '3ème',
    is_public: true
  },
  collection: {
    nom: 'Test Collection',
    description: 'Collection de test',
    is_public: true
  },
  commentaire: {
    contenu: 'Ceci est un commentaire de test'
  }
};

const authenticateUser = async (userType = 'professeur') => {
  const user = testUsers[userType];
  
  const loginResponse = await request(app)
    .post('/api/auth/login')
    .send({
      email: user.email,
      password: user.password
    });

  if (loginResponse.status === 401) {
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send(user);

    if (!registerResponse.body.success) {
      throw new Error(`Erreur inscription: ${registerResponse.body.error}`);
    }

    return {
      token: registerResponse.body.token,
      user: registerResponse.body.user
    };
  }

  if (!loginResponse.body.success) {
    throw new Error(`Erreur connexion: ${loginResponse.body.error}`);
  }

  return {
    token: loginResponse.body.token,
    user: loginResponse.body.user
  };
};

const cleanupTestData = async () => {
  try {
    // Remettre les clés de test à unused
    await supabaseAdmin
      .from('registration_keys')
      .update({ is_used: false, used_by: null, used_at: null })
      .in('key_value', ['PROF_2024_G7H8I9', 'PROF_2024_A1B2C3', 'PROF_2024_D4E5F6', 'ELEVE_2024_E1F2G3']);

    await supabaseAdmin
      .from('commentaires')
      .delete()
      .like('contenu', '%test%');

    await supabaseAdmin
      .from('collection_ressources')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    await supabaseAdmin
      .from('collections')
      .delete()
      .like('nom', '%test%');

    await supabaseAdmin
      .from('ressources')
      .delete()
      .like('titre', '%test%');

    await supabaseAdmin
      .from('follows')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    await supabaseAdmin
      .from('likes')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    await supabaseAdmin
      .from('favoris')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    // Supprimer les utilisateurs de test standard
    const testEmails = [
      ...Object.values(testUsers).map(user => user.email),
      'prof.unique@diagana.com', // Email spécifique du test professeur
      'me.test@diagana.com',
      'profile.test@diagana.com',
      'logout.test@diagana.com',
      'login.test@diagana.com'
    ];

    for (const email of testEmails) {
      const { data: existingUser } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (existingUser) {
        await supabaseAdmin.auth.admin.deleteUser(existingUser.id);
      }
    }

    console.log('✅ Données de test nettoyées');
  } catch (error) {
    console.warn('⚠️ Erreur nettoyage données de test:', error.message);
  }
};

const waitForServer = () => {
  return new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });
};

// Éviter le conflit de port avec le serveur principal
process.env.PORT = process.env.TEST_PORT || 3001;

module.exports = {
  app,
  testUsers,
  testData,
  authenticateUser,
  cleanupTestData,
  waitForServer,
  request
};