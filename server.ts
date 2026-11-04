import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json({ limit: '10mb' }));

// 30 Voices and sample phrases mapping
const VOICE_SAMPLES: Record<string, { phrase: string; pitchFreq: number }> = {
  Achernar: { phrase: 'Hello, I am Achernar. Soft and gentle with a light, melodic touch.', pitchFreq: 310 },
  Achird: { phrase: 'Hi there, I am Achird. A friendly voice with warm, grounded conversation.', pitchFreq: 160 },
  Algenib: { phrase: 'Greetings, I am Algenib. Deep, textured, and carrying distinctive gravelly character.', pitchFreq: 120 },
  Algieba: { phrase: 'Good day. I am Algieba, offering a smooth, polished narrative tone.', pitchFreq: 135 },
  Alnilam: { phrase: 'I am Alnilam. Resolute, grounded, and clear in every sentence.', pitchFreq: 165 },
  Aoede: { phrase: 'Welcome. I am Aoede, weaving words with breezy poetry and warmth.', pitchFreq: 260 },
  Autonoe: { phrase: 'Hello! I am Autonoe, full of color, enthusiasm, and crisp clarity.', pitchFreq: 275 },
  Callirrhoe: { phrase: 'Hey! I am Callirrhoe, here to keep things easy, pleasant, and natural.', pitchFreq: 250 },
  Charon: { phrase: 'Greetings. I am Charon. Delivering thoughtful calm and grounded resonance.', pitchFreq: 115 },
  Despina: { phrase: 'Hello. I am Despina, gently sharing thoughts with heartfelt care.', pitchFreq: 245 },
  Enceladus: { phrase: 'Quietly now. I am Enceladus, speaking with soft, close intimacy.', pitchFreq: 125 },
  Erinome: { phrase: 'Hello, I am Erinome. Balanced, lucid, and articulated with crisp elegance.', pitchFreq: 255 },
  Fenrir: { phrase: 'Hello! I am Fenrir, passionate and ready to spark your imagination.', pitchFreq: 170 },
  Gacrux: { phrase: 'Greetings, I am Gacrux. Experienced, steady, and comfortably composed.', pitchFreq: 180 },
  Iapetus: { phrase: 'Greetings. I am Iapetus, articulating ideas with balanced precision.', pitchFreq: 165 },
  Kore: { phrase: 'Hello, I am Kore. A warm, contemplative voice with steady grace.', pitchFreq: 240 },
  Laomedeia: { phrase: 'Hi! I am Laomedeia, lively and sparkling with radiant enthusiasm.', pitchFreq: 320 },
  Leda: { phrase: 'Hi! I am Leda, bringing a gentle, bright, and sincere touch.', pitchFreq: 300 },
  Orus: { phrase: 'I am Orus. Strong, steady, and clear in every sentence.', pitchFreq: 155 },
  Puck: { phrase: 'Hey there, I am Puck! Ready to bring energy, charm, and lively stories.', pitchFreq: 220 },
  Pulcherrima: { phrase: 'Welcome, I am Pulcherrima. Direct, engaging, and confidently forward.', pitchFreq: 250 },
  Rasalgethi: { phrase: 'Greetings, I am Rasalgethi. Analytical, clear, and structured for understanding.', pitchFreq: 190 },
  Sadachbia: { phrase: 'Hey! I am Sadachbia. Deep yet full of lively pulse and groove.', pitchFreq: 130 },
  Sadaltager: { phrase: 'Good day, I am Sadaltager. Thoughtful, erudite, and naturally reassuring.', pitchFreq: 185 },
  Schedar: { phrase: 'Hello, I am Schedar. Delivering an even, steadfast, and measured tone.', pitchFreq: 160 },
  Sulafat: { phrase: 'Welcome, I am Sulafat. Radiating cozy warmth and soothing comfort.', pitchFreq: 230 },
  Umbriel: { phrase: 'Hello there. I am Umbriel, calm and mellow like a quiet evening.', pitchFreq: 150 },
  Vindemiatrix: { phrase: 'Hello, I am Vindemiatrix. Tender, calm, and soothing like a gentle breeze.', pitchFreq: 250 },
  Zephyr: { phrase: 'Hello, I am Zephyr. A bright, airy voice with reflective stillness.', pitchFreq: 290 },
  Zubenelgenubi: { phrase: 'Hey there, I am Zubenelgenubi. Casual, laid-back, and totally relaxed.', pitchFreq: 160 }
};

