import { useEffect, useState, type MouseEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CloseIcon, MenuIcon } from "./Icons";
import { cn } from "../lib/utils";

const links = [
  { href: "#home", label: "Home" },
  { href: "#details", label: "Details" },
  { href: "#godparents", label: "Ninongs & Ninangs" },
  { href: "#photos", label: "Photos" },
];

// Matches the menu's collapse animation below.
const MENU_ANIMATION_MS = 250;

export function Nav() {
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#home");

  // Highlight the link for whichever section fills the middle of the screen.
  useEffect(() => {
    const sections = links
      .map((l) => document.querySelector<HTMLElement>(l.href))
      .filter((el): el is HTMLElement => Boolean(el));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // The collapsing menu shifts the layout, which cancels a smooth scroll that
  // starts at the same time. Close it first, then scroll once it's gone.
  const handleMobileLink = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setOpen(false);
    setTimeout(() => {
      document
        .querySelector(href)
        ?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
      history.replaceState(null, "", href);
    }, MENU_ANIMATION_MS);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/70 bg-white/60 backdrop-blur-md">
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        <a
          href="#home"
          className="font-script text-3xl leading-none text-navy"
          onClick={() => setOpen(false)}
        >
          Thobias Noah
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                aria-current={active === link.href ? "true" : undefined}
                className={cn(
                  "rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-widest transition",
                  active === link.href
                    ? "bg-sky text-white shadow"
                    : "text-mist hover:bg-white/70 hover:text-navy",
                )}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-full text-navy transition hover:bg-white/70 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.ul
            id="mobile-menu"
            className="overflow-hidden border-t border-white/70 px-4 md:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => handleMobileLink(e, link.href)}
                  className={cn(
                    "block py-3 text-sm font-semibold uppercase tracking-widest",
                    active === link.href ? "text-sky" : "text-mist",
                  )}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  );
}
