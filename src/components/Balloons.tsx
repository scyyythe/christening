import { motion, useReducedMotion } from "framer-motion";

type Balloon = {
  cx: number;
  cy: number;
  r: number;
  fill: string;
  sway: number;
};

// Soft blue, white and gold balloons whose strings meet at one point (the
// bear's paw) at the bottom-right of the viewBox.
const balloons: Balloon[] = [
  { cx: 70, cy: 95, r: 44, fill: "#BFDDF3", sway: 3 },
  { cx: 150, cy: 60, r: 48, fill: "#3E7CC4", sway: -2.5 },
  { cx: 225, cy: 105, r: 42, fill: "#FFFFFF", sway: 2 },
  { cx: 120, cy: 150, r: 38, fill: "#E8B04B", sway: -3.5 },
  { cx: 200, cy: 175, r: 36, fill: "#8FB8E3", sway: 2.8 },
];

const KNOT_X = 205;
const KNOT_Y = 300;

export function Balloons({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.svg
      viewBox="0 0 280 310"
      className={className}
      aria-hidden="true"
      style={{ originX: `${KNOT_X}px`, originY: `${KNOT_Y}px` }}
      animate={reduceMotion ? undefined : { rotate: [-2.5, 2.5, -2.5] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    >
      <defs>
        <radialGradient id="balloon-shine" cx="0.35" cy="0.3" r="0.6">
          <stop offset="0" stopColor="#fff" stopOpacity="0.75" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      {balloons.map((b, i) => (
        <motion.g
          key={i}
          style={{ originX: `${KNOT_X}px`, originY: `${KNOT_Y}px` }}
          animate={reduceMotion ? undefined : { rotate: [0, b.sway, 0] }}
          transition={{
            duration: 4 + i * 0.7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <path
            d={`M${b.cx} ${b.cy + b.r * 1.15} Q ${(b.cx + KNOT_X) / 2 - 10} ${(b.cy + KNOT_Y) / 2 + 20} ${KNOT_X} ${KNOT_Y}`}
            fill="none"
            stroke="#6B86A8"
            strokeOpacity="0.6"
            strokeWidth="1.4"
          />
          <ellipse
            cx={b.cx}
            cy={b.cy}
            rx={b.r * 0.86}
            ry={b.r}
            fill={b.fill}
            stroke="#0F2557"
            strokeOpacity="0.08"
          />
          <ellipse cx={b.cx} cy={b.cy} rx={b.r * 0.86} ry={b.r} fill="url(#balloon-shine)" />
          <path
            d={`M${b.cx - 5} ${b.cy + b.r + 6} L${b.cx} ${b.cy + b.r - 1} L${b.cx + 5} ${b.cy + b.r + 6} Z`}
            fill={b.fill}
          />
        </motion.g>
      ))}
    </motion.svg>
  );
}
