export interface RunResult {
  output: string;
  error?: string;
  executionTimeMs: number;
  success: boolean;
}

const PYODIDE_CDN = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js';

// Worker script that executes in a separate thread
const WORKER_SCRIPT = `
let pyodideInstance = null;
let isInitializing = false;

async function initPyodide() {
  if (pyodideInstance) return pyodideInstance;
  if (isInitializing) {
    while (isInitializing) {
      await new Promise(r => setTimeout(r, 100));
    }
    return pyodideInstance;
  }

  isInitializing = true;
  try {
    importScripts('${PYODIDE_CDN}');
    pyodideInstance = await self.loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/',
    });
    
    // Setup standard library capture
    await pyodideInstance.runPythonAsync(\`
import sys
import io

class WebStdout:
    def __init__(self):
        self.buf = io.StringIO()
    def write(self, text):
        self.buf.write(text)
    def flush(self):
        pass
    def getvalue(self):
        return self.buf.getvalue()
    def reset(self):
        self.buf = io.StringIO()

_stdout_capture = WebStdout()
_stderr_capture = WebStdout()
sys.stdout = _stdout_capture
sys.stderr = _stderr_capture
\`);
    isInitializing = false;
    return pyodideInstance;
  } catch (err) {
    isInitializing = false;
    throw err;
  }
}

self.onmessage = async (e) => {
  const { id, code, inputData } = e.data;
  const startTime = performance.now();

  try {
    const pyodide = await initPyodide();

    // Reset capture buffers
    await pyodide.runPythonAsync(\`
_stdout_capture.reset()
_stderr_capture.reset()
\`);

    // Mock input() if inputData is provided
    if (inputData !== undefined) {
      await pyodide.runPythonAsync(\`
_input_data = \${JSON.stringify(inputData)}.split('\\n')
_input_index = 0
def input(prompt=""):
    global _input_index
    if prompt:
        _stdout_capture.write(str(prompt))
    if _input_index < len(_input_data):
        val = _input_data[_input_index]
        _input_index += 1
        return val
    return ""
__builtins__.input = input
\`);
    }

    // Execute student code
    await pyodide.runPythonAsync(code);

    const stdout = await pyodide.runPythonAsync('_stdout_capture.getvalue()');
    const stderr = await pyodide.runPythonAsync('_stderr_capture.getvalue()');
    const endTime = performance.now();

    self.postMessage({
      id,
      success: true,
      output: stdout,
      error: stderr || undefined,
      executionTimeMs: Math.round(endTime - startTime),
    });
  } catch (error) {
    const endTime = performance.now();
    let errorMsg = error instanceof Error ? error.message : String(error);
    
    // Clean up Pyodide traceback noise for friendly display
    if (errorMsg.includes('PythonError:')) {
      errorMsg = errorMsg.split('PythonError:')[1].trim();
    }

    self.postMessage({
      id,
      success: false,
      output: '',
      error: errorMsg,
      executionTimeMs: Math.round(endTime - startTime),
    });
  }
};
`;

class PythonEngine {
  private worker: Worker | null = null;
  private currentRequestId = 0;
  private pendingCallbacks = new Map<number, (res: RunResult) => void>();
  private activeTimeout: any = null;
  private isLoaded = false;
  private loadError: string | null = null;

  constructor() {
    this.spawnWorker();
  }

  private spawnWorker() {
    if (this.worker) {
      try {
        this.worker.terminate();
      } catch (e) {
        // ignore
      }
    }

    try {
      const blob = new Blob([WORKER_SCRIPT], { type: 'application/javascript' });
      const workerUrl = URL.createObjectURL(blob);
      this.worker = new Worker(workerUrl);

      this.worker.onmessage = (e) => {
        const { id, success, output, error, executionTimeMs } = e.data;
        if (this.activeTimeout) {
          clearTimeout(this.activeTimeout);
          this.activeTimeout = null;
        }

        const cb = this.pendingCallbacks.get(id);
        if (cb) {
          this.pendingCallbacks.delete(id);
          this.isLoaded = true;
          cb({ success, output, error, executionTimeMs });
        }
      };

      this.worker.onerror = (e) => {
        console.error('Python Worker Error:', e);
        this.loadError = e.message || 'Worker initialization failed';
      };
    } catch (err: any) {
      this.loadError = err.message || 'Failed to create Web Worker';
    }
  }

  public reset() {
    this.spawnWorker();
  }

  public async runCode(code: string, inputData?: string, timeoutMs: number = 10000): Promise<RunResult> {
    if (!this.worker) {
      this.spawnWorker();
    }

    const requestId = ++this.currentRequestId;

    return new Promise((resolve) => {
      this.pendingCallbacks.set(requestId, resolve);

      // Guard against infinite loops or runaway code
      this.activeTimeout = setTimeout(() => {
        this.pendingCallbacks.delete(requestId);
        this.reset(); // kill and replace the hung worker
        resolve({
          success: false,
          output: '',
          error: `Execution timed out after ${timeoutMs / 1000}s. Your code might have an infinite loop (e.g. while True without break) or heavy computation. The environment was safely reset.`,
          executionTimeMs: timeoutMs,
        });
      }, timeoutMs);

      this.worker!.postMessage({
        id: requestId,
        code,
        inputData,
      });
    });
  }
}

export const pythonEngine = new PythonEngine();
