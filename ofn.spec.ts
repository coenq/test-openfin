// tests/openfin.spec.ts
import { test, expect } from '../fixtures';
import { spawn, ChildProcess } from 'child_process';
import path from 'path';

let openfinProcess: ChildProcess | null = null;
const APP_JSON_PATH = path.resolve(__dirname, '../your-app/app.json');

test.beforeAll(async () => {
  console.log('Launching OpenFin...');
  openfinProcess = spawn('openfin', ['--launch', APP_JSON_PATH], {
    detached: true,
    stdio: 'ignore',
  });

  // Wait a few seconds to allow app to boot
  await new Promise(resolve => setTimeout(resolve, 5000));
});

test.afterAll(async () => {
  if (openfinProcess && openfinProcess.pid) {
    console.log('Closing OpenFin...');
    process.kill(-openfinProcess.pid);
  } else {
    console.warn('OpenFin process not found or already closed.');
  }
});

test('should open 3 or more windows on launch', async ({ context }) => {
  const pages = await context.pages();
  expect(pages.length).toBeGreaterThanOrEqual(3);
});
