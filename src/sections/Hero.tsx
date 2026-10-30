import { motion, useReducedMotion } from "framer-motion";
import { Float } from "../components/Float";
import { ChevronIcon } from "../components/Icons";
import { Reveal } from "../components/Reveal";
import { Section } from "../components/Section";
import {
  bearPlane,
  cloudOne,
  cloudTwo,
  goldStar,
  hotAirBalloon,
  starOne,
  starSix,
  starThree,
} from "../lib/art";

function Decorations() {
  const reduceMotion = useReducedMotion();

  return (
    <>
      <Float src={cloudOne} motion="drift" className="-left-10 top-2 w-28 sm:w-40 lg:w-56" />
      <Float src={cloudTwo} motion="drift" delay={3} className="-right-12 bottom-6 w-32 sm:w-44 lg:w-60" />
      <Float src={goldStar} motion="twinkle" className="right-4 top-4 w-10 sm:right-10 sm:w-14 lg:w-16" />
      <Float src={starOne} motion="twinkle" delay={1} className="bottom-20 left-5 w-6 sm:w-8" />
      <Float src={starThree} motion="twinkle" delay={2} className="right-1/3 top-8 hidden w-6 md:block" />
      <Float src={starSix} motion="twinkle" delay={0.5} className="bottom-10 left-1/3 hidden w-7 md:block" />
      <Float src={hotAirBalloon} motion="drift" delay={6} className="-left-16 bottom-4 hidden w-56 lg:block xl:w-72" />
      {!reduceMotion && (
        // A little bear plane crossing the sky on wide screens.
        <motion.img
          src={bearPlane}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute top-6 hidden w-24 select-none lg:block"
          initial={{ x: "-20vw" }}
          animate={{ x: "115vw", y: [0, -14, 0, 10, 0] }}
          transition={{
            x: { duration: 34, repeat: Infinity, ease: "linear", repeatDelay: 6 },
            y: { duration: 8, repeat: Infinity, ease: "easeInOut" },
          }}
        />
      )}
    </>
  );
}

export function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <Section
      id="home"
      label="Welcome"
      decorations={<Decorations />}
      className="min-h-[calc(100svh-4rem)] md:min-h-[calc(100svh-4rem)]"
    >
      <div className="grid items-center gap-6 md:grid-cols-2 md:gap-10">
        <Reveal className="mx-auto w-[min(78%,300px)] md:w-full md:max-w-md">
          <motion.img
            src={bearPlane}
            alt="A little bear flying an airplane through the clouds"
            className="w-full drop-shadow-[0_18px_18px_rgba(15,37,87,0.10)]"
            animate={reduceMotion ? undefined : { y: [0, -12, 0], rotate: [0, -1.5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
        </Reveal>

        <div className="relative text-center md:text-left">
          {/* Soft glow so the type floats on light, not on the gradient. */}
          <div
            aria-hidden="true"
            className="absolute -inset-x-6 -inset-y-10 -z-10 rounded-full bg-white/40 blur-3xl"
          />
          <Reveal delay={0.15}>
            <p className="text-xs font-semibold uppercase tracking-widest text-mist">
              The christening of Thobias Noah
            </p>
          </Reveal>
          <Reveal delay={0.35}>
            <h1 className="mt-3 font-display text-[clamp(3rem,7vw,6rem)] font-bold uppercase leading-none tracking-[0.12em] text-navy">
              A little blessing
            </h1>
          </Reveal>
          <Reveal delay={0.6}>
            <p className="font-script text-[clamp(2.8rem,6.5vw,5.5rem)] leading-tight text-sky">
              is on the way
            </p>
          </Reveal>
        </div>
      </div>

      <a
        href="#name"
        className="absolute -bottom-12 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-[0.6rem] font-semibold uppercase tracking-widest text-mist sm:flex lg:-bottom-16"
      >
        Scroll
        <ChevronIcon className="h-5 w-5 rotate-90 animate-bounce text-sky" />
      </a>
    </Section>
  );
}
