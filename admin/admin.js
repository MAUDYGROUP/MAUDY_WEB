/* ============================================================
   MAUDY IT Solution — Admin Panel JavaScript
   LocalStorage-based CMS — No backend required
   ============================================================ */

'use strict';

// ============================================================
// STORAGE KEY & DEFAULT CONFIG
// ============================================================
const STORAGE_KEY = 'maudy_cms_data';
const AUTH_KEY    = 'maudy_admin_auth';
const SESSION_KEY = 'maudy_admin_session';

const DEFAULT_DATA = {
  contact: {
    whatsapp: '6281234567890',
    phone:    '+62 812-3456-7890',
    email:    'info@maudyitsolution.com',
    address:  'Jl. Teknologi No. 99, Kota Maju, Indonesia',
    hours_id: 'Senin – Sabtu: 08.00 – 17.00\nSupport 24/7 tersedia',
    hours_en: 'Mon – Sat: 08:00 – 17:00\n24/7 support available',
  },
  stats: {
    years:    10,
    projects: 150,
    clients:  80,
    services: 38,
  },
  company: {
    name:           'MAUDY IT Solution',
    hero_badge_id:  '⚡ IT Solution Terpercaya #1',
    hero_badge_en:  '⚡ Trusted IT Solution #1',
    trust_count:    50,
    desc_id:        'Solusi IT terlengkap untuk mendukung pertumbuhan bisnis Anda. Dari service komputer, instalasi jaringan, pengembangan software hingga keamanan sistem — semua ada di sini.',
    desc_en:        'The most comprehensive IT solutions to support your business growth. From computer service, network installation, software development to system security — all here.',
    footer_desc_id: 'Mitra teknologi terpercaya untuk mendukung transformasi digital bisnis Anda.',
  },
  social: {
    facebook:  '#',
    instagram: '#',
    linkedin:  '#',
    tiktok:    '',
  },
  partners: [
    'Ubiquiti', 'TP-Link', 'ASUS', 'Microsoft',
    'Cisco', 'HP', 'Dell', 'Lenovo', 'MikroTik',
    'Hikvision'
  ],
  testimonials: [
    {
      name:  'Budi Santoso',
      role:  'IT Manager, PT Maju Bersama',
      text_id: 'MAUDY IT Solution sangat profesional dalam menangani infrastruktur jaringan kami. Semua berjalan lancar dan tepat waktu.',
      text_en: 'MAUDY IT Solution is very professional in handling our network infrastructure. Everything runs smoothly and on time.',
      avatar: 'B',
    },
    {
      name:  'Siti Rahma',
      role:  'Owner, Toko Online Berkah',
      text_id: 'Website toko kami sekarang jauh lebih cepat dan profesional setelah ditangani tim MAUDY. Penjualan meningkat 40%!',
      text_en: 'Our store website is now much faster and more professional after being handled by the MAUDY team. Sales increased 40%!',
      avatar: 'S',
    },
    {
      name:  'Hendra Wijaya',
      role:  'Direktur, CV Teknologi Nusantara',
      text_id: 'Support 24/7 yang mereka tawarkan benar-benar terbukti. Masalah server tengah malam langsung ditangani dengan cepat.',
      text_en: 'The 24/7 support they offer is truly proven. Midnight server issues were handled quickly.',
      avatar: 'H',
    },
    {
      name:  'Dewi Kusuma',
      role:  'HRD Manager, RS Sehat Sejahtera',
      text_id: 'Instalasi CCTV dan sistem keamanan kantor kami dikerjakan rapi dan sesuai kebutuhan. Sangat recommended!',
      text_en: 'CCTV installation and office security systems were done neatly and as needed. Highly recommended!',
      avatar: 'D',
    },
  ],
};

// ============================================================
// AUTH MANAGEMENT
// ============================================================
function getCredentials() {
  const stored = localStorage.getItem(AUTH_KEY);
  if (stored) return JSON.parse(stored);
  return { username: 'admin', password: 'maudy2025' };
}

function saveCredentials(username, password) {
  localStorage.setItem(AUTH_KEY, JSON.stringify({ username, password }));
}

