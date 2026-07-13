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
    partner_bg:     'rgba(255, 255, 255, 0.6)',
  },
  social: {
    facebook:  '#',
    instagram: '#',
    linkedin:  '#',
    tiktok:    '',
  },
  partners: [
    { name: 'Ubiquiti',  logo: null, url: '' },
    { name: 'TP-Link',   logo: null, url: '' },
    { name: 'ASUS',      logo: null, url: '' },
    { name: 'Microsoft', logo: null, url: '' },
    { name: 'Cisco',     logo: null, url: '' },
    { name: 'HP',        logo: null, url: '' },
    { name: 'Dell',      logo: null, url: '' },
    { name: 'Lenovo',    logo: null, url: '' },
    { name: 'MikroTik',  logo: null, url: '' },
    { name: 'Hikvision', logo: null, url: '' },
  ],
  certificates: [
    { title: 'Cisco Certified Network Associate', issuer: 'Cisco', year: '2024', category: 'Networking', color: '#0D8ABC', image: null },
    { title: 'MikroTik Certified Network Associate', issuer: 'MikroTik', year: '2023', category: 'Networking', color: '#D93025', image: null },
    { title: 'CompTIA Security+', issuer: 'CompTIA', year: '2023', category: 'Security', color: '#E8A838', image: null },
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
  docProjects: [
    {
      id: 'proj-dummy-1',
      title: 'Sistem Analitik Bisnis',
      client: 'Perusahaan Manufaktur',
      category: 'Web Development',
      date: '2024-01-10',
      description: 'Dashboard analytics real-time untuk monitoring KPI bisnis perusahaan manufaktur.',
      photos: [
        { image: '../assets/portfolio-web.webp', caption: 'Dashboard Utama', featured: true }
      ],
      published: true,
      updatedAt: new Date().toISOString()
    },
    {
      id: 'proj-dummy-2',
      title: 'Monitoring Jaringan Enterprise',
      client: 'Gedung Perkantoran',
      category: 'Infrastruktur Jaringan',
      date: '2024-02-15',
      description: 'Instalasi dan konfigurasi infrastruktur jaringan untuk gedung 10 lantai dengan 500+ node.',
      photos: [
        { image: '../assets/portfolio-network.webp', caption: 'Server Room', featured: true }
      ],
      published: true,
      updatedAt: new Date().toISOString()
    },
    {
      id: 'proj-dummy-3',
      title: 'Pusat Monitoring Keamanan',
      client: 'Kompleks Modern',
      category: 'Sistem Keamanan',
      date: '2024-03-20',
      description: 'Instalasi CCTV dan security system terintegrasi untuk kompleks perkantoran modern.',
      photos: [
        { image: '../assets/portfolio-security.webp', caption: 'Control Room CCTV', featured: true }
      ],
      published: true,
      updatedAt: new Date().toISOString()
    }
  ],
  services: [
    {
      title_id: 'Hardware & Repair',
      desc_id: 'Service & sparepart komputer/laptop, instalasi sistem operasi Windows & Linux, jual komputer & laptop baru.',
      features_id: ['Service & Sparepart Komputer', 'Jual Komputer & Laptop', 'Instalasi OS Windows & Linux'],
      icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
      color: '#2563EB'
    },
    {
      title_id: 'Networking & Infrastruktur',
      desc_id: 'Instalasi jaringan komputer, konfigurasi Mikrotik, wireless, fiber optic, dan internet broadband.',
      features_id: ['Instalasi Jaringan Komputer', 'Setting Mikrotik', 'Wireless & Fiber Optic', 'Instalasi Internet'],
      icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M6 8a6 6 0 0112 0c0 6 3 8 3 8H3s3-2 3-8"/><path d="M21 16H3"/><circle cx="12" cy="2" r="1"/></svg>',
      color: '#0EA5E9'
    },
    {
      title_id: 'Software & Web Development',
      desc_id: 'Pembuatan website profesional, pengembangan software custom, dan sistem informasi sesuai kebutuhan bisnis.',
      features_id: ['Pembuatan Website', 'Software Development', 'Pembuatan Sistem Informasi'],
      icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
      color: '#8B5CF6'
    },
    {
      title_id: 'Cloud & Server',
      desc_id: 'Setup & maintenance VPS, instalasi server, cloud hosting, virtualisasi, dan backup data terpusat.',
      features_id: ['Setup VPS & Cloud Server', 'Instalasi & Maintenance Server', 'IP Public & VPN IP'],
      icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z"/></svg>',
      color: '#22D3EE'
    },
    {
      title_id: 'Keamanan & CCTV',
      desc_id: 'Instalasi CCTV, sistem keamanan gedung, access control, dan solusi keamanan digital terpadu.',
      features_id: ['Instalasi CCTV', 'Security System', 'Access Control'],
      icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
      color: '#EF4444'
    },
    {
      title_id: 'IT Maintenance',
      desc_id: 'Kontrak maintenance rutin untuk memastikan seluruh infrastruktur IT perusahaan Anda berjalan optimal tanpa kendala.',
      features_id: ['Maintenance Rutin', 'IT Support On-call', 'Pengecekan Berkala'],
      icon: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
      color: '#F59E0B'
    }
  ]
};

// ============================================================
// AUTH MANAGEMENT — MULTI USER
// ============================================================
async function isLoggedIn() {
  try {
    const res = await fetch('../api/auth.php?action=check', { credentials: 'same-origin' });
    const data = await res.json();
    return data.logged_in;
  } catch (e) {
    return false;
  }
}

async function login(user, pass) {
  try {
    const res = await fetch('../api/auth.php?action=login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: user, password: pass }),
      credentials: 'same-origin'
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem('maudy_current_user', data.username);
      return data;
    }
    return null;
  } catch (e) {
    return null;
  }
}

async function logout() {
  try {
    await fetch('../api/auth.php?action=logout', { method: 'POST', credentials: 'same-origin' });
  } catch (e) {}
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem('maudy_current_user');
  showLogin();
}

// ============================================================
// DATA MANAGEMENT
// ============================================================
async function loadData() {
  try {
    const res = await fetch('../api/load.php');
    if (!res.ok) throw new Error('Network error');
    const saved = await res.json();
    if (!saved) return JSON.parse(JSON.stringify(DEFAULT_DATA));
    return deepMerge(JSON.parse(JSON.stringify(DEFAULT_DATA)), saved);
  } catch (e) {
    console.error('Failed to load data from server:', e);
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
  }
}

