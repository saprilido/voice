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

// Health / status route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString()
  });
});

// Gemini TTS generation route
app.post('/api/tts/generate', async (req, res) => {
  try {
    const { text, voiceName = 'Aoede', style, speed } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Teks wajib diisi untuk menghasilkan audio.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        error: 'GEMINI_API_KEY belum dikonfigurasi di server secrets.',
        fallbackAvailable: true
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });

    // Try Gemini TTS model
    const candidateModels = [
      'gemini-3.8-flash-lite-tts',
      'gemini-3.1-flash-tts-preview',
      'gemini-3.8-flash-tts'
    ];

    let lastError: any = null;
    let base64Audio: string | null = null;
    let successfulModel = '';

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
                    style: style || 'Clear, natural conversational delivery'
                  }
                }
              ]
            }
          ],
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName }
              }
            }
          }
        });

        const part = response.candidates?.[0]?.content?.parts?.[0];
        if (part?.inlineData?.data) {
          base64Audio = part.inlineData.data;
          successfulModel = model;
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`TTS generation with model ${model} failed, trying next:`, err?.message || err);
      }
    }

    if (!base64Audio) {
      throw lastError || new Error('Tidak ada data audio yang diterima dari model Gemini TTS.');
    }

    return res.json({
      success: true,
      audioBase64: base64Audio,
      model: successfulModel,
      sampleRate: 24000,
      voiceName
    });
  } catch (error: any) {
    console.error('TTS API Error:', error);
    return res.status(500).json({
      error: error?.message || 'Gagal menghasilkan suara dengan Gemini TTS.',
      fallbackAvailable: true
    });
  }
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
