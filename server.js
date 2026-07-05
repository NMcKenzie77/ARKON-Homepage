import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { handlePorterChat } from './porter-api.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const distDir = resolve(__dirname, 'dist');
const port = process.env.PORT || 3000;
const siteUrl = (process.env.SITE_URL || 'https://arkonsysai.com').replace(/\/$/, '');
const appShellPath = join(distDir, 'index.html');

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
    schemaType: 'SoftwareApplication',
    eyebrow: 'ARKON Systems',
    h1: 'Let your existing team focus on the work only they can do.',
    body: [
      'ARKON handles the repeatable tasks around calls, messages, follow-ups, scheduling, documents, estimates, invoices, and handoffs.',
      'The business keeps its voice and rules. ARKON supports the front desk, customer follow-up, records, routing, and owner visibility so the team can spend less time chasing details.'
    ],
    bullets: ['Calls and messages handled', 'Follow-up covered', 'Scheduling support', 'Records and handoffs prepared', 'Owner visibility']
  },
  '/how-it-works': {
    title: 'How ARKON Works | Request Routing, Business Rules, and Owner Visibility',
    description: 'See how ARKON handles calls, website inquiries, text messages, email, relationship history, business rules, safe next steps, and owner summaries.',
    schemaType: 'SoftwareApplication',
    eyebrow: 'How ARKON works',
    h1: 'Requests come in, ARKON routes the work, and the owner sees what happened.',
    body: [
      'ARKON listens for repeatable work across calls, website inquiries, messages, email, scheduling needs, records, and follow-up.',
      'It follows the business rules, prepares safe next steps, updates context, routes handoffs, and gives the owner a clear view of what was handled and what still needs attention.'
    ],
    bullets: ['Capture the request', 'Apply business rules', 'Prepare the next step', 'Route the handoff', 'Brief the owner']
  },
  '/real-estate': {
    title: 'AI Workflow Automation for Real Estate Teams | ARKON Systems',
    description: 'ARKON helps real estate teams respond to leads, showing requests, seller calls, buyer questions, follow-up, agent handoffs, and owner visibility.',
    schemaType: 'Service',
    eyebrow: 'Real estate workflow automation',
    h1: 'AI workflow automation for real estate teams.',
    body: [
      'Real estate teams lose deals when leads wait, showing requests sit, seller calls are missed, or follow-up depends on someone remembering every detail.',
      'ARKON supports lead response, call handling, showing requests, relationship history, agent handoffs, and owner visibility.'
    ],
    bullets: ['Lead response', 'Showing requests', 'Seller and buyer calls', 'Agent context', 'Owner view']
  },
  '/insurance': {
    title: 'AI Workflow Automation for Insurance Agencies | ARKON Systems',
    description: 'ARKON helps insurance agencies handle quote requests, policyholder questions, renewals, documents, producer follow-up, CRM updates, and owner visibility.',
    schemaType: 'Service',
    eyebrow: 'Insurance agency workflow automation',
    h1: 'AI workflow automation for insurance agencies.',
    body: [
      'Insurance agencies lose time when quote requests, renewal questions, document requests, and producer follow-up scatter across calls, email, texts, and the CRM.',
      'ARKON supports intake, policyholder questions, producer follow-up, CRM context, and owner visibility while routing licensed or judgment-based questions to the right person.'
    ],
    bullets: ['Quote requests', 'Policyholder questions', 'Document follow-up', 'Producer context', 'Agency visibility']
  },
  '/short-term-rentals': {
    title: 'AI Workflow Automation for Short-Term Rentals | ARKON Systems',
    description: 'ARKON helps short-term rental operators manage guest messages, cleaner coordination, vendor updates, urgent issues, follow-up, and host visibility.',
    schemaType: 'Service',
    eyebrow: 'Short-term rental workflow automation',
    h1: 'AI workflow automation for short-term rental operators.',
    body: [
      'Short-term rental operators deal with guest messages, cleaner coordination, vendor updates, urgent issues, check-in questions, and host visibility.',
      'ARKON keeps stay operations moving without every message landing on the host.'
    ],
    bullets: ['Guest messages', 'Cleaner coordination', 'Vendor updates', 'Urgent issue routing', 'Host visibility']
  },
  '/home-services': {
    title: 'AI Workflow Automation for Home Service Businesses | ARKON Systems',
    description: 'ARKON helps home service businesses handle calls, estimates, repairs, technician updates, scheduling, invoices, customer messages, and owner visibility.',
    schemaType: 'Service',
    eyebrow: 'Home services workflow automation',
    h1: 'AI workflow automation for home service businesses.',
    body: [
      'Home service businesses lose money when calls are missed, estimate requests wait, technicians lack context, invoices create confusion, or customers need updates.',
      'ARKON connects front desk work, field updates, customer messages, scheduling, records, and owner visibility.'
    ],
    bullets: ['Inbound calls', 'Estimate requests', 'Technician updates', 'Scheduling support', 'Owner visibility']
  },
  '/professional-services': {
    title: 'AI Workflow Automation for Professional Services | ARKON Systems',
    description: 'ARKON helps professional service firms manage intake, scheduling, client questions, document requests, follow-up, handoffs, and owner visibility.',
    schemaType: 'Service',
    eyebrow: 'Professional services workflow automation',
    h1: 'AI workflow automation for professional service firms.',
    body: [
      'Professional service firms need clean intake, reliable scheduling, client follow-up, document requests, handoffs, and owner visibility.',
      'ARKON helps keep client context attached so work does not depend on memory or scattered messages.'
    ],
    bullets: ['Client intake', 'Scheduling support', 'Document requests', 'Follow-up', 'Owner visibility']
  },
  '/salons': {
    title: 'AI Workflow Automation for Salons | ARKON Systems',
    description: 'ARKON helps salons manage missed calls, booking requests, client messages, appointment follow-up, staff handoffs, and owner visibility.',
    schemaType: 'Service',
    eyebrow: 'Salon workflow automation',
    h1: 'AI workflow automation for salons.',
    body: [
      'Salons miss revenue when calls go unanswered, booking requests sit, client messages pile up, or appointment follow-up depends on the busiest person in the room.',
      'ARKON supports booking requests, client messages, follow-up, staff handoffs, and owner visibility.'
    ],
    bullets: ['Missed call coverage', 'Booking requests', 'Client messages', 'Appointment follow-up', 'Owner view']
  },
  '/garages': {
    title: 'AI Workflow Automation for Auto Repair Shops | ARKON Systems',
    description: 'ARKON helps auto repair shops manage repair calls, estimate requests, declined work follow-up, vehicle context, status updates, return visits, and owner visibility.',
    schemaType: 'Service',
    eyebrow: 'Auto repair shop workflow automation',
    h1: 'AI workflow automation for auto repair shops.',
    body: [
      'Auto repair shops lose time when repair calls interrupt the bay, estimate requests wait, declined work is never followed up, or customers call repeatedly for status updates.',
      'ARKON supports the front desk, customer intake, vehicle context, scheduling, declined work follow-up, status updates, and owner visibility.'
    ],
    bullets: ['Repair calls', 'Estimate requests', 'Vehicle context', 'Status updates', 'Declined work follow-up']
  },
  '/medical-dental-offices': {
    title: 'AI Workflow Automation for Dental Offices | ARKON Systems',
    description: 'ARKON helps dental offices manage front desk calls, appointment requests, cancellations, no-shows, routine reminders, patient handoffs, and owner visibility.',
    schemaType: 'Service',
    eyebrow: 'Dental office workflow automation',
    h1: 'AI workflow automation for dental offices.',
    body: [
      'Dental offices face front desk pressure from calls, appointment requests, cancellations, no-shows, routine reminders, patient questions, and owner visibility.',
      'ARKON supports the repeatable workflow around scheduling, reminders, handoffs, and front desk communication.'
    ],
    bullets: ['Front desk calls', 'Appointment requests', 'Cancellations', 'No-show follow-up', 'Owner visibility']
  },
  '/law-firms': {
    title: 'AI Workflow Automation for Law Firms | ARKON Systems',
    description: 'ARKON helps law firms support paralegals with attorney schedules, email triage, client follow-up, document requests, daily briefs, handoffs, and owner visibility.',
    schemaType: 'Service',
    eyebrow: 'Law firm workflow automation',
    h1: 'AI workflow automation for law firms.',
    body: [
      'Law firms need support around intake, attorney schedules, email triage, client follow-up, document requests, daily briefs, and handoffs.',
      'ARKON helps keep communication and next steps organized while routing sensitive or judgment-based matters to the right person.'
    ],
    bullets: ['Intake support', 'Email triage', 'Document requests', 'Client follow-up', 'Owner visibility']
  },
  '/gyms-fitness-studios': {
    title: 'AI Workflow Automation for Gyms and Fitness Studios | ARKON Systems',
    description: 'ARKON helps gyms and fitness studios protect trial lead response, tour bookings, personal training revenue, member follow-up, cancellation handoffs, and owner visibility.',
    schemaType: 'Service',
    eyebrow: 'Gym and fitness studio workflow automation',
    h1: 'AI workflow automation for gyms and fitness studios.',
    body: [
      'Gyms and fitness studios lose revenue when trial leads are not followed up, tours do not get booked, personal training interest goes cold, or members stop showing up before anyone notices.',
      'ARKON supports trial lead response, tour booking, member follow-up, staff handoffs, and owner visibility.'
    ],
    bullets: ['Trial lead response', 'Tour bookings', 'Personal training follow-up', 'Member retention signals', 'Owner visibility']
  }
};

