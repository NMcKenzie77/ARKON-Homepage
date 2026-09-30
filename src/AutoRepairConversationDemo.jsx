import { useEffect, useMemo, useRef, useState } from 'react';
import './auto-repair-conversation-demo.css';

const SHOP_NAME = 'Northside Auto Care';

const scenarios = {
  deferredMaintenance: {
    tab: 'Bring back deferred work',
    eyebrow: 'Naya follows up with the customer’s actual vehicle history',
    title: 'The customer hears about the work they already discussed, not a generic reminder.',
    description:
      'Naya uses the customer’s name, vehicle, prior recommendation, and estimate to offer shop-approved drop-off times by text. Once the customer confirms an available time, the appointment is added to the shop calendar.',
    proof: [
      'Uses the customer’s name and vehicle',
      'References the exact deferred work',
      'Remembers the prior estimate',
      'Offers shop-approved arrival windows',
      'Books after the customer confirms'
    ],
    contactName: 'Michael Torres',
    contactInitial: 'M',
    assistantName: 'Naya',
    channelLabel: 'Text conversation',
    messages: [
      {
        type: 'message',
        from: 'shop',
        text: `Hi Michael, it’s Naya with ${SHOP_NAME}. When your 2018 Honda Accord was in last month, the shop recommended replacing the front brake pads and rotors. You decided to hold off at the time. Would you like me to find an appointment for you?`,
        time: '10:14 AM',
        wait: 950
      },
      { type: 'message', from: 'customer', text: 'Yes, I should probably get that taken care of.', time: '10:16 AM', wait: 850 },
      {
        type: 'message',
        from: 'shop',
        text: 'Absolutely. The estimate on file was $680. I can offer Thursday, October 8, from 3:30 to 4:00 PM for drop-off. Would you like me to book that arrival window?',
        time: '10:16 AM',
        wait: 1050
      },
      { type: 'message', from: 'customer', text: 'Yes, please book it.', time: '10:17 AM', wait: 750 },
      {
        type: 'message',
        from: 'shop',
        text: 'You’re confirmed for drop-off Thursday, October 8, from 3:30 to 4:00 PM. I’ll send your confirmation by text shortly. That’s your arrival window, not the repair start time.',
        time: '10:17 AM',
        wait: 850
      },
      {
        type: 'confirmation',
        title: 'Drop-off appointment confirmed',
        detail: '2018 Honda Accord · Front brakes · $680 estimate',
        note: 'Thu, Oct 8 · 3:30–4:00 PM arrival window · Calendar updated',
        time: '10:18 AM',
        wait: 900
      }
    ]
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
    contactName: 'Angela Brooks',
    contactInitial: 'A',
    assistantName: 'Naya',
    channelLabel: 'Text conversation',
    messages: [
      {
        type: 'message',
        from: 'shop',
        text: `Hi Angela, it’s Naya with ${SHOP_NAME}. Your 2021 Toyota RAV4 is approaching the mileage for its next oil service and tire rotation. Would you like me to reserve a time?`,
        time: '1:42 PM',
        wait: 900
      },
      { type: 'message', from: 'customer', text: 'Yes. What do you have next week?', time: '1:44 PM', wait: 800 },
      {
        type: 'message',
        from: 'shop',
        text: 'We have Wednesday at 10:00 or Friday at 2:30 available.',
        time: '1:44 PM',
        wait: 850
      },
      { type: 'message', from: 'customer', text: 'Friday at 2:30 works.', time: '1:45 PM', wait: 700 },
      {
        type: 'message',
        from: 'shop',
        text: 'You’re all set. The shop will send your confirmation and reminder by text.',
        time: '1:45 PM',
        wait: 850
      },
      {
        type: 'confirmation',
        title: 'Upcoming maintenance scheduled',
        detail: '2021 Toyota RAV4 · Oil service and tire rotation',
        note: 'Friday · 2:30 PM · Reminder scheduled',
        time: '1:46 PM',
        wait: 850
      }
    ]
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
    contactName: 'Michael Torres',
    contactInitial: 'M',
    assistantName: 'Vera',
    channelLabel: 'Live phone call',
    messages: [
      { type: 'message', from: 'shop', text: `Thank you for calling ${SHOP_NAME}. This is Vera. How can I help you?`, time: '3:08 PM', wait: 750 },
      { type: 'message', from: 'customer', text: 'My check-engine light came on and the car is shaking when I stop.', time: '3:08 PM', wait: 850 },
      {
        type: 'message',
        from: 'shop',
        text: 'I’m sorry you’re dealing with that. Is the light steady or flashing, and does the vehicle still feel safe to drive?',
        time: '3:09 PM',
        wait: 1000
      },
      { type: 'message', from: 'customer', text: 'It is steady. I can drive it, but I do not want to go far.', time: '3:09 PM', wait: 850 },
      { type: 'message', from: 'shop', text: 'Understood. What year, make, and model is the vehicle?', time: '3:10 PM', wait: 800 },
      { type: 'message', from: 'customer', text: 'A 2018 Honda Accord.', time: '3:10 PM', wait: 700 },
      { type: 'message', from: 'shop', text: 'Thank you. May I get your name and the best way for the shop to reach you?', time: '3:11 PM', wait: 850 },
      { type: 'message', from: 'customer', text: 'Michael Torres. Text is best.', time: '3:11 PM', wait: 750 },
      {
        type: 'confirmation',
        title: 'Repair opportunity created',
        detail: '2018 Honda Accord · Check-engine light · Shaking at stops',
        note: 'Diagnostic appointment needs confirmation · Text preferred',
        time: '3:12 PM',
        wait: 900
      }
    ]
  },
  phoneBooking: {
    tab: 'Book a drop-off by phone',
    eyebrow: 'Vera books by phone using the shop calendar',
    title: 'Customers can confirm an available drop-off time on the call.',
    description:
      'Vera checks the shop’s configured arrival windows, repeats the exact time, and books only after the customer confirms. The shop’s calendar remains the source of truth.',
    proof: [
      'Checks configured shop availability',
      'Offers valid arrival windows',
      'Gets the customer’s clear yes',
      'Adds the confirmed drop-off to the calendar'
    ],
    contactName: 'Michael Torres',
    contactInitial: 'M',
    assistantName: 'Vera',
    channelLabel: 'Live phone call',
    messages: [
      { type: 'message', from: 'shop', text: `Thanks for calling ${SHOP_NAME}. This is Vera. I can help schedule your brake service.`, time: '3:08 PM', wait: 750 },
      { type: 'message', from: 'customer', text: 'Great. When can I bring in my 2018 Honda Accord?', time: '3:08 PM', wait: 850 },
      { type: 'message', from: 'shop', text: 'I have Thursday, October 8, with a 3:30 to 4:00 PM drop-off window available. Would you like me to book that?', time: '3:09 PM', wait: 950 },
      { type: 'message', from: 'customer', text: 'Yes, that works.', time: '3:09 PM', wait: 750 },
      { type: 'message', from: 'shop', text: 'You’re confirmed for that arrival window. The shop will send your appointment details shortly.', time: '3:10 PM', wait: 850 },
      {
        type: 'confirmation',
        title: 'Drop-off appointment confirmed',
        detail: 'Michael Torres · 2018 Honda Accord · Front brakes',
        note: 'Thu, Oct 8 · 3:30–4:00 PM arrival window · Calendar updated',
        time: '3:10 PM',
        wait: 900
      }
    ]
  },
  afterHours: {
    tab: 'The shop is closed',
    eyebrow: 'Vera answers even when the team has gone home',
    title: 'A customer can still reach the shop after hours.',
    description:
      'Vera sounds like a helpful front-desk person, gets the basic details, and makes sure the team knows who to call when the shop opens.',
    proof: [
      'Answers after business hours',
      'Sounds natural and helpful',
      'Captures the customer and vehicle',
      'Prepares the morning callback'
    ],
    contactName: 'David Chen',
    contactInitial: 'D',
    assistantName: 'Vera',
    channelLabel: 'After-hours call',
    messages: [
      {
        type: 'message',
        from: 'shop',
        text: `Thanks for calling ${SHOP_NAME}. This is Vera. We’re closed for the evening, but I can get everything over to the team for the morning. What’s going on with the car?`,
        time: '8:42 PM',
        wait: 900
      },
      {
        type: 'message',
        from: 'customer',
        text: 'My 2020 Subaru Outback won’t start. The lights come on, but all I hear is clicking.',
        time: '8:43 PM',
        wait: 900
      },
      {
        type: 'message',
        from: 'shop',
        text: 'Okay. Is it somewhere safe right now?',
        time: '8:43 PM',
        wait: 800
      },
      {
        type: 'message',
        from: 'customer',
        text: 'Yes, it’s parked at home.',
        time: '8:44 PM',
        wait: 700
      },
      {
        type: 'message',
        from: 'shop',
        text: 'Good. What’s your name?',
        time: '8:44 PM',
        wait: 700
      },
      {
        type: 'message',
        from: 'customer',
        text: 'David Chen.',
        time: '8:44 PM',
        wait: 650
      },
      {
        type: 'message',
        from: 'shop',
        text: 'Thanks, David. Is this the best number for the shop to call you on?',
        time: '8:45 PM',
        wait: 800
      },
      {
        type: 'message',
        from: 'customer',
        text: 'Yes, it is.',
        time: '8:45 PM',
        wait: 650
      },
      {
        type: 'message',
        from: 'shop',
        text: 'Perfect. I’ll have the team call you after they open at 8:00 tomorrow morning and help you figure out the next step.',
        time: '8:45 PM',
        wait: 900
      },
      {
        type: 'confirmation',
        title: 'Morning callback ready',
        detail: 'David Chen · 2020 Subaru Outback · Will not start',
        note: 'Vehicle is safe at home · Call after 8:00 AM',
        time: '8:46 PM',
        wait: 900
      }
    ]
  },
  inboxTriage: {
    tab: 'Iris sorts a busy inbox',
    eyebrow: 'Iris routes the request with context',
    title: 'High value requests reach the right person with the key details attached.',
    description: 'Iris reviews incoming shop email, identifies the customer and vehicle when possible, and surfaces the request and next action for the team.',
    proof: ['Recognizes estimate and fleet inquiries', 'Surfaces time-sensitive requests', 'Keeps the original message available', 'Routes the next step to the right person'],
    contactName: 'Northside Shop Inbox',
    contactInitial: 'I',
    assistantName: 'Iris',
    channelLabel: 'Email triage',
    messages: [
      { type: 'message', from: 'customer', text: 'Subject: Fleet maintenance quote. We have 12 vans due for service next month. Can someone send availability and a quote?', time: '9:12 AM', wait: 900 },
      { type: 'message', from: 'shop', text: 'Iris flagged this as a fleet opportunity and attached the sender, requested timing, and vehicle count.', time: '9:12 AM', wait: 950 },
      { type: 'message', from: 'shop', text: 'Assigned to: Service Manager · Priority: High · Suggested next step: Review capacity and prepare a fleet response.', time: '9:13 AM', wait: 950 },
      { type: 'confirmation', title: 'Fleet inquiry routed', detail: '12 vans · Service requested next month', note: 'High priority · Service Manager review', time: '9:13 AM', wait: 850 }
    ]
  },
  customerHistory: {
    tab: 'Marcus finds the vehicle history',
    eyebrow: 'Marcus brings the shop’s history together',
    title: 'The team can see what was recommended and what happened next.',
    description: 'Marcus connects customer, vehicle, estimate, repair, and conversation records so staff can answer with the right context.',
    proof: ['Matches the customer to a vehicle', 'Shows prior repair visits', 'Keeps estimates and recommendations attached', 'Makes the next follow-up visible'],
    contactName: 'Michael Torres',
    contactInitial: 'M',
    assistantName: 'Marcus',
    channelLabel: 'Customer history',
    messages: [
      { type: 'message', from: 'customer', text: 'Can you remind me what the shop recommended for my Accord last month?', time: '10:14 AM', wait: 900 },
      { type: 'message', from: 'shop', text: 'Marcus matched Michael Torres to his 2018 Honda Accord and pulled the most recent visit.', time: '10:14 AM', wait: 950 },
      { type: 'message', from: 'shop', text: 'Visit summary: front brake pads and rotors recommended; estimate $680; customer deferred. No appointment is currently booked.', time: '10:15 AM', wait: 950 },
      { type: 'confirmation', title: 'Vehicle history ready', detail: '2018 Honda Accord · Front brakes · $680 estimate', note: 'Deferred last visit · Follow-up available to Naya', time: '10:15 AM', wait: 850 }
    ]
  }
};

