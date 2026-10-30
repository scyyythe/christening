import { useId } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "../lib/utils";

type SunProps = {
  className?: string;
  // Offsets the animation so neighbouring suns don't move in lockstep.
  delay?: number;
};

const RAY_COUNT = 12;

export function Sun({ className, delay = 0 }: SunProps) {
  const reduceMotion = useReducedMotion();
  const glowId = useId();

  return (
    <motion.svg
      viewBox="0 0 100 100"
      className={cn("sun", className)}
      aria-hidden="true"
      animate={reduceMotion ? undefined : { scale: [1, 1.06, 1] }}
      transition={
        reduceMotion
          ? undefined
          : { duration: 4, delay, repeat: Infinity, ease: "easeInOut" }
      }
    >
      <motion.g
        style={{ originX: "50px", originY: "50px" }}
        animate={reduceMotion ? undefined : { rotate: 360 }}
        transition={
          reduceMotion
            ? undefined
            : { duration: 40, delay, repeat: Infinity, ease: "linear" }
        }
      >
        {Array.from({ length: RAY_COUNT }, (_, i) => (
          <rect
            key={i}
            x="47.5"
            y="4"
            width="5"
            height="14"
            rx="2.5"
            fill="#E8B04B"
            opacity="0.85"
            transform={`rotate(${(360 / RAY_COUNT) * i} 50 50)`}
          />
        ))}
      </motion.g>
      <circle cx="50" cy="50" r="26" fill="#F3C568" />
      <circle cx="50" cy="50" r="26" fill={`url(#${glowId})`} />
      <defs>
        <radialGradient id={glowId} cx="0.4" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#FFF4C9" stopOpacity="0.9" />
          <stop offset="1" stopColor="#E8B04B" stopOpacity="0" />
        </radialGradient>
      </defs>
    </motion.svg>
  );
}
