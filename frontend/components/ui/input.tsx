"use client";

import { InputHTMLAttributes, useId } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function Input({ label, error, className, ...props }: InputProps) {
  const id = useId();

  return (
    <label htmlFor={id} className="flex w-full flex-col gap-1.5 text-sm text-foreground">
      <div className="relative">
        <input
          id={id}
          className={[
            "peer h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 pt-4 text-sm text-foreground",
            "shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur transition duration-300",
            "placeholder:text-transparent",
            "focus:border-[#a78bfa]/70 focus:outline-none focus:shadow-[0_0_0_1px_rgba(167,139,250,0.45),0_0_0_10px_rgba(127,90,240,0.12)]",
            error ? "border-danger/70" : "",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          placeholder={label}
          {...props}
        />
        <span
          className={[
            "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#8f90a3] transition-all duration-200",
            "peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm",
            "peer-focus:top-3 peer-focus:text-[11px] peer-focus:uppercase peer-focus:tracking-[0.13em] peer-focus:text-[#c4b5fd]",
            "peer-not-placeholder-shown:top-3 peer-not-placeholder-shown:text-[11px] peer-not-placeholder-shown:uppercase peer-not-placeholder-shown:tracking-[0.13em]",
          ].join(" ")}
        >
          {label}
        </span>
      </div>
      {error ? <span className="text-xs text-rose-300">{error}</span> : null}
    </label>
  );
}
