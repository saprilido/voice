import { json, type Ctx } from './_shared';

export const onRequestGet = ({ env }: Ctx) =>
  json({ status: 'ok', time: new Date().toISOString(), serverKeyConfigured: !!env.GEMINI_API_KEY?.trim() });
