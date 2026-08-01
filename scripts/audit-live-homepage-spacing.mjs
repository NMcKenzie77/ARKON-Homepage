import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const baseUrl = process.env.AUDIT_BASE_URL || 'https://arkon-homepage-staging.up.railway.app/';
const outputDir = 'homepage-spacing-audit';

const viewports = [
  {
    name: 'desktop',
    width: 1440,
    height: 1000,
    expected: [72, 72, 80, 88, 88, 88],
    tolerance: 3
  },
  {
    name: 'mobile',
    width: 390,
    height: 844,
    expected: [48, 48, 56, 64, 64, 64],
    tolerance: 3
  }
];

const sections = [
  { name: 'Meet Naya', selector: '.homepage-video-section' },
  { name: 'Workflow proof', selector: '.workflow-proof-section' },
  { name: 'Core team', selector: '.compact-team-section' },
  { name: 'Business types', selector: '.featured-solutions-section' },
  { name: 'Business voice', selector: '.voice-proof-section' },
  { name: 'Coverage', selector: '.voice-proof-section + .section' },
  { name: 'Demo request', selector: '.voice-proof-section + .section + .demo-cta' }
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function getVisualBounds(page, section) {
  const locator = page.locator(section.selector);
  assert(await locator.count() === 1, `${section.name}: expected one ${section.selector} element.`);

  return locator.evaluate(element => {
    const children = [...element.children].filter(child => {
      const style = getComputedStyle(child);
      const rect = child.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
    });

    if (!children.length) {
      const rect = element.getBoundingClientRect();
      return { top: rect.top, bottom: rect.bottom, height: rect.height };
    }

    const rects = children.map(child => child.getBoundingClientRect());
    const top = Math.min(...rects.map(rect => rect.top));
    const bottom = Math.max(...rects.map(rect => rect.bottom));
    return { top, bottom, height: bottom - top };
  });
}

await mkdir(outputDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const reports = [];

try {
  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 1
    });

    await context.addInitScript(() => {
      localStorage.setItem('arkon_consent_v1', JSON.stringify({
        analytics: false,
        advertising: false,
        version: 1,
        updatedAt: new Date().toISOString()
      }));
    });

    const page = await context.newPage();
    const consoleErrors = [];
    page.on('console', message => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });
    page.on('pageerror', error => consoleErrors.push(error.message));

    const response = await page.goto(baseUrl, { waitUntil: 'networkidle' });
    assert(response?.ok(), `${viewport.name}: homepage returned ${response?.status()}.`);

    await page.addStyleTag({
      content: `
        *, *::before, *::after { animation: none !important; transition: none !important; }
        [data-reveal] { opacity: 1 !important; transform: none !important; }
      `
    });
    await page.waitForTimeout(500);

    const bounds = [];
    for (const section of sections) {
      bounds.push({
        name: section.name,
        ...(await getVisualBounds(page, section))
      });
    }

    const transitions = [];
    for (let index = 0; index < bounds.length - 1; index += 1) {
      const gap = Math.round((bounds[index + 1].top - bounds[index].bottom) * 10) / 10;
      const expected = viewport.expected[index];
      const minimum = expected - viewport.tolerance;
      const maximum = expected + viewport.tolerance;

      assert(
        gap >= minimum && gap <= maximum,
        `${viewport.name}: ${bounds[index].name} → ${bounds[index + 1].name} measured ${gap}px; expected ${expected}px ± ${viewport.tolerance}px.`
      );

      transitions.push({
        from: bounds[index].name,
        to: bounds[index + 1].name,
        gap,
        expected
      });
    }

    assert(!consoleErrors.length, `${viewport.name}: browser errors detected:\n${consoleErrors.join('\n')}`);

    await page.screenshot({
      path: `${outputDir}/homepage-${viewport.name}.png`,
      fullPage: true
    });

    reports.push({
      viewport: viewport.name,
      width: viewport.width,
      height: viewport.height,
      transitions,
      documentHeight: await page.evaluate(() => document.documentElement.scrollHeight)
    });

    console.log(`${viewport.name} homepage spacing passed.`);
    for (const transition of transitions) {
      console.log(`  ${transition.from} → ${transition.to}: ${transition.gap}px`);
    }

    await context.close();
  }
} finally {
  await browser.close();
}

await writeFile(`${outputDir}/spacing-report.json`, `${JSON.stringify(reports, null, 2)}\n`);
console.log('Live homepage spacing audit passed.');
