"use client";

import { useId, useState } from "react";
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

/**
 * Client Component parent for the entire Decision Setup form. Owns the
 * complete decision state — title, context, deadline, urgency, options,
 * criteria, constraints, and stakeholders — as separate useState calls,
 * so a future Continue handler will have everything it needs in one
 * place. Each section below is now a presentational child that receives
 * its slice of state and callbacks as props instead of owning its own
 * useState.
 *
 * This is a pure refactor: no new user-facing functionality. Cancel and
 * Continue remain inert `type="button"` controls, moved here unchanged
 * from page.tsx so the future Continue handler will have access to this
 * state without another lift.
 */
export function DecisionSetupForm() {
  const idPrefix = useId();

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

  return (
    <form className="mt-10 flex flex-col gap-10">
      {/* 2. Decision Details */}
      <DecisionDetails
        title={title}
        context={context}
        deadline={deadline}
        urgency={urgency}
        onTitleChange={setTitle}
        onContextChange={setContext}
        onDeadlineChange={setDeadline}
        onUrgencyChange={setUrgency}
      />

      {/* 3. Options Under Consideration */}
      <DecisionOptions
        options={options}
        onChange={handleOptionChange}
        onAdd={handleAddOption}
        onRemove={handleRemoveOption}
      />

      {/* 4. Evaluation Criteria */}
      <DecisionCriteria
        criteria={criteria}
        onNameChange={handleCriterionNameChange}
        onImportanceChange={handleCriterionImportanceChange}
        onAdd={handleAddCriterion}
        onRemove={handleRemoveCriterion}
      />

      {/* 5. Constraints & Stakeholders */}
      <DecisionContext
        constraints={constraints}
        stakeholders={stakeholders}
        onConstraintsChange={setConstraints}
        onStakeholdersChange={setStakeholders}
      />

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
  );
}
