import { motion, useReducedMotion } from "framer-motion";
import { cn } from "../lib/utils";

// Hand-drawn scribbles over a polaroid photo: a wobbly frame, a few hearts or
// sparkles, and a handwritten note. Layouts and notes cycle by index.

const notes = [
  "aww so cute!",
  "so tiny!",
  "cutie alert!",
  "those cheeks!",
  "heart = melted",
  "baby bear ♥",
  "squishy!",
];

// Wobbly frames in a 100x100 box, inset from the photo edge.
const frames = [
  "M7 8C30 5 68 8 93 6C95 30 92 68 94 93C70 95 32 92 6 94C4 70 8 32 7 8Z",
  "M6 7C34 9 66 5 94 8C92 34 95 66 92 94C66 92 34 95 8 92C6 66 4 34 6 7Z",
  "M8 6C32 8 70 4 92 7C95 32 93 70 95 92C68 94 30 96 7 93C5 68 9 30 8 6Z",
];

const heart = (x: number, y: number, s: number) =>
  `M${x} ${y + s * 0.9}C${x - s * 1.6} ${y - s * 0.2} ${x - s * 0.7} ${y - s * 1.3} ${x} ${y - s * 0.4}C${x + s * 0.7} ${y - s * 1.3} ${x + s * 1.6} ${y - s * 0.2} ${x} ${y + s * 0.9}Z`;

const sparkle = (x: number, y: number, s: number) =>
  `M${x} ${y - s}V${y + s}M${x - s} ${y}H${x + s}M${x - s * 0.6} ${y - s * 0.6}L${x + s * 0.6} ${y + s * 0.6}M${x + s * 0.6} ${y - s * 0.6}L${x - s * 0.6} ${y + s * 0.6}`;

const extras = [
  [heart(84, 16, 4), heart(91, 24, 2.4), sparkle(15, 84, 3)],
  [sparkle(16, 15, 3.4), sparkle(24, 10, 2), heart(86, 85, 4)],
  [heart(15, 16, 3.6), sparkle(86, 17, 3), sparkle(80, 86, 2.2)],
];

const notePlacements = ["doodle-note-bottom-left", "doodle-note-top-left", "doodle-note-bottom-right"];

export function Doodles({ index }: { index: number }) {
  const reduceMotion = useReducedMotion();
  const layout = index % frames.length;
  const draw = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { pathLength: 0 },
          whileInView: { pathLength: 1 },
          viewport: { once: true, amount: 0.4 },
          transition: { duration: 1.1, delay, ease: "easeInOut" as const },
        };

  return (
    <span className="doodles" aria-hidden="true">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none">
        <motion.path d={frames[layout]} {...draw(0.4)} />
        {extras[layout].map((d, i) => (
          <motion.path key={i} d={d} {...draw(1.2 + i * 0.2)} />
        ))}
      </svg>
      <span className={cn("doodle-note", notePlacements[layout])}>
        {notes[index % notes.length]}
      </span>
    </span>
  );
}
