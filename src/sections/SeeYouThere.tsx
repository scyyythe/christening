import { motion, useReducedMotion } from "framer-motion";
import { Balloons } from "../components/Balloons";
import { Drop } from "../components/Drop";
import { Float } from "../components/Float";
import { CalendarIcon, ChurchIcon, HeartIcon, HouseIcon, ReplayIcon } from "../components/Icons";
import { BearEars, PeekingBear } from "../components/Bear";
import type { Destination } from "../components/MapGuide";
import { Reveal } from "../components/Reveal";
import { Section } from "../components/Section";
import { downloadCalendarFile, getEventStart } from "../lib/calendar";
import { bearReaching, cloudOne, cloudTwo, goldStar, starOne, starThree } from "../lib/art";

const eventStart = getEventStart();

type SeeYouThereProps = {
  // "Yes" opens the RSVP form; "Sorry, I can't" shows a kind note instead.
  onRsvp: () => void;
  onDecline: () => void;
  onOpenMap: (destination: Destination) => void;
  onReplay: () => void;
};

function Decorations() {
  return (
    <>
      <Float src={cloudTwo} motion="drift" className="-right-14 -top-4 w-24 md:w-32 lg:w-48" />
      <Float src={cloudOne} motion="drift" delay={4} className="-left-14 bottom-2 w-32 sm:w-44 lg:w-56" />
      <Float src={goldStar} motion="twinkle" className="left-6 top-8 w-9 sm:w-11" />
      <Float src={starOne} motion="twinkle" delay={1.1} className="bottom-10 right-8 w-6 sm:w-8" />
      <Float src={starThree} motion="twinkle" delay={2} className="right-[45%] top-[8%] hidden w-6 md:block" />
    </>
  );
}

// The bear's raised paw sits exactly where the SVG balloon strings meet:
// the numbers below line the paw up with the strings' knot in <Balloons>.
function BearWithBalloons() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="relative mx-auto aspect-[280/526] w-[min(62vw,240px)] md:w-[min(32vw,340px)]"
      animate={reduceMotion ? undefined : { y: [0, -12, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    >
      <Balloons className="absolute left-0 top-0 w-full" />
      <img
        src={bearReaching}
        alt="A little bear in an aviator cap holding a bunch of balloons"
        className="absolute left-[29.2%] top-[56.2%] w-1/2"
      />
    </motion.div>
  );
}

export function SeeYouThere({ onRsvp, onDecline, onOpenMap, onReplay }: SeeYouThereProps) {
  return (
    <Section id="see-you-there" label="See you there" tint="deep" decorations={<Decorations />}>
      <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-12">
        <Drop className="relative">
          <BearWithBalloons />
        </Drop>

        <div className="text-center md:text-left">
          <Reveal>
            <h2 className="font-display text-[clamp(4rem,10vw,8.5rem)] font-bold uppercase leading-[0.85] tracking-[0.08em] text-navy">
              See you there
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-2 font-script text-[clamp(2rem,4vw,3.2rem)] text-sky">
              with love, Toby&apos;s family
            </p>
          </Reveal>

          <Reveal delay={0.35} className="relative mt-20">
            {/* The bear asks the question, peeking over the card. */}
            <BearEars />
            {/* Positioned by this wrapper: the bear's bob animation owns its transform. */}
            <span className="absolute left-1/2 top-0 z-10 block w-28 -translate-x-1/2 -translate-y-[86%] sm:w-32">
              <PeekingBear className="w-full" />
            </span>
            <div className="glass p-5 pt-7 text-center sm:p-6 sm:pt-8">
              <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-mist">
                RSVP &middot; Kindly let us know
              </p>
              <h3 className="mt-1 font-script text-[clamp(2.1rem,6vw,2.8rem)] leading-tight text-navy">
                Will you be there for Toby?
              </h3>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <button type="button" className="btn-primary" onClick={onRsvp}>
                  <HeartIcon className="h-4 w-4" />
                  Yes, I&apos;ll be there!
                </button>
                <button type="button" className="btn-secondary" onClick={onDecline}>
                  Sorry, I can&apos;t
                </button>
              </div>
              <p className="mt-3 text-xs text-mist">
                Say yes and the bear will save you a seat.
              </p>

              <div aria-hidden="true" className="my-5 border-t-2 border-dotted border-sky/25" />

              <div className="flex flex-wrap gap-2">
                {eventStart && (
                  <button
                    type="button"
                    className="btn-secondary min-w-[10rem] flex-1 whitespace-nowrap"
                    onClick={() => downloadCalendarFile(eventStart)}
                  >
                    <CalendarIcon className="h-4 w-4 text-sky" />
                    Add to calendar
                  </button>
                )}
                <button type="button" className="btn-secondary min-w-[10rem] flex-1 whitespace-nowrap" onClick={() => onOpenMap("church")}>
                  <ChurchIcon className="h-4 w-4 text-sky" />
                  Church map
                </button>
                <button type="button" className="btn-secondary min-w-[10rem] flex-1 whitespace-nowrap" onClick={() => onOpenMap("reception")}>
                  <HouseIcon className="h-4 w-4 text-sky" />
                  Reception map
                </button>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.5}>
            <button
              type="button"
              onClick={onReplay}
              className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-sky underline decoration-sun/70 decoration-2 underline-offset-4 transition hover:text-navy"
            >
              <ReplayIcon className="h-4 w-4" />
              Replay invitation
            </button>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
