import { useEffect, useMemo, useRef, useState } from 'react';
import './real-estate-call-demo.css';

const EXAMPLE_OPERATOR = 'Harborlight Stays';
const READ_HOLD_MS = 1500;

const scenarios = {
  guestQuestion: {
    tab: 'Guest asks a question',
    eyebrow: 'Guest questions are answered with the correct stay details',
    title: 'The guest gets a useful answer without waiting for the host to stop what they are doing.',
    description: 'Naya matches the guest to the active reservation, checks the property instructions, answers in the host’s approved voice, and records the request with the stay.',
    consoleLabel: 'Active-stay guest message',
    consoleAgent: `Naya · ${EXAMPLE_OPERATOR}`,
    replayLabel: 'Replay guest question',
    proof: ['Matches the active stay', 'Uses property instructions', 'Answers in the host’s voice', 'Records the request'],
    property: {
      label: 'Active reservation matched',
      address: 'Palm House · St. Petersburg',
      status: 'Guest currently in stay',
      facts: ['Guest: Marcus Lee', 'Night 1 of 3', '4 registered guests'],
      context: 'Parking behind the home · Beach towels in the hall closet'
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
      { speaker: 'Guest', text: 'Hi, where should we park, and are there beach towels at the house?', wait: 800 },
      { speaker: 'Naya', text: 'Hi Marcus. You can park in the two spaces directly behind Palm House. Please keep the front curb clear for the neighboring home.', wait: 900 },
      { speaker: 'Guest', text: 'Perfect. What about towels for the beach?', wait: 700 },
      { speaker: 'Naya', text: 'There are four blue beach towels in the hall closet beside the washer. Please leave them in the laundry basket before checkout.', wait: 900 },
      { speaker: 'Guest', text: 'Got it. Thank you.', wait: 650 },
      { speaker: 'Naya', text: 'You’re welcome. I’ve added the parking and towel questions to your stay record, so the team has the context if you need anything else.', wait: 850, outcome: true }
    ]
  },
  localGuide: {
    tab: 'Where should we go?',
    eyebrow: 'Local recommendations start with who the guest is',
    title: 'The guest receives a list built around who is traveling, why they are there, and what kind of experience they want.',
    description: 'Naya uses the reservation, guest profile, trip purpose, ages, timing, and stated preferences to build recommendations that fit this guest instead of returning a generic list.',
    consoleLabel: 'Personalized recommendation request',
    consoleAgent: `Naya · ${EXAMPLE_OPERATOR}`,
    replayLabel: 'Replay personalized guidance',
    proof: ['Uses the guest profile', 'Understands the trip purpose', 'Narrows by preferences', 'Builds a relevant list'],
    property: {
      label: 'Guest profile and reservation matched',
      address: 'Gulfview Loft · Clearwater',
      status: 'Anniversary evening being planned',
      facts: ['Guests: Olivia and Daniel Chen', '10th anniversary trip', 'No children traveling'],
      context: 'Prefer waterfront dining · Quiet evening · Comfortable walking distance after dinner'
    },
    contact: {
      label: 'Guest profile matched',
      name: 'Olivia Chen',
      phone: '(727) 555-0138',
      email: 'olivia.chen@example.com',
      preference: 'Text updates',
      assignedAgent: 'Stay owner · Jordan Blake'
    },
    messages: [
      { speaker: 'Guest', text: 'Daniel and I want to do something special tonight for our anniversary. Where should we go?', wait: 800 },
      { speaker: 'Naya', text: 'Happy anniversary, Olivia. Since you wanted a quiet waterfront evening, I’m building this around dinner, sunset, and an easy walk afterward rather than a crowded nightlife area.', wait: 950 },
      { speaker: 'Guest', text: 'That sounds right. We do not want anything too formal.', wait: 700 },
      { speaker: 'Naya', text: 'I have three good fits. Caretta on the Gulf is the most polished, Island Way Grill is relaxed with water views, and Columbia Sand Key is quieter with a broader menu. Island Way looks closest to what you described.', wait: 1000 },
      { speaker: 'Guest', text: 'What would you pair with Island Way?', wait: 700 },
      { speaker: 'Naya', text: 'Dinner around 6:00, sunset at Sand Key Park afterward, then a short walk near the marina. I’ll send the three options with travel times and the anniversary plan in one message so you can compare them.', wait: 900, outcome: true }
    ]
  },
  cleaner: {
    tab: 'Cleaner coordination',
    eyebrow: 'Cleaner updates become an operating decision',
    title: 'A delayed turnover reaches the right people before it becomes a guest surprise.',
    description: 'Naya captures what remains unfinished, checks the arrival time, coordinates the next action, and prepares the guest update that the host can approve when needed.',
    consoleLabel: 'Cleaner coordination message',
    consoleAgent: `Naya · ${EXAMPLE_OPERATOR}`,
    replayLabel: 'Replay cleaner coordination',
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
      { speaker: 'Message to linen runner', text: 'Gulfview Loft needs one complete king bedding set and four bath towel sets delivered immediately. Please confirm pickup and estimated arrival.', wait: 850, intelligence: true },
      { speaker: 'Message to host', text: 'Jordan, Gulfview Loft is otherwise complete, but the dryer failed and the bedding is damp. A backup linen delivery has been requested. Tasha needs 30 minutes after delivery. I am holding the guest update until the delivery time is confirmed.', wait: 900, intelligence: true },
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
  review: {
    tab: 'Review and return stay',
    eyebrow: 'The review request follows a stay worth talking about',
    title: 'We turn “That was a good trip” into “That was amazing. When can we go back?”',
    description: 'Naya checks for genuine satisfaction, connects the review request to the guest’s actual experience, records what made the stay memorable, and keeps future return-stay preferences attached to the guest profile.',
    consoleLabel: 'Post-stay guest follow-up',
    consoleAgent: `Naya · ${EXAMPLE_OPERATOR}`,
    replayLabel: 'Replay review follow-up',
    proof: ['Confirms satisfaction first', 'Requests the review naturally', 'Captures what mattered', 'Keeps return intent attached'],
    property: {
      label: 'Completed stay and guest profile matched',
      address: 'Gulfview Loft · Clearwater',
      status: 'Positive checkout follow-up',
      facts: ['Guests: Olivia and Daniel Chen', '10th anniversary completed', 'No unresolved stay issues'],
      context: 'Waterfront evening enjoyed · Guest expressed return interest · Review not yet requested'
    },
    contact: {
      label: 'Returning-guest profile updated',
      name: 'Olivia Chen',
      phone: '(727) 555-0138',
      email: 'olivia.chen@example.com',
      preference: 'Text updates',
      assignedAgent: 'Stay owner · Jordan Blake'
    },
    messages: [
      { speaker: 'Naya', text: 'Hi Olivia. I hope you and Daniel made it home safely. How did the anniversary evening and the rest of your stay turn out?', wait: 800 },
      { speaker: 'Guest', text: 'It was amazing. Island Way and the sunset walk were perfect. We were already talking about coming back next year.', wait: 900 },
      { speaker: 'Naya', text: 'I’m glad it felt special. I’ve saved the quiet waterfront preference and your anniversary timing, so the team remembers what worked when you return.', wait: 900 },
      { speaker: 'Guest', text: 'Thank you. That would be great.', wait: 650 },
      { speaker: 'Naya', text: 'Would you mind sharing that experience in a review? It helps future guests understand what makes the stay different. I’ll send the review link here, and I’ll also note that you may want the same anniversary week next year.', wait: 950 },
      { speaker: 'Guest', text: 'Absolutely. Send it over.', wait: 650 },
      { speaker: 'Naya', text: 'Sent. Thank you, Olivia. Your return interest and anniversary preferences are attached to your guest profile so the host can follow up at the right time.', wait: 850, outcome: true }
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
  const [activeKey, setActiveKey] = useState('guestQuestion');
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
