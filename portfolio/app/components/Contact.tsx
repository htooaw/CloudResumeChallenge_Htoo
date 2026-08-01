import { profile } from '@/lib/data';
import { Icon } from './Icon';

export function Contact() {
  return (
    <section id="contact" className="contact-section section-anchor" aria-labelledby="contact-title">
      <p className="eyebrow">Contact</p>
      <h2 id="contact-title">Open to cloud and DevOps roles.</h2>
      <p>
        I am interested in cloud infrastructure, platform engineering, DevOps, and SRE opportunities where operational thinking matters.
      </p>

      <div className="contact-actions">
        <a className="button button-dark" href={`mailto:${profile.email}`}>
          Start a conversation <Icon name="mail" />
        </a>
        <a className="button button-outline-dark" href={profile.linkedin} target="_blank" rel="noopener noreferrer">
          LinkedIn <Icon name="external" />
        </a>
      </div>

      <div className="contact-meta">
        <span>{profile.email}</span>
        <span>{profile.location}</span>
        <a href={profile.resumePdf} download>Download résumé <Icon name="download" size={15} /></a>
      </div>
    </section>
  );
}
