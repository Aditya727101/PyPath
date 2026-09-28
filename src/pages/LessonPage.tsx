import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Bookmark,
  CheckCircle2,
  Clock,
  Sparkles,
  FileEdit,
  HelpCircle,
  AlertTriangle,
  Lightbulb,
  ArrowLeft,
  Check
} from 'lucide-react';
import { Lesson, Module } from '../types/curriculum';
import { findAdjacentLessons } from '../data/curriculum';
import { CodeEditor } from '../components/CodeEditor';
import { QuizRunner } from '../components/QuizRunner';
import { useProgress } from '../context/ProgressContext';

interface LessonPageProps {
  lesson: Lesson;
  module: Module;
  onNavigateLesson: (moduleId: string, lessonId: string) => void;
  onBackToCurriculum: () => void;
  onOpenAITutorWithContext: (codeSnippet?: string, userError?: string) => void;
}

export const LessonPage: React.FC<LessonPageProps> = ({
  lesson,
  module,
  onNavigateLesson,
  onBackToCurriculum,
  onOpenAITutorWithContext,
}) => {
  const { completedLessons, markLessonComplete, isBookmarked, toggleBookmark, getNoteForLesson, saveNote } = useProgress();

  const isCompleted = Boolean(completedLessons[lesson.id]);
  const bookmarked = isBookmarked(lesson.id);
  const adjacent = findAdjacentLessons(lesson.id);

  // Note editor state
  const existingNote = getNoteForLesson(lesson.id);
  const [noteContent, setNoteContent] = useState(existingNote?.content || '');
  const [noteSaved, setNoteSaved] = useState(false);
  const [showNoteEditor, setShowNoteEditor] = useState(false);

  const handleSaveNote = async () => {
    await saveNote(lesson.id, lesson.title, lesson.moduleId, noteContent);
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  };

  const handleToggleComplete = async () => {
    await markLessonComplete(lesson.id, lesson.moduleId);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-24">
      {/* Top Breadcrumb & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <button
          type="button"
          onClick={onBackToCurriculum}
          className="flex items-center space-x-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Module {module.number}: {module.title}</span>
        </button>

        <div className="flex items-center space-x-2">
          {/* Note Editor Toggle */}
          <button
            type="button"
            onClick={() => setShowNoteEditor(!showNoteEditor)}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
              showNoteEditor || noteContent
                ? 'bg-indigo-950/80 border-indigo-700 text-indigo-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <FileEdit className="w-3.5 h-3.5" />
            <span>{noteContent ? 'Edit Note' : 'Add Note'}</span>
          </button>

          {/* Bookmark Button */}
          <button
            type="button"
            onClick={() => toggleBookmark({
              targetType: 'lesson',
              targetId: lesson.id,
              title: lesson.title,
              category: module.title,
            })}
            className={`p-2 rounded-xl border transition-colors ${
              bookmarked
                ? 'bg-amber-950/60 border-amber-700 text-amber-400'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title={bookmarked ? 'Remove Bookmark' : 'Bookmark this Lesson'}
          >
            <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
          </button>

          {/* Mark Complete Checkbox */}
          <button
            type="button"
            onClick={handleToggleComplete}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              isCompleted
                ? 'bg-emerald-950 border border-emerald-800 text-emerald-300'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isCompleted ? 'Completed' : 'Mark Done'}</span>
          </button>
        </div>
      </div>

      {/* Note Editor Drawer (if opened) */}
      {showNoteEditor && (
        <div className="p-4 rounded-2xl bg-slate-900 border border-indigo-800/60 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-300 flex items-center space-x-1.5">
              <FileEdit className="w-4 h-4" />
              <span>Personal Notes for this Lesson</span>
            </span>
            <button
              type="button"
              onClick={handleSaveNote}
              className="flex items-center space-x-1 px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white"
            >
              {noteSaved ? <Check className="w-3 h-3 text-emerald-300" /> : null}
              <span>{noteSaved ? 'Saved!' : 'Save Note'}</span>
            </button>
          </div>
          <textarea
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="Type key takeaways, formulas, personal reminders, or questions here..."
            rows={4}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-sans"
          />
        </div>
      )}

      {/* Lesson Hero Header */}
      <div>
        <div className="flex items-center space-x-3 text-xs text-slate-400 mb-2">
          <span className="font-mono text-indigo-400 font-semibold">
            Lesson {lesson.order} of {module.lessons.length}
          </span>
          <span>•</span>
          <span className="flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{lesson.durationMinutes} minutes</span>
          </span>
          <span>•</span>
          <span className="capitalize px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300">
            {lesson.difficulty}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
          {lesson.title}
        </h1>

        <p className="mt-3 text-sm text-slate-300 leading-relaxed max-w-3xl">
          {lesson.summary}
        </p>

        {/* Concepts Pills */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {lesson.concepts.map(c => (
            <span key={c} className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-indigo-300 font-mono">
              #{c}
            </span>
          ))}
        </div>
      </div>

      {/* Learning Objectives Box */}
      <div className="p-5 rounded-2xl bg-indigo-950/30 border border-indigo-800/40 space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center space-x-2">
          <Lightbulb className="w-4 h-4" />
          <span>What You Will Master in This Lesson</span>
        </h2>
        <ul className="space-y-1.5 pt-1">
          {lesson.learningObjectives.map((obj, i) => (
            <li key={i} className="text-xs text-slate-300 flex items-start space-x-2">
              <span className="text-teal-400 font-bold">•</span>
              <span>{obj}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Lesson Sections & Detailed Content */}
      <div className="space-y-12">
        {lesson.sections.map(section => (
          <article key={section.id} className="space-y-6">
            <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">
              {section.title}
            </h2>

            {/* Markdown / Formatted text block */}
            <div className="prose prose-invert max-w-none text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {section.content}
            </div>

            {/* Code Examples with Line-by-Line Breakdown */}
            {section.codeExamples && section.codeExamples.length > 0 && (
              <div className="space-y-6 pt-2">
                {section.codeExamples.map((ex, exIdx) => (
                  <div key={exIdx} className="space-y-3">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-slate-200">{ex.title}</h4>
                        <p className="text-xs text-slate-400">{ex.description}</p>
                      </div>
                    </div>

                    {/* Interactive Editor for Example */}
                    <CodeEditor
                      initialCode={ex.code}
                      lessonTitle={lesson.title}
                      onAskAi={(code, err) => onOpenAITutorWithContext(code, err)}
                      expectedOutput={ex.expectedOutput}
                      height="240px"
                    />

                    {/* Line by line breakdown */}
                    {ex.lineByLine && ex.lineByLine.length > 0 && (
                      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs space-y-2">
                        <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                          Line-by-Line Mechanics:
                        </span>
                        <div className="space-y-1.5">
                          {ex.lineByLine.map((lbl, li) => (
                            <div key={li} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 text-xs">
                              <code className="text-emerald-400 font-mono shrink-0 bg-slate-900 px-1.5 py-0.5 rounded">
                                {lbl.line}
                              </code>
                              <span className="text-slate-300">{lbl.explanation}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Pitfalls and Common Mistakes */}
            {section.pitfalls && section.pitfalls.length > 0 && (
              <div className="space-y-3 pt-2">
                {section.pitfalls.map((pf, pfi) => (
                  <div key={pfi} className="p-5 rounded-2xl bg-rose-950/20 border border-rose-900/40 space-y-3">
                    <div className="flex items-center space-x-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>Common Beginner Pitfall: {pf.pitfall}</span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      <span className="text-rose-300 font-semibold">Why this happens: </span>
                      {pf.why}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                      <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800/50 text-rose-200">
                        <div className="text-[10px] font-sans font-bold text-rose-400 uppercase mb-1">❌ Inactive / Buggy:</div>
                        <pre className="whitespace-pre-wrap">{pf.badCode}</pre>
                      </div>
                      <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-800/50 text-emerald-200">
                        <div className="text-[10px] font-sans font-bold text-emerald-400 uppercase mb-1">✅ Pythonic Fix:</div>
                        <pre className="whitespace-pre-wrap">{pf.goodCode}</pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>

      {/* Standalone Lesson Playground Sandbox */}
      <div className="space-y-3 pt-6 border-t border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <span>Lesson Practice Playground</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Experiment with the concepts taught above. Modify variables, test edge cases, and run in your browser.
          </p>
        </div>

        <CodeEditor
          initialCode={lesson.starterCode}
          lessonTitle={lesson.title}
          onAskAi={(code, err) => onOpenAITutorWithContext(code, err)}
          height="320px"
        />
      </div>

      {/* Lesson Knowledge Check Quiz (if available) */}
      {lesson.knowledgeCheck && (
        <div className="pt-8 border-t border-slate-800">
          <QuizRunner
            quiz={lesson.knowledgeCheck}
            onComplete={(score, total, passed) => {
              if (passed) {
                markLessonComplete(lesson.id, lesson.moduleId);
              }
            }}
            onAskAi={(qText, snippet) => onOpenAITutorWithContext(snippet, qText)}
          />
        </div>
      )}

      {/* Bottom Navigation Buttons */}
      <div className="flex items-center justify-between border-t border-slate-800 pt-6">
        {adjacent.prev ? (
          <button
            type="button"
            onClick={() => onNavigateLesson(adjacent.prev!.moduleId, adjacent.prev!.id)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous: {adjacent.prev.title}</span>
            <span className="sm:hidden">Previous</span>
          </button>
        ) : <div />}

        <button
          type="button"
          onClick={handleToggleComplete}
          className={`flex items-center space-x-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            isCompleted
              ? 'bg-emerald-950 border border-emerald-800 text-emerald-300'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{isCompleted ? 'Lesson Completed ✓' : 'Mark as Completed'}</span>
        </button>

        {adjacent.next ? (
          <button
            type="button"
            onClick={() => onNavigateLesson(adjacent.next!.moduleId, adjacent.next!.id)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white transition-colors shadow-md cursor-pointer"
          >
            <span className="hidden sm:inline">Next: {adjacent.next.title}</span>
            <span className="sm:hidden">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : <div />}
      </div>
    </div>
  );
};
