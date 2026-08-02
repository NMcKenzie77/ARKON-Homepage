import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { brotliCompressSync, constants as zlibConstants, gzipSync } from 'node:zlib';
import { solutions } from './src/data.js';
import { crawlablePaths, industryPages, seoPages, SITE_URL } from './src/site-content.js';
import { buildStructuredData, getBreadcrumbItems, getRelatedPages } from './src/seo-structure.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const distDir = resolve(__dirname, 'dist');
const port = process.env.PORT || 3000;
const siteUrl = SITE_URL;
const appShellPath = join(distDir, 'index.html');
const DEMO_PRIVACY_VERSION = '2026-07-28';
const DEMO_RATE_LIMIT_MAX = 5;
const DEMO_RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const demoRateLimits = new Map();
const allowedBusinessTypes = new Set([
  'Real estate',
  'Insurance',
  'Short-term rentals',
  'Home services',
  'Salons',
  'Auto repair shops'
]);
const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: https:",
  "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com https://fonts.googleapis.com https://fonts.gstatic.com",
  "frame-src https://app.heygen.com",
  "media-src 'self' blob: https:",
  "worker-src 'self' blob:",
  "manifest-src 'self'"
].join('; ');

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

const notFoundSeo = {
  title: 'Page Not Found | ARKON Systems',
  description: 'The requested ARKON Systems page could not be found.',
  schemaType: 'WebPage',
  schemaName: 'Page Not Found'
};

