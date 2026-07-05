const PORTER_ENDPOINT = '/api/demo-request';

function ready(fn) {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn, { once: true });
  else fn();
}

function clean(value) {
  return String(value || '').trim();
}

function setStatus(root, message, tone = 'normal') {
  const status = root.querySelector('[data-porter-status]');
  if (!status) return;
  status.textContent = message;
  status.dataset.tone = tone;
}

function buildMessage(form) {
  const data = new FormData(form);
  const requestType = clean(data.get('requestType'));
  const message = clean(data.get('message'));
  const phone = clean(data.get('phone'));
  const companyName = clean(data.get('companyName'));
  const website = clean(data.get('website'));

  return [
    'Porter website intake',
    '',
    `Request type: ${requestType || 'General inquiry'}`,
    `Company name: ${companyName || 'Not provided'}`,
    `Telephone number: ${phone || 'Not provided'}`,
    `Website link: ${website || 'Not provided'}`,
    `Page captured from: ${window.location.pathname || '/'}`,
    '',
    'Visitor message:',
    message || 'No message provided'
  ].join('\n');
}

function createPorterWidget() {
  if (document.querySelector('[data-porter-widget="true"]')) return;

  const root = document.createElement('aside');
  root.className = 'porter-widget';
  root.dataset.porterWidget = 'true';
  root.innerHTML = `
    <button class="porter-launcher" type="button" aria-expanded="false" aria-controls="porter-panel">
      <span class="porter-dot" aria-hidden="true"></span>
      <span>Ask Porter</span>
    </button>

    <section class="porter-panel" id="porter-panel" aria-label="Porter website intake" hidden>
      <div class="porter-panel-header">
        <div>
          <p>Porter</p>
          <h2>Website Inquiry and Lead Intake</h2>
        </div>
        <button class="porter-close" type="button" aria-label="Close Porter">×</button>
      </div>

      <div class="porter-message">
        <strong>Hi, I’m Porter.</strong>
        <p>I capture website inquiries, quote requests, appointment interest, and after-hours questions so they do not sit unseen.</p>
      </div>

      <form class="porter-form">
        <label>
          What do you need?
          <select name="requestType" required>
            <option value="" disabled selected>Choose one</option>
            <option>Request a demo</option>
            <option>Ask about ARKON</option>
            <option>Website inquiry / lead intake</option>
            <option>Calls and front desk</option>
            <option>Auto repair workflow</option>
            <option>Other</option>
          </select>
        </label>
        <label>
          Name
          <input name="name" type="text" autocomplete="name" placeholder="Your name" required />
        </label>
        <label>
          Email
          <input name="email" type="email" autocomplete="email" placeholder="you@example.com" required />
        </label>
        <label>
          Telephone number
          <input name="phone" type="tel" autocomplete="tel" placeholder="Best number to reach you" />
        </label>
        <label>
          Company name
          <input name="companyName" type="text" autocomplete="organization" placeholder="Company name" />
        </label>
        <label>
          Website link
          <input name="website" type="url" placeholder="https://example.com" />
        </label>
        <label class="porter-wide">
          Message
          <textarea name="message" placeholder="Tell Porter what you need routed." rows="4"></textarea>
        </label>
        <input name="companyWebsite" type="text" tabindex="-1" autocomplete="off" aria-hidden="true" class="porter-hp" />
        <button class="porter-submit" type="submit">Send to Porter</button>
        <small data-porter-status>Porter will capture this and route it to the ARKON team.</small>
      </form>
    </section>
  `;

  document.body.appendChild(root);

  const launcher = root.querySelector('.porter-launcher');
  const panel = root.querySelector('.porter-panel');
  const close = root.querySelector('.porter-close');
  const form = root.querySelector('.porter-form');

  function openPanel() {
    panel.hidden = false;
    launcher.setAttribute('aria-expanded', 'true');
    root.classList.add('is-open');
    const first = panel.querySelector('select, input, textarea, button');
    window.setTimeout(() => first?.focus?.(), 80);
  }

  function closePanel() {
    panel.hidden = true;
    launcher.setAttribute('aria-expanded', 'false');
    root.classList.remove('is-open');
    launcher.focus?.();
  }

  launcher.addEventListener('click', () => {
    if (panel.hidden) openPanel();
    else closePanel();
  });
  close.addEventListener('click', closePanel);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !panel.hidden) closePanel();
  });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    const data = new FormData(form);
    if (clean(data.get('companyWebsite'))) {
      setStatus(root, 'Thanks. Porter captured the inquiry.', 'success');
      form.reset();
      return;
    }

    const name = clean(data.get('name'));
    const email = clean(data.get('email'));
    const requestType = clean(data.get('requestType'));
    if (!name || !email || !requestType) {
      setStatus(root, 'Please add your name, email, and request type.', 'error');
      return;
    }

    const submit = root.querySelector('.porter-submit');
    submit.disabled = true;
    setStatus(root, 'Porter is capturing the inquiry...', 'normal');

    try {
      const response = await fetch(PORTER_ENDPOINT, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone: clean(data.get('phone')),
          businessType: requestType,
          sourcePath: window.location.pathname || '/',
          message: buildMessage(form),
          companyWebsite: ''
        })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.ok === false) throw new Error(result.message || 'Request failed.');
      form.reset();
      setStatus(root, 'Got it. Porter captured this inquiry and routed it to ARKON.', 'success');
    } catch {
      setStatus(root, 'Porter could not send this yet. Please try again.', 'error');
    } finally {
      submit.disabled = false;
    }
  });
}

ready(createPorterWidget);
