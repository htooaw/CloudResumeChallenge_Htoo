import { about } from '@/lib/data';
import { SectionHeader } from './SectionHeader';

export function About() {
  return (
    <section id="about" className="section-block section-anchor" aria-labelledby="about-title">
      <SectionHeader id="about-title" eyebrow="About" title="Background and engineering focus." />

      <div className="about-grid">
        <div className="about-copy">
          {about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
        <div className="principles-card">
          <p className="mini-label">How I work</p>
          <ol>
            {about.principles.map((principle, index) => (
              <li key={principle}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                {principle}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
