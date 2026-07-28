import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptsDir = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(scriptsDir, '..');
const inputPath = resolve(rootDir, 'server.js');
const outputPath = resolve(rootDir, 'server.runtime.js');

function replaceRequired(source, from, to, label) {
  if (!source.includes(from)) throw new Error(`Could not find ${label}.`);
  return source.replace(from, to);
}

function removeSection(source, startMarker, endMarker, label) {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker);
  if (start === -1 || end === -1 || end <= start) {
    throw new Error(`Could not find valid ${label} boundaries.`);
  }
  return `${source.slice(0, start)}${source.slice(end)}`;
}

let source = readFileSync(inputPath, 'utf8');

source = replaceRequired(
  source,
  "import { handlePorterChat } from './porter-api.js';\n",
  '',
  'Porter API import'
);

source = removeSection(
  source,
  'function injectDemoRequestScript(html) {',
  'function sitemapXml() {',
  'legacy demo-form fallback'
);

source = replaceRequired(
  source,
  "  if (pathname === '/api/porter/chat') {\n    await handlePorterChat(req, res);\n    return;\n  }\n\n",
  '',
  'Porter chat route'
);

source = replaceRequired(
  source,
  "    const html = injectDemoRequestScript(\n      injectCrawlableContent(\n        injectCrawlableStyles(\n          injectSeo(rawHtml, route, isKnownRoute, requestedPath)\n        ),\n        route,\n        isKnownRoute\n      )\n    );",
  "    const html = injectCrawlableContent(\n      injectCrawlableStyles(\n        injectSeo(rawHtml, route, isKnownRoute, requestedPath)\n      ),\n      route,\n      isKnownRoute\n    );",
  'legacy demo-form injection wrapper'
);

if (/porter-api|handlePorterChat|\/api\/porter\/chat|injectDemoRequestScript|data-demo-request-script/i.test(source)) {
  throw new Error('Generated production server still contains a legacy Porter or demo-form fallback reference.');
}

writeFileSync(outputPath, source);
console.log('Generated server.runtime.js without legacy Porter or demo-form fallback code.');
