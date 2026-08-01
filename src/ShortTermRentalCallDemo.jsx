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
      { speaker: 'Guest', text: 'Hi, where should we park? Also, are there beach towels at the house?', wait: 800 },
      { speaker: 'Naya', text: 'Hi Marcus. There are two parking spaces behind the house. Just leave the front curb open for the neighbor.', wait: 900 },
      { speaker: 'Guest', text: 'Perfect. And the towels?', wait: 700 },
      { speaker: 'Naya', text: 'There are four blue beach towels in the hall closet next to the washer.', wait: 850 },
      { speaker: 'Guest', text: 'Found them. Thank you.', wait: 650 },
      { speaker: 'Naya', text: 'You’re welcome. Enjoy the beach.', wait: 750, outcome: true }
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
      { speaker: 'Naya', text: 'Happy anniversary. Do you want something quiet by the water, or more lively?', wait: 850 },
      { speaker: 'Guest', text: 'Quiet by the water. Nothing too formal.', wait: 700 },
      { speaker: 'Naya', text: 'Island Way Grill sounds like your best fit. It has water views, but it still feels relaxed. I also found two backups in case you want choices.', wait: 950 },
      { speaker: 'Guest', text: 'What could we do after dinner?', wait: 700 },
      { speaker: 'Naya', text: 'Sand Key Park is close and should be nice around sunset. You could have dinner around six, catch the sunset, then walk by the marina. I’ll send the full plan with travel times.', wait: 900, outcome: true }
    ]
  },
  cleaner: {
    tab: 'Cleaner coordination',
    eyebrow: 'Every turnover is confirmed and documented',
    title: 'The host knows the property is ready before the next guest arrives.',
    description: 'Naya confirms the cleaner, records arrival and checkout, collects before-and-after photos, captures supply and maintenance issues, and sends the host a final ready-for-arrival update.',
    consoleLabel: 'Turnover coordination',
    consoleAgent: `Naya · ${EXAMPLE_OPERATOR}`,
    replayLabel: 'Replay turnover coordination',
    proof: ['Confirms cleaner availability', 'Collects arrival and final photos', 'Captures property issues', 'Confirms readiness to the host'],
    property: {
      label: 'Turnover schedule matched',
      address: 'Gulfview Loft · Clearwater',
      status: 'Turnover scheduled',
      facts: ['Guest checkout: Tomorrow at noon', 'Cleaner arrival: 12:30 PM', 'Next guest check-in: 4 PM'],
      context: 'Arrival photos required · Final photos required · Host receives readiness report'
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
      { speaker: 'Naya', text: 'Hi Tasha. The guest at Gulfview Loft checks out tomorrow at noon. Can you confirm you’ll be there for the turnover?', wait: 800 },
      { speaker: 'Cleaner', text: 'Yes. I’ll be there at 12:30.', wait: 700 },
      { speaker: 'Naya', text: 'Perfect. The next guest checks in at four. Please check in when you arrive and upload the arrival photos before you start.', wait: 900 },
      { speaker: 'Cleaner', text: 'I’m at the property now. Arrival photos are uploaded.', wait: 800 },
      { speaker: 'Naya', text: 'Got them. Let me know when the turnover is finished and upload the final photos before you check out.', wait: 850 },
      { speaker: 'Cleaner', text: 'The property is ready and the final photos are uploaded. We’re low on paper towels, and the bathroom faucet is dripping.', wait: 900 },
      { speaker: 'Naya', text: 'Got it. You’re checked out. I’ve added the paper towels and faucet to the property report.', wait: 800 },
      { speaker: 'Message to host', text: 'Gulfview Loft is ready for the 4:00 guest arrival. Final photos are uploaded. Tasha reported low paper towels and a dripping bathroom faucet. Both items have been added for follow-up.', wait: 900, intelligence: true, outcome: true }
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
      { speaker: 'Guest', text: 'There’s water coming from under the kitchen sink and it’s spreading across the floor.', wait: 750 },
      { speaker: 'Naya', text: 'I’m sorry, Olivia. First, is everyone safe? Is the water near any outlets or cords?', wait: 900 },
      { speaker: 'Guest', text: 'We’re safe. Nothing electrical is wet, but the water is still coming out.', wait: 750 },
      { speaker: 'Naya', text: 'Okay. If you can reach the small valve under the sink safely, turn it clockwise. I’m calling the plumber now.', wait: 950 },
      { speaker: 'Guest', text: 'I turned it. The water is slowing down.', wait: 700 },
      { speaker: 'Message to plumber', text: 'Kitchen sink leak at Seabreeze Cottage, Unit 4. The guest shut off the valve and the water is slowing. No electrical contact. What’s your ETA?', wait: 850, intelligence: true },
      { speaker: 'Message to host', text: 'Olivia reported a kitchen sink leak at Seabreeze Cottage. She’s safe, the valve is off, and the plumber has been contacted. I’ll keep her updated and let you know when he’s on the way.', wait: 900, intelligence: true },
      { speaker: 'Naya', text: 'The plumber has the details, and the host knows what’s happening. I’ll stay on this and send you the arrival time as soon as I have it.', wait: 850, outcome: true }
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
      { speaker: 'Naya', text: 'Hi Olivia. Did you and Daniel make it home okay? How was the rest of the anniversary trip?', wait: 800 },
      { speaker: 'Guest', text: 'We did. It was amazing. Island Way and the sunset walk were perfect. We’re already talking about coming back next year.', wait: 900 },
      { speaker: 'Naya', text: 'I love hearing that. I’ll make sure we remember the waterfront dinner and your anniversary week for next time.', wait: 850 },
      { speaker: 'Guest', text: 'That would be great.', wait: 650 },
      { speaker: 'Naya', text: 'Would you mind leaving a review about your stay? I can send the link right here.', wait: 850 },
      { speaker: 'Guest', text: 'Absolutely. Send it over.', wait: 650 },
      { speaker: 'Naya', text: 'Sent. Thank you, Olivia. We’d love to have you both back next year.', wait: 800, outcome: true }
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
            <p className="eyebrow">Meet your short-term rental digital team</p>
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
