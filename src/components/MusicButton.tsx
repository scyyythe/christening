import { useEffect, useRef, useState } from "react";
import { event } from "../data/event";
import { SoundOffIcon, SoundOnIcon } from "./Icons";

// Optional background music. Browsers block autoplay with sound, so it
// starts on the visitor's first tap anywhere on the page (unless muted).
export function MusicButton() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [muted, setMuted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const mutedRef = useRef(muted);
  mutedRef.current = muted;

  useEffect(() => {
    if (!event.musicSrc) return;
    const audio = new Audio(event.musicSrc);
    audio.loop = true;
    audio.volume = 0.5;
    audioRef.current = audio;

    const startOnFirstTap = () => {
      if (mutedRef.current) return;
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    };
    window.addEventListener("pointerdown", startOnFirstTap, { once: true });
    return () => {
      window.removeEventListener("pointerdown", startOnFirstTap);
      audio.pause();
    };
  }, []);

  if (!event.musicSrc) return null;

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
      setMuted(true);
    } else {
      setMuted(false);
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      // The first-tap listener would otherwise start music on a mute tap.
      onPointerDown={(e) => e.stopPropagation()}
      aria-label={playing ? "Mute music" : "Play music"}
      aria-pressed={playing}
      className="fixed right-4 top-20 z-40 grid h-11 w-11 place-items-center rounded-full border border-white/70 bg-white/60 text-sky shadow-glass backdrop-blur-md transition hover:-translate-y-0.5 sm:right-6"
    >
      {playing ? (
        <SoundOnIcon className="h-5 w-5" />
      ) : (
        <SoundOffIcon className="h-5 w-5" />
      )}
    </button>
  );
}
