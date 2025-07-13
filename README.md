To launch and close your OpenFin app before and after all Playwright tests using the app.json config, you can add beforeAll and afterAll hooks in your fixture.ts (or inside your test file, if you prefer).

Here's how you can do it using Node.js child_process to start and kill the OpenFin runtime.

