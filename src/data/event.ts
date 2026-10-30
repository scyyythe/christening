export const event = {
  day: "SUNDAY",
  date: "DECEMBER 12",
  // Only used for the calendar file; it isn't shown on the page.
  year: 2026,
  time: "10:00 AM",
  // Length of the event in the calendar file.
  durationHours: 3,
  church: {
    name: "[Church Name]",
    address: "[Address], [City]",
    lat: 14.5995,
    lng: 120.9842,
  },
  reception: {
    name: "[Reception Venue]",
    address: "[Address], [City]",
    lat: 14.601,
    lng: 120.99,
  },
  ninongs: ["[Ninong's name]", "[Ninong's name]"],
  ninangs: ["[Ninang's name]", "[Ninang's name]"],
  // Form endpoint (Google Apps Script, Formspree, ...) the RSVP form POSTs to.
  rsvpUrl: "",
  // Fallback when rsvpUrl is empty: a Messenger (m.me/...) or sms: link.
  rsvpMessenger: "",
  // Optional background music file, e.g. "/music.mp3" in the public folder.
  musicSrc: "",
};

export type Venue = typeof event.church;
