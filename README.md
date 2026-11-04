# Voice Generator — Google Gemini TTS

Aplikasi Voice Over generator berbasis Google Gemini 2.5 Flash TTS dengan 30 persona suara resmi dan output audio berkualitas studio 24kHz.

Made by [apink.web.id](https://apink.web.id).

---

## 🚀 Fitur Utama

- **30 Persona Suara Resmi**: Aoede, Kore, Puck, Charon, Fenrir, Leda, Orus, Zephyr, dan lainnya.
- **Preview Sample Suara**: Dengarkan audio sample untuk setiap persona sebelum membuat audio panjang.
- **Pengaturan Gaya Wicara (Speech Style)**: Santai, Ramah, Antusias, Formal, Berbisik, dsb.
- **Audio Player Interaktif**: Seekbar, Play/Pause, Replay, Loop, Multi-speed (0.8x, 1x, 1.2x), Volume control.
- **Format Nama File Download Kustom**: Default `<Nama Profil>_<Speech Style>_<ddmmyyyy>.wav` (misal: `Aoede_Ramah_03112026.wav`), dapat diedit langsung sebelum download.
- **Bisa Dijalankan Tanpa Setup Server**: Tersedia versi `standalone-github.html` yang bisa langsung dijalankan di browser atau di-hosting di GitHub Pages gratis tanpa backend.

---

## 📁 Struktur File Penting

- `standalone-github.html` (di folder `public/`): Versi single-file HTML siap pakai untuk **GitHub Pages**. Cukup rename jadi `index.html` di repo GitHub Anda!
- `src/`: Kode sumber React + TypeScript + Tailwind CSS.
- `server.ts`: Server Express opsional jika ingin proxy backend.

---

## 🛠️ Cara Menjalankan Secara Lokal (Node.js)

1. Pastikan Anda sudah menginstall Node.js (v18+).
2. Install dependency:
   ```bash
   npm install
   ```
3. Buat file `.env.local` atau `.env` dan masukkan API Key Gemini Anda:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```
4. Jalankan server dev:
   ```bash
   npm run dev
   ```
5. Buka di browser pada `http://localhost:3000`.

---

## 🌐 Cara Upload ke GitHub Pages (Paling Cepat & Gratis)

1. Buka [GitHub](https://github.com/) dan buat repository baru (misal: `voice-generator`).
2. Upload file `standalone-github.html` dari folder `public/`, lalu rename file tersebut menjadi **`index.html`**.
3. Di repository GitHub Anda:
   - Masuk ke tab **Settings** > **Pages**.
   - Pada bagian **Build and deployment**, pilih Source: **Deploy from a branch**.
   - Pilih Branch: **main** dan folder **/(root)**, lalu klik **Save**.
4. Dalam 1-2 menit, situs Anda akan aktif di `https://username.github.io/voice-generator/`!
5. Buka situs tersebut, masukkan API Key Gemini Anda sekali, dan aplikasi langsung siap menghasilkan voice over!
