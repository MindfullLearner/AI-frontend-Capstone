import { DecisionOptions } from "../../components/decision-options";
import { DecisionCriteria } from "../../components/decision-criteria";

/**
 * /decisions/new — Create Decision (Decision Setup UI)
 *
 * Server Component: most of this page is still UI/structure only. Form
 * controls are native and uncontrolled (no value/onChange, no React state),
 * so the page ships as static markup with minimal client-side JavaScript.
 *
 * "Options Under Consideration" and "Evaluation Criteria" are the
 * interactive pieces so far — rendered via <DecisionOptions /> and
 * <DecisionCriteria />, each a small, independent Client Component that
 * owns its own state. Everything else, including "Cancel" and "Continue",
 * remains inert `type="button"` controls that only establish the intended
 * layout. Nothing here saves, validates, or submits data yet.
 */
export default function NewDecisionPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16 sm:px-8 sm:py-20">
      {/* 1. Page header */}
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Create a Decision
        </h1>
        <p className="max-w-prose text-base leading-7 text-muted">
          Provide the information ThinkLens needs to understand and analyze
          your decision: what you&apos;re deciding, the options you&apos;re
          weighing, and what matters most.
        </p>
      </header>

      <form className="mt-10 flex flex-col gap-10">
        {/* 2. Decision Details */}
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
              placeholder="Describe the situation, why this decision matters, and any relevant background."
              className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
            />
          </div>
        </section>

        {/* 3. Options Under Consideration — interactive Client Component */}
        <DecisionOptions />

        {/* 4. Evaluation Criteria — interactive Client Component */}
        <DecisionCriteria />

        {/* 5. Constraints & Stakeholders */}
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
              placeholder="Who is affected by this decision, or who should be consulted?"
              className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
            />
          </div>
        </section>

        {/* 6. Bottom action area */}
        <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">
            This form does not save or analyze your decision yet — that
            arrives in a later milestone.
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:border-accent"
            >
              Cancel
            </button>
            <button
              type="button"
              className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
            >
              Continue
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