function isLoggedIn() {
  return sessionStorage.getItem(SESSION_KEY) === 'true';
}

function login(user, pass) {
  const creds = getCredentials();
  return user === creds.username && pass === creds.password;
}

function logout() {
  sessionStorage.removeItem(SESSION_KEY);
  showLogin();
}

// ============================================================
// DATA MANAGEMENT
// ============================================================
function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return JSON.parse(JSON.stringify(DEFAULT_DATA));
    const saved = JSON.parse(raw);
    // Deep merge with defaults to handle missing keys
    return deepMerge(JSON.parse(JSON.stringify(DEFAULT_DATA)), saved);
  } catch (e) {
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
  }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function deepMerge(target, source) {
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      if (!target[key]) target[key] = {};
      deepMerge(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

// ============================================================
// DOM REFS
// ============================================================
let data = loadData();

const loginScreen  = document.getElementById('login-screen');
const adminApp     = document.getElementById('admin-app');
const loginForm    = document.getElementById('login-form');
const loginError   = document.getElementById('login-error');
const logoutBtn    = document.getElementById('logout-btn');
const saveAllBtn   = document.getElementById('save-all-btn');
const saveStatus   = document.getElementById('save-status');
const sidebarEl    = document.getElementById('sidebar');
const sidebarToggle= document.getElementById('sidebar-toggle');
const navItems     = document.querySelectorAll('.nav-item');
const tabPanels    = document.querySelectorAll('.tab-panel');
const pageTitle    = document.getElementById('page-title');

// ============================================================
// SHOW / HIDE SCREENS
// ============================================================
function showLogin() {
  loginScreen.classList.remove('hidden');
  adminApp.classList.add('hidden');
  document.getElementById('admin-user').value = '';
  document.getElementById('admin-pass').value = '';
}

function showAdmin() {
  loginScreen.classList.add('hidden');
  adminApp.classList.remove('hidden');
  data = loadData();
  populateForms();
  updateDashboard();
}

// ============================================================
// LOGIN LOGIC
// ============================================================
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  loginError.classList.remove('show');
  const user = document.getElementById('admin-user').value.trim();
  const pass = document.getElementById('admin-pass').value;
  if (!user || !pass) {
    loginError.textContent = 'Isi username dan password.';
    loginError.classList.add('show');
    return;
  }
  if (login(user, pass)) {
    sessionStorage.setItem(SESSION_KEY, 'true');
    showAdmin();
  } else {
    loginError.textContent = 'Username atau password salah.';
    loginError.classList.add('show');
    document.getElementById('admin-pass').value = '';
    document.getElementById('admin-pass').focus();
  }
});

logoutBtn.addEventListener('click', logout);

// Toggle password visibility
document.getElementById('toggle-pass').addEventListener('click', () => {
  const inp = document.getElementById('admin-pass');
  inp.type = inp.type === 'password' ? 'text' : 'password';
});

// ============================================================
// SIDEBAR / TABS
// ============================================================
const TAB_TITLES = {
  dashboard:    'Dashboard',
  contact:      'Info Kontak',
  stats:        'Statistik',
  company:      'Profil Perusahaan',
  social:       'Media Sosial',
  partners:     'Partner & Rekanan',
  testimonials: 'Testimoni',
  security:     'Keamanan',
};

navItems.forEach(item => {
  item.addEventListener('click', () => {
    const tab = item.dataset.tab;
    navItems.forEach(n => { n.classList.remove('active'); n.removeAttribute('aria-current'); });
    item.classList.add('active');
    item.setAttribute('aria-current', 'page');
    tabPanels.forEach(p => p.classList.remove('active'));
    document.getElementById(`tab-${tab}`).classList.add('active');
    pageTitle.textContent = TAB_TITLES[tab] || tab;
    // Close sidebar on mobile
    if (window.innerWidth <= 768) closeSidebar();
  });
});

// Sidebar toggle (mobile)
let overlay = null;
function createOverlay() {
  if (overlay) return;
  overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  overlay.addEventListener('click', closeSidebar);
  document.body.appendChild(overlay);
}

