const DEFAULT_PORTER_MODEL = 'claude-3-5-haiku-20241022';

const ARKON_KNOWLEDGE = {
  summary: 'ARKON Systems is an AI operating and workflow layer for service businesses. It handles repeatable work around calls, website inquiries, messages, follow-up, scheduling, records, handoffs, documents, and owner visibility.',
  roles: {
    Vera: 'Inbound phone reception, caller qualification, detail capture, and routing.',
    Porter: 'Website questions, lead intake, workflow guidance, and warm handoff.',
    Naya: 'Customer, client, or guest messaging, confirmations, reminders, and follow-up in the business voice.',
    Marcus: 'CRM records, relationship history, notes, stages, reminders, scheduling context, and handoff memory.',
    Iris: 'Inbox triage, urgency scoring, and surfacing important email.',
    Grant: 'Owner summaries, visibility, risk signals, and next-action reporting.'
  },
  industries: [
    'real estate',
    'insurance',
    'short-term rentals',
    'home services',
    'professional services',
    'salons',
    'auto repair shops',
    'medical and dental offices',
    'law firms',
    'gyms and fitness studios'
  ],
  pricing: [
    'Follow-Up Starter: founder pilot $799/month, target $999-$1,250/month, $1,000 setup.',
    'Follow-Up Plus: founder pilot $999/month, target $1,500/month, $1,250 setup.',
    'Shop Operator: founder pilot $1,250/month, target $1,750/month, $1,500 setup.',
    'Shop Command: founder pilot $1,750/month, target $2,500/month, $2,500-$3,500 setup.',
    'Enterprise: discovery first, target $5,000+/month, $7,500+ setup.'
  ],
  scheduling: 'ARKON can capture appointment requests from calls or the website, apply the business rules, coordinate confirmations or rescheduling, preserve the customer context, and hand the appointment into the business scheduling process. Exact calendar or software integration depends on discovery.',
  boundaries: [
    'ARKON does not replace licensed, legal, medical, financial, underwriting, pricing, or judgment-based decisions.',
    'ARKON routes sensitive, urgent, approval-based, or judgment-based matters to a person.',
    'Final pricing depends on call volume, locations, team size, current software, coverage hours, and integration depth.'
  ]
};

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
  const messages = Array.isArray(history)
    ? history
      .slice(-18)
      .map(message => ({
        role: message?.role === 'assistant' ? 'assistant' : 'user',
        content: cleanMessage(message?.content, 1200)
      }))
      .filter(message => message.content)
    : [];

  // The greeting is rendered in the browser. Anthropic must receive a user turn first.
  while (messages[0]?.role === 'assistant') messages.shift();

  const normalized = [];
  for (const message of messages) {
    const previous = normalized[normalized.length - 1];
    if (previous?.role === message.role) {
      previous.content = cleanMessage(`${previous.content}\n${message.content}`, 1800);
    } else {
      normalized.push({ ...message });
    }
  }

  return normalized;
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
    recommendedWorkflow: cleanText(rawLead.recommendedWorkflow, 220)
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

  const candidate = cleaned.match(/\{[\s\S]*\}/)?.[0] || cleaned;

  try {
    const parsed = JSON.parse(candidate);
    return {
      reply: cleanMessage(parsed.reply, 900),
      lead: normalizeLead(parsed.lead || {}),
      readyToRoute: Boolean(parsed.readyToRoute),
      routingLabel: cleanText(parsed.routingLabel, 160)
    };
  } catch {
    return {
      reply: cleanMessage(text, 900) || 'Tell me what you want your business to handle more consistently.',
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

function latestUserMessage(history) {
  return [...history].reverse().find(message => message.role === 'user')?.content || '';
}

function latestAssistantMessage(history) {
  return [...history].reverse().find(message => message.role === 'assistant')?.content || '';
}

function extractLocalLead(history, existingLead) {
  const lead = normalizeLead(existingLead);
  const userMessages = history.filter(message => message.role === 'user');
  const text = userMessages.map(message => message.content).join(' ');
  const latest = latestUserMessage(history);

  const email = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0];
  const phone = text.match(/(?:\+?1[\s.-]?)?(?:\(?\d{3}\)?[\s.-]?)\d{3}[\s.-]?\d{4}/)?.[0];
  const website = text.match(/https?:\/\/[^\s]+|\bwww\.[a-z0-9-]+\.[a-z]{2,}\b/i)?.[0];

  if (!lead.email && email) lead.email = email.toLowerCase();
  if (!lead.phone && phone) lead.phone = cleanText(phone, 80);
  if (!lead.bestContact && (lead.email || lead.phone)) lead.bestContact = lead.email || lead.phone;
  if (!lead.website && website && !website.toLowerCase().includes('arkonsysai.com')) lead.website = website;

  if (!lead.name) {
    const nameMatch = latest.match(/\b(?:i am|i'm|my name is)\s+([a-z][a-z' -]{1,40})\b/i);
    if (nameMatch) lead.name = cleanText(nameMatch[1].replace(/\b(and|with|from)\b.*$/i, ''), 120);
  }

  const businessMatches = [
    ['insurance', /\binsurance|agency|producer|policy|renewal\b/i],
    ['real estate', /\breal estate|realtor|brokerage|property agent\b/i],
    ['short-term rentals', /\bshort[- ]term rental|airbnb|vacation rental|host\b/i],
    ['home services', /\bplumb|hvac|electric|roof|contractor|home service\b/i],
    ['auto repair shops', /\bauto repair|mechanic|garage|repair shop|tire shop\b/i],
    ['law firms', /\blaw firm|attorney|lawyer|legal practice\b/i],
    ['medical and dental offices', /\bdental|dentist|medical office|clinic|patient\b/i],
    ['gyms and fitness studios', /\bgym|fitness|studio|personal training\b/i],
    ['salons', /\bsalon|barber|beauty|spa\b/i],
    ['professional services', /\baccounting|consulting|professional service|cpa\b/i]
  ];

  if (!lead.businessType) {
    lead.businessType = businessMatches.find(([, pattern]) => pattern.test(text))?.[0] || '';
  }

  if (!lead.intent && /demo|consult|talk|call|interested|pricing|cost|buy|sign up/i.test(text)) {
    lead.intent = 'Evaluate ARKON for the business';
  }

  if (!lead.mainProblem && latest.length > 6 && !isValidEmail(latest)) {
    const problemPattern = /missed|follow[- ]?up|calls?|messages?|schedul|calendar|book(?:ing)?|reschedul|reminders?|inbox|email|leads?|customers?|clients?|records?|handoff|visibility|documents?|appointments?|renewals?/i;
    if (problemPattern.test(latest)) lead.mainProblem = cleanText(latest, 280);
  }

  if (!lead.urgency) {
    if (/today|immediately|urgent|asap|right now/i.test(text)) lead.urgency = 'Immediate';
    else if (/this week|soon|quickly/i.test(text)) lead.urgency = 'Soon';
  }

  if (!lead.recommendedWorkflow) {
    if (/schedul|calendar|appointment|booking|reschedul|reminder/i.test(text)) {
      lead.recommendedWorkflow = 'Scheduling coordination: Porter or Vera intake, Naya confirmations, and Marcus context';
    } else if (/miss(?:ed|ing)? calls?|phone|front desk|inbound call/i.test(text)) {
      lead.recommendedWorkflow = 'Vera: calls and front-desk intake';
    } else if (/website|web lead|form|quote request|online inquiry/i.test(text)) {
      lead.recommendedWorkflow = 'Porter: website inquiry and lead intake';
    } else if (/text|message|follow[- ]?up|guest|client communication/i.test(text)) {
      lead.recommendedWorkflow = 'Naya: communication and follow-up';
    } else if (/crm|history|record|notes?|context/i.test(text)) {
      lead.recommendedWorkflow = 'Marcus: CRM and relationship memory';
    } else if (/email|inbox|triage/i.test(text)) {
      lead.recommendedWorkflow = 'Iris: inbox triage';
    } else if (/owner|dashboard|summary|visibility|report/i.test(text)) {
      lead.recommendedWorkflow = 'Grant: owner visibility';
    }
  }

  return normalizeLead(lead);
}

