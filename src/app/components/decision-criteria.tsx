"use client";

import { useId, useState } from "react";

type Criterion = {
  id: string;
  name: string;
  importance: string;
};

const DEFAULT_IMPORTANCE = "medium";

let criterionCounter = 0;

/**
 * Generates a stable, browser-safe id for a new criterion without pulling
 * in a UUID dependency. Combines a render-scoped prefix (from useId) with
 * an incrementing counter so ids stay unique even across many additions —
 * the same strategy already used by DecisionOptions.
 */
function createCriterionId(prefix: string) {
  criterionCounter += 1;
  return `${prefix}-criterion-${criterionCounter}`;
}

function createInitialCriteria(prefix: string): Criterion[] {
  return [
    { id: createCriterionId(prefix), name: "", importance: DEFAULT_IMPORTANCE },
    { id: createCriterionId(prefix), name: "", importance: DEFAULT_IMPORTANCE },
  ];
}

/**
 * Interactive "Evaluation Criteria" section. Lets the user add and remove
 * criteria, each with its own name and importance (the same Low / Medium /
 * High / Critical choices the existing dropdown already used). This is a
 * separate, self-contained Client Component so the "use client" boundary
 * stays scoped to just this section — it does not touch, import, or
 * depend on DecisionOptions in any way.
 *
 * Minimum-criteria decision: the Options section's static copy explicitly
 * said "a decision needs at least two options to compare," and that
 * milestone's spec explicitly mandated a floor of two. The Evaluation
 * Criteria copy carries no equivalent statement — it only ever showed two
 * rows as an example. Since no minimum is stated here and validation is
 * explicitly out of scope this milestone, no floor is enforced: a
 * criterion can be removed down to zero. This doesn't break the page
 * (the list simply renders empty, and "+ Add Criterion" is still there to
 * add more), and nothing downstream depends on criteria existing yet.
 *
 * Values are held in local component state only. Nothing here saves,
 * validates, or submits data yet.
 */
export function DecisionCriteria() {
  const idPrefix = useId();
  const [criteria, setCriteria] = useState<Criterion[]>(() =>
    createInitialCriteria(idPrefix)
  );

  function handleNameChange(id: string, name: string) {
    setCriteria((current) =>
      current.map((criterion) =>
        criterion.id === id ? { ...criterion, name } : criterion
      )
    );
  }

  function handleImportanceChange(id: string, importance: string) {
    setCriteria((current) =>
      current.map((criterion) =>
        criterion.id === id ? { ...criterion, importance } : criterion
      )
    );
  }

  function handleAdd() {
    setCriteria((current) => [
      ...current,
      {
        id: createCriterionId(idPrefix),
        name: "",
        importance: DEFAULT_IMPORTANCE,
      },
    ]);
  }

  function handleRemove(id: string) {
    setCriteria((current) =>
      current.filter((criterion) => criterion.id !== id)
    );
  }

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
                    handleNameChange(criterion.id, event.target.value)
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
                    handleImportanceChange(criterion.id, event.target.value)
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
                onClick={() => handleRemove(criterion.id)}
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
        onClick={handleAdd}
        className="w-fit rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:border-accent hover:text-accent"
      >
        + Add Criterion
      </button>
    </section>
  );
}
