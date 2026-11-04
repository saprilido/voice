# Voice Generator — Google Gemini TTS Studio

Aplikasi Voice Over generator berbasis Google Gemini 3.1 Flash TTS dengan 30 persona suara resmi dan output audio berkualitas studio.

Dibuat oleh [apink.web.id](https://apink.web.id) | 2026.

---

## 📦 Opsi Download & Deploy ke Domain Sendiri

### Opsi A: Push Langsung ke GitHub dari AI Studio (Paling Mudah)
1. Perhatikan bilah navigasi atas di Google AI Studio (di samping tombol *Publish* & *Versions*).
2. Klik tombol **GitHub**.
3. Otorisasikan akun GitHub Anda, pilih organisasi/akun, dan klik **Export to GitHub**.
4. Seluruh repository kode sumber akan langsung ter-upload rapi ke repository GitHub Anda.

---

### Opsi B: Download File ZIP Project
File arsip siap pakai sudah dibuat di dalam folder `public/`:
- **`ymd-voice-generator-repo.zip`** (berisi seluruh kode sumber `src/`, file server `server.ts`, konfigurasi, dan folder `dist/` yang sudah di-build).

---

## 🌐 Cara Pasang di Domain Sendiri (misal: `voice.apink.web.id`)

### 1. Menggunakan Vercel / Netlify / Cloudflare Pages (Gratis & Cepat)
1. Hubungkan repository GitHub Anda ke **Vercel** (atau Netlify).
2. Pengaturan otomatis terdeteksi:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Tambahkan Environment Variable di Vercel:
   - `GEMINI_API_KEY`: *(API Key Gemini Anda dari aistudio.google.com/apikey)*
4. Klik **Deploy**.
5. Masuk ke **Settings > Domains**, tambahkan subdomain Anda (misalnya `voice.apink.web.id`).

---

### 2. Menggunakan Hosting cPanel / Web Server Biasa
Jika domain Anda memakai cPanel (Apache / Nginx):
1. Ekstrak isi folder **`dist/`** yang ada di dalam ZIP.
2. Upload seluruh file di dalam `dist/` (`index.html`, folder `assets/`, dll.) ke folder `public_html` atau folder subdomain Anda.
3. Aplikasi akan langsung berjalan. Pengguna dapat memasukkan Gemini API Key mereka sendiri melalui tombol **Kunci API** di header aplikasi.

---

### 3. Menjalankan di VPS / Server Node.js
```bash
npm install
npm run build
npm start
```
Server akan aktif di port `3000` (atau port dari environment `PORT`).

---

## 🛠️ Pengembangan Lokal (Local Dev)
1. Install dependencies:
   ```bash
   npm install
   ```
2. Buat file `.env` berisi:
   ```env
   GEMINI_API_KEY=AIzaSy...
   PORT=3000
   ```
3. Jalankan server dev:
   ```bash
   npm run dev
   ```
4. Buka di browser pada `http://localhost:3000`.

