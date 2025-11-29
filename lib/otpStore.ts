type OTPRecord = {
  salt: string;
  hashed: string;
  expiresAt: number;
  lastSent: number;
  sends: number;
  used: boolean;
};

const store = new Map<string, OTPRecord>();

// Persist in dev to os.tmpdir so OTPs survive across dev worker restarts
const shouldPersist = process.env.NODE_ENV !== 'production';
let persistPath: string | null = null;
let fsSync: typeof import('fs') | null = null;
if (shouldPersist) {
  try {
    const os = await import('os');
    const path = await import('path');
    persistPath = path.join(os.tmpdir(), 'website-company-otp.json');
    const fs = await import('fs');
    fsSync = fs;
    if (fs.existsSync(persistPath)) {
      try {
        const raw = fs.readFileSync(persistPath, 'utf8');
        const obj = JSON.parse(raw) as Record<string, OTPRecord>;
        for (const [k, v] of Object.entries(obj)) store.set(k, v);
      } catch {
        // ignore parse errors
      }
    }
  } catch {
    persistPath = null;
  }
}

function persistStore() {
  if (!shouldPersist || !persistPath) return;
  try {
    // write whole store atomically
    if (!fsSync) return;
    const obj: Record<string, OTPRecord> = {};
    for (const [k, v] of store.entries()) obj[k] = v;
    fsSync.writeFileSync(persistPath!, JSON.stringify(obj), { encoding: 'utf8' });
  } catch {
    // ignore persistence failures in dev
  }
}

export function setOtp(key: string, rec: OTPRecord) {
  store.set(key, rec);
  persistStore();
}

export function getOtp(key: string): OTPRecord | undefined {
  return store.get(key);
}

export function markUsed(key: string) {
  const r = store.get(key);
  if (r) {
    r.used = true;
    store.set(key, r);
    persistStore();
  }
}

export function clearOtp(key: string) {
  store.delete(key);
  persistStore();
}
