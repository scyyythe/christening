import { useEffect, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CloseIcon } from "./Icons";
import { cn } from "../lib/utils";

type SheetProps = {
  label: string;
  onClose: () => void;
  children: ReactNode;
  className?: string;
};

// Bottom sheet on phones, centered modal from `sm` up. Render it inside
// <AnimatePresence> so it can animate out.
export function Sheet({ label, onClose, children, className }: SheetProps) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div
        className="absolute inset-0 bg-navy/25 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={label}
        className={cn(
          "relative max-h-[92svh] w-full overflow-y-auto overscroll-contain rounded-t-3xl border border-white/70 bg-cloud/95 p-5 shadow-glass backdrop-blur-md sm:max-h-[90svh] sm:max-w-2xl sm:rounded-3xl sm:p-8",
          className,
        )}
        initial={reduceMotion ? { opacity: 0 } : { y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={reduceMotion ? { opacity: 0 } : { y: 60, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Grab handle, a phone bottom-sheet cue. */}
        <div
          aria-hidden="true"
          className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-mist/30 sm:hidden"
        />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-white/70 bg-white/70 text-navy shadow-sm transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky"
        >
          <CloseIcon className="h-5 w-5" />
        </button>
        {children}
      </motion.div>
    </motion.div>
  );
}
