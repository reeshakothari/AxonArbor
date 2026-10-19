"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { mainNav, signInLink } from "@/content/site";
import { Container } from "./Container";
import { Logo } from "./Logo";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [openedAt, setOpenedAt] = useState(pathname);
  const menuId = useId();

  // Close the mobile menu after navigating.
  if (open && openedAt !== pathname) {
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const links = mainNav.filter((l) => l.href !== "/contact");
  const contact = mainNav.find((l) => l.href === "/contact");

  return (
    <header className="sticky top-0 z-50 border-b border-grey-200 bg-paper/95 backdrop-blur supports-[backdrop-filter]:bg-paper/85">
      <a
        href="#main"
        className="eyebrow sr-only bg-amber px-4 py-3 text-ink focus:not-sr-only focus:absolute focus:top-2 focus:left-2"
      >
        Skip to content
      </a>
      <Container className="flex h-16 items-center justify-between gap-6 lg:h-[72px]">
        <Logo />

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {links.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative py-2 text-sm transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:bg-amber after:transition-transform after:duration-300 ${
                      active
                        ? "text-ink after:scale-x-100"
                        : "text-grey-600 after:scale-x-0 hover:text-ink hover:after:scale-x-100"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden items-center gap-6 lg:flex">
          <Link
            href={signInLink.href}
            className="text-sm text-grey-600 transition-colors hover:text-ink"
          >
            {signInLink.label}
          </Link>
          {contact && (
            <Link
              href={contact.href}
              aria-current={isActive(pathname, contact.href) ? "page" : undefined}
              className="eyebrow bg-ink px-5 py-3 text-paper transition-colors hover:bg-amber hover:text-ink"
            >
              {contact.label}
            </Link>
          )}
        </div>

        <button
          type="button"
          className="-mr-2 flex h-11 w-11 items-center justify-center lg:hidden"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => {
            setOpenedAt(pathname);
            setOpen((v) => !v);
          }}
        >
          <span aria-hidden="true" className="relative block h-3 w-6">
            <span
              className={`absolute left-0 h-0.5 w-6 bg-ink transition-transform duration-300 ${
                open ? "top-1.5 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 h-0.5 w-6 bg-ink transition-transform duration-300 ${
                open ? "top-1.5 -rotate-45" : "top-3"
              }`}
            />
          </span>
        </button>
      </Container>

      <div
        id={menuId}
        hidden={!open}
        className="fixed inset-x-0 top-16 bottom-0 overflow-y-auto bg-paper lg:hidden"
      >
        <Container as="nav" aria-label="Mobile" className="flex flex-col pt-6 pb-10">
          <ul className="divide-y divide-grey-200 border-y border-grey-200">
            {mainNav.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between py-5 font-serif text-2xl"
                  >
                    {link.label}
                    {active && (
                      <span aria-hidden="true" className="h-2 w-2 bg-amber" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
          <Link
            href={signInLink.href}
            onClick={() => setOpen(false)}
            className="eyebrow mt-8 text-grey-600"
          >
            {signInLink.label}
          </Link>
        </Container>
      </div>
    </header>
  );
}
