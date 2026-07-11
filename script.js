/**
 * MAUDY IT Solution — Main Script
 * Features: i18n bilingual, dark/light mode, particles, counters,
 *           scroll animations, carousel, portfolio filter, form handling
 * Performance: Intersection Observer (no scroll events), requestAnimationFrame
 */

'use strict';

/* ============================================================
   0. CMS DATA LOADER — Reads from Admin Panel (localStorage)
      Applies ALL admin changes to DOM immediately on page load
   ============================================================ */
(function loadCMSData() {
  const CMS_KEY = 'maudy_cms_data';
  let cms = null;
  try {
    const raw = localStorage.getItem(CMS_KEY);
    if (raw) cms = JSON.parse(raw);
  } catch (e) { /* use defaults */ }
  if (!cms) return;

  /* ---- Helpers ---- */
  const setText = (sel, val) => {
    if (!val) return;
    document.querySelectorAll(sel).forEach(el => { el.textContent = val; });
  };
  const setHTML = (sel, val) => {
    if (!val) return;
    document.querySelectorAll(sel).forEach(el => { el.innerHTML = val; });
  };
  const setAttr = (sel, attr, val) => {
    if (!val) return;
    document.querySelectorAll(sel).forEach(el => el.setAttribute(attr, val));
  };
  const setHref = (sel, val) => {
    if (!val || val === '#') return;
    document.querySelectorAll(sel).forEach(el => { el.href = val; });
  };
  const setI18n = (key, val, lang = 'both') => {
    if (!val) return;
    if (lang === 'both' || lang === 'id') {
      document.querySelectorAll(`[data-i18n="${key}"]`).forEach(el => {
        el.innerHTML = String(val).replace(/\n/g, '<br>');
      });
    }
    // Patch TRANSLATIONS for when language toggled
    if (window.TRANSLATIONS) {
      if (lang === 'both' || lang === 'id') {
        if (window.TRANSLATIONS.id) window.TRANSLATIONS.id[key] = String(val);
      }
      if (lang === 'both' || lang === 'en') {
        if (window.TRANSLATIONS.en && val) window.TRANSLATIONS.en[key] = String(val);
      }
    }
  };

  // ---- 1. CONTACT ----
  if (cms.contact) {
    const c = cms.contact;
    const waNum = (c.whatsapp || '').replace(/[^0-9]/g, '') || '6281234567890';
    const waLink = `https://wa.me/${waNum}`;

    if (c.phone) {
      setText('a[href^="tel:"]', c.phone);
      setAttr('a[href^="tel:"]', 'href', `tel:+${waNum}`);
    }
    if (c.email) {
      setText('a[href^="mailto:"]', c.email);
      setAttr('a[href^="mailto:"]', 'href', `mailto:${c.email}`);
    }
    // WhatsApp links (all occurrences)
    setHref('.wa-float', waLink);
    setHref('.btn-whatsapp', waLink);
    document.querySelectorAll('a[href*="wa.me"]').forEach(el => { el.href = waLink; });

    // Address
    if (c.address) {
      setI18n('ci1_val', c.address);
    }
    // Hours
    if (c.hours_id) {
      document.querySelectorAll('[data-i18n="ci4_val"]').forEach(el => {
        el.innerHTML = c.hours_id.replace(/\n/g, '<br>');
      });
      if (window.TRANSLATIONS && window.TRANSLATIONS.id) {
        window.TRANSLATIONS.id['ci4_val'] = c.hours_id;
      }
    }
    if (c.hours_en && window.TRANSLATIONS && window.TRANSLATIONS.en) {
      window.TRANSLATIONS.en['ci4_val'] = c.hours_en;
    }
    // Phone number display in contact section
    if (c.phone) {
      document.querySelectorAll('[data-i18n="ci2_val"]').forEach(el => {
        el.textContent = c.phone;
      });
    }
    // Email display
    if (c.email) {
      document.querySelectorAll('[data-i18n="ci3_val"]').forEach(el => {
        el.textContent = c.email;
      });
    }
  }

  // ---- 2. STATS / COUNTERS ----
  if (cms.stats) {
    const statMap = [cms.stats.years, cms.stats.projects, cms.stats.clients, cms.stats.services];
    document.querySelectorAll('.counter[data-target]').forEach((el, i) => {
      if (statMap[i] !== undefined) {
        el.dataset.target = statMap[i];
        el.textContent = '0'; // reset agar counter ulang dari 0
      }
    });
  }

  // ---- 3. COMPANY / HERO ----
  if (cms.company) {
    const co = cms.company;
    // Hero badge
    if (co.hero_badge_id) setI18n('hero_badge', co.hero_badge_id);
    if (co.hero_badge_en && window.TRANSLATIONS && window.TRANSLATIONS.en) {
      window.TRANSLATIONS.en['hero_badge'] = co.hero_badge_en;
    }
    // Hero description
    if (co.desc_id) setI18n('hero_desc', co.desc_id);
    if (co.desc_en && window.TRANSLATIONS && window.TRANSLATIONS.en) {
      window.TRANSLATIONS.en['hero_desc'] = co.desc_en;
    }
    // Trust count
    if (co.trust_count) {
      const trustId = `Dipercaya oleh ${co.trust_count}+ klien`;
      const trustEn = `Trusted by ${co.trust_count}+ clients`;
      setI18n('hero_trust', trustId);
      if (window.TRANSLATIONS) {
        if (window.TRANSLATIONS.id) window.TRANSLATIONS.id['hero_trust'] = trustId;
        if (window.TRANSLATIONS.en) window.TRANSLATIONS.en['hero_trust'] = trustEn;
      }
    }
    // Footer description
    if (co.footer_desc_id) {
      setI18n('footer_desc', co.footer_desc_id);
      if (window.TRANSLATIONS && window.TRANSLATIONS.en && co.footer_desc_id) {
        window.TRANSLATIONS.en['footer_desc'] = co.footer_desc_id; // fallback
      }
    }
    // Company name
    if (co.name) {
      document.querySelectorAll('.footer-brand .brand-name').forEach(el => {
        el.textContent = co.name;
      });
    }
  }

  // ---- 4. SOCIAL LINKS ----
  if (cms.social) {
    const sm = cms.social;
    if (sm.facebook  && sm.facebook  !== '#') setHref('[aria-label*="Facebook"]', sm.facebook);
    if (sm.instagram && sm.instagram !== '#') setHref('[aria-label*="Instagram"]', sm.instagram);
    if (sm.linkedin  && sm.linkedin  !== '#') setHref('[aria-label*="LinkedIn"]', sm.linkedin);
    if (sm.tiktok    && sm.tiktok    !== '#' && sm.tiktok) setHref('[aria-label*="TikTok"]', sm.tiktok);
  }

  // ---- 5. PARTNERS MARQUEE ----
  if (cms.partners && cms.partners.length > 0) {
    const track = document.querySelector('.marquee-track');
    if (track) {
      const partners = cms.partners.filter(p => p && (typeof p === 'string' ? p.trim() : p.name));
      const normalized = partners.map(p => typeof p === 'string' ? { name: p, logo: null } : p);
      const doubled = [...normalized, ...normalized];
      track.innerHTML = doubled.map(p => {
        if (p.logo) {
          return `<div class="partner-logo">
            <img class="partner-img" src="${p.logo}" alt="${p.name}" draggable="false" data-no-protect="true" loading="lazy" />
            <span>${p.name}</span>
          </div>`;
        }
        return `<div class="partner-logo">${p.name}</div>`;
      }).join('');
    }
  }

  // ---- 6. TESTIMONIALS ----
  if (cms.testimonials && cms.testimonials.length > 0) {
    window._CMS_TESTIMONIALS = cms.testimonials;
    window._CMS_CERTIFICATES = cms.certificates || [];
  }

  // ---- Store cms globally for other functions to access ----
  window._CMS_DATA = cms;
})();





