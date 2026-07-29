import { useEffect, useMemo, useRef, useState } from 'react';
import './auto-repair-conversation-demo.css';

const SHOP_NAME = 'Northside Auto Care';

const scenarios = {
  repairCall: {
    tab: 'Repair call',
    eyebrow: 'Vera answers in the shop’s name',
    title: 'The service advisor gets a useful intake, not another vague callback note.',
    description:
      'Vera captures the customer, vehicle, symptoms, drivability, urgency, timing, and preferred contact method while the repair opportunity is still live.',
    messages: [
      { speaker: 'Vera', text: `Thank you for calling ${SHOP_NAME}. This is Vera. How can I help you?`, wait: 700 },
      { speaker: 'Customer', text: 'My check-engine light came on and the car is shaking when I stop.', wait: 900 },
      { speaker: 'Vera', text: 'I’m sorry you’re dealing with that. Is the light steady or flashing, and does the vehicle still feel safe to drive?', wait: 1100 },
      { speaker: 'Customer', text: 'It is steady. I can drive it, but I do not want to go far.', wait: 900 },
      { speaker: 'Vera', text: 'Understood. What year, make, and model is the vehicle?', wait: 850 },
      { speaker: 'Customer', text: 'A 2018 Honda Accord.', wait: 750 },
      { speaker: 'Vera', text: 'Thank you. May I get your name and the best number for updates?', wait: 900 },
      { speaker: 'Customer', text: 'Michael Torres. This number is best for text.', wait: 800 },
      {
        speaker: 'Message to service advisor',
        text: 'Michael Torres has a 2018 Honda Accord with a steady check-engine light and shaking at stops. He says it is drivable but wants to limit distance. Text is best. Call today to confirm the earliest diagnostic opening.',
        wait: 900,
        outcome: true
      }
    ],
    record: {
      label: 'Repair opportunity created',
      title: '2018 Honda Accord',
      facts: ['Check-engine light', 'Shakes at stops', 'Drivable with caution'],
      next: 'Diagnostic appointment needs confirmation'
    }
  },
  statusUpdate: {
    tab: 'Vehicle status',
    eyebrow: 'Naya handles approved updates',
    title: 'Customers get a clear update without interrupting the advisor for every status call.',
    description:
      'Naya uses the approved repair-order status, explains the current step, and routes authorization or judgment calls to the service advisor.',
    messages: [
      { speaker: 'Customer', text: 'Hi, is my Accord ready yet?', wait: 700 },
      { speaker: 'Naya', text: 'Hi Michael. Your Accord has been diagnosed, and the shop is waiting for your approval on the ignition-coil repair before work begins.', wait: 1100 },
      { speaker: 'Customer', text: 'How much was it again?', wait: 750 },
      { speaker: 'Naya', text: 'The approved estimate in your file is $486. I can have Sam call you now to review the repair and answer any questions before you authorize it.', wait: 1100 },
      { speaker: 'Customer', text: 'Yes, have him call me.', wait: 750 },
      {
        speaker: 'Message to service advisor',
        text: 'Michael Torres asked for a call to review the $486 ignition-coil estimate before authorizing the repair. Call him now. Text remains his preferred update method.',
        wait: 900,
        outcome: true
      }
    ],
    record: {
      label: 'Repair order context',
      title: 'RO 10482 · 2018 Honda Accord',
      facts: ['Diagnosis complete', '$486 estimate', 'Awaiting authorization'],
      next: 'Advisor callback requested'
    }
  },
  declinedWork: {
    tab: 'Declined work',
    eyebrow: 'Naya follows up at the right time',
    title: 'Recommended work does not disappear after the customer leaves.',
    description:
      'Naya follows the shop’s approved timing, uses the actual vehicle and recommendation, and alerts the advisor when the customer is ready to schedule.',
    messages: [
      { speaker: 'Naya', text: `Hi Elena, it’s Naya with ${SHOP_NAME}. When your 2020 RAV4 was here last month, the front brakes were getting close to replacement. Would you like us to reserve a time to take care of them?`, wait: 900 },
      { speaker: 'Customer', text: 'Yes. I was waiting until payday. Do you have anything Friday afternoon?', wait: 900 },
      { speaker: 'Naya', text: 'We have a 2:30 opening Friday. I can ask Chris to confirm the estimate and hold that time for you.', wait: 1000 },
      { speaker: 'Customer', text: 'That works.', wait: 700 },
      {
        speaker: 'Message to service advisor',
        text: 'Elena Price is ready to schedule the front-brake work previously recommended for her 2020 Toyota RAV4. Friday at 2:30 works. Confirm the current estimate and appointment today.',
        wait: 900,
        outcome: true
      }
    ],
    record: {
      label: 'Declined work recovered',
      title: '2020 Toyota RAV4',
      facts: ['Front brakes recommended', 'Deferred one month', 'Friday 2:30 requested'],
      next: 'Confirm estimate and appointment'
    }
  }
};

