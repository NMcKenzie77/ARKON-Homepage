import { solutions } from './data.js';
import './site-footer.css';
import './legal-footer.css';

const platformLinks = [
  { label: 'Home', href: '/' },
  { label: 'How it works', href: '/how-it-works' },
  { label: 'Core team', href: '/#team' },
  { label: 'Business types', href: '/#solutions' },
  { label: 'Your voice', href: '/#voice' },
  { label: 'Book a demo', href: '/#demo' }
];

const legalLinks = [
  { label: 'Privacy & Cookies', href: '/privacy' },
  { label: 'Terms of Use', href: '/terms' },
  { label: 'Data Security', href: '/data-security' },
  { label: 'Contact', href: '/contact' }
];

function openCookieSettings() {
  window.dispatchEvent(new CustomEvent('arkon:open-cookie-settings'));
}

export default function SiteFooter() {
  const year = new Date().getFullYear();
  const midpoint = Math.ceil(solutions.length / 2);
  const solutionColumns = [solutions.slice(0, midpoint), solutions.slice(midpoint)];

  return (
    <footer className="site-footer site-footer-complete">
      <div className="site-footer-inner">
        <section className="footer-cta-band" aria-label="ARKON Systems overview">
          <div className="footer-brand-copy">
            <a className="brand footer-brand" href="/" aria-label="ARKON Systems home">
              <span className="brand-mark" aria-hidden="true" />
              <span>
                <strong>ARKON</strong>
                <small>Systems</small>
              </span>
            </a>
            <p>
              Calls, messages, follow-up, scheduling, records, and handoffs kept moving around your existing team.
            </p>
          </div>

          <div className="footer-proof" aria-label="ARKON operating principles">
            <span>Business rules first</span>
            <span>Human handoffs preserved</span>
            <span>Owner visibility built in</span>
          </div>

          <div className="footer-cta-copy">
            <p className="footer-kicker">See it in your business</p>
            <strong>Walk through a real workflow.</strong>
            <a className="primary-button footer-button" href="/#demo">Book a demo</a>
          </div>
        </section>

        <div className="footer-navigation-grid footer-navigation-grid-legal">
          <nav className="footer-link-group" aria-label="Footer platform navigation">
            <h2>Platform</h2>
            {platformLinks.map(link => (
              <a href={link.href} key={link.href}>{link.label}</a>
            ))}
          </nav>

          <section className="footer-link-group footer-solutions" aria-labelledby="footer-business-types">
            <h2 id="footer-business-types">Business types</h2>
            <div className="footer-solution-columns">
              {solutionColumns.map((column, index) => (
                <nav aria-label={`Business types column ${index + 1}`} key={index}>
                  {column.map(solution => (
                    <a href={solution.href} key={solution.href}>{solution.name}</a>
                  ))}
                </nav>
              ))}
            </div>
          </section>

          <nav className="footer-link-group footer-legal-links" aria-label="Legal and privacy navigation">
            <h2>Legal & privacy</h2>
            {legalLinks.map(link => <a href={link.href} key={link.href}>{link.label}</a>)}
            <button type="button" className="footer-text-button" onClick={openCookieSettings}>Cookie settings</button>
            <button type="button" className="footer-text-button" onClick={openCookieSettings}>Your privacy choices</button>
          </nav>

          <section className="footer-control">
            <h2>Built around control</h2>
            <p>
              ARKON handles approved repeatable work and prepares the next step. Pricing, licensed advice,
              emergencies, sensitive requests, and judgment calls stay with the appropriate person.
            </p>
            <a href="/how-it-works">See how requests move</a>
          </section>
        </div>

        <div className="footer-bottom">
          <p>© {year} ARKON Systems. All rights reserved.</p>
          <p>
            ARKON Systems is the public business name used on this website. The legal contracting entity is identified in proposals,
            order forms, agreements, and invoices. Implementation depends on each business’s systems, permissions, and escalation rules.
          </p>
        </div>
      </div>
    </footer>
  );
}
