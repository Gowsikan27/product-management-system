"use client";

import { ReactNode } from "react";

type ModalProps = {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
};

export function Modal({ open, title, subtitle, onClose, children }: ModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#04040a]/70 px-4 py-8 backdrop-blur-md" role="dialog" aria-modal="true">
      <div className="gradient-border glass-panel w-full max-w-3xl rounded-[22px] p-6 sm:p-7">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold text-foreground">{title}</h3>
            {subtitle ? <p className="mt-1 text-sm text-muted">{subtitle}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-semibold text-foreground transition hover:bg-white/[0.08]"
          >
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
