import { json, getUserKey, limited, limitMessage, maxText, synthesize, describeError, VOICE_SAMPLES, type Ctx } from './_shared';

export async function onRequestPost({ request, env }: Ctx) {
  const body: any = await request.json().catch(() => ({}));
  const { text, voice = 'Kore', style, pace, accent, stylePrompt } = body;
  const userKey = getUserKey(request, body);

  if (limited(request, env, userKey)) return json({ error: limitMessage(env) }, 429);
  if (!text || typeof text !== 'string') return json({ error: 'Teks wajib diisi.' }, 400);
  if (text.length > maxText(env)) return json({ error: `Teks terlalu panjang (maks ${maxText(env)} karakter).` }, 400);
  if (typeof voice !== 'string' || !VOICE_SAMPLES[voice]) return json({ error: 'Suara tidak dikenal.' }, 400);

  const apiKey = userKey || env.GEMINI_API_KEY?.trim();
  if (!apiKey) return json({ error: 'Server belum dikonfigurasi dengan Gemini API Key. Masukkan API Key Anda lewat tombol "Kunci API".' }, 503);

  const directive =
    [style, pace, accent, stylePrompt].filter((p) => typeof p === 'string' && p).join(' ') ||
    'Clear, natural conversational delivery';

  try {
    const { audioData, model } = await synthesize(env, apiKey, text, voice, directive);
    return json({ success: true, audioData, audioBase64: audioData, model, sampleRate: 24000, voice });
  } catch (err: any) {
    return json({ error: describeError(err) }, 502);
  }
}
