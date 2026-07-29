import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import '../src/legal-register.js';
import { crawlablePaths } from '../src/site-content.js';

const scriptsDir = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(scriptsDir, '..');
const srcDir = resolve(rootDir, 'src');
const appPath = resolve(srcDir, 'App.public.jsx');
const mainPath = resolve(srcDir, 'main.public.jsx');
const indexPath = resolve(rootDir, 'index.html');

const requiredRoutes = [
  '/',
  '/how-it-works',
  '/real-estate',
  '/insurance',
  '/short-term-rentals',
  '/home-services',
  '/professional-services',
  '/salons',
  '/garages',
  '/medical-dental-offices',
  '/law-firms',
  '/gyms-fitness-studios',
  '/privacy',
  '/terms',
  '/data-security',
  '/contact'
];

function replaceRequired(source, from, to, label) {
  if (!source.includes(from)) throw new Error(`Could not find ${label}.`);
  return source.replace(from, to);
}

function count(source, pattern) {
  return (source.match(pattern) || []).length;
}

function globalizeApp() {
  let source = readFileSync(appPath, 'utf8');

  source = source.replace(
    /\nfunction Header\(\) \{[\s\S]*?\n\}\n\nfunction Hero\(\)/,
    '\nfunction Hero()'
  );
  source = replaceRequired(source, '      <Header />\n', '', 'route-owned homepage header');

  if (/function Header\(|<Header \/>/.test(source)) {
    throw new Error('App.public.jsx still owns a route-specific header.');
  }

  writeFileSync(appPath, source);
}

function globalizeEntry() {
  let source = readFileSync(mainPath, 'utf8');

  source = replaceRequired(
    source,
    "import App from './App.public.jsx';",
    "import App from './App.public.jsx';\nimport SiteHeader from './SiteHeader.jsx';",
    'SiteHeader import anchor'
  );

  source = source.replace(
    /\nfunction UnifiedHeader\([^)]*\) \{[\s\S]*?\n\}\n\n/,
    '\n'
  );
  source = source.replace('      <UnifiedHeader showPricing={Boolean(page.pricing)} />\n', '');
  source = source.replace('          <UnifiedHeader />\n', '');

  const footerMount = "const footerContainer = document.getElementById('global-site-footer');";
  const headerMount = `const headerContainer = document.getElementById('global-site-header');
if (!headerContainer) {
  throw new Error('Global site header container is missing.');
}
createRoot(headerContainer).render(
  <React.StrictMode>
    <SiteHeader />
  </React.StrictMode>
);

`;
  source = replaceRequired(source, footerMount, `${headerMount}${footerMount}`, 'global footer mount anchor');

  if (/function UnifiedHeader\(|<UnifiedHeader/.test(source)) {
    throw new Error('main.public.jsx still owns a route-specific header.');
  }

  if (count(source, /<SiteHeader \/>/g) !== 1) {
    throw new Error('main.public.jsx must render exactly one SiteHeader.');
  }

  writeFileSync(mainPath, source);
}

function verifyAllRoutes(passLabel) {
  const indexHtml = readFileSync(indexPath, 'utf8');
  const appPublic = readFileSync(appPath, 'utf8');
  const mainPublic = readFileSync(mainPath, 'utf8');
  const uniqueRoutes = [...new Set(crawlablePaths)];

  const requiredShellChecks = [
    ['global header container', indexHtml.includes('id="global-site-header"')],
    ['header fallback', indexHtml.includes('data-header-fallback="true"')],
    ['global footer container', indexHtml.includes('id="global-site-footer"')],
    ['footer fallback', indexHtml.includes('data-footer-fallback="true"')],
    ['global consent container', indexHtml.includes('id="global-consent-root"')],
    ['isolated footer class', indexHtml.includes('class="site-footer-complete"')],
    ['no conflicting fallback footer class', !indexHtml.includes('class="site-footer site-footer-complete"')],
    ['one generated SiteHeader', count(mainPublic, /<SiteHeader \/>/g) === 1],
    ['one generated SiteFooter', count(mainPublic, /<SiteFooter \/>/g) === 1],
    ['one generated CookieConsent', count(mainPublic, /<CookieConsent \/>/g) === 1],
    ['no homepage-owned header', !/function Header\(|<Header \/>/.test(appPublic)],
    ['no route-owned unified header', !/function UnifiedHeader\(|<UnifiedHeader/.test(mainPublic)],
    ['shared industry banner', mainPublic.includes('<PageBanner page={page} route={route} />')],
    ['shared legal banner', mainPublic.includes('<PageBanner page={legalPage} route={route} animate={false} />')]
  ];

  for (const [label, passed] of requiredShellChecks) {
    if (!passed) throw new Error(`${passLabel}: failed ${label}.`);
  }

  for (const route of requiredRoutes) {
    if (!uniqueRoutes.includes(route)) throw new Error(`${passLabel}: missing route ${route}.`);
  }

  if (uniqueRoutes.length !== requiredRoutes.length) {
    throw new Error(`${passLabel}: expected ${requiredRoutes.length} public routes, found ${uniqueRoutes.length}.`);
  }

  for (const legalHref of ['/privacy', '/terms', '/data-security', '/contact']) {
    if (!indexHtml.includes(`href="${legalHref}"`)) {
      throw new Error(`${passLabel}: footer fallback is missing ${legalHref}.`);
    }
  }

  console.log(`${passLabel}: verified the master header, banner paths, footer, and consent layer across all ${uniqueRoutes.length} public routes.`);
}

globalizeApp();
globalizeEntry();
verifyAllRoutes('Shell audit pass 1');
verifyAllRoutes('Shell audit pass 2');
