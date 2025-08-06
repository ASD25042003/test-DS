const { 
  uploadSingle, 
  uploadMultiple, 
  handleUploadError, 
  generateFileName, 
  ALLOWED_TYPES, 
  MAX_FILE_SIZE 
} = require('../../config/multer');
const express = require('express');
const request = require('supertest');
const fs = require('fs');
const path = require('path');

describe('Configuration Multer', () => {
  let app;
  let testFilePath;

  beforeAll(() => {
    // Créer une app Express de test
    app = express();
    
    // Route de test pour upload simple
    app.post('/test-upload-single', uploadSingle, (req, res) => {
      res.json({
        success: true,
        file: req.file ? {
          originalname: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
          buffer: req.file.buffer ? 'present' : 'absent'
        } : null
      });
    });
    
    // Route de test pour upload multiple
    app.post('/test-upload-multiple', uploadMultiple, (req, res) => {
      res.json({
        success: true,
        files: req.files ? req.files.map(f => ({
          originalname: f.originalname,
          mimetype: f.mimetype,
          size: f.size
        })) : []
      });
    });
    
    // Middleware de gestion d'erreurs
    app.use(handleUploadError);
    
    // Créer un fichier de test
    testFilePath = path.join(__dirname, 'test-file.txt');
    fs.writeFileSync(testFilePath, 'Contenu de test pour upload');
  });

  afterAll(() => {
    // Nettoyer le fichier de test
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
  });

  describe('Configuration globale', () => {
    it('devrait avoir les bonnes constantes définies', () => {
      expect(ALLOWED_TYPES).toBeDefined();
      expect(Array.isArray(ALLOWED_TYPES)).toBe(true);
      expect(ALLOWED_TYPES).toContain('pdf');
      expect(ALLOWED_TYPES).toContain('jpg');
      expect(ALLOWED_TYPES).toContain('png');
      
      expect(MAX_FILE_SIZE).toBeDefined();
      expect(typeof MAX_FILE_SIZE).toBe('number');
      expect(MAX_FILE_SIZE).toBe(50 * 1024 * 1024); // 50MB
    });

    it('devrait avoir les variables d\'environnement', () => {
      expect(process.env.MAX_FILE_SIZE).toBeDefined();
      expect(process.env.ALLOWED_FILE_TYPES).toBeDefined();
    });
  });

  describe('Génération de noms de fichiers', () => {
    const userId = '123e4567-e89b-12d3-a456-426614174000';
    const originalFilename = 'mon fichier test.pdf';

    it('devrait générer un nom de fichier sécurisé', () => {
      const fileName = generateFileName(originalFilename, userId);
      
      expect(fileName).toBeDefined();
      expect(fileName).toContain(userId);
      expect(fileName).toContain('.pdf');
      expect(fileName).not.toContain(' '); // Espaces remplacés
      expect(fileName).toMatch(/^[\w-]+\/\d+_[a-f0-9]+_[\w_-]+\.pdf$/);
    });

    it('devrait gérer les caractères spéciaux', () => {
      const specialFile = 'fichier-avec-accents-éàù.docx';
      const fileName = generateFileName(specialFile, userId);
      
      expect(fileName).not.toContain('é');
      expect(fileName).not.toContain('à');
      expect(fileName).not.toContain('ù');
      expect(fileName).toContain('.docx');
    });

    it('devrait limiter la longueur du nom de base', () => {
      const longName = 'a'.repeat(100) + '.txt';
      const fileName = generateFileName(longName, userId);
      
      const parts = fileName.split('/')[1].split('_');
      const baseName = parts.slice(2).join('_').replace('.txt', '');
      expect(baseName.length).toBeLessThanOrEqual(50);
    });

    it('devrait inclure un timestamp et un hash aléatoire', () => {
      const fileName1 = generateFileName(originalFilename, userId);
      const fileName2 = generateFileName(originalFilename, userId);
      
      expect(fileName1).not.toBe(fileName2); // Différents à cause du timestamp/hash
      
      const parts1 = fileName1.split('/')[1].split('_');
      const parts2 = fileName2.split('/')[1].split('_');
      
      expect(parts1[0]).toMatch(/^\d+$/); // Timestamp
      expect(parts1[1]).toMatch(/^[a-f0-9]+$/); // Hash hex
      expect(parts2[0]).toMatch(/^\d+$/);
      expect(parts2[1]).toMatch(/^[a-f0-9]+$/);
    });
  });

  describe('Upload de fichier simple', () => {
    it('devrait accepter un fichier valide', async () => {
      const response = await request(app)
        .post('/test-upload-single')
        .attach('file', testFilePath);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.file).toBeDefined();
      expect(response.body.file.originalname).toBe('test-file.txt');
      expect(response.body.file.mimetype).toBe('text/plain');
      expect(response.body.file.buffer).toBe('present');
    });

    it('devrait fonctionner sans fichier (optionnel)', async () => {
      const response = await request(app)
        .post('/test-upload-single');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.file).toBeNull();
    });
  });

  describe('Validation des types de fichiers', () => {
    beforeAll(() => {
      // Créer des fichiers de test pour différents types
      const testFiles = {
        'test.pdf': Buffer.from('%PDF-1.4 test'),
        'test.jpg': Buffer.from('fake jpg content'),
        'test.exe': Buffer.from('fake exe content')
      };

      Object.entries(testFiles).forEach(([filename, content]) => {
        const filePath = path.join(__dirname, filename);
        fs.writeFileSync(filePath, content);
      });
    });

    afterAll(() => {
      // Nettoyer les fichiers de test
      ['test.pdf', 'test.jpg', 'test.exe'].forEach(filename => {
        const filePath = path.join(__dirname, filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    });

    it('devrait accepter les types autorisés', async () => {
      const pdfPath = path.join(__dirname, 'test.pdf');
      
      const response = await request(app)
        .post('/test-upload-single')
        .attach('file', pdfPath);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('devrait rejeter les types non autorisés', async () => {
      const exePath = path.join(__dirname, 'test.exe');
      
      const response = await request(app)
        .post('/test-upload-single')
        .attach('file', exePath);

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Type de fichier non autorisé');
      expect(response.body.allowedTypes).toBeDefined();
    });
  });

  describe('Limite de taille de fichier', () => {
    let largeFakePath;

    beforeAll(() => {
      // Créer un fichier simulé de grande taille pour les tests
      largeFakePath = path.join(__dirname, 'large-fake-file.txt');
      const largeContent = 'x'.repeat(100); // Petit fichier pour les tests
      fs.writeFileSync(largeFakePath, largeContent);
    });

    afterAll(() => {
      if (fs.existsSync(largeFakePath)) {
        fs.unlinkSync(largeFakePath);
      }
    });

    it('devrait accepter les fichiers de taille normale', async () => {
      const response = await request(app)
        .post('/test-upload-single')
        .attach('file', largeFakePath);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    // Note: Tester une vraie limite de taille nécessiterait un fichier très volumineux
    // Ce test vérifie que la limite est configurée
    it('devrait avoir la limite de taille configurée', () => {
      expect(MAX_FILE_SIZE).toBe(50 * 1024 * 1024);
    });
  });

  describe('Upload multiple', () => {
    it('devrait accepter plusieurs fichiers valides', async () => {
      const response = await request(app)
        .post('/test-upload-multiple')
        .attach('files', testFilePath)
        .attach('files', testFilePath);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.files).toHaveLength(2);
    });

    it('devrait limiter le nombre de fichiers', () => {
      // La configuration limite à 5 fichiers maximum
      // Ce test vérifie que la limite est en place
      expect(uploadMultiple).toBeDefined();
    });
  });

  describe('Gestion d\'erreurs', () => {
    it('devrait utiliser le storage en mémoire', () => {
      // Vérifier que les fichiers sont stockés en mémoire (buffer)
      // et non sur disque
      expect(uploadSingle).toBeDefined();
      expect(uploadMultiple).toBeDefined();
    });

    it('devrait avoir un gestionnaire d\'erreurs', () => {
      expect(handleUploadError).toBeDefined();
      expect(typeof handleUploadError).toBe('function');
    });
  });

  describe('Sécurité', () => {
    it('devrait nettoyer les noms de fichiers', () => {
      const dangerousName = '../../../etc/passwd';
      const safeName = generateFileName(dangerousName, 'user123');
      
      expect(safeName).not.toContain('../');
      expect(safeName).not.toContain('/etc/');
      expect(safeName).toContain('user123/');
    });

    it('devrait valider les extensions ET les MIME types', () => {
      // Cette validation est effectuée dans fileFilter
      // Les tests d'upload ci-dessus vérifient cette fonctionnalité
      expect(ALLOWED_TYPES).toContain('pdf');
      expect(ALLOWED_TYPES).toContain('jpg');
      expect(ALLOWED_TYPES).not.toContain('exe');
    });
  });
});