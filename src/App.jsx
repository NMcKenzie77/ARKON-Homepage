import { useEffect, useMemo, useRef, useState } from 'react';
import { coverageLanes, dashboardRows, roleViews, solutions } from './data.js';

const industryPages = {
  '/real-estate': {
    eyebrow: 'Real estate workflow automation',
    title: 'AI workflow automation for real estate teams.',
    description: 'ARKON helps real estate teams protect lead response, showing requests, seller calls, buyer questions, follow-up, agent handoffs, and owner visibility.',
    primary: 'Real estate teams lose deals when leads wait, showing requests sit, seller calls are missed, or agent follow-up depends on someone remembering every detail. ARKON gives the team trained roles for calls, website inquiries, client messages, relationship history, and owner visibility.',
    cards: [
      ['Lead response', 'Porter and Naya help capture website inquiries, answer approved questions, and follow up before a lead goes cold.'],
      ['Calls and showings', 'Vera handles inbound calls, captures what matters, and routes showing or seller requests to the right person.'],
      ['Agent context', 'Marcus keeps lead history, notes, pipeline stage, prior touchpoints, and follow-up context attached.'],
      ['Owner view', 'Grant surfaces what came in, what was handled, who owns the next step, and what needs attention.']
    ],
    workflow: ['Buyer lead asks a question', 'Seller calls about listing timing', 'Showing request comes in', 'Agent gets context before follow-up'],
    faq: [
      ['Can ARKON replace my agents?', 'No. ARKON handles repeatable work and prepares the handoff so agents can focus on conversations, showings, sellers, buyers, and decisions.'],
      ['Can it work with my CRM?', 'ARKON is designed around contact history, notes, pipeline stages, and follow-up records. Specific CRM integrations are handled during implementation.']
    ]
  },
  '/insurance': {
    eyebrow: 'Insurance agency workflow automation',
    title: 'AI workflow automation for insurance agencies.',
    description: 'ARKON helps insurance agencies handle quote requests, policyholder questions, renewals, documents, producer follow-up, CRM updates, and owner visibility.',
    primary: 'Insurance agencies lose time when quote requests, renewal questions, document requests, and producer follow-up scatter across calls, email, texts, and the CRM. ARKON keeps the front office, producers, admins, and owner view connected.',
    cards: [
      ['Quote requests', 'Porter captures website leads and Naya follows up with approved messaging before prospects go cold.'],
      ['Inbound calls', 'Vera answers, qualifies, captures details, and routes policy or quote questions to the right person.'],
      ['CRM memory', 'Marcus keeps contact records, relationship notes, pipeline stage, tags, and follow-up reminders attached.'],
      ['Inbox triage', 'Iris scores urgency and importance so policyholder, carrier, and prospect emails do not get buried.']
    ],
    workflow: ['Prospect asks for a quote', 'Policyholder sends a document request', 'Renewal question comes in', 'Producer gets context before the callback'],
    faq: [
      ['Does ARKON give insurance advice?', 'ARKON should follow the business rules and route licensed or judgment-based questions to the right person.'],
      ['Can it help producers follow up?', 'Yes. ARKON can help prepare follow-up, attach context, update records, and keep the owner informed.']
    ]
  },
  '/short-term-rentals': {
    eyebrow: 'Short-term rental workflow automation',
    title: 'AI workflow automation for short-term rental operators.',
    description: 'ARKON helps short-term rental operators manage guest messages, cleaner coordination, vendor updates, urgent issues, follow-up, and host visibility.',
    primary: 'Short-term rental operators deal with guest messages, cleaner coordination, vendor updates, urgent issues, check-in questions, and host visibility. ARKON keeps stay operations moving without every message landing on the host.',
    cards: [
      ['Guest messages', 'Naya responds in the host’s voice, answers approved questions, and routes sensitive or urgent issues.'],
      ['Website inquiries', 'Porter captures direct booking inquiries and hands warm leads to the business.'],
      ['Inbox triage', 'Iris separates urgent issues, guest needs, vendor messages, and routine inbox activity.'],
      ['Host visibility', 'Grant shows what happened, what was handled, and what needs attention across the stay.']
    ],
    workflow: ['Guest asks a check-in question', 'Cleaner update comes in', 'Vendor issue needs attention', 'Host receives the owner summary'],
    faq: [
      ['Does ARKON handle emergencies?', 'ARKON can flag urgent issues and route them based on business rules. Emergency workflows should be defined before launch.'],
      ['Can it sound like the host?', 'Yes. ARKON is designed to follow the host’s tone, standards, boundaries, and escalation rules.']
    ]
  },
  '/home-services': {
    eyebrow: 'Home services workflow automation',
    title: 'AI workflow automation for home service businesses.',
    description: 'ARKON helps home service businesses handle calls, estimates, repairs, technician updates, scheduling, invoices, customer messages, and owner visibility.',
    primary: 'Home service businesses lose money when calls are missed, estimate requests wait, technicians lack context, invoices create confusion, or customers need updates. ARKON keeps the front desk, field team, admin work, and owner view connected.',
    cards: [
      ['Inbound calls', 'Vera answers calls, qualifies customers, captures job details, and routes urgent or judgment-based requests.'],
      ['Estimate requests', 'Porter captures website requests and Naya follows up when a customer does not convert.'],
      ['Job context', 'Marcus keeps customer history, notes, prior work, and appointment details attached.'],
      ['Owner visibility', 'Grant shows open issues, handled requests, escalations, and next actions.']
    ],
    workflow: ['Customer calls for service', 'Website estimate request comes in', 'Technician needs notes', 'Owner sees what needs attention'],
    faq: [
      ['Can ARKON schedule jobs?', 'ARKON can support scheduling when rules, availability, and calendar workflows are defined.'],
      ['What if a customer needs a price decision?', 'ARKON routes pricing, approval, and judgment calls to a person instead of guessing.']
    ]
  },
  '/professional-services': {
    eyebrow: 'Professional services workflow automation',
    title: 'AI workflow automation for professional service firms.',
    description: 'ARKON helps professional service firms manage intake, scheduling, client questions, document requests, follow-up, handoffs, and owner visibility.',
    primary: 'Professional service firms need clean intake, reliable scheduling, client follow-up, document requests, and owner visibility. ARKON helps keep client context attached so work does not depend on memory or scattered messages.',
    cards: [
      ['Client intake', 'Vera and Porter capture the right details from calls and website inquiries.'],
      ['Client communication', 'Naya responds with the firm’s approved tone, standards, and boundaries.'],
      ['Relationship memory', 'Marcus keeps notes, prior conversations, relationship history, and follow-up context attached.'],
      ['Owner visibility', 'Grant shows what came in, what was handled, who owns the next step, and what needs review.']
    ],
    workflow: ['New client inquiry arrives', 'Document request comes in', 'Follow-up needs to be sent', 'Owner sees what requires attention'],
    faq: [
      ['Can ARKON handle confidential matters?', 'Sensitive workflows should be defined carefully. ARKON can route anything requiring judgment, approval, or privacy review.'],
      ['Does it replace staff?', 'No. ARKON handles repeatable intake and follow-up work so staff can focus on client service and decisions.']
    ]
  },
  '/gyms-fitness-studios': {
    eyebrow: 'Gym and fitness studio workflow automation',
    title: 'AI workflow automation for gyms and fitness studios.',
    description: 'ARKON helps gyms and fitness studios handle membership questions, trial leads, class bookings, personal training inquiries, reminders, staff handoffs, and owner visibility.',
    primary: 'Gyms and fitness studios deal with trial leads, membership questions, class bookings, personal training interest, schedule changes, and member follow-up. ARKON keeps the front desk, coaches, trainers, admin work, and owner view connected.',
    cards: [
      ['Membership inquiries', 'Porter captures website inquiries, trial pass requests, class questions, and personal training interest.'],
      ['Front desk calls', 'Vera answers calls, captures what matters, and routes membership, billing, scheduling, or cancellation questions to the right person.'],
      ['Member communication', 'Naya responds with the studio’s approved tone, sends reminders, follows up on routine questions, and prepares handoffs when staff need to step in.'],
      ['Owner visibility', 'Grant shows what came in, what was handled, who owns the next step, and what needs attention across leads, members, and bookings.']
    ],
    workflow: ['Trial lead asks about joining', 'Member asks about class timing', 'Personal training request comes in', 'Owner sees what needs attention'],
    faq: [
      ['Can ARKON manage membership or cancellation questions?', 'ARKON can collect the right details, follow approved studio rules, and route billing, contract, or judgment-based questions to staff.'],
      ['Can it help with member follow-up?', 'Yes. ARKON can help prepare reminders, follow-up messages, booking support, and staff handoffs when the workflow rules are defined.']
    ]
  }
};

