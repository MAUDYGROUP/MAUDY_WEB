# Website IT Solution Company — Rencana Implementasi

## Gambaran Umum

Membuat website profesional untuk perusahaan **IT Solution** yang mencakup berbagai layanan teknologi, dengan tampilan modern, futuristik, dan elegan. Website akan menggunakan HTML + CSS + Vanilla JS (single-page atau multi-section), tanpa framework berat agar cepat dan ringan.

---

## Spesifikasi Teknis

| Aspek | Detail |
|---|---|
| Stack | HTML5, Vanilla CSS, Vanilla JS |
| Tema Warna | Opsi 3: Dark Technology (`#0F172A` bg, `#2563EB` primary, `#22D3EE` accent) |
| Font | Inter + Poppins (Google Fonts) |
| Bahasa | 🇮🇩 Indonesia + 🇺🇸 English (toggle) |
| Mode | Dark & Light Mode (toggle) |
| Layout | Single-page dengan smooth scroll, responsive |

---

## Struktur Halaman

### 1. Navbar
- Logo perusahaan (SVG icon + teks)
- Menu navigasi: Home, Services, About, Portfolio, Clients, Testimonial, Contact
- Toggle bahasa (ID/EN)
- Toggle Dark/Light Mode
- CTA Button: "Hubungi Kami"

### 2. Hero Section
- Headline animasi: *"Transforming Business Through Innovative Technology"*
- Sub-headline deskripsi perusahaan
- Dua tombol CTA: [Lihat Layanan] [Konsultasi Gratis]
- Background: Efek grid digital + partikel bergerak (canvas)
- Animasi floating elements

### 3. Stats / Angka Pencapaian
- 10+ Tahun Pengalaman
- 100+ Proyek Selesai
- 50+ Klien Puas
- 24/7 Support
- Counter animasi saat terlihat di viewport

### 4. Services Section
- Grid layanan (6 kolom responsif)
- 38+ layanan dikelompokkan ke kategori:
  - 🖥️ Hardware & Repair
  - 🌐 Networking & Infrastructure
  - 💻 Software & Web Development
  - ☁️ Cloud & Server
  - 🔒 Security Systems
  - 📡 Monitoring & Support
- Setiap card dengan ikon, judul, deskripsi singkat
- Hover effect dengan glow animasi

### 5. Why Choose Us
- 4 poin unggulan dengan ikon besar
- Tim bersertifikat, pengalaman, support, proyek

### 6. Portfolio / Projects
- Grid card portofolio
- Filter kategori (All, Web, Networking, Security, etc.)
- Card dengan gambar, judul, kategori, hover overlay

### 7. Industries We Serve
- Icon grid industri: Manufacturing, Healthcare, Education, Finance, Government, Retail

### 8. Testimonials
- Carousel testimonial klien
- Avatar, nama, jabatan, rating bintang, kutipan

### 9. Partners / Logo Rekanan
- Marquee/carousel logo partner yang bergerak otomatis

### 10. Contact Section
- Form kontak: Nama, Email, Telepon, Layanan yang dibutuhkan, Pesan
- Info kontak: Alamat, Telepon, Email, WhatsApp
- Embed Google Maps placeholder

### 11. Footer
- Logo + deskripsi singkat
- Link navigasi
- Social media icons
- Copyright

---

## Fitur Khusus

- ✅ **Bilingual (ID/EN)**: Toggle bahasa dengan transisi smooth
- ✅ **Dark/Light Mode**: Persisten di localStorage
- ✅ **Smooth Scroll & Animasi**: Intersection Observer untuk fade-in effect
- ✅ **Particle Background**: Canvas partikel di hero section
- ✅ **Counter Animasi**: Stats angka count-up saat scroll
- ✅ **Glassmorphism**: Card effect modern
- ✅ **Responsive**: Mobile-first design

---

## File yang Akan Dibuat

- `index.html` — Struktur utama website
- `style.css` — Semua styling (CSS variables, dark/light mode, animasi)
- `script.js` — Logic interaktivitas (language toggle, dark mode, particles, counters, dll)
- `assets/` — Ikon dan gambar yang di-generate

---

## Palet Warna

### Dark Mode (Default)
```
--bg-primary: #0F172A
--bg-secondary: #1E293B
--color-primary: #2563EB
--color-accent: #22D3EE
--text-primary: #F8FAFC
--text-secondary: #94A3B8
```

### Light Mode
```
--bg-primary: #F8FAFC
--bg-secondary: #FFFFFF
--color-primary: #1E3A8A
--color-accent: #06B6D4
--text-primary: #0F172A
--text-secondary: #475569
```
