# 🌳 Arborescence du Projet Diagana School

Voici la structure complète des fichiers et dossiers du projet.

```
.
├── backend/
│   ├── .env
│   ├── config/
│   │   ├── index.js
│   │   ├── jwt.js
│   │   ├── multer.js
│   │   ├── supabase.js
│   │   └── wasabi.js
│   ├── controllers/
│   │   ├── auth.js
│   │   ├── collections.js
│   │   ├── commentaires.js
│   │   ├── profil.js
│   │   └── ressources.js
│   ├── jest.config.js
│   ├── logs/
│   │   ├── access/
│   │   │   ├── .3071744da1ac583d7e6a5b54ae068724cd87fd6f-audit.json
│   │   │   ├── access-2025-08-05.log
│   │   │   └── access-2025-08-06.log
│   │   ├── error/
│   │   │   ├── .a5c446767f155366f1f2bcc98c9e175728358d69-audit.json
│   │   │   ├── error-2025-08-05.log
│   │   │   └── error-2025-08-06.log
│   │   └── info/
│   │       ├── .78b299ea40dab5d17d26bdb0c9e6a733df121221-audit.json
│   │       ├── combined-2025-08-05.log
│   │       └── combined-2025-08-06.log
│   ├── middlewares/
│   │   └── auth.js
│   ├── migrations/
│   │   ├── mig-1.sql
│   │   ├── mig-2.sql
│   │   ├── mig-3.sql
│   │   └── mig-4.sql
│   ├── models/
│   │   ├── auth.js
│   │   ├── collections.js
│   │   ├── commentaires.js
│   │   ├── profil.js
│   │   └── ressources.js
│   ├── package-lock.json
│   ├── package.json
│   ├── routes/
│   │   ├── auth.js
│   │   ├── collections.js
│   │   ├── commentaires.js
│   │   ├── index.js
│   │   ├── profil.js
│   │   └── ressources.js
│   ├── scripts/
│   │   ├── build.sh
│   │   └── start.sh
│   ├── server.js
│   ├── services/
│   │   ├── auth.js
│   │   ├── collections.js
│   │   ├── commentaires.js
│   │   ├── profil.js
│   │   └── ressources.js
│   ├── test/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── auth.test.js
│   │   │   ├── collections/
│   │   │   │   └── collections.test.js
│   │   │   ├── profil/
│   │   │   │   └── profil.test.js
│   │   │   └── ressources/
│   │   │       └── ressources.test.js
│   │   ├── config/
│   │   │   ├── config-only.test.js
│   │   │   ├── jwt.test.js
│   │   │   ├── multer.test.js
│   │   │   ├── simple-config.test.js
│   │   │   ├── supabase.test.js
│   │   │   └── wasabi.test.js
│   │   └── setup.js
│   ├── test-simple.js
│   └── utils/
│       └── logger.js
├── docs/
│   ├── auth.md
│   ├── collections.md
│   ├── evolution.md
│   ├── profil.md
│   ├── rapport-analyse-backend.md
│   ├── README.md
│   └── ressources.md
├── note-temp.md
└── note.txt