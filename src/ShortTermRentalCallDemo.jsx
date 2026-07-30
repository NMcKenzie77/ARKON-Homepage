import { useEffect, useMemo, useRef, useState } from 'react';
import './real-estate-call-demo.css';

const EXAMPLE_OPERATOR = 'Harborlight Stays';
const READ_HOLD_MS = 1500;

const scenarios = {
  checkIn: {
    tab: 'Guest asks a question',
    eyebrow: 'Reservation context answers the question immediately',
    title: 'The guest receives the correct arrival details without waiting for the host to find the reservation.',
    description: 'Naya matches the guest and stay, uses the approved property instructions, confirms timing, and keeps sensitive access information inside the correct release window.',
    consoleLabel: 'Pre-arrival guest message',
    consoleAgent: `Naya · ${EXAMPLE_OPERATOR}`,
    replayLabel: 'Replay guest question',
    proof: ['Matches the reservation', 'Uses property-specific rules', 'Protects access information', 'Records the guest request'],
    property: {
      label: 'Upcoming reservation matched',
      address: 'Palm House · St. Petersburg',
      status: 'Check-in tomorrow',
      facts: ['Guest: Marcus Lee', '4 guests', '3-night stay'],
      context: 'Standard check-in 4:00 PM · Door code releases at 3:30 PM'
    },
    contact: {
      label: 'Guest record matched',
      name: 'Marcus Lee',
      phone: '(813) 555-0182',
      email: 'marcus.lee@example.com',
      preference: 'Platform message',
      assignedAgent: 'Property manager · Elena Ruiz'
    },
    messages: [
      { speaker: 'Guest', text: 'We arrive tomorrow around 2 PM. Can we check in early, and where do we get the door code?', wait: 800 },
      { speaker: 'Naya', text: 'Hi Marcus. I found your Palm House reservation. Standard check-in is 4 PM, and the door code is released at 3:30 PM on arrival day.', wait: 950 },
      { speaker: 'Guest', text: 'Could the home be ready by 2 PM?', wait: 700 },
      { speaker: 'Naya', text: 'I can check with the turnover team. Early check-in is only confirmed after cleaning is complete, so I will not promise it before they respond.', wait: 950 },
      { speaker: 'Message to cleaner', text: 'Marcus Lee is asking whether Palm House can support a 2 PM early check-in tomorrow. Please confirm after the turnover schedule is reviewed.', wait: 850, intelligence: true },
      { speaker: 'Naya', text: 'I’ve asked the turnover team to confirm whether 2 PM is possible. Your regular 4 PM check-in remains secured, and I’ll update you as soon as I hear back.', wait: 900, outcome: true }
    ]
  },
  cleaner: {
    tab: 'Cleaner communication',
    eyebrow: 'Cleaner updates become an operating decision',
    title: 'A delayed turnover reaches the right people before it becomes a guest surprise.',
    description: 'Naya captures what remains unfinished, checks the arrival time, coordinates the next action, and prepares a guest update that the host can approve when needed.',
    consoleLabel: 'Cleaner coordination message',
    consoleAgent: `Naya · ${EXAMPLE_OPERATOR}`,
    replayLabel: 'Replay cleaner communication',
    proof: ['Captures the exact delay', 'Checks guest arrival timing', 'Coordinates backup help', 'Prepares the guest update'],
    property: {
      label: 'Turnover record matched',
      address: 'Gulfview Loft · Clearwater',
      status: 'Turnover at risk',
      facts: ['Check-in today', 'Guest arrival: 4 PM', 'Laundry equipment issue'],
      context: 'Backup linen runner contacted · Host review required'
    },
    contact: {
      label: 'Cleaner record matched',
      name: 'Tasha Green',
      phone: '(727) 555-0191',
      email: 'tasha@coastclean.example',
      preference: 'Text updates',
      assignedAgent: 'Operations manager · Jordan Blake'
    },
    messages: [
      { speaker: 'Cleaner', text: 'The dryer stopped working and the bedding is still damp. I do not think the loft will be ready by 4.', wait: 800 },
      { speaker: 'Naya', text: 'Thanks, Tasha. What is already complete, and how much time would you need if dry linens were delivered?', wait: 900 },
      { speaker: 'Cleaner', text: 'Everything else is done. With dry linens I need about 30 minutes.', wait: 700 },
      { speaker: 'Message to linen runner', text: 'Gulfview Loft needs one complete king bedding set and four bath towel sets delivered immediately. Confirm pickup and estimated arrival.', wait: 850, intelligence: true },
      { speaker: 'Message to host', text: 'Jordan, Gulfview Loft is otherwise complete, but the dryer failed and the bedding is damp. A backup linen delivery has been requested. Tasha needs 30 minutes after arrival. I am holding the guest message until the delivery time is confirmed.', wait: 900, intelligence: true },
      { speaker: 'Naya', text: 'Tasha, backup linens are being coordinated now. I’ll send the delivery time as soon as it is confirmed and update the arrival plan from there.', wait: 850, outcome: true }
    ]
  },
  urgent: {
    tab: 'Urgent issue after hours',
    eyebrow: 'The guest gets help before the host wakes up',
    title: 'An urgent property issue is triaged, routed, and documented without leaving the guest guessing.',
    description: 'Naya confirms the guest and property, checks immediate safety, follows the approved emergency workflow, contacts the on-call vendor, and alerts the host with the full context.',
    consoleLabel: 'After-hours guest message',
    consoleAgent: `Naya · ${EXAMPLE_OPERATOR}`,
    replayLabel: 'Replay urgent issue',
    proof: ['Confirms guest and property', 'Checks immediate safety', 'Routes the on-call vendor', 'Alerts the host with context'],
    property: {
      label: 'Active stay matched',
      address: 'Seabreeze Cottage · Unit 4',
      status: 'Urgent maintenance active',
      facts: ['Guest: Olivia Chen', 'Night 2 of 4', 'Water leak reported'],
      context: 'On-call plumber assigned · Host escalation sent'
    },
    contact: {
      label: 'Guest and reservation record',
      name: 'Olivia Chen',
      phone: '(727) 555-0138',
      email: 'olivia.chen@example.com',
      preference: 'Text updates',
      assignedAgent: 'Stay owner · Jordan Blake'
    },
    messages: [
      { speaker: 'Guest', text: 'Hi, there is water coming from under the kitchen sink and it is spreading across the floor.', wait: 750 },
      { speaker: 'Naya', text: 'I’m sorry you’re dealing with that, Olivia. Are you safely away from the water, and do you see any electrical cords or outlets getting wet?', wait: 950 },
      { speaker: 'Guest', text: 'We are safe. Nothing electrical is wet, but the water is still coming out.', wait: 750 },
      { speaker: 'Naya', text: 'Thank you. Please turn the small valve beneath the sink clockwise if you can reach it safely. I’m contacting the on-call plumber now and will stay with you here.', wait: 1000 },
      { speaker: 'Guest', text: 'The valve is off. The water has slowed down.', wait: 700 },
      { speaker: 'Message to plumber', text: 'Seabreeze Cottage Unit 4 has an active kitchen-sink leak. The guest shut off the under-sink valve, the water has slowed, and no electrical contact was reported. Please confirm your arrival time now.', wait: 900, intelligence: true },
      { speaker: 'Message to host', text: 'Jordan, Olivia Chen at Seabreeze Cottage Unit 4 reported an active kitchen-sink leak. She is safe, the shutoff valve is closed, and the on-call plumber has been contacted. I will continue updating the guest and notify you if the issue escalates.', wait: 900, intelligence: true },
      { speaker: 'Naya', text: 'Olivia, the plumber has been contacted and the host has the full update. I’ll message you with the arrival time as soon as it is confirmed.', wait: 900, outcome: true }
    ]
  },
  vendor: {
    tab: 'Vendor needs a decision',
    eyebrow: 'Vendor updates stop getting buried in the host’s phone',
    title: 'A maintenance finding reaches the host with the property, cost, timing, and guest impact already attached.',
    description: 'Naya records the vendor’s finding, separates an immediate safety action from an approval decision, and gives the host one clear summary instead of a scattered message thread.',
    consoleLabel: 'Maintenance vendor update',
    consoleAgent: `Naya · ${EXAMPLE_OPERATOR}`,
    replayLabel: 'Replay vendor update',
    proof: ['Matches the property and work order', 'Separates safety from approval', 'Captures cost and timing', 'Creates one host decision'],
    property: {
      label: 'Maintenance work order matched',
      address: 'Bayfront Bungalow · Tampa',
      status: 'Host approval needed',
      facts: ['HVAC service', 'Current guest in stay', '$620 repair option'],
      context: 'Temporary cooling restored · Permanent repair pending'
    },
    contact: {
      label: 'Vendor record matched',
      name: 'Luis Mendoza',
      phone: '(813) 555-0116',
      email: 'service@suncoastair.example',
      preference: 'Call for approval',
      assignedAgent: 'Property owner · Jordan Blake'
    },
    messages: [
      { speaker: 'Vendor', text: 'The capacitor failed. I installed a temporary part so the system is cooling, but the correct repair is $620.', wait: 800 },
      { speaker: 'Naya', text: 'Thank you, Luis. Is the home cooling safely now, and how long can the temporary part remain in service?', wait: 900 },
      { speaker: 'Vendor', text: 'It is cooling normally. The temporary part should only be used for a few days.', wait: 700 },
      { speaker: 'Naya', text: 'Please send the written estimate and the earliest permanent-repair opening. I’ll route the approval to the owner with the guest impact attached.', wait: 900 },
      { speaker: 'Message to host', text: 'Jordan, Bayfront Bungalow is cooling normally after a temporary HVAC repair. The permanent capacitor repair is $620 and should be completed within a few days. The vendor is sending the written estimate and earliest opening. Approval is needed once those arrive.', wait: 900, intelligence: true },
      { speaker: 'Naya', text: 'Luis, the owner has the full update. Please send the estimate and scheduling options here so the decision can be completed without losing the thread.', wait: 850, outcome: true }
    ]
  }
};

