import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Loader2,
  Bot,
  User,
  Lightbulb,
  Bug,
  Code2,
  Copy,
  Check,
  Zap,
  Square,
  ArrowDownToLine,
  RotateCcw
} from 'lucide-react';
import { askAiTutorStream, TutorContext } from '../services/aiTutor';
import { useAuth } from '../context/AuthContext';

interface Message {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  timestamp: string;
  streaming?: boolean;
}

interface AITutorChatProps {
  initialContext?: TutorContext;
  compact?: boolean;
  onInsertCode?: (code: string) => void;
}

export const AITutorChat: React.FC<AITutorChatProps> = ({
  initialContext,
  compact = false,
  onInsertCode,
}) => {
  const { profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'tutor',
      text: `Hello! I am your **PyPath Python Teacher**. 🐍\n\nI explain concepts simply, help debug code, and give direct answers first without overwhelming you.\n\nWhat are you working on right now?`,
      timestamp: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [oneLineMode, setOneLineMode] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setLoading(false);
      setMessages((prev) =>
        prev.map((m) => (m.streaming ? { ...m, streaming: false } : m))
      );
    }
  };

  const handleSend = async (
    overridePrompt?: string,
    mode: 'explain' | 'debug' | 'hint' | 'complexity' | 'practice' | 'chat' = 'chat',
    forceOneLine?: boolean
  ) => {
    const textToSend = (overridePrompt || inputText).trim();
    if (!textToSend && !initialContext?.codeSnippet && !initialContext?.userError) {
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: textToSend || (mode === 'debug' ? 'Please check this code for bugs.' : 'Explain this code.'),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const tutorMsgId = `t-${Date.now()}`;
    const initialTutorMsg: Message = {
      id: tutorMsgId,
      sender: 'tutor',
      text: '',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      streaming: true,
    };

    setMessages((prev) => [...prev, userMsg, initialTutorMsg]);
    if (!overridePrompt) setInputText('');
    setLoading(true);

    const mergedContext: TutorContext = {
      ...initialContext,
      level: profile?.experienceLevel || 'Beginner',
    };

    const isOneLine = forceOneLine !== undefined ? forceOneLine : oneLineMode;

    await askAiTutorStream(
      textToSend,
      mergedContext,
      mode,
      { oneLine: isOneLine, signal: abortController.signal },
      {
        onChunk: (_chunk, fullText) => {
          setMessages((prev) =>
            prev.map((msg) => (msg.id === tutorMsgId ? { ...msg, text: fullText } : msg))
          );
        },
        onDone: (fullText) => {
          setLoading(false);
          abortControllerRef.current = null;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === tutorMsgId
                ? { ...msg, text: fullText || 'Python answers are always clearer with practice!', streaming: false }
                : msg
            )
          );
        },
        onError: (err) => {
          setLoading(false);
          abortControllerRef.current = null;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === tutorMsgId
                ? {
                    ...msg,
                    text:
                      msg.text ||
                      `In Python, always check indentation and colon endings. (${err?.message || 'Connection paused'})`,
                    streaming: false,
                  }
                : msg
            )
          );
        },
      }
    );
  };

  const handleCopyCode = async (copyKey: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(copyKey);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'welcome-fresh',
        sender: 'tutor',
        text: `Fresh lesson slate ready! What Python topic or error can I explain simply?`,
        timestamp: 'Just now',
      },
    ]);
  };

  // Quick pedagogical prompt chips designed for fast, practical beginner guidance
  const quickPrompts = [
    {
      label: 'Explain Simply',
      icon: Code2,
      prompt: 'Explain what this code does in 2 to 3 simple sentences for a beginner.',
      mode: 'explain' as const,
      oneLine: false,
    },
    {
      label: 'Find Bugs',
      icon: Bug,
      prompt: 'Is there a bug or syntax error here? If so, point it out and show the fix simply.',
      mode: 'debug' as const,
      oneLine: false,
    },
    {
      label: 'Give Hint',
      icon: Lightbulb,
      prompt: 'Give me one small hint without giving away the full answer.',
      mode: 'hint' as const,
      oneLine: true,
    },
    {
      label: '1-Line Answer',
      icon: Zap,
      prompt: 'Give me a direct one-line explanation.',
      mode: 'chat' as const,
      oneLine: true,
    },
  ];

  // Helper to render markdown-like text with clean code blocks
  const renderFormattedContent = (content: string, msgId: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        const lines = part.slice(3, -3).trim().split('\n');
        let lang = lines[0]?.trim() || 'python';
        let code = lines.join('\n');
        if (lines[0]?.trim().toLowerCase() === 'python' || lines[0]?.trim().toLowerCase() === 'py') {
          code = lines.slice(1).join('\n');
        }

        const blockKey = `${msgId}-code-${index}`;

        return (
          <div key={blockKey} className="my-2.5 rounded-xl overflow-hidden border border-slate-700/60 bg-slate-950 font-mono text-[11px] shadow-sm">
            <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-[10px] text-slate-400">
              <span className="font-semibold text-indigo-300 uppercase tracking-wider">{lang}</span>
              <div className="flex items-center space-x-2">
                {onInsertCode && (
                  <button
                    type="button"
                    onClick={() => onInsertCode(code)}
                    className="hover:text-indigo-300 flex items-center space-x-1 cursor-pointer transition-colors"
                    title="Insert into Scratchpad"
                  >
                    <ArrowDownToLine className="w-3 h-3 text-indigo-400" />
                    <span>Insert</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleCopyCode(blockKey, code)}
                  className="hover:text-emerald-300 flex items-center space-x-1 cursor-pointer transition-colors"
                >
                  {copiedId === blockKey ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            <pre className="p-3 overflow-x-auto text-emerald-300/90 leading-relaxed font-mono">
              <code>{code}</code>
            </pre>
          </div>
        );
      }

      // Inline code and bold text processing
      const lines = part.split('\n');
      return (
        <span key={`text-${index}`} className="whitespace-pre-wrap">
          {lines.map((line, lIdx) => {
            // Simple inline markdown parsing for bold `**text**` and code `` `code` ``
            const subTokens = line.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
            return (
              <span key={`line-${lIdx}`}>
                {subTokens.map((tok, tIdx) => {
                  if (tok.startsWith('`') && tok.endsWith('`') && tok.length > 2) {
                    return (
                      <code key={tIdx} className="px-1.5 py-0.5 mx-0.5 rounded bg-slate-800 text-indigo-300 font-mono text-[11px] border border-slate-700">
                        {tok.slice(1, -1)}
                      </code>
                    );
                  }
                  if (tok.startsWith('**') && tok.endsWith('**') && tok.length > 4) {
                    return (
                      <strong key={tIdx} className="font-bold text-white">
                        {tok.slice(2, -2)}
                      </strong>
                    );
                  }
                  return tok;
                })}
                {lIdx < lines.length - 1 && '\n'}
              </span>
            );
          })}
        </span>
      );
    });
  };

  return (
    <div
      className={`flex flex-col bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden ${
        compact ? 'h-[500px]' : 'h-[650px]'
      }`}
    >
      {/* Tutor Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-slate-950 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-teal-500/80 p-0.5 flex items-center justify-center text-white shadow-sm">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-white">PyPath Python Tutor</h3>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Fast Teacher</span>
              </span>
            </div>
            {initialContext?.lessonTitle && (
              <p className="text-[11px] text-slate-400 truncate max-w-xs sm:max-w-sm">
                Lesson: <span className="text-indigo-300">{initialContext.lessonTitle}</span>
              </p>
            )}
          </div>
        </div>

        {/* Controls: One-line mode toggle & Clear */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setOneLineMode(!oneLineMode)}
            className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-colors border cursor-pointer flex items-center space-x-1 ${
              oneLineMode
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="When active, the tutor gives ultra-concise 1-sentence answers"
          >
            <Zap className="w-3 h-3" />
            <span className="hidden sm:inline">1-Line Mode</span>
          </button>

          <button
            type="button"
            onClick={handleClearHistory}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
            title="Reset conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-2.5 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'tutor' && (
              <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none shadow-md'
                  : 'bg-slate-950/90 border border-slate-800 text-slate-200 rounded-tl-none shadow-sm'
              }`}
            >
              <div className="font-sans">
                {msg.text ? (
                  renderFormattedContent(msg.text, msg.id)
                ) : (
                  <span className="flex items-center space-x-1.5 text-indigo-400">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Thinking...</span>
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-800/40 text-[10px] text-slate-400">
                <span>{msg.timestamp}</span>
                {msg.sender === 'tutor' && msg.text && (
                  <button
                    type="button"
                    onClick={() => handleCopyCode(msg.id, msg.text)}
                    className="hover:text-indigo-300 flex items-center space-x-0.5 cursor-pointer ml-3"
                  >
                    {copiedId === msg.id ? (
                      <Check className="w-2.5 h-2.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-2.5 h-2.5" />
                    )}
                    <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                  </button>
                )}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="px-4 py-2 bg-slate-950/90 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto text-xs scrollbar-none">
        {quickPrompts.map((qp) => {
          const Icon = qp.icon;
          return (
            <button
              key={qp.label}
              type="button"
              disabled={loading}
              onClick={() => handleSend(qp.prompt, qp.mode, qp.oneLine)}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-850 hover:bg-indigo-950 hover:text-indigo-300 border border-slate-800 hover:border-indigo-700/60 text-slate-300 text-[11px] whitespace-nowrap transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
            >
              <Icon className="w-3 h-3 text-indigo-400" />
              <span>{qp.label}</span>
            </button>
          );
        })}
      </div>

      {/* Input Form with Stop option */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-slate-950 border-t border-slate-800 flex items-center space-x-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={
            oneLineMode
              ? 'Ask for a 1-line Python answer...'
              : 'Ask any question about Python syntax, logic, or concepts...'
          }
          className="flex-1 bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
        />

        {loading ? (
          <button
            type="button"
            onClick={handleStop}
            className="p-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white transition-colors shrink-0 cursor-pointer flex items-center space-x-1 text-xs font-semibold"
            title="Stop response"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline">Stop</span>
          </button>
        ) : (
          <button
            type="submit"
            disabled={!inputText.trim() && !initialContext?.codeSnippet}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white disabled:text-slate-600 transition-colors shrink-0 cursor-pointer disabled:cursor-not-allowed"
            title="Send question"
          >
            <Send className="w-4 h-4" />
          </button>
        )}
      </form>
    </div>
  );
};
