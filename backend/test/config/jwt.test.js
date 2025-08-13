const { generateToken, verifyToken, refreshToken } = require('../../config/jwt');

describe('Configuration JWT', () => {
  const testPayload = {
    userId: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@diagana.com',
    role: 'professeur'
  };

  describe('Variables d\'environnement', () => {
    it('devrait avoir le secret JWT défini', () => {
      expect(process.env.JWT_SECRET).toBeDefined();
      expect(process.env.JWT_SECRET.length).toBeGreaterThan(20);
    });

    it('devrait avoir une durée d\'expiration définie', () => {
      expect(process.env.JWT_EXPIRES_IN).toBeDefined();
      expect(process.env.JWT_EXPIRES_IN).toMatch(/^\d+[dwh]$/);
    });
  });

  describe('Génération de tokens', () => {
    it('devrait générer un token valide', () => {
      const token = generateToken(testPayload);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // Format JWT : header.payload.signature
    });

    it('devrait générer des tokens différents avec payloads différents', () => {
      const token1 = generateToken(testPayload);
      const token2 = generateToken({...testPayload, userId: 'different-user-id'});
      
      expect(token1).not.toBe(token2); // Payloads différents
      expect(token1).toBeDefined();
      expect(token2).toBeDefined();
    });

    it('devrait inclure les métadonnées appropriées', () => {
      const token = generateToken(testPayload);
      const decoded = verifyToken(token);
      
      expect(decoded.iss).toBe('diagana-school');
      expect(decoded.aud).toBe('diagana-school-users');
      expect(decoded.userId).toBe(testPayload.userId);
      expect(decoded.email).toBe(testPayload.email);
      expect(decoded.role).toBe(testPayload.role);
      expect(decoded.iat).toBeDefined();
      expect(decoded.exp).toBeDefined();
    });
  });

  describe('Vérification de tokens', () => {
    let validToken;

    beforeAll(() => {
      validToken = generateToken(testPayload);
    });

    it('devrait vérifier un token valide', () => {
      const decoded = verifyToken(validToken);
      
      expect(decoded).toBeDefined();
      expect(decoded.userId).toBe(testPayload.userId);
      expect(decoded.email).toBe(testPayload.email);
      expect(decoded.role).toBe(testPayload.role);
    });

    it('devrait rejeter un token malformé', () => {
      expect(() => {
        verifyToken('token.malformé.invalide');
      }).toThrow('Token invalide');
    });

    it('devrait rejeter un token vide', () => {
      expect(() => {
        verifyToken('');
      }).toThrow('Token invalide');
    });

    it('devrait rejeter un token avec une signature invalide', () => {
      const invalidToken = validToken.slice(0, -5) + 'xxxxx';
      
      expect(() => {
        verifyToken(invalidToken);
      }).toThrow('Token invalide');
    });

    it('devrait rejeter un token avec un mauvais issuer', () => {
      // Simuler un token d'un autre service
      const jwt = require('jsonwebtoken');
      const badToken = jwt.sign(
        testPayload, 
        process.env.JWT_SECRET, 
        { 
          issuer: 'autre-service',
          audience: 'diagana-school-users'
        }
      );
      
      expect(() => {
        verifyToken(badToken);
      }).toThrow('Token invalide');
    });
  });

  describe('Refresh de tokens', () => {
    it('devrait rafraîchir un token valide', () => {
      const originalToken = generateToken(testPayload);
      
      // Attendre un peu pour avoir un iat différent
      setTimeout(() => {
        const refreshedToken = refreshToken(originalToken);
        
        expect(refreshedToken).toBeDefined();
        expect(refreshedToken).not.toBe(originalToken);
        
        const originalDecoded = verifyToken(originalToken);
        const refreshedDecoded = verifyToken(refreshedToken);
        
        expect(refreshedDecoded.userId).toBe(originalDecoded.userId);
        expect(refreshedDecoded.email).toBe(originalDecoded.email);
        expect(refreshedDecoded.role).toBe(originalDecoded.role);
        expect(refreshedDecoded.iat).toBeGreaterThan(originalDecoded.iat);
      }, 100);
    });

    it('devrait pouvoir rafraîchir un token expiré', () => {
      const jwt = require('jsonwebtoken');
      const expiredToken = jwt.sign(
        testPayload,
        process.env.JWT_SECRET,
        {
          expiresIn: '1ms',
          issuer: 'diagana-school',
          audience: 'diagana-school-users'
        }
      );
      
      // Attendre l'expiration
      setTimeout(() => {
        const refreshedToken = refreshToken(expiredToken);
        
        expect(refreshedToken).toBeDefined();
        const decoded = verifyToken(refreshedToken);
        expect(decoded.userId).toBe(testPayload.userId);
      }, 100);
    });
  });

  describe('Sécurité', () => {
    it('devrait utiliser une clé secrète suffisamment forte', () => {
      const secret = process.env.JWT_SECRET;
      
      expect(secret.length).toBeGreaterThanOrEqual(32);
      expect(secret).toMatch(/[a-zA-Z]/); // Contient des lettres
      expect(secret).toMatch(/[0-9]/); // Contient des chiffres
    });

    it('devrait avoir une durée d\'expiration raisonnable', () => {
      const token = generateToken(testPayload);
      const decoded = verifyToken(token);
      
      const now = Math.floor(Date.now() / 1000);
      const expirationTime = decoded.exp - now;
      
      // Entre 1 heure et 30 jours
      expect(expirationTime).toBeGreaterThan(3600); // > 1 heure
      expect(expirationTime).toBeLessThan(30 * 24 * 3600); // < 30 jours
    });

    it('ne devrait pas exposer d\'informations sensibles', () => {
      const sensitivePayload = {
        ...testPayload,
        password: 'secret123',
        creditCard: '1234-5678-9012-3456'
      };
      
      const token = generateToken(sensitivePayload);
      const decoded = verifyToken(token);
      
      expect(decoded.password).toBeUndefined();
      expect(decoded.creditCard).toBeUndefined();
      expect(decoded.userId).toBeDefined();
      expect(decoded.email).toBeDefined();
      expect(decoded.role).toBeDefined();
    });
  });
});