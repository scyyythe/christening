export const event = {
  day: "SUNDAY",
  date: "NOVEMBER 22",
  // Only used for the calendar file; it isn't shown on the page.
  year: 2026,
  // Only the reception time is shown; the christening time is left off on
  // purpose. Also used as the start time in the calendar file.
  receptionTime: "11:00 AM",
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
    name: "Modena Townsquare Clubhouse",
    address: "Modena Town Square, Tunghaan, Minglanilla, Cebu",
    // Approximate spot in Tunghaan, off N. Bacalso Highway, for the in-page
    // map pin. "Open in Google Maps" uses mapsQuery instead.
    lat: 10.2405,
    lng: 123.7885,
    mapsQuery: "Modena Town Square, Tunghaan, Minglanilla, Cebu",
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
