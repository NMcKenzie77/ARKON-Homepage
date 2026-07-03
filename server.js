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
    description: 'ARKON helps law firms support paralegals with attorney schedules, email triage, client follow-up, document requests, daily briefs, handoffs, and owner visibility.',
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

const sharedHeaderCss = `
  /* data-shared-header-css: real estate repo marketing header */
  .mk-nav{box-sizing:border-box!important;display:flex!important;align-items:center!important;justify-content:space-between!important;gap:18px!important;width:100vw!important;margin-left:calc(50% - 50vw)!important;padding:18px clamp(20px,5vw,64px)!important;border-bottom:4px solid #122039!important;position:sticky!important;top:0!important;background:#fff!important;color:#122039!important;z-index:50!important}
  .mk-logo{font-family:Archivo,"Helvetica Neue",Arial,sans-serif!important;font-weight:900!important;font-size:22px!important;letter-spacing:.14em!important;text-transform:uppercase!important;text-decoration:none!important;color:#122039!important;line-height:1!important}
  .mk-logo span{color:#C8102E!important}
  .mk-nav-links{display:flex!important;gap:10px!important;align-items:center!important;flex-wrap:wrap!important}
  .mk-nav-links a.plain{font-family:Archivo,"Helvetica Neue",Arial,sans-serif!important;font-weight:600!important;font-size:14px!important;text-decoration:none!important;padding:10px 14px!important;color:#122039!important}
  .mk-nav-links a.plain:hover{color:#C8102E!important}
  .mk-nav .btn{display:inline-block!important;font-family:Archivo,"Helvetica Neue",Arial,sans-serif!important;font-weight:800!important;letter-spacing:.02em!important;text-transform:uppercase!important;font-size:14px!important;text-decoration:none!important;border:2px solid #C8102E!important;padding:13px 26px!important;background:#C8102E!important;color:#fff!important;transition:transform .12s ease,background .12s ease!important}
  .mk-nav .btn:hover{background:#122039!important;border-color:#122039!important;transform:translateY(-1px)!important;color:#fff!important}
  @media(max-width:640px){.mk-nav{align-items:flex-start!important;flex-direction:column!important}.mk-nav-links{width:100%!important}.mk-nav .btn{width:100%!important;text-align:center!important}.mk-nav-links a.plain{padding-left:0!important}}
`;

function sharedHeaderHtml() {
  return `<header class="mk-nav" data-shared-header="true">
      <a class="mk-logo" href="/" aria-label="ARKON home">ARK<span>O</span>N</a>
      <div class="mk-nav-links" aria-label="Primary navigation">
        <a class="plain" href="/#solutions">Business types</a>
        <a class="plain" href="/how-it-works">How it works</a>
        <a class="btn red" href="/#demo">Book a demo</a>
      </div>
    </header>`;
}

