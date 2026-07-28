export const SITE_URL = 'https://www.arkonsysai.com';

export const homeSeo = {
  path: '/',
  title: 'AI Workflow Automation for Service Businesses | ARKON Systems',
  description: 'ARKON Systems handles repeatable calls, messages, follow-up, scheduling, records, and handoffs so service-business teams can stay focused.',
  schemaType: 'SoftwareApplication',
  schemaName: 'ARKON Systems',
  eyebrow: 'ARKON Systems',
  h1: 'Let your existing team focus on the work only they can do.'
};

export const howItWorksSeo = {
  path: '/how-it-works',
  title: 'How ARKON Works | AI Workflow Automation for Service Businesses',
  description: 'See how ARKON routes calls, website inquiries, messages, email, records, follow-up, and owner alerts using the business’s rules.',
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
  '/real-estate': {
    path: '/real-estate',
    name: 'Real Estate Workflow Automation',
    schemaType: 'Service',
    seoTitle: 'Real Estate Lead Follow-Up & Workflow Automation | ARKON',
    eyebrow: 'Real estate workflow automation',
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
    name: 'Insurance Agency Workflow Automation',
    schemaType: 'Service',
    seoTitle: 'Insurance Agency Workflow Automation & Follow-Up | ARKON',
    eyebrow: 'Insurance agency workflow automation',
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
    name: 'Short-Term Rental Workflow Automation',
    schemaType: 'Service',
    seoTitle: 'Short-Term Rental Guest Messaging Automation | ARKON',
    eyebrow: 'Short-term rental workflow automation',
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
    name: 'Home Service Workflow Automation',
    schemaType: 'Service',
    seoTitle: 'Home Service Call & Scheduling Automation | ARKON',
    eyebrow: 'Home services workflow automation',
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
  '/professional-services': {
    path: '/professional-services',
    name: 'Professional Services Workflow Automation',
    schemaType: 'Service',
    seoTitle: 'Professional Services Client Intake Automation | ARKON',
    eyebrow: 'Professional services workflow automation',
    title: 'Keep client intake, documents, scheduling, and follow-up connected.',
    description: 'ARKON organizes client intake, scheduling, document requests, approved communication, relationship history, staff handoffs, and owner visibility.',
    primary: 'Professional service firms need clean intake, reliable scheduling, client follow-up, document requests, and owner visibility. ARKON keeps client context attached so work does not depend on memory or scattered messages.',
    cards: [
      ['Client intake', 'Vera captures call details while ARKON organizes website inquiries and the next handoff.'],
      ['Client communication', 'Naya responds with the firm’s approved tone, standards, and boundaries.'],
      ['Relationship memory', 'Marcus keeps notes, prior conversations, relationship history, and follow-up context attached.'],
      ['Owner visibility', 'Grant shows what came in, what was handled, who owns the next step, and what needs review.']
    ],
    workflow: ['New client inquiry arrives', 'Document request comes in', 'Follow-up needs to be sent', 'Owner sees what requires attention'],
    faq: [
      ['Can ARKON handle confidential matters?', 'Sensitive workflows should be defined carefully. ARKON can route anything requiring judgment, approval, or privacy review.'],
      ['Does it replace staff?', 'No. ARKON handles repeatable intake and follow-up work so staff can focus on client service and decisions.']
    ]
  },
  '/salons': {
    path: '/salons',
    name: 'Salon Booking Workflow Automation',
    schemaType: 'Service',
    seoTitle: 'Salon Booking & Client Follow-Up Automation | ARKON',
    eyebrow: 'Salon workflow automation',
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
    name: 'Auto Repair Shop Workflow Automation',
    schemaType: 'Service',
    seoTitle: 'Auto Repair Shop Call & Follow-Up Automation | ARKON',
    eyebrow: 'Auto repair shop workflow automation',
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
  },
  '/medical-dental-offices': {
    path: '/medical-dental-offices',
    name: 'Medical and Dental Front Desk Automation',
    schemaType: 'Service',
    seoTitle: 'Medical & Dental Front Desk Workflow Automation | ARKON',
    eyebrow: 'Medical and dental office workflow automation',
    title: 'Reduce front-desk pressure without hiding clinical judgment calls.',
    description: 'ARKON supports medical and dental front desks with call intake, appointment requests, cancellations, no-show follow-up, reminders, handoffs, and office visibility.',
    primary: 'Medical and dental offices face front-desk pressure from calls, appointment requests, cancellations, no-shows, routine reminders, patient questions, and staff handoffs. ARKON supports repeatable scheduling communication while routing clinical, sensitive, or judgment-based matters to the right person.',
    cards: [
      ['Front desk calls', 'Vera captures the reason for the call and routes urgent, clinical, or sensitive questions.'],
      ['Appointment requests', 'ARKON captures website interest and supports approved scheduling follow-up.'],
      ['Reminder workflows', 'Naya prepares routine reminders, confirmations, and no-show follow-up based on office rules.'],
      ['Office visibility', 'Grant shows open requests, missed follow-up, escalations, and next actions.']
    ],
    workflow: ['Patient requests an appointment', 'Cancellation creates an opening', 'Routine reminder needs to go out', 'Office sees what requires attention'],
    faq: [
      ['Does ARKON answer clinical questions?', 'No. Clinical, diagnostic, sensitive, or judgment-based questions should be routed to qualified staff.'],
      ['Can it help with cancellations and no-shows?', 'Yes. ARKON can support approved reminders, confirmations, cancellation follow-up, and waitlist workflows when the rules are defined.']
    ]
  },
  '/law-firms': {
    path: '/law-firms',
    name: 'Law Firm Intake Workflow Automation',
    schemaType: 'Service',
    seoTitle: 'Law Firm Intake & Client Follow-Up Automation | ARKON',
    eyebrow: 'Law firm workflow automation',
    title: 'Keep intake, documents, schedules, and client follow-up organized.',
    description: 'ARKON supports law firms with approved intake, attorney scheduling handoffs, email triage, document requests, client follow-up, daily briefs, and owner visibility.',
    primary: 'Law firms need support around intake, attorney schedules, email triage, client follow-up, document requests, daily briefs, and handoffs. ARKON keeps communication and next steps organized while routing legal advice, sensitive matters, and judgment calls to the right person.',
    cards: [
      ['Intake support', 'Vera captures approved call details while ARKON organizes website inquiries without evaluating the legal matter.'],
      ['Email triage', 'Iris separates urgent client, court, opposing counsel, and routine messages.'],
      ['Document requests', 'Naya follows approved checklists and timing for missing documents and client updates.'],
      ['Attorney context', 'Marcus keeps contact history, notes, matter context, and follow-up attached before the handoff.']
    ],
    workflow: ['New inquiry reaches the firm', 'Client document is missing', 'Attorney schedule needs a handoff', 'Owner receives the daily attention brief'],
    faq: [
      ['Does ARKON provide legal advice?', 'No. ARKON handles approved administrative workflows and routes legal questions or judgment calls to qualified staff.'],
      ['Can it support paralegals?', 'Yes. ARKON can help organize intake, schedules, email triage, document follow-up, client communication, and daily briefs.']
    ]
  },
  '/gyms-fitness-studios': {
    path: '/gyms-fitness-studios',
    name: 'Gym Lead and Member Follow-Up Automation',
    schemaType: 'Service',
    seoTitle: 'Gym Lead Follow-Up & Member Retention Automation | ARKON',
    eyebrow: 'Gym and fitness studio workflow automation',
    title: 'Protect trial leads, tours, training revenue, and member follow-up.',
    description: 'ARKON helps gyms and fitness studios manage trial leads, tour bookings, personal-training follow-up, member messages, cancellation handoffs, and owner visibility.',
    primary: 'Gyms and fitness studios lose revenue when trial leads are not followed up, tours do not get booked, personal training interest goes cold, cancellation questions sit, or members stop showing up without anyone noticing. ARKON keeps calls, website inquiries, member messages, booking support, relationship history, and owner visibility connected.',
    reality: {
      eyebrow: 'The studio reality',
      title: 'Members do not disappear all at once.',
      body: [
        'Trial leads go cold when no one follows up. Tours get missed when the front desk is busy. Personal training interest fades when no one owns the next step. Members stop showing up before they officially cancel.',
        'Retention is not one message. It is the follow-up, context, reminders, handoffs, and visibility that keep the studio from leaking revenue quietly.'
      ],
      callout: 'The owner stays in control. ARKON supports the work around membership, retention, and follow-up.'
    },
    cards: [
      ['Keep trial leads warm', 'ARKON captures the inquiry and keeps the tour handoff moving when the front desk is busy.'],
      ['Protect training revenue', 'Personal training interest needs a clear next step before the member moves on. Marcus keeps follow-up context attached.'],
      ['Route front desk pressure', 'Class, billing, and cancellation questions create bottlenecks. Vera captures what matters and routes the next step.'],
      ['Brief the owner', 'Leads, bookings, and cancellations scatter across staff. Grant shows what is slipping and who owns it.']
    ],
    workflow: ['Trial lead asks about joining', 'Tour or class question comes in', 'Training interest needs follow-up', 'Owner sees what is slipping'],
    faq: [
      ['Can ARKON replace my front desk?', 'No. ARKON handles repeatable work and prepares the handoff so staff can focus on members, tours, classes, training, and decisions.'],
      ['Can it help with retention and follow-up?', 'Yes. ARKON can prepare reminders, follow-up messages, booking support, member context, and staff handoffs when the workflow rules are defined.']
    ]
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
