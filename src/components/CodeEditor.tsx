import React, { useState, useRef, useEffect } from 'react';
import { Play, RotateCcw, Copy, Check, Terminal, AlertCircle, Sparkles, Loader2, StopCircle } from 'lucide-react';
import { pythonEngine, RunResult } from '../services/pythonRunner';

interface CodeEditorProps {
  initialCode: string;
  lessonTitle?: string;
  onAskAi?: (code: string, error?: string) => void;
  expectedOutput?: string;
  height?: string;
  onChange?: (code: string) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  initialCode,
  lessonTitle,
  onAskAi,
  expectedOutput,
  height = '380px',
  onChange,
}) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [customInput, setCustomInput] = useState<string>('');
  const [showInputPanel, setShowInputPanel] = useState<boolean>(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setCode(initialCode);
    setOutput('');
    setError(null);
    setExecutionTime(null);
  }, [initialCode]);

  // Handle Tab key for proper 4-space Python indentation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const indent = '    '; // 4 spaces

      const updatedCode = code.substring(0, start) + indent + code.substring(end);
      setCode(updatedCode);

      // Restore cursor position
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + indent.length;
      }, 0);
    }
  };

  const handleRun = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setError(null);
    setOutput('Loading Pyodide CPython engine & executing...\n');

    try {
      const result: RunResult = await pythonEngine.runCode(code, customInput || undefined);
      setExecutionTime(result.executionTimeMs);
      if (result.success) {
        setOutput(result.output || '(Code executed successfully with no stdout output)');
        setError(result.error || null);
      } else {
        setOutput(result.output || '');
        setError(result.error || 'Execution failed');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to execute code in browser worker.');
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setCode(initialCode);
    setOutput('');
    setError(null);
    setExecutionTime(null);
    pythonEngine.reset();
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Compute line numbers
  const lines = code.split('\n');

  return (
    <div className="flex flex-col rounded-xl overflow-hidden border border-slate-700/80 bg-slate-900 shadow-xl">
      {/* Editor Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800 text-xs text-slate-300 gap-2">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="font-mono text-slate-400 font-semibold pl-1.5">main.py</span>
          <span className="text-slate-500 text-[11px] hidden sm:inline">• CPython 3.12 (Isolated Worker)</span>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            type="button"
            onClick={() => setShowInputPanel(!showInputPanel)}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              showInputPanel ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/50' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
            title="Configure standard inputs for input() calls"
          >
            StdIn {showInputPanel ? 'Active' : ''}
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Copy code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Reset code"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {isRunning ? (
            <button
              type="button"
              onClick={() => {
                pythonEngine.reset();
                setIsRunning(false);
                setError('Execution aborted by user.');
              }}
              className="flex items-center space-x-1 px-3 py-1 rounded bg-rose-600 hover:bg-rose-500 text-white font-medium transition-colors"
            >
              <StopCircle className="w-3.5 h-3.5" />
              <span>Stop</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleRun}
              className="flex items-center space-x-1.5 px-3.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors shadow-sm cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run Code</span>
            </button>
          )}
        </div>
      </div>

      {/* StdIn configuration collapse */}
      {showInputPanel && (
        <div className="bg-slate-950/90 px-4 py-2 border-b border-slate-800 text-xs">
          <label className="block text-slate-400 font-mono mb-1">
            Standard Input (values for <code>input()</code> calls, one per line):
          </label>
          <textarea
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Type mock inputs here..."
            rows={2}
            className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
          />
        </div>
      )}

      {/* Code Textarea Area with Line Numbers */}
      <div className="relative flex bg-[#0c1222] font-mono text-sm" style={{ minHeight: height }}>
        {/* Line Numbers */}
        <div className="select-none py-3 px-3 text-right bg-[#090d19] text-slate-600 border-r border-slate-800/80 text-xs leading-6 min-w-[2.75rem]">
          {lines.map((_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>

        {/* Text Area */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            onChange?.(e.target.value);
          }}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          className="w-full h-full min-h-[300px] p-3 bg-transparent text-emerald-300 font-mono text-sm leading-6 resize-none focus:outline-none focus:ring-0 selection:bg-indigo-600/40"
          placeholder="Write or edit Python code here..."
        />
      </div>

      {/* Output Console Header */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-slate-950 border-t border-slate-800 text-xs text-slate-400">
        <div className="flex items-center space-x-2">
          <Terminal className="w-3.5 h-3.5 text-indigo-400" />
          <span className="font-semibold text-slate-300">Terminal Output</span>
          {executionTime !== null && (
            <span className="text-slate-500 font-mono text-[11px]">({executionTime} ms)</span>
          )}
        </div>

        {onAskAi && (
          <button
            type="button"
            onClick={() => onAskAi(code, error || undefined)}
            className="flex items-center space-x-1 text-xs text-indigo-400 hover:text-indigo-300 bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-800/60 px-2 py-0.5 rounded transition-colors"
          >
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>Ask AI Tutor About This</span>
          </button>
        )}
      </div>

      {/* Terminal Output Area */}
      <div className="bg-[#050811] p-3.5 font-mono text-xs max-h-48 overflow-y-auto min-h-[90px]">
        {isRunning ? (
          <div className="flex items-center space-x-2 text-indigo-400 py-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Executing Python bytecode in WebAssembly worker...</span>
          </div>
        ) : (
          <>
            {output && <pre className="text-slate-200 whitespace-pre-wrap">{output}</pre>}
            {error && (
              <div className="mt-2 p-2.5 rounded bg-rose-950/40 border border-rose-800/60 text-rose-300">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                  <div className="flex-1 overflow-x-auto">
                    <span className="font-semibold text-rose-400">Traceback / Error:</span>
                    <pre className="mt-1 whitespace-pre-wrap text-rose-200">{error}</pre>
                  </div>
                </div>
              </div>
            )}
            {!output && !error && (
              <span className="text-slate-600 italic">Click "Run Code" above to execute and view output.</span>
            )}
          </>
        )}
      </div>
    </div>
  );
};