function localPorterResponse({ history, lead, sourcePath }) {
  const latest = latestUserMessage(history);
  const lower = latest.toLowerCase();
  const extractedLead = extractLocalLead(history, lead);
  let reply = '';

  if (!latest) {
    reply = 'I can explain ARKON, recommend the right workflow for your business, discuss published pricing, or help you request a demo. What are you trying to improve?';
  } else if (/what (can|do) you do|who are you|help me/i.test(lower)) {
    reply = 'I’m Porter, ARKON’s website assistant. I can answer questions, match your problem to the right ARKON role, explain pricing, and collect the details for a demo or follow-up.';
  } else if (/what is arkon|what does arkon do|how does arkon work/i.test(lower)) {
    reply = `${ARKON_KNOWLEDGE.summary} What part of your operation is dropping work today?`;
  } else if (/price|pricing|cost|how much/i.test(lower)) {
    reply = 'Published founder pilots start at $799/month. Current target plans range from about $999 to $2,500/month, while Enterprise starts with discovery. Final pricing depends on volume, locations, coverage, and integrations.';
  } else if (/replace (my|our) (staff|employees|team)|fire|lay off/i.test(lower)) {
    reply = 'ARKON is designed to handle repeatable work around your team, not replace judgment, licensed work, or the people who own customer relationships and decisions.';
  } else if (/schedul|calendar|appointment|booking|reschedul|reminder/i.test(lower)) {
    reply = `${ARKON_KNOWLEDGE.scheduling} The usual mix is Porter or Vera for intake, Naya for confirmations and reminders, and Marcus for context. Which part breaks most: booking, rescheduling, reminders, or the staff handoff?`;
  } else if (/vera|naya|marcus|iris|grant|porter/i.test(lower)) {
    const matchedRole = Object.keys(ARKON_KNOWLEDGE.roles).find(role => lower.includes(role.toLowerCase()));
    reply = matchedRole
      ? `${matchedRole} handles ${ARKON_KNOWLEDGE.roles[matchedRole].charAt(0).toLowerCase()}${ARKON_KNOWLEDGE.roles[matchedRole].slice(1)}`
      : 'ARKON uses different roles for calls, website leads, messages, CRM memory, inbox triage, and owner visibility so one bot is not pretending to do every job.';
  } else if (/demo|book|talk to|speak to|contact|interested|sign up/i.test(lower)) {
    if (!extractedLead.name) reply = 'I can prepare the handoff. What name should I put on the request?';
    else if (!isValidEmail(extractedLead.email) && !extractedLead.phone) reply = `Thanks, ${extractedLead.name}. What email address or phone number should the ARKON team use?`;
    else if (!extractedLead.mainProblem && !extractedLead.intent) reply = 'What is the main workflow or problem you want ARKON to handle?';
    else reply = 'I have enough to prepare the handoff to the ARKON team.';
  } else if (/insurance|real estate|airbnb|rental|home service|contractor|auto repair|garage|law firm|dental|medical|gym|fitness|salon/i.test(lower)) {
    const business = extractedLead.businessType || 'your business';
    reply = `ARKON can support ${business} with intake, follow-up, records, routing, and owner visibility. Which part is causing the most missed work right now?`;
  } else if (/miss(?:ed|ing)? calls?|phone|front desk/i.test(lower)) {
    reply = 'Vera is the best starting point for missed calls and front-desk pressure. She can answer, qualify, capture details, and route calls using your business rules. How many calls are slipping through?';
  } else if (/follow[- ]?up|text|message|guest/i.test(lower)) {
    reply = 'Naya is the best fit for customer, client, or guest messaging and follow-up. She uses the business voice and routes anything that needs judgment. What follow-up is being missed?';
  } else if (/email|inbox/i.test(lower)) {
    reply = 'Iris handles inbox triage by identifying urgency, surfacing important messages, and flagging new leads or client needs. What kind of email is getting buried?';
  } else if (/crm|record|history|notes|context/i.test(lower)) {
    reply = 'Marcus keeps contact records, prior conversations, notes, pipeline stages, and follow-up context attached so the next person does not start from zero.';
  } else if (/owner|dashboard|summary|visibility|report/i.test(lower)) {
    reply = 'Grant gives the owner a clear view of what came in, what was handled, what is waiting, and what needs attention without forcing the team to recap everything.';
  } else {
    const subject = cleanText(latest, 90);
    reply = subject
      ? `I understand the issue is “${subject}.” I can narrow that down by where the problem starts: a call, website request, message, email, or internal handoff. Where does it usually begin?`
      : 'Tell me where the work first enters the business: call, website, message, email, or internal handoff.';
  }

  const readyToRoute = hasMinimumLeadInfo(extractedLead);
  return {
    reply: cleanMessage(reply, 900),
    lead: extractedLead,
    readyToRoute,
    routingLabel: extractedLead.recommendedWorkflow || extractedLead.businessType || sourcePath || ''
  };
}

