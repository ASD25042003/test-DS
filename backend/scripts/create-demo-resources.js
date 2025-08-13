#!/usr/bin/env node

/**
 * Script pour créer des ressources de démonstration
 * Utilise directement les modèles et services backend
 */

const RessourcesService = require('../services/ressources');
const AuthModel = require('../models/auth');
const logger = require('../utils/logger');

async function createDemoResources() {
    try {
        console.log('🚀 Création des ressources de démonstration...');

        // 1. Créer ou récupérer un utilisateur de test
        let testUser;
        try {
            // Essayer de trouver un utilisateur existant
            const usersResult = await AuthModel.getAllUsers();
            const existingUsers = usersResult.users || [];
            testUser = existingUsers.find(user => user.role === 'professeur');
            
            if (!testUser) {
                console.log('❌ Aucun utilisateur professeur trouvé. Veuillez d\'abord créer un compte professeur via l\'interface.');
                process.exit(1);
            }
            
            console.log(`✅ Utilisateur trouvé: ${testUser.nom} ${testUser.prenom} (${testUser.role})`);
        } catch (error) {
            console.error('❌ Erreur lors de la récupération des utilisateurs:', error);
            process.exit(1);
        }

        // 2. Ressources de démonstration à créer (tous types de consultation)
        const demoResources = [
            // Vidéo YouTube pour test lecteur intégré
            {
                titre: 'Cours de Physique - Les forces et mouvements',
                description: 'Vidéo YouTube explicative sur les concepts de forces et mouvements en physique niveau 3ème. Parfaite pour comprendre les bases de la mécanique.',
                type: 'lien',
                matiere: 'Physique',
                niveau: '3ème',
                tags: ['physique', 'forces', 'mouvements'],
                contenu: {
                    url: 'https://www.youtube.com/watch?v=JhHMJCUmq28',
                    description: 'Vidéo de 12 minutes avec animations et exemples concrets'
                },
                is_public: true
            },
            // Document PDF pour test lecteur PDF
            {
                titre: 'Guide Mathématiques - Fonctions et graphiques',
                description: 'Document PDF complet sur les fonctions mathématiques avec graphiques, exemples et exercices corrigés pour le niveau 2nde.',
                type: 'document',
                matiere: 'Mathématiques', 
                niveau: '2nde',
                tags: ['fonctions', 'graphiques', 'mathématiques'],
                contenu: {
                    file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
                    file_name: 'guide-fonctions.pdf',
                    file_type: 'application/pdf',
                    description: 'PDF de 18 pages avec exercices progressifs'
                },
                is_public: true
            },
            // Image pour test visionneuse
            {
                titre: 'Carte géologique de la France',
                description: 'Carte détaillée de la géologie française montrant les différentes formations rocheuses et leur répartition sur le territoire.',
                type: 'media',
                matiere: 'Sciences de la Terre',
                niveau: '1ère',
                tags: ['géologie', 'france', 'roches'],
                contenu: {
                    file_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/France_geology_map-fr.svg/800px-France_geology_map-fr.svg.png',
                    file_name: 'carte-geologique-france.png',
                    file_type: 'image/png',
                    description: 'Carte haute résolution avec légende détaillée'
                },
                is_public: true
            },
            // Lien externe pour test ouverture
            {
                titre: 'Musée virtuel - Louvre Collections',
                description: 'Visite virtuelle interactive des collections du musée du Louvre avec zoom haute définition sur les œuvres majeures.',
                type: 'lien',
                matiere: 'Arts',
                niveau: 'Tous niveaux',
                tags: ['musée', 'art', 'virtuel'],
                contenu: {
                    url: 'https://www.louvre.fr/en/online-tours',
                    description: 'Visite interactive avec œuvres en très haute résolution'
                },
                is_public: true
            },
            // Document Word pour test Google Docs Viewer
            {
                titre: 'Analyse littéraire - Le Petit Prince',
                description: 'Document Word détaillant l\'analyse complète de l\'œuvre d\'Antoine de Saint-Exupéry avec thèmes, symboles et interprétation.',
                type: 'document',
                matiere: 'Français',
                niveau: '6ème',
                tags: ['littérature', 'saint-exupéry', 'analyse'],
                contenu: {
                    file_url: 'https://file-examples.com/storage/fe6e1b7b8fd0ffeffa4bb68/2017/10/file_example_DOC_100kB.doc',
                    file_name: 'analyse-petit-prince.doc',
                    file_type: 'application/msword',
                    description: 'Document Word de 8 pages avec citations et références'
                },
                is_public: true
            },
            // Fichier texte pour test lecteur texte
            {
                titre: 'Vocabulaire Anglais - Thème voyage',
                description: 'Liste complète du vocabulaire anglais sur le thème du voyage avec traductions françaises et phrases d\'exemple.',
                type: 'document', 
                matiere: 'Anglais',
                niveau: '4ème',
                tags: ['vocabulaire', 'anglais', 'voyage'],
                contenu: {
                    file_url: 'https://www.learnenglish.de/basics/travel.txt',
                    file_name: 'vocabulaire-voyage.txt',
                    file_type: 'text/plain',
                    description: 'Fichier texte avec 150+ mots classés par catégorie'
                },
                is_public: true
            }
        ];

        // 3. Créer les ressources une par une
        let createdCount = 0;
        for (const resourceData of demoResources) {
            try {
                const result = await RessourcesService.createRessource(
                    resourceData,
                    null, // pas de fichier
                    testUser.id
                );
                
                if (result.success) {
                    console.log(`✅ Ressource créée: "${result.ressource.titre}"`);
                    createdCount++;
                } else {
                    console.log(`❌ Échec création: "${resourceData.titre}"`);
                }
            } catch (error) {
                console.error(`❌ Erreur création "${resourceData.titre}":`, error.message);
            }
        }

        console.log(`\n🎉 ${createdCount}/${demoResources.length} ressources créées avec succès!`);
        
        if (createdCount > 0) {
            console.log('\n📚 Les ressources sont maintenant disponibles dans l\'interface.');
            console.log('🔗 Rendez-vous sur http://localhost:3000/#resources pour les voir.');
            console.log('\n🎯 Types de consultation testables :');
            console.log('   🎥 YouTube - Lecteur vidéo intégré dans la modal');
            console.log('   📄 PDF - Lecteur PDF avec contrôles de taille');
            console.log('   🖼️ Image - Visionneuse avec zoom plein écran');
            console.log('   🔗 Lien externe - Ouverture directe dans nouvel onglet');
            console.log('   📝 Word - Google Docs Viewer intégré');
            console.log('   📄 Texte - Lecteur de contenu avec scroll');
            console.log('\n💡 Cliquez sur une ressource pour ouvrir la modal de consultation !');
        }

    } catch (error) {
        console.error('❌ Erreur générale:', error);
        process.exit(1);
    }
}

// Exécuter le script
if (require.main === module) {
    createDemoResources()
        .then(() => {
            console.log('\n✅ Script terminé avec succès');
            process.exit(0);
        })
        .catch((error) => {
            console.error('❌ Erreur fatale:', error);
            process.exit(1);
        });
}

module.exports = { createDemoResources };