function closeSidebar() {
  sidebarEl.classList.remove('open');
  if (overlay) overlay.classList.remove('show');
}

sidebarToggle.addEventListener('click', () => {
  createOverlay();
  sidebarEl.classList.toggle('open');
  overlay.classList.toggle('show');
});

// ============================================================
// POPULATE FORMS
// ============================================================
function populateForms() {
  // Contact
  const c = data.contact;
  setVal('c-whatsapp', c.whatsapp);
  setVal('c-phone',    c.phone);
  setVal('c-email',    c.email);
  setVal('c-address',  c.address);
  setVal('c-hours',    c.hours_id);
  setVal('c-hours-en', c.hours_en);

  // Stats
  const s = data.stats;
  setVal('s-years',    s.years);
  setVal('s-projects', s.projects);
  setVal('s-clients',  s.clients);
  setVal('s-services', s.services);
  updateStatPreviews();

  // Company
  const co = data.company;
  setVal('co-name',           co.name);
  setVal('co-hero-badge-id',  co.hero_badge_id);
  setVal('co-hero-badge-en',  co.hero_badge_en);
  setVal('co-trust-count',    co.trust_count);
  setVal('co-desc-id',        co.desc_id);
  setVal('co-desc-en',        co.desc_en);
  setVal('co-footer-desc-id', co.footer_desc_id);

  // Social
  const sm = data.social;
  setVal('sm-facebook',  sm.facebook === '#' ? '' : sm.facebook);
  setVal('sm-instagram', sm.instagram === '#' ? '' : sm.instagram);
  setVal('sm-linkedin',  sm.linkedin === '#' ? '' : sm.linkedin);
  setVal('sm-tiktok',    sm.tiktok);

  // Partners
  renderPartners();

  // Testimonials
  renderTestimonials();
}

function setVal(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val !== undefined && val !== null ? val : '';
}

// ============================================================
// STATS PREVIEW
// ============================================================
['s-years','s-projects','s-clients','s-services'].forEach(id => {
  document.getElementById(id).addEventListener('input', updateStatPreviews);
});

function updateStatPreviews() {
  const map = {
    'preview-years':    's-years',
    'preview-projects': 's-projects',
    'preview-clients':  's-clients',
    'preview-services': 's-services',
  };
  for (const [prevId, inpId] of Object.entries(map)) {
    const el = document.getElementById(prevId);
    const inp = document.getElementById(inpId);
    if (el && inp) el.textContent = inp.value || '0';
  }
}

// ============================================================
// PARTNERS LIST
// ============================================================
// PARTNERS LIST + DRAG & DROP REORDER
// ============================================================
let dragSrc = null;  // elemen yang sedang di-drag
let dragPlaceholder = null;  // placeholder visual

function renderPartners() {
  const list = document.getElementById('partners-list');
  list.innerHTML = '';
  data.partners.forEach((p, idx) => {
    list.appendChild(createPartnerRow(p, idx));
  });
  initPartnerDragDrop();
}

function createPartnerRow(name, idx) {
  const row = document.createElement('div');
  row.className = 'partner-row';
  row.dataset.idx = idx;
  row.draggable = true;
  row.innerHTML = `
    <span class="drag-handle" title="Seret untuk mengubah urutan" aria-hidden="true">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
    </span>
    <input type="text" value="${escapeHtml(name)}" placeholder="Nama partner" aria-label="Nama partner ${idx + 1}" />
    <button class="btn-remove" title="Hapus partner" aria-label="Hapus ${escapeHtml(name)}">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
    </button>
  `;
  row.querySelector('.btn-remove').addEventListener('click', () => {
    data.partners.splice(idx, 1);
    renderPartners();
  });
  row.querySelector('input').addEventListener('input', (e) => {
    data.partners[idx] = e.target.value;
  });
  return row;
}

