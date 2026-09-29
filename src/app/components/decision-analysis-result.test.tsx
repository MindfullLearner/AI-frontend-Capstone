import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  DecisionAnalysisResult,
  type DecisionAnalysisResultData,
} from "./decision-analysis-result";

describe("DecisionAnalysisResult", () => {
  it("renders the decision analysis details", () => {
    const result: DecisionAnalysisResultData = {
      summary: "Option A provides the best balance of cost and flexibility.",
      options: [
        {
          name: "Option A",
          score: 85,
          reasoning: "Lower cost and good flexibility.",
        },
        {
          name: "Option B",
          score: 70,
          reasoning: "Higher cost but stronger long-term benefits.",
        },
      ],
      keyConsiderations: [
        "Budget",
        "Long-term flexibility",
      ],
      risks: [
        "Option A may require additional setup time.",
      ],
    };

    render(<DecisionAnalysisResult result={result} />);

    expect(
      screen.getByRole("heading", { name: "Decision Analysis" })
    ).toBeInTheDocument();

    expect(
      screen.getByText(result.summary)
    ).toBeInTheDocument();

    expect(screen.getByText("Option A")).toBeInTheDocument();
    expect(screen.getByText("85/100")).toBeInTheDocument();
    expect(
      screen.getByText("Lower cost and good flexibility.")
    ).toBeInTheDocument();

    expect(screen.getByText("Option B")).toBeInTheDocument();
    expect(screen.getByText("70/100")).toBeInTheDocument();

    expect(screen.getByText("Budget")).toBeInTheDocument();
    expect(screen.getByText("Long-term flexibility")).toBeInTheDocument();

    expect(
      screen.getByText("Option A may require additional setup time.")
    ).toBeInTheDocument();
  });
});