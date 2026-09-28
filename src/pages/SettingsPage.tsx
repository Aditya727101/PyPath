import React, { useState } from 'react';
import { Settings, User, Moon, Sun, Shield, Trash2, Check, AlertTriangle, Sparkles, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export const SettingsPage: React.FC = () => {
  const { user, profile, signIn, updateGoal, deleteAccount } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [goalText, setGoalText] = useState(profile?.goal || 'Master Python Fundamentals & Build Real Projects');
  const [level, setLevel] = useState(profile?.experienceLevel || 'Beginner');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSaveGoal = async () => {
    await updateGoal(goalText, level);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteAccount();
      setShowDeleteModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 pb-20 max-w-3xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Preferences & Account
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
          Settings & Customization
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage your student profile, learning goals, theme, and data privacy.
        </p>
      </div>

      {/* Profile Section */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
        <div className="flex items-center space-x-2 text-sm font-bold text-white">
          <User className="w-4 h-4 text-indigo-400" />
          <span>Student Account Profile</span>
        </div>

        {user ? (
          <div className="flex items-center space-x-4">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/50"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-xl font-bold">
                {(user.displayName || 'S')[0].toUpperCase()}
              </div>
            )}
            <div>
              <h3 className="text-base font-bold text-white">{user.displayName}</h3>
              <p className="text-xs text-slate-400">{user.email}</p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                Google Authenticated (Firebase)
              </span>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-200">Currently Learning in Guest Mode</p>
              <p className="text-[11px] text-slate-400">Sign in with Google to synchronize progress across devices.</p>
            </div>
            <button
              type="button"
              onClick={() => signIn()}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In with Google</span>
            </button>
          </div>
        )}

        {/* Goal Form */}
        <div className="space-y-3 pt-3 border-t border-slate-800">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Primary Learning Goal:
            </label>
            <input
              type="text"
              value={goalText}
              onChange={(e) => setGoalText(e.target.value)}
              placeholder="e.g., Prepare for college Python exams, Build AI applications..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Current Skill Level:
            </label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="Beginner">Absolute Beginner (Starting from scratch)</option>
              <option value="Intermediate">Intermediate (Familiar with syntax, loops & functions)</option>
              <option value="Advanced">Advanced (Seeking algorithms, OOP & architecture mastery)</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleSaveGoal}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
          >
            {savedSuccess ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : null}
            <span>{savedSuccess ? 'Changes Saved!' : 'Save Learning Goals'}</span>
          </button>
        </div>
      </div>

      {/* Interface Preferences */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h2 className="text-sm font-bold text-white flex items-center space-x-2">
          <span>Display & Workspace Preferences</span>
        </h2>

        <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800">
          <div>
            <h4 className="text-xs font-bold text-slate-200">Color Theme</h4>
            <p className="text-[11px] text-slate-400">Select dark slate/navy or high-contrast clean light mode.</p>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200"
          >
            {theme === 'dark' ? <Moon className="w-3.5 h-3.5 text-indigo-400" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
            <span className="capitalize">{theme} Theme</span>
          </button>
        </div>
      </div>

      {/* Data & Privacy Section */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center space-x-2 text-sm font-bold text-rose-400">
          <Shield className="w-4 h-4" />
          <span>Account Privacy & Data Rights</span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          PyPath strictly respects student privacy. In accordance with zero-trust principles, your code, quiz submissions, bookmarks, and notes are accessible only by you.
        </p>

        {user && (
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/80 text-rose-300 text-xs font-semibold transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete My Account & Erase All Data</span>
            </button>
          </div>
        )}
      </div>

      {/* Confirmation Modal for Data Deletion */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="max-w-md w-full bg-slate-900 border border-rose-800/80 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-2.5 text-rose-400 font-bold text-sm">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>Erase Student Profile & Records?</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              This action is permanent and cannot be undone. All your completed lessons, quiz scores, saved personal notes, and bookmarks will be completely deleted from Firebase Firestore.
            </p>

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-800"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete Everything'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
