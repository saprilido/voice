# Voice — Google Gemini TTS Studio

Generator voice over berbasis Google Gemini TTS: 30 suara, kontrol gaya/tempo/aksen, pratinjau suara, suara latar, dan ekspor audio WAV.

Dibuat oleh [apink.web.id](https://apink.web.id).

## Cara kerja API key

- **Key pengunjung (opsional):** pengunjung bisa memasukkan key sendiri lewat tombol **Kunci API**. Tidak dibatasi dan tidak memakai kuota Anda.

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
