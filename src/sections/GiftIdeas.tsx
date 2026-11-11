import type { ReactNode } from "react";
import { BearEars } from "../components/Bear";
import { Float } from "../components/Float";
import { HeartIcon } from "../components/Icons";
import { Reveal } from "../components/Reveal";
import { Section } from "../components/Section";
import { Sun } from "../components/Sun";
import {
  cloudOne,
  cloudTwo,
  giftClothes,
  giftDiapers,
  giftWipes,
  goldStar,
  starOne,
  starSeven,
} from "../lib/art";

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

const gifts = [
  {
    title: "Baby wipes",
    detail: "Kleenfant or any unscented wipes",
    image: giftWipes,
    alt: "A pack of baby wipes",
  },
  {
    title: "Diapers",
    detail: "Size L or XL (Pampers, EQ or any brand)",
    image: giftDiapers,
    alt: "Stacks of baby diapers and a basket with a blue bow",
  },
  {
    title: "Baby clothes",
    detail: "Sizes 3–12 months and up",
    image: giftClothes,
    alt: "Baby onesie, hat, socks and overalls on a clothesline",
  },
];

// A simple formula tin drawing for the milk card.
function MilkTin() {
  return (
    <svg viewBox="0 0 120 140" role="img" aria-label="A tin of Bonna infant formula" className="h-full">
      <ellipse cx="60" cy="130" rx="42" ry="6" fill="#0b2a4a" opacity="0.08" />
      <rect x="22" y="20" width="76" height="108" rx="10" fill="#ffffff" stroke="#8cc3ea" strokeWidth="3" />
      <rect x="18" y="12" width="84" height="16" rx="6" fill="#8cc3ea" />
      <rect x="22" y="48" width="76" height="46" fill="#e6f3fc" />
      <text x="60" y="70" textAnchor="middle" fontFamily="sans-serif" fontWeight="800" fontSize="17" fill="#1d4f8a">
        BONNA
      </text>
      <text x="60" y="86" textAnchor="middle" fontFamily="sans-serif" fontWeight="600" fontSize="10" fill="#4a7fb5">
        0–6 months
      </text>
      <path d="M48 108 q12 -12 24 0 q-12 12 -24 0z" fill="#8cc3ea" opacity="0.7" />
    </svg>
  );
}

function GiftCard({ title, detail, children }: { title: string; detail: string; children: ReactNode }) {
  return (
    <div className="glass flex h-full flex-col items-center p-5 text-center">
      {/* Fixed-height picture box: the picture shrinks to fit, so it never runs into the text below. */}
      <div className="flex h-36 w-full shrink-0 items-center justify-center overflow-hidden sm:h-40">
        {children}
      </div>
      <h3 className="mt-4 font-display text-[clamp(1.4rem,2.6vw,1.8rem)] font-bold uppercase leading-none tracking-[0.15em] text-sky">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-mist">{detail}</p>
    </div>
  );
}

export function GiftIdeas() {
  return (
    <Section id="gifts" label="Gift ideas" decorations={<Decorations />}>
      <div className="mx-auto max-w-5xl text-center">
        <Reveal className="flex justify-center">
          <Sun className="w-16 sm:w-20" />
        </Reveal>
        <Reveal delay={0.15}>
          <p className="mt-3 font-display text-[clamp(1.6rem,3vw,2.4rem)] font-bold uppercase leading-none tracking-[0.3em] text-ink">
            For little Toby
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <h2 className="mt-1 font-display text-[clamp(2.8rem,7vw,5.5rem)] font-bold uppercase leading-none tracking-[0.06em] text-navy">
            Gift Ideas
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-4 min-[480px]:grid-cols-2 lg:grid-cols-4">
          {gifts.map((gift, i) => (
            <Reveal key={gift.title} delay={0.4 + i * 0.1} className="h-full">
              <GiftCard title={gift.title} detail={gift.detail}>
                <img src={gift.image} alt={gift.alt} loading="lazy" className="h-full w-full object-contain" />
              </GiftCard>
            </Reveal>
          ))}
          <Reveal delay={0.7} className="h-full">
            <GiftCard title="Milk" detail="Bonna 0–6 months (infant formula)">
              <MilkTin />
            </GiftCard>
          </Reveal>
        </div>

        <Reveal delay={0.85} className="relative mx-auto mt-14 max-w-xl">
          <BearEars />
          <div className="glass relative p-6 sm:p-7">
            {/* Stitched border. */}
            <span aria-hidden="true" className="pointer-events-none absolute inset-2.5 rounded-[1.25rem] border-2 border-dashed border-sky/20" />
            <HeartIcon className="relative mx-auto h-5 w-5 text-sky/70" />
            <p className="relative mt-2 font-script text-[clamp(1.8rem,4vw,2.4rem)] leading-tight text-navy">
              Your presence is the best gift
            </p>
            <p className="relative mt-2 text-sm leading-relaxed text-mist">
              These are only ideas, not requirements. Please don&apos;t feel you
              have to bring anything. Celebrating with us is more than enough.
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
