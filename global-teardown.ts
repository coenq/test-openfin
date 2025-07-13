import fs from 'fs';
import path from 'path';

const PID_FILE = path.resolve(__dirname, './openfin.pid');

export default async function globalTeardown() {
  console.log('🧹 [globalTeardown] Running cleanup...');

  if (!fs.existsSync(PID_FILE)) {
    console.warn('⚠️ No PID file found. Nothing to clean up.');
    return;
  }

  const pidRaw = fs.readFileSync(PID_FILE, 'utf-8');
  const pid = parseInt(pidRaw, 10);

  if (!isNaN(pid)) {
    try {
      process.kill(pid, 'SIGTERM');
      console.log(`✅ Killed OpenFin process with PID ${pid}`);
    } catch (err) {
      console.error(`❌ Failed to kill process ${pid}:`, err);
    }
  } else {
    console.warn(`⚠️ Invalid PID in file: "${pidRaw}"`);
  }

  fs.unlinkSync(PID_FILE);
}
