import { legalPages } from './legal-content.js';
import { crawlablePaths, industryPages, seoPages } from './site-content.js';

function sectionText(section) {
  return [
    ...(section.paragraphs || []),
    ...(section.bullets || []),
    ...(section.contactItems || []).map(item => `${item.label}: ${item.value}`),
    section.callout || ''
  ].filter(Boolean).join(' ');
}

for (const [path, page] of Object.entries(legalPages)) {
  const registeredPage = {
    ...page,
    cards: page.sections.map(section => [section.title, sectionText(section)])
  };

  industryPages[path] = registeredPage;
  seoPages[path] = {
    path,
    title: registeredPage.seoTitle,
    description: registeredPage.description,
    schemaType: registeredPage.schemaType,
    schemaName: registeredPage.name,
    eyebrow: registeredPage.eyebrow,
    h1: registeredPage.title
  };

  if (!crawlablePaths.includes(path)) crawlablePaths.push(path);
}
