import type { Entry } from '@/lib/data';

// Experience, Education and Recognition share the same dated-row layout.
export function Timeline({ id, title, entries }: { id: string; title: string; entries: Entry[] }) {
  return (
    <section aria-labelledby={id}>
      <h2 id={id}>{title}</h2>
      {entries.map((entry) => (
        <div className="row" key={`${entry.when}-${entry.title}`}>
          <div className="when">{entry.when}</div>
          <div>
            <h3 className="row-title">{entry.title}</h3>
            <p className="org">{entry.org}</p>
            {entry.summary && <p>{entry.summary}</p>}
            {entry.bullets && (
              <ul>
                {entry.bullets.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ))}
    </section>
  );
}
