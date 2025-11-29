import { useEffect, useState, useCallback } from 'react';
import { onAuthStateChanged, type User, type Auth } from 'firebase/auth';
import { auth, signInWithGoogleAndSave, signOutUser, signInWithGoogleRedirect, processRedirectResult } from '../../lib/firebase';

export default function useFirebaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setUser(null);
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth as Auth, (u) => {
      setUser(u);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Process redirect result (if using redirect sign-in flow)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const redirectedUser = await processRedirectResult();
        if (mounted && redirectedUser) {
          setUser(redirectedUser as User);
        }
      } catch (e) {
        console.error('Error processing redirect result', e);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const signInWithGoogle = useCallback(async () => {
    return await signInWithGoogleAndSave();
  }, []);

  const signOut = useCallback(async () => {
    await signOutUser();
  }, []);

  const signInWithGoogleRedirectClient = useCallback(async () => {
    return await signInWithGoogleRedirect();
  }, []);

  return { user, loading, signInWithGoogle, signInWithGoogleRedirect: signInWithGoogleRedirectClient, signOut };
}
