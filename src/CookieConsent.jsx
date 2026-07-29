import { useEffect, useState } from 'react';
import './cookie-consent.css';

const STORAGE_KEY = 'arkon_consent_v1';
const DEFAULT_CHOICE = { analytics: false, advertising: false };

function normalizeChoice(value) {
  return {
    analytics: Boolean(value?.analytics),
    advertising: Boolean(value?.advertising)
  };
}

function readSavedChoice() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? normalizeChoice(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

function applyChoice(choice) {
  const normalized = normalizeChoice(choice);
  window.arkonConsent = normalized;

  if (typeof window.gtag === 'function') {
    window.gtag('consent', 'update', {
      analytics_storage: normalized.analytics ? 'granted' : 'denied',
      ad_storage: normalized.advertising ? 'granted' : 'denied',
      ad_user_data: normalized.advertising ? 'granted' : 'denied',
      ad_personalization: normalized.advertising ? 'granted' : 'denied'
    });
  }

  window.dispatchEvent(new CustomEvent('arkon:consent-updated', { detail: normalized }));
}

function saveChoice(choice) {
  const normalized = normalizeChoice(choice);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
      ...normalized,
      version: 1,
      updatedAt: new Date().toISOString()
    }));
  } catch {
    // Consent still applies for the current page when storage is unavailable.
  }
  applyChoice(normalized);
  return normalized;
}

export default function CookieConsent() {
  const [savedChoice, setSavedChoice] = useState(null);
  const [draftChoice, setDraftChoice] = useState(DEFAULT_CHOICE);
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const existing = readSavedChoice();
    if (existing) {
      setSavedChoice(existing);
      setDraftChoice(existing);
      applyChoice(existing);
    } else {
      setShowBanner(true);
    }

    const openSettings = () => {
      const latest = readSavedChoice() || savedChoice || DEFAULT_CHOICE;
      setDraftChoice(latest);
      setShowSettings(true);
      setShowBanner(false);
    };

    window.addEventListener('arkon:open-cookie-settings', openSettings);
    return () => window.removeEventListener('arkon:open-cookie-settings', openSettings);
  }, []);

  function commit(choice) {
    const saved = saveChoice(choice);
    setSavedChoice(saved);
    setDraftChoice(saved);
    setShowBanner(false);
    setShowSettings(false);
  }

  return (
    <>
      {showBanner ? (
        <section className="cookie-banner" aria-label="Cookie choices">
          <div className="cookie-banner-copy">
            <strong>Your privacy choices</strong>
            <p>
              ARKON Systems uses necessary technologies to operate the site. With your permission, analytics
              and advertising technologies may measure visits and campaign results. Nonessential storage is denied by default.
            </p>
            <a href="/privacy">Read Privacy & Cookies</a>
          </div>
          <div className="cookie-actions">
            <button type="button" className="cookie-secondary" onClick={() => commit(DEFAULT_CHOICE)}>
              Reject nonessential
            </button>
            <button type="button" className="cookie-secondary" onClick={() => setShowSettings(true)}>
              Manage settings
            </button>
            <button type="button" className="cookie-primary" onClick={() => commit({ analytics: true, advertising: true })}>
              Accept all
            </button>
          </div>
        </section>
      ) : null}

      {showSettings ? (
        <div className="cookie-modal-backdrop" role="presentation" onMouseDown={event => {
          if (event.target === event.currentTarget) setShowSettings(false);
        }}>
          <section className="cookie-modal" role="dialog" aria-modal="true" aria-labelledby="cookie-settings-title">
            <div className="cookie-modal-heading">
              <div>
                <p className="eyebrow">Privacy choices</p>
                <h2 id="cookie-settings-title">Cookie settings</h2>
              </div>
              <button type="button" className="cookie-close" onClick={() => setShowSettings(false)} aria-label="Close cookie settings">×</button>
            </div>

            <div className="cookie-setting-row">
              <div>
                <strong>Necessary</strong>
                <p>Required for security, consent storage, and basic website operation.</p>
              </div>
              <span className="cookie-always-on">Always on</span>
            </div>

            <label className="cookie-setting-row cookie-toggle-row">
              <div>
                <strong>Analytics</strong>
                <p>Measures site use and form activity through Google Analytics according to your choice.</p>
              </div>
              <input
                type="checkbox"
                checked={draftChoice.analytics}
                onChange={event => setDraftChoice(current => ({ ...current, analytics: event.target.checked }))}
              />
            </label>

            <label className="cookie-setting-row cookie-toggle-row">
              <div>
                <strong>Advertising</strong>
                <p>Allows advertising measurement and audience technologies when an approved Google or Meta tag is enabled.</p>
              </div>
              <input
                type="checkbox"
                checked={draftChoice.advertising}
                onChange={event => setDraftChoice(current => ({ ...current, advertising: event.target.checked }))}
              />
            </label>

            <div className="cookie-modal-actions">
              <button type="button" className="cookie-secondary" onClick={() => commit(DEFAULT_CHOICE)}>Reject nonessential</button>
              <button type="button" className="cookie-primary" onClick={() => commit(draftChoice)}>Save choices</button>
            </div>

            <p className="cookie-modal-note">
              You can reopen these settings from the site footer. See the <a href="/privacy">Privacy & Cookies Policy</a> for details.
            </p>
          </section>
        </div>
      ) : null}
    </>
  );
}
