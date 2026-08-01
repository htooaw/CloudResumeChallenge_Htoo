import { profile } from '@/lib/data';
import VisitorCount from './VisitorCount';

export function Footer() {
  return (
    <footer className="site-footer">
      <p>© {new Date().getFullYear()} {profile.name}</p>
      <p className="footer-system"><span className="status-dot" aria-hidden="true" /> <VisitorCount /></p>
      <p>Next.js · Terraform · AWS</p>
    </footer>
  );
}
