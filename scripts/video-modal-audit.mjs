import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';

const baseUrl = 'https://arkon-homepage-staging.up.railway.app';
await mkdir('video-modal-output', { recursive: true });

const browser = await chromium.launch({ headless: true });
const results = [];

try {
  for (const viewport of [
    { name: 'desktop', width: 1440, height: 900 },
    { name: 'mobile', width: 390, height: 844 }
  ]) {
    const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
    const errors = [];
    page.on('console', message => {
      if (message.type() === 'error') errors.push(message.text());
    });

    const response = await page.goto(baseUrl, { waitUntil: 'networkidle', timeout: 60000 });
    await page.locator('.cookie-banner').getByRole('button', { name: 'Reject nonessential' }).click().catch(() => {});

    const initialIframeCount = await page.locator('.homepage-video-frame iframe').count();
    const sectionBox = await page.locator('.homepage-video-section').boundingBox();
    const pageWidth = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth
    }));

    const watchButton = page.getByRole('button', { name: 'Watch the 1-minute overview' });
    await watchButton.click();
    const dialog = page.getByRole('dialog', { name: 'ARKON in one minute' });
    await dialog.waitFor({ state: 'visible' });
    await page.waitForTimeout(100);

    const modalIframeCount = await page.locator('.homepage-video-frame iframe').count();
    const iframeSrc = await page.locator('.homepage-video-frame iframe').getAttribute('src');
    const closeFocused = await page.evaluate(() => document.activeElement?.getAttribute('aria-label') === 'Close video');

    await page.keyboard.press('Escape');
    await dialog.waitFor({ state: 'detached' });
    const closedIframeCount = await page.locator('.homepage-video-frame iframe').count();
    const focusReturned = await page.evaluate(() => document.activeElement?.textContent?.includes('Watch the 1-minute overview'));

    await page.screenshot({ path: `video-modal-output/${viewport.name}-homepage.png`, fullPage: true });

    results.push({
      viewport: viewport.name,
      status: response?.status() || 0,
      initialIframeCount,
      modalIframeCount,
      closedIframeCount,
      iframeSrc,
      sectionHeight: sectionBox?.height || null,
      closeFocused,
      focusReturned,
      errors,
      ...pageWidth
    });

    await page.close();
  }
} finally {
  await browser.close();
}

const failures = [];
for (const result of results) {
  if (result.status !== 200) failures.push(`${result.viewport}: expected 200, received ${result.status}`);
  if (result.initialIframeCount !== 0) failures.push(`${result.viewport}: iframe loaded before click`);
  if (result.modalIframeCount !== 1) failures.push(`${result.viewport}: modal iframe count ${result.modalIframeCount}`);
  if (!result.iframeSrc?.includes('app.heygen.com/embeds/')) failures.push(`${result.viewport}: incorrect iframe source`);
  if (result.closedIframeCount !== 0) failures.push(`${result.viewport}: iframe remained after modal closed`);
  if (!result.closeFocused) failures.push(`${result.viewport}: close button did not receive focus`);
  if (!result.focusReturned) failures.push(`${result.viewport}: focus did not return to watch button`);
  if (result.scrollWidth > result.clientWidth) failures.push(`${result.viewport}: horizontal overflow ${result.scrollWidth}/${result.clientWidth}`);
  if (result.errors.length) failures.push(`${result.viewport}: console errors ${result.errors.join(' | ')}`);
}

const desktop = results.find(result => result.viewport === 'desktop');
if (desktop?.sectionHeight && desktop.sectionHeight > 380) failures.push(`desktop: video section remains too tall (${desktop.sectionHeight}px)`);

await writeFile('video-modal-output/results.json', JSON.stringify({ results, failures }, null, 2));
await writeFile(
  'video-modal-output/summary.md',
  `# Video Modal Validation\n\n${failures.length ? failures.map(item => `- FAIL: ${item}`).join('\n') : '- PASS: Compact card renders without loading HeyGen, modal loads only after click, Escape closes it, focus is restored, and no horizontal overflow exists.'}\n`
);

console.log(JSON.stringify({ results, failures }, null, 2));
if (failures.length) process.exitCode = 1;