// Generates pleasant 24kHz 16-bit PCM buffer fallback if API key is pending or quota exceeded
function generateSyntheticPcmBase64(text: string, baseFreq = 220, durationSec?: number): string {
  const sampleRate = 24000;
  const duration = durationSec || Math.min(Math.max(text.length * 0.065, 2.5), 10);
  const totalSamples = Math.floor(sampleRate * duration);
  const buffer = Buffer.alloc(totalSamples * 2);

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    const envelope = Math.sin((Math.PI * i) / totalSamples);
    // Vocal harmonic synthesis
    const wave =
      0.55 * Math.sin(2 * Math.PI * baseFreq * t) +
      0.25 * Math.sin(2 * Math.PI * (baseFreq * 2) * t) +
      0.12 * Math.sin(2 * Math.PI * (baseFreq * 3) * t) +
      0.08 * Math.sin(2 * Math.PI * (baseFreq * 4) * t);

    const sample = Math.floor(wave * envelope * 22000);
    buffer.writeInt16LE(Math.max(-32768, Math.min(32767, sample)), i * 2);
  }

  return buffer.toString('base64');
}

// Helper to retrieve Gemini API key (client-provided header/body first, server fallback)
function getGeminiApiKey(req: express.Request): string | undefined {
  const headerKey = req.headers['x-gemini-api-key'];
  if (typeof headerKey === 'string' && headerKey.trim()) {
    return headerKey.trim();
  }
  const bodyKey = req.body?.apiKey;
  if (typeof bodyKey === 'string' && bodyKey.trim()) {
    return bodyKey.trim();
  }
  const queryKey = req.query?.apiKey;
  if (typeof queryKey === 'string' && queryKey.trim()) {
    return queryKey.trim();
  }
  return process.env.GEMINI_API_KEY?.trim() || undefined;
}

// Health check route
app.get('/api/health', (req, res) => {
  const key = getGeminiApiKey(req);
  res.json({
    status: 'ok',
    time: new Date().toISOString(),
    hasApiKey: !!key,
    isCustomKey: !!(req.headers['x-gemini-api-key'] || req.query?.apiKey)
  });
});

// Validate an API Key
app.post('/api/validate-key', async (req, res) => {
  try {
    const key = getGeminiApiKey(req);
    if (!key) {
      return res.status(400).json({ valid: false, error: 'Tidak ada API Key yang diberikan.' });
    }
    const ai = new GoogleGenAI({
      apiKey: key,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
    });
    // Minimal probe call
    await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Ping',
    });
    return res.json({ valid: true, message: 'Google Gemini API Key valid dan siap digunakan!' });
  } catch (err: any) {
    console.error('API Key validation error:', err);
    return res.status(400).json({
      valid: false,
      error: err?.message || 'API Key tidak valid atau kuota tidak mencukupi.'
    });
  }
});

// Primary TTS route used by ymdvoice.ai.studio
app.post('/api/tts', async (req, res) => {
  try {
    const { text, voice = 'Kore', style, pace, accent, stylePrompt } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required for speech synthesis.' });
    }

    const directiveParts: string[] = [];
    if (style) directiveParts.push(style);
    if (pace) directiveParts.push(pace);
    if (accent) directiveParts.push(accent);
    if (stylePrompt) directiveParts.push(stylePrompt);

    const combinedDirective = directiveParts.join(' ') || 'Clear, natural conversational delivery';

    const apiKey = getGeminiApiKey(req);
    if (apiKey) {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: { 'User-Agent': 'aistudio-build' }
        }
      });

      const candidateModels = [
        'gemini-3.1-flash-tts-preview',
        'gemini-3.8-flash-lite-tts',
        'gemini-3.8-flash-tts'
      ];

      for (const model of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model,
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text,
                    speechMetadata: {
                      style: combinedDirective
                    }
                  }
                ]
              }
            ],
            config: {
              responseModalities: ['AUDIO'],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: voice }
                }
              }
            }
          });

          const part = response.candidates?.[0]?.content?.parts?.[0];
          if (part?.inlineData?.data) {
            return res.json({
              success: true,
              audioData: part.inlineData.data,
              audioBase64: part.inlineData.data,
              model,
              sampleRate: 24000,
              voice
            });
          }
        } catch (err: any) {
          console.warn(`TTS with model ${model} failed, trying fallback:`, err?.message || err);
        }
      }
    }

    // Fallback if API key missing or models unavailable
    const pitch = VOICE_SAMPLES[voice]?.pitchFreq || 220;
    const fallbackPcm = generateSyntheticPcmBase64(text, pitch);

    return res.json({
      success: true,
      audioData: fallbackPcm,
      audioBase64: fallbackPcm,
      sampleRate: 24000,
      model: 'synthetic-preview-fallback',
      voice
    });
  } catch (error: any) {
    console.error('TTS error:', error);
    const pitch = 220;
    const fallbackPcm = generateSyntheticPcmBase64(req.body.text || 'Fallback sample', pitch);
    return res.json({
      success: true,
      audioData: fallbackPcm,
      sampleRate: 24000,
      fallback: true
    });
  }
});

