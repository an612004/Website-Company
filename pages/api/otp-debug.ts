import type { NextApiRequest, NextApiResponse } from 'next';
import { getOtp } from '../../lib/otpStore';
import { getAdmin } from '../../lib/firebaseAdmin';

type DebugResp = {
  success: boolean;
  message?: string;
  inMemory?: Record<string, unknown> | null;
  firestore?: Record<string, unknown> | null;
  firestoreError?: string | null;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<DebugResp>) {
  // Dev-only guard
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ success: false, message: 'Forbidden in production' });
  }

  // Optional secret guard
  const secret = process.env.ADMIN_PASSWORD;
  const provided = req.headers['x-debug-secret'];
  if (secret && (!provided || String(provided) !== secret)) {
    return res.status(401).json({ success: false, message: 'Missing or invalid debug secret' });
  }

  const email = typeof req.query.email === 'string' ? req.query.email : undefined;
  if (!email) return res.status(400).json({ success: false, message: 'email query required' });

  const key = Buffer.from(email).toString('base64');

  // in-memory
  const inMemory = getOtp(key) || null;

  // attempt firestore read
  let firestoreRecord: Record<string, unknown> | null = null;
  let firestoreError: string | null = null;
  try {
    const adminApp = getAdmin();
    const firestore = adminApp.firestore();
    const doc = await firestore.collection('email_otps').doc(key).get();
    if (doc.exists) {
      const data = doc.data() || {};
      // mask hashed/salt a bit
      const masked = { ...data } as Record<string, unknown>;
      if (typeof masked.hashed === 'string') masked.hashed = `${masked.hashed.slice(0, 6)}...(${masked.hashed.length})`;
      if (typeof masked.salt === 'string') masked.salt = `${masked.salt.slice(0, 6)}...(${masked.salt.length})`;
      firestoreRecord = masked;
    }
  } catch (e) {
    // Admin not configured or other error — leave firestoreRecord null but return warning
    // Log full error to server logs for debugging (do not expose private keys)
    console.error('otp-debug: firestore unavailable', e);
    firestoreError = e instanceof Error ? e.message : String(e);
  }

  return res.status(200).json({ success: true, inMemory, firestore: firestoreRecord, firestoreError });
}
