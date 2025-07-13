import { chromium, Page } from 'playwright';
import { test as base } from '@playwright/test';
import { spawn, ChildProcess } from 'child_process';
import path from 'path';
export * from './openfinGlobal';

const RUNTIME_ADDRESS = 'http://localhost:9001';
const APP_JSON_PATH = path.resolve(__dirname, '../your-app/app.json'); // adjust this path

let openfinProcess: ChildProcess | null = null;

interface IPlaywrightFixtures {
  mainWindow: Page;
}

export const test = base.extend<IPlaywrightFixtures>({
  browser: async ({}, use) => {
    const runtimeConnection = await chromium.connectOverCDP(RUNTIME_ADDRESS);
    await use(runtimeConnection);
  },

  context: async ({ browser }, use) => {
    const [context] = browser.contexts();
    await use(context);
  },

  mainWindow: async ({ context }, use) => {
    const pages = await context.pages();
    const mainWindowPage = pages[0];
    if (!mainWindowPage) throw new Error('Main Window not found!');
    await use(mainWindowPage);
  },

  // Global setup/teardown for OpenFin
  // `beforeAll` and `afterAll` run once across the test suite
  // If you want these only in the test file, move them there instead
}).beforeAll(async () => {
  console.log('Launching OpenFin...');
  openfinProcess = spawn('openfin', ['--launch', APP_JSON_PATH], {
    detached: true,
    stdio: 'ignore'
  });
  await new Promise(resolve => setTimeout(resolve, 5000)); // wait for app to launch
}).afterAll(async () => {
  if (openfinProcess) {
    console.log('Closing OpenFin...');
    process.kill(-openfinProcess.pid); // kills the process group
  }
});
