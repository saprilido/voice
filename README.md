# Voice — Google Gemini TTS Studio

Generator voice over berbasis Google Gemini TTS: 30 suara, kontrol gaya/tempo/aksen, pratinjau suara, suara latar, dan ekspor audio WAV.

Dibuat oleh [apink.web.id](https://apink.web.id).

## Pasang di Cloudflare Pages (dari GitHub)

1. Di Cloudflare: **Workers & Pages → Create → Pages → Connect to Git**, pilih repo ini.
2. Isi pengaturan build:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
3. Buka **Settings → Variables and Secrets → Add**:
   - Name: `GEMINI_API_KEY`
   - Value: key Gemini Anda (pilih **Encrypt / Secret**)
   - Tambahkan untuk **Production** (dan **Preview** bila perlu), lalu **deploy ulang**.
4. Di **Custom domains**, tambahkan subdomain Anda.

Key Anda hanya tersimpan di Cloudflare, tidak pernah masuk ke GitHub maupun ke browser pengunjung.

## Cara kerja API key

- **Key Anda (server):** dipakai otomatis. Dibatasi 20 permintaan per 10 menit per pengunjung dan 3000 karakter per teks agar kuota tidak habis disalahgunakan.
- **Key pengunjung (opsional):** pengunjung bisa memasukkan key sendiri lewat tombol **Kunci API**. Tidak dibatasi dan tidak memakai kuota Anda.

Untuk perlindungan lebih kuat, aktifkan **Security → WAF → Rate limiting rules** di Cloudflare untuk path `/api/*`.

## Pengaturan tambahan (opsional, di Variables and Secrets)

| Nama | Default | Fungsi |
|---|---|---|
| `MAX_TEXT_LENGTH` | `3000` | Batas karakter per permintaan |
| `RATE_LIMIT_MAX` | `20` | Maks permintaan per pengunjung |
| `RATE_LIMIT_WINDOW_MIN` | `10` | Jendela waktu (menit) |
| `GEMINI_TTS_MODELS` | `gemini-3.1-flash-tts-preview,...` | Daftar model TTS, dicoba berurutan |
| `GEMINI_TEXT_MODEL` | `gemini-2.5-flash` | Model untuk generator "Moment" |

## Struktur

```
src/         Tampilan aplikasi (React + Vite + Tailwind)
functions/   Backend ringan Cloudflare: /api/tts, /api/tts/sample, /api/generate-moment, /api/validate-key
```

## Lisensi

Berkas sumber dari AI Studio memuat header `Apache-2.0`. Tambahkan berkas `LICENSE` sesuai pilihan Anda sebelum repo dibuat publik.
