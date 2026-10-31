import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Paw, PeekingBear } from "../components/Bear";
import { Float } from "../components/Float";
import { Reveal } from "../components/Reveal";
import { Section } from "../components/Section";
import { getEventStart } from "../lib/calendar";
import {
  balloonsBlue,
  balloonsTrio,
  cloudOne,
  cloudTwo,
  giftBoxes,
  goldStar,
  heart,
  starOne,
  starSix,
  starThree,
} from "../lib/art";

function Decorations() {
  return (
    <>
      <Float src={balloonsTrio} motion="bob" className="-left-4 top-6 w-16 sm:left-4 sm:w-24 lg:left-[6%] lg:top-[14%] lg:w-36" />
      <Float src={balloonsBlue} motion="bob" delay={1.5} className="-right-3 bottom-8 w-16 sm:right-4 sm:w-24 lg:right-[6%] lg:top-[12%] lg:bottom-auto lg:w-36" />
      <Float src={giftBoxes} motion="bob" delay={0.8} className="bottom-6 left-4 hidden w-24 sm:block lg:bottom-[12%] lg:left-[9%] lg:w-32" />
      <Float src={heart} motion="twinkle" delay={0.4} className="right-6 top-10 w-8 sm:w-10 lg:right-[16%] lg:top-auto lg:bottom-[14%] lg:w-14" />
      <Float src={goldStar} motion="twinkle" delay={1.1} className="bottom-24 left-[12%] hidden w-10 lg:block" />
      <Float src={cloudOne} motion="drift" className="-left-20 bottom-0 hidden w-60 md:block" />
      <Float src={cloudTwo} motion="drift" delay={5} className="-right-20 top-0 hidden w-60 md:block" />
      <Float src={starOne} motion="twinkle" delay={2.2} className="left-1/4 top-6 w-6" />
      <Float src={starThree} motion="twinkle" delay={0.9} className="bottom-6 right-1/4 w-6" />
      <Float src={starSix} motion="twinkle" delay={1.7} className="right-[30%] top-[10%] hidden w-8 lg:block" />
    </>
  );
}

// A baby's left foot, toes up; mirrored for the right.
function Foot({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 36" aria-hidden="true" className={className}>
      <path d="M7.5 12.5c-2.6 3.6-3 8.4-2.2 12.4.9 4.6 3.3 9.1 7.2 9.1 3.6 0 5.8-3 5.8-6.6 0-2.8-1.6-4.9-1-7.6.5-2.2 2.7-4.1 2.7-7 0-2.8-2.2-4.1-5-4.1-3 0-5.6 1.1-7.5 3.8Z" />
      <circle cx="8.2" cy="5.4" r="3.1" />
      <circle cx="12.8" cy="3.6" r="2.2" />
      <circle cx="16.4" cy="4.6" r="1.9" />
      <circle cx="19.1" cy="7" r="1.6" />
      <circle cx="20.6" cy="10.2" r="1.3" />
    </svg>
  );
}

const STEPS = 6;

function Footprint({ index, progress }: { index: number; progress: MotionValue<number> }) {
  const reduceMotion = useReducedMotion();
  const start = index / STEPS;
  const opacity = useTransform(progress, [start, start + 0.12], [0, 0.75]);
  const scale = useTransform(progress, [start, start + 0.12], [0.6, 1]);
  const left = index % 2 === 0;

  return (
    <motion.span
      className="block"
      style={{
        x: left ? -14 : 14,
        rotate: left ? 172 : 188,
        scaleX: left ? 1 : -1,
        ...(reduceMotion ? { opacity: 0.75 } : { opacity, scale }),
      }}
    >
      <Foot className="h-9 w-6 fill-[#9DBFE3] sm:h-10 sm:w-7" />
    </motion.span>
  );
}

// Baby footprints walking down from the name section to the peeking bear,
// one step at a time as the page scrolls.
function FootprintTrail() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.45"],
  });

  return (
    <div ref={ref} aria-hidden="true" className="mb-6 flex flex-col items-center gap-2">
      {Array.from({ length: STEPS }, (_, i) => (
        <Footprint key={i} index={i} progress={scrollYProgress} />
      ))}
    </div>
  );
}

