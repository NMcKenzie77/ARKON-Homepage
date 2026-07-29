import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';

const baseUrl = process.env.AUDIT_BASE_URL || 'http://127.0.0.1:3000';
const routes = [
  '/real-estate',
  '/insurance',
  '/short-term-rentals',
  '/home-services',
  '/professional-services',
  '/salons',
  '/garages',
  '/medical-dental-offices',
  '/law-firms',
  '/gyms-fitness-studios'
];

mkdirSync('audit-output', { recursive: true });

const browser = await chromium.launch({ headless: true });
const results = [];

try {
  for (const route of routes) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
    const consoleErrors = [];
    const pageErrors = [];

    page.on('console', message => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });
    page.on('pageerror', error => pageErrors.push(error.message));

    const response = await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(600);

    const metrics = await page.evaluate(() => {
      const rect = selector => {
        const node = document.querySelector(selector);
        if (!node) return null;
        const box = node.getBoundingClientRect();
        const style = getComputedStyle(node);
        return {
          x: Math.round(box.x),
          y: Math.round(box.y),
          width: Math.round(box.width),
          height: Math.round(box.height),
          display: style.display,
          position: style.position,
          visibility: style.visibility,
          opacity: style.opacity,
          overflowX: style.overflowX,
          overflowY: style.overflowY
        };
      };

      const hiddenReveal = [...document.querySelectorAll('[data-reveal]')]
        .filter(node => {
          const style = getComputedStyle(node);
          return style.opacity === '0' || style.visibility === 'hidden' || style.display === 'none';
        })
        .map(node => `${node.tagName.toLowerCase()}.${node.className}`);

      const duplicateIds = [...document.querySelectorAll('[id]')]
        .map(node => node.id)
        .filter((id, index, all) => all.indexOf(id) !== index);

      return {
        title: document.title,
        bodyClass: document.body.className,
        viewportWidth: window.innerWidth,
        documentWidth: document.documentElement.scrollWidth,
        bodyWidth: document.body.scrollWidth,
        documentHeight: document.documentElement.scrollHeight,
        rootChildren: document.getElementById('root')?.children.length ?? -1,
        rootTextStart: document.getElementById('root')?.innerText.slice(0, 140) ?? '',
        headers: document.querySelectorAll('[data-master-header="true"]').length,
        footers: document.querySelectorAll('[data-master-footer="true"]').length,
        mains: document.querySelectorAll('main').length,
        businessMains: document.querySelectorAll('[data-business-route]').length,
        crawlablePages: document.querySelectorAll('[data-crawlable-page="true"]').length,
        crawlerStyles: document.querySelectorAll('[data-crawlable-style]').length,
        industryCards: document.querySelectorAll('.industry-card').length,
        workflowSteps: document.querySelectorAll('.industry-step').length,
        faqCards: document.querySelectorAll('.industry-faq').length,
        hiddenReveal,
        duplicateIds,
        header: rect('[data-master-header="true"]'),
        breadcrumbs: rect('.industry-breadcrumbs'),
        hero: rect('.industry-hero'),
        heroInner: rect('.industry-hero-inner'),
        firstSection: rect('.industry-intro-section'),
        footer: rect('[data-master-footer="true"]'),
        footerInner: rect('.site-footer-inner'),
        horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 1,
        footerAfterMain: (() => {
          const main = document.querySelector('main');
          const footer = document.querySelector('[data-master-footer="true"]');
          if (!main || !footer) return null;
          return footer.getBoundingClientRect().top >= main.getBoundingClientRect().bottom - 2;
        })()
      };
    });

    const slug = route.slice(1).replaceAll('/', '-') || 'home';
    await page.screenshot({ path: `audit-output/${slug}.png`, fullPage: true });

    const result = {
      route,
      status: response?.status() ?? null,
      url: page.url(),
      consoleErrors,
      pageErrors,
      ...metrics
    };

    results.push(result);
    console.log(`AUDIT ${route} ${JSON.stringify(result)}`);
    await page.close();
  }
} finally {
  await browser.close();
}

writeFileSync('audit-output/report.json', JSON.stringify(results, null, 2));

const failures = results.filter(result =>
  result.status !== 200 ||
  result.headers !== 1 ||
  result.footers !== 1 ||
  result.businessMains !== 1 ||
  result.mains !== 1 ||
  result.crawlablePages !== 0 ||
  result.horizontalOverflow ||
  result.hiddenReveal.length ||
  result.consoleErrors.length ||
  result.pageErrors.length ||
  result.footerAfterMain !== true
);

console.log(`SUMMARY ${JSON.stringify({ routes: results.length, failures: failures.map(item => item.route) })}`);
if (failures.length) process.exitCode = 1;