function MessageBubble({ message }) {
  if (message.type === 'confirmation') {
    return (
      <article className="auto-phone-confirmation" aria-label={`${message.title}. ${message.detail}. ${message.note}.`}>
        <span className="auto-phone-confirmation-check" aria-hidden="true">✓</span>
        <div>
          <strong>{message.title}</strong>
          <span>{message.detail}</span>
          <small>{message.note}</small>
        </div>
        <time>{message.time}</time>
      </article>
    );
  }

  return (
    <div className={`auto-phone-message auto-phone-message-${message.from}`}>
      <p>{message.text}</p>
      <time>{message.time}</time>
    </div>
  );
}

function TypingIndicator({ side }) {
  return (
    <div className={`auto-phone-typing auto-phone-typing-${side}`} aria-label="Typing">
      <span />
      <span />
      <span />
    </div>
  );
}

export default function AutoRepairConversationDemo() {
  const [activeKey, setActiveKey] = useState('deferredMaintenance');
  const [visibleCount, setVisibleCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [replayToken, setReplayToken] = useState(0);
  const transcriptRef = useRef(null);
  const scenario = scenarios[activeKey];
  const visibleMessages = useMemo(() => scenario.messages.slice(0, visibleCount), [scenario, visibleCount]);

  useEffect(() => {
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      setVisibleCount(scenario.messages.length);
      setIsTyping(false);
      return undefined;
    }

    setVisibleCount(0);
    setIsTyping(false);
    let cancelled = false;
    const timers = [];

    const revealNext = index => {
      if (cancelled || index >= scenario.messages.length) return;
      const message = scenario.messages[index];
      const showTyping = message.type === 'message';

      if (showTyping) setIsTyping(message.from);

      const revealTimer = window.setTimeout(() => {
        if (cancelled) return;
        setIsTyping(false);
        setVisibleCount(index + 1);

        const nextTimer = window.setTimeout(() => revealNext(index + 1), message.wait);
        timers.push(nextTimer);
      }, showTyping ? 800 : 320);

      timers.push(revealTimer);
    };

    const startTimer = window.setTimeout(() => revealNext(0), 600);
    timers.push(startTimer);

    return () => {
      cancelled = true;
      timers.forEach(timer => window.clearTimeout(timer));
    };
  }, [activeKey, replayToken, scenario.messages]);

  useEffect(() => {
    const node = transcriptRef.current;
    if (node) node.scrollTo({ top: node.scrollHeight, behavior: 'smooth' });
  }, [visibleCount, isTyping]);

  function selectScenario(key) {
    setActiveKey(key);
    setReplayToken(token => token + 1);
  }

  const isCallScenario = activeKey === 'repairCall' || activeKey === 'phoneBooking' || activeKey === 'afterHours';
  const isInboxScenario = activeKey === 'inboxTriage' || activeKey === 'customerHistory';

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

      <div className="auto-phone-stage">
        <div className="auto-phone-glow" aria-hidden="true" />
        <div className="auto-phone-shell">
          <div className="auto-phone-hardware" aria-hidden="true">
            <span className="auto-phone-speaker" />
            <span className="auto-phone-camera" />
          </div>

          <div className="auto-phone-screen">
            <div className="auto-phone-statusbar" aria-hidden="true">
              <span>{activeKey === 'afterHours' ? '8:46' : '10:18'}</span>
              <span>●●● ᯤ ▰</span>
            </div>

            <header className="auto-phone-chat-header">
              <span className="auto-phone-back" aria-hidden="true">‹</span>
              <span className="auto-phone-avatar" aria-hidden="true">{scenario.contactInitial}</span>
              <div>
                <strong>{scenario.contactName}</strong>
                <small>{scenario.assistantName} · {scenario.channelLabel}</small>
              </div>
              <span className="auto-phone-menu" aria-hidden="true">•••</span>
            </header>

            <div className="auto-phone-shop-label">{SHOP_NAME} · {activeKey === 'afterHours' ? 'After hours' : 'Today'}</div>

            <div className="auto-phone-transcript" ref={transcriptRef} aria-label={`Animated auto repair interaction with ${scenario.contactName}`}>
              {visibleMessages.map((message, index) => (
                <MessageBubble key={`${activeKey}-${index}`} message={message} />
              ))}
              {isTyping ? <TypingIndicator side={isTyping} /> : null}
            </div>

            <div className="auto-phone-composer" aria-hidden="true">
              <span>＋</span>
              <div>{isCallScenario ? 'Call notes' : isInboxScenario ? 'Shop activity' : `Message ${scenario.contactName}`}</div>
              <span>◉</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
