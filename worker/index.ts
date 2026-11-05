import { json, type Env, type Ctx } from '../functions/api/_shared';
import { onRequestGet as health } from '../functions/api/health';
import { onRequestPost as validateKey } from '../functions/api/validate-key';
import { onRequestPost as tts } from '../functions/api/tts';
import { onRequestGet as ttsSample } from '../functions/api/tts/sample';
import { onRequestPost as generateMoment } from '../functions/api/generate-moment';

interface WorkerEnv extends Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
}

type Handler = (ctx: Ctx) => Response | Promise<Response>;

const routes: Record<string, Handler> = {
  'GET /api/health': health,
  'POST /api/validate-key': validateKey,
  'POST /api/tts': tts,
  'GET /api/tts/sample': ttsSample,
  'POST /api/generate-moment': generateMoment
};

export default {
  async fetch(request: Request, env: WorkerEnv): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/')) {
      const handler = routes[`${request.method} ${url.pathname.replace(/\/$/, '')}`];
      if (!handler) return json({ error: 'Tidak ditemukan.' }, 404);
      try {
        return await handler({ request, env });
      } catch {
        return json({ error: 'Terjadi kesalahan pada server.' }, 500);
      }
    }
    return env.ASSETS.fetch(request);
  }
};
