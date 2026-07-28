import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

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

  if (!source.includes('<DemoRequestForm />')) {
    throw new Error('Generated App.public.jsx is missing the source-owned demo form.');
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
    "import App from './App.public.jsx';",
    'public App import'
  );

  source = removeSection(
    source,
    '\nfunction LegacyContactBannerRemover()',
    '\nfunction usePageReveal()',
    'runtime DOM cleanup components'
  );

  source = removeSection(
    source,
    '\nfunction AppWithCleanup({ route }) {',
    '\nconst route = getCurrentRoute();',
    'runtime cleanup wrapper'
  );

  source = replaceRequired(
    source,
    "    {industryPage\n      ? <UnifiedIndustryPage page={industryPage} route={route} />\n      : <AppWithCleanup route={route} />}",
    "    {industryPage\n      ? <UnifiedIndustryPage page={industryPage} route={route} />\n      : (\n        <>\n          <ClientSeoSync route={route} />\n          <App />\n        </>\n      )}",
    'public route render block'
  );

  if (/LegacyContactBannerRemover|BrandTextNormalizer|PublicRoleCopyCleanup|AppWithCleanup/.test(source)) {
    throw new Error('Generated main.public.jsx still contains runtime cleanup code.');
  }

  writeFileSync(outputPath, source);
}

buildPublicApp();
buildPublicEntry();
console.log('Generated src/App.public.jsx and src/main.public.jsx.');
