/**
 * /decisions/new — Create Decision (Decision Setup UI)
 *
 * Server Component: this milestone is UI/structure only. All form controls
 * are native and uncontrolled (no value/onChange, no React state), so the
 * page can ship as static markup with zero client-side JavaScript while
 * still looking and behaving like real inputs in the browser.
 *
 * "Add Option", "Add Criterion", "Cancel", and "Continue" are inert
 * `type="button"` controls — they establish the intended layout only.
 * Nothing here saves, validates, or submits data yet.
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

        {/* 3. Options Under Consideration */}
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
            <div className="flex flex-col gap-2">
              <label
                htmlFor="option-1"
                className="text-sm font-medium text-foreground"
              >
                Option 1
              </label>
              <input
                id="option-1"
                name="option-1"
                type="text"
                placeholder="e.g. Stay in current apartment"
                className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="option-2"
                className="text-sm font-medium text-foreground"
              >
                Option 2
              </label>
              <input
                id="option-2"
                name="option-2"
                type="text"
                placeholder="e.g. Move to a new apartment"
                className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
              />
            </div>
          </div>

          <button
            type="button"
            className="w-fit rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:border-accent hover:text-accent"
          >
            + Add Option
          </button>
        </section>

        {/* 4. Evaluation Criteria */}
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
              Criteria will be used to evaluate and compare your options
              later. Give each one a name and how much it matters.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 rounded-md border border-border p-4 sm:flex-row sm:items-end sm:gap-4">
              <div className="flex flex-1 flex-col gap-2">
                <label
                  htmlFor="criterion-1-name"
                  className="text-sm font-medium text-foreground"
                >
                  Criterion name
                </label>
                <input
                  id="criterion-1-name"
                  name="criterion-1-name"
                  type="text"
                  placeholder="e.g. Cost"
                  className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-2 sm:w-40">
                <label
                  htmlFor="criterion-1-weight"
                  className="text-sm font-medium text-foreground"
                >
                  Importance
                </label>
                <select
                  id="criterion-1-weight"
                  name="criterion-1-weight"
                  defaultValue="medium"
                  className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-3 rounded-md border border-border p-4 sm:flex-row sm:items-end sm:gap-4">
              <div className="flex flex-1 flex-col gap-2">
                <label
                  htmlFor="criterion-2-name"
                  className="text-sm font-medium text-foreground"
                >
                  Criterion name
                </label>
                <input
                  id="criterion-2-name"
                  name="criterion-2-name"
                  type="text"
                  placeholder="e.g. Commute time"
                  className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-2 sm:w-40">
                <label
                  htmlFor="criterion-2-weight"
                  className="text-sm font-medium text-foreground"
                >
                  Importance
                </label>
                <select
                  id="criterion-2-weight"
                  name="criterion-2-weight"
                  defaultValue="medium"
                  className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="w-fit rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:border-accent hover:text-accent"
          >
            + Add Criterion
          </button>
        </section>

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
