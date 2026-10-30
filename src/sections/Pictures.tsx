import { motion, useReducedMotion } from "framer-motion";
import { Float } from "../components/Float";
import { Reveal } from "../components/Reveal";
import { Section } from "../components/Section";
import { gallery } from "../data/gallery";
import {
  bearPatch,
  cameraDoodle,
  cloudOne,
  cloudTwo,
  denimStars,
  navyStars,
  starSix,
} from "../lib/art";

function Decorations() {
  return (
    <>
      <Float src={cloudOne} motion="drift" className="-right-12 top-4 w-28 sm:w-40 lg:w-52" />
      <Float src={cloudTwo} motion="drift" delay={3} className="-left-14 bottom-2 w-32 sm:w-44 lg:w-56" />
      <Float src={bearPatch} motion="bob" className="left-4 top-8 w-14 sm:w-16 lg:left-[12%] lg:top-[24%] lg:w-24" />
      <Float src={denimStars} motion="twinkle" delay={1} className="sticker-outline bottom-10 right-6 w-12 sm:w-16 lg:bottom-[22%] lg:right-[12%] lg:w-20" />
      <Float src={navyStars} motion="twinkle" delay={0.5} className="right-[16%] top-[16%] hidden w-12 lg:block" />
      <Float src={cameraDoodle} motion="bob" delay={1.6} className="bottom-[18%] left-[16%] hidden w-20 lg:block" />
      <Float src={starSix} motion="twinkle" delay={2} className="left-1/3 top-6 hidden w-7 md:block" />
    </>
  );
}

export function Pictures({ onOpen }: { onOpen: () => void }) {
  const reduceMotion = useReducedMotion();

  return (
    <Section id="photos" label="Toby's Pictures" tint="light" decorations={<Decorations />}>
      <button
        type="button"
        className="teaser mx-auto"
        onClick={onOpen}
        aria-label="Open Toby's Pictures"
      >
        <Reveal as="span" className="teaser-stack">
          <span className="teaser-polaroid teaser-polaroid-back" />
          <span className="teaser-polaroid teaser-polaroid-middle" />
          <span className="teaser-polaroid teaser-polaroid-top">
            <span className="teaser-photo">
              {gallery[0] && <img src={gallery[0].src} alt="" loading="lazy" />}
            </span>
          </span>
        </Reveal>
        <Reveal as="span" delay={0.2}>
          <span className="block font-script text-[clamp(3rem,7vw,5.5rem)] leading-tight text-navy">
            Toby&apos;s Pictures
          </span>
        </Reveal>
        <Reveal as="span" delay={0.4}>
          <motion.span
            className="btn-primary pointer-events-none mt-3"
            animate={reduceMotion ? undefined : { scale: [1, 1.06, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            Tap to view
          </motion.span>
        </Reveal>
      </button>
    </Section>
  );
}
