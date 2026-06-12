// src/components/ui/Section.tsx

interface SectionProps {
  title: string;
  children: React.ReactNode;
  delay?: number;
}

export default function Section({ title, children, delay = 0 }: SectionProps) {
  const delayClass =
    delay === 0 ? 'animate-fade-up'
    : delay === 1 ? 'animate-fade-up-delay-1'
    : delay === 2 ? 'animate-fade-up-delay-2'
    : 'animate-fade-up-delay-3';

  return (
    <section className={delayClass}>
      <div className="mb-4 flex items-center gap-3">
        <h2 className="text-base font-bold tracking-tight text-text">{title}</h2>
        <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
      </div>
      {children}
    </section>
  );
}