function applySharedHeader(html) {
  let next = html;

  if (!next.includes('data-shared-header="true"')) {
    next = next.replace(/\s*<header[\s\S]*?<\/header>\s*/i, `\n    ${sharedHeaderHtml()}\n`);
  }

  if (!next.includes('data-shared-header-css')) {
    next = next.replace(/<\/style>/i, `${sharedHeaderCss}\n  </style>`);
  }

  return next;
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
    headers: {
      authorization: `Bearer ${apiKey}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      text,
      reply_to: replyTo
    })
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
    body: JSON.stringify({
      From: from,
      To: to,
      Subject: subject,
      TextBody: text,
      ReplyTo: replyTo
    })
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

  if (!to || !from) {
    throw new Error('Demo request email recipient or sender is not configured.');
  }

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

  const mail = {
    from,
    to,
    replyTo: payload.email,
    subject,
    text
  };

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

function injectDemoRequestScript(html) {
  if (html.includes('data-demo-request-script')) return html;

  const script = `<script data-demo-request-script>
(() => {
  const endpoint = '/api/demo-request';

  function findLabelText(label) {
    return (label.childNodes[0]?.textContent || label.textContent || '').trim().toLowerCase();
  }

  function styleTextarea(textarea) {
    textarea.style.width = '100%';
    textarea.style.minHeight = '108px';
    textarea.style.border = '1px solid var(--line)';
    textarea.style.borderRadius = '14px';
    textarea.style.padding = '12px 14px';
    textarea.style.color = 'var(--text)';
    textarea.style.background = 'rgba(5, 9, 20, 0.62)';
    textarea.style.outline = 'none';
    textarea.style.resize = 'vertical';
  }

  function enhanceDemoForm() {
    const form = document.querySelector('.demo-form');
    if (!form || form.dataset.demoEnhanced === 'true') return;
    form.dataset.demoEnhanced = 'true';
    form.setAttribute('action', endpoint);
    form.setAttribute('method', 'post');

    form.querySelectorAll('label').forEach(label => {
      const text = findLabelText(label);
      const input = label.querySelector('input');
      const select = label.querySelector('select');
      if (input && text.includes('name')) input.name = 'name';
      if (input && text.includes('email')) input.name = 'email';
      if (select && text.includes('business')) select.name = 'businessType';
    });

    const select = form.querySelector('select[name="businessType"]');
    if (select) {
      const existing = new Set([...select.options].map(option => option.textContent.trim()));
      ['Salons', 'Auto repair shops', 'Medical and dental offices', 'Law firms', 'Gyms and fitness studios'].forEach(label => {
        if (!existing.has(label)) {
          const option = document.createElement('option');
          option.textContent = label;
          option.value = label;
          select.appendChild(option);
        }
      });
    }

    const submitButton = form.querySelector('button[type="submit"]');

    if (!form.querySelector('[name="message"]')) {
      const messageLabel = document.createElement('label');
      messageLabel.textContent = 'Message';
      const textarea = document.createElement('textarea');
      textarea.name = 'message';
      textarea.placeholder = 'Tell us what kind of workflow you want ARKON to handle.';
      styleTextarea(textarea);
      messageLabel.appendChild(textarea);
      submitButton?.insertAdjacentElement('beforebegin', messageLabel);
    }

    if (!form.querySelector('[name="companyWebsite"]')) {
      const honeypot = document.createElement('input');
      honeypot.type = 'text';
      honeypot.name = 'companyWebsite';
      honeypot.tabIndex = -1;
      honeypot.autocomplete = 'off';
      honeypot.setAttribute('aria-hidden', 'true');
      honeypot.style.position = 'absolute';
      honeypot.style.left = '-9999px';
      honeypot.style.width = '1px';
      honeypot.style.height = '1px';
      form.appendChild(honeypot);
    }

    form.querySelectorAll('small').forEach(note => {
      if ((note.textContent || '').toLowerCase().includes('front-end only')) note.remove();
    });

    const status = document.createElement('small');
    status.setAttribute('role', 'status');
    status.style.minHeight = '20px';
    status.style.display = 'block';
    status.style.color = 'var(--subtle)';
    form.appendChild(status);

    form.addEventListener('submit', async event => {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation?.();

      const data = new FormData(form);
      const payload = {
        name: String(data.get('name') || '').trim(),
        email: String(data.get('email') || '').trim(),
        businessType: String(data.get('businessType') || '').trim(),
        message: String(data.get('message') || '').trim(),
        companyWebsite: String(data.get('companyWebsite') || '').trim(),
        sourcePath: window.location.pathname
      };

      if (!payload.name || !payload.email) {
        status.textContent = 'Please enter your name and email.';
        return;
      }

      if (submitButton) submitButton.disabled = true;
      status.textContent = 'Sending request...';

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok || result.ok === false) throw new Error(result.message || 'Request failed.');
        form.reset();
        status.textContent = result.message || 'Request received. We will follow up shortly.';
      } catch {
        status.textContent = 'Request could not be sent. Please try again.';
      } finally {
        if (submitButton) submitButton.disabled = false;
      }
    }, true);
  }

  enhanceDemoForm();
  window.addEventListener('DOMContentLoaded', enhanceDemoForm);
  new MutationObserver(enhanceDemoForm).observe(document.documentElement, { childList: true, subtree: true });
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
    const htmlWithHeader = isStandaloneStaticPage ? applySharedHeader(rawHtml) : rawHtml;
    const htmlWithSeo = injectSeo(htmlWithHeader, route);

    res.writeHead(isKnownRoute ? 200 : 404, headers);
    res.end(injectDemoRequestScript(htmlWithSeo));
    return;
  }

  res.writeHead(200, headers);
  res.end(readFileSync(filePath));
}).listen(port, () => {
  console.log(`ARKON homepage running on port ${port}`);
});
