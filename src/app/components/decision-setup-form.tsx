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
import { z } from "zod";
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

const IMPORTANCE_WEIGHTS: Record<string, number> = {
  low: 1,
  medium: 3,
  high: 4,
  critical: 5,
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

const decisionAnalysisSchema = z.object({
  summary: z.string(),
  options: z.array(
    z.object({
      name: z.string(),
      score: z.number().min(0).max(100),
      reasoning: z.string(),
    }),
  ),
  keyConsiderations: z.array(z.string()),
  risks: z.array(z.string()),
});
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

function buildScoreSuggestionPayload(preview: DecisionPreview) {
  return {
    decision: preview.title,
    context: preview.context,
    options: preview.options,
    criteria: preview.criteria.map((criterion) => ({
      name: criterion.name,
      weight: IMPORTANCE_WEIGHTS[criterion.importance] ?? 3,
    })),
    constraints: preview.constraints,
    stakeholders: preview.stakeholders,
  };
}
/**
 * Client Component parent for the entire Decision Setup form. Owns decision
 * state, validates on Continue, and shows a structured preview when valid.
 */
type DecisionAnalysis = {
    summary: string;
    options: {
      name: string;
      score: number;
      reasoning: string;
    }[];
    keyConsiderations: string[];
    risks: string[];
  };
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

  const [isSuggestingScores, setIsSuggestingScores] = useState(false);
  const [suggestionError, setSuggestionError] = useState<string | null>(null);
  const [scoresReviewed, setScoresReviewed] = useState(false);
  const [analysis, setAnalysis] = useState<DecisionAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<
  {
    option: string;
    criterion: string;
    score: number;
    reasoning: string;
    uncertain: boolean;
  }[]
>([]);
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
      {
        id: createOptionId(
          idPrefix,
          Math.max(0, ...current.map((option) => {
            const match = option.id.match(/-option-(\d+)$/);
            return match ? Number(match[1]) : 0;
          })) + 1
        ),
        value: "",
      },
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
    setCriteria((current) => {
      const nextIndex =
        Math.max(
          0,
          ...current.map((criterion) => {
            const match = criterion.id.match(/-criterion-(\d+)$/);
            return match ? Number(match[1]) : 0;
          }),
        ) + 1;

      return [
        ...current,
        {
          id: createCriterionId(idPrefix, nextIndex),
          name: "",
          importance: DEFAULT_IMPORTANCE,
        },
      ];
    });
  }

  function handleSuggestionScoreChange(
    index: number,
    score: number
  ) {
    setSuggestions((current) =>
      current.map((suggestion, currentIndex) =>
        currentIndex === index
          ? { ...suggestion, score }
          : suggestion
      )
    );
  }
  function handleRemoveCriterion(id: string) {
    setCriteria((current) =>
      current.filter((criterion) => criterion.id !== id)
    );
  }
  async function requestScoreSuggestions(nextPreview: DecisionPreview) {
      setIsSuggestingScores(true);
      setSuggestions([]);
      setSuggestionError(null);

      try {
        const response = await fetch("/api/decisions/suggest-scores", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(buildScoreSuggestionPayload(nextPreview)),
        });

        const data: unknown = await response.json();

        if (!response.ok) {
          const message =
            typeof data === "object" &&
            data !== null &&
            "error" in data &&
            typeof data.error === "string"
              ? data.error
              : "Unable to suggest scores. Please try again.";

          throw new Error(message);
        }

        if (
          typeof data !== "object" ||
          data === null ||
          !("suggestions" in data) ||
          !Array.isArray(data.suggestions)
        ) {
          throw new Error("The server returned an invalid score response.");
        }

        setSuggestions(data.suggestions);
      } catch (error) {
        setSuggestionError(
          error instanceof Error
            ? error.message
            : "Something went wrong while suggesting scores."
        );
      } finally {
        setIsSuggestingScores(false);
      }
  }
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateForm(title, context, deadline, options);
    setAnalysis(null);
    setAnalysisError(null);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setPreview(null);
      setSuggestions([]);
      setScoresReviewed(false);
      setSuggestionError(null);
      return;
    }

    const nextPreview = buildPreview(
      title,
      context,
      deadline,
      urgency,
      options,
      criteria,
      constraints,
      stakeholders
    );

    setPreview(nextPreview);
    setSuggestions([]);
    setSuggestionError(null);
    setScoresReviewed(false);

    await requestScoreSuggestions(nextPreview);
 }

  async function handleAnalyzeDecision() {
      if (!preview || !scoresReviewed || isAnalyzing) {
        return;
      }

      setIsAnalyzing(true);
      setAnalysisError(null);
      setAnalysis(null);

      try {
        const payload = {
          decision: preview.title,
          criteria: preview.criteria.map((criterion) => ({
            name: criterion.name,
            weight: IMPORTANCE_WEIGHTS[criterion.importance] ?? 3,
          })),
          options: preview.options.map((option) => ({
            name: option,
            scores: preview.criteria.map((criterion) => {
              const suggestion = suggestions.find(
                (item) =>
                  item.option === option &&
                  item.criterion === criterion.name
              );

              if (!suggestion) {
                throw new Error(
                  `Missing score for ${option} — ${criterion.name}.`
                );
              }

              return {
                criterion: criterion.name,
                score: suggestion.score,
              };
            }),
          })),
        };

        const response = await fetch("/api/decisions/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data: unknown = await response.json();

        if (!response.ok) {
          const message =
            typeof data === "object" &&
            data !== null &&
            "error" in data &&
            typeof data.error === "string"
              ? data.error
              : "Unable to analyze this decision. Please try again.";

          throw new Error(message);
        }

        const validation = decisionAnalysisSchema.safeParse(data);

        if (!validation.success) {
          throw new Error(
            "The analysis API returned an invalid response. Please try again."
          );
        }

        setAnalysis(validation.data);
      } catch (error) {
        setAnalysisError(
          error instanceof Error
            ? error.message
            : "Something went wrong while analyzing the decision."
        );
      } finally {
        setIsAnalyzing(false);
      }
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
          <div className="text-sm text-muted" aria-live="polite">
            {isSuggestingScores ? (
              <p>Generating AI score suggestions. Please wait...</p>
            ) : suggestionError ? (
              <div>
                <p role="alert" className="text-red-600">
                  {suggestionError}
                </p>

                <button
                  type="button"
                  onClick={() => {
                    if (preview) {
                      void requestScoreSuggestions(preview);
                    }
                  }}
                  disabled={isSuggestingScores || !preview}
                  className="mt-2 rounded-md border px-3 py-2 text-sm"
                >
                  {isSuggestingScores ? "Retrying..." : "Retry suggestions"}
                </button>
              </div>
            ) : (
              <p>AI-suggested scores will be provisional and can be reviewed.</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:border-accent"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSuggestingScores}
              className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
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
      {suggestions.length > 0 ? (
      <section
        aria-labelledby="score-suggestions-heading"
        className="mt-10 flex flex-col gap-5 rounded-lg border border-border bg-surface p-6"
      >
        <h2
          id="score-suggestions-heading"
          className="text-lg font-semibold text-foreground"
        >
          AI Score Suggestions
        </h2>

        <label className="flex items-start gap-3 text-sm text-foreground">
          <input
            type="checkbox"
            checked={scoresReviewed}
            onChange={(event) => setScoresReviewed(event.target.checked)}
            className="mt-1"
          />
          <span>
            I have reviewed the suggested scores and understand that they may be
            uncertain or based on incomplete information.
          </span>
        </label>

        <div className="flex flex-col gap-4">
          {suggestions.map((suggestion, index) => (
            <article
              key={`${suggestion.option}-${suggestion.criterion}-${index}`}
              className="rounded-md border border-border p-4"
            >
              <h3 className="font-medium text-foreground">
                {suggestion.option} — {suggestion.criterion}
              </h3>

              <div className="mt-3 flex flex-col gap-2">
                <label
                  htmlFor={`suggestion-score-${index}`}
                  className="text-sm font-medium text-foreground"
                >
                  Score (0–10)
                </label>

                <input
                  id={`suggestion-score-${index}`}
                  type="number"
                  min={0}
                  max={10}
                  step={1}
                  value={suggestion.score}
                  onChange={(event) => {
                    const value = event.target.valueAsNumber;

                    if (
                      Number.isFinite(value) &&
                      value >= 0 &&
                      value <= 10
                    ) {
                      handleSuggestionScoreChange(index, value);
                    }
                  }}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground sm:w-32"
                />
              </div>

              <p className="mt-1 text-sm text-muted">
                {suggestion.reasoning}
              </p>

              {suggestion.uncertain ? (
                <p className="mt-2 text-sm font-medium text-amber-600">
                  Uncertain — verify the available information.
                </p>
              ) : null}
            </article>
          ))}
        </div>
        <button
          type="button"
          disabled={!scoresReviewed || isSuggestingScores || isAnalyzing}
          onClick={handleAnalyzeDecision}
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isAnalyzing ? "Analyzing..." : "Analyze Decision"}
        </button>
      </section>
    ) : null}
    {analysisError ? (
      <p role="alert" className="mt-4 text-sm text-red-600">
        {analysisError}
      </p>
    ) : null}
    {analysis ? (
      <section
        aria-labelledby="analysis-results-heading"
        aria-live="polite"
        className="mt-10 flex flex-col gap-5 rounded-lg border border-border bg-surface p-6"
      >
        <h2
          id="analysis-results-heading"
          className="text-lg font-semibold text-foreground"
        >
          Decision Analysis Results
        </h2>

        <div>
          <h3 className="font-medium text-foreground">Summary</h3>
          <p className="mt-1 text-sm text-muted">{analysis.summary}</p>
        </div>

        <div>
          <h3 className="font-medium text-foreground">Option Rankings</h3>
          <ol className="mt-2 flex flex-col gap-3">
            {[...analysis.options]
              .sort((a, b) => b.score - a.score)
              .map((option, index) => (
                <li
                  key={option.name}
                  className="rounded-md border border-border p-4"
                >
                  <p className="font-medium text-foreground">
                    {index + 1}. {option.name} — {option.score}/100
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    {option.reasoning}
                  </p>
                </li>
              ))}
          </ol>
        </div>

        <div>
          <h3 className="font-medium text-foreground">
            Key Considerations
          </h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-foreground">
            {analysis.keyConsiderations.map((item, index) => (
              <li key={`${index}-${item}`}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-medium text-foreground">Risks</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-foreground">
            {analysis.risks.map((risk, index) => (
              <li key={`${index}-${risk}`}>{risk}</li>
            ))}
          </ul>
        </div>
      </section>
    ) : null}
    </>
  );
}
