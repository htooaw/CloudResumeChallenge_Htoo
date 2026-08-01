type Props = {
  id: string;
  eyebrow: string;
  title: string;
  mutedLine?: string;
};

export function SectionHeader({ id, eyebrow, title, mutedLine }: Props) {
  return (
    <header className="section-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id}>
        <span>{title}</span>
        {mutedLine && <span className="heading-muted">{mutedLine}</span>}
      </h2>
    </header>
  );
}
