import { useEffect, useMemo, useRef, useState } from 'react';
import { coverageLanes, dashboardRows, roleViews, solutions, workflowSteps } from './data.js';

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
        <a href="#roles">Role views</a>
        <a href="#coverage">Coverage</a>
        <a href="#solutions">Solutions</a>
      </nav>

      <a className="nav-cta" href="#demo">Book a demo</a>
    </header>
  );
}

function FlowPanel() {
  const [active, setActive] = useState(0);
  const step = workflowSteps[active];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive(index => (index + 1) % workflowSteps.length);
    }, 3200);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="flow-panel" aria-label="Animated after-hours customer flow">
      <div className="panel-topline">
        <span className="live-dot" />
        Live operating coverage
        <strong>{step.time}</strong>
      </div>

      <div className="customer-card">
        <div>
          <p>{step.eyebrow}</p>
          <h3>{step.title}</h3>
        </div>
        <span className="customer-avatar">MR</span>
      </div>

      <p className="flow-detail">{step.detail}</p>

      <div className="context-strip">
        <span>Context</span>
        <strong>{step.meta}</strong>
      </div>

      <div className="flow-timeline" role="list" aria-label="Flow timeline">
        {workflowSteps.map((item, index) => (
          <button
            key={item.eyebrow}
            className={index === active ? 'timeline-step active' : 'timeline-step'}
            onClick={() => setActive(index)}
            type="button"
          >
            <span>{String(index + 1).padStart(2, '0')}</span>
            {item.eyebrow}
          </button>
        ))}
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-background" aria-hidden="true">
        <span className="orb orb-one" />
        <span className="orb orb-two" />
        <span className="grid-glow" />
      </div>

      <div className="hero-inner">
        <div className="hero-copy" data-reveal>
          <p className="eyebrow">Role-specific operational clarity</p>
          <h1>Your business runs better when everyone knows what needs their attention.</h1>
          <p className="hero-subtitle">
            ARKON gives every role a clearer view of the day — so calls, messages,
            follow-up, records, documents, and handoffs keep moving without making the owner
            carry every detail.
          </p>

          <div className="hero-actions">
            <a className="primary-button" href="#demo">Book a demo</a>
            <a className="secondary-button" href="#how">See how it works</a>
          </div>

          <div className="proof-line" aria-label="Homepage proof points">
            <span>Calls</span>
            <span>Messages</span>
            <span>Follow-up</span>
            <span>Handoffs</span>
            <span>Owner visibility</span>
          </div>
        </div>

        <div data-reveal className="hero-product">
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
      title: 'The business remembers the customer',
      body: 'ARKON connects the call, message, record, and last meaningful touchpoint before anyone has to start over.'
    },
    {
      number: '02',
      title: 'The handoff is warm, not overloaded',
      body: 'The employee sees who is reaching out, what it is about, and what happened last.'
    },
    {
      number: '03',
      title: 'Each role sees what matters today',
      body: 'Owners, managers, agents, receptionists, technicians, and admins get the right view of the day.'
    }
  ];

  return (
    <section className="section" id="how">
      <div className="section-heading" data-reveal>
        <p className="eyebrow">The business-day system</p>
        <h2>The business remembers the customer before the customer has to repeat themselves.</h2>
        <p>
          ARKON is not a page full of random automation cards. It is a clearer operating layer for
          the moments where customer experience, team readiness, and owner visibility meet.
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
        <p className="eyebrow">Dashboard proof</p>
        <h2>The owner sees what needs attention without carrying every detail.</h2>
        <p>
          This preview keeps the proof focused: the business day is not a mystery,
          the handoffs are visible, and every priority has an owner.
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
          <div><span>Items needing attention</span><strong>4</strong></div>
          <div><span>Warm handoffs ready</span><strong>7</strong></div>
          <div><span>Owner escalations</span><strong>1</strong></div>
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
        <p className="eyebrow">Amplify the existing team</p>
        <h2>Coverage lanes, not a bot marketplace.</h2>
        <p>
          ARKON organizes the operating coverage around work that already exists in the business.
          The names support the system without making the homepage feel like a wall of agents.
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

function Solutions() {
  return (
    <section className="section" id="solutions">
      <div className="section-heading" data-reveal>
        <p className="eyebrow">Solutions</p>
        <h2>Start with focused business lanes. Expand from there.</h2>
      </div>

      <div className="solution-grid">
        {solutions.map(solution => (
          <article className="solution-card" key={solution.name} data-reveal>
            <span>{solution.name}</span>
            <h3>{solution.title}</h3>
            <p>{solution.details}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Impact() {
  const items = ['Customers feel remembered', 'Employees feel prepared', 'Owners see what matters', 'Handoffs keep moving'];
  return (
    <section className="impact-band" data-reveal>
      <p className="eyebrow">How it feels different</p>
      <h2>The business becomes more aware, responsive, prepared, and coordinated.</h2>
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
        <p className="eyebrow">Build the first homepage experience</p>
        <h2>Show the business day getting clearer.</h2>
        <p>
          This first homepage is designed to prove the ARKON idea quickly: premium motion,
          role-specific clarity, warm handoffs, and a live-feeling product story.
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
            <option>Other service business</option>
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
      <p>© {year} ARKON Systems. Role-specific operational clarity for the business day.</p>
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
        <HowItWorks />
        <RoleViews />
        <DashboardProof />
        <Coverage />
        <Solutions />
        <Impact />
        <DemoCta />
      </main>
      <Footer />
    </>
  );
}
