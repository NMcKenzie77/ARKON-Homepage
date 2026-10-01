export const SITE_URL = 'https://www.arkonsysai.com';

export const homeSeo = {
  path: '/',
  title: 'Digital Team for Service Businesses | ARKON Systems',
  description: 'ARKON supplies a digital team that answers inquiries, follows up with prospective and past customers, keeps customer history organized, and prepares the next step for your staff.',
  schemaType: 'SoftwareApplication',
  schemaName: 'ARKON Systems',
  eyebrow: 'A digital team for service businesses',
  h1: 'Stop letting good customers and warm leads go cold.'
};

export const howItWorksSeo = {
  path: '/how-it-works',
  title: 'How ARKON Works | Digital Team for Service Businesses',
  description: 'See how ARKON handles calls, inquiries, messages, email, customer history, follow-up, handoffs, and owner alerts using your business rules.',
  schemaType: 'WebPage',
  schemaName: 'How ARKON Works',
  eyebrow: 'How ARKON handles a request',
  h1: 'One business. Different ways people reach out.'
};


export const industryPages = {
  '/demo': {
    path: '/demo',
    pageType: 'demo',
    name: 'See ARKON Work',
    schemaType: 'WebPage',
    seoTitle: 'See ARKON Work | Request a Workflow Demonstration',
    eyebrow: 'See ARKON work',
    title: 'See how ARKON handles a real customer workflow.',
    description: 'Choose one workflow from your business and see what the customer experiences, what ARKON handles, what your employee receives, and what the owner sees.',
    primary: 'The demonstration focuses on one practical workflow instead of giving you a generic software tour. ARKON maps the business rules, shows where a person remains involved, and walks through the full handoff.',
    cards: [
      ['Missed or after-hours call', 'See how ARKON answers in the business name, captures what the customer needs, and prepares the right handoff.'],
      ['New website inquiry', 'See how a new request is organized, qualified, and kept moving before the prospective customer loses interest.'],
      ['Lead follow-up', 'See how ARKON follows approved timing and messaging while keeping the prior conversation and next action attached.'],
      ['Customer message', 'See how routine questions are handled in the business voice and sensitive issues are routed instead of guessed at.'],
      ['Staff handoff', 'See the organized request, customer context, prior activity, and next action your employee receives.'],
      ['Owner escalation', 'See how handled work is separated from the decisions, risks, and exceptions that actually need the owner.']
    ],
    workflow: ['Choose one real workflow', 'Map the business rules and systems', 'Walk through the customer response and staff handoff', 'Decide whether the workflow is worth pursuing'],
    faq: [
      ['How long does the demonstration take?', 'The working session is designed to take approximately 20 minutes and stay focused on one workflow.'],
      ['Do I have to purchase anything?', 'No. The demonstration is a working session, not a commitment to purchase.'],
      ['Will the demonstration use my exact systems?', 'The session maps the systems and information involved. Specific integrations and implementation requirements are scoped after the workflow is understood.']
    ]
  },
  '/real-estate': {
    path: '/real-estate',
    name: 'Real Estate Digital Team',
    schemaType: 'Service',
    seoTitle: 'Real Estate Lead Follow-Up & Customer Response | ARKON',
    eyebrow: 'Real estate digital team',
    title: 'Keep real estate leads, showing requests, and follow-up moving.',
    description: 'ARKON gives real estate teams structured lead response, showing-request routing, seller and buyer follow-up, CRM context, and owner visibility.',
    primary: 'Real estate teams lose deals when leads wait, showing requests sit, seller calls are missed, or agent follow-up depends on someone remembering every detail. ARKON keeps calls, website inquiries, client messages, relationship history, and agent handoffs connected.',
    cards: [
      ['Lead response', 'ARKON captures website inquiries, answers approved questions, and prepares follow-up before a lead goes cold.'],
      ['Calls and showings', 'Vera handles inbound calls, captures what matters, and routes showing or seller requests to the right person.'],
      ['Agent context', 'Marcus keeps lead history, notes, pipeline stage, prior touchpoints, and follow-up context attached.'],
      ['Owner view', 'Grant surfaces what came in, what was handled, who owns the next step, and what needs attention.']
    ],
    workflow: ['Buyer lead asks a question', 'Seller calls about listing timing', 'Showing request comes in', 'Agent gets context before follow-up'],
    faq: [
      ['Can ARKON replace my agents?', 'No. ARKON handles repeatable work and prepares the handoff so agents can focus on conversations, showings, sellers, buyers, and decisions.'],
      ['Can it work with my CRM?', 'ARKON is designed around contact history, notes, pipeline stages, and follow-up records. Specific CRM integrations are handled during implementation.']
    ]
  },
  '/short-term-rentals': {
    path: '/short-term-rentals',
    name: 'Short-Term Rental Digital Team',
    schemaType: 'Service',
    seoTitle: 'Short-Term Rental Guest Messaging & Operations | ARKON',
    eyebrow: 'Short-term rental digital team',
    title: 'Keep guest, cleaner, and vendor communication moving.',
    description: 'ARKON organizes short-term rental guest messaging, cleaner coordination, vendor updates, urgent-issue routing, follow-up, and host visibility.',
    primary: 'Short-term rental operators deal with guest messages, cleaner coordination, vendor updates, urgent issues, check-in questions, and host visibility. ARKON keeps stay operations moving without every message landing on the host.',
    cards: [
      ['Guest messages', 'Naya responds in the host’s voice, answers approved questions, and routes sensitive or urgent issues.'],
      ['Direct-booking inquiries', 'ARKON captures website inquiries and prepares the handoff before a potential guest moves on.'],
      ['Inbox triage', 'Iris separates urgent issues, guest needs, vendor messages, and routine inbox activity.'],
      ['Host visibility', 'Grant shows what happened, what was handled, and what needs attention across the stay.']
    ],
    workflow: ['Guest asks a check-in question', 'Cleaner update comes in', 'Vendor issue needs attention', 'Host receives the owner summary'],
    faq: [
      ['Does ARKON handle emergencies?', 'ARKON can flag urgent issues and route them based on business rules. Emergency workflows should be defined before launch.'],
      ['Can it sound like the host?', 'Yes. ARKON is designed to follow the host’s tone, standards, boundaries, and escalation rules.']
    ]
  },
  '/contractors': {
    path: '/contractors',
    name: 'Contractor Digital Team',
    schemaType: 'Service',
    seoTitle: 'Contractor Call Response & Estimate Follow-Up | ARKON',
    eyebrow: 'Contractor digital team',
    title: 'Keep estimate requests and customer follow-up moving between jobs.',
    description: 'ARKON helps contractors organize inbound calls, project inquiries, estimate requests, customer updates, job context, follow-up, and owner visibility.',
    primary: 'Contractors often take calls while on site or between jobs. Estimate requests can sit, customers may need a progress update, and follow-up can get lost across calls, texts, and email. ARKON keeps the request and its context organized, prepares routine follow-up, and routes pricing or project decisions to your team.',
    cards: [
      ['Inbound calls', 'Vera captures who is calling, the type of project, location, timing, and the best next step, then routes requests that need a person.'],
      ['Estimate requests', 'ARKON organizes project details from website inquiries and prepares the handoff so the right person can review the request.'],
      ['Customer and job context', 'Marcus keeps contact history, project notes, prior conversations, and next steps together for the team.'],
      ['Follow-up and handoffs', 'Naya supports approved customer follow-up while Grant keeps open requests and items needing owner attention visible.']
    ],
    workflow: ['A homeowner calls while the crew is on site', 'A project inquiry arrives through the website', 'The estimator receives project details before calling back', 'The owner sees requests still waiting for a next step'],
    faq: [
      ['Does ARKON create project estimates?', 'No. ARKON can collect project details and prepare a handoff, while your team makes scope and pricing decisions.'],
      ['Can ARKON schedule site visits?', 'Scheduling depends on your availability rules and calendar setup. Requests needing confirmation can be routed to your team.']
    ]
  },
  '/auto-repair': {
    path: '/auto-repair',
    name: 'Auto Repair Shop Digital Team',
    schemaType: 'Service',
    seoTitle: 'Auto Repair Shop Automation to Recover Lost Work | ARKON',
    eyebrow: 'Auto repair shop communication automation',
    title: 'Auto repair shop automation that keeps lost service opportunities from going cold.',
    description: 'Auto repair automation for calls, estimate and declined-service follow-up, maintenance reminders, and vehicle history. Keep lost work in view. Request a demo.',
    heroDescription: 'Vera handles repair-call intake, captures the vehicle and concern, and can handle multiple calls at once within your configured capacity. Naya follows up on estimates, declined service, and maintenance using shop-approved timing and messages. Marcus keeps vehicle history attached, Iris organizes incoming email, and Grant surfaces what needs attention.',
    primary: 'Calls can interrupt the bay, estimates can go cold, declined work can be forgotten, and customers may call for status updates. ARKON automates approved, repeatable front-office communication for repair-call intake, estimate follow-up, declined service, maintenance reminders, vehicle history, and customer updates. Scheduling follows the shop’s configured calendar and availability rules; when a time cannot be confirmed, ARKON captures the customer’s preferred time and hands it to the shop. Pricing, diagnostics, repair advice, approvals, and urgent concerns go to staff.',
    cards: [
      ['Repair call intake', 'Vera captures the customer, vehicle, and concern. She can handle multiple calls at once within configured capacity and routes urgent or judgment-based requests to staff.'],
      ['Estimate and declined-service follow-up', 'ARKON captures online requests and prepares the next follow-up when a customer has not scheduled. Naya follows the shop’s approved timing and messaging for declined work.'],
      ['Maintenance reminders and vehicle history', 'Naya sends reminders using shop-approved timing and messaging. Marcus keeps prior repairs, estimates, recommendations, and follow-up context attached.'],
      ['Vehicle status updates and inbox triage', 'ARKON helps organize customer status updates and routes requests that need attention. Iris organizes incoming email and surfaces important shop inquiries.']
    ],
    workflow: ['Customer calls about a repair', 'Estimate request comes in', 'Vehicle status update is needed', 'Declined work is due for follow-up'],
    faq: [
      ['Does ARKON replace the service advisor?', 'No. ARKON handles approved, repeatable communication and follow-up so advisors can focus on customers, approvals, and repair decisions.'],
      ['Can ARKON work with my auto repair shop software?', 'Compatibility and data flows for an existing shop-management system are confirmed during implementation.'],
      ['Can ARKON follow up on declined repairs and estimates?', 'Naya can follow up using the shop’s approved timing and messages, with the customer, vehicle, recommendation, and estimate context available for that workflow.'],
      ['Can ARKON book service appointments?', 'Scheduling depends on the shop’s calendar and approved availability rules. When an appointment cannot be confirmed within those rules, ARKON captures the customer’s preferred time and hands it to the shop.'],
      ['Who handles pricing, diagnostics, or urgent questions?', 'ARKON follows the shop’s rules and routes pricing decisions, repair advice, approvals, and urgent concerns to the appropriate person.']
    ],
  }};

export const seoPages = {
  '/': homeSeo,
  '/how-it-works': howItWorksSeo,
  ...Object.fromEntries(
    Object.entries(industryPages).map(([path, page]) => [path, {
      path,
      title: page.seoTitle,
      description: page.description,
      schemaType: page.schemaType,
      schemaName: page.name,
      eyebrow: page.eyebrow,
      h1: page.title
    }])
  )
};

export const crawlablePaths = Object.keys(seoPages);
