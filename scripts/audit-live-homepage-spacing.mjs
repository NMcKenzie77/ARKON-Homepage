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
  { name: 'Meet Naya', selector: '#root > main > .homepage-video-section' },
  { name: 'Workflow proof', selector: '#root > main > .workflow-proof-section' },
  { name: 'Core team', selector: '#root > main > .compact-team-section' },
  { name: 'Business types', selector: '#root > main > .featured-solutions-section' },
  { name: 'Business voice', selector: '#root > main > .voice-proof-section' },
  { name: 'Coverage', selector: '#root > main > .voice-proof-section + .section' },
  { name: 'Demo request', selector: '#root > main > .voice-proof-section + .section + .demo-cta' }
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

    const elementRect = element.getBoundingClientRect();
    const style = getComputedStyle(element);

    if (!children.length) {
      return {
        top: elementRect.top,
        bottom: elementRect.bottom,
        height: elementRect.height,
        elementTop: elementRect.top,
        elementBottom: elementRect.bottom,
        paddingTop: Number.parseFloat(style.paddingTop) || 0,
        paddingBottom: Number.parseFloat(style.paddingBottom) || 0,
        marginTop: Number.parseFloat(style.marginTop) || 0,
        marginBottom: Number.parseFloat(style.marginBottom) || 0
      };
    }

    const rects = children.map(child => child.getBoundingClientRect());
    const top = Math.min(...rects.map(rect => rect.top));
    const bottom = Math.max(...rects.map(rect => rect.bottom));

    return {
      top,
      bottom,
      height: bottom - top,
      elementTop: elementRect.top,
      elementBottom: elementRect.bottom,
      paddingTop: Number.parseFloat(style.paddingTop) || 0,
      paddingBottom: Number.parseFloat(style.paddingBottom) || 0,
      marginTop: Number.parseFloat(style.marginTop) || 0,
      marginBottom: Number.parseFloat(style.marginBottom) || 0
    };
  });
}

await mkdir(outputDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
const reports = [];
let auditError = null;

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
      transitions.push({
        from: bounds[index].name,
        to: bounds[index + 1].name,
        gap,
        expected: viewport.expected[index]
      });
    }

    await page.screenshot({
      path: `${outputDir}/homepage-${viewport.name}.png`,
      fullPage: true
    });

    const report = {
      viewport: viewport.name,
      width: viewport.width,
      height: viewport.height,
      scrollY: await page.evaluate(() => window.scrollY),
      documentHeight: await page.evaluate(() => document.documentElement.scrollHeight),
      bounds,
      transitions,
      consoleErrors
    };
    reports.push(report);
    await writeFile(`${outputDir}/spacing-report.json`, `${JSON.stringify(reports, null, 2)}\n`);

    console.log(`${viewport.name} homepage spacing measurements:`);
    for (const transition of transitions) {
      console.log(`  ${transition.from} → ${transition.to}: ${transition.gap}px`);
    }

    try {
      for (let index = 0; index < transitions.length; index += 1) {
        const transition = transitions[index];
        const expected = viewport.expected[index];
        const minimum = expected - viewport.tolerance;
        const maximum = expected + viewport.tolerance;
        assert(
          transition.gap >= minimum && transition.gap <= maximum,
          `${viewport.name}: ${transition.from} → ${transition.to} measured ${transition.gap}px; expected ${expected}px ± ${viewport.tolerance}px.`
        );
      }
      assert(!consoleErrors.length, `${viewport.name}: browser errors detected:\n${consoleErrors.join('\n')}`);
    } catch (error) {
      auditError = auditError || error;
    }

    await context.close();
  }
} finally {
  await browser.close();
}

if (auditError) throw auditError;
console.log('Live homepage spacing audit passed.');
