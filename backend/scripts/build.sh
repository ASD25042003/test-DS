#!/bin/bash

# Script de build pour Render
echo "🔧 Installation des dépendances..."
npm ci --only=production

echo "✅ Build terminé avec succès !"
echo "🚀 Prêt pour le démarrage..."
