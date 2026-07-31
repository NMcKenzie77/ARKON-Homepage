import './homepage-video.css';

const HEYGEN_EMBED_URL = 'https://app.heygen.com/embeds/a477288ba09149e79a11fc9632a638ed';

export default function HomepageVideo() {
  return (
    <section className="homepage-video-section" aria-labelledby="homepage-video-title">
      <div className="homepage-video-heading" data-reveal>
        <p className="eyebrow">Meet Naya</p>
        <h2 id="homepage-video-title">See what your ARKON digital team handles in one minute.</h2>
      </div>

      <div className="homepage-video-shell" data-reveal>
        <div className="homepage-video-frame">
          <iframe
            src={HEYGEN_EMBED_URL}
            title="Naya explains the ARKON digital team"
            loading="lazy"
            allow="encrypted-media; fullscreen; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}