async function saveData(dataObj) {
  try {
    const res = await fetch('../api/save.php', {
      credentials: 'same-origin',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataObj)
    });
    const result = await res.json();
    return result.success;
  } catch (e) {
    console.error('Failed to save data:', e);
    return false;
  }
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
let data = JSON.parse(JSON.stringify(DEFAULT_DATA)); // Akan ditimpa saat showAdmin

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

const LAST_TAB_KEY = 'maudy_admin_last_tab';

// Fitur Darurat: Reset Password ke Default jika mengunjungi ?reset=1
if (window.location.search.includes('reset=1')) {
  localStorage.removeItem(USERS_KEY);
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(SESSION_KEY);
  alert('Data login (username & password) telah di-reset ke bawaan sistem (admin / maudy2025).');
  window.location.href = window.location.pathname;
}

async function showAdmin() {
  loginScreen.classList.add('hidden');
  adminApp.classList.remove('hidden');
  data = await loadData();
  populateForms();
  updateDashboard();

  // Tampilkan username yang sedang login
  const currentUser = localStorage.getItem('maudy_current_user');
  const userBadge = document.getElementById('current-user-badge');
  if (userBadge) userBadge.textContent = currentUser;

  // Restore tab terakhir (atau dashboard jika pertama kali)
  const lastTab = localStorage.getItem(LAST_TAB_KEY) || 'dashboard';
  switchTab(lastTab);
}

// ============================================================
// LOGIN LOGIC
// ============================================================
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  loginError.classList.remove('show');
  loginError.textContent = '';

  const user = document.getElementById('admin-user').value.trim();
  const pass = document.getElementById('admin-pass').value.trim();

  if (!user || !pass) {
    loginError.textContent = 'Isi username dan password.';
    loginError.classList.add('show');
    return;
  }

  const matchedUser = await login(user, pass);
  if (matchedUser) {
    localStorage.setItem(SESSION_KEY, 'true'); // still keep this so logic doesn't break, though it's less necessary now
    showAdmin();
  } else {
    loginError.textContent = '❌ Username atau password salah. Silakan coba lagi.';
    loginError.classList.add('show');
    document.getElementById('admin-pass').value = '';
    document.getElementById('admin-pass').focus();
  }
});

logoutBtn.addEventListener('click', logout);

// Toggle password visibility (login form)
document.getElementById('toggle-pass').addEventListener('click', () => {
  const inp = document.getElementById('admin-pass');
  inp.type = inp.type === 'password' ? 'text' : 'password';
});

