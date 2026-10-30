import type { ComponentType, SVGProps } from "react";
import { Float } from "../components/Float";
import { CalendarIcon, ChurchIcon, HouseIcon, PinIcon } from "../components/Icons";
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
  lines: string[];
  destination: Destination;
  onOpenMap: (destination: Destination) => void;
  delay: number;
};

function VenueCard({ icon: Icon, label, venue, lines, destination, onOpenMap, delay }: CardProps) {
  return (
    <Reveal delay={delay} className="glass flex flex-col p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-sky/10 text-sky">
          <Icon className="h-6 w-6" />
        </span>
        <p className="text-xs font-semibold uppercase tracking-widest text-mist">{label}</p>
      </div>
      <h3 className="mt-5 font-display text-[clamp(2.2rem,4vw,3rem)] font-bold uppercase leading-none tracking-wider text-navy">
        {venue.name}
      </h3>
      <div className="mt-3 space-y-1 text-sm text-mist">
        {lines.map((line) => (
          <p key={line}>{line}</p>
        ))}
        <p>{venue.address}</p>
      </div>
      <div className="mt-6 flex flex-wrap gap-2 sm:mt-auto sm:pt-6">
        <button
          type="button"
          className="btn-primary min-w-[11rem] flex-1 whitespace-nowrap"
          onClick={() => onOpenMap(destination)}
        >
          <PinIcon className="h-4 w-4" />
          Find your way
        </button>
        {eventStart && (
          <button
            type="button"
            className="btn-secondary min-w-[11rem] flex-1 whitespace-nowrap"
            onClick={() => downloadCalendarFile(eventStart)}
          >
            <CalendarIcon className="h-4 w-4 text-sky" />
            Add to calendar
          </button>
        )}
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
          <Sun className="-ml-2 w-10 sm:w-12" delay={1.2} />
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

      <div className="mx-auto mt-10 grid max-w-4xl gap-5 md:grid-cols-2 md:gap-6">
        <VenueCard
          icon={ChurchIcon}
          label="Ceremony"
          venue={event.church}
          lines={[`At ${event.time}`]}
          destination="church"
          onOpenMap={onOpenMap}
          delay={0.2}
        />
        <VenueCard
          icon={HouseIcon}
          label="Reception"
          venue={event.reception}
          lines={["To follow right after the ceremony"]}
          destination="reception"
          onOpenMap={onOpenMap}
          delay={0.35}
        />
      </div>
    </Section>
  );
}
