import { Float } from "../components/Float";
import { Reveal } from "../components/Reveal";
import { Section } from "../components/Section";
import { Sun } from "../components/Sun";
import { event } from "../data/event";
import { cloudOne, cloudTwo, starFour, starTwo } from "../lib/art";

function Decorations() {
  return (
    <>
      <Float src={cloudOne} motion="drift" className="-right-12 top-4 w-28 sm:w-40 lg:w-56" />
      <Float src={cloudTwo} motion="drift" delay={3} className="-bottom-6 -left-16 w-28 md:w-36 lg:w-48" />
      <Float src={starTwo} motion="twinkle" className="left-5 top-10 w-6 sm:w-8" />
      <Float src={starFour} motion="twinkle" delay={1.3} className="bottom-8 right-8 w-6 sm:w-7" />
    </>
  );
}

// The date on its own, between the countdown and the RSVP.
export function SaveTheDate() {
  return (
    <Section id="date" label="Save the date" decorations={<Decorations />}>
      <div className="text-center">
        <Reveal className="flex items-start justify-center">
          <Sun className="w-20 sm:w-24" />
        </Reveal>
        <Reveal delay={0.15}>
          <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-mist">
            Please join us
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <h2 className="mt-2 font-display text-[clamp(2.8rem,6vw,5rem)] font-bold uppercase leading-none tracking-[0.12em] text-navy">
            {event.day} &bull; {event.date}
          </h2>
        </Reveal>
        <Reveal delay={0.45}>
          <p className="mt-2 font-script text-[clamp(2rem,4vw,3rem)] text-sky">
            mark your calendars, dear ones
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