// Toggle password visibility (tambah user form - menggunakan event delegation)
document.addEventListener('click', (e) => {
  if (e.target.closest('#toggle-new-pass')) {
    const inp = document.getElementById('new-user-pass');
    if (inp) inp.type = inp.type === 'password' ? 'text' : 'password';
  }
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
  certificates: 'Sertifikat',
  dokumentasi:  'Dokumentasi Proyek',
  users:        'Manajemen User',
  security:     'Keamanan',
};

// ===== Helper: pindah tab =====
async function switchTab(tab) {
  const targetPanel = document.getElementById(`tab-${tab}`);
  if (!targetPanel) return; // tab tidak ada, abaikan
  navItems.forEach(n => { n.classList.remove('active'); n.removeAttribute('aria-current'); });
  const navBtn = document.querySelector(`.nav-item[data-tab="${tab}"]`);
  if (navBtn) { navBtn.classList.add('active'); navBtn.setAttribute('aria-current', 'page'); }
  tabPanels.forEach(p => p.classList.remove('active'));
  targetPanel.classList.add('active');
  pageTitle.textContent = TAB_TITLES[tab] || tab;
  // Trigger event khusus jika tab memerlukan render
  if (tab === 'users')        renderUserList();
  if (tab === 'certificates') renderCertificates();
  if (tab === 'dokumentasi')  renderDocList();
}

navItems.forEach(item => {
  item.addEventListener('click', () => {
    const tab = item.dataset.tab;
    localStorage.setItem(LAST_TAB_KEY, tab); // simpan tab aktif ke localStorage
    switchTab(tab);
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
  setVal('company-partner-bg', co.partner_bg);

  // Social
  const sm = data.social;
  setVal('sm-facebook',  sm.facebook === '#' ? '' : sm.facebook);
  setVal('sm-instagram', sm.instagram === '#' ? '' : sm.instagram);
  setVal('sm-linkedin',  sm.linkedin === '#' ? '' : sm.linkedin);
  setVal('sm-tiktok',    sm.tiktok);

  // Partners
  renderPartners();
  renderCertificates();
  renderTestimonials();
  renderServices();
  renderDocList();
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
// PARTNERS LIST + LOGO UPLOAD + DRAG & DROP REORDER
// ============================================================
let dragSrc = null;
let dragPlaceholder = null;

/* Normalisasi data lama (string) ke format baru ({ name, logo, url }) */
function normalizePartners(arr) {
  return arr.map(p =>
    typeof p === 'string' 
      ? { name: p, logo: null, url: '' } 
      : { name: p?.name || '', logo: p?.logo || null, url: p?.url || '' }
  );
}

/* Convert uploaded file → canvas resize → WebP base64 */
function fileToWebP(file, targetW = 200, targetH = 100, quality = 0.80) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) return reject('Bukan file gambar');
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width  = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');
        // Latar transparan → putih agar logo tidak gelap
        ctx.fillStyle = 'rgba(255,255,255,0)';
        ctx.fillRect(0, 0, targetW, targetH);
        // Object-fit: contain (skalakan proporsional ke dalam kotak)
        const scale = Math.min(targetW / img.naturalWidth, targetH / img.naturalHeight);
        const w = img.naturalWidth  * scale;
        const h = img.naturalHeight * scale;
        const x = (targetW - w) / 2;
        const y = (targetH - h) / 2;
        ctx.drawImage(img, x, y, w, h);
        const webp = canvas.toDataURL('image/webp', quality);
        resolve(webp);
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function renderPartners() {
  // Normalisasi agar backward-compatible dengan format lama (string)
  data.partners = normalizePartners(data.partners);
  const list = document.getElementById('partners-list');
  list.innerHTML = '';
  data.partners.forEach((p, idx) => {
    list.appendChild(createPartnerRow(p, idx));
  });
  initPartnerDragDrop();
}

function createPartnerRow(partner, idx) {
  // partner = { name, logo } atau string (lama)
  if (typeof partner === 'string') partner = { name: partner, logo: null, url: '' };
  const { name = '', logo = null, url = '' } = partner;

  const row = document.createElement('div');
  row.className = 'partner-row partner-row-v2';
  row.dataset.idx = idx;
  row.dataset.logo = logo || '';
  row.draggable = true;

  // Buat file input (tersembunyi)
  const fileInput = document.createElement('input');
  fileInput.type   = 'file';
  fileInput.accept = 'image/*';
  fileInput.style.display = 'none';
  fileInput.setAttribute('aria-label', `Upload logo ${name || idx + 1}`);
  row.appendChild(fileInput);

  // HTML struktur
  row.innerHTML += `
    <span class="drag-handle" title="Seret untuk mengubah urutan" aria-hidden="true">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
    </span>

    <div class="partner-logo-upload">
      <div class="partner-logo-preview" title="Klik untuk upload logo">
        ${logo
          ? `<img src="${logo.startsWith('../') ? logo : '../' + logo}" alt="Logo ${escapeHtml(name)}" draggable="false" data-no-protect="true" />`
          : `<span class="partner-logo-placeholder">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
             </span>`
        }
      </div>
      <button class="btn-upload-logo" type="button" title="Upload / Ganti Logo">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
        Upload
      </button>
      ${logo ? '<button class="btn-remove-logo" type="button" title="Hapus Logo">✕</button>' : ''}
    </div>

    <div class="partner-inputs">
      <input type="text" class="partner-name-input" value="${escapeHtml(name)}" placeholder="Nama partner" aria-label="Nama partner ${idx + 1}" />
      <input type="url" class="partner-url-input" value="${escapeHtml(url)}" placeholder="https://website-partner.com" aria-label="Website partner ${idx + 1}" />
    </div>

    <button class="btn-remove" title="Hapus partner" aria-label="Hapus ${escapeHtml(name)}">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
    </button>
  `;

  /* ---- Event: hapus partner ---- */
  row.querySelector('.btn-remove').addEventListener('click', () => {
    syncPartnersFromDOM();
    const currentIdx = parseInt(row.dataset.idx);
    data.partners.splice(currentIdx, 1);
    renderPartners();
  });

  /* ---- Event: ubah nama ---- */
  row.querySelector('.partner-name-input').addEventListener('input', (e) => {
    if (data.partners[idx]) data.partners[idx].name = e.target.value;
  });

  /* ---- Event: klik area preview → buka file picker ---- */
  row.querySelector('.partner-logo-preview').addEventListener('click', () => fileInput.click());
  row.querySelector('.btn-upload-logo').addEventListener('click', () => fileInput.click());

  /* ---- Event: file dipilih → convert WebP → update preview ---- */
  fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const btn = row.querySelector('.btn-upload-logo');
    btn.textContent = '⏳';
    btn.disabled = true;
    try {
      const webp = await fileToWebP(file, 200, 100, 0.80);
      const res = await fetch('../api/upload.php', {
        credentials: 'same-origin',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: webp })
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);

      if (data.partners[idx]) data.partners[idx].logo = json.url;
      row.dataset.logo = json.url;
      // Update preview
      const preview = row.querySelector('.partner-logo-preview');
      preview.innerHTML = `<img src="../${json.url}" alt="Logo" draggable="false" data-no-protect="true" />`;
      // Tambah tombol hapus logo jika belum ada
      if (!row.querySelector('.btn-remove-logo')) {
        const rmLogo = document.createElement('button');
        rmLogo.className = 'btn-remove-logo';
        rmLogo.type = 'button';
        rmLogo.title = 'Hapus Logo';
        rmLogo.textContent = '✕';
        row.querySelector('.partner-logo-upload').appendChild(rmLogo);
        rmLogo.addEventListener('click', () => removeLogo(row));
      }
      showToast('✅ Logo berhasil diupload dan dikonversi (WebP)', 'success');
      syncPartnersFromDOM(); // ensure order stays correct
    } catch (err) {
      showToast('❌ Gagal upload gambar: ' + err, 'error');
    } finally {
      btn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg> Upload`;
      btn.disabled = false;
    }
  });

  /* ---- Event: hapus logo ---- */
  const rmLogoBtn = row.querySelector('.btn-remove-logo');
  if (rmLogoBtn) rmLogoBtn.addEventListener('click', () => removeLogo(row));

  /* ---- Drag: input tidak ikut trigger drag ---- */
  const handle = row.querySelector('.drag-handle');
  handle.style.cursor = 'grab';
  row.querySelectorAll('input, button').forEach(el => {
    el.addEventListener('mousedown', e => e.stopPropagation());
    el.addEventListener('dragstart', e => e.preventDefault());
  });

  return row;
}

function removeLogo(row) {
  row.dataset.logo = '';
  const preview = row.querySelector('.partner-logo-preview');
  preview.innerHTML = `<span class="partner-logo-placeholder"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></span>`;
  const rmBtn = row.querySelector('.btn-remove-logo');
  if (rmBtn) rmBtn.remove();
  syncPartnersFromDOM();
}

function initPartnerDragDrop() {
  const list = document.getElementById('partners-list');
  const rows  = list.querySelectorAll('.partner-row');

  rows.forEach(row => {
    row.addEventListener('dragstart', (e) => {
      dragSrc = row;
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', row.dataset.idx);
      setTimeout(() => row.classList.add('dragging'), 0);
    });
    row.addEventListener('dragend', () => {
      row.classList.remove('dragging');
      list.querySelectorAll('.partner-row').forEach(r => r.classList.remove('drag-over'));
      dragPlaceholder = null;
      dragSrc = null;
      syncPartnersFromDOM();
    });
    row.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      if (!dragSrc || dragSrc === row) return;
      list.querySelectorAll('.partner-row').forEach(r => r.classList.remove('drag-over'));
      row.classList.add('drag-over');
    });
    row.addEventListener('dragleave', (e) => {
      if (!row.contains(e.relatedTarget)) row.classList.remove('drag-over');
    });
    row.addEventListener('drop', (e) => {
      e.preventDefault();
      if (!dragSrc || dragSrc === row) return;
      row.classList.remove('drag-over');
      const rect   = row.getBoundingClientRect();
      const before = e.clientY < rect.top + rect.height / 2;
      if (before) list.insertBefore(dragSrc, row);
      else list.insertBefore(dragSrc, row.nextSibling);
      syncPartnersFromDOM();
    });
  });
}

/* Sync data.partners dari urutan DOM (termasuk logo) */
function syncPartnersFromDOM() {
  const list = document.getElementById('partners-list');
  data.partners = Array.from(list.querySelectorAll('.partner-row')).map((row, i) => {
    row.dataset.idx = i;
    const nameEl = row.querySelector('.partner-name-input');
    const urlEl = row.querySelector('.partner-url-input');
    if (nameEl) nameEl.setAttribute('aria-label', `Nama partner ${i + 1}`);
    return {
      name: nameEl ? nameEl.value : '',
      url: urlEl ? urlEl.value : '',
      logo: row.dataset.logo || null,
    };
  });
}

document.getElementById('add-partner-btn').addEventListener('click', () => {
  syncPartnersFromDOM();
  data.partners.push({ name: '', logo: null, url: '' });
  renderPartners();
  const inputs = document.querySelectorAll('#partners-list .partner-name-input');
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
// SERVICES
// ============================================================
let svcEditIdx = -1;

function renderServices() {
  const tbody = document.getElementById('services-tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
  if (!data.services || data.services.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:var(--text3);padding:2rem;">Belum ada layanan.</td></tr>`;
    return;
  }
  
  data.services.forEach((s, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <div style="width:32px;height:32px;color:${s.color || 'var(--accent)'};">
          ${s.icon}
        </div>
      </td>
      <td><strong>${escapeHtml(s.title_id)}</strong></td>
      <td style="color:var(--text2);font-size:.875rem;">${escapeHtml(s.desc_id)}</td>
      <td style="text-align:right; white-space:nowrap;">
        <button class="btn-up" data-i="${idx}" title="Geser ke Atas" ${idx === 0 ? 'disabled' : ''}>⬆️</button>
        <button class="btn-down" data-i="${idx}" title="Geser ke Bawah" ${idx === data.services.length - 1 ? 'disabled' : ''}>⬇️</button>
        <button class="btn-edit" data-i="${idx}" title="Edit Layanan">✏️</button>
        <button class="btn-remove" data-i="${idx}" title="Hapus Layanan">🗑️</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll('.btn-up').forEach(btn => {
    btn.addEventListener('click', async () => {
      const idx = parseInt(btn.dataset.i);
      if (idx > 0) {
        [data.services[idx - 1], data.services[idx]] = [data.services[idx], data.services[idx - 1]];
        renderServices();
        await saveData(data);
      }
    });
  });

  tbody.querySelectorAll('.btn-down').forEach(btn => {
    btn.addEventListener('click', async () => {
      const idx = parseInt(btn.dataset.i);
      if (idx < data.services.length - 1) {
        [data.services[idx], data.services[idx + 1]] = [data.services[idx + 1], data.services[idx]];
        renderServices();
        await saveData(data);
      }
    });
  });

  tbody.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', () => openServiceForm(parseInt(btn.dataset.i)));
  });
  
  tbody.querySelectorAll('.btn-remove').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (confirm('Yakin ingin menghapus layanan ini?')) {
        data.services.splice(parseInt(btn.dataset.i), 1);
        renderServices();
        await saveData(data);
      }
    });
  });
}