/* ============================================================
   1. TRANSLATIONS (ID / EN)
   ============================================================ */
const TRANSLATIONS = {
  id: {
    nav_home: 'Beranda',
    nav_services: 'Layanan',
    nav_about: 'Tentang',
    nav_portfolio: 'Portofolio',
    nav_certifications: 'Sertifikat',
    nav_testimonials: 'Testimoni',
    nav_contact: 'Kontak',
    nav_cta: 'Hubungi Kami',
    hero_badge: '⚡ IT Solution Terpercaya #1',
    hero_title1: 'Transforming Business',
    hero_title2: 'Through Innovative',
    hero_title3: 'Technology',
    hero_desc: 'Solusi IT terlengkap untuk mendukung pertumbuhan bisnis Anda. Dari service komputer, instalasi jaringan, pengembangan software hingga keamanan sistem — semua ada di sini.',
    hero_btn1: 'Lihat Layanan',
    hero_btn2: 'Konsultasi Gratis',
    hero_trust: 'Dipercaya oleh 50+ klien',
    fc1_title: 'Uptime Server',
    fc2_title: 'Keamanan',
    fc3_title: 'Support',
    scroll_down: 'Scroll ke bawah',
    stat1: 'Tahun Pengalaman',
    stat2: 'Proyek Selesai',
    stat3: 'Klien Puas',
    stat4: 'Jenis Layanan',
    services_badge: 'LAYANAN KAMI',
    services_title: 'Solusi IT Terlengkap\nuntuk Bisnis Anda',
    services_desc: 'Kami menyediakan lebih dari 38 jenis layanan teknologi informasi yang komprehensif untuk mendukung operasional dan pertumbuhan bisnis Anda.',
    svc1_title: 'Hardware & Repair',
    svc1_desc: 'Service & sparepart komputer/laptop, instalasi sistem operasi Windows & Linux, jual komputer & laptop baru.',
    svc2_title: 'Networking & Infrastruktur',
    svc2_desc: 'Instalasi jaringan komputer, konfigurasi Mikrotik, wireless, fiber optic, dan internet broadband.',
    svc3_title: 'Software & Web Development',
    svc3_desc: 'Pembuatan website profesional, pengembangan software custom, dan sistem informasi sesuai kebutuhan bisnis.',
    svc4_title: 'Cloud & Server',
    svc4_desc: 'Setup & maintenance VPS, instalasi server, cloud hosting, virtualisasi, dan backup data terpusat.',
    svc5_title: 'Keamanan & CCTV',
    svc5_desc: 'Instalasi CCTV, sistem keamanan gedung, access control, dan solusi keamanan digital terpadu.',
    svc6_title: 'Monitoring & Support IT',
    svc6_desc: 'Managed service, monitoring jaringan/server/CCTV 24/7, maintenance website, dan support IT profesional.',
    why_badge: 'MENGAPA KAMI',
    why_title: 'Mengapa Memilih\nMAUDY IT Solution?',
    why_desc: 'Kami bukan sekadar penyedia layanan IT. Kami adalah mitra teknologi Anda yang berkomitmen untuk memberikan solusi terbaik, cepat, dan tepat sasaran.',
    why1_title: 'Tim Bersertifikat',
    why1_desc: 'Teknisi kami bersertifikat resmi dengan kompetensi terbukti di bidangnya.',
    why2_title: 'Respons Cepat',
    why2_desc: 'Garansi respons dalam 2 jam untuk setiap laporan masalah teknis.',
    why3_title: 'Keamanan Terjamin',
    why3_desc: 'Sistem keamanan berlapis dengan enkripsi data dan proteksi penuh.',
    why4_title: 'Support 24/7',
    why4_desc: 'Tim support kami siap melayani Anda kapan saja, 24 jam 7 hari seminggu.',
    portfolio_badge: 'PORTOFOLIO',
    portfolio_title: 'Proyek Unggulan Kami',
    portfolio_desc: 'Beberapa karya terbaik yang telah kami selesaikan untuk klien dari berbagai industri.',
    filter_all: 'Semua',
    filter_web: 'Web & Software',
    filter_network: 'Jaringan',
    filter_security: 'Keamanan',
    ptag_web: 'Web Development',
    ptag_network: 'Infrastruktur Jaringan',
    ptag_security: 'Sistem Keamanan',
    p1_title: 'Sistem Analitik Bisnis',
    p1_desc: 'Dashboard analytics real-time untuk monitoring KPI bisnis perusahaan manufaktur.',
    p2_title: 'Monitoring Jaringan Enterprise',
    p2_desc: 'Instalasi dan konfigurasi infrastruktur jaringan untuk gedung 10 lantai dengan 500+ node.',
    p3_title: 'Pusat Monitoring Keamanan',
    p3_desc: 'Instalasi CCTV dan security system terintegrasi untuk kompleks perkantoran modern.',
    industries_badge: 'INDUSTRI',
    industries_title: 'Industri yang Kami Layani',
    ind1: 'Manufaktur', ind2: 'Kesehatan', ind3: 'Pendidikan',
    ind4: 'Keuangan', ind5: 'Pemerintahan', ind6: 'Ritel',
    testi_badge: 'TESTIMONI',
    testi_title: 'Apa Kata Klien Kami?',
    t1_text: '"MAUDY IT Solution sangat profesional dalam menangani infrastruktur jaringan kami. Semua berjalan lancar dan tepat waktu."',
    t1_role: 'IT Manager, PT Maju Bersama',
    t2_text: '"Website yang dibuat sangat memuaskan, desain modern dan loading cepat. Support after-sales juga luar biasa responsif."',
    t2_role: 'Direktur, CV Karya Digital',
    t3_text: '"Instalasi CCTV dan sistem keamanan berjalan sempurna. Tim teknisi sangat berpengalaman dan ramah."',
    t3_role: 'HRD Manager, PT Selaras Group',
    t4_text: '"Managed service mereka sangat membantu. Server kami selalu terpantau 24/7 dan masalah diselesaikan sebelum berdampak ke bisnis."',
    t4_role: 'CTO, PT Tech Nusantara',
    partners_badge: 'REKANAN',
    partners_title: 'Partner & Rekanan Kami',
    cert_badge: 'SERTIFIKASI',
    cert_title: 'Sertifikat & Keahlian Kami',
    cert_desc: 'Bukti kompetensi tim kami yang tersertifikasi resmi dari lembaga internasional terpercaya.',
    contact_badge: 'KONTAK',
    contact_title: 'Hubungi Kami Sekarang',
    contact_desc: 'Dapatkan konsultasi gratis dan solusi terbaik untuk kebutuhan IT bisnis Anda.',
    ci1_title: 'Alamat', ci1_val: 'Jl. Teknologi No. 99, Kota Maju, Indonesia',
    ci2_title: 'Telepon / WhatsApp',
    ci3_title: 'Email',
    ci4_title: 'Jam Operasional', ci4_val: 'Senin – Sabtu: 08.00 – 17.00\nSupport 24/7 tersedia',
    form_name: 'Nama Lengkap', form_email: 'Email', form_phone: 'No. Telepon',
    form_service: 'Layanan yang Dibutuhkan', form_select: '— Pilih Layanan —',
    fs1: 'Hardware & Repair', fs2: 'Jaringan & Infrastruktur', fs3: 'Software & Web Dev',
    fs4: 'Cloud & Server', fs5: 'Keamanan & CCTV', fs6: 'Monitoring & Support', fs7: 'Lainnya',
    form_message: 'Pesan / Deskripsi Kebutuhan',
    form_submit: 'Kirim Pesan',
    form_success: '✅ Pesan Anda berhasil dikirim! Kami akan segera menghubungi Anda.',
    form_error: '❌ Mohon isi semua field yang wajib diisi.',
    footer_desc: 'Mitra teknologi terpercaya untuk mendukung transformasi digital bisnis Anda.',
    footer_nav: 'Navigasi', footer_services: 'Layanan Utama', footer_contact_title: 'Kontak Cepat',
    footer_copy: '© 2025 MAUDY IT Solution. Seluruh hak cipta dilindungi undang-undang.',
    footer_privacy: 'Kebijakan Privasi', footer_terms: 'Syarat & Ketentuan',
    wa_btn: 'Chat WhatsApp',
  },

  en: {
    nav_home: 'Home',
    nav_services: 'Services',
    nav_about: 'About',
    nav_portfolio: 'Portfolio',
    nav_testimonials: 'Testimonials',
    nav_contact: 'Contact',
    nav_cta: 'Contact Us',
    hero_badge: '⚡ Trusted IT Solution #1',
    hero_title1: 'Transforming Business',
    hero_title2: 'Through Innovative',
    hero_title3: 'Technology',
    hero_desc: 'The most comprehensive IT solutions to support your business growth. From computer service, network installation, software development to system security — all in one place.',
    hero_btn1: 'Our Services',
    hero_btn2: 'Free Consultation',
    hero_trust: 'Trusted by 50+ clients',
    fc1_title: 'Server Uptime',
    fc2_title: 'Security',
    fc3_title: 'Support',
    scroll_down: 'Scroll down',
    stat1: 'Years Experience',
    stat2: 'Projects Completed',
    stat3: 'Happy Clients',
    stat4: 'Service Types',
    services_badge: 'OUR SERVICES',
    services_title: 'Complete IT Solutions\nfor Your Business',
    services_desc: 'We provide more than 38 types of comprehensive IT services to support your business operations and growth.',
    svc1_title: 'Hardware & Repair',
    svc1_desc: 'Computer/laptop service & spare parts, Windows & Linux OS installation, new computers & laptops sales.',
    svc2_title: 'Networking & Infrastructure',
    svc2_desc: 'Computer network installation, Mikrotik configuration, wireless, fiber optic, and broadband internet.',
    svc3_title: 'Software & Web Development',
    svc3_desc: 'Professional website development, custom software development, and information systems for business needs.',
    svc4_title: 'Cloud & Server',
    svc4_desc: 'VPS setup & maintenance, server installation, cloud hosting, virtualization, and centralized data backup.',
    svc5_title: 'Security & CCTV',
    svc5_desc: 'CCTV installation, building security systems, access control, and integrated digital security solutions.',
    svc6_title: 'Monitoring & IT Support',
    svc6_desc: 'Managed service, 24/7 network/server/CCTV monitoring, website maintenance, and professional IT support.',
    why_badge: 'WHY US',
    why_title: 'Why Choose\nMAUDY IT Solution?',
    why_desc: 'We are not just an IT service provider. We are your technology partner committed to delivering the best, fast, and on-target solutions.',
    why1_title: 'Certified Team',
    why1_desc: 'Our technicians are officially certified with proven competencies in their fields.',
    why2_title: 'Fast Response',
    why2_desc: 'Guaranteed response within 2 hours for every technical issue report.',
    why3_title: 'Guaranteed Security',
    why3_desc: 'Multilayered security system with data encryption and full protection.',
    why4_title: '24/7 Support',
    why4_desc: 'Our support team is ready to serve you anytime, 24 hours 7 days a week.',
    portfolio_badge: 'PORTFOLIO',
    portfolio_title: 'Our Featured Projects',
    portfolio_desc: 'Some of our best work completed for clients from various industries.',
    filter_all: 'All',
    filter_web: 'Web & Software',
    filter_network: 'Networking',
    filter_security: 'Security',
    ptag_web: 'Web Development',
    ptag_network: 'Network Infrastructure',
    ptag_security: 'Security System',
    p1_title: 'Business Analytics System',
    p1_desc: 'Real-time analytics dashboard for monitoring KPIs of a manufacturing company.',
    p2_title: 'Enterprise Network Monitoring',
    p2_desc: 'Installation and configuration of network infrastructure for a 10-floor building with 500+ nodes.',
    p3_title: 'Security Monitoring Center',
    p3_desc: 'Integrated CCTV and security system installation for a modern office complex.',
    industries_badge: 'INDUSTRIES',
    industries_title: 'Industries We Serve',
    ind1: 'Manufacturing', ind2: 'Healthcare', ind3: 'Education',
    ind4: 'Finance', ind5: 'Government', ind6: 'Retail',
    testi_badge: 'TESTIMONIALS',
    testi_title: 'What Our Clients Say?',
    t1_text: '"MAUDY IT Solution was very professional in handling our network infrastructure. Everything ran smoothly and on time."',
    t1_role: 'IT Manager, PT Maju Bersama',
    t2_text: '"The website created is very satisfying, modern design and fast loading. After-sales support is also incredibly responsive."',
    t2_role: 'Director, CV Karya Digital',
    t3_text: '"CCTV installation and security system went perfectly. The technical team is highly experienced and friendly."',
    t3_role: 'HRD Manager, PT Selaras Group',
    t4_text: '"Their managed service is very helpful. Our server is always monitored 24/7 and issues are resolved before impacting business."',
    t4_role: 'CTO, PT Tech Nusantara',
    partners_badge: 'PARTNERS',
    partners_title: 'Our Partners & Affiliates',
    cert_badge: 'CERTIFICATIONS',
    cert_title: 'Our Certifications & Expertise',
    cert_desc: 'Proof of our team competence officially certified by trusted international institutions.',
    contact_badge: 'CONTACT',
    contact_title: 'Contact Us Now',
    contact_desc: 'Get a free consultation and the best solution for your business IT needs.',
    ci1_title: 'Address', ci1_val: 'Jl. Teknologi No. 99, Kota Maju, Indonesia',
    ci2_title: 'Phone / WhatsApp',
    ci3_title: 'Email',
    ci4_title: 'Office Hours', ci4_val: 'Mon – Sat: 08:00 – 17:00\n24/7 support available',
    form_name: 'Full Name', form_email: 'Email', form_phone: 'Phone Number',
    form_service: 'Service Needed', form_select: '— Select Service —',
    fs1: 'Hardware & Repair', fs2: 'Network & Infrastructure', fs3: 'Software & Web Dev',
    fs4: 'Cloud & Server', fs5: 'Security & CCTV', fs6: 'Monitoring & Support', fs7: 'Other',
    form_message: 'Message / Description of Needs',
    form_submit: 'Send Message',
    form_success: '✅ Your message has been sent! We will contact you shortly.',
    form_error: '❌ Please fill in all required fields.',
    footer_desc: 'Your trusted technology partner for supporting your business digital transformation.',
    footer_nav: 'Navigation', footer_services: 'Main Services', footer_contact_title: 'Quick Contact',
    footer_copy: '© 2025 MAUDY IT Solution. All rights reserved.',
    footer_privacy: 'Privacy Policy', footer_terms: 'Terms & Conditions',
    wa_btn: 'WhatsApp Chat',
  }
};

