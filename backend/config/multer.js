const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const logger = require('../utils/logger');

const MAX_FILE_SIZE = process.env.MAX_FILE_SIZE ? 
  (process.env.MAX_FILE_SIZE.includes('MB') ? 
    parseInt(process.env.MAX_FILE_SIZE) * 1024 * 1024 : 
    parseInt(process.env.MAX_FILE_SIZE)) : 
  50 * 1024 * 1024; // 50MB
const ALLOWED_TYPES = process.env.ALLOWED_FILE_TYPES?.split(',') || [
  'pdf', 'docx', 'txt', 'jpg', 'jpeg', 'png', 'gif', 'mp4', 'avi', 'mov'
];

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const fileExtension = path.extname(file.originalname).toLowerCase().slice(1);
  const mimeTypeMap = {
    'pdf': 'application/pdf',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'txt': 'text/plain',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'mp4': 'video/mp4',
    'avi': 'video/avi',
    'mov': 'video/quicktime'
  };

  // Vérifier d'abord si l'extension est autorisée
  if (!ALLOWED_TYPES.includes(fileExtension)) {
    logger.warn(`Type de fichier non autorisé: ${fileExtension} (${file.mimetype})`);
    cb(new Error(`Type de fichier non autorisé: ${fileExtension}`), false);
    return;
  }

  // Ensuite vérifier le MIME type pour les extensions autorisées
  const expectedMimeType = mimeTypeMap[fileExtension];
  if (expectedMimeType && expectedMimeType === file.mimetype) {
    cb(null, true);
  } else if (file.mimetype.startsWith('image/') && ['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
    cb(null, true);
  } else if (file.mimetype.startsWith('video/') && ['mp4', 'avi', 'mov'].includes(fileExtension)) {
    cb(null, true);
  } else if (file.mimetype.startsWith('application/') && ['pdf', 'docx'].includes(fileExtension)) {
    cb(null, true);
  } else {
    logger.warn(`Type de fichier non autorisé: ${fileExtension} (${file.mimetype})`);
    cb(new Error(`Type de fichier non autorisé: ${fileExtension}`), false);
  }
};

const generateFileName = (originalname, userId) => {
  const timestamp = Date.now();
  const randomString = crypto.randomBytes(8).toString('hex');
  const extension = path.extname(originalname);
  const baseName = path.basename(originalname, extension)
    .replace(/[^a-zA-Z0-9\-_]/g, '_')
    .substring(0, 50);
  
  return `${userId}/${timestamp}_${randomString}_${baseName}${extension}`;
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 5
  }
});

const uploadSingle = upload.single('file');
const uploadMultiple = upload.array('files', 5);

// Middleware pour ressources : champs texte + fichier optionnel
const uploadResourceFields = upload.fields([
  { name: 'file', maxCount: 1 }  // Fichier optionnel
]);

// Middleware personnalisé pour traiter les champs de ressource
const uploadResourceMiddleware = (req, res, next) => {
  uploadResourceFields(req, res, (error) => {
    if (error) {
      return next(error);
    }
    
    // Réorganiser les fichiers pour compatibilité avec le code existant
    if (req.files && req.files.file && req.files.file[0]) {
      req.file = req.files.file[0];
    }
    
    next();
  });
};

const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'Fichier trop volumineux',
        maxSize: `${MAX_FILE_SIZE / (1024 * 1024)}MB`
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        error: 'Trop de fichiers (maximum 5)'
      });
    }
  }
  
  if (error.message.includes('Type de fichier non autorisé')) {
    return res.status(400).json({
      error: error.message,
      allowedTypes: ALLOWED_TYPES
    });
  }
  
  logger.error('Erreur upload:', error);
  res.status(500).json({
    error: 'Erreur lors de l\'upload du fichier'
  });
};

module.exports = {
  uploadSingle,
  uploadMultiple,
  uploadResourceMiddleware,  // Nouveau middleware pour les ressources
  handleUploadError,
  generateFileName,
  ALLOWED_TYPES,
  MAX_FILE_SIZE
};
