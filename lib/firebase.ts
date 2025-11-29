import { initializeApp, getApps, type FirebaseOptions } from 'firebase/app';
import { getAuth, type Auth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, signOut, type User } from 'firebase/auth';
import { getFirestore, type Firestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const isConfigPresent = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

if (isConfigPresent) {
  if (!getApps().length) {
    initializeApp(firebaseConfig);
  }
} else {
  // Do not initialize Firebase if env vars are missing — avoid runtime errors like invalid-api-key.
  // Consumers should call functions that check config and display helpful messages.
  console.warn('Firebase config missing: set NEXT_PUBLIC_FIREBASE_* env vars in .env.local');
}

// Debugging: print a masked view of the loaded config so developers can verify env vars
try {
  const maskedApiKey = firebaseConfig.apiKey ? `${String(firebaseConfig.apiKey).slice(0, 6)}...${String(firebaseConfig.apiKey).slice(-4)}` : '<missing>';
  console.debug('Firebase config present:', isConfigPresent);
  console.debug('Firebase config sample:', {
    apiKey: maskedApiKey,
    projectId: firebaseConfig.projectId || '<missing>',
    authDomain: firebaseConfig.authDomain || '<missing>'
  });
} catch (e) {
  // swallow any logging errors
}

export const auth: Auth | null = isConfigPresent ? getAuth() : null;
export const provider: GoogleAuthProvider | null = isConfigPresent ? new GoogleAuthProvider() : null;
export const db: Firestore | null = isConfigPresent ? getFirestore() : null;

function ensureConfigured(): void {
  if (!isConfigPresent) {
    throw new Error(
      'Firebase is not configured. Add NEXT_PUBLIC_FIREBASE_API_KEY and NEXT_PUBLIC_FIREBASE_PROJECT_ID to your .env.local and restart the dev server.'
    );
  }
}

export async function signInWithGoogleAndSave(): Promise<User | null> {
  if (!auth || !provider || !db) {
    ensureConfigured();
  }
  const _auth = auth as Auth;
  const _provider = provider as GoogleAuthProvider;
  const _db = db as Firestore;

  const result = await signInWithPopup(_auth, _provider);
  const user = result.user as User | null;

  if (!user) return null;

  // Save basic user information to Firestore (users collection)
  try {
    await setDoc(doc(_db, 'users', user.uid), {
      uid: user.uid,
      name: user.displayName || null,
      email: user.email || null,
      photoURL: user.photoURL || null,
      providerId: user.providerId || 'google',
      lastSeen: serverTimestamp(),
    }, { merge: true });
  } catch (err) {
    console.error('Error saving user to Firestore:', err);
  }

  // Safe debug: log a masked user identifier and basic non-sensitive info for devs
  try {
    const safeUid = user.uid ? `${String(user.uid).slice(0, 6)}...` : '<no-uid>';
    console.debug('Firebase sign-in success:', { uid: safeUid, displayName: user.displayName || null, email: user.email || null });
  } catch (e) {
    // ignore logging errors
  }

  return user;
}

export async function signInWithGoogleRedirect(): Promise<void> {
  if (!auth || !provider) ensureConfigured();
  const _auth = auth as Auth;
  const _provider = provider as GoogleAuthProvider;
  await signInWithRedirect(_auth, _provider);
}

export async function processRedirectResult(): Promise<User | null> {
  if (!auth) return null;
  try {
    const result = await getRedirectResult(auth as Auth);
    const user = result?.user || null;
    if (user) {
      // Save basic user information as with popup flow
      try {
        const _db = db as Firestore;
        await setDoc(doc(_db, 'users', user.uid), {
          uid: user.uid,
          name: user.displayName || null,
          email: user.email || null,
          photoURL: user.photoURL || null,
          providerId: user.providerId || 'google',
          lastSeen: serverTimestamp(),
        }, { merge: true });
      } catch (err) {
        console.error('Error saving redirected user to Firestore:', err);
      }
    }
    return user;
  } catch (err) {
    // getRedirectResult throws if no redirect result — swallow for normal cases
    console.debug('No redirect sign-in result or error processing redirect result', err);
    return null;
  }
}

export async function signOutUser() {
  if (!auth) ensureConfigured();
  await signOut(auth as Auth);
}