/* ============================================================
   2. STATE
   ============================================================ */
let currentLang = localStorage.getItem('maudy_lang') || 'id';
let currentTheme = localStorage.getItem('maudy_theme') || 'dark';
let testitCurrent = 0;
let testitTotal = 4;
let testitTimer = null;
let countersStarted = false;
let particleRAF = null;

/* ============================================================
   3. DOM READY
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  applyTheme(currentTheme, false);
  applyLanguage(currentLang, false);
  initLoader();
  initNavbar();
  initHamburger();
  initScrollProgress();
  initBackToTop();
  initScrollAnimations();
  initParticles();
  initCounters();
  initTestimonials();
  initCertifications();
  initPortfolioFilter();
  initContactForm();
  initActiveNavLinks();
});

/* ============================================================
   4. LOADER
   ============================================================ */
function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;
  window.addEventListener('load', () => {
    setTimeout(() => { loader.classList.add('hidden'); }, 1600);
  });
  // Fallback if load event already fired or assets cached
  if (document.readyState === 'complete') {
    setTimeout(() => { loader.classList.add('hidden'); }, 800);
  }
}

/* ============================================================
   5. NAVBAR SCROLL EFFECT
   ============================================================ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ============================================================
   6. HAMBURGER MENU
   ============================================================ */
function initHamburger() {
  const btn = document.getElementById('hamburger');
  const menu = document.getElementById('nav-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    btn.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', String(isOpen));
    btn.setAttribute('aria-label', isOpen ? 'Tutup menu' : 'Buka menu');
  });

  // Close on nav link click
  menu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!btn.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ============================================================
   7. SCROLL PROGRESS BAR
   ============================================================ */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? Math.round((window.scrollY / max) * 100) : 0;
    bar.style.width = pct + '%';
    bar.setAttribute('aria-valuenow', pct);
  }, { passive: true });
}

