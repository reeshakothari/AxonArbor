import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type Variant = "primary" | "dark" | "outline" | "outline-light" | "text";

const base =
  "inline-flex items-center justify-center gap-3 font-label text-xs font-semibold uppercase tracking-[0.16em] transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary: "bg-amber text-ink hover:bg-ink hover:text-paper px-7 py-4",
  dark: "bg-ink text-paper hover:bg-paper hover:text-ink px-7 py-4",
  outline:
    "border border-ink text-ink hover:bg-ink hover:text-paper px-7 py-[15px]",
  "outline-light":
    "border border-paper/60 text-paper hover:bg-paper hover:text-ink px-7 py-[15px]",
  text: "text-ink underline-offset-8 decoration-amber decoration-2 hover:underline py-2",
};

function Arrow() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 10"
      className="h-2.5 w-4 transition-transform duration-200 group-hover:translate-x-1"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M0 5h14M10 1l4 4-4 4" />
    </svg>
  );
}

type ButtonLinkProps = {
  href: string;
  variant?: Variant;
  arrow?: boolean;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<typeof Link>, "href">;

export function ButtonLink({
  href,
  variant = "primary",
  arrow = true,
  className = "",
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={`group ${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
      {arrow && <Arrow />}
    </Link>
  );
}

type ButtonProps = {
  variant?: Variant;
  arrow?: boolean;
} & ComponentPropsWithoutRef<"button">;

export function Button({
  variant = "primary",
  arrow = false,
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`group ${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
      {arrow && <Arrow />}
    </button>
  );
}
