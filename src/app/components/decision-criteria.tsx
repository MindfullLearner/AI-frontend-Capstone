"use client";

export type Criterion = {
  id: string;
  name: string;
  importance: string;
};

export const DEFAULT_IMPORTANCE = "medium";

let criterionCounter = 0;

/**
 * Generates a stable, browser-safe id for a new criterion without pulling
 * in a UUID dependency. Combines a render-scoped prefix (supplied by the
 * caller, typically from useId()) with an incrementing counter so ids
 * stay unique even across many additions — the same strategy used by
 * DecisionOptions. Exported so DecisionSetupForm can use the same
 * id-generation strategy when initializing state and adding criteria,
 * while the logic itself still lives here.
 */
export function createCriterionId(prefix: string) {
  criterionCounter += 1;
  return `${prefix}-criterion-${criterionCounter}`;
}

export function createInitialCriteria(prefix: string): Criterion[] {
  return [
    { id: createCriterionId(prefix), name: "", importance: DEFAULT_IMPORTANCE },
    { id: createCriterionId(prefix), name: "", importance: DEFAULT_IMPORTANCE },
  ];
}

type DecisionCriteriaProps = {
  criteria: Criterion[];
  onNameChange: (id: string, name: string) => void;
  onImportanceChange: (id: string, importance: string) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
};

/**
 * Interactive "Evaluation Criteria" section. Renders the criteria list and
 * calls the parent's callbacks on add/remove/edit — it no longer owns the
 * criteria array itself. State now lives in DecisionSetupForm, the parent
 * Client Component, so a future Continue handler can access it alongside
 * the rest of the Decision Setup form.
 *
 * Minimum-criteria behavior is unchanged from the previous milestone: no
 * floor is enforced, matching the original decision that this section
 * (unlike Options) never stated a minimum requirement.
 */
export function DecisionCriteria({
  criteria,
  onNameChange,
  onImportanceChange,
  onAdd,
  onRemove,
}: DecisionCriteriaProps) {
  return (
    <section
      aria-labelledby="criteria-heading"
      className="flex flex-col gap-5 rounded-lg border border-border bg-surface p-6"
    >
      <div className="flex flex-col gap-2">
        <h2
          id="criteria-heading"
          className="text-lg font-semibold text-foreground"
        >
          Evaluation Criteria
        </h2>
        <p className="text-sm text-muted">
          Criteria will be used to evaluate and compare your options later.
          Give each one a name and how much it matters.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {criteria.map((criterion, index) => {
          const criterionNumber = index + 1;
          const nameId = `${criterion.id}-name`;
          const importanceId = `${criterion.id}-importance`;

          return (
            <div
              key={criterion.id}
              className="flex flex-col gap-3 rounded-md border border-border p-4 sm:flex-row sm:items-end sm:gap-4"
            >
              <div className="flex flex-1 flex-col gap-2">
                <label
                  htmlFor={nameId}
                  className="text-sm font-medium text-foreground"
                >
                  Criterion {criterionNumber} name
                </label>
                <input
                  id={nameId}
                  name={nameId}
                  type="text"
                  value={criterion.name}
                  onChange={(event) =>
                    onNameChange(criterion.id, event.target.value)
                  }
                  placeholder="e.g. Cost"
                  className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-2 sm:w-40">
                <label
                  htmlFor={importanceId}
                  className="text-sm font-medium text-foreground"
                >
                  Importance
                </label>
                <select
                  id={importanceId}
                  name={importanceId}
                  value={criterion.importance}
                  onChange={(event) =>
                    onImportanceChange(criterion.id, event.target.value)
                  }
                  className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => onRemove(criterion.id)}
                aria-label={`Remove Criterion ${criterionNumber}`}
                className="w-fit self-start text-sm font-medium text-muted hover:text-accent sm:self-end sm:pb-2"
              >
                Remove
              </button>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onAdd}
        className="w-fit rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:border-accent hover:text-accent"
      >
        + Add Criterion
      </button>
    </section>
  );
}
