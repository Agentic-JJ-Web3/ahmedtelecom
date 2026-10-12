(() => {
  'use strict';
  const C = window.SITE_CONFIG;
  const PRODUCTS = window.PRODUCTS || [];
  const CATS = window.CATEGORIES || [];
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const icon = (id) => `<svg class="icon" aria-hidden="true"><use href="#i-${id}"/></svg>`;
  const money = (n) => `${Number(n).toLocaleString('fr-FR')} ${C.currency}`;
  const track = (e, d) => { try { C.track && C.track(e, d || {}); } catch (_) {} };

  /* ---------- WhatsApp ---------- */
  const number = String(C.whatsappNumber).replace(/\D/g, '');
  if (!/^237\d{9}$/.test(number)) {
    console.warn('[Ahmed Telecom] Numéro WhatsApp à configurer dans js/config.js (237 + 9 chiffres).');
    $('#setup-notice').hidden = false;
  }
  const waLink = (msg) => `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;
  const productLink = (p) => waLink(C.productMessage(p.name));
  const byId = (id) => PRODUCTS.find((p) => p.id === id);

  $$('a[data-wa]').forEach((a) => {
    a.href = waLink(C.defaultMessage);
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
  });

  document.addEventListener('click', (e) => {
    const w = e.target.closest('a[data-wa]');
    if (w) track('whatsapp_click', { placement: w.dataset.wa });
    const g = e.target.closest('a[data-wa-group]');
    if (g) track('whatsapp_group_click', {});
    const q = e.target.closest('a[data-inquiry]');
    if (q) { const p = byId(q.dataset.inquiry); if (p) track('product_inquiry_click', { id: p.id, name: p.name }); }
    const o = e.target.closest('[data-open]');
    if (o) openProduct(o.dataset.open, o);
    if (e.target.closest('[data-close]')) closeProduct();
  });

  /* ---------- Marque ---------- */
  $$('[data-logo]').forEach((i) => { i.src = C.logo; });
  $$('[data-name]').forEach((n) => { n.textContent = C.businessName; });
  $$('[data-location]').forEach((n) => { n.textContent = C.location; });
  $('[data-hero]').src = C.heroImage;
  $('#year').textContent = new Date().getFullYear();
  if (C.facebookUrl && !/VOTRE_PAGE/.test(C.facebookUrl)) {
    $('#fb-link').href = C.facebookUrl;
    $('#fb-item').hidden = false;
  }
  if (C.whatsappGroupUrl) {
    $$('[data-wa-group]').forEach((a) => { a.href = C.whatsappGroupUrl; a.target = '_blank'; a.rel = 'noopener noreferrer'; });
    $('#groupe').hidden = false;
    $('#group-item').hidden = false;
    $('[data-nav-group]').hidden = false;
  }
  const ann = C.announcement;
  if (ann && ann.enabled) {
    const el = $('#announce');
    el.innerHTML = `<a href="${esc(ann.link || '#produits')}">${esc(ann.text)}</a>`;
    el.hidden = false;
  }

  /* ---------- Menu mobile ---------- */
  const menuBtn = $('#menu-btn'), nav = $('#nav');
  const setMenu = (open) => { nav.classList.toggle('is-open', open); menuBtn.setAttribute('aria-expanded', String(open)); };
  menuBtn.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });

  /* ---------- Produits ---------- */
  const discount = (p) => (p.oldPrice && p.oldPrice > p.price ? Math.round((1 - p.price / p.oldPrice) * 100) : 0);
  const AVAIL = { in_stock: ['Disponible', 'in'], on_request: ['Sur demande', ''], out: ['Rupture de stock', 'out'] };
  const availHTML = (p) => (AVAIL[p.availability] ? `<span class="avail ${AVAIL[p.availability][1] ? 'avail--' + AVAIL[p.availability][1] : ''}">${AVAIL[p.availability][0]}</span>` : '');
  const sampleBadge = (p) => (p.sample && C.showSampleBadge ? '<span class="badge badge--sample">Exemple</span>' : '');
  const priceHTML = (p) => `<span class="price"><strong>${money(p.price)}</strong>${discount(p) ? `<s><span class="sr-only">Ancien prix </span>${money(p.oldPrice)}</s>` : ''}</span>`;

  const cardHTML = (p) => `
    <article class="card">
      <button type="button" class="card__main" data-open="${esc(p.id)}">
        <span class="card__media">
          <img src="${esc(p.image)}" alt="${esc(p.imageAlt || p.name)}" width="600" height="600" loading="lazy" decoding="async">
          ${discount(p) ? `<span class="badge badge--disc">−${discount(p)} %</span>` : ''}${sampleBadge(p)}
        </span>
        <span class="card__body">
          <span class="card__name">${esc(p.name)}</span>
          <span class="card__desc">${esc(p.short || '')}</span>
          ${priceHTML(p)}${availHTML(p)}
        </span>
      </button>
      <a class="btn btn--wa" href="${productLink(p)}" target="_blank" rel="noopener noreferrer" data-inquiry="${esc(p.id)}">${icon('wa')}Demander</a>
    </article>`;

  const grid = $('#grid'), chips = $('#chips');
  let active = 'all';
  let searchTerm = '';
  const DIACRITICS = { à: 'a', â: 'a', ä: 'a', é: 'e', è: 'e', ê: 'e', ë: 'e', î: 'i', ï: 'i', ô: 'o', ö: 'o', ù: 'u', û: 'u', ü: 'u', ç: 'c' };
  const normalize = (s) => String(s).toLowerCase().replace(/[àâäéèêëîïôöùûüç]/g, (c) => DIACRITICS[c] || c);
  function renderGrid() {
    const term = normalize(searchTerm.trim());
    let list = active === 'all' ? PRODUCTS : PRODUCTS.filter((p) => p.category === active);
    if (term) list = list.filter((p) => normalize(p.name).includes(term) || normalize(p.short || '').includes(term));
    grid.innerHTML = list.length ? list.map(cardHTML).join('') : `<p>${term ? 'Aucun produit ne correspond à votre recherche.' : 'Aucun produit dans cette catégorie pour le moment.'}</p>`;
  }
  function renderChips() {
    const used = CATS.filter((c) => PRODUCTS.some((p) => p.category === c.id));
    if (used.length < 2) return;
    chips.innerHTML = [{ id: 'all', label: 'Tout' }, ...used]
      .map((c) => `<button type="button" class="chip" data-cat="${esc(c.id)}" aria-pressed="${c.id === active}">${esc(c.label)}</button>`).join('');
  }
  chips.addEventListener('click', (e) => {
    const b = e.target.closest('[data-cat]');
    if (!b) return;
    active = b.dataset.cat;
    $$('.chip', chips).forEach((c) => c.setAttribute('aria-pressed', String(c === b)));
    renderGrid();
  });
  renderChips();
  renderGrid();

  /* ---------- Recherche ---------- */
  const searchToggle = $('#search-toggle'), searchRow = $('#search-row'), searchInput = $('#search-input');
  function setSearchOpen(open) {
    searchRow.classList.toggle('is-open', open);
    searchToggle.setAttribute('aria-expanded', String(open));
    if (open) requestAnimationFrame(() => searchInput.focus());
  }
  searchToggle.addEventListener('click', () => setSearchOpen(!searchRow.classList.contains('is-open')));
  searchInput.addEventListener('input', () => { searchTerm = searchInput.value; renderGrid(); });

  /* ---------- Offre ---------- */
  (function renderOffer() {
    const o = C.offer;
    if (!o || !o.enabled) return;
    let end = null;
    if (o.deadline) {
      end = new Date(o.deadline + 'T23:59:59');
      if (isNaN(end) || end < new Date()) return;
    }
    const ids = o.productIds && o.productIds.length ? o.productIds : PRODUCTS.filter(discount).map((p) => p.id);
    const items = ids.map(byId).filter(Boolean);
    if (!items.length) return;
    const msg = `Bonjour Ahmed Telecom ! Je souhaite profiter de l'offre : ${o.title}.`;
    const sec = $('#offres');
    sec.innerHTML = `
      <div class="container"><div class="offer">
        <div class="offer__intro">
          <h2 id="offer-title">${esc(o.title)}</h2>
          <p>${esc(o.text)}</p>
          ${end ? `<p class="offer__date">Jusqu'au ${end.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>` : ''}
          <a class="btn btn--light" data-wa="offer" href="${waLink(msg)}" target="_blank" rel="noopener noreferrer">${icon('wa')}Demander l'offre</a>
        </div>
        <div class="offer__list">
          ${items.map((p) => `
            <div class="offer__row">
              <img src="${esc(p.image)}" alt="${esc(p.imageAlt || p.name)}" width="72" height="72" loading="lazy">
              <div><div class="offer__name">${esc(p.name)}${p.sample && C.showSampleBadge ? ' (exemple)' : ''}</div>${priceHTML(p)}</div>
              <a class="btn btn--wa btn--sm" href="${productLink(p)}" target="_blank" rel="noopener noreferrer" data-inquiry="${esc(p.id)}">${icon('wa')}Demander</a>
            </div>`).join('')}
        </div>
      </div></div>`;
    sec.hidden = false;
    $('[data-nav-offers]').hidden = false;
  })();

  /* ---------- Fiche produit ---------- */
  const drawer = $('#drawer'), panel = $('.drawer__panel', drawer), page = $('#page');
  let lastFocus = null;

  function openProduct(id, trigger) {
    const p = byId(id);
    if (!p) return;
    lastFocus = trigger || document.activeElement;
    $('#drawer-content').innerHTML = `
      <div class="detail__media"><img src="${esc(p.image)}" alt="${esc(p.imageAlt || p.name)}" width="600" height="600"></div>
      <div class="detail__info">
        <h2 id="drawer-title">${esc(p.name)}</h2>
        <div class="detail__price"><strong>${money(p.price)}</strong>${discount(p) ? `<s>${money(p.oldPrice)}</s><span class="badge badge--disc">−${discount(p)} %</span>` : ''}</div>
        ${availHTML(p)}
        <p>${esc(p.description || p.short || '')}</p>
        ${p.features && p.features.length ? `<ul>${p.features.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>` : ''}
        ${p.sample && C.showSampleBadge ? '<p class="detail__note">Produit et prix d’exemple. Écrivez-nous pour confirmer le prix et la disponibilité.</p>' : ''}
      </div>`;
    const wa = $('#drawer-wa');
    wa.href = productLink(p);
    wa.dataset.inquiry = p.id;
    $('.drawer__body', drawer).scrollTop = 0;
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('drawer-open');
    page.inert = true;
    requestAnimationFrame(() => $('#drawer-close').focus());
    track('product_view', { id: p.id, name: p.name });
  }

  function closeProduct() {
    if (!drawer.classList.contains('is-open')) return;
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('drawer-open');
    page.inert = false;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeProduct(); setMenu(false); setSearchOpen(false); }
    if (e.key === 'Tab' && drawer.classList.contains('is-open')) {
      const f = $$('a[href],button:not([disabled])', panel).filter((x) => x.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
})();
