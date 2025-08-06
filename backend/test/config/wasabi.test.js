const { s3, bucket, testConnection, uploadFile, deleteFile, generateSignedUrl } = require('../../config/wasabi');
const fs = require('fs');
const path = require('path');

describe('Configuration Wasabi', () => {
  describe('Variables d\'environnement', () => {
    it('devrait avoir toutes les variables requises', () => {
      expect(process.env.WASABI_ACCESS_KEY).toBeDefined();
      expect(process.env.WASABI_SECRET_KEY).toBeDefined();
      expect(process.env.WASABI_BUCKET).toBeDefined();
      expect(process.env.WASABI_REGION).toBeDefined();
      expect(process.env.WASABI_ENDPOINT).toBeDefined();
      
      expect(process.env.WASABI_BUCKET).toBe('diagana-school-files');
      expect(process.env.WASABI_REGION).toBe('eu-west-2');
      expect(process.env.WASABI_ENDPOINT).toContain('wasabisys.com');
    });
  });

  describe('Client S3', () => {
    it('devrait créer le client S3 avec la bonne configuration', () => {
      expect(s3).toBeDefined();
      expect(s3.config.accessKeyId).toBe(process.env.WASABI_ACCESS_KEY);
      expect(s3.config.region).toBe(process.env.WASABI_REGION);
      expect(s3.endpoint.href).toBe(process.env.WASABI_ENDPOINT + '/');
    });

    it('devrait avoir le bon nom de bucket', () => {
      expect(bucket).toBe(process.env.WASABI_BUCKET);
    });
  });

  describe('Test de connexion', () => {
    it('devrait se connecter à Wasabi avec succès', async () => {
      const isConnected = await testConnection();
      expect(isConnected).toBe(true);
    }, 15000);

    it('devrait pouvoir lister le contenu du bucket', async () => {
      const params = {
        Bucket: bucket,
        MaxKeys: 1
      };

      const result = await s3.listObjectsV2(params).promise();
      expect(result).toBeDefined();
      expect(result.Name).toBe(bucket);
    }, 10000);
  });

  describe('Opérations sur fichiers', () => {
    const testFileName = 'test-config-file.txt';
    const testFileContent = 'Contenu de test pour configuration Wasabi';
    let uploadedKey;

    beforeAll(() => {
      // Créer un fichier de test temporaire
      const testFilePath = path.join(__dirname, testFileName);
      fs.writeFileSync(testFilePath, testFileContent);
    });

    afterAll(() => {
      // Nettoyer le fichier de test
      const testFilePath = path.join(__dirname, testFileName);
      if (fs.existsSync(testFilePath)) {
        fs.unlinkSync(testFilePath);
      }
    });

    it('devrait pouvoir uploader un fichier', async () => {
      const testFilePath = path.join(__dirname, testFileName);
      const fileBuffer = fs.readFileSync(testFilePath);
      
      const mockFile = {
        buffer: fileBuffer,
        mimetype: 'text/plain',
        originalname: testFileName,
        size: fileBuffer.length
      };

      uploadedKey = `test-config/${Date.now()}_${testFileName}`;
      
      const result = await uploadFile(mockFile, uploadedKey);
      
      expect(result.success).toBe(true);
      expect(result.url).toBeDefined();
      expect(result.key).toBe(uploadedKey);
    }, 15000);

    it('devrait pouvoir générer une URL signée', async () => {
      if (!uploadedKey) {
        throw new Error('Aucun fichier uploadé pour le test');
      }

      const result = await generateSignedUrl(uploadedKey, 300);
      
      expect(result.success).toBe(true);
      expect(result.url).toBeDefined();
      expect(result.url).toContain(bucket);
    }, 10000);

    it('devrait pouvoir supprimer un fichier', async () => {
      if (!uploadedKey) {
        throw new Error('Aucun fichier uploadé pour le test');
      }

      const result = await deleteFile(uploadedKey);
      
      expect(result.success).toBe(true);
    }, 10000);
  });

  describe('Gestion d\'erreurs', () => {
    it('devrait gérer les erreurs d\'upload', async () => {
      const mockFile = {
        buffer: Buffer.from('test'),
        mimetype: 'text/plain',
        originalname: 'test.txt',
        size: 4
      };

      // Utiliser une clé invalide pour provoquer une erreur
      const invalidKey = '';
      
      const result = await uploadFile(mockFile, invalidKey);
      
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('devrait gérer les erreurs de suppression', async () => {
      const result = await deleteFile('fichier-inexistant.txt');
      
      // AWS S3/Wasabi retourne success: true même pour les fichiers inexistants (comportement idempotent)
      expect(result.success).toBe(true);
    });
  });
});