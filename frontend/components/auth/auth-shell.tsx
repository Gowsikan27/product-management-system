"use client";

import { ReactNode } from "react";

type AuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function AuthShell({ eyebrow, title, description, children }: AuthShellProps) {
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-[1fr_1.03fr]">
        <section className="gradient-border relative overflow-hidden rounded-[24px] bg-[#0f0f1a] p-8 text-white shadow-[0_30px_90px_rgba(5,5,14,0.55)] sm:p-10 animate-fade-slide">
          <div className="pointer-events-none absolute -left-20 top-12 h-56 w-56 rounded-full bg-[#7f5af0]/30 blur-3xl" />
          <div className="pointer-events-none absolute -right-24 -top-20 h-64 w-64 rounded-full bg-[#a78bfa]/28 blur-3xl" />
          <div className="pointer-events-none absolute bottom-8 right-10 h-28 w-28 rounded-[30%] border border-white/15 bg-white/5 backdrop-blur" />

          <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#c4b5fd]">{eyebrow}</p>
          <h2 className="mt-4 max-w-md text-3xl font-bold leading-tight tracking-[-0.02em] sm:text-[2.05rem]">{title}</h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-[#d4d4dd]">{description}</p>

          <div className="mt-10 grid max-w-md gap-3 text-sm text-[#ddd6fe]">
            <div className="glass-panel rounded-2xl px-4 py-3">Realtime product metrics and secure workflows in one elegant console.</div>
            <div className="glass-panel rounded-2xl px-4 py-3">Built for high-velocity teams shipping premium product experiences.</div>
          </div>
        </section>
        <section className="flex items-center animate-fade-slide [animation-delay:120ms]">{children}</section>
      </div>
    </main>
  );
}
