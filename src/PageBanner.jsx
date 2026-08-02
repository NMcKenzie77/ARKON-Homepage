import { getBreadcrumbItems } from './seo-structure.js';
import { SITE_URL } from './site-content.js';

function BannerBreadcrumbs({ route, page }) {
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

export default function PageBanner({ page, route, animate = true }) {
  const isLegalPage = page.pageType === 'legal';
  const isContactPage = route === '/contact';
  const primaryLabel = isLegalPage
    ? (isContactPage ? 'Book a demo' : 'Contact ARKON')
    : 'Request demo';
  const primaryHref = isLegalPage
    ? (isContactPage ? '/demo' : '/contact')
    : '/demo';
  const secondaryLabel = isLegalPage ? 'Back to homepage' : 'See how ARKON works';
  const secondaryHref = isLegalPage ? '/' : '/how-it-works';

  return (
    <>
      <BannerBreadcrumbs route={route} page={page} />
      <section className="hero industry-hero">
        <div className="hero-background" aria-hidden="true">
          <span className="orb orb-one" />
          <span className="orb orb-two" />
          <span className="grid-glow" />
        </div>
        <div className="industry-hero-inner" {...(animate ? { 'data-reveal': true } : {})}>
          <p className="eyebrow">{page.eyebrow}</p>
          <h1>{page.title}</h1>
          <p>{page.description}</p>
          <div className="hero-actions">
            <a className="primary-button" href={primaryHref}>{primaryLabel}</a>
            <a className="secondary-button" href={secondaryHref}>{secondaryLabel}</a>
          </div>
        </div>
      </section>
    </>
  );
}
