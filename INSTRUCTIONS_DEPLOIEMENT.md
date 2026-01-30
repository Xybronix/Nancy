# Instructions de Déploiement

## Étape 1 : Préparation (Mode Édition)

1. Assurez-vous que `.env` contient :
   ```
   VITE_ENABLE_EDITING=true
   ```

2. Lancez le site en développement :
   ```bash
   npm run dev
   ```

3. Ajoutez tous les contenus :
   - Photo principale (Hero)
   - Photos de la galerie
   - Vidéos
   - Photos des amies
   - Coordonnées (email/téléphone)
   - Souhaits initiaux (optionnel)

4. Exportez les données :
   - Cliquez sur l'icône d'information en bas à droite (panneau Admin)
   - Cliquez sur "Exporter les données"
   - Le fichier `site-data.json` sera téléchargé

## Étape 2 : Préparation du Fichier de Données

1. Copiez le fichier `site-data.json` exporté dans :
   ```
   public/data/site-data.json
   ```

2. Vérifiez que le fichier contient bien toutes vos données

## Étape 3 : Configuration pour Production

1. Modifiez le fichier `.env` :
   ```
   VITE_ENABLE_EDITING=false
   ```

2. Vérifiez que `public/data/site-data.json` existe et contient vos données

## Étape 4 : Build et Déploiement

1. Construisez le projet :
   ```bash
   npm run build
   ```

2. Vérifiez que le dossier `dist` contient bien `data/site-data.json`

3. Déployez sur GitHub Pages :
   ```bash
   npm run deploy
   ```

## Résultat

- ✅ Les visiteurs verront tous les contenus préchargés
- ✅ Ils ne pourront plus modifier les photos/vidéos/contacts/amies
- ✅ Ils pourront toujours ajouter des souhaits
- ✅ Les souhaits ajoutés seront sauvegardés dans localStorage

## Mise à Jour des Données

Si vous voulez mettre à jour les contenus après le déploiement :

1. Remettez `VITE_ENABLE_EDITING=true` localement
2. Modifiez les contenus
3. Réexportez les données
4. Remettez le fichier dans `public/data/site-data.json`
5. Rebuild et redéployez
