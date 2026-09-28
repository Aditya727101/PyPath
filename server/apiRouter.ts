import { GoogleGenAI } from '@google/genai';
import express, { Request, Response } from 'express';
import { IncomingMessage, ServerResponse } from 'http';
import { TUTOR_CONFIG, TUTOR_SYSTEM_INSTRUCTION } from './tutorConfig.ts';
import {
  getCachedTutorResponse,
  setCachedTutorResponse,
  findCurriculumFallback,
} from './tutorKnowledge.ts';

export const apiRouter = express.Router();
apiRouter.use(express.json());

// Initialize GoogleGenAI client (reads GEMINI_API_KEY from environment)
let genAI: GoogleGenAI | null = null;
function getGenAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!genAI) {
    try {
      genAI = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    } catch (err) {
      console.warn('GoogleGenAI initialization warning:', err);
    }
  }
  return genAI;
}

export interface TutorRequestBody {
  prompt: string;
  context?: {
    lessonTitle?: string;
    moduleTitle?: string;
    codeSnippet?: string;
    userError?: string;
    concept?: string;
    level?: string;
  };
  mode?: 'explain' | 'debug' | 'hint' | 'complexity' | 'practice' | 'chat';
  oneLine?: boolean;
}

function sendJsonResponse(res: any, status: number, data: any) {
  if (typeof res.status === 'function' && typeof res.json === 'function') {
    return res.status(status).json(data);
  }
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

/**
 * Builds a lean, focused context payload for the Gemini model.
 * Avoids bloated context to keep latency minimal.
 */
function buildPromptPayload(body: TutorRequestBody): { userContent: string; cacheKey?: string } {
  const { prompt, context, mode = 'chat', oneLine } = body;
  const cleanPrompt = (prompt || '').trim();

  let contextSegments: string[] = [];
  if (context?.moduleTitle || context?.lessonTitle) {
    contextSegments.push(`[Curriculum: ${context.moduleTitle || ''} > ${context.lessonTitle || ''}]`);
  }
  if (context?.concept) {
    contextSegments.push(`[Topic: ${context.concept}]`);
  }
  if (context?.level) {
    contextSegments.push(`[Student Level: ${context.level}]`);
  }

  // Format code snippet safely without bloating
  if (context?.codeSnippet?.trim()) {
    const trimmedCode = context.codeSnippet.trim().slice(0, TUTOR_CONFIG.maxCodeSnippetLength);
    contextSegments.push(`Student's Code:\n\`\`\`python\n${trimmedCode}\n\`\`\``);
  }

  if (context?.userError?.trim()) {
    const trimmedError = context.userError.trim().slice(0, 500);
    contextSegments.push(`Error Output / Traceback:\n\`\`\`text\n${trimmedError}\n\`\`\``);
  }

  let finalQuery = cleanPrompt;
  if (!finalQuery && mode === 'debug') {
    finalQuery = 'Please point out where the bug is in my code and give me a simple tip to fix it.';
  } else if (!finalQuery && mode === 'hint') {
    finalQuery = 'Give me a small hint for this problem without spoiling the full solution.';
  } else if (!finalQuery && mode === 'explain') {
    finalQuery = 'Explain what this Python code is doing in 2 to 4 simple sentences.';
  } else if (!finalQuery && mode === 'complexity') {
    finalQuery = 'Briefly state the time and space complexity of this code in Big-O notation with 1 sentence explaining why.';
  }

  if (oneLine || /one[- ]line|one sentence/i.test(finalQuery)) {
    contextSegments.push('[Constraint: Provide a 1-sentence answer only.]');
  }

  const userContent = [...contextSegments, `Student Question: ${finalQuery}`].join('\n\n');

  // Compute a simple cache key for general concept queries that do not have custom code snippets
  let cacheKey: string | undefined;
  if (!context?.codeSnippet && !context?.userError && cleanPrompt.length > 3) {
    cacheKey = `${context?.moduleTitle || 'general'}:${cleanPrompt.toLowerCase()}`;
  }

  return { userContent, cacheKey };
}

/**
 * Handle non-streaming AI Tutor requests with instant cache and resilient fallback.
 */
async function handleAITutorRequest(body: TutorRequestBody, res: any) {
  const cleanPrompt = (body.prompt || '').trim();

  // Edge Case: Empty or accidental keystrokes
  if (!cleanPrompt && !body.context?.codeSnippet && !body.context?.userError) {
    return sendJsonResponse(res, 200, {
      reply: 'Hello! I am your PyPath Python Tutor. What Python question or code can I help you with today?'
    });
  }

  // Edge Case: 1 or 2 character junk input
  if (cleanPrompt.length <= 2 && !body.context?.codeSnippet) {
    return sendJsonResponse(res, 200, {
      reply: 'Feel free to ask any question about Python basics, loops, lists, functions, or paste some code to review!'
    });
  }

  const { userContent, cacheKey } = buildPromptPayload(body);

  // Check fast in-memory cache
  if (cacheKey) {
    const cached = getCachedTutorResponse(cacheKey);
    if (cached) {
      return sendJsonResponse(res, 200, { reply: cached, cached: true });
    }
  }

  const client = getGenAIClient();

  // If API key is not configured or client failed, use instant curriculum fallback
  if (!client) {
    const fallback = findCurriculumFallback(cleanPrompt);
    if (fallback) {
      return sendJsonResponse(res, 200, { reply: fallback, source: 'curriculum-core' });
    }
    return sendJsonResponse(res, 200, {
      reply: "Python is a clean, readable programming language. Make sure your `GEMINI_API_KEY` is configured in the environment to unlock full live tutor conversations!"
    });
  }

  // Generate with configured fast model and fallbacks
  const modelsToTry = [TUTOR_CONFIG.model, ...TUTOR_CONFIG.fallbackModels.filter(m => m !== TUTOR_CONFIG.model)];
  let lastError: any = null;

  for (const modelName of modelsToTry) {
    try {
      const response = await client.models.generateContent({
        model: modelName,
        contents: userContent,
        config: {
          systemInstruction: TUTOR_SYSTEM_INSTRUCTION,
          thinkingConfig: {
            thinkingLevel: TUTOR_CONFIG.thinkingLevel,
          },
          temperature: TUTOR_CONFIG.temperature,
          maxOutputTokens: TUTOR_CONFIG.maxOutputTokens,
        },
      });

      const reply = response.text?.trim() || 'Here is the answer based on Python 3 rules: check your syntax and logic carefully.';
      
      // Store in cache if appropriate
      if (cacheKey && reply.length > 10) {
        setCachedTutorResponse(cacheKey, reply);
      }

      return sendJsonResponse(res, 200, { reply });
    } catch (err: any) {
      lastError = err;
      const isTemporary = err?.message?.includes('503') || err?.message?.includes('high demand') || err?.status === 503;
      if (!isTemporary) break;
    }
  }

  // Graceful fallback if external model is experiencing temporary network delay
  const offlineFallback = findCurriculumFallback(cleanPrompt);
  if (offlineFallback) {
    return sendJsonResponse(res, 200, { reply: offlineFallback, source: 'curriculum-fallback' });
  }

  return sendJsonResponse(res, 200, {
    reply: "I am momentarily catching my breath due to high network traffic! In general, Python executes code line by line from top to bottom. If your code ran into an issue, check your indentation and variable names, or try asking again in a few seconds."
  });
}

/**
 * Handle streaming AI Tutor requests via Server-Sent Events (SSE).
 */
async function handleAITutorStreamRequest(body: TutorRequestBody, res: any) {
  // Set up SSE headers
  if (typeof res.setHeader === 'function') {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();
  }

  const sendEvent = (event: string, data: any) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  const cleanPrompt = (body.prompt || '').trim();

  // Edge cases
  if (!cleanPrompt && !body.context?.codeSnippet && !body.context?.userError) {
    sendEvent('chunk', { text: 'Hello! I am your PyPath Python Tutor. What Python question or code can I help you with today?' });
    sendEvent('done', {});
    res.end();
    return;
  }

  const { userContent, cacheKey } = buildPromptPayload(body);

  if (cacheKey) {
    const cached = getCachedTutorResponse(cacheKey);
    if (cached) {
      sendEvent('chunk', { text: cached });
      sendEvent('done', { cached: true });
      res.end();
      return;
    }
  }

  const client = getGenAIClient();
  if (!client) {
    const fallback = findCurriculumFallback(cleanPrompt) ||
      "Python is a beginner-friendly language designed for readable code. To get interactive tutor responses, ensure GEMINI_API_KEY is active in your environment.";
    sendEvent('chunk', { text: fallback });
    sendEvent('done', {});
    res.end();
    return;
  }

  try {
    const responseStream = await client.models.generateContentStream({
      model: TUTOR_CONFIG.model,
      contents: userContent,
      config: {
        systemInstruction: TUTOR_SYSTEM_INSTRUCTION,
        thinkingConfig: {
          thinkingLevel: TUTOR_CONFIG.thinkingLevel,
        },
        temperature: TUTOR_CONFIG.temperature,
        maxOutputTokens: TUTOR_CONFIG.maxOutputTokens,
      },
    });

    let fullAccumulated = '';
    for await (const chunk of responseStream) {
      const text = chunk.text;
      if (text) {
        fullAccumulated += text;
        sendEvent('chunk', { text });
      }
    }

    if (cacheKey && fullAccumulated) {
      setCachedTutorResponse(cacheKey, fullAccumulated);
    }

    sendEvent('done', {});
    res.end();
  } catch (err: any) {
    console.warn('Streaming error, sending resilient teacher fallback:', err?.message);
    const fallback = findCurriculumFallback(cleanPrompt) ||
      "I experienced a brief connection hiccup. For this Python question, remember that Python code must be properly indented (4 spaces) and variable names are case-sensitive.";
    sendEvent('chunk', { text: fallback });
    sendEvent('done', {});
    res.end();
  }
}

// Express route handlers
apiRouter.post('/ai/tutor', async (req: Request, res: Response) => {
  try {
    await handleAITutorRequest(req.body, res);
  } catch (error: any) {
    console.error('Error in /api/ai/tutor:', error);
    sendJsonResponse(res, 200, {
      reply: "Python tutor is currently busy. Please review the lesson notes or rephrase your question."
    });
  }
});

apiRouter.post('/ai/tutor/stream', async (req: Request, res: Response) => {
  try {
    await handleAITutorStreamRequest(req.body, res);
  } catch (error: any) {
    console.error('Error in /api/ai/tutor/stream:', error);
    if (!res.headersSent) {
      sendJsonResponse(res, 200, {
        reply: "Python tutor connection was interrupted. Please try asking again."
      });
    } else {
      res.end();
    }
  }
});

// Generic Node / Connect middleware for Vite dev server
export function handleApiMiddleware(req: IncomingMessage, res: ServerResponse, next: () => void) {
  const url = req.url || '';
  const isTutorStream = url === '/ai/tutor/stream' || url === '/tutor/stream';
  const isTutor = url === '/ai/tutor' || url === '/tutor';

  if ((isTutor || isTutorStream) && req.method === 'POST') {
    let bodyData = '';
    req.on('data', chunk => { bodyData += chunk; });
    req.on('end', async () => {
      try {
        const parsed = JSON.parse(bodyData || '{}');
        if (isTutorStream) {
          await handleAITutorStreamRequest(parsed, res);
        } else {
          await handleAITutorRequest(parsed, res);
        }
      } catch (err: any) {
        console.error('Failed in API middleware:', err);
        sendJsonResponse(res, 200, {
          reply: 'I had trouble reading the question. Please type your Python question again.'
        });
      }
    });
    return;
  }
  next();
}
