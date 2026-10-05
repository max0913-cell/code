import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "outline" | "dark" | "outline-light";

const base =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-semibold transition-colors duration-200 motion-safe:active:scale-[0.98]";

const variants: Record<Variant, string> = {
  primary: "bg-goud text-antraciet shadow-sm hover:bg-tomaat hover:text-white",
  outline: "border-2 border-antraciet text-antraciet hover:border-tomaat hover:bg-tomaat hover:text-white",
  dark: "bg-antraciet text-creme hover:bg-tomaat hover:text-white",
  "outline-light": "border-2 border-creme/80 text-creme hover:border-goud hover:bg-goud hover:text-antraciet",
};

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
};

/** Link die eruitziet als knop. Externe links openen in een nieuw tabblad. */
export function ButtonLink({ href, children, variant = "primary", className = "" }: ButtonLinkProps) {
  const classes = `${base} ${variants[variant]} ${className}`;

  if (href.startsWith("http")) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {children}
        <span className="sr-only"> (opent in een nieuw tabblad)</span>
      </a>
    );
  }

  if (href.startsWith("tel:") || href.startsWith("mailto:")) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
