import { motion, useReducedMotion } from "framer-motion";
import { cn } from "../lib/utils";

const fur = "#D9B48F";

// A little bear peeking over an edge, paws resting on it. It bobs and blinks.
export function PeekingBear({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.svg
      viewBox="0 0 140 96"
      aria-hidden="true"
      className={cn("drop-shadow-[0_8px_10px_rgba(15,37,87,0.10)]", className)}
      animate={reduceMotion ? undefined : { y: [6, 0, 6] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      <circle cx="36" cy="24" r="17" fill={fur} />
      <circle cx="36" cy="24" r="8.5" fill="#F2D3C0" />
      <circle cx="104" cy="24" r="17" fill={fur} />
      <circle cx="104" cy="24" r="8.5" fill="#F2D3C0" />
      <ellipse cx="70" cy="62" rx="47" ry="40" fill={fur} />
      <motion.g
        style={{ originY: 0.5 }}
        animate={reduceMotion ? undefined : { scaleY: [1, 1, 0.1, 1] }}
        transition={{ duration: 4, times: [0, 0.9, 0.95, 1], repeat: Infinity }}
      >
        <circle cx="53" cy="56" r="4.8" fill="#0F2557" />
        <circle cx="87" cy="56" r="4.8" fill="#0F2557" />
        <circle cx="54.6" cy="54.4" r="1.5" fill="#fff" />
        <circle cx="88.6" cy="54.4" r="1.5" fill="#fff" />
      </motion.g>
      <ellipse cx="42" cy="70" rx="7.5" ry="4.5" fill="#F4A9A9" opacity="0.6" />
      <ellipse cx="98" cy="70" rx="7.5" ry="4.5" fill="#F4A9A9" opacity="0.6" />
      <ellipse cx="70" cy="73" rx="14" ry="10.5" fill="#F6E6D6" />
      <ellipse cx="70" cy="68" rx="5.5" ry="3.8" fill="#0F2557" />
      <path d="M65 75q5 5 10 0" fill="none" stroke="#0F2557" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="32" cy="90" rx="15" ry="9" fill={fur} />
      <ellipse cx="108" cy="90" rx="15" ry="9" fill={fur} />
      <path d="M26 86v6M32 85v7M38 86v6M102 86v6M108 85v7M114 86v6" stroke="#B98F69" strokeWidth="1.6" strokeLinecap="round" />
    </motion.svg>
  );
}

export function Paw({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <ellipse cx="12" cy="16" rx="5.5" ry="4.5" />
      <circle cx="5.5" cy="10" r="2.3" />
      <circle cx="9.5" cy="6.5" r="2.3" />
      <circle cx="14.5" cy="6.5" r="2.3" />
      <circle cx="18.5" cy="10" r="2.3" />
    </svg>
  );
}

// Two soft bear ears for the top of a card. The card's parent must be
// `relative`, and these go before the card so it overlaps their bottoms.
export function BearEars() {
  const ear = "absolute -top-8 grid h-12 w-12 place-items-center rounded-full border border-white/70 bg-white/60";
  return (
    <>
      <span aria-hidden="true" className={cn(ear, "left-[10%]")}>
        <span className="h-5 w-5 rounded-full bg-[#F2D3C0]/80" />
      </span>
      <span aria-hidden="true" className={cn(ear, "right-[10%]")}>
        <span className="h-5 w-5 rounded-full bg-[#F2D3C0]/80" />
      </span>
    </>
  );
}
