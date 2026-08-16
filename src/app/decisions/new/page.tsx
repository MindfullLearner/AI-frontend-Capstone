import { DecisionSetupForm } from "../../components/decision-setup-form";

/**
 * /decisions/new — Create Decision (Decision Setup UI)
 *
 * Server Component: this page has no state or interactivity of its own —
 * it renders the static page header and the interactive Decision Setup
 * form. All decision state (title, context, deadline, urgency, options,
 * criteria, constraints, stakeholders) now lives in a single Client
 * Component boundary, <DecisionSetupForm />, so a future Continue handler
 * can access the complete form state in one place. Nothing here saves,
 * validates, or submits data yet.
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

      <DecisionSetupForm />
    </div>
  );
}
