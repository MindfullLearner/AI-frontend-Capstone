"use client";

type DecisionContextProps = {
  constraints: string;
  stakeholders: string;
  onConstraintsChange: (value: string) => void;
  onStakeholdersChange: (value: string) => void;
};

/**
 * Interactive "Constraints & Stakeholders" section. Renders the two
 * textareas as controlled inputs and calls the parent's callbacks on
 * change — it no longer owns constraints/stakeholders state itself. State
 * now lives in DecisionSetupForm, the parent Client Component, so a
 * future Continue handler can access it alongside the rest of the
 * Decision Setup form.
 */
export function DecisionContext({
  constraints,
  stakeholders,
  onConstraintsChange,
  onStakeholdersChange,
}: DecisionContextProps) {
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
          onChange={(event) => onConstraintsChange(event.target.value)}
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
          onChange={(event) => onStakeholdersChange(event.target.value)}
          placeholder="Who is affected by this decision, or who should be consulted?"
          className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
        />
      </div>
    </section>
  );
}
