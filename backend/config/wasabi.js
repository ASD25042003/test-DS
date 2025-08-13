const AWS = require('aws-sdk');
const logger = require('../utils/logger');

const wasabiConfig = {
  accessKeyId: process.env.WASABI_ACCESS_KEY,
  secretAccessKey: process.env.WASABI_SECRET_KEY,
  region: process.env.WASABI_REGION || 'eu-west-2',
  endpoint: process.env.WASABI_ENDPOINT || 'https://s3.eu-west-2.wasabisys.com'
};

if (!wasabiConfig.accessKeyId || !wasabiConfig.secretAccessKey) {
  logger.error('Configuration Wasabi manquante');
  throw new Error('Configuration Wasabi manquante');
}

const s3 = new AWS.S3(wasabiConfig);

const bucket = process.env.WASABI_BUCKET || 'diagana-school-files';

const testConnection = async () => {
  try {
    await s3.headBucket({ Bucket: bucket }).promise();
    logger.info('✅ Connexion Wasabi établie');
    return true;
  } catch (error) {
    logger.error('❌ Erreur connexion Wasabi:', error.message);
    return false;
  }
};

const uploadFile = async (file, key) => {
  try {
    logger.info(`🚀 Début upload Wasabi - Fichier: ${file.originalname}, Type: ${file.mimetype}, Taille: ${file.size} bytes`);
    logger.info(`📁 Clé S3: ${key}`);
    
    const params = {
      Bucket: bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      // ACL: 'public-read' // Désactivé car l'accès public n'est pas autorisé
    };

    const result = await s3.upload(params).promise();
    logger.info(`✅ Upload S3 réussi - Location: ${result.Location}, Key: ${result.Key}`);
    
    // Générer une URL signée car l'accès public n'est pas autorisé
    const signedUrl = s3.getSignedUrl('getObject', {
      Bucket: bucket,
      Key: result.Key,
      Expires: 365 * 24 * 60 * 60 // 12 mois (365 jours)
    });
    logger.info(`🔗 URL signée générée avec succès`);
    
    return {
      success: true,
      url: signedUrl,
      key: result.Key
    };
  } catch (error) {
    logger.error('Erreur upload Wasabi:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

const deleteFile = async (key) => {
  try {
    await s3.deleteObject({
      Bucket: bucket,
      Key: key
    }).promise();
    return { success: true };
  } catch (error) {
    logger.error('Erreur suppression Wasabi:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

const generateSignedUrl = async (key, expires = 365 * 24 * 60 * 60) => {
  try {
    const url = s3.getSignedUrl('getObject', {
      Bucket: bucket,
      Key: key,
      Expires: expires
    });
    return { success: true, url };
  } catch (error) {
    logger.error('Erreur génération URL signée:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  s3,
  bucket,
  testConnection,
  uploadFile,
  deleteFile,
  generateSignedUrl
};