function initPartnerDragDrop() {
  const list = document.getElementById('partners-list');
  const rows  = list.querySelectorAll('.partner-row');

  rows.forEach(row => {
    // ---- dragstart: ambil elemen ----
    row.addEventListener('dragstart', (e) => {
      dragSrc = row;
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', row.dataset.idx);
      // Delay agar clone tidak tampak saat visual hilang
      setTimeout(() => row.classList.add('dragging'), 0);
    });

    // ---- dragend: bersihkan state ----
    row.addEventListener('dragend', () => {
      row.classList.remove('dragging');
      list.querySelectorAll('.partner-row').forEach(r => r.classList.remove('drag-over'));
      if (dragPlaceholder && dragPlaceholder.parentNode) {
        dragPlaceholder.parentNode.removeChild(dragPlaceholder);
      }
      dragPlaceholder = null;
      dragSrc = null;
      // Sync data array dari urutan DOM
      syncPartnersFromDOM();
    });

    // ---- dragover: tampilkan posisi drop ----
    row.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      if (!dragSrc || dragSrc === row) return;
      list.querySelectorAll('.partner-row').forEach(r => r.classList.remove('drag-over'));
      row.classList.add('drag-over');
    });

    // ---- dragleave: hapus highlight ----
    row.addEventListener('dragleave', (e) => {
      if (!row.contains(e.relatedTarget)) {
        row.classList.remove('drag-over');
      }
    });

    // ---- drop: pindahkan elemen ----
    row.addEventListener('drop', (e) => {
      e.preventDefault();
      if (!dragSrc || dragSrc === row) return;
      row.classList.remove('drag-over');

      // Tentukan posisi: atas atau bawah dari row target
      const rect   = row.getBoundingClientRect();
      const midY   = rect.top + rect.height / 2;
      const before = e.clientY < midY;

      if (before) {
        list.insertBefore(dragSrc, row);
      } else {
        list.insertBefore(dragSrc, row.nextSibling);
      }

      syncPartnersFromDOM();
    });

    // ---- Hanya drag handle yang bisa mulai drag ----
    const handle = row.querySelector('.drag-handle');
    const input  = row.querySelector('input');

    handle.style.cursor = 'grab';
    // Input tidak boleh trigger drag
    input.addEventListener('mousedown', (e) => e.stopPropagation());
    input.addEventListener('dragstart', (e) => e.preventDefault());
  });
}

// Sinkronisasi data.partners dari urutan row di DOM
function syncPartnersFromDOM() {
  const list   = document.getElementById('partners-list');
  const inputs = list.querySelectorAll('.partner-row input');
  data.partners = Array.from(inputs).map(inp => inp.value);
  // Update idx dataset masing-masing row
  list.querySelectorAll('.partner-row').forEach((row, i) => {
    row.dataset.idx = i;
    const inp = row.querySelector('input');
    if (inp) inp.setAttribute('aria-label', `Nama partner ${i + 1}`);
  });
}

document.getElementById('add-partner-btn').addEventListener('click', () => {
  data.partners.push('');
  renderPartners();
  const inputs = document.querySelectorAll('#partners-list .partner-row input');
  if (inputs.length) inputs[inputs.length - 1].focus();
});


// ============================================================
// TESTIMONIALS
// ============================================================
function renderTestimonials() {
  const list = document.getElementById('testi-list');
  list.innerHTML = '';
  data.testimonials.forEach((t, idx) => {
    list.appendChild(createTestiRow(t, idx));
  });
}

