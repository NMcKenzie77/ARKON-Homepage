export default function SiteHeader({ showPricing = false }) {
  return (
    <header className="site-header" data-master-header="true">
      <a className="brand" href="/" aria-label="ARKON Systems home">
        <span className="brand-mark" aria-hidden="true" />
        <span>
          <strong>ARKON</strong>
          <small>Systems</small>
        </span>
      </a>

      <nav className="desktop-nav" aria-label="Primary navigation">
        <a href="/#how">How it works</a>
        <a href="/#team">Core team</a>
        <a href="/#solutions">Business types</a>
        <a href="/#voice">Your voice</a>
        {showPricing ? <a href="#pricing">Pricing</a> : null}
      </nav>

      <a className="nav-cta" href="/#demo">Book a demo</a>
    </header>
  );
}
