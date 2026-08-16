"use client";

type DecisionDetailsProps = {
  title: string;
  context: string;
  deadline: string;
  urgency: string;
  onTitleChange: (value: string) => void;
  onContextChange: (value: string) => void;
  onDeadlineChange: (value: string) => void;
  onUrgencyChange: (value: string) => void;
};

/**
 * Interactive "Decision Details" section. Renders title, context,
 * deadline, and urgency as controlled inputs and calls the parent's
 * callbacks on change — it no longer owns those state slices itself.
 * State now lives in DecisionSetupForm, the parent Client Component, so a
 * future Continue handler can access it alongside the rest of the
 * Decision Setup form.
 */
export function DecisionDetails({
  title,
  context,
  deadline,
  urgency,
  onTitleChange,
  onContextChange,
  onDeadlineChange,
  onUrgencyChange,
}: DecisionDetailsProps) {
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
          onChange={(event) => onTitleChange(event.target.value)}
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
          onChange={(event) => onContextChange(event.target.value)}
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
          onChange={(event) => onDeadlineChange(event.target.value)}
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
          onChange={(event) => onUrgencyChange(event.target.value)}
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
