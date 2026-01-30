# 🔧 Guide pour corriger l'erreur de déploiement GitHub Pages

## Problèmes identifiés

1. ✅ **Version Node.js** : Mise à jour vers Node.js 20 (déjà corrigé dans le workflow)
2. ❌ **Erreur 403** : Permissions insuffisantes pour écrire dans le repository

## Solution pour l'erreur 403

L'erreur `403: Write access to repository not granted` signifie que GitHub Actions n'a pas les permissions nécessaires pour écrire dans votre repository.

### Option 1 : Vérifier les permissions du workflow (Recommandé)

Le fichier `.github/workflows/deploy.yml` doit contenir les permissions suivantes :

```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

**Vérifiez que ces lignes sont présentes dans votre fichier de workflow.**

### Option 2 : Configurer les permissions dans GitHub

1. Allez sur votre repository GitHub : `https://github.com/Xybronix/Nancy`
2. Cliquez sur **Settings** (Paramètres)
3. Dans le menu de gauche, cliquez sur **Actions** → **General**
4. Faites défiler jusqu'à **Workflow permissions**
5. Sélectionnez **Read and write permissions**
6. Cochez **Allow GitHub Actions to create and approve pull requests**
7. Cliquez sur **Save**

### Option 3 : Utiliser un Personal Access Token (PAT)

Si l'option 2 ne fonctionne pas, créez un Personal Access Token :

1. Allez sur GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. Cliquez sur **Generate new token (classic)**
3. Donnez-lui un nom (ex: "GitHub Pages Deploy")
4. Cochez les permissions :
   - `repo` (toutes les permissions du repository)
   - `workflow` (si disponible)
5. Cliquez sur **Generate token**
6. **Copiez le token** (vous ne pourrez plus le voir après)
7. Dans votre repository GitHub :
   - Allez dans **Settings** → **Secrets and variables** → **Actions**
   - Cliquez sur **New repository secret**
   - Nom : `GH_PAGES_TOKEN`
   - Valeur : collez votre token
   - Cliquez sur **Add secret**
8. Modifiez `.github/workflows/deploy.yml` :

```yaml
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GH_PAGES_TOKEN }}
          publish_dir: ./dist
          cname: false
```

### Option 4 : Vérifier que le workflow est correct

Assurez-vous que votre fichier `.github/workflows/deploy.yml` ressemble à ceci :

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

# Permissions nécessaires pour déployer sur GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
          cname: false
```

## Après avoir appliqué les corrections

1. Commitez et poussez les changements :
```bash
git add .github/workflows/deploy.yml
git commit -m "Fix: Ajout des permissions pour GitHub Pages"
git push origin main
```

2. Le workflow se déclenchera automatiquement
3. Vérifiez l'onglet **Actions** de votre repository pour voir le statut

## Note sur Node.js

L'avertissement sur Node.js 18.20.8 n'est qu'un avertissement. Le build fonctionne quand même, mais il est recommandé d'utiliser Node.js 20+ pour éviter les problèmes futurs. Le workflow a été mis à jour pour utiliser Node.js 20.

## Vérification

Après le déploiement réussi, votre site sera disponible à :
```
https://xybronix.github.io/Nancy/
```
