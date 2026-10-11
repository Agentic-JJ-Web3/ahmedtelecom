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
Netlify : glissez-déposez le dossier sur app.netlify.com/drop. Vercel : importez le dossier (aucun réglage de build).

## Avant de lancer les pubs Facebook
Vérifiez la politique publicitaire de Meta pour la shisha. Utilisez casques, powerbanks et montres dans les publicités.