function TranscriptLine({ item }) {
  const customer = item.speaker === 'Customer';
  return (
    <div className={`auto-repair-line ${customer ? 'is-customer' : ''} ${item.outcome ? 'is-outcome' : ''}`}>
      <span>{item.speaker}</span>
      <p>{item.text}</p>
    </div>
  );
}

export default function AutoRepairConversationDemo() {
  const [activeKey, setActiveKey] = useState('repairCall');
  const [visibleCount, setVisibleCount] = useState(0);
  const [replayToken, setReplayToken] = useState(0);
  const transcriptRef = useRef(null);
  const scenario = scenarios[activeKey];
  const visibleMessages = useMemo(() => scenario.messages.slice(0, visibleCount), [scenario, visibleCount]);

  useEffect(() => {
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      setVisibleCount(scenario.messages.length);
      return undefined;
    }

    setVisibleCount(0);
    let cancelled = false;
    const timers = [];

    const reveal = index => {
      if (cancelled || index >= scenario.messages.length) return;
      const timer = window.setTimeout(() => {
        if (cancelled) return;
        setVisibleCount(index + 1);
        reveal(index + 1);
      }, index === 0 ? 600 : scenario.messages[index - 1].wait + 650);
      timers.push(timer);
    };

    reveal(0);
    return () => {
      cancelled = true;
      timers.forEach(timer => window.clearTimeout(timer));
    };
  }, [activeKey, replayToken, scenario.messages]);

  useEffect(() => {
    const node = transcriptRef.current;
    if (node) node.scrollTo({ top: node.scrollHeight, behavior: 'smooth' });
  }, [visibleCount]);

  function selectScenario(key) {
    setActiveKey(key);
    setReplayToken(token => token + 1);
  }

  return (
    <section className="auto-repair-demo-section" aria-labelledby="auto-repair-demo-title">
      <div className="auto-repair-demo-copy">
        <p className="eyebrow">{scenario.eyebrow}</p>
        <h2 id="auto-repair-demo-title">{scenario.title}</h2>
        <p>{scenario.description}</p>

        <div className="auto-repair-tabs" role="tablist" aria-label="Auto repair workflow examples">
          {Object.entries(scenarios).map(([key, item]) => (
            <button
              className={activeKey === key ? 'active' : ''}
              key={key}
              onClick={() => selectScenario(key)}
              role="tab"
              aria-selected={activeKey === key}
              type="button"
            >
              {item.tab}
            </button>
          ))}
        </div>

        <div className="auto-repair-proof-row">
          <span>Uses shop-approved information</span>
          <span>Keeps vehicle context attached</span>
          <span>Routes judgment to staff</span>
        </div>

        <button className="auto-repair-replay" onClick={() => setReplayToken(token => token + 1)} type="button">
          <span aria-hidden="true">↻</span> Replay workflow
        </button>
      </div>

      <div className="auto-repair-console">
        <div className="auto-repair-console-head">
          <div>
            <span>Northside Auto Care</span>
            <strong>{scenario.tab}</strong>
          </div>
          <em>Live workflow</em>
        </div>

        <div className="auto-repair-transcript" ref={transcriptRef}>
          {visibleMessages.map((item, index) => <TranscriptLine item={item} key={`${activeKey}-${index}`} />)}
        </div>

        <div className="auto-repair-record">
          <span>{scenario.record.label}</span>
          <h3>{scenario.record.title}</h3>
          <div>{scenario.record.facts.map(fact => <strong key={fact}>{fact}</strong>)}</div>
          <p>{scenario.record.next}</p>
        </div>
      </div>
    </section>
  );
}
