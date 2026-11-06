// Kode bersama untuk semua endpoint /api/* (Cloudflare Pages Functions)

export interface Env {
  GEMINI_API_KEY?: string;
  MAX_TEXT_LENGTH?: string;
  RATE_LIMIT_MAX?: string;
  RATE_LIMIT_WINDOW_MIN?: string;
  GEMINI_TTS_MODELS?: string;
  GEMINI_TEXT_MODEL?: string;
}

export type Ctx = { request: Request; env: Env };

export const VOICE_SAMPLES: Record<string, { phrase: string }> = {
  Achernar: { phrase: 'Hello, I am Achernar. Soft and gentle with a light, melodic touch.' },
  Achird: { phrase: 'Hi there, I am Achird. A friendly voice with warm, grounded conversation.' },
  Algenib: { phrase: 'Greetings, I am Algenib. Deep, textured, and carrying distinctive gravelly character.' },
  Algieba: { phrase: 'Good day. I am Algieba, offering a smooth, polished narrative tone.' },
  Alnilam: { phrase: 'I am Alnilam. Resolute, grounded, and clear in every sentence.' },
  Aoede: { phrase: 'Welcome. I am Aoede, weaving words with breezy poetry and warmth.' },
  Autonoe: { phrase: 'Hello! I am Autonoe, full of color, enthusiasm, and crisp clarity.' },
  Callirrhoe: { phrase: 'Hey! I am Callirrhoe, here to keep things easy, pleasant, and natural.' },
  Charon: { phrase: 'Greetings. I am Charon. Delivering thoughtful calm and grounded resonance.' },
  Despina: { phrase: 'Hello. I am Despina, gently sharing thoughts with heartfelt care.' },
  Enceladus: { phrase: 'Quietly now. I am Enceladus, speaking with soft, close intimacy.' },
  Erinome: { phrase: 'Hello, I am Erinome. Balanced, lucid, and articulated with crisp elegance.' },
  Fenrir: { phrase: 'Hello! I am Fenrir, passionate and ready to spark your imagination.' },
  Gacrux: { phrase: 'Greetings, I am Gacrux. Experienced, steady, and comfortably composed.' },
  Iapetus: { phrase: 'Greetings. I am Iapetus, articulating ideas with balanced precision.' },
  Kore: { phrase: 'Hello, I am Kore. A warm, contemplative voice with steady grace.' },
  Laomedeia: { phrase: 'Hi! I am Laomedeia, lively and sparkling with radiant enthusiasm.' },
  Leda: { phrase: 'Hi! I am Leda, bringing a gentle, bright, and sincere touch.' },
  Orus: { phrase: 'I am Orus. Strong, steady, and clear in every sentence.' },
  Puck: { phrase: 'Hey there, I am Puck! Ready to bring energy, charm, and lively stories.' },
  Pulcherrima: { phrase: 'Welcome, I am Pulcherrima. Direct, engaging, and confidently forward.' },
  Rasalgethi: { phrase: 'Greetings, I am Rasalgethi. Analytical, clear, and structured for understanding.' },
  Sadachbia: { phrase: 'Hey! I am Sadachbia. Deep yet full of lively pulse and groove.' },
  Sadaltager: { phrase: 'Good day, I am Sadaltager. Thoughtful, erudite, and naturally reassuring.' },
  Schedar: { phrase: 'Hello, I am Schedar. Delivering an even, steadfast, and measured tone.' },
  Sulafat: { phrase: 'Welcome, I am Sulafat. Radiating cozy warmth and soothing comfort.' },
  Umbriel: { phrase: 'Hello there. I am Umbriel, calm and mellow like a quiet evening.' },
  Vindemiatrix: { phrase: 'Hello, I am Vindemiatrix. Tender, calm, and soothing like a gentle breeze.' },
  Zephyr: { phrase: 'Hello, I am Zephyr. A bright, airy voice with reflective stillness.' },
  Zubenelgenubi: { phrase: 'Hey there, I am Zubenelgenubi. Casual, laid-back, and totally relaxed.' }
};

const API = 'https://generativelanguage.googleapis.com/v1beta/models';

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
  });
}

export function getUserKey(request: Request, body?: any): string | undefined {
  const h = request.headers.get('x-gemini-api-key')?.trim();
  if (h) return h;
  const b = body?.apiKey;
  if (typeof b === 'string' && b.trim()) return b.trim();
  return undefined;
}

