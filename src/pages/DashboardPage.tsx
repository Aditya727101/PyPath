import React from 'react';
import {
  LayoutDashboard,
  CheckCircle2,
  Flame,
  Award,
  Code2,
  BookOpen,
  ArrowRight,
  Sparkles,
  Zap,
  RotateCcw,
  Target
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProgress } from '../context/ProgressContext';
import { allCurriculumModules, allCurriculumLessons } from '../data/curriculum';
import { allExercises } from '../data/exercises';

interface DashboardPageProps {
  onNavigateLesson: (moduleId: string, lessonId: string) => void;
  onNavigateCurriculum: () => void;
  onNavigatePractice: () => void;
  onNavigateAITutor: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigateLesson,
  onNavigateCurriculum,
  onNavigatePractice,
  onNavigateAITutor,
}) => {
  const { user, profile } = useAuth();
  const { completedLessons, quizAttempts, solvedExercises, streakDays, totalProgressPercent, getWeakModules } = useProgress();

  // Find next uncompleted lesson
  const nextLesson = allCurriculumLessons.find(l => !completedLessons[l.id]) || allCurriculumLessons[0];
  const nextModule = allCurriculumModules.find(m => m.id === nextLesson.moduleId);

  const completedCount = Object.keys(completedLessons).length;
  const passedQuizzesCount = Object.values(quizAttempts).filter(q => q.passed).length;
  const solvedExercisesCount = Object.keys(solvedExercises).length;

  const weakModules = getWeakModules();
  const dailyChallenge = allExercises[0]; // Featured daily practice

  return (
    <div className="space-y-8 pb-16">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 border border-indigo-900/40 relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-400">
            Welcome back to PyPath
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            {profile?.displayName || user?.displayName || 'Python Learner'} 🚀
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Target Goal: <span className="font-semibold text-indigo-300">{profile?.goal || 'Master Python Fundamentals & Build Real Projects'}</span>
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigateLesson(nextLesson.moduleId, nextLesson.id)}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/25 transition-all cursor-pointer"
            >
              <span>Continue: {nextLesson.title}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={onNavigateAITutor}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Ask AI Tutor</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center space-x-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-teal-950/80 text-teal-400 border border-teal-800/60 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-white">{completedCount}</div>
            <div className="text-[11px] text-slate-400">Lessons Finished</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center space-x-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-indigo-950/80 text-indigo-400 border border-indigo-800/60 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-white">{passedQuizzesCount}</div>
            <div className="text-[11px] text-slate-400">Quizzes Passed</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center space-x-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 flex items-center justify-center shrink-0">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-white">{solvedExercisesCount}</div>
            <div className="text-[11px] text-slate-400">Exercises Solved</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center space-x-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-amber-950/80 text-amber-400 border border-amber-800/60 flex items-center justify-center shrink-0">
            <Flame className="w-5 h-5 fill-amber-400" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-white">{streakDays} Days</div>
            <div className="text-[11px] text-slate-400">Current Streak</div>
          </div>
        </div>
      </div>

      {/* Two Column Section: Continue Card & Daily Challenge */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Continue Learning Card */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between text-xs mb-3">
              <span className="font-semibold text-indigo-400 uppercase tracking-wider">
                Recommended Next Step
              </span>
              <span className="text-slate-400 text-[11px]">
                {nextModule ? `Module ${nextModule.number}` : ''}
              </span>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">
              {nextLesson.title}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              {nextLesson.summary}
            </p>

            <div className="flex flex-wrap gap-1.5 mb-6">
              {nextLesson.concepts.map(c => (
                <span key={c} className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300">
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">Estimated duration: {nextLesson.durationMinutes} mins</span>
            <button
              type="button"
              onClick={() => onNavigateLesson(nextLesson.moduleId, nextLesson.id)}
              className="flex items-center space-x-1 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <span>Resume Lesson</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Daily Challenge Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <div className="flex items-center space-x-1.5 text-amber-400 font-bold">
                <Zap className="w-4 h-4 fill-amber-400" />
                <span>Daily Python Challenge</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                {dailyChallenge.difficulty}
              </span>
            </div>

            <h4 className="text-sm font-bold text-white mt-3">
              {dailyChallenge.title}
            </h4>
            <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
              {dailyChallenge.problemStatement}
            </p>
          </div>

          <button
            type="button"
            onClick={onNavigatePractice}
            className="w-full mt-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white text-xs font-semibold border border-slate-700 transition-colors"
          >
            Solve in Practice Playground
          </button>
        </div>
      </div>

      {/* Weak Topics Revision Recommendation (if any) */}
      {weakModules.length > 0 && (
        <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-800/40">
          <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">
            <RotateCcw className="w-4 h-4" />
            <span>Targeted Revision Recommendations</span>
          </div>
          <p className="text-xs text-slate-300 mb-3">
            Based on recent quiz attempts, reviewing these topics will solidify your foundation:
          </p>
          <div className="flex flex-wrap gap-2">
            {weakModules.map(wm => (
              <button
                key={wm.moduleId}
                type="button"
                onClick={onNavigateCurriculum}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-amber-800/60 text-xs text-slate-200"
              >
                <span>{wm.title}</span>
                <span className="text-[10px] text-amber-400 font-bold font-mono">({wm.averageScore}%)</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Curriculum Snapshot */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Course Overview Progress</h2>
          <button
            type="button"
            onClick={onNavigateCurriculum}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
          >
            View Full Syllabus
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {allCurriculumModules.slice(0, 6).map(mod => {
            const completedInModule = mod.lessons.filter(l => completedLessons[l.id]).length;
            const pct = Math.round((completedInModule / mod.lessons.length) * 100);

            return (
              <div
                key={mod.id}
                onClick={onNavigateCurriculum}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-white truncate max-w-[70%]">
                    M{mod.number}: {mod.title}
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">{pct}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-500 h-full rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