/* ============================================================
   8. BACK TO TOP
   ============================================================ */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ============================================================
   9. SCROLL ANIMATIONS (Intersection Observer)
   ============================================================ */
function initScrollAnimations() {
  const els = document.querySelectorAll('[data-animate]');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const delay = parseInt(el.dataset.delay || '0', 10);
      setTimeout(() => el.classList.add('animated'), delay);
      observer.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
}

/* ============================================================
   10. PARTICLE SYSTEM (Canvas)
   ============================================================ */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const isDark = () => document.documentElement.getAttribute('data-theme') !== 'light';
  const particles = [];
  const COUNT = Math.min(70, Math.floor(window.innerWidth / 20));

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function randomParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 0.5,
      alpha: Math.random() * 0.5 + 0.2,
    };
  }

  resize();
  for (let i = 0; i < COUNT; i++) particles.push(randomParticle());

  window.addEventListener('resize', () => {
    resize();
  }, { passive: true });

  const CONNECT_DIST = 120;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const accentColor = isDark() ? '34,211,238' : '8,145,178';
    const primaryColor = isDark() ? '37,99,235' : '30,58,138';

    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      // Draw dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${accentColor},${p.alpha})`;
      ctx.fill();

      // Draw connections
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x, dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DIST) {
          const a = (1 - dist / CONNECT_DIST) * 0.3;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(${primaryColor},${a})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    });

    particleRAF = requestAnimationFrame(draw);
  }

  draw();

  // Pause when tab hidden (performance)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(particleRAF);
    } else {
      draw();
    }
  });
}

