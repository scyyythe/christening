import { useState, type FormEvent } from "react";
import { event } from "../data/event";
import { cn } from "../lib/utils";
import { HeartIcon } from "./Icons";
import { Sheet } from "./Sheet";

type Status = "idle" | "sending" | "sent" | "error";

async function submitRsvp(data: FormData) {
  try {
    const res = await fetch(event.rsvpUrl, {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error(`RSVP failed (${res.status})`);
  } catch (err) {
    // Google Apps Script answers with a redirect browsers block under CORS.
    // A no-cors POST still delivers the form; we just can't read the reply.
    if (err instanceof TypeError) {
      await fetch(event.rsvpUrl, { method: "POST", body: data, mode: "no-cors" });
      return;
    }
    throw err;
  }
}

const fieldClass =
  "mt-2 w-full rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-sm text-navy placeholder:text-mist/70 focus:outline-none focus:ring-2 focus:ring-sky";
const labelClass = "text-[0.65rem] font-semibold uppercase tracking-widest text-mist";

export function RsvpModal({ onClose }: { onClose: () => void }) {
  const [attending, setAttending] = useState<"yes" | "no">("yes");
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!event.rsvpUrl) {
      setStatus("error");
      return;
    }
    const data = new FormData(e.currentTarget);
    data.set("attending", attending);
    data.set("submittedAt", new Date().toISOString());
    setStatus("sending");
    try {
      await submitRsvp(data);
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

          <div>
            <label htmlFor="rsvp-message" className={labelClass}>
              A message for Toby (optional)
            </label>
            <textarea id="rsvp-message" name="message" rows={3} className={fieldClass} />
          </div>

          {status === "error" && (
            <p role="alert" className="rounded-2xl bg-white/70 px-4 py-3 text-xs text-ink">
              {event.rsvpUrl
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
