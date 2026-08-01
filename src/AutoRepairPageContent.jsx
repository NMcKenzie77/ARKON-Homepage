import VerticalClosingCta from './VerticalClosingCta.jsx';
import './auto-repair-page.css';
import './real-estate-dashboard-preview.css';

const teamCards = [
  {
    number: '01',
    title: 'Naya brings deferred work back into the shop.',
    copy: 'Naya follows up using the customer’s name, vehicle, actual recommendation, prior estimate, timing, and contact preference so the message feels connected to the service conversation that already happened.'
  },
  {
    number: '02',
    title: 'Naya keeps upcoming maintenance from being missed.',
    copy: 'When service is coming due, Naya reaches out with the right vehicle and maintenance context, offers approved openings, and keeps the visit moving toward the schedule.'
  },
  {
    number: '03',
    title: 'Vera answers new repair calls live.',
    copy: 'Vera captures the customer, vehicle, concern, drivability, timing, and contact preference so the advisor receives a useful intake instead of a vague callback note.'
  },
  {
    number: '04',
    title: 'Marcus and Grant keep the history and priorities visible.',
    copy: 'Marcus keeps the customer, vehicle, recommendations, estimates, and conversations attached. Grant turns activity across the shop into on-demand briefings, prioritized action lists, and custom business summaries.'
  }
];

const grantMoneyStats = [
  ['$18,460', 'Repair work in motion'],
  ['$4,280', 'Deferred work ready'],
  ['11', 'Vehicles scheduled today'],
  ['3', 'Priority actions', 'alert']
];

const grantPriorityActions = [
  ['01', 'Approve the revised estimate for the 2017 Ford F-150.', 'Customer waiting', 'red'],
  ['02', 'Call Michael Torres about the recovered brake job.', 'Ready to book', 'amber'],
  ['03', 'Review the parts delay affecting Angela Brooks’s RAV4.', 'Promise time at risk', 'red']
];

const grantCalendarStats = [
  ['11', 'Vehicles scheduled today'],
  ['27', 'Vehicles this week'],
  ['$8,940', 'Approved work today'],
  ['$2,160', 'Waiting on approval']
];

const grantTeamRows = [
  ['Service desk', '$12,800', '8 open opportunities', 'Healthy', 'green'],
  ['Technician queue', '14 active jobs', '2 behind promise time', 'Needs attention', 'red'],
  ['Deferred-work follow-up', '$4,280', '6 customers ready', 'Opportunity', 'amber']
];