/* ============================================================
   11. COUNTER ANIMATION
   ============================================================ */
function initCounters() {
  const statSection = document.getElementById('stats');
  if (!statSection) return;

  const observer = new IntersectionObserver((entries) => {
    if (!entries[0].isIntersecting || countersStarted) return;
    countersStarted = true;
    observer.disconnect();

    document.querySelectorAll('.counter').forEach(el => {
      const target = parseInt(el.dataset.target, 10);
      const duration = 1800;
      const step = 16;
      const steps = duration / step;
      const increment = target / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          el.textContent = target;
          clearInterval(timer);
        } else {
          el.textContent = Math.floor(current);
        }
      }, step);
    });
  }, { threshold: 0.5 });

  observer.observe(statSection);
}

/* ============================================================
   12. TESTIMONIALS CAROUSEL
   ============================================================ */
function initTestimonials() {
  const track = document.getElementById('testi-track');
  const dotsContainer = document.getElementById('testi-dots');
  const prevBtn = document.getElementById('testi-prev');
  const nextBtn = document.getElementById('testi-next');
  if (!track) return;

  // ---- Render from CMS if available ----
  if (window._CMS_TESTIMONIALS && window._CMS_TESTIMONIALS.length > 0) {
    const lang = currentLang || 'id';
    track.innerHTML = window._CMS_TESTIMONIALS.map((t, i) => {
      const text = lang === 'en' && t.text_en ? t.text_en : (t.text_id || t.text || '');
      const avatarChar = (t.avatar || t.name || '?')[0].toUpperCase();
      return `
        <div class="testi-card" role="tabpanel" aria-label="Testimoni ${i + 1}">
          <div class="testi-content">
            <div class="testi-stars" aria-label="Rating 5 bintang">★★★★★</div>
            <blockquote class="testi-text">"${text}"</blockquote>
            <div class="testi-author">
              <div class="testi-avatar" aria-hidden="true">${avatarChar}</div>
              <div class="testi-info">
                <div class="testi-name">${t.name || ''}</div>
                <div class="testi-role">${t.role || ''}</div>
              </div>
            </div>
          </div>
        </div>`;
    }).join('');
    if (dotsContainer) dotsContainer.innerHTML = '';
  }

  const cards = track.querySelectorAll('.testi-card');
  testitTotal = cards.length;
  if (testitTotal === 0) return;

  // Create dots
  if (dotsContainer) {
    for (let i = 0; i < testitTotal; i++) {
      const dot = document.createElement('button');
      dot.className = 'testi-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Testimoni ${i + 1}`);
      dot.addEventListener('click', () => goToTesti(i));
      dotsContainer.appendChild(dot);
    }
  }

  function goToTesti(idx) {
    testitCurrent = idx;
    const trackWidth = track.parentElement.offsetWidth;
    track.style.transform = `translateX(-${idx * trackWidth}px)`;

    // Update dots
    dotsContainer?.querySelectorAll('.testi-dot').forEach((d, i) => {
      d.classList.toggle('active', i === idx);
    });

    // Restart auto-play
    restartTimer();
  }

  function nextTesti() { goToTesti((testitCurrent + 1) % testitTotal); }
  function prevTesti() { goToTesti((testitCurrent - 1 + testitTotal) % testitTotal); }

  prevBtn?.addEventListener('click', prevTesti);
  nextBtn?.addEventListener('click', nextTesti);

  // Keyboard navigation
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextTesti();
    if (e.key === 'ArrowLeft') prevTesti();
  });

  // Touch/swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? nextTesti() : prevTesti();
  }, { passive: true });

  // Auto-play
  function restartTimer() {
    clearInterval(testitTimer);
    testitTimer = setInterval(nextTesti, 5000);
  }
  restartTimer();

  // Recalculate on resize
  window.addEventListener('resize', () => goToTesti(testitCurrent), { passive: true });
}




