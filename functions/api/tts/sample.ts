import { json, getUserKey, limited, limitMessage, synthesize, errorResponse, VOICE_SAMPLES, type Ctx } from '../_shared';

export async function onRequestGet({ request, env }: Ctx) {
  const url = new URL(request.url);
  const voice = url.searchParams.get('voice') || 'Kore';
  const info = VOICE_SAMPLES[voice];
  const userKey = getUserKey(request);

  if (limited(request, env, userKey)) return json({ error: limitMessage(env) }, 429);
  if (!info) return json({ error: 'Suara tidak dikenal.' }, 400);

  const apiKey = userKey || env.GEMINI_API_KEY?.trim();
  if (!apiKey) return json({ error: 'Server belum dikonfigurasi dengan Gemini API Key.' }, 503);

  try {
    const { audioData, model } = await synthesize(env, apiKey, info.phrase, voice, 'Clear, natural, expressive voice presentation');
    return json({ success: true, audioData, audioBase64: audioData, model, sampleRate: 24000, voice });
  } catch (err: any) {
    return errorResponse(err);
  }
}