export default function AutoRepairPageContent() {
  return (
    <>
      <section className="section auto-repair-team-section" aria-labelledby="auto-repair-team-title">
        <div className="auto-repair-section-heading">
          <div>
            <p className="eyebrow">Meet your auto repair digital team</p>
            <h2 id="auto-repair-team-title">The shop reaches the right customer with the right vehicle context before the opportunity disappears.</h2>
          </div>
          <p>
            Naya brings deferred and upcoming maintenance back into the schedule. Vera handles new repair calls. Marcus keeps the customer and vehicle history attached. Grant briefs the owner, service manager, or service advisor whenever they need it.
          </p>
        </div>

        <div className="industry-card-grid auto-repair-team-grid">
          {teamCards.map(card => (
            <article className="industry-card auto-repair-team-card is-visible" data-reveal key={card.number}>
              <span>{card.number}</span>
              <h3>{card.title}</h3>
              <p>{card.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section real-estate-grant-section" aria-labelledby="auto-repair-grant-title">
        <div className="real-estate-grant-copy">
          <p className="eyebrow real-estate-grant-eyebrow">Your chief of staff</p>
          <h2 id="auto-repair-grant-title">Grant is your shop’s chief of staff, available 24/7.</h2>
          <p>
            Grant gives the owner, service manager, or service advisor a clear briefing whenever they need it, covering repair revenue in motion, deferred work, today’s schedule, customer issues, technician workload, parts delays, and anything that needs a decision.
          </p>
          <div className="real-estate-grant-points" aria-label="Grant briefing and visibility areas">
            <span>Briefings available on demand</span>
            <span>Spoken readout and prioritized action list</span>
            <span>Daily, weekly, or custom shop summaries</span>
          </div>
        </div>

        <div className="real-estate-dashboard-preview" aria-label="Preview of the Grant auto repair command center">
          <aside className="grant-preview-sidebar">
            <div className="grant-preview-logo">ARK<span>O</span>N</div>
            <nav aria-label="Example ARKON dashboard navigation">
              <span>Today</span>
              <span>Schedule</span>
              <span>Customers · Marcus</span>
              <span>Vehicles · Marcus</span>
              <span>Calls · Vera</span>
              <span>Follow-up · Naya</span>
              <span>Estimates</span>
              <span>Repair orders</span>
              <span>Reviews · Grace</span>
              <span>Inbox · Iris</span>
              <span className="active">Briefings · Grant</span>
              <span>Settings</span>
            </nav>
            <div className="grant-preview-user">Northside Auto Care<small>Sign out</small></div>
          </aside>

          <div className="grant-preview-main">
            <div className="grant-preview-topline">
              <div>
                <h3>Northside Auto Care Command Center · Grant</h3>
                <p>Where the shop stands, what needs attention, what work is moving, and where revenue or customer trust may be slipping.</p>
              </div>
              <div className="grant-preview-actions"><span>Custom summary</span><strong>Run briefing</strong></div>
            </div>

            <div className="grant-preview-briefing">
              <div className="grant-preview-briefing-head">
                <div>
                  <span>Grant briefing</span>
                  <h4>Three items need attention before 9 AM.</h4>
                </div>
                <strong>Needs attention</strong>
              </div>
              <p>
                Good morning. You have $18,460 in repair work in motion, $4,280 in deferred work ready for follow-up, and 11 vehicles on today’s schedule. Michael Torres is ready to book the brake work quoted last month, the F-150 customer is waiting on a revised estimate, and one parts delay may affect this afternoon’s promise time. Everything else is moving normally.
              </p>
              <div className="grant-preview-briefing-footer">
                <span>Generated on demand</span>
                <div><strong>▶ Read briefing</strong><em>Copy script</em></div>
              </div>
            </div>

            <div className="grant-preview-stats grant-preview-money-stats">
              {grantMoneyStats.map(([value, label, tone]) => (
                <div className={`grant-preview-stat${tone ? ` ${tone}` : ''}`} key={label}>
                  <strong>{value}</strong>
                  <span>{label}</span>
                </div>
              ))}
            </div>

            <div className="grant-preview-card grant-preview-priority-card">
              <div className="grant-preview-card-heading">
                <h4>What needs attention before 9 AM</h4>
                <span>Prioritized action list</span>
              </div>
              <div className="grant-preview-priority-list">
                {grantPriorityActions.map(([number, action, timing, tone]) => (
                  <div key={number}>
                    <span>{number}</span>
                    <strong>{action}</strong>
                    <em className={`grant-preview-tag ${tone}`}>{timing}</em>
                  </div>
                ))}
              </div>
            </div>

            <div className="grant-preview-stats grant-preview-calendar-stats">
              {grantCalendarStats.map(([value, label]) => (
                <div className="grant-preview-stat" key={label}>
                  <strong>{value}</strong>
                  <span>{label}</span>
                </div>
              ))}
            </div>

            <div className="grant-preview-two-column grant-preview-command-bottom">
              <div className="grant-preview-card grant-preview-momentum-card">
                <div className="grant-preview-card-heading">
                  <h4>Shop momentum</h4>
                  <span>Where work is moving</span>
                </div>
                <div className="grant-preview-momentum-list">
                  {grantTeamRows.map(([name, pipeline, opportunities, signal, tone]) => (
                    <div key={name}>
                      <strong>{name}</strong>
                      <span>{pipeline}</span>
                      <span>{opportunities}</span>
                      <em className={`grant-preview-tag ${tone}`}>{signal}</em>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grant-preview-card grant-preview-digest-card">
                <div className="grant-preview-card-heading">
                  <h4>Executive shop summary</h4>
                  <span>On demand or scheduled</span>
                </div>
                <p>
                  Grant connects activity across calls, appointments, estimates, deferred work, repair orders, customer updates, reviews, and staff handoffs, then identifies what needs attention next.
                </p>
                <div className="grant-preview-digest-footer"><span>Summary archive ready</span><strong>Read latest summary</strong></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <VerticalClosingCta
        eyebrow="See ARKON for auto repair"
        title="See how personalized customer follow-up brings the right work back into the shop."
        body="We’ll walk through how Naya uses customer and vehicle history to recover deferred work and schedule upcoming maintenance, how Vera handles new repair calls, how Marcus keeps the context attached, and how Grant briefs the owner, service manager, or service advisor whenever they need it."
        buttonLabel="Book an auto repair walkthrough"
      />
    </>
  );
}
