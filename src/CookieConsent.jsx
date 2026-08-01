import { useEffect, useLayoutEffect, useRef, useState } from 'react';
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
  const [draftChoice, setDraftChoice] = useState(DEFAULT_CHOICE);
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const manageButtonRef = useRef(null);
  const returnFocusRef = useRef(null);
  const pendingFocusRestoreRef = useRef(false);

  function requestFocusRestore() {
    pendingFocusRestoreRef.current = true;
  }

  function openSettings() {
    returnFocusRef.current = document.activeElement;
    const latest = readSavedChoice() || normalizeChoice(window.arkonConsent) || DEFAULT_CHOICE;
    setDraftChoice(latest);
    setShowSettings(true);
    setShowBanner(false);
  }

  function closeSettings({ restoreBanner = true } = {}) {
    const shouldRestoreBanner = restoreBanner && !readSavedChoice();
    requestFocusRestore();
    setShowSettings(false);
    if (shouldRestoreBanner) setShowBanner(true);
  }

  useEffect(() => {
    const existing = readSavedChoice();
    if (existing) {
      setDraftChoice(existing);
      applyChoice(existing);
    } else {
      setShowBanner(true);
    }

    const handleOpenSettings = () => openSettings();
    window.addEventListener('arkon:open-cookie-settings', handleOpenSettings);
    return () => window.removeEventListener('arkon:open-cookie-settings', handleOpenSettings);
  }, []);

  useLayoutEffect(() => {
    if (showSettings || !pendingFocusRestoreRef.current) return;

    const previous = returnFocusRef.current;
    if (previous instanceof HTMLElement && document.contains(previous)) {
      previous.focus();
    } else if (manageButtonRef.current instanceof HTMLElement && document.contains(manageButtonRef.current)) {
      manageButtonRef.current.focus();
    } else {
      document.querySelector('.site-header a, .site-header button')?.focus();
    }

    pendingFocusRestoreRef.current = false;
  }, [showBanner, showSettings]);

  useEffect(() => {
    if (!showSettings) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusTimer = window.setTimeout(() => closeButtonRef.current?.focus(), 0);

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeSettings();
        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusable = [...dialogRef.current.querySelectorAll(
        'button:not([disabled]), input:not([disabled]), a[href], select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )].filter(element => !element.hasAttribute('hidden'));

      if (!focusable.length) {
        event.preventDefault();
        dialogRef.current.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [showSettings]);

  function commit(choice) {
    const saved = saveChoice(choice);
    setDraftChoice(saved);
    requestFocusRestore();
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
            <button
              ref={manageButtonRef}
              type="button"
              className="cookie-secondary"
              onClick={openSettings}
            >
              Manage settings
            </button>
            <button type="button" className="cookie-primary" onClick={() => commit({ analytics: true, advertising: true })}>
              Accept all
            </button>
          </div>
        </section>
      ) : null}

      {showSettings ? (
        <div
          className="cookie-modal-backdrop"
          role="presentation"
          onMouseDown={event => {
            if (event.target === event.currentTarget) closeSettings();
          }}
        >
          <section
            ref={dialogRef}
            className="cookie-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-settings-title"
            aria-describedby="cookie-settings-description"
            tabIndex="-1"
          >
            <div className="cookie-modal-heading">
              <div>
                <p className="eyebrow">Privacy choices</p>
                <h2 id="cookie-settings-title">Cookie settings</h2>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                className="cookie-close"
                onClick={() => closeSettings()}
                aria-label="Close cookie settings"
              >
                ×
              </button>
            </div>

            <p id="cookie-settings-description" className="cookie-modal-note">
              Choose which optional technologies ARKON Systems may use on this website.
            </p>

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
