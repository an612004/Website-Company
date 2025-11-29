import admin from 'firebase-admin';

let app: admin.app.App | null = null;

export function getServiceAccount(): admin.ServiceAccount | null {
  const json = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!json) return null;
  try {
    return JSON.parse(json) as admin.ServiceAccount;
  } catch {
    try {
      // maybe base64 encoded
      const decoded = Buffer.from(json, 'base64').toString('utf8');
      return JSON.parse(decoded) as admin.ServiceAccount;
    } catch {
      console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT');
      return null;
    }
  }
}

export function getAdmin(): admin.app.App {
  if (app) return app;
  const svc = getServiceAccount();
  if (!svc) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT not configured');
  }
  app = admin.initializeApp({ credential: admin.credential.cert(svc) });
  return app;
}

export default getAdmin;
