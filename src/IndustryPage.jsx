import PageBanner from './PageBanner.jsx';
import RealEstateCallDemo from './RealEstateCallDemo.jsx';
import RealEstatePageContent from './RealEstatePageContent.jsx';
import SalonConversationDemo from './SalonConversationDemo.jsx';
import SalonPageContent from './SalonPageContent.jsx';
import AutoRepairConversationDemo from './AutoRepairConversationDemo.jsx';
import AutoRepairPageContent from './AutoRepairPageContent.jsx';
import VerticalClosingCta from './VerticalClosingCta.jsx';
import { industryPages } from './site-content.js';
import { getRelatedPages } from './seo-structure.js';

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

function RelatedBusinessPages({ route }) {
  const relatedPages = getRelatedPages(route, industryPages);
  if (!relatedPages.length) return null;

  return (
    <section className="section industry-related-section">
      <div className="section-heading is-visible" data-reveal>
        <p className="eyebrow">Related business workflows</p>
        <h2>See how the same operating approach applies elsewhere.</h2>
        <p>
          Each page focuses on the calls, messages, records, handoffs, and owner visibility
          that matter in that kind of business.
        </p>
      </div>
      <div className="industry-related-grid">
        {relatedPages.map(({ path, page }) => (
          <a className="industry-related-card is-visible" href={path} key={path} data-reveal>
            <span>{page.eyebrow}</span>
            <h3>{page.title}</h3>
            <p>{page.description}</p>
            <strong>View workflow</strong>
          </a>
        ))}
      </div>
    </section>
  );
}

export default function IndustryPage({ page, route }) {
  if (route === '/real-estate') {
    const realEstateBannerPage = {
      ...page,
      eyebrow: 'Real estate digital AI team',
      title: 'Answer new leads now. Re-engage the opportunities already in your database.',
      description:
        'Vera answers in the office’s name, Paige provides approved listing and property intelligence, Naya follows up with past buyers and sellers, Marcus keeps relationship context attached, and Grant shows which opportunities need an agent.'
    };

    return (
      <main className="industry-page real-estate-page" data-business-route={route}>
        <PageBanner page={realEstateBannerPage} route={route} animate={false} />
        <RealEstateCallDemo />
        <RealEstatePageContent />
      </main>
    );
  }

  if (route === '/salons') {
    const salonBannerPage = {
      ...page,
      eyebrow: 'Salon digital AI team',
      title: 'Every call answered. Every booking opportunity kept alive.',
      description:
        'ARKON gives your salon a named digital AI team. Vera answers calls live, Naya handles messages and follow-up, Marcus keeps client history attached, and Grant shows the owner what needs attention.'
    };

    return (
      <main className="industry-page salon-page" data-business-route={route}>
        <PageBanner page={salonBannerPage} route={route} animate={false} />
        <SalonConversationDemo />
        <SalonPageContent />
      </main>
    );
  }

  if (route === '/garages') {
    const autoRepairBannerPage = {
      ...page,
      eyebrow: 'Auto repair digital AI team',
      title: 'Stop losing repair work while everyone is busy working on cars.',
      description:
        'Vera answers repair calls live, Naya keeps customers updated and follows up on declined work, Marcus keeps customer and vehicle history attached, and Grant shows the owner what needs attention.'
    };

    return (
      <main className="industry-page auto-repair-page" data-business-route={route}>
        <PageBanner page={autoRepairBannerPage} route={route} animate={false} />
        <AutoRepairConversationDemo />
        <AutoRepairPageContent />
      </main>
    );
  }

  return (
    <main className="industry-page" data-business-route={route}>
      <PageBanner page={page} route={route} animate={false} />

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

      <RelatedBusinessPages route={route} />

      <VerticalClosingCta
        eyebrow={`See ARKON for ${page.eyebrow.toLowerCase()}`}
        title="Walk through the real workflow with ARKON."
        body="Review the calls, messages, follow-ups, records, handoffs, and owner visibility that matter most for your operation."
        buttonLabel="Request demo"
      />
    </main>
  );
}
