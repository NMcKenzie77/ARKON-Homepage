import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
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

const pricingPlans = [
  {
    name: 'Follow-Up Starter',
    fit: 'Smaller shops, mobile mechanics, price-sensitive general repair',
    pilot: '$799/mo',
    target: '$999-$1,250/mo after proof',
    setup: '$1,000 setup',
    summary: 'Start with customer follow-up, simple notes, missed-call capture, review requests, and an owner weekly brief.',
    includes: ['Naya follow-up', 'Marcus customer memory', 'Voice memo notes', 'Review requests']
  },
  {
    name: 'Follow-Up Plus',
    fit: 'Diagnostic and general shops with moderate volume',
    pilot: '$999/mo',
    target: '$1,500/mo after proof',
    setup: '$1,250 setup',
    summary: 'Adds more structure around inspection notes, diagnostic follow-up, and owner visibility without heavy integrations.',
    includes: ['Starter features', 'Structured notes', 'Diagnostic follow-up', 'Better owner dashboard']
  },
  {
    name: 'Shop Operator',
    fit: 'Busy independent shops, tire, brake, and alignment shops',
    pilot: '$1,250/mo',
    target: '$1,750/mo after proof',
    setup: '$1,500 setup',
    summary: 'For shops where calls, texts, declined work, tech notes, scheduling handoffs, reviews, and owner visibility all matter.',
    includes: ['Calls and texts workflow', 'Declined-work recovery', 'Tech voice notes', 'Scheduling handoffs']
  },
  {
    name: 'Shop Command',
    fit: 'Premium independent, European, import, performance, or serious owner-operated shops',
    pilot: '$1,750/mo',
    target: '$2,500/mo after proof',
    setup: '$2,500-$3,500 setup',
    summary: 'A fuller operating layer with Vera, Naya, Marcus, handoffs, reminders, reviews, owner briefs, and tech/advisor voice notes.',
    includes: ['Vera voice intake', 'Naya follow-up', 'Grant owner brief', 'Tech and advisor notes']
  },
  {
    name: 'Enterprise',
    fit: 'Multi-location, fleet-heavy, dealership, or larger service operations',
    pilot: 'Discovery first',
    target: '$5,000+/mo',
    setup: '$7,500+ setup',
    summary: 'Custom operating layer for locations that need deeper routing, management reporting, fleet or unit memory, and scoped integrations.',
    includes: ['Multi-location dashboards', 'Fleet or unit memory', 'Custom routing', 'Management reports'],
    enterprise: true
  }
];

function getCurrentRoute() {
  return window.location.pathname.replace(/\/$/, '') || '/';
}

function buildPricingCard(plan) {
  const className = plan.enterprise ? 'pricing-card enterprise-pricing-card' : 'pricing-card';
  return `
    <article class="${className}">
      <div class="pricing-card-topline">
        <span>${plan.fit}</span>
      </div>
      <h3>${plan.name}</h3>
      <p class="pricing-summary">${plan.summary}</p>
      <div class="pricing-price-row">
        <div>
          <small>Founder pilot</small>
          <strong>${plan.pilot}</strong>
        </div>
        <div>
          <small>Target monthly</small>
          <strong>${plan.target}</strong>
        </div>
      </div>
      <p class="pricing-setup">${plan.setup}</p>
      <ul>
        ${plan.includes.map(item => `<li>${item}</li>`).join('')}
      </ul>
    </article>
  `;
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

function PricingInjector() {
  useEffect(() => {
    let scrollAfterInsert = false;

    const addPricingNavLink = () => {
      const nav = document.querySelector('.desktop-nav');
      if (!nav || nav.querySelector('a[href="/#pricing"]')) return;

      const link = document.createElement('a');
      link.href = '/#pricing';
      link.textContent = 'Pricing';
      nav.appendChild(link);
    };

    const syncPricingSection = () => {
      addPricingNavLink();

      const existing = document.getElementById('pricing');
      const route = getCurrentRoute();

      if (route !== '/') {
        if (existing) existing.remove();
        return;
      }

      if (existing) {
        if (scrollAfterInsert || window.location.hash === '#pricing') {
          existing.scrollIntoView({ behavior: 'smooth', block: 'start' });
          scrollAfterInsert = false;
        }
        return;
      }

      const solutionsSection = document.getElementById('solutions');
      if (!solutionsSection) return;

      const section = document.createElement('section');
      section.id = 'pricing';
      section.className = 'section pricing-section';
      section.innerHTML = `
        <div class="section-heading pricing-heading">
          <p class="eyebrow">Pricing schemes</p>
          <h2>Start with the right operating layer.</h2>
          <p>
            These are starting points for scoping ARKON. The founder pilot proves recovered work and follow-up first,
            then the account moves to the right monthly level after the workflow is proven.
          </p>
        </div>
        <div class="pricing-grid">
          ${pricingPlans.map(buildPricingCard).join('')}
        </div>
        <div class="pricing-note">
          <strong>Pricing is scoped after discovery.</strong>
          <span>Call volume, number of locations, team size, existing software, live-call coverage, and integration depth can change the final quote.</span>
        </div>
      `;

      solutionsSection.insertAdjacentElement('afterend', section);

      if (scrollAfterInsert || window.location.hash === '#pricing') {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        scrollAfterInsert = false;
      }
    };

    const handleHashChange = () => {
      if (window.location.hash === '#pricing') scrollAfterInsert = true;
      window.setTimeout(syncPricingSection, 0);
    };

    const timer = window.setTimeout(syncPricingSection, 0);
    window.addEventListener('popstate', syncPricingSection);
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('popstate', syncPricingSection);
      window.removeEventListener('hashchange', handleHashChange);
      const existing = document.getElementById('pricing');
      if (existing) existing.remove();
    };
  }, []);

  return null;
}

function AppWithPricing() {
  return (
    <>
      <App />
      <LegacyContactBannerRemover />
      <PricingInjector />
    </>
  );
}

const container = document.getElementById('root');
createRoot(container).render(<React.StrictMode><AppWithPricing /></React.StrictMode>);
