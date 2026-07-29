import './legal-pages.css';

function Section({ section }) {
  return (
    <section className="legal-section" id={section.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}>
      <h2>{section.title}</h2>
      {section.paragraphs?.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
      {section.bullets?.length ? (
        <ul>
          {section.bullets.map(item => <li key={item}>{item}</li>)}
        </ul>
      ) : null}
      {section.contactItems?.length ? (
        <div className="legal-contact-grid">
          {section.contactItems.map(item => (
            <article className="legal-contact-card" key={`${item.label}-${item.value}`}>
              <span>{item.label}</span>
              {item.href ? <a href={item.href}>{item.value}</a> : <strong>{item.value}</strong>}
            </article>
          ))}
        </div>
      ) : null}
      {section.callout ? <div className="legal-callout"><strong>{section.callout}</strong></div> : null}
    </section>
  );
}

export default function LegalPage({ page }) {
  return (
    <main className="legal-page">
      <section className="legal-hero">
        <div className="legal-hero-inner">
          <p className="eyebrow">{page.eyebrow}</p>
          <h1>{page.title}</h1>
          <p>{page.description}</p>
          <div className="legal-meta">
            <span>Effective {page.updated}</span>
            <a href="/contact">Contact ARKON Systems</a>
          </div>
        </div>
      </section>

      <div className="legal-layout">
        <aside className="legal-summary" aria-label={`${page.name} summary`}>
          <p className="eyebrow">At a glance</p>
          <p>{page.primary}</p>
          <nav aria-label="Legal page navigation">
            {page.sections.map(section => {
              const id = section.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
              return <a href={`#${id}`} key={section.title}>{section.title}</a>;
            })}
          </nav>
        </aside>

        <article className="legal-document">
          {page.sections.map(section => <Section section={section} key={section.title} />)}
        </article>
      </div>
    </main>
  );
}
