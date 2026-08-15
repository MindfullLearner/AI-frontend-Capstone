"use client";

import { useState } from "react";

/**
 * Interactive "Decision Details" section. Makes title, context, deadline,
 * and urgency controlled inputs, each backed by its own piece of state, so
 * changing one never affects the others. This is a separate,
 * self-contained Client Component so the "use client" boundary stays
 * scoped to just this section — it does not touch, import, or depend on
 * DecisionOptions, DecisionCriteria, or DecisionContext.
 *
 * "Decision title" and "Context / background" preserve the exact heading,
 * labels, placeholders, input types, and classes already established for
 * this section. "Deadline" and "Urgency" did not previously exist as
 * fields in this Next.js page — they're added here per this milestone's
 * spec, modeled on the deadline/urgency field from the round-1-vague
 * branch (the closest existing reference, and its default matches this
 * milestone's state shape), restyled to match this app's existing
 * input/select classes and single-column layout.
 *
 * Values are held in local component state only. Nothing here saves,
 * validates, or submits data yet.
 */
export function DecisionDetails() {
  const [title, setTitle] = useState("");
  const [context, setContext] = useState("");
  const [deadline, setDeadline] = useState("");
  const [urgency, setUrgency] = useState("medium");

  return (
    <section
      aria-labelledby="decision-details-heading"
      className="flex flex-col gap-5 rounded-lg border border-border bg-surface p-6"
    >
      <h2
        id="decision-details-heading"
        className="text-lg font-semibold text-foreground"
      >
        Decision Details
      </h2>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="decision-title"
          className="text-sm font-medium text-foreground"
        >
          Decision title
        </label>
        <input
          id="decision-title"
          name="decision-title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="e.g. Choosing a new apartment"
          className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="decision-context"
          className="text-sm font-medium text-foreground"
        >
          Context / background
        </label>
        <textarea
          id="decision-context"
          name="decision-context"
          rows={4}
          value={context}
          onChange={(event) => setContext(event.target.value)}
          placeholder="Describe the situation, why this decision matters, and any relevant background."
          className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="decision-deadline"
          className="text-sm font-medium text-foreground"
        >
          Deadline
        </label>
        <input
          id="decision-deadline"
          name="decision-deadline"
          type="date"
          value={deadline}
          onChange={(event) => setDeadline(event.target.value)}
          className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="decision-urgency"
          className="text-sm font-medium text-foreground"
        >
          Urgency
        </label>
        <select
          id="decision-urgency"
          name="decision-urgency"
          value={urgency}
          onChange={(event) => setUrgency(event.target.value)}
          className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
        >
          <option value="low">Low — can wait</option>
          <option value="medium">Medium — decide soon</option>
          <option value="high">High — time-sensitive</option>
          <option value="critical">Critical — immediate</option>
        </select>
      </div>
    </section>
  );
}
