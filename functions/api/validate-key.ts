import { json, getUserKey, pingKey, type Ctx } from './_shared';

// Hanya memvalidasi key milik pengguna — tidak pernah memakai key server.
export async function onRequestPost({ request, env }: Ctx) {
  const body: any = await request.json().catch(() => ({}));
  const key = getUserKey(request, body);
  if (!key) return json({ valid: false, error: 'Tidak ada API Key yang diberikan.' }, 400);
  try {
    await pingKey(env, key);
    return json({ valid: true, message: 'Google Gemini API Key valid dan siap digunakan!' });
  } catch {
    return json({ valid: false, error: 'API Key tidak valid atau kuota tidak mencukupi.' }, 400);
  }
}
