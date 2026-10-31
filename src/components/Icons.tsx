import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

// Line icons in a 24px grid; they take their colour from `currentColor`.
function Icon({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export const ChurchIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 2v4M10 4h4" />
    <path d="M6 21V11l6-5 6 5v10" />
    <path d="M3 21h18" />
    <path d="M10 21v-4a2 2 0 0 1 4 0v4" />
  </Icon>
);

export const HouseIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M3 11 12 4l9 7" />
    <path d="M5 10v11h14V10" />
    <path d="M10 21v-6h4v6" />
  </Icon>
);

export const CalendarIcon = (props: IconProps) => (
  <Icon {...props}>
    <rect x="3" y="5" width="18" height="16" rx="3" />
    <path d="M8 3v4M16 3v4M3 10h18" />
  </Icon>
);

export const PinIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </Icon>
);

export const HeartIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M12 20s-7.5-4.6-9.3-9.2C1.6 7.6 3.6 4.5 7 4.5c2 0 3.5 1.2 5 3 1.5-1.8 3-3 5-3 3.4 0 5.4 3.1 4.3 6.3C19.5 15.4 12 20 12 20Z" />
  </Icon>
);

export const LocateIcon = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
  </Icon>
);

export const CloseIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Icon>
);

export const ChevronIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M9 5l7 7-7 7" />
  </Icon>
);

export const SoundOnIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M4 9v6h4l5 4V5L8 9Z" />
    <path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" />
  </Icon>
);

export const SoundOffIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M4 9v6h4l5 4V5L8 9Z" />
    <path d="M17 9l5 5M22 9l-5 5" />
  </Icon>
);

export const ReplayIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M4 12a8 8 0 1 0 2.4-5.7" />
    <path d="M4 4v4h4" />
  </Icon>
);
