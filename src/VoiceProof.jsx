import './voice-proof.css';

export default function VoiceProof() {
  return (
    <section className="section voice-proof-section" id="voice">
      <div className="section-copy voice-proof-copy" data-reveal>
        <p className="eyebrow">Your business voice</p>
        <h2>ARKON replies the way your team would.</h2>
        <p>
          It follows your preferred greetings, tone, approved answers, and escalation rules so
          customers get a response that feels consistent with your business, not a generic script.
        </p>
        <p className="voice-proof-note">
          <strong>ARKON does not improvise.</strong> Routine replies follow your approved rules.
          Sensitive issues go to a person.
        </p>
      </div>

      <div className="voice-example-card" data-reveal aria-label="Example ARKON response in a business's voice">
        <div className="voice-example-header">
          <div>
            <span className="voice-example-kicker">Example response</span>
            <strong>Customer callback request</strong>
          </div>
          <span className="voice-example-status">Approved tone</span>
        </div>

        <div className="voice-message voice-message-customer">
          <span>Customer</span>
          <p>Hi, I wanted to see if someone can call me back this afternoon.</p>
        </div>

        <div className="voice-message voice-message-arkon">
          <span>ARKON</span>
          <p>
            Absolutely. I’ll get this to the team and have someone call you this afternoon.
            If the timing changes, we’ll let you know.
          </p>
        </div>

        <div className="voice-example-rules" aria-label="Rules used for this response">
          <span>Uses your greeting style</span>
          <span>Follows callback rules</span>
          <span>Escalates when needed</span>
        </div>
      </div>
    </section>
  );
}
