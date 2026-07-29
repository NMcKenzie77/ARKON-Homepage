import './vertical-closing-cta.css';

export default function VerticalClosingCta({
  eyebrow,
  title,
  body,
  buttonLabel,
  href = '/#demo'
}) {
  return (
    <section className="demo-cta industry-cta vertical-closing-cta is-visible" data-reveal>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        <p>{body}</p>
      </div>
      <a className="primary-button" href={href}>{buttonLabel}</a>
    </section>
  );
}
