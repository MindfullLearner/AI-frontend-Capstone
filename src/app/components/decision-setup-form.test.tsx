import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { DecisionSetupForm } from "./decision-setup-form";

function formatDateInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function yesterdayInputValue() {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return formatDateInput(date);
}

async function clickContinue(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("button", { name: "Continue" }));
}

async function fillMinimalValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/Decision title/i), "Choose an apartment");
  await user.type(
    screen.getByLabelText(/Context \/ background/i),
    "My lease is ending soon."
  );
  await user.type(screen.getByLabelText(/^Option 1$/i), "Stay in current apartment");
  await user.type(screen.getByLabelText(/^Option 2$/i), "Move to a new apartment");
}

describe("DecisionSetupForm", () => {
  afterEach(() => {
    cleanup();
  });

  it("shows validation feedback when submitting an empty form", async () => {
    const user = userEvent.setup();
    render(<DecisionSetupForm />);

    await clickContinue(user);

    expect(screen.getByText("Enter a decision title.")).toBeInTheDocument();
    expect(
      screen.getByText("Enter context or background for this decision.")
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Enter at least two options with text. Blank or whitespace-only options do not count."
      )
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Decision Preview" })
    ).not.toBeInTheDocument();
  });

  it("rejects a whitespace-only title", async () => {
    const user = userEvent.setup();
    render(<DecisionSetupForm />);

    await user.type(screen.getByLabelText(/Decision title/i), "   ");
    await user.type(
      screen.getByLabelText(/Context \/ background/i),
      "Valid context."
    );
    await user.type(screen.getByLabelText(/^Option 1$/i), "Option A");
    await user.type(screen.getByLabelText(/^Option 2$/i), "Option B");

    await clickContinue(user);

    expect(screen.getByText("Enter a decision title.")).toBeInTheDocument();
  });

  it("rejects a whitespace-only context", async () => {
    const user = userEvent.setup();
    render(<DecisionSetupForm />);

    await user.type(screen.getByLabelText(/Decision title/i), "Valid title");
    await user.type(screen.getByLabelText(/Context \/ background/i), "   ");
    await user.type(screen.getByLabelText(/^Option 1$/i), "Option A");
    await user.type(screen.getByLabelText(/^Option 2$/i), "Option B");

    await clickContinue(user);

    expect(
      screen.getByText("Enter context or background for this decision.")
    ).toBeInTheDocument();
  });

  it("rejects blank options", async () => {
    const user = userEvent.setup();
    render(<DecisionSetupForm />);

    await user.type(screen.getByLabelText(/Decision title/i), "Valid title");
    await user.type(
      screen.getByLabelText(/Context \/ background/i),
      "Valid context."
    );
    await user.type(screen.getByLabelText(/^Option 1$/i), "Only one option");

    await clickContinue(user);

    expect(
      screen.getByText(
        "Enter at least two options with text. Blank or whitespace-only options do not count."
      )
    ).toBeInTheDocument();
  });

  it("rejects a past deadline", async () => {
    const user = userEvent.setup();
    render(<DecisionSetupForm />);

    await fillMinimalValidForm(user);

    const deadlineInput = screen.getByLabelText(/^Deadline$/i);
    fireEvent.change(deadlineInput, {
      target: { value: yesterdayInputValue() },
    });

    await clickContinue(user);

    expect(
      screen.getByText("Deadline cannot be earlier than today.")
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Decision Preview" })
    ).not.toBeInTheDocument();
  });

  it("shows a preview with entered decision details and options when valid", async () => {
    const user = userEvent.setup();
    render(<DecisionSetupForm />);

    await fillMinimalValidForm(user);
    await user.selectOptions(
      screen.getByLabelText(/^Urgency$/i),
      "high"
    );
    await user.type(screen.getByLabelText(/^Constraints$/i), "Must stay under budget.");
    await user.type(
      screen.getByLabelText(/^Stakeholders$/i),
      "Roommate and landlord"
    );

    await clickContinue(user);

    const previewHeading = await screen.findByRole("heading", {
      name: "Decision Preview",
    });
    const preview = within(previewHeading.closest("section")!);

    expect(preview.getByText("Choose an apartment")).toBeInTheDocument();
    expect(preview.getByText("My lease is ending soon.")).toBeInTheDocument();
    expect(preview.getByText("High — time-sensitive")).toBeInTheDocument();
    expect(preview.getByText("Stay in current apartment")).toBeInTheDocument();
    expect(preview.getByText("Move to a new apartment")).toBeInTheDocument();
    expect(preview.getByText("Must stay under budget.")).toBeInTheDocument();
    expect(preview.getByText("Roommate and landlord")).toBeInTheDocument();
  });

  it("includes entered criteria and importance values in the preview", async () => {
    const user = userEvent.setup();
    render(<DecisionSetupForm />);

    await fillMinimalValidForm(user);

    await user.type(screen.getByLabelText(/Criterion 1 name/i), "Cost");
    await user.selectOptions(screen.getAllByLabelText(/^Importance$/i)[0], "high");

    await clickContinue(user);

    expect(
      await screen.findByRole("heading", { name: "Decision Preview" })
    ).toBeInTheDocument();
    expect(screen.getByText("Cost — High")).toBeInTheDocument();
  });

  it("allows correcting validation errors and submitting successfully", async () => {
    const user = userEvent.setup();
    render(<DecisionSetupForm />);

    await clickContinue(user);
    expect(screen.getByText("Enter a decision title.")).toBeInTheDocument();

    await user.type(screen.getByLabelText(/Decision title/i), "Pick a laptop");
    await clickContinue(user);
    expect(
      screen.getByText("Enter context or background for this decision.")
    ).toBeInTheDocument();

    await user.type(
      screen.getByLabelText(/Context \/ background/i),
      "My current laptop is failing."
    );
    await clickContinue(user);
    expect(
      screen.getByText(
        "Enter at least two options with text. Blank or whitespace-only options do not count."
      )
    ).toBeInTheDocument();

    await user.type(screen.getByLabelText(/^Option 1$/i), "Repair the old laptop");
    await user.type(screen.getByLabelText(/^Option 2$/i), "Buy a new laptop");

    await clickContinue(user);

    expect(
      await screen.findByRole("heading", { name: "Decision Preview" })
    ).toBeInTheDocument();
    expect(screen.getByText("Pick a laptop")).toBeInTheDocument();
    expect(screen.queryByText("Enter a decision title.")).not.toBeInTheDocument();
  });
});
