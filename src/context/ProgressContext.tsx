import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import {
  saveLessonProgress,
  saveQuizAttempt,
  saveUserNote,
  deleteUserNote,
  saveUserBookmark,
  removeUserBookmark,
  loadUserData
} from '../services/firebase';
import { BookmarkItem, NoteItem, QuizAttemptRecord } from '../types/curriculum';
import { allCurriculumModules, allCurriculumLessons } from '../data/curriculum';

interface ProgressContextType {
  completedLessons: Record<string, { completedAt: string; timeSpentSeconds: number }>;
  quizAttempts: Record<string, QuizAttemptRecord>;
  solvedExercises: Record<string, boolean>;
  projectChecklists: Record<string, string[]>;
  bookmarks: BookmarkItem[];
  notes: NoteItem[];
  streakDays: number;
  totalProgressPercent: number;
  markLessonComplete: (lessonId: string, moduleId: string, timeSpentSeconds?: number) => Promise<void>;
  recordQuizAttempt: (attempt: {
    quizId: string;
    quizTitle: string;
    moduleId: string;
    score: number;
    totalQuestions: number;
    percentage: number;
    passed: boolean;
    userAnswers: Record<string, any>;
  }) => Promise<void>;
  toggleBookmark: (item: { targetType: 'lesson' | 'exercise' | 'project' | 'question'; targetId: string; title: string; category: string }) => Promise<void>;
  isBookmarked: (targetId: string) => boolean;
  saveNote: (lessonId: string, lessonTitle: string, moduleId: string, content: string) => Promise<void>;
  removeNote: (noteId: string) => Promise<void>;
  getNoteForLesson: (lessonId: string) => NoteItem | undefined;
  markExerciseSolved: (exerciseId: string) => void;
  toggleProjectChecklistItem: (projectId: string, checklistId: string) => void;
  getWeakModules: () => { moduleId: string; title: string; averageScore: number }[];
}

