import VerticalClosingCta from './VerticalClosingCta.jsx';
import './real-estate-page.css';
import './real-estate-followup.css';
import './real-estate-dashboard-preview.css';

const teamCards = [
  {
    number: '01',
    title: 'Vera answers new inquiries live.',
    copy: 'Buyer questions, seller inquiries, showing requests, and new-lead calls begin with the office greeting you approve. Vera captures the details the agent needs while the opportunity is still live.'
  },
  {
    number: '02',
    title: 'Naya keeps buyer and seller follow-up moving.',
    copy: 'Past buyers, delayed sellers, open-house visitors, and leads that went quiet receive natural follow-up based on their history, with a clear customer-facing close before the agent handoff.'
  },
  {
    number: '03',
    title: 'Paige knows the property.',
    copy: 'Approved listing details, property facts, status, and showing context are available during the conversation instead of after a callback.'
  },
  {
    number: '04',
    title: 'Marcus remembers the relationship.',
    copy: 'Contact details, prior conversations, representation status, property interests, seller timing, notes, and follow-up context stay attached.'
  },
  {
    number: '05',
    title: 'Grant briefs you before the day starts.',
    copy: 'Grant turns activity across the business into a morning command briefing, a short owner action list, and a longer weekly digest that connects the dots.'
  }
];

const supportingRoles = [
  {
    name: 'Iris',
    role: 'Email inbox intelligence',
    copy: 'Monitors the inbox, prioritizes urgent client, lead, transaction, and document emails, and surfaces what needs a person before it gets buried.'
  },
  {
    name: 'Grace',
    role: 'Review management',
    copy: 'Monitors new reviews, prepares responses in the business voice, and routes sensitive or negative feedback for approval before anything is published.'
  }
];

const grantMoneyStats = [
  ['$3,150,000', 'Active pipeline'],
  ['$78,750', 'Projected GCI'],
  ['2', 'Closings this week'],
  ['3', 'Owner actions', 'alert']
];

const grantPriorityActions = [
  ['01', 'Confirm Daniel Reyes’s Saturday showing.', 'Before 9:00 AM', 'amber'],
  ['02', 'Call Laura Kim about her 60–90 day seller timeline.', 'Owner decision', 'red'],
  ['03', 'Review the inspection deadline at 88 Birch Lane.', 'Due today', 'red']
];

const grantCalendarStats = [
  ['2', 'Showings today'],
  ['5', 'Showings this week'],
  ['$4,280,000', 'Active listing value'],
  ['$1,365,000', 'Under contract']
];

const grantTeamRows = [
  ['Jordan Lee', '$1,420,000', '4 opportunities', 'Healthy', 'green'],
  ['Maya Torres', '$980,000', '3 opportunities', '1 escalation', 'red'],
  ['Andre Cole', '$750,000', '2 opportunities', '1 quiet contact', 'amber']
];

