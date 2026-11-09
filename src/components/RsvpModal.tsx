import { useState, type FormEvent } from "react";
import { event } from "../data/event";
import { cn } from "../lib/utils";
import { HeartIcon } from "./Icons";
import { Sheet } from "./Sheet";

type Status = "idle" | "sending" | "sent" | "error";

type Rsvp = {
  name: string;
  attending: "yes" | "no";
  guests: number;
  // Whether they stay for the catered reception; catering needs a seat count.
  reception: boolean;
  message: string;
};

// FormSubmit emails these fields as a table, using each key as the row label.
async function submitRsvp({ name, attending, guests, reception, message }: Rsvp) {
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
      "Catered reception": going ? (reception ? "Yes, staying" : "No, church only") : "No",
      "Catering seats": String(seats),
      Message: message || "(none)",
      "Sent on": new Date().toLocaleString("en-PH", {
        dateStyle: "full",
        timeStyle: "short",
      }),
    }),
  });
  const reply = (await res.json().catch(() => null)) as { success?: string } | null;
  if (!res.ok || reply?.success !== "true") throw new Error("RSVP failed");
}

const fieldClass =
  "mt-2 w-full rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-sm text-navy placeholder:text-mist/70 focus:outline-none focus:ring-2 focus:ring-sky";
const labelClass = "text-[0.65rem] font-semibold uppercase tracking-widest text-mist";

export function RsvpModal({ onClose }: { onClose: () => void }) {
  const [attending, setAttending] = useState<"yes" | "no">("yes");
  const [status, setStatus] = useState<Status>("idle");

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
        guests: Number(data.get("guests") ?? 0),
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
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
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
              <input
                id="rsvp-guests"
                name="guests"
                type="number"
                min={1}
                max={10}
                defaultValue={1}
                required
                className={fieldClass}
              />
            </div>
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
      )}
    </Sheet>
  );
}
