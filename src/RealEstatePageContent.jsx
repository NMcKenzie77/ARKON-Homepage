import './real-estate-page.css';
import './real-estate-followup.css';

const teamCards = [
  {
    number: '01',
    title: 'Vera answers in your office’s name.',
    copy: 'Buyer questions, seller inquiries, showing requests, and new-lead calls begin with the greeting you approve. Vera can also capture the caller’s name, phone, email, timing, and reason for reaching out.'
  },
  {
    number: '02',
    title: 'Naya follows up with opportunities already in your database.',
    copy: 'Past buyers, delayed sellers, open-house visitors, and leads that went quiet receive natural follow-up based on their history. Naya can confirm whether their contact details, timing, and criteria are still current.'
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

const opportunityRows = [
  ['Past buyer reactivated after five months', 'Areas and budget refreshed · lender reconnection needed', 'Reactivated'],
  ['Buyer requested Saturday at 10:30', '214 Oak Avenue · unrepresented buyer', 'Confirm showing'],
  ['Homeowner plans to sell in 60–90 days', 'Relocating · agent call requested today', 'Seller lead'],
  ['Open-house visitor requested disclosures', 'Documents sent · follow-up scheduled', 'Moving']
];

const attentionItems = [
  'Past leads ready to revisit',
  'Showing confirmations',
  'New seller opportunities',
  'Unrepresented buyers',
  'Leads waiting on an agent'
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
            Vera handles live calls and new contact intake in the office’s name. Naya re-engages buyers and sellers already in the database and confirms what has changed. Paige supplies approved property intelligence. Marcus keeps the complete relationship record attached. Grant shows what deserves attention next.
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
          <h2 id="real-estate-opportunity-title">See the new inquiries, reactivated leads, showings, and decisions that can move a deal.</h2>
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
              <h3>Today’s inquiries, follow-up, and decisions</h3>
            </div>
            <strong>2 need an agent</strong>
          </div>

          <div className="real-estate-opportunity-metrics">
            <div><span>New inquiries</span><strong>8</strong></div>
            <div><span>Past leads reactivated</span><strong>3</strong></div>
            <div><span>Needs an agent</span><strong>2</strong></div>
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
