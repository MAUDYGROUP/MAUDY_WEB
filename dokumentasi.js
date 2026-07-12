/* ============================================================
   DOKUMENTASI.JS — Galeri Proyek Publik
   ============================================================ */

const DOC_KEY = 'maudy_dokumentasi';

// ===== Load data =====
function loadDocs() {
  try {
    const raw = localStorage.getItem(DOC_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (_) { return []; }
}

// ===== State =====
let allProjects = [];
let currentFilter = 'all';
let lbProject = null;
let lbPhotoIdx = 0;

// ===== Render filter buttons =====
function renderFilters(projects) {
  const cats = ['all', ...new Set(projects.map(p => p.category).filter(Boolean))];
  const container = document.getElementById('doc-filters');
  container.innerHTML = cats.map(c =>
    `<button class="doc-filter-btn${c === currentFilter ? ' active' : ''}" data-filter="${c}">
      ${c === 'all' ? 'Semua Proyek' : c}
    </button>`
  ).join('');
  container.querySelectorAll('.doc-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentFilter = btn.dataset.filter;
      renderFilters(projects);
      renderGrid();
    });
  });
}

// ===== Render project grid =====
function renderGrid() {
  const grid  = document.getElementById('doc-grid');
  const empty = document.getElementById('doc-empty');
  const count = document.getElementById('doc-count');

  const filtered = currentFilter === 'all'
    ? allProjects
    : allProjects.filter(p => p.category === currentFilter);

  count.textContent = `${filtered.length} proyek`;

  if (filtered.length === 0) {
    grid.innerHTML = '';
    empty.removeAttribute('hidden');
    return;
  }
  empty.setAttribute('hidden', '');
  grid.innerHTML = filtered.map((p, i) => buildCard(p, i)).join('');

  // Click events
  grid.querySelectorAll('.doc-card').forEach(card => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.dataset.projIdx);
      const proj = allProjects.find(p => p.id === card.dataset.projId);
      if (proj && proj.photos && proj.photos.length > 0) {
        openLightbox(proj, 0);
      }
    });
  });
}

function buildCard(proj, i) {
  const photos = proj.photos || [];
  const coverHtml = buildCover(photos);
  return `
    <div class="doc-card" data-proj-id="${proj.id}" data-proj-idx="${i}" tabindex="0" role="button" aria-label="${proj.title}">
      <div class="doc-card-cover ${coverHtml.cls}">
        ${coverHtml.html}
        ${photos.length > 4 ? `<div class="cover-more">+${photos.length - 4} foto</div>` : ''}
      </div>
      <div class="doc-card-body">
        ${proj.category ? `<span class="doc-card-cat">${proj.category}</span>` : ''}
        <h2 class="doc-card-title">${proj.title || 'Proyek'}</h2>
        ${proj.description ? `<p class="doc-card-desc">${proj.description}</p>` : ''}
        <div class="doc-card-footer">
          <div>
            <div class="doc-card-client">${proj.client || ''}</div>
            <div class="doc-card-date">${proj.date || ''}</div>
          </div>
          <span class="doc-card-photos-count">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            ${photos.length} foto
          </span>
        </div>
      </div>
    </div>`;
}

function buildCover(photos) {
  const n = Math.min(photos.length, 4);
  if (n === 0) {
    return {
      cls: '',
      html: `<div class="cover-placeholder">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" opacity=".3"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        <span style="font-size:.8rem;color:var(--text3)">Belum ada foto</span>
      </div>`
    };
  }
  const cls = n === 1 ? 'photos-1' : n === 2 ? 'photos-2' : n === 3 ? 'photos-3' : 'photos-many';
  const html = photos.slice(0, 4).map(ph =>
    `<img class="cover-img" src="${ph.image}" alt="${ph.caption || ''}" draggable="false" loading="lazy" />`
  ).join('');
  return { cls, html };
}

// ===== Lightbox =====
function openLightbox(proj, photoIdx) {
  lbProject  = proj;
  lbPhotoIdx = photoIdx;

  const lb = document.getElementById('doc-lightbox');
  lb.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';

  document.getElementById('doc-lb-cat').textContent   = proj.category || '';
  document.getElementById('doc-lb-title').textContent = proj.title    || '';
  document.getElementById('doc-lb-meta').textContent  =
    [proj.client, proj.date].filter(Boolean).join(' · ');

  renderLbPhoto();
  renderLbThumbs();
  document.getElementById('doc-lb-close')?.focus();
}

