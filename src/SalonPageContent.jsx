import './salon-page.css';

const salonCards = [
  {
    number: '01',
    title: 'Missed calls become conversations.',
    copy: 'When the team cannot answer, Naya can text back, find out what the client needs, and keep the booking from disappearing.'
  },
  {
    number: '02',
    title: 'Booking questions get answered.',
    copy: 'Services, timing, approved policies, stylist preferences, and open appointment windows stay available without interrupting the floor.'
  },
  {
    number: '03',
    title: 'Past clients get a natural nudge.',
    copy: 'Naya can reach out based on service history and the salon’s rebooking rhythm instead of sending a generic blast.'
  },
  {
    number: '04',
    title: 'Staff only see what needs judgment.',
    copy: 'Color corrections, complaints, pricing exceptions, and sensitive requests arrive as clean handoffs with the conversation attached.'
  }
];

const workflowSteps = [
  ['Client reaches out', 'A call, text, or online request comes in while the team is with clients.'],
  ['Naya checks the rules', 'She uses the salon’s services, timing, staff preferences, approved language, and available appointment windows.'],
  ['The next step happens', 'Naya books, reschedules, follows up, or asks one clear question to keep the conversation moving.'],
  ['The team stays in control', 'Anything unusual is handed to the right person with the client history and current request already organized.']
];

const handoffItems = [
  'Color corrections',
  'Pricing exceptions',
  'Complaints or refunds',
  'Sensitive client requests',
  'Stylist-specific judgment'
];

const ownerRows = [
  ['Jasmine R.', 'Rebooking conversation', 'Booked'],
  ['Alicia M.', 'Asked about color correction', 'Needs staff'],
  ['Brianna K.', 'Missed-call follow-up', 'Waiting'],
  ['Dana S.', 'Saturday appointment request', 'Booked']
];

const salonFaq = [
  [
    'Will clients know Naya is the virtual front desk?',
    'Yes. The salon decides how Naya is introduced, but she should never pretend to be a human employee. She can still sound natural, use the salon’s voice, and feel like part of the team.'
  ],
  [
    'What happens when a client asks something Naya should not answer?',
    'Naya stops, captures what the client needs, and sends the conversation to the right person. She does not guess about pricing, corrections, complaints, or anything the salon marks for human review.'
  ]
];

export default function SalonPageContent() {
  return (
    <>
      <section className="section salon-capabilities-section" aria-labelledby="salon-capabilities-title">
        <div className="salon-section-heading">
          <div>
            <p className="eyebrow">What Naya handles</p>
            <h2 id="salon-capabilities-title">Front-desk work should keep moving even when every chair is full.</h2>
          </div>
          <p>
            Naya is not there to replace the salon team. She keeps the repeatable conversations moving so clients get an answer and staff can stay focused on the person in the chair.
          </p>
        </div>

        <div className="industry-card-grid salon-capability-grid">
          {salonCards.map(card => (
            <article className="industry-card is-visible" data-reveal key={card.number}>
              <span>{card.number}</span>
              <h3>{card.title}</h3>
              <p>{card.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section salon-control-section" aria-labelledby="salon-control-title">
        <div className="salon-control-copy">
          <p className="eyebrow">The handoff matters</p>
          <h2 id="salon-control-title">Naya knows when the conversation belongs to your team.</h2>
          <p>
            The salon defines the boundaries. Naya handles the approved, repeatable work and moves anything sensitive, unusual, or judgment-based to the right person.
          </p>

          <div className="salon-handoff-list" aria-label="Examples of staff handoffs">
            {handoffItems.map(item => <span key={item}>{item}</span>)}
          </div>
        </div>

        <div className="salon-owner-panel" aria-label="Example salon owner view">
          <div className="salon-owner-header">
            <div>
              <span>Today</span>
              <h3>What needs attention</h3>
            </div>
            <strong>2 staff handoffs</strong>
          </div>

          <div className="salon-owner-metrics">
            <div><span>Booked</span><strong>7</strong></div>
            <div><span>Waiting</span><strong>3</strong></div>
            <div><span>Needs staff</span><strong>2</strong></div>
          </div>

          <div className="salon-owner-rows">
            {ownerRows.map(([name, request, status]) => (
              <div className="salon-owner-row" key={`${name}-${request}`}>
                <span className="salon-owner-avatar" aria-hidden="true">{name.charAt(0)}</span>
                <div><strong>{name}</strong><small>{request}</small></div>
                <em className={`salon-owner-status salon-owner-status-${status.toLowerCase().replace(' ', '-')}`}>{status}</em>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section industry-workflow-section salon-workflow-section" aria-labelledby="salon-workflow-title">
        <div className="salon-section-heading salon-workflow-heading">
          <div>
            <p className="eyebrow">How a request moves</p>
            <h2 id="salon-workflow-title">A client gets an answer. The team keeps control.</h2>
          </div>
          <p>
            The useful part is not just replying quickly. It is knowing what to say, what to check, what to record, and when to bring a person in.
          </p>
        </div>

        <div className="industry-workflow-list salon-workflow-list">
          {workflowSteps.map(([title, copy], index) => (
            <article className="industry-step is-visible" data-reveal key={title}>
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
            <h2 id="salon-faq-title">Natural with clients. Controlled by the salon.</h2>
          </div>
          <p>
            Naya can feel like part of the front desk without hiding what she is or crossing the boundaries the salon sets.
          </p>
        </div>

        <div className="industry-faq-grid salon-faq-grid">
          {salonFaq.map(([question, answer]) => (
            <article className="industry-faq is-visible" data-reveal key={question}>
              <h3>{question}</h3>
              <p>{answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="demo-cta industry-cta salon-closing-cta is-visible" data-reveal>
        <div>
          <p className="eyebrow">See Naya in your salon</p>
          <h2>Walk through the booking and follow-up rules your team already uses.</h2>
          <p>
            We will map missed calls, booking requests, rebooking, reminders, staff handoffs, and the owner view around the way your salon actually works.
          </p>
        </div>
        <a className="primary-button" href="/#demo">Request demo</a>
      </section>
    </>
  );
}
