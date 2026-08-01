import PageBanner from './PageBanner.jsx';
import RealEstateCallDemo from './RealEstateCallDemo.jsx';
import RealEstatePageContent from './RealEstatePageContent.jsx';
import SalonConversationDemo from './SalonConversationDemo.jsx';
import SalonPageContent from './SalonPageContent.jsx';
import AutoRepairConversationDemo from './AutoRepairConversationDemo.jsx';
import AutoRepairPageContent from './AutoRepairPageContent.jsx';
import InsuranceCallDemo from './InsuranceCallDemo.jsx';
import ShortTermRentalCallDemo from './ShortTermRentalCallDemo.jsx';
import ShortTermRentalGrantSection from './ShortTermRentalGrantSection.jsx';
import VerticalClosingCta from './VerticalClosingCta.jsx';
import { industryPages } from './site-content.js';
import { getRelatedPages } from './seo-structure.js';
import './insurance-page.css';
import './real-estate-dashboard-preview.css';

const insuranceTeamCards = [
  {
    number: '01',
    title: 'Vera turns inbound calls into organized opportunities.',
    copy: 'Vera answers in the agency’s name, captures the prospect, business or household, requested coverage, timing, and preferred contact method, then routes anything requiring licensed advice to a producer.'
  },
  {
    number: '02',
    title: 'Naya keeps quote and renewal follow-up from disappearing.',
    copy: 'Naya follows up using the prospect’s name, requested coverage, prior producer conversation, renewal timing, missing information, and preferred communication method.'
  },
  {
    number: '03',
    title: 'Marcus keeps the relationship and policy context attached.',
    copy: 'Marcus connects contacts, businesses, household members, policies, quote history, documents, conversations, assigned producers, and the next required action.'
  },
  {
    number: '04',
    title: 'Iris and Grant keep agency priorities visible.',
    copy: 'Iris separates urgent policyholder, carrier, underwriting, and prospect messages from routine email. Grant gives the agency owner, sales manager, service manager, or producer an on-demand briefing of what needs attention.'
  }
];

const insuranceGrantStats = [
  ['$86,400', 'Premium opportunity in motion'],
  ['14', 'Open quote opportunities'],
  ['9', 'Renewals due within 30 days'],
  ['4', 'Priority actions', 'alert']
];

const insuranceGrantActions = [
  ['01', 'Contact Torres Heating & Cooling before its September 1 renewal.', 'Commercial renewal', 'red'],
  ['02', 'Review Angela Brooks’s homeowners application before closing.', 'Closing deadline', 'amber'],
  ['03', 'Resolve the missing loss runs for Lakeside Transport.', 'Underwriting blocked', 'red'],
  ['04', 'Respond to the urgent carrier notice for Daniel Reyes.', 'Client service', 'amber']
];

const insuranceGrantPipelineStats = [
  ['14', 'Open quote opportunities'],
  ['9', 'Renewals due within 30 days'],
  ['6', 'Service requests open'],
  ['3', 'Items waiting on documents']
];

const insuranceGrantMomentum = [
  ['Commercial pipeline', '$58,200', '7 open opportunities', 'Active', 'green'],
  ['Personal-lines pipeline', '$28,200', '7 open opportunities', 'Healthy', 'green'],
  ['Renewals and retention', '9 due soon', '2 need producer contact', 'Needs attention', 'amber'],
  ['Policy-service queue', '6 open requests', '1 carrier notice urgent', 'Needs attention', 'red'],
  ['Underwriting and documents', '3 incomplete files', '1 quote blocked', 'At risk', 'red']
];

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