function openServiceForm(idx = -1) {
  svcEditIdx = idx;
  const formEl = document.getElementById('service-form');
  const titleEl = document.getElementById('service-form-title');
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  formEl.classList.add('active');

  if (idx >= 0) {
    titleEl.textContent = '✏️ Edit Layanan';
    const s = data.services[idx];
    document.getElementById('svc-icon').value = s.icon || '';
    document.getElementById('svc-color').value = s.color || '#2563EB';
    document.getElementById('svc-link').value = s.link || '';
    document.getElementById('svc-title-id').value = s.title_id || '';
    document.getElementById('svc-desc-id').value = s.desc_id || '';
    document.getElementById('svc-features-id').value = (s.features_id || []).join('\n');
  } else {
    titleEl.textContent = '📝 Tambah Layanan';
    document.getElementById('svc-icon').value = '';
    document.getElementById('svc-color').value = '#2563EB';
    document.getElementById('svc-link').value = '';
    document.getElementById('svc-title-id').value = '';
    document.getElementById('svc-desc-id').value = '';
    document.getElementById('svc-features-id').value = '';
  }
  document.getElementById('svc-form-status').style.display = 'none';
}

function closeServiceForm() {
  document.getElementById('service-form').classList.remove('active');
  document.getElementById('tab-services').classList.add('active');
  svcEditIdx = -1;
}

