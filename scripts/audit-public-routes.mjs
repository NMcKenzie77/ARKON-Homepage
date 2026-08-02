import { existsSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptsDir = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(scriptsDir, '..');

const businessRoutes = [
  '/real-estate',
  '/insurance',
  '/short-term-rentals',
  '/home-services',
  '/salons',
  '/garages'
];

const retiredBusinessRoutes = [
  '/professional-services',
  '/medical-dental-offices',
  '/law-firms',
  '/gyms-fitness-studios'
];

const customRouteExpectations = {
  '/real-estate': {
    title: 'Answer new leads now. Re-engage the opportunities already in your database.',
    cardCount: 5,
    workflowCount: 0,
    faqCount: 0
  },
  '/insurance': {
    title: 'Turn more quote requests into conversations before the prospect moves on.',
    workflowCount: 0,
    faqCount: 0,
    requiredMarkers: [
      'insurance-call-demo',
      'insurance-team-section',
      'insurance-grant-section',
      'See how your agency can respond faster without putting licensed decisions in the wrong hands.',
      'Book an insurance agency walkthrough'
    ]
  },
  '/short-term-rentals': {
    title: 'Keep every guest, cleaner, and property issue moving without living inside your phone.',
    cardCount: 4,
    workflowCount: 0,
    faqCount: 0,
    requiredMarkers: [
      'Short-term rental digital team',
      'Your digital team handles guest questions, cleaner coordination, maintenance follow-up, emergency routing, reservation context, and owner briefings so the operation keeps moving even when you are unavailable.',
      'data-short-term-rental-call-demo="true"',
      'Guest asks a question',
      'Where should we go?',
      'Cleaner coordination',
      'Urgent issue after hours',
      'Review and return stay',
      'short-term-rental-team-section',
      'short-term-rental-grant-section',
      'Your portfolio chief of staff',
      'Four items need your attention today.'
    ]
  },
  '/salons': {
    title: 'Keep every call and booking opportunity moving.',
    workflowCount: 0,
    faqCount: 0
  },
  '/garages': {
    title: 'Bring customers back for the work their vehicles still need.',
    cardCount: 4,
    workflowCount: 0,
    faqCount: 0
  }
};

const conversionRoutes = ['/demo'];
const legalRoutes = ['/privacy', '/terms', '/data-security', '/contact'];
const publicRoutes = ['/', '/how-it-works', ...conversionRoutes, ...businessRoutes, ...legalRoutes];
const renderedRoutes = [...conversionRoutes, ...businessRoutes, ...legalRoutes];

function count(source, needle) {
  return source.split(needle).length - 1;
}

function countClass(source, className) {
  return [...source.matchAll(/class="([^"]*)"/g)]
    .filter(([, classes]) => classes.split(/\s+/).includes(className))
    .length;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function installAuditWindow(route) {
  globalThis.window = {
    location: { pathname: route },
    addEventListener() {},
    removeEventListener() {},
    scrollTo() {},
    dispatchEvent() {},
    arkonConsent: { analytics: false, advertising: false }
  };
}

for (const route of [...businessRoutes, ...retiredBusinessRoutes]) {
  const legacyRouteFile = resolve(rootDir, 'public', route.slice(1), 'index.html');
  assert(
    !existsSync(legacyRouteFile),
    `${route} has a legacy public index.html that will override the React application shell.`
  );
}

const vite = await createServer({
  root: rootDir,
  appType: 'custom',
  logLevel: 'error',
  server: { middlewareMode: true }
});

try {
  await vite.ssrLoadModule('/src/legal-register.js');
  const { renderRouteForAudit } = await vite.ssrLoadModule('/src/production-main.jsx');
  const { industryPages, crawlablePaths } = await vite.ssrLoadModule('/src/site-content.js');
  const { solutions } = await vite.ssrLoadModule('/src/data.js');

  assert(new Set(crawlablePaths).size === publicRoutes.length, `Expected ${publicRoutes.length} public routes, found ${new Set(crawlablePaths).size}.`);
  for (const route of publicRoutes) assert(crawlablePaths.includes(route), `Route registry is missing ${route}.`);

  for (const route of retiredBusinessRoutes) {
    assert(!crawlablePaths.includes(route), `Retired route ${route} is still crawlable.`);
    assert(!industryPages[route], `Retired route ${route} still has public page data.`);
  }

  const demoPage = industryPages['/demo'];
  assert(demoPage?.pageType === 'demo', '/demo is not registered as the conversion page.');
  assert(demoPage.path === '/demo', '/demo has a mismatched path.');
  assert(Array.isArray(demoPage.cards) && demoPage.cards.length === 6, '/demo must define six workflow choices.');
  assert(Array.isArray(demoPage.faq) && demoPage.faq.length === 3, '/demo must define three visible questions.');

  const solutionRoutes = solutions.map(solution => solution.href).sort();
  assert(
    JSON.stringify(solutionRoutes) === JSON.stringify([...businessRoutes].sort()),
    'Homepage business cards do not match the six supported business routes.'
  );

  for (const route of businessRoutes) {
    const page = industryPages[route];
    assert(page, `Missing business page data for ${route}.`);
    assert(page.path === route, `${route} has a mismatched path.`);
    assert(page.name && page.title && page.description && page.primary, `${route} is missing required copy.`);
    assert(Array.isArray(page.cards) && page.cards.length === 4, `${route} must have four business cards.`);
    assert(Array.isArray(page.workflow) && page.workflow.length >= 4, `${route} is missing workflow steps.`);
    assert(Array.isArray(page.faq) && page.faq.length >= 2, `${route} is missing FAQs.`);
  }

  for (const route of legalRoutes) {
    const page = industryPages[route];
    assert(page?.pageType === 'legal', `${route} is not registered as a legal page.`);
    assert(Array.isArray(page.sections) && page.sections.length > 0, `${route} has no legal sections.`);
  }

  for (const pass of ['Affected-route render audit pass 1', 'Affected-route render audit pass 2']) {
    for (const route of renderedRoutes) {
      installAuditWindow(route);
      const markup = renderToStaticMarkup(renderRouteForAudit(route));

      assert(count(markup, 'data-master-header="true"') === 1, `${pass}: ${route} does not have exactly one master header.`);
      assert(count(markup, 'data-master-footer="true"') === 1, `${pass}: ${route} does not have exactly one master footer.`);
      assert(!markup.includes('site-footer site-footer-complete'), `${pass}: ${route} still contains the conflicting legacy footer class.`);
      assert(markup.includes('href="/demo"'), `${pass}: ${route} is missing the dedicated demo-page link.`);

      for (const businessRoute of businessRoutes) {
        assert(markup.includes(`href="${businessRoute}"`), `${pass}: ${route} footer is missing ${businessRoute}.`);
      }
      for (const retiredRoute of retiredBusinessRoutes) {
        assert(!markup.includes(`href="${retiredRoute}"`), `${pass}: ${route} still links to retired route ${retiredRoute}.`);
      }
      for (const legalRoute of legalRoutes) {
        assert(markup.includes(`href="${legalRoute}"`), `${pass}: ${route} footer is missing ${legalRoute}.`);
      }

      if (route === '/demo') {
        assert(markup.includes('data-public-route="/demo"'), `${pass}: /demo did not select the dedicated conversion-page renderer.`);
        assert(markup.includes('See how ARKON handles a real customer workflow.'), `${pass}: /demo is missing its primary title.`);
        assert(countClass(markup, 'demo-workflow-card') === 6, `${pass}: /demo did not render all six workflow choices.`);
        assert(countClass(markup, 'demo-faq-grid') === 1, `${pass}: /demo is missing the visible questions section.`);
        assert(markup.includes('id="request-demo"'), `${pass}: /demo is missing the request form anchor.`);
        assert(markup.includes('Request working session'), `${pass}: /demo is missing the working-session submit action.`);
      }

      if (businessRoutes.includes(route)) {
        const page = industryPages[route];
        const customExpectation = customRouteExpectations[route];
        const expectedTitle = customExpectation?.title || page.title;
        const expectedCardCount = customExpectation?.cardCount ?? page.cards.length;
        const expectedWorkflowCount = customExpectation?.workflowCount ?? page.workflow.length;
        const expectedFaqCount = customExpectation?.faqCount ?? page.faq.length;

        assert(markup.includes(`data-business-route="${route}"`), `${pass}: ${route} did not select the business-page renderer.`);
        assert(markup.includes(expectedTitle), `${pass}: ${route} did not render its own title.`);
        assert(countClass(markup, 'industry-card') === expectedCardCount, `${pass}: ${route} business cards did not render completely.`);
        assert(countClass(markup, 'industry-step') === expectedWorkflowCount, `${pass}: ${route} rendered an unexpected number of workflow cards.`);
        assert(countClass(markup, 'industry-faq') === expectedFaqCount, `${pass}: ${route} rendered an unexpected number of FAQ cards.`);
        for (const marker of customExpectation?.requiredMarkers || []) {
          assert(markup.includes(marker), `${pass}: ${route} is missing required dedicated section marker ${marker}.`);
        }

        const revealTags = markup.match(/<[^>]+data-reveal[^>]*>/g) || [];
        for (const tag of revealTags) {
          assert(tag.includes('is-visible'), `${pass}: ${route} contains content hidden behind an unfinished reveal state.`);
        }
      }

      if (legalRoutes.includes(route)) {
        assert(markup.includes(`data-public-route="${route}"`), `${pass}: ${route} did not select the legal-page renderer.`);
      }
    }

    console.log(`${pass}: rendered and verified all ${renderedRoutes.length} affected routes.`);
  }
} finally {
  await vite.close();
  delete globalThis.window;
}
