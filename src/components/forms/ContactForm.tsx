"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  contactFields,
  normaliseContact,
  validateContact,
  type ContactErrors,
  type ContactFieldName,
} from "@/lib/contact-validation";

type Status = "idle" | "submitting" | "success" | "error";

type Props = {
  submitLabel: string;
  successHeading: string;
  successBody: string;
};

export function ContactForm({ submitLabel, successHeading, successBody }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [touched, setTouched] = useState<Partial<Record<ContactFieldName, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");

  function readForm() {
    return normaliseContact(Object.fromEntries(new FormData(formRef.current!)));
  }

  function validateField(name: ContactFieldName) {
    const fieldError = validateContact(readForm())[name];
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = readForm();
    const nextErrors = validateContact(data);
    setErrors(nextErrors);
    setTouched(Object.fromEntries(contactFields.map((f) => [f.name, true])));

    const firstInvalid = contactFields.find((f) => nextErrors[f.name]);
    if (firstInvalid) {
      form.querySelector<HTMLElement>(`[name="${firstInvalid.name}"]`)?.focus();
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, website: new FormData(form).get("website") }),
      });
      const json = (await res.json()) as { ok: boolean; errors?: ContactErrors };
      if (!res.ok || !json.ok) {
        if (json.errors) setErrors(json.errors);
        setStatus("error");
        return;
      }
      form.reset();
      setStatus("success");
      requestAnimationFrame(() => successRef.current?.focus());
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="border-t-2 border-amber bg-grey-50 p-8 outline-none sm:p-12"
      >
        <h2 className="font-serif text-3xl tracking-tight">{successHeading}</h2>
        <p className="mt-4 leading-relaxed text-grey-600">{successBody}</p>
        <Button variant="outline" className="mt-8" onClick={() => setStatus("idle")}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} aria-describedby="form-note">
      <p id="form-note" className="mb-8 text-sm text-grey-600">
        Fields marked <span aria-hidden="true">*</span>
        <span className="sr-only">with an asterisk</span> are required.
      </p>

      {/* Honeypot for bots; hidden from people and assistive technology. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
        {contactFields.map((field) => {
          const id = `contact-${field.name}`;
          const error = touched[field.name] ? errors[field.name] : undefined;
          const describedBy = error ? `${id}-error` : undefined;
          const control =
            "mt-2 block w-full rounded-none border-0 border-b bg-transparent px-0 py-3 text-base text-ink placeholder:text-grey-400 focus:border-ink focus:ring-0 focus:outline-none focus-visible:border-b-2 " +
            (error ? "border-ink border-b-2" : "border-grey-300");
          const common = {
            id,
            name: field.name,
            required: field.required,
            maxLength: field.max,
            autoComplete: field.autoComplete,
            "aria-invalid": error ? true : undefined,
            "aria-describedby": describedBy,
            onBlur: () => {
              setTouched((t) => ({ ...t, [field.name]: true }));
              validateField(field.name);
            },
            onChange: () => {
              if (touched[field.name]) validateField(field.name);
            },
            className: control,
          };
          return (
            <div key={field.name} className={field.type === "textarea" ? "sm:col-span-2" : undefined}>
              <label htmlFor={id} className="eyebrow text-grey-700">
                {field.label}
                {field.required && <span aria-hidden="true"> *</span>}
              </label>
              {field.type === "textarea" ? (
                <textarea rows={5} {...common} className={`${control} resize-y`} />
              ) : (
                <input type={field.type} inputMode={field.type === "tel" ? "tel" : undefined} {...common} />
              )}
              {error && (
                <p id={`${id}-error`} className="mt-2 flex items-start gap-2 text-sm text-ink">
                  <span aria-hidden="true" className="mt-1.5 size-1.5 shrink-0 bg-amber" />
                  {error}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-6">
        <Button type="submit" arrow disabled={status === "submitting"}>
          {status === "submitting" ? "Sending…" : submitLabel}
        </Button>
        <p role="alert" className="text-sm text-ink">
          {status === "error" && "Sorry, something went wrong. Please try again, or email us directly."}
        </p>
      </div>
    </form>
  );
}
