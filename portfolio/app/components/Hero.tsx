import { certifications, experience, profile, projects } from '@/lib/data';
import { Icon } from './Icon';

export function Hero() {
  return (
    <section id="top" className="hero section-anchor" aria-labelledby="hero-title">
      <p className="eyebrow reveal">AWS · Terraform · CI/CD</p>
      <h1 id="hero-title" className="display-title reveal reveal-delay-1">
        <span>Cloud &amp; DevOps</span>
        <span className="display-title-muted">Engineer</span>
      </h1>
      <p className="hero-support reveal reveal-delay-2">{profile.tagline}</p>

      <div className="hero-actions reveal reveal-delay-3">
        <a href="#projects" className="button button-primary">
          Explore projects <Icon name="arrow" />
        </a>
        <a href={profile.resumePdf} className="button button-secondary" download>
          Résumé <Icon name="download" />
        </a>
      </div>

      <dl className="proof-strip reveal reveal-delay-3" aria-label="Portfolio facts">
        <div>
          <dt>Projects documented</dt>
          <dd>{projects.length}</dd>
        </div>
        <div>
          <dt>Infrastructure roles</dt>
          <dd>{experience.length}</dd>
        </div>
        <div>
          <dt>Certifications</dt>
          <dd>{certifications.length}</dd>
        </div>
      </dl>
    </section>
  );
}
