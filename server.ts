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
