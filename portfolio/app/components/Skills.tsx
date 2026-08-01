import { skills } from '@/lib/data';
import { SectionHeader } from './SectionHeader';

export function Skills() {
  return (
    <section id="skills" className="section-block section-anchor" aria-labelledby="skills-title">
      <SectionHeader id="skills-title" eyebrow="Tools & capabilities" title="Technologies used in my work and projects." />
      <div className="skills-grid">
        {Object.entries(skills).map(([category, items], index) => (
          <article key={category} className={`skill-card skill-card-${index + 1}`}>
            <header className="skill-card-header">
              <span className="skill-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h3>{category}</h3>
              </div>
            </header>
            <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
          </article>
        ))}
      </div>
    </section>
  );
}
