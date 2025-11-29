import type { NextApiRequest, NextApiResponse } from 'next';
import { getAdmin, getServiceAccount } from '../../lib/firebaseAdmin';
import crypto from 'crypto';
import type admin from 'firebase-admin';
import { getOtp, markUsed, clearOtp } from '../../lib/otpStore';

type Data = { success: boolean; message?: string; token?: string; note?: string };

type OTPRecord = {
  salt?: string;
  hashed?: string;
  expiresAt?: number;
  used?: boolean;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method not allowed' });

  let { email, code } = req.body as { email?: string; code?: string };
  if (!email || !code) return res.status(400).json({ success: false, message: 'Email and code required' });
  // normalize inputs to avoid mismatches (case or stray spaces)
  email = email.trim().toLowerCase();
  code = String(code).trim();

  // dev logging: show incoming request (mask code for safety)
  if (process.env.NODE_ENV !== 'production') {
    try {
      console.info('verify-otp request', { email, code: code.replace(/./g, '*') });
    } catch {}
  }

  let adminApp: admin.app.App | null = null;
  let firestore: admin.firestore.Firestore | null = null;
  let useFallback = false;
  try {
    adminApp = getAdmin();
    firestore = adminApp.firestore();
  } catch {
    useFallback = true;
    console.warn('Firebase Admin not available — using in-memory OTP store for verify');
  }
  const key = Buffer.from(email).toString('base64');
  const docRef = !useFallback ? firestore!.collection('email_otps').doc(key) : null;

  try {
    let data: OTPRecord | undefined;
    if (!useFallback) {
      const snap = await docRef!.get();
      if (!snap.exists) {
        // Try in-memory as a fallback (helps when Firestore write succeeded locally but read fails,
        // or when send-otp wrote to in-memory after a failed Firestore write).
        const mem = getOtp(key);
        if (mem) {
          console.info('verify-otp: using in-memory fallback record for', email);
          data = mem as OTPRecord;
        } else {
          console.warn('verify-otp: no firestore record and no in-memory fallback for', email);
          return res.status(400).json({ success: false, message: 'No code sent' });
        }
      } else {
        data = snap.data() as OTPRecord;
      }
    } else {
      data = getOtp(key);
      if (!data) {
        console.warn('verify-otp: no in-memory record for', email);
        return res.status(400).json({ success: false, message: 'No code sent' });
      }
    }
    if (data.used) {
      console.warn('verify-otp: code already used for', email);
      return res.status(400).json({ success: false, message: 'Code already used' });
    }
    const now = Date.now();
    if ((data.expiresAt || 0) < now) {
      console.warn('verify-otp: code expired for', email, { expiresAt: data.expiresAt, now });
      return res.status(400).json({ success: false, message: 'Code expired' });
    }

    const hashedAttempt = crypto.createHash('sha256').update((data.salt || '') + code).digest('hex');
    if (hashedAttempt !== data.hashed) {
      console.warn('verify-otp: invalid code attempt for', email);
      return res.status(400).json({ success: false, message: 'Invalid code' });
    }

    // mark used
    if (!useFallback) {
      await docRef!.set({ used: true }, { merge: true });
    } else {
      markUsed(key);
      // optional: clear after use
      clearOtp(key);
    }

    // create (or get) user and mint custom token
    if (useFallback) {
      // In fallback mode we can't mint a Firebase custom token; instead return a stub token
      return res.status(200).json({ success: true, message: 'Verified in dev fallback (no custom token issued)' });
    }

    let userRecord: admin.auth.UserRecord;
    try {
      userRecord = await adminApp!.auth().getUserByEmail(email);
    } catch {
      userRecord = await adminApp!.auth().createUser({ email, emailVerified: true });
    }

    try {
      const token = await adminApp!.auth().createCustomToken(userRecord.uid);
      return res.status(200).json({ success: true, token });
    } catch (createErr) {
      // If admin SDK fails due to restricted operation, try to create the custom token
      // manually using the service account private key (if available). This allows
      // signing the token without requiring extra IAM permissions.
      const createMsg = createErr instanceof Error ? createErr.message : String(createErr);
      const loweredCreateMsg = String(createMsg).toLowerCase();
      if (loweredCreateMsg.includes('admin-restricted-operation') || loweredCreateMsg.includes('permission')) {
        const sa = getServiceAccount();
        if (sa) {
          const saObj = sa as unknown as Record<string, unknown>;
          const privateKey = typeof saObj['private_key'] === 'string' ? String(saObj['private_key']) : (typeof saObj['privateKey'] === 'string' ? String(saObj['privateKey']) : undefined);
          const clientEmail = typeof saObj['client_email'] === 'string' ? String(saObj['client_email']) : (typeof saObj['clientEmail'] === 'string' ? String(saObj['clientEmail']) : undefined);
          if (privateKey && clientEmail) {
            try {
              const base64url = (input: string | Buffer) => Buffer.from(input).toString('base64').replace(/=+$/g, '').replace(/\+/g, '-').replace(/\//g, '_');
              const header = { alg: 'RS256', typ: 'JWT' };
              const iat = Math.floor(Date.now() / 1000);
              const exp = iat + 60 * 60; // 1 hour
              const payload: Record<string, unknown> = {
                iss: clientEmail,
                sub: clientEmail,
                aud: 'https://identitytoolkit.googleapis.com/google.identity.identitytoolkit.v1.IdentityToolkit',
                iat,
                exp,
                uid: userRecord.uid,
              };
              const signingInput = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(payload))}`;
              const signer = crypto.createSign('RSA-SHA256');
              signer.update(signingInput);
              const sig = signer.sign(privateKey, 'base64');
              const signed = sig.replace(/=+$/g, '').replace(/\+/g, '-').replace(/\//g, '_');
              const customToken = `${signingInput}.${signed}`;
              return res.status(200).json({ success: true, token: customToken, note: 'Token created via service account fallback' });
            } catch (signErr) {
              console.error('Manual token signing failed', signErr);
              const guidance = process.env.NODE_ENV === 'production'
                ? 'Internal server error'
                : `Failed to create custom token manually: ${signErr instanceof Error ? signErr.message : String(signErr)}`;
              return res.status(500).json({ success: false, message: guidance });
            }
          }
        }
      }
      throw createErr;
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('verify-otp error', err);

    // Detect common admin-related permission problems and return actionable guidance in dev
    const lowered = String(msg).toLowerCase();
    if (lowered.includes('admin-restricted-operation') || lowered.includes('admin only') || lowered.includes('permission')) {
      const guidance = process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : 'Admin permission error: Verify your FIREBASE_SERVICE_ACCOUNT JSON contains a valid service account with private_key and client_email, and has sufficient permissions (Firebase Admin / Editor).';
      return res.status(500).json({ success: false, message: guidance });
    }

    const safeMessage = process.env.NODE_ENV === 'production' ? 'Internal error' : `Internal error: ${msg}`;
    return res.status(500).json({ success: false, message: safeMessage });
  }
}
