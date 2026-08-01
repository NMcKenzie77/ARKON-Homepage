import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const baseUrl = 'https://arkon-homepage-staging.up.railway.app';
const routes = ['/', '/how-it-works', '/real-estate', '/insurance', '/short-term-rentals', '/home-services', '/salons', '/garages', '/privacy', '/terms', '/data-security', '/contact'];
const results = [];

await mkdir('mobile-step1-output', { recursive: true });
const browser = await chromium.launch({ headless: true });

try {
  for (const route of routes) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
    const consoleErrors = [];
    page.on('console', message => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });

    const response = await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle', timeout: 60000 });
    await page.locator('.cookie-banner').getByRole('button', { name: 'Reject nonessential' }).click().catch(() => {});

    const button = page.getByRole('button', { name: 'Open site menu' });
    const menuButtonCount = await button.count();
    let menuVisible = false;
    let firstLinkFocused = false;
    let escapeClosed = false;

    if (menuButtonCount === 1) {
      await button.click();
      const nav = page.getByRole('navigation', { name: 'Mobile navigation' });
      menuVisible = await nav.isVisible();
      firstLinkFocused = await page.evaluate(() => document.activeElement?.textContent?.trim() === 'How it works');
      await page.keyboard.press('Escape');
      escapeClosed = !(await nav.isVisible().catch(() => false));
    }

    const dimensions = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      bodyScrollWidth: document.body.scrollWidth,
      dashboardFontSizes: [...document.querySelectorAll('.grant-preview-tag, .grant-preview-stat span, .grant-preview-card-heading > span')]
        .slice(0, 12)
        .map(node => Number.parseFloat(getComputedStyle(node).fontSize)),
      phoneGlowWidth: document.querySelector('.auto-phone-glow')?.getBoundingClientRect().width || null
    }));

    results.push({
      route,
      status: response?.status() || 0,
      menuButtonCount,
      menuVisible,
      firstLinkFocused,
      escapeClosed,
      consoleErrors,
      ...dimensions
    });

    if (route === '/') await page.screenshot({ path: 'mobile-step1-output/home-mobile-after.png', fullPage: true });
    if (route === '/garages') await page.screenshot({ path: 'mobile-step1-output/garages-mobile-after.png', fullPage: true });
    await page.close();
  }
} finally {
  await browser.close();
}

const failures = [];
for (const result of results) {
  if (result.status !== 200) failures.push(`${result.route}: expected 200, received ${result.status}`);
  if (result.menuButtonCount !== 1) failures.push(`${result.route}: mobile menu button count ${result.menuButtonCount}`);
  if (!result.menuVisible) failures.push(`${result.route}: mobile menu did not open`);
  if (!result.firstLinkFocused) failures.push(`${result.route}: first menu link did not receive focus`);
  if (!result.escapeClosed) failures.push(`${result.route}: Escape did not close menu`);
  if (result.scrollWidth > result.clientWidth) failures.push(`${result.route}: horizontal overflow ${result.scrollWidth}/${result.clientWidth}`);
  if (result.consoleErrors.length) failures.push(`${result.route}: console errors ${result.consoleErrors.join(' | ')}`);
}

const garage = results.find(result => result.route === '/garages');
if (garage?.dashboardFontSizes.some(size => size < 9.5)) failures.push(`/garages: dashboard font below 9.5px (${garage.dashboardFontSizes.join(', ')})`);
if (garage?.phoneGlowWidth && garage.phoneGlowWidth > 350) failures.push(`/garages: phone glow remains too wide (${garage.phoneGlowWidth}px)`);

await writeFile('mobile-step1-output/results.json', JSON.stringify({ results, failures }, null, 2));
await writeFile(
  'mobile-step1-output/summary.md',
  `# Mobile Step 1 Validation\n\n${failures.length ? failures.map(item => `- FAIL: ${item}`).join('\n') : '- PASS: Mobile menu opens on all routes, Escape closes it, first-link focus works, no route overflows horizontally, and Auto Repair dashboard text is readable.'}\n`
);

console.log(JSON.stringify({ results, failures }, null, 2));
if (failures.length) process.exitCode = 1;
