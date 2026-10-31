export const event = {
  day: "SUNDAY",
  date: "DECEMBER 12",
  // Only used for the calendar file; it isn't shown on the page.
  year: 2026,
  time: "10:00 AM",
  // Length of the event in the calendar file.
  durationHours: 3,
  church: {
    name: "Our Lady of the Holy Rosary Parish",
    address: "Natalio B. Bacalso S National Hwy, Minglanilla, Cebu",
    // Plus code 6QPG+V9C, Minglanilla.
    lat: 10.23719,
    lng: 123.77589,
  },
  reception: {
    name: "[Reception Venue]",
    address: "[Address], [City]",
    lat: 14.601,
    lng: 120.99,
  },
  ninongs: ["[Ninong's name]", "[Ninong's name]"],
  ninangs: ["[Ninang's name]", "[Ninang's name]"],
  // RSVPs are emailed here through FormSubmit (formsubmit.co).
  rsvpEmail: "angeliquealfante@gmail.com",
  // Fallback when rsvpEmail is empty: a Messenger (m.me/...) or sms: link.
  rsvpMessenger: "",
  // Optional background music file, e.g. "/music.mp3" in the public folder.
  musicSrc: "",
};

export type Venue = typeof event.church;
