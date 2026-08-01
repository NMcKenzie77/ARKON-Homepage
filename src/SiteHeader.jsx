import { useEffect, useRef, useState } from 'react';
import './mobile-navigation.css';

const primaryLinks = [
  { label: 'How it works', href: '/#how' },
  { label: 'Core team', href: '/#team' },
  { label: 'Business types', href: '/#solutions' },
  { label: 'Your voice', href: '/#voice' }
];

const businessLinks = [
  { label: 'Real Estate', href: '/real-estate' },
  { label: 'Insurance', href: '/insurance' },
  { label: 'Short-Term Rentals', href: '/short-term-rentals' },
  { label: 'Home Services', href: '/home-services' },
  { label: 'Salons', href: '/salons' },
  { label: 'Auto Repair Shops', href: '/garages' }
];

export default function SiteHeader({ showPricing = false }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const firstMenuLinkRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusTimer = window.setTimeout(() => firstMenuLinkRef.current?.focus(), 50);

    function handleKeyDown(event) {
      if (event.key !== 'Escape') return;
      setMenuOpen(false);
      window.setTimeout(() => menuButtonRef.current?.focus(), 0);
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  function closeMenu(returnFocus = false) {
    setMenuOpen(false);
    if (returnFocus) window.setTimeout(() => menuButtonRef.current?.focus(), 0);
  }

  return (
    <>
      <header className="site-header" data-master-header="true">
        <a className="brand" href="/" aria-label="ARKON Systems home">
          <span className="brand-mark" aria-hidden="true" />
          <span>
            <strong>ARKON</strong>
            <small>Systems</small>
          </span>
        </a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {primaryLinks.map(link => <a href={link.href} key={link.href}>{link.label}</a>)}
          {showPricing ? <a href="#pricing">Pricing</a> : null}
        </nav>

        <a className="nav-cta" href="/#demo">Book a demo</a>

        <button
          ref={menuButtonRef}
          className="mobile-menu-button"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-site-navigation"
          aria-label={menuOpen ? 'Close site menu' : 'Open site menu'}
          onClick={() => setMenuOpen(current => !current)}
        >
          <span className="mobile-menu-icon" aria-hidden="true"><span /></span>
        </button>
      </header>

      {menuOpen ? (
        <>
          <button
            className="mobile-menu-backdrop"
            type="button"
            aria-label="Close site menu"
            onClick={() => closeMenu(true)}
          />

          <nav id="mobile-site-navigation" className="mobile-site-navigation" aria-label="Mobile navigation">
            <strong>Explore ARKON</strong>
            <div className="mobile-menu-links">
              {primaryLinks.map((link, index) => (
                <a
                  ref={index === 0 ? firstMenuLinkRef : null}
                  href={link.href}
                  key={link.href}
                  onClick={() => closeMenu()}
                >
                  {link.label}
                </a>
              ))}
              {showPricing ? <a href="#pricing" onClick={() => closeMenu()}>Pricing</a> : null}
            </div>

            <div className="mobile-menu-section">
              <strong>Business types</strong>
              <div className="mobile-business-links">
                {businessLinks.map(link => (
                  <a href={link.href} key={link.href} onClick={() => closeMenu()}>{link.label}</a>
                ))}
              </div>
            </div>

            <div className="mobile-menu-section">
              <strong>Get started</strong>
              <div className="mobile-menu-links">
                <a href="/contact" onClick={() => closeMenu()}>Contact ARKON</a>
              </div>
              <a className="mobile-menu-cta" href="/#demo" onClick={() => closeMenu()}>Book a demo</a>
            </div>
          </nav>
        </>
      ) : null}
    </>
  );
}
