import { spawn } from 'node:child_process';
import { request as httpRequest } from 'node:http';
import { brotliDecompressSync, gunzipSync } from 'node:zlib';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function delay(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

function request({ port, path = '/', method = 'GET', headers = {}, body = '' }) {
  return new Promise((resolve, reject) => {
    const requestBody = Buffer.isBuffer(body) ? body : Buffer.from(String(body));
    const req = httpRequest({
      hostname: '127.0.0.1',
      port,
      path,
      method,
      headers: {
        host: `127.0.0.1:${port}`,
        ...headers,
        ...(requestBody.length ? { 'content-length': String(requestBody.length) } : {})
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
    if (requestBody.length) req.write(requestBody);
    req.end();
  });
}

function decodedBody(response) {
  const encoding = String(response.headers['content-encoding'] || '').toLowerCase();
  if (encoding === 'br') return brotliDecompressSync(response.body).toString('utf8');
  if (encoding === 'gzip') return gunzipSync(response.body).toString('utf8');
  return response.body.toString('utf8');
}

async function startServer(port, environmentName) {
  const child = spawn(
    process.execPath,
    ['--import', './src/legal-register.js', 'server.runtime.js'],
    {
      env: {
        ...process.env,
        PORT: String(port),
        RAILWAY_ENVIRONMENT_NAME: environmentName,
        RAILWAY_ENVIRONMENT: environmentName,
        APP_ENV: environmentName,
        DEMO_REQUEST_TO_EMAIL: '',
        DEMO_REQUEST_FROM_EMAIL: '',
        DEMO_EMAIL_PROVIDER: '',
        RESEND_API_KEY: '',
        POSTMARK_SERVER_TOKEN: '',
        POSTMARK_API_TOKEN: ''
      },
      stdio: ['ignore', 'pipe', 'pipe']
    }
  );

  let output = '';
  child.stdout.on('data', chunk => { output += chunk.toString(); });
  child.stderr.on('data', chunk => { output += chunk.toString(); });

  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (child.exitCode !== null) throw new Error(`Server exited before audit started:\n${output}`);
    try {
      const response = await request({ port, path: '/robots.txt' });
      if (response.status === 200) return { child, output: () => output };
    } catch {
      // Server is still starting.
    }
    await delay(100);
  }

  child.kill('SIGTERM');
  throw new Error(`Server did not become ready:\n${output}`);
}

async function stopServer(server) {
  if (!server?.child || server.child.exitCode !== null) return;
  server.child.kill('SIGTERM');
  await Promise.race([
    new Promise(resolve => server.child.once('exit', resolve)),
    delay(2000)
  ]);
  if (server.child.exitCode === null) server.child.kill('SIGKILL');
}

function jsonRequest(port, payload, options = {}) {
  const body = options.rawBody ?? JSON.stringify(payload);
  return request({
    port,
    path: '/api/demo-request',
    method: options.method || 'POST',
    headers: {
      'content-type': options.contentType || 'application/json',
      origin: options.origin || `http://127.0.0.1:${port}`,
      'x-forwarded-for': options.ip || '203.0.113.10',
      ...options.headers
    },
    body
  });
}

const validPayload = {
  name: 'Jordan Lee',
  email: 'jordan@example.com',
  phone: '(305) 555-0188',
  companyName: 'Jordan Service Group',
  website: 'https://example.com',
  businessType: 'Home services',
  sourcePath: '/',
  message: 'Please show me the workflow.',
  companyWebsite: '',
  contactConsent: true,
  consentRecordedAt: new Date().toISOString(),
  privacyVersion: '2026-07-28'
};

const stagingPort = 43121;
const productionPort = 43122;
let stagingServer;
let productionServer;

try {
  stagingServer = await startServer(stagingPort, 'staging');

  const homepage = await request({
    port: stagingPort,
    path: '/',
    headers: { 'accept-encoding': 'br, gzip' }
  });
  assert(homepage.status === 200, `Expected staging homepage 200, received ${homepage.status}.`);
  assert(homepage.headers['content-encoding'] === 'br', 'Staging homepage was not Brotli-compressed.');
  assert(String(homepage.headers.vary || '').includes('Accept-Encoding'), 'Compressed response is missing Vary: Accept-Encoding.');
  assert(homepage.headers['x-robots-tag'] === 'noindex, nofollow, noarchive', 'Staging response is missing X-Robots-Tag noindex.');
  assert(Boolean(homepage.headers['content-security-policy']), 'Content-Security-Policy is missing.');
  assert(String(homepage.headers['content-security-policy']).includes('https://app.heygen.com'), 'CSP does not permit the HeyGen frame.');
  assert(homepage.headers['strict-transport-security'] === 'max-age=31536000; includeSubDomains', 'HSTS is missing or incorrect.');
  assert(homepage.headers['x-content-type-options'] === 'nosniff', 'X-Content-Type-Options is missing.');
  assert(homepage.headers['x-frame-options'] === 'DENY', 'X-Frame-Options is missing.');
  assert(homepage.headers['referrer-policy'] === 'strict-origin-when-cross-origin', 'Referrer-Policy is missing.');
  assert(Boolean(homepage.headers['permissions-policy']), 'Permissions-Policy is missing.');
  assert(decodedBody(homepage).includes('Stop letting good customers and warm leads go cold.'), 'Compressed homepage body did not decode correctly.');

  const stagingRobots = await request({ port: stagingPort, path: '/robots.txt' });
  assert(decodedBody(stagingRobots).includes('Disallow: /'), 'Staging robots.txt does not block crawling.');

  const wrongMethod = await request({ port: stagingPort, path: '/api/demo-request', method: 'GET' });
  assert(wrongMethod.status === 405, `Expected method rejection 405, received ${wrongMethod.status}.`);
  assert(wrongMethod.headers.allow === 'POST', 'Method rejection is missing Allow: POST.');

  const wrongContentType = await jsonRequest(stagingPort, {}, {
    contentType: 'text/plain',
    rawBody: '{}',
    ip: '203.0.113.11'
  });
  assert(wrongContentType.status === 415, `Expected content-type rejection 415, received ${wrongContentType.status}.`);

  const wrongOrigin = await jsonRequest(stagingPort, {}, {
    origin: 'https://evil.example',
    ip: '203.0.113.12'
  });
  assert(wrongOrigin.status === 403, `Expected origin rejection 403, received ${wrongOrigin.status}.`);

  const invalidJson = await jsonRequest(stagingPort, {}, {
    rawBody: '{not-json',
    ip: '203.0.113.13'
  });
  assert(invalidJson.status === 400, `Expected invalid JSON rejection 400, received ${invalidJson.status}.`);

  const missingFields = await jsonRequest(stagingPort, { name: 'Jordan', email: 'jordan@example.com' }, {
    ip: '203.0.113.14'
  });
  assert(missingFields.status === 400, `Expected missing-field rejection 400, received ${missingFields.status}.`);

  const missingConsent = await jsonRequest(stagingPort, { ...validPayload, contactConsent: false }, {
    ip: '203.0.113.15'
  });
  assert(missingConsent.status === 400, `Expected consent rejection 400, received ${missingConsent.status}.`);

  const invalidWebsite = await jsonRequest(stagingPort, { ...validPayload, website: 'javascript:alert(1)' }, {
    ip: '203.0.113.16'
  });
  assert(invalidWebsite.status === 400, `Expected website rejection 400, received ${invalidWebsite.status}.`);

  const oversizedBody = await jsonRequest(stagingPort, {}, {
    rawBody: JSON.stringify({ message: 'x'.repeat(33_000) }),
    ip: '203.0.113.17'
  });
  assert(oversizedBody.status === 413, `Expected oversized-body rejection 413, received ${oversizedBody.status}.`);

  const validWithoutEmailProvider = await jsonRequest(stagingPort, validPayload, {
    ip: '203.0.113.18'
  });
  assert(validWithoutEmailProvider.status === 500, 'A complete payload did not pass validation and reach the email-provider boundary.');

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const response = await jsonRequest(stagingPort, { name: 'Rate Test' }, {
      ip: '203.0.113.20'
    });
    assert(response.status === 400, `Rate-limit setup request ${attempt + 1} did not reach validation.`);
  }
  const rateLimited = await jsonRequest(stagingPort, { name: 'Rate Test' }, {
    ip: '203.0.113.20'
  });
  assert(rateLimited.status === 429, `Expected rate limiting 429, received ${rateLimited.status}.`);
  assert(Number(rateLimited.headers['retry-after']) > 0, 'Rate-limited response is missing Retry-After.');

  await stopServer(stagingServer);
  stagingServer = null;

  productionServer = await startServer(productionPort, 'production');
  const productionHomepage = await request({ port: productionPort, path: '/' });
  assert(!productionHomepage.headers['x-robots-tag'], 'Production response must not receive staging noindex headers.');
  const productionRobots = await request({ port: productionPort, path: '/robots.txt' });
  const productionRobotsText = decodedBody(productionRobots);
  assert(productionRobotsText.includes('Allow: /'), 'Production robots.txt is not crawlable.');
  assert(productionRobotsText.includes('Sitemap:'), 'Production robots.txt is missing the sitemap.');

  console.log('Server hardening audit passed: headers, compression, staging noindex, validation, origin checks, payload limits, and rate limiting.');
} finally {
  await stopServer(stagingServer);
  await stopServer(productionServer);
}
