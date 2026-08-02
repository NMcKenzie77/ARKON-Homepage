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

export const pricingPlans = [
  {
    name: 'Follow-Up Starter',
    fit: 'Smaller shops, mobile mechanics, price-sensitive general repair',
    pilot: '$799/mo',
    target: '$999-$1,250/mo after proof',
    setup: '$1,000 setup',
    summary: 'Start with customer follow-up, simple notes, missed-call capture, review requests, and an owner weekly brief.',
    includes: ['Naya follow-up', 'Marcus customer memory', 'Voice memo notes', 'Review requests']
  },
  {
    name: 'Follow-Up Plus',
    fit: 'Diagnostic and general shops with moderate volume',
    pilot: '$999/mo',
    target: '$1,500/mo after proof',
    setup: '$1,250 setup',
    summary: 'Adds more structure around inspection notes, diagnostic follow-up, and owner visibility without heavy integrations.',
    includes: ['Starter features', 'Structured notes', 'Diagnostic follow-up', 'Better owner dashboard']
  },
  {
    name: 'Shop Operator',
    fit: 'Busy independent shops, tire, brake, and alignment shops',
    pilot: '$1,250/mo',
    target: '$1,750/mo after proof',
    setup: '$1,500 setup',
    summary: 'For shops where calls, texts, declined work, tech notes, scheduling handoffs, reviews, and owner visibility all matter.',
    includes: ['Calls and texts workflow', 'Declined-work recovery', 'Tech voice notes', 'Scheduling handoffs']
  },
  {
    name: 'Shop Command',
    fit: 'Premium independent, European, import, performance, or serious owner-operated shops',
    pilot: '$1,750/mo',
    target: '$2,500/mo after proof',
    setup: '$2,500-$3,500 setup',
    summary: 'A fuller operating layer with Vera, Naya, Marcus, handoffs, reminders, reviews, owner briefs, and tech or advisor voice notes.',
    includes: ['Vera voice intake', 'Naya follow-up', 'Grant owner brief', 'Tech and advisor notes']
  },
  {
    name: 'Enterprise',
    fit: 'Multi-location, fleet-heavy, dealership, or larger service operations',
    pilot: 'Discovery first',
    target: '$5,000+/mo',
    setup: '$7,500+ setup',
    summary: 'Custom operating layer for locations that need deeper routing, management reporting, fleet or unit memory, and scoped integrations.',
    includes: ['Multi-location dashboards', 'Fleet or unit memory', 'Custom routing', 'Management reports'],
    enterprise: true
  }
];

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
  '/insurance': {
    path: '/insurance',
    name: 'Insurance Agency Digital Team',
    schemaType: 'Service',
    seoTitle: 'Insurance Agency Follow-Up & Customer Service | ARKON',
    eyebrow: 'Insurance agency digital team',
    title: 'Keep quote requests, policyholder questions, and producer follow-up organized.',
    description: 'ARKON organizes insurance quote requests, policyholder questions, renewal follow-up, documents, producer handoffs, CRM updates, and agency visibility.',
    primary: 'Insurance agencies lose time when quote requests, renewal questions, document requests, and producer follow-up scatter across calls, email, texts, and the CRM. ARKON keeps the front office, producers, admins, and owner view connected.',
    cards: [
      ['Quote requests', 'ARKON captures website leads and prepares approved follow-up before prospects go cold.'],
      ['Inbound calls', 'Vera answers, qualifies, captures details, and routes policy or quote questions to the right person.'],
      ['CRM memory', 'Marcus keeps contact records, relationship notes, pipeline stage, tags, and follow-up reminders attached.'],
      ['Inbox triage', 'Iris scores urgency and importance so policyholder, carrier, and prospect emails do not get buried.']
    ],
    workflow: ['Prospect asks for a quote', 'Policyholder sends a document request', 'Renewal question comes in', 'Producer gets context before the callback'],
    faq: [
      ['Does ARKON give insurance advice?', 'No. ARKON follows the agency’s rules and routes licensed or judgment-based questions to the right person.'],
      ['Can it help producers follow up?', 'Yes. ARKON can prepare follow-up, attach context, update records, and keep the owner informed.']
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
  '/home-services': {
    path: '/home-services',
    name: 'Home Services Digital Team',
    schemaType: 'Service',
    seoTitle: 'Home Service Call Response & Customer Follow-Up | ARKON',
    eyebrow: 'Home services digital team',
    title: 'Turn missed calls and estimate requests into organized next steps.',
    description: 'ARKON helps home service businesses manage inbound calls, estimate requests, scheduling, technician context, customer updates, and owner visibility.',
    primary: 'Home service businesses lose money when calls are missed, estimate requests wait, technicians lack context, invoices create confusion, or customers need updates. ARKON keeps front-desk work, field updates, customer communication, and the owner view connected.',
    cards: [
      ['Inbound calls', 'Vera answers calls, qualifies customers, captures job details, and routes urgent or judgment-based requests.'],
      ['Estimate requests', 'ARKON captures website requests and prepares follow-up when a customer does not convert.'],
      ['Job context', 'Marcus keeps customer history, notes, prior work, and appointment details attached.'],
      ['Owner visibility', 'Grant shows open issues, handled requests, escalations, and next actions.']
    ],
    workflow: ['Customer calls for service', 'Website estimate request comes in', 'Technician needs notes', 'Owner sees what needs attention'],
    faq: [
      ['Can ARKON schedule jobs?', 'ARKON can support scheduling when rules, availability, and calendar workflows are defined.'],
      ['What if a customer needs a price decision?', 'ARKON routes pricing, approval, and judgment calls to a person instead of guessing.']
    ]
  },
  '/salons': {
    path: '/salons',
    name: 'Salon Digital Team',
    schemaType: 'Service',
    seoTitle: 'Salon Booking Response & Client Follow-Up | ARKON',
    eyebrow: 'Salon digital team',
    title: 'Protect bookings when the salon is too busy to answer.',
    description: 'ARKON helps salons manage missed calls, online booking requests, client messages, appointment follow-up, staff handoffs, and owner visibility.',
    primary: 'Salons miss revenue when calls go unanswered, booking requests sit, client messages pile up, or appointment follow-up depends on the busiest person in the room. ARKON keeps booking communication, client context, staff handoffs, and the owner view connected.',
    cards: [
      ['Missed call coverage', 'Vera captures what the client needs and routes requests that require a stylist or manager.'],
      ['Booking requests', 'ARKON captures website interest and prepares follow-up before the client books somewhere else.'],
      ['Client memory', 'Marcus keeps service history, preferences, notes, and prior conversations attached.'],
      ['Owner visibility', 'Grant shows missed opportunities, open requests, follow-up, and staff handoffs.']
    ],
    workflow: ['Client calls while staff are busy', 'Booking request arrives online', 'Appointment question needs follow-up', 'Owner sees what still needs attention'],
    faq: [
      ['Can ARKON book appointments?', 'ARKON can support booking when services, staff availability, timing rules, and calendar workflows are defined.'],
      ['Will messages sound generic?', 'No. ARKON is designed to use the salon’s greetings, tone, standards, and escalation rules.']
    ]
  },
  '/garages': {
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
    pricing: pricingPlans
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
