import VerticalClosingCta from './VerticalClosingCta.jsx';
import { industryPages } from './site-content.js';
import './auto-repair-page.css';
import './real-estate-dashboard-preview.css';

const teamCards = [
  {
    number: '01',
    title: 'Naya follows up and books drop-offs by text.',
    copy: 'Naya uses the customer’s name, vehicle, recommended service, and prior estimate to bring declined work back into the conversation. When the customer is ready, she offers shop-approved arrival windows and books after they confirm.'
  },
  {
    number: '02',
    title: 'Naya sends reminders when maintenance is due.',
    copy: 'When service is coming due, Naya reaches out with the vehicle and maintenance context, follows the shop’s approved timing, and keeps the customer’s next step clear.'
  },
  {
    number: '03',
    title: 'Vera answers repair calls and books by phone.',
    copy: 'Vera captures the customer, vehicle, and concern, then can offer and book an available drop-off window by phone after the customer confirms. Urgent or judgment-based requests go to the shop team.'
  },
  {
    number: '04',
    title: 'Iris keeps shop email from burying customer requests.',
    copy: 'Iris prioritizes new customer inquiries and messages that need attention, so estimate requests and important shop emails reach the right person.'
  },
  {
    number: '05',
    title: 'Marcus keeps customer and vehicle history together.',
    copy: 'Marcus connects prior visits, estimates, recommended work, vehicle details, and customer conversations so the shop can pick up with the right context.'
  },
  {
    number: '06',
    title: 'Grant briefs the owner on what needs attention.',
    copy: 'Grant turns shop activity into on-demand briefings, prioritized action lists, and custom business summaries for owners, service managers, and advisors.'
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
            <p className="eyebrow">Auto repair shop communication automation</p>
            <h2 id="auto-repair-team-title">Keep repair calls, estimates, and service follow-up connected to the right vehicle.</h2>
          </div>
          <p>
            Naya follows up and books available drop-offs by text. Vera answers calls and books by phone. Iris organizes shop email, Marcus keeps customer and vehicle history attached, and Grant briefs the owner, service manager, or service advisor.
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
            <nav tabIndex="0" aria-label="Example ARKON dashboard navigation">
              <span>Today</span>
              <span>Schedule</span>
              <span>Customers · Marcus</span>
              <span>Vehicles · Marcus</span>
              <span>Calls · Vera</span>
              <span>Follow-up · Naya</span>
              <span>Estimates</span>
              <span>Repair orders</span>
              <span>Reviews</span>
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
                <small>Illustrative sample shop and figures. A live view reflects the shop’s configured data.</small>
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

      <section className="section industry-faq-section auto-repair-faq-section" aria-labelledby="auto-repair-faq-title">
        <div className="section-heading is-visible" data-reveal>
          <p className="eyebrow">Auto repair automation questions</p>
          <h2 id="auto-repair-faq-title">Fits around your service advisors and shop systems.</h2>
        </div>
        <div className="industry-faq-grid">
          {industryPages['/auto-repair'].faq.map(([question, answer]) => (
            <article className="industry-faq is-visible" key={question} data-reveal>
              <h3>{question}</h3>
              <p>{answer}</p>
            </article>
          ))}
        </div>
      </section>

      <VerticalClosingCta
        eyebrow="See ARKON for auto repair"
        title="See how auto repair call and follow-up automation fits your shop."
        body="Walk through phone and text appointment booking, repair-call intake, estimate and declined-service follow-up, maintenance reminders, vehicle history, email triage, and the handoffs your service team controls."
        buttonLabel="Book an auto repair walkthrough"
      />
    </>
  );
}
