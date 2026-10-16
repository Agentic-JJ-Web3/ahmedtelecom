'use strict';

/* ============================================================
   Proxy admin — Ahmed Telecom (Vercel serverless function)
   Garde le token GitHub côté serveur (variables d'environnement
   Vercel) et expose un CRUD simple sur js/products.js, poussé
   directement sur GitHub. Aucune base de données : le fichier
   JS du dépôt reste l'unique source de vérité, modifié via des
   méthodes de tableau (find / push / filter / map) côté serveur.
   ============================================================ */

const vm = require('vm');

const GITHUB_API = 'https://api.github.com';
const PRODUCTS_PATH = 'js/products.js';
const ASSETS_DIR = 'assets';
const MAX_IMAGE_BYTES = 400 * 1024; // garde-fou, cible réelle ~150 Ko côté client

function getEnv() {
  const { GITHUB_TOKEN, GITHUB_REPO, GITHUB_BRANCH, ADMIN_PASSWORD } = process.env;
  if (!GITHUB_TOKEN || !GITHUB_REPO || !ADMIN_PASSWORD) {
    throw Object.assign(new Error('Serveur non configuré : variables d\'environnement manquantes.'), { statusCode: 500 });
  }
  return { token: GITHUB_TOKEN, repo: GITHUB_REPO, branch: GITHUB_BRANCH || 'main', adminPassword: ADMIN_PASSWORD };
}

async function gh(path, token, options) {
  const res = await fetch(`${GITHUB_API}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'ahmed-telecom-admin',
      ...(options && options.headers),
    },
  });
  if (!res.ok && res.status !== 404) {
    const text = await res.text().catch(() => '');
    throw Object.assign(new Error(`GitHub API ${res.status} sur ${path} : ${text.slice(0, 300)}`), { statusCode: 502 });
  }
  return res;
}

async function getFile(path, env) {
  const res = await gh(`/repos/${env.repo}/contents/${path}?ref=${env.branch}`, env.token, { method: 'GET' });
  if (res.status === 404) return null;
  const data = await res.json();
  return { content: Buffer.from(data.content, 'base64').toString('utf8'), sha: data.sha };
}

async function putFile(path, content, sha, message, env) {
  const res = await gh(`/repos/${env.repo}/contents/${path}`, env.token, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      content: Buffer.from(content, 'utf8').toString('base64'),
      branch: env.branch,
      ...(sha ? { sha } : {}),
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw Object.assign(new Error(`Échec de l'écriture GitHub : ${text.slice(0, 300)}`), { statusCode: 502 });
  }
  return res.json();
}

function parseProductsJs(text) {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(text, sandbox, { timeout: 1000 });
  const categories = Array.isArray(sandbox.window.CATEGORIES) ? sandbox.window.CATEGORIES : [];
  const products = Array.isArray(sandbox.window.PRODUCTS) ? sandbox.window.PRODUCTS : [];
  return { categories, products };
}

function serializeProductsJs(categories, products) {
  return `/* ============================================================
   PRODUITS — géré depuis le dashboard admin (/admin.html).
   Vous pouvez aussi modifier ce fichier à la main si besoin,
   il reste du JavaScript / JSON valide.
   ============================================================ */
window.CATEGORIES = ${JSON.stringify(categories, null, 2)};

window.PRODUCTS = ${JSON.stringify(products, null, 2)};
`;
}

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function assertValidProduct(p, categories) {
  if (!p || typeof p !== 'object') throw Object.assign(new Error('Produit invalide.'), { statusCode: 400 });
  if (!SLUG_RE.test(String(p.id || ''))) throw Object.assign(new Error('Identifiant produit invalide (lettres minuscules, chiffres, tirets).'), { statusCode: 400 });
  if (!p.name || !String(p.name).trim()) throw Object.assign(new Error('Le nom du produit est requis.'), { statusCode: 400 });
  if (!categories.some((c) => c.id === p.category)) throw Object.assign(new Error('Catégorie inconnue.'), { statusCode: 400 });
  if (typeof p.price !== 'number' || !(p.price >= 0)) throw Object.assign(new Error('Le prix doit être un nombre positif.'), { statusCode: 400 });
  if (p.oldPrice != null && (typeof p.oldPrice !== 'number' || p.oldPrice < 0)) throw Object.assign(new Error('L\'ancien prix doit être un nombre positif ou vide.'), { statusCode: 400 });
}

async function loadProducts(env) {
  const file = await getFile(PRODUCTS_PATH, env);
  if (!file) throw Object.assign(new Error('js/products.js introuvable sur le dépôt.'), { statusCode: 500 });
  const { categories, products } = parseProductsJs(file.content);
  return { categories, products, sha: file.sha };
}

async function saveProducts(categories, products, sha, message, env) {
  const content = serializeProductsJs(categories, products);
  return putFile(PRODUCTS_PATH, content, sha, message, env);
}

