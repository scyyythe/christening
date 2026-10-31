import { useEffect, useState } from "react";
import { cn } from "../lib/utils";

const links = [
  { href: "#home", label: "Home" },
  { href: "#details", label: "Details" },
  { href: "#godparents", label: "Ninongs & Ninangs" },
  { href: "#photos", label: "Photos" },
];

// Desktop only: phones and tablets get no header at all.
export function Nav() {
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

  return (
    <header className="sticky top-0 z-50 hidden border-b border-white/70 bg-white/60 backdrop-blur-md lg:block">
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-8"
      >
        <a href="#home" className="font-script text-3xl leading-none text-navy">
          Thobias Noah
        </a>

        <ul className="flex items-center gap-1">
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
      </nav>
    </header>
  );
}
