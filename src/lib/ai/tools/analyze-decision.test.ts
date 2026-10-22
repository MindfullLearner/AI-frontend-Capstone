import { describe, expect, it } from "vitest";

import {
  analyzeDecision,
  analyzeDecisionInputSchema,
} from "./analyze-decision";

describe("analyzeDecisionInputSchema", () => {
  it("rejects input with fewer than two options", () => {
    const result = analyzeDecisionInputSchema.safeParse({
      decision: "Choose an apartment",
      criteria: [
        {
          name: "Cost",
          weight: 5,
        },
      ],
      options: [
        {
          name: "Apartment A",
          scores: [
            {
              criterion: "Cost",
              score: 8,
            },
          ],
        },
      ],
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues).toContainEqual(
        expect.objectContaining({
          message: "At least two options are required to compare.",
        })
      );
    }
    });
    it("rejects a criterion weight above 5", () => {
        const result = analyzeDecisionInputSchema.safeParse({
        decision: "Choose an apartment",
        criteria: [
          {
            name: "Cost",
            weight: 6,
          },
        ],
        options: [
          {
            name: "Apartment A",
            scores: [
              {
                criterion: "Cost",
                score: 8,
              },
            ],
          },
          {
            name: "Apartment B",
            scores: [
              {
                criterion: "Cost",
                score: 7,
              },
            ],
          },
        ],
      });
      
      expect(result.success).toBe(false);
    });
    it("rejects a criterion weight below 1", () => {
      const result = analyzeDecisionInputSchema.safeParse({
        decision: "Choose an apartment",
        criteria: [
          {
            name: "Cost",
            weight: 0,
          },
        ],
        options: [
          {
            name: "Apartment A",
            scores: [
              {
                criterion: "Cost",
                score: 8,
              },
            ],
          },
          {
            name: "Apartment B",
            scores: [
              {
                criterion: "Cost",
                score: 7,
              },
            ],
          },
        ],
      });

      expect(result.success).toBe(false);
    });

    it("rejects a score above 10", () => {
      const result = analyzeDecisionInputSchema.safeParse({
        decision: "Choose an apartment",
        criteria: [
          {
            name: "Cost",
            weight: 5,
          },
        ],
        options: [
          {
            name: "Apartment A",
            scores: [
              {
                criterion: "Cost",
                score: 11,
              },
            ],
          },
          {
            name: "Apartment B",
            scores: [
              {
                criterion: "Cost",
                score: 8,
              },
            ],
          },
        ],
      });

      expect(result.success).toBe(false);
    });
    it("rejects duplicate criterion names", () => {
      const result = analyzeDecisionInputSchema.safeParse({
        decision: "Choose an apartment",
        criteria: [
          {
            name: "Cost",
            weight: 5,
          },
          {
            name: "Cost",
            weight: 3,
          },
        ],
        options: [
          {
            name: "Apartment A",
            scores: [
              {
                criterion: "Cost",
                score: 8,
              },
            ],
          },
          {
            name: "Apartment B",
            scores: [
              {
                criterion: "Cost",
                score: 7,
              },
            ],
          },
        ],
      });

      expect(result.success).toBe(false);
    });
    it("rejects an option with a missing criterion score", () => {
      const result = analyzeDecisionInputSchema.safeParse({
        decision: "Choose an apartment",
        criteria: [
          {
            name: "Cost",
            weight: 5,
          },
          {
            name: "Location",
            weight: 4,
          },
        ],
        options: [
          {
            name: "Apartment A",
            scores: [
              {
                criterion: "Cost",
                score: 8,
              },
            ],
          },
          {
            name: "Apartment B",
            scores: [
              {
                criterion: "Cost",
                score: 7,
              },
              {
                criterion: "Location",
                score: 9,
              },
            ],
          },
        ],
      });

      expect(result.success).toBe(false);
    });
    it("rejects a score for an undeclared criterion", () => {
      const result = analyzeDecisionInputSchema.safeParse({
        decision: "Choose an apartment",
        criteria: [
          {
            name: "Cost",
            weight: 5,
          },
        ],
        options: [
          {
            name: "Apartment A",
            scores: [
              {
                criterion: "Cost",
                score: 8,
              },
              {
                criterion: "Location",
                score: 9,
              },
            ],
          },
          {
            name: "Apartment B",
            scores: [
              {
                criterion: "Cost",
                score: 7,
              },
            ],
          },
        ],
      });

      expect(result.success).toBe(false);
    });
    it("accepts the minimum valid criterion weight", () => {
      const result = analyzeDecisionInputSchema.safeParse({
        decision: "Choose an apartment",
        criteria: [
          {
            name: "Cost",
            weight: 1,
          },
        ],
        options: [
          {
            name: "Apartment A",
            scores: [
              {
                criterion: "Cost",
                score: 8,
              },
            ],
          },
          {
            name: "Apartment B",
            scores: [
              {
                criterion: "Cost",
                score: 7,
              },
            ],
          },
        ],
      });

      expect(result.success).toBe(true);
    });
    it("accepts the maximum valid score", () => {
      const result = analyzeDecisionInputSchema.safeParse({
        decision: "Choose an apartment",
        criteria: [
          {
            name: "Cost",
            weight: 5,
          },
        ],
        options: [
          {
            name: "Apartment A",
            scores: [
              {
                criterion: "Cost",
                score: 10,
              },
            ],
          },
          {
            name: "Apartment B",
            scores: [
              {
                criterion: "Cost",
                score: 7,
              },
            ],
          },
        ],
      });

      expect(result.success).toBe(true);
    });
    it("accepts the minimum valid score", () => {
      const result = analyzeDecisionInputSchema.safeParse({
        decision: "Choose an apartment",
        criteria: [
          {
            name: "Cost",
            weight: 5,
          },
        ],
        options: [
          {
            name: "Apartment A",
            scores: [
              {
                criterion: "Cost",
                score: 0,
              },
            ],
          },
          {
            name: "Apartment B",
            scores: [
              {
                criterion: "Cost",
                score: 7,
              },
            ],
          },
        ],
      });

      expect(result.success).toBe(true);
    });
    it("rejects an empty decision description", () => {
      const result = analyzeDecisionInputSchema.safeParse({
        decision: "",
        criteria: [
          {
            name: "Cost",
            weight: 5,
          },
        ],
        options: [
          {
            name: "Apartment A",
            scores: [
              {
                criterion: "Cost",
                score: 8,
              },
            ],
          },
          {
            name: "Apartment B",
            scores: [
              {
                criterion: "Cost",
                score: 7,
              },
            ],
          },
        ],
      });

      expect(result.success).toBe(false);
    });
    it("rejects a whitespace-only decision description", () => {
      const result = analyzeDecisionInputSchema.safeParse({
        decision: "   ",
        criteria: [
          {
            name: "Cost",
            weight: 5,
          },
        ],
        options: [
          {
            name: "Apartment A",
            scores: [
              {
                criterion: "Cost",
                score: 8,
              },
            ],
          },
          {
            name: "Apartment B",
            scores: [
              {
                criterion: "Cost",
                score: 7,
              },
            ],
          },
        ],
      });

      expect(result.success).toBe(false);
    });
    it("rejects a whitespace-only criterion name", () => {
      const result = analyzeDecisionInputSchema.safeParse({
        decision: "Choose an apartment",
        criteria: [
          {
            name: "   ",
            weight: 5,
          },
        ],
        options: [
          {
            name: "Apartment A",
            scores: [
              {
                criterion: "   ",
                score: 8,
              },
            ],
          },
          {
            name: "Apartment B",
            scores: [
              {
                criterion: "   ",
                score: 7,
              },
            ],
          },
        ],
      });

      expect(result.success).toBe(false);
    });
    it("calculates weighted scores correctly and ranks options", async () => {
      const input = {
        decision: "Choose an apartment",
        criteria: [
          { name: "Cost", weight: 5 },
          { name: "Commute", weight: 3 },
        ],
        options: [
          {
            name: "Apartment A",
            scores: [
              { criterion: "Cost", score: 8 },
              { criterion: "Commute", score: 6 },
            ],
          },
          {
            name: "Apartment B",
            scores: [
              { criterion: "Cost", score: 6 },
              { criterion: "Commute", score: 9 },
            ],
          },
        ],
      };

      const result = analyzeDecisionInputSchema.safeParse(input);
      expect(result.success).toBe(true);

      if (!result.success) {
        return;
      }

      const execute = analyzeDecision.execute;

      if (!execute) {
        throw new Error("analyzeDecision does not expose an execute function.");
      }

      const analysis = await execute(result.data, {
        toolCallId: "test-call",
        messages: [],
        context: {},
      });
      if (
        !analysis ||
        typeof analysis !== "object" ||
        !("options" in analysis) ||
        !("summary" in analysis)
      ) {
        throw new Error("Expected analyzeDecision to return a structured analysis.");
      }
      expect(analysis.options).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: "Apartment A",
            score: 72.5,
          }),
          expect.objectContaining({
            name: "Apartment B",
            score: 71.3,
          }),
        ])
      );

      expect(analysis.summary).toContain('"Apartment A"');
    });
});
