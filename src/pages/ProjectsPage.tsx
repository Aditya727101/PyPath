import React, { useState } from 'react';
import {
  FolderKanban,
  CheckCircle2,
  Circle,
  Sparkles,
  Lightbulb,
  Check,
  ChevronRight,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { allProjects } from '../data/projects';
import { Project } from '../types/curriculum';
import { CodeEditor } from '../components/CodeEditor';
import { useProgress } from '../context/ProgressContext';

interface ProjectsPageProps {
  onOpenAITutorWithContext: (codeSnippet?: string, userError?: string) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ onOpenAITutorWithContext }) => {
  const { projectChecklists, toggleProjectChecklistItem } = useProgress();

  const [activeProjectId, setActiveProjectId] = useState<string>(allProjects[0].id);
  const [showSolution, setShowSolution] = useState(false);
  const [revealedHints, setRevealedHints] = useState<number[]>([]);

  const activeProject = allProjects.find(p => p.id === activeProjectId) || allProjects[0];
  const checkedItems = projectChecklists[activeProject.id] || [];

  const handleSelectProject = (proj: Project) => {
    setActiveProjectId(proj.id);
    setShowSolution(false);
    setRevealedHints([]);
  };

  return (
    <div className="space-y-8 pb-20 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
            Portfolio Development
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Real-World Python Projects
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            12 guided software applications with starter templates, interactive test runners, requirements checklists, and architecture designs.
          </p>
        </div>
      </div>

      {/* Main Grid: Projects List + Selected Project Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Project Catalog */}
        <div className="lg:col-span-4 space-y-2 max-h-[700px] overflow-y-auto pr-1">
          {allProjects.map(proj => {
            const isActive = proj.id === activeProject.id;
            const checked = projectChecklists[proj.id] || [];
            const isCompleted = checked.length === proj.checklist.length;

            return (
              <div
                key={proj.id}
                onClick={() => handleSelectProject(proj)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-950/40 border-indigo-500 text-white shadow-md'
                    : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-mono text-indigo-400 font-bold">Project {proj.order}</span>
                  <span className={`text-[10px] px-2 py-0.2 rounded font-semibold capitalize ${
                    proj.difficulty === 'beginner' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                    proj.difficulty === 'intermediate' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                    'bg-purple-950 text-purple-300 border border-purple-800'
                  }`}>
                    {proj.difficulty}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white truncate">{proj.title}</h3>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{proj.tagline}</p>

                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-3 pt-2 border-t border-slate-800/60">
                  <span>{checked.length}/{proj.checklist.length} Tasks Done</span>
                  {isCompleted && <span className="text-teal-400 font-bold text-[10px]">Complete ✓</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Project Brief & Code Workspace */}
        <div className="lg:col-span-8 space-y-6">
          {/* Brief Card */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5 shadow-sm">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-xs font-mono font-bold text-indigo-400">Project {activeProject.order} of 12</span>
              <h2 className="text-2xl font-bold text-white mt-1">{activeProject.title}</h2>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">{activeProject.description}</p>
            </div>

            {/* Requirements & Learning Goals */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <span className="font-bold text-indigo-400 uppercase text-[10px]">Core Learning Goals:</span>
                <ul className="space-y-1 text-slate-300">
                  {activeProject.learningGoals.map((g, i) => (
                    <li key={i} className="flex items-start space-x-1.5">
                      <span className="text-teal-400">•</span>
                      <span>{g}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <span className="font-bold text-indigo-400 uppercase text-[10px]">Specifications:</span>
                <ul className="space-y-1 text-slate-300">
                  {activeProject.requirements.map((r, i) => (
                    <li key={i} className="flex items-start space-x-1.5">
                      <span className="text-teal-400">•</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Checklist */}
            <div className="space-y-2 pt-1">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Progress Checklist:
              </span>
              <div className="space-y-1.5">
                {activeProject.checklist.map(item => {
                  const isChecked = checkedItems.includes(item.id);

                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleProjectChecklistItem(activeProject.id, item.id)}
                      className={`p-2.5 rounded-xl border flex items-center space-x-3 transition-colors cursor-pointer ${
                        isChecked
                          ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {isChecked ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-600 shrink-0" />
                      )}
                      <span className="text-xs">{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Hints */}
            {activeProject.hints && activeProject.hints.length > 0 && (
              <div className="pt-2 space-y-2">
                <div className="text-xs font-bold text-slate-400 flex items-center space-x-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  <span>Architecture Hints</span>
                </div>
                <div className="space-y-1">
                  {activeProject.hints.map((hint, hi) => {
                    const isRevealed = revealedHints.includes(hi);
                    return (
                      <div key={hi}>
                        {isRevealed ? (
                          <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-800/40 text-xs text-amber-300">
                            {hint}
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setRevealedHints(prev => [...prev, hi])}
                            className="text-xs text-indigo-400 hover:text-indigo-300"
                          >
                            Show Hint {hi + 1}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Interactive Workspace */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Project Implementation Playground</h3>
              <button
                type="button"
                onClick={() => setShowSolution(!showSolution)}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                {showSolution ? 'Hide Reference Solution' : 'View Reference Solution'}
              </button>
            </div>

            {showSolution && (
              <div className="p-4 rounded-xl bg-slate-950 border border-emerald-800/50 space-y-2">
                <span className="text-xs font-bold text-emerald-400">Complete Reference Implementation:</span>
                <pre className="text-xs font-mono text-emerald-300 overflow-x-auto whitespace-pre-wrap">
                  {activeProject.solutionCode}
                </pre>
              </div>
            )}

            <CodeEditor
              initialCode={activeProject.starterCode}
              lessonTitle={activeProject.title}
              onAskAi={(code, err) => onOpenAITutorWithContext(code, err)}
              height="360px"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
