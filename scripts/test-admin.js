/*
  Quick admin SDK test script.
  Usage (PowerShell):
    # set FIREBASE_SERVICE_ACCOUNT in current session (example for base64):
    # $env:FIREBASE_SERVICE_ACCOUNT = Get-Content .\sa.json -Raw | ConvertTo-Base64String # or use earlier base64 command
    node ./scripts/test-admin.js
*/

let admin;

function parseServiceAccount(envVal) {
  if (!envVal) return null;
  try {
    return JSON.parse(envVal);
  } catch {
    try {
      const decoded = Buffer.from(envVal, 'base64').toString('utf8');
      return JSON.parse(decoded);
    } catch {
      return null;
    }
  }
}

async function main() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  const sa = parseServiceAccount(raw);
  if (!sa) {
    console.error('FIREBASE_SERVICE_ACCOUNT not found or invalid in this session.');
    process.exitCode = 2;
    return;
  }

  console.log('Service account preview:');
  console.log('  project_id:', sa.project_id || sa.projectId);
  console.log('  client_email:', sa.client_email || sa.clientEmail);

  try {
    // dynamic import to avoid forbidden require() in lint rules
    admin = (await import('firebase-admin')).default || (await import('firebase-admin'));
    admin.initializeApp({ credential: admin.credential.cert(sa) });
    const auth = admin.auth();

    console.log('\nCalling admin.auth().listUsers(1) to verify Admin SDK access...');
    try {
      const list = await auth.listUsers(1);
      console.log('listUsers OK. returned users:', (list.users || []).length);
    } catch (err) {
      console.error('listUsers error:', err && err.code ? `${err.code} - ${err.message}` : String(err));
    }

    console.log('\nCreating a custom token for uid=test-uid...');
    try {
      const token = await auth.createCustomToken('test-uid');
      console.log('createCustomToken OK. token length:', token.length);
    } catch (err) {
      console.error('createCustomToken error:', err && err.code ? `${err.code} - ${err.message}` : String(err));
    }
    } catch (initErr) {
      console.error('Admin SDK initialization failed:', initErr && initErr.message ? initErr.message : String(initErr));
      process.exitCode = 3;
    }
}

main().catch(e => {
  console.error('Unexpected error', e);
  process.exitCode = 1;
});
