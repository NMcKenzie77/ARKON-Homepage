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

const workflowSteps = [
  ['A client reaches the salon', 'The request can arrive by phone, text, or the website while the staff is with clients.'],
  ['Vera or Naya responds now', 'Vera handles the live call. Naya handles the message or follow-up. The client does not have to wait for the floor to slow down.'],
  ['Marcus attaches the history', 'The digital team can use the client’s service history, preferences, prior conversations, and approved salon rules before taking the next step.'],
  ['Grant keeps the owner informed', 'The owner sees what was booked, where the schedule has gaps, what is at risk, and what needs a decision.']
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

const salonFaq = [
  [
    'Is this one salon bot or a digital AI team?',
    'It is a coordinated digital AI team. Vera handles live calls, Naya handles messaging and follow-up, Marcus keeps client context attached, and Grant gives the owner visibility. Each role stays in its lane and works from the salon’s rules.'
  ],
  [
    'What happens when the digital team should not answer?',
    'The request is handed to the right person with the conversation and client context already organized. The team does not guess about color corrections, unusual pricing, complaints, refunds, or anything the salon marks for human judgment.'
  ]
];

export default function SalonPageContent() {
  return (
    <>
      <section className="section salon-capabilities-section" aria-labelledby="salon-capabilities-title">
        <div className="salon-section-heading">
          <div>
            <p className="eyebrow">Meet your digital AI team</p>
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

      <section className="section industry-workflow-section salon-workflow-section" aria-labelledby="salon-workflow-title">
        <div className="salon-section-heading salon-workflow-heading">
          <div>
            <p className="eyebrow">How the team works together</p>
            <h2 id="salon-workflow-title">The client gets an answer now. The salon keeps control.</h2>
          </div>
          <p>
            The value is not a callback after the opportunity has cooled. The digital team responds in the moment, carries the right context forward, and brings staff in only when needed.
          </p>
        </div>

        <div className="industry-workflow-list salon-workflow-list">
          {workflowSteps.map(([title, copy], index) => (
            <article className="industry-step salon-workflow-step is-visible" data-reveal key={title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section industry-faq-section salon-faq-section" aria-labelledby="salon-faq-title">
        <div className="salon-section-heading">
          <div>
            <p className="eyebrow">Questions salon owners ask</p>
            <h2 id="salon-faq-title">A digital AI team with clear roles and clear boundaries.</h2>
          </div>
          <p>
            The names make each responsibility easy to understand. The salon still decides the voice, rules, availability, permissions, and human handoffs.
          </p>
        </div>

        <div className="industry-faq-grid salon-faq-grid">
          {salonFaq.map(([question, answer]) => (
            <article className="industry-faq salon-faq-card is-visible" data-reveal key={question}>
              <h3>{question}</h3>
              <p>{answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="demo-cta industry-cta salon-closing-cta is-visible" data-reveal>
        <div>
          <p className="eyebrow">See the digital AI team in your salon</p>
          <h2>Walk through how Vera, Naya, Marcus, and Grant would work around your front desk.</h2>
          <p>
            We will map live calls, booking requests, client messages, rebooking, reminders, staff handoffs, and the owner view around the way your salon already operates.
          </p>
        </div>
        <a className="primary-button" href="/#demo">Request demo</a>
      </section>
    </>
  );
}
