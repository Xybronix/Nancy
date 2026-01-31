# 📦 Guide : Export ZIP et Déploiement avec Fichiers

## 🎯 Objectif

Quand quelqu'un ajoute des photos/vidéos en ligne et clique sur "Exporter", toutes les données (images, vidéos, souhaits, etc.) sont sauvegardées dans un ZIP avec les fichiers réels. Lors du redéploiement, ces fichiers sont préservés et utilisés.

## 📋 Fonctionnement

### 1. Export des Données

Quand quelqu'un clique sur **"Exporter ZIP (avec fichiers)"** dans le panneau Admin :

1. ✅ Toutes les images sont extraites du base64
2. ✅ Toutes les vidéos sont extraites du base64
3. ✅ Un ZIP est créé avec la structure :
   ```
   site-data-YYYY-MM-DD.zip
   ├── data/
   │   ├── images/
   │   │   ├── photo_123_1234567890.jpg
   │   │   ├── photo_124_1234567891.png
   │   │   ├── friend_125_1234567892.jpg
   │   │   └── hero_1234567893.jpg
   │   ├── videos/
   │   │   ├── video_126_1234567894.mp4
   │   │   └── video_127_1234567895.webm
   │   └── site-data.json
   ```
4. ✅ Le JSON contient des références aux fichiers : `/data/images/photo_123.jpg`
5. ✅ Le ZIP est téléchargé automatiquement

### 2. Déploiement avec Fichiers

**Étape par étape :**

1. **Téléchargez le ZIP** depuis le panneau Admin
2. **Extrayez le ZIP** dans votre projet local :
   - Ouvrez le ZIP
   - Copiez tout le contenu du dossier `data/` 
   - Collez-le dans `public/data/` de votre projet
   - Structure finale :
     ```
     public/
     ├── data/
     │   ├── images/
     │   │   ├── photo_123_1234567890.jpg
     │   │   └── ...
     │   ├── videos/
     │   │   ├── video_126_1234567894.mp4
     │   │   └── ...
     │   └── site-data.json
     ```
3. **Vérifiez que `.gitignore` n'exclut PAS `public/data/`** :
   - Le dossier `public/data/` doit être commité dans Git
   - Les fichiers images/vidéos doivent être dans le repository
4. **Mettez `VITE_ENABLE_EDITING=false` dans `.env`**
5. **Déployez** : `npm run deploy`

### 3. Chargement des Fichiers

Quand le site se charge en production :

1. ✅ Charge `public/data/site-data.json`
2. ✅ Si le JSON contient des références `/data/images/...` ou `/data/videos/...`
3. ✅ Charge automatiquement les fichiers depuis ces chemins
4. ✅ Convertit en data URLs pour l'affichage
5. ✅ Les fichiers sont préservés même après redéploiement

## 🔒 Protection contre la Suppression

### ✅ Les fichiers ne sont PAS supprimés lors du déploiement

**Pourquoi ?**

1. **Les fichiers sont dans `public/data/`** qui est commité dans Git
2. **Le workflow GitHub Actions** copie tout le contenu de `dist/` (qui inclut `public/`)
3. **Les fichiers restent dans le repository** même après redéploiement
4. **Le code charge depuis `/data/images/` et `/data/videos/`** si les fichiers existent

### ⚠️ Important : Vérifier `.gitignore`

Assurez-vous que votre `.gitignore` **N'EXCLUT PAS** `public/data/` :

```gitignore
# ✅ CORRECT - public/data/ est commité
node_modules/
dist/
.env

# ❌ INCORRECT - Ne faites PAS ça :
# public/data/
# public/data/images/
# public/data/videos/
```

## 📝 Workflow Complet

### Scénario : Quelqu'un ajoute des photos en ligne

1. **Visiteur ajoute des photos** → Sauvegardées dans localStorage
2. **Admin clique sur "Exporter ZIP"** → ZIP téléchargé avec fichiers
3. **Vous extrayez le ZIP** → Fichiers dans `public/data/`
4. **Vous commitez et poussez** :
   ```bash
   git add public/data/
   git commit -m "Ajout des données exportées"
   git push origin main
   ```
5. **Vous redéployez** :
   ```bash
   npm run deploy
   ```
6. **Résultat** : Les fichiers sont dans le repository et le site les charge ✅

### Scénario : Redéploiement sans nouvelles données

1. **Vous modifiez juste le code** (pas de nouvelles données)
2. **Vous redéployez** : `npm run deploy`
3. **Résultat** : Les fichiers existants dans `public/data/` sont préservés ✅
4. **Le site charge les fichiers depuis `/data/images/` et `/data/videos/`** ✅

## 🛠️ Vérifications

### Vérifier que les fichiers sont bien commités

```bash
git ls-files public/data/
```

Vous devriez voir :
- `public/data/site-data.json`
- `public/data/images/photo_*.jpg`
- `public/data/videos/video_*.mp4`

### Vérifier après déploiement

1. Allez sur votre site déployé
2. Ouvrez la console du navigateur (F12)
3. Vérifiez les logs :
   - `"Données chargées depuis le fichier JSON"` ou
   - `"localStorage vide, chargement des données initiales depuis JSON"`
4. Les images/vidéos doivent s'afficher correctement

## ⚠️ Problèmes Courants

### Problème : Les fichiers ne s'affichent pas après déploiement

**Solution :**
1. Vérifiez que les fichiers sont bien dans `public/data/`
2. Vérifiez que `.gitignore` n'exclut pas `public/data/`
3. Vérifiez que les fichiers sont commités : `git status`
4. Vérifiez les chemins dans `site-data.json` : doivent être `/data/images/...`

### Problème : Le ZIP est vide ou corrompu

**Solution :**
1. Vérifiez la console pour les erreurs
2. Réessayez l'export
3. Utilisez "Exporter JSON (simple)" en alternative

### Problème : Les fichiers sont supprimés après déploiement

**Solution :**
1. Vérifiez que `public/data/` est bien dans Git (pas dans `.gitignore`)
2. Vérifiez que les fichiers sont commités avant le déploiement
3. Le workflow GitHub Actions copie `dist/` qui inclut `public/`

## ✅ Checklist de Déploiement

- [ ] Quelqu'un a exporté les données (ZIP téléchargé)
- [ ] ZIP extrait dans `public/data/`
- [ ] Structure correcte : `public/data/images/` et `public/data/videos/`
- [ ] Fichiers commités dans Git : `git add public/data/ && git commit`
- [ ] `.gitignore` n'exclut PAS `public/data/`
- [ ] `VITE_ENABLE_EDITING=false` dans `.env`
- [ ] Déploiement effectué : `npm run deploy`
- [ ] Vérification sur le site : images/vidéos s'affichent

## 🎯 Résultat Final

✅ **Les fichiers sont préservés** même après redéploiement
✅ **Plus besoin de copier manuellement** les images/vidéos
✅ **Tout est automatisé** : export → extraction → déploiement
✅ **Les données en ligne sont sauvegardées** dans le repository
