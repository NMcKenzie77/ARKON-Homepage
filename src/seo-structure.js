import { businessIdentity } from './legal-content.js';

export const RELATED_ROUTE_MAP = {
  '/real-estate': ['/professional-services', '/insurance', '/home-services'],
  '/insurance': ['/professional-services', '/real-estate', '/law-firms'],
  '/short-term-rentals': ['/home-services', '/professional-services', '/real-estate'],
  '/home-services': ['/garages', '/professional-services', '/short-term-rentals'],
  '/professional-services': ['/law-firms', '/insurance', '/real-estate'],
  '/salons': ['/gyms-fitness-studios', '/professional-services', '/home-services'],
  '/garages': ['/home-services', '/professional-services', '/insurance'],
  '/medical-dental-offices': ['/professional-services', '/salons', '/law-firms'],
  '/law-firms': ['/professional-services', '/insurance', '/real-estate'],
  '/gyms-fitness-studios': ['/salons', '/professional-services', '/home-services']
};

export function getRelatedPages(route, industryPages) {
  return (RELATED_ROUTE_MAP[route] || [])
    .map(path => ({ path, page: industryPages[path] }))
    .filter(item => Boolean(item.page));
}

export function getBreadcrumbItems(route, seo, siteUrl) {
  const items = [
    { name: 'ARKON Systems', url: `${siteUrl}/` }
  ];

  if (route !== '/') {
    items.push({
      name: seo.schemaName || seo.h1 || seo.title,
      url: `${siteUrl}${route}`
    });
  }

  return items;
}

function breadcrumbSchema(items, pageUrl) {
  if (items.length < 2) return null;

  return {
    '@type': 'BreadcrumbList',
    '@id': `${pageUrl}#breadcrumbs`,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
}

function faqSchema(page, pageUrl) {
  if (!page?.faq?.length) return null;

  return {
    '@type': 'FAQPage',
    '@id': `${pageUrl}#faq`,
    mainEntity: page.faq.map(([question, answer]) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer
      }
    }))
  };
}

export function buildStructuredData({ route, seo, industryPages, siteUrl }) {
  const organizationId = `${siteUrl}/#organization`;
  const websiteId = `${siteUrl}/#website`;
  const organization = {
    '@type': 'Organization',
    '@id': organizationId,
    name: businessIdentity.brandName,
    url: `${siteUrl}/`,
    email: businessIdentity.businessEmail,
    telephone: businessIdentity.phoneHref,
    description: 'ARKON Systems organizes repeatable calls, messages, follow-up, scheduling, records, handoffs, and owner visibility for service businesses.',
    areaServed: {
      '@type': 'Country',
      name: businessIdentity.country
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        email: businessIdentity.businessEmail,
        telephone: businessIdentity.phoneHref,
        areaServed: 'US',
        availableLanguage: ['English']
      },
      {
        '@type': 'ContactPoint',
        contactType: 'privacy',
        email: businessIdentity.privacyEmail,
        areaServed: 'US',
        availableLanguage: ['English']
      }
    ]
  };
  const website = {
    '@type': 'WebSite',
    '@id': websiteId,
    name: 'ARKON Systems',
    url: `${siteUrl}/`,
    publisher: { '@id': organizationId },
    inLanguage: 'en-US'
  };

  if (seo.schemaName === 'Page Not Found') {
    return JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [organization, website]
    });
  }

  const pageUrl = `${siteUrl}${route === '/' ? '/' : route}`;
  const webpageId = `${pageUrl}#webpage`;
  const industryPage = industryPages[route];
  const breadcrumbs = getBreadcrumbItems(route, seo, siteUrl);
  const webpage = {
    '@type': 'WebPage',
    '@id': webpageId,
    name: seo.schemaName || seo.h1 || seo.title,
    description: seo.description,
    url: pageUrl,
    isPartOf: { '@id': websiteId },
    about: { '@id': organizationId },
    inLanguage: 'en-US'
  };
  const graph = [organization, website, webpage];

  const breadcrumb = breadcrumbSchema(breadcrumbs, pageUrl);
  if (breadcrumb) {
    graph.push(breadcrumb);
    webpage.breadcrumb = { '@id': breadcrumb['@id'] };
  }

  if (route === '/' && seo.schemaType === 'SoftwareApplication') {
    graph.push({
      '@type': 'SoftwareApplication',
      '@id': `${pageUrl}#application`,
      name: 'ARKON Systems',
      description: seo.description,
      url: pageUrl,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      provider: { '@id': organizationId }
    });
  }

  if (industryPage && industryPage.pageType !== 'legal') {
    const serviceId = `${pageUrl}#service`;
    graph.push({
      '@type': 'Service',
      '@id': serviceId,
      name: industryPage.name,
      description: industryPage.description,
      url: pageUrl,
      serviceType: industryPage.name,
      provider: { '@id': organizationId },
      areaServed: {
        '@type': 'Country',
        name: 'United States'
      }
    });
    webpage.mainEntity = { '@id': serviceId };
  }

  const faq = faqSchema(industryPage, pageUrl);
  if (faq) {
    graph.push(faq);
    webpage.hasPart = { '@id': faq['@id'] };
  }

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': graph
  });
}
