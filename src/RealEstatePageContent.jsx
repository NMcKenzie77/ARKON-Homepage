import './real-estate-page.css';
import './real-estate-followup.css';
import './real-estate-dashboard-preview.css';
import './real-estate-dashboard-compact.css';

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
    title: 'Grant shows what can move a deal.',
    copy: 'New inquiries, reactivated leads, showing requests, seller opportunities, stalled follow-up, and decisions appear in one useful view.'
  }
];

const dashboardStats = [
  ['$3,150,000', 'My Pipeline Value'],
  ['$78,750', 'Expected Commission'],
  ['8', 'Active Deals'],
  ['2', 'Closing This Month'],
  ['3', 'Need My Attention', 'alert'],
  ['6', 'Follow-ups Queued']
];

const pipelineStages = [
  ['New Leads', 4, 100, 'blue'],
  ['Qualified', 3, 75, 'blue'],
  ['Showing', 2, 50, 'blue'],
  ['Under Contract', 2, 50, 'violet'],
  ['Closed', 1, 25, 'green']
];

const activeDeals = [
  ['Danielle Brooks', 'Qualified', 'Buyer', '$650,000', '$16,250', '—', 'On Track', 'green'],
  ['Daniel Reyes', 'Showing Scheduled', 'Buyer', '$485,000', '$12,125', '—', 'On Track', 'green'],
  ['Laura Kim', 'Contacted', 'Seller', '$825,000', '$20,625', 'Oct 28', 'Watch', 'amber'],
  ['Marcus Hill', 'Under Contract', 'Seller', '$715,000', '$17,875', 'Aug 19', 'Needs Review', 'red']
];

const needRows = [
  ['3', 'Deals or leads needing judgment', 'red'],
  ['2', 'Hot leads not contacted today', 'amber'],
  ['2', 'Showings on today’s schedule', 'neutral'],
  ['7', 'Conversations this week', 'neutral']
];

const scheduleRows = [
  ['10:30 AM', 'Showing', '214 Oak Avenue', 'Daniel Reyes'],
  ['2:00 PM', 'Listing', '88 Birch Lane', 'Laura Kim']
];

const conversationRows = [
  ['Jul 29, 11:42 AM', 'Danielle Brooks', 'Naya'],
  ['Jul 29, 10:15 AM', 'Daniel Reyes', 'Vera']
];

