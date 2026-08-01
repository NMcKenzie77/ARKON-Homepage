import { readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = join(rootDir, 'src');

async function replaceExact(path, before, after, expectedCount = 1) {
  const fullPath = join(rootDir, path);
  const source = await readFile(fullPath, 'utf8');
  const count = source.split(before).length - 1;

  if (count === 0 && source.includes(after)) return 0;
  if (count !== expectedCount) {
    throw new Error(`${path}: expected ${expectedCount} replacement target(s), found ${count}.`);
  }

  await writeFile(fullPath, source.replaceAll(before, after));
  return count;
}

await replaceExact(
  'src/App.jsx',
  `<div className="request-animation-header">
        <p className="eyebrow">Workflow animation</p>
        <h3>See how a request moves through ARKON.</h3>`,
  `<div className="request-animation-header">
        <p className="eyebrow">Workflow animation</p>
        <h2>See how a request moves through ARKON.</h2>`
);

await replaceExact(
  'server.js',
  `  "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com",`,
  `  "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com https://fonts.googleapis.com https://fonts.gstatic.com",`
);

const multilineThinkingBefore = `            <div className="real-estate-call-thinking" aria-label="Conversation continuing">
              <span />
              <span />
              <span />
            </div>`;
const multilineThinkingAfter = `            <div className="real-estate-call-thinking" role="status" aria-label="Conversation continuing">
              <span aria-hidden="true" />
              <span aria-hidden="true" />
              <span aria-hidden="true" />
            </div>`;

await replaceExact('src/RealEstateCallDemo.jsx', multilineThinkingBefore, multilineThinkingAfter);
await replaceExact('src/InsuranceCallDemo.jsx', multilineThinkingBefore, multilineThinkingAfter);

await replaceExact(
  'src/ShortTermRentalCallDemo.jsx',
  '<div className="real-estate-call-thinking" aria-label="Conversation continuing"><span /><span /><span /></div>',
  '<div className="real-estate-call-thinking" role="status" aria-label="Conversation continuing"><span aria-hidden="true" /><span aria-hidden="true" /><span aria-hidden="true" /></div>'
);

await replaceExact(
  'src/SalonConversationDemo.jsx',
  '<div className={`phone-typing phone-typing-${side}`} aria-label="Typing">\n      <span />\n      <span />\n      <span />\n    </div>',
  '<div className={`phone-typing phone-typing-${side}`} role="status" aria-label="Typing">\n      <span aria-hidden="true" />\n      <span aria-hidden="true" />\n      <span aria-hidden="true" />\n    </div>'
);

await replaceExact(
  'src/SalonConversationDemo.jsx',
  '<div className="conversation-proof-row" aria-label="Conversation demonstration features">',
  '<div className="conversation-proof-row" role="group" aria-label="Conversation demonstration features">'
);

await replaceExact(
  'src/SalonConversationDemo.jsx',
  '<div className="phone-transcript" ref={transcriptRef} aria-label={`Animated example conversation with ${ASSISTANT_NAME}`}>',
  '<div className="phone-transcript" ref={transcriptRef} role="log" aria-live="polite" aria-label={`Animated example conversation with ${ASSISTANT_NAME}`}>'
);

const jsxFiles = (await readdir(srcDir)).filter(name => name.endsWith('.jsx'));
let dashboardNavigationCount = 0;

for (const fileName of jsxFiles) {
  const fullPath = join(srcDir, fileName);
  const source = await readFile(fullPath, 'utf8');
  const target = '<nav aria-label="Example ARKON';
  const replacement = '<nav tabIndex="0" aria-label="Example ARKON';
  const count = source.split(target).length - 1;

  if (!count) continue;
  dashboardNavigationCount += count;
  await writeFile(fullPath, source.replaceAll(target, replacement));
}

if (dashboardNavigationCount < 4) {
  const alreadyUpdated = await Promise.all(jsxFiles.map(async fileName => {
    const source = await readFile(join(srcDir, fileName), 'utf8');
    return source.split('<nav tabIndex="0" aria-label="Example ARKON').length - 1;
  }));
  const updatedCount = alreadyUpdated.reduce((total, count) => total + count, 0);
  if (updatedCount < 4) {
    throw new Error(`Expected four dashboard navigation regions, found ${dashboardNavigationCount + updatedCount}.`);
  }
}

const dashboardCssPath = join(srcDir, 'real-estate-dashboard-preview.css');
let dashboardCss = await readFile(dashboardCssPath, 'utf8');

if (dashboardCss.includes('--grant-amber: #b97a00;')) {
  dashboardCss = dashboardCss.replace('--grant-amber: #b97a00;', '--grant-amber: #8a5600;');
} else if (!dashboardCss.includes('--grant-amber: #8a5600;')) {
  throw new Error('Dashboard amber color target was not found.');
}

const focusRule = `.grant-preview-sidebar nav:focus-visible {
  outline: 3px solid #67d8ff;
  outline-offset: 3px;
  border-radius: 8px;
}`;

if (!dashboardCss.includes(focusRule)) {
  dashboardCss = `${dashboardCss.trim()}\n\n${focusRule}\n`;
}

await writeFile(dashboardCssPath, dashboardCss);

console.log('Applied guarded accessibility cleanup.');
