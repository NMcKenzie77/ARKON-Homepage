import PageBanner from './PageBanner.jsx';
import SalonConversationDemo from './SalonConversationDemo.jsx';

function PricingSection({ plans }) {
  if (!plans?.length) return null;

  return (
    <section className="section pricing-section" id="pricing">
      <div className="section-heading pricing-heading is-visible" data-reveal>
        <p className="eyebrow">Auto repair pricing</p>
        <h2>Start with the right operating layer for the shop.</h2>
        <p>
          These are starting points for scoping ARKON for an auto repair operation. The founder pilot proves
          recovered work and follow-up first, then the account moves to the right monthly level after the workflow is proven.
        </p>
      </div>

      <div className="pricing-grid">
        {plans.map(plan => (
          <article
            className={`${plan.enterprise ? 'pricing-card enterprise-pricing-card' : 'pricing-card'} is-visible`}
            data-reveal
            key={plan.name}
          >
            <div className="pricing-card-topline"><span>{plan.fit}</span></div>
            <h3>{plan.name}</h3>
            <p className="pricing-summary">{plan.summary}</p>
            <div className="pricing-price-row">
              <div><small>Founder pilot</small><strong>{plan.pilot}</strong></div>
              <div><small>Target monthly</small><strong>{plan.target}</strong></div>
            </div>
            <p className="pricing-setup">{plan.setup}</p>
            <ul>{plan.includes.map(item => <li key={item}>{item}</li>)}</ul>
          </article>
        ))}
      </div>

      <div className="pricing-note is-visible" data-reveal>
        <strong>Pricing is scoped after discovery.</strong>
        <span>
          Call volume, number of locations, team size, existing software, live-call coverage,
          and integration depth can change the final quote.
        </span>
      </div>
    </section>
  );
}

function ClosingCta({ route }) {
  const salonCopy = route === '/salons';

  return (
    <section className="demo-cta industry-cta is-visible" data-reveal>
      <div>
        <p className="eyebrow">{salonCopy ? 'See it in your salon' : 'See it for your business'}</p>
        <h2>
          {salonCopy
            ? 'Walk through the booking and follow-up workflow with ARKON.'
            : 'Walk through the real workflow with ARKON.'}
        </h2>
        <p>
          {salonCopy
            ? 'Review how missed calls, booking requests, client follow-up, staff handoffs, reminders, and owner visibility would work inside your salon.'
            : 'Review the calls, messages, follow-ups, records, handoffs, and owner visibility that matter most for your operation.'}
        </p>
      </div>
      <a className="primary-button" href="/#demo">Request demo</a>
    </section>
  );
}

export default function IndustryPage({ page, route }) {
  return (
    <main className="industry-page" data-business-route={route}>
      <PageBanner page={page} route={route} animate={false} />

      {route === '/salons' ? <SalonConversationDemo /> : null}

      {page.reality ? (
        <section className="industry-reality-panel is-visible" data-reveal>
          <p className="eyebrow">{page.reality.eyebrow}</p>
          <h2>{page.reality.title}</h2>
          {page.reality.body.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
          <div className="industry-reality-callout"><strong>{page.reality.callout}</strong></div>
        </section>
      ) : null}

      <section className="section industry-intro-section">
        <div className="section-heading is-visible" data-reveal>
          <p className="eyebrow">Why it matters</p>
          <h2>Repeatable work should not depend on memory.</h2>
          <p>{page.primary}</p>
        </div>
        <div className="industry-card-grid">
          {page.cards.map(([title, copy]) => (
            <article className="industry-card is-visible" key={title} data-reveal>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <PricingSection plans={page.pricing} />

      <section className="section industry-workflow-section">
        <div className="section-heading is-visible" data-reveal>
          <p className="eyebrow">Example workflows</p>
          <h2>What ARKON can keep moving.</h2>
          <p>
            Each business gets workflow rules based on its calls, messages, documents,
            staff roles, and owner view.
          </p>
        </div>
        <div className="industry-workflow-list">
          {page.workflow.map((item, index) => (
            <article className="industry-step is-visible" key={item} data-reveal>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{item}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="section industry-faq-section">
        <div className="section-heading is-visible" data-reveal>
          <p className="eyebrow">Questions business owners ask</p>
          <h2>Built for control, not guesswork.</h2>
        </div>
        <div className="industry-faq-grid">
          {page.faq.map(([question, answer]) => (
            <article className="industry-faq is-visible" key={question} data-reveal>
              <h3>{question}</h3>
              <p>{answer}</p>
            </article>
          ))}
        </div>
      </section>

      <ClosingCta route={route} />
    </main>
  );
}
