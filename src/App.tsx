import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProgressProvider } from './context/ProgressContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { AITutorChat } from './components/AITutorChat';
import { X, Sparkles } from 'lucide-react';

// Pages
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { CurriculumPage } from './pages/CurriculumPage';
import { LessonPage } from './pages/LessonPage';
import { PracticePage } from './pages/PracticePage';
import { ProjectsPage } from './pages/ProjectsPage';
import { AITutorPage } from './pages/AITutorPage';
import { ProgressPage } from './pages/ProgressPage';
import { BookmarksNotesPage } from './pages/BookmarksNotesPage';
import { SettingsPage } from './pages/SettingsPage';
import { QuizRunner } from './components/QuizRunner';

// Curriculum data
import {
  allCurriculumModules,
  findLessonById,
  findModuleById
} from './data/curriculum';
import { Quiz } from './types/curriculum';
import { TutorContext } from './services/aiTutor';

export function AppContent() {
  const [currentView, setCurrentView] = useState<string>('landing');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Lesson & Module navigation state
  const [activeModuleId, setActiveModuleId] = useState<string>('mod-1');
  const [activeLessonId, setActiveLessonId] = useState<string>('les-1-1');
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);

  // Floating AI Tutor Drawer
  const [floatingTutorOpen, setFloatingTutorOpen] = useState(false);
  const [tutorContext, setTutorContext] = useState<TutorContext | undefined>(undefined);

  const navigateToLesson = (moduleId: string, lessonId: string) => {
    setActiveModuleId(moduleId);
    setActiveLessonId(lessonId);
    setCurrentView('lesson');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTakeQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setCurrentView('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openAITutorWithContext = (codeSnippet?: string, userError?: string) => {
    const currentLesson = findLessonById(activeLessonId);
    const currentMod = findModuleById(activeModuleId);

    setTutorContext({
      moduleTitle: currentMod?.title,
      lessonTitle: currentLesson?.title,
      codeSnippet,
      userError,
    });
    setFloatingTutorOpen(true);
  };

  const activeLesson = findLessonById(activeLessonId) || allCurriculumModules[0].lessons[0];
  const activeModule = findModuleById(activeLesson.moduleId) || allCurriculumModules[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-600/30 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenAITutor={() => setFloatingTutorOpen(true)}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main App Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Navigation Sidebar */}
        <Sidebar
          currentView={currentView}
          onNavigate={(view) => {
            setCurrentView(view);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Dynamic Page Workspace */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-8">
          {currentView === 'landing' && (
            <LandingPage
              onStartLearning={() => setCurrentView('dashboard')}
              onSelectModule={(modId) => {
                setActiveModuleId(modId);
                const mod = findModuleById(modId);
                if (mod && mod.lessons.length > 0) {
                  navigateToLesson(modId, mod.lessons[0].id);
                } else {
                  setCurrentView('curriculum');
                }
              }}
            />
          )}

          {currentView === 'dashboard' && (
            <DashboardPage
              onNavigateLesson={navigateToLesson}
              onNavigateCurriculum={() => setCurrentView('curriculum')}
              onNavigatePractice={() => setCurrentView('practice')}
              onNavigateAITutor={() => setCurrentView('aitutor')}
            />
          )}

          {currentView === 'curriculum' && (
            <CurriculumPage
              initialModuleId={activeModuleId}
              onSelectLesson={navigateToLesson}
              onTakeQuiz={handleTakeQuiz}
            />
          )}

          {currentView === 'lesson' && (
            <LessonPage
              lesson={activeLesson}
              module={activeModule}
              onNavigateLesson={navigateToLesson}
              onBackToCurriculum={() => setCurrentView('curriculum')}
              onOpenAITutorWithContext={openAITutorWithContext}
            />
          )}

          {currentView === 'quiz' && activeQuiz && (
            <div className="max-w-3xl mx-auto space-y-6">
              <button
                type="button"
                onClick={() => setCurrentView('curriculum')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                ← Back to Curriculum
              </button>
              <QuizRunner
                quiz={activeQuiz}
                onComplete={() => {}}
                onAskAi={(qText, snippet) => openAITutorWithContext(snippet, qText)}
              />
            </div>
          )}

          {currentView === 'practice' && (
            <PracticePage onOpenAITutorWithContext={openAITutorWithContext} />
          )}

          {currentView === 'projects' && (
            <ProjectsPage onOpenAITutorWithContext={openAITutorWithContext} />
          )}

          {currentView === 'aitutor' && <AITutorPage />}

          {currentView === 'progress' && (
            <ProgressPage
              onNavigateLesson={navigateToLesson}
              onNavigateCurriculum={() => setCurrentView('curriculum')}
            />
          )}

          {currentView === 'bookmarks' && (
            <BookmarksNotesPage onNavigateLesson={navigateToLesson} />
          )}

          {currentView === 'settings' && <SettingsPage />}
        </main>
      </div>

      {/* Global Search Dialog */}
      <GlobalSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelectLesson={navigateToLesson}
      />

      {/* Floating AI Tutor Drawer */}
      {floatingTutorOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-slate-950/95 backdrop-blur-md border-l border-slate-800 shadow-2xl flex flex-col p-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <span className="text-xs font-bold text-indigo-400 flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4" />
              <span>PyPath AI Tutor Panel</span>
            </span>
            <button
              type="button"
              onClick={() => setFloatingTutorOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-hidden">
            <AITutorChat initialContext={tutorContext} compact={true} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProgressProvider>
          <AppContent />
        </ProgressProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