const teamCards = [
  {
    number: '01',
    title: 'Naya keeps guest and cleaner communication moving.',
    copy: 'Naya answers guest questions using the correct reservation and property instructions, coordinates cleaners around turnovers and arrival timing, and keeps both sides updated without forcing the host to manage every message.'
  },
  {
    number: '02',
    title: 'Charlie keeps maintenance activity and property costs visible.',
    copy: 'Charlie connects repair requests, vendor findings, estimates, approvals, completed work, recurring issues, and maintenance spending to the correct property.'
  },
  {
    number: '03',
    title: 'Marcus keeps every stay and relationship connected.',
    copy: 'Marcus connects properties, reservations, guests, cleaners, vendors, messages, prior issues, preferences, and the next required action so the operation does not lose context between conversations.'
  },
  {
    number: '04',
    title: 'Iris and Grant keep portfolio priorities visible.',
    copy: 'Iris separates urgent guest, cleaner, vendor, and property messages from routine activity. Grant gives the host, property manager, or portfolio owner a clear briefing of what needs attention.'
  }
];

function TranscriptItem({ item }) {
  const isExternal = ['Guest', 'Cleaner', 'Vendor'].includes(item.speaker);
  const classNames = [
    'real-estate-call-line',
    item.intelligence ? 'is-intelligence' : '',
    item.outcome ? 'is-outcome' : '',
    isExternal ? 'is-caller' : 'is-team'
  ].filter(Boolean).join(' ');

  return (
    <div className={classNames}>
      <span>{item.speaker}</span>
      <p>{item.text}</p>
    </div>
  );
}

