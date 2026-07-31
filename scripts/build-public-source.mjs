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

  source = `import CompactCoreTeam from './CompactCoreTeam.jsx';\nimport DemoRequestForm from './DemoRequestForm.jsx';\nimport FeaturedSolutions from './FeaturedSolutions.jsx';\nimport VoiceProof from './VoiceProof.jsx';\nimport WorkflowProof from './WorkflowProof.jsx';\n${source}`;

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
    '\nfunction Impact() {',
    '\nfunction HomePage()',
    'homepage impact band'
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
    '\nfunction WalkthroughSection() {',
    '\nfunction CoreTeam()',
    '\nfunction WalkthroughSection() {\n  return <WorkflowProof />;\n}\n',
    'merged homepage workflow proof'
  );

  source = replaceSection(
    source,
    '\nfunction CoreTeam() {',
    '\nfunction Solutions()',
    '\nfunction CoreTeam() {\n  return <CompactCoreTeam />;\n}\n',
    'compact homepage core team'
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

  source = removeSection(
    source,
    '\nfunction RoleViews() {',
    '\nfunction Coverage()',
    'homepage role views and dashboard sections'
  );

  source = replaceRequired(
    source,
    "import { coverageLanes, dashboardRows, roleViews, solutions } from './data.js';",
    "import { coverageLanes, solutions } from './data.js';",
    'unused role dashboard data imports'
  );
  source = replaceRequired(source, "  useClientSeo(route);\n", '', 'duplicate useClientSeo call');
  source = replaceRequired(source, "\n  const page = industryPages[route];\n", '', 'legacy industry page lookup');

  source = replaceRequired(
    source,
    "{route === '/' ? <HomePage /> : route === '/how-it-works' ? <RequestFlowPage /> : page ? <IndustryPage page={page} /> : <NotFoundPage />}",
    "{route === '/' ? <HomePage /> : route === '/how-it-works' ? <RequestFlowPage /> : <NotFoundPage />}",
    'legacy route renderer'
  );

  source = replaceRequired(
    source,
    '      <WalkthroughSection />\n      <HowItWorks />',
    '      <WalkthroughSection />',
    'duplicate homepage workflow render'
  );
  source = replaceRequired(
    source,
    '      <RoleViews />\n      <DashboardProof />\n',
    '',
    'homepage role dashboard renders'
  );
  source = replaceRequired(source, '      <Impact />\n', '', 'homepage impact render');
  source = replaceRequired(source, '      <DemoCta />', '      <DemoRequestForm />', 'source-owned demo form');
  source = replaceRequired(source, '      <Header />\n', '', 'homepage header render');
  source = replaceRequired(source, '      <Footer />\n', '', 'homepage footer render');

  source = source.replaceAll(
    '<span className="brand-mark">A</span>',
    '<span className="brand-mark" aria-hidden="true" />'
  );

  const replacements = [
    [
      '<p className="eyebrow">ARKON Systems</p>',
      '<p className="eyebrow">A digital team for service businesses</p>'
    ],
    [
      '<h1 style={{ maxWidth: \'1100px\', fontSize: \'clamp(2.2rem, 4.25vw, 4rem)\', lineHeight: 1.02 }}>Let your existing team focus<br />on the work only they can do.</h1>',
      '<h1 style={{ maxWidth: \'1100px\', fontSize: \'clamp(2.2rem, 4.25vw, 4rem)\', lineHeight: 1.02 }}>Stop letting good customers and warm leads go cold.</h1>'
    ],
    [
      '            ARKON handles the repeatable tasks around calls, messages, follow-ups, scheduling,\n            documents, estimates, invoices, and handoffs. Your staff can spend less time\n            chasing details and more time moving the business forward.',
      '            ARKON supplies a digital team that handles the routine work behind customer relationships.\n            It answers new inquiries, follows up with leads, nurtures people who are not ready yet,\n            reconnects with past customers, and keeps every opportunity moving toward the right next step.\n            Your employees stay focused on closing business, serving customers, and handling the work\n            that requires skill, judgment, and a real person.'
    ],
    ['<span>Repeatable tasks handled</span>', '<span>New inquiries answered</span>'],
    ['<span>Team stays focused</span>', '<span>Warm leads nurtured</span>'],
    ['<span>Follow-up covered</span>', '<span>Past customers brought back</span>'],
    ['<span>Handoffs prepared</span>', '<span>Follow-up kept moving</span>'],
    ['<span>Owner visibility</span>', '<span>Your team stays focused</span>'],
    ["{ channel: 'Website inquiry', agent: 'Porter' }", "{ channel: 'Website inquiry', agent: 'ARKON intake' }"],
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
    /function HowItWorks\(/,
    /function Impact\(|<Impact \/>|How it feels different/,
    /function RoleViews\(|<RoleViews \/>|function DashboardProof\(|<DashboardProof \/>/,
    /RoleDashboard|Role-based visibility|Example dashboard|Today’s work view/,
    /core-team-grid|core-team-card|One team, with the right role for each job/,
    /The business pages show how these roles work together/,
    /Let your existing team focus|repeatable tasks around calls/,
    /AI operating team for service businesses|ARKON handles the work around your existing team/,
    /function Header\(|<Header \/>/,
    /function Footer\(|<Footer \/>/,
    /SiteFooter|UnifiedHeader|UnifiedFooter/
  ];

  for (const pattern of forbidden) {
    if (pattern.test(source)) throw new Error(`Generated App.public.jsx failed source guard: ${pattern}.`);
  }

  if (!source.includes('A digital team for service businesses')) {
    throw new Error('Generated App.public.jsx is missing the digital-team product definition.');
  }

  if (!source.includes('Stop letting good customers and warm leads go cold.')) {
    throw new Error('Generated App.public.jsx is missing the revenue-focused homepage headline.');
  }

  if (!source.includes('nurtures people who are not ready yet') || !source.includes('reconnects with past customers')) {
    throw new Error('Generated App.public.jsx is missing the nurturing and reactivation value proposition.');
  }

  if (!source.includes('Your employees stay focused on closing business')) {
    throw new Error('Generated App.public.jsx is missing the human-team benefit.');
  }

  if (!source.includes('<CompactCoreTeam />')) {
    throw new Error('Generated App.public.jsx is missing the compact core team.');
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

  if (!source.includes('<WorkflowProof />')) {
    throw new Error('Generated App.public.jsx is missing the merged homepage workflow proof.');
  }

  writeFileSync(outputPath, source);
  console.log('Generated content-only src/App.public.jsx with the digital-team revenue message.');
}

function buildRuntimeServer() {
  const inputPath = resolve(rootDir, 'server.js');
  const outputPath = resolve(rootDir, 'server.runtime.js');
  let source = readFileSync(inputPath, 'utf8');

  source = replaceRequired(
    source,
    '<p class="crawlable-eyebrow">ARKON Systems</p>',
    '<p class="crawlable-eyebrow">A digital team for service businesses</p>',
    'crawlable homepage hero eyebrow'
  );
  source = replaceRequired(
    source,
    '<h1>Let your existing team focus on the work only they can do.</h1>',
    '<h1>Stop letting good customers and warm leads go cold.</h1>',
    'crawlable homepage hero headline'
  );
  source = replaceRequired(
    source,
    '<p>ARKON handles the repeatable tasks around calls, messages, follow-ups, scheduling, documents, estimates, invoices, and handoffs. Your staff can spend less time chasing details and more time moving the business forward.</p>',
    '<p>ARKON supplies a digital team that handles the routine work behind customer relationships. It answers new inquiries, follows up with leads, nurtures people who are not ready yet, reconnects with past customers, and keeps every opportunity moving toward the right next step. Your employees stay focused on closing business, serving customers, and handling the work that requires skill, judgment, and a real person.</p>',
    'crawlable homepage hero description'
  );

  source = removeSection(
    source,
    '  const team = [',
    '\n  const solutionCards = solutions.map',
    'crawlable homepage team data'
  );

  source = replaceSection(
    source,
    '    <section>\n      <p class="crawlable-eyebrow">Meet the core team</p>',
    '    <section id="solutions">',
    `    <section>
      <p class="crawlable-eyebrow">The core team</p>
      <h2>Five roles behind the work.</h2>
      <ul>
        <li><strong>Vera:</strong> calls and prepared handoffs.</li>
        <li><strong>Naya:</strong> messages and follow-up.</li>
        <li><strong>Marcus:</strong> customer history and context.</li>
        <li><strong>Iris:</strong> email prioritization.</li>
        <li><strong>Grant:</strong> owner alerts and open decisions.</li>
      </ul>
    </section>
`,
    'crawlable compact core team'
  );

  source = removeSection(
    source,
    '    <section>\n      <p class="crawlable-eyebrow">How it feels different</p>',
    '    <section id="demo">',
    'crawlable homepage impact band'
  );

  source = removeSection(
    source,
    '    <section>\n      <p class="crawlable-eyebrow">Owner visibility</p>',
    '    <section>\n      <p class="crawlable-eyebrow">The work behind each response</p>',
    'crawlable homepage owner dashboard section'
  );

  if (source.includes('Let your existing team focus') || source.includes('repeatable tasks around calls')) {
    throw new Error('Generated runtime server still contains the original unclear homepage hero.');
  }

  if (source.includes('AI operating team for service businesses') || source.includes('ARKON handles the work around your existing team.')) {
    throw new Error('Generated runtime server still contains the interim homepage positioning.');
  }

  if (!source.includes('A digital team for service businesses') || !source.includes('Stop letting good customers and warm leads go cold.')) {
    throw new Error('Generated runtime server is missing the digital-team revenue message.');
  }

  if (!source.includes('nurtures people who are not ready yet') || !source.includes('reconnects with past customers')) {
    throw new Error('Generated runtime server is missing nurturing or customer-reactivation copy.');
  }

  if (source.includes('Meet the core team') || source.includes('renderSimpleCards(team)')) {
    throw new Error('Generated runtime server still contains the oversized homepage core team.');
  }

  if (!source.includes('Five roles behind the work.')) {
    throw new Error('Generated runtime server is missing the compact core team.');
  }

  if (source.includes('The business pages show how these roles work together')) {
    throw new Error('Generated runtime server still contains the removed core team bridge copy.');
  }

  if (source.includes('How it feels different')) {
    throw new Error('Generated runtime server still contains the removed homepage impact band.');
  }

  if (source.includes('The owner sees what happened without carrying every detail.')) {
    throw new Error('Generated runtime server still contains the separate owner dashboard section.');
  }

  if (source.includes('Role-based visibility') || source.includes('Example dashboard. Sample data only.')) {
    throw new Error('Generated runtime server still contains the removed homepage role dashboard.');
  }

  writeFileSync(outputPath, source);
  console.log('Generated server.runtime.js with the digital-team revenue message.');
}

buildPublicApp();
buildRuntimeServer();
