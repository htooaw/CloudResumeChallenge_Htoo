import { achievements, certifications } from '@/lib/data';
import { SectionHeader } from './SectionHeader';

const LABELS = {
  cloud: 'Cloud & infrastructure',
  network: 'Networking',
  security: 'Security',
};

export function Certifications() {
  return (
    <section id="certifications" className="section-block section-anchor" aria-labelledby="certifications-title">
      <SectionHeader id="certifications-title" eyebrow="Credentials" title="Certifications and security recognition." />

      <div className="cert-grid">
        {(Object.keys(LABELS) as Array<keyof typeof LABELS>).map((category) => (
          <div className="cert-group" key={category}>
            <p className="mini-label">{LABELS[category]}</p>
            <ul>
              {certifications.filter((cert) => cert.category === category).map((cert) => (
                <li key={cert.name}>
                  <span>{cert.name}</span>
                  <small>{cert.issuer}</small>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="honors-panel">
        <p className="mini-label">Recognition</p>
        {achievements.map((achievement) => (
          <article key={achievement.title}>
            <span>{achievement.year}</span>
            <div>
              <h3>{achievement.title}</h3>
              <p>{achievement.detail}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
