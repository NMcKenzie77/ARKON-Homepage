export const workflowSteps = [
  {
    marker: '01',
    time: 'Message received',
    eyebrow: 'A customer reaches out',
    title: 'Message received',
    detail: '“Hi, I reached out last week. Can someone follow up with me tomorrow?”',
    meta: 'Works for calls, texts, email, website forms, or app messages',
    agents: ['VERA']
  },
  {
    marker: '02',
    time: 'Sender checked',
    eyebrow: 'Known or new?',
    title: 'Known contact found',
    detail: 'ARKON checks the phone number, email, name, and relationship history before anyone starts from zero.',
    meta: 'Last touchpoint attached: reached out last week',
    agents: ['VERA', 'MARCUS']
  },
  {
    marker: '03',
    time: 'Need understood',
    eyebrow: 'What are they asking for?',
    title: 'Follow-up request detected',
    detail: 'ARKON identifies what they need, how urgent it is, and whether it can safely respond or should route to a person.',
    meta: 'Normal urgency • no sensitive issue detected',
    agents: ['IRIS', 'CLARA']
  },
  {
    marker: '04',
    time: 'Voice selected',
    eyebrow: 'How should we sound?',
    title: 'Business voice selected',
    detail: 'The reply follows the business’s tone, standards, boundaries, and employee style — not a generic bot script.',
    meta: 'Warm • direct • professional',
    agents: ['NAYA']
  },
  {
    marker: '05',
    time: 'Response path',
    eyebrow: 'Reply, schedule, or route?',
    title: 'Response prepared',
    detail: 'ARKON answers what it can, asks for the right callback timing, or routes the message to the person who owns it.',
    meta: 'Suggested reply: “Is morning or afternoon better?”',
    agents: ['NAYA', 'CALEB']
  },
  {
    marker: '06',
    time: 'Handoff created',
    eyebrow: 'Who needs to know?',
    title: 'The right person is briefed',
    detail: 'The employee sees who reached out, what happened last, what was said, and what needs attention next.',
    meta: 'Brief ready for the responsible person',
    agents: ['GRANT', 'MARCUS']
  }
];

export const agentRoster = ['VERA', 'MARCUS', 'IRIS', 'CLARA', 'NAYA', 'CALEB', 'GRANT'];

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
  { label: 'Universal message walkthrough', owner: 'ARKON', status: 'Handled', priority: 'Live' },
  { label: 'Known contact found', owner: 'MARCUS', status: 'Context attached', priority: 'Done' },
  { label: 'Business voice selected', owner: 'NAYA', status: 'Reply prepared', priority: 'Done' },
  { label: 'Handoff brief created', owner: 'GRANT', status: 'Ready', priority: 'Next' }
];
