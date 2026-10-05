import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  /** Gebruik "h1" voor de paginatitel, standaard "h2" */
  as?: "h1" | "h2";
  id?: string;
  /** "gold" = op een goudgele achtergrond (dan geen rode tekst: te weinig contrast) */
  tone?: "light" | "dark" | "gold";
};

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  as: Tag = "h2",
  id,
  tone = "light",
}: SectionHeadingProps) {
  const isDark = tone === "dark";

  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && (
        <p
          className={`mb-3 text-sm font-bold uppercase tracking-[0.18em] ${
            isDark ? "text-goud" : tone === "gold" ? "text-antraciet" : "text-tomaat-donker"
          }`}
        >
          {eyebrow}
        </p>
      )}
      <Tag
        id={id}
        className={`font-heading font-extrabold leading-[1.05] tracking-tight ${
          Tag === "h1" ? "text-4xl sm:text-5xl lg:text-6xl" : "text-3xl sm:text-4xl lg:text-5xl"
        } ${isDark ? "text-creme" : "text-antraciet"}`}
      >
        {title}
      </Tag>
      {intro && (
        <p className={`mt-4 text-lg leading-relaxed ${
            isDark ? "text-creme/85" : tone === "gold" ? "text-antraciet" : "text-antraciet-zacht"
          }`}>
          {intro}
        </p>
      )}
    </div>
  );
}
