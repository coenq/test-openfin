import { chromium, Page } from 'playwright';
import { test as base } from '@playwright/test';
export * from './openfinGlobal';

const RUNTIME_ADDRESS = 'http://localhost:9001'; // Match your OpenFin remote-debugging-port

interface IPlaywrightFixtures {
  mainWindow: Page;
}

export const test = base.extend<IPlaywrightFixtures>({
  browser: async ({}, use) => {
    const browser = await chromium.connectOverCDP(RUNTIME_ADDRESS);
    await use(browser);
  },

  context: async ({ browser }, use) => {
    const [context] = browser.contexts();
    await use(context);
  },

  mainWindow: async ({ context }, use) => {
    const pages = await context.pages();
    const mainWindow = pages[0]; // or find by title or url
    if (!mainWindow) throw new Error('Main Window not found');
    await use(mainWindow);
  },
});