export default function ShortTermRentalCallDemo() {
  const [activeKey, setActiveKey] = useState('checkIn');
  const [visibleCount, setVisibleCount] = useState(0);
  const [replayToken, setReplayToken] = useState(0);
  const transcriptRef = useRef(null);
  const scenario = scenarios[activeKey];
  const visibleMessages = useMemo(() => scenario.messages.slice(0, visibleCount), [scenario.messages, visibleCount]);

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
    <>
      <section className="real-estate-call-demo short-term-rental-call-demo" data-short-term-rental-call-demo="true" aria-labelledby="short-term-rental-call-title">
        <div className="real-estate-call-copy">
          <p className="eyebrow">{scenario.eyebrow}</p>
          <h2 id="short-term-rental-call-title">{scenario.title}</h2>
          <p>{scenario.description}</p>

          <div className="real-estate-call-tabs" role="tablist" aria-label="Short-term rental conversation examples">
            {Object.entries(scenarios).map(([key, item]) => (
              <button aria-selected={activeKey === key} className={activeKey === key ? 'active' : ''} key={key} onClick={() => selectScenario(key)} role="tab" type="button">
                {item.tab}
              </button>
            ))}
          </div>

          <div className="real-estate-call-proof" aria-label="Short-term rental conversation capabilities">
            {scenario.proof.map(item => <span key={item}>{item}</span>)}
          </div>

          <button className="real-estate-call-replay" onClick={() => setReplayToken(token => token + 1)} type="button">
            <span aria-hidden="true">↻</span>
            {scenario.replayLabel}
          </button>
        </div>

        <div className="real-estate-call-console" aria-label={`Example: ${scenario.consoleLabel}`}>
          <div className="real-estate-call-console-header">
            <div><span className="real-estate-live-dot" aria-hidden="true" /><strong>{scenario.consoleLabel}</strong></div>
            <small>{scenario.consoleAgent}</small>
          </div>

          <div className="real-estate-property-card">
            <div><span>{scenario.property.label}</span><h3>{scenario.property.address}</h3></div>
            <strong>{scenario.property.status}</strong>
            <div className="real-estate-property-facts">{scenario.property.facts.map(fact => <span key={fact}>{fact}</span>)}</div>
            <p>{scenario.property.context}</p>

            <div className="real-estate-contact-record" aria-label={`${scenario.contact.label}: ${scenario.contact.name}, ${scenario.contact.phone}, ${scenario.contact.email}, ${scenario.contact.preference}, ${scenario.contact.assignedAgent}`}>
              <div><span>{scenario.contact.label}</span><strong>{scenario.contact.name}</strong></div>
              <div className="real-estate-contact-details">
                <span>{scenario.contact.phone}</span><span>{scenario.contact.email}</span><span>{scenario.contact.preference}</span><span>{scenario.contact.assignedAgent}</span>
              </div>
            </div>
          </div>

          <div className="real-estate-call-transcript" ref={transcriptRef} aria-live="polite">
            {visibleMessages.map((item, index) => <TranscriptItem item={item} key={`${activeKey}-${index}-${item.speaker}`} />)}
            {visibleCount < scenario.messages.length ? (
              <div className="real-estate-call-thinking" aria-label="Conversation continuing"><span /><span /><span /></div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="section insurance-team-section short-term-rental-team-section" aria-labelledby="short-term-rental-team-title">
        <div className="insurance-section-heading">
          <div>
            <p className="eyebrow">Meet your short-term rental digital AI team</p>
            <h2 id="short-term-rental-team-title">Every guest, cleaner, vendor, and property issue reaches the right person with the stay context already attached.</h2>
          </div>
          <p>
            Naya handles guest communication and cleaner coordination. Charlie tracks maintenance activity and recurring property costs. Marcus keeps properties, stays, guests, vendors, and conversation history connected. Iris separates urgent operational messages from routine activity. Grant briefs the host, property manager, or portfolio owner on what needs attention.
          </p>
        </div>

        <div className="industry-card-grid insurance-team-grid short-term-rental-team-grid">
          {teamCards.map(card => (
            <article className="industry-card insurance-team-card short-term-rental-team-card is-visible" data-reveal key={card.number}>
              <span>{card.number}</span>
              <h3>{card.title}</h3>
              <p>{card.copy}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
