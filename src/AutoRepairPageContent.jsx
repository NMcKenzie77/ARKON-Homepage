import VerticalClosingCta from './VerticalClosingCta.jsx';
import './auto-repair-page.css';

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
    copy: 'Marcus keeps the customer, vehicle, recommendations, estimates, and conversations attached. Grant shows the owner which opportunities and customer issues need attention.'
  }
];

const ownerRows = [
  ['Michael Torres · 2018 Honda Accord', 'Deferred front-brake work recovered at the prior $680 estimate', 'Ready to book'],
  ['Angela Brooks · 2021 Toyota RAV4', 'Oil service and tire rotation scheduled for Friday at 2:30', 'Scheduled'],
  ['Michael Torres · 2018 Honda Accord', 'New diagnostic concern needs appointment confirmation', 'Call today'],
  ['2017 Ford F-150', 'Customer has not received an update since yesterday afternoon', 'At risk']
];

const attentionItems = [
  'Deferred work ready to schedule',
  'Upcoming maintenance due',
  'New repair calls',
  'Customers waiting on updates',
  'Appointments to confirm'
];

export default function AutoRepairPageContent() {
  return (
    <>
      <section className="section auto-repair-team-section" aria-labelledby="auto-repair-team-title">
        <div className="auto-repair-section-heading">
          <div>
            <p className="eyebrow">Meet your auto repair digital AI team</p>
            <h2 id="auto-repair-team-title">The shop reaches the right customer with the right vehicle context before the opportunity disappears.</h2>
          </div>
          <p>
            Naya brings deferred and upcoming maintenance back into the schedule. Vera handles new repair calls. Marcus keeps the customer and vehicle history attached. Grant shows the owner what needs attention.
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

      <section className="section auto-repair-control-section" aria-labelledby="auto-repair-control-title">
        <div className="auto-repair-control-copy">
          <p className="eyebrow">Your shop-owner brief</p>
          <h2 id="auto-repair-control-title">See which customers are ready to return and what still needs a person.</h2>
          <p>
            Grant shows what changed, what has already been handled, and where repair revenue or customer trust may be slipping. Routine activity stays out of the way.
          </p>
          <div className="auto-repair-attention-list" aria-label="Shop owner attention areas">
            {attentionItems.map(item => <span key={item}>{item}</span>)}
          </div>
        </div>

        <div className="auto-repair-owner-panel" aria-label="Example auto repair owner brief">
          <div className="auto-repair-owner-header">
            <div>
              <span>Grant · Morning shop brief</span>
              <h3>Customers ready to return, appointments moving, and issues at risk</h3>
            </div>
            <strong>2 items now</strong>
          </div>

          <div className="auto-repair-owner-metrics">
            <div><span>Deferred work recovered</span><strong>$1,840</strong></div>
            <div><span>Maintenance visits scheduled</span><strong>4</strong></div>
            <div><span>New repair opportunities</span><strong>6</strong></div>
          </div>

          <div className="auto-repair-owner-rows">
            {ownerRows.map(([title, detail, status]) => (
              <div className="auto-repair-owner-row" key={`${title}-${status}`}>
                <span className="auto-repair-owner-avatar" aria-hidden="true">{title.charAt(0)}</span>
                <div><strong>{title}</strong><small>{detail}</small></div>
                <em>{status}</em>
              </div>
            ))}
          </div>
        </div>
      </section>

      <VerticalClosingCta
        eyebrow="See ARKON for auto repair"
        title="See how personalized customer follow-up brings the right work back into the shop."
        body="We’ll walk through how Naya uses customer and vehicle history to recover deferred work and schedule upcoming maintenance, how Vera handles new repair calls, how Marcus keeps the context attached, and how Grant shows the owner what needs attention."
        buttonLabel="Book an auto repair walkthrough"
      />
    </>
  );
}
