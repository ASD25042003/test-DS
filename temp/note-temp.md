
pour le contexte et comprendre le projet tu doit obligatoirement 
lire et comprendre la documentation complete : voir  README.md et le 
rpertoire docs .


probleme a resoudre :


la creattion de ressource de type media fonctionne mais l'image 
na pas laire d'avoir ete uploader . elle nest ni visible dans 
wasabi ni consultable dans linterface voir temp-image\{86DF0F2A-5274-4392-8AC2-7196FA529B74}.png   
malgres le message de succes , a noter que les fichiers pdf , docx et txt fonctionne et son accecible apres upload .

je veux que tu passe par une analyse et comprehension complete et profonde du module a tous les couches niveau backend frontend  avant dessayer de resoudre le probleme .
note: je vais une vrai analyse pas juste survoler quelque fichiers 







logs terminale :


info: ::1 - - [12/Aug/2025:23:02:50 +0000] "GET /api/ressources?page=1&limit=50 HTTP/1.1" 304 - "-" "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36" {"service":"diagana-school-backend","timestamp":"2025-08-12 23:02:50"}    
Données reçues côté serveur: {
  titre: 'ressource-2',
  type: 'media',
  matiere: 'Espagnol',
  niveau: '2nde',
  contenu: { description: '' },     
  tags: [ '[]' ],
  hasFile: true,
  rawBody: [Object: null prototype] {
    titre: 'ressource-2',
    description: 'testtesttesttesttesttesttesttesttestv',
    type: 'media',
    matiere: 'Espagnol',
    niveau: '2nde',
    tags: '[]',
    contenu: '{"description":""}',  
    is_public: 'true'
  }
}
info: Nouvelle ressource créée: 69c7d405-d047-42cf-973b-99fa84252587 par db0595dd-48ee-4f8c-8506-ec24923976af {"service":"diagana-school-backend","timestamp":"2025-08-12 23:03:52"}


