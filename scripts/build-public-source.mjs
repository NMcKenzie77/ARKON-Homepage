import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import '../src/legal-register.js';
import { crawlablePaths } from '../src/site-content.js';

const scriptsDir = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(scriptsDir, '..');
const srcDir = resolve(rootDir, 'src');

function requireMarker(source, marker, label) {
  const index = source.indexOf(marker);
  if (index === -1) throw new Error(`Could not find ${label}.`);
  return index;
}

function removeSection(source, startMarker, endMarker, label) {
  const start = requireMarker(source, startMarker, `${label} start`);
  const end = requireMarker(source, endMarker, `${label} end`);
  if (end <= start) throw new Error(`Invalid ${label} boundaries.`);
  return `${source.slice(0, start)}${source.slice(end)}`;
}

function replaceRequired(source, from, to, label) {
  if (!source.includes(from)) throw new Error(`Could not find ${label}.`);
  return source.replace(from, to);
}

function replaceAllRequired(source, from, to, label) {
  if (!source.includes(from)) throw new Error(`Could not find ${label}.`);
  return source.replaceAll(from, to);
}

function occurrenceCount(source, pattern) {
  return (source.match(pattern) || []).length;
}

function buildPublicApp() {
  const inputPath = resolve(srcDir, 'App.jsx');
  const outputPath = resolve(srcDir, 'App.public.jsx');
  let source = readFileSync(inputPath, 'utf8');

  source = `import DemoRequestForm from './DemoRequestForm.jsx';\n${source}`;

  source = removeSection(
    source,
    'const industryPages = {',
    '\nfunction useReveal',
    'legacy duplicate industry-page data'
  );

  source = removeSection(
    source,
    '\nfunction useClientSeo(route) {',
    '\nfunction Header()',
    'duplicate client SEO hook'
  );

  source = removeSection(
    source,
    '\nfunction DemoCta() {',
    '\nfunction HomePage()',
    'legacy placeholder demo form'
  );

  source = removeSection(
    source,
    '\nfunction IndustryPage({ page }) {',
    '\nfunction NotFoundPage()',
    'legacy duplicate industry-page renderer'
  );

  source = removeSection(
    source,
    '\nfunction Footer() {',
    '\nfunction getRoute()',
    'legacy minimal homepage footer'
  );

  source = replaceRequired(
    source,
    "  useClientSeo(route);\n",
    '',
    'duplicate useClientSeo call'
  );

  source = replaceRequired(
    source,
    "\n  const page = industryPages[route];\n",
    '',
    'legacy industry page lookup'
  );

  source = replaceRequired(
    source,
    "{route === '/' ? <HomePage /> : route === '/how-it-works' ? <RequestFlowPage /> : page ? <IndustryPage page={page} /> : <NotFoundPage />}",
    "{route === '/' ? <HomePage /> : route === '/how-it-works' ? <RequestFlowPage /> : <NotFoundPage />}",
    'legacy route renderer'
  );

  source = replaceRequired(
    source,
    '      <DemoCta />',
    '      <DemoRequestForm />',
    'source-owned demo request form'
  );

  source = replaceRequired(
    source,
    '      <Footer />',
    '',
    'remove nested homepage footer'
  );

  source = replaceAllRequired(
    source,
    '<span className="brand-mark">A</span>',
    '<span className="brand-mark" aria-hidden="true" />',
    'legacy brand-mark text'
  );

  source = replaceRequired(
    source,
    "    {\n      name: 'Porter',\n      role: 'Website leads',\n      copy: 'Sits on the website, answers questions before someone books or asks for service, captures lead details, and hands the warm lead to the business.'\n    },\n",
    '',
    'Porter core-team card'
  );

  const replacements = [
    [
      "{ channel: 'Website inquiry', agent: 'Porter' }",
      "{ channel: 'Website inquiry', agent: 'ARKON intake' }"
    ],
    [
      "{ label: 'Website inquiry', owner: 'Porter', copy: 'Answers questions before someone books or asks for service, captures the lead, and hands it to the business.' }",
      "{ label: 'Website inquiry', owner: 'ARKON intake', copy: 'Captures the question or request, organizes the lead details, and prepares the handoff to the business.' }"
    ],
    [
      "copy: 'Handles inbound and outbound messages in the owner’s voice, answers questions, coordinates requests, and follows up after Porter or Vera captures a lead.'",
      "copy: 'Handles inbound and outbound messages in the owner’s voice, answers questions, coordinates requests, and follows up after calls or website inquiries create a lead.'"
    ],
    [
      'ARKON is organized around trained roles. Naya, Vera, Porter, Grant, Marcus, and Iris',
      'ARKON is organized around trained roles. Naya, Vera, Grant, Marcus, and Iris'
    ],
    [
      "{ label: 'Website inquiry', name: 'Porter', detail: 'Porter answers pre-booking or pre-service questions, captures the lead, and hands the warm inquiry to the business.' }",
      "{ label: 'Website inquiry', name: 'ARKON intake', detail: 'ARKON captures the question or request, organizes the lead details, and prepares the handoff to the business.' }"
    ],
    [
      "{ number: '02', title: 'The right role responds first', copy: 'Vera, Porter, Naya, or Iris responds based on the channel and the job that needs to be done.' }",
      "{ number: '02', title: 'The right role responds first', copy: 'Vera, Naya, Iris, or ARKON intake responds based on the channel and the job that needs to be done.' }"
    ],
    [
      'Vera answers calls. Porter handles website inquiries. Iris sorts email. I handle client and guest messages in your voice.',
      'Vera answers calls. ARKON handles website inquiries. Iris sorts email. I handle client and guest messages in your voice.'
    ]
  ];

  for (const [from, to] of replacements) {
    source = replaceRequired(source, from, to, `public-copy replacement: ${from.slice(0, 48)}`);
  }

  if (/\bPorter\b|\bPORTER\b/.test(source)) {
    throw new Error('Generated App.public.jsx still contains a Porter reference.');
  }

  if (/useClientSeo|IndustryPage|industryPages/.test(source)) {
    throw new Error('Generated App.public.jsx still contains a legacy duplicate page or SEO source.');
  }

  if (/function DemoCta|front-end only for v1|onSubmit=\{event => event\.preventDefault\(\)\}/.test(source)) {
    throw new Error('Generated App.public.jsx still contains the legacy placeholder demo form.');
  }

  if (/function Footer\(\)|<Footer \/>/.test(source)) {
    throw new Error('Generated App.public.jsx still contains the legacy minimal footer.');
  }

  if (!source.includes('<DemoRequestForm />')) {
    throw new Error('Generated App.public.jsx is missing the source-owned demo form.');
  }

  if (/SiteFooter|<SiteFooter \/>/.test(source)) {
    throw new Error('Generated App.public.jsx contains a route-specific footer instead of the master footer shell.');
  }

  writeFileSync(outputPath, source);
}

