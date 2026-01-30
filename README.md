# 🎂 Site d'Anniversaire - Tchounga Sani Nancy Ranaise

Un site web festif et interactif créé pour célébrer l'anniversaire de Nancy le 31 janvier. Ce site est construit avec React, Vite et propose de nombreuses fonctionnalités interactives.

## ✨ Fonctionnalités

- 🎉 **Animation de chargement** avec compte à rebours jusqu'à l'anniversaire
- 🌓 **Mode clair/sombre** avec thème noir et rouge
- 📸 **Galerie photo** pour ajouter et afficher des photos
- 🎬 **Section vidéos** pour ajouter des vidéos locales ou des URLs
- 🌟 **Souhaits pour la nouvelle année** avec possibilité d'ajouter plusieurs souhaits
- 👥 **Section amies** pour afficher les photos des personnes qui ont créé ce site
- 📧 **Coordonnées** pour ajouter email et/ou numéro de téléphone
- 🎨 **Animations fluides** et effets visuels festifs
- 📱 **Design responsive** adapté à tous les écrans

## 🚀 Démarrage du projet

### Prérequis

- Node.js (version 16 ou supérieure)
- npm ou yarn

### Installation

1. Clonez le repository ou téléchargez les fichiers :
```bash
git clone <votre-repo-url>
cd Nancy
```

2. Installez les dépendances :
```bash
npm install
```

3. Lancez le serveur de développement :
```bash
npm run dev
```

4. Ouvrez votre navigateur et accédez à `http://localhost:5173`

### Commandes disponibles

- `npm run dev` - Lance le serveur de développement
- `npm run build` - Crée une version de production dans le dossier `dist`
- `npm run preview` - Prévisualise la version de production
- `npm run deploy` - Déploie le site sur GitHub Pages

## 📦 Déploiement sur GitHub Pages

### Étape 1 : Préparer le repository GitHub

1. Créez un nouveau repository sur GitHub (par exemple : `Nancy`)
2. Initialisez git dans votre projet local (si ce n'est pas déjà fait) :
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/VOTRE-USERNAME/Nancy.git
git push -u origin main
```

### Étape 2 : Installer gh-pages

Le package `gh-pages` est déjà inclus dans les dépendances. Si ce n'est pas le cas, installez-le :
```bash
npm install --save-dev gh-pages
```

### Étape 3 : Configurer le base path

Le fichier `vite.config.js` est déjà configuré avec `base: '/Nancy/'`. Assurez-vous que cette valeur correspond au nom de votre repository GitHub.

Si votre repository s'appelle différemment, modifiez la ligne dans `vite.config.js` :
```javascript
base: '/NOM-DE-VOTRE-REPO/',
```

### Étape 4 : Déployer

1. Construisez le projet :
```bash
npm run build
```

2. Déployez sur GitHub Pages :
```bash
npm run deploy
```

Cette commande va :
- Créer un dossier `dist` avec les fichiers optimisés
- Créer une branche `gh-pages` dans votre repository
- Pousser les fichiers sur cette branche

### Étape 5 : Activer GitHub Pages

1. Allez dans les **Settings** de votre repository GitHub
2. Dans la section **Pages** (à gauche)
3. Sous **Source**, sélectionnez la branche `gh-pages` et le dossier `/ (root)`
4. Cliquez sur **Save**

Votre site sera disponible à l'adresse :
```
https://VOTRE-USERNAME.github.io/Nancy/
```

### Mise à jour du site

Chaque fois que vous voulez mettre à jour le site :
```bash
npm run deploy
```

## 🎨 Personnalisation

### Changer les couleurs

Les couleurs principales sont définies dans `src/index.css` via les variables CSS :
- `--primary-red`: #dc2626
- `--primary-black`: #000000

### Modifier les informations

- **Nom** : Modifiez "Tchounga Sani Nancy Ranaise" dans les composants
- **Date d'anniversaire** : Modifiez la date dans `src/components/LoadingScreen.jsx` (ligne 12) et `src/components/Hero.jsx`

## 📁 Structure du projet

```
Nancy/
├── public/
├── src/
│   ├── components/
│   │   ├── Confetti.jsx
│   │   ├── ContactSection.jsx
│   │   ├── Footer.jsx
│   │   ├── FriendsSection.jsx
│   │   ├── Header.jsx
│   │   ├── Hero.jsx
│   │   ├── LoadingScreen.jsx
│   │   ├── PhotoGallery.jsx
│   │   ├── VideoSection.jsx
│   │   └── WishesSection.jsx
│   ├── contexts/
│   │   └── ThemeContext.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🛠️ Technologies utilisées

- **React** - Bibliothèque JavaScript pour l'interface utilisateur
- **Vite** - Outil de build rapide
- **Framer Motion** - Animations fluides (optionnel, peut être ajouté)
- **CSS3** - Styles et animations

## 📝 Notes

- Les photos et vidéos ajoutées sont stockées localement dans le navigateur (localStorage n'est pas utilisé pour les fichiers, ils sont en mémoire)
- Pour un stockage permanent, vous devriez intégrer un backend ou un service de stockage cloud
- Le site fonctionne entièrement côté client

## 🎉 Félicitations !

Joyeux anniversaire à Nancy ! 🎂✨

---

Fait avec ❤️ pour célébrer l'anniversaire de Tchounga Sani Nancy Ranaise
