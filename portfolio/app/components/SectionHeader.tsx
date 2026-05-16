type Props = {
  number: string;
  title: string;
  meta?: string;
};

export function SectionHeader({ number, title, meta }: Props) {
  return (
    <div className="mb-12 flex flex-col gap-3">
      <div className="section-label">
        <span className="text-amber-glow">{number}.</span>
        <span>// {meta ?? title.toLowerCase()}</span>
        <span className="hidden h-px flex-1 bg-ink-3 sm:block" />
      </div>
      <h2 className="font-serif text-4xl italic leading-tight tracking-tight text-bone-0 sm:text-5xl">
        {title}
      </h2>
    </div>
  );
}
