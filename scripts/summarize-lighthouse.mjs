import { readdir, readFile, writeFile } from 'node:fs/promises';

const outputDir = 'audit-output';
const files = (await readdir(outputDir)).filter(name => name.startsWith('lighthouse-') && name.endsWith('.json'));
const summaries = [];

for (const file of files) {
  try {
    const report = JSON.parse(await readFile(`${outputDir}/${file}`, 'utf8'));
    const categories = Object.fromEntries(
      Object.entries(report.categories || {}).map(([key, value]) => [key, Math.round((value.score || 0) * 100)])
    );
    const audits = report.audits || {};
    summaries.push({
      file,
      requestedUrl: report.requestedUrl,
      finalUrl: report.finalUrl,
      fetchTime: report.fetchTime,
      lighthouseVersion: report.lighthouseVersion,
      categories,
      metrics: {
        firstContentfulPaint: audits['first-contentful-paint']?.displayValue || '',
        largestContentfulPaint: audits['largest-contentful-paint']?.displayValue || '',
        totalBlockingTime: audits['total-blocking-time']?.displayValue || '',
        cumulativeLayoutShift: audits['cumulative-layout-shift']?.displayValue || '',
        speedIndex: audits['speed-index']?.displayValue || ''
      },
      failingAudits: Object.values(audits)
        .filter(audit => audit.scoreDisplayMode === 'binary' && audit.score === 0)
        .map(audit => ({ id: audit.id, title: audit.title, description: audit.description }))
    });
  } catch (error) {
    summaries.push({ file, error: String(error?.message || error) });
  }
}

await writeFile(`${outputDir}/lighthouse-summary.json`, JSON.stringify(summaries, null, 2));

const lines = ['# Lighthouse Summary', ''];
for (const summary of summaries) {
  lines.push(`## ${summary.file}`, '');
  if (summary.error) {
    lines.push(`Error: ${summary.error}`, '');
    continue;
  }
  lines.push(
    `- Performance: ${summary.categories.performance ?? 'n/a'}`,
    `- Accessibility: ${summary.categories.accessibility ?? 'n/a'}`,
    `- Best practices: ${summary.categories['best-practices'] ?? 'n/a'}`,
    `- SEO: ${summary.categories.seo ?? 'n/a'}`,
    `- FCP: ${summary.metrics.firstContentfulPaint}`,
    `- LCP: ${summary.metrics.largestContentfulPaint}`,
    `- TBT: ${summary.metrics.totalBlockingTime}`,
    `- CLS: ${summary.metrics.cumulativeLayoutShift}`,
    ''
  );
}
await writeFile(`${outputDir}/lighthouse-summary.md`, `${lines.join('\n')}\n`);
console.log(lines.join('\n'));