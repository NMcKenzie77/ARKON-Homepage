import { useRef, useState } from 'react';
import './demo-request-form.css';

const PRIVACY_VERSION = '2026-07-28';

const businessTypes = [
  'Real estate',
  'Insurance',
  'Short-term rentals',
  'Home services',
  'Professional services',
  'Salons',
  'Auto repair shops',
  'Medical and dental offices',
  'Law firms',
  'Gyms and fitness studios'
];

function trackAnalyticsEvent(eventName, parameters = {}) {
  if (typeof window.gtag !== 'function') return;

  window.gtag('event', eventName, {
    ...parameters,
    page_path: window.location.pathname,
    page_title: document.title
  });
}

export default function DemoRequestForm() {
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const analyticsStarted = useRef(false);

  function trackFormStart(event) {
    if (analyticsStarted.current) return;
    analyticsStarted.current = true;

    const form = event.currentTarget;
    const businessType = String(new FormData(form).get('businessType') || '').trim();
    trackAnalyticsEvent('demo_form_start', {
      business_type: businessType || 'not_selected'
    });
  }

  async function submitDemoRequest(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const phone = String(data.get('phone') || '').trim();
    const companyName = String(data.get('companyName') || '').trim();
    const website = String(data.get('website') || '').trim();
    const businessType = String(data.get('businessType') || '').trim();
    const message = String(data.get('message') || '').trim();
    const companyWebsite = String(data.get('companyWebsite') || '').trim();
    const contactConsent = data.get('contactConsent') === 'yes';
    const consentRecordedAt = new Date().toISOString();

    if (!name || !email || !phone || !companyName || !businessType) {
      setStatus('Please enter your name, email, telephone number, company name, and business type.');
      return;
    }

    if (!contactConsent) {
      setStatus('Please confirm that ARKON Systems may contact you about this request.');
      return;
    }

    const emailMessage = [
      `Company name: ${companyName}`,
      `Telephone number: ${phone}`,
      `Website link: ${website || 'Not provided'}`,
      `Contact consent: Yes, for this request`,
      `Consent recorded: ${consentRecordedAt}`,
      `Privacy version: ${PRIVACY_VERSION}`,
      '',
      'Lead message:',
      message || 'No message provided'
    ].join('\n');

    setIsSubmitting(true);
    setStatus('Sending request...');

    try {
      const response = await fetch('/api/demo-request', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          businessType,
          sourcePath: window.location.pathname,
          message: emailMessage,
          companyWebsite,
          contactConsent,
          consentRecordedAt,
          privacyVersion: PRIVACY_VERSION
        })
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.ok === false) {
        throw new Error(result.message || 'Request failed.');
      }

      trackAnalyticsEvent('generate_lead', {
        business_type: businessType,
        lead_source: 'demo_request'
      });

      form.reset();
      analyticsStarted.current = false;
      setStatus(result.message || 'Request received. We will follow up shortly.');
    } catch {
      setStatus('Request could not be sent. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="demo-cta" id="demo" data-reveal>
      <div>
        <p className="eyebrow">See it for your business</p>
        <h2>Choose the closest business type and walk through the real workflow.</h2>
        <p>
          See how ARKON would handle the calls, messages, follow-ups, documents, staff updates,
          and owner visibility in a business like yours.
        </p>
      </div>

      <form
        className="demo-form"
        onFocusCapture={trackFormStart}
        onSubmit={submitDemoRequest}
      >
        <label>
          Name
          <input name="name" type="text" placeholder="Your name" autoComplete="name" required />
        </label>

        <label>
          Email
          <input name="email" type="email" placeholder="you@example.com" autoComplete="email" required />
        </label>

        <label>
          Company name
          <input name="companyName" type="text" placeholder="Company name" autoComplete="organization" required />
        </label>

        <label>
          Telephone number
          <input name="phone" type="tel" placeholder="Best phone number" autoComplete="tel" required />
        </label>

        <label>
          Website link
          <input name="website" type="url" placeholder="https://example.com" autoComplete="url" />
        </label>

        <label>
          Business type
          <select name="businessType" defaultValue="" required>
            <option value="" disabled>Choose one</option>
            {businessTypes.map(type => <option key={type}>{type}</option>)}
          </select>
        </label>

        <label>
          Message
          <textarea
            name="message"
            placeholder="Tell us what kind of workflow you want ARKON to handle."
            rows="5"
          />
        </label>

        <label className="demo-consent">
          <input name="contactConsent" type="checkbox" value="yes" required />
          <span>
            I agree that ARKON Systems may contact me by email or telephone about this request.
            This is not consent to unrelated marketing. See the <a href="/privacy">Privacy & Cookies Policy</a> and <a href="/terms">Terms of Use</a>.
          </span>
        </label>

        <label className="demo-honeypot" aria-hidden="true">
          Company website
          <input name="companyWebsite" type="text" tabIndex="-1" autoComplete="off" />
        </label>

        <button className="primary-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Request demo'}
        </button>

        <small className="demo-status" role="status" aria-live="polite">
          {status}
        </small>
      </form>
    </section>
  );
}
