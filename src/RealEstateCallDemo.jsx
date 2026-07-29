import { useEffect, useMemo, useRef, useState } from 'react';
import './real-estate-call-demo.css';

const scenarios = {
  buyer: {
    tab: 'Buyer calls about a listing',
    eyebrow: 'Vera answers live · Paige checks the property',
    title: 'The buyer gets an answer before they call the next agent.',
    description:
      'Vera keeps the caller engaged while Paige supplies approved listing details and the next step is prepared for the agent.',
    property: {
      label: 'Example listing matched',
      address: '214 Oak Avenue',
      status: 'Active',
      facts: ['3 beds', '2 baths', '$485,000'],
      context: 'Saturday showing requested'
    },
    messages: [
      { speaker: 'Caller', text: 'Hi, I’m calling about 214 Oak Avenue. Is it still available?', wait: 650 },
      { speaker: 'Paige', text: 'Listing matched · Active · 3 beds · 2 baths · $485,000', wait: 850, intelligence: true },
      { speaker: 'Vera', text: 'Yes, it is currently active. Are you already working with an agent?', wait: 950 },
      { speaker: 'Caller', text: 'No. Could I see it Saturday morning?', wait: 850 },
      { speaker: 'Vera', text: 'Absolutely. I can take your preferred time and have the agent confirm the showing. Would 10:30 work?', wait: 1050 },
      { speaker: 'Caller', text: 'Yes, that works.', wait: 700 },
      { speaker: 'ARKON', text: 'Qualified buyer opportunity · Saturday 10:30 requested · Agent confirmation needed', wait: 900, outcome: true }
    ]
  },
  seller: {
    tab: 'Homeowner calls about selling',
    eyebrow: 'Vera qualifies · Marcus keeps the context',
    title: 'A potential listing becomes an organized seller opportunity.',
    description:
      'The homeowner is heard immediately, the timing and property basics are captured, and the agent receives a useful handoff instead of a voicemail.',
    property: {
      label: 'Seller opportunity',
      address: 'Westfield homeowner',
      status: 'Planning to sell',
      facts: ['4 bedrooms', 'Relocating', '60–90 days'],
      context: 'Agent call requested today'
    },
    messages: [
      { speaker: 'Caller', text: 'I may need to sell my home in the next couple of months. I’m relocating for work.', wait: 700 },
      { speaker: 'Vera', text: 'I can help get the right information to the agent. Is the property already listed with anyone?', wait: 950 },
      { speaker: 'Caller', text: 'No. I have not spoken with an agent yet.', wait: 800 },
      { speaker: 'Vera', text: 'Understood. About when are you hoping to move, and what is the best number for the agent to reach you?', wait: 1000 },
      { speaker: 'Caller', text: 'Probably within 60 to 90 days. This number is best.', wait: 850 },
      { speaker: 'Marcus', text: 'Seller timing, relocation reason, property basics, and preferred contact attached.', wait: 850, intelligence: true },
      { speaker: 'ARKON', text: 'New seller opportunity · Agent call requested today · Full context ready', wait: 900, outcome: true }
    ]
  }
};

function TranscriptItem({ item }) {
  const classNames = [
    'real-estate-call-line',
    item.intelligence ? 'is-intelligence' : '',
    item.outcome ? 'is-outcome' : '',
    item.speaker === 'Caller' ? 'is-caller' : 'is-team'
  ].filter(Boolean).join(' ');

  return (
    <div className={classNames}>
      <span>{item.speaker}</span>
      <p>{item.text}</p>
    </div>
  );
}

export default function RealEstateCallDemo() {
  const [activeKey, setActiveKey] = useState('buyer');
  const [visibleCount, setVisibleCount] = useState(0);
  const [replayToken, setReplayToken] = useState(0);
  const transcriptRef = useRef(null);
  const scenario = scenarios[activeKey];
  const visibleMessages = useMemo(
    () => scenario.messages.slice(0, visibleCount),
    [scenario.messages, visibleCount]
  );

  useEffect(() => {
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      setVisibleCount(scenario.messages.length);
      return undefined;
    }

    setVisibleCount(0);
    let cancelled = false;
    const timers = [];

    const revealNext = index => {
      if (cancelled || index >= scenario.messages.length) return;
      const timer = window.setTimeout(() => {
        if (cancelled) return;
        setVisibleCount(index + 1);
        revealNext(index + 1);
      }, index === 0 ? 550 : scenario.messages[index - 1].wait);
      timers.push(timer);
    };

    revealNext(0);

    return () => {
      cancelled = true;
      timers.forEach(timer => window.clearTimeout(timer));
    };
  }, [activeKey, replayToken, scenario.messages]);

  useEffect(() => {
    const transcript = transcriptRef.current;
    if (!transcript) return;
    transcript.scrollTo({ top: transcript.scrollHeight, behavior: 'smooth' });
  }, [visibleCount]);

  function selectScenario(key) {
    setActiveKey(key);
    setReplayToken(token => token + 1);
  }

  return (
    <section className="real-estate-call-demo" aria-labelledby="real-estate-call-title">
      <div className="real-estate-call-copy">
        <p className="eyebrow">{scenario.eyebrow}</p>
        <h2 id="real-estate-call-title">{scenario.title}</h2>
        <p>{scenario.description}</p>

        <div className="real-estate-call-tabs" role="tablist" aria-label="Real estate call examples">
          {Object.entries(scenarios).map(([key, item]) => (
            <button
              aria-selected={activeKey === key}
              className={activeKey === key ? 'active' : ''}
              key={key}
              onClick={() => selectScenario(key)}
              role="tab"
              type="button"
            >
              {item.tab}
            </button>
          ))}
        </div>

        <div className="real-estate-call-proof" aria-label="Real estate call capabilities">
          <span>Answers live</span>
          <span>Checks approved property data</span>
          <span>Qualifies the opportunity</span>
          <span>Prepares the agent handoff</span>
        </div>

        <button className="real-estate-call-replay" onClick={() => setReplayToken(token => token + 1)} type="button">
          <span aria-hidden="true">↻</span>
          Replay call
        </button>
      </div>

      <div className="real-estate-call-console" aria-label="Example live real estate call">
        <div className="real-estate-call-console-header">
          <div>
            <span className="real-estate-live-dot" aria-hidden="true" />
            <strong>Live inbound call</strong>
          </div>
          <small>Vera · ARKON front desk</small>
        </div>

        <div className="real-estate-property-card">
          <div>
            <span>{scenario.property.label}</span>
            <h3>{scenario.property.address}</h3>
          </div>
          <strong>{scenario.property.status}</strong>
          <div className="real-estate-property-facts">
            {scenario.property.facts.map(fact => <span key={fact}>{fact}</span>)}
          </div>
          <p>{scenario.property.context}</p>
        </div>

        <div className="real-estate-call-transcript" ref={transcriptRef} aria-live="polite">
          {visibleMessages.map((item, index) => (
            <TranscriptItem item={item} key={`${activeKey}-${index}-${item.speaker}`} />
          ))}
          {visibleCount < scenario.messages.length ? (
            <div className="real-estate-call-thinking" aria-label="Call continuing">
              <span />
              <span />
              <span />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
