import { lazy, Suspense, useCallback, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { DeclineNote } from "../components/DeclineNote";
import { Intro } from "../components/Intro";
import type { Destination } from "../components/MapGuide";
import { MusicButton } from "../components/MusicButton";
import { Nav } from "../components/Nav";
import { PhotoGallery } from "../components/PhotoGallery";
import { RsvpModal } from "../components/RsvpModal";
import { event } from "../data/event";
import { BearlyWait } from "../sections/BearlyWait";
import { Details } from "../sections/Details";
import { Godparents } from "../sections/Godparents";
import { Hero } from "../sections/Hero";
import { NameSection } from "../sections/NameSection";
import { Pictures } from "../sections/Pictures";
import { SeeYouThere } from "../sections/SeeYouThere";

// Leaflet is heavy; only fetch the map guide when someone opens it.
const MapGuide = lazy(() =>
  import("../components/MapGuide").then((m) => ({ default: m.MapGuide })),
);

function Index() {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [rsvpOpen, setRsvpOpen] = useState(false);
  const [declineOpen, setDeclineOpen] = useState(false);
  const [mapTab, setMapTab] = useState<Destination | null>(null);
  // The site stays hidden behind the envelope until it's opened. Replaying
  // brings the envelope back, and remounting the sections replays their
  // entrance animations.
  const [invited, setInvited] = useState(false);

  const closeGallery = useCallback(() => setGalleryOpen(false), []);
  const closeRsvp = useCallback(() => setRsvpOpen(false), []);
  const closeDecline = useCallback(() => setDeclineOpen(false), []);
  const closeMap = useCallback(() => setMapTab(null), []);

  const openRsvp = () => {
    if (!event.rsvpEmail && event.rsvpMessenger) {
      window.open(event.rsvpMessenger, "_blank", "noopener,noreferrer");
      return;
    }
    setRsvpOpen(true);
  };

  const openInvitation = useCallback(() => setInvited(true), []);
  const replay = () => setInvited(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EAF4FC] via-[#D6E9F8] to-[#BFDDF3] font-sans text-navy">
      <Nav />
      <MusicButton />

      {invited && (
        <main>
          <Hero />
          <NameSection />
          <BearlyWait />
          <Details onOpenMap={setMapTab} />
          <Godparents />
          <Pictures onOpen={() => setGalleryOpen(true)} />
          <SeeYouThere
            onRsvp={openRsvp}
            onDecline={() => setDeclineOpen(true)}
            onOpenMap={setMapTab}
            onReplay={replay}
          />
        </main>
      )}

      <footer className="pb-10 pt-4 text-center text-[0.65rem] font-semibold uppercase tracking-widest text-mist">
        Made with love for Thobias Noah
      </footer>

      <Suspense fallback={null}>
        <AnimatePresence>
          {!invited && <Intro key="intro" onOpen={openInvitation} />}
          {galleryOpen && <PhotoGallery key="gallery" onClose={closeGallery} />}
          {rsvpOpen && <RsvpModal key="rsvp" onClose={closeRsvp} />}
          {declineOpen && <DeclineNote key="decline" onClose={closeDecline} />}
          {mapTab && <MapGuide key="map" initialTab={mapTab} onClose={closeMap} />}
        </AnimatePresence>
      </Suspense>
    </div>
  );
}

export default Index;
