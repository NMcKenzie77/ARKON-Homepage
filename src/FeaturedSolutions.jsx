import { solutions } from './data.js';
import './featured-solutions.css';

export default function FeaturedSolutions() {
  return (
    <section className="section featured-solutions-section" id="solutions">
      <div className="featured-solutions-heading" data-reveal>
        <p className="eyebrow">Choose your business type</p>
        <h2>See ARKON in a business like yours.</h2>
        <p>
          ARKON is focused on six industries. Each page shows the calls, messages, follow-up,
          records, handoffs, and owner view for that kind of business.
        </p>
      </div>

      <div className="featured-solutions-grid">
        {solutions.map(solution => (
          <a
            className="featured-solution-card"
            href={solution.href}
            key={solution.href}
            data-reveal
          >
            <span>{solution.name}</span>
            <h3>{solution.title}</h3>
            <p>{solution.details}</p>
            <strong>See how ARKON fits →</strong>
          </a>
        ))}
      </div>
    </section>
  );
}