export default function RealEstatePageContent() {
  return (
    <>
      <section className="section real-estate-team-section" aria-labelledby="real-estate-team-title">
        <div className="real-estate-section-heading">
          <div>
            <p className="eyebrow">Meet your real estate digital AI team</p>
            <h2 id="real-estate-team-title">Your digital team answers new inquiries and keeps past opportunities from going silent.</h2>
          </div>
          <p>
            Naya is the member buyers and sellers see in the follow-up demo above. Behind her, Vera, Paige, Marcus, and Grant keep calls, property context, relationship history, handoffs, and agent visibility connected.
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
      </section>

      <section className="section real-estate-grant-section" aria-labelledby="real-estate-grant-title">
        <div className="real-estate-grant-copy">
          <p className="eyebrow real-estate-grant-eyebrow">Your chief of staff</p>
          <h2 id="real-estate-grant-title">Grant is your chief of staff, available 24/7.</h2>
          <p>
            Grant does more than organize a dashboard. Before the day starts, he actively briefs you on where the business stands, what needs attention, who is moving, who has gone quiet, and where the team may need help. The dashboard stays underneath when you want to inspect the details.
          </p>
          <div className="real-estate-grant-points" aria-label="Grant briefing and visibility areas">
            <span>Morning command briefing</span>
            <span>Spoken readout</span>
            <span>Live business visibility</span>
          </div>
        </div>

        <div className="real-estate-dashboard-preview" aria-label="Preview of Grant’s briefing and the ARKON Real Estate dashboard">
          <aside className="grant-preview-sidebar">
            <div className="grant-preview-logo">ARK<span>O</span>N</div>
            <nav aria-label="Example ARKON dashboard navigation">
              <span className="active">Today</span>
              <span>Calendar · Caleb</span>
              <span>Pipeline · Marcus</span>
              <span>Contacts · Marcus</span>
              <span>Listings · Paige</span>
              <span>CMA · Paige</span>
              <span>Inbox · Iris</span>
              <span>Showings · Caleb</span>
              <span>Reviews · Grace</span>
              <span>Compliance · Clara</span>
              <span>Digest · Grant</span>
              <span>Settings</span>
            </nav>
            <div className="grant-preview-user">Jordan Lee<small>Sign out</small></div>
          </aside>

          <div className="grant-preview-main">
            <div className="grant-preview-topline">
              <div>
                <h3>Today</h3>
                <p>Your pipeline, money, deals, and people who need you now.</p>
              </div>
              <div className="grant-preview-actions"><span>Agency view →</span><strong>Contacts</strong></div>
            </div>

            <div className="grant-preview-briefing">
              <div className="grant-preview-briefing-head">
                <div>
                  <span>Grant morning verdict</span>
                  <h4>The business is moving. Three items need you before 10 AM.</h4>
                </div>
                <strong>Ready to brief</strong>
              </div>
              <p>
                Good morning, Jordan. Your active pipeline is $3.15 million with $78,750 in expected commission. Daniel’s Saturday showing needs confirmation, Laura’s seller opportunity needs a call, and one under-contract deal needs review. Everything else is moving normally.
              </p>
              <div className="grant-preview-briefing-footer">
                <span>Generated 7:00 AM</span>
                <strong>▶ Hear Grant’s briefing</strong>
              </div>
            </div>

            <div className="grant-preview-stats">
              {dashboardStats.map(([value, label, tone]) => (
                <div className={`grant-preview-stat${tone ? ` ${tone}` : ''}`} key={label}>
                  <strong>{value}</strong>
                  <span>{label}</span>
                </div>
              ))}
            </div>

            <div className="grant-preview-two-column">
              <div className="grant-preview-card grant-preview-voice">
                <h4>Voice Memo · Naya</h4>
                <p>Record a quick update and let Naya attach it to the right contact or deal.</p>
                <div className="grant-preview-record">● Hold to record</div>
              </div>

              <div className="grant-preview-card">
                <h4>What needs me</h4>
                <div className="grant-preview-needs">
                  {needRows.map(([count, label, tone]) => (
                    <div key={label}><span className={`grant-preview-tag ${tone}`}>{count}</span><p>{label}</p></div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grant-preview-card">
              <h4>My Pipeline by Stage</h4>
              <div className="grant-preview-stages">
                {pipelineStages.map(([label, count, width, tone]) => (
                  <div className="grant-preview-stage" key={label}>
                    <span>{label}</span>
                    <strong>{count}</strong>
                    <div><i className={tone} style={{ width: `${width}%` }} /></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grant-preview-card grant-preview-deals-card">
              <h4>My Active Deals</h4>
              <div className="grant-preview-table-wrap">
                <table className="grant-preview-table">
                  <thead>
                    <tr><th>Contact</th><th>Stage</th><th>Type</th><th>Deal Value</th><th>Est. Commission</th><th>Close Date</th><th>Risk</th></tr>
                  </thead>
                  <tbody>
                    {activeDeals.map(([contact, stage, type, value, commission, closeDate, risk, tone]) => (
                      <tr key={contact}>
                        <td><strong>{contact}</strong></td>
                        <td><span className="grant-preview-tag neutral">{stage}</span></td>
                        <td>{type}</td>
                        <td>{value}</td>
                        <td>{commission}</td>
                        <td>{closeDate}</td>
                        <td><span className={`grant-preview-tag ${tone}`}>{risk}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grant-preview-two-column grant-preview-bottom-grid">
              <div className="grant-preview-card">
                <h4>Today’s Schedule</h4>
                <div className="grant-preview-simple-table">
                  {scheduleRows.map(([time, kind, address, contact]) => (
                    <div key={`${time}-${contact}`}><span>{time}</span><span>{kind}</span><span>{address}</span><strong>{contact}</strong></div>
                  ))}
                </div>
              </div>

              <div className="grant-preview-card">
                <h4>Recent Conversations</h4>
                <div className="grant-preview-simple-table conversations">
                  {conversationRows.map(([time, contact, owner]) => (
                    <div key={`${time}-${contact}`}><span>{time}</span><strong>{contact}</strong><span className="grant-preview-tag neutral">{owner}</span></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="demo-cta industry-cta real-estate-closing-cta is-visible" data-reveal>
        <div>
          <p className="eyebrow">See ARKON for real estate</p>
          <h2>See how your digital team answers new inquiries and reactivates past opportunities.</h2>
          <p>
            We’ll show how Vera, Naya, Paige, Marcus, and Grant work around personalized call answering, contact intake, buyer and seller follow-up, property questions, showing requests, and agent handoffs. From there, we can determine what makes sense for your business.
          </p>
        </div>
        <a className="primary-button" href="/#demo">Book a real estate walkthrough</a>
      </section>
    </>
  );
}
