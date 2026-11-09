import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Float } from "./Float";
import { HeartIcon } from "./Icons";
import { cloudOne, cloudTwo, goldStar, heart, starOne, starThree } from "../lib/art";

type IntroProps = {
  // Called once the envelope has opened; the parent then removes the intro.
  onOpen: () => void;
};

// The seal pops, the flap folds back, the card rises, and then it stays up
// for a moment so guests can read it before the site is shown.
const OPEN_MS = 4200;

// The sealed envelope guests tap before seeing the invitation.
export function Intro({ onOpen }: IntroProps) {
  const reduceMotion = useReducedMotion();
  const [opening, setOpening] = useState(false);

  const open = () => {
    if (opening) return;
    setOpening(true);
    setTimeout(onOpen, reduceMotion ? 0 : OPEN_MS);
  };

  const ease = "easeInOut";

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#EAF4FC] via-[#D6E9F8] to-[#BFDDF3] px-4 text-navy"
      exit={{ opacity: 0, scale: 1.08 }}
      transition={{ duration: reduceMotion ? 0 : 1, ease }}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <Float src={cloudOne} motion="drift" className="-left-10 top-10 w-36 sm:w-52" />
        <Float src={cloudTwo} motion="drift" delay={2} className="-right-12 bottom-16 w-40 sm:w-56" />
        <Float src={goldStar} motion="twinkle" className="right-[14%] top-[14%] w-9 sm:w-11" />
        <Float src={starOne} motion="twinkle" delay={1} className="bottom-[22%] left-[12%] w-7" />
        <Float src={starThree} motion="twinkle" delay={2} className="left-[22%] top-[24%] w-6" />
      </div>

      <motion.h1
        className="relative font-script text-[clamp(3rem,12vw,5.5rem)] leading-tight text-navy"
        initial={reduceMotion ? false : { opacity: 0, y: -20 }}
        // Fades as the envelope opens, since the rising card covers it.
        animate={opening ? { opacity: 0, y: -10 } : { opacity: 1, y: 0 }}
        transition={{ duration: opening ? 0.6 : 0.8, ease: "easeOut" }}
      >
        You are invited
      </motion.h1>

      <motion.button
        type="button"
        onClick={open}
        aria-label="Open invitation"
        className="relative mt-6 w-[min(82vw,340px)] [perspective:900px] focus-visible:outline-none"
        initial={reduceMotion ? false : { opacity: 0, y: 30, scale: 0.9 }}
        animate={
          opening || reduceMotion
            ? { opacity: 1, y: 0, scale: 1, rotate: 0 }
            : { opacity: 1, y: 0, scale: 1, rotate: [0, -2, 2, -1.5, 1.5, 0] }
        }
        transition={
          opening || reduceMotion
            ? { duration: 0.3 }
            : {
                opacity: { duration: 0.8, delay: 0.2 },
                y: { duration: 0.8, delay: 0.2 },
                scale: { duration: 0.8, delay: 0.2 },
                rotate: { duration: 1.2, delay: 1.2, repeat: Infinity, repeatDelay: 1.6 },
              }
        }
      >
        <div className="relative aspect-[320/220] w-full">
          {/* Back of the envelope. */}
          <div className="absolute inset-0 rounded-[14px] bg-[#C5DCF2] shadow-glass" />

          {/* Flap: in front while sealed, folds back behind the card. */}
          <motion.svg
            viewBox="0 0 320 130"
            aria-hidden="true"
            className="absolute inset-x-0 top-0 w-full origin-top drop-shadow-[0_4px_4px_rgba(15,37,87,0.10)]"
            style={{ zIndex: 4 }}
            animate={opening ? { rotateX: 180, zIndex: 1 } : { rotateX: 0, zIndex: 4 }}
            transition={{
              rotateX: { duration: reduceMotion ? 0 : 1, delay: reduceMotion ? 0 : 0.4, ease },
              zIndex: { delay: reduceMotion ? 0 : 0.9 },
            }}
          >
            <path d="M0 14Q0 0 14 0H306Q320 0 320 14L160 130Z" fill="#B3D0EE" />
          </motion.svg>

          {/* The invitation card, which rises out once opened. */}
          <motion.div
            className="absolute inset-x-[7%] top-[6%] flex h-[88%] flex-col items-center justify-start rounded-2xl bg-white px-4 pt-[8%] text-center shadow-md"
            style={{
              zIndex: 2,
              // Soft polka dots.
              backgroundImage: "radial-gradient(#DCEAF8 1.3px, transparent 1.6px)",
              backgroundSize: "14px 14px",
            }}
            animate={opening ? { y: "-58%" } : { y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 1.4, delay: reduceMotion ? 0 : 1.2, ease }}
          >
            {/* Bear ears, so the card peeks out like a little bear. */}
            <span aria-hidden="true" className="absolute left-[10%] top-0 grid aspect-square w-[15%] -translate-y-[70%] place-items-center rounded-full bg-white">
              <span className="h-1/2 w-1/2 rounded-full bg-[#F2D3C0]" />
            </span>
            <span aria-hidden="true" className="absolute right-[10%] top-0 grid aspect-square w-[15%] -translate-y-[70%] place-items-center rounded-full bg-white">
              <span className="h-1/2 w-1/2 rounded-full bg-[#F2D3C0]" />
            </span>
            {/* Stitched border. */}
            <span aria-hidden="true" className="pointer-events-none absolute inset-[4%] rounded-xl border-2 border-dashed border-sky/25" />
            <img src={goldStar} alt="" aria-hidden="true" className="absolute left-[8%] top-[8%] w-[9%] -rotate-12" />
            <img src={heart} alt="" aria-hidden="true" className="absolute right-[8%] top-[9%] w-[8%] rotate-12" />

            <span className="relative text-[0.6rem] font-semibold uppercase tracking-widest text-mist">
              The christening of
            </span>
            <span className="relative mt-1 font-script text-[clamp(1.5rem,6.5vw,2.2rem)] leading-[1.05] text-navy">
              Tobias Noah
              <span className="block">U. Cafe</span>
            </span>
            <span aria-hidden="true" className="relative mt-2 flex items-center gap-2 text-sky">
              <span className="h-px w-8 bg-sky/40" />
              <HeartIcon className="h-3 w-3" />
              <span className="h-px w-8 bg-sky/40" />
            </span>
          </motion.div>

          {/* Front pocket. */}
          <svg
            viewBox="0 0 320 220"
            aria-hidden="true"
            className="absolute inset-0 h-full w-full overflow-hidden rounded-[14px]"
            style={{ zIndex: 3 }}
          >
            <path d="M0 0L170 125L0 220Z" fill="#D3E5F7" />
            <path d="M320 0L150 125L320 220Z" fill="#D3E5F7" />
            <path d="M0 220L160 108L320 220Z" fill="#E2EEFA" />
          </svg>

          {/* Heart seal. */}
          <motion.img
            src={heart}
            alt=""
            className="absolute left-1/2 top-[59%] w-[16%] drop-shadow-md"
            style={{ zIndex: 5, x: "-50%", y: "-50%" }}
            animate={
              opening
                ? { opacity: 0, scale: 1.6 }
                : reduceMotion
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 1, scale: [1, 1.12, 1] }
            }
            transition={
              opening
                ? { duration: reduceMotion ? 0 : 0.5 }
                : { duration: 1.4, repeat: Infinity, ease }
            }
          />
        </div>
      </motion.button>

      <motion.button
        type="button"
        onClick={open}
        className="btn-primary relative mt-10"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={
          opening
            ? { opacity: 0 }
            : reduceMotion
              ? { opacity: 1 }
              : { opacity: 1, scale: [1, 1.06, 1] }
        }
        transition={
          opening
            ? { duration: 0.2 }
            : {
                opacity: { duration: 0.6, delay: 0.8 },
                scale: { duration: 1.8, repeat: Infinity, ease },
              }
        }
      >
        Tap to open invitation
      </motion.button>
    </motion.div>
  );
}