function useReveal(deps = []) {
  useEffect(() => {
    const nodes = document.querySelectorAll('[data-reveal]');
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    nodes.forEach(node => observer.observe(node));
    return () => observer.disconnect();
  }, deps);
}

function useClientSeo(route) {
  useEffect(() => {
    const page = industryPages[route];
    const title = route === '/how-it-works'
      ? 'How ARKON Works | Request Routing, Business Rules, and Owner Visibility'
      : page
        ? `${page.title.replace(/\.$/, '')} | ARKON Systems`
        : 'ARKON Systems | AI Workflow Automation for Service Businesses';
    const description = route === '/how-it-works'
      ? 'See how ARKON handles calls, website inquiries, text messages, email, relationship history, business rules, safe next steps, and owner summaries.'
      : page?.description || 'ARKON Systems gives service businesses an AI operating team for calls, messages, follow-up, scheduling, records, handoffs, and owner visibility.';

    document.title = title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', description);
  }, [route]);
}

function Header() {
  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="ARKON Systems home">
        <span className="brand-mark">A</span>
        <span>
          <strong>ARKON</strong>
          <small>Systems</small>
        </span>
      </a>

      <nav className="desktop-nav" aria-label="Primary navigation">
        <a href="/#how">How it works</a>
        <a href="/#team">Core team</a>
        <a href="/#solutions">Business types</a>
        <a href="/#voice">Your voice</a>
      </nav>

      <a className="nav-cta" href="/#demo">Book a demo</a>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero hero-simple" id="top">
      <div className="hero-background" aria-hidden="true">
        <span className="orb orb-one" />
        <span className="orb orb-two" />
        <span className="grid-glow" />
      </div>

      <div className="hero-inner hero-inner-simple" style={{ width: 'min(1120px, 100%)' }}>
        <div className="hero-copy" data-reveal style={{ maxWidth: '1100px' }}>
          <p className="eyebrow">ARKON Systems</p>
          <h1 style={{ maxWidth: '1100px', fontSize: 'clamp(2.2rem, 4.25vw, 4rem)', lineHeight: 1.02 }}>Let your existing team focus<br />on the work only they can do.</h1>
          <p className="hero-subtitle">
            ARKON handles the repeatable tasks around calls, messages, follow-ups, scheduling,
            documents, estimates, invoices, and handoffs. Your staff can spend less time
            chasing details and more time moving the business forward.
          </p>

          <div className="hero-actions">
            <a className="primary-button" href="/#how">See how it works</a>
            <a className="secondary-button" href="/#solutions">Choose your business type</a>
          </div>

          <div className="proof-line" aria-label="Homepage proof points">
            <span>Repeatable tasks handled</span>
            <span>Team stays focused</span>
            <span>Follow-up covered</span>
            <span>Handoffs prepared</span>
            <span>Owner visibility</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function RequestFlowAnimation({ compact = false }) {
  const entries = [
    { channel: 'Phone call', agent: 'Vera' },
    { channel: 'Website inquiry', agent: 'Porter' },
    { channel: 'Text or client message', agent: 'Naya' },
    { channel: 'Email', agent: 'Iris' }
  ];

  const safeActions = ['Answer', 'Follow up', 'Schedule', 'Update record', 'Create task', 'Route'];
  const ownerStatuses = ['Handled', 'Waiting', 'Escalated', 'Needs review'];

  return (
    <div className={compact ? 'request-animation compact' : 'request-animation'} data-reveal aria-label="Animated ARKON request workflow">
      <div className="request-animation-header">
        <p className="eyebrow">Workflow animation</p>
        <h3>See how a request moves through ARKON.</h3>
        <p>
          The visual shows the control points: who responds first, what ARKON is allowed to do,
          where the history comes from, and what the owner sees.
        </p>
      </div>

      <div className="animation-stage">
        <div className="request-source-node">
          <span>Request comes in</span>
          <strong>Customer, lead, guest, or client</strong>
        </div>

        <div className="entry-node-grid">
          {entries.map(entry => (
            <div className="entry-node" key={entry.channel}>
              <span>{entry.channel}</span>
              <strong>{entry.agent}</strong>
            </div>
          ))}
        </div>

        <div className="flow-connector connector-one"><span /></div>

        <div className="hub-node rules-node">
          <span>Business rules checked</span>
          <strong>Your rules decide what ARKON can handle.</strong>
          <small>Approved answers, scheduling limits, routing rules, escalation triggers, and business voice.</small>
        </div>

        <div className="flow-connector connector-two"><span /></div>

        <div className="hub-node memory-node">
          <span>Relationship history</span>
          <strong>Marcus attaches context.</strong>
          <small>Contact record, notes, last touchpoint, pipeline stage, and follow-up history.</small>
        </div>

        <div className="flow-connector connector-three"><span /></div>

        <div className="action-node">
          <span>Safe next step</span>
          <strong>ARKON takes the allowed action.</strong>
          <div className="safe-action-grid">
            {safeActions.map(action => <em key={action}>{action}</em>)}
          </div>
          <small>If it needs judgment, pricing, approval, or a person, ARKON routes it instead of guessing.</small>
        </div>

        <div className="flow-connector connector-four"><span /></div>

        <div className="hub-node owner-node">
          <span>Owner visibility</span>
          <strong>Grant shows what matters.</strong>
          <div className="owner-status-grid">
            {ownerStatuses.map(status => <em key={status}>{status}</em>)}
          </div>
          <small>What came in, what was handled, who owns the next step, and what needs attention.</small>
        </div>
      </div>
    </div>
  );
}

function WalkthroughSection() {
  const channels = [
    { label: 'Phone call', owner: 'Vera', copy: 'Answers the call, qualifies the caller, captures the details, and routes it when a person is needed.' },
    { label: 'Website inquiry', owner: 'Porter', copy: 'Answers questions before someone books or asks for service, captures the lead, and hands it to the business.' },
    { label: 'Text or client message', owner: 'Naya', copy: 'Responds in the owner’s voice, answers what she can, and follows up when a lead does not convert.' },
    { label: 'Email', owner: 'Iris', copy: 'Reads the inbox, scores urgency and importance, and surfaces what needs attention first.' }
  ];

  return (
    <section className="section walkthrough-section request-entry-section" id="how">
      <div className="section-heading walkthrough-heading" data-reveal>
        <p className="eyebrow">How ARKON moves work forward</p>
        <h2>When someone reaches out, the right role responds.</h2>
        <p>
          Calls, texts, emails, website inquiries, follow-ups, and owner alerts are not handled the same way.
          ARKON routes each request to the role built for that job, keeps the business voice consistent,
          and brings in a person when judgment is needed.
        </p>
      </div>

      <div className="request-entry-layout">
        <div className="request-channel-grid" data-reveal>
          {channels.map(channel => (
            <article className="request-channel-card" key={channel.label}>
              <span>{channel.label}</span>
              <h3>{channel.owner}</h3>
              <p>{channel.copy}</p>
            </article>
          ))}
        </div>

        <div className="request-entry-panel" data-reveal>
          <p className="eyebrow">Deeper walkthrough</p>
          <h3>See how a request moves through ARKON.</h3>
          <p>
            The homepage gives the idea. The full walkthrough shows which role responds first,
            what ARKON is allowed to do, how Marcus keeps history attached, and how Grant keeps the owner informed.
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="/how-it-works">See how ARKON handles a request</a>
            <button
              className="secondary-button audio-button"
              type="button"
              data-elevenlabs-hook="naya-request-flow"
              aria-label="Hear Naya explain the ARKON request workflow"
            >
              Hear Naya explain it
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const cards = [
    {
      number: '01',
      title: 'Know who is reaching out',
      body: 'ARKON recognizes whether it is a customer, lead, vendor, guest, client, tenant, or prospect. The message is handled with the right context from the start.'
    },
    {
      number: '02',
      title: 'Move the work forward',
      body: 'ARKON can answer, follow up, schedule, route, prepare, or flag the issue based on what the business allows and what the situation needs.'
    },
    {
      number: '03',
      title: 'Keep it sounding like your business',
      body: 'Messages follow your tone, standards, and rules, so customers feel like they are still dealing with your team.'
    }
  ];

  return (
    <section className="section idea-section">
      <div className="section-heading" data-reveal>
        <p className="eyebrow">The ARKON idea</p>
        <h2>Every business has work that gets dropped when people get busy.</h2>
        <p>
          Customers call. Messages pile up. Follow-ups get missed. Details live in someone’s head.
          ARKON handles the repeatable work, keeps the right people updated, and helps the day keep
          moving without everything falling back on the owner.
        </p>
      </div>

      <div className="three-card-grid">
        {cards.map(card => (
          <article className="story-card" key={card.number} data-reveal>
            <span>{card.number}</span>
            <h3>{card.title}</h3>
            <p>{card.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function CoreTeam() {
  const coreTeam = [
    {
      name: 'Naya',
      role: 'Client and guest communication',
      copy: 'Handles inbound and outbound messages in the owner’s voice, answers questions, coordinates requests, and follows up after Porter or Vera captures a lead.'
    },
    {
      name: 'Vera',
      role: 'Voice reception',
      copy: 'Answers inbound calls, greets callers in the business name, qualifies the caller, gathers key details, and routes the call when a person is needed.'
    },
    {
      name: 'Porter',
      role: 'Website leads',
      copy: 'Sits on the website, answers questions before someone books or asks for service, captures lead details, and hands the warm lead to the business.'
    },
    {
      name: 'Grant',
      role: 'Owner intelligence',
      copy: 'Reads across the active team, spots patterns, surfaces risks, and gives the owner the digest of what matters, what needs action, and what can be ignored.'
    },
    {
      name: 'Marcus',
      role: 'CRM and relationship memory',
      copy: 'Stores contact records, interaction history, pipeline stages, notes, tags, follow-up reminders, and relationship context for the rest of the team.'
    },
    {
      name: 'Iris',
      role: 'Inbox triage',
      copy: 'Reads incoming email, scores urgency and importance, surfaces a prioritized inbox, sends urgent alerts, and flags new client or lead inquiries to Marcus.'
    }
  ];

  return (
    <section className="section core-team-section" id="team">
      <div className="section-heading" data-reveal>
        <p className="eyebrow">Meet the core team</p>
        <h2>One team, with the right role for each job.</h2>
        <p>
          ARKON is organized around trained roles. Naya, Vera, Porter, Grant, Marcus, and Iris
          handle communication, calls, website leads, owner visibility, relationship history, and inbox triage.
        </p>
      </div>

      <div className="coverage-grid core-team-grid">
        {coreTeam.map(member => (
          <article className="coverage-card core-team-card" key={member.name} data-reveal>
            <span className="role-badge">{member.role}</span>
            <h3>{member.name}</h3>
            <p>{member.copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Solutions() {
  return (
    <section className="section solutions-section" id="solutions">
      <div className="section-heading" data-reveal>
        <p className="eyebrow">Choose your business type</p>
        <h2>Start with the idea. Then choose your kind of business.</h2>
        <p>
          Each business page shows the exact calls, messages, documents, customers, staff,
          and owner view for that kind of business.
        </p>
      </div>

      <div className="solution-grid vertical-grid">
        {solutions.map(solution => (
          <a className="solution-card vertical-card" href={solution.href} key={solution.name} data-reveal>
            <span>{solution.name}</span>
            <h3>{solution.title}</h3>
            <p>{solution.details}</p>
            <strong>See this business type →</strong>
          </a>
        ))}
      </div>
    </section>
  );
}

function VoiceLayer() {
  return (
    <section className="section split-section" id="voice">
      <div className="section-copy" data-reveal>
        <p className="eyebrow">Your voice, not a generic script</p>
        <h2>Customers should feel like they are still dealing with your business.</h2>
        <p>
          ARKON should respond like the owner, receptionist, agent, manager, or host would:
          warm when the moment needs warmth, direct when the answer should be direct, and careful
          when the issue needs a human handoff.
        </p>
      </div>

      <div className="role-console voice-console" data-reveal>
        <div className="role-card">
          <p className="role-badge">Voice standards</p>
          <h3>Same standards. Same tone. Clear escalation when needed.</h3>
          <ul>
            <li>Uses the business’s preferred greetings, tone, and boundaries.</li>
            <li>Keeps answers aligned with how employees actually speak to customers.</li>
            <li>Routes sensitive or urgent issues instead of pretending everything is automated.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function RoleViews() {
  const [activeRole, setActiveRole] = useState(0);
  const selected = roleViews[activeRole];
  const progressRef = useRef(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveRole(index => (index + 1) % roleViews.length);
    }, 4200);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!progressRef.current) return;
    progressRef.current.animate(
      [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }],
      { duration: 4100, easing: 'linear' }
    );
  }, [activeRole]);

  return (
    <section className="section split-section" id="roles">
      <div className="section-copy" data-reveal>
        <p className="eyebrow">The right view for the person about to act</p>
        <h2>Your team sees what needs attention.</h2>
        <p>
          ARKON briefs, coordinates, watches for attention, and prepares each person before
          the call, message, handoff, job, document, or decision.
        </p>
      </div>

      <div className="role-console" data-reveal>
        <div className="role-tabs" role="tablist" aria-label="Role view selector">
          {roleViews.map((view, index) => (
            <button
              type="button"
              role="tab"
              aria-selected={activeRole === index}
              className={activeRole === index ? 'active' : ''}
              key={view.role}
              onClick={() => setActiveRole(index)}
            >
              {view.role}
            </button>
          ))}
        </div>

        <div className="role-card">
          <div className="role-progress"><span ref={progressRef} /></div>
          <p className="role-badge">{selected.badge}</p>
          <h3>{selected.headline}</h3>
          <ul>
            {selected.items.map(item => <li key={item}>{item}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}

function DashboardProof() {
  return (
    <section className="section dashboard-section" data-reveal>
      <div className="dashboard-copy">
        <p className="eyebrow">Owner visibility</p>
        <h2>The owner sees what happened without carrying every detail.</h2>
        <p>
          The point is not another dashboard. The point is that messages become organized actions,
          owners see what matters, and employees start with context.
        </p>
      </div>

      <div className="dashboard-frame" aria-label="ARKON dashboard preview">
        <div className="dashboard-header">
          <div>
            <span>Owner view</span>
            <h3>Today’s attention map</h3>
          </div>
          <strong>Live</strong>
        </div>

        <div className="metric-row">
          <div><span>Messages classified</span><strong>18</strong></div>
          <div><span>Warm handoffs ready</span><strong>7</strong></div>
          <div><span>Owner escalations</span><strong>2</strong></div>
        </div>

        <div className="dashboard-table">
          {dashboardRows.map(row => (
            <div className="dash-row" key={row.label}>
              <span>{row.label}</span>
              <small>{row.owner}</small>
              <strong>{row.status}</strong>
              <em>{row.priority}</em>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Coverage() {
  return (
    <section className="section" id="coverage">
      <div className="section-heading" data-reveal>
        <p className="eyebrow">The work behind each response</p>
        <h2>One customer experience. The right role behind each step.</h2>
        <p>
          The customer experiences one smooth response. Behind the scenes, ARKON activates the
          roles needed for memory, voice, scheduling, preparation, routing, or owner visibility.
        </p>
      </div>

      <div className="coverage-grid">
        {coverageLanes.map(lane => (
          <article className="coverage-card" key={lane.lane} data-reveal>
            <h3>{lane.lane}</h3>
            <p>{lane.copy}</p>
            <div className="chip-row">
              {lane.chips.map(chip => <span key={chip}>{chip}</span>)}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Impact() {
  const items = ['Customers feel remembered', 'Responses sound like the business', 'Employees know what to do', 'Owners see what matters'];
  return (
    <section className="impact-band" data-reveal>
      <p className="eyebrow">How it feels different</p>
      <h2>The business feels present, prepared, and coordinated, even when the owner is not.</h2>
      <div className="impact-list">
        {items.map(item => <span key={item}>{item}</span>)}
      </div>
    </section>
  );
}

function DemoCta() {
  return (
    <section className="demo-cta" id="demo" data-reveal>
      <div>
        <p className="eyebrow">See it for your business</p>
        <h2>Choose the closest business type and walk through the real workflow.</h2>
        <p>
          See how ARKON would handle the calls, messages, follow-ups, documents, staff updates,
          and owner visibility in a business like yours.
        </p>
      </div>
      <form className="demo-form" onSubmit={event => event.preventDefault()}>
        <label>
          Name
          <input type="text" placeholder="Your name" />
        </label>
        <label>
          Email
          <input type="email" placeholder="you@example.com" />
        </label>
        <label>
          Business type
          <select defaultValue="">
            <option value="" disabled>Choose one</option>
            <option>Real estate</option>
            <option>Insurance</option>
            <option>Short-term rentals</option>
            <option>Home services</option>
            <option>Professional services</option>
          </select>
        </label>
        <button className="primary-button" type="submit">Request demo</button>
        <small>Form is front-end only for v1. Connect to backend later.</small>
      </form>
    </section>
  );
}

function HomePage() {
  return (
    <main>
      <Hero />
      <WalkthroughSection />
      <HowItWorks />
      <CoreTeam />
      <Solutions />
      <VoiceLayer />
      <RoleViews />
      <DashboardProof />
      <Coverage />
      <Impact />
      <DemoCta />
    </main>
  );
}

function RequestFlowPage() {
  const channelCards = [
    { label: 'Phone call', name: 'Vera', detail: 'Vera answers, qualifies the caller, gathers details, and routes the call when a person is needed.' },
    { label: 'Website inquiry', name: 'Porter', detail: 'Porter answers pre-booking or pre-service questions, captures the lead, and hands the warm inquiry to the business.' },
    { label: 'Text or client message', name: 'Naya', detail: 'Naya responds in the owner’s voice, handles allowed questions, coordinates requests, and follows up when needed.' },
    { label: 'Email', name: 'Iris', detail: 'Iris reads the inbox, scores urgency and importance, surfaces what matters, and flags new inquiries to Marcus.' }
  ];

  const steps = [
    { number: '01', title: 'The request comes in', copy: 'A call, text, email, website form, guest message, or client message reaches the business.' },
    { number: '02', title: 'The right role responds first', copy: 'Vera, Porter, Naya, or Iris responds based on the channel and the job that needs to be done.' },
    { number: '03', title: 'Business rules are checked', copy: 'Your rules decide what ARKON can answer, schedule, send, update, or route to a person.' },
    { number: '04', title: 'Marcus keeps the history attached', copy: 'Marcus connects the contact record, relationship timeline, pipeline stage, notes, tags, and prior touchpoints.' },
    { number: '05', title: 'ARKON takes the safe next step', copy: 'It can answer, follow up, schedule, update a record, create a task, or route the request for review.' },
    { number: '06', title: 'Grant keeps the owner informed', copy: 'Grant shows what came in, what was handled, who owns the next step, and what needs attention.' }
  ];

  return (
    <main className="request-flow-page" id="request-flow">
      <section className="hero request-flow-hero">
        <div className="hero-background" aria-hidden="true">
          <span className="orb orb-one" />
          <span className="orb orb-two" />
          <span className="grid-glow" />
        </div>
        <div className="request-flow-inner" data-reveal>
          <p className="eyebrow">How ARKON handles a request</p>
          <h1>One business. Different ways people reach out.</h1>
          <p>
            The first response depends on how the person contacted the business. Your business rules decide what ARKON is allowed to do.
            Marcus keeps the relationship history attached, and Grant keeps the owner informed.
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="/">Back to homepage</a>
            <button className="secondary-button audio-button" type="button" data-elevenlabs-hook="naya-request-flow">
              Hear Naya explain it
            </button>
          </div>
        </div>
      </section>

      <section className="section request-animation-section">
        <RequestFlowAnimation />
      </section>

      <section className="section request-route-section">
        <div className="section-heading" data-reveal>
          <p className="eyebrow">Who responds first?</p>
          <h2>The channel decides the first role.</h2>
          <p>
            Every request does not run through every agent. The role built for that channel responds first,
            then the rest of the team supports only when needed.
          </p>
        </div>

        <div className="request-route-grid">
          {channelCards.map(card => (
            <article className="request-route-card" key={card.label} data-reveal>
              <span>{card.label}</span>
              <h3>{card.name}</h3>
              <p>{card.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section request-steps-section">
        <div className="section-heading" data-reveal>
          <p className="eyebrow">What happens next?</p>
          <h2>The request moves forward without hiding the judgment calls.</h2>
          <p>
            ARKON can handle routine work, prepare the next step, or bring in a person.
            The point is not to pretend everything is automatic. The point is to keep the business moving.
          </p>
        </div>

        <div className="request-step-list">
          {steps.map(step => (
            <article className="request-step-card" key={step.number} data-reveal>
              <span>{step.number}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="impact-band request-script-band" data-reveal>
        <p className="eyebrow">Naya narration script</p>
        <h2>“Here’s how ARKON works.”</h2>
        <p>
          When someone reaches out, the request is handled by the role built for that channel.
          Vera answers calls. Porter handles website inquiries. Iris sorts email. I handle client and guest messages in your voice.
          Your business rules decide what ARKON can handle, Marcus keeps the relationship history attached, and Grant keeps the owner informed.
        </p>
      </section>
    </main>
  );
}

function IndustryPage({ page }) {
  return (
    <main className="industry-page">
      <section className="hero industry-hero">
        <div className="hero-background" aria-hidden="true">
          <span className="orb orb-one" />
          <span className="orb orb-two" />
          <span className="grid-glow" />
        </div>
        <div className="industry-hero-inner" data-reveal>
          <p className="eyebrow">{page.eyebrow}</p>
          <h1>{page.title}</h1>
          <p>{page.description}</p>
          <div className="hero-actions">
            <a className="primary-button" href="/#demo">Request demo</a>
            <a className="secondary-button" href="/how-it-works">See how ARKON works</a>
          </div>
        </div>
      </section>

      <section className="section industry-intro-section">
        <div className="section-heading" data-reveal>
          <p className="eyebrow">Why it matters</p>
          <h2>Repeatable work should not depend on memory.</h2>
          <p>{page.primary}</p>
        </div>
        <div className="industry-card-grid">
          {page.cards.map(([title, copy]) => (
            <article className="industry-card" key={title} data-reveal>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section industry-workflow-section">
        <div className="section-heading" data-reveal>
          <p className="eyebrow">Example workflows</p>
          <h2>What ARKON can keep moving.</h2>
          <p>
            Each business gets workflow rules based on its calls, messages, documents, staff roles, and owner view.
          </p>
        </div>
        <div className="industry-workflow-list">
          {page.workflow.map((item, index) => (
            <article className="industry-step" key={item} data-reveal>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{item}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="section industry-faq-section">
        <div className="section-heading" data-reveal>
          <p className="eyebrow">Questions business owners ask</p>
          <h2>Built for control, not guesswork.</h2>
        </div>
        <div className="industry-faq-grid">
          {page.faq.map(([question, answer]) => (
            <article className="industry-faq" key={question} data-reveal>
              <h3>{question}</h3>
              <p>{answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="demo-cta industry-cta" data-reveal>
        <div>
          <p className="eyebrow">See it for your business</p>
          <h2>Walk through the real workflow with ARKON.</h2>
          <p>
            Choose the closest business type, then review the calls, messages, follow-ups, records,
            handoffs, and owner visibility that matter most.
          </p>
        </div>
        <a className="primary-button" href="/#demo">Request demo</a>
      </section>
    </main>
  );
}

function NotFoundPage() {
  return (
    <main className="industry-page">
      <section className="hero industry-hero">
        <div className="industry-hero-inner" data-reveal>
          <p className="eyebrow">Page not found</p>
          <h1>This ARKON page is not available.</h1>
          <p>Return to the homepage or choose a business type to continue.</p>
          <div className="hero-actions">
            <a className="primary-button" href="/">Go home</a>
            <a className="secondary-button" href="/#solutions">Choose business type</a>
          </div>
        </div>
      </section>
    </main>
  );
}

function Footer() {
  const year = useMemo(() => new Date().getFullYear(), []);
  return (
    <footer className="site-footer">
      <div className="brand muted-brand">
        <span className="brand-mark">A</span>
        <span>
          <strong>ARKON</strong>
          <small>Systems</small>
        </span>
      </div>
      <p>© {year} ARKON Systems. Repeatable work handled. Your team stays focused.</p>
    </footer>
  );
}

function getRoute() {
  const pathname = window.location.pathname.replace(/\/$/, '') || '/';
  return pathname;
}

export default function App() {
  const [route, setRoute] = useState(getRoute);
  useReveal([route]);
  useClientSeo(route);

  useEffect(() => {
    const handleRouteChange = () => {
      setRoute(getRoute());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  const page = industryPages[route];

  return (
    <>
      <Header />
      {route === '/' ? <HomePage /> : route === '/how-it-works' ? <RequestFlowPage /> : page ? <IndustryPage page={page} /> : <NotFoundPage />}
      <Footer />
    </>
  );
}