/* ============================================================
   12B. CERTIFICATIONS — Render from CMS + Lightbox
   ============================================================ */
function initCertifications() {
  const certs = window._CMS_CERTIFICATES || (window._CMS_DATA && window._CMS_DATA.certificates);
  const grid  = document.getElementById('cert-grid');
  if (!grid) return;

  // Render dari CMS jika ada data sertifikat
  if (certs && certs.length > 0) {
    grid.innerHTML = certs.map((cert, i) => buildCertCard(cert, i)).join('');
  }

  // Init lightbox pada semua card (CMS atau default HTML)
  grid.querySelectorAll('.cert-card').forEach((card) => {
    // Untuk default HTML cards, ambil data dari DOM
    if (!card.dataset.certTitle) {
      const nameEl    = card.querySelector('.cert-name');
      const issuerEl  = card.querySelector('.cert-issuer');
      const yearEl    = card.querySelector('.cert-year');
      const categoryEl= card.querySelector('.cert-category');
      const imgEl     = card.querySelector('img');
      card.dataset.certTitle    = nameEl?.textContent    || '';
      card.dataset.certIssuer   = issuerEl?.textContent  || '';
      card.dataset.certYear     = yearEl?.textContent    || '';
      card.dataset.certCategory = categoryEl?.textContent|| '';
      card.dataset.certImg      = imgEl?.src             || '';
    }
    card.addEventListener('click', () => openLightbox(card));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(card); }
    });
  });

  // Lightbox controls
  const lb      = document.getElementById('cert-lightbox');
  const lbClose = document.getElementById('cert-lightbox-close');
  const lbBack  = lb?.querySelector('.cert-lightbox-backdrop');

  lbClose?.addEventListener('click', closeLightbox);
  lbBack?.addEventListener('click',  closeLightbox);
  // ESC hanya jika belum ditambahkan
  if (!lb?.dataset.escBound) {
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
    if (lb) lb.dataset.escBound = '1';
  }
}

