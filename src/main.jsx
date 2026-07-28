import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { industryPages, seoPages, SITE_URL } from './site-content.js';
import { getBreadcrumbItems, getRelatedPages } from './seo-structure.js';
import './styles.css';
import './hero-compact.css';
import './walkthrough.css';
import './hero-shrink.css';
import './background-fix.css';
import './alignment-fix.css';
import './request-flow.css';
import './seo-pages.css';
import './core-team-polish.css';
import './copy-polish.css';
import './homepage-logo.css';
import './pricing.css';

function getCurrentRoute() {
  return window.location.pathname.replace(/\/$/, '') || '/';
}

function setMetaContent(selector, value) {
  const element = document.querySelector(selector);
  if (element && value) element.setAttribute('content', value);
}

function syncDocumentSeo(route) {
  const seo = seoPages[route] || seoPages['/'];
  const canonical = `${SITE_URL}${route === '/' ? '/' : route}`;

  document.title = seo.title;
  setMetaContent('meta[name="description"]', seo.description);
  setMetaContent('meta[property="og:title"]', seo.title);
  setMetaContent('meta[property="og:description"]', seo.description);
  setMetaContent('meta[property="og:url"]', canonical);
  setMetaContent('meta[name="twitter:title"]', seo.title);
  setMetaContent('meta[name="twitter:description"]', seo.description);

  const canonicalLink = document.querySelector('link[rel="canonical"]');
  if (canonicalLink) canonicalLink.setAttribute('href', canonical);
}

function ClientSeoSync({ route }) {
  useEffect(() => {
    syncDocumentSeo(route);
  }, [route]);

  return null;
}

