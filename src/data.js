export const workflowSteps = [
  {
    marker: '01',
    time: 'Request received',
    eyebrow: 'Someone reaches out',
    title: 'The channel decides who responds first',
    detail: 'Calls, texts, emails, and website inquiries are handled by the role built for that channel.',
    meta: 'Phone: Vera • Website: Porter • Text: Naya • Email: Iris',
    agents: ['VERA', 'PORTER', 'NAYA', 'IRIS']
  },
  {
    marker: '02',
    time: 'Context attached',
    eyebrow: 'Who is this person?',
    title: 'Marcus checks the relationship history',
    detail: 'Contact record, prior conversations, notes, tags, pipeline stage, and follow-up history stay attached to the request.',
    meta: 'Relationship memory added before the next step',
    agents: ['MARCUS']
  },
  {
    marker: '03',
    time: 'Next step prepared',
    eyebrow: 'Can this move forward?',
    title: 'Routine work moves, judgment calls route',
    detail: 'ARKON handles what the business allows and routes anything needing approval, pricing, availability, or a real person.',
    meta: 'No forced automation on judgment calls',
    agents: ['NAYA', 'VERA', 'PORTER', 'IRIS']
  },
  {
    marker: '04',
    time: 'Owner informed',
    eyebrow: 'What matters now?',
    title: 'Grant surfaces what needs attention',
    detail: 'The owner sees what happened, what was handled, what needs action, and what can be ignored.',
    meta: 'Owner visibility without carrying every detail',
    agents: ['GRANT']
  }
];

export const agentRoster = ['NAYA', 'VERA', 'PORTER', 'IRIS', 'MARCUS', 'GRANT'];

export const roleViews = [
  {
    role: 'Owner',
    headline: 'What needs attention, what was handled, and what should be reviewed.',
    items: ['Overnight customer follow-up prepared', 'Sensitive messages routed instead of answered blindly', 'Morning brief shows who owns the next action'],
    badge: 'Owner brief'
  },
  {
    role: 'Agent',
    headline: 'Customers, leads, handoffs, and context they own.',
    items: ['Known customer follow-up ready', 'New lead captured in business voice', 'Conversation history attached before the callback'],
    badge: 'Producer view'
  },
  {
    role: 'Receptionist',
    headline: 'Calls, messages, routing, and warm handoffs.',
    items: ['Messages sorted by what they need', 'Known and new contacts separated', 'Customer replies match front-desk tone'],
    badge: 'Front desk view'
  },
  {
    role: 'Manager',
    headline: 'Schedules, handoffs, inbox triage, and coordination.',
    items: ['Follow-up timing collected', 'Team ownership visible', 'Escalations separated from normal messages'],
    badge: 'Manager view'
  },
  {
    role: 'Technician',
    headline: 'Jobs, appointments, customer notes, and completion details.',
    items: ['Customer context attached to the job', 'Appointment notes prepared', 'Customer update drafted in team voice'],
    badge: 'Field view'
  },
  {
    role: 'Admin',
    headline: 'Prepared details, invoices, documents, and review-ready work.',
    items: ['Document requests routed', 'Invoice questions flagged', 'Follow-up notes ready for review'],
    badge: 'Admin view'
  }
];

export const coverageLanes = [
  {
    lane: 'First response',
    copy: 'Calls and messages are received, acknowledged, and handled according to the business’s standards.',
    chips: ['VERA', 'NAYA', 'PORTER']
  },
  {
    lane: 'Relationship memory',
    copy: 'The system checks who the person is, what happened last, and what relationship context matters.',
    chips: ['MARCUS', 'IRIS']
  },
  {
    lane: 'Coordination',
    copy: 'Appointments, callbacks, reminders, and handoffs keep moving without living in someone’s head.',
    chips: ['CALEB', 'CHARLIE']
  },
  {
    lane: 'Preparation',
    copy: 'Estimates, proposals, contracts, invoices, and review-ready details are prepared for the right person.',
    chips: ['DRAKE', 'STELLA', 'RACHEL', 'CLARA']
  },
  {
    lane: 'Role-specific visibility',
    copy: 'The owner, manager, agent, receptionist, technician, and admin each see what matters for their day.',
    chips: ['GRANT', 'GRACE', 'ARNOLD', 'RILEY', 'MAX']
  }
];

export const solutions = [
  {
    name: 'Real Estate',
    title: 'Leads, showings, and agent handoffs.',
    details: 'For teams that need faster response and cleaner follow-up.',
    href: '/real-estate'
  },
  {
    name: 'Insurance',
    title: 'Quotes, renewals, and policyholder requests.',
    details: 'For agencies managing prospects, clients, producers, and admins.',
    href: '/insurance'
  },
  {
    name: 'Short-Term Rentals',
    title: 'Guests, cleaners, and urgent stay issues.',
    details: 'For operators who need guest and property details organized.',
    href: '/short-term-rentals'
  },
  {
    name: 'Home Services',
    title: 'Calls, estimates, and job updates.',
    details: 'For service businesses handling customers, schedules, and field work.',
    href: '/home-services'
  },
  {
    name: 'Professional Services',
    title: 'Intake, scheduling, and client follow-up.',
    details: 'For firms that need clean handoffs and client context attached.',
    href: '/professional-services'
  },
  {
    name: 'Salons',
    title: 'Bookings, client messages, and follow-up.',
    details: 'For salons that need missed calls, appointments, and client requests covered.',
    href: '/salons'
  },
  {
    name: 'Auto Repair Shops',
    title: 'Repair calls, declined work, and return visits.',
    details: 'For shops that need intake, vehicle context, status updates, and recommended-work follow-up.',
    href: '/garages'
  },
  {
    name: 'Medical & Dental',
    title: 'Appointments, intake, and patient questions.',
    details: 'For offices that need front-desk coverage and cleaner patient handoffs.',
    href: '/medical-dental-offices'
  },
  {
    name: 'Law Firms',
    title: 'Intake, consultations, and document requests.',
    details: 'For firms that need faster first response and organized client follow-up.',
    href: '/law-firms'
  },
  {
    name: 'Gyms & Fitness',
    title: 'Membership questions, bookings, and reminders.',
    details: 'For studios that need leads, scheduling, and member messages covered.',
    href: '/gyms-fitness-studios'
  }
];

export const dashboardRows = [
  { label: 'Website inquiry captured', owner: 'PORTER', status: 'Lead ready', priority: 'Live' },
  { label: 'Known contact found', owner: 'MARCUS', status: 'Context attached', priority: 'Done' },
  { label: 'Client message followed up', owner: 'NAYA', status: 'Reply prepared', priority: 'Done' },
  { label: 'Owner brief created', owner: 'GRANT', status: 'Ready', priority: 'Next' }
];