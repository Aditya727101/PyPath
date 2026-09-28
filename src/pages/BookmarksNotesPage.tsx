import React, { useState } from 'react';
import { Bookmark, FileEdit, Trash2, ArrowRight, BookOpen, Clock, Tag } from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { findLessonById, findModuleById } from '../data/curriculum';

interface BookmarksNotesPageProps {
  onNavigateLesson: (moduleId: string, lessonId: string) => void;
}

export const BookmarksNotesPage: React.FC<BookmarksNotesPageProps> = ({ onNavigateLesson }) => {
  const { bookmarks, notes, toggleBookmark, removeNote } = useProgress();
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'notes'>('bookmarks');

  return (
    <div className="space-y-6 pb-20 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
          Personal Study Hub
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
          Saved Bookmarks & Personal Notes
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Access your saved lessons, key syntax snippets, and personal study notes stored securely.
        </p>

        {/* Tab Toggle */}
        <div className="flex gap-2 mt-5">
          <button
            type="button"
            onClick={() => setActiveTab('bookmarks')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'bookmarks'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Bookmarks ({bookmarks.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('notes')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'notes'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <FileEdit className="w-3.5 h-3.5" />
            <span>Personal Notes ({notes.length})</span>
          </button>
        </div>
      </div>

      {/* Bookmarks Tab Content */}
      {activeTab === 'bookmarks' && (
        <div className="space-y-3">
          {bookmarks.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-500 text-xs">
              <Bookmark className="w-8 h-8 mx-auto mb-2 text-slate-600 stroke-[1.5]" />
              <p className="font-semibold text-slate-400">No bookmarks saved yet</p>
              <p className="mt-1 max-w-sm mx-auto">
                While reading any lesson or exploring exercises, click the Bookmark icon in the header to pin it here for quick access.
              </p>
            </div>
          ) : (
            bookmarks.map(bm => {
              const lesson = findLessonById(bm.targetId);
              const mod = lesson ? findModuleById(lesson.moduleId) : undefined;

              return (
                <div
                  key={bm.id}
                  className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 flex items-center justify-between gap-4 transition-all"
                >
                  <div className="flex items-start space-x-3.5">
                    <div className="w-9 h-9 rounded-lg bg-indigo-950/80 border border-indigo-800/60 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] uppercase font-bold text-indigo-400 font-mono">
                          {bm.category}
                        </span>
                        <span className="text-slate-600">•</span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {bm.createdAt ? bm.createdAt.slice(0, 10) : ''}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-white mt-0.5">{bm.title}</h3>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    {lesson && mod && (
                      <button
                        type="button"
                        onClick={() => onNavigateLesson(mod.id, lesson.id)}
                        className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors"
                      >
                        <span>Open</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => toggleBookmark(bm)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-800 transition-colors"
                      title="Remove bookmark"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Personal Notes Tab Content */}
      {activeTab === 'notes' && (
        <div className="space-y-4">
          {notes.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-500 text-xs">
              <FileEdit className="w-8 h-8 mx-auto mb-2 text-slate-600 stroke-[1.5]" />
              <p className="font-semibold text-slate-400">No notes written yet</p>
              <p className="mt-1 max-w-sm mx-auto">
                Click "Add Note" inside any lesson to record your personal insights, algorithms, and code notes. They synchronize directly to Firestore.
              </p>
            </div>
          ) : (
            notes.map(note => {
              const lesson = findLessonById(note.lessonId);
              const mod = lesson ? findModuleById(lesson.moduleId) : undefined;

              return (
                <div
                  key={note.id}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3"
                >
                  <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-indigo-400 font-mono">
                        Lesson Note
                      </span>
                      <h3 className="text-base font-bold text-white mt-0.5">{note.lessonTitle}</h3>
                      <span className="text-[11px] text-slate-500 font-mono">
                        Updated {note.updatedAt ? note.updatedAt.slice(0, 10) : ''}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      {lesson && mod && (
                        <button
                          type="button"
                          onClick={() => onNavigateLesson(mod.id, lesson.id)}
                          className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors"
                        >
                          <span>Go to Lesson</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => removeNote(note.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-800 transition-colors"
                        title="Delete note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-200 whitespace-pre-wrap leading-relaxed font-sans">
                    {note.content}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
