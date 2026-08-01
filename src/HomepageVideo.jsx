import { useEffect, useRef, useState } from 'react';
import './homepage-video.css';

const HEYGEN_EMBED_URL = 'https://app.heygen.com/embeds/a477288ba09149e79a11fc9632a638ed';

export default function HomepageVideo() {
  const [videoOpen, setVideoOpen] = useState(false);
  const watchButtonRef = useRef(null);
  const closeButtonRef = useRef(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!videoOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusTimer = window.setTimeout(() => closeButtonRef.current?.focus(), 0);

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setVideoOpen(false);
        window.setTimeout(() => watchButtonRef.current?.focus(), 0);
        return;
      }

      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusable = [...dialogRef.current.querySelectorAll('button, iframe, [href], [tabindex]:not([tabindex="-1"])')]
        .filter(element => !element.hasAttribute('disabled'));

      if (!focusable.length) return;

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
  }, [videoOpen]);

  function closeVideo() {
    setVideoOpen(false);
    window.setTimeout(() => watchButtonRef.current?.focus(), 0);
  }

  return (
    <>
      <section className="homepage-video-section" aria-labelledby="homepage-video-title">
        <div className="homepage-video-card" data-reveal>
          <div className="homepage-video-copy">
            <p className="eyebrow">Meet Naya</p>
            <h2 id="homepage-video-title">See ARKON in action in one minute.</h2>
            <p>
              See how your digital team answers inquiries, follows up, reconnects with past customers,
              and prepares the next step for your staff.
            </p>
            <button
              ref={watchButtonRef}
              className="homepage-video-button"
              type="button"
              onClick={() => setVideoOpen(true)}
            >
              <span className="homepage-video-button-icon" aria-hidden="true">▶</span>
              Watch the 1-minute overview
            </button>
          </div>

          <button
            className="homepage-video-preview"
            type="button"
            aria-label="Watch Naya's one-minute ARKON overview"
            onClick={() => setVideoOpen(true)}
          >
            <span className="homepage-video-preview-glow" aria-hidden="true" />
            <span className="homepage-video-avatar" aria-hidden="true">
              <span>N</span>
            </span>
            <span className="homepage-video-preview-copy">
              <strong>Naya</strong>
              <small>ARKON digital team</small>
            </span>
            <span className="homepage-video-preview-play" aria-hidden="true">▶</span>
            <span className="homepage-video-duration">1:00</span>
          </button>
        </div>
      </section>

      {videoOpen ? (
        <div className="homepage-video-modal" role="presentation">
          <button
            className="homepage-video-modal-backdrop"
            type="button"
            aria-label="Close video"
            onClick={closeVideo}
          />

          <div
            ref={dialogRef}
            className="homepage-video-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="homepage-video-dialog-title"
          >
            <div className="homepage-video-dialog-header">
              <div>
                <p className="eyebrow">Meet Naya</p>
                <h2 id="homepage-video-dialog-title">ARKON in one minute</h2>
              </div>
              <button
                ref={closeButtonRef}
                className="homepage-video-close"
                type="button"
                aria-label="Close video"
                autoFocus
                onClick={closeVideo}
              >
                ×
              </button>
            </div>

            <div className="homepage-video-frame">
              <iframe
                src={HEYGEN_EMBED_URL}
                title="Naya explains the ARKON digital team"
                allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                referrerPolicy="strict-origin-when-cross-origin"
                onLoad={() => closeButtonRef.current?.focus()}
                allowFullScreen
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
