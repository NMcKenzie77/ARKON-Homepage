import DemoRequestForm from './DemoRequestForm.jsx';
import './demo-page.css';

const workflows = [
  {
    number: '01',
    title: 'Missed or after-hours call',
    copy: 'See how ARKON answers in the business name, captures what the customer needs, and prepares the right handoff.'
  },
  {
    number: '02',
    title: 'New website inquiry',
    copy: 'See how a new request is organized, qualified, and kept moving before the prospective customer loses interest.'
  },
  {
    number: '03',
    title: 'Lead follow-up',
    copy: 'See how ARKON follows approved timing and messaging while keeping prior conversations and the next action attached.'
  },
  {
    number: '04',
    title: 'Customer message',
    copy: 'See how routine questions are handled in the business voice and sensitive issues are routed instead of guessed at.'
  },
  {
    number: '05',
    title: 'Staff handoff',
    copy: 'See what the employee receives before taking over: the request, customer context, prior activity, and recommended next step.'
  },
  {
    number: '06',
    title: 'Owner escalation',
    copy: 'See how Grant separates handled work from the decisions, risks, and exceptions that actually need the owner.'
  }
];

const demonstrationViews = [
  ['Customer experience', 'What the customer hears or receives, including the business name, tone, approved answers, and next step.'],
  ['ARKON workflow', 'Which role responds, what business rules are checked, what action is allowed, and where automation stops.'],
  ['Employee handoff', 'The organized summary, relationship context, and next action your employee receives before stepping in.'],
  ['Owner visibility', 'What was handled, what is still open, who owns the next step, and what requires a decision.']
];

const callSteps = [
  ['01', 'Choose one real workflow', 'We focus on a call, inquiry, follow-up, customer message, staff handoff, or owner escalation that matters in your business.'],
  ['02', 'Map the rules around it', 'We identify what ARKON may answer or do, what systems hold the context, and what must go to a person.'],
  ['03', 'Walk through the response', 'You see the customer experience, ARKON’s internal workflow, the staff handoff, and the owner view.'],
  ['04', 'Decide whether it is worth pursuing', 'We identify the practical next step. The demonstration is a working session, not a commitment to purchase.']
];

export default function DemoPage() {
  return (
    <main className="demo-page" data-public-route="/demo">
      <section className="demo-page-hero">
        <div className="hero-background" aria-hidden="true">
          <span className="orb orb-one" />
          <span className="orb orb-two" />
          <span className="grid-glow" />
        </div>
        <div className="demo-page-hero-inner">
          <p className="eyebrow">See ARKON work</p>
          <h1>See how ARKON handles a real customer workflow.</h1>
          <p>
            Choose a workflow from your business and walk through what the customer experiences,
            what ARKON handles, what your employee receives, and what the owner sees.
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="#request-demo">Book the working session</a>
            <a className="secondary-button" href="/how-it-works">Review the ARKON workflow</a>
          </div>
          <div className="demo-page-hero-note">
            <strong>Approximately 20 minutes</strong>
            <span>One workflow. Your rules. No purchase commitment.</span>
          </div>
        </div>
      </section>

      <section className="section demo-workflow-section" aria-labelledby="demo-workflow-title">
        <div className="section-heading">
          <p className="eyebrow">Choose the workflow</p>
          <h2 id="demo-workflow-title">Start with the work most likely to get missed.</h2>
          <p>
            The session stays focused on one practical workflow instead of giving you a generic software tour.
          </p>
        </div>
        <div className="demo-workflow-grid">
          {workflows.map(workflow => (
            <article className="demo-workflow-card" key={workflow.number}>
              <span>{workflow.number}</span>
              <h3>{workflow.title}</h3>
              <p>{workflow.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section demo-views-section" aria-labelledby="demo-views-title">
        <div className="demo-views-copy">
          <p className="eyebrow">What you will see</p>
          <h2 id="demo-views-title">The entire handoff, not just the first reply.</h2>
          <p>
            ARKON is not presented as a chatbot. The demonstration follows the request from the customer’s first contact through the next action and owner visibility.
          </p>
        </div>
        <div className="demo-views-grid">
          {demonstrationViews.map(([title, copy]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section demo-call-section" aria-labelledby="demo-call-title">
        <div className="section-heading">
          <p className="eyebrow">What happens on the call</p>
          <h2 id="demo-call-title">A working session built around your operation.</h2>
          <p>
            You will leave knowing what ARKON could handle, where your staff remains involved, and what would be required to implement the workflow.
          </p>
        </div>
        <ol className="demo-call-steps">
          {callSteps.map(([number, title, copy]) => (
            <li key={number}>
              <span>{number}</span>
              <div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="demo-no-pressure" aria-label="Demonstration commitment statement">
        <p className="eyebrow">No pressure</p>
        <h2>This is a working-session demonstration, not a commitment to purchase.</h2>
        <p>
          The purpose is to determine whether one ARKON workflow would solve a real operational problem in your business.
        </p>
      </section>

      <DemoRequestForm
        id="request-demo"
        className="demo-page-request-form"
        eyebrow="Book the working session"
        title="Tell us which business and workflow you want to review."
        description="Submit the details below and ARKON will follow up to schedule the approximately 20-minute working session."
      />
    </main>
  );
}
