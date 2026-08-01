const grantStats = [
  ['7', 'Active stays'],
  ['4', 'Arrivals today'],
  ['3', 'Turnovers in progress'],
  ['4', 'Priority actions', 'alert']
];

const grantActions = [
  ['01', 'Confirm Gulfview Loft is ready for the 4:00 arrival.', 'Final photos missing', 'red'],
  ['02', 'Review the Seabreeze Cottage leak estimate.', 'Approval needed', 'amber'],
  ['03', 'Contact Olivia Chen before requesting a review.', 'Guest concern open', 'red'],
  ['04', 'Follow up with Marcus Lee about returning next spring.', 'Return-stay opportunity', 'green']
];

const portfolioStats = [
  ['2', 'Properties missing final photos'],
  ['1', 'Unresolved guest concern'],
  ['4', 'Reviews ready to request'],
  ['3', 'Guests interested in returning']
];

const portfolioMomentum = [
  ['Today’s arrivals', '4 scheduled', '3 confirmed ready', 'Needs attention', 'amber'],
  ['Active stays', '7 in progress', '1 guest concern open', 'Needs attention', 'red'],
  ['Turnovers', '3 in progress', '2 missing final photos', 'At risk', 'red'],
  ['Review follow-up', '4 ready', '1 paused for recovery', 'Active', 'green'],
  ['Return stays', '3 interested', 'Dates and preferences saved', 'Healthy', 'green']
];

export default function ShortTermRentalGrantSection() {
  return (
    <section className="section real-estate-grant-section short-term-rental-grant-section" aria-labelledby="short-term-rental-grant-title">
      <div className="real-estate-grant-copy">
        <p className="eyebrow real-estate-grant-eyebrow">Your portfolio chief of staff</p>
        <h2 id="short-term-rental-grant-title">Grant shows you what needs attention across the portfolio before a guest, turnover, or property issue gets missed.</h2>
        <p>
          Grant connects active stays, upcoming arrivals, cleaner progress, turnover photos, guest concerns, maintenance problems, review opportunities, and return-stay interest. The owner gets the few decisions that require attention instead of reading every message.
        </p>
        <div className="real-estate-grant-points" aria-label="Grant portfolio briefing and visibility areas">
          <span>Briefings available on demand</span>
          <span>Prioritized portfolio action list</span>
          <span>Daily, weekly, or custom summaries</span>
        </div>
      </div>

      <div className="real-estate-dashboard-preview" aria-label="Preview of the Grant short-term rental portfolio command center">
        <aside className="grant-preview-sidebar">
          <div className="grant-preview-logo">ARK<span>O</span>N</div>
          <nav tabIndex="0" aria-label="Example ARKON short-term rental dashboard navigation">
            <span>Today</span>
            <span>Properties · Marcus</span>
            <span>Guests · Marcus</span>
            <span>Messages · Naya</span>
            <span>Turnovers</span>
            <span>Cleaner photos</span>
            <span>Maintenance · Charlie</span>
            <span>Reviews</span>
            <span>Return stays</span>
            <span>Inbox · Iris</span>
            <span className="active">Briefings · Grant</span>
            <span>Settings</span>
          </nav>
          <div className="grant-preview-user">Harborlight Stays<small>12-property portfolio</small></div>
        </aside>

        <div className="grant-preview-main">
          <div className="grant-preview-topline">
            <div>
              <h3>Harborlight Stays Command Center · Grant</h3>
              <p>Where the portfolio stands, what needs attention, which stays and turnovers are moving, and where the guest experience may be slipping.</p>
            </div>
            <div className="grant-preview-actions"><span>Custom summary</span><strong>Run briefing</strong></div>
          </div>

          <div className="grant-preview-briefing">
            <div className="grant-preview-briefing-head">
              <div>
                <span>Grant briefing</span>
                <h4>Four items need your attention today.</h4>
              </div>
              <strong>Needs attention</strong>
            </div>
            <p>
              Gulfview Loft is waiting on final turnover photos before the 4:00 arrival. The Seabreeze Cottage plumber sent an estimate that needs approval. Olivia Chen reported a checkout concern, so her review request is paused. Marcus Lee asked about returning next spring and is ready for follow-up.
            </p>
            <div className="grant-preview-briefing-footer">
              <span>Generated on demand</span>
              <div><strong>▶ Read briefing</strong><em>Copy summary</em></div>
            </div>
          </div>

          <div className="grant-preview-stats grant-preview-money-stats">
            {grantStats.map(([value, label, tone]) => (
              <div className={`grant-preview-stat${tone ? ` ${tone}` : ''}`} key={label}>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>

          <div className="grant-preview-card grant-preview-priority-card">
            <div className="grant-preview-card-heading">
              <h4>What needs attention today</h4>
              <span>Prioritized portfolio action list</span>
            </div>
            <div className="grant-preview-priority-list">
              {grantActions.map(([number, action, timing, tone]) => (
                <div key={number}>
                  <span>{number}</span>
                  <strong>{action}</strong>
                  <em className={`grant-preview-tag ${tone}`}>{timing}</em>
                </div>
              ))}
            </div>
          </div>

          <div className="grant-preview-stats grant-preview-calendar-stats">
            {portfolioStats.map(([value, label]) => (
              <div className="grant-preview-stat" key={label}>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>

          <div className="grant-preview-two-column grant-preview-command-bottom">
            <div className="grant-preview-card grant-preview-momentum-card">
              <div className="grant-preview-card-heading">
                <h4>Portfolio activity</h4>
                <span>Where stays, turnovers, and follow-up stand</span>
              </div>
              <div className="grant-preview-momentum-list">
                {portfolioMomentum.map(([name, status, detail, signal, tone]) => (
                  <div key={name}>
                    <strong>{name}</strong>
                    <span>{status}</span>
                    <span>{detail}</span>
                    <em className={`grant-preview-tag ${tone}`}>{signal}</em>
                  </div>
                ))}
              </div>
            </div>

            <div className="grant-preview-card grant-preview-digest-card">
              <div className="grant-preview-card-heading">
                <h4>Owner portfolio summary</h4>
                <span>On demand or scheduled</span>
              </div>
              <p>
                Grant connects guest messages, cleaner progress, turnover photos, maintenance activity, reviews, return interest, and staff handoffs, then identifies the few items the owner needs to act on next.
              </p>
              <div className="grant-preview-digest-footer"><span>Summary archive ready</span><strong>Read latest summary</strong></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