document.getElementById('svc-form-save')?.addEventListener('click', async () => {
  const titleId = document.getElementById('svc-title-id').value.trim();
  const statusEl = document.getElementById('svc-form-status');
  statusEl.style.display = 'none';

  if (!titleId) {
    statusEl.className = 'form-status error';
    statusEl.textContent = 'Judul layanan wajib diisi.';
    statusEl.style.display = 'block';
    return;
  }

  if (!data.services) data.services = [];

  const features = document.getElementById('svc-features-id').value
    .split(/\r?\n|,/)
    .map(f => f.trim())
    .filter(f => f.length > 0);

  const svc = {
    title_id: titleId,
    desc_id: document.getElementById('svc-desc-id').value.trim(),
    features_id: features,
    icon: document.getElementById('svc-icon').value.trim(),
    color: document.getElementById('svc-color').value.trim() || '#2563EB',
    link: document.getElementById('svc-link').value.trim()
  };

  if (svcEditIdx >= 0) {
    data.services[svcEditIdx] = svc;
  } else {
    data.services.push(svc);
  }

  const btn = document.getElementById('svc-form-save');
  btn.disabled = true;
  btn.textContent = 'Menyimpan...';
  
  const success = await saveData(data);
  btn.disabled = false;
  btn.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v14a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> Simpan Layanan`;

  if (success) {
    showToast('✅ Layanan berhasil disimpan', 'success');
    renderServices();
    closeServiceForm();
  } else {
    showToast('❌ Gagal menyimpan', 'error');
  }
});

// ============================================================
// SAVE ALL
// ============================================================
saveAllBtn.addEventListener('click', async () => {
  saveAllBtn.disabled = true;
  saveStatus.textContent = 'Menyimpan...';
  collectFormData();
  const success = await saveData(data);
  saveAllBtn.disabled = false;
  if (success) {
    showToast('✅ Data berhasil disimpan! Reload website untuk melihat perubahan.', 'success');
    showSaveStatus();
    updateDashboard();
  } else {
    showToast('❌ Gagal menyimpan data ke server.', 'error');
  }
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
    partner_bg:     getVal('company-partner-bg') || 'rgba(255, 255, 255, 0.6)',
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

  // Partners
  syncPartnersFromDOM();

  // Testimonials — already in data.testimonials (live-updated)
}

function getVal(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

// ============================================================
// SECURITY — CHANGE PASSWORD (Admin Utama)
// ============================================================
document.getElementById('change-pass-btn').addEventListener('click', async () => {
  const secStatus = document.getElementById('sec-status');
  secStatus.className = 'form-status';
  secStatus.style.display = 'none';

  const oldPass    = document.getElementById('sec-pass-old').value;
  const newPass    = document.getElementById('sec-pass-new').value;
  const confirmPass= document.getElementById('sec-pass-confirm').value;
  
  const currentUser = localStorage.getItem('maudy_current_user');

  if (!oldPass) { showSecStatus('error', 'Masukkan password lama.'); return; }
  if (newPass.length < 6) { showSecStatus('error', 'Password baru minimal 6 karakter.'); return; }
  if (newPass !== confirmPass) { showSecStatus('error', 'Konfirmasi password tidak cocok.'); return; }

  try {
    const res = await fetch('../api/auth.php?action=change_password', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: currentUser, oldPassword: oldPass, newPassword: newPass }),
      credentials: 'same-origin'
    });
    const data = await res.json();
    if (data.success) {
      showSecStatus('success', `✅ Password berhasil diubah!`);
      document.getElementById('sec-pass-old').value = '';
      document.getElementById('sec-pass-new').value = '';
      document.getElementById('sec-pass-confirm').value = '';
      renderUserList();
    } else {
      showSecStatus('error', data.message || 'Gagal mengubah password');
    }
  } catch (e) {
    showSecStatus('error', 'Terjadi kesalahan jaringan.');
  }
});

function showSecStatus(type, msg) {
  const el = document.getElementById('sec-status');
  el.className = `form-status ${type}`;
  el.textContent = msg;
  el.style.display = 'block';
}

// ============================================================
// USER MANAGEMENT
// ============================================================
async function renderUserList() {
  const list = document.getElementById('user-list');
  if (!list) return;
  
  let users = [];
  try {
    const res = await fetch('../api/auth.php?action=get_users', { credentials: 'same-origin' });
    const data = await res.json();
    if (data.success) users = data.users;
  } catch (e) {
    console.error('Gagal memuat user', e);
  }

  const currentUser = localStorage.getItem('maudy_current_user') || (users[0] ? users[0].username : '');

  list.innerHTML = '';
  users.forEach((u, idx) => {
    const isMe = u.username === currentUser;
    const row  = document.createElement('div');
    row.className = 'user-row' + (isMe ? ' user-row-me' : '');
    row.dataset.username = escapeHtml(u.username);
    row.innerHTML = `
      <div class="user-row-info">
        <div class="user-avatar">${u.username[0].toUpperCase()}</div>
        <div>
          <div class="user-name">${escapeHtml(u.username)} ${isMe ? '<span class="user-me-badge">Anda</span>' : ''}</div>
          <div class="user-role">${u.role || 'admin'}</div>
        </div>
      </div>
      <div class="user-row-actions">
        <button class="btn-edit-user" data-username="${escapeHtml(u.username)}" title="Ganti Password">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
          Ganti Password
        </button>
        ${users.length > 1 && !isMe
          ? `<button class="btn-remove user-del-btn" data-username="${escapeHtml(u.username)}" title="Hapus User">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
             </button>`
          : ''}
      </div>
    `;
    list.appendChild(row);
  });

  // Event: hapus user
  list.querySelectorAll('.user-del-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const username = btn.dataset.username;
      if (!confirm(`Hapus user "${username}"?`)) return;
      try {
        const res = await fetch('../api/auth.php?action=delete_user', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username }), credentials: 'same-origin'
        });
        const data = await res.json();
        if (data.success) {
          showToast('✅ User dihapus.', 'success');
          renderUserList();
        } else {
          showToast('❌ ' + (data.message || 'Gagal menghapus'), 'error');
        }
      } catch (e) {
        showToast('❌ Kesalahan jaringan.', 'error');
      }
    });
  });

  // Event: ganti password user
  list.querySelectorAll('.btn-edit-user').forEach(btn => {
    btn.addEventListener('click', () => {
      openChangePassModal(btn.dataset.username);
    });
  });
}

// ===== Modal ganti password =====
function openChangePassModal(targetUsername) {
  let modal = document.getElementById('user-pass-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'user-pass-modal';
    modal.className = 'user-modal-overlay';
    modal.innerHTML = `
      <div class="user-modal">
        <div class="user-modal-header">
          <h3 id="user-modal-title">Ganti Password</h3>
          <button id="user-modal-close" class="user-modal-close" type="button" aria-label="Tutup">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="user-modal-body">
          <p id="user-modal-desc" style="color:var(--text2);font-size:.88rem;margin-bottom:1rem"></p>
          <div class="form-group">
            <label>Password Baru <span style="color:var(--danger)">*</span></label>
            <div style="position:relative">
              <input type="password" id="modal-new-pass" placeholder="Min. 6 karakter" autocomplete="new-password" />
              <button type="button" class="pass-toggle" id="modal-toggle-pass" style="position:absolute;right:.75rem;top:50%;transform:translateY(-50%)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>
          </div>
          <div class="form-group">
            <label>Konfirmasi Password <span style="color:var(--danger)">*</span></label>
            <input type="password" id="modal-confirm-pass" placeholder="Ulangi password baru" autocomplete="new-password" />
          </div>
          <div id="modal-status" class="form-status" style="display:none"></div>
        </div>
        <div class="user-modal-footer">
          <button id="modal-cancel" class="btn-secondary" type="button">Batal</button>
          <button id="modal-save" class="btn-save" type="button">Simpan Password</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('#user-modal-close').addEventListener('click', closePassModal);
    modal.querySelector('#modal-cancel').addEventListener('click', closePassModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closePassModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePassModal(); });
    modal.querySelector('#modal-toggle-pass').addEventListener('click', () => {
      const inp = modal.querySelector('#modal-new-pass');
      inp.type = inp.type === 'password' ? 'text' : 'password';
    });
  }

  modal.querySelector('#user-modal-title').textContent = `Ganti Password — ${targetUsername}`;
  modal.querySelector('#user-modal-desc').textContent  = `Masukkan password baru untuk user "${targetUsername}".`;
  modal.querySelector('#modal-new-pass').value     = '';
  modal.querySelector('#modal-confirm-pass').value = '';
  modal.querySelector('#modal-status').style.display = 'none';

  modal.querySelector('#modal-save').onclick = async () => {
    const np = modal.querySelector('#modal-new-pass').value;
    const cp = modal.querySelector('#modal-confirm-pass').value;
    const statusEl = modal.querySelector('#modal-status');
    statusEl.style.display = 'none';
    if (np.length < 6) {
      statusEl.className = 'form-status error'; statusEl.textContent = 'Password minimal 6 karakter.'; statusEl.style.display = 'block'; return;
    }
    if (np !== cp) {
      statusEl.className = 'form-status error'; statusEl.textContent = 'Konfirmasi tidak cocok.'; statusEl.style.display = 'block'; return;
    }
    
    try {
      const res = await fetch('../api/auth.php?action=change_password', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: targetUsername, newPassword: np }), credentials: 'same-origin'
      });
      const data = await res.json();
      if (data.success) {
        showToast(`✅ Password "${targetUsername}" berhasil diubah.`, 'success');
        closePassModal();
      } else {
        statusEl.className = 'form-status error'; statusEl.textContent = data.message || 'Gagal mengubah password.'; statusEl.style.display = 'block';
      }
    } catch (e) {
      statusEl.className = 'form-status error'; statusEl.textContent = 'Kesalahan jaringan.'; statusEl.style.display = 'block';
    }
  };

  modal.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';
  setTimeout(() => modal.querySelector('#modal-new-pass')?.focus(), 100);
}

