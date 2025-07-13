import fs from 'fs';
import path from 'path';

const PID_FILE = path.resolve(__dirname, './openfin.pid');

export default async function globalTeardown() {
  if (fs.existsSync(PID_FILE)) {
    const pid = parseInt(fs.readFileSync(PID_FILE, 'utf-8'), 10);
    if (!isNaN(pid)) {
      process.kill(-pid);
      fs.unlinkSync(PID_FILE);
    }
  }
}
