/* ============================================================
   CONFIGURATION CENTRALE — Ahmed Telecom
   Modifiez uniquement ce fichier pour les infos de l'entreprise.
   ============================================================ */
window.SITE_CONFIG = {
  businessName: 'Ahmed Telecom',

  // ➜ ICI : votre numéro WhatsApp, indicatif Cameroun (237) + 9 chiffres,
  //   sans "+", sans espaces. Exemple : '237699123456'
  whatsappNumber: '237696777819',

  // Message du bouton WhatsApp général
  defaultMessage: 'Bonjour Ahmed Telecom ! Je souhaite avoir des informations sur vos produits et vos offres.',

  // Message pour un produit précis (le nom du produit est inséré automatiquement)
  productMessage: (name) =>
    `Bonjour Ahmed Telecom ! Je suis intéressé(e) par le produit : ${name}. Pouvez-vous me confirmer le prix et la disponibilité ?`,

  // ➜ ICI : l'adresse de votre page Facebook (le lien reste masqué tant que "VOTRE_PAGE" est présent)
  facebookUrl: 'https://www.facebook.com/share/1NTLr4eUXb/',

  location: 'Dubai, Akwa, Douala',
  currency: 'XAF',

  // ➜ Remplacez ces fichiers dans le dossier assets/ (ou changez les chemins)
  logo: 'assets/logo.svg',
  heroImage: 'assets/hero.svg',

  // Affiche "Exemple" sur les produits marqués sample: true
  showSampleBadge: true,

  // Bandeau en haut de page. enabled: false pour le masquer.
  announcement: {
    enabled: true,
    text: 'Offre de lancement : profitez de nos offres spéciales !',
    link: '#offres'
  },

  // Section offre. enabled: false pour la masquer.
  // productIds: identifiants (id) des produits de l'offre. Vide = tous les produits avec un ancien prix.
  // deadline: 'AAAA-MM-JJ' SEULEMENT si l'offre a une vraie date de fin, sinon null.
  // ⚠ Offre d'exemple : modifiez ou désactivez avant de publier.
  offer: {
    enabled: true,
    title: 'Les bons plans du moment',
    text: 'Une sélection de produits à prix réduit. Écrivez-nous pour confirmer l’offre et la disponibilité.',
    productIds: [],
    deadline: null
  },

  // Mesure future : branchez ici l'outil de votre choix (Meta Pixel, GA4...).
  // Événements : whatsapp_click, product_view, product_inquiry_click
  track: (event, data) => {
    (window.dataLayer = window.dataLayer || []).push({ event, ...data });
    if (window.console && console.debug) console.debug('[track]', event, data);
  }
};