function closePassModal() {
  const modal = document.getElementById('user-pass-modal');
  if (modal) { modal.setAttribute('hidden', ''); document.body.style.overflow = ''; }
}

// ===== Tambah user baru =====
document.getElementById('add-user-btn')?.addEventListener('click', async () => {
  const usernameEl = document.getElementById('new-username');
  const passEl     = document.getElementById('new-user-pass');
  const statusEl   = document.getElementById('add-user-status');
  statusEl.style.display = 'none';

  const username = usernameEl.value.trim();
  const password = passEl.value;

  if (!username) {
    statusEl.className = 'form-status error'; statusEl.textContent = 'Isi nama user.'; statusEl.style.display = 'block'; return;
  }
  if (password.length < 6) {
    statusEl.className = 'form-status error'; statusEl.textContent = 'Password minimal 6 karakter.'; statusEl.style.display = 'block'; return;
  }

  try {
    const res = await fetch('../api/auth.php?action=add_user', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }), credentials: 'same-origin'
    });
    const data = await res.json();
    if (data.success) {
      usernameEl.value = '';
      passEl.value = '';
      statusEl.className = 'form-status success';
      statusEl.textContent = `✅ User "${username}" berhasil ditambahkan.`;
      statusEl.style.display = 'block';
      renderUserList();
      showToast(`✅ User "${username}" ditambahkan.`, 'success');
    } else {
      statusEl.className = 'form-status error'; statusEl.textContent = data.message || 'Gagal menambah user.'; statusEl.style.display = 'block';
    }
  } catch (e) {
    statusEl.className = 'form-status error'; statusEl.textContent = 'Kesalahan jaringan.'; statusEl.style.display = 'block';
  }
});
// (renderUserList dipanggil via switchTab() — tidak perlu listener duplikat di sini)


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
async function init() {
  if (await isLoggedIn()) {
    await showAdmin();
  } else {
    showLogin();
  }
}

init();

// ============================================================
// CERTIFICATES ADMIN
// ============================================================
function renderCertificates() {
  if (!data.certificates) data.certificates = [];
  const list = document.getElementById('cert-list');
  if (!list) return;
  list.innerHTML = '';
  data.certificates.forEach((cert, idx) => {
    list.appendChild(createCertRow(cert, idx));
  });
}

