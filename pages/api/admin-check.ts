import type { NextApiRequest, NextApiResponse } from 'next';
import { getAdmin } from '../../lib/firebaseAdmin';

type Resp = { success: boolean; message?: string; tokenHint?: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Resp>) {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ success: false, message: 'Forbidden in production' });
  }

  const secret = process.env.ADMIN_PASSWORD;
  const provided = req.headers['x-debug-secret'];
  if (secret && (!provided || String(provided) !== secret)) {
    return res.status(401).json({ success: false, message: 'Missing or invalid debug secret' });
  }

  try {
    const adminApp = getAdmin();
    // attempt to create a short-lived custom token to verify admin permissions
    const token = await adminApp.auth().createCustomToken('diag-uid-' + Date.now());
    return res.status(200).json({ success: true, message: 'Admin SDK ok', tokenHint: `len=${String(token).length}` });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    // surface error (dev only)
    return res.status(500).json({ success: false, message: `Admin SDK error: ${msg}` });
  }
}
