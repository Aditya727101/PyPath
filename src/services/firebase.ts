import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as fbSignOut,
  User as FirebaseUser,
  onAuthStateChanged
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  deleteDoc,
  query,
  getDocFromServer
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// Verify Firestore connection on boot as mandated
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Authentication Helpers
export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  return await signInWithPopup(auth, provider);
}

export async function signOutUser() {
  return await fbSignOut(auth);
}

// Firestore Database Operations for Students
export async function syncUserProfile(user: FirebaseUser, extra?: { goal?: string; experienceLevel?: string }) {
  if (!user.uid) return;
  const userRef = doc(db, 'users', user.uid);
  const now = new Date().toISOString();
  try {
    const existing = await getDoc(userRef);
    if (!existing.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'Python Learner',
        photoURL: user.photoURL || '',
        goal: extra?.goal || 'Master Python Fundamentals & Build Real Projects',
        experienceLevel: extra?.experienceLevel || 'Beginner',
        streakDays: 1,
        lastActiveDate: now.slice(0, 10),
        totalLessonsCompleted: 0,
        totalQuizzesPassed: 0,
        totalExercisesSolved: 0,
        createdAt: now,
        updatedAt: now,
      });
    } else {
      await setDoc(userRef, {
        displayName: user.displayName || existing.data().displayName,
        photoURL: user.photoURL || existing.data().photoURL,
        updatedAt: now,
        ...(extra?.goal ? { goal: extra.goal } : {}),
        ...(extra?.experienceLevel ? { experienceLevel: extra.experienceLevel } : {}),
      }, { merge: true });
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
  }
}

export async function saveLessonProgress(userId: string, lessonId: string, moduleId: string, completed: boolean, timeSpentSeconds: number = 60) {
  const path = `users/${userId}/progress/${lessonId}`;
  try {
    const ref = doc(db, 'users', userId, 'progress', lessonId);
    const now = new Date().toISOString();
    await setDoc(ref, {
      lessonId,
      moduleId,
      completed,
      completedAt: completed ? now : '',
      lastVisitedAt: now,
      timeSpentSeconds,
    }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function saveQuizAttempt(
  userId: string,
  attempt: {
    id: string;
    quizId: string;
    moduleId: string;
    score: number;
    totalQuestions: number;
    percentage: number;
    passed: boolean;
  }
) {
  const path = `users/${userId}/quizAttempts/${attempt.id}`;
  try {
    const ref = doc(db, 'users', userId, 'quizAttempts', attempt.id);
    const now = new Date().toISOString();
    await setDoc(ref, {
      ...attempt,
      attemptedAt: now,
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function saveUserNote(userId: string, noteId: string, lessonId: string, lessonTitle: string, content: string) {
  const path = `users/${userId}/notes/${noteId}`;
  try {
    const ref = doc(db, 'users', userId, 'notes', noteId);
    const now = new Date().toISOString();
    await setDoc(ref, {
      id: noteId,
      lessonId,
      lessonTitle,
      content,
      updatedAt: now,
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function deleteUserNote(userId: string, noteId: string) {
  const path = `users/${userId}/notes/${noteId}`;
  try {
    const ref = doc(db, 'users', userId, 'notes', noteId);
    await deleteDoc(ref);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

export async function saveUserBookmark(userId: string, bookmark: { id: string; targetType: string; targetId: string; title: string; category: string }) {
  const path = `users/${userId}/bookmarks/${bookmark.id}`;
  try {
    const ref = doc(db, 'users', userId, 'bookmarks', bookmark.id);
    const now = new Date().toISOString();
    await setDoc(ref, {
      ...bookmark,
      createdAt: now,
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function removeUserBookmark(userId: string, bookmarkId: string) {
  const path = `users/${userId}/bookmarks/${bookmarkId}`;
  try {
    const ref = doc(db, 'users', userId, 'bookmarks', bookmarkId);
    await deleteDoc(ref);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

export async function saveUserPreferences(userId: string, prefs: { theme: string; editorFontSize?: number; autoRunCode?: boolean }) {
  const path = `users/${userId}/settings/preferences`;
  try {
    const ref = doc(db, 'users', userId, 'settings', 'preferences');
    await setDoc(ref, prefs, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function loadUserData(userId: string) {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    const progressSnapshot = await getDocs(collection(db, 'users', userId, 'progress'));
    const quizSnapshot = await getDocs(collection(db, 'users', userId, 'quizAttempts'));
    const notesSnapshot = await getDocs(collection(db, 'users', userId, 'notes'));
    const bookmarksSnapshot = await getDocs(collection(db, 'users', userId, 'bookmarks'));
    const prefsDoc = await getDoc(doc(db, 'users', userId, 'settings', 'preferences'));

    const progress: Record<string, any> = {};
    progressSnapshot.forEach(d => { progress[d.id] = d.data(); });

    const quizAttempts: any[] = [];
    quizSnapshot.forEach(d => { quizAttempts.push(d.data()); });

    const notes: any[] = [];
    notesSnapshot.forEach(d => { notes.push(d.data()); });

    const bookmarks: any[] = [];
    bookmarksSnapshot.forEach(d => { bookmarks.push(d.data()); });

    return {
      profile: userDoc.exists() ? userDoc.data() : null,
      progress,
      quizAttempts,
      notes,
      bookmarks,
      preferences: prefsDoc.exists() ? prefsDoc.data() : null,
    };
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, `users/${userId}/*`);
    return null;
  }
}

export async function deleteStudentAccountData(userId: string) {
  try {
    // Delete subcollections documents
    const subcollections = ['progress', 'quizAttempts', 'notes', 'bookmarks'];
    for (const sub of subcollections) {
      const snap = await getDocs(collection(db, 'users', userId, sub));
      for (const d of snap.docs) {
        await deleteDoc(d.ref);
      }
    }
    // Delete settings & user doc
    await deleteDoc(doc(db, 'users', userId, 'settings', 'preferences'));
    await deleteDoc(doc(db, 'users', userId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `users/${userId}`);
  }
}
