import { useEffect, useMemo, useRef, useState } from 'react';
import { agentRoster, coverageLanes, dashboardRows, roleViews, solutions, workflowSteps } from './data.js';

function useReveal() {
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
  }, []);
}

function Header() {
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="ARKON Systems home">
        <span className="brand-mark">A</span>
        <span>
          <strong>ARKON</strong>
          <small>Systems</small>
        </span>
      </a>

      <nav className="desktop-nav" aria-label="Primary navigation">
        <a href="#how">How it works</a>
        <a href="#solutions">Verticals</a>
        <a href="#voice">Your voice</a>
        <a href="#coverage">Coverage</a>
      </nav>

      <a className="nav-cta" href="#demo">Book a demo</a>
    </header>
  );
}

function FlowPanel() {
  const [active, setActive] = useState(0);
  const step = workflowSteps[active];
  const activeAgents = new Set(step.agents);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive(index => (index + 1) % workflowSteps.length);
    }, 3300);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="flow-panel walkthrough-panel" aria-label="Universal ARKON message walkthrough">
      <div className="panel-topline">
        <span className="live-dot" />
        How ARKON handles one message
        <strong>{step.time}</strong>
      </div>

      <div className="incoming-message">
        <span>Incoming message</span>
        <p>“Hi, I reached out last week. Can someone follow up with me tomorrow?”</p>
      </div>

      <div className="decision-card">
        <div className="decision-marker">{step.marker}</div>
        <div>
          <p>{step.eyebrow}</p>
          <h3>{step.title}</h3>
          <span>{step.detail}</span>
        </div>
      </div>

      <div className="context-strip">
        <span>Decision note</span>
        <strong>{step.meta}</strong>
      </div>

      <div className="agent-rail" aria-label="Active ARKON roles">
        {agentRoster.map(agent => (
          <span className={activeAgents.has(agent) ? 'active' : ''} key={agent}>{agent}</span>
        ))}
      </div>

      <div className="flow-timeline" role="list" aria-label="Flow timeline">
        {workflowSteps.map((item, index) => (
          <button
            key={item.eyebrow}
            className={index === active ? 'timeline-step active' : 'timeline-step'}
            onClick={() => setActive(index)}
            type="button"
          >
            <span>{item.marker}</span>
            {item.time}
          </button>
        ))}
      </div>
    </div>
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

      <div className="hero-inner hero-inner-simple">
        <div className="hero-copy" data-reveal>
          <p className="eyebrow">One message. The right response. The right handoff.</p>
          <h1>Your business should know what to do next.</h1>
          <p className="hero-subtitle">
            ARKON checks who is reaching out, what they need, what happened last,
            and how your team would normally respond — then replies, routes, schedules,
            or briefs the right person.
          </p>

          <div className="hero-actions">
            <a className="primary-button" href="#solutions">Choose your business type</a>
            <a className="secondary-button" href="#how">See how it works</a>
          </div>

          <div className="proof-line" aria-label="Homepage proof points">
            <span>Known or new?</span>
            <span>Need understood</span>
            <span>Business voice</span>
            <span>Safe routing</span>
            <span>Team brief</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function WalkthroughSection() {
  return (
    <section className="section walkthrough-section" id="how">
      <div className="section-heading walkthrough-heading" data-reveal>
        <p className="eyebrow">What happens after something comes in</p>
        <h2>One message becomes a decision, a response, and a handoff.</h2>
        <p>
          The hero gives the owner the idea. This is the proof: ARKON does not just answer.
          It checks context, decides the safest next step, uses the business voice, and briefs
          the person responsible.
        </p>
      </div>

      <div className="walkthrough-layout">
        <div className="walkthrough-copy" data-reveal>
          <h3>It is not one bot answering everything.</h3>
          <p>
            The customer experiences one smooth response. Behind the scenes, the right ARKON
            roles wake up for memory, intent, safety, voice, scheduling, and owner visibility.
          </p>
          <ul>
            <li>Known contact? Pull the history and last touchpoint.</li>
            <li>Unknown contact? Capture only what the business needs.</li>
            <li>Sensitive issue? Route it instead of pretending to solve it.</li>
          </ul>
        </div>

        <div data-reveal className="walkthrough-product">
          <FlowPanel />
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const cards = [
    {
      number: '01',
      title: 'It checks who the person is',
      body: 'Known customer, new lead, vendor, guest, client, tenant, prospect — ARKON does not treat every message the same.'
    },
    {
      number: '02',
      title: 'It decides what should happen next',
      body: 'Answer, ask a follow-up, schedule, route, escalate, or brief the right person depending on context and risk.'
    },
    {
      number: '03',
      title: 'It sounds like the business',
      body: 'The response follows the business’s tone, standards, rules, and employee style instead of a generic bot voice.'
    }
  ];

  return (
    <section className="section">
      <div className="section-heading" data-reveal>
        <p className="eyebrow">The universal ARKON idea</p>
        <h2>The category does not matter yet. Every owner understands the same problem.</h2>
        <p>
          Customers reach out, context gets lost, employees need direction, and the owner becomes
          the safety net. ARKON turns those moments into organized action.
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

function Solutions() {
  return (
    <section className="section solutions-section" id="solutions">
      <div className="section-heading" data-reveal>
        <p className="eyebrow">Choose your business type</p>
        <h2>Start with the idea. Then go deeper in your vertical.</h2>
        <p>
          Each vertical page can show the exact calls, messages, documents, customers, employees,
          and owner view for that kind of business.
        </p>
      </div>

      <div className="solution-grid vertical-grid">
        {solutions.map(solution => (
          <a className="solution-card vertical-card" href={solution.href} key={solution.name} data-reveal>
            <span>{solution.name}</span>
            <h3>{solution.title}</h3>
            <p>{solution.details}</p>
            <strong>Explore this vertical →</strong>
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
        <p className="eyebrow">Chief of Staff view for every role</p>
        <h2>Not one dashboard. The right view for the person about to act.</h2>
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
        <p className="eyebrow">The operating team behind the walkthrough</p>
        <h2>Not one bot answering everything. The right roles wake up.</h2>
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
      <h2>The business feels present, prepared, and coordinated — even when the owner is not.</h2>
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
        <p className="eyebrow">Go deeper by vertical</p>
        <h2>Pick the business lane, then show the exact workflow.</h2>
        <p>
          The homepage gives the owner the idea. The vertical page should show the actual
          calls, messages, documents, customers, employees, and owner view for their industry.
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
      <p>© {year} ARKON Systems. Customer memory, business voice, and role-specific handoffs.</p>
    </footer>
  );
}

export default function App() {
  useReveal();

  return (
    <>
      <Header />
      <main>
        <Hero />
        <WalkthroughSection />
        <HowItWorks />
        <Solutions />
        <VoiceLayer />
        <RoleViews />
        <DashboardProof />
        <Coverage />
        <Impact />
        <DemoCta />
      </main>
      <Footer />
    </>
  );
}
