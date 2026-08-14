"use client";

import { useId, useState } from "react";

type Option = {
  id: string;
  value: string;
};

const MIN_OPTIONS = 2;

let optionCounter = 0;

/**
 * Generates a stable, browser-safe id for a new option without pulling in
 * a UUID dependency. Combines a render-scoped prefix (from useId) with an
 * incrementing counter so ids stay unique even across many additions.
 */
function createOptionId(prefix: string) {
  optionCounter += 1;
  return `${prefix}-option-${optionCounter}`;
}

function createInitialOptions(prefix: string): Option[] {
  return [
    { id: createOptionId(prefix), value: "" },
    { id: createOptionId(prefix), value: "" },
  ];
}

/**
 * Interactive "Options Under Consideration" section. Lets the user add and
 * remove options, with a minimum of two always enforced. This is the only
 * interactive piece of the Decision Setup page in this milestone — the
 * "use client" boundary is scoped to just this component so the rest of
 * /decisions/new can stay a Server Component.
 *
 * Values are held in local component state only. Nothing here saves,
 * validates, or submits data yet.
 */
export function DecisionOptions() {
  const idPrefix = useId();
  const [options, setOptions] = useState<Option[]>(() =>
    createInitialOptions(idPrefix)
  );

  const canRemove = options.length > MIN_OPTIONS;

  function handleChange(id: string, value: string) {
    setOptions((current) =>
      current.map((option) => (option.id === id ? { ...option, value } : option))
    );
  }

  function handleAdd() {
    setOptions((current) => [
      ...current,
      { id: createOptionId(idPrefix), value: "" },
    ]);
  }

  function handleRemove(id: string) {
    setOptions((current) =>
      current.length > MIN_OPTIONS
        ? current.filter((option) => option.id !== id)
        : current
    );
  }

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
                  onClick={() => handleRemove(option.id)}
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
                onChange={(event) => handleChange(option.id, event.target.value)}
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
        onClick={handleAdd}
        className="w-fit rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:border-accent hover:text-accent"
      >
        + Add Option
      </button>
    </section>
  );
}
