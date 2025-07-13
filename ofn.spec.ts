import { expect } from '@playwright/test';
import { test } from '../fixtures'; // this is your customized fixture

test.describe('My OpenFin App', () => {
  
  test('should open 3 or more windows on launch', async ({ context }) => {
    const pages = await context.pages();
    expect(pages.length).toBeGreaterThanOrEqual(3);
  });

  test('should retrieve OpenFin runtime version from mainWindow', async ({ mainWindow }) => {
    const runtimeVersion = await mainWindow.evaluate(async () => {
      const info = await window.fin.System.getRuntimeInfo();
      return info.version;
    });

    expect(runtimeVersion).toBeDefined();
  });

  test('should emit minimize event when clicking minimize button', async ({ mainWindow }) => {
    // Trigger minimize
    await mainWindow.click('#minimize-window');

    // Wait for OpenFin window event
    const minimizedEvent = await mainWindow.evaluate(() => {
      const currentWindow = window.fin.Window.getCurrentSync();
      return new Promise(resolve => {
        currentWindow.on('minimized', () => resolve(true));
      });
    });

    expect(minimizedEvent).toBeTruthy();
  });

});
