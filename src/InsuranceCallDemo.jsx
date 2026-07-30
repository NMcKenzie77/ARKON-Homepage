import { useEffect, useMemo, useRef, useState } from 'react';
import './real-estate-call-demo.css';

const EXAMPLE_AGENCY = 'Harbor Ridge Insurance Group';
const READ_HOLD_MS = 1500;

const scenarios = {
  commercial: {
    tab: 'Business owner requests a quote',
    eyebrow: 'Vera answers in the agency’s name',
    title: 'A serious commercial lead reaches the right producer with the details already organized.',
    description:
      'Vera welcomes Michael, captures the business and coverage context naturally, stays inside the licensed-agent boundary, and sends Carlos a useful opportunity instead of a vague callback note.',
    consoleLabel: 'Live inbound quote call',
    consoleAgent: `Vera · ${EXAMPLE_AGENCY}`,
    replayLabel: 'Replay quote call',
    proof: [
      'Uses the agency name and voice',
      'Captures commercial risk details',
      'Does not advise or quote',
      'Alerts the producer with next steps'
    ],
    property: {
      label: 'Commercial quote opportunity',
      address: 'Torres Heating & Cooling',
      status: 'Producer callback requested',
      facts: ['HVAC contractor', '5 vehicles', '8 employees'],
      context: 'General liability and commercial auto · September 1 renewal'
    },
    contact: {
      label: 'New prospect record created',
      name: 'Michael Torres',
      phone: '(305) 555-0148',
      email: 'michael@torreshvac.example',
      preference: 'Call preferred',
      assignedAgent: 'Assigned producer · Carlos Reynoso'
    },
    messages: [
      {
        speaker: 'Vera',
        text: `Thank you for calling ${EXAMPLE_AGENCY}. This is Vera. How can I help you?`,
        wait: 850
      },
      { speaker: 'Caller', text: 'I own an HVAC company and need quotes for general liability and commercial auto.', wait: 750 },
      {
        speaker: 'Vera',
        text: 'Absolutely. I can get the details organized for a licensed producer. What is the name of the business?',
        wait: 950
      },
      { speaker: 'Caller', text: 'Torres Heating & Cooling.', wait: 650 },
      {
        speaker: 'Vera',
        text: 'Thank you. How many company vehicles and employees do you currently have?',
        wait: 900
      },
      { speaker: 'Caller', text: 'Five vehicles and eight employees.', wait: 700 },
      {
        speaker: 'Vera',
        text: 'Are those policies currently active, and when do they renew?',
        wait: 850
      },
      { speaker: 'Caller', text: 'Yes. They renew September 1, but I want to review options before then.', wait: 800 },
      {
        speaker: 'Vera',
        text: 'That makes sense. May I get your email, and is calling this number the best way for Carlos to reach you?',
        wait: 950
      },
      { speaker: 'Caller', text: 'Yes. My email is michael@torreshvac.example, and a call is best.', wait: 800 },
      {
        speaker: 'Message to Carlos',
        text: 'Carlos, Michael Torres owns Torres Heating & Cooling. He needs general liability and commercial auto coverage for a five-vehicle HVAC operation with eight employees. His current policies renew September 1, and he wants to review options before renewal. Calling this number is best. Reach out today.',
        wait: 900,
        intelligence: true
      },
      {
        speaker: 'Vera',
        text: 'Thank you, Michael. I’ve shared the details with Carlos. He’ll call you to review the business and discuss the coverage options with you.',
        wait: 950,
        outcome: true
      }
    ]
  },
  personal: {
    tab: 'Family requests coverage',
    eyebrow: 'Vera captures the opportunity without giving advice',
    title: 'The prospect feels helped without Vera pretending to be a licensed agent.',
    description:
      'Vera organizes Angela’s home and auto request, captures the timing and household details a producer needs, and makes the licensed handoff clear.',
    consoleLabel: 'Live personal-lines call',
    consoleAgent: `Vera · ${EXAMPLE_AGENCY}`,
    replayLabel: 'Replay coverage call',
    proof: [
      'Captures home and auto context',
      'Clarifies closing timing',
      'Keeps advice with the producer',
      'Creates a complete callback record'
    ],
    property: {
      label: 'Personal-lines opportunity',
      address: 'Angela Brooks household',
      status: 'Closing in three weeks',
      facts: ['New home purchase', '2 vehicles', '2 household drivers'],
      context: 'Homeowners and auto coverage requested'
    },
    contact: {
      label: 'New prospect record created',
      name: 'Angela Brooks',
      phone: '(727) 555-0164',
      email: 'angela.brooks@example.com',
      preference: 'Text first',
      assignedAgent: 'Assigned producer · Maya Torres'
    },
    messages: [
      { speaker: 'Vera', text: `Thank you for calling ${EXAMPLE_AGENCY}. This is Vera. How can I help you?`, wait: 850 },
      { speaker: 'Caller', text: 'We are buying a home and need homeowners insurance. I also want to compare our auto coverage.', wait: 750 },
      { speaker: 'Vera', text: 'Congratulations on the new home. When are you scheduled to close?', wait: 850 },
      { speaker: 'Caller', text: 'In about three weeks.', wait: 700 },
      { speaker: 'Vera', text: 'What is the property address, and how many vehicles and household drivers should the producer discuss with you?', wait: 950 },
      { speaker: 'Caller', text: 'The home is at 418 Pine Street. We have two vehicles and two drivers.', wait: 800 },
      { speaker: 'Vera', text: 'Thank you. May I get your name and email, and would you prefer a call or text first?', wait: 950 },
      { speaker: 'Caller', text: 'Angela Brooks, angela.brooks@example.com. A text first would be best.', wait: 800 },
      { speaker: 'Message to Maya', text: 'Maya, Angela Brooks is closing on 418 Pine Street in about three weeks and wants to discuss homeowners and auto coverage. The household has two vehicles and two drivers. Text first, then arrange a time to review the options.', wait: 900, intelligence: true },
      { speaker: 'Vera', text: 'Thank you, Angela. Maya will text you to arrange a time to review the home and auto coverage with you.', wait: 900, outcome: true }
    ]
  },
  service: {
    tab: 'Policyholder needs help',
    eyebrow: 'Vera organizes a complete service request',
    title: 'Routine service requests stop interrupting producers without leaving the client guessing.',
    description:
      'Vera confirms the policyholder, certificate holder, destination, deadline, and service owner before routing the request to the agency team.',
    consoleLabel: 'Live policy-service call',
    consoleAgent: `Vera · ${EXAMPLE_AGENCY}`,
    replayLabel: 'Replay service call',
    proof: [
      'Confirms the policyholder record',
      'Captures the certificate holder',
      'Records the delivery deadline',
      'Routes a complete service request'
    ],
    property: {
      label: 'Policy-service request',
      address: 'Reyes Property Maintenance',
      status: 'Certificate requested',
      facts: ['General liability', 'Property manager request', 'Due today'],
      context: 'Certificate must be emailed before 3:00 PM'
    },
    contact: {
      label: 'Policyholder record matched',
      name: 'Daniel Reyes',
      phone: '(973) 555-0162',
      email: 'daniel@reyesmaintenance.example',
      preference: 'Email confirmation',
      assignedAgent: 'Service representative · Elena Ruiz'
    },
    messages: [
      { speaker: 'Vera', text: `Thank you for calling ${EXAMPLE_AGENCY}. This is Vera. How can I help you?`, wait: 850 },
      { speaker: 'Caller', text: 'I need a certificate of insurance sent to a property manager today.', wait: 700 },
      { speaker: 'Vera', text: 'I can get that request to the service team. What is the business name on the policy?', wait: 850 },
      { speaker: 'Caller', text: 'Reyes Property Maintenance.', wait: 650 },
      { speaker: 'Vera', text: 'What is the certificate holder’s name and the email address where it should be sent?', wait: 900 },
      { speaker: 'Caller', text: 'Harbor Point Management. Send it to certificates@harborpoint.example.', wait: 800 },
      { speaker: 'Vera', text: 'Is there a deadline or any wording they specifically requested?', wait: 850 },
      { speaker: 'Caller', text: 'They need it before 3 PM. I have not been given any special wording.', wait: 750 },
      { speaker: 'Message to Elena', text: 'Elena, Daniel Reyes of Reyes Property Maintenance needs a general liability certificate sent to Harbor Point Management at certificates@harborpoint.example before 3:00 PM today. No special wording was provided. Email Daniel when it has been sent.', wait: 900, intelligence: true },
      { speaker: 'Vera', text: 'Thank you, Daniel. I’ve sent the complete request to Elena. The team will email you once the certificate has been sent.', wait: 900, outcome: true }
    ]
  },
  followUp: {
    tab: 'Prospect did not bind',
    eyebrow: 'Naya follows up with the prior quote context',
    title: 'Good quote opportunities do not disappear after the first conversation.',
    description:
      'Naya reconnects with Laura using the business, requested coverage, prior producer conversation, renewal timing, and preferred contact method already attached to the record.',
    consoleLabel: 'Proactive quote follow-up',
    consoleAgent: `Naya · ${EXAMPLE_AGENCY}`,
    replayLabel: 'Replay follow-up',
    proof: [
      'Uses the prior quote context',
      'References the renewal timing',
      'Respects the contact preference',
      'Alerts the assigned producer'
    ],
    property: {
      label: 'Past quote opportunity matched',
      address: 'Kim Consulting Group',
      status: 'Ready to revisit coverage',
      facts: ['Professional liability', 'Cyber coverage', 'August renewal'],
      context: 'Last producer conversation: six weeks ago'
    },
    contact: {
      label: 'Prospect record updated',
      name: 'Laura Kim',
      phone: '(908) 555-0127',
      email: 'laura@kimconsulting.example',
      preference: 'Email preferred',
      assignedAgent: 'Assigned producer · Carlos Reynoso'
    },
    messages: [
      { speaker: 'Naya', text: `Hi Laura, it’s Naya with ${EXAMPLE_AGENCY}. You spoke with Carlos about professional liability and cyber coverage for Kim Consulting Group. Are you still planning to review coverage before the August renewal?`, wait: 900 },
      { speaker: 'Laura', text: 'Yes. We delayed the decision, but I need to get back to it this week.', wait: 800 },
      { speaker: 'Naya', text: 'Understood. Has anything changed with the business since you last spoke with Carlos?', wait: 850 },
      { speaker: 'Laura', text: 'We added two employees, but everything else is about the same.', wait: 750 },
      { speaker: 'Naya', text: 'Thank you. Is email still the easiest way for Carlos to send the next steps and arrange a time with you?', wait: 850 },
      { speaker: 'Laura', text: 'Yes, email is best.', wait: 700 },
      { speaker: 'Message to Carlos', text: 'Carlos, Laura Kim is ready to revisit professional liability and cyber coverage for Kim Consulting Group before the August renewal. The business has added two employees since your last conversation. Email is still best. Follow up this week.', wait: 900, intelligence: true },
      { speaker: 'Naya', text: 'Thank you, Laura. I’ve updated Carlos. He’ll email you this week so you can review the changes and next steps together.', wait: 900, outcome: true }
    ]
  }
};

function TranscriptItem({ item }) {
  const isClient = ['Caller', 'Lead', 'Michael', 'Angela', 'Daniel', 'Laura'].includes(item.speaker);
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

export default function InsuranceCallDemo() {
  const [activeKey, setActiveKey] = useState('commercial');
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
    <section className="real-estate-call-demo insurance-call-demo" aria-labelledby="insurance-call-title">
      <div className="real-estate-call-copy">
        <p className="eyebrow">{scenario.eyebrow}</p>
        <h2 id="insurance-call-title">{scenario.title}</h2>
        <p>{scenario.description}</p>

        <div className="real-estate-call-tabs" role="tablist" aria-label="Insurance agency conversation examples">
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

        <div className="real-estate-call-proof" aria-label="Insurance conversation capabilities">
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
