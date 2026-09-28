import React, { useState } from 'react';
import { Sparkles, Terminal, Code2, Bug, Lightbulb, Play } from 'lucide-react';
import { AITutorChat } from '../components/AITutorChat';
import { CodeEditor } from '../components/CodeEditor';
import { allCurriculumModules } from '../data/curriculum';
import { TutorContext } from '../services/aiTutor';

export const AITutorPage: React.FC = () => {
  const [selectedModuleId, setSelectedModuleId] = useState<string>('mod-1');
  const [scratchpadCode, setScratchpadCode] = useState<string>(`# AI Tutor Interactive Scratchpad
# Test code here and get instant guidance!

def calculate_discount(price, percent):
    if percent > 100 or percent < 0:
        return "Invalid discount"
    discount_amount = price * (percent / 100)
    return price - discount_amount

print("Final price:", calculate_discount(150, 20))
`);

  const activeModule =
    allCurriculumModules.find((m) => m.id === selectedModuleId) || allCurriculumModules[0];

  const tutorContext: TutorContext = {
    moduleTitle: activeModule.title,
    lessonTitle: activeModule.lessons[0]?.title,
    codeSnippet: scratchpadCode,
  };

  return (
    <div className="space-y-6 pb-20 max-w-6xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center space-x-2 text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
          <Sparkles className="w-4 h-4" />
          <span>Gemini AI Python Teacher</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          PyPath AI Python Tutor
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          Direct, beginner-friendly explanations with short sentences. Ask questions, debug errors, and insert code straight into your isolated Python sandbox.
        </p>
      </div>

      {/* Main Dual-Pane: Chat on Left, Scratchpad Sandbox on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chat Interface Column */}
        <div className="lg:col-span-7">
          <AITutorChat
            initialContext={tutorContext}
            compact={false}
            onInsertCode={(code) => setScratchpadCode(code)}
          />
        </div>

        {/* Scratchpad Code Sandbox Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                <Terminal className="w-4 h-4 text-indigo-400" />
                <span>Interactive Scratchpad</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                Pyodide CPython 3.12
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Experiment with Python code here while the tutor guides you. You can run code safely in your browser!
            </p>
          </div>

          <CodeEditor
            initialCode={scratchpadCode}
            lessonTitle="AI Scratchpad"
            height="360px"
            onChange={setScratchpadCode}
          />

          {/* Context Selector */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-300">Set Curriculum Context:</span>
            <select
              value={selectedModuleId}
              onChange={(e) => setSelectedModuleId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              {allCurriculumModules.map((m) => (
                <option key={m.id} value={m.id}>
                  Module {m.number}: {m.title}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500">
              Adapts the tutor’s explanations and vocabulary to this module’s difficulty level.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
