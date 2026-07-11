/**
 * MAUDY IT Solution — Image Protection & Watermark System
 * - Render semua gambar ke Canvas (mencegah right-click save)
 * - Watermark dinamis (tiling/diagonal) dengan teks dari Admin Panel
 * - Block: right-click, drag, Ctrl+S/U/P, F12, print
 * - CATATAN: Screenshot OS-level tidak bisa diblokir sepenuhnya.
 *   Watermark adalah perlindungan terbaik untuk kasus tersebut.
 */

(function ProtectSystem() {
  'use strict';

  /* ============================================================
     1. BACA KONFIGURASI WATERMARK DARI LOCALSTORAGE
     ============================================================ */
  const WM_STORAGE_KEY = 'maudy_watermark_config';
  const DEFAULT_WM = {
    enabled:   true,
    text:      '© MAUDY IT Solution',
    opacity:   0.12,
    fontSize:  16,
    color:     '#ffffff',
    repeat:    true,
    angle:     -30,
    spacing:   160,
  };

  let wm = DEFAULT_WM;
  try {
    const saved = localStorage.getItem(WM_STORAGE_KEY);
    if (saved) wm = Object.assign({}, DEFAULT_WM, JSON.parse(saved));
  } catch (e) { /* pakai default */ }

  /* ============================================================
     2. CSS PROTECTION — Inject ke <head>
     ============================================================ */
  const css = document.createElement('style');
  css.id = 'maudy-protect-css';
  css.textContent = `
    /* Cegah seleksi teks dan drag gambar */
    img, canvas, picture, figure {
      -webkit-user-drag: none !important;
      user-drag: none !important;
      -webkit-user-select: none !important;
      user-select: none !important;
      pointer-events: none !important;
    }
    /* Re-enable pointer events untuk tombol/link */
    a img, button img { pointer-events: auto !important; }

    /* Sembunyikan saat print */
    @media print {
      body::before {
        content: 'Konten ini dilindungi hak cipta © MAUDY IT Solution';
        display: block;
        font-size: 2rem;
        text-align: center;
        padding: 4rem;
        color: #1e3a8a;
      }
      body > *:not(style) { display: none !important; }
    }

    /* Anti touch callout (iOS) */
    * { -webkit-touch-callout: none; }

    /* Overlay transparan di atas gambar untuk cegah drag */
    .protect-wrap {
      position: relative;
      display: inline-block;
      overflow: hidden;
    }
    .protect-wrap::after {
      content: '';
      position: absolute;
      inset: 0;
      z-index: 10;
      background: transparent;
      cursor: default;
    }
  `;
  document.head.appendChild(css);

  /* ============================================================
     3. BLOCK KEYBOARD SHORTCUTS
     ============================================================ */
  document.addEventListener('keydown', function (e) {
    const ctrl = e.ctrlKey || e.metaKey;

    // Ctrl+S (Save), Ctrl+U (View Source), Ctrl+P (Print)
    if (ctrl && ['s', 'u', 'p'].includes(e.key.toLowerCase())) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
    // Ctrl+Shift+I/J/C (DevTools), F12
    if ((ctrl && e.shiftKey && ['i', 'j', 'c'].includes(e.key.toLowerCase())) || e.key === 'F12') {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
    // PrintScreen — tampilkan overlay sesaat
    if (e.key === 'PrintScreen') {
      flashProtectOverlay();
      return false;
    }
  }, true);

  /* ============================================================
     4. BLOCK RIGHT-CLICK
     ============================================================ */
  document.addEventListener('contextmenu', function (e) {
    // Hanya block pada gambar
    if (e.target.closest('img, canvas, picture, .portfolio-img, .hero-bg-image')) {
      e.preventDefault();
      return false;
    }
  });

  /* ============================================================
     5. BLOCK DRAG GAMBAR
     ============================================================ */
  document.addEventListener('dragstart', function (e) {
    if (e.target.tagName === 'IMG' || e.target.tagName === 'CANVAS') {
      e.preventDefault();
    }
  });

  /* ============================================================
     6. FLASH OVERLAY (saat PrintScreen ditekan)
     ============================================================ */
  function flashProtectOverlay() {
    let overlay = document.getElementById('maudy-protect-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'maudy-protect-overlay';
      overlay.style.cssText = `
        position:fixed;inset:0;z-index:999999;
        background:rgba(15,23,42,0.97);
        display:flex;flex-direction:column;
        align-items:center;justify-content:center;
        color:#22D3EE;font-family:sans-serif;
        transition:opacity 0.3s;
      `;
      overlay.innerHTML = `
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#22D3EE" stroke-width="1.5" style="margin-bottom:1rem">
          <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
        </svg>
        <div style="font-size:1.5rem;font-weight:800;margin-bottom:.5rem">Konten Dilindungi</div>
        <div style="color:#94A3B8;font-size:.9rem">© MAUDY IT Solution — Semua hak cipta dilindungi</div>
      `;
      document.body.appendChild(overlay);
    }
    overlay.style.opacity = '1';
    overlay.style.display = 'flex';
    setTimeout(() => {
      overlay.style.opacity = '0';
      setTimeout(() => { overlay.style.display = 'none'; }, 300);
    }, 1500);
  }

  /* ============================================================
     7. WATERMARK — Render gambar ke Canvas
     ============================================================ */
  function drawWatermark(ctx, width, height) {
    if (!wm.enabled || !wm.text) return;

    ctx.save();
    ctx.globalAlpha = parseFloat(wm.opacity) || 0.12;
    ctx.fillStyle   = wm.color || '#ffffff';

    const fontSize = parseInt(wm.fontSize) || 16;
    ctx.font        = `bold ${fontSize}px Arial, sans-serif`;
    ctx.textBaseline = 'middle';

    const angleRad = ((parseFloat(wm.angle) || -30) * Math.PI) / 180;
    const spacing  = parseInt(wm.spacing) || 160;

    if (wm.repeat) {
      // Watermark tiling diagonal
      ctx.translate(width / 2, height / 2);
      ctx.rotate(angleRad);
      const diagonal = Math.ceil(Math.sqrt(width * width + height * height));
      for (let y = -diagonal; y < diagonal; y += spacing) {
        for (let x = -diagonal; x < diagonal * 2; x += spacing * 2.5) {
          ctx.fillText(wm.text, x, y);
        }
      }
    } else {
      // Watermark single di tengah
      ctx.translate(width / 2, height / 2);
      ctx.rotate(angleRad);
      const tw = ctx.measureText(wm.text).width;
      ctx.fillText(wm.text, -tw / 2, 0);
    }

    ctx.restore();
  }

  function convertImgToCanvas(img) {
    if (!img || img.dataset.wmDone === 'true') return;
    if (!img.complete || img.naturalWidth === 0) {
      img.addEventListener('load', () => convertImgToCanvas(img), { once: true });
      return;
    }

    try {
      const canvas = document.createElement('canvas');
      canvas.width  = img.naturalWidth;
      canvas.height = img.naturalHeight;

      // Salin style & class dari img
      canvas.className = img.className;
      canvas.style.cssText = window.getComputedStyle(img).cssText;
      canvas.style.maxWidth  = '100%';
      canvas.style.height    = 'auto';
      canvas.style.display   = img.style.display || 'block';
      canvas.setAttribute('aria-label', img.alt || 'Gambar dilindungi');
      canvas.setAttribute('role', 'img');

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      drawWatermark(ctx, canvas.width, canvas.height);

      img.dataset.wmDone = 'true';
      if (img.parentNode) img.parentNode.replaceChild(canvas, img);
    } catch (err) {
      // Cross-origin image: hanya tambahkan CSS protection
      img.style.pointerEvents = 'none';
      img.dataset.wmDone = 'true';
    }
  }

  /* ============================================================
     8. PROSES SEMUA GAMBAR DI HALAMAN
     ============================================================ */
  function processAllImages() {
    // Gambar yang tidak perlu dilindungi pakai: data-no-protect="true"
    document.querySelectorAll('img:not([data-no-protect])').forEach(img => {
      convertImgToCanvas(img);
    });
  }

  // Jalankan setelah DOM siap
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', processAllImages);
  } else {
    processAllImages();
  }

  // MutationObserver untuk gambar yang di-load secara dinamis
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType !== 1) return;
        if (node.tagName === 'IMG' && !node.dataset.noProtect) {
          convertImgToCanvas(node);
        }
        node.querySelectorAll && node.querySelectorAll('img:not([data-no-protect])').forEach(convertImgToCanvas);
      });
    });
  });

  document.addEventListener('DOMContentLoaded', () => {
    observer.observe(document.body, { childList: true, subtree: true });
  });

  /* ============================================================
     9. DETEKSI DEVTOOLS (Basic)
     ============================================================ */
  let devtoolsOpen = false;
  const threshold = 160;
  setInterval(() => {
    const widthDiff  = window.outerWidth  - window.innerWidth  > threshold;
    const heightDiff = window.outerHeight - window.innerHeight > threshold;
    if ((widthDiff || heightDiff) && !devtoolsOpen) {
      devtoolsOpen = true;
      // Sembunyikan gambar saat DevTools terbuka
      document.querySelectorAll('canvas[aria-label], img:not([data-no-protect])').forEach(el => {
        el.style.filter = 'blur(20px)';
      });
    } else if (!widthDiff && !heightDiff && devtoolsOpen) {
      devtoolsOpen = false;
      document.querySelectorAll('canvas[aria-label], img:not([data-no-protect])').forEach(el => {
        el.style.filter = '';
      });
    }
  }, 1000);

  // Export fungsi refresh (dipakai admin panel setelah update config)
  window.MaudyProtect = {
    refresh: processAllImages,
    setConfig: function(config) {
      wm = Object.assign({}, DEFAULT_WM, config);
      localStorage.setItem(WM_STORAGE_KEY, JSON.stringify(wm));
    }
  };

})();
