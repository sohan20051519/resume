import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Landing Page
  await page.goto('http://localhost:5173/');
  await page.screenshot({ path: 'jules-scratch/verification/landing_page.png' });

  // Templates Page
  await page.goto('http://localhost:5173/templates');
  await page.screenshot({ path: 'jules-scratch/verification/templates_page.png' });

  // Build Page
  await page.goto('http://localhost:5173/build');
  await page.screenshot({ path: 'jules-scratch/verification/build_page.png' });

  await browser.close();
})();
