import type { ReactNode } from "react";

type EyebrowProps = {
  children: ReactNode;
  tone?: "light" | "dark";
  className?: string;
};

/** Small-caps Montserrat label with a short amber rule. */
export function Eyebrow({ children, tone = "light", className = "" }: EyebrowProps) {
  return (
    <p
      className={`eyebrow flex items-center gap-3 ${
        tone === "dark" ? "text-grey-300" : "text-grey-600"
      } ${className}`}
    >
      <span aria-hidden="true" className="h-0.5 w-6 bg-amber" />
      {children}
    </p>
  );
}
