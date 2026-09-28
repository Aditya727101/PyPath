import React, { useState } from 'react';
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Circle,
  Clock,
  Award,
  Search,
  ArrowRight,
  Filter,
  Flame,
  Check
} from 'lucide-react';
import { allCurriculumModules } from '../data/curriculum';
import { Module, Lesson, DifficultyLevel } from '../types/curriculum';
import { useProgress } from '../context/ProgressContext';

interface CurriculumPageProps {
  onSelectLesson: (moduleId: string, lessonId: string) => void;
  onTakeQuiz: (quiz: any) => void;
  initialModuleId?: string;
}

export const CurriculumPage: React.FC<CurriculumPageProps> = ({
  onSelectLesson,
  onTakeQuiz,
  initialModuleId,
}) => {
  const { completedLessons, quizAttempts } = useProgress();

  const [expandedModuleIds, setExpandedModuleIds] = useState<string[]>(() => {
    return initialModuleId ? [initialModuleId] : ['mod-1'];
  });
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState('');

  const toggleExpand = (modId: string) => {
    setExpandedModuleIds(prev =>
      prev.includes(modId) ? prev.filter(id => id !== modId) : [...prev, modId]
    );
  };

  const filteredModules = allCurriculumModules.filter(m => {
    const matchesDifficulty = filterDifficulty === 'all' || m.difficulty === filterDifficulty;
    const matchesSearch =
      searchFilter.trim() === '' ||
      m.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      m.description.toLowerCase().includes(searchFilter.toLowerCase()) ||
      m.lessons.some(l => l.title.toLowerCase().includes(searchFilter.toLowerCase()));

    return matchesDifficulty && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            Self-Paced Architecture
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Python Curriculum Map
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            13 structured modules containing lessons, interactive playgrounds, knowledge check assessments, and real-world projects.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs">
          {['all', 'beginner', 'intermediate', 'advanced'].map(tier => (
            <button
              key={tier}
              type="button"
              onClick={() => setFilterDifficulty(tier)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                filterDifficulty === tier
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          placeholder="Filter modules or specific lesson titles (e.g. 'Recursion', 'JSON', 'Functions')..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 shadow-inner"
        />
      </div>

      {/* Modules List Accordion */}
      <div className="space-y-4">
        {filteredModules.map(mod => {
          const isExpanded = expandedModuleIds.includes(mod.id);
          const completedCount = mod.lessons.filter(l => completedLessons[l.id]).length;
          const totalInMod = mod.lessons.length;
          const isModuleDone = totalInMod > 0 && completedCount === totalInMod;
          const modQuizAttempt = quizAttempts[mod.chapterQuiz?.id];

          return (
            <div
              key={mod.id}
              className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-sm transition-all"
            >
              {/* Module Header Bar */}
              <div
                onClick={() => toggleExpand(mod.id)}
                className="p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-850/60 transition-colors select-none"
              >
                <div className="flex items-start space-x-3.5 flex-1 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 mt-0.5 ${
                    isModuleDone
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-indigo-950/80 text-indigo-400 border border-indigo-800/60'
                  }`}>
                    {isModuleDone ? <Check className="w-5 h-5" /> : mod.number}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-indigo-400 font-mono">
                        Module {mod.number}
                      </span>
                      <span className={`text-[10px] px-2 py-0.2 rounded-full uppercase font-semibold ${
                        mod.difficulty === 'beginner' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                        mod.difficulty === 'intermediate' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                        'bg-purple-950 text-purple-300 border border-purple-800'
                      }`}>
                        {mod.difficulty}
                      </span>
                    </div>

                    <h2 className="text-base sm:text-lg font-bold text-white truncate">
                      {mod.title}
                    </h2>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                      {mod.tagline}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 shrink-0">
                  <div className="hidden sm:block text-right">
                    <div className="text-xs font-mono font-bold text-slate-200">
                      {completedCount}/{totalInMod} completed
                    </div>
                    <div className="text-[10px] text-slate-500">
                      ~{mod.estimatedHours} hrs
                    </div>
                  </div>

                  <button
                    type="button"
                    className="p-1 text-slate-400 hover:text-white"
                  >
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Expanded Lessons Table */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-800/80 bg-slate-950/40 space-y-3">
                  <div className="space-y-1.5">
                    {mod.lessons.map(lesson => {
                      const isComplete = Boolean(completedLessons[lesson.id]);

                      return (
                        <div
                          key={lesson.id}
                          className="flex items-center justify-between p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 transition-colors group"
                        >
                          <div className="flex items-center space-x-3 flex-1 min-w-0 mr-3">
                            {isComplete ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            ) : (
                              <Circle className="w-4 h-4 text-slate-600 shrink-0" />
                            )}
                            <div className="truncate">
                              <h3 className="text-xs sm:text-sm font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors truncate">
                                {lesson.title}
                              </h3>
                              <div className="flex items-center space-x-2 text-[11px] text-slate-500 mt-0.5">
                                <span className="flex items-center space-x-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{lesson.durationMinutes}m</span>
                                </span>
                                <span>•</span>
                                <span className="truncate">{lesson.concepts.slice(0, 2).join(', ')}</span>
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => onSelectLesson(mod.id, lesson.id)}
                            className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white transition-all shrink-0 cursor-pointer"
                          >
                            {isComplete ? 'Review' : 'Start'}
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Chapter Assessment Trigger Card */}
                  {mod.chapterQuiz && (
                    <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-indigo-950/60 to-slate-900 border border-indigo-900/40 flex items-center justify-between gap-3">
                      <div className="flex items-center space-x-2.5">
                        <Award className="w-5 h-5 text-indigo-400 shrink-0" />
                        <div>
                          <h3 className="text-xs font-bold text-white">{mod.chapterQuiz.title}</h3>
                          <span className="text-[11px] text-slate-400">
                            {mod.chapterQuiz.questions.length} Questions • Pass cutoff: {mod.chapterQuiz.passingScorePercent}%
                            {modQuizAttempt && ` • Best Score: ${modQuizAttempt.percentage}%`}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onTakeQuiz(mod.chapterQuiz)}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shrink-0 cursor-pointer"
                      >
                        {modQuizAttempt ? 'Retake Assessment' : 'Take Assessment'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
