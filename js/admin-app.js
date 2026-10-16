(() => {
  'use strict';
  const API_URL = '/api/admin';
  const PWD_KEY = 'at_admin_pwd';
  const $ = (s, r = document) => r.querySelector(s);

  let state = { categories: [], products: [] };
  let editingId = null; // null = création, sinon id du produit en cours d'édition

  const gate = $('#gate');
  const gateForm = $('#gate-form');
  const gateError = $('#gate-error');
  const dashboard = $('#dashboard');
  const statusLine = $('#status-line');

  function getPassword() { return sessionStorage.getItem(PWD_KEY) || ''; }
  function setPassword(p) { sessionStorage.setItem(PWD_KEY, p); }
  function clearPassword() { sessionStorage.removeItem(PWD_KEY); }

  function setStatus(msg, kind) {
    statusLine.textContent = msg || '';
    statusLine.classList.remove('is-error', 'is-ok');
    if (kind) statusLine.classList.add(kind === 'error' ? 'is-error' : 'is-ok');
  }

  async function call(action, payload) {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: getPassword(), action, payload }),
    });
    let data;
    try { data = await res.json(); } catch (e) { data = {}; }
    if (res.status === 401) {
      clearPassword();
      showGate('Mot de passe incorrect.');
      throw new Error('unauthorized');
    }
    if (!res.ok) throw new Error(data.error || `Erreur (${res.status})`);
    return data;
  }

  function showGate(error) {
    dashboard.hidden = true;
    gate.hidden = false;
    if (error) { gateError.textContent = error; gateError.hidden = false; }
    else { gateError.hidden = true; }
  }

  function showDashboard() {
    gate.hidden = true;
    dashboard.hidden = false;
  }

  /* ---------- Catégories ---------- */
  function renderCategories() {
    const list = $('#category-list');
    list.innerHTML = state.categories.map((c) => `
      <li data-cat="${c.id}">
        <span>${c.label} <code>(${c.id})</code></span>
        <button type="button" data-del-cat="${c.id}" title="Supprimer la catégorie" aria-label="Supprimer">&times;</button>
      </li>`).join('') || '<li class="admin-muted">Aucune catégorie.</li>';

    const sel = $('#p-category');
    const current = sel.value;
    sel.innerHTML = state.categories.map((c) => `<option value="${c.id}">${c.label}</option>`).join('');
    if (state.categories.some((c) => c.id === current)) sel.value = current;
  }

  $('#category-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = $('#cat-id').value.trim();
    const label = $('#cat-label').value.trim();
    try {
      setStatus('Enregistrement de la catégorie…');
      const data = await call('upsertCategory', { id, label });
      state = data;
      renderCategories();
      renderProducts();
      $('#category-form').reset();
      setStatus('Catégorie enregistrée.', 'ok');
    } catch (err) {
      setStatus(err.message, 'error');
    }
  });

  $('#category-list').addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-del-cat]');
    if (!btn) return;
    const id = btn.dataset.delCat;
    if (!confirm(`Supprimer la catégorie "${id}" ?`)) return;
    try {
      setStatus('Suppression…');
      const data = await call('deleteCategory', { id });
      state = data;
      renderCategories();
      renderProducts();
      setStatus('Catégorie supprimée.', 'ok');
    } catch (err) {
      setStatus(err.message, 'error');
    }
  });

  /* ---------- Produits ---------- */
  function money(n) { return `${Number(n).toLocaleString('fr-FR')} XAF`; }

  function renderProducts() {
    const list = $('#product-list');
    list.innerHTML = state.products.map((p) => `
      <div class="admin-product-row" data-id="${p.id}">
        <img src="${p.image || ''}" alt="" loading="lazy">
        <div class="admin-product-row__main">
          <div class="admin-product-row__name">${p.name}</div>
          <div class="admin-product-row__meta">${p.id} · ${money(p.price)}${p.oldPrice ? ` (avant ${money(p.oldPrice)})` : ''} · ${p.category}</div>
        </div>
        <div class="admin-product-row__actions">
          <button type="button" class="btn btn--sm" data-edit="${p.id}">Modifier</button>
          <button type="button" class="btn btn--sm" data-del="${p.id}">Supprimer</button>
        </div>
      </div>`).join('') || '<p class="admin-muted">Aucun produit.</p>';
  }

  $('#product-list').addEventListener('click', async (e) => {
    const editBtn = e.target.closest('[data-edit]');
    const delBtn = e.target.closest('[data-del]');
    if (editBtn) {
      const p = state.products.find((x) => x.id === editBtn.dataset.edit);
      if (p) openProductForm(p);
    }
    if (delBtn) {
      const id = delBtn.dataset.del;
      if (!confirm(`Supprimer le produit "${id}" ?`)) return;
      try {
        setStatus('Suppression…');
        const data = await call('deleteProduct', { id });
        state = data;
        renderProducts();
        setStatus('Produit supprimé.', 'ok');
      } catch (err) {
        setStatus(err.message, 'error');
      }
    }
  });

  function openProductForm(product) {
    editingId = product ? product.id : null;
    $('#product-form-title').textContent = product ? `Modifier : ${product.name}` : 'Nouveau produit';
    $('#p-id').value = product ? product.id : '';
    $('#p-id').toggleAttribute('readonly', !!product);
    $('#p-category').value = product ? product.category : ($('#p-category').options[0] || {}).value || '';
    $('#p-name').value = product ? product.name : '';
    $('#p-price').value = product ? product.price : '';
    $('#p-oldprice').value = product && product.oldPrice != null ? product.oldPrice : '';
    $('#p-availability').value = product && product.availability ? product.availability : '';
    $('#p-sample').checked = !!(product && product.sample);
    $('#p-short').value = product ? (product.short || '') : '';
    $('#p-description').value = product ? (product.description || '') : '';
    $('#p-features').value = product && Array.isArray(product.features) ? product.features.join(', ') : '';
    $('#p-imagealt').value = product ? (product.imageAlt || '') : '';
    $('#p-image-path').value = product ? (product.image || '') : '';
    $('#p-image-current').textContent = product && product.image ? `Photo actuelle : ${product.image}` : 'Aucune photo pour le moment.';
    $('#p-image-file').value = '';
    $('#product-form-section').hidden = false;
    $('#product-form-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  $('#new-product-btn').addEventListener('click', () => openProductForm(null));
  $('#cancel-product-btn').addEventListener('click', () => { $('#product-form-section').hidden = true; });

  function resizeImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error('Lecture du fichier impossible.'));
      reader.onload = () => {
        const img = new Image();
        img.onerror = () => reject(new Error('Fichier image invalide.'));
        img.onload = () => {
          const max = 800;
          const scale = Math.min(1, max / Math.max(img.width, img.height));
          const width = Math.max(1, Math.round(img.width * scale));
          const height = Math.max(1, Math.round(img.height * scale));
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.82).split(',')[1]);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  function slugify(s) {
    return String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }

  $('#product-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = slugify($('#p-id').value);
    const file = $('#p-image-file').files[0];
    let imagePath = $('#p-image-path').value;

    if (!file && !imagePath) {
      setStatus('Veuillez choisir une photo pour ce produit.', 'error');
      return;
    }

    const product = {
      id,
      category: $('#p-category').value,
      name: $('#p-name').value.trim(),
      price: Number($('#p-price').value),
      oldPrice: $('#p-oldprice').value ? Number($('#p-oldprice').value) : null,
      availability: $('#p-availability').value || null,
      sample: $('#p-sample').checked,
      short: $('#p-short').value.trim(),
      description: $('#p-description').value.trim(),
      features: $('#p-features').value.split(',').map((f) => f.trim()).filter(Boolean),
      imageAlt: $('#p-imagealt').value.trim(),
      image: imagePath,
    };

    try {
      if (file) {
        setStatus('Envoi de la photo…');
        const base64 = await resizeImage(file);
        const filename = `${id}-${Date.now()}.jpg`;
        const up = await call('uploadImage', { filename, dataBase64: base64 });
        product.image = up.path;
      }
      setStatus('Enregistrement du produit…');
      const data = await call('upsertProduct', product);
      state = data;
      renderCategories();
      renderProducts();
      $('#product-form-section').hidden = true;
      setStatus('Produit enregistré. Le site va se redéployer (≈30-60s).', 'ok');
    } catch (err) {
      setStatus(err.message, 'error');
    }
  });

  /* ---------- Auth ---------- */
  gateForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const pwd = $('#gate-password').value;
    setPassword(pwd);
    try {
      const data = await call('list');
      state = data;
      showDashboard();
      renderCategories();
      renderProducts();
      setStatus('Connecté.', 'ok');
    } catch (err) {
      if (err.message !== 'unauthorized') showGate(err.message);
    }
  });

  $('#logout-btn').addEventListener('click', () => {
    clearPassword();
    location.reload();
  });

  (async function init() {
    if (!getPassword()) { showGate(); return; }
    try {
      const data = await call('list');
      state = data;
      showDashboard();
      renderCategories();
      renderProducts();
    } catch (err) {
      if (err.message !== 'unauthorized') showGate(err.message);
    }
  })();
})();
