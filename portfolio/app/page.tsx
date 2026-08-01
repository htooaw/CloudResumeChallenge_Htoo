import { Certifications } from './components/Certifications';
import { Contact } from './components/Contact';
import { Experience } from './components/Experience';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { Nav } from './components/Nav';
import { ProfileCard } from './components/ProfileCard';
import { Projects } from './components/Projects';
import { Skills } from './components/Skills';

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <Nav />
      <main id="main-content" className="page-shell">
        <div className="profile-column">
          <ProfileCard />
        </div>
        <div className="content-column">
          <Hero />
          <Projects />
          <Experience />
          <Skills />
          <Certifications />
          <Contact />
          <Footer />
        </div>
      </main>
    </>
  );
}
