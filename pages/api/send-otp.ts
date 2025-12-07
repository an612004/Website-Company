import type { NextApiRequest, NextApiResponse } from 'next';
import { getAdmin } from '../../lib/firebaseAdmin';
import type admin from 'firebase-admin';
import { setOtp, getOtp } from '../../lib/otpStore';
import crypto from 'crypto';
import sgMail from '@sendgrid/mail';

type Data = { success: boolean; message?: string; code?: string };

type OTPRecord = {
  salt: string;
  hashed: string;
  expiresAt: number;
  lastSent: number;
  sends: number;
  used: boolean;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method not allowed' });

  let { email } = req.body as { email?: string };
  if (!email || typeof email !== 'string') return res.status(400).json({ success: false, message: 'Email required' });
  // normalize email input to avoid case/whitespace mismatches
  email = email.trim().toLowerCase();

  let adminApp: admin.app.App | undefined;
  let firestore: admin.firestore.Firestore | undefined;
  let useFallback = false;
  try {
    adminApp = getAdmin();
    firestore = adminApp.firestore();
  } catch {
    useFallback = true;
    console.warn('Firebase Admin not available, using in-memory fallback for OTP');
  }

  // basic rate-limiting: count sends in last hour
  const key = Buffer.from(email).toString('base64');
  const docRef = !useFallback && firestore ? firestore.collection('email_otps').doc(key) : null;

  const now = Date.now();
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const salt = crypto.randomBytes(8).toString('hex');
  const hashed = crypto.createHash('sha256').update(salt + code).digest('hex');
  const ttl = Number(process.env.OTP_CODE_TTL || 300) * 1000;

  try {
    let prevData: OTPRecord | undefined = undefined;
    if (!useFallback && docRef) {
      const prev = await docRef.get();
      prevData = prev.exists ? (prev.data() as OTPRecord) : undefined;
      if (prevData) {
        const lastSent = prevData.lastSent || 0;
        const sends = prevData.sends || 0;
        // limit to 5 per hour by default
        const rateLimit = Number(process.env.OTP_RATE_LIMIT || 5);
        if (now - lastSent < 60 * 60 * 1000 && sends >= rateLimit) {
          return res.status(429).json({ success: false, message: 'Rate limit exceeded' });
        }
      }

      // save OTP record to Firestore; if write fails, fall back to in-memory
      try {
        await docRef.set({
          salt,
          hashed,
          expiresAt: now + ttl,
          lastSent: now,
          sends: ((prevData && prevData.sends) || 0) + 1,
          used: false,
        }, { merge: true });
        // also keep an in-memory copy for faster dev fallback
        setOtp(key, {
          salt,
          hashed,
          expiresAt: now + ttl,
          lastSent: now,
          sends: ((prevData && prevData.sends) || 0) + 1,
          used: false,
        });
      } catch (writeErr) {
        console.warn('Firestore write failed, falling back to in-memory OTP store', writeErr);
        setOtp(key, {
          salt,
          hashed,
          expiresAt: now + ttl,
          lastSent: now,
          sends: ((prevData && prevData.sends) || 0) + 1,
          used: false,
        });
      }
    } else {
      // in-memory fallback
      const existing = getOtp(key);
      if (existing) {
        const lastSent = existing.lastSent || 0;
        const sends = existing.sends || 0;
        const rateLimit = Number(process.env.OTP_RATE_LIMIT || 5);
        if (now - lastSent < 60 * 60 * 1000 && sends >= rateLimit) {
          return res.status(429).json({ success: false, message: 'Rate limit exceeded' });
        }
      }
      setOtp(key, {
        salt,
        hashed,
        expiresAt: now + ttl,
        lastSent: now,
        sends: ((existing && existing.sends) || 0) + 1,
        used: false,
      });
    }

      // send email via SMTP (Gmail) or SendGrid
      const sendgridKey = process.env.SENDGRID_API_KEY;
      let devCodeToReturn: string | undefined = undefined;
      // In development, always log the plain OTP for easier testing and return it in the response
      if (process.env.NODE_ENV !== 'production') {
        console.info(`DEV OTP for ${email}: ${code}`);
        devCodeToReturn = code;
      }
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      // Use Gmail SMTP via nodemailer if configured
      try {
        const nodemailer = await import('nodemailer');
        const rawPass = process.env.GMAIL_APP_PASSWORD || '';
        const gmailPass = rawPass.replace(/\s+/g, '');
        // basic validation for app password (16 chars)
        if (!gmailPass || gmailPass.length !== 16) {
          const msg = `GMAIL_APP_PASSWORD seems invalid (length ${gmailPass.length}). Ensure you set a 16-character App Password (no spaces).`;
          console.error(msg);
          if (process.env.NODE_ENV !== 'production') {
            return res.status(500).json({ success: false, message: msg });
          }
          throw new Error(msg);
        }
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.GMAIL_USER,
            pass: gmailPass,
          },
        });
        console.info(`Sending OTP via Gmail SMTP for ${process.env.GMAIL_USER} (app-pass mask: ${gmailPass.slice(0,4)}...${gmailPass.slice(-4)})`);
        await transporter.sendMail({
          from: process.env.SENDGRID_FROM_EMAIL || process.env.GMAIL_USER,
          to: email,
          subject: 'Mã xác thực đăng nhập - Anbi',
          text: `Mã xác thực của bạn là: ${code}. Mã sẽ hết hạn trong ${Math.floor(ttl / 60000)} phút. Không chia sẻ mã này cho bất kỳ ai!`,
          html: `
            <div style="font-family:Segoe UI,Arial,sans-serif;background:#f8fafc;padding:32px 0;text-align:center;">
              <div style="max-width:420px;margin:auto;background:#fff;border-radius:16px;box-shadow:0 4px 24px rgba(0,0,0,0.08);padding:32px 24px;">
                <img src='https://res.cloudinary.com/dg6pbubrz/image/upload/v1764504642/logi_Anbi_owe5c2.png' alt='Anbi Company' style='height:40px;margin-bottom:16px;' />
                <h2 style="color:#ff6600;font-size:22px;margin-bottom:12px;">Xác thực đăng nhập</h2>
                <p style="font-size:16px;color:#222;margin-bottom:18px;">Mã xác thực của bạn:</p>
                <div style="font-size:32px;font-weight:700;letter-spacing:8px;color:#2563eb;background:#f1f5f9;border-radius:8px;display:inline-block;padding:12px 32px;margin-bottom:18px;">${code}</div>
                <p style="font-size:15px;color:#555;margin-bottom:8px;">Mã sẽ hết hạn trong <b style='color:#e11d48'>${Math.floor(ttl / 60000)} phút</b>.</p>
                <p style="font-size:13px;color:#e11d48;margin-bottom:8px;">Không chia sẻ mã này cho bất kỳ ai!</p>
                <hr style="margin:24px 0;border:none;border-top:1px solid #e5e7eb;" />
                <p style="font-size:12px;color:#888;">Anbi Company - Bảo mật & tiện lợi</p>
              </div>
            </div>
          `,
        });
      } catch (smtpErr: unknown) {
        console.error('SMTP send error', smtpErr);
        // If in development, return the SMTP error message in the response for debugging
        if (process.env.NODE_ENV !== 'production') {
          const smtpMsg = smtpErr instanceof Error ? smtpErr.message : String(smtpErr);
          return res.status(500).json({ success: false, message: `SMTP error: ${smtpMsg}` });
        }
        // In production rethrow so outer catch handles it
        throw smtpErr;
      }
    } else if (!sendgridKey) {
      // no SendGrid configured — in dev fallback we log the code so developer can copy it
      console.warn('SENDGRID_API_KEY not configured — logging OTP to console for dev');
      console.info(`OTP for ${email}: ${code}`);
      // return the code in response for easier local testing (only when SendGrid absent)
      if (process.env.NODE_ENV !== 'production') {
        devCodeToReturn = code;
      }
    } else {
      sgMail.setApiKey(sendgridKey);
      const msg = {
        to: email,
        from: process.env.SENDGRID_FROM_EMAIL || 'no-reply@example.com',
        subject: 'Your sign-in code',
        text: `Your verification code is: ${code}. It expires in ${Math.floor(ttl / 60000)} minutes.`,
        html: `<p>Your verification code is: <strong>${code}</strong></p><p>It expires in ${Math.floor(ttl / 60000)} minutes.</p>`,
      };
      await sgMail.send(msg);
    }

    return res.status(200).json(devCodeToReturn ? { success: true, code: devCodeToReturn } : { success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('send-otp error', err);
    const safeMessage = process.env.NODE_ENV === 'production' ? 'Internal error' : `Internal error: ${msg}`;
    return res.status(500).json({ success: false, message: safeMessage });
  }
}
