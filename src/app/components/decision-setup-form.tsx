"use client";

import { useId, useState, type FormEvent } from "react";
import {
  DecisionOptions,
  createInitialOptions,
  createOptionId,
  MIN_OPTIONS,
  type Option,
} from "./decision-options";
import {
  DecisionCriteria,
  createInitialCriteria,
  createCriterionId,
  DEFAULT_IMPORTANCE,
  type Criterion,
} from "./decision-criteria";
import { DecisionContext } from "./decision-context";
import { DecisionDetails } from "./decision-details";

const URGENCY_LABELS: Record<string, string> = {
  low: "Low — can wait",
  medium: "Medium — decide soon",
  high: "High — time-sensitive",
  critical: "Critical — immediate",
};

const IMPORTANCE_LABELS: Record<string, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

type FormErrors = {
  title?: string;
  context?: string;
  deadline?: string;
  options?: string;
};

type DecisionPreview = {
  title: string;
  context: string;
  deadline: string;
  urgency: string;
  options: string[];
  criteria: { name: string; importance: string }[];
  constraints: string;
  stakeholders: string;
};

function hasNonWhitespaceText(value: string) {
  return value.trim().length > 0;
}

function countFilledOptions(options: Option[]) {
  return options.filter((option) => hasNonWhitespaceText(option.value)).length;
}

/** Compare YYYY-MM-DD from a date input to today's local calendar date. */
function isDeadlineBeforeToday(deadline: string) {
  const parts = deadline.split("-").map(Number);
  if (parts.length !== 3 || parts.some((part) => Number.isNaN(part))) {
    return false;
  }

  const [year, month, day] = parts;
  const deadlineDate = new Date(year, month - 1, day);
  const today = new Date();
  const todayStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  return deadlineDate < todayStart;
}

function validateForm(
  title: string,
  context: string,
  deadline: string,
  options: Option[]
): FormErrors {
  const errors: FormErrors = {};

  if (!hasNonWhitespaceText(title)) {
    errors.title = "Enter a decision title.";
  }

  if (!hasNonWhitespaceText(context)) {
    errors.context = "Enter context or background for this decision.";
  }

  if (countFilledOptions(options) < MIN_OPTIONS) {
    errors.options =
      "Enter at least two options with text. Blank or whitespace-only options do not count.";
  }

  if (deadline.trim() !== "" && isDeadlineBeforeToday(deadline)) {
    errors.deadline = "Deadline cannot be earlier than today.";
  }

  return errors;
}

function buildPreview(
  title: string,
  context: string,
  deadline: string,
  urgency: string,
  options: Option[],
  criteria: Criterion[],
  constraints: string,
  stakeholders: string
): DecisionPreview {
  return {
    title: title.trim(),
    context: context.trim(),
    deadline: deadline.trim(),
    urgency,
    options: options
      .map((option) => option.value.trim())
      .filter((value) => value.length > 0),
    criteria: criteria
      .filter((criterion) => hasNonWhitespaceText(criterion.name))
      .map((criterion) => ({
        name: criterion.name.trim(),
        importance: criterion.importance,
      })),
    constraints: constraints.trim(),
    stakeholders: stakeholders.trim(),
  };
}

/**
 * Client Component parent for the entire Decision Setup form. Owns decision
 * state, validates on Continue, and shows a structured preview when valid.
 */
