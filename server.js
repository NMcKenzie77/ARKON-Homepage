import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const distDir = resolve(__dirname, 'dist');
const port = process.env.PORT || 3000;
const siteUrl = (process.env.SITE_URL || 'https://arkonsystems.com').replace(/\/$/, '');

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon'
};

const seoPages = {
  '/': {
    title: 'ARKON Systems | AI Workflow Automation for Service Businesses',
    description: 'ARKON Systems gives service businesses an AI operating team for calls, messages, follow-up, scheduling, records, handoffs, and owner visibility.',
    schemaType: 'SoftwareApplication'
  },
  '/how-it-works': {
    title: 'How ARKON Works | Request Routing, Business Rules, and Owner Visibility',
    description: 'See how ARKON handles calls, website inquiries, text messages, email, relationship history, business rules, safe next steps, and owner summaries.',
    schemaType: 'SoftwareApplication'
  },
  '/real-estate': {
    title: 'AI Workflow Automation for Real Estate Teams | ARKON Systems',
    description: 'ARKON helps real estate teams respond to leads, showing requests, seller calls, buyer questions, follow-up, agent handoffs, and owner visibility.',
    schemaType: 'Service'
  },
  '/insurance': {
    title: 'AI Workflow Automation for Insurance Agencies | ARKON Systems',
    description: 'ARKON helps insurance agencies handle quote requests, policyholder questions, renewals, documents, producer follow-up, CRM updates, and owner visibility.',
    schemaType: 'Service'
  },
  '/short-term-rentals': {
    title: 'AI Workflow Automation for Short-Term Rentals | ARKON Systems',
    description: 'ARKON helps short-term rental operators manage guest messages, cleaner coordination, vendor updates, urgent issues, follow-up, and host visibility.',
    schemaType: 'Service'
  },
  '/home-services': {
    title: 'AI Workflow Automation for Home Service Businesses | ARKON Systems',
    description: 'ARKON helps home service businesses handle calls, estimates, repairs, technician updates, scheduling, invoices, customer messages, and owner visibility.',
    schemaType: 'Service'
  },
  '/professional-services': {
    title: 'AI Workflow Automation for Professional Services | ARKON Systems',
    description: 'ARKON helps professional service firms manage intake, scheduling, client questions, document requests, follow-up, handoffs, and owner visibility.',
    schemaType: 'Service'
  },
  '/salons': {
    title: 'AI Workflow Automation for Salons | ARKON Systems',
    description: 'ARKON helps salons manage missed calls, booking requests, client messages, appointment follow-up, staff handoffs, and owner visibility.',
    schemaType: 'Service'
  },
  '/garages': {
    title: 'AI Workflow Automation for Garages and Auto Shops | ARKON Systems',
    description: 'ARKON helps garages and auto repair shops manage customer calls, repair updates, estimate requests, appointment intake, and owner visibility.',
    schemaType: 'Service'
  }
};

const crawlablePaths = Object.keys(seoPages);

function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  const normalized = normalize(decoded).replace(/^([/\\])+/, '');
  return resolve(distDir, normalized || 'index.html');
}

function normalizeRoute(rawUrl = '/') {
  const pathname = rawUrl.split('?')[0].replace(/\/$/, '') || '/';
  return seoPages[pathname] ? pathname : '/';
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function buildSchema(route, seo) {
  const url = `${siteUrl}${route === '/' ? '/' : route}`;
  const base = {
    '@context': 'https://schema.org',
    '@type': seo.schemaType,
    name: seo.title.replace(' | ARKON Systems', '').replace('ARKON Systems | ', ''),
    description: seo.description,
    url,
    provider: {
      '@type': 'Organization',
      name: 'ARKON Systems',
      url: `${siteUrl}/`
    }
  };

  if (seo.schemaType === 'SoftwareApplication') {
    base.applicationCategory = 'BusinessApplication';
    base.operatingSystem = 'Web';
  }

  return JSON.stringify(base);
}

function injectSeo(html, route) {
  const seo = seoPages[route] || seoPages['/'];
  const canonical = `${siteUrl}${route === '/' ? '/' : route}`;
  return html
    .replaceAll('<!--SEO_TITLE-->ARKON Systems | AI Workflow Automation for Service Businesses<!--/SEO_TITLE-->', escapeHtml(seo.title))
    .replaceAll('<!--SEO_DESCRIPTION-->ARKON Systems gives service businesses an AI operating team for calls, messages, follow-up, scheduling, records, handoffs, and owner visibility.<!--/SEO_DESCRIPTION-->', escapeHtml(seo.description))
    .replaceAll('<!--SEO_CANONICAL-->https://arkonsystems.com/<!--/SEO_CANONICAL-->', escapeHtml(canonical))
    .replace('<!--SEO_SCHEMA-->{"@context":"https://schema.org","@type":"Organization","name":"ARKON Systems","url":"https://arkonsystems.com/"}<!--/SEO_SCHEMA-->', buildSchema(route, seo));
}

function sitemapXml() {
  const urls = crawlablePaths.map(path => {
    const loc = `${siteUrl}${path === '/' ? '/' : path}`;
    return `  <url>\n    <loc>${loc}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${path === '/' ? '1.0' : '0.8'}</priority>\n  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function robotsTxt() {
  return `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`;
}

createServer((req, res) => {
  if (!existsSync(distDir)) {
    res.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('Build folder not found. Run npm run build before npm start.');
    return;
  }

  const reqUrl = req.url || '/';
  const pathname = reqUrl.split('?')[0];

  if (pathname === '/robots.txt') {
    res.writeHead(200, { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'public, max-age=3600' });
    res.end(robotsTxt());
    return;
  }

  if (pathname === '/sitemap.xml') {
    res.writeHead(200, { 'content-type': 'application/xml; charset=utf-8', 'cache-control': 'public, max-age=3600' });
    res.end(sitemapXml());
    return;
  }

  let filePath = safePath(reqUrl);
  if (!filePath.startsWith(distDir)) {
    res.writeHead(403, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('Forbidden');
    return;
  }

  if (existsSync(filePath) && statSync(filePath).isDirectory()) {
    filePath = join(filePath, 'index.html');
  }

  if (!existsSync(filePath)) {
    filePath = join(distDir, 'index.html');
  }

  const ext = extname(filePath).toLowerCase();
  const headers = {
    'content-type': mimeTypes[ext] || 'application/octet-stream',
    'cache-control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable'
  };

  if (ext === '.html') {
    const route = normalizeRoute(reqUrl);
    res.writeHead(seoPages[pathname.replace(/\/$/, '') || '/'] ? 200 : 404, headers);
    res.end(injectSeo(readFileSync(filePath, 'utf8'), route));
    return;
  }

  res.writeHead(200, headers);
  res.end(readFileSync(filePath));
}).listen(port, () => {
  console.log(`ARKON homepage running on port ${port}`);
});
