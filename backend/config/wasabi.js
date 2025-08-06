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
    const params = {
      Bucket: bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read'
    };

    const result = await s3.upload(params).promise();
    return {
      success: true,
      url: result.Location,
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

const generateSignedUrl = async (key, expires = 3600) => {
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