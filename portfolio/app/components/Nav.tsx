import { Icon } from './Icon';

const NAV_ITEMS = [
  { href: '#top', label: 'Home', icon: 'home' as const },
  { href: '#projects', label: 'Projects', icon: 'layers' as const },
  { href: '#experience', label: 'Experience', icon: 'briefcase' as const },
  { href: '#skills', label: 'Skills', icon: 'tool' as const },
  { href: '#contact', label: 'Contact', icon: 'mail' as const },
];

export function Nav() {
  return (
    <header className="site-nav-wrap">
      <nav className="site-nav" aria-label="Primary navigation">
        {NAV_ITEMS.map((item) => (
          <a key={item.href} href={item.href} className="nav-link" aria-label={item.label} data-label={item.label}>
            <Icon name={item.icon} />
          </a>
        ))}
      </nav>
    </header>
  );
}
