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
    title: 'AI Workflow Automation for Auto Repair Shops | ARKON Systems',
    description: 'ARKON helps auto repair shops manage repair calls, estimate requests, declined work follow-up, vehicle context, status updates, return visits, and owner visibility.',
    schemaType: 'Service'
  },
  '/medical-dental-offices': {
    title: 'AI Workflow Automation for Dental Offices | ARKON Systems',
    description: 'ARKON helps dental offices manage front desk calls, appointment requests, cancellations, no-shows, routine reminders, patient handoffs, and owner visibility.',
    schemaType: 'Service'
  },
  '/law-firms': {
    title: 'AI Workflow Automation for Law Firms | ARKON Systems',
    description: 'ARKON helps law firms manage intake calls, consultation requests, document questions, client follow-up, staff handoffs, and owner visibility.',
    schemaType: 'Service'
  },
  '/gyms-fitness-studios': {
    title: 'AI Workflow Automation for Gyms and Fitness Studios | ARKON Systems',
    description: 'ARKON helps gyms and fitness studios manage membership questions, booking requests, reminders, lead follow-up, staff handoffs, and owner visibility.',
    schemaType: 'Service'
  }
};

const crawlablePaths = Object.keys(seoPages);
const appShellPath = join(distDir, 'index.html');

const sharedShellCss = `
  .arkon-shared-header{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:18px!important;padding:24px 0!important;position:relative!important;z-index:5!important}
  .arkon-shared-brand{display:flex!important;align-items:center!important;gap:10px!important;font-weight:900!important;letter-spacing:.08em!important;color:inherit!important;text-decoration:none!important}
  .arkon-shared-mark{width:34px!important;height:34px!important;display:grid!important;place-items:center!important;border-radius:12px!important;background:linear-gradient(135deg,#67d8ff,#82f7ca)!important;color:#06111f!important;font-weight:900!important}
  .arkon-shared-nav{display:flex!important;gap:18px!important;align-items:center!important;color:#9fb0ca!important;font-size:.9rem!important}
  .arkon-shared-nav a{color:inherit!important;text-decoration:none!important}
  .arkon-shared-cta{display:inline-flex!important;align-items:center!important;justify-content:center!important;min-height:42px!important;padding:0 18px!important;border-radius:999px!important;background:linear-gradient(135deg,#67d8ff,#82f7ca)!important;color:#06111f!important;font-weight:850!important;text-decoration:none!important;white-space:nowrap!important}
  .arkon-shared-footer{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:18px!important;margin:24px 0 42px!important;padding:26px 0 0!important;border-top:1px solid rgba(175,199,255,.16)!important;color:#9fb0ca!important;font-size:.92rem!important}
  .arkon-shared-footer p{margin:0!important;color:#9fb0ca!important;line-height:1.55!important}
  @media(max-width:760px){.arkon-shared-header,.arkon-shared-footer{align-items:flex-start!important;flex-direction:column!important}.arkon-shared-nav{flex-wrap:wrap!important}.arkon-shared-cta{width:auto!important}}
`;

function sharedHeaderHtml() {
  return `<header class="arkon-shared-header" data-shared-shell="header">
        <a class="arkon-shared-brand" href="/" aria-label="ARKON Systems home"><span class="arkon-shared-mark">A</span><span>ARKON Systems</span></a>
        <nav class="arkon-shared-nav" aria-label="Primary navigation"><a href="/#how">How it works</a><a href="/#team">Core team</a><a href="/#solutions">Business types</a><a href="/#voice">Your voice</a></nav>
        <a class="arkon-shared-cta" href="/#demo">Book a demo</a>
      </header>`;
}

function sharedFooterHtml() {
  const year = new Date().getFullYear();
  return `<footer class="arkon-shared-footer" data-shared-shell="footer">
        <a class="arkon-shared-brand" href="/" aria-label="ARKON Systems home"><span class="arkon-shared-mark">A</span><span>ARKON Systems</span></a>
        <p>© ${year} ARKON Systems. Repeatable work handled. Your team stays focused.</p>
      </footer>`;
}

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
    .replace(/<!--SEO_TITLE-->[\s\S]*?<!--\/SEO_TITLE-->/g, escapeHtml(seo.title))
    .replace(/<!--SEO_DESCRIPTION-->[\s\S]*?<!--\/SEO_DESCRIPTION-->/g, escapeHtml(seo.description))
    .replace(/<!--SEO_CANONICAL-->[\s\S]*?<!--\/SEO_CANONICAL-->/g, escapeHtml(canonical))
    .replace(/<!--SEO_SCHEMA-->[\s\S]*?<!--\/SEO_SCHEMA-->/, buildSchema(route, seo));
}

function applySharedShell(html) {
  let next = html;

  if (!next.includes('data-shared-shell="header"')) {
    next = next.replace(/\s*<header[\s\S]*?<\/header>\s*/i, '\n');
    next = next.replace(/<div class="wrap">\s*/i, `<div class="wrap">\n      ${sharedHeaderHtml()}\n`);
  }

  if (!next.includes('data-shared-shell="footer"')) {
    next = next.replace(/\s*<\/main>\s*<\/div>\s*<\/body>/i, `\n    </main>\n      ${sharedFooterHtml()}\n    </div>\n  </body>`);
  }

  if (!next.includes('arkon-shared-header')) return next;
  if (!next.includes('.arkon-shared-header')) {
    next = next.replace(/<\/style>/i, `${sharedShellCss}\n  </style>`);
  }

  return next;
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
  const route = normalizeRoute(reqUrl);
  const normalizedPathname = pathname.replace(/\/$/, '') || '/';

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
    filePath = appShellPath;
  }

  const ext = extname(filePath).toLowerCase();
  const headers = {
    'content-type': mimeTypes[ext] || 'application/octet-stream',
    'cache-control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable'
  };

  if (ext === '.html') {
    const isKnownRoute = Boolean(seoPages[normalizedPathname]);
    const isStandaloneStaticPage = filePath !== appShellPath;
    const rawHtml = readFileSync(filePath, 'utf8');
    const htmlWithShell = isKnownRoute && isStandaloneStaticPage ? applySharedShell(rawHtml) : rawHtml;

    res.writeHead(isKnownRoute ? 200 : 404, headers);
    res.end(injectSeo(htmlWithShell, route));
    return;
  }

  res.writeHead(200, headers);
  res.end(readFileSync(filePath));
}).listen(port, () => {
  console.log(`ARKON homepage running on port ${port}`);
});