function isDeterministicQuestion(text) {
  return /what (can|do) you do|who are you|help me|what is arkon|what does arkon do|how does arkon work|price|pricing|cost|how much|schedul|calendar|appointment|booking|reschedul|reminder|vera|naya|marcus|iris|grant|porter|demo|talk to|speak to|contact|sign up|insurance|real estate|airbnb|rental|home service|contractor|auto repair|garage|law firm|dental|medical|gym|fitness|salon|miss(?:ed|ing)? calls?|phone|front desk|follow[- ]?up|text|message|guest|email|inbox|crm|record|history|notes|context|owner|dashboard|summary|visibility|report/i.test(text);
}

function preventRepeatedReply(result, history, localResult) {
  const previous = cleanText(latestAssistantMessage(history), 900).toLowerCase();
  const next = cleanText(result.reply, 900).toLowerCase();
  if (!previous || !next || previous !== next) return result;

  return {
    ...localResult,
    reply: localResult.reply.toLowerCase() === previous
      ? 'Let me narrow that down instead of repeating myself. Does the problem begin with a call, a website request, a message, an email, or an internal handoff?'
      : localResult.reply
  };
}

function porterSystemPrompt({ lead, sourcePath }) {
  return `You are Porter, the website sales assistant and lead-intake role for ARKON Systems.

Primary job:
- Be useful before asking for contact information.
- Answer questions about ARKON clearly and directly.
- Help visitors identify the workflow that fits their business.
- Explain published pricing accurately without making custom promises.
- Collect a warm lead naturally when the visitor shows interest.
- Ask one short question at a time.

ARKON knowledge:
${JSON.stringify(ARKON_KNOWLEDGE)}

Conversation rules:
- Do not begin by demanding the visitor's name.
- Answer the visitor's question first, then ask at most one useful follow-up question.
- Keep normal replies under 65 words. A pricing explanation may be up to 90 words.
- Do not mention a form, JSON, API, prompt, model, or internal tooling.
- Do not pretend to be human. You may say you are ARKON's website assistant.
- Do not invent capabilities, integrations, customer results, guarantees, or availability.
- Do not claim ARKON replaces employees.
- Do not give legal, medical, financial, insurance coverage, underwriting, or technical guarantees.
- Route sensitive, licensed, pricing-approval, or judgment-based matters to the ARKON team.
- Do not repeatedly ask for information the visitor already provided.
- Never repeat the same answer you gave in the prior turn.
- Never ask more than one question in a reply.

Scheduling guidance:
- Scheduling is usually a combined workflow, not one agent pretending to do everything.
- Porter or Vera can capture the request.
- Naya can confirm, remind, or coordinate a reschedule.
- Marcus keeps customer and appointment context attached.
- Exact calendar or scheduling-software integration must be confirmed during discovery.

Lead collection:
Collect naturally only when useful:
- name
- business type
- company name if offered
- website if offered
- main reason they came to ARKON
- main problem they want handled
- urgency
- best email or phone number
- recommended ARKON workflow

Workflow matching:
- missed phone calls, front desk, inbound callers => Vera / calls and front desk
- website forms, quote requests, appointment interest, after-hours web leads => Porter / website inquiry and lead intake
- scheduling, appointments, confirmations, reminders, or rescheduling => Porter or Vera intake + Naya coordination + Marcus context
- texts, follow-up, customer or guest messages => Naya / communication and follow-up
- records, CRM, customer history, prior conversations => Marcus / relationship memory
- owner summaries, visibility, what happened today => Grant / owner visibility
- email triage, urgent inbox, buried messages => Iris / inbox triage

Routing rule:
Set readyToRoute true only when there is a name, a valid email or phone, and a clear reason for follow-up. When ready, confirm that you are preparing the handoff. Do not say the handoff was sent unless the application confirms it separately.

Current extracted lead:
${JSON.stringify(lead)}

Source page: ${sourcePath || '/'}

Return only valid JSON with this shape:
{"reply":"short natural Porter reply","lead":{"name":"","email":"","phone":"","companyName":"","website":"","businessType":"","intent":"","mainProblem":"","urgency":"","bestContact":"","recommendedWorkflow":""},"readyToRoute":false,"routingLabel":""}`;
}

