const supabaseConfig = require('./supabase');
const wasabiConfig = require('./wasabi');
const jwtConfig = require('./jwt');
const multerConfig = require('./multer');

module.exports = {
  supabase: supabaseConfig,
  wasabi: wasabiConfig,
  jwt: jwtConfig,
  multer: multerConfig
};