function createTestiRow(t, idx) {
  const row = document.createElement('div');
  row.className = 'testi-row';
  row.innerHTML = `
    <div class="testi-row-header">
      <span class="testi-row-title">Testimoni ${idx + 1}</span>
      <button class="btn-remove" title="Hapus testimoni" aria-label="Hapus testimoni ${idx + 1}">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
      </button>
    </div>
    <div class="testi-fields">
      <div class="field-group">
        <label>Nama</label>
        <input type="text" class="t-name" value="${escapeHtml(t.name)}" placeholder="Nama klien" />
      </div>
      <div class="field-group">
        <label>Jabatan / Perusahaan</label>
        <input type="text" class="t-role" value="${escapeHtml(t.role)}" placeholder="Manager, PT. ABC" />
      </div>
      <div class="field-group span-2">
        <label>Testimoni (ID)</label>
        <textarea class="t-text-id" rows="3" placeholder="Isi testimoni dalam Bahasa Indonesia...">${escapeHtml(t.text_id)}</textarea>
      </div>
      <div class="field-group span-2">
        <label>Testimoni (EN)</label>
        <textarea class="t-text-en" rows="3" placeholder="Testimonial content in English...">${escapeHtml(t.text_en)}</textarea>
      </div>
    </div>
  `;
  row.querySelector('.btn-remove').addEventListener('click', () => {
    data.testimonials.splice(idx, 1);
    renderTestimonials();
  });
  const sync = () => {
    data.testimonials[idx] = {
      name:    row.querySelector('.t-name').value,
      role:    row.querySelector('.t-role').value,
      text_id: row.querySelector('.t-text-id').value,
      text_en: row.querySelector('.t-text-en').value,
      avatar:  (row.querySelector('.t-name').value || 'A')[0].toUpperCase(),
    };
  };
  row.querySelectorAll('input, textarea').forEach(el => el.addEventListener('input', sync));
  return row;
}

document.getElementById('add-testi-btn').addEventListener('click', () => {
  data.testimonials.push({ name: '', role: '', text_id: '', text_en: '', avatar: '?' });
  renderTestimonials();
  const rows = document.querySelectorAll('.testi-row');
  if (rows.length) rows[rows.length - 1].querySelector('input').focus();
});

// ============================================================
// SAVE ALL
// ============================================================
saveAllBtn.addEventListener('click', () => {
  collectFormData();
  saveData(data);
  showToast('✅ Data berhasil disimpan! Reload website untuk melihat perubahan.', 'success');
  showSaveStatus();
  updateDashboard();
});

function collectFormData() {
  // Contact
  data.contact = {
    whatsapp: getVal('c-whatsapp'),
    phone:    getVal('c-phone'),
    email:    getVal('c-email'),
    address:  getVal('c-address'),
    hours_id: getVal('c-hours'),
    hours_en: getVal('c-hours-en'),
  };

  // Stats
  data.stats = {
    years:    parseInt(getVal('s-years'))    || 10,
    projects: parseInt(getVal('s-projects')) || 150,
    clients:  parseInt(getVal('s-clients'))  || 80,
    services: parseInt(getVal('s-services')) || 38,
  };

  // Company
  data.company = {
    name:           getVal('co-name')           || 'MAUDY IT Solution',
    hero_badge_id:  getVal('co-hero-badge-id'),
    hero_badge_en:  getVal('co-hero-badge-en'),
    trust_count:    parseInt(getVal('co-trust-count')) || 50,
    desc_id:        getVal('co-desc-id'),
    desc_en:        getVal('co-desc-en'),
    footer_desc_id: getVal('co-footer-desc-id'),
  };

  // Social
  const fb = getVal('sm-facebook').trim();
  const ig = getVal('sm-instagram').trim();
  const li = getVal('sm-linkedin').trim();
  data.social = {
    facebook:  fb || '#',
    instagram: ig || '#',
    linkedin:  li || '#',
    tiktok:    getVal('sm-tiktok').trim(),
  };

  // Partners — already in data.partners (live-updated)
  // Testimonials — already in data.testimonials (live-updated)
}

