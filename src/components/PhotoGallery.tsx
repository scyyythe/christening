import { useCallback, useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type PanInfo,
} from "framer-motion";
import { cn } from "../lib/utils";
import { gallery, type GalleryPhoto } from "../data/gallery";
import { Doodles } from "./Doodles";
import bearPatch from "../assets/stickers/bear-patch.png";
import binderClip from "../assets/stickers/binder-clip.png";
import cameraDoodle from "../assets/stickers/camera-doodle.png";
import denimStars from "../assets/stickers/denim-stars.png";
import navyStars from "../assets/stickers/navy-stars.png";

type PhotoGalleryProps = {
  onClose: () => void;
};

// Sticker layouts cycle through the polaroids, so new photos get decorated
// without any extra setup.
const stickerSets = [
  [
    { src: binderClip, className: "sticker-clip" },
    { src: navyStars, className: "sticker-navy-stars" },
  ],
  [{ src: bearPatch, className: "sticker-bear" }],
  [
    { src: denimStars, className: "sticker-denim" },
    { src: cameraDoodle, className: "sticker-camera" },
  ],
];

const rotations = [-3, 2.5, -1.5, 3, -2.5, 1.5];

// A swipe counts once the drag passes this distance or flicks fast enough.
const SWIPE_DISTANCE = 60;
const SWIPE_VELOCITY = 400;

function Photo({ photo, alt, lazy }: { photo: GalleryPhoto; alt: string; lazy?: boolean }) {
  return (
    <img
      src={photo.src}
      alt={alt}
      width={photo.width}
      height={photo.height}
      style={photo.position ? { objectPosition: photo.position } : undefined}
      loading={lazy ? "lazy" : undefined}
      decoding="async"
      draggable={false}
    />
  );
}

// Phones get the share sheet ("Save Image" puts it in the camera roll);
// everything else downloads the file.
async function savePhoto(photo: GalleryPhoto, index: number) {
  const fileName = `toby-${String(index + 1).padStart(2, "0")}.webp`;
  try {
    const blob = await (await fetch(photo.src)).blob();
    const file = new File([blob], fileName, { type: blob.type || "image/webp" });
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch && navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file] });
      return;
    }
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") return;
    window.open(photo.src, "_blank", "noopener");
  }
}

function SaveIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 4v11M7 10.5l5 5 5-5M5 19.5h14" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function PhotoGallery({ onClose }: PhotoGalleryProps) {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState<number | null>(null);
  const [direction, setDirection] = useState(1);

  const step = useCallback((delta: number) => {
    setDirection(delta);
    setActive((i) =>
      i === null ? i : (i + delta + gallery.length) % gallery.length,
    );
  }, []);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (active !== null) setActive(null);
        else onClose();
      }
      if (active === null) return;
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [active, onClose, step]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (
      info.offset.x < -SWIPE_DISTANCE ||
      info.velocity.x < -SWIPE_VELOCITY
    ) {
      step(1);
    } else if (
      info.offset.x > SWIPE_DISTANCE ||
      info.velocity.x > SWIPE_VELOCITY
    ) {
      step(-1);
    }
  };

  return (
    <motion.div
      className="gallery-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Toby's Pictures"
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: reduceMotion ? 0.2 : 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <button
        type="button"
        className="gallery-close"
        onClick={onClose}
        aria-label="Close gallery"
      >
        <CloseIcon />
      </button>

      <div className={cn("gallery-scroll", active !== null && "is-locked")}>
        <header className="gallery-header">
          <p className="gallery-kicker">A FEW OF OUR FAVORITES</p>
          <h2 className="gallery-title">Toby&apos;s Pictures</h2>
        </header>

        <div className="polaroid-collage">
          {gallery.map((photo, index) => {
            const rotate = rotations[index % rotations.length];
            const stickers = stickerSets[index % stickerSets.length];

            return (
              <motion.button
                key={`${index}-${photo.src}`}
                type="button"
                className={cn(
                  "polaroid",
                  index % 2 === 0 ? "polaroid-left" : "polaroid-right",
                )}
                style={{ zIndex: index + 1 }}
                onClick={() => setActive(index)}
                aria-label={`Open photo ${index + 1}${photo.caption ? `: ${photo.caption}` : ""}`}
                initial={
                  reduceMotion
                    ? false
                    : { opacity: 0, y: -60, rotate: rotate - 10, scale: 1.04 }
                }
                whileInView={{ opacity: 1, y: 0, rotate, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 140, damping: 14, mass: 0.9 }
                }
              >
                <span className="polaroid-photo">
                  <Photo
                    photo={photo}
                    alt={photo.caption ?? `Photo of Toby ${index + 1}`}
                    lazy
                  />
                  <Doodles index={index} />
                </span>
                <span className="polaroid-caption">{photo.caption}</span>
                {stickers.map((sticker) => (
                  <img
                    key={sticker.className}
                    src={sticker.src}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    decoding="async"
                    className={cn("sticker", sticker.className)}
                  />
                ))}
              </motion.button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {active !== null && (
          <motion.div
            className="lightbox"
            onClick={(e) => {
              if (e.target === e.currentTarget) setActive(null);
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <button
              type="button"
              className="lightbox-close"
              onClick={() => setActive(null)}
              aria-label="Close photo"
            >
              <CloseIcon />
            </button>
            <button
              type="button"
              className="lightbox-save"
              onClick={() => savePhoto(gallery[active], active)}
              aria-label="Save photo"
            >
              <SaveIcon />
            </button>

            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.figure
                key={active}
                className="lightbox-frame"
                custom={direction}
                variants={{
                  enter: (dir: number) =>
                    reduceMotion ? { opacity: 0 } : { opacity: 0, x: dir * 120 },
                  center: { opacity: 1, x: 0 },
                  exit: (dir: number) =>
                    reduceMotion ? { opacity: 0 } : { opacity: 0, x: dir * -120 },
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeOut" }}
                drag={gallery.length > 1 ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onDragEnd={handleDragEnd}
              >
                <Photo
                  photo={gallery[active]}
                  alt={gallery[active].caption ?? `Photo of Toby ${active + 1}`}
                />
                {gallery[active].caption && (
                  <figcaption>{gallery[active].caption}</figcaption>
                )}
              </motion.figure>
            </AnimatePresence>

            {gallery.length > 1 && (
              <>
                <button
                  type="button"
                  className="lightbox-nav lightbox-prev"
                  onClick={() => step(-1)}
                  aria-label="Previous photo"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M15 5l-7 7 7 7" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="lightbox-nav lightbox-next"
                  onClick={() => step(1)}
                  aria-label="Next photo"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            <p className="lightbox-count" aria-live="polite">
              {active + 1} / {gallery.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