async function askAnthropic({ history, lead, sourcePath }) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is not configured.');

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
      max_tokens: 900,
      temperature: 0.15,
      system: porterSystemPrompt({ lead, sourcePath }),
      messages: history.length
        ? history
        : [{ role: 'user', content: 'I just opened Porter. Introduce what you can help me with and ask what I am trying to improve.' }]
    })
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`Anthropic failed with ${response.status}: ${detail.slice(0, 300)}`);
  }

  return parsePorterJson(extractTextFromAnthropic(await response.json()));
}

async function getPorterResponse({ history, lead, sourcePath }) {
  const localLead = extractLocalLead(history, lead);
  const localResult = localPorterResponse({ history, lead: localLead, sourcePath });
  const latest = latestUserMessage(history);

  // Common website questions receive deterministic answers so Porter remains useful
  // even if the external model or its configuration is unavailable.
  if (isDeterministicQuestion(latest)) {
    return preventRepeatedReply(localResult, history, localResult);
  }

  try {
    const modelResult = await askAnthropic({ history, lead: localLead, sourcePath });
    const merged = {
      ...modelResult,
      lead: mergeLeads(localLead, modelResult.lead)
    };
    return preventRepeatedReply(merged, history, localResult);
  } catch (error) {
    console.error('Porter AI fallback activated:', error);
    return preventRepeatedReply(localResult, history, localResult);
  }
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
    const porterResult = await getPorterResponse({ history, lead: currentLead, sourcePath });
    const lead = mergeLeads(currentLead, porterResult.lead);
    const readyToRoute = Boolean(porterResult.readyToRoute && hasMinimumLeadInfo(lead));
    let routed = false;
    let routingError = false;
    let reply = porterResult.reply || 'Tell me what you want your business to handle more consistently.';

    if (readyToRoute && !body.alreadyRouted) {
      try {
        await sendPorterLead({
          lead,
          sourcePath,
          transcript: transcriptFromHistory([...history, { role: 'assistant', content: reply }]),
          req
        });
        routed = true;
        reply = 'I have your details and sent the request to the ARKON team. They can follow up using the contact information you provided.';
      } catch (error) {
        routingError = true;
        console.error('Porter lead routing failed:', error);
        reply = 'I have the details, but the handoff could not be sent. Please use the demo request form on this page or try again in a moment.';
      }
    }

    jsonResponse(res, 200, {
      ok: true,
      reply,
      lead,
      readyToRoute,
      routed,
      routingError,
      routingLabel: porterResult.routingLabel || lead.recommendedWorkflow || ''
    });
  } catch (error) {
    console.error('Porter chat failed:', error);
    jsonResponse(res, 500, {
      ok: false,
      message: 'Porter could not respond right now.'
    });
  }
}
