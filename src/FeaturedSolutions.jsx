import { useMemo, useState } from 'react';
import { solutions } from './data.js';
import './featured-solutions.css';

const featuredHrefs = new Set([
  '/real-estate',
  '/insurance',
  '/short-term-rentals',
  '/home-services',
  '/salons',
  '/garages'
]);

export default function FeaturedSolutions() {
  const [showAll, setShowAll] = useState(false);

  const featuredSolutions = useMemo(
    () => solutions.filter(solution => featuredHrefs.has(solution.href)),
    []
  );

  const remainingSolutions = useMemo(
    () => solutions.filter(solution => !featuredHrefs.has(solution.href)),
    []
  );

  const visibleSolutions = showAll
    ? [...featuredSolutions, ...remainingSolutions]
    : featuredSolutions;

  return (
    <section className="section featured-solutions-section" id="solutions">
      <div className="featured-solutions-heading" data-reveal>
        <p className="eyebrow">Choose your business type</p>
        <h2>See ARKON in a business like yours.</h2>
        <p>
          Start with the industries where ARKON is easiest to see in action. Each page shows the
          calls, messages, follow-up, records, handoffs, and owner view for that kind of business.
        </p>
      </div>

      <div className="featured-solutions-grid">
        {visibleSolutions.map(solution => (
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

      <div className="featured-solutions-actions" data-reveal>
        <button
          className="secondary-button featured-solutions-toggle"
          type="button"
          aria-expanded={showAll}
          onClick={() => setShowAll(current => !current)}
        >
          {showAll ? 'Show featured business types' : 'View all business types'}
        </button>
      </div>
    </section>
  );
}
