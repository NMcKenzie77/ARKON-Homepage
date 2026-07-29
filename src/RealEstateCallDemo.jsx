import { useEffect, useMemo, useRef, useState } from 'react';
import './real-estate-call-demo.css';

const EXAMPLE_OFFICE = 'Oak & Main Realty';
const READ_HOLD_MS = 1500;

const scenarios = {
  followUp: {
    tab: 'Past lead follow-up',
    eyebrow: 'Naya follows up in the office’s name',
    title: 'Past opportunities should not disappear because nobody followed up.',
    description:
      'Naya reaches out to Danielle naturally, refreshes what has changed, updates the contact record quietly, and sends Jordan a clear message when Danielle is ready to move again.',
    consoleLabel: 'Proactive database follow-up',
    consoleAgent: `Naya · ${EXAMPLE_OFFICE}`,
    replayLabel: 'Replay follow-up',
    proof: [
      'Uses Danielle’s prior history',
      'Keeps the conversation human',
      'Updates the contact record quietly',
      'Alerts Jordan with next steps'
    ],
    property: {
      label: 'Past opportunity matched',
      address: 'Danielle Brooks',
      status: 'Past buyer lead',
      facts: ['Maplewood + South Orange', 'Up to $650,000', 'Financing paused'],
      context: 'Last meaningful conversation: five months ago'
    },
    contact: {
      label: 'Contact record updated',
      name: 'Danielle Brooks',
      phone: '(973) 555-0148',
      email: 'danielle.brooks@example.com',
      preference: 'Text preferred',
      assignedAgent: 'Assigned agent · Jordan Lee'
    },
    messages: [
      {
        speaker: 'Naya',
        text: 'Hi Danielle, it’s Naya with Oak & Main Realty. You were looking in Maplewood and South Orange earlier this year. Are you still hoping to move, or has your timing changed?',
        wait: 900
      },
      { speaker: 'Danielle', text: 'We paused for a while, but we’re looking again.', wait: 850 },
      {
        speaker: 'Naya',
        text: 'That’s great, Danielle. We’d love to help you with that. Are Maplewood and South Orange still the main areas you’re considering?',
        wait: 1000
      },
      { speaker: 'Danielle', text: 'Yes, those are still our first choices.', wait: 800 },
      {
        speaker: 'Naya',
        text: 'Perfect. Are you still hoping to stay around $650,000?',
        wait: 900
      },
      { speaker: 'Danielle', text: 'Yes. We just need to reconnect with a lender.', wait: 850 },
      {
        speaker: 'Naya',
        text: 'Absolutely. I can have Jordan reach out and help you get moving again. Is text still the easiest way to reach you?',
        wait: 1000
      },
      { speaker: 'Danielle', text: 'Yes, text is best.', wait: 700 },
      {
        speaker: 'Message to Jordan',
        text: 'Jordan, Danielle Brooks is looking again. Maplewood and South Orange are still her preferred areas, her budget is around $650,000, and she needs help reconnecting with a lender. Text is best. Reach out today.',
        wait: 900,
        outcome: true
      }
    ]
  },
  buyer: {
    tab: 'Buyer calls about a listing',
    eyebrow: 'Vera answers in the office’s name',
    title: 'The buyer feels helped, not processed.',
    description:
      'Vera gives the office’s greeting, responds warmly, captures the buyer’s details naturally, and sends Jordan a useful showing request instead of a generic call summary.',
    consoleLabel: 'Live inbound call',
    consoleAgent: `Vera · ${EXAMPLE_OFFICE}`,
    replayLabel: 'Replay call',
    proof: [
      'Uses the office name and voice',
      'Captures contact information naturally',
      'Confirms representation and timing',
      'Alerts Jordan with next steps'
    ],
    property: {
      label: 'Listing inquiry',
      address: '214 Oak Avenue',
      status: 'Active',
      facts: ['3 beds', '2 baths', '$485,000'],
      context: 'Saturday morning showing requested'
    },
    contact: {
      label: 'New buyer contact created',
      name: 'Daniel Reyes',
      phone: '(973) 555-0162',
      email: 'daniel.reyes@example.com',
      preference: 'Text preferred',
      assignedAgent: 'Assigned agent · Jordan Lee'
    },
    messages: [
      {
        speaker: 'Vera',
        text: 'Hi, thank you for calling Oak & Main Realty. This is Vera. How can I help you?',
        wait: 850
      },
      { speaker: 'Caller', text: 'Hi, I’m calling about 214 Oak Avenue. Is it still available?', wait: 700 },
      {
        speaker: 'Vera',
        text: 'Yes, it is. We’d be happy to help you see it. Are you already working with an agent?',
        wait: 950
      },
      { speaker: 'Caller', text: 'No, I’m not.', wait: 750 },
      {
        speaker: 'Vera',
        text: 'Great. What day works best for you?',
        wait: 800
      },
      { speaker: 'Caller', text: 'Saturday morning would be best.', wait: 750 },
      {
        speaker: 'Vera',
        text: 'We can help with that. May I get your name and email so Jordan can confirm the showing with you?',
        wait: 950
      },
      { speaker: 'Caller', text: 'Daniel Reyes. daniel.reyes@example.com. This number is best for text.', wait: 850 },
      {
        speaker: 'Vera',
        text: 'Thank you, Daniel. Jordan will text you shortly to confirm a time for Saturday morning.',
        wait: 900
      },
      {
        speaker: 'Message to Jordan',
        text: 'Jordan, Daniel Reyes would like to see 214 Oak Avenue Saturday morning. He is not working with another agent, this number is best for text, and his email is daniel.reyes@example.com. Confirm the showing with him today.',
        wait: 900,
        outcome: true
      }
    ]
  },
  seller: {
    tab: 'Homeowner calls about selling',
    eyebrow: 'Vera responds with warmth and routes the opportunity',
    title: 'A potential seller hears that the office wants to help.',
    description:
      'Vera acknowledges the homeowner’s situation, asks only what is needed for a useful introduction, and sends Alicia a clear seller opportunity with the next step.',
    consoleLabel: 'Live inbound call',
    consoleAgent: `Vera · ${EXAMPLE_OFFICE}`,
    replayLabel: 'Replay call',
    proof: [
      'Uses the office name and voice',
      'Responds with empathy',
      'Captures contact details and timing',
      'Alerts Alicia with next steps'
    ],
    property: {
      label: 'Seller inquiry',
      address: 'Westfield homeowner',
      status: 'Planning to sell',
      facts: ['4 bedrooms', 'Relocating', '60–90 days'],
      context: 'Listing consultation requested'
    },
    contact: {
      label: 'New seller contact created',
      name: 'Laura Kim',
      phone: '(908) 555-0127',
      email: 'laura.kim@example.com',
      preference: 'Call preferred',
      assignedAgent: 'Assigned agent · Alicia Morgan'
    },
    messages: [
      {
        speaker: 'Vera',
        text: 'Hi, thank you for calling Oak & Main Realty. This is Vera. How can I help you?',
        wait: 850
      },
      { speaker: 'Caller', text: 'I may need to sell my home in the next couple of months. I’m relocating for work.', wait: 700 },
      {
        speaker: 'Vera',
        text: 'Absolutely. We’d love to help you with that. Is the home already listed with anyone?',
        wait: 950
      },
      { speaker: 'Caller', text: 'No, I haven’t spoken with an agent yet.', wait: 800 },
      {
        speaker: 'Vera',
        text: 'Okay, great. About when are you hoping to move?',
        wait: 850
      },
      { speaker: 'Caller', text: 'Probably within 60 to 90 days.', wait: 750 },
      {
        speaker: 'Vera',
        text: 'Thank you. May I get your name and email so Alicia can reach out and talk through the next steps with you?',
        wait: 950
      },
      { speaker: 'Caller', text: 'Laura Kim, laura.kim@example.com. Calling this number is best.', wait: 850 },
      {
        speaker: 'Vera',
        text: 'Perfect, Laura. Alicia will call you today. We look forward to helping you.',
        wait: 900
      },
      {
        speaker: 'Message to Alicia',
        text: 'Alicia, Laura Kim is considering selling her Westfield home within 60 to 90 days because she is relocating for work. The home is not listed, she has not spoken with another agent, and she prefers a call. Reach out today.',
        wait: 900,
        outcome: true
      }
    ]
  }
};