function LegacyContactBannerRemover() {
  useEffect(() => {
    const matchesLegacyContactBanner = node => {
      const text = String(node.textContent || '').replace(/\s+/g, ' ').trim().toLowerCase();
      const phoneDigits = text.replace(/\D/g, '');
      return text.includes('contact nathan')
        && text.includes('nathan@arkonsysai.com')
        && phoneDigits.includes('8136931669');
    };

    const removeLegacyContactBanner = () => {
      const candidates = [...document.querySelectorAll('section, article, aside, footer, div')]
        .filter(matchesLegacyContactBanner);

      candidates
        .filter(node => ![...node.children].some(matchesLegacyContactBanner))
        .forEach(node => node.remove());
    };

    removeLegacyContactBanner();
    const observer = new MutationObserver(removeLegacyContactBanner);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return null;
}

function BrandTextNormalizer() {
  useEffect(() => {
    const normalizeBrandMarks = () => {
      document.querySelectorAll('.brand-mark').forEach(mark => {
        if (mark.textContent) mark.textContent = '';
        mark.setAttribute('aria-hidden', 'true');
      });
    };

    normalizeBrandMarks();
    const observer = new MutationObserver(normalizeBrandMarks);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return null;
}

function PublicRoleCopyCleanup() {
  useEffect(() => {
    const replacements = [
      ['Naya, Vera, Porter, Grant, Marcus, and Iris', 'Naya, Vera, Grant, Marcus, and Iris'],
      ['follows up after Porter or Vera captures a lead', 'follows up after calls or website inquiries create a lead'],
      ['Vera answers calls. Porter handles website inquiries.', 'Vera answers calls. ARKON handles website inquiries.'],
      ['Porter handles website inquiries', 'ARKON handles website inquiries'],
      ['Porter or Vera', 'calls or website inquiries']
    ];

    const cleanPublicCopy = () => {
      const root = document.getElementById('root');
      if (!root) return;

      root.querySelectorAll('.core-team-card').forEach(card => {
        const name = card.querySelector('h3')?.textContent?.trim();
        if (name === 'Porter') card.remove();
      });

      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);

      nodes.forEach(node => {
        const parentTag = node.parentElement?.tagName;
        if (parentTag === 'SCRIPT' || parentTag === 'STYLE' || parentTag === 'TEXTAREA' || parentTag === 'INPUT') return;

        let next = node.nodeValue || '';
        replacements.forEach(([from, to]) => {
          next = next.replaceAll(from, to);
        });
        next = next.replace(/\bPorter\b/g, 'ARKON');

        if (next !== node.nodeValue) node.nodeValue = next;
      });
    };

    cleanPublicCopy();
    const root = document.getElementById('root');
    if (!root) return undefined;

    const observer = new MutationObserver(cleanPublicCopy);
    observer.observe(root, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return null;
}

function usePageReveal() {
  useEffect(() => {
    const nodes = document.querySelectorAll('[data-reveal]');
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    nodes.forEach(node => observer.observe(node));
    return () => observer.disconnect();
  }, []);
}

function UnifiedHeader({ showPricing = false }) {
  return (
    <header className="site-header">
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

function UnifiedFooter() {
  return (
    <footer className="site-footer">
      <div className="brand muted-brand">
        <span className="brand-mark" aria-hidden="true" />
        <span>
          <strong>ARKON</strong>
          <small>Systems</small>
        </span>
      </div>
      <p>© {new Date().getFullYear()} ARKON Systems. Repeatable work handled. Your team stays focused.</p>
    </footer>
  );
}

function Breadcrumbs({ route, page }) {
  const items = getBreadcrumbItems(route, { schemaName: page.name }, SITE_URL);

  return (
    <nav className="industry-breadcrumbs" aria-label="Breadcrumb">
      <ol>
        {items.map((item, index) => (
          <li key={item.url}>
            {index < items.length - 1
              ? <a href={index === 0 ? '/' : item.url}>{item.name}</a>
              : <span aria-current="page">{item.name}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function PricingSection({ plans }) {
  if (!plans?.length) return null;

  return (
    <section className="section pricing-section" id="pricing">
      <div className="section-heading pricing-heading" data-reveal>
        <p className="eyebrow">Auto repair pricing</p>
        <h2>Start with the right operating layer for the shop.</h2>
        <p>
          These are starting points for scoping ARKON for an auto repair operation. The founder pilot proves recovered work and follow-up first, then the account moves to the right monthly level after the workflow is proven.
        </p>
      </div>

      <div className="pricing-grid">
        {plans.map(plan => (
          <article className={plan.enterprise ? 'pricing-card enterprise-pricing-card' : 'pricing-card'} key={plan.name} data-reveal>
            <div className="pricing-card-topline"><span>{plan.fit}</span></div>
            <h3>{plan.name}</h3>
            <p className="pricing-summary">{plan.summary}</p>
            <div className="pricing-price-row">
              <div><small>Founder pilot</small><strong>{plan.pilot}</strong></div>
              <div><small>Target monthly</small><strong>{plan.target}</strong></div>
            </div>
            <p className="pricing-setup">{plan.setup}</p>
            <ul>{plan.includes.map(item => <li key={item}>{item}</li>)}</ul>
          </article>
        ))}
      </div>

      <div className="pricing-note" data-reveal>
        <strong>Pricing is scoped after discovery.</strong>
        <span>Call volume, number of locations, team size, existing software, live-call coverage, and integration depth can change the final quote.</span>
      </div>
    </section>
  );
}

function RelatedBusinessPages({ route }) {
  const relatedPages = getRelatedPages(route, industryPages);
  if (!relatedPages.length) return null;

  return (
    <section className="section industry-related-section">
      <div className="section-heading" data-reveal>
        <p className="eyebrow">Related business workflows</p>
        <h2>See how the same operating approach applies elsewhere.</h2>
        <p>Each page focuses on the calls, messages, records, handoffs, and owner visibility that matter in that kind of business.</p>
      </div>
      <div className="industry-related-grid">
        {relatedPages.map(({ path, page }) => (
          <a className="industry-related-card" href={path} key={path} data-reveal>
            <span>{page.eyebrow}</span>
            <h3>{page.title}</h3>
            <p>{page.description}</p>
            <strong>View workflow</strong>
          </a>
        ))}
      </div>
    </section>
  );
}

function UnifiedIndustryPage({ page, route }) {
  usePageReveal();

  return (
    <>
      <ClientSeoSync route={route} />
      <UnifiedHeader showPricing={Boolean(page.pricing)} />
      <main className="industry-page">
        <Breadcrumbs route={route} page={page} />
        <section className="hero industry-hero">
          <div className="hero-background" aria-hidden="true">
            <span className="orb orb-one" />
            <span className="orb orb-two" />
            <span className="grid-glow" />
          </div>
          <div className="industry-hero-inner" data-reveal>
            <p className="eyebrow">{page.eyebrow}</p>
            <h1>{page.title}</h1>
            <p>{page.description}</p>
            <div className="hero-actions">
              <a className="primary-button" href="/#demo">Request demo</a>
              <a className="secondary-button" href="/how-it-works">See how ARKON works</a>
            </div>
          </div>
        </section>

        {page.reality ? (
          <section className="industry-reality-panel" data-reveal>
            <p className="eyebrow">{page.reality.eyebrow}</p>
            <h2>{page.reality.title}</h2>
            {page.reality.body.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
            <div className="industry-reality-callout"><strong>{page.reality.callout}</strong></div>
          </section>
        ) : null}

        <section className="section industry-intro-section">
          <div className="section-heading" data-reveal>
            <p className="eyebrow">Why it matters</p>
            <h2>Repeatable work should not depend on memory.</h2>
            <p>{page.primary}</p>
          </div>
          <div className="industry-card-grid">
            {page.cards.map(([title, copy]) => (
              <article className="industry-card" key={title} data-reveal>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <PricingSection plans={page.pricing} />

        <section className="section industry-workflow-section">
          <div className="section-heading" data-reveal>
            <p className="eyebrow">Example workflows</p>
            <h2>What ARKON can keep moving.</h2>
            <p>Each business gets workflow rules based on its calls, messages, documents, staff roles, and owner view.</p>
          </div>
          <div className="industry-workflow-list">
            {page.workflow.map((item, index) => (
              <article className="industry-step" key={item} data-reveal>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{item}</h3>
              </article>
            ))}
          </div>
        </section>

        <section className="section industry-faq-section">
          <div className="section-heading" data-reveal>
            <p className="eyebrow">Questions business owners ask</p>
            <h2>Built for control, not guesswork.</h2>
          </div>
          <div className="industry-faq-grid">
            {page.faq.map(([question, answer]) => (
              <article className="industry-faq" key={question} data-reveal>
                <h3>{question}</h3>
                <p>{answer}</p>
              </article>
            ))}
          </div>
        </section>

        <RelatedBusinessPages route={route} />

        <section className="demo-cta industry-cta" data-reveal>
          <div>
            <p className="eyebrow">See it for your business</p>
            <h2>Walk through the real workflow with ARKON.</h2>
            <p>Review the calls, messages, follow-ups, records, handoffs, and owner visibility that matter most for your operation.</p>
          </div>
          <a className="primary-button" href="/#demo">Request demo</a>
        </section>
      </main>
      <UnifiedFooter />
    </>
  );
}

function AppWithCleanup({ route }) {
  return (
    <>
      <ClientSeoSync route={route} />
      <App />
      <LegacyContactBannerRemover />
      <BrandTextNormalizer />
      <PublicRoleCopyCleanup />
    </>
  );
}

const route = getCurrentRoute();
const industryPage = industryPages[route];
const container = document.getElementById('root');

createRoot(container).render(
  <React.StrictMode>
    {industryPage
      ? <UnifiedIndustryPage page={industryPage} route={route} />
      : <AppWithCleanup route={route} />}
  </React.StrictMode>
);
