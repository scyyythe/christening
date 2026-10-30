import type { CSSProperties, ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "../lib/utils";

type RevealProps = {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  delay?: number;
  // Use "span" inside buttons and other phrasing-only content.
  as?: "div" | "span";
};

// Fades and slides its content up the first time it scrolls into view.
export function Reveal({
  children,
  className,
  style,
  delay = 0,
  as = "div",
}: RevealProps) {
  const reduceMotion = useReducedMotion();
  const Component = as === "span" ? motion.span : motion.div;

  return (
    <Component
      className={cn(as === "span" && "block", className)}
      style={style}
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: reduceMotion ? 0 : 0.75, delay, ease: "easeOut" }}
    >
      {children}
    </Component>
  );
}
