import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.public.jsx';
import CookieConsent from './CookieConsent.jsx';
import IndustryPage from './IndustryPage.jsx';
import LegalPage from './LegalPage.jsx';
import PageBanner from './PageBanner.jsx';
import SiteFooter from './SiteFooter.jsx';
import SiteHeader from './SiteHeader.jsx';
import './legal-register.js';
import { industryPages, seoPages, SITE_URL } from './site-content.js';
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
import './voice-proof.css';
import './homepage-logo.css';
import './pricing.css';
import './short-term-rental-page.css';

// Keep the already-indexed URL canonical. The descriptive route is an alias only.
const AUTO_REPAIR_ROUTE = '/garages';
const AUTO_REPAIR_ALIAS = '/auto-repair-shops';

export function normalizeRoute(pathname = '/') {
  const path = String(pathname || '/').split('?')[0].split('#')[0];
  return path.replace(/\/+$/, '') || '/';
}

function getBrowserRoute() {
  const route = normalizeRoute(window.location.pathname);

  if (route === AUTO_REPAIR_ALIAS) {
    window.history.replaceState({}, '', AUTO_REPAIR_ROUTE);
    return AUTO_REPAIR_ROUTE;
  }

  return route;
}

function getRoutePage(route) {
  if (route === AUTO_REPAIR_ALIAS) return industryPages[AUTO_REPAIR_ROUTE];
  return industryPages[route];
}

function getSeoPage(route) {
  if (route === AUTO_REPAIR_ALIAS) return seoPages[AUTO_REPAIR_ROUTE];
  return seoPages[route];
}

function getCanonicalRoute(route) {
  return route === AUTO_REPAIR_ALIAS ? AUTO_REPAIR_ROUTE : route;
}

function setMetaContent(selector, value) {
  const element = document.querySelector(selector);
  if (element && value) element.setAttribute('content', value);
}

function syncDocumentSeo(route) {
  const seo = getSeoPage(route) || seoPages['/'];
  const canonicalRoute = getCanonicalRoute(route);
  const canonical = `${SITE_URL}${canonicalRoute === '/' ? '/' : canonicalRoute}`;

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

function RouteContent({ route }) {
  const routePage = getRoutePage(route);
  const canonicalRoute = getCanonicalRoute(route);

  if (routePage?.pageType === 'legal') {
    return (
      <>
        <ClientSeoSync route={canonicalRoute} />
        <main className="industry-page" data-public-route={canonicalRoute}>
          <PageBanner page={routePage} route={canonicalRoute} animate={false} />
          <LegalPage page={routePage} />
        </main>
      </>
    );
  }

  if (routePage) {
    const renderedPage = canonicalRoute === '/short-term-rentals'
      ? {
          ...routePage,
          eyebrow: 'Short-term rental digital AI team',
          title: 'Keep every guest, cleaner, and property issue moving without living inside your phone.',
          description:
            'Your digital team handles guest questions, cleaner coordination, maintenance follow-up, emergency routing, reservation context, and owner briefings so the operation keeps moving even when you are unavailable.'
        }
      : routePage;

    return (
      <>
        <ClientSeoSync route={canonicalRoute} />
        <IndustryPage page={renderedPage} route={canonicalRoute} />
      </>
    );
  }

  return (
    <>
      <ClientSeoSync route={route} />
      <App />
    </>
  );
}

export function PublicSite({ route }) {
  const page = getRoutePage(route);
  const showPricing = Boolean(page?.pricing);

  return (
    <>
      <SiteHeader showPricing={showPricing} />
      <RouteContent route={route} />
      <SiteFooter />
      <CookieConsent />
    </>
  );
}

export function renderRouteForAudit(route) {
  return <PublicSite route={normalizeRoute(route)} />;
}

if (typeof document !== 'undefined') {
  const container = document.getElementById('root');
  if (!container) throw new Error('ARKON application root is missing.');

  createRoot(container).render(
    <React.StrictMode>
      <PublicSite route={getBrowserRoute()} />
    </React.StrictMode>
  );
}
