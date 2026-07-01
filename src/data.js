export const workflowSteps = [
  {
    time: '10:30 PM',
    eyebrow: 'Incoming call',
    title: 'Michael Rivera calls after hours',
    detail: 'ARKON recognizes the customer and keeps the conversation in the same voice your team would use.',
    meta: 'Last touchpoint: quote follow-up last Thursday'
  },
  {
    time: '10:31 PM',
    eyebrow: 'Customer remembered',
    title: 'The reply sounds like your business',
    detail: 'The response follows your tone, your standards, your rules, and the way your employees would handle the moment.',
    meta: 'Voice profile: warm, direct, professional'
  },
  {
    time: '10:34 PM',
    eyebrow: 'Handled or routed',
    title: 'The right next step is captured',
    detail: 'Questions are answered, urgent issues are escalated, and follow-up is scheduled without sounding like a generic script.',
    meta: 'No loose end left overnight'
  },
  {
    time: '7:45 AM',
    eyebrow: 'Morning brief',
    title: 'The team sees what happened',
    detail: 'The employee starts with the customer context, the response history, and what needs attention next.',
    meta: 'Priority: Review first'
  }
];

export const roleViews = [
  {
    role: 'Owner',
    headline: 'Decisions, escalations, voice, and visibility first.',
    items: ['Urgent customer issue from overnight', 'Response matched business standards', 'One proposal is ready for review'],
    badge: 'Owner brief'
  },
  {
    role: 'Agent',
    headline: 'Customers, leads, handoffs, and context they own.',
    items: ['3 warm follow-ups due today', 'New lead captured in agency voice', 'Quote conversation ready to continue'],
    badge: 'Producer view'
  },
  {
    role: 'Receptionist',
    headline: 'Calls, messages, routing, and warm handoffs.',
    items: ['5 calls logged with reason', '2 messages need routing', '1 customer reply used front-desk tone'],
    badge: 'Front desk view'
  },
  {
    role: 'Manager',
    headline: 'Schedules, handoffs, inbox triage, and coordination.',
    items: ['Crew schedule conflict flagged', 'Two appointments confirmed', 'One customer waiting on document'],
    badge: 'Manager view'
  },
  {
    role: 'Technician',
    headline: 'Jobs, appointments, customer notes, and completion details.',
    items: ['Morning job has customer history attached', 'Parts note added to appointment', 'Customer update drafted in team voice'],
    badge: 'Field view'
  },
  {
    role: 'Admin',
    headline: 'Prepared details, invoices, payouts, and review-ready work.',
    items: ['Invoice draft ready', 'Expense note needs review', 'Document package prepared'],
    badge: 'Admin view'
  }
];

export const coverageLanes = [
  {
    lane: 'First response',
    copy: 'Calls get answered. Messages get handled. New interest is captured in the voice and standards of the business.',
    chips: ['VERA', 'NAYA', 'PORTER']
  },
  {
    lane: 'Relationship memory',
    copy: 'The team knows who the customer is, what happened last, how they were treated, and what needs to happen next.',
    chips: ['MARCUS', 'IRIS']
  },
  {
    lane: 'Coordination',
    copy: 'Appointments, jobs, showings, reminders, and handoffs keep moving without living in someone’s head.',
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
    title: 'Calls, showings, leads, and follow-up stay connected.',
    details: 'ARKON prepares agents and owners with customer context, showing history, and follow-up that sounds like the brokerage.'
  },
  {
    name: 'Insurance',
    title: 'Customers and prospects feel remembered before they repeat themselves.',
    details: 'Producers, admins, and owners see conversations, documents, quotes, and replies that follow the agency’s tone and standards.'
  },
  {
    name: 'HostHalo / Naya',
    title: 'Guest, host, cleaner, and vendor communication stays coordinated.',
    details: 'Stay operations keep moving with guest context, cleaner confirmations, escalations, and communication that sounds like the host.'
  }
];

export const dashboardRows = [
  { label: 'Overnight customer call', owner: 'Nathan', status: 'Review first', priority: 'High' },
  { label: 'Reply matched business voice', owner: 'Front desk', status: 'Handled', priority: 'Done' },
  { label: 'Showing request captured', owner: 'Agent', status: 'Routed', priority: 'Now' },
  { label: 'Invoice packet drafted', owner: 'Admin', status: 'Ready', priority: 'Review' }
];
