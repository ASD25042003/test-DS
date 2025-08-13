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
    const testFiles = [
      {
        name: '2-PROTOCOLE-PORTANT-CREATION-DE-LA-COUR-AFRICAINE-DES-DROITS-DE-LHOMME-ET-DES-PEUPLES.pdf',
        path: path.join(__dirname, '../../../test-file/2-PROTOCOLE-PORTANT-CREATION-DE-LA-COUR-AFRICAINE-DES-DROITS-DE-LHOMME-ET-DES-PEUPLES.pdf'),
        mimetype: 'application/pdf'
      },
      {
        name: 'page-word.com-page2.docx',
        path: path.join(__dirname, '../../../test-file/page-word.com-page2.docx'),
        mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      },
      {
        name: 'téléchargement.jpg',
        path: path.join(__dirname, '../../../test-file/téléchargement.jpg'),
        mimetype: 'image/jpeg'
      }
    ];
    let uploadedKeys = [];

    it('devrait pouvoir uploader un fichier PDF réel', async () => {
      const testFile = testFiles[0]; // PDF
      
      if (!fs.existsSync(testFile.path)) {
        console.warn(`Fichier test non trouvé: ${testFile.path}`);
        return;
      }

      const fileBuffer = fs.readFileSync(testFile.path);
      
      const mockFile = {
        buffer: fileBuffer,
        mimetype: testFile.mimetype,
        originalname: testFile.name,
        size: fileBuffer.length
      };

      const uploadedKey = `test-config/${Date.now()}_${testFile.name}`;
      uploadedKeys.push(uploadedKey);
      
      const result = await uploadFile(mockFile, uploadedKey);
      
      expect(result.success).toBe(true);
      expect(result.url).toBeDefined();
      expect(result.key).toBe(uploadedKey);
    }, 20000);

    it('devrait pouvoir uploader un fichier DOCX réel', async () => {
      const testFile = testFiles[1]; // DOCX
      
      if (!fs.existsSync(testFile.path)) {
        console.warn(`Fichier test non trouvé: ${testFile.path}`);
        return;
      }

      const fileBuffer = fs.readFileSync(testFile.path);
      
      const mockFile = {
        buffer: fileBuffer,
        mimetype: testFile.mimetype,
        originalname: testFile.name,
        size: fileBuffer.length
      };

      const uploadedKey = `test-config/${Date.now()}_${testFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      uploadedKeys.push(uploadedKey);
      
      const result = await uploadFile(mockFile, uploadedKey);
      
      expect(result.success).toBe(true);
      expect(result.url).toBeDefined();
      expect(result.key).toBe(uploadedKey);
    }, 20000);

    it('devrait pouvoir uploader un fichier image réel', async () => {
      const testFile = testFiles[2]; // JPG
      
      if (!fs.existsSync(testFile.path)) {
        console.warn(`Fichier test non trouvé: ${testFile.path}`);
        return;
      }

      const fileBuffer = fs.readFileSync(testFile.path);
      
      const mockFile = {
        buffer: fileBuffer,
        mimetype: testFile.mimetype,
        originalname: testFile.name,
        size: fileBuffer.length
      };

      const uploadedKey = `test-config/${Date.now()}_${testFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      uploadedKeys.push(uploadedKey);
      
      const result = await uploadFile(mockFile, uploadedKey);
      
      expect(result.success).toBe(true);
      expect(result.url).toBeDefined();
      expect(result.key).toBe(uploadedKey);
    }, 20000);

    it('devrait pouvoir générer une URL signée', async () => {
      if (uploadedKeys.length === 0) {
        throw new Error('Aucun fichier uploadé pour le test');
      }

      const result = await generateSignedUrl(uploadedKeys[0], 300);
      
      expect(result.success).toBe(true);
      expect(result.url).toBeDefined();
      expect(result.url).toContain(bucket);
    }, 10000);

    it('devrait pouvoir supprimer les fichiers uploadés', async () => {
      for (const key of uploadedKeys) {
        const result = await deleteFile(key);
        expect(result.success).toBe(true);
      }
    }, 15000);
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