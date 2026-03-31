import { ReactNode } from "react";

type CardProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function Card({ title, subtitle, children }: CardProps) {
  return (
    <section className="gradient-border glass-panel w-full rounded-[20px] p-6 sm:p-7">
      <header className="mb-5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-muted">{subtitle}</p> : null}
      </header>
      {children}
    </section>
  );
}