const ProgressContext = createContext<ProgressContextType | null>(null);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const [completedLessons, setCompletedLessons] = useState<Record<string, { completedAt: string; timeSpentSeconds: number }>>(() => {
    try {
      const saved = localStorage.getItem('pypath_completed_lessons');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [quizAttempts, setQuizAttempts] = useState<Record<string, QuizAttemptRecord>>(() => {
    try {
      const saved = localStorage.getItem('pypath_quiz_attempts');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [solvedExercises, setSolvedExercises] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('pypath_solved_exercises');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [projectChecklists, setProjectChecklists] = useState<Record<string, string[]>>(() => {
    try {
      const saved = localStorage.getItem('pypath_project_checklists');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(() => {
    try {
      const saved = localStorage.getItem('pypath_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [notes, setNotes] = useState<NoteItem[]>(() => {
    try {
      const saved = localStorage.getItem('pypath_notes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Calculate real streak
  const [streakDays, setStreakDays] = useState(1);

  // Sync from Firestore when user logs in
  useEffect(() => {
    if (!user) return;

    let isMounted = true;
    async function syncCloudData() {
      try {
        const cloudData = await loadUserData(user!.uid);
        if (!cloudData || !isMounted) return;

        if (cloudData.progress) {
          setCompletedLessons(prev => {
            const merged = { ...prev };
            Object.entries(cloudData.progress).forEach(([k, v]: [string, any]) => {
              if (v.completed) {
                merged[k] = { completedAt: v.completedAt || new Date().toISOString(), timeSpentSeconds: v.timeSpentSeconds || 60 };
              }
            });
            return merged;
          });
        }

        if (cloudData.quizAttempts && cloudData.quizAttempts.length > 0) {
          setQuizAttempts(prev => {
            const merged = { ...prev };
            cloudData.quizAttempts.forEach((q: any) => {
              merged[q.id || q.quizId] = q;
            });
            return merged;
          });
        }

        if (cloudData.notes && cloudData.notes.length > 0) {
          setNotes(cloudData.notes as NoteItem[]);
        }

        if (cloudData.bookmarks && cloudData.bookmarks.length > 0) {
          setBookmarks(cloudData.bookmarks as BookmarkItem[]);
        }
      } catch (err) {
        console.error('Error fetching student progress from Firestore:', err);
      }
    }

    syncCloudData();
    return () => { isMounted = false; };
  }, [user]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('pypath_completed_lessons', JSON.stringify(completedLessons));
  }, [completedLessons]);

  useEffect(() => {
    localStorage.setItem('pypath_quiz_attempts', JSON.stringify(quizAttempts));
  }, [quizAttempts]);

  useEffect(() => {
    localStorage.setItem('pypath_solved_exercises', JSON.stringify(solvedExercises));
  }, [solvedExercises]);

  useEffect(() => {
    localStorage.setItem('pypath_project_checklists', JSON.stringify(projectChecklists));
  }, [projectChecklists]);

  useEffect(() => {
    localStorage.setItem('pypath_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('pypath_notes', JSON.stringify(notes));
  }, [notes]);

  const markLessonComplete = async (lessonId: string, moduleId: string, timeSpentSeconds: number = 60) => {
    const record = { completedAt: new Date().toISOString(), timeSpentSeconds };
    setCompletedLessons(prev => ({ ...prev, [lessonId]: record }));

    if (user) {
      try {
        await saveLessonProgress(user.uid, lessonId, moduleId, true, timeSpentSeconds);
      } catch (err) {
        console.error('Failed to save lesson progress to cloud:', err);
      }
    }
  };

  const recordQuizAttempt = async (attempt: {
    quizId: string;
    quizTitle: string;
    moduleId: string;
    score: number;
    totalQuestions: number;
    percentage: number;
    passed: boolean;
    userAnswers: Record<string, any>;
  }) => {
    const attemptId = `attempt-${Date.now()}`;
    const fullRecord: QuizAttemptRecord = {
      id: attemptId,
      ...attempt,
      attemptedAt: new Date().toISOString(),
    };

    setQuizAttempts(prev => ({ ...prev, [attempt.quizId]: fullRecord }));

    if (user) {
      try {
        await saveQuizAttempt(user.uid, {
          id: attemptId,
          quizId: attempt.quizId,
          moduleId: attempt.moduleId,
          score: attempt.score,
          totalQuestions: attempt.totalQuestions,
          percentage: attempt.percentage,
          passed: attempt.passed,
        });
      } catch (err) {
        console.error('Failed to save quiz attempt to cloud:', err);
      }
    }
  };

  const toggleBookmark = async (item: { targetType: 'lesson' | 'exercise' | 'project' | 'question'; targetId: string; title: string; category: string }) => {
    const existing = bookmarks.find(b => b.targetId === item.targetId);
    if (existing) {
      setBookmarks(prev => prev.filter(b => b.targetId !== item.targetId));
      if (user) {
        try {
          await removeUserBookmark(user.uid, existing.id);
        } catch (err) {
          console.error('Error removing bookmark from cloud:', err);
        }
      }
    } else {
      const newBm: BookmarkItem = {
        id: `bm-${Date.now()}`,
        targetType: item.targetType,
        targetId: item.targetId,
        title: item.title,
        category: item.category,
        createdAt: new Date().toISOString(),
      };
      setBookmarks(prev => [...prev, newBm]);
      if (user) {
        try {
          await saveUserBookmark(user.uid, newBm);
        } catch (err) {
          console.error('Error saving bookmark to cloud:', err);
        }
      }
    }
  };

  const isBookmarked = (targetId: string) => {
    return bookmarks.some(b => b.targetId === targetId);
  };

  const saveNote = async (lessonId: string, lessonTitle: string, moduleId: string, content: string) => {
    const noteId = `note-${lessonId}`;
    const updatedNote: NoteItem = {
      id: noteId,
      lessonId,
      lessonTitle,
      moduleId,
      content,
      updatedAt: new Date().toISOString(),
    };

    setNotes(prev => {
      const filtered = prev.filter(n => n.lessonId !== lessonId);
      return [...filtered, updatedNote];
    });

    if (user) {
      try {
        await saveUserNote(user.uid, noteId, lessonId, lessonTitle, content);
      } catch (err) {
        console.error('Error saving note to cloud:', err);
      }
    }
  };

  const removeNote = async (noteId: string) => {
    setNotes(prev => prev.filter(n => n.id !== noteId));
    if (user) {
      try {
        await deleteUserNote(user.uid, noteId);
      } catch (err) {
        console.error('Error deleting note from cloud:', err);
      }
    }
  };

  const getNoteForLesson = (lessonId: string) => {
    return notes.find(n => n.lessonId === lessonId);
  };

  const markExerciseSolved = (exerciseId: string) => {
    setSolvedExercises(prev => ({ ...prev, [exerciseId]: true }));
  };

  const toggleProjectChecklistItem = (projectId: string, checklistId: string) => {
    setProjectChecklists(prev => {
      const current = prev[projectId] || [];
      const updated = current.includes(checklistId)
        ? current.filter(id => id !== checklistId)
        : [...current, checklistId];
      return { ...prev, [projectId]: updated };
    });
  };

  const totalLessons = allCurriculumLessons.length;
  const completedCount = Object.keys(completedLessons).length;
  const totalProgressPercent = totalLessons > 0 ? Math.min(100, Math.round((completedCount / totalLessons) * 100)) : 0;

  const getWeakModules = () => {
    const scoresByModule: Record<string, number[]> = {};
    Object.values(quizAttempts).forEach(attempt => {
      if (!scoresByModule[attempt.moduleId]) {
        scoresByModule[attempt.moduleId] = [];
      }
      scoresByModule[attempt.moduleId].push(attempt.percentage);
    });

    const weak: { moduleId: string; title: string; averageScore: number }[] = [];
    allCurriculumModules.forEach(mod => {
      const scores = scoresByModule[mod.id];
      if (scores && scores.length > 0) {
        const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
        if (avg < 80) {
          weak.push({ moduleId: mod.id, title: mod.title, averageScore: avg });
        }
      }
    });

    return weak;
  };

  return (
    <ProgressContext.Provider
      value={{
        completedLessons,
        quizAttempts,
        solvedExercises,
        projectChecklists,
        bookmarks,
        notes,
        streakDays,
        totalProgressPercent,
        markLessonComplete,
        recordQuizAttempt,
        toggleBookmark,
        isBookmarked,
        saveNote,
        removeNote,
        getNoteForLesson,
        markExerciseSolved,
        toggleProjectChecklistItem,
        getWeakModules,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};
