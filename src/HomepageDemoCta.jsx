import './homepage-demo-cta.css';

export default function HomepageDemoCta() {
  return (
    <section className="homepage-demo-cta" aria-labelledby="homepage-demo-title">
      <div>
        <p className="eyebrow">See it for your business</p>
        <h2 id="homepage-demo-title">Walk through one real workflow with ARKON.</h2>
        <p>
          Choose a call, inquiry, follow-up, customer message, staff handoff, or owner escalation
          and see how ARKON would handle it using your business rules.
        </p>
      </div>
      <a className="primary-button" href="/demo">See ARKON work</a>
    </section>
  );
}
