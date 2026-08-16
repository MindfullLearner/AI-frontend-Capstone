"use client";

export type Option = {
  id: string;
  value: string;
};

export const MIN_OPTIONS = 2;

let optionCounter = 0;

/**
 * Generates a stable, browser-safe id for a new option without pulling in
 * a UUID dependency. Combines a render-scoped prefix (supplied by the
 * caller, typically from useId()) with an incrementing counter so ids
 * stay unique even across many additions. Exported so DecisionSetupForm
 * can use the same id-generation strategy when initializing state and
 * adding options, while the logic itself still lives here.
 */
export function createOptionId(prefix: string) {
  optionCounter += 1;
  return `${prefix}-option-${optionCounter}`;
}

export function createInitialOptions(prefix: string): Option[] {
  return [
    { id: createOptionId(prefix), value: "" },
    { id: createOptionId(prefix), value: "" },
  ];
}

type DecisionOptionsProps = {
  options: Option[];
  onChange: (id: string, value: string) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
};

/**
 * Interactive "Options Under Consideration" section. Renders the options
 * list and calls the parent's callbacks on add/remove/edit — it no longer
 * owns the options array itself. State now lives in DecisionSetupForm, the
 * parent Client Component, so a future Continue handler can access it
 * alongside the rest of the Decision Setup form.
 *
 * The minimum-two-options behavior is unchanged: the Remove button is
 * disabled once only MIN_OPTIONS remain, and the parent's onRemove
 * handler enforces the same floor when actually updating state.
 */
export function DecisionOptions({
  options,
  onChange,
  onAdd,
  onRemove,
}: DecisionOptionsProps) {
  const canRemove = options.length > MIN_OPTIONS;

  return (
    <section
      aria-labelledby="options-heading"
      className="flex flex-col gap-5 rounded-lg border border-border bg-surface p-6"
    >
      <div className="flex flex-col gap-2">
        <h2
          id="options-heading"
          className="text-lg font-semibold text-foreground"
        >
          Options Under Consideration
        </h2>
        <p className="text-sm text-muted">
          List the alternatives you&apos;re weighing. A decision needs at
          least two options to compare.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {options.map((option, index) => {
          const optionNumber = index + 1;
          const inputId = `${option.id}-input`;

          return (
            <div key={option.id} className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-3">
                <label
                  htmlFor={inputId}
                  className="text-sm font-medium text-foreground"
                >
                  Option {optionNumber}
                </label>

                <button
                  type="button"
                  onClick={() => onRemove(option.id)}
                  disabled={!canRemove}
                  aria-label={`Remove Option ${optionNumber}`}
                  className="text-sm font-medium text-muted hover:text-accent disabled:cursor-not-allowed disabled:text-muted/40 disabled:hover:text-muted/40"
                >
                  Remove
                </button>
              </div>

              <input
                id={inputId}
                name={inputId}
                type="text"
                value={option.value}
                onChange={(event) => onChange(option.id, event.target.value)}
                placeholder={
                  optionNumber === 1
                    ? "e.g. Stay in current apartment"
                    : optionNumber === 2
                      ? "e.g. Move to a new apartment"
                      : "Describe this option"
                }
                className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
              />
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onAdd}
        className="w-fit rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:border-accent hover:text-accent"
      >
        + Add Option
      </button>
    </section>
  );
}
