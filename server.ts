import express from 'express';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// AI Cover Letter Generator Endpoint
app.post('/api/cover-letter', async (req, res) => {
  try {
    const { jobTitle, company, salary, location, userProfile, notes } = req.body;

    const prompt = `Write a professional, compelling, and concise cover letter (approx 150-200 words) for a job candidate applying for the position of "${jobTitle}" at "${company}".

Job Context:
- Location: ${location || 'San Francisco, CA (Remote)'}
- Salary Range: ${salary || 'Competitive'}

Candidate Profile:
- Name: ${userProfile?.name || 'Robert Fox'}
- Current Role: ${userProfile?.title || 'Senior Product Designer'}
- Key Expertise: ${userProfile?.skills?.join(', ') || 'Figma, UI/UX Design, Design System, Prototyping, User Research'}
- Special Candidate Notes: ${notes || 'Excited to leverage deep product design experience to drive business growth.'}

Guidelines:
- Tone: Professional, confident, enthusiastic, and modern.
- Structure: Clear opening hook, 1 paragraph linking key skills to the company's goals, and a proactive closing with call to action.
- Format plain text with clear paragraphs. Do not include markdown code block quotes.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    const coverLetter = response.text || 'Dear Hiring Manager,\n\nI am thrilled to submit my application for this role. With my background in product design and user experience, I am confident in my ability to add immediate value to your team.\n\nBest regards,\nRobert Fox';

    res.json({ success: true, coverLetter });
  } catch (err: any) {
    console.error('Error generating cover letter:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to generate cover letter',
      fallbackLetter: `Dear Hiring Manager,\n\nI am writing to express my strong interest in the Product Designer position. With extensive experience in designing high-impact digital products, design systems, and mobile user interfaces, I am eager to contribute to your team.\n\nSincerely,\nRobert Fox`,
    });
  }
});

// Audio Transcription Endpoint using gemini-3.5-transcribe
app.post('/api/transcribe', async (req, res) => {
  try {
    const { base64Audio, mimeType = 'audio/webm' } = req.body;
    if (!base64Audio) {
      return res.status(400).json({ success: false, error: 'No audio provided' });
    }

    const audioPart = {
      inlineData: {
        mimeType,
        data: base64Audio,
      },
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-transcribe',
      contents: { parts: [audioPart, { text: 'Transcribe this spoken user voice command accurately into text.' }] },
    });

    const transcript = response.text || '';
    res.json({ success: true, transcript });
  } catch (err: any) {
    console.error('Error transcribing audio:', err);
    res.status(500).json({ success: false, error: err.message || 'Audio transcription failed' });
  }
});

// Voice Command Parser Endpoint using gemini-3.8-flash
app.post('/api/voice-command', async (req, res) => {
  try {
    const { transcript } = req.body;
    if (!transcript) {
      return res.status(400).json({ success: false, error: 'No transcript provided' });
    }

    const systemInstruction = `You are a voice assistant for a mobile Job Finder app.
Convert the user's spoken voice command into a structured JSON action object.

Available actions:
1. SEARCH_JOBS: User wants to search or find jobs (e.g., "search for product manager", "find designer jobs"). Extract "query" string.
2. FILTER_SALARY: User wants to filter by salary expectation (e.g., "filter salary to 150k", "minimum salary 200 thousand"). Extract "salaryMin" as a number in thousands (e.g. 150).
3. GO_TO_TAB: User wants to navigate to a tab (e.g., "go to saved jobs", "open bookmarks", "show tracker", "go home", "open profile", "search jobs"). Extract "tab" as one of: "home", "search", "bookmarks", "tracker", "profile".
4. APPLY_JOB: User wants to apply to a job (e.g., "apply now", "apply for this job").
5. GENERATE_COVER_LETTER: User wants to create an AI cover letter (e.g., "generate cover letter", "write cover letter").
6. UNKNOWN: Any other query.

Output ONLY valid JSON matching this structure:
{
  "action": "SEARCH_JOBS" | "FILTER_SALARY" | "GO_TO_TAB" | "APPLY_JOB" | "GENERATE_COVER_LETTER" | "UNKNOWN",
  "query"?: string,
  "salaryMin"?: number,
  "tab"?: "home" | "search" | "bookmarks" | "tracker" | "profile",
  "spokenResponse": string
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Spoken command: "${transcript}"`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    let result = { action: 'UNKNOWN', spokenResponse: `I heard "${transcript}". How can I help with your job search?` };
    try {
      if (response.text) {
        result = JSON.parse(response.text.trim());
      }
    } catch {
      // fallback
    }

    res.json({ success: true, result });
  } catch (err: any) {
    console.error('Error parsing voice command:', err);
    res.status(500).json({ success: false, error: err.message || 'Voice command parsing failed' });
  }
});

// Text-to-Speech Endpoint using gemini-3.8-flash-lite-tts
app.post('/api/tts', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ success: false, error: 'No text provided' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [{ text }],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
    res.json({ success: true, base64Audio });
  } catch (err: any) {
    console.error('Error generating TTS:', err);
    res.status(500).json({ success: false, error: err.message || 'TTS generation failed' });
  }
});

// Setup Vite middleware for dev or static serving for prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = await vite.transformIndexHtml(
          url,
          `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
    <title>Job Finder</title>
  </head>
  <body class="bg-[#E4E3EC] text-[#18181B] antialiased font-sans select-none min-h-screen">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`
        );
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Job Finder server running on port ${PORT}`);
  });
}

startServer();
