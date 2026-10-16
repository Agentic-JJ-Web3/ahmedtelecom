# Ahmed Telecom — site vitrine WhatsApp

HTML + CSS + JS, sans installation. Ouvrez `index.html` pour tester.

## À modifier
- **Numéro WhatsApp, Facebook, logo, image d'accueil, bandeau, offre** : `js/config.js`
  - Numéro : `whatsappNumber: '237699123456'` (237 + 9 chiffres, sans "+")
- **Produits, prix, catégories** : `js/products.js`
  - Ajouter : copiez un bloc `{ ... }`, changez `id`, `name`, `price`, `image`.
  - Retirer : supprimez le bloc.
  - Réduction : renseignez `oldPrice` (le % se calcule tout seul). Sinon `null`.
  - Produit réel : mettez `sample: false` pour retirer le badge "Exemple".
- **Logo / image d'accueil** : placez vos fichiers dans `assets/`, puis changez `logo` et `heroImage` dans `config.js`.
- **Photos produits** : carrées (800x800), fond propre, JPG/WebP < 150 Ko. Mettez le chemin dans `image`.
- **Couleurs et polices** : variables en haut de `css/styles.css`.

## Mettre en ligne
**Important : pour que le dashboard admin fonctionne (voir plus bas), le site doit être connecté à GitHub sur Vercel — pas en glissé-déposé.** Glisser-déposer fonctionne pour un site simple, mais chaque modification faite depuis `/admin.html` pousse un commit sur GitHub, et seul un projet connecté au dépôt se redéploie automatiquement à chaque commit.

- **Vercel (recommandé ici)** : sur vercel.com, "Add New..." → "Project" → importez le dépôt GitHub `Agentic-JJ-Web3/ahmedtelecom`. Framework preset : "Other". Build command / Output directory : laissez vide (site statique). Vercel détecte automatiquement `api/admin.js` comme fonction serverless.

## Dashboard admin (`/admin.html`) — ajouter/modifier/supprimer des produits sans toucher au code

Le dashboard modifie directement `js/products.js` sur GitHub (via un commit), sans base de données : le tableau `PRODUCTS` du fichier reste l'unique source de vérité. Une fonction serverless (`api/admin.js`) fait le pont : elle garde votre jeton GitHub côté serveur (jamais visible dans le navigateur) et vérifie un mot de passe avant chaque modification.

**Mise en place (une seule fois), dans Vercel → Project Settings → Environment Variables :**
1. `GITHUB_TOKEN` — un jeton GitHub **fine-grained**, créé sur github.com/settings/tokens?type=beta, limité au dépôt `ahmedtelecom` uniquement, avec la permission "Contents: Read and write" (rien d'autre).
2. `GITHUB_REPO` = `Agentic-JJ-Web3/ahmedtelecom`
3. `GITHUB_BRANCH` = `main`
4. `ADMIN_PASSWORD` = un mot de passe long et unique (c'est la seule protection du dashboard : ne le réutilisez pas ailleurs).

Après avoir ajouté ces variables, redéployez le site une fois (Deployments → ⋯ → Redeploy) pour qu'elles soient prises en compte.

**Utilisation :** ouvrez `https://votre-site.vercel.app/admin.html`, entrez le mot de passe, puis ajoutez/modifiez/supprimez produits et catégories. Chaque sauvegarde crée un commit GitHub et Vercel redéploie automatiquement (≈30-60 secondes avant que le changement soit visible sur le site). Les photos sont redimensionnées (max 800px) et compressées dans le navigateur avant l'envoi.

`/admin.html` n'est lié depuis aucune page publique et n'est pas indexé par les moteurs de recherche, mais reste accessible à quiconque connaît l'URL : le mot de passe est la seule barrière, choisissez-le avec soin.

**Tester en local (optionnel) :** installez la CLI Vercel (`npm i -g vercel`), créez un fichier `.env` (non commité) avec les 4 variables ci-dessus, puis lancez `vercel dev` — le site et la fonction tournent ensemble en local.

## Avant de lancer les pubs Facebook
Vérifiez la politique publicitaire de Meta pour la shisha. Utilisez casques, powerbanks et montres dans les publicités.