function InsuranceTeamSection() {
  return (
    <section className="section insurance-team-section" aria-labelledby="insurance-team-title">
      <div className="insurance-section-heading">
        <div>
          <p className="eyebrow">Meet your insurance agency digital team</p>
          <h2 id="insurance-team-title">Every quote request, service need, and follow-up reaches the right person with the context already attached.</h2>
        </div>
        <p>
          Vera answers new quote and policy-service calls. Naya follows up with prospects and policyholders using the actual coverage request and prior conversation. Marcus keeps relationship and policy context connected. Iris separates urgent agency email from routine activity. Grant briefs agency leadership whenever they need it.
        </p>
      </div>

      <div className="industry-card-grid insurance-team-grid">
        {insuranceTeamCards.map(card => (
          <article className="industry-card insurance-team-card is-visible" data-reveal key={card.number}>
            <span>{card.number}</span>
            <h3>{card.title}</h3>
            <p>{card.copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function InsuranceGrantSection() {
  return (
    <section className="section real-estate-grant-section insurance-grant-section" aria-labelledby="insurance-grant-title">
      <div className="real-estate-grant-copy">
        <p className="eyebrow real-estate-grant-eyebrow">Your agency chief of staff</p>
        <h2 id="insurance-grant-title">Grant shows agency leadership what needs attention before revenue, service, or client trust slips.</h2>
        <p>
          Grant gives the agency owner, sales manager, service manager, or producer a clear briefing whenever they need it. He connects new quote opportunities, renewals, policy-service requests, missing documents, underwriting issues, producer follow-up, carrier messages, and anything waiting on a decision.
        </p>
        <div className="real-estate-grant-points" aria-label="Grant agency briefing and visibility areas">
          <span>Briefings available on demand</span>
          <span>Prioritized agency action list</span>
          <span>Daily, weekly, or custom summaries</span>
        </div>
      </div>

      <div className="real-estate-dashboard-preview" aria-label="Preview of the Grant insurance agency command center">
        <aside className="grant-preview-sidebar">
          <div className="grant-preview-logo">ARK<span>O</span>N</div>
          <nav tabIndex="0" aria-label="Example ARKON insurance dashboard navigation">
            <span>Today</span>
            <span>Prospects · Marcus</span>
            <span>Policies · Marcus</span>
            <span>Calls · Vera</span>
            <span>Follow-up · Naya</span>
            <span>Quotes</span>
            <span>Applications</span>
            <span>Renewals</span>
            <span>Service requests</span>
            <span>Inbox · Iris</span>
            <span className="active">Briefings · Grant</span>
            <span>Settings</span>
          </nav>
          <div className="grant-preview-user">Harbor Ridge Insurance Group<small>Sign out</small></div>
        </aside>

        <div className="grant-preview-main">
          <div className="grant-preview-topline">
            <div>
              <h3>Harbor Ridge Insurance Group Command Center · Grant</h3>
              <p>Where the agency stands, what needs attention, what opportunities are moving, and where revenue, service, or client trust may be slipping.</p>
            </div>
            <div className="grant-preview-actions"><span>Custom summary</span><strong>Run briefing</strong></div>
          </div>

          <div className="grant-preview-briefing">
            <div className="grant-preview-briefing-head">
              <div>
                <span>Grant briefing</span>
                <h4>Four items need attention today.</h4>
              </div>
              <strong>Needs attention</strong>
            </div>
            <p>
              You have $86,400 in premium opportunity in motion, 14 open quote opportunities, and nine renewals due within 30 days. Torres Heating & Cooling needs producer contact before its September 1 renewal, Angela Brooks’s homeowners application needs review before closing, Lakeside Transport is blocked by missing loss runs, and Daniel Reyes has an urgent carrier notice waiting for a response.
            </p>
            <div className="grant-preview-briefing-footer">
              <span>Generated on demand</span>
              <div><strong>▶ Read briefing</strong><em>Copy script</em></div>
            </div>
          </div>

          <div className="grant-preview-stats grant-preview-money-stats">
            {insuranceGrantStats.map(([value, label, tone]) => (
              <div className={`grant-preview-stat${tone ? ` ${tone}` : ''}`} key={label}>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>

          <div className="grant-preview-card grant-preview-priority-card">
            <div className="grant-preview-card-heading">
              <h4>What needs attention today</h4>
              <span>Prioritized agency action list</span>
            </div>
            <div className="grant-preview-priority-list">
              {insuranceGrantActions.map(([number, action, timing, tone]) => (
                <div key={number}>
                  <span>{number}</span>
                  <strong>{action}</strong>
                  <em className={`grant-preview-tag ${tone}`}>{timing}</em>
                </div>
              ))}
            </div>
          </div>

          <div className="grant-preview-stats grant-preview-calendar-stats">
            {insuranceGrantPipelineStats.map(([value, label]) => (
              <div className="grant-preview-stat" key={label}>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>

          <div className="grant-preview-two-column grant-preview-command-bottom">
            <div className="grant-preview-card grant-preview-momentum-card">
              <div className="grant-preview-card-heading">
                <h4>Agency momentum</h4>
                <span>Where opportunities and service work stand</span>
              </div>
              <div className="grant-preview-momentum-list">
                {insuranceGrantMomentum.map(([name, pipeline, opportunities, signal, tone]) => (
                  <div key={name}>
                    <strong>{name}</strong>
                    <span>{pipeline}</span>
                    <span>{opportunities}</span>
                    <em className={`grant-preview-tag ${tone}`}>{signal}</em>
                  </div>
                ))}
              </div>
            </div>

            <div className="grant-preview-card grant-preview-digest-card">
              <div className="grant-preview-card-heading">
                <h4>Executive agency summary</h4>
                <span>On demand or scheduled</span>
              </div>
              <p>
                Grant connects activity across calls, quote requests, applications, renewals, policy service, producer follow-up, carrier email, and staff handoffs, then identifies what needs attention next.
              </p>
              <div className="grant-preview-digest-footer"><span>Summary archive ready</span><strong>Read latest summary</strong></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function IndustryPage({ page, route }) {
  if (route === '/real-estate') {
    const realEstateBannerPage = {
      ...page,
      eyebrow: 'Real estate digital team',
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
      eyebrow: 'Salon digital team',
      title: 'Keep every call and booking opportunity moving.',
      description:
        'ARKON gives your salon a named digital team. Vera answers calls live, Naya handles messages and follow-up, Marcus keeps client history attached, and Grant shows the owner what needs attention.'
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
      eyebrow: 'Auto repair digital team',
      title: 'Bring customers back for the work their vehicles still need.',
      description:
        'Naya uses each customer’s vehicle history, prior recommendations, estimates, timing, and communication preferences to recover deferred work and schedule upcoming maintenance. Vera answers new repair calls, Marcus keeps the history attached, and Grant shows the owner what needs attention.'
    };

    return (
      <main className="industry-page auto-repair-page" data-business-route={route}>
        <PageBanner page={autoRepairBannerPage} route={route} animate={false} />
        <AutoRepairConversationDemo />
        <AutoRepairPageContent />
      </main>
    );
  }

  const isInsurance = route === '/insurance';
  const isShortTermRental = route === '/short-term-rentals';
  const bannerPage = isInsurance
    ? {
        ...page,
        eyebrow: 'Insurance agency digital team',
        title: 'Turn more quote requests into conversations before the prospect moves on.',
        description:
          'Vera answers new quote and policy-service calls in the agency’s name. Naya follows up with prospects using the coverage request, prior conversation, producer, and preferred contact method. Marcus keeps the relationship and policy context attached. Grant briefs the agency owner, sales manager, or producer whenever they need it.'
      }
    : page;

  return (
    <main className={`industry-page${isInsurance ? ' insurance-page' : ''}${isShortTermRental ? ' short-term-rental-page' : ''}`} data-business-route={route}>
      <PageBanner page={bannerPage} route={route} animate={false} />
      {isInsurance ? <InsuranceCallDemo /> : null}
      {isShortTermRental ? <ShortTermRentalCallDemo /> : null}

      {page.reality ? (
        <section className="industry-reality-panel is-visible" data-reveal>
          <p className="eyebrow">{page.reality.eyebrow}</p>
          <h2>{page.reality.title}</h2>
          {page.reality.body.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
          <div className="industry-reality-callout"><strong>{page.reality.callout}</strong></div>
        </section>
      ) : null}

      {isInsurance ? (
        <>
          <InsuranceTeamSection />
          <InsuranceGrantSection />
        </>
      ) : isShortTermRental ? (
        <ShortTermRentalGrantSection />
      ) : (
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
      )}

      {!isInsurance && !isShortTermRental ? (
        <>
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
        </>
      ) : null}

      {!isShortTermRental ? <RelatedBusinessPages route={route} /> : null}

      <VerticalClosingCta
        eyebrow={
          isInsurance
            ? 'See ARKON for insurance agencies'
            : isShortTermRental
              ? 'See ARKON for short-term rental portfolios'
              : `See ARKON for ${page.eyebrow.toLowerCase()}`
        }
        title={
          isInsurance
            ? 'See how your agency can respond faster without putting licensed decisions in the wrong hands.'
            : isShortTermRental
              ? 'Turn a good stay into the kind of experience guests review, remember, and book again.'
              : 'Walk through the real workflow with ARKON.'
        }
        body={
          isInsurance
            ? 'We’ll walk through how your digital team handles new quote requests, policy-service calls, prospect and renewal follow-up, relationship and policy context, urgent agency email, and on-demand leadership briefings.'
            : isShortTermRental
              ? 'See how your digital team handles guest questions, personalized recommendations, cleaner turnovers, maintenance follow-up, review timing, return-stay opportunities, and owner briefings across the portfolio.'
              : 'Review the calls, messages, follow-ups, records, handoffs, and owner visibility that matter most for your operation.'
        }
        buttonLabel={
          isInsurance
            ? 'Book an insurance agency walkthrough'
            : isShortTermRental
              ? 'Book a short-term rental walkthrough'
              : 'Request demo'
        }
      />
    </main>
  );
}
