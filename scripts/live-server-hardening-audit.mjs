import { request as httpsRequest } from 'node:https';
import { brotliDecompressSync } from 'node:zlib';
import { chromium } from 'playwright';

const BASE_URL = 'https://arkon-homepage-staging.up.railway.app';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function rawRequest(path, options = {}) {
  return new Promise((resolve, reject) => {
    const body = Buffer.from(options.body || '');
    const req = httpsRequest(`${BASE_URL}${path}`, {
      method: options.method || 'GET',
      headers: {
        ...options.headers,
        ...(body.length ? { 'content-length': String(body.length) } : {})
      }
    }, res => {
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve({
        status: res.statusCode,
        headers: res.headers,
        body: Buffer.concat(chunks)
      }));
    });
    req.on('error', reject);
    if (body.length) req.write(body);
    req.end();
  });
}

const compressedHomepage = await rawRequest('/', {
  headers: { 'accept-encoding': 'br' }
});
assert(compressedHomepage.status === 200, `Homepage returned ${compressedHomepage.status}.`);
assert(compressedHomepage.headers['content-encoding'] === 'br', 'Live homepage is not Brotli-compressed.');
assert(compressedHomepage.headers['x-robots-tag'] === 'noindex, nofollow, noarchive', 'Live staging is missing noindex protection.');
assert(Boolean(compressedHomepage.headers['content-security-policy']), 'Live CSP header is missing.');
assert(String(compressedHomepage.headers['content-security-policy']).includes('https://app.heygen.com'), 'Live CSP does not permit HeyGen.');
assert(compressedHomepage.headers['strict-transport-security'] === 'max-age=31536000; includeSubDomains', 'Live HSTS header is missing.');
assert(compressedHomepage.headers['x-content-type-options'] === 'nosniff', 'Live nosniff header is missing.');
assert(compressedHomepage.headers['x-frame-options'] === 'DENY', 'Live frame protection is missing.');
assert(compressedHomepage.headers['referrer-policy'] === 'strict-origin-when-cross-origin', 'Live referrer policy is missing.');
assert(Boolean(compressedHomepage.headers['permissions-policy']), 'Live permissions policy is missing.');
assert(brotliDecompressSync(compressedHomepage.body).toString('utf8').includes('Stop letting good customers and warm leads go cold.'), 'Live compressed homepage did not decode correctly.');

const robots = await rawRequest('/robots.txt');
assert(robots.status === 200, `robots.txt returned ${robots.status}.`);
assert(robots.body.toString('utf8').includes('Disallow: /'), 'Live staging robots.txt does not block crawling.');

const missingFields = await rawRequest('/api/demo-request', {
  method: 'POST',
  headers: {
    'content-type': 'application/json',
    origin: BASE_URL
  },
  body: JSON.stringify({ name: 'Live Audit', email: 'audit@example.com' })
});
assert(missingFields.status === 400, `Live missing-field validation returned ${missingFields.status}.`);

const wrongOrigin = await rawRequest('/api/demo-request', {
  method: 'POST',
  headers: {
    'content-type': 'application/json',
    origin: 'https://evil.example'
  },
  body: '{}'
});
assert(wrongOrigin.status === 403, `Live origin protection returned ${wrongOrigin.status}.`);

const wrongContentType = await rawRequest('/api/demo-request', {
  method: 'POST',
  headers: {
    'content-type': 'text/plain',
    origin: BASE_URL
  },
  body: '{}'
});
assert(wrongContentType.status === 415, `Live content-type protection returned ${wrongContentType.status}.`);

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const consoleErrors = [];
  const pageErrors = [];
  page.on('console', message => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });
  page.on('pageerror', error => pageErrors.push(error.message));

  const response = await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 60_000 });
  assert(response?.status() === 200, `Browser homepage returned ${response?.status()}.`);
  await page.getByRole('button', { name: 'Watch the 1-minute overview' }).click();
  const videoFrame = page.locator('iframe[src*="app.heygen.com/embeds/"]');
  await videoFrame.waitFor({ state: 'visible', timeout: 30_000 });
  assert(await videoFrame.count() === 1, 'HeyGen iframe did not load after the watch button was clicked.');
  await page.getByRole('button', { name: 'Close video' }).last().click();
  assert(await videoFrame.count() === 0, 'HeyGen iframe remained mounted after the modal closed.');

  const realEstateResponse = await page.goto(`${BASE_URL}/real-estate`, { waitUntil: 'networkidle', timeout: 60_000 });
  assert(realEstateResponse?.status() === 200, `Real Estate page returned ${realEstateResponse?.status()}.`);
  assert(pageErrors.length === 0, `Browser page errors: ${pageErrors.join(' | ')}`);
  const cspErrors = consoleErrors.filter(message => /content security policy|refused to/i.test(message));
  assert(cspErrors.length === 0, `CSP browser errors: ${cspErrors.join(' | ')}`);
} finally {
  await browser.close();
}

console.log('Live staging hardening audit passed: headers, compression, noindex, endpoint validation, CSP, and HeyGen modal.');
