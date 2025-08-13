#!/usr/bin/env node

/**
 * Script de diagnostic pré-déploiement Diagana School
 * Vérifie que tous les prérequis sont remplis avant déploiement sur Render
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 DIAGNOSTIC PRÉ-DÉPLOIEMENT DIAGANA SCHOOL\n');
console.log('=' .repeat(60));

let issues = [];
let warnings = [];

// Fonction utilitaire pour vérifier l'existence d'un fichier
function checkFile(filepath, required = true) {
    const exists = fs.existsSync(filepath);
    if (required && !exists) {
        issues.push(`❌ Fichier manquant: ${filepath}`);
    } else if (!required && !exists) {
        warnings.push(`⚠️  Fichier optionnel manquant: ${filepath}`);
    } else {
        console.log(`✅ ${filepath}`);
    }
    return exists;
}

// Fonction pour vérifier le contenu d'un fichier
function checkFileContent(filepath, searchText, description) {
    if (!fs.existsSync(filepath)) {
        issues.push(`❌ ${description}: fichier ${filepath} manquant`);
        return false;
    }
    
    const content = fs.readFileSync(filepath, 'utf8');
    if (content.includes(searchText)) {
        console.log(`✅ ${description}`);
        return true;
    } else {
        issues.push(`❌ ${description}: contenu manquant dans ${filepath}`);
        return false;
    }
}

// 1. Vérification des fichiers de configuration essentiels
console.log('\n1. 📋 FICHIERS DE CONFIGURATION');
console.log('-'.repeat(40));
checkFile('render.yaml');
checkFile('backend/.env.example');
checkFile('backend/package.json');
checkFile('.gitignore');
checkFile('Procfile', false); // Optionnel
checkFile('DEPLOYMENT_RENDER.md');

// 2. Vérification de la structure backend
console.log('\n2. 🔧 STRUCTURE BACKEND');
console.log('-'.repeat(40));
checkFile('backend/server.js');
checkFile('backend/config/index.js');
checkFile('backend/config/supabase.js');
checkFile('backend/config/wasabi.js');
checkFile('backend/routes/index.js');

// 3. Vérification des migrations Supabase
console.log('\n3. 🗄️ MIGRATIONS SUPABASE');
console.log('-'.repeat(40));
checkFile('backend/migrations/mig-1.sql');
checkFile('backend/migrations/mig-2.sql');
checkFile('backend/migrations/mig-3.sql');
checkFile('backend/migrations/mig-4.sql');

// 4. Vérification de la structure frontend
console.log('\n4. 🎨 STRUCTURE FRONTEND');
console.log('-'.repeat(40));
checkFile('frontend/pages/index.html');
checkFile('frontend/pages/auth.html');
checkFile('frontend/pages/home.html');
checkFile('frontend/js/home.js');
checkFile('frontend/styles/main.css');
checkFile('frontend/api/index.js');

// 5. Vérification du contenu des fichiers critiques
console.log('\n5. 🔍 CONTENU DES FICHIERS CRITIQUES');
console.log('-'.repeat(40));

// Vérification du .gitignore
checkFileContent('.gitignore', 'temp/', 'Dossier temp/ ignoré');
checkFileContent('.gitignore', 'temp-image/', 'Dossier temp-image/ ignoré');
checkFileContent('.gitignore', 'test-CAT/', 'Dossier test-CAT/ ignoré');

// Vérification du render.yaml
checkFileContent('render.yaml', 'cd backend && npm ci', 'Build command correcte dans render.yaml');
checkFileContent('render.yaml', 'cd backend && npm start', 'Start command correcte dans render.yaml');

// Vérification du server.js
checkFileContent('backend/server.js', '/health', 'Health check endpoint présent');
checkFileContent('backend/server.js', 'helmet', 'Configuration sécurité Helmet présente');

// 6. Vérification des dépendances Node.js
console.log('\n6. 📦 DÉPENDANCES NODE.JS');
console.log('-'.repeat(40));
try {
    const packageJson = JSON.parse(fs.readFileSync('backend/package.json', 'utf8'));
    
    const criticalDeps = [
        'express', 'cors', 'helmet', 'compression', 
        '@supabase/supabase-js', 'aws-sdk', 'jsonwebtoken', 
        'multer', 'joi', 'winston'
    ];
    
    let missingDeps = [];
    criticalDeps.forEach(dep => {
        if (packageJson.dependencies[dep]) {
            console.log(`✅ Dépendance: ${dep}`);
        } else {
            missingDeps.push(dep);
        }
    });
    
    if (missingDeps.length > 0) {
        issues.push(`❌ Dépendances manquantes: ${missingDeps.join(', ')}`);
    }
    
    // Vérification version Node.js requise
    if (packageJson.engines && packageJson.engines.node) {
        console.log(`✅ Version Node.js spécifiée: ${packageJson.engines.node}`);
    } else {
        warnings.push('⚠️  Version Node.js non spécifiée dans package.json');
    }
    
} catch (error) {
    issues.push('❌ Impossible de lire backend/package.json');
}

// 7. Vérification de la documentation
console.log('\n7. 📚 DOCUMENTATION');
console.log('-'.repeat(40));
checkFile('README.md');
checkFile('docs/01-GUIDE-INSTALLATION.md');
checkFile('docs/02-ARCHITECTURE.md');
checkFile('DEPLOYMENT_RENDER.md');

// 8. Vérification des variables d'environnement template
console.log('\n8. 🔐 VARIABLES D\'ENVIRONNEMENT TEMPLATE');
console.log('-'.repeat(40));
try {
    const envExample = fs.readFileSync('backend/.env.example', 'utf8');
    const requiredEnvVars = [
        'NODE_ENV', 'PORT', 
        'SUPABASE_URL', 'SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY',
        'WASABI_ACCESS_KEY', 'WASABI_SECRET_KEY', 'WASABI_BUCKET', 'WASABI_REGION',
        'JWT_SECRET', 'JWT_EXPIRES_IN',
        'MAX_FILE_SIZE', 'ALLOWED_FILE_TYPES'
    ];
    
    let missingVars = [];
    requiredEnvVars.forEach(envVar => {
        if (envExample.includes(envVar + '=')) {
            console.log(`✅ Variable: ${envVar}`);
        } else {
            missingVars.push(envVar);
        }
    });
    
    if (missingVars.length > 0) {
        issues.push(`❌ Variables d'environnement manquantes dans .env.example: ${missingVars.join(', ')}`);
    }
    
} catch (error) {
    issues.push('❌ Impossible de lire backend/.env.example');
}

// Résumé final
console.log('\n' + '='.repeat(60));
console.log('📊 RÉSUMÉ DU DIAGNOSTIC');
console.log('='.repeat(60));

if (issues.length === 0 && warnings.length === 0) {
    console.log('🎉 PARFAIT ! Aucun problème détecté.');
    console.log('✅ Votre projet est prêt pour le déploiement sur Render.');
    console.log('\n👉 Étapes suivantes:');
    console.log('   1. Commiter et pusher les changements sur GitHub');
    console.log('   2. Suivre le guide DEPLOYMENT_RENDER.md');
    console.log('   3. Configurer les variables d\'environnement sur Render');
} else {
    console.log(`⚠️  ATTENTION: ${issues.length} problème(s) critique(s) détecté(s)`);
    console.log(`💡 INFO: ${warnings.length} avertissement(s)`);
}

if (issues.length > 0) {
    console.log('\n🚨 PROBLÈMES CRITIQUES À CORRIGER:');
    issues.forEach(issue => console.log('   ' + issue));
}

if (warnings.length > 0) {
    console.log('\n⚠️  AVERTISSEMENTS:');
    warnings.forEach(warning => console.log('   ' + warning));
}

if (issues.length === 0) {
    console.log('\n🔧 PROCHAINES ÉTAPES RECOMMANDÉES:');
    console.log('   1. Tester en local: cd backend && npm run dev');
    console.log('   2. Vérifier les migrations Supabase sont exécutées');
    console.log('   3. Confirmer les configurations Wasabi S3');
    console.log('   4. Déployer sur Render en suivant DEPLOYMENT_RENDER.md');
}

console.log('\n' + '='.repeat(60));
console.log('🎓 Diagana School - Diagnostic Déploiement v1.0');
console.log('='.repeat(60));

// Exit avec le bon code de sortie
process.exit(issues.length > 0 ? 1 : 0);
