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
  },
  {
    "id": "fan",
    "label": "Fans"
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
    "price": 5000,
    "oldPrice": 5000,
    "availability": "in_stock",
    "image": "assets/casque-bluetooth.jpg",
    "short": "Sans fil, pliable, facile à transporter.",
    "description": "Un casque sans fil à connecter en quelques secondes à votre téléphone.",
    "features": [
      "Connexion Bluetooth",
      "Pliable",
      "Micro intégré"
    ],
    "imageAlt": ""
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
    "price": 8000,
    "oldPrice": 1000,
    "availability": "in_stock",
    "image": "assets/powerbank-20000.jpg",
    "short": "Grande capacité pour plusieurs charges.",
    "description": "Une batterie externe de grande capacité pour garder votre téléphone chargé.",
    "features": [
      "20 000 mAh",
      "Plusieurs ports USB"
    ],
    "imageAlt": ""
  },
  {
    "id": "montre-connectee",
    "sample": false,
    "category": "montres",
    "name": "Montre téléphone",
    "price": 10000,
    "oldPrice": 15000,
    "availability": "on_request",
    "image": "assets/montre-connectee.jpg",
    "short": "Notifications et suivi d’activité.",
    "description": "Une montre connectée pour suivre vos notifications et votre activité.",
    "features": [
      "Notifications",
      "Suivi d’activité"
    ],
    "imageAlt": ""
  },
  {
    "id": "montre-amoled-giftset",
    "sample": false,
    "category": "montres",
    "name": "Montre AMOLED + coffret bijoux",
    "price": 8500,
    "oldPrice": null,
    "availability": "on_request",
    "image": "assets/montre-amoled-giftset.jpg",
    "short": "Grand écran, appels Bluetooth, coffret bracelet/collier inclus.",
    "description": "Montre connectée écran AMOLED avec coffret cadeau : bracelet, collier et chargeur magnétique inclus.",
    "features": [
      "Appels Bluetooth",
      "Suivi santé (fréquence cardiaque",
      "SpO2",
      "sommeil)",
      "Étanche IP68",
      "Coffret bijoux inclus"
    ],
    "imageAlt": ""
  },
  {
    "id": "shisha-complete",
    "sample": false,
    "category": "shisha",
    "name": "Shisha complète",
    "price": 10000,
    "oldPrice": null,
    "availability": "on_request",
    "image": "assets/shisha-complete.jpg",
    "short": "Ensemble prêt à utiliser.",
    "description": "Un ensemble shisha complet. Réservé aux adultes.",
    "features": [],
    "imageAlt": ""
  },
  {
    "id": "prod-1",
    "category": "casques",
    "name": "New product 1",
    "price": 8000,
    "oldPrice": 10000,
    "availability": "in_stock",
    "sample": false,
    "short": "",
    "description": "",
    "features": [],
    "imageAlt": "",
    "image": "assets/prod-1-1791926986951.jpg"
  },
  {
    "id": "prod-2",
    "category": "casques",
    "name": "New product",
    "price": 5000,
    "oldPrice": 10000,
    "availability": "in_stock",
    "sample": false,
    "short": "",
    "description": "",
    "features": [],
    "imageAlt": "",
    "image": "assets/prod-2-1791927062166.jpg"
  },
  {
    "id": "prod-3",
    "category": "powerbanks",
    "name": "New product",
    "price": 7000,
    "oldPrice": 10000,
    "availability": "in_stock",
    "sample": false,
    "short": "",
    "description": "",
    "features": [],
    "imageAlt": "",
    "image": "assets/prod-3-1791927128009.jpg"
  },
  {
    "id": "prod-4",
    "category": "casques",
    "name": "Headset",
    "price": 6500,
    "oldPrice": 9000,
    "availability": null,
    "sample": false,
    "short": "",
    "description": "",
    "features": [],
    "imageAlt": "",
    "image": "assets/prod-4-1791927175111.jpg"
  },
  {
    "id": "prod-5",
    "category": "fan",
    "name": "Portable fan",
    "price": 5000,
    "oldPrice": 6500,
    "availability": "in_stock",
    "sample": false,
    "short": "",
    "description": "",
    "features": [],
    "imageAlt": "",
    "image": "assets/prod-5-1791927272269.jpg"
  },
  {
    "id": "prod-6",
    "category": "montres",
    "name": "Smart watch",
    "price": 10000,
    "oldPrice": 12500,
    "availability": null,
    "sample": false,
    "short": "",
    "description": "",
    "features": [],
    "imageAlt": "",
    "image": "assets/prod-6-1791927333871.jpg"
  }
];
