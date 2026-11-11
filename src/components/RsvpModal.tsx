import { useEffect, useState, type FormEvent } from "react";
import { event } from "../data/event";
import { cn } from "../lib/utils";
import { HeartIcon } from "./Icons";
import { Sheet } from "./Sheet";

type Status = "idle" | "sending" | "sent" | "error";

type Rsvp = {
  name: string;
  attending: "yes" | "no";
  guests: number;
  // One name per guest, for the seat list at the catering venue.
  guestNames: string[];
  // Whether they stay for the catered reception; catering needs a seat count.
  reception: boolean;
  message: string;
};

// FormSubmit emails these fields as a table, using each key as the row label.
async function submitRsvp({ name, attending, guests, guestNames, reception, message }: Rsvp) {
  const going = attending === "yes";
  const seats = going && reception ? guests : 0;
  const res = await fetch(`https://formsubmit.co/ajax/${event.rsvpEmail}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      _subject: going
        ? `RSVP: ${name} is coming (${guests} ${guests === 1 ? "guest" : "guests"}, ${seats} catering ${seats === 1 ? "seat" : "seats"})`
        : `RSVP: ${name} can't make it`,
      _template: "table",
      _captcha: "false",
      Name: name,
      Attending: going ? "Joyfully yes" : "Sadly no",
      "Number of guests": going ? String(guests) : "0",
      "Guest names": going ? guestNames.map((n, i) => `${i + 1}. ${n}`).join(", ") : "(none)",
      "Catered reception": going ? (reception ? "Yes, staying" : "No, church only") : "No",
      "Catering seats": String(seats),
      Message: message || "(none)",
      "Sent on": new Date().toLocaleString("en-PH", {
        dateStyle: "full",
        timeStyle: "short",
      }),
      "Website by": "Jil Canete, web developer: https://portfolio-jil-canete.vercel.app/",
    }),
  });
  const reply = (await res.json().catch(() => null)) as { success?: string } | null;
  if (!res.ok || reply?.success !== "true") throw new Error("RSVP failed");
}

const sendingMessages = [
  "Just a moment, sending your RSVP…",
  "Wrapping it up with a little bow…",
  "Your RSVP is on its way to Toby's family…",
  "Almost there, thank you for waiting!",
];

// Shown over the form while the RSVP is sending, so guests know it's working.
function SendingOverlay() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % sendingMessages.length), 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-3xl bg-white/85 px-6 text-center backdrop-blur-sm"
    >
      <div className="flex gap-2" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <HeartIcon
            key={i}
            className="h-7 w-7 animate-bounce text-sky"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
      <p className="mt-4 font-script text-3xl text-navy">Please wait a little bit</p>
      <p key={index} className="mt-2 animate-pulse text-sm text-mist">
        {sendingMessages[index]}
      </p>
    </div>
  );
}

const fieldClass =
  "mt-2 w-full rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-sm text-navy placeholder:text-mist/70 focus:outline-none focus:ring-2 focus:ring-sky";
const labelClass = "text-[0.65rem] font-semibold uppercase tracking-widest text-mist";

