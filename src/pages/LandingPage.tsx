import React from 'react';
import {
  Terminal,
  Sparkles,
  Award,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Cpu,
  ShieldCheck,
  Code2,
  FolderKanban,
  Flame,
  Layers
} from 'lucide-react';
import { allCurriculumModules } from '../data/curriculum';
import { CodeEditor } from '../components/CodeEditor';

interface LandingPageProps {
  onStartLearning: () => void;
  onSelectModule: (moduleId: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartLearning, onSelectModule }) => {
  const sampleCode = `# PyPath Interactive Playground
# Welcome to Python 3.12!

def analyze_student_growth(name: str, streak: int) -> str:
    status = "Mastering Python" if streak >= 7 else "Building Momentum"
    return f"Student {name}: {status} ({streak} day streak! 🚀)"

print(analyze_student_growth("Alex", 14))

# List comprehension example:
powers_of_two = [2 ** x for x in range(6)]
print("Powers of 2:", powers_of_two)
`;

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-16 text-center max-w-4xl mx-auto px-4">
        {/* Subtle glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-950/80 text-indigo-300 border border-indigo-800/80 mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Production-Grade Python Curriculum • 13 Complete Modules</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
          Learn Python. <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-indigo-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
            Understand Everything.
          </span>
        </h1>

        <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          From absolute beginner syntax to advanced algorithms, memory internals, object-oriented architecture, and 12 real-world portfolio projects. Powered by an in-browser CPython runtime and an intelligent Gemini AI tutor.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
          <button
            type="button"
            onClick={onStartLearning}
            className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-teal-500 hover:from-indigo-500 hover:to-teal-400 text-white font-semibold shadow-lg shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            <span>Start Learning Free</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => onSelectModule('mod-1')}
            className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium border border-slate-700 transition-colors"
          >
            Explore Module 1: Intro
          </button>
        </div>

        {/* Feature Badges */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center space-x-2.5">
            <Cpu className="w-5 h-5 text-indigo-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-white">Browser CPython</div>
              <div className="text-[11px] text-slate-400">Isolated Pyodide Web Worker</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center space-x-2.5">
            <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-white">Objective Quizzes</div>
              <div className="text-[11px] text-slate-400">Deterministic scoring</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center space-x-2.5">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-white">Gemini AI Tutor</div>
              <div className="text-[11px] text-slate-400">Code-aware guidance</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center space-x-2.5">
            <FolderKanban className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-white">12 Real Projects</div>
              <div className="text-[11px] text-slate-400">From CLI to Analytics</div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Interactive Playground Preview */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-white">Try Python Right Here in Your Browser</h2>
          <p className="text-xs text-slate-400 mt-1">
            Zero installation required. Compiles and executes in an isolated WebAssembly CPython thread.
          </p>
        </div>
        <CodeEditor initialCode={sampleCode} />
      </section>

      {/* Structured Curriculum Map */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Full 13-Module Syllabus</span>
            <h2 className="text-2xl font-bold text-white mt-1">Comprehensive Learning Path</h2>
            <p className="text-xs text-slate-400 mt-1">
              Structured sequentially from foundational concepts to enterprise software architecture.
            </p>
          </div>
          <button
            type="button"
            onClick={onStartLearning}
            className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center space-x-1"
          >
            <span>View All Modules</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allCurriculumModules.map(mod => (
            <div
              key={mod.id}
              onClick={() => onSelectModule(mod.id)}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/60 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="font-mono font-bold text-indigo-400">Module {mod.number}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                    mod.difficulty === 'beginner' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                    mod.difficulty === 'intermediate' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                    'bg-purple-950 text-purple-300 border border-purple-800'
                  }`}>
                    {mod.difficulty}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {mod.title}
                </h3>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                  {mod.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                <span>{mod.lessons.length} Lessons • ~{mod.estimatedHours} hrs</span>
                <span className="text-indigo-400 group-hover:translate-x-0.5 transition-transform flex items-center">
                  Start <ArrowRight className="w-3 h-3 ml-1" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why PyPath Methodology */}
      <section className="max-w-5xl mx-auto px-4 py-8 bg-slate-900/60 rounded-3xl border border-slate-800">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl font-bold text-white">How PyPath Teaches Differently</h2>
          <p className="text-xs text-slate-400 mt-1">
            Engineered for deep comprehension, not superficial code copying.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-950 text-indigo-400 flex items-center justify-center font-bold">
              1
            </div>
            <h4 className="text-sm font-bold text-white">Line-by-Line Tracing</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every complex code example is accompanied by variable state tables and line-by-line mechanical explanations.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-teal-950 text-teal-400 flex items-center justify-center font-bold">
              2
            </div>
            <h4 className="text-sm font-bold text-white">Common Pitfalls & Fixes</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              We teach you what NOT to do: mutable default arguments, reference aliasing bugs, and infinite while loop traps.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-950 text-purple-400 flex items-center justify-center font-bold">
              3
            </div>
            <h4 className="text-sm font-bold text-white">Asymptotic Big-O Rigor</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Understand space-time complexity trade-offs early. Know why collections.deque beats list.pop(0) in production.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
