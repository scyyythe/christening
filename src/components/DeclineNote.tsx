import { PeekingBear } from "./Bear";
import { HeartIcon } from "./Icons";
import { Sheet } from "./Sheet";

// Shown when a guest says they can't come. No form: just a kind note.
export function DeclineNote({ onClose }: { onClose: () => void }) {
  return (
    <Sheet label="That's okay" onClose={onClose} className="sm:max-w-sm">
      <div className="py-4 text-center">
        <PeekingBear className="mx-auto w-28" />
        <p className="mt-2 font-script text-5xl leading-tight text-navy">That&apos;s okay!</p>
        <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-mist">
          We&apos;ll miss you, but thank you for letting us know. Toby sends you a
          big bear hug!
        </p>
        <button type="button" onClick={onClose} className="btn-primary mt-6">
          <HeartIcon className="h-4 w-4" />
          Aww, okay
        </button>
      </div>
    </Sheet>
  );
}
