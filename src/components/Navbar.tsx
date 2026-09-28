import React from 'react';
import {
  Search,
  Moon,
  Sun,
  Flame,
  User,
  LogIn,
  LogOut,
  Menu,
  Terminal,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useProgress } from '../context/ProgressContext';

interface NavbarProps {
  onOpenSearch: () => void;
  onOpenAITutor: () => void;
  onToggleSidebar: () => void;
  currentView: string;
  onNavigate: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSearch,
  onOpenAITutor,
  onToggleSidebar,
  currentView,
  onNavigate,
}) => {
  const { user, profile, signIn, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { streakDays, totalProgressPercent } = useProgress();

  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
            aria-label="Toggle Navigation Drawer"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => onNavigate('landing')}
            className="flex items-center space-x-2.5 text-left group cursor-pointer focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-teal-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-white flex items-center">
                PyPath
                <span className="text-teal-400 ml-0.5">.</span>
              </span>
              <span className="hidden sm:block text-[10px] text-slate-400 font-medium tracking-tight -mt-1">
                Complete Python Academy
              </span>
            </div>
          </button>
        </div>

        {/* Middle: Search Trigger */}
        <div className="flex-1 max-w-md hidden md:block">
          <button
            type="button"
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-xl bg-slate-850 dark:bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-400 hover:text-slate-200 transition-all shadow-inner"
          >
            <span className="flex items-center space-x-2">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Search modules, topics, code...</span>
            </span>
            <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800 border border-slate-700 rounded">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          {/* Quick AI Tutor Button */}
          <button
            type="button"
            onClick={onOpenAITutor}
            className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-950/80 hover:bg-indigo-900/80 border border-indigo-800/80 text-indigo-300 transition-colors shadow-sm cursor-pointer"
            title="Open AI Tutor"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Tutor</span>
          </button>

          {/* Streak Indicator */}
          <div
            className="flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-amber-950/40 border border-amber-800/50 text-amber-300 text-xs font-bold"
            title={`${streakDays} Day Learning Streak`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
            <span>{streakDays}d</span>
          </div>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          {/* User Profile / Google Sign In */}
          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-colors"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Avatar'}
                    className="w-7 h-7 rounded-lg object-cover ring-1 ring-indigo-500/50"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                    {(user.displayName || 'U')[0].toUpperCase()}
                  </div>
                )}
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {dropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl py-2 z-50 text-xs"
                  onClick={() => setDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-800">
                    <p className="font-bold text-white truncate">{user.displayName || 'Learner'}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    <div className="mt-2 text-[10px] text-teal-400 font-medium">
                      Progress: {totalProgressPercent}% completed
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onNavigate('dashboard')}
                    className="w-full text-left px-4 py-2 hover:bg-slate-800 text-slate-200"
                  >
                    Student Dashboard
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('progress')}
                    className="w-full text-left px-4 py-2 hover:bg-slate-800 text-slate-200"
                  >
                    Analytics & Streaks
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate('settings')}
                    className="w-full text-left px-4 py-2 hover:bg-slate-800 text-slate-200"
                  >
                    Account Settings
                  </button>

                  <div className="border-t border-slate-800 mt-1 pt-1">
                    <button
                      type="button"
                      onClick={() => signOut()}
                      className="w-full text-left px-4 py-2 hover:bg-rose-950/40 text-rose-300 flex items-center space-x-1.5"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => signIn()}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
