import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const APP_JSON_PATH = path.resolve(__dirname, './your-app/app.json');
const PID_FILE = path.resolve(__dirname, './openfin.pid');

export default async function globalSetup() {
  const openfinProcess = spawn('openfin', ['--launch', APP_JSON_PATH], {
    detached: true,
    stdio: 'ignore',
  });

  fs.writeFileSync(PID_FILE, openfinProcess.pid?.toString() ?? '');
  await new Promise(resolve => setTimeout(resolve, 5000));
}