function renderLbPhoto() {
  const photos = lbProject.photos || [];
  const ph     = photos[lbPhotoIdx] || {};

  const img = document.getElementById('doc-lb-img');
  img.style.opacity = '0';
  img.src = ph.image || '';
  img.alt = ph.caption || lbProject.title;
  img.onload = () => { img.style.opacity = '1'; };

  document.getElementById('doc-lb-caption').textContent = ph.caption || '';
  document.getElementById('doc-lb-counter').textContent = `${lbPhotoIdx + 1} / ${photos.length}`;

  const prevBtn = document.getElementById('doc-lb-prev');
  const nextBtn = document.getElementById('doc-lb-next');
  prevBtn.disabled = lbPhotoIdx === 0;
  nextBtn.disabled = lbPhotoIdx === photos.length - 1;

  // Sync thumbs
  document.querySelectorAll('.doc-lb-thumb').forEach((t, i) => {
    t.classList.toggle('active', i === lbPhotoIdx);
  });
  // Scroll active thumb into view
  const activeThumb = document.querySelector('.doc-lb-thumb.active');
  activeThumb?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
}

function renderLbThumbs() {
  const photos = lbProject.photos || [];
  const strip  = document.getElementById('doc-lb-thumbs');
  strip.innerHTML = photos.map((ph, i) =>
    `<div class="doc-lb-thumb${i === lbPhotoIdx ? ' active' : ''}" data-i="${i}">
       <img src="${ph.image}" alt="${ph.caption || ''}" draggable="false" loading="lazy" />
     </div>`
  ).join('');
  strip.querySelectorAll('.doc-lb-thumb').forEach(t => {
    t.addEventListener('click', () => {
      lbPhotoIdx = parseInt(t.dataset.i);
      renderLbPhoto();
    });
  });
}

function closeLightbox() {
  document.getElementById('doc-lightbox').setAttribute('hidden', '');
  document.body.style.overflow = '';
  lbProject  = null;
  lbPhotoIdx = 0;
}

// ===== Event bindings =====
document.getElementById('doc-lb-close')?.addEventListener('click', closeLightbox);
document.getElementById('doc-lb-backdrop')?.addEventListener('click', closeLightbox);

document.getElementById('doc-lb-prev')?.addEventListener('click', () => {
  if (lbPhotoIdx > 0) { lbPhotoIdx--; renderLbPhoto(); }
});
document.getElementById('doc-lb-next')?.addEventListener('click', () => {
  if (lbProject && lbPhotoIdx < lbProject.photos.length - 1) { lbPhotoIdx++; renderLbPhoto(); }
});

// Keyboard nav
document.addEventListener('keydown', e => {
  const lb = document.getElementById('doc-lightbox');
  if (lb.hasAttribute('hidden')) return;
  if (e.key === 'Escape')      closeLightbox();
  if (e.key === 'ArrowLeft'  && lbPhotoIdx > 0) { lbPhotoIdx--; renderLbPhoto(); }
  if (e.key === 'ArrowRight' && lbProject && lbPhotoIdx < lbProject.photos.length - 1) { lbPhotoIdx++; renderLbPhoto(); }
});

// Touch/swipe support
let touchStartX = 0;
document.getElementById('doc-lb-img')?.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
document.getElementById('doc-lb-img')?.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) < 50) return;
  if (dx < 0 && lbProject && lbPhotoIdx < lbProject.photos.length - 1) { lbPhotoIdx++; renderLbPhoto(); }
  if (dx > 0 && lbPhotoIdx > 0) { lbPhotoIdx--; renderLbPhoto(); }
});

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('doc-year').textContent = new Date().getFullYear();

  allProjects = loadDocs().filter(p => p.published !== false); // filter yg dipublish

  renderFilters(allProjects);
  renderGrid();

  // Navbar scroll effect
  window.addEventListener('scroll', () => {
    document.getElementById('doc-nav')?.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
});