function buildCertCard(cert, i) {
  const imgHtml = cert.image
    ? `<img src="${cert.image}" alt="${cert.title}" draggable="false" data-no-protect="true" loading="lazy" />`
    : `<div class="cert-img-placeholder" style="${cert.color ? `--cert-color:${cert.color}` : ''}">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
      </div>`;
  return `
    <article class="cert-card" tabindex="0" role="button"
      aria-label="${cert.title}"
      data-cert-title="${cert.title || ''}"
      data-cert-issuer="${cert.issuer || ''}"
      data-cert-year="${cert.year || ''}"
      data-cert-category="${cert.category || ''}"
      data-cert-img="${cert.image || ''}">
      <div class="cert-img-wrap">
        ${imgHtml}
        <div class="cert-verified" aria-label="Terverifikasi">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="white" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
      </div>
      <div class="cert-info">
        ${cert.category ? `<span class="cert-category">${cert.category}</span>` : ''}
        <h3 class="cert-name">${cert.title || ''}</h3>
        <div class="cert-meta">
          <span class="cert-issuer">${cert.issuer || ''}</span>
          ${cert.year ? `<span class="cert-year">${cert.year}</span>` : ''}
        </div>
      </div>
    </article>`;
}

function openLightbox(card) {
  const lb = document.getElementById('cert-lightbox');
  if (!lb) return;

  const img      = card.dataset.certImg;
  const title    = card.dataset.certTitle;
  const issuer   = card.dataset.certIssuer;
  const year     = card.dataset.certYear;
  const category = card.dataset.certCategory;

  document.getElementById('cert-lightbox-title').textContent   = title    || '';
  document.getElementById('cert-lightbox-issuer').textContent  = issuer   || '';
  document.getElementById('cert-lightbox-year').textContent    = year     || '';
  document.getElementById('cert-lightbox-cat').textContent     = category || '';

  const lbImg         = document.getElementById('cert-lightbox-img');
  const lbPlaceholder = document.getElementById('cert-lightbox-placeholder');

  if (img) {
    lbImg.src         = img;
    lbImg.alt         = title;
    lbImg.style.display        = 'block';
    lbPlaceholder.style.display = 'none';
  } else {
    lbImg.style.display        = 'none';
    lbPlaceholder.style.display = 'flex';
  }

  lb.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';
  document.getElementById('cert-lightbox-close')?.focus();
}

function closeLightbox() {
  const lb = document.getElementById('cert-lightbox');
  if (!lb) return;
  lb.setAttribute('hidden', '');
  document.body.style.overflow = '';
}

/* ============================================================
   13. PORTFOLIO FILTER
   ============================================================ */
function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.portfolio-card');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      cards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeInUp 0.4s ease both';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* ============================================================
   14. CONTACT FORM
   ============================================================ */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  const submitBtn = document.getElementById('form-submit');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('#f-name')?.value.trim();
    const email = form.querySelector('#f-email')?.value.trim();
    const message = form.querySelector('#f-message')?.value.trim();

    if (!name || !email || !message) {
      showFormStatus('error', TRANSLATIONS[currentLang].form_error);
      return;
    }

    // Simulate sending
    const span = submitBtn?.querySelector('span');
    if (span) span.textContent = currentLang === 'id' ? 'Mengirim...' : 'Sending...';
    if (submitBtn) submitBtn.disabled = true;

    setTimeout(() => {
      showFormStatus('success', TRANSLATIONS[currentLang].form_success);
      form.reset();
      if (span) span.textContent = TRANSLATIONS[currentLang].form_submit;
      if (submitBtn) submitBtn.disabled = false;
    }, 1500);
  });

  function showFormStatus(type, msg) {
    if (!status) return;
    status.textContent = msg;
    status.className = 'form-status ' + type;
    setTimeout(() => { status.className = 'form-status'; status.textContent = ''; }, 5000);
  }
}

/* ============================================================
   15. ACTIVE NAV LINKS ON SCROLL
   ============================================================ */
function initActiveNavLinks() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          link.classList.toggle('active', href === '#' + id);
        });
      }
    });
  }, { threshold: 0.3, rootMargin: '-70px 0px -40% 0px' });

  sections.forEach(s => observer.observe(s));
}

/* ============================================================
   16. LANGUAGE TOGGLE
   ============================================================ */
