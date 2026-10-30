import { event } from "../data/event";

const MONTHS = [
  "JANUARY",
  "FEBRUARY",
  "MARCH",
  "APRIL",
  "MAY",
  "JUNE",
  "JULY",
  "AUGUST",
  "SEPTEMBER",
  "OCTOBER",
  "NOVEMBER",
  "DECEMBER",
];

type LocalTime = {
  year: number;
  month: number;
  day: number;
  hours: number;
  minutes: number;
};

// Reads "DECEMBER 12" + "10:00 AM" from the event data. Returns null when
// they can't be parsed, so calendar buttons can hide themselves.
export function getEventStart(): LocalTime | null {
  const [monthName, dayText] = event.date.trim().toUpperCase().split(/\s+/);
  const month = MONTHS.indexOf(monthName);
  const day = Number(dayText);
  const time = event.time
    .trim()
    .toUpperCase()
    .match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);
  if (month < 0 || !day || !time) return null;

  let hours = Number(time[1]) % 12;
  if (time[3] === "PM") hours += 12;
  return { year: event.year, month, day, hours, minutes: Number(time[2]) };
}

const pad = (n: number) => String(n).padStart(2, "0");

function formatLocal(t: LocalTime) {
  return `${t.year}${pad(t.month + 1)}${pad(t.day)}T${pad(t.hours)}${pad(t.minutes)}00`;
}

function addHours(t: LocalTime, hours: number): LocalTime {
  // Date.UTC keeps the arithmetic free of the viewer's own timezone.
  const d = new Date(
    Date.UTC(t.year, t.month, t.day, t.hours, t.minutes) + hours * 3_600_000,
  );
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth(),
    day: d.getUTCDate(),
    hours: d.getUTCHours(),
    minutes: d.getUTCMinutes(),
  };
}

function escapeIcs(text: string) {
  return text.replace(/[\\;,]/g, (c) => `\\${c}`);
}

export function downloadCalendarFile(start: LocalTime) {
  const end = addHours(start, event.durationHours);
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Thobias Noah Christening//EN",
    // Manila has no daylight saving, so one fixed +08:00 rule covers it.
    "BEGIN:VTIMEZONE",
    "TZID:Asia/Manila",
    "BEGIN:STANDARD",
    "DTSTART:19700101T000000",
    "TZOFFSETFROM:+0800",
    "TZOFFSETTO:+0800",
    "TZNAME:PHT",
    "END:STANDARD",
    "END:VTIMEZONE",
    "BEGIN:VEVENT",
    `UID:thobias-noah-christening-${formatLocal(start)}@invite`,
    // DTSTAMP must be UTC.
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").slice(0, 15)}Z`,
    `DTSTART;TZID=Asia/Manila:${formatLocal(start)}`,
    `DTEND;TZID=Asia/Manila:${formatLocal(end)}`,
    "SUMMARY:Thobias Noah's Christening",
    `LOCATION:${escapeIcs(`${event.church.name}, ${event.church.address}`)}`,
    `DESCRIPTION:${escapeIcs(
      `Reception to follow at ${event.reception.name}, ${event.reception.address}`,
    )}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "thobias-noah-christening.ics";
  link.click();
  // Give the browser a moment to start the download before freeing the URL.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
