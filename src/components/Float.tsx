import { motion, useReducedMotion, type TargetAndTransition } from "framer-motion";
import { cn } from "../lib/utils";

type Motion = "drift" | "twinkle" | "bob" | "none";

type FloatProps = {
  src: string;
  // Position and size per breakpoint, e.g. "left-2 top-10 w-20 md:w-32".
  className?: string;
  motion?: Motion;
  // Offsets the loop so neighbours don't move in lockstep.
  delay?: number;
};

const loops: Record<Exclude<Motion, "none">, TargetAndTransition> = {
  drift: {
    x: [-10, 12, -10],
    transition: { duration: 18, repeat: Infinity, ease: "easeInOut" },
  },
  twinkle: {
    opacity: [0.65, 1, 0.65],
    scale: [0.9, 1.1, 0.9],
    transition: { duration: 3.2, repeat: Infinity, ease: "easeInOut" },
  },
  bob: {
    y: [0, -10, 0],
    transition: { duration: 5, repeat: Infinity, ease: "easeInOut" },
  },
};

// Purely decorative artwork, absolutely positioned inside a Section.
export function Float({ src, className, motion: kind = "none", delay = 0 }: FloatProps) {
  const reduceMotion = useReducedMotion();
  const loop = kind === "none" || reduceMotion ? undefined : loops[kind];

  return (
    <motion.img
      src={src}
      alt=""
      aria-hidden="true"
      loading="lazy"
      decoding="async"
      draggable={false}
      className={cn(
        "pointer-events-none absolute h-auto select-none object-contain",
        className,
      )}
      animate={
        loop
          ? {
              ...loop,
              transition: {
                ...(loop.transition as object),
                delay,
              },
            }
          : undefined
      }
    />
  );
}
