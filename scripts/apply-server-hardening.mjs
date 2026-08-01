import { readFileSync, writeFileSync } from 'node:fs';

function replaceOnce(source, from, to, label) {
  if (!source.includes(from)) throw new Error(`Missing ${label}.`);
  return source.replace(from, to);
}

function replaceBetween(source, startMarker, endMarker, replacement, label) {
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker, start + startMarker.length);
  if (start === -1 || end === -1 || end <= start) throw new Error(`Invalid ${label} boundaries.`);
  return `${source.slice(0, start)}${replacement}${source.slice(end)}`;
}

const serverPath = 'server.js';
let server = readFileSync(serverPath, 'utf8');

server = replaceOnce(
  server,
  "import { fileURLToPath } from 'node:url';",
  "import { fileURLToPath } from 'node:url';\nimport { brotliCompressSync, constants as zlibConstants, gzipSync } from 'node:zlib';",
  'zlib import'
);

server = replaceOnce(
  server,
  "const appShellPath = join(distDir, 'index.html');",
  `const appShellPath = join(distDir, 'index.html');
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
  "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com",
  "frame-src https://app.heygen.com",
  "media-src 'self' blob: https:",
  "worker-src 'self' blob:",
  "manifest-src 'self'"
].join('; ');`,
  'server constants'
);

const helperBlock = `function isValidEmail(value) {
  return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value);
}

function isValidPhone(value) {
  const digits = String(value || '').replace(/\\D/g, '');
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
    return new URL(\`http://\${rawHost}\`).hostname.toLowerCase();
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
  return /^text\\//i.test(contentType)
    || /(?:javascript|json|xml|svg\\+xml)/i.test(contentType);
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

`;

server = replaceBetween(
  server,
  'function isValidEmail(value) {',
  'async function sendWithResend',
  helperBlock,
  'server helper block'
);

const emailBlock = `async function sendDemoRequestEmail(payload, req) {
  const to = process.env.DEMO_REQUEST_TO_EMAIL;
  const from = process.env.DEMO_REQUEST_FROM_EMAIL;
  const preferredProvider = cleanText(process.env.DEMO_EMAIL_PROVIDER, 30).toLowerCase();

  if (!to || !from) throw new Error('Demo request email recipient or sender is not configured.');

  const subject = \`ARKON demo request: \${payload.businessType}\`;
  const text = [
    'New ARKON demo request',
    '',
    \`Name: \${payload.name}\`,
    \`Email: \${payload.email}\`,
    \`Phone: \${payload.phone}\`,
    \`Company name: \${payload.companyName}\`,
    \`Website: \${payload.website || 'Not provided'}\`,
    \`Business type: \${payload.businessType}\`,
    \`Source page: \${payload.sourcePath || '/'}\`,
    \`Contact consent: Yes, for this request\`,
    \`Consent recorded: \${payload.consentRecordedAt}\`,
    \`Privacy version: \${payload.privacyVersion}\`,
    \`IP: \${getClientIp(req)}\`,
    \`User agent: \${cleanText(req.headers['user-agent'], 300) || 'unknown'}\`,
    '',
    'Message:',
    payload.message || 'No message provided'
  ].join('\\n');

  const mail = { from, to, replyTo: payload.email, subject, text };
  if (preferredProvider === 'postmark') return sendWithPostmark(mail);
  if (preferredProvider === 'resend') return sendWithResend(mail);
  if (process.env.RESEND_API_KEY) return sendWithResend(mail);
  if (process.env.POSTMARK_SERVER_TOKEN || process.env.POSTMARK_API_TOKEN) return sendWithPostmark(mail);
  throw new Error('No email provider configured for demo requests.');
}

`;

server = replaceBetween(
  server,
  'async function sendDemoRequestEmail',
  'async function handleDemoRequest',
  emailBlock,
  'demo email block'
);

const requestBlock = `async function handleDemoRequest(req, res) {
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

`;

server = replaceBetween(
  server,
  'async function handleDemoRequest',
  'function buildSchema',
  requestBlock,
  'demo request block'
);

const robotsBlock = `function robotsTxt(req) {
  if (isStagingRequest(req)) {
    return 'User-agent: *\\nDisallow: /\\n';
  }

  return \`User-agent: *\\nAllow: /\\nSitemap: \${siteUrl}/sitemap.xml\\n\`;
}

`;

server = replaceBetween(
  server,
  'function robotsTxt()',
  'function redirectBareDomain',
  robotsBlock,
  'robots block'
);

server = replaceOnce(
  server,
  'createServer(async (req, res) => {\n  if (redirectBareDomain(req, res)) return;',
  'createServer(async (req, res) => {\n  applySecurityHeaders(req, res);\n\n  if (redirectBareDomain(req, res)) return;',
  'security header application'
);

server = replaceOnce(
  server,
  `  if (pathname === '/robots.txt') {
    res.writeHead(200, {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=3600'
    });
    res.end(robotsTxt());
    return;
  }`,
  `  if (pathname === '/robots.txt') {
    sendResponse(req, res, 200, {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=3600'
    }, robotsTxt(req));
    return;
  }`,
  'robots route'
);

server = replaceOnce(
  server,
  `  if (pathname === '/sitemap.xml') {
    res.writeHead(200, {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 'public, max-age=3600'
    });
    res.end(sitemapXml());
    return;
  }`,
  `  if (pathname === '/sitemap.xml') {
    sendResponse(req, res, 200, {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 'public, max-age=3600'
    }, sitemapXml());
    return;
  }`,
  'sitemap route'
);

server = replaceOnce(
  server,
  `    res.writeHead(isKnownRoute ? 200 : 404, headers);
    res.end(html);
    return;`,
  `    sendResponse(req, res, isKnownRoute ? 200 : 404, headers, html);
    return;`,
  'HTML response'
);

server = replaceOnce(
  server,
  `  res.writeHead(200, headers);
  res.end(readFileSync(filePath));`,
  `  sendResponse(req, res, 200, headers, readFileSync(filePath));`,
  'static response'
);

writeFileSync(serverPath, server);

const formPath = 'src/DemoRequestForm.jsx';
let form = readFileSync(formPath, 'utf8');
const emailMessageStart = form.indexOf('    const emailMessage = [');
const emailMessageEnd = form.indexOf('\n\n    setIsSubmitting', emailMessageStart);
if (emailMessageStart === -1 || emailMessageEnd === -1) throw new Error('Could not find client email-message assembly.');
form = `${form.slice(0, emailMessageStart)}${form.slice(emailMessageEnd + 2)}`;
form = replaceOnce(
  form,
  `          phone,
          businessType,
          sourcePath: window.location.pathname,
          message: emailMessage,`,
  `          phone,
          companyName,
          website,
          businessType,
          sourcePath: window.location.pathname,
          message,`,
  'demo request payload fields'
);
writeFileSync(formPath, form);

const packagePath = 'package.json';
const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));
packageJson.scripts = {
  ...packageJson.scripts,
  'audit:server': 'node scripts/audit-server-hardening.mjs'
};
writeFileSync(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`);

console.log('Applied ARKON server hardening migration.');
