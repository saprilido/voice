import { json, getUserKey, limited, limitMessage, generateText, type Ctx } from './_shared';

export async function onRequestPost({ request, env }: Ctx) {
  const body: any = await request.json().catch(() => ({}));
  const { topic } = body;
  const userKey = getUserKey(request, body);

  if (limited(request, env, userKey)) return json({ error: limitMessage(env) }, 429);
  if (!topic || typeof topic !== 'string') return json({ error: 'Topik wajib diisi.' }, 400);
  if (topic.length > 300) return json({ error: 'Topik terlalu panjang (maks 300 karakter).' }, 400);

  const fallback = `${topic}.\nA quiet thought drifting on the evening wind,\nbefore yesterday returns to memory.`;
  const apiKey = userKey || env.GEMINI_API_KEY?.trim();
  if (!apiKey) return json({ text: fallback });

  try {
    const text = await generateText(
      env,
      apiKey,
      `Write a reflective, evocative vignette or poem in exactly 3 short lines based on this feeling, reunion, or memory: "${topic}". Return ONLY the 3 lines separated by newline breaks, without numbers, bullet points, or quotes.`
    );
    return json({ text: text || fallback });
  } catch {
    return json({ text: fallback });
  }
}
