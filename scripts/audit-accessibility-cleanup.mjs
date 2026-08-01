import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const baseUrl = process.env.AUDIT_BASE_URL || 'http://127.0.0.1:4173';
const routes = [
  '/',
  '/how-it-works',
  '/real-estate',
  '/insurance',
  '/short-term-rentals',
  '/salons',
  '/garages'
];
const blockedRuleIds = new Set([
  'aria-allowed-attr',
  'aria-prohibited-attr',
  'color-contrast',
  'heading-order',
  'scrollable-region-focusable'
]);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function formatViolations(route, violations) {
  return violations.map(violation => {
    const targets = violation.nodes.slice(0, 3).map(node => node.target.join(' ')).join(', ');
    return `${route}: ${violation.id} (${violation.impact || 'unknown'}) at ${targets}`;
  }).join('\n');
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 390, height: 844 } });

try {
  await context.addInitScript(() => {
    localStorage.setItem('arkon_consent_v1', JSON.stringify({
      analytics: false,
      advertising: false,
      version: 1,
      updatedAt: new Date().toISOString()
    }));
  });

  for (const route of routes) {
    const page = await context.newPage();
    const consoleErrors = [];
    page.on('console', message => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });
    page.on('pageerror', error => consoleErrors.push(error.message));

    const response = await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle' });
    assert(response?.ok(), `${route}: expected successful response, received ${response?.status()}.`);
    await page.waitForTimeout(700);

    const results = await new AxeBuilder({ page }).analyze();
    const failures = results.violations.filter(violation =>
      violation.impact === 'critical'
      || violation.impact === 'serious'
      || blockedRuleIds.has(violation.id)
    );
    assert(!failures.length, formatViolations(route, failures));

    const headingLevels = await page.locator('h1, h2, h3, h4, h5, h6').evaluateAll(headings =>
      headings
        .filter(heading => {
          const style = getComputedStyle(heading);
          return style.display !== 'none' && style.visibility !== 'hidden';
        })
        .map(heading => Number(heading.tagName.slice(1)))
    );
    assert(headingLevels[0] === 1, `${route}: first visible heading must be H1.`);
    for (let index = 1; index < headingLevels.length; index += 1) {
      assert(
        headingLevels[index] <= headingLevels[index - 1] + 1,
        `${route}: heading level skips from H${headingLevels[index - 1]} to H${headingLevels[index]}.`
      );
    }

    const scrollRegions = await page.locator('.grant-preview-sidebar nav').evaluateAll(elements =>
      elements.map(element => ({
        scrollable: element.scrollWidth > element.clientWidth || element.scrollHeight > element.clientHeight,
        tabIndex: element.tabIndex,
        label: element.getAttribute('aria-label')
      }))
    );
    for (const region of scrollRegions) {
      if (region.scrollable) {
        assert(region.tabIndex >= 0, `${route}: scrollable dashboard navigation is not keyboard focusable (${region.label}).`);
      }
    }

    assert(!consoleErrors.length, `${route}: browser errors detected:\n${consoleErrors.join('\n')}`);
    await page.close();
    console.log(`Accessibility checks passed for ${route}.`);
  }

  const cookieContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const cookiePage = await cookieContext.newPage();
  await cookiePage.goto(baseUrl, { waitUntil: 'networkidle' });
  await cookiePage.getByRole('button', { name: 'Manage settings' }).click();

  const dialog = cookiePage.getByRole('dialog', { name: 'Cookie settings' });
  await dialog.waitFor({ state: 'visible' });
  assert(
    await cookiePage.evaluate(() => document.activeElement?.getAttribute('aria-label') === 'Close cookie settings'),
    'Cookie dialog did not place initial focus on the close button.'
  );
  assert(
    await cookiePage.evaluate(() => document.body.style.overflow === 'hidden'),
    'Cookie dialog did not lock background scrolling.'
  );

  await cookiePage.keyboard.press('Shift+Tab');
  assert(
    await cookiePage.evaluate(() => document.activeElement?.textContent?.includes('Privacy & Cookies Policy')),
    'Cookie dialog did not wrap backward focus to the final control.'
  );

  await cookiePage.keyboard.press('Escape');
  await dialog.waitFor({ state: 'detached' });
  assert(
    await cookiePage.evaluate(() => document.activeElement?.textContent?.trim() === 'Manage settings'),
    'Cookie dialog did not restore focus to the opening control.'
  );
  assert(
    await cookiePage.evaluate(() => document.body.style.overflow !== 'hidden'),
    'Cookie dialog did not restore background scrolling.'
  );

  await cookieContext.close();
  console.log('Cookie dialog keyboard checks passed.');
} finally {
  await context.close();
  await browser.close();
}
