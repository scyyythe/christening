import { Float } from "../components/Float";
import { Reveal } from "../components/Reveal";
import { Section } from "../components/Section";
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

export function BearlyWait() {
  return (
    <Section id="bearly" label="We can't bear-ly wait" decorations={<Decorations />}>
      <h2 className="text-center font-display text-[clamp(4.5rem,14vw,12rem)] font-bold uppercase leading-[0.8] tracking-wide text-navy">
        <Reveal as="span">We can&apos;t</Reveal>
        <Reveal as="span" delay={0.25}>
          Bear-ly
        </Reveal>
        <Reveal as="span" delay={0.5}>
          wait!
        </Reveal>
      </h2>
    </Section>
  );
}
