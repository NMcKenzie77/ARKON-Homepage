import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const baseUrl = String(process.env.AUDIT_BASE_URL || 'https://arkon-homepage-staging.up.railway.app').replace(/\/$/, '');
const outputDir = 'audit-output';

const publicRoutes = [
  '/',
  '/how-it-works',
  '/real-estate',
  '/insurance',
  '/short-term-rentals',
  '/home-services',
  '/salons',
  '/garages',
  '/privacy',
  '/terms',
  '/data-security',
  '/contact'
];

const retiredRoutes = [
  '/professional-services',
  '/medical-dental-offices',
  '/law-firms',
  '/gyms-fitness-studios'
];

const securityHeaders = [
  'strict-transport-security',
  'content-security-policy',
  'x-content-type-options',
  'referrer-policy',
  'permissions-policy'
];

function cleanRoute(route) {
  return route === '/' ? 'home' : route.slice(1).replaceAll('/', '-');
}

function getMeta(html, name, property = false) {
  const attr = property ? 'property' : 'name';
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const patterns = [
    new RegExp(`<meta[^>]+${attr}=["']${escaped}["'][^>]+content=["']([^"']*)["'][^>]*>`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+${attr}=["']${escaped}["'][^>]*>`, 'i')
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) return match[1];
  }
  return '';
}

function getLink(html, rel) {
  const escaped = rel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const patterns = [
    new RegExp(`<link[^>]+rel=["']${escaped}["'][^>]+href=["']([^"']*)["'][^>]*>`, 'i'),
    new RegExp(`<link[^>]+href=["']([^"']*)["'][^>]+rel=["']${escaped}["'][^>]*>`, 'i')
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) return match[1];
  }
  return '';
}

async function fetchRoute(route) {
  const started = Date.now();
  const response = await fetch(`${baseUrl}${route}`, { redirect: 'manual' });
  const html = await response.text();
  const headers = Object.fromEntries(response.headers.entries());
  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.replace(/<!--[\s\S]*?-->/g, '').trim() || '';
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() || '';

  return {
    route,
    url: `${baseUrl}${route}`,
    status: response.status,
    responseMs: Date.now() - started,
    bytes: Buffer.byteLength(html),
    title,
    h1,
    description: getMeta(html, 'description'),
    robots: getMeta(html, 'robots'),
    canonical: getLink(html, 'canonical'),
    ogTitle: getMeta(html, 'og:title', true),
    ogDescription: getMeta(html, 'og:description', true),
    ogImage: getMeta(html, 'og:image', true),
    headers,
    missingSecurityHeaders: securityHeaders.filter(header => !headers[header])
  };
}

async function auditStaticResponses() {
  const results = [];
  for (const route of [...publicRoutes, ...retiredRoutes, '/this-page-should-not-exist']) {
    try {
      results.push(await fetchRoute(route));
    } catch (error) {
      results.push({ route, error: String(error?.message || error) });
    }
  }

  for (const route of ['/robots.txt', '/sitemap.xml']) {
    try {
      const response = await fetch(`${baseUrl}${route}`);
      results.push({
        route,
        status: response.status,
        contentType: response.headers.get('content-type') || '',
        body: (await response.text()).slice(0, 12000)
      });
    } catch (error) {
      results.push({ route, error: String(error?.message || error) });
    }
  }

  return results;
}

