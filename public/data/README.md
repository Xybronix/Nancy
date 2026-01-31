# 📁 Dossier Data - Données du Site

Ce dossier contient toutes les données du site (images, vidéos, souhaits, etc.).

## 📂 Structure

```
public/data/
├── images/          # Toutes les images (photos, amies, hero)
├── videos/          # Toutes les vidéos locales
└── site-data.json   # Fichier JSON avec toutes les données
```

## 🔄 Comment ça fonctionne

### Export depuis le site

1. Quelqu'un ajoute des photos/vidéos en ligne
2. Admin clique sur "Exporter ZIP (avec fichiers)"
3. Un ZIP est téléchargé avec :
   - `data/images/` → Toutes les images
   - `data/videos/` → Toutes les vidéos
   - `data/site-data.json` → Toutes les données

### Déploiement

1. **Extrayez le ZIP** dans ce dossier (`public/data/`)
2. **Commitez les fichiers** dans Git :
   ```bash
   git add public/data/
   git commit -m "Ajout des données exportées"
   git push
   ```
3. **Déployez** : Les fichiers seront préservés ✅

## ⚠️ Important

- ✅ **Ce dossier DOIT être commité** dans Git
- ✅ **Les fichiers ne seront PAS supprimés** lors du déploiement
- ✅ **Le site charge automatiquement** les fichiers depuis ici
- ❌ **Ne mettez PAS ce dossier dans `.gitignore`**

## 📝 Notes

- Les fichiers sont organisés automatiquement lors de l'export
- Les noms de fichiers sont générés automatiquement (avec IDs uniques)
- Le JSON référence les fichiers par leur chemin relatif (`/data/images/...`)
