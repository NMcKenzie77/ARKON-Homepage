const PORTER_ENDPOINT = '/api/porter/chat';
const PORTER_HELLO_KEY = 'arkon_porter_conversation_seen';
const PORTER_AUTO_OPEN_DELAY_MS = 20_000;

function ready(fn) {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn, { once: true });
  else fn();
}

function clean(value) {
  return String(value || '').trim();
}

function createMessage(role, text) {
  return { role, content: clean(text) };
}

function createPorterWidget() {
  if (document.querySelector('[data-porter-widget="true"]')) return;

  const state = {
    history: [],
    lead: {},
    alreadyRouted: false,
    isWaiting: false,
    autoOpenTimer: null
  };

  const root = document.createElement('aside');
  root.className = 'porter-widget';
  root.dataset.porterWidget = 'true';
  root.innerHTML = `
    <button class="porter-launcher" type="button" aria-expanded="false" aria-controls="porter-panel">
      <span class="porter-dot" aria-hidden="true"></span>
      <span>Ask Porter</span>
    </button>

    <section class="porter-panel" id="porter-panel" aria-label="Porter website assistant" hidden>
      <div class="porter-panel-header">
        <div>
          <p>Porter</p>
          <h2>ARKON Website Assistant</h2>
        </div>
        <button class="porter-close" type="button" aria-label="Close Porter">×</button>
      </div>

      <div class="porter-chat" data-porter-chat aria-live="polite"></div>

      <form class="porter-composer" data-porter-composer>
        <label class="porter-sr-only" for="porter-input">Message Porter</label>
        <textarea id="porter-input" name="message" placeholder="Ask about ARKON, pricing, or your workflow..." rows="1" autocomplete="off"></textarea>
        <button class="porter-submit" type="submit">Send</button>
      </form>
      <small class="porter-status" data-porter-status>Ask a question or describe what your business is struggling to keep up with.</small>
    </section>
  `;

  document.body.appendChild(root);

  const launcher = root.querySelector('.porter-launcher');
  const panel = root.querySelector('.porter-panel');
  const close = root.querySelector('.porter-close');
  const chat = root.querySelector('[data-porter-chat]');
  const composer = root.querySelector('[data-porter-composer]');
  const input = root.querySelector('#porter-input');
  const submit = root.querySelector('.porter-submit');
  const status = root.querySelector('[data-porter-status]');

  function setStatus(message, tone = 'normal') {
    status.textContent = message;
    status.dataset.tone = tone;
  }

  function addBubble(role, text) {
    const normalized = clean(text);
    if (!normalized) return;

    const lastMessage = state.history[state.history.length - 1];
    if (role === 'assistant' && lastMessage?.role === 'assistant' && clean(lastMessage.content) === normalized) {
      return;
    }

    const bubble = document.createElement('div');
    bubble.className = `porter-bubble ${role === 'assistant' ? 'from-porter' : 'from-visitor'}`;
    bubble.textContent = normalized;
    chat.appendChild(bubble);
    chat.scrollTop = chat.scrollHeight;
  }

  function addTyping() {
    const bubble = document.createElement('div');
    bubble.className = 'porter-bubble from-porter is-typing';
    bubble.dataset.typing = 'true';
    bubble.innerHTML = '<span></span><span></span><span></span>';
    chat.appendChild(bubble);
    chat.scrollTop = chat.scrollHeight;
  }

  function removeTyping() {
    chat.querySelector('[data-typing="true"]')?.remove();
  }

  function greet() {
    if (state.history.length) return;
    const greeting = 'Hi, I’m Porter. I can explain what ARKON does, help match it to your business, discuss published pricing, or prepare a demo request. What are you trying to improve?';
    state.history.push(createMessage('assistant', greeting));
    addBubble('assistant', greeting);
  }

  function hasConversationBeenSeen() {
    try {
      return window.sessionStorage.getItem(PORTER_HELLO_KEY) === 'true';
    } catch {
      return false;
    }
  }

  function markConversationSeen() {
    try {
      window.sessionStorage.setItem(PORTER_HELLO_KEY, 'true');
    } catch {
      // Ignore storage failures.
    }
  }

  function cancelAutoOpen() {
    if (!state.autoOpenTimer) return;
    window.clearTimeout(state.autoOpenTimer);
    state.autoOpenTimer = null;
  }

  function openPanel({ auto = false } = {}) {
    if (!auto) cancelAutoOpen();
    panel.hidden = false;
    launcher.setAttribute('aria-expanded', 'true');
    root.classList.add('is-open');
    greet();
    markConversationSeen();

    // Do not steal keyboard focus when Porter opens himself.
    if (!auto) window.setTimeout(() => input?.focus?.(), 80);
  }

  function closePanel() {
    cancelAutoOpen();
    panel.hidden = true;
    launcher.setAttribute('aria-expanded', 'false');
    root.classList.remove('is-open');
    markConversationSeen();
    launcher.focus?.();
  }

  function scheduleConversationStart() {
    if (hasConversationBeenSeen()) return;

    state.autoOpenTimer = window.setTimeout(() => {
      state.autoOpenTimer = null;
      if (hasConversationBeenSeen() || !panel.hidden || document.visibilityState !== 'visible') return;
      openPanel({ auto: true });
    }, PORTER_AUTO_OPEN_DELAY_MS);
  }

  async function sendToPorter(visitorText) {
    if (state.isWaiting) return;

    cancelAutoOpen();
    markConversationSeen();

    const visitorMessage = createMessage('user', visitorText);
    state.history.push(visitorMessage);
    addBubble('user', visitorMessage.content);
    input.value = '';
    input.style.height = 'auto';
    state.isWaiting = true;
    submit.disabled = true;
    setStatus('Porter is reviewing that...');
    addTyping();

    try {
      const response = await fetch(PORTER_ENDPOINT, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          history: state.history,
          lead: state.lead,
          sourcePath: window.location.pathname || '/',
          alreadyRouted: state.alreadyRouted
        })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.ok === false) throw new Error(result.message || 'Porter failed.');

      removeTyping();
      const reply = clean(result.reply) || 'Tell me a little more about what you want ARKON to handle.';
      state.lead = result.lead || state.lead;
      state.history.push(createMessage('assistant', reply));
      addBubble('assistant', reply);

      if (result.routed) {
        state.alreadyRouted = true;
        setStatus('Your request was sent to the ARKON team.', 'success');
      } else if (result.routingError) {
        setStatus('The handoff needs another try. You can also use the demo form below.', 'error');
      } else if (result.readyToRoute) {
        setStatus('Porter has enough information to prepare the handoff.');
      } else {
        setStatus('Ask another question or tell Porter what work is being missed.');
      }
    } catch {
      removeTyping();
      const fallback = 'I’m having trouble connecting right now. The demo request form on this page can still send your information to the ARKON team.';
      const previous = state.history[state.history.length - 1];
      if (previous?.role !== 'assistant' || clean(previous.content) !== fallback) {
        state.history.push(createMessage('assistant', fallback));
        addBubble('assistant', fallback);
      }
      setStatus('Porter could not connect.', 'error');
    } finally {
      state.isWaiting = false;
      submit.disabled = false;
      input.focus?.();
    }
  }

  launcher.addEventListener('click', () => {
    cancelAutoOpen();
    if (panel.hidden) openPanel();
    else closePanel();
  });

  close.addEventListener('click', closePanel);

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !panel.hidden) closePanel();
  });

  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = `${Math.min(input.scrollHeight, 120)}px`;
  });

  input.addEventListener('keydown', event => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      composer.requestSubmit();
    }
  });

  composer.addEventListener('submit', event => {
    event.preventDefault();
    const text = clean(input.value);
    if (!text) return;
    sendToPorter(text);
  });

  scheduleConversationStart();
}

ready(createPorterWidget);
