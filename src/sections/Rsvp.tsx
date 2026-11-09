import { BearEars, PeekingBear } from "../components/Bear";
import { Float } from "../components/Float";
import { HeartIcon } from "../components/Icons";
import { Reveal } from "../components/Reveal";
import { Section } from "../components/Section";
import { cloudOne, cloudTwo, goldStar, starOne } from "../lib/art";

type RsvpProps = {
  // "Yes" opens the RSVP form; "Sorry, I can't" shows a kind note instead.
  onRsvp: () => void;
  onDecline: () => void;
};

function Decorations() {
  return (
    <>
      <Float src={cloudOne} motion="drift" className="-left-16 top-10 w-32 sm:w-44 lg:w-56" />
      <Float src={cloudTwo} motion="drift" delay={4} className="-right-14 bottom-6 w-24 md:w-32 lg:w-48" />
      <Float src={goldStar} motion="twinkle" className="right-8 top-12 w-9 sm:w-11" />
      <Float src={starOne} motion="twinkle" delay={1.1} className="bottom-12 left-8 w-6 sm:w-8" />
    </>
  );
}

// Sits right after the name so guests answer early: the reception needs a
// headcount for the reservation.
export function Rsvp({ onRsvp, onDecline }: RsvpProps) {
  return (
    <Section id="rsvp" label="RSVP" decorations={<Decorations />}>
      <Reveal className="relative mx-auto mt-16 max-w-md">
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
          <p className="mt-2 text-sm text-navy/80">
            The reception is catered and we&apos;re reserving seats, so please fill out the form.
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <button type="button" className="btn-primary" onClick={onRsvp}>
              <HeartIcon className="h-4 w-4" />
              Yes, I&apos;ll be there!
            </button>
            <button type="button" className="btn-secondary" onClick={onDecline}>
              Sorry, I can&apos;t
            </button>
          </div>
          <p className="mt-3 text-xs text-mist">Say yes and the bear will save you a seat.</p>
          <p className="mt-4 font-script text-2xl text-sky">with love, Toby&apos;s family</p>
        </div>
      </Reveal>
    </Section>
  );
}