const crawlablePaths = Object.keys(seoPages);

function normalizeRoute(rawUrl = '/') {
  const pathname = rawUrl.split('?')[0].replace(/\/$/, '') || '/';
  return seoPages[pathname] ? pathname : '/';
}

function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  const normalized = normalize(decoded).replace(/^([/\\])+/, '');
  return resolve(distDir, normalized || 'index.html');
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function cleanText(value, maxLength = 500) {
  return String(value || '')
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

function cleanMessage(value, maxLength = 2500) {
  return String(value || '')
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '')
    .trim()
    .slice(0, maxLength);
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function jsonResponse(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store'
  });
  res.end(JSON.stringify(payload));
}

function readJsonBody(req, limitBytes = 32_000) {
  return new Promise((resolveBody, rejectBody) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > limitBytes) {
        rejectBody(new Error('Request body too large'));
        req.destroy();
      }
    });
    req.on('end', () => {
      try {
        resolveBody(body ? JSON.parse(body) : {});
      } catch {
        rejectBody(new Error('Invalid JSON'));
      }
    });
    req.on('error', rejectBody);
  });
}

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim()) return forwarded.split(',')[0].trim();
  return req.socket?.remoteAddress || 'unknown';
}

async function sendWithResend({ from, to, replyTo, subject, text }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' },
    body: JSON.stringify({ from, to: [to], subject, text, reply_to: replyTo })
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`Resend failed with ${response.status}: ${detail.slice(0, 300)}`);
  }
  return true;
}