function normalizedPath(rawUrl = '/') {
  return rawUrl.split('?')[0].replace(/\/$/, '') || '/';
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

function isValidPhone(value) {
  const digits = String(value || '').replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 20;
}

function isValidOptionalWebsite(value) {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function getRequestHost(req) {
  const forwardedHost = String(req.headers['x-forwarded-host'] || '').split(',')[0].trim();
  const directHost = String(req.headers.host || '').trim();
  const rawHost = forwardedHost || directHost;
  if (!rawHost) return '';

  try {
    return new URL(`http://${rawHost}`).hostname.toLowerCase();
  } catch {
    return rawHost.split(':')[0].toLowerCase();
  }
}

function isStagingRequest(req) {
  const environmentName = [
    process.env.RAILWAY_ENVIRONMENT_NAME,
    process.env.RAILWAY_ENVIRONMENT,
    process.env.APP_ENV
  ].filter(Boolean).join(' ').toLowerCase();
  const host = getRequestHost(req);
  return environmentName.includes('staging') || host.includes('staging');
}

function isAllowedRequestOrigin(req) {
  const origin = String(req.headers.origin || '').trim();
  if (!origin) return true;

  try {
    return new URL(origin).hostname.toLowerCase() === getRequestHost(req);
  } catch {
    return false;
  }
}

function applySecurityHeaders(req, res) {
  const headers = {
    'content-security-policy': contentSecurityPolicy,
    'strict-transport-security': 'max-age=31536000; includeSubDomains',
    'x-content-type-options': 'nosniff',
    'x-frame-options': 'DENY',
    'referrer-policy': 'strict-origin-when-cross-origin',
    'permissions-policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()',
    'x-permitted-cross-domain-policies': 'none',
    'x-dns-prefetch-control': 'off'
  };

  for (const [name, value] of Object.entries(headers)) res.setHeader(name, value);
  if (isStagingRequest(req)) res.setHeader('x-robots-tag', 'noindex, nofollow, noarchive');
}

function appendVary(currentValue, value) {
  const values = String(currentValue || '')
    .split(',')
    .map(item => item.trim())
    .filter(Boolean);
  if (!values.some(item => item.toLowerCase() === value.toLowerCase())) values.push(value);
  return values.join(', ');
}

function isCompressibleContentType(contentType) {
  return /^text\//i.test(contentType)
    || /(?:javascript|json|xml|svg\+xml)/i.test(contentType);
}

function sendResponse(req, res, statusCode, headers, body) {
  const responseHeaders = { ...headers };
  const input = Buffer.isBuffer(body) ? body : Buffer.from(String(body));
  let output = input;

  if (input.length >= 1024 && isCompressibleContentType(String(responseHeaders['content-type'] || ''))) {
    const accepted = String(req.headers['accept-encoding'] || '').toLowerCase();
    if (accepted.includes('br')) {
      output = brotliCompressSync(input, {
        params: { [zlibConstants.BROTLI_PARAM_QUALITY]: 4 }
      });
      responseHeaders['content-encoding'] = 'br';
    } else if (accepted.includes('gzip')) {
      output = gzipSync(input, { level: 6 });
      responseHeaders['content-encoding'] = 'gzip';
    }

    responseHeaders.vary = appendVary(responseHeaders.vary, 'Accept-Encoding');
  }

  responseHeaders['content-length'] = String(output.length);
  res.writeHead(statusCode, responseHeaders);
  res.end(req.method === 'HEAD' ? undefined : output);
}

function jsonResponse(res, statusCode, payload, additionalHeaders = {}) {
  res.writeHead(statusCode, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    ...additionalHeaders
  });
  res.end(JSON.stringify(payload));
}

function readJsonBody(req, limitBytes = 32_000) {
  return new Promise((resolveBody, rejectBody) => {
    let body = '';
    let receivedBytes = 0;
    let tooLarge = false;

    req.on('data', chunk => {
      receivedBytes += chunk.length;
      if (receivedBytes > limitBytes) {
        tooLarge = true;
        body = '';
        return;
      }
      if (!tooLarge) body += chunk;
    });
    req.on('end', () => {
      if (tooLarge) {
        rejectBody(new Error('Request body too large'));
        return;
      }
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

function consumeDemoRateLimit(req) {
  const now = Date.now();
  const clientIp = getClientIp(req);

  if (demoRateLimits.size > 1000) {
    for (const [key, record] of demoRateLimits.entries()) {
      if (now - record.startedAt >= DEMO_RATE_LIMIT_WINDOW_MS) demoRateLimits.delete(key);
    }
  }

  const existing = demoRateLimits.get(clientIp);
  if (!existing || now - existing.startedAt >= DEMO_RATE_LIMIT_WINDOW_MS) {
    demoRateLimits.set(clientIp, { count: 1, startedAt: now });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (existing.count >= DEMO_RATE_LIMIT_MAX) {
    const remainingMs = DEMO_RATE_LIMIT_WINDOW_MS - (now - existing.startedAt);
    return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil(remainingMs / 1000)) };
  }

  existing.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
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
    headers: {
      'x-postmark-server-token': token,
      accept: 'application/json',
      'content-type': 'application/json'
    },
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

  const subject = `ARKON demo request: ${payload.businessType}`;
  const text = [
    'New ARKON demo request',
    '',
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Phone: ${payload.phone}`,
    `Company name: ${payload.companyName}`,
    `Website: ${payload.website || 'Not provided'}`,
    `Business type: ${payload.businessType}`,
    `Source page: ${payload.sourcePath || '/'}`,
    `Contact consent: Yes, for this request`,
    `Consent recorded: ${payload.consentRecordedAt}`,
    `Privacy version: ${payload.privacyVersion}`,
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
    jsonResponse(res, 405, { ok: false, message: 'Method not allowed.' }, { allow: 'POST' });
    return;
  }

  if (!String(req.headers['content-type'] || '').toLowerCase().startsWith('application/json')) {
    jsonResponse(res, 415, { ok: false, message: 'Content type must be application/json.' });
    return;
  }

  if (!isAllowedRequestOrigin(req)) {
    jsonResponse(res, 403, { ok: false, message: 'Request origin was not accepted.' });
    return;
  }

  const rateLimit = consumeDemoRateLimit(req);
  if (!rateLimit.allowed) {
    jsonResponse(
      res,
      429,
      { ok: false, message: 'Too many requests. Please wait and try again.' },
      { 'retry-after': String(rateLimit.retryAfterSeconds) }
    );
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
      companyName: cleanText(body.companyName, 160),
      website: cleanText(body.website, 240),
      businessType: cleanText(body.businessType, 140),
      sourcePath: cleanText(body.sourcePath, 220),
      message: cleanMessage(body.message, 2500),
      contactConsent: body.contactConsent === true,
      consentRecordedAt: cleanText(body.consentRecordedAt, 80),
      privacyVersion: cleanText(body.privacyVersion, 30)
    };

    const consentTimestamp = Date.parse(payload.consentRecordedAt);
    const hasValidConsentTimestamp = Number.isFinite(consentTimestamp)
      && consentTimestamp <= Date.now() + (5 * 60 * 1000);
    const validSourcePath = !payload.sourcePath || payload.sourcePath.startsWith('/');

    const isValid = payload.name.length >= 2
      && isValidEmail(payload.email)
      && isValidPhone(payload.phone)
      && payload.companyName.length >= 2
      && isValidOptionalWebsite(payload.website)
      && allowedBusinessTypes.has(payload.businessType)
      && validSourcePath
      && payload.contactConsent
      && hasValidConsentTimestamp
      && payload.privacyVersion === DEMO_PRIVACY_VERSION;

    if (!isValid) {
      jsonResponse(res, 400, {
        ok: false,
        message: 'Please complete all required fields and confirm contact permission.'
      });
      return;
    }

    if (!payload.sourcePath) payload.sourcePath = '/';
    await sendDemoRequestEmail(payload, req);
    jsonResponse(res, 200, { ok: true, message: 'Request received. We will follow up shortly.' });
  } catch (error) {
    if (error?.message === 'Request body too large') {
      jsonResponse(res, 413, { ok: false, message: 'Request body is too large.' });
      return;
    }
    if (error?.message === 'Invalid JSON') {
      jsonResponse(res, 400, { ok: false, message: 'Request body must contain valid JSON.' });
      return;
    }

    console.error('Demo request failed:', error);
    jsonResponse(res, 500, { ok: false, message: 'Request could not be sent. Please try again.' });
  }
}

function buildSchema(route, seo) {
  return buildStructuredData({ route, seo, industryPages, siteUrl });
}

function renderCards(cards = []) {
  return cards.map(([title, copy]) => `
    <article class="crawlable-card">
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(copy)}</p>
    </article>`).join('');
}

function renderSimpleCards(cards = []) {
  return cards.map(card => `
    <article class="crawlable-card">
      <h3>${escapeHtml(card.title)}</h3>
      <p>${escapeHtml(card.copy)}</p>
    </article>`).join('');
}

function renderBreadcrumbs(route, seo) {
  const items = getBreadcrumbItems(route, seo, siteUrl);
  if (items.length < 2) return '';

  return `<nav class="crawlable-breadcrumbs" aria-label="Breadcrumb">
    <ol>${items.map((item, index) => {
      const content = index < items.length - 1
        ? `<a href="${escapeHtml(item.url)}">${escapeHtml(item.name)}</a>`
        : `<span aria-current="page">${escapeHtml(item.name)}</span>`;
      return `<li>${content}</li>`;
    }).join('')}</ol>
  </nav>`;
}

function renderRelatedPages(route) {
  const relatedPages = getRelatedPages(route, industryPages);
  if (!relatedPages.length) return '';

  const cards = relatedPages.map(({ path, page }) => `
    <a class="crawlable-card crawlable-link-card" href="${escapeHtml(path)}">
      <p><strong>${escapeHtml(page.eyebrow)}</strong></p>
      <h3>${escapeHtml(page.title)}</h3>
      <p>${escapeHtml(page.description)}</p>
    </a>`).join('');

  return `<section>
    <p class="crawlable-eyebrow">Related business workflows</p>
    <h2>See how the same operating approach applies elsewhere.</h2>
    <p>Each page focuses on the calls, messages, records, handoffs, and owner visibility that matter in that kind of business.</p>
    <div class="crawlable-grid">${cards}</div>
  </section>`;
}

function renderPricing(plans = []) {
  if (!plans.length) return '';

  const cards = plans.map(plan => `
    <article class="crawlable-card">
      <p><strong>${escapeHtml(plan.fit)}</strong></p>
      <h3>${escapeHtml(plan.name)}</h3>
      <p>${escapeHtml(plan.summary)}</p>
      <p><strong>Founder pilot:</strong> ${escapeHtml(plan.pilot)}<br><strong>Target monthly:</strong> ${escapeHtml(plan.target)}<br><strong>${escapeHtml(plan.setup)}</strong></p>
      <ul>${plan.includes.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
    </article>`).join('');

  return `
    <section id="pricing">
      <p class="crawlable-eyebrow">Auto repair pricing</p>
      <h2>Start with the right operating layer for the shop.</h2>
      <p>These are starting points for scoping ARKON for an auto repair operation. Pricing is finalized after discovery based on call volume, locations, team size, software, live-call coverage, and integration depth.</p>
      <div class="crawlable-grid">${cards}</div>
    </section>`;
}

function crawlableHomeHtml() {
  const channels = [
    { title: 'Phone call — Vera', copy: 'Answers the call, qualifies the caller, captures the details, and routes it when a person is needed.' },
    { title: 'Website inquiry — ARKON intake', copy: 'Captures the question or request, organizes the lead details, and prepares the handoff to the business.' },
    { title: 'Text or client message — Naya', copy: 'Responds in the owner’s voice, answers approved questions, and follows up when a lead does not convert.' },
    { title: 'Email — Iris', copy: 'Reads the inbox, scores urgency and importance, and surfaces what needs attention first.' }
  ];

  const ideaCards = [
    { title: 'Know who is reaching out', copy: 'ARKON recognizes whether it is a customer, lead, vendor, guest, client, tenant, or prospect and starts with the right context.' },
    { title: 'Move the work forward', copy: 'ARKON can answer, follow up, schedule, route, prepare, or flag the issue based on what the business allows.' },
    { title: 'Keep it sounding like your business', copy: 'Messages follow your tone, standards, and rules so customers still feel like they are dealing with your team.' }
  ];

  const team = [
    { title: 'Naya — Client and guest communication', copy: 'Handles inbound and outbound messages in the owner’s voice and follows up after calls or website inquiries create a lead.' },
    { title: 'Vera — Voice reception', copy: 'Answers inbound calls, gathers key details, and routes the call when a person is needed.' },
    { title: 'Grant — Owner intelligence', copy: 'Surfaces risks, open work, and the owner digest of what needs action.' },
    { title: 'Marcus — CRM and relationship memory', copy: 'Keeps records, interaction history, pipeline stages, notes, tags, and follow-up context attached.' },
    { title: 'Iris — Inbox triage', copy: 'Scores urgency and importance, prioritizes the inbox, and flags new client or lead inquiries.' }
  ];

  const solutionCards = solutions.map(solution => `
    <a class="crawlable-card crawlable-link-card" href="${escapeHtml(solution.href)}">
      <p><strong>${escapeHtml(solution.name)}</strong></p>
      <h3>${escapeHtml(solution.title)}</h3>
      <p>${escapeHtml(solution.details)}</p>
    </a>`).join('');


  return `<main class="crawlable-page" data-crawlable-page="true">
    <section>
      <p class="crawlable-eyebrow">ARKON Systems</p>
      <h1>Let your existing team focus on the work only they can do.</h1>
      <p>ARKON handles the repeatable tasks around calls, messages, follow-ups, scheduling, documents, estimates, invoices, and handoffs. Your staff can spend less time chasing details and more time moving the business forward.</p>
      <p><a href="/#how">See how it works</a> <a href="/#solutions">Choose your business type</a></p>
    </section>
    <section>
      <p class="crawlable-eyebrow">How ARKON moves work forward</p>
      <h2>When someone reaches out, the right workflow responds.</h2>
      <p>Calls, texts, emails, website inquiries, follow-ups, and owner alerts move through the workflow built for that job. ARKON follows the business rules and brings in a person when judgment is needed.</p>
      <div class="crawlable-grid">${renderSimpleCards(channels)}</div>
      <p><a href="/how-it-works">See how ARKON handles a request</a></p>
    </section>
    <section>
      <p class="crawlable-eyebrow">The ARKON idea</p>
      <h2>Every business has work that gets dropped when people get busy.</h2>
      <p>Customers call. Messages pile up. Follow-ups get missed. Details live in someone’s head. ARKON handles the repeatable work, keeps the right people updated, and helps the day keep moving without everything falling back on the owner.</p>
      <div class="crawlable-grid">${renderSimpleCards(ideaCards)}</div>
    </section>
    <section>
      <p class="crawlable-eyebrow">Meet the core team</p>
      <h2>One team, with the right role for each job.</h2>
      <div class="crawlable-grid">${renderSimpleCards(team)}</div>
    </section>
    <section id="solutions">
      <p class="crawlable-eyebrow">Choose your business type</p>
      <h2>Start with the idea. Then choose your kind of business.</h2>
      <p>Each business page shows the calls, messages, documents, customers, staff, and owner view for that kind of business.</p>
      <div class="crawlable-grid">${solutionCards}</div>
    </section>
    <section>
      <p class="crawlable-eyebrow">Your voice, not a generic script</p>
      <h2>Customers should feel like they are still dealing with your business.</h2>
      <p>ARKON uses the business’s greetings, tone, standards, boundaries, and escalation rules. Sensitive or urgent issues are routed instead of answered blindly.</p>
    </section>
    <section>
      <p class="crawlable-eyebrow">Owner visibility</p>
      <h2>The owner sees what happened without carrying every detail.</h2>
      <p>Messages become organized actions, owners see what matters, and employees start with context.</p>
    </section>
    <section>
      <p class="crawlable-eyebrow">How it feels different</p>
      <h2>The business feels present, prepared, and coordinated, even when the owner is not.</h2>
      <ul><li>Customers feel remembered</li><li>Responses sound like the business</li><li>Employees know what to do</li><li>Owners see what matters</li></ul>
    </section>
    <section id="demo">
      <p class="crawlable-eyebrow">See it for your business</p>
      <h2>Choose the closest business type and walk through the real workflow.</h2>
      <p>See how ARKON would handle the calls, messages, follow-ups, documents, staff updates, and owner visibility in a business like yours.</p>
      <p><a href="/#demo">Request demo</a></p>
    </section>
  </main>`;
}

function crawlableHowItWorksHtml() {
  const steps = [
    ['The request comes in', 'A call, text, email, website form, guest message, or client message reaches the business.'],
    ['The right workflow responds first', 'The first response is based on the channel, the request, and the business rules for that kind of work.'],
    ['Business rules are checked', 'Your rules decide what ARKON can answer, schedule, send, update, or route to a person.'],
    ['Marcus keeps the history attached', 'Marcus connects the contact record, relationship timeline, pipeline stage, notes, tags, and prior touchpoints.'],
    ['ARKON takes the safe next step', 'It can answer, follow up, schedule, update a record, create a task, or route the request for review.'],
    ['Grant keeps the owner informed', 'Grant shows what came in, what was handled, who owns the next step, and what needs attention.']
  ];

  return `<main class="crawlable-page" data-crawlable-page="true">
    ${renderBreadcrumbs('/how-it-works', seoPages['/how-it-works'])}
    <section>
      <p class="crawlable-eyebrow">How ARKON handles a request</p>
      <h1>One business. Different ways people reach out.</h1>
      <p>The first response depends on how the person contacted the business. Your business rules decide what ARKON is allowed to do. Marcus keeps the relationship history attached, and Grant keeps the owner informed.</p>
    </section>
    <section>
      <p class="crawlable-eyebrow">What happens next?</p>
      <h2>The request moves forward without hiding the judgment calls.</h2>
      <div class="crawlable-grid">${steps.map(([title, copy]) => `<article class="crawlable-card"><h3>${escapeHtml(title)}</h3><p>${escapeHtml(copy)}</p></article>`).join('')}</div>
      <p><a href="/">Back to homepage</a></p>
    </section>
  </main>`;
}

function crawlableIndustryHtml(page, route) {
  const reality = page.reality ? `
    <section>
      <p class="crawlable-eyebrow">${escapeHtml(page.reality.eyebrow)}</p>
      <h2>${escapeHtml(page.reality.title)}</h2>
      ${page.reality.body.map(paragraph => `<p>${escapeHtml(paragraph)}</p>`).join('')}
      <p><strong>${escapeHtml(page.reality.callout)}</strong></p>
    </section>` : '';

  return `<main class="crawlable-page" data-crawlable-page="true">
    ${renderBreadcrumbs(route, { schemaName: page.name })}
    <section>
      <p class="crawlable-eyebrow">${escapeHtml(page.eyebrow)}</p>
      <h1>${escapeHtml(page.title)}</h1>
      <p>${escapeHtml(page.description)}</p>
      <p><a href="/#demo">Request demo</a> <a href="/how-it-works">See how ARKON works</a></p>
    </section>
    ${reality}
    <section>
      <p class="crawlable-eyebrow">Why it matters</p>
      <h2>Repeatable work should not depend on memory.</h2>
      <p>${escapeHtml(page.primary)}</p>
      <div class="crawlable-grid">${renderCards(page.cards)}</div>
    </section>
    ${renderPricing(page.pricing)}
    <section>
      <p class="crawlable-eyebrow">Example workflows</p>
      <h2>What ARKON can keep moving.</h2>
      <div class="crawlable-grid">${page.workflow.map(item => `<article class="crawlable-card"><h3>${escapeHtml(item)}</h3></article>`).join('')}</div>
    </section>
    <section>
      <p class="crawlable-eyebrow">Questions business owners ask</p>
      <h2>Built for control, not guesswork.</h2>
      <div class="crawlable-grid">${renderCards(page.faq)}</div>
    </section>
    ${renderRelatedPages(route)}
    <section>
      <p class="crawlable-eyebrow">See it for your business</p>
      <h2>Walk through the real workflow with ARKON.</h2>
      <p>Review the calls, messages, follow-ups, records, handoffs, and owner visibility that matter most for your operation.</p>
      <p><a href="/#demo">Request demo</a></p>
    </section>
  </main>`;
}

function crawlableNotFoundHtml() {
  return `<main class="crawlable-page" data-crawlable-page="true">
    <section>
      <p class="crawlable-eyebrow">404</p>
      <h1>That page could not be found.</h1>
      <p>The address may be outdated or mistyped. Return to the ARKON Systems homepage or choose a business type from the main site.</p>
      <p><a href="/">Return to homepage</a></p>
    </section>
  </main>`;
}

function crawlableHtml(route, isKnownRoute) {
  if (!isKnownRoute) return crawlableNotFoundHtml();
  if (route === '/') return crawlableHomeHtml();
  if (route === '/how-it-works') return crawlableHowItWorksHtml();
  return crawlableIndustryHtml(industryPages[route], route);
}

function injectSeo(html, route, isKnownRoute, requestedPath) {
  const seo = isKnownRoute ? seoPages[route] : notFoundSeo;
  const canonical = isKnownRoute
    ? `${siteUrl}${route === '/' ? '/' : route}`
    : `${siteUrl}${requestedPath}`;

  let output = html
    .replace(/<!--SEO_TITLE-->[\s\S]*?<!--\/SEO_TITLE-->/g, escapeHtml(seo.title))
    .replace(/<!--SEO_DESCRIPTION-->[\s\S]*?<!--\/SEO_DESCRIPTION-->/g, escapeHtml(seo.description))
    .replace(/<!--SEO_CANONICAL-->[\s\S]*?<!--\/SEO_CANONICAL-->/g, escapeHtml(canonical))
    .replace(/<!--SEO_SCHEMA-->[\s\S]*?<!--\/SEO_SCHEMA-->/, buildSchema(route, seo));

  if (!isKnownRoute) {
    output = output.replace(
      /<meta\s+name=["']robots["']\s+content=["'][^"']*["']\s*\/?>/i,
      '<meta name="robots" content="noindex, nofollow" />'
    );
  }

  return output;
}

function injectCrawlableContent(html, route, isKnownRoute) {
  if (html.includes('data-crawlable-page="true"')) return html;
  return html.replace('<div id="root"></div>', `<div id="root">${crawlableHtml(route, isKnownRoute)}</div>`);
}

function injectCrawlableStyles(html) {
  if (html.includes('data-crawlable-style')) return html;

  const style = `<style data-crawlable-style>
    html{background:#050914}.crawlable-page{max-width:1120px;margin:0 auto;padding:96px 24px 64px;color:#eef5ff;background:#050914;font-family:Inter,Arial,sans-serif;line-height:1.6}.crawlable-page section{padding:28px 0;border-bottom:1px solid rgba(184,199,223,.14)}.crawlable-page h1{font-size:clamp(2rem,5vw,4rem);line-height:1.05;margin:.25em 0 .4em}.crawlable-page h2{font-size:clamp(1.55rem,3vw,2.5rem);line-height:1.15;margin:.25em 0 .5em}.crawlable-page h3{margin:.2em 0 .45em}.crawlable-page p{max-width:820px;color:#b8c7df;font-size:1.02rem}.crawlable-page ul{color:#e8f2ff}.crawlable-page a{color:#82f7ca;font-weight:700;margin-right:14px}.crawlable-eyebrow{color:#82f7ca!important;text-transform:uppercase;letter-spacing:.12em;font-size:.78rem!important;font-weight:800}.crawlable-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:16px;margin-top:22px}.crawlable-card{display:block;padding:20px;border:1px solid rgba(184,199,223,.18);border-radius:16px;background:rgba(12,20,38,.72);text-decoration:none}.crawlable-card p{font-size:.95rem}.crawlable-link-card:hover{border-color:#82f7ca}.crawlable-breadcrumbs{padding:0 0 20px;border-bottom:1px solid rgba(184,199,223,.14)}.crawlable-breadcrumbs ol{display:flex;flex-wrap:wrap;gap:9px;margin:0;padding:0;list-style:none}.crawlable-breadcrumbs li{display:flex;gap:9px;color:#b8c7df;font-size:.88rem}.crawlable-breadcrumbs li:not(:last-child)::after{content:'/';color:rgba(184,199,223,.5)}
  </style>`;

  return html.replace('</head>', `${style}\n  </head>`);
}

function sitemapXml() {
  const urls = crawlablePaths.map(path => {
    const loc = `${siteUrl}${path === '/' ? '/' : path}`;
    return `  <url>\n    <loc>${loc}</loc>\n  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function robotsTxt(req) {
  if (isStagingRequest(req)) {
    return 'User-agent: *\nDisallow: /\n';
  }

  return `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`;
}

function redirectBareDomain(req, res) {
  const forwardedHost = String(req.headers['x-forwarded-host'] || '').split(',')[0].trim().toLowerCase();
  const directHost = String(req.headers.host || '').split(':')[0].trim().toLowerCase();
  const host = forwardedHost || directHost;

  if (host !== 'arkonsysai.com') return false;

  res.writeHead(308, {
    location: `${siteUrl}${req.url || '/'}`,
    'cache-control': 'public, max-age=3600'
  });
  res.end();
  return true;
}

function redirectTrailingSlash(req, res) {
  const reqUrl = req.url || '/';
  const [pathname, query = ''] = reqUrl.split('?');

  if (pathname === '/' || !pathname.endsWith('/')) return false;
  if (pathname.startsWith('/api/')) return false;

  const targetPath = pathname.replace(/\/+$/, '') || '/';
  res.writeHead(308, {
    location: `${targetPath}${query ? `?${query}` : ''}`,
    'cache-control': 'public, max-age=3600'
  });
  res.end();
  return true;
}

createServer(async (req, res) => {
  applySecurityHeaders(req, res);

  if (redirectBareDomain(req, res)) return;
  if (redirectTrailingSlash(req, res)) return;

  const reqUrl = req.url || '/';
  const pathname = reqUrl.split('?')[0];

  if (pathname === '/api/demo-request') {
    await handleDemoRequest(req, res);
    return;
  }

  if (!existsSync(distDir)) {
    res.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('Build folder not found. Run npm run build before npm start.');
    return;
  }

  const requestedPath = normalizedPath(reqUrl);
  const isKnownRoute = Boolean(seoPages[requestedPath]);
  const route = isKnownRoute ? requestedPath : '/';

  if (pathname === '/robots.txt') {
    sendResponse(req, res, 200, {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=3600'
    }, robotsTxt(req));
    return;
  }

  if (pathname === '/sitemap.xml') {
    sendResponse(req, res, 200, {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 'public, max-age=3600'
    }, sitemapXml());
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
  const headers = {
    'content-type': mimeTypes[ext] || 'application/octet-stream',
    'cache-control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable'
  };

  if (ext === '.html') {
    const rawHtml = readFileSync(filePath, 'utf8');
    const html = injectCrawlableContent(
      injectCrawlableStyles(
        injectSeo(rawHtml, route, isKnownRoute, requestedPath)
      ),
      route,
      isKnownRoute
    );

    sendResponse(req, res, isKnownRoute ? 200 : 404, headers, html);
    return;
  }

  sendResponse(req, res, 200, headers, readFileSync(filePath));
}).listen(port, () => {
  console.log(`ARKON homepage running on port ${port}`);
});
