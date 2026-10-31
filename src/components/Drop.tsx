import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

type DropProps = {
  // Size and position of the artwork, e.g. "mx-auto w-[min(58%,220px)]".
  className?: string;
  children: ReactNode;
  // Where the drop starts: a distance in pixels above the resting spot, or
  // "section" for the top edge of the enclosing section.
  from?: number | "section";
  // Soft shadow under the artwork that grows as it lands.
  shadow?: boolean;
};

// Artwork that starts small and faint, then floats down as it scrolls into
// view, growing to full size and swaying a little before it settles.
// Scrolling back up lifts it again.
export function Drop({ className, children, from = "section", shadow = false }: DropProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 20 });

  // Measured for "section", since the layout changes with the screen.
  const [fallFrom, setFallFrom] = useState(typeof from === "number" ? -from : -80);
  useLayoutEffect(() => {
    if (typeof from === "number") {
      setFallFrom(-from);
      return;
    }
    const measure = () => {
      const el = ref.current;
      const section = el?.closest("section");
      if (!el || !section) return;
      const gap = el.getBoundingClientRect().top - section.getBoundingClientRect().top;
      setFallFrom(-Math.max(0, gap));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [from]);

  // Scaled from the top, so the artwork hangs from its balloons as it grows.
  const y = useTransform(progress, (p) => (1 - p) * fallFrom);
  const rotate = useTransform(progress, [0, 0.45, 0.8, 1], [-10, 7, -3, 0]);
  const scale = useTransform(progress, [0, 1], [0.35, 1]);
  const opacity = useTransform(progress, [0, 0.3], [0, 1]);
  const shadowScale = useTransform(progress, [0.5, 1], [0.3, 1]);
  const shadowOpacity = useTransform(progress, [0.5, 1], [0, 0.18]);

  return (
    <div ref={ref} className={className}>
      <motion.div
        style={reduceMotion ? undefined : { y, rotate, scale, opacity, originY: 0 }}
        className="relative z-10"
      >
        {children}
      </motion.div>
      {shadow && (
        <motion.div
          aria-hidden="true"
          className="mx-auto -mt-2 h-3 w-1/2 rounded-[50%] bg-navy blur-[3px]"
          style={
            reduceMotion
              ? { opacity: 0.18 }
              : { scaleX: shadowScale, opacity: shadowOpacity }
          }
        />
      )}
    </div>
  );
}