function getVal(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

// ============================================================
// SECURITY — CHANGE PASSWORD
// ============================================================
document.getElementById('change-pass-btn').addEventListener('click', () => {
  const secStatus = document.getElementById('sec-status');
  secStatus.className = 'form-status';
  secStatus.style.display = 'none';

  const newUser    = document.getElementById('sec-user').value.trim();
  const oldPass    = document.getElementById('sec-pass-old').value;
  const newPass    = document.getElementById('sec-pass-new').value;
  const confirmPass= document.getElementById('sec-pass-confirm').value;

  const creds = getCredentials();

  if (!oldPass) { showSecStatus('error', 'Masukkan password lama.'); return; }
  if (oldPass !== creds.password) { showSecStatus('error', 'Password lama salah.'); return; }
  if (newPass.length < 6) { showSecStatus('error', 'Password baru minimal 6 karakter.'); return; }
  if (newPass !== confirmPass) { showSecStatus('error', 'Konfirmasi password tidak cocok.'); return; }

  const username = newUser || creds.username;
  saveCredentials(username, newPass);
  showSecStatus('success', `✅ Kredensial berhasil diubah! Username: ${username}`);
  document.getElementById('sec-user').value = '';
  document.getElementById('sec-pass-old').value = '';
  document.getElementById('sec-pass-new').value = '';
  document.getElementById('sec-pass-confirm').value = '';
});

function showSecStatus(type, msg) {
  const el = document.getElementById('sec-status');
  el.className = `form-status ${type}`;
  el.textContent = msg;
  el.style.display = 'block';
}

// ============================================================
// DASHBOARD UPDATE
// ============================================================
function updateDashboard() {
  document.getElementById('ds-contact').textContent =
    data.contact.phone ? `📞 ${data.contact.phone}` : 'Belum diisi';
  document.getElementById('ds-stats').textContent =
    `${data.stats.years}th / ${data.stats.projects}+ proyek`;
  document.getElementById('ds-partners').textContent =
    `${data.partners.length} partner`;
  document.getElementById('ds-testi').textContent =
    `${data.testimonials.length} testimoni`;
}

// ============================================================
// TOAST NOTIFICATION
// ============================================================
let toastEl = null;
let toastTimer = null;

function showToast(msg, type = 'success') {
  if (!toastEl) {
    toastEl = document.createElement('div');
    toastEl.id = 'toast';
    toastEl.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      <span></span>
    `;
    document.body.appendChild(toastEl);
  }
  toastEl.querySelector('span').textContent = msg;
  toastEl.className = `show ${type}`;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toastEl.className = type; }, 3500);
}

function showSaveStatus() {
  saveStatus.textContent = '✅ Tersimpan';
  saveStatus.classList.add('show');
  setTimeout(() => saveStatus.classList.remove('show'), 3000);
}

// ============================================================
// UTILITIES
// ============================================================
function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ============================================================
// INIT
// ============================================================
function init() {
  if (isLoggedIn()) {
    showAdmin();
  } else {
    showLogin();
  }
}

init();

// ============================================================
// WATERMARK ADMIN PANEL
// ============================================================
const WM_STORAGE_KEY = 'maudy_watermark_config';

const DEFAULT_WM = {
  enabled:  true,
  text:     '© MAUDY IT Solution',
  opacity:  0.12,
  fontSize: 16,
  color:    '#ffffff',
  repeat:   true,
  angle:    -30,
  spacing:  160,
};

function loadWMConfig() {
  try {
    const s = localStorage.getItem(WM_STORAGE_KEY);
    return s ? Object.assign({}, DEFAULT_WM, JSON.parse(s)) : Object.assign({}, DEFAULT_WM);
  } catch(e) { return Object.assign({}, DEFAULT_WM); }
}

function saveWMConfig(cfg) {
  localStorage.setItem(WM_STORAGE_KEY, JSON.stringify(cfg));
}

function getWMFromForm() {
  return {
    enabled:  document.getElementById('wm-enabled').checked,
    text:     document.getElementById('wm-text').value || '© MAUDY IT Solution',
    opacity:  parseFloat(document.getElementById('wm-opacity').value),
    fontSize: parseInt(document.getElementById('wm-fontsize').value),
    color:    document.getElementById('wm-color').value,
    repeat:   document.getElementById('wm-repeat').value === 'true',
    angle:    parseInt(document.getElementById('wm-angle').value),
    spacing:  parseInt(document.getElementById('wm-spacing').value),
  };
}

function populateWMForm(cfg) {
  document.getElementById('wm-enabled').checked     = cfg.enabled;
  document.getElementById('wm-text').value          = cfg.text;
  document.getElementById('wm-opacity').value       = cfg.opacity;
  document.getElementById('wm-fontsize').value      = cfg.fontSize;
  document.getElementById('wm-color').value         = cfg.color;
  document.getElementById('wm-color-hex').value     = cfg.color;
  document.getElementById('wm-repeat').value        = String(cfg.repeat);
  document.getElementById('wm-angle').value         = cfg.angle;
  document.getElementById('wm-spacing').value       = cfg.spacing;
  updateWMLabels(cfg);
}

function updateWMLabels(cfg) {
  document.getElementById('wm-opacity-val').textContent  = Math.round(cfg.opacity * 100) + '%';
  document.getElementById('wm-fontsize-val').textContent = cfg.fontSize + 'px';
  document.getElementById('wm-angle-val').textContent    = cfg.angle + '°';
  document.getElementById('wm-spacing-val').textContent  = cfg.spacing + 'px';
}

// ---- Real-time Preview ----
function drawWMPreview(cfg) {
  const canvas = document.getElementById('wm-preview-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;

  // Background
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, W, H);

  // Gambar placeholder
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, 'rgba(37,99,235,0.3)');
  grad.addColorStop(1, 'rgba(34,211,238,0.2)');
  ctx.fillStyle = grad;
  ctx.fillRect(20, 20, W - 40, H - 40);

  // Teks placeholder
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  ctx.font = 'bold 18px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('[ Gambar Portfolio / Hero ]', W / 2, H / 2);
  ctx.textAlign = 'left';

  if (!cfg.enabled || !cfg.text) return;

  // Watermark
  ctx.save();
  ctx.globalAlpha = parseFloat(cfg.opacity);
  ctx.fillStyle = cfg.color;
  const fs = parseInt(cfg.fontSize);
  ctx.font = `bold ${fs}px Arial, sans-serif`;
  ctx.textBaseline = 'middle';

  const angle   = (parseInt(cfg.angle) * Math.PI) / 180;
  const spacing = parseInt(cfg.spacing);

  if (cfg.repeat === true || cfg.repeat === 'true') {
    ctx.translate(W / 2, H / 2);
    ctx.rotate(angle);
    const diag = Math.ceil(Math.sqrt(W * W + H * H));
    for (let y = -diag; y < diag; y += spacing) {
      for (let x = -diag; x < diag * 2; x += spacing * 2.5) {
        ctx.fillText(cfg.text, x, y);
      }
    }
  } else {
    ctx.translate(W / 2, H / 2);
    ctx.rotate(angle);
    const tw = ctx.measureText(cfg.text).width;
    ctx.fillText(cfg.text, -tw / 2, 0);
  }
  ctx.restore();
}

// ---- Bind events saat tab watermark aktif ----
function initWMPanel() {
  const cfg = loadWMConfig();
  populateWMForm(cfg);
  drawWMPreview(cfg);

  // Live update saat form berubah
  const liveInputs = ['wm-enabled','wm-text','wm-opacity','wm-fontsize','wm-color','wm-repeat','wm-angle','wm-spacing'];
  liveInputs.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', () => {
      const current = getWMFromForm();
      updateWMLabels(current);
      drawWMPreview(current);
    });
    el.addEventListener('change', () => {
      const current = getWMFromForm();
      updateWMLabels(current);
      drawWMPreview(current);
    });
  });

  // Sync color picker <-> hex input
  document.getElementById('wm-color').addEventListener('input', (e) => {
    document.getElementById('wm-color-hex').value = e.target.value;
  });
  document.getElementById('wm-color-hex').addEventListener('input', (e) => {
    const val = e.target.value;
    if (/^#[0-9a-fA-F]{6}$/.test(val)) {
      document.getElementById('wm-color').value = val;
    }
  });

  // Simpan watermark config
  document.getElementById('wm-save-btn').addEventListener('click', () => {
    const cfg = getWMFromForm();
    saveWMConfig(cfg);
    showToast('✅ Pengaturan watermark disimpan! Reload website untuk melihat efeknya.', 'success');
  });
}

// Inisialisasi saat tab watermark dibuka (lazy)
let wmInited = false;
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    if (item.dataset.tab === 'watermark' && !wmInited) {
      wmInited = true;
      setTimeout(initWMPanel, 100); // tunggu panel aktif
    }
  });
});
