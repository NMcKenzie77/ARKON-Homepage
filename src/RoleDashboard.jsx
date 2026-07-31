import { useState } from 'react';
import './role-dashboard.css';

const roleDashboards = [
  {
    role: 'Owner',
    title: 'What needs attention, what was handled, and where the business is exposed.',
    description: 'The owner sees decisions and exceptions without carrying every message, callback, or handoff.',
    metrics: [
      ['3', 'Open decisions'],
      ['16', 'Handled without owner'],
      ['2', 'Escalations']
    ],
    rows: [
      ['Renewal quote needs approval', 'Insurance team', 'Decision needed', 'Now'],
      ['Guest issue routed to vendor', 'Naya', 'Handled', 'Done'],
      ['Missed-call follow-up prepared', 'Vera → Naya', 'Ready', 'Today'],
      ['Two jobs waiting on pricing', 'Manager', 'Assigned', 'Review']
    ]
  },
  {
    role: 'Manager',
    title: 'Team ownership, schedule pressure, handoffs, and exceptions.',
    description: 'Managers see where work is waiting, who owns it, and what could affect service or revenue.',
    metrics: [
      ['6', 'Open handoffs'],
      ['2', 'Schedule risks'],
      ['14', 'Completed today']
    ],
    rows: [
      ['Estimate callback has no owner', 'Unassigned', 'Needs assignment', 'Now'],
      ['Tomorrow morning is overbooked', 'Scheduling', 'Conflict found', 'Review'],
      ['Customer update approved', 'Naya', 'Ready to send', 'Today'],
      ['Technician notes attached', 'Marcus', 'Complete', 'Done']
    ]
  },
  {
    role: 'Agent',
    title: 'The leads, customers, context, and follow-up that belong to them.',
    description: 'Agents start with the relationship history and next action instead of rebuilding the story from scattered messages.',
    metrics: [
      ['5', 'Active follow-ups'],
      ['2', 'New opportunities'],
      ['1', 'Callback overdue']
    ],
    rows: [
      ['Buyer asked about showing times', 'Assigned agent', 'Context attached', 'Today'],
      ['Past client replied to follow-up', 'Naya', 'Reply received', 'Now'],
      ['New website inquiry qualified', 'ARKON intake', 'Lead ready', 'New'],
      ['Seller callback prepared', 'Marcus', 'History attached', 'Today']
    ]
  },
  {
    role: 'Receptionist',
    title: 'Calls, messages, routing, and warm handoffs in one queue.',
    description: 'The front desk sees what the person needs, whether they are known, and where the request should go next.',
    metrics: [
      ['8', 'Calls captured'],
      ['4', 'Warm handoffs'],
      ['1', 'Urgent message']
    ],
    rows: [
      ['Existing customer requested status', 'Service team', 'Routed', 'Now'],
      ['New caller asked for an estimate', 'Vera', 'Details captured', 'New'],
      ['Vendor needs a manager response', 'Manager', 'Escalated', 'Now'],
      ['Appointment confirmation received', 'Naya', 'Record updated', 'Done']
    ]
  },
  {
    role: 'Technician',
    title: 'Jobs, customer context, appointment notes, and completion details.',
    description: 'Technicians see the information needed to perform the work without carrying the front-desk queue.',
    metrics: [
      ['4', 'Jobs today'],
      ['3', 'Notes complete'],
      ['1', 'Customer update due']
    ],
    rows: [
      ['Vehicle concern and prior repair history', 'Marcus', 'Attached', 'Next job'],
      ['Customer approved diagnostic time', 'Front desk', 'Confirmed', 'Today'],
      ['Completion notes need review', 'Technician', 'Drafted', 'Before close'],
      ['Status update prepared for customer', 'Naya', 'Ready', 'Today']
    ]
  },
  {
    role: 'Admin',
    title: 'Documents, invoices, prepared details, and review-ready work.',
    description: 'Admins see the records and exceptions that require cleanup, confirmation, or approval.',
    metrics: [
      ['7', 'Documents ready'],
      ['2', 'Missing items'],
      ['3', 'Invoices to review']
    ],
    rows: [
      ['Signed form attached to contact', 'Marcus', 'Filed', 'Done'],
      ['Invoice question needs clarification', 'Admin', 'Needs review', 'Today'],
      ['Customer document request prepared', 'Naya', 'Ready to send', 'Today'],
      ['Two records missing required fields', 'Admin', 'Incomplete', 'Review']
    ]
  }
];

export default function RoleDashboard() {
  const [activeRole, setActiveRole] = useState('Owner');
  const selected = roleDashboards.find(view => view.role === activeRole) || roleDashboards[0];

  return (
    <section className="section role-dashboard-section" id="roles" aria-labelledby="role-dashboard-title">
      <div className="role-dashboard-heading" data-reveal>
        <p className="eyebrow">Role-based visibility</p>
        <h2 id="role-dashboard-title">Each person sees the work they are responsible for.</h2>
        <p>
          The owner does not need the receptionist’s queue. The technician does not need the sales
          pipeline. ARKON gives each role the context, next actions, and exceptions that belong to them.
        </p>
      </div>

      <div className="role-dashboard-tabs" role="tablist" aria-label="Example dashboard role selector" data-reveal>
        {roleDashboards.map(view => (
          <button
            type="button"
            role="tab"
            aria-selected={activeRole === view.role}
            className={activeRole === view.role ? 'active' : ''}
            key={view.role}
            onClick={() => setActiveRole(view.role)}
          >
            {view.role}
          </button>
        ))}
      </div>

      <div className="role-dashboard-layout" data-reveal>
        <div className="role-dashboard-copy">
          <span>{selected.role} view</span>
          <h3>{selected.title}</h3>
          <p>{selected.description}</p>
          <div className="role-dashboard-note">
            <strong>Example dashboard</strong>
            <small>Illustrative sample data, not customer performance claims.</small>
          </div>
        </div>

        <div className="role-dashboard-frame" aria-live="polite">
          <div className="role-dashboard-frame-header">
            <div>
              <span>ARKON · {selected.role}</span>
              <h3>Today’s work view</h3>
            </div>
            <strong>Sample data</strong>
          </div>

          <div className="role-dashboard-metrics">
            {selected.metrics.map(([value, label]) => (
              <div key={label}>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>

          <div className="role-dashboard-table" role="table" aria-label={`${selected.role} example work queue`}>
            <div className="role-dashboard-table-head" role="row">
              <span role="columnheader">Work item</span>
              <span role="columnheader">Assigned</span>
              <span role="columnheader">Status</span>
              <span role="columnheader">Timing</span>
            </div>
            {selected.rows.map(([item, assigned, status, timing]) => (
              <div className="role-dashboard-row" role="row" key={item}>
                <strong role="cell">{item}</strong>
                <span role="cell">{assigned}</span>
                <em role="cell">{status}</em>
                <small role="cell">{timing}</small>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
