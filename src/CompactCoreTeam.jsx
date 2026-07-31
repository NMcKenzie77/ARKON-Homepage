import './compact-core-team.css';

const team = [
  {
    name: 'Vera',
    role: 'Calls',
    copy: 'Answers, captures the reason for the call, and prepares the right handoff.'
  },
  {
    name: 'Naya',
    role: 'Messages and follow-up',
    copy: 'Handles approved replies and keeps clear next steps from being forgotten.'
  },
  {
    name: 'Marcus',
    role: 'Customer history',
    copy: 'Keeps records, notes, prior conversations, and follow-up context attached.'
  },
  {
    name: 'Iris',
    role: 'Email',
    copy: 'Sorts incoming email and surfaces what needs attention first.'
  },
  {
    name: 'Grant',
    role: 'Owner alerts',
    copy: 'Shows the owner what needs a decision, what was handled, and what is still open.'
  }
];

export default function CompactCoreTeam() {
  return (
    <section className="section compact-team-section" id="team" aria-labelledby="compact-team-title">
      <div className="compact-team-heading" data-reveal>
        <p className="eyebrow">The core team</p>
        <h2 id="compact-team-title">Five roles behind the work.</h2>
      </div>

      <div className="compact-team-grid">
        {team.map(member => (
          <article className="compact-team-card" key={member.name} data-reveal>
            <div>
              <strong>{member.name}</strong>
              <span>{member.role}</span>
            </div>
            <p>{member.copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
