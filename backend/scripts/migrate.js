require('dotenv').config();
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const { supabaseAdmin } = require('../config/supabase');
const logger = require('../utils/logger');

class MigrationManager {
  constructor() {
    this.migrationsDir = path.join(__dirname, '../migrations');
    this.tableName = 'migrations_log';
  }

  async init() {
    await this.ensureMigrationsTable();
  }

  async ensureMigrationsTable() {
    try {
      // Tenter de vérifier si la table existe déjà
      const { data, error: selectError } = await supabaseAdmin
        .from(this.tableName)
        .select('id')
        .limit(1);
      
      if (selectError && selectError.code === 'PGRST116') {
        // Table n'existe pas, on doit l'informer à l'utilisateur
        logger.info('⚠️ La table migrations_log doit être créée manuellement dans Supabase');
        logger.info('📝 Exécutez cette requête SQL dans l\'éditeur Supabase :');
        logger.info(`
CREATE TABLE IF NOT EXISTS ${this.tableName} (
  id SERIAL PRIMARY KEY,
  filename VARCHAR(255) NOT NULL UNIQUE,
  hash VARCHAR(64) NOT NULL,
  executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) DEFAULT 'success',
  error_message TEXT
);`);
        throw new Error('Table migrations_log manquante - voir instructions ci-dessus');
      }
      
      logger.info('✅ Table migrations_log prête');
    } catch (error) {
      logger.error('❌ Erreur initialisation table migrations:', error.message);
      throw error;
    }
  }

  async getMigrationFiles() {
    try {
      const files = await fs.readdir(this.migrationsDir);
      return files
        .filter(file => file.endsWith('.sql'))
        .sort();
    } catch (error) {
      if (error.code === 'ENOENT') {
        logger.warn('Dossier migrations introuvable, création...');
        await fs.mkdir(this.migrationsDir, { recursive: true });
        return [];
      }
      throw error;
    }
  }

  async getExecutedMigrations() {
    try {
      const { data, error } = await supabaseAdmin
        .from(this.tableName)
        .select('filename, hash, status')
        .eq('status', 'success');

      if (error) throw error;
      
      return data.reduce((acc, row) => {
        acc[row.filename] = row.hash;
        return acc;
      }, {});
    } catch (error) {
      logger.error('Erreur récupération migrations exécutées:', error);
      return {};
    }
  }

  async calculateFileHash(filePath) {
    const content = await fs.readFile(filePath, 'utf8');
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  async executeMigration(filename) {
    const filePath = path.join(this.migrationsDir, filename);
    const content = await fs.readFile(filePath, 'utf8');
    const hash = await this.calculateFileHash(filePath);

    try {
      logger.info(`🔄 Exécution migration: ${filename}`);
      
      const statements = content
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0);

      // Pour Supabase, nous devons informer l'utilisateur d'exécuter manuellement
      logger.info(`📝 Veuillez exécuter manuellement cette migration dans l'éditeur SQL Supabase :`);
      logger.info('=====================================');
      logger.info(content);
      logger.info('=====================================');
      logger.info('⚠️ Après exécution, appuyez sur Entrée pour continuer...');
      
      // En mode automatique pour les tests, on simule la réussite
      if (process.env.NODE_ENV === 'test') {
        logger.info('🧪 Mode test - migration simulée comme réussie');
      } else {
        // En production, attendre confirmation manuelle
        const readline = require('readline');
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });
        
        await new Promise(resolve => {
          rl.question('Migration exécutée manuellement ? (y/N): ', (answer) => {
            rl.close();
            if (answer.toLowerCase() !== 'y') {
              throw new Error('Migration annulée par l\'utilisateur');
            }
            resolve();
          });
        });
      }

      await this.logMigration(filename, hash, 'success');
      logger.info(`✅ Migration réussie: ${filename}`);
      
      return { success: true };
    } catch (error) {
      await this.logMigration(filename, hash, 'error', error.message);
      logger.error(`❌ Migration échouée: ${filename} - ${error.message}`);
      throw error;
    }
  }

  async logMigration(filename, hash, status, errorMessage = null) {
    try {
      const { error } = await supabaseAdmin
        .from(this.tableName)
        .upsert({
          filename,
          hash,
          status,
          error_message: errorMessage,
          executed_at: new Date().toISOString()
        }, {
          onConflict: 'filename'
        });

      if (error) {
        logger.error('Erreur log migration:', error);
      }
    } catch (error) {
      logger.error('Erreur log migration:', error);
    }
  }

  async run() {
    try {
      logger.info('🚀 Début des migrations');
      
      await this.init();
      
      const migrationFiles = await this.getMigrationFiles();
      const executedMigrations = await this.getExecutedMigrations();
      
      if (migrationFiles.length === 0) {
        logger.info('📭 Aucun fichier de migration trouvé');
        return;
      }

      let executed = 0;
      let skipped = 0;

      for (const filename of migrationFiles) {
        const filePath = path.join(this.migrationsDir, filename);
        const currentHash = await this.calculateFileHash(filePath);
        
        if (executedMigrations[filename] === currentHash) {
          logger.info(`⏭️  Migration déjà exécutée: ${filename}`);
          skipped++;
          continue;
        }

        await this.executeMigration(filename);
        executed++;
      }

      logger.info(`🎉 Migrations terminées: ${executed} exécutées, ${skipped} ignorées`);
      
    } catch (error) {
      logger.error('💥 Erreur critique migrations:', error);
      process.exit(1);
    }
  }
}

if (require.main === module) {
  const migrationManager = new MigrationManager();
  migrationManager.run()
    .then(() => {
      logger.info('✅ Processus de migration terminé');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('❌ Erreur processus migration:', error);
      process.exit(1);
    });
}

module.exports = MigrationManager;