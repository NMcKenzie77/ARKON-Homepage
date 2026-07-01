export const workflowSteps = [
  {
    time: '10:30 PM',
    eyebrow: 'Incoming call',
    title: 'Michael Rivera calls after hours',
    detail: 'Recognized by phone number before the team starts over tomorrow.',
    meta: 'Last touchpoint: quote follow-up last Thursday'
  },
  {
    time: '10:31 PM',
    eyebrow: 'Customer remembered',
    title: 'The business knows the context',
    detail: 'The call is connected to the last conversation, open follow-up, and customer record.',
    meta: 'Warm context ready'
  },
  {
    time: '10:34 PM',
    eyebrow: 'Handled or routed',
    title: 'The right next step is captured',
    detail: 'Basic questions are answered, urgent issues can be escalated, and follow-up is scheduled.',
    meta: 'No loose end left overnight'
  },
  {
    time: '7:45 AM',
    eyebrow: 'Morning brief',
    title: 'The owner sees what needs attention',
    detail: 'The team starts the day with a role-specific view instead of a pile of unknowns.',
    meta: 'Priority: Review first'
  }
];

export const roleViews = [
  {
    role: 'Owner',
    headline: 'Decisions, escalations, and visibility first.',
    items: ['Urgent customer issue from overnight', 'Two follow-ups need owner approval', 'One proposal is ready for review'],
    badge: 'Owner brief'
  },
  {
    role: 'Agent',
    headline: 'Customers, leads, handoffs, and context they own.',
    items: ['3 warm follow-ups due today', 'New lead captured after hours', 'Quote conversation ready to continue'],
    badge: 'Producer view'
  },
  {
    role: 'Receptionist',
    headline: 'Calls, messages, routing, and warm handoffs.',
    items: ['5 calls logged with reason', '2 messages need routing', '1 urgent handoff prepared'],
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
    items: ['Morning job has customer history attached', 'Parts note added to appointment', 'Completion checklist prepared'],
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
    copy: 'Calls get answered. Messages get handled. New interest is captured before the day buries it.',
    chips: ['VERA', 'NAYA', 'PORTER']
  },
  {
    lane: 'Relationship memory',
    copy: 'The team knows who the customer is, what happened last, and what needs to happen next.',
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
    details: 'ARKON prepares agents and owners with the context behind every buyer, seller, lead, showing, and next action.'
  },
  {
    name: 'Insurance',
    title: 'Customers and prospects feel remembered before they repeat themselves.',
    details: 'Producers, admins, and owners see the conversations, documents, quotes, and follow-ups that need attention.'
  },
  {
    name: 'HostHalo / Naya',
    title: 'Guest, host, cleaner, and vendor communication stays coordinated.',
    details: 'Stay operations keep moving with cleaner confirmations, guest context, escalations, and owner visibility.'
  }
];

export const dashboardRows = [
  { label: 'Overnight customer call', owner: 'Nathan', status: 'Review first', priority: 'High' },
  { label: 'Quote follow-up ready', owner: 'Producer', status: 'Prepared', priority: 'Today' },
  { label: 'Showing request captured', owner: 'Agent', status: 'Routed', priority: 'Now' },
  { label: 'Invoice packet drafted', owner: 'Admin', status: 'Ready', priority: 'Review' }
];
