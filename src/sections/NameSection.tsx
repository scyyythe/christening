import { motion, useReducedMotion } from "framer-motion";
import { Drop } from "../components/Drop";
import { Float } from "../components/Float";
import { Reveal } from "../components/Reveal";
import { Section } from "../components/Section";
import {
  accentDrops,
  baby,
  cloudOne,
  cloudTwo,
  goldStar,
  starFour,
  starSeven,
  starTwo,
} from "../lib/art";

function Decorations() {
  return (
    <>
      <Float src={cloudTwo} motion="drift" className="-right-10 top-4 w-28 sm:w-40 lg:w-52" />
      <Float src={cloudOne} motion="drift" delay={4} className="-left-14 bottom-4 w-32 sm:w-44 lg:w-60" />
      <Float src={starTwo} motion="twinkle" className="left-6 top-8 w-6 sm:w-8" />
      <Float src={starSeven} motion="twinkle" delay={1.4} className="bottom-12 right-8 w-7 sm:w-9" />
      <Float src={goldStar} motion="twinkle" delay={0.7} className="right-[38%] top-10 hidden w-10 md:block" />
      <Float src={starFour} motion="twinkle" delay={2} className="bottom-16 left-[45%] hidden w-6 lg:block" />
    </>
  );
}

export function NameSection() {
  const reduceMotion = useReducedMotion();

  return (
    <Section id="name" label="Tobias Noah U. Cafe" tint="light" decorations={<Decorations />}>
      <div className="grid items-center gap-12 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
        <Drop
          shadow
          className="relative mx-auto w-[min(58%,220px)] md:w-[min(100%,300px)] lg:w-[min(100%,340px)]"
        >
          <motion.img
            src={baby}
            alt="Baby wearing a blue outfit and a little hat, floating with balloons"
            className="w-full"
            animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <img
            src={accentDrops}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -right-6 top-1/4 w-8 rotate-[28deg] md:w-10"
          />
        </Drop>

        <div className="text-center md:text-left">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest text-mist">
              A little blessing is on the way
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <h2 className="mt-4 font-script text-[clamp(3rem,8vw,7rem)] leading-[1.05] text-navy">
              Tobias Noah
              <span className="block">U. Cafe</span>
            </h2>
          </Reveal>
          <Reveal delay={0.45}>
            <p className="mt-8 inline-block border-b-2 border-sun/70 pb-1 font-display text-[clamp(2.2rem,4.5vw,3.8rem)] font-bold uppercase leading-none tracking-[0.18em] text-navy">
              His christening
            </p>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
