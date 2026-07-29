import { useEffect, useMemo, useRef, useState } from 'react';
import './salon-conversation-demo.css';

const ASSISTANT_NAME = 'Maya';

const scenarios = {
  followUp: {
    tab: 'Maya follows up',
    title: 'Reach out before the client forgets.',
    description:
      'Luxe & Co. named its virtual front desk Maya. She follows the salon’s timing, tone, service history, and booking rules so follow-up feels like it came from the team.',
    messages: [
      {
        type: 'message',
        from: 'salon',
        text: 'Hey Jasmine, it’s Maya from Luxe & Co. It’s been about six weeks since your last color appointment, and Maria has a couple openings this week. Thursday at 4:30 or Saturday at 11. Want me to hold one for you?',
        time: '10:20 AM',
        wait: 700
      },
      {
        type: 'message',
        from: 'client',
        text: 'Saturday at 11 works.',
        time: '10:21 AM',
        wait: 1500
      },
      {
        type: 'message',
        from: 'salon',
        text: 'Perfect. Still doing your usual highlights with Maria?',
        time: '10:21 AM',
        wait: 1350
      },
      {
        type: 'message',
        from: 'client',
        text: 'Yes please.',
        time: '10:22 AM',
        wait: 1200
      },
      {
        type: 'message',
        from: 'salon',
        text: 'Got you down for Saturday at 11 with Maria ✨ I’ll send you a reminder Friday.',
        time: '10:23 AM',
        wait: 1400
      },
      {
        type: 'confirmation',
        title: 'Appointment confirmed',
        detail: 'Saturday · 11:00 AM · Maria',
        note: 'Reminder coming Friday',
        time: '10:23 AM',
        wait: 900
      }
    ]
  },
  inbound: {
    tab: 'Client texts the salon',
    title: 'Answer while the client is still ready to book.',
    description:
      'When a client texts the salon, Maya replies in the same voice, checks approved availability, and keeps the booking moving without sounding scripted.',
    messages: [
      {
        type: 'message',
        from: 'client',
        text: 'Hey, do you have anything open Saturday for highlights?',
        time: '4:16 PM',
        wait: 700
      },
      {
        type: 'message',
        from: 'salon',
        text: 'Hey Jasmine! Maria has 10:30 and 1:00 open Saturday. Which one works better?',
        time: '4:16 PM',
        wait: 1450
      },
      {
        type: 'message',
        from: 'client',
        text: '10:30.',
        time: '4:17 PM',
        wait: 1250
      },
      {
        type: 'message',
        from: 'salon',
        text: 'Perfect. Want me to grab that for you?',
        time: '4:17 PM',
        wait: 1250
      },
      {
        type: 'message',
        from: 'client',
        text: 'Yes please.',
        time: '4:18 PM',
        wait: 1100
      },
      {
        type: 'message',
        from: 'salon',
        text: 'You’re all set for Saturday at 10:30 with Maria. See you then ✨',
        time: '4:18 PM',
        wait: 1400
      },
      {
        type: 'confirmation',
        title: 'Appointment confirmed',
        detail: 'Saturday · 10:30 AM · Maria',
        note: 'Reminder scheduled',
        time: '4:18 PM',
        wait: 900
      }
    ]
  }
};

function MessageBubble({ message }) {
  if (message.type === 'confirmation') {
    return (
      <article className="phone-confirmation" aria-label={`${message.title}. ${message.detail}. ${message.note}.`}>
        <span className="phone-confirmation-check" aria-hidden="true">✓</span>
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
    <div className={`phone-message phone-message-${message.from}`}>
      <p>{message.text}</p>
      <time>{message.time}</time>
    </div>
  );
}

function TypingIndicator({ side }) {
  return (
    <div className={`phone-typing phone-typing-${side}`} aria-label="Typing">
      <span />
      <span />
      <span />
    </div>
  );
}

export default function SalonConversationDemo() {
  const [activeKey, setActiveKey] = useState('followUp');
  const [visibleCount, setVisibleCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [replayToken, setReplayToken] = useState(0);
  const transcriptRef = useRef(null);
  const scenario = scenarios[activeKey];
  const visibleMessages = useMemo(
    () => scenario.messages.slice(0, visibleCount),
    [scenario, visibleCount]
  );
  const nextMessage = scenario.messages[visibleCount];

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
      const typingSide = message.from === 'client' ? 'client' : 'salon';

      if (showTyping) {
        setIsTyping(typingSide);
      }

      const revealTimer = window.setTimeout(() => {
        if (cancelled) return;
        setIsTyping(false);
        setVisibleCount(index + 1);

        const nextTimer = window.setTimeout(
          () => revealNext(index + 1),
          message.wait
        );
        timers.push(nextTimer);
      }, showTyping ? 850 : 320);

      timers.push(revealTimer);
    };

    const startTimer = window.setTimeout(() => revealNext(0), 650);
    timers.push(startTimer);

    return () => {
      cancelled = true;
      timers.forEach(timer => window.clearTimeout(timer));
    };
  }, [activeKey, replayToken, scenario.messages]);

  useEffect(() => {
    const transcript = transcriptRef.current;
    if (!transcript) return;
    transcript.scrollTo({ top: transcript.scrollHeight, behavior: 'smooth' });
  }, [visibleCount, isTyping]);

  function selectScenario(key) {
    setActiveKey(key);
    setReplayToken(token => token + 1);
  }

  function replay() {
    setReplayToken(token => token + 1);
  }

  return (
    <section className="salon-conversation-section" aria-labelledby="salon-conversation-title">
      <div className="salon-conversation-copy">
        <p className="eyebrow">Meet {ASSISTANT_NAME}, Luxe &amp; Co.’s virtual front desk</p>
        <h2 id="salon-conversation-title">{scenario.title}</h2>
        <p>{scenario.description}</p>

        <div className="conversation-tabs" role="tablist" aria-label="Salon conversation examples">
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

        <div className="conversation-proof-row" aria-label="Conversation demonstration features">
          <span>Uses the salon’s voice</span>
          <span>Knows client history</span>
          <span>Books approved times</span>
        </div>

        <button className="conversation-replay" onClick={replay} type="button">
          <span aria-hidden="true">↻</span>
          Replay conversation
        </button>
      </div>

      <div className="phone-stage">
        <div className="phone-glow" aria-hidden="true" />
        <div className="phone-shell">
          <div className="phone-hardware" aria-hidden="true">
            <span className="phone-speaker" />
            <span className="phone-camera" />
          </div>

          <div className="phone-screen">
            <div className="phone-statusbar" aria-hidden="true">
              <span>10:23</span>
              <span>●●● ᯤ ▰</span>
            </div>

            <header className="phone-chat-header">
              <span className="phone-back" aria-hidden="true">‹</span>
              <span className="phone-avatar" aria-hidden="true">M</span>
              <div>
                <strong>Luxe &amp; Co. Salon</strong>
                <small>{ASSISTANT_NAME} · Virtual front desk</small>
              </div>
              <span className="phone-menu" aria-hidden="true">•••</span>
            </header>

            <div className="phone-day-label">Today</div>

            <div className="phone-transcript" ref={transcriptRef} aria-label={`Animated example conversation with ${ASSISTANT_NAME}`}>
              {visibleMessages.map((message, index) => (
                <MessageBubble key={`${activeKey}-${index}`} message={message} />
              ))}
              {isTyping ? <TypingIndicator side={isTyping} /> : null}
            </div>

            <div className="phone-composer" aria-hidden="true">
              <span>＋</span>
              <div>Message Luxe &amp; Co. Salon</div>
              <span>◉</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
