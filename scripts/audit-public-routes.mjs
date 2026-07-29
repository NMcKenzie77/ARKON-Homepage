import React from 'react';
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
  '/professional-services',
  '/salons',
  '/garages',
  '/medical-dental-offices',
  '/law-firms',
  '/gyms-fitness-studios'
];

const legalRoutes = ['/privacy', '/terms', '/data-security', '/contact'];
const publicRoutes = ['/', '/how-it-works', ...businessRoutes, ...legalRoutes];

function count(source, needle) {
  return source.split(needle).length - 1;
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

  const solutionRoutes = solutions.map(solution => solution.href).sort();
  assert(
    JSON.stringify(solutionRoutes) === JSON.stringify([...businessRoutes].sort()),
    'Homepage business cards do not match the complete business route list.'
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

  for (const pass of ['Route render audit pass 1', 'Route render audit pass 2']) {
    for (const route of publicRoutes) {
      installAuditWindow(route);
      const markup = renderToStaticMarkup(React.createElement(renderRouteForAudit, route));

      assert(count(markup, 'data-master-header="true"') === 1, `${pass}: ${route} does not have exactly one master header.`);
      assert(count(markup, 'data-master-footer="true"') === 1, `${pass}: ${route} does not have exactly one master footer.`);
      assert(!markup.includes('site-footer site-footer-complete'), `${pass}: ${route} still contains the conflicting legacy footer class.`);

      for (const businessRoute of businessRoutes) {
        assert(markup.includes(`href="${businessRoute}"`), `${pass}: ${route} footer is missing ${businessRoute}.`);
      }
      for (const legalRoute of legalRoutes) {
        assert(markup.includes(`href="${legalRoute}"`), `${pass}: ${route} footer is missing ${legalRoute}.`);
      }

      if (businessRoutes.includes(route)) {
        const page = industryPages[route];
        assert(markup.includes(`data-business-route="${route}"`), `${pass}: ${route} did not select the business-page renderer.`);
        assert(markup.includes(page.title), `${pass}: ${route} did not render its own title.`);
        assert(count(markup, 'class="industry-card is-visible"') === page.cards.length, `${pass}: ${route} business cards did not render completely.`);
        assert(count(markup, 'class="industry-step is-visible"') === page.workflow.length, `${pass}: ${route} workflow did not render completely.`);
        assert(count(markup, 'class="industry-faq is-visible"') === page.faq.length, `${pass}: ${route} FAQs did not render completely.`);

        const revealTags = markup.match(/<[^>]+data-reveal[^>]*>/g) || [];
        for (const tag of revealTags) {
          assert(tag.includes('is-visible'), `${pass}: ${route} contains content hidden behind an unfinished reveal state.`);
        }
      }

      if (legalRoutes.includes(route)) {
        assert(markup.includes(`data-public-route="${route}"`), `${pass}: ${route} did not select the legal-page renderer.`);
      }
    }

    console.log(`${pass}: rendered and verified all ${publicRoutes.length} public routes.`);
  }
} finally {
  await vite.close();
  delete globalThis.window;
}
