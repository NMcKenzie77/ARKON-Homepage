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
import './homepage-logo.css';
import './pricing.css';
import './business-footer.css';

export function normalizeRoute(pathname = '/') {
  const path = String(pathname || '/').split('?')[0].split('#')[0];
  return path.replace(/\/+$/, '') || '/';
}

function getBrowserRoute() {
  return normalizeRoute(window.location.pathname);
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

function RouteContent({ route }) {
  const routePage = industryPages[route];

  if (routePage?.pageType === 'legal') {
    return (
      <>
        <ClientSeoSync route={route} />
        <main className="industry-page" data-public-route={route}>
          <PageBanner page={routePage} route={route} animate={false} />
          <LegalPage page={routePage} />
        </main>
      </>
    );
  }

  if (routePage) {
    return (
      <>
        <ClientSeoSync route={route} />
        <IndustryPage page={routePage} route={route} />
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
  const page = industryPages[route];
  const showPricing = Boolean(page?.pricing);
  const isBusinessPage = Boolean(page && page.pageType !== 'legal');

  return (
    <>
      <SiteHeader showPricing={showPricing} />
      <RouteContent route={route} />
      <SiteFooter showCta={!isBusinessPage} />
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
