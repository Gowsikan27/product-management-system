"use client";

import { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

export function Button({
  children,
  className,
  loading,
  disabled,
  ...props
}: ButtonProps) {
  const computedClassName = [
    "inline-flex h-11 items-center justify-center rounded-2xl px-5 text-sm font-semibold tracking-[0.01em] transition-all duration-300",
    "bg-gradient-to-r from-[#7f5af0] to-[#a78bfa] text-white",
    "shadow-[0_10px_24px_rgba(127,90,240,0.35)]",
    "hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-[0_0_0_1px_rgba(167,139,250,0.4),0_16px_34px_rgba(127,90,240,0.5)]",
    "active:scale-[0.98]",
    "focus-visible:ring-2 focus-visible:ring-[#a78bfa]/45 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
    "disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-55",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={computedClassName} disabled={disabled || loading} {...props}>
      {loading ? "Please wait..." : children}
    </button>
  );
}
