import './real-estate-page.css';

const teamCards = [
  {
    number: '01',
    title: 'Vera answers the call live.',
    copy: 'Buyer questions, seller inquiries, showing requests, and new-lead calls are answered while the opportunity is still active.'
  },
  {
    number: '02',
    title: 'Paige knows the property.',
    copy: 'Approved listing details, property facts, status, and showing context are available during the conversation instead of after a callback.'
  },
  {
    number: '03',
    title: 'Marcus remembers the relationship.',
    copy: 'Prior conversations, representation status, property interests, seller timing, notes, and follow-up context stay attached.'
  },
  {
    number: '04',
    title: 'Grant shows what can move a deal.',
    copy: 'Qualified opportunities, showing requests, seller leads, stalled follow-up, and decisions appear in one useful view.'
  }
];

const opportunityRows = [
  ['Buyer requested Saturday at 10:30', '214 Oak Avenue · unrepresented buyer', 'Confirm showing'],
  ['Homeowner plans to sell in 60–90 days', 'Relocating · agent call requested today', 'Seller lead'],
  ['Past client asked about a larger home', 'Prior buyer · financing question attached', 'Needs agent'],
  ['Open-house visitor requested disclosures', 'Documents sent · follow-up scheduled', 'Moving']
];

const attentionItems = [
  'Showing confirmations',
  'New seller opportunities',
  'Unrepresented buyers',
  'Leads waiting on an agent',
  'Follow-up at risk'
];

export default function RealEstatePageContent() {
  return (
    <>
      <section className="section real-estate-team-section" aria-labelledby="real-estate-team-title">
        <div className="real-estate-section-heading">
          <div>
            <p className="eyebrow">Meet your real estate digital AI team</p>
            <h2 id="real-estate-team-title">Your digital team keeps opportunities moving while agents stay in showings, conversations, and negotiations.</h2>
          </div>
          <p>
            Vera handles the live conversation. Paige supplies approved property intelligence. Marcus keeps the relationship history attached. Grant shows the agent or team leader what deserves attention next.
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

      <section className="section real-estate-opportunity-section" aria-labelledby="real-estate-opportunity-title">
        <div className="real-estate-opportunity-copy">
          <p className="eyebrow">Your opportunity brief</p>
          <h2 id="real-estate-opportunity-title">See the leads, showings, and decisions that could move a deal forward.</h2>
          <p>
            Grant keeps the agent focused on revenue-producing opportunities and necessary decisions. Routine activity stays out of the way.
          </p>

          <div className="real-estate-attention-list" aria-label="Real estate opportunities and decisions">
            {attentionItems.map(item => <span key={item}>{item}</span>)}
          </div>
        </div>

        <div className="real-estate-opportunity-panel" aria-label="Example real estate opportunity brief">
          <div className="real-estate-opportunity-header">
            <div>
              <span>Grant · Opportunity brief</span>
              <h3>Today’s leads, showings, and decisions</h3>
            </div>
            <strong>1 needs you now</strong>
          </div>

          <div className="real-estate-opportunity-metrics">
            <div><span>Showing requests</span><strong>5</strong></div>
            <div><span>Seller opportunities</span><strong>2</strong></div>
            <div><span>Needs an agent</span><strong>1</strong></div>
          </div>

          <div className="real-estate-opportunity-rows">
            {opportunityRows.map(([title, detail, status]) => (
              <div className="real-estate-opportunity-row" key={`${title}-${status}`}>
                <span className="real-estate-opportunity-avatar" aria-hidden="true">{title.charAt(0)}</span>
                <div><strong>{title}</strong><small>{detail}</small></div>
                <em className={`real-estate-opportunity-status real-estate-status-${status.toLowerCase().replace(/\s+/g, '-')}`}>{status}</em>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="demo-cta industry-cta real-estate-closing-cta is-visible" data-reveal>
        <div>
          <p className="eyebrow">See ARKON for real estate</p>
          <h2>See how your digital team can answer, qualify, and organize the next opportunity.</h2>
          <p>
            We’ll show how Vera, Paige, Marcus, and Grant work together around buyer calls, seller inquiries, property questions, showing requests, and agent handoffs. From there, we can determine what makes sense for your business.
          </p>
        </div>
        <a className="primary-button" href="/#demo">Book a real estate walkthrough</a>
      </section>
    </>
  );
}