export default function RealEstatePageContent() {
  return (
    <>
      <section className="section real-estate-team-section" aria-labelledby="real-estate-team-title">
        <div className="real-estate-section-heading">
          <div>
            <p className="eyebrow">Meet your real estate digital team</p>
            <h2 id="real-estate-team-title">Your digital team answers new inquiries and keeps past opportunities from going silent.</h2>
          </div>
          <p>
            Naya is the member buyers and sellers see in the follow-up demo above. Behind her, Vera, Paige, Marcus, and Grant keep calls, property context, relationship history, handoffs, and agent visibility connected. Iris and Grace are available when the business also wants inbox and review coverage.
          </p>
        </div>

        <div className="industry-card-grid real-estate-team-grid">
          {teamCards.map(card => (
            <article className="industry-card real-estate-team-card is-visible" data-reveal key={card.number}>
              <span>{card.number}</span>
              <h3>{card.title}</h3>
              <p>{card.copy}</p>
            </article>
          ))}
        </div>

        <div className="real-estate-supporting-roles">
          <div className="real-estate-supporting-roles-copy">
            <p className="eyebrow">Additional roles available</p>
            <h3>Inbox and reputation coverage are there when you need them.</h3>
            <p>Iris and Grace do not sit in the middle of every transaction, but they cover two places where important signals are easy to miss.</p>
          </div>

          <div className="real-estate-supporting-grid">
            {supportingRoles.map(role => (
              <article className="real-estate-supporting-card is-visible" data-reveal key={role.name}>
                <span>{role.role}</span>
                <h3>{role.name}</h3>
                <p>{role.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section real-estate-grant-section" aria-labelledby="real-estate-grant-title">
        <div className="real-estate-grant-copy">
          <p className="eyebrow real-estate-grant-eyebrow">Your chief of staff</p>
          <h2 id="real-estate-grant-title">Grant is your chief of staff, available 24/7.</h2>
          <p>
            At 7:00 every morning, Grant briefs you on the money in motion, today’s calendar, urgent deadlines, quiet opportunities, team momentum, inbox risk, reputation, and anything that needs your judgment. On Monday, he delivers a longer executive digest that connects the week across the entire digital team.
          </p>
          <div className="real-estate-grant-points" aria-label="Grant briefing and visibility areas">
            <span>Daily 7:00 AM command briefing</span>
            <span>Spoken readout and owner action list</span>
            <span>Monday executive digest</span>
          </div>
        </div>

        <div className="real-estate-dashboard-preview" aria-label="Preview of the Grant command center">
          <aside className="grant-preview-sidebar">
            <div className="grant-preview-logo">ARK<span>O</span>N</div>
            <nav aria-label="Example ARKON dashboard navigation">
              <span>Today</span>
              <span>Calendar · Caleb</span>
              <span>Pipeline · Marcus</span>
              <span>Contacts · Marcus</span>
              <span>Listings · Paige</span>
              <span>CMA · Paige</span>
              <span>Inbox · Iris</span>
              <span>Showings · Caleb</span>
              <span>Reviews · Grace</span>
              <span>Compliance · Clara</span>
              <span className="active">Digest · Grant</span>
              <span>Settings</span>
            </nav>
            <div className="grant-preview-user">Jordan Lee<small>Sign out</small></div>
          </aside>

          <div className="grant-preview-main">
            <div className="grant-preview-topline">
              <div>
                <h3>Oak &amp; Main Realty Command Center · Grant</h3>
                <p>Where the business stands, what needs attention, who is moving, and who needs help.</p>
              </div>
              <div className="grant-preview-actions"><span>Monday digest</span><strong>Run briefing</strong></div>
            </div>

            <div className="grant-preview-briefing">
              <div className="grant-preview-briefing-head">
                <div>
                  <span>Grant morning verdict</span>
                  <h4>Three items need attention before 10 AM.</h4>
                </div>
                <strong>Needs attention</strong>
              </div>
              <p>
                Good morning, Jordan. You have $3.15 million in active pipeline and about $78,750 in projected GCI. Two showings are on today’s calendar. Daniel’s showing needs confirmation, Laura’s seller opportunity needs a decision, and one inspection deadline needs review. Everything else is moving normally.
              </p>
              <div className="grant-preview-briefing-footer">
                <span>Generated today at 7:00 AM</span>
                <div><strong>▶ Read morning briefing</strong><em>Copy script</em></div>
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
                <h4>What needs attention before 10 AM</h4>
                <span>Owner action list</span>
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
                  <h4>Team momentum</h4>
                  <span>Who is carrying the work</span>
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
                  <h4>Monday executive digest</h4>
                  <span>Delivered by email</span>
                </div>
                <p>
                  Grant connects the week across leads, follow-up, showings, listings, reviews, compliance, and the inbox, then ends with the five things that need you next.
                </p>
                <div className="grant-preview-digest-footer"><span>Weekly archive ready</span><strong>Read latest digest</strong></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <VerticalClosingCta
        eyebrow="See ARKON for real estate"
        title="See how your digital team keeps opportunities moving from first inquiry to owner briefing."
        body="We’ll walk through how Vera answers new calls, Naya follows up, Paige supplies property context, Marcus maintains relationship and pipeline history, Caleb coordinates showings, Iris watches the inbox, Grace manages reviews, and Grant actively briefs you on what matters."
        buttonLabel="Book a real estate walkthrough"
      />
    </>
  );
}