// Tiny paw prints that appear one after another, like a bear walking past.
function PawTrail() {
  const reduceMotion = useReducedMotion();
  const steps = 6;

  return (
    <div aria-hidden="true" className="mt-6 flex items-center justify-center gap-3 sm:gap-5">
      {Array.from({ length: steps }, (_, i) => (
        <motion.span
          key={i}
          className="block"
          style={{ rotate: 90, y: i % 2 ? 6 : -6 }}
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={reduceMotion ? { opacity: 0.5 } : { opacity: [0, 0.6, 0.6, 0] }}
          transition={{
            duration: 3.6,
            times: [0, 0.15, 0.7, 1],
            delay: i * 0.3,
            repeat: Infinity,
            repeatDelay: 0.6,
          }}
        >
          <Paw className="h-4 w-4 fill-[#B98F69] sm:h-5 sm:w-5" />
        </motion.span>
      ))}
    </div>
  );
}

// The event time is Philippine time (UTC+8), whatever the guest's time zone.
const start = getEventStart();
const startMs = start
  ? Date.UTC(start.year, start.month, start.day, start.hours - 8, start.minutes)
  : null;

function useCountdown() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  if (startMs === null) return null;
  const left = Math.max(0, startMs - now);
  return {
    done: left === 0,
    parts: [
      { label: "Days", value: Math.floor(left / 86_400_000) },
      { label: "Hours", value: Math.floor(left / 3_600_000) % 24 },
      { label: "Mins", value: Math.floor(left / 60_000) % 60 },
      { label: "Secs", value: Math.floor(left / 1000) % 60 },
    ],
  };
}

function Countdown() {
  const countdown = useCountdown();
  if (!countdown) return null;

  if (countdown.done) {
    return (
      <p className="mt-8 font-script text-[clamp(2rem,6vw,3rem)] text-sky">
        Today&apos;s the day!
      </p>
    );
  }

  return (
    <div className="mt-10">
      <ul className="flex justify-center gap-3 sm:gap-5" aria-label="Countdown to the christening">
        {countdown.parts.map(({ label, value }) => (
          <li key={label} className="relative">
            {/* Bear ears. */}
            <span aria-hidden="true" className="absolute -top-2 left-1 h-5 w-5 rounded-full border border-white/70 bg-white/60 sm:h-6 sm:w-6" />
            <span aria-hidden="true" className="absolute -top-2 right-1 h-5 w-5 rounded-full border border-white/70 bg-white/60 sm:h-6 sm:w-6" />
            <div className="glass relative grid w-[4.25rem] place-items-center rounded-[1.75rem] px-2 py-3 sm:w-24 sm:py-4">
              <span className="font-display text-[clamp(2.2rem,8vw,3.5rem)] font-bold leading-none text-navy tabular-nums">
                {String(value).padStart(2, "0")}
              </span>
              <span className="mt-1 text-[0.55rem] font-semibold uppercase tracking-widest text-mist sm:text-[0.6rem]">
                {label}
              </span>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-[0.65rem] font-semibold uppercase tracking-widest text-mist">
        until we meet at church
      </p>
    </div>
  );
}

// "Bear-ly", with the letters bouncing in a little wave.
function BouncyWord({ text }: { text: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <span className="inline-block text-sky" aria-label={text}>
      {Array.from(text, (letter, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          className="inline-block"
          animate={reduceMotion ? undefined : { y: [0, -14, 0] }}
          transition={{
            duration: 0.6,
            delay: i * 0.08,
            repeat: Infinity,
            repeatDelay: 2.4,
            ease: "easeOut",
          }}
        >
          {letter}
        </motion.span>
      ))}
    </span>
  );
}

export function BearlyWait() {
  return (
    <Section id="bearly" label="We can't bear-ly wait" decorations={<Decorations />}>
      <div className="text-center">
        <FootprintTrail />
        <Reveal>
          <PeekingBear className="mx-auto mb-1 w-[clamp(96px,22vw,160px)]" />
        </Reveal>
        <h2 className="font-display text-[clamp(4.5rem,14vw,12rem)] font-bold uppercase leading-[0.8] tracking-wide text-navy">
          <Reveal as="span">We can&apos;t</Reveal>
          <Reveal as="span" delay={0.25}>
            <BouncyWord text="Bear-ly" />
          </Reveal>
          <Reveal as="span" delay={0.5}>
            wait!
          </Reveal>
        </h2>
        <Reveal delay={0.7}>
          <PawTrail />
        </Reveal>
        <Reveal delay={0.85}>
          <Countdown />
        </Reveal>
      </div>
    </Section>
  );
}