export function RsvpModal({ onClose }: { onClose: () => void }) {
  const [attending, setAttending] = useState<"yes" | "no">("yes");
  const [status, setStatus] = useState<Status>("idle");
  const [guests, setGuests] = useState(1);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!event.rsvpEmail) {
      setStatus("error");
      return;
    }
    const data = new FormData(e.currentTarget);
    setStatus("sending");
    try {
      await submitRsvp({
        name: String(data.get("name") ?? "").trim(),
        attending,
        guests,
        guestNames: data.getAll("guestName").map((n) => String(n).trim()),
        reception: data.get("reception") === "yes",
        message: String(data.get("message") ?? "").trim(),
      });
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <Sheet label="RSVP" onClose={onClose} className="sm:max-w-lg">
      <header className="pr-12">
        <p className={labelClass}>Kindly let us know</p>
        <h2 className="font-display text-4xl font-bold uppercase tracking-wider text-navy">
          RSVP
        </h2>
      </header>

      {status === "sent" ? (
        <div className="py-8 text-center">
          <HeartIcon className="mx-auto h-10 w-10 text-sky" />
          <p className="mt-3 font-script text-4xl text-navy">Thank you!</p>
          <p className="mt-2 text-sm text-mist">
            Your RSVP is on its way to Toby&apos;s family.
          </p>
          <button type="button" onClick={onClose} className="btn-primary mt-6">
            Back to the invitation
          </button>
        </div>
      ) : (
        <div className="relative">
        {status === "sending" && <SendingOverlay />}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4" aria-busy={status === "sending"}>
          <div>
            <label htmlFor="rsvp-name" className={labelClass}>
              Your name
            </label>
            <input id="rsvp-name" name="name" required autoComplete="name" className={fieldClass} />
          </div>

          <fieldset>
            <legend className={labelClass}>Will you join us?</legend>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {(["yes", "no"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={attending === value}
                  onClick={() => setAttending(value)}
                  className={cn(
                    "rounded-full border px-4 py-3 text-xs font-semibold uppercase tracking-widest transition",
                    attending === value
                      ? "border-sky bg-sky text-white shadow"
                      : "border-white/70 bg-white/60 text-mist hover:text-navy",
                  )}
                >
                  {value === "yes" ? "Joyfully yes" : "Sadly no"}
                </button>
              ))}
            </div>
          </fieldset>

          {attending === "yes" && (
            <div>
              <label htmlFor="rsvp-guests" className={labelClass}>
                Number of guests
              </label>
              {/* Stepper buttons: typing into a clamped number box made "2" turn into "12" → 10. */}
              <div className="mt-1 flex items-center gap-3">
                <button
                  type="button"
                  aria-label="Fewer guests"
                  onClick={() => setGuests((g) => Math.max(1, g - 1))}
                  disabled={guests <= 1}
                  className="h-11 w-11 shrink-0 rounded-full border border-sky/30 bg-white/70 text-xl font-bold text-navy disabled:opacity-40"
                >
                  −
                </button>
                <output
                  id="rsvp-guests"
                  aria-live="polite"
                  className="min-w-[2.5rem] text-center font-display text-2xl font-bold text-navy"
                >
                  {guests}
                </output>
                <button
                  type="button"
                  aria-label="More guests"
                  onClick={() => setGuests((g) => Math.min(5, g + 1))}
                  disabled={guests >= 5}
                  className="h-11 w-11 shrink-0 rounded-full border border-sky/30 bg-white/70 text-xl font-bold text-navy disabled:opacity-40"
                >
                  +
                </button>
              </div>
              <input type="hidden" name="guests" value={guests} />
            </div>
          )}

          {attending === "yes" && (
            <fieldset>
              <legend className={labelClass}>Names of guests</legend>
              <p className="mt-1 text-xs text-mist">
                Including yourself. We&apos;ll give these names to {event.reception.name} for the
                seat reservation.
              </p>
              <div>
                {Array.from({ length: guests }, (_, i) => (
                  <input
                    key={i}
                    name="guestName"
                    required
                    aria-label={`Guest ${i + 1} name`}
                    placeholder={`Guest ${i + 1}`}
                    className={fieldClass}
                  />
                ))}
              </div>
            </fieldset>
          )}

          {attending === "yes" && (
            <fieldset>
              <legend className={labelClass}>Will you stay for the catered reception?</legend>
              <p className="mt-1 text-xs text-mist">
                We&apos;re reserving catering seats, so please let us know.
              </p>
              {/* Real radios so the browser won't send the form without an answer. */}
              <div className="mt-2 grid grid-cols-2 gap-2">
                {(["yes", "no"] as const).map((value) => (
                  <label key={value} className="cursor-pointer">
                    <input type="radio" name="reception" value={value} required className="peer sr-only" />
                    <span className="block rounded-full border border-white/70 bg-white/60 px-4 py-3 text-center text-xs font-semibold uppercase tracking-widest text-mist transition hover:text-navy peer-checked:border-sky peer-checked:bg-sky peer-checked:text-white peer-checked:shadow peer-focus-visible:ring-2 peer-focus-visible:ring-sky">
                      {value === "yes" ? "Save us seats" : "Church only"}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          <div>
            <label htmlFor="rsvp-message" className={labelClass}>
              A message for Toby (optional)
            </label>
            <textarea id="rsvp-message" name="message" rows={3} className={fieldClass} />
          </div>

          {status === "error" && (
            <p role="alert" className="rounded-2xl bg-white/70 px-4 py-3 text-xs text-ink">
              {event.rsvpEmail
                ? "We couldn't send your RSVP just now. Please try again in a moment."
                : "Online RSVP isn't set up yet. Please message Toby's family directly."}
            </p>
          )}

          <button type="submit" className="btn-primary w-full" disabled={status === "sending"}>
            {status === "sending" ? "Sending…" : "Send RSVP"}
          </button>
        </form>
        </div>
      )}
    </Sheet>
  );
}
