import './workflow-proof.css';

const workflowSteps = [
  {
    number: '01',
    label: 'Request received',
    title: 'The business responds immediately.',
    copy: 'ARKON captures the request, contact details, channel, and timing instead of letting the inquiry sit.'
  },
  {
    number: '02',
    label: 'Context attached',
    title: 'The history comes with it.',
    copy: 'Marcus checks the contact record, prior conversations, notes, and any open follow-up before the next step is prepared.'
  },
  {
    number: '03',
    label: 'Approved action',
    title: 'Routine work moves forward.',
    copy: 'ARKON acknowledges the customer, confirms the requested timing, and prepares the callback using the business’s approved voice and rules.'
  },
  {
    number: '04',
    label: 'Human handoff',
    title: 'Judgment stays with a person.',
    copy: 'Anything involving price, availability, approval, licensed advice, or a business decision is routed with the context already attached.'
  },
  {
    number: '05',
    label: 'Owner visibility',
    title: 'The result is visible without another status meeting.',
    copy: 'Grant shows what came in, what ARKON handled, who owns the callback, and whether anything still needs attention.'
  }
];

export default function WorkflowProof() {
  return (
    <section className="section workflow-proof-section" id="how" aria-labelledby="workflow-proof-title">
      <div className="workflow-proof-copy" data-reveal>
        <p className="eyebrow">How ARKON moves work forward</p>
        <h2 id="workflow-proof-title">One request. Every next step covered.</h2>
        <p>
          ARKON does more than answer the first message. It keeps the context attached, takes the
          actions your business allows, brings in a person where judgment starts, and shows the
          owner what happened.
        </p>
        <div className="workflow-proof-actions">
          <a className="primary-button" href="/how-it-works">See the full request flow</a>
          <a className="secondary-button" href="/#solutions">Choose your business type</a>
        </div>
      </div>

      <div className="workflow-proof-demo" data-reveal aria-label="Example ARKON request workflow">
        <div className="workflow-proof-message">
          <div>
            <span>Incoming website inquiry</span>
            <strong>“Hi, I filled out the form yesterday. Can someone call me this afternoon?”</strong>
          </div>
          <small>10:18 AM</small>
        </div>

        <ol className="workflow-proof-steps">
          {workflowSteps.map(step => (
            <li key={step.number}>
              <span className="workflow-proof-number">{step.number}</span>
              <div>
                <small>{step.label}</small>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="workflow-proof-result">
          <span>Result</span>
          <strong>Customer acknowledged. Callback prepared. Owner informed.</strong>
          <small>Nothing sensitive was guessed or answered outside the business’s rules.</small>
        </div>
      </div>
    </section>
  );
}