export function DecisionSetupForm() {
  const idPrefix = useId();

  const titleErrorId = `${idPrefix}-title-error`;
  const contextErrorId = `${idPrefix}-context-error`;
  const deadlineErrorId = `${idPrefix}-deadline-error`;
  const optionsErrorId = `${idPrefix}-options-error`;

  const [title, setTitle] = useState("");
  const [context, setContext] = useState("");
  const [deadline, setDeadline] = useState("");
  const [urgency, setUrgency] = useState("medium");

  const [options, setOptions] = useState<Option[]>(() =>
    createInitialOptions(idPrefix)
  );

  const [criteria, setCriteria] = useState<Criterion[]>(() =>
    createInitialCriteria(idPrefix)
  );

  const [constraints, setConstraints] = useState("");
  const [stakeholders, setStakeholders] = useState("");

  const [errors, setErrors] = useState<FormErrors>({});
  const [preview, setPreview] = useState<DecisionPreview | null>(null);

  function handleOptionChange(id: string, value: string) {
    setOptions((current) =>
      current.map((option) =>
        option.id === id ? { ...option, value } : option
      )
    );
  }

  function handleAddOption() {
    setOptions((current) => [
      ...current,
      { id: createOptionId(idPrefix), value: "" },
    ]);
  }

  function handleRemoveOption(id: string) {
    setOptions((current) =>
      current.length > MIN_OPTIONS
        ? current.filter((option) => option.id !== id)
        : current
    );
  }

  function handleCriterionNameChange(id: string, name: string) {
    setCriteria((current) =>
      current.map((criterion) =>
        criterion.id === id ? { ...criterion, name } : criterion
      )
    );
  }

  function handleCriterionImportanceChange(id: string, importance: string) {
    setCriteria((current) =>
      current.map((criterion) =>
        criterion.id === id ? { ...criterion, importance } : criterion
      )
    );
  }

  function handleAddCriterion() {
    setCriteria((current) => [
      ...current,
      {
        id: createCriterionId(idPrefix),
        name: "",
        importance: DEFAULT_IMPORTANCE,
      },
    ]);
  }

  function handleRemoveCriterion(id: string) {
    setCriteria((current) =>
      current.filter((criterion) => criterion.id !== id)
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateForm(title, context, deadline, options);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setPreview(null);
      return;
    }

    setPreview(
      buildPreview(
        title,
        context,
        deadline,
        urgency,
        options,
        criteria,
        constraints,
        stakeholders
      )
    );
  }

  return (
    <>
      <form
          className="mt-10 flex flex-col gap-10"
          onSubmit={handleSubmit}
          noValidate
        >
        <DecisionDetails
          title={title}
          context={context}
          deadline={deadline}
          urgency={urgency}
          onTitleChange={setTitle}
          onContextChange={setContext}
          onDeadlineChange={setDeadline}
          onUrgencyChange={setUrgency}
          titleError={errors.title}
          titleErrorId={titleErrorId}
          contextError={errors.context}
          contextErrorId={contextErrorId}
          deadlineError={errors.deadline}
          deadlineErrorId={deadlineErrorId}
        />

        <DecisionOptions
          options={options}
          onChange={handleOptionChange}
          onAdd={handleAddOption}
          onRemove={handleRemoveOption}
          optionsError={errors.options}
          optionsErrorId={optionsErrorId}
        />

        <DecisionCriteria
          criteria={criteria}
          onNameChange={handleCriterionNameChange}
          onImportanceChange={handleCriterionImportanceChange}
          onAdd={handleAddCriterion}
          onRemove={handleRemoveCriterion}
        />

        <DecisionContext
          constraints={constraints}
          stakeholders={stakeholders}
          onConstraintsChange={setConstraints}
          onStakeholdersChange={setStakeholders}
        />

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
              type="submit"
              className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
            >
              Continue
            </button>
          </div>
        </div>
      </form>

      {preview ? (
        <section
          aria-labelledby="decision-preview-heading"
          className="mt-10 flex flex-col gap-5 rounded-lg border border-border bg-surface p-6"
        >
          <h2
            id="decision-preview-heading"
            className="text-lg font-semibold text-foreground"
          >
            Decision Preview
          </h2>

          <div className="flex flex-col gap-4 text-sm text-foreground">
            <div>
              <h3 className="font-medium">Decision title</h3>
              <p>{preview.title}</p>
            </div>

            <div>
              <h3 className="font-medium">Context / background</h3>
              <p>{preview.context}</p>
            </div>

            {preview.deadline ? (
              <div>
                <h3 className="font-medium">Deadline</h3>
                <p>{preview.deadline}</p>
              </div>
            ) : null}

            <div>
              <h3 className="font-medium">Urgency</h3>
              <p>{URGENCY_LABELS[preview.urgency] ?? preview.urgency}</p>
            </div>

            <div>
              <h3 className="font-medium">Options</h3>
              <ul className="list-disc space-y-1 pl-5">
                {preview.options.map((option) => (
                  <li key={option}>{option}</li>
                ))}
              </ul>
            </div>

            {preview.criteria.length > 0 ? (
              <div>
                <h3 className="font-medium">Evaluation criteria</h3>
                <ul className="list-disc space-y-1 pl-5">
                  {preview.criteria.map((criterion) => (
                    <li key={criterion.name}>
                      {criterion.name} —{" "}
                      {IMPORTANCE_LABELS[criterion.importance] ??
                        criterion.importance}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {preview.constraints ? (
              <div>
                <h3 className="font-medium">Constraints</h3>
                <p>{preview.constraints}</p>
              </div>
            ) : null}

            {preview.stakeholders ? (
              <div>
                <h3 className="font-medium">Stakeholders</h3>
                <p>{preview.stakeholders}</p>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}
    </>
  );
}
