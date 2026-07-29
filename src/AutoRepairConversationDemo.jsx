import { useEffect, useMemo, useRef, useState } from 'react';
import './auto-repair-conversation-demo.css';

const SHOP_NAME = 'Northside Auto Care';

const scenarios = {
  deferredMaintenance: {
    tab: 'Bring back deferred work',
    eyebrow: 'Naya follows up with the customer’s actual vehicle history',
    title: 'The customer hears about the work they already discussed, not a generic reminder.',
    description:
      'Naya uses the customer’s name, vehicle, prior recommendation, timing, estimate, and communication preference to bring the right customer back for the right work.',
    proof: [
      'Uses the customer’s name and vehicle',
      'References the exact deferred work',
      'Remembers the prior estimate',
      'Hands the shop a ready-to-book customer'
    ],
    messages: [
      {
        speaker: 'Naya',
        text: `Hi Michael, it’s Naya with ${SHOP_NAME}. When your 2018 Honda Accord was in last month, the shop recommended replacing the front brake pads and rotors. You decided to hold off at the time. Would you like me to find an appointment for you?`,
        wait: 950
      },
      { speaker: 'Michael', text: 'Yes, I should probably get that taken care of.', wait: 850 },
      {
        speaker: 'Naya',
        text: 'Absolutely. The estimate on file was $680. We have Tuesday morning or Thursday afternoon available. Which works better?',
        wait: 1050
      },
      { speaker: 'Michael', text: 'Thursday afternoon.', wait: 750 },
      {
        speaker: 'Naya',
        text: 'Perfect. I’ll have the shop confirm the exact time with you by text.',
        wait: 850
      },
      {
        speaker: 'Message to service advisor',
        text: 'Michael Torres is ready to schedule the front brake pads and rotors previously estimated at $680 for his 2018 Honda Accord. Thursday afternoon works best. Text is preferred. Confirm the appointment today.',
        wait: 900,
        outcome: true
      }
    ],
    record: {
      label: 'Deferred work recovered',
      title: 'Michael Torres · 2018 Honda Accord',
      facts: ['Front brakes', 'Estimated at $680', 'Deferred last month'],
      next: 'Thursday afternoon requested · Text preferred'
    }
  },
  upcomingMaintenance: {
    tab: 'Schedule upcoming maintenance',
    eyebrow: 'Naya reaches out before routine work gets missed',
    title: 'The reminder is tied to the customer, the vehicle, and the service coming due.',
    description:
      'Naya uses the actual vehicle and maintenance timing, offers approved openings, and turns a routine reminder into a scheduled visit.',
    proof: [
      'Uses the customer’s vehicle',
      'Names the service coming due',
      'Offers approved shop openings',
      'Confirms the next step clearly'
    ],
    messages: [
      {
        speaker: 'Naya',
        text: `Hi Angela, it’s Naya with ${SHOP_NAME}. Your 2021 Toyota RAV4 is approaching the mileage for its next oil service and tire rotation. Would you like me to reserve a time?`,
        wait: 900
      },
      { speaker: 'Angela', text: 'Yes. What do you have next week?', wait: 800 },
      {
        speaker: 'Naya',
        text: 'We have Wednesday at 10:00 or Friday at 2:30 available.',
        wait: 850
      },
      { speaker: 'Angela', text: 'Friday at 2:30 works.', wait: 700 },
      {
        speaker: 'Naya',
        text: 'You’re all set. The shop will send your confirmation and reminder by text.',
        wait: 850
      },
      {
        speaker: 'Appointment confirmed',
        text: 'Angela Brooks · 2021 Toyota RAV4 · Oil service and tire rotation · Friday at 2:30 PM',
        wait: 850,
        outcome: true
      }
    ],
    record: {
      label: 'Upcoming maintenance scheduled',
      title: 'Angela Brooks · 2021 Toyota RAV4',
      facts: ['Oil service', 'Tire rotation', 'Mileage due'],
      next: 'Friday at 2:30 PM · Reminder scheduled'
    }
  },
  repairCall: {
    tab: 'Customer calls the shop',
    eyebrow: 'Vera answers in the shop’s name',
    title: 'The advisor receives the customer, vehicle, concern, and next step together.',
    description:
      'Vera responds naturally, captures the customer and vehicle details, understands the concern, and sends the shop a useful intake instead of a vague callback note.',
    proof: [
      'Uses the shop’s name and voice',
      'Captures the customer and vehicle',
      'Understands the concern naturally',
      'Sends the advisor a useful next step'
    ],
    messages: [
      { speaker: 'Vera', text: `Thank you for calling ${SHOP_NAME}. This is Vera. How can I help you?`, wait: 750 },
      { speaker: 'Caller', text: 'My check-engine light came on and the car is shaking when I stop.', wait: 850 },
      {
        speaker: 'Vera',
        text: 'I’m sorry you’re dealing with that. Is the light steady or flashing, and does the vehicle still feel safe to drive?',
        wait: 1000
      },
      { speaker: 'Caller', text: 'It is steady. I can drive it, but I do not want to go far.', wait: 850 },
      { speaker: 'Vera', text: 'Understood. What year, make, and model is the vehicle?', wait: 800 },
      { speaker: 'Caller', text: 'A 2018 Honda Accord.', wait: 700 },
      { speaker: 'Vera', text: 'Thank you. May I get your name and the best way for the shop to reach you?', wait: 850 },
      { speaker: 'Caller', text: 'Michael Torres. Text is best.', wait: 750 },
      {
        speaker: 'Message to service advisor',
        text: 'Michael Torres has a 2018 Honda Accord with a steady check-engine light and shaking at stops. He says it is drivable but wants to limit distance. Text is best. Contact him today with the earliest diagnostic opening.',
        wait: 900,
        outcome: true
      }
    ],
    record: {
      label: 'Repair opportunity created',
      title: 'Michael Torres · 2018 Honda Accord',
      facts: ['Check-engine light', 'Shakes at stops', 'Drivable with caution'],
      next: 'Diagnostic appointment needs confirmation'
    }
  }
};

function TranscriptLine({ item }) {
  const customer = ['Michael', 'Angela', 'Caller'].includes(item.speaker);
  return (
    <div className={`auto-repair-line ${customer ? 'is-customer' : ''} ${item.outcome ? 'is-outcome' : ''}`}>
      <span>{item.speaker}</span>
      <p>{item.text}</p>
    </div>
  );
}

export default function AutoRepairConversationDemo() {
  const [activeKey, setActiveKey] = useState('deferredMaintenance');
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

        <div className="auto-repair-tabs" role="tablist" aria-label="Auto repair customer interaction examples">
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

        <div className="auto-repair-proof-row" aria-label="Personalized auto repair interaction capabilities">
          {scenario.proof.map(item => <span key={item}>{item}</span>)}
        </div>

        <button className="auto-repair-replay" onClick={() => setReplayToken(token => token + 1)} type="button">
          <span aria-hidden="true">↻</span> Replay interaction
        </button>
      </div>

      <div className="auto-repair-console">
        <div className="auto-repair-console-head">
          <div>
            <span>{SHOP_NAME}</span>
            <strong>{scenario.tab}</strong>
          </div>
          <em>Customer interaction</em>
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
