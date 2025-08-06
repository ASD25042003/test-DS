const { request, app } = require('./test/setup');

// Test simple d'inscription
async function testInscription() {
  console.log('🧪 Test d\'inscription simple...');
  
  const testData = {
    email: 'test-simple@diagana.com',
    password: 'TestSimple123!',
    nom: 'Test',
    prenom: 'Simple',
    keyValue: 'PROF_2024_G7H8I9',
    matiere: 'Test'
  };

  try {
    const response = await request(app)
      .post('/api/auth/register')
      .send(testData);

    console.log('Status:', response.status);
    console.log('Body:', JSON.stringify(response.body, null, 2));
  } catch (error) {
    console.error('Erreur:', error.message);
  }
}

testInscription().then(() => process.exit(0));