function TranscriptItem({ item }) {
  const isClient = ['Caller', 'Lead', 'Danielle', 'Daniel', 'Laura'].includes(item.speaker);
  const classNames = [
    'real-estate-call-line',
    item.intelligence ? 'is-intelligence' : '',
    item.outcome ? 'is-outcome' : '',
    isClient ? 'is-caller' : 'is-team'
  ].filter(Boolean).join(' ');

  return (
    <div className={classNames}>
      <span>{item.speaker}</span>
      <p>{item.text}</p>
    </div>
  );
}

export default function RealEstateCallDemo() {
  const [activeKey, setActiveKey] = useState('followUp');
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
      }, index === 0 ? 550 : scenario.messages[index - 1].wait + READ_HOLD_MS);
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

        <div className="real-estate-call-tabs" role="tablist" aria-label="Real estate conversation examples">
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

        <div className="real-estate-call-proof" aria-label="Real estate conversation capabilities">
          {scenario.proof.map(item => <span key={item}>{item}</span>)}
        </div>

        <button className="real-estate-call-replay" onClick={() => setReplayToken(token => token + 1)} type="button">
          <span aria-hidden="true">↻</span>
          {scenario.replayLabel}
        </button>
      </div>

      <div className="real-estate-call-console" aria-label={`Example: ${scenario.consoleLabel}`}>
        <div className="real-estate-call-console-header">
          <div>
            <span className="real-estate-live-dot" aria-hidden="true" />
            <strong>{scenario.consoleLabel}</strong>
          </div>
          <small>{scenario.consoleAgent}</small>
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

          <div className="real-estate-contact-record" aria-label={`${scenario.contact.label}: ${scenario.contact.name}, ${scenario.contact.phone}, ${scenario.contact.email}, ${scenario.contact.preference}${scenario.contact.assignedAgent ? `, ${scenario.contact.assignedAgent}` : ''}`}>
            <div>
              <span>{scenario.contact.label}</span>
              <strong>{scenario.contact.name}</strong>
            </div>
            <div className="real-estate-contact-details">
              <span>{scenario.contact.phone}</span>
              <span>{scenario.contact.email}</span>
              <span>{scenario.contact.preference}</span>
              {scenario.contact.assignedAgent ? <span>{scenario.contact.assignedAgent}</span> : null}
            </div>
          </div>
        </div>

        <div className="real-estate-call-transcript" ref={transcriptRef} aria-live="polite">
          {visibleMessages.map((item, index) => (
            <TranscriptItem item={item} key={`${activeKey}-${index}-${item.speaker}`} />
          ))}
          {visibleCount < scenario.messages.length ? (
            <div className="real-estate-call-thinking" aria-label="Conversation continuing">
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
