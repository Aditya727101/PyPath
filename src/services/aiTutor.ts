export interface TutorContext {
  lessonTitle?: string;
  moduleTitle?: string;
  codeSnippet?: string;
  userError?: string;
  concept?: string;
  level?: string;
}

export interface TutorOptions {
  oneLine?: boolean;
  signal?: AbortSignal;
}

export interface TutorResponse {
  reply: string;
  cached?: boolean;
  source?: string;
  error?: string;
}

/**
 * Standard request to PyPath AI Tutor (returns complete response string).
 */
export async function askAiTutor(
  prompt: string,
  context?: TutorContext,
  mode: 'explain' | 'debug' | 'hint' | 'complexity' | 'practice' | 'chat' = 'chat',
  options?: TutorOptions
): Promise<string> {
  try {
    const res = await fetch('/api/ai/tutor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        context,
        mode,
        oneLine: options?.oneLine,
      }),
      signal: options?.signal,
    });

    const data = await res.json();
    if (!res.ok && data.error) {
      throw new Error(data.error);
    }

    return data.reply || 'Python tutor analyzed your question: check your syntax carefully!';
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw err;
    }
    console.error('askAiTutor error:', err);
    throw err;
  }
}

/**
 * Streaming request to PyPath AI Tutor via Server-Sent Events.
 * Streams text chunk by chunk for ultra-fast perceived latency.
 */
export async function askAiTutorStream(
  prompt: string,
  context: TutorContext | undefined,
  mode: 'explain' | 'debug' | 'hint' | 'complexity' | 'practice' | 'chat' = 'chat',
  options: TutorOptions | undefined,
  callbacks: {
    onChunk: (chunk: string, fullText: string) => void;
    onDone: (fullText: string) => void;
    onError: (err: Error) => void;
  }
): Promise<void> {
  let accumulated = '';

  try {
    const response = await fetch('/api/ai/tutor/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        context,
        mode,
        oneLine: options?.oneLine,
      }),
      signal: options?.signal,
    });

    if (!response.ok || !response.body) {
      // Fallback to standard endpoint if streaming is not supported
      const text = await askAiTutor(prompt, context, mode, options);
      callbacks.onChunk(text, text);
      callbacks.onDone(text);
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n\n');
      buffer = lines.pop() || '';

      for (const block of lines) {
        if (!block.trim()) continue;
        const blockLines = block.split('\n');
        let currentEvent = 'chunk';
        let currentData = '';

        for (const line of blockLines) {
          if (line.startsWith('event: ')) {
            currentEvent = line.slice(7).trim();
          } else if (line.startsWith('data: ')) {
            currentData = line.slice(6).trim();
          }
        }

        if (currentData) {
          try {
            const parsed = JSON.parse(currentData);
            if (currentEvent === 'chunk' && parsed.text) {
              accumulated += parsed.text;
              callbacks.onChunk(parsed.text, accumulated);
            }
          } catch {
            // Ignore malformed SSE lines
          }
        }
      }
    }

    // Flush any leftover buffer
    if (buffer.trim()) {
      const blockLines = buffer.split('\n');
      for (const line of blockLines) {
        if (line.startsWith('data: ')) {
          try {
            const parsed = JSON.parse(line.slice(6).trim());
            if (parsed.text) {
              accumulated += parsed.text;
              callbacks.onChunk(parsed.text, accumulated);
            }
          } catch {
            // Ignore
          }
        }
      }
    }

    callbacks.onDone(accumulated);
  } catch (err: any) {
    if (err.name === 'AbortError') {
      callbacks.onDone(accumulated);
      return;
    }

    // Attempt offline fallback if stream failed completely before yielding any text
    if (!accumulated) {
      try {
        const fallbackText = await askAiTutor(prompt, context, mode, options);
        callbacks.onChunk(fallbackText, fallbackText);
        callbacks.onDone(fallbackText);
        return;
      } catch (fallbackErr) {
        callbacks.onError(err);
      }
    } else {
      callbacks.onDone(accumulated);
    }
  }
}
