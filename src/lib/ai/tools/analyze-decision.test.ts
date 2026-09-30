import { describe, expect, it } from "vitest";

import { analyzeDecisionInputSchema } from "./analyze-decision";

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
});