async function pageAudit(page, route, viewportName) {
  const consoleErrors = [];
  const pageErrors = [];
  const requestFailures = [];
  const badResponses = [];

  page.on('console', message => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', error => pageErrors.push(String(error?.message || error)));
  page.on('requestfailed', request => requestFailures.push({ url: request.url(), error: request.failure()?.errorText || 'failed' }));
  page.on('response', response => {
    if (response.status() >= 400) badResponses.push({ url: response.url(), status: response.status() });
  });

  const response = await page.goto(`${baseUrl}${route}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(1800);

  const dom = await page.evaluate(({ isMobile }) => {
    const all = [...document.querySelectorAll('*')];
    const ids = all.map(element => element.id).filter(Boolean);
    const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
    const visible = element => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
    };
    const text = element => (element.getAttribute('aria-label') || element.textContent || '').replace(/\s+/g, ' ').trim();
    const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(element => ({
      level: Number(element.tagName.slice(1)),
      text: text(element)
    }));
    const labels = new Set([...document.querySelectorAll('label[for]')].map(label => label.getAttribute('for')));
    const controlsMissingLabels = [...document.querySelectorAll('input:not([type="hidden"]),select,textarea')]
      .filter(control => {
        if (control.closest('[aria-hidden="true"]')) return false;
        if (control.getAttribute('aria-label') || control.getAttribute('aria-labelledby')) return false;
        if (control.id && labels.has(control.id)) return false;
        return !control.closest('label');
      })
      .map(control => `${control.tagName.toLowerCase()}[name="${control.getAttribute('name') || ''}"]`);
    const internalLinks = [...document.querySelectorAll('a[href]')]
      .map(link => link.href)
      .filter(href => href.startsWith(location.origin));
    const visibleNavLinks = [...document.querySelectorAll('header nav a, header a.nav-cta')]
      .filter(visible)
      .map(link => text(link));
    const menuButtons = [...document.querySelectorAll('header button')].filter(visible).map(button => text(button));
    const video = document.querySelector('.homepage-video-section');
    const videoRect = video?.getBoundingClientRect();

    return {
      title: document.title,
      h1Count: document.querySelectorAll('h1').length,
      h1Text: [...document.querySelectorAll('h1')].map(text),
      headings,
      duplicateIds,
      horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      imagesWithoutAlt: [...document.querySelectorAll('img:not([alt])')].map(image => image.currentSrc || image.src),
      iframesWithoutTitle: [...document.querySelectorAll('iframe:not([title])')].map(frame => frame.src),
      emptyLinks: [...document.querySelectorAll('a[href]')].filter(link => !text(link)).map(link => link.href),
      emptyButtons: [...document.querySelectorAll('button')].filter(button => !text(button)).length,
      controlsMissingLabels,
      internalLinks: [...new Set(internalLinks)],
      visibleNavLinks,
      menuButtons,
      mobileNavigationPresent: !isMobile || visibleNavLinks.length >= 3 || menuButtons.length > 0,
      cookieBannerVisible: Boolean([...document.querySelectorAll('.cookie-banner')].find(visible)),
      video: videoRect ? {
        width: Math.round(videoRect.width),
        height: Math.round(videoRect.height),
        top: Math.round(videoRect.top),
        iframeCount: video.querySelectorAll('iframe').length
      } : null,
      bodyTextHasAiPhrase: /digital ai team/i.test(document.body.innerText),
      bodyTextHasOldPositioning: /ai workflow automation|repeatable work handled/i.test(document.body.innerText)
    };
  }, { isMobile: viewportName === 'mobile' });

  let axe = { violations: [], passes: 0, incomplete: [] };
  try {
    const axeResult = await new AxeBuilder({ page }).analyze();
    axe = {
      violations: axeResult.violations.map(violation => ({
        id: violation.id,
        impact: violation.impact,
        description: violation.description,
        help: violation.help,
        nodes: violation.nodes.length,
        targets: violation.nodes.slice(0, 8).map(node => node.target)
      })),
      passes: axeResult.passes.length,
      incomplete: axeResult.incomplete.map(item => ({ id: item.id, impact: item.impact, nodes: item.nodes.length }))
    };
  } catch (error) {
    axe = { error: String(error?.message || error), violations: [], passes: 0, incomplete: [] };
  }

  return {
    route,
    viewport: viewportName,
    status: response?.status() || null,
    finalUrl: page.url(),
    dom,
    axe,
    consoleErrors: [...new Set(consoleErrors)],
    pageErrors: [...new Set(pageErrors)],
    requestFailures,
    badResponses
  };
}

async function auditBrowser() {
  const browser = await chromium.launch({ headless: true });
  const results = [];
  const viewports = {
    desktop: { width: 1440, height: 900 },
    mobile: { width: 390, height: 844 }
  };

  try {
    for (const [viewportName, viewport] of Object.entries(viewports)) {
      for (const route of publicRoutes) {
        const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
        const page = await context.newPage();
        try {
          const result = await pageAudit(page, route, viewportName);
          results.push(result);
          if (route === '/') {
            await page.screenshot({
              path: `${outputDir}/homepage-${viewportName}.png`,
              fullPage: true
            });
          }
        } catch (error) {
          results.push({ route, viewport: viewportName, error: String(error?.stack || error) });
        } finally {
          await context.close();
        }
      }
    }

    const cookieContext = await browser.newContext({ viewport: viewports.desktop });
    const cookiePage = await cookieContext.newPage();
    await cookiePage.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await cookiePage.waitForTimeout(700);
    const cookieTest = {
      bannerInitiallyVisible: await cookiePage.locator('.cookie-banner').isVisible().catch(() => false)
    };
    if (cookieTest.bannerInitiallyVisible) {
      await cookiePage.getByRole('button', { name: /reject nonessential/i }).click();
      cookieTest.bannerAfterRejectVisible = await cookiePage.locator('.cookie-banner').isVisible().catch(() => false);
      cookieTest.savedChoice = await cookiePage.evaluate(() => localStorage.getItem('arkon_consent_v1'));
      await cookiePage.getByRole('button', { name: /cookie settings/i }).last().scrollIntoViewIfNeeded();
      await cookiePage.getByRole('button', { name: /cookie settings/i }).last().click();
      cookieTest.settingsDialogVisible = await cookiePage.getByRole('dialog').isVisible().catch(() => false);
    }
    results.push({ specialTest: 'cookie-consent', ...cookieTest });
    await cookieContext.close();

    const formContext = await browser.newContext({ viewport: viewports.desktop });
    const formPage = await formContext.newPage();
    let capturedPayload = null;
    await formPage.route('**/api/demo-request', async route => {
      try {
        capturedPayload = route.request().postDataJSON();
      } catch {
        capturedPayload = route.request().postData();
      }
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, message: 'Audit success.' }) });
    });
    await formPage.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await formPage.locator('#demo').scrollIntoViewIfNeeded();
    const form = formPage.locator('#demo form');
    await form.locator('[name="name"]').fill('Audit User');
    await form.locator('[name="email"]').fill('audit@example.com');
    await form.locator('[name="companyName"]').fill('Audit Company');
    await form.locator('[name="phone"]').fill('8135550100');
    await form.locator('[name="businessType"]').selectOption({ label: 'Real estate' });
    await form.getByRole('button', { name: /request demo/i }).click();
    const missingConsentStatus = await form.locator('[role="status"]').innerText();
    await form.locator('[name="contactConsent"]').check();
    await form.getByRole('button', { name: /request demo/i }).click();
    await formPage.waitForTimeout(300);
    const successStatus = await form.locator('[role="status"]').innerText();
    results.push({
      specialTest: 'demo-form',
      missingConsentStatus,
      successStatus,
      capturedPayload
    });
    await formContext.close();
  } finally {
    await browser.close();
  }

  return results;
}

function summarize(staticResults, browserResults) {
  const routeResults = browserResults.filter(item => item.route && !item.error);
  const axeViolations = routeResults.flatMap(item => item.axe?.violations?.map(violation => ({ route: item.route, viewport: item.viewport, ...violation })) || []);
  const consoleIssues = routeResults.filter(item => item.consoleErrors?.length || item.pageErrors?.length || item.requestFailures?.length || item.badResponses?.length);
  const overflow = routeResults.filter(item => item.dom?.horizontalOverflow);
  const missingMobileNav = routeResults.filter(item => item.viewport === 'mobile' && !item.dom?.mobileNavigationPresent);
  const aiPhraseRoutes = routeResults.filter(item => item.dom?.bodyTextHasAiPhrase).map(item => `${item.route} (${item.viewport})`);
  const staticPublic = staticResults.filter(item => publicRoutes.includes(item.route));
  const incorrectStatuses = [
    ...staticPublic.filter(item => item.status !== 200),
    ...staticResults.filter(item => [...retiredRoutes, '/this-page-should-not-exist'].includes(item.route) && item.status !== 404)
  ];
  const missingHeaders = staticPublic.filter(item => item.missingSecurityHeaders?.length);
  const sitemap = staticResults.find(item => item.route === '/sitemap.xml');
  const sitemapMissingRoutes = publicRoutes.filter(route => !sitemap?.body?.includes(`${route === '/' ? baseUrl + '/' : baseUrl + route}`));
  const metadataMismatch = staticPublic.filter(item => /AI Workflow Automation|Let your existing team focus/i.test(`${item.title} ${item.h1} ${item.description}`));
  const homepageVideo = routeResults.find(item => item.route === '/' && item.viewport === 'desktop')?.dom?.video;

  return {
    generatedAt: new Date().toISOString(),
    baseUrl,
    counts: {
      publicRoutes: publicRoutes.length,
      browserPageAudits: routeResults.length,
      axeViolations: axeViolations.length,
      consoleIssuePages: consoleIssues.length,
      overflowPages: overflow.length,
      pagesMissingMobileNavigation: missingMobileNav.length
    },
    incorrectStatuses,
    missingHeaders,
    sitemapMissingRoutes,
    metadataMismatch,
    aiPhraseRoutes,
    axeViolations,
    consoleIssues,
    overflow: overflow.map(item => ({ route: item.route, viewport: item.viewport, scrollWidth: item.dom.scrollWidth, clientWidth: item.dom.clientWidth })),
    missingMobileNav: missingMobileNav.map(item => ({ route: item.route, visibleNavLinks: item.dom.visibleNavLinks, menuButtons: item.dom.menuButtons })),
    homepageVideo,
    staticResults,
    browserResults
  };
}

function markdown(summary) {
  const lines = [
    '# ARKON Live Staging Audit',
    '',
    `Generated: ${summary.generatedAt}`,
    `Target: ${summary.baseUrl}`,
    '',
    '## Automated coverage',
    '',
    `- Public routes checked: ${summary.counts.publicRoutes}`,
    `- Desktop/mobile browser renders: ${summary.counts.browserPageAudits}`,
    `- Axe violations: ${summary.counts.axeViolations}`,
    `- Pages with console/network issues: ${summary.counts.consoleIssuePages}`,
    `- Pages with horizontal overflow: ${summary.counts.overflowPages}`,
    `- Mobile pages without usable navigation: ${summary.counts.pagesMissingMobileNavigation}`,
    '',
    '## Immediate flags',
    '',
    `- Incorrect HTTP statuses: ${summary.incorrectStatuses.length}`,
    `- Public responses missing one or more audited security headers: ${summary.missingHeaders.length}`,
    `- Sitemap routes missing: ${summary.sitemapMissingRoutes.length}`,
    `- Routes carrying old homepage SEO/positioning: ${summary.metadataMismatch.length}`,
    `- Desktop homepage video section: ${summary.homepageVideo ? `${summary.homepageVideo.width}×${summary.homepageVideo.height}px with ${summary.homepageVideo.iframeCount} iframe(s)` : 'not found'}`,
    '',
    'See audit-results.json and Lighthouse JSON files for complete evidence.'
  ];
  return `${lines.join('\n')}\n`;
}

await mkdir(outputDir, { recursive: true });
const staticResults = await auditStaticResponses();
const browserResults = await auditBrowser();
const summary = summarize(staticResults, browserResults);
await writeFile(`${outputDir}/audit-results.json`, JSON.stringify(summary, null, 2));
await writeFile(`${outputDir}/audit-summary.md`, markdown(summary));
console.log(markdown(summary));