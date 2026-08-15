"use client";

import { useState } from "react";

/**
 * Interactive "Constraints & Stakeholders" section. Makes the two
 * textareas controlled inputs, each backed by its own piece of state, so
 * typing in one never affects the other. This is a separate,
 * self-contained Client Component so the "use client" boundary stays
 * scoped to just this section — it does not touch, import, or depend on
 * DecisionOptions or DecisionCriteria.
 *
 * Values are held in local component state only. Nothing here saves,
 * validates, or submits data yet.
 */
export function DecisionContext() {
  const [constraints, setConstraints] = useState("");
  const [stakeholders, setStakeholders] = useState("");

  return (
    <section
      aria-labelledby="constraints-stakeholders-heading"
      className="flex flex-col gap-5 rounded-lg border border-border bg-surface p-6"
    >
      <h2
        id="constraints-stakeholders-heading"
        className="text-lg font-semibold text-foreground"
      >
        Constraints &amp; Stakeholders
      </h2>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="constraints"
          className="text-sm font-medium text-foreground"
        >
          Constraints
        </label>
        <textarea
          id="constraints"
          name="constraints"
          rows={3}
          value={constraints}
          onChange={(event) => setConstraints(event.target.value)}
          placeholder="Describe any limitations or requirements, such as budget, timing, or policy."
          className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="stakeholders"
          className="text-sm font-medium text-foreground"
        >
          Stakeholders
        </label>
        <textarea
          id="stakeholders"
          name="stakeholders"
          rows={3}
          value={stakeholders}
          onChange={(event) => setStakeholders(event.target.value)}
          placeholder="Who is affected by this decision, or who should be consulted?"
          className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
        />
      </div>
    </section>
  );
}
