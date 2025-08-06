#!/bin/bash

# Script de démarrage pour production
echo "🚀 Démarrage Diagana School Backend..."
echo "📊 Node version: $(node -v)"
echo "📦 NPM version: $(npm -v)"

# Vérifier que les variables d'environnement sont présentes
if [ -z "$SUPABASE_URL" ]; then
  echo "❌ ERREUR: SUPABASE_URL n'est pas définie"
  exit 1
fi

if [ -z "$JWT_SECRET" ]; then
  echo "❌ ERREUR: JWT_SECRET n'est pas définie"
  exit 1
fi

echo "✅ Variables d'environnement OK"

# Appliquer les migrations si nécessaire
if [ "$RUN_MIGRATIONS" = "true" ]; then
  echo "🗄️ Application des migrations..."
  npm run migrate
fi

echo "🎯 Démarrage du serveur sur le port $PORT..."
npm start
