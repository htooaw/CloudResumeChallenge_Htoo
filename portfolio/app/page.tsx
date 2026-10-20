import { education, experience, recognition } from '@/lib/data';
import { Certifications } from './components/Certifications';
import { Project } from './components/Project';
import { Sidebar } from './components/Sidebar';
import { Timeline } from './components/Timeline';

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <div className="page">
        <Sidebar />
        <main id="main-content">
          <Project />
          <Timeline id="experience" title="Experience" entries={experience} />
          <Timeline id="education" title="Education" entries={education} />
          <Certifications />
          <Timeline id="recognition" title="Recognition" entries={recognition} />
        </main>
      </div>
    </>
  );
}