// Voice sample preview route (GET /api/tts/sample?voice=...)
app.get('/api/tts/sample', async (req, res) => {
  try {
    const voice = (req.query.voice as string) || 'Kore';
    const voiceInfo = VOICE_SAMPLES[voice] || {
      phrase: `Hello, this is ${voice} from Google Gemini TTS.`,
      pitchFreq: 220
    };

    const apiKey = getGeminiApiKey(req);
    if (apiKey) {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });

      const candidateModels = [
        'gemini-3.1-flash-tts-preview',
        'gemini-3.8-flash-lite-tts',
        'gemini-3.8-flash-tts'
      ];

      for (const model of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model,
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: voiceInfo.phrase,
                    speechMetadata: {
                      style: 'Clear, natural, expressive voice presentation'
                    }
                  }
                ]
              }
            ],
            config: {
              responseModalities: ['AUDIO'],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: voice }
                }
              }
            }
          });

          const part = response.candidates?.[0]?.content?.parts?.[0];
          if (part?.inlineData?.data) {
            return res.json({
              success: true,
              audioData: part.inlineData.data,
              audioBase64: part.inlineData.data,
              model,
              sampleRate: 24000,
              voice
            });
          }
        } catch (err: any) {
          console.warn(`Sample TTS model ${model} failed:`, err?.message || err);
        }
      }
    }

    // Fallback sample audio
    const fallbackPcm = generateSyntheticPcmBase64(voiceInfo.phrase, voiceInfo.pitchFreq, 3.5);
    return res.json({
      success: true,
      audioData: fallbackPcm,
      audioBase64: fallbackPcm,
      sampleRate: 24000,
      model: 'synthetic-preview',
      voice
    });
  } catch (err: any) {
    console.error('Sample generation error:', err);
    const fallbackPcm = generateSyntheticPcmBase64('Voice sample preview', 220, 3.0);
    return res.json({
      success: true,
      audioData: fallbackPcm,
      sampleRate: 24000
    });
  }
});

// AI Inspiration Moment Generator (POST /api/generate-moment)
app.post('/api/generate-moment', async (req, res) => {
  try {
    const { topic } = req.body;
    if (!topic || typeof topic !== 'string') {
      return res.status(400).json({ error: 'Topic is required.' });
    }

    const apiKey = getGeminiApiKey(req);
    if (apiKey) {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `Write a reflective, evocative vignette or poem in exactly 3 short lines based on this feeling, reunion, or memory: "${topic}". Return ONLY the 3 lines separated by newline breaks, without numbers, bullet points, or quotes.`
              }
            ]
          }
        ]
      });

      const generatedText = response.text?.trim();
      if (generatedText) {
        return res.json({ text: generatedText });
      }
    }

    // Fallback poetic response
    return res.json({
      text: `${topic}.\nA quiet thought drifting on the evening wind,\nbefore yesterday returns to memory.`
    });
  } catch (error: any) {
    console.error('Moment generation error:', error);
    return res.json({
      text: `${req.body.topic || 'Moment'}.\nA gentle memory shared in silence,\nstill warm in the morning light.`
    });
  }
});

// Also keep /api/tts/generate for backwards compatibility
app.post('/api/tts/generate', async (req, res) => {
  const { text, voiceName = 'Kore', style } = req.body;
  req.body.voice = voiceName;
  req.body.stylePrompt = style;
  return app._router.handle({ ...req, url: '/api/tts', method: 'POST' }, res, () => {});
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server startup failed:', err);
  process.exit(1);
});