async function handleUpsertProduct(payload, env) {
  const { categories, products, sha } = await loadProducts(env);
  assertValidProduct(payload, categories);
  const idx = products.findIndex((p) => p.id === payload.id);
  const isNew = idx === -1;
  if (isNew) products.push(payload);
  else products[idx] = { ...products[idx], ...payload };
  await saveProducts(categories, products, sha, `feat(admin): ${isNew ? 'ajout' : 'maj'} produit ${payload.id}`, env);
  return { categories, products };
}

async function handleDeleteProduct(payload, env) {
  const { categories, products, sha } = await loadProducts(env);
  const next = products.filter((p) => p.id !== payload.id);
  if (next.length === products.length) throw Object.assign(new Error('Produit introuvable.'), { statusCode: 404 });
  await saveProducts(categories, next, sha, `feat(admin): suppression produit ${payload.id}`, env);
  return { categories, products: next };
}

async function handleUpsertCategory(payload, env) {
  const { categories, products, sha } = await loadProducts(env);
  if (!SLUG_RE.test(String(payload.id || ''))) throw Object.assign(new Error('Identifiant catégorie invalide.'), { statusCode: 400 });
  if (!payload.label || !String(payload.label).trim()) throw Object.assign(new Error('Le libellé de la catégorie est requis.'), { statusCode: 400 });
  const idx = categories.findIndex((c) => c.id === payload.id);
  const isNew = idx === -1;
  if (isNew) categories.push({ id: payload.id, label: payload.label });
  else categories[idx] = { id: payload.id, label: payload.label };
  await saveProducts(categories, products, sha, `feat(admin): ${isNew ? 'ajout' : 'maj'} catégorie ${payload.id}`, env);
  return { categories, products };
}

async function handleDeleteCategory(payload, env) {
  const { categories, products, sha } = await loadProducts(env);
  if (products.some((p) => p.category === payload.id)) {
    throw Object.assign(new Error('Catégorie utilisée par au moins un produit : impossible de la supprimer.'), { statusCode: 400 });
  }
  const next = categories.filter((c) => c.id !== payload.id);
  if (next.length === categories.length) throw Object.assign(new Error('Catégorie introuvable.'), { statusCode: 404 });
  await saveProducts(next, products, sha, `feat(admin): suppression catégorie ${payload.id}`, env);
  return { categories: next, products };
}

async function handleUploadImage(payload, env) {
  const { filename, dataBase64 } = payload || {};
  if (!filename || !/^[a-z0-9][a-z0-9._-]{1,80}\.(jpg|jpeg|png|webp)$/i.test(filename)) {
    throw Object.assign(new Error('Nom de fichier image invalide.'), { statusCode: 400 });
  }
  if (!dataBase64 || typeof dataBase64 !== 'string') {
    throw Object.assign(new Error('Image manquante.'), { statusCode: 400 });
  }
  const approxBytes = Math.ceil((dataBase64.length * 3) / 4);
  if (approxBytes > MAX_IMAGE_BYTES) {
    throw Object.assign(new Error('Image trop lourde (max ~400 Ko).'), { statusCode: 400 });
  }
  const path = `${ASSETS_DIR}/${filename}`;
  const existing = await getFile(path, env);
  const res = await gh(`/repos/${env.repo}/contents/${path}`, env.token, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: `feat(admin): upload image ${filename}`,
      content: dataBase64,
      branch: env.branch,
      ...(existing ? { sha: existing.sha } : {}),
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw Object.assign(new Error(`Échec de l'envoi de l'image : ${text.slice(0, 300)}`), { statusCode: 502 });
  }
  return { path: `${ASSETS_DIR}/${filename}` };
}

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.status(200).end();
    return;
  }
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Méthode non autorisée.' });
    return;
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body || '{}'); } catch (e) {
      res.status(400).json({ error: 'Corps de requête JSON invalide.' });
      return;
    }
  }
  if (!body || typeof body !== 'object') body = {};

  let env;
  try {
    env = getEnv();
  } catch (e) {
    res.status(e.statusCode || 500).json({ error: e.message });
    return;
  }

  if (body.password !== env.adminPassword) {
    res.status(401).json({ error: 'Mot de passe incorrect.' });
    return;
  }

  const { action, payload } = body;

  try {
    switch (action) {
      case 'list': {
        const { categories, products } = await loadProducts(env);
        res.status(200).json({ categories, products });
        return;
      }
      case 'upsertProduct':
        res.status(200).json(await handleUpsertProduct(payload, env));
        return;
      case 'deleteProduct':
        res.status(200).json(await handleDeleteProduct(payload, env));
        return;
      case 'upsertCategory':
        res.status(200).json(await handleUpsertCategory(payload, env));
        return;
      case 'deleteCategory':
        res.status(200).json(await handleDeleteCategory(payload, env));
        return;
      case 'uploadImage':
        res.status(200).json(await handleUploadImage(payload, env));
        return;
      default:
        res.status(400).json({ error: `Action inconnue : ${action}` });
        return;
    }
  } catch (e) {
    res.status(e.statusCode || 500).json({ error: e.message || 'Erreur serveur.' });
  }
};