async function sendWithPostmark({ from, to, replyTo, subject, text }) {
  const token = process.env.POSTMARK_SERVER_TOKEN || process.env.POSTMARK_API_TOKEN;
  if (!token) return false;
  const response = await fetch('https://api.postmarkapp.com/email', {
    method: 'POST',
    headers: { 'x-postmark-server-token': token, accept: 'application/json', 'content-type': 'application/json' },
    body: JSON.stringify({ From: from, To: to, Subject: subject, TextBody: text, ReplyTo: replyTo })
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`Postmark failed with ${response.status}: ${detail.slice(0, 300)}`);
  }
  return true;
}

async function sendDemoRequestEmail(payload, req) {
  const to = process.env.DEMO_REQUEST_TO_EMAIL;
  const from = process.env.DEMO_REQUEST_FROM_EMAIL;
  const preferredProvider = cleanText(process.env.DEMO_EMAIL_PROVIDER, 30).toLowerCase();
  if (!to || !from) throw new Error('Demo request email recipient or sender is not configured.');
  const subject = `ARKON demo request: ${payload.businessType || 'General inquiry'}`;
  const text = [
    'New ARKON demo request',
    '',
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Phone: ${payload.phone || 'Not provided'}`,
    `Business type: ${payload.businessType || 'Not selected'}`,
    `Source page: ${payload.sourcePath || '/'}`,
    `IP: ${getClientIp(req)}`,
    `User agent: ${cleanText(req.headers['user-agent'], 300) || 'unknown'}`,
    '',
    'Message:',
    payload.message || 'No message provided'
  ].join('\n');
  const mail = { from, to, replyTo: payload.email, subject, text };
  if (preferredProvider === 'postmark') return sendWithPostmark(mail);
  if (preferredProvider === 'resend') return sendWithResend(mail);
  if (process.env.RESEND_API_KEY) return sendWithResend(mail);
  if (process.env.POSTMARK_SERVER_TOKEN || process.env.POSTMARK_API_TOKEN) return sendWithPostmark(mail);
  throw new Error('No email provider configured for demo requests.');
}

async function handleDemoRequest(req, res) {
  if (req.method !== 'POST') {
    res.writeHead(405, { allow: 'POST', 'content-type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ ok: false, message: 'Method not allowed.' }));
    return;
  }
  try {
    const body = await readJsonBody(req);
    if (cleanText(body.companyWebsite, 200)) {
      jsonResponse(res, 200, { ok: true, message: 'Request received.' });
      return;
    }
    const payload = {
      name: cleanText(body.name, 120),
      email: cleanText(body.email, 180).toLowerCase(),
      phone: cleanText(body.phone, 80),
      businessType: cleanText(body.businessType, 140),
      sourcePath: cleanText(body.sourcePath, 220),
      message: cleanMessage(body.message, 2500)
    };
    if (!payload.name || !isValidEmail(payload.email)) {
      jsonResponse(res, 400, { ok: false, message: 'Please enter your name and a valid email.' });
      return;
    }
    await sendDemoRequestEmail(payload, req);
    jsonResponse(res, 200, { ok: true, message: 'Request received. We will follow up shortly.' });
  } catch (error) {
    console.error('Demo request failed:', error);
    jsonResponse(res, 500, { ok: false, message: 'Request could not be sent. Please try again.' });
  }
}

function buildSchema(route, seo) {
  const url = `${siteUrl}${route === '/' ? '/' : route}`;
  const base = {
    '@context': 'https://schema.org',
    '@type': seo.schemaType,
    name: seo.title.replace(' | ARKON Systems', '').replace('ARKON Systems | ', ''),
    description: seo.description,
    url,
    provider: { '@type': 'Organization', name: 'ARKON Systems', url: `${siteUrl}/` }
  };
  if (seo.schemaType === 'SoftwareApplication') {
    base.applicationCategory = 'BusinessApplication';
    base.operatingSystem = 'Web';
  }
  return JSON.stringify(base);
}

function crawlableHtml(route) {
  const seo = seoPages[route] || seoPages['/'];
  const bulletItems = (seo.bullets || []).map(item => `<li>${escapeHtml(item)}</li>`).join('');
  const paragraphs = (seo.body || [seo.description]).map(text => `<p>${escapeHtml(text)}</p>`).join('\n');
  return `<main class="crawlable-page" data-crawlable-page="true">
    <section>
      <p>${escapeHtml(seo.eyebrow || 'ARKON Systems')}</p>
      <h1>${escapeHtml(seo.h1 || seo.title)}</h1>
      ${paragraphs}
      <ul>${bulletItems}</ul>
      <p><a href="/#demo">Book a demo</a></p>
    </section>
  </main>`;
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

function injectCrawlableContent(html, route) {
  if (html.includes('data-crawlable-page="true"')) return html;
  return html.replace('<div id="root"></div>', `<div id="root">${crawlableHtml(route)}</div>`);
}

function injectCrawlableStyles(html) {
  if (html.includes('data-crawlable-style')) return html;
  const style = `<style data-crawlable-style>
    .crawlable-page{max-width:1120px;margin:0 auto;padding:120px 24px 64px;color:#eef5ff;background:#050914;font-family:Inter,Arial,sans-serif;line-height:1.6}
    .crawlable-page h1{font-size:clamp(2rem,5vw,4rem);line-height:1.05;margin:.3em 0 .4em}
    .crawlable-page p{max-width:760px;color:#b8c7df;font-size:1.05rem}
    .crawlable-page ul{display:grid;gap:10px;margin:24px 0;padding-left:22px;color:#e8f2ff}
    .crawlable-page a{color:#82f7ca;font-weight:700}
  </style>`;
  return html.replace('</head>', `${style}\n  </head>`);
}

function injectDemoRequestScript(html) {
  if (html.includes('data-demo-request-script')) return html;
  const script = `<script data-demo-request-script>
(() => {
  const endpoint = '/api/demo-request';
  function normalize(value) { return String(value || '').replace(/\s+/g, ' ').trim().toLowerCase(); }
  function setStatus(form, message) {
    let status = form.querySelector('[data-demo-status="true"]');
    if (!status) { status = document.createElement('small'); status.dataset.demoStatus = 'true'; status.setAttribute('role', 'status'); status.style.minHeight = '20px'; status.style.display = 'block'; status.style.color = 'var(--subtle)'; form.appendChild(status); }
    status.textContent = message;
  }
  function mapDemoFields() {
    const form = document.querySelector('.demo-form');
    if (!form) return;
    const controls = [...form.querySelectorAll('input, select, textarea')];
    controls.forEach(control => {
      const label = control.closest('label');
      const combined = normalize([control.name, control.id, control.getAttribute('aria-label'), control.placeholder, label?.textContent].filter(Boolean).join(' '));
      if (!control.name && combined.includes('name')) control.name = 'name';
      if (!control.name && (combined.includes('email') || control.type === 'email')) control.name = 'email';
      if (!control.name && (combined.includes('business') || control.tagName === 'SELECT')) control.name = 'businessType';
      if (!control.name && combined.includes('phone')) control.name = 'phone';
      if (!control.name && combined.includes('company')) control.name = 'companyName';
      if (!control.name && combined.includes('website')) control.name = 'website';
      if (!control.name && combined.includes('message')) control.name = 'message';
    });
    const nameInput = form.querySelector('[name="name"]');
    const email = form.querySelector('[name="email"]');
    const business = form.querySelector('[name="businessType"]');
    if (nameInput) nameInput.required = true;
    if (email) email.required = true;
    if (business) business.required = true;
    form.querySelectorAll('small').forEach(note => { if ((note.textContent || '').toLowerCase().includes('front-end only')) note.remove(); });
  }
  async function submitDemoRequest(event) {
    const form = event.target?.closest?.('.demo-form');
    if (!form) return;
    event.preventDefault(); event.stopPropagation(); event.stopImmediatePropagation?.(); mapDemoFields();
    const data = new FormData(form);
    const payload = {
      name: String(data.get('name') || '').trim(),
      email: String(data.get('email') || '').trim(),
      phone: String(data.get('phone') || '').trim(),
      companyName: String(data.get('companyName') || '').trim(),
      website: String(data.get('website') || '').trim(),
      businessType: String(data.get('businessType') || '').trim(),
      message: String(data.get('message') || '').trim(),
      companyWebsite: '',
      sourcePath: window.location.pathname
    };
    if (!payload.name || !payload.email || !payload.businessType) { setStatus(form, 'Please enter your name, email, and business type.'); return; }
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) submitButton.disabled = true;
    setStatus(form, 'Sending request...');
    try {
      const response = await fetch(endpoint, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.ok === false) throw new Error(result.message || 'Request failed.');
      form.reset(); setStatus(form, result.message || 'Request received. We will follow up shortly.');
    } catch { setStatus(form, 'Request could not be sent. Please try again.'); }
    finally { if (submitButton) submitButton.disabled = false; }
  }
  mapDemoFields(); document.addEventListener('submit', submitDemoRequest, true); window.addEventListener('DOMContentLoaded', mapDemoFields); window.addEventListener('load', mapDemoFields);
})();
</script>`;
  return html.replace(/<\/body>/i, `${script}\n</body>`);
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

createServer(async (req, res) => {
  const reqUrl = req.url || '/';
  const pathname = reqUrl.split('?')[0];
  if (pathname === '/api/demo-request') {
    await handleDemoRequest(req, res);
    return;
  }
  if (pathname === '/api/porter/chat') {
    await handlePorterChat(req, res);
    return;
  }
  if (!existsSync(distDir)) {
    res.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('Build folder not found. Run npm run build before npm start.');
    return;
  }
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
  if (existsSync(filePath) && statSync(filePath).isDirectory()) filePath = join(filePath, 'index.html');
  if (!existsSync(filePath)) filePath = appShellPath;
  const ext = extname(filePath).toLowerCase();
  const headers = { 'content-type': mimeTypes[ext] || 'application/octet-stream', 'cache-control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable' };
  if (ext === '.html') {
    const isKnownRoute = Boolean(seoPages[normalizedPathname]);
    const rawHtml = readFileSync(filePath, 'utf8');
    const html = injectDemoRequestScript(injectCrawlableContent(injectCrawlableStyles(injectSeo(rawHtml, route)), route));
    res.writeHead(isKnownRoute ? 200 : 404, headers);
    res.end(html);
    return;
  }
  res.writeHead(200, headers);
  res.end(readFileSync(filePath));
}).listen(port, () => {
  console.log(`ARKON homepage running on port ${port}`);
});
