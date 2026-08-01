import { profile } from '@/lib/data';
import { Icon } from './Icon';

export function ProfileCard() {
  return (
    <aside className="profile-card" aria-label={`${profile.name} profile`}>
      <div className="profile-visual" aria-hidden="true">
        <div className="profile-orbit profile-orbit-one" />
        <div className="profile-orbit profile-orbit-two" />
        <div className="profile-monogram">{profile.initials}</div>
        <span className="profile-node node-one" />
        <span className="profile-node node-two" />
        <span className="profile-node node-three" />
      </div>

      <div className="profile-copy">
        <p className="profile-name">{profile.name}</p>
        <p className="profile-role">{profile.role}</p>
      </div>

      <div className="profile-status">
        <span className="status-dot" aria-hidden="true" />
        <span>{profile.status}</span>
      </div>

      <p className="profile-location">Based in {profile.location}</p>

      <div className="profile-links" aria-label="Social links">
        <a href={profile.gitlab} target="_blank" rel="noopener noreferrer" aria-label="GitLab repository">
          <Icon name="git" />
        </a>
        <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile">
          <span aria-hidden="true" className="linkedin-mark">in</span>
        </a>
        <a href={`mailto:${profile.email}`} aria-label={`Email ${profile.name}`}>
          <Icon name="mail" />
        </a>
      </div>
    </aside>
  );
}