function createCertRow(cert, idx) {
  cert = cert || {};
  const row = document.createElement('div');
  row.className = 'cert-admin-row';
  row.dataset.idx = idx;

  // Hidden file input
  const fileInput = document.createElement('input');
  fileInput.type   = 'file';
  fileInput.accept = 'image/*';
  fileInput.style.display = 'none';
  row.appendChild(fileInput);

  row.innerHTML += `
    <!-- Gambar preview sertifikat -->
    <div class="cert-admin-img-area">
      <div class="cert-admin-preview" title="Klik upload gambar sertifikat">
        ${cert.image
          ? `<img src="${cert.image}" alt="${escapeHtml(cert.title||'')}" draggable="false" data-no-protect="true" />`
          : `<span class="cert-admin-no-img">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </span>`}
      </div>
      <div class="cert-admin-img-btns">
        <button class="btn-upload-logo" type="button">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          Upload
        </button>
        ${cert.image ? '<button class="btn-remove-logo" type="button" title="Hapus Gambar">✕</button>' : ''}
      </div>
    </div>

    <!-- Fields -->
    <div class="cert-admin-fields">
      <div class="cert-admin-row-top">
        <input type="text" class="cert-title-input" value="${escapeHtml(cert.title||'')}" placeholder="Nama / Judul Sertifikat" />
        <input type="text" class="cert-category-input" value="${escapeHtml(cert.category||'')}" placeholder="Kategori (mis: Networking)" style="max-width:160px"/>
      </div>
      <div class="cert-admin-row-bottom">
        <input type="text" class="cert-issuer-input" value="${escapeHtml(cert.issuer||'')}" placeholder="Penerbit / Lembaga" />
        <input type="text" class="cert-year-input" value="${escapeHtml(cert.year||'')}" placeholder="Tahun" style="max-width:80px"/>
        <input type="color" class="cert-color-input" value="${cert.color||'#2563EB'}" title="Warna badge (jika tidak ada gambar)" style="width:36px;height:36px;padding:2px;border-radius:6px;cursor:pointer;border:1px solid var(--border)"/>
      </div>
    </div>

    <!-- Hapus -->
    <button class="btn-remove" type="button" title="Hapus sertifikat">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
    </button>
  `;

  // ---- Events ----
  const getCert = () => data.certificates[idx] || (data.certificates[idx] = {});

  row.querySelector('.cert-title-input').addEventListener('input',    e => { getCert().title    = e.target.value; });
  row.querySelector('.cert-category-input').addEventListener('input', e => { getCert().category = e.target.value; });
  row.querySelector('.cert-issuer-input').addEventListener('input',   e => { getCert().issuer   = e.target.value; });
  row.querySelector('.cert-year-input').addEventListener('input',     e => { getCert().year     = e.target.value; });
  row.querySelector('.cert-color-input').addEventListener('input',    e => { getCert().color    = e.target.value; });

  row.querySelector('.btn-remove').addEventListener('click', () => {
    data.certificates.splice(idx, 1);
    renderCertificates();
  });

  // Upload gambar sertifikat (600×420px, WebP q0.85)
  const preview  = row.querySelector('.cert-admin-preview');
  const uploadBtn = row.querySelector('.btn-upload-logo');
  preview.addEventListener('click', () => fileInput.click());
  uploadBtn.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    uploadBtn.textContent = '⏳';
    uploadBtn.disabled = true;
    try {
      const webp = await fileToWebP(file, 600, 420, 0.85);
      const res = await fetch('../api/upload.php', {
        credentials: 'same-origin',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: webp })
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);

      getCert().image = json.url;
      preview.innerHTML = `<img src="../${json.url}" alt="Sertifikat" draggable="false" data-no-protect="true" />`;
      // Tambah tombol hapus gambar
      const imgBtns = row.querySelector('.cert-admin-img-btns');
      if (!imgBtns.querySelector('.btn-remove-logo')) {
        const rm = document.createElement('button');
        rm.className = 'btn-remove-logo'; rm.type = 'button'; rm.title = 'Hapus Gambar'; rm.textContent = '✕';
        imgBtns.appendChild(rm);
        rm.addEventListener('click', () => removeCertImg(row, idx));
      }
      showToast('✅ Gambar sertifikat berhasil diupload (WebP)', 'success');
    } catch (err) {
      showToast('❌ Gagal upload: ' + err, 'error');
    } finally {
      uploadBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg> Upload`;
      uploadBtn.disabled = false;
    }
  });

  const rmLogoBtn = row.querySelector('.btn-remove-logo');
  if (rmLogoBtn) rmLogoBtn.addEventListener('click', () => removeCertImg(row, idx));

  // Drag input tidak trigger drag
  row.querySelectorAll('input, button').forEach(el => {
    el.addEventListener('mousedown', e => e.stopPropagation());
  });

  return row;
}

function removeCertImg(row, idx) {
  if (data.certificates[idx]) data.certificates[idx].image = null;
  const preview = row.querySelector('.cert-admin-preview');
  preview.innerHTML = `<span class="cert-admin-no-img"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></span>`;
  const rm = row.querySelector('.btn-remove-logo');
  if (rm) rm.remove();
}

document.getElementById('add-cert-btn')?.addEventListener('click', () => {
  if (!data.certificates) data.certificates = [];
  data.certificates.push({ title: '', issuer: '', year: '', category: '', color: '#2563EB', image: null });
  renderCertificates();
  const rows = document.querySelectorAll('#cert-list .cert-admin-row');
  if (rows.length) rows[rows.length - 1].querySelector('.cert-title-input')?.focus();
});

// ============================================================
// DOKUMENTASI PROYEK — ADMIN
// ============================================================
const DOC_KEY = 'maudy_dokumentasi';

function loadDocProjects() {
  if (!data.docProjects) data.docProjects = [];
  
  // Inject dummy data once so user gets the initial portfolio photos back
  if (!data._dummyDocLoaded) {
    if (DEFAULT_DATA.docProjects && DEFAULT_DATA.docProjects.length > 0) {
      DEFAULT_DATA.docProjects.forEach(dp => {
        if (!data.docProjects.find(p => p.id === dp.id)) {
          data.docProjects.push(JSON.parse(JSON.stringify(dp)));
        }
      });
      data._dummyDocLoaded = true;
      // Auto-save so it persists
      saveDocProjects(data.docProjects).catch(e => console.error(e));
    }
  }
  
  return data.docProjects;
}

async function saveDocProjects(projects) {
  data.docProjects = projects;
  await saveData(data);
}

function genDocId() {
  return 'proj_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
}

// ---- State form ----
let docProjects = [];
let docEditIdx  = -1;      // -1 = tambah baru, >= 0 = edit
let docFormPhotos = [];    // array { image: dataURL, caption: '' }

// ---- Render daftar proyek ----
function renderDocList() {
  docProjects = loadDocProjects();
  const list  = document.getElementById('doc-project-list');
  const count = document.getElementById('doc-admin-count');
  if (!list) return;

  count.textContent = `${docProjects.length} proyek`;

  if (docProjects.length === 0) {
    list.innerHTML = `<div style="text-align:center;padding:3rem 0;color:var(--text3)">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" opacity=".3" style="margin-bottom:.75rem"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
      <p style="font-size:.9rem">Belum ada proyek. Klik <strong>Tambah Proyek Baru</strong> untuk mulai.</p>
    </div>`;
    return;
  }

  list.innerHTML = docProjects.map((p, idx) => {
    const thumb = p.photos?.[0]?.image || '';
    const photoCount = (p.photos || []).length;
    const featuredCount = (p.photos || []).filter(ph => ph.featured).length;
    return `
    <div class="doc-admin-proj-row" data-idx="${idx}">
      <div class="doc-admin-proj-thumb">
        ${thumb
          ? `<img src="${thumb}" alt="${escapeHtml(p.title||'')}" draggable="false" loading="lazy" />`
          : `<div class="doc-admin-no-thumb"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg></div>`}
      </div>
      <div class="doc-admin-proj-info">
        <div class="doc-admin-proj-title">${escapeHtml(p.title || 'Tanpa Judul')}</div>
        <div class="doc-admin-proj-meta">
          ${p.category ? `<span class="doc-admin-cat">${escapeHtml(p.category)}</span>` : ''}
          ${featuredCount > 0 ? `<span class="doc-admin-cat" style="background:rgba(250,204,21,0.2);color:#ca8a04;border-color:rgba(250,204,21,0.4)">🌟 ${featuredCount} Unggulan</span>` : ''}
          ${p.client   ? `<span>${escapeHtml(p.client)}</span>` : ''}
          ${p.date     ? `<span>${escapeHtml(p.date)}</span>`   : ''}
          <span>${photoCount} foto</span>
        </div>
      </div>
      <div class="doc-admin-proj-actions">
        <button class="btn-edit-user doc-edit-btn" data-idx="${idx}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          Edit
        </button>
        <button class="btn-remove doc-del-btn" data-idx="${idx}" title="Hapus Proyek">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
        </button>
      </div>
    </div>`;
  }).join('');

  // Events
  list.querySelectorAll('.doc-edit-btn').forEach(btn => {
    btn.addEventListener('click', () => openDocForm(parseInt(btn.dataset.idx)));
  });
  list.querySelectorAll('.doc-del-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const idx = parseInt(btn.dataset.idx);
      if (!confirm(`Hapus proyek "${docProjects[idx]?.title || ''}"? Semua foto akan hilang.`)) return;
      docProjects.splice(idx, 1);
      await saveDocProjects(docProjects);
      renderDocList();
      showToast('✅ Proyek dihapus.', 'success');
    });
  });
}

// ---- Buka form ----
function openDocForm(editIdx = -1) {
  docEditIdx    = editIdx;
  docFormPhotos = [];

  const formWrap = document.getElementById('doc-project-form');
  const title    = document.getElementById('doc-form-title');
  formWrap.removeAttribute('hidden');
  formWrap.scrollIntoView({ behavior: 'smooth', block: 'start' });

  if (editIdx >= 0) {
    const p = docProjects[editIdx];
    title.textContent = `Edit Proyek — ${p.title || ''}`;
    document.getElementById('doc-proj-title').value    = p.title       || '';
    document.getElementById('doc-proj-client').value   = p.client      || '';
    document.getElementById('doc-proj-category').value = p.category    || '';
    document.getElementById('doc-proj-date').value     = p.date        || '';
    document.getElementById('doc-proj-desc').value     = p.description || '';
    docFormPhotos = JSON.parse(JSON.stringify(p.photos || []));
  } else {
    title.textContent = 'Proyek Baru';
    document.getElementById('doc-proj-title').value    = '';
    document.getElementById('doc-proj-client').value   = '';
    document.getElementById('doc-proj-category').value = '';
    document.getElementById('doc-proj-date').value     = '';
    document.getElementById('doc-proj-desc').value     = '';
  }

  document.getElementById('doc-form-status').style.display = 'none';
  renderDocPhotosPreview();
  document.getElementById('doc-proj-title').focus();
}

function closeDocForm() {
  document.getElementById('doc-project-form').setAttribute('hidden', '');
  docEditIdx    = -1;
  docFormPhotos = [];
}

// ---- Preview foto ----
function renderDocPhotosPreview() {
  const preview = document.getElementById('doc-photos-preview');
  if (!preview) return;
  if (docFormPhotos.length === 0) {
    preview.innerHTML = `<div class="doc-photos-empty">Belum ada foto. Klik <strong>Upload Foto</strong> untuk menambahkan.</div>`;
    return;
  }
  preview.innerHTML = docFormPhotos.map((ph, i) => `
    <div class="doc-photo-thumb-wrap" data-i="${i}">
      <img src="${ph.image}" alt="${escapeHtml(ph.caption||'')}" draggable="false" loading="lazy" />
      <div class="doc-photo-caption-overlay">
        <input class="doc-caption-input" type="text" value="${escapeHtml(ph.caption||'')}"
               placeholder="Keterangan foto..." data-i="${i}" />
        <label style="display:flex;align-items:center;gap:4px;margin-top:4px;font-size:0.75rem;color:#fff;cursor:pointer;background:rgba(0,0,0,0.5);padding:2px 4px;border-radius:4px;width:fit-content;">
          <input type="checkbox" class="doc-featured-checkbox" data-i="${i}" ${ph.featured ? 'checked' : ''} />
          🌟 Jadikan Unggulan
        </label>
      </div>
      <button class="doc-photo-del" data-i="${i}" title="Hapus foto">✕</button>
    </div>
  `).join('');

  // Caption & Featured edit
  preview.querySelectorAll('.doc-caption-input').forEach(inp => {
    inp.addEventListener('input', e => {
      const i = parseInt(e.target.dataset.i);
      if (docFormPhotos[i]) docFormPhotos[i].caption = e.target.value;
    });
    inp.addEventListener('mousedown', e => e.stopPropagation());
  });
  preview.querySelectorAll('.doc-featured-checkbox').forEach(chk => {
    chk.addEventListener('change', e => {
      const i = parseInt(e.target.dataset.i);
      if (docFormPhotos[i]) docFormPhotos[i].featured = e.target.checked;
    });
  });

  // Delete foto
  preview.querySelectorAll('.doc-photo-del').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = parseInt(btn.dataset.i);
      docFormPhotos.splice(i, 1);
      renderDocPhotosPreview();
    });
  });
}

// ---- Upload & konversi foto ----
function photoToWebP(file, maxW = 1280, maxH = 960, quality = 0.78) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) return reject('Bukan gambar');
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxW / img.naturalWidth, maxH / img.naturalHeight);
        const w = Math.round(img.naturalWidth  * scale);
        const h = Math.round(img.naturalHeight * scale);
        const canvas = document.createElement('canvas');
        canvas.width  = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/webp', quality));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

document.getElementById('doc-photo-input')?.addEventListener('change', async e => {
  const files = Array.from(e.target.files);
  if (!files.length) return;

  const progress     = document.getElementById('doc-upload-progress');
  const progressFill = document.getElementById('doc-progress-fill');
  const progressText = document.getElementById('doc-progress-text');
  progress.removeAttribute('hidden');

  for (let i = 0; i < files.length; i++) {
    const pct = Math.round((i / files.length) * 100);
    progressFill.style.width = pct + '%';
    progressText.textContent = `Mengkonversi ${i + 1}/${files.length}...`;
    try {
      const webp = await photoToWebP(files[i]);
      const res = await fetch('../api/upload.php', {
        credentials: 'same-origin',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: webp })
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      
      docFormPhotos.push({ image: '../' + json.url, caption: '', featured: false });
    } catch (err) {
      showToast(`⚠️ Gagal upload: ${files[i].name} (${err.message || err})`, 'error');
    }
  }

  progressFill.style.width = '100%';
  progressText.textContent = `✅ ${files.length} foto dikkonversi`;
  setTimeout(() => { progress.setAttribute('hidden', ''); }, 1500);

  renderDocPhotosPreview();
  e.target.value = '';
  showToast(`✅ ${files.length} foto ditambahkan & dikkonversi ke WebP.`, 'success');
});

// ---- Simpan proyek ----
document.getElementById('doc-form-save')?.addEventListener('click', async () => {
  const title = document.getElementById('doc-proj-title').value.trim();
  const statusEl = document.getElementById('doc-form-status');
  statusEl.style.display = 'none';

  if (!title) {
    statusEl.className = 'form-status error';
    statusEl.textContent = 'Nama proyek wajib diisi.';
    statusEl.style.display = 'block';
    document.getElementById('doc-proj-title').focus();
    return;
  }

  const proj = {
    id:          docEditIdx >= 0 ? docProjects[docEditIdx].id : genDocId(),
    title,
    client:      document.getElementById('doc-proj-client').value.trim(),
    category:    document.getElementById('doc-proj-category').value.trim(),
    date:        document.getElementById('doc-proj-date').value,
    description: document.getElementById('doc-proj-desc').value.trim(),
    photos:      docFormPhotos,
    published:   true,
    updatedAt:   new Date().toISOString(),
  };

  if (docEditIdx >= 0) {
    docProjects[docEditIdx] = proj;
  } else {
    docProjects.unshift(proj); // terbaru di atas
  }

  await saveDocProjects(docProjects);
  closeDocForm();
  renderDocList();
  showToast(`✅ Proyek "${title}" disimpan (${docFormPhotos.length} foto).`, 'success');
});

// ---- Cancel buttons ----
document.getElementById('doc-form-cancel')?.addEventListener('click',  closeDocForm);
document.getElementById('doc-form-cancel2')?.addEventListener('click', closeDocForm);

// ---- Tambah proyek baru ----
document.getElementById('add-doc-project-btn')?.addEventListener('click', () => openDocForm(-1));

// ---- switchTab trigger ----
// (dipanggil otomatis dari switchTab() di bagian atas file ini)
function renderDokumentasiAdmin() {
  renderDocList();
}

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