function buildPublicEntry() {
  const inputPath = resolve(srcDir, 'main.jsx');
  const outputPath = resolve(srcDir, 'main.public.jsx');
  let source = readFileSync(inputPath, 'utf8');

  source = replaceRequired(
    source,
    "import App from './App.jsx';",
    "import App from './App.public.jsx';\nimport SiteFooter from './SiteFooter.jsx';\nimport LegalPage from './LegalPage.jsx';\nimport PageBanner from './PageBanner.jsx';\nimport CookieConsent from './CookieConsent.jsx';\nimport './legal-register.js';",
    'public App, page banner, legal page, footer, consent, and route imports'
  );

  source = removeSection(
    source,
    '\nfunction LegacyContactBannerRemover()',
    '\nfunction usePageReveal()',
    'runtime DOM cleanup components'
  );

  source = removeSection(
    source,
    '\nfunction UnifiedFooter()',
    '\nfunction Breadcrumbs',
    'legacy minimal industry footer'
  );

  source = removeSection(
    source,
    '\nfunction Breadcrumbs({ route, page })',
    '\nfunction PricingSection',
    'legacy inline breadcrumb renderer'
  );

  source = removeSection(
    source,
    '\nfunction AppWithCleanup({ route }) {',
    '\nconst route = getCurrentRoute();',
    'runtime cleanup wrapper'
  );

  source = replaceRequired(
    source,
    '      <UnifiedFooter />',
    '',
    'remove nested industry footer'
  );

  source = replaceRequired(
    source,
    `        <Breadcrumbs route={route} page={page} />
        <section className="hero industry-hero">
          <div className="hero-background" aria-hidden="true">
            <span className="orb orb-one" />
            <span className="orb orb-two" />
            <span className="grid-glow" />
          </div>
          <div className="industry-hero-inner" data-reveal>
            <p className="eyebrow">{page.eyebrow}</p>
            <h1>{page.title}</h1>
            <p>{page.description}</p>
            <div className="hero-actions">
              <a className="primary-button" href="/#demo">Request demo</a>
              <a className="secondary-button" href="/how-it-works">See how ARKON works</a>
            </div>
          </div>
        </section>`,
    '        <PageBanner page={page} route={route} />',
    'shared industry page banner'
  );

  source = replaceRequired(
    source,
    'const industryPage = industryPages[route];',
    "const routePage = industryPages[route];\nconst legalPage = routePage?.pageType === 'legal' ? routePage : null;\nconst industryPage = routePage?.pageType === 'legal' ? null : routePage;",
    'legal and industry route split'
  );

  source = replaceRequired(
    source,
    "    {industryPage\n      ? <UnifiedIndustryPage page={industryPage} route={route} />\n      : <AppWithCleanup route={route} />}",
    "    <>\n      {legalPage\n        ? (\n          <>\n            <ClientSeoSync route={route} />\n            <UnifiedHeader />\n            <main className=\"industry-page\">\n              <PageBanner page={legalPage} route={route} animate={false} />\n              <LegalPage page={legalPage} />\n            </main>\n          </>\n        )\n        : industryPage\n          ? <UnifiedIndustryPage page={industryPage} route={route} />\n          : (\n            <>\n              <ClientSeoSync route={route} />\n              <App />\n            </>\n          )}\n      <CookieConsent />\n    </>",
    'public legal, industry, homepage, and consent render block'
  );

  source += `\n\nconst footerContainer = document.getElementById('global-site-footer');\nif (!footerContainer) {\n  throw new Error('Global site footer container is missing.');\n}\ncreateRoot(footerContainer).render(\n  <React.StrictMode>\n    <SiteFooter />\n  </React.StrictMode>\n);\n`;

  if (/LegacyContactBannerRemover|BrandTextNormalizer|PublicRoleCopyCleanup|AppWithCleanup/.test(source)) {
    throw new Error('Generated main.public.jsx still contains runtime cleanup code.');
  }

  if (/function UnifiedFooter\(\)|<UnifiedFooter \/>/.test(source)) {
    throw new Error('Generated main.public.jsx still contains the legacy minimal industry footer.');
  }

  if (/function Breadcrumbs\(|<Breadcrumbs route=/.test(source)) {
    throw new Error('Generated main.public.jsx still contains the legacy inline page banner or breadcrumbs.');
  }

  if (!source.includes('<PageBanner page={page} route={route} />') || !source.includes('<PageBanner page={legalPage} route={route} animate={false} />')) {
    throw new Error('Generated main.public.jsx is missing the shared page banner.');
  }

  if (occurrenceCount(source, /<SiteFooter \/>/g) !== 1 || !source.includes("document.getElementById('global-site-footer')")) {
    throw new Error('Generated main.public.jsx must render exactly one master SiteFooter in the global footer container.');
  }

  if (!source.includes('<LegalPage page={legalPage} />') || !source.includes("import './legal-register.js';")) {
    throw new Error('Generated main.public.jsx is missing registered legal routes.');
  }

  if (occurrenceCount(source, /<CookieConsent \/>/g) !== 1) {
    throw new Error('Generated main.public.jsx must render exactly one global CookieConsent layer.');
  }

  writeFileSync(outputPath, source);
}

function verifyMasterShell() {
  const indexHtml = readFileSync(resolve(rootDir, 'index.html'), 'utf8');
  const appPublic = readFileSync(resolve(srcDir, 'App.public.jsx'), 'utf8');
  const mainPublic = readFileSync(resolve(srcDir, 'main.public.jsx'), 'utf8');
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
  const uniqueRoutes = [...new Set(crawlablePaths)];

  if (!indexHtml.includes('id="global-site-footer"') || !indexHtml.includes('data-footer-fallback="true"')) {
    throw new Error('index.html is missing the global footer container and crawler fallback.');
  }

  for (const legalHref of ['/privacy', '/terms', '/data-security', '/contact']) {
    if (!indexHtml.includes(`href="${legalHref}"`)) {
      throw new Error(`Global footer fallback is missing ${legalHref}.`);
    }
  }

  if (/SiteFooter|<SiteFooter \/>/.test(appPublic)) {
    throw new Error('App.public.jsx must not own a route-specific footer.');
  }

  if (occurrenceCount(mainPublic, /<SiteFooter \/>/g) !== 1 || occurrenceCount(mainPublic, /<CookieConsent \/>/g) !== 1) {
    throw new Error('Master shell must contain exactly one footer and one consent layer.');
  }

  for (const route of requiredRoutes) {
    if (!uniqueRoutes.includes(route)) throw new Error(`Master shell route audit is missing ${route}.`);
  }

  if (uniqueRoutes.length !== requiredRoutes.length) {
    throw new Error(`Expected ${requiredRoutes.length} public routes, found ${uniqueRoutes.length}. Update the route audit before adding or removing routes.`);
  }

  console.log(`Verified one master footer and consent shell across ${uniqueRoutes.length} public routes.`);
}

buildPublicApp();
buildPublicEntry();
verifyMasterShell();
console.log('Generated src/App.public.jsx and src/main.public.jsx.');
