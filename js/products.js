/* ============================================================
   PRODUITS — géré depuis le dashboard admin (/admin.html).
   Vous pouvez aussi modifier ce fichier à la main si besoin,
   il reste du JavaScript / JSON valide.
   ============================================================ */
window.CATEGORIES = [
  {
    "id": "casques",
    "label": "Casques"
  },
  {
    "id": "bluetooth",
    "label": "Bluetooth"
  },
  {
    "id": "powerbanks",
    "label": "Powerbanks"
  },
  {
    "id": "montres",
    "label": "Montres"
  },
  {
    "id": "shisha",
    "label": "Shisha"
  }
];

window.PRODUCTS = [
  {
    "id": "casque-filaire",
    "sample": true,
    "category": "casques",
    "name": "Casque filaire avec micro",
    "price": 5000,
    "oldPrice": null,
    "availability": "in_stock",
    "image": "assets/casque-filaire-1791770845964.jpg",
    "short": "Micro intégré, coussinets confortables.",
    "description": "Un casque simple et pratique pour la musique, les appels et les jeux.",
    "features": [
      "Micro intégré",
      "Prise jack 3",
      "5 mm"
    ],
    "imageAlt": ""
  },
  {
    "id": "casque-bluetooth",
    "sample": false,
    "category": "bluetooth",
    "name": "Casque Bluetooth pliable",
    "price": 12000,
    "oldPrice": 15000,
    "availability": "in_stock",
    "image": "assets/casque-bluetooth.jpg",
    "short": "Sans fil, pliable, facile à transporter.",
    "description": "Un casque sans fil à connecter en quelques secondes à votre téléphone.",
    "features": [
      "Connexion Bluetooth",
      "Pliable",
      "Micro intégré"
    ]
  },
  {
    "id": "ecouteurs-sans-fil",
    "sample": false,
    "category": "bluetooth",
    "name": "Écouteurs sans fil + boîtier",
    "price": 9000,
    "oldPrice": null,
    "availability": "on_request",
    "image": "assets/ecouteurs-sans-fil.jpg",
    "short": "Boîtier de charge inclus.",
    "description": "Des écouteurs sans fil compacts avec boîtier de recharge.",
    "features": [
      "Boîtier de charge",
      "Connexion Bluetooth"
    ]
  },
  {
    "id": "oreillette",
    "sample": true,
    "category": "bluetooth",
    "name": "Oreillette Bluetooth",
    "price": 3500,
    "oldPrice": null,
    "availability": "in_stock",
    "image": "assets/earbuds.svg",
    "short": "Légère, pratique pour les appels.",
    "description": "Une oreillette discrète pour téléphoner les mains libres.",
    "features": [
      "Mains libres",
      "Légère"
    ]
  },
  {
    "id": "powerbank-20000",
    "sample": false,
    "category": "powerbanks",
    "name": "Powerbank 20 000 mAh",
    "price": 14000,
    "oldPrice": 17500,
    "availability": "in_stock",
    "image": "assets/powerbank-20000.jpg",
    "short": "Grande capacité pour plusieurs charges.",
    "description": "Une batterie externe de grande capacité pour garder votre téléphone chargé.",
    "features": [
      "20 000 mAh",
      "Plusieurs ports USB"
    ]
  },
  {
    "id": "powerbank-10000",
    "sample": true,
    "category": "powerbanks",
    "name": "Powerbank 10 000 mAh",
    "price": 8500,
    "oldPrice": null,
    "availability": "in_stock",
    "image": "assets/powerbank.svg",
    "short": "Compacte, facile à glisser dans la poche.",
    "description": "Une batterie externe compacte pour les journées chargées.",
    "features": [
      "10 000 mAh",
      "Format compact"
    ]
  },
  {
    "id": "montre-connectee",
    "sample": false,
    "category": "montres",
    "name": "Montre connectée",
    "price": 15000,
    "oldPrice": 18000,
    "availability": "on_request",
    "image": "assets/montre-connectee.jpg",
    "short": "Notifications et suivi d’activité.",
    "description": "Une montre connectée pour suivre vos notifications et votre activité.",
    "features": [
      "Notifications",
      "Suivi d’activité"
    ]
  },
  {
    "id": "montre-amoled-giftset",
    "sample": false,
    "category": "montres",
    "name": "Montre AMOLED + coffret bijoux",
    "price": 22000,
    "oldPrice": null,
    "availability": "on_request",
    "image": "assets/montre-amoled-giftset.jpg",
    "short": "Grand écran, appels Bluetooth, coffret bracelet/collier inclus.",
    "description": "Montre connectée écran AMOLED avec coffret cadeau : bracelet, collier et chargeur magnétique inclus.",
    "features": [
      "Appels Bluetooth",
      "Suivi santé (fréquence cardiaque, SpO2, sommeil)",
      "Étanche IP68",
      "Coffret bijoux inclus"
    ]
  },
  {
    "id": "shisha-complete",
    "sample": false,
    "category": "shisha",
    "name": "Shisha complète",
    "price": 20000,
    "oldPrice": null,
    "availability": "on_request",
    "image": "assets/shisha-complete.jpg",
    "short": "Ensemble prêt à utiliser.",
    "description": "Un ensemble shisha complet. Réservé aux adultes.",
    "features": []
  }
];
