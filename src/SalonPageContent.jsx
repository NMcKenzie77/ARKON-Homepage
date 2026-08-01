import VerticalClosingCta from './VerticalClosingCta.jsx';
import './salon-page.css';

const salonCards = [
  {
    number: '01',
    title: 'Vera answers the phone live.',
    copy: 'When the salon is busy, Vera can answer the call, understand what the client needs, handle approved booking questions, and keep the opportunity moving while the client is still on the phone.'
  },
  {
    number: '02',
    title: 'Naya keeps messages and follow-up moving.',
    copy: 'Naya handles texts, reminders, rebooking outreach, appointment follow-up, and routine client questions in the salon’s voice.'
  },
  {
    number: '03',
    title: 'Marcus remembers the client.',
    copy: 'Service history, stylist preferences, notes, prior conversations, and follow-up context stay attached instead of living in someone’s memory.'
  },
  {
    number: '04',
    title: 'Grant shows the owner what matters.',
    copy: 'Booked appointments, schedule gaps, at-risk clients, and decisions appear in one clear owner view.'
  }
];

const ownerAttentionItems = [
  'Unfilled openings',
  'Unconfirmed appointments',
  'Color correction review',
  'Pricing approval',
  'Client complaints'
];

const ownerRows = [
  ['Saturday at 11:00 opened after cancellation', 'Open appointment worth refilling', 'Needs follow-up'],
  ['Alicia asked about a color correction', 'Service decision before booking', 'Manager review'],
  ['Jasmine rebooked with Maria', 'Saturday at 11:00 confirmed', 'Booked'],
  ['Tomorrow’s 2:30 appointment is not confirmed', 'Revenue may slip if no one responds', 'At risk']
];

export default function SalonPageContent() {
  return (
    <>
      <section className="section salon-capabilities-section" aria-labelledby="salon-capabilities-title">
        <div className="salon-section-heading">
          <div>
            <p className="eyebrow">Meet your digital team</p>
            <h2 id="salon-capabilities-title">Your digital team keeps every call, booking, and follow-up moving while your staff stays with clients.</h2>
          </div>
          <p>
            Naya is the member clients see in the message demo above. Behind her, Vera, Marcus, and Grant keep calls, client context, handoffs, and owner visibility connected.
          </p>
        </div>

        <div className="industry-card-grid salon-capability-grid">
          {salonCards.map(card => (
            <article className="industry-card salon-capability-card is-visible" data-reveal key={card.number}>
              <span>{card.number}</span>
              <h3>{card.title}</h3>
              <p>{card.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section salon-control-section" aria-labelledby="salon-control-title">
        <div className="salon-control-copy">
          <p className="eyebrow">Your owner brief</p>
          <h2 id="salon-control-title">See the bookings, schedule gaps, and decisions that affect your day.</h2>
          <p>
            Grant shows what changed, where revenue may be slipping, and what needs a decision. Everything else stays out of the way.
          </p>

          <div className="salon-handoff-list" aria-label="Items that may need owner or manager attention">
            {ownerAttentionItems.map(item => <span key={item}>{item}</span>)}
          </div>
        </div>

        <div className="salon-owner-panel" aria-label="Example salon owner brief">
          <div className="salon-owner-header">
            <div>
              <span>Grant · Owner brief</span>
              <h3>Today’s bookings, gaps, and decisions</h3>
            </div>
            <strong>1 decision now</strong>
          </div>

          <div className="salon-owner-metrics">
            <div><span>Appointments booked</span><strong>7</strong></div>
            <div><span>Openings to fill</span><strong>2</strong></div>
            <div><span>Needs a decision</span><strong>1</strong></div>
          </div>

          <div className="salon-owner-rows">
            {ownerRows.map(([title, detail, status]) => (
              <div className="salon-owner-row" key={`${title}-${status}`}>
                <span className="salon-owner-avatar" aria-hidden="true">{title.charAt(0)}</span>
                <div><strong>{title}</strong><small>{detail}</small></div>
                <em className={`salon-owner-status salon-owner-status-${status.toLowerCase().replace(/\s+/g, '-')}`}>{status}</em>
              </div>
            ))}
          </div>
        </div>
      </section>

      <VerticalClosingCta
        eyebrow="See ARKON for salons"
        title="See how a digital team can protect bookings without pulling staff away from clients."
        body="We’ll show how Vera answers calls, Naya handles messages and follow-up, Marcus keeps client context attached, and Grant surfaces bookings, schedule gaps, and decisions. From there, we can determine what makes sense for your salon."
        buttonLabel="Book a salon walkthrough"
      />
    </>
  );
}
