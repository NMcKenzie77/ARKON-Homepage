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
    title: 'Leads, showings, seller calls, buyer questions, and agent handoffs.',
    details: 'See how ARKON keeps property conversations, follow-up, and agent context from slipping.',
    href: '#demo'
  },
  {
    name: 'Insurance',
    title: 'Quotes, renewals, documents, client questions, and producer follow-up.',
    details: 'See how ARKON keeps prospects, policyholders, producers, and admins coordinated.',
    href: '#demo'
  },
  {
    name: 'Short-Term Rentals',
    title: 'Guests, cleaners, vendors, urgent issues, and host visibility.',
    details: 'See how ARKON keeps stay operations moving without every message hitting the host.',
    href: '#demo'
  },
  {
    name: 'Home Services',
    title: 'Calls, estimates, repairs, technicians, invoices, and customer updates.',
    details: 'See how ARKON helps service businesses answer, schedule, update, and brief the team.',
    href: '#demo'
  },
  {
    name: 'Professional Services',
    title: 'Intake, scheduling, documents, client follow-up, and owner visibility.',
    details: 'See how ARKON protects the first response and keeps client context attached.',
    href: '#demo'
  }
];

export const dashboardRows = [
  { label: 'Website inquiry captured', owner: 'PORTER', status: 'Lead ready', priority: 'Live' },
  { label: 'Known contact found', owner: 'MARCUS', status: 'Context attached', priority: 'Done' },
  { label: 'Client message followed up', owner: 'NAYA', status: 'Reply prepared', priority: 'Done' },
  { label: 'Owner brief created', owner: 'GRANT', status: 'Ready', priority: 'Next' }
];
