"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { CircleAlert, CircleCheck, Loader2, Send } from "lucide-react";
import { siteConfig } from "@/config/site";

type Field = "naam" | "email" | "telefoon" | "bericht";
type Errors = Partial<Record<Field, string>>;
type Status = "idle" | "sending" | "success" | "mailto" | "error";

const formspreeUrl = siteConfig.formspreeId
  ? `https://formspree.io/f/${siteConfig.formspreeId}`
  : null;

const fieldOrder: Field[] = ["naam", "email", "telefoon", "bericht"];

function validate(data: FormData): Errors {
  const errors: Errors = {};
  const naam = String(data.get("naam") ?? "").trim();
  const email = String(data.get("email") ?? "").trim();
  const telefoon = String(data.get("telefoon") ?? "").trim();
  const bericht = String(data.get("bericht") ?? "").trim();

  if (!naam) errors.naam = "Vul je naam in.";
  if (!email) errors.email = "Vul je e-mailadres in.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = "Dit lijkt geen geldig e-mailadres. Bijvoorbeeld: naam@voorbeeld.nl";
  if (telefoon && !/^[+()\d\s-]{8,}$/.test(telefoon))
    errors.telefoon = "Vul een geldig telefoonnummer in, of laat dit veld leeg.";
  if (bericht.length < 10) errors.bericht = "Je bericht is wat kort. Vertel ons iets meer?";

  return errors;
}

function buildMailto(data: FormData): string {
  const naam = String(data.get("naam") ?? "").trim();
  const body = [
    String(data.get("bericht") ?? "").trim(),
    "",
    "---",
    `Naam: ${naam}`,
    `E-mail: ${String(data.get("email") ?? "").trim()}`,
    `Telefoon: ${String(data.get("telefoon") ?? "").trim() || "-"}`,
  ].join("\n");

  return `mailto:${siteConfig.email}?subject=${encodeURIComponent(
    `Bericht via de website van ${naam}`,
  )}&body=${encodeURIComponent(body)}`;
}

