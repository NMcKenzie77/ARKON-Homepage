import { legalPages } from './legal-content.js';
import { crawlablePaths, industryPages, seoPages } from './site-content.js';

for (const [path, page] of Object.entries(legalPages)) {
  industryPages[path] = page;
  seoPages[path] = {
    path,
    title: page.seoTitle,
    description: page.description,
    schemaType: page.schemaType,
    schemaName: page.name,
    eyebrow: page.eyebrow,
    h1: page.title
  };

  if (!crawlablePaths.includes(path)) crawlablePaths.push(path);
}
