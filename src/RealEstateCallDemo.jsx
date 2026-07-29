import { useEffect, useMemo, useRef, useState } from 'react';
import './real-estate-call-demo.css';

const EXAMPLE_OFFICE = 'Oak & Main Realty';

const scenarios = {
  followUp: {
    tab: 'Past lead follow-up',
    eyebrow: 'Naya follows up · Marcus supplies the history',
    title: 'Past opportunities should not disappear because nobody followed up.',
    description:
      'Naya reaches out to Danielle in the office’s name, uses the prior conversation and property interests, confirms the contact record, and finds out whether she is ready to move again.',
    consoleLabel: 'Proactive database follow-up',
    consoleAgent: `Naya · ${EXAMPLE_OFFICE}`,
    replayLabel: 'Replay follow-up',
    proof: [
      'Uses Danielle’s prior history',
      'Confirms contact information',
      'Refreshes timing and criteria',
      'Prepares the agent handoff'
    ],
    property: {
      label: 'Past opportunity matched',
      address: 'Danielle Brooks',
      status: 'Past buyer lead',
      facts: ['Maplewood + South Orange', 'Up to $650,000', 'Financing paused'],
      context: 'Last meaningful conversation: five months ago'
    },
    contact: {
      label: 'Contact record confirmed',
      name: 'Danielle Brooks',
      phone: '(973) 555-0148',
      email: 'danielle.brooks@example.com',
      preference: 'Text preferred'
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
        text: 'Good to know. Are those still the right areas, and is your budget still around $650,000?',
        wait: 950
      },
      { speaker: 'Danielle', text: 'Yes. We just need to reconnect with a lender.', wait: 850 },
      {
        speaker: 'Marcus',
        text: 'Danielle’s previous neighborhoods, budget, financing stage, property preferences, and last conversation are attached.',
        wait: 850,
        intelligence: true
      },
      {
        speaker: 'Naya',
        text: 'I still have your mobile ending in 0148 and danielle.brooks@example.com. Are those both correct, and is text still best?',
        wait: 1000
      },
      { speaker: 'Danielle', text: 'Yes, both are right. Text is best.', wait: 700 },
      {
        speaker: 'ARKON',
        text: 'Danielle Brooks reactivated · Contact record confirmed · Search criteria refreshed · Agent follow-up ready',
        wait: 900,
        outcome: true
      }
    ]
  },
  buyer: {
    tab: 'Buyer calls about a listing',
    eyebrow: 'Vera answers in the office’s name · Paige checks the property',
    title: 'The buyer gets a personal answer before they call the next agent.',
    description:
      'The greeting, office name, tone, and approved questions are configured for the brokerage, team, or agent. Vera captures the buyer’s contact details while Paige supplies approved listing information.',
    consoleLabel: 'Live inbound call',
    consoleAgent: `Vera · ${EXAMPLE_OFFICE}`,
    replayLabel: 'Replay call',
    proof: [
      'Uses the office name and voice',
      'Captures contact information',
      'Checks approved property data',
      'Qualifies the opportunity'
    ],
    property: {
      label: 'Example listing matched',
      address: '214 Oak Avenue',
      status: 'Active',
      facts: ['3 beds', '2 baths', '$485,000'],
      context: 'Saturday showing requested'
    },
    contact: {
      label: 'Contact captured during call',
      name: 'Daniel Reyes',
      phone: '(973) 555-0162',
      email: 'daniel.reyes@example.com',
      preference: 'Call or text'
    },
    messages: [
      {
        speaker: 'Vera',
        text: 'Hi, thank you for calling Oak & Main Realty. This is Vera. How can I help you?',
        wait: 850
      },
      { speaker: 'Caller', text: 'Hi, I’m calling about 214 Oak Avenue. Is it still available?', wait: 700 },
      { speaker: 'Paige', text: 'Listing matched · Active · 3 beds · 2 baths · $485,000', wait: 850, intelligence: true },
      { speaker: 'Vera', text: 'Yes, it is currently active. Are you already working with an agent?', wait: 950 },
      { speaker: 'Caller', text: 'No. Could I see it Saturday morning?', wait: 850 },
      { speaker: 'Vera', text: 'Absolutely. May I get your name and email while I prepare the showing request?', wait: 950 },
      { speaker: 'Caller', text: 'Daniel Reyes. daniel.reyes@example.com. This number is best.', wait: 850 },
      { speaker: 'Vera', text: 'Thank you, Daniel. Would 10:30 Saturday work?', wait: 900 },
      { speaker: 'Daniel', text: 'Yes, that works.', wait: 700 },
      { speaker: 'ARKON', text: 'Qualified buyer opportunity · Contact captured · Saturday 10:30 requested · Agent confirmation needed', wait: 900, outcome: true }
    ]
  },
  seller: {
    tab: 'Homeowner calls about selling',
    eyebrow: 'Vera answers personally · Marcus keeps the context',
    title: 'A potential listing becomes an organized seller opportunity.',
    description:
      'The homeowner hears the office’s greeting immediately. Vera captures the contact details, timing, and property basics so the agent receives a useful handoff instead of a voicemail.',
    consoleLabel: 'Live inbound call',
    consoleAgent: `Vera · ${EXAMPLE_OFFICE}`,
    replayLabel: 'Replay call',
    proof: [
      'Uses the office name and voice',
      'Captures contact information',
      'Captures seller timing',
      'Prepares the agent handoff'
    ],
    property: {
      label: 'Seller opportunity',
      address: 'Westfield homeowner',
      status: 'Planning to sell',
      facts: ['4 bedrooms', 'Relocating', '60–90 days'],
      context: 'Agent call requested today'
    },
    contact: {
      label: 'Contact captured during call',
      name: 'Laura Kim',
      phone: '(908) 555-0127',
      email: 'laura.kim@example.com',
      preference: 'Call preferred'
    },
    messages: [
      {
        speaker: 'Vera',
        text: 'Hi, thank you for calling Oak & Main Realty. This is Vera. How can I help you?',
        wait: 850
      },
      { speaker: 'Caller', text: 'I may need to sell my home in the next couple of months. I’m relocating for work.', wait: 700 },
      { speaker: 'Vera', text: 'I can help get the right information to the agent. Is the property already listed with anyone?', wait: 950 },
      { speaker: 'Caller', text: 'No. I have not spoken with an agent yet.', wait: 800 },
      { speaker: 'Vera', text: 'Understood. About when are you hoping to move, and may I get your name and email for the agent?', wait: 1000 },
      { speaker: 'Caller', text: 'Laura Kim, laura.kim@example.com. Probably within 60 to 90 days. This number is best.', wait: 900 },
      { speaker: 'Marcus', text: 'Laura’s contact details, seller timing, relocation reason, property basics, and preferred contact are attached.', wait: 850, intelligence: true },
      { speaker: 'ARKON', text: 'New seller opportunity · Contact captured · Agent call requested today · Full context ready', wait: 900, outcome: true }
    ]
  }
};

function TranscriptItem({ item }) {
  const isClient = ['Caller', 'Lead', 'Danielle', 'Daniel'].includes(item.speaker);
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

          <div className="real-estate-contact-record" aria-label={`${scenario.contact.label}: ${scenario.contact.name}, ${scenario.contact.phone}, ${scenario.contact.email}, ${scenario.contact.preference}`}>
            <div>
              <span>{scenario.contact.label}</span>
              <strong>{scenario.contact.name}</strong>
            </div>
            <div className="real-estate-contact-details">
              <span>{scenario.contact.phone}</span>
              <span>{scenario.contact.email}</span>
              <span>{scenario.contact.preference}</span>
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
