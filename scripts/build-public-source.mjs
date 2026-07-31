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

function replaceSection(source, startMarker, endMarker, replacement, label) {
  const start = requireMarker(source, startMarker, `${label} start`);
  const end = requireMarker(source, endMarker, `${label} end`);
  if (end <= start) throw new Error(`Invalid ${label} boundaries.`);
  return `${source.slice(0, start)}${replacement}${source.slice(end)}`;
}

function replaceRequired(source, from, to, label) {
  if (!source.includes(from)) throw new Error(`Could not find ${label}.`);
  return source.replace(from, to);
}

function buildPublicApp() {
  const inputPath = resolve(srcDir, 'App.jsx');
  const outputPath = resolve(srcDir, 'App.public.jsx');
  let source = readFileSync(inputPath, 'utf8');

  source = `import DemoRequestForm from './DemoRequestForm.jsx';\nimport FeaturedSolutions from './FeaturedSolutions.jsx';\nimport VoiceProof from './VoiceProof.jsx';\n${source}`;

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
    '\nfunction Header()',
    '\nfunction Hero()',
    'route-owned homepage header'
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

  source = replaceSection(
    source,
    '\nfunction Solutions() {',
    '\nfunction VoiceLayer()',
    '\nfunction Solutions() {\n  return <FeaturedSolutions />;\n}\n',
    'featured homepage business types'
  );

  source = replaceSection(
    source,
    '\nfunction VoiceLayer() {',
    '\nfunction RoleViews()',
    '\nfunction VoiceLayer() {\n  return <VoiceProof />;\n}\n',
    'homepage voice proof section'
  );

  source = replaceRequired(source, "  useClientSeo(route);\n", '', 'duplicate useClientSeo call');
  source = replaceRequired(source, "\n  const page = industryPages[route];\n", '', 'legacy industry page lookup');

  source = replaceRequired(
    source,
    "{route === '/' ? <HomePage /> : route === '/how-it-works' ? <RequestFlowPage /> : page ? <IndustryPage page={page} /> : <NotFoundPage />}",
    "{route === '/' ? <HomePage /> : route === '/how-it-works' ? <RequestFlowPage /> : <NotFoundPage />}",
    'legacy route renderer'
  );

  source = replaceRequired(source, '      <DemoCta />', '      <DemoRequestForm />', 'source-owned demo form');
  source = replaceRequired(source, '      <Header />\n', '', 'homepage header render');
  source = replaceRequired(source, '      <Footer />\n', '', 'homepage footer render');

  source = source.replaceAll(
    '<span className="brand-mark">A</span>',
    '<span className="brand-mark" aria-hidden="true" />'
  );

  source = replaceRequired(
    source,
    "    {\n      name: 'Porter',\n      role: 'Website leads',\n      copy: 'Sits on the website, answers questions before someone books or asks for service, captures lead details, and hands the warm lead to the business.'\n    },\n",
    '',
    'Porter core-team card'
  );

  const replacements = [
    ["{ channel: 'Website inquiry', agent: 'Porter' }", "{ channel: 'Website inquiry', agent: 'ARKON intake' }"],
    [
      "{ label: 'Phone call', owner: 'Vera', copy: 'Answers the call, qualifies the caller, captures the details, and routes it when a person is needed.' }",
      "{ label: 'Phone call', owner: 'Answered and routed', copy: 'The caller is greeted, qualified, and routed with the important details already captured.' }"
    ],
    [
      "{ label: 'Website inquiry', owner: 'Porter', copy: 'Answers questions before someone books or asks for service, captures the lead, and hands it to the business.' }",
      "{ label: 'Website inquiry', owner: 'Captured and organized', copy: 'The question or request is captured, the lead details are organized, and the handoff is prepared.' }"
    ],
    [
      "{ label: 'Text or client message', owner: 'Naya', copy: 'Responds in the owner’s voice, answers what she can, and follows up when a lead does not convert.' }",
      "{ label: 'Text or client message', owner: 'Handled in your voice', copy: 'The message receives an approved response, and follow-up continues when the next step is clear.' }"
    ],
    [
      "{ label: 'Email', owner: 'Iris', copy: 'Reads the inbox, scores urgency and importance, and surfaces what needs attention first.' }",
      "{ label: 'Email', owner: 'Prioritized and surfaced', copy: 'The inbox is sorted by urgency and importance so the right items reach the team first.' }"
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

  const forbidden = [
    /\bPorter\b|\bPORTER\b/,
    /useClientSeo|IndustryPage|industryPages/,
    /function DemoCta|front-end only for v1/,
    /function Header\(|<Header \/>/,
    /function Footer\(|<Footer \/>/,
    /SiteFooter|UnifiedHeader|UnifiedFooter/
  ];

  for (const pattern of forbidden) {
    if (pattern.test(source)) throw new Error(`Generated App.public.jsx failed source guard: ${pattern}.`);
  }

  if (!source.includes('<DemoRequestForm />')) {
    throw new Error('Generated App.public.jsx is missing the real demo form.');
  }

  if (!source.includes('<FeaturedSolutions />')) {
    throw new Error('Generated App.public.jsx is missing the featured business types.');
  }

  if (!source.includes('<VoiceProof />')) {
    throw new Error('Generated App.public.jsx is missing the homepage voice proof.');
  }

  writeFileSync(outputPath, source);
  console.log('Generated content-only src/App.public.jsx.');
}

buildPublicApp();
