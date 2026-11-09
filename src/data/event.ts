export const event = {
  day: "SUNDAY",
  date: "NOVEMBER 22",
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
    // What "Open in Google Maps" searches for; empty means use lat/lng.
    mapsQuery: "",
  },
  reception: {
    name: "Elyssa Catering Services",
    address: "563 Tungkop Barangay Rd, Minglanilla, Cebu",
    // Centre of Barangay Tungkop (approximate) for the in-page map pin.
    lat: 10.23274,
    lng: 123.78516,
    mapsQuery: "Elyssa Catering Services, 563 Tungkop Barangay Rd, Minglanilla, Cebu",
  },
  // QR code for monetary gifts (GCash, bank, etc.), e.g. "/gift-qr.png" in
  // the public folder. Empty shows a "coming soon" placeholder.
  giftQrSrc: "",
  // RSVPs are emailed here through FormSubmit (formsubmit.co).
  rsvpEmail: "angeliquealfante@gmail.com",
  // Fallback when rsvpEmail is empty: a Messenger (m.me/...) or sms: link.
  rsvpMessenger: "",
  // Optional background music file, e.g. "/music.mp3" in the public folder.
  musicSrc: "",
};

export type Venue = typeof event.church;
