import { certifications } from '@/lib/data';

export function Certifications() {
  return (
    <section aria-labelledby="certifications">
      <h2 id="certifications">Certifications</h2>
      {certifications.map(({ group, items }) => (
        <div className="cert-group" key={group}>
          <h3 className="cert-heading">{group}</h3>
          <ul className="certs">
            {items.map((cert) => (
              <li key={cert.name}>
                <span>{cert.name}</span>
                <span className="issuer">{cert.issuer}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
