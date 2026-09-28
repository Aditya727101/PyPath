import React, { useState, useEffect } from 'react';
import { Search, X, BookOpen, ChevronRight, Hash } from 'lucide-react';
import { searchCurriculum } from '../data/curriculum';
import { Module, Lesson } from '../types/curriculum';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLesson: (moduleId: string, lessonId: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose, onSelectLesson }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ module: Module; lesson: Lesson; matchedText: string }[]>([]);

  useEffect(() => {
    if (query.trim()) {
      setResults(searchCurriculum(query));
    } else {
      setResults([]);
    }
  }, [query]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[75vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 bg-slate-950">
          <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search lessons, syntax, concepts (e.g. 'lambda', 'binary search', 'recursion')..."
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {query.trim() === '' ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              <p>Type keywords to search across 13 modules, lessons, syntax guides, and exercises.</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {['Decorators', 'Binary Search', 'Bytecode', 'Recursion', 'JSON', 'unittest'].map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setQuery(tag)}
                    className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
                  >
                    <Hash className="w-3 h-3 text-indigo-400" />
                    <span>{tag}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              No matching lessons found for "{query}". Try a broader keyword like "loop", "string", or "function".
            </div>
          ) : (
            results.map(({ module: mod, lesson }) => (
              <button
                key={lesson.id}
                type="button"
                onClick={() => {
                  onSelectLesson(mod.id, lesson.id);
                  onClose();
                }}
                className="w-full text-left p-3 rounded-xl hover:bg-slate-800/80 border border-transparent hover:border-slate-700 flex items-center justify-between group transition-all"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-950/60 border border-indigo-800/60 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors">
                      {lesson.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Module {mod.number}: {mod.title} • {lesson.durationMinutes} mins
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {lesson.concepts.slice(0, 3).map(c => (
                        <span key={c} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
