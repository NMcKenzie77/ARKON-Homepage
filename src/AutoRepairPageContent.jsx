import VerticalClosingCta from './VerticalClosingCta.jsx';
import './auto-repair-page.css';

const teamCards = [
  {
    number: '01',
    title: 'Vera answers repair calls live.',
    copy: 'Vera captures the customer, vehicle, symptoms, drivability, urgency, and preferred timing so the advisor receives a useful intake instead of a vague callback note.'
  },
  {
    number: '02',
    title: 'Naya keeps customers updated and follows up on declined work.',
    copy: 'Naya sends approved status updates, handles routine questions, and brings recommended work back at the right time without pretending to make repair decisions.'
  },
  {
    number: '03',
    title: 'Marcus remembers the customer and vehicle.',
    copy: 'Vehicle history, prior repairs, estimates, declined recommendations, communication preferences, and follow-up context stay attached.'
  },
  {
    number: '04',
    title: 'Grant briefs the owner before the day gets away.',
    copy: 'Grant surfaces vehicles waiting on authorization, customers waiting on updates, missed opportunities, declined work due for follow-up, and issues that need management.'
  }
];

const ownerRows = [
  ['2018 Honda Accord', 'Diagnostic intake needs appointment confirmation', 'Call today'],
  ['RO 10482 · Honda Accord', 'Customer requested estimate review before authorization', 'Advisor needed'],
  ['2020 Toyota RAV4', 'Front-brake work recovered for Friday at 2:30', 'Ready to book'],
  ['2017 Ford F-150', 'No customer update sent since yesterday afternoon', 'At risk']
];

const attentionItems = [
  'Waiting on authorization',
  'Customers waiting on updates',
  'Declined work due',
  'Appointments to confirm',
  'Review risk'
];

export default function AutoRepairPageContent() {
  return (
    <>
      <section className="section auto-repair-team-section" aria-labelledby="auto-repair-team-title">
        <div className="auto-repair-section-heading">
          <div>
            <p className="eyebrow">Meet your auto repair digital AI team</p>
            <h2 id="auto-repair-team-title">Your digital team protects repair opportunities while the shop stays focused on the vehicles already in the bays.</h2>
          </div>
          <p>
            Vera handles the first call. Naya keeps communication and follow-up moving. Marcus keeps the customer and vehicle history attached. Grant shows the owner what needs attention.
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
          <h2 id="auto-repair-control-title">See where repair revenue and customer trust may be slipping.</h2>
          <p>
            Grant shows what changed, what has already been handled, and which vehicles, customers, or decisions need a person. Routine activity stays out of the way.
          </p>
          <div className="auto-repair-attention-list" aria-label="Shop owner attention areas">
            {attentionItems.map(item => <span key={item}>{item}</span>)}
          </div>
        </div>

        <div className="auto-repair-owner-panel" aria-label="Example auto repair owner brief">
          <div className="auto-repair-owner-header">
            <div>
              <span>Grant · Morning shop brief</span>
              <h3>What needs attention before the bays fill up</h3>
            </div>
            <strong>2 items now</strong>
          </div>

          <div className="auto-repair-owner-metrics">
            <div><span>Repair opportunities</span><strong>6</strong></div>
            <div><span>Waiting on approval</span><strong>3</strong></div>
            <div><span>Declined work ready</span><strong>$1,840</strong></div>
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
        title="See how your digital AI team protects repair opportunities without interrupting the shop."
        body="We’ll walk through how Vera handles repair calls, Naya keeps customers updated and follows up on declined work, Marcus keeps vehicle context attached, and Grant shows the owner what needs attention."
        buttonLabel="Book an auto repair walkthrough"
      />
    </>
  );
}
