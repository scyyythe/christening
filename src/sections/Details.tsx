import type { ComponentType, SVGProps } from "react";
import { BearEars, Paw } from "../components/Bear";
import { Float } from "../components/Float";
import { CalendarIcon, ChurchIcon, ClockIcon, HouseIcon, PinIcon } from "../components/Icons";
import type { Destination } from "../components/MapGuide";
import { Reveal } from "../components/Reveal";
import { Section } from "../components/Section";
import { Sun } from "../components/Sun";
import { event, type Venue } from "../data/event";
import { downloadCalendarFile, getEventStart } from "../lib/calendar";
import { cloudOne, cloudTwo, starFour, starTwo } from "../lib/art";

const eventStart = getEventStart();

type DetailsProps = {
  onOpenMap: (destination: Destination) => void;
};

type CardProps = {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  venue: Venue;
  // When it starts, shown in a little pill.
  when: string;
  destination: Destination;
  onOpenMap: (destination: Destination) => void;
  delay: number;
};

function VenueCard({ icon: Icon, label, venue, when, destination, onOpenMap, delay }: CardProps) {
  return (
    <Reveal delay={delay} className="relative">
      <BearEars />
      <div className="glass relative flex h-full flex-col p-6 sm:p-8">
        {/* Stitched border. */}
        <span aria-hidden="true" className="pointer-events-none absolute inset-2.5 rounded-[1.25rem] border-2 border-dashed border-sky/20" />
        {/* Paw prints wandering off the corner. */}
        <span aria-hidden="true" className="pointer-events-none absolute right-6 top-6 flex gap-1.5 opacity-40 sm:right-8 sm:top-8">
          <Paw className="h-3.5 w-3.5 -rotate-12 fill-[#B98F69]" />
          <Paw className="mt-2 h-3.5 w-3.5 rotate-12 fill-[#B98F69]" />
        </span>

        <div className="relative flex items-center gap-3">
          {/* The icon wears little bear ears. */}
          <span className="relative grid h-12 w-12 place-items-center rounded-full bg-sky/10 text-sky">
            <span aria-hidden="true" className="absolute -left-0.5 -top-0.5 h-4 w-4 rounded-full bg-sky/15" />
            <span aria-hidden="true" className="absolute -right-0.5 -top-0.5 h-4 w-4 rounded-full bg-sky/15" />
            <Icon className="relative h-6 w-6" />
          </span>
          <p className="text-xs font-semibold uppercase tracking-widest text-mist">{label}</p>
        </div>
        <h3 className="relative mt-5 font-display text-[clamp(2.2rem,4vw,3rem)] font-bold uppercase leading-none tracking-wider text-navy">
          {venue.name}
        </h3>
        <p className="relative mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-sky/10 px-3 py-1.5 text-xs font-semibold text-ink">
          <ClockIcon className="h-4 w-4 text-sky" />
          {when}
        </p>
        <p className="relative mt-3 flex items-start gap-2 text-sm text-mist">
          <PinIcon className="mt-0.5 h-4 w-4 shrink-0 text-sky" />
          {venue.address}
        </p>

        {/* Pushes the buttons to the bottom when the cards share a row. */}
        <div aria-hidden="true" className="flex-1" />
        <div aria-hidden="true" className="relative mt-6 border-t-2 border-dotted border-sky/25" />
        <div className="relative mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            className="btn-primary min-w-[11rem] flex-1 whitespace-nowrap"
            onClick={() => onOpenMap(destination)}
          >
            <PinIcon className="h-4 w-4 shrink-0" />
            Find your way
          </button>
          {eventStart && (
            <button
              type="button"
              className="btn-secondary min-w-[11rem] flex-1 whitespace-nowrap"
              onClick={() => downloadCalendarFile(eventStart)}
            >
              <CalendarIcon className="h-4 w-4 shrink-0 text-sky" />
              Add to calendar
            </button>
          )}
        </div>
      </div>
    </Reveal>
  );
}

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

export function Details({ onOpenMap }: DetailsProps) {
  return (
    <Section id="details" label="Event details" tint="deep" decorations={<Decorations />}>
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

      <div className="mx-auto mt-16 grid max-w-4xl gap-14 md:grid-cols-2 md:gap-6">
        <VenueCard
          icon={ChurchIcon}
          label="Ceremony"
          venue={event.church}
          when={`At ${event.time}`}
          destination="church"
          onOpenMap={onOpenMap}
          delay={0.2}
        />
        <VenueCard
          icon={HouseIcon}
          label="Reception"
          venue={event.reception}
          when="Right after the ceremony"
          destination="reception"
          onOpenMap={onOpenMap}
          delay={0.35}
        />
      </div>
    </Section>
  );
}
