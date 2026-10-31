import type { ReactNode } from "react";
import { cn } from "../lib/utils";

type Tint = "none" | "light" | "deep";

type SectionProps = {
  id: string;
  label: string;
  tint?: Tint;
  // Absolutely positioned <Float> artwork, layered behind the content.
  decorations?: ReactNode;
  className?: string;
  containerClassName?: string;
  children: ReactNode;
};

const tintFill: Record<Exclude<Tint, "none">, string> = {
  light: "rgb(255 255 255 / 0.38)",
  deep: "rgb(150 196 235 / 0.22)",
};

// Soft cloud-like edge; drawn above (flipped below) tinted sections so the
// tint melts into its untinted neighbours without a hard line.
function Wave({ fill, flip }: { fill: string; flip?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
      className={cn(
        "pointer-events-none absolute left-0 h-10 w-full sm:h-14 lg:h-20",
        flip ? "top-full rotate-180" : "bottom-full",
      )}
    >
      <path
        fill={fill}
        d="M0 80V52c60-14 120-30 200-30 96 0 132 34 230 34 92 0 128-40 230-40 96 0 140 36 236 36 92 0 136-30 220-30 94 0 150 30 224 30 40 0 70-6 100-12v80Z"
      />
    </svg>
  );
}

export function Section({
  id,
  label,
  tint = "none",
  decorations,
  className,
  containerClassName,
  children,
}: SectionProps) {
  const fill = tint === "none" ? null : tintFill[tint];

  return (
    <section
      id={id}
      aria-label={label}
      className={cn(
        // overflow-x-clip trims side decorations without clipping the waves.
        "relative flex min-h-[100svh] lg:scroll-mt-16 items-center overflow-x-clip py-20 md:min-h-0 lg:py-28",
        className,
      )}
    >
      {fill && (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ background: fill }}
          />
          <Wave fill={fill} />
          <Wave fill={fill} flip />
        </>
      )}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {decorations}
      </div>
      <div
        className={cn(
          "relative z-10 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8",
          containerClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
}