export function ContactForm() {
  const successRef = useRef<HTMLHeadingElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [mailtoHref, setMailtoHref] = useState(`mailto:${siteConfig.email}`);

  // Na verzenden de focus op de bevestiging zetten, zodat screenreaders die voorlezen
  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const found = validate(data);
    setErrors(found);
    const firstInvalid = fieldOrder.find((field) => found[field]);
    if (firstInvalid) {
      form.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    // Honeypot: echte bezoekers vullen dit verborgen veld nooit in
    if (data.get("_gotcha")) {
      setStatus("success");
      return;
    }

    const mailto = buildMailto(data);
    setMailtoHref(mailto);

    if (!formspreeUrl) {
      setStatus("mailto");
      window.location.href = mailto;
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch(formspreeUrl, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error(`Formspree antwoordde met ${response.status}`);
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  const inputClass = (field: Field) =>
    `mt-2 block w-full rounded-2xl border-2 bg-white px-4 py-3 text-base text-antraciet transition-colors focus:border-antraciet ${
      errors[field] ? "border-tomaat" : "border-antraciet/20 hover:border-antraciet/40"
    }`;

  const describedBy = (field: Field, hint?: string) =>
    [hint, errors[field] ? `${field}-fout` : null].filter(Boolean).join(" ") || undefined;

  const fieldError = (field: Field) =>
    errors[field] ? (
      <p id={`${field}-fout`} className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-tomaat-donker">
        <CircleAlert className="h-4 w-4 shrink-0" aria-hidden="true" />
        {errors[field]}
      </p>
    ) : null;

  if (status === "success") {
    return (
      <div className="rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-antraciet/5 sm:p-12">
        <span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-goud">
          <CircleCheck className="h-8 w-8" aria-hidden="true" />
        </span>
        <h2 ref={successRef} tabIndex={-1} className="font-heading text-3xl font-extrabold focus:outline-none">
          Bedankt voor je bericht!
        </h2>
        <p className="mt-2 text-lg text-antraciet-zacht">
          We lezen alles zelf en reageren meestal binnen één werkdag.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 font-semibold underline decoration-goud decoration-2 underline-offset-4 hover:text-tomaat"
        >
          Nog een bericht sturen
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      // Zonder JavaScript werkt het formulier ook: via Formspree of via de e-mailapp
      action={formspreeUrl ?? `mailto:${siteConfig.email}`}
      method="POST"
      encType={formspreeUrl ? undefined : "text/plain"}
      className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-antraciet/5 sm:p-10"
      aria-labelledby="formulier-titel"
    >
      <h2 id="formulier-titel" className="font-heading text-2xl font-extrabold sm:text-3xl">
        Stuur ons een bericht
      </h2>
      <p className="mt-1 text-antraciet-zacht">
        Velden met <span aria-hidden="true">*</span>
        <span className="sr-only">een sterretje</span> zijn verplicht.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="naam" className="font-semibold">
            Naam <span aria-hidden="true" className="text-tomaat-donker">*</span>
          </label>
          <input
            id="naam"
            name="naam"
            type="text"
            autoComplete="name"
            required
            aria-required="true"
            aria-invalid={errors.naam ? true : undefined}
            aria-describedby={describedBy("naam")}
            className={inputClass("naam")}
          />
          {fieldError("naam")}
        </div>

        <div>
          <label htmlFor="email" className="font-semibold">
            E-mailadres <span aria-hidden="true" className="text-tomaat-donker">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            aria-required="true"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={describedBy("email")}
            className={inputClass("email")}
          />
          {fieldError("email")}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="telefoon" className="font-semibold">
            Telefoonnummer <span className="font-normal text-antraciet-zacht">(optioneel)</span>
          </label>
          <input
            id="telefoon"
            name="telefoon"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            aria-invalid={errors.telefoon ? true : undefined}
            aria-describedby={describedBy("telefoon", "telefoon-hint")}
            className={inputClass("telefoon")}
          />
          <p id="telefoon-hint" className="mt-2 text-sm text-antraciet-zacht">
            Handig als je liever teruggebeld wordt.
          </p>
          {fieldError("telefoon")}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="bericht" className="font-semibold">
            Bericht <span aria-hidden="true" className="text-tomaat-donker">*</span>
          </label>
          <textarea
            id="bericht"
            name="bericht"
            rows={5}
            required
            aria-required="true"
            aria-invalid={errors.bericht ? true : undefined}
            aria-describedby={describedBy("bericht")}
            className={`${inputClass("bericht")} resize-y`}
          />
          {fieldError("bericht")}
        </div>

        {/* Honeypot tegen spam, onzichtbaar voor bezoekers en screenreaders */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="_gotcha">Laat dit veld leeg</label>
          <input id="_gotcha" name="_gotcha" type="text" tabIndex={-1} autoComplete="off" />
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-goud px-7 py-3 text-base font-semibold text-antraciet shadow-sm transition-colors hover:bg-tomaat hover:text-white disabled:cursor-wait disabled:opacity-70"
        >
          {status === "sending" ? (
            <Loader2 className="h-5 w-5 motion-safe:animate-spin" aria-hidden="true" />
          ) : (
            <Send className="h-5 w-5" aria-hidden="true" />
          )}
          {status === "sending" ? "Versturen…" : "Verstuur bericht"}
        </button>
        <p className="text-sm text-antraciet-zacht">
          Liever direct mailen?{" "}
          <a
            href={`mailto:${siteConfig.email}`}
            className="font-semibold text-antraciet underline decoration-goud decoration-2 underline-offset-4 hover:text-tomaat"
          >
            {siteConfig.email}
          </a>
        </p>
      </div>

      <div aria-live="polite">
        {status === "mailto" && (
          <p className="mt-6 rounded-2xl bg-creme p-4 text-antraciet">
            Je e-mailprogramma wordt geopend met je bericht erin. Gebeurt er niets?{" "}
            <a href={mailtoHref} className="font-semibold underline decoration-goud decoration-2 underline-offset-4">
              Open je e-mail opnieuw
            </a>{" "}
            of mail ons op {siteConfig.email}.
          </p>
        )}
        {status === "error" && (
          <p className="mt-6 rounded-2xl bg-tomaat/10 p-4 text-antraciet">
            <strong className="text-tomaat-donker">Oeps, versturen lukte niet.</strong> Geen zorgen, je kunt je
            bericht ook{" "}
            <a href={mailtoHref} className="font-semibold underline decoration-tomaat decoration-2 underline-offset-4">
              via je e-mailprogramma versturen
            </a>{" "}
            of ons bellen op {siteConfig.phone.display}.
          </p>
        )}
      </div>
    </form>
  );
}
