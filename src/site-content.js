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
    path: '/garages',
    name: 'Auto Repair Shop Digital Team',
    schemaType: 'Service',
    seoTitle: 'Auto Repair Call Response & Customer Follow-Up | ARKON',
    eyebrow: 'Auto repair digital team',
    title: 'Stop losing repair work to missed calls and weak follow-up.',
    description: 'ARKON helps auto repair shops manage repair calls, estimate requests, vehicle context, status updates, declined-work follow-up, return visits, and owner visibility.',
    primary: 'Auto repair shops lose time when repair calls interrupt the bay, estimate requests wait, declined work is never followed up, or customers call repeatedly for status updates. ARKON supports front-desk intake, vehicle context, scheduling, declined-work follow-up, status updates, and owner visibility.',
    cards: [
      ['Repair calls', 'Vera answers, captures the vehicle and concern, and routes urgent or judgment-based requests.'],
      ['Estimate requests', 'ARKON captures online requests and prepares follow-up when a customer does not schedule.'],
      ['Vehicle context', 'Marcus keeps customer, vehicle, prior repair, estimate, and follow-up history attached.'],
      ['Declined work follow-up', 'Naya follows approved timing and messaging so recommended work does not disappear after the first visit.']
    ],
    workflow: ['Customer calls about a repair', 'Estimate request comes in', 'Vehicle status update is needed', 'Declined work is due for follow-up'],
    faq: [
      ['Does ARKON replace the service advisor?', 'No. ARKON handles repeatable communication, context, and follow-up so advisors can focus on customers, approvals, and repair decisions.'],
      ['Can it work with my shop software?', 'Specific shop-management integrations are scoped during implementation. ARKON can start with defined communication and follow-up workflows before deeper integration.']
    ],
  }
};

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