export function ttsModels(env: Env): string[] {
  return (env.GEMINI_TTS_MODELS || 'gemini-3.1-flash-tts-preview,gemini-3.8-flash-lite-tts,gemini-3.8-flash-tts')
    .split(',').map((m) => m.trim()).filter(Boolean);
}

export const textModel = (env: Env) => env.GEMINI_TEXT_MODEL || 'gemini-2.5-flash';

async function callGemini(apiKey: string, model: string, payload: unknown): Promise<any> {
  const res = await fetch(`${API}/${model}:generateContent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
    body: JSON.stringify(payload)
  });
  const data: any = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.error?.message || `HTTP ${res.status}`);
  }
  return data;
}

export async function synthesize(env: Env, apiKey: string, text: string, voice: string, style: string) {
  let lastError: unknown;
  let quotaError: unknown;
  for (const model of ttsModels(env)) {
    try {
      const data = await callGemini(apiKey, model, {
        contents: [{ role: 'user', parts: [{ text, speechMetadata: { style } }] }],
        generationConfig: {
          responseModalities: ['AUDIO'],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } }
        }
      });
      const audio = data?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (audio) return { audioData: audio as string, model };
    } catch (err: any) {
      lastError = err;
      if (/quota|RESOURCE_EXHAUSTED|rate.?limit|\b429\b/i.test(err?.message || '')) quotaError = err;
    }
  }
  // Jika salah satu model kena batas kuota, laporkan itu (jangan tertimpa error model lain).
  const finalError = quotaError || lastError;
  throw finalError instanceof Error ? finalError : new Error('Semua model TTS gagal.');
}

export async function generateText(env: Env, apiKey: string, prompt: string): Promise<string | undefined> {
  const data = await callGemini(apiKey, textModel(env), {
    contents: [{ role: 'user', parts: [{ text: prompt }] }]
  });
  return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
}

export async function pingKey(env: Env, apiKey: string) {
  await callGemini(apiKey, textModel(env), { contents: [{ role: 'user', parts: [{ text: 'Ping' }] }] });
}

// Mengubah error dari Gemini menjadi respons JSON yang jelas.
// Catatan: sengaja tidak memakai status 502/504 karena Cloudflare mengganti isinya dengan halaman HTML.
export function errorResponse(err: any): Response {
  const msg: string = err?.message || '';
  if (/quota|RESOURCE_EXHAUSTED|rate.?limit|\b429\b/i.test(msg)) {
    return json({ error: 'Kuota Gemini API habis. Coba lagi nanti atau gunakan API Key sendiri.', code: 'QUOTA_EXHAUSTED' }, 429);
  }
  if (/API key|API_KEY_INVALID|PERMISSION_DENIED|\b40[13]\b/i.test(msg)) {
    return json({ error: 'Gemini API Key tidak valid atau tidak punya akses ke model TTS.', code: 'INVALID_KEY' }, 401);
  }
  return json({ error: 'Gagal membuat suara. Silakan coba lagi.', code: 'UPSTREAM_ERROR' }, 424);
}

// Pembatas laju sederhana (best-effort, per instance server) — hanya untuk key milik pemilik.
// Perlindungan yang lebih kuat: aktifkan Rate Limiting Rules di dashboard Cloudflare.
const hits = new Map<string, number[]>();
export function limited(request: Request, env: Env, userKey: string | undefined): boolean {
  if (userKey) return false;
  const max = parseInt(env.RATE_LIMIT_MAX || '20');
  const windowMs = parseInt(env.RATE_LIMIT_WINDOW_MIN || '10') * 60_000;
  const ip = request.headers.get('cf-connecting-ip') || 'unknown';
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < windowMs);
  if (recent.length >= max) { hits.set(ip, recent); return true; }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return false;
}

export const limitMessage = (env: Env) =>
  `Batas pemakaian gratis tercapai (${env.RATE_LIMIT_MAX || '20'} permintaan / ${env.RATE_LIMIT_WINDOW_MIN || '10'} menit). Coba lagi nanti, atau masukkan Gemini API Key Anda sendiri lewat tombol "Kunci API".`;

export const maxText = (env: Env) => parseInt(env.MAX_TEXT_LENGTH || '3000');
