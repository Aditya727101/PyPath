import React from 'react';
import {
  BarChart3,
  Award,
  CheckCircle2,
  Flame,
  Clock,
  RotateCcw,
  BookOpen,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { allCurriculumModules, allCurriculumLessons } from '../data/curriculum';

interface ProgressPageProps {
  onNavigateLesson: (moduleId: string, lessonId: string) => void;
  onNavigateCurriculum: () => void;
}

export const ProgressPage: React.FC<ProgressPageProps> = ({ onNavigateLesson, onNavigateCurriculum }) => {
  const { completedLessons, quizAttempts, streakDays, totalProgressPercent, getWeakModules } = useProgress();

  const totalLessons = allCurriculumLessons.length;
  const completedCount = Object.keys(completedLessons).length;
  const attemptsList = Object.values(quizAttempts).sort((a, b) => b.attemptedAt.localeCompare(a.attemptedAt));

  const averageQuizScore = attemptsList.length > 0
    ? Math.round(attemptsList.reduce((acc, q) => acc + q.percentage, 0) / attemptsList.length)
    : 0;

  const weakModules = getWeakModules();

  return (
    <div className="space-y-8 pb-20 max-w-5xl mx-auto">
      {/* Page Title */}
      <div className="border-b border-slate-800 pb-5">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
          Academic Analytics
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
          Learning Progress & Mastery
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Data-driven metrics detailing completed lessons, assessment outcomes, and personalized revision recommendations.
        </p>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Curriculum Completion</span>
          <div className="text-2xl font-extrabold text-white">{totalProgressPercent}%</div>
          <p className="text-[11px] text-teal-400 font-mono">{completedCount} of {totalLessons} lessons</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Average Quiz Score</span>
          <div className="text-2xl font-extrabold text-white">{averageQuizScore}%</div>
          <p className="text-[11px] text-indigo-400 font-mono">{attemptsList.length} total attempts</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Learning Streak</span>
          <div className="text-2xl font-extrabold text-amber-400 flex items-center space-x-1">
            <span>{streakDays}</span>
            <Flame className="w-5 h-5 fill-amber-400" />
          </div>
          <p className="text-[11px] text-slate-400">Consecutive days active</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Modules Completed</span>
          <div className="text-2xl font-extrabold text-white">
            {allCurriculumModules.filter(m => m.lessons.every(l => completedLessons[l.id])).length} / 13
          </div>
          <p className="text-[11px] text-slate-400 font-mono">13 full chapters</p>
        </div>
      </div>

      {/* Module by Module Completion Bar Breakdown */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-white">Module Mastery Distribution</h2>
        <div className="space-y-3">
          {allCurriculumModules.map(mod => {
            const completedInMod = mod.lessons.filter(l => completedLessons[l.id]).length;
            const pct = Math.round((completedInMod / mod.lessons.length) * 100);

            return (
              <div key={mod.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">
                    Module {mod.number}: {mod.title}
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    {completedInMod}/{mod.lessons.length} ({pct}%)
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      pct === 100 ? 'bg-emerald-500' : 'bg-indigo-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weak Topics Drill-Down */}
      {weakModules.length > 0 && (
        <div className="p-6 rounded-2xl bg-amber-950/20 border border-amber-800/40 space-y-3">
          <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
            <AlertCircle className="w-4 h-4" />
            <span>Target Topics Requiring Reinforcement</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            The assessment engine detected sub-80% performance on these topics. Re-attempting their quizzes or reading the lessons will reinforce your learning:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {weakModules.map(wm => (
              <div
                key={wm.moduleId}
                className="p-3.5 rounded-xl bg-slate-900 border border-amber-800/60 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-white">{wm.title}</h4>
                  <span className="text-[11px] text-amber-400 font-mono">Average score: {wm.averageScore}%</span>
                </div>
                <button
                  type="button"
                  onClick={onNavigateCurriculum}
                  className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-indigo-300"
                >
                  Review
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Quiz Attempts Log */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-white">Assessment Attempt Log</h2>

        {attemptsList.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            No quiz attempts recorded yet. Open any module in the curriculum to take a chapter assessment!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Assessment Title</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Score</th>
                  <th className="py-2.5 px-3">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {attemptsList.map((att, i) => (
                  <tr key={i} className="hover:bg-slate-850/50">
                    <td className="py-3 px-3 font-medium text-white">{att.quizTitle}</td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-400">
                      {att.attemptedAt ? att.attemptedAt.slice(0, 10) : 'Recent'}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold">
                      {att.percentage}% ({att.score}/{att.totalQuestions})
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        att.passed
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-rose-950 text-rose-300 border border-rose-800'
                      }`}>
                        {att.passed ? 'PASSED' : 'RETRY'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
