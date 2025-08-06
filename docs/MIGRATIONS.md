# 🗄️ Guide des Migrations - Diagana School

## Vue d'ensemble

Les migrations de base de données doivent être exécutées **manuellement** dans votre dashboard Supabase. Elles créent toutes les tables, triggers, fonctions et données initiales nécessaires au fonctionnement de l'application.

## 📋 Ordre d'exécution

Les fichiers SQL doivent être exécutés **dans l'ordre exact** suivant :

### 1. `mig-1.sql` - Tables principales ✅
**Contenu :**
- Tables utilisateurs et authentification
- Tables ressources et collections
- Tables interactions (likes, favoris, commentaires)
- Tables suivi social (follows)
- Contraintes et relations

### 2. `mig-2.sql` - Triggers et fonctions ✅
**Contenu :**
- Fonction `update_updated_at_column()`
- Triggers pour timestamps automatiques
- Triggers pour compteurs automatiques
- Fonctions helper pour authentification

### 3. `mig-3.sql` - Données initiales ✅
**Contenu :**
- 30 clés d'inscription pré-générées
- Vues optimisées (`user_stats`, `popular_ressources`)
- Fonction de recherche full-text
- Index pour performances

### 4. `mig-4.sql` - Optimisations ✅
**Contenu :**
- Index supplémentaires pour performances
- Politiques RLS (Row Level Security)
- Optimisations de requêtes
- Configuration finale

## 🚀 Procédure d'exécution

### Étape 1 : Accès à Supabase
1. Aller sur [supabase.com](https://supabase.com)
2. Se connecter à votre compte
3. Sélectionner votre projet Diagana School
4. Aller dans **SQL Editor**

### Étape 2 : Exécution des migrations

**Pour chaque fichier de migration :**

1. **Ouvrir le fichier** `backend/migrations/mig-X.sql`
2. **Copier tout le contenu** du fichier
3. **Coller dans SQL Editor** de Supabase
4. **Cliquer sur "Run"** pour exécuter
5. **Vérifier** qu'il n'y a pas d'erreurs
6. **Passer au fichier suivant**

### Étape 3 : Vérification

Après avoir exécuté toutes les migrations, vérifiez :

```sql
-- Vérifier les tables créées
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Vérifier les clés d'inscription
SELECT COUNT(*) FROM registration_keys;
-- Doit retourner 30

-- Vérifier les triggers
SELECT trigger_name, event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema = 'public';
```

## ⚠️ Points importants

### ❌ Ne pas exécuter
- **Jamais** exécuter les migrations en désordre
- **Jamais** exécuter une migration deux fois
- **Jamais** modifier le contenu des fichiers SQL

### ✅ À faire
- **Toujours** respecter l'ordre d'exécution
- **Toujours** vérifier les messages de succès/erreur
- **Toujours** faire une sauvegarde avant les migrations
- **Toujours** tester l'API après les migrations

## 🆘 Dépannage

### Erreur "relation already exists"
```
ERROR: relation "users" already exists
```
**Cause :** La migration a déjà été exécutée  
**Solution :** Passer au fichier suivant

### Erreur de contrainte
```
ERROR: constraint "users_email_key" already exists
```
**Cause :** Tables partiellement créées  
**Solution :** Nettoyer la base et recommencer

### Erreur de permission
```
ERROR: permission denied for schema public
```
**Cause :** Utilisateur sans privilèges  
**Solution :** Utiliser le service_role ou admin

## 🔄 Reset complet (si nécessaire)

Si vous devez recommencer les migrations :

```sql
-- ⚠️ ATTENTION: Cela supprime TOUT !
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
```

Puis ré-exécutez toutes les migrations dans l'ordre.

## 📊 Contenu des migrations

### Migration 1 - Tables (mig-1.sql)
- `users` - Utilisateurs étendus
- `registration_keys` - Clés d'inscription
- `ressources` - Ressources pédagogiques
- `collections` - Collections de ressources
- `collection_ressources` - Liaison M-N
- `likes` - Système de likes
- `favoris` - Système de favoris
- `commentaires` - Commentaires avec threads
- `follows` - Suivi social
- `resource_views` - Statistiques de consultation

### Migration 2 - Fonctions (mig-2.sql)
- `update_updated_at_column()` - Auto-update timestamps
- Triggers `updated_at` sur toutes les tables
- Triggers compteurs automatiques
- Fonctions helper authentification

### Migration 3 - Données (mig-3.sql)
- 10 clés professeurs (`PROF_2024_*`)
- 20 clés élèves (`ELEVE_2024_*`)
- Vues `user_stats`, `popular_ressources`
- Index de recherche full-text

### Migration 4 - Sécurité (mig-4.sql)
- Politiques RLS pour toutes les tables
- Index de performance supplémentaires
- Configuration Row Level Security
- Fonctions get_current_user_id()

## ✅ Checklist post-migration

- [ ] 15 tables créées dans `public` schema
- [ ] 30 clés d'inscription insérées
- [ ] Triggers actifs sur toutes les tables
- [ ] Politiques RLS activées
- [ ] Index de performance créés
- [ ] Vues optimisées disponibles
- [ ] API backend se connecte sans erreur
- [ ] Tests automatisés passent (87/87)

---

**🎉 Une fois les migrations terminées, votre base de données est prête !**

Vous pouvez maintenant démarrer l'application backend et tous les endpoints fonctionneront correctement.
