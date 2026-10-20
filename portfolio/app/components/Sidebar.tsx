import { profile } from '@/lib/data';
import ThemeToggle from './ThemeToggle';
import VisitorCount from './VisitorCount';

export function Sidebar() {
  return (
    <aside className="sidebar">
      <h1>{profile.name}</h1>
      <p className="sub">{profile.role} · {profile.location}</p>
      <p className="intro">{profile.intro}</p>
      <nav className="links" aria-label="Profile links">
        <a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href={profile.resumePdf} target="_blank" rel="noopener noreferrer">Résumé (PDF)</a>
        <a href={`mailto:${profile.email}`}>{profile.email}</a>
      </nav>
      <div className="sidebar-foot">
        <VisitorCount />
        <ThemeToggle />
      </div>
    </aside>
  );
}
