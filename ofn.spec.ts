// tests/openfin.spec.ts
import { test, expect } from '../fixtures';
import { spawn, ChildProcess } from 'child_process';
import path from 'path';

let openfinProcess: ChildProcess | null = null;
const APP_JSON_PATH = path.resolve(__dirname, '../your-app/app.json');

test.beforeAll(async () => {
  console.log('🚀 Launching OpenFin...');
  openfinProcess = spawn('openfin', ['--launch', APP_JSON_PATH], {
    detached: true,
    stdio: 'ignore',
    shell: true // Required on Windows for openfin.cmd
  });

  await new Promise(resolve => setTimeout(resolve, 5000)); // wait for OpenFin to load
});

test.afterAll(async () => {
  if (openfinProcess?.pid) {
    console.log('🧹 Closing OpenFin...');
    try {
      process.kill(-openfinProcess.pid);
      console.log('✅ OpenFin closed.');
    } catch (err) {
      console.warn('⚠️ Could not kill OpenFin:', err);
    }
  } else {
    console.warn('⚠️ OpenFin process not found or already closed.');
  }
});

test('minimize main window and log window names', async ({ context }) => {
  const pages = await context.pages();
  expect(pages.length).toBeGreaterThanOrEqual(3);

  // 🔍 Find the main window — adjust URL match if needed
  const mainWindow = pages.find(p => p.url().includes('index.html'));
  if (!mainWindow) throw new Error('❌ Main window not found.');

  // 🖱️ Click minimize button (adjust selector if needed)
  await mainWindow.click('#minimize-window');

  // ✅ Wait for the window to actually minimize
  const minimized = await mainWindow.evaluate(() => {
    const win = fin.Window.getCurrentSync();
    return new Promise<boolean>(resolve => {
      win.once('minimized', () => resolve(true));
    });
  });
  expect(minimized).toBe(true);
  console.log('✅ Main window was minimized.');

  // 📋 Log all OpenFin window names
  const windowNames = await mainWindow.evaluate(async () => {
    const windows = await fin.System.getAllWindows();
    return windows.map(w => w.name);
  });

  console.log('🪟 OpenFin Window Names:', windowNames);
});
