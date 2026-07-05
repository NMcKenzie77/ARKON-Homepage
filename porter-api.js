const DEFAULT_PORTER_MODEL = 'claude-3-5-haiku-latest';

function cleanText(value, maxLength = 500) {
  return String(value || '')
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

function cleanMessage(value, maxLength = 4000) {
  return String(value || '')
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '')
    .trim()
    .slice(0, maxLength);
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
}

function jsonResponse(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store'
  });
  res.end(JSON.stringify(payload));
}

function readJsonBody(req, limitBytes = 64_000) {
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

function normalizeHistory(history) {
  return Array.isArray(history)
    ? history
      .slice(-14)
      .map(message => ({
        role: message?.role === 'assistant' ? 'assistant' : 'user',
        content: cleanMessage(message?.content, 1000)
      }))
      .filter(message => message.content)
    : [];
}

function normalizeLead(rawLead = {}) {
  return {
    name: cleanText(rawLead.name, 120),
    email: cleanText(rawLead.email, 180).toLowerCase(),
    phone: cleanText(rawLead.phone, 80),
    companyName: cleanText(rawLead.companyName, 160),
    website: cleanText(rawLead.website, 220),
    businessType: cleanText(rawLead.businessType, 160),
    intent: cleanText(rawLead.intent, 180),
    mainProblem: cleanText(rawLead.mainProblem, 280),
    urgency: cleanText(rawLead.urgency, 120),
    bestContact: cleanText(rawLead.bestContact, 180),
    recommendedWorkflow: cleanText(rawLead.recommendedWorkflow, 180)
  };
}

function extractTextFromAnthropic(payload) {
  const block = Array.isArray(payload?.content)
    ? payload.content.find(item => item?.type === 'text' && item.text)
    : null;
  return cleanMessage(block?.text || '', 4000);
}

function parsePorterJson(text) {
  const cleaned = cleanMessage(text, 4000)
    .replace(/^```json/i, '')
    .replace(/^```/i, '')
    .replace(/```$/i, '')
    .trim();

  try {
    const parsed = JSON.parse(cleaned);
    return {
      reply: cleanMessage(parsed.reply, 700),
      lead: normalizeLead(parsed.lead || {}),
      readyToRoute: Boolean(parsed.readyToRoute),
      routingLabel: cleanText(parsed.routingLabel, 160)
    };
  } catch {
    return {
      reply: cleanMessage(text, 700) || 'Tell me a little more about what brought you to ARKON.',
      lead: normalizeLead({}),
      readyToRoute: false,
      routingLabel: ''
    };
  }
}

function mergeLeads(existingLead, modelLead) {
  const base = normalizeLead(existingLead);
  const next = normalizeLead(modelLead);
  return Object.fromEntries(
    Object.keys(base).map(key => [key, next[key] || base[key]])
  );
}

function hasMinimumLeadInfo(lead) {
  const hasContact = isValidEmail(lead.email) || Boolean(lead.phone || lead.bestContact);
  const hasReason = Boolean(lead.intent || lead.mainProblem || lead.recommendedWorkflow);
  return Boolean(lead.name && hasContact && hasReason);
}

function porterSystemPrompt({ lead, sourcePath }) {
  return `You are Porter, the website inquiry and lead intake role for ARKON Systems.

Your job:
- Greet website visitors.
- Hold a casual intake conversation.
- Ask one short question at a time.
- Extract the useful details without sounding like a form.
- Route the visitor toward the right ARKON workflow.

Critical rules:
- Do not show or mention a form.
- Do not ask multiple questions at once.
- Keep replies under 45 words unless summarizing at the end.
- Do not make pricing promises.
- Do not say ARKON replaces employees.
- Do not pretend to be human.
- Do not answer legal, medical, financial, or technical guarantee questions. Route those to the ARKON team.
- If the visitor asks what ARKON does, answer briefly: ARKON handles repeatable work around calls, website inquiries, messages, follow-up, scheduling, records, handoffs, and owner visibility.

Collect naturally over the conversation:
- name
- business type
- company name if offered
- website if offered
- main reason they came to ARKON
- main problem they want handled
- urgency
- best email or phone number for follow-up
- recommended ARKON workflow

Workflow hints:
- missed phone calls, front desk, inbound callers => Vera / calls and front desk
- website forms, quote requests, appointment interest, after-hours web leads => Porter / website inquiry and lead intake
- texts, follow-up, customer messages => Naya / customer follow-up
- records, customer history, prior conversations => Marcus / relationship memory
- owner summaries, visibility, what happened today => Grant / owner visibility
- email triage => Iris / inbox triage

When you have enough to route, set readyToRoute true and give a short confirmation. If you do not have a best contact yet, ask for email or phone before setting readyToRoute true.

Current extracted lead:
${JSON.stringify(lead)}

Source page: ${sourcePath || '/'}

Return only valid JSON with this shape:
{"reply":"short natural Porter reply","lead":{"name":"","email":"","phone":"","companyName":"","website":"","businessType":"","intent":"","mainProblem":"","urgency":"","bestContact":"","recommendedWorkflow":""},"readyToRoute":false,"routingLabel":""}`;
}

async function askAnthropic({ history, lead, sourcePath }) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not configured.');
  }

  const model = process.env.ANTHROPIC_MODEL || DEFAULT_PORTER_MODEL;
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model,
      max_tokens: 700,
      temperature: 0.2,
      system: porterSystemPrompt({ lead, sourcePath }),
      messages: history.length
        ? history
        : [{ role: 'user', content: 'The visitor just opened Porter. Start the intake.' }]
    })
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`Anthropic failed with ${response.status}: ${detail.slice(0, 300)}`);
  }

  return parsePorterJson(extractTextFromAnthropic(await response.json()));
}

async function sendWithResend({ from, to, replyTo, subject, text }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;
  const body = { from, to: [to], subject, text };
  if (replyTo && isValidEmail(replyTo)) body.reply_to = replyTo;
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' },
    body: JSON.stringify(body)
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
  const body = { From: from, To: to, Subject: subject, TextBody: text };
  if (replyTo && isValidEmail(replyTo)) body.ReplyTo = replyTo;
  const response = await fetch('https://api.postmarkapp.com/email', {
    method: 'POST',
    headers: { 'x-postmark-server-token': token, accept: 'application/json', 'content-type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`Postmark failed with ${response.status}: ${detail.slice(0, 300)}`);
  }
  return true;
}

async function sendPorterLead({ lead, sourcePath, transcript, req }) {
  const to = process.env.DEMO_REQUEST_TO_EMAIL;
  const from = process.env.DEMO_REQUEST_FROM_EMAIL;
  const preferredProvider = cleanText(process.env.DEMO_EMAIL_PROVIDER, 30).toLowerCase();
  if (!to || !from) throw new Error('Porter lead email recipient or sender is not configured.');

  const subject = `Porter lead: ${lead.businessType || lead.intent || 'Website inquiry'}`;
  const text = [
    'New Porter website intake',
    '',
    `Name: ${lead.name || 'Not provided'}`,
    `Email: ${lead.email || 'Not provided'}`,
    `Phone: ${lead.phone || lead.bestContact || 'Not provided'}`,
    `Company: ${lead.companyName || 'Not provided'}`,
    `Website: ${lead.website || 'Not provided'}`,
    `Business type: ${lead.businessType || 'Not provided'}`,
    `Intent: ${lead.intent || 'Not provided'}`,
    `Main problem: ${lead.mainProblem || 'Not provided'}`,
    `Urgency: ${lead.urgency || 'Not provided'}`,
    `Recommended workflow: ${lead.recommendedWorkflow || 'Not provided'}`,
    `Source page: ${sourcePath || '/'}`,
    `IP: ${getClientIp(req)}`,
    `User agent: ${cleanText(req.headers['user-agent'], 300) || 'unknown'}`,
    '',
    'Conversation:',
    transcript || 'No transcript captured'
  ].join('\n');

  const mail = { from, to, replyTo: lead.email, subject, text };
  if (preferredProvider === 'postmark') return sendWithPostmark(mail);
  if (preferredProvider === 'resend') return sendWithResend(mail);
  if (process.env.RESEND_API_KEY) return sendWithResend(mail);
  if (process.env.POSTMARK_SERVER_TOKEN || process.env.POSTMARK_API_TOKEN) return sendWithPostmark(mail);
  throw new Error('No email provider configured for Porter leads.');
}

function transcriptFromHistory(history) {
  return history
    .map(message => `${message.role === 'assistant' ? 'Porter' : 'Visitor'}: ${message.content}`)
    .join('\n');
}

export async function handlePorterChat(req, res) {
  if (req.method !== 'POST') {
    res.writeHead(405, { allow: 'POST', 'content-type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ ok: false, message: 'Method not allowed.' }));
    return;
  }

  try {
    const body = await readJsonBody(req);
    const history = normalizeHistory(body.history);
    const sourcePath = cleanText(body.sourcePath, 220) || '/';
    const currentLead = normalizeLead(body.lead || {});
    const modelResult = await askAnthropic({ history, lead: currentLead, sourcePath });
    const lead = mergeLeads(currentLead, modelResult.lead);
    const readyToRoute = Boolean(modelResult.readyToRoute && hasMinimumLeadInfo(lead));
    let routed = false;

    if (readyToRoute && !body.alreadyRouted) {
      await sendPorterLead({
        lead,
        sourcePath,
        transcript: transcriptFromHistory([...history, { role: 'assistant', content: modelResult.reply }]),
        req
      });
      routed = true;
    }

    jsonResponse(res, 200, {
      ok: true,
      reply: modelResult.reply || 'Got it. Tell me a little more about what you need ARKON to handle.',
      lead,
      readyToRoute,
      routed,
      routingLabel: modelResult.routingLabel || lead.recommendedWorkflow || ''
    });
  } catch (error) {
    console.error('Porter chat failed:', error);
    jsonResponse(res, 500, {
      ok: false,
      message: 'Porter could not respond right now.'
    });
  }
}
