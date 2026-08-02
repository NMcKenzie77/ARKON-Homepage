import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function replaceRequired(source, before, after, label) {
  if (!source.includes(before)) throw new Error(`Could not find ${label}.`);
  return source.replace(before, after);
}

function removeSection(source, startMarker, endMarker, label) {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start + startMarker.length);
  if (start === -1 || end === -1 || end <= start) {
    throw new Error(`Could not find valid ${label} boundaries.`);
  }
  return `${source.slice(0, start)}${source.slice(end)}`;
}

async function updateFile(relativePath, transform) {
  const path = resolve(rootDir, relativePath);
  const source = await readFile(path, 'utf8');
  const updated = transform(source);
  if (updated === source) throw new Error(`${relativePath} was not changed.`);
  await writeFile(path, updated);
}

await updateFile('src/App.jsx', source => {
  let updated = replaceRequired(
    source,
    "import { coverageLanes, dashboardRows, roleViews, solutions } from './data.js';",
    "import { dashboardRows, roleViews, solutions } from './data.js';",
    'legacy homepage coverage data import'
  );
  updated = removeSection(
    updated,
    '\nfunction Coverage() {',
    '\nfunction Impact()',
    'legacy homepage coverage component'
  );
  updated = replaceRequired(updated, '      <Coverage />\n', '', 'legacy homepage coverage render');
  return updated;
});

await updateFile('server.js', source => {
  let updated = replaceRequired(
    source,
    "import { coverageLanes, solutions } from './src/data.js';",
    "import { solutions } from './src/data.js';",
    'crawlable homepage coverage data import'
  );
  updated = removeSection(
    updated,
    '\n  const coverageCards = coverageLanes.map',
    '\n\n  return `<main class="crawlable-page"',
    'crawlable homepage coverage card data'
  );
  updated = removeSection(
    updated,
    '    <section>\n      <p class="crawlable-eyebrow">The work behind each response</p>',
    '    <section>\n      <p class="crawlable-eyebrow">How it feels different</p>',
    'crawlable homepage coverage section'
  );
  return updated;
});

await updateFile('src/homepage-spacing.css', source => {
  let updated = replaceRequired(
    source,
    `#root > main > .voice-proof-section + .section {
  padding-top: 64px;
  padding-bottom: 0;
}

#root > main > .voice-proof-section + .section + .demo-cta {
  margin-top: 64px;
}`,
    `#root > main > .voice-proof-section + .demo-cta {
  margin-top: 64px;
}`,
    'desktop voice-to-demo spacing'
  );
  updated = replaceRequired(
    updated,
    `  #root > main > .featured-solutions-section,
  #root > main > .voice-proof-section,
  #root > main > .voice-proof-section + .section {
    padding-top: 48px;
    padding-bottom: 0;
  }

  #root > main > .voice-proof-section + .section + .demo-cta {
    margin-top: 48px;
  }`,
    `  #root > main > .featured-solutions-section,
  #root > main > .voice-proof-section {
    padding-top: 48px;
    padding-bottom: 0;
  }

  #root > main > .voice-proof-section + .demo-cta {
    margin-top: 48px;
  }`,
    'mobile voice-to-demo spacing'
  );
  return updated;
});

await updateFile('scripts/build-public-source.mjs', source => {
  let updated = replaceRequired(
    source,
    `  source = removeSection(
    source,
    '\\nfunction RoleViews() {',
    '\\nfunction Coverage()',
    'homepage role views and dashboard sections'
  );`,
    `  source = removeSection(
    source,
    '\\nfunction RoleViews() {',
    '\\nfunction HomePage()',
    'homepage role views and dashboard sections'
  );`,
    'public app role-view removal boundary'
  );
  updated = replaceRequired(
    updated,
    `    "import { coverageLanes, dashboardRows, roleViews, solutions } from './data.js';",
    "import { coverageLanes, solutions } from './data.js';",`,
    `    "import { dashboardRows, roleViews, solutions } from './data.js';",
    "import { solutions } from './data.js';",`,
    'public app data import cleanup'
  );
  updated = replaceRequired(
    updated,
    `    /function RoleViews\\(|<RoleViews \\/>|function DashboardProof\\(|<DashboardProof \\/>/,
    /RoleDashboard|Role-based visibility|Example dashboard|Today’s work view/,`,
    `    /function RoleViews\\(|<RoleViews \\/>|function DashboardProof\\(|<DashboardProof \\/>/,
    /function Coverage\\(|<Coverage \\/>|The work behind each response|One customer experience\\. The right role behind each step\\./,
    /RoleDashboard|Role-based visibility|Example dashboard|Today’s work view/,`,
    'public app coverage source guard'
  );
  updated = replaceRequired(
    updated,
    `  source = removeSection(
    source,
    '    <section>\\n      <p class="crawlable-eyebrow">Owner visibility</p>',
    '    <section>\\n      <p class="crawlable-eyebrow">The work behind each response</p>',
    'crawlable homepage owner dashboard section'
  );`,
    `  source = removeSection(
    source,
    '    <section>\\n      <p class="crawlable-eyebrow">Owner visibility</p>',
    '    <section id="demo">',
    'crawlable homepage owner dashboard section'
  );`,
    'crawlable owner-dashboard removal boundary'
  );
  updated = replaceRequired(
    updated,
    `  if (source.includes('The owner sees what happened without carrying every detail.')) {
    throw new Error('Generated runtime server still contains the separate owner dashboard section.');
  }

  if (source.includes('Role-based visibility') || source.includes('Example dashboard. Sample data only.')) {`,
    `  if (source.includes('The owner sees what happened without carrying every detail.')) {
    throw new Error('Generated runtime server still contains the separate owner dashboard section.');
  }

  if (source.includes('The work behind each response') || source.includes('One customer experience. The right role behind each step.')) {
    throw new Error('Generated runtime server still contains the removed homepage coverage section.');
  }

  if (source.includes('Role-based visibility') || source.includes('Example dashboard. Sample data only.')) {`,
    'crawlable homepage coverage guard'
  );
  return updated;
});

console.log('Removed the homepage Coverage section from public, crawlable, and legacy sources.');