function applyLanguage(lang, animate = true) {
  currentLang = lang;
  localStorage.setItem('maudy_lang', lang);

  const t = TRANSLATIONS[lang];
  document.documentElement.lang = lang;

  // Update all i18n elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (!t[key]) return;
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = t[key];
    } else if (el.tagName === 'OPTION') {
      el.textContent = t[key];
    } else {
      el.innerHTML = t[key].replace(/\n/g, '<br>');
    }
  });

  // ---- Re-apply CMS overrides after language switch ----
  // (TRANSLATIONS already patched with CMS data, but some elements need re-patch)
  const cms = window._CMS_DATA;
  if (cms) {
    const setText = (sel, val) => {
      if (!val) return;
      document.querySelectorAll(sel).forEach(el => { el.textContent = val; });
    };
    const setHref = (sel, val) => {
      if (!val || val === '#') return;
      document.querySelectorAll(sel).forEach(el => { el.href = val; });
    };

    // Contact
    if (cms.contact) {
      const waNum = (cms.contact.whatsapp || '').replace(/[^0-9]/g, '') || '6281234567890';
      const waLink = `https://wa.me/${waNum}`;
      if (cms.contact.phone) setText('a[href^="tel:"]', cms.contact.phone);
      if (cms.contact.email) setText('a[href^="mailto:"]', cms.contact.email);
      document.querySelectorAll('a[href*="wa.me"]').forEach(el => { el.href = waLink; });
      if (cms.contact.address) {
        document.querySelectorAll('[data-i18n="ci1_val"]').forEach(el => { el.textContent = cms.contact.address; });
      }
      // Hours based on current lang
      const hours = lang === 'en' ? cms.contact.hours_en : cms.contact.hours_id;
      if (hours) {
        document.querySelectorAll('[data-i18n="ci4_val"]').forEach(el => {
          el.innerHTML = hours.replace(/\n/g, '<br>');
        });
      }
    }

    // Partners
    if (cms.partners && cms.partners.length > 0) {
      const track = document.querySelector('.marquee-track');
      if (track) {
        const partners = cms.partners.filter(p => p && (typeof p === 'string' ? p.trim() : p.name));
        const normalized = partners.map(p => typeof p === 'string' ? { name: p, logo: null } : p);
        const doubled = [...normalized, ...normalized];
        track.innerHTML = doubled.map(p => {
          if (p.logo) {
            return `<div class="partner-logo">
              <img class="partner-img" src="${p.logo}" alt="${p.name}" draggable="false" data-no-protect="true" loading="lazy" />
              <span>${p.name}</span>
            </div>`;
          }
          return `<div class="partner-logo">${p.name}</div>`;
        }).join('');
      }
    }

    // Social links
    if (cms.social) {
      if (cms.social.facebook  && cms.social.facebook  !== '#') setHref('[aria-label*="Facebook"]', cms.social.facebook);
      if (cms.social.instagram && cms.social.instagram !== '#') setHref('[aria-label*="Instagram"]', cms.social.instagram);
      if (cms.social.linkedin  && cms.social.linkedin  !== '#') setHref('[aria-label*="LinkedIn"]', cms.social.linkedin);
    }
  }

  // Update lang toggle button
  const btn = document.getElementById('lang-toggle');
  if (btn) {
    btn.querySelector('.lang-flag').textContent = lang === 'id' ? '🇮🇩' : '🇺🇸';
    btn.querySelector('.lang-code').textContent = lang === 'id' ? 'ID' : 'EN';
    btn.setAttribute('aria-label', lang === 'id' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia');
  }

  // Update page title
  document.title = 'MAUDY IT Solution — Transforming Business Through Innovative Technology';
}


document.getElementById('lang-toggle')?.addEventListener('click', () => {
  applyLanguage(currentLang === 'id' ? 'en' : 'id');
});

/* ============================================================
   17. THEME TOGGLE
   ============================================================ */
function applyTheme(theme, animate = true) {
  currentTheme = theme;
  localStorage.setItem('maudy_theme', theme);
  document.documentElement.setAttribute('data-theme', theme);

  const iconMoon = document.getElementById('icon-moon');
  const iconSun  = document.getElementById('icon-sun');

  if (iconMoon && iconSun) {
    if (theme === 'dark') {
      iconMoon.style.display = 'block';
      iconSun.style.display  = 'none';
    } else {
      iconMoon.style.display = 'none';
      iconSun.style.display  = 'block';
    }
  }

  // Update theme-color meta
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = theme === 'dark' ? '#0F172A' : '#F8FAFC';
}

document.getElementById('theme-toggle')?.addEventListener('click', () => {
  applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
});

/* ============================================================
   18. SYSTEM DARK MODE PREFERENCE
   Default: Always dark mode. If user explicitly saved a preference, use that.
   ============================================================ */
if (!localStorage.getItem('maudy_theme')) {
  applyTheme('dark', false);
}

/* ============================================================
   19. SMOOTH ANCHOR SCROLLING (offset for fixed navbar)
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = document.getElementById('navbar')?.offsetHeight || 70;
    window.scrollTo({ top: target.offsetTop - navH, behavior: 'smooth' });
  });
});
