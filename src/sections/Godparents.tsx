import { motion, useReducedMotion } from "framer-motion";
import { Float } from "../components/Float";
import { Reveal } from "../components/Reveal";
import { Section } from "../components/Section";
import { Sun } from "../components/Sun";
import { event } from "../data/event";
import { bearBalloons, cloudOne, cloudTwo, goldStar, starOne, starSeven } from "../lib/art";

function Decorations() {
  return (
    <>
      <Float src={cloudTwo} motion="drift" className="-left-12 top-4 w-28 sm:w-40 lg:w-52" />
      <Float src={cloudOne} motion="drift" delay={4} className="-right-14 bottom-2 w-32 sm:w-44 lg:w-56" />
      <Float src={starOne} motion="twinkle" className="right-6 top-10 w-6 sm:w-8" />
      <Float src={starSeven} motion="twinkle" delay={1.2} className="bottom-12 left-6 w-6 sm:w-8" />
      <Float src={goldStar} motion="twinkle" delay={0.6} className="left-[8%] top-[35%] hidden w-10 xl:block" />
    </>
  );
}

const columns = [
  { heading: "Ninongs", names: event.ninongs },
  { heading: "Ninangs", names: event.ninangs },
];

export function Godparents() {
  const reduceMotion = useReducedMotion();

  return (
    <Section id="godparents" label="Ninongs and Ninangs" decorations={<Decorations />}>
      <div className="mx-auto grid max-w-5xl items-center gap-8 lg:grid-cols-[1fr_auto] lg:gap-14">
        <div className="text-center">
          <Reveal className="flex justify-center">
            <Sun className="w-16 sm:w-20" />
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-3 font-display text-[clamp(1.6rem,3vw,2.4rem)] font-bold uppercase leading-none tracking-[0.3em] text-ink">
              With our
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <h2 className="mt-1 font-display text-[clamp(2.8rem,7vw,5.5rem)] font-bold uppercase leading-none tracking-[0.06em] text-navy">
              Ninongs &amp; Ninangs
            </h2>
          </Reveal>

          <Reveal
            delay={0.45}
            className="glass mx-auto mt-8 grid max-w-2xl gap-6 p-6 text-center min-[400px]:grid-cols-2 sm:p-8"
          >
            {columns.map((column) => (
              <div key={column.heading}>
                <h3 className="font-display text-[clamp(1.6rem,3vw,2.2rem)] font-bold uppercase leading-none tracking-[0.2em] text-sky">
                  {column.heading}
                </h3>
                <ul className="mt-3 space-y-1.5">
                  {column.names.map((name, i) => (
                    <li
                      key={`${name}-${i}`}
                      className="text-sm leading-relaxed text-mist [overflow-wrap:anywhere]"
                    >
                      {name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </Reveal>
        </div>

        <Reveal delay={0.6} className="mx-auto w-[min(60%,220px)] lg:w-64">
          <motion.img
            src={bearBalloons}
            alt="A little bear floating up with blue balloons"
            className="w-full drop-shadow-[0_12px_14px_rgba(15,37,87,0.10)]"
            animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </Reveal>
      </div>
    </Section>
  );
}
