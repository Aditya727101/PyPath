import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged
} from 'firebase/auth';
import {
  auth,
  signInWithGoogle,
  signOutUser,
  syncUserProfile,
  loadUserData,
  deleteStudentAccountData
} from '../services/firebase';

export interface StudentProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  goal?: string;
  experienceLevel?: string;
  streakDays: number;
  lastActiveDate: string;
}

interface AuthContextType {
  user: FirebaseUser | null;
  profile: StudentProfile | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  updateGoal: (goal: string, experienceLevel: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
  updateGoal: async () => {},
  deleteAccount: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          await syncUserProfile(currentUser);
          const data = await loadUserData(currentUser.uid);
          if (data?.profile) {
            setProfile(data.profile as StudentProfile);
          } else {
            setProfile({
              uid: currentUser.uid,
              email: currentUser.email || '',
              displayName: currentUser.displayName || 'Student',
              photoURL: currentUser.photoURL || '',
              goal: 'Master Python Fundamentals & Build Real Projects',
              experienceLevel: 'Beginner',
              streakDays: 1,
              lastActiveDate: new Date().toISOString().slice(0, 10),
            });
          }
        } catch (err) {
          console.error('Failed to sync profile on auth state change:', err);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    try {
      const cred = await signInWithGoogle();
      if (cred.user) {
        await syncUserProfile(cred.user);
      }
    } catch (err) {
      console.error('Google Sign-In failed:', err);
      throw err;
    }
  };

  const signOut = async () => {
    try {
      await signOutUser();
      setUser(null);
      setProfile(null);
    } catch (err) {
      console.error('Sign Out failed:', err);
    }
  };

  const updateGoal = async (goal: string, experienceLevel: string) => {
    if (!user) return;
    try {
      await syncUserProfile(user, { goal, experienceLevel });
      setProfile(prev => prev ? { ...prev, goal, experienceLevel } : null);
    } catch (err) {
      console.error('Failed to update student learning goal:', err);
    }
  };

  const deleteAccount = async () => {
    if (!user) return;
    try {
      await deleteStudentAccountData(user.uid);
      await signOutUser();
      setUser(null);
      setProfile(null);
    } catch (err) {
      console.error('Failed to delete student account data:', err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signOut, updateGoal, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
