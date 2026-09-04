import { tool } from "ai";
import { z } from "zod";

/**
 * analyzeDecision — a deterministic scoring tool.
 *
 * This tool performs plain arithmetic on the scores and weights the caller
 * supplies. It does NOT call a language model, and it does NOT invent or
 * adjust any scores itself — every number in the output is derived only
 * from the numbers in the input. This keeps the analysis reproducible: the
 * same input always produces the same output.
 */

// ---------------------------------------------------------------------------
// Input schema
// ---------------------------------------------------------------------------

const criterionSchema = z.object({
  name: z
    .string()
    .min(1, "Criterion name must not be empty.")
    .describe("The name of an evaluation criterion, e.g. 'Cost' or 'Commute time'."),
  weight: z
    .number()
    .int("Criterion weight must be a whole number.")
    .min(1, "Criterion weight must be at least 1.")
    .max(5, "Criterion weight must be at most 5.")
    .describe(
      "How much this criterion matters, from 1 (least important) to 5 (most important)."
    ),
});

const scoreSchema = z.object({
  criterion: z
    .string()
    .min(1, "Score criterion name must not be empty.")
    .describe("The name of the criterion this score is for. Must match one of the declared criteria."),
  score: z
    .number()
    .min(0, "Score must be at least 0.")
    .max(10, "Score must be at most 10.")
    .describe("How well the option performs on this criterion, from 0 (worst) to 10 (best)."),
});

const optionSchema = z.object({
  name: z
    .string()
    .min(1, "Option name must not be empty.")
    .describe("The name of this option, e.g. 'Move to a new apartment'."),
  scores: z
    .array(scoreSchema)
    .describe("One score for every declared criterion."),
});

const analyzeDecisionInputSchema = z
  .object({
    decision: z
      .string()
      .min(1, "Decision must not be empty.")
      .describe("A short description of the decision being made."),
    criteria: z
      .array(criterionSchema)
      .min(1, "At least one criterion is required.")
      .describe("The criteria used to evaluate the options, each with an importance weight."),
    options: z
      .array(optionSchema)
      .min(2, "At least two options are required to compare.")
      .describe("The options being compared."),
  })
  // Cross-field checks that a single field's schema can't express on its
  // own: every option's scores must line up 1:1 with the declared criteria,
  // and criteria/scores shouldn't contain accidental duplicates. Without
  // these checks, "criterion" in a score could silently refer to nothing
  // (a typo) or to more than one thing (a duplicate criterion name), which
  // would make the weighted-score calculation below ambiguous or wrong.
  .superRefine((input, ctx) => {
    const criterionNames = input.criteria.map((criterion) => criterion.name);
    const uniqueCriterionNames = new Set(criterionNames);

    if (uniqueCriterionNames.size !== criterionNames.length) {
      ctx.addIssue({
        code: "custom",
        message: "Criterion names must be unique.",
        path: ["criteria"],
      });
    }

    input.options.forEach((option, optionIndex) => {
      const scoreCriteria = option.scores.map((entry) => entry.criterion);
      const uniqueScoreCriteria = new Set(scoreCriteria);

      if (uniqueScoreCriteria.size !== scoreCriteria.length) {
        ctx.addIssue({
          code: "custom",
          message: `Option "${option.name}" has more than one score for the same criterion.`,
          path: ["options", optionIndex, "scores"],
        });
      }

      const missing = criterionNames.filter(
        (name) => !uniqueScoreCriteria.has(name)
      );
      if (missing.length > 0) {
        ctx.addIssue({
          code: "custom",
          message: `Option "${option.name}" is missing a score for: ${missing.join(", ")}.`,
          path: ["options", optionIndex, "scores"],
        });
      }

      const unrecognized = scoreCriteria.filter(
        (name) => !uniqueCriterionNames.has(name)
      );
      if (unrecognized.length > 0) {
        ctx.addIssue({
          code: "custom",
          message: `Option "${option.name}" has a score for an undeclared criterion: ${unrecognized.join(", ")}.`,
          path: ["options", optionIndex, "scores"],
        });
      }
    });
  });

type AnalyzeDecisionInput = z.infer<typeof analyzeDecisionInputSchema>;

// ---------------------------------------------------------------------------
// Output shape
// ---------------------------------------------------------------------------

type AnalyzeDecisionOutput = {
  summary: string;
  options: Array<{
    name: string;
    score: number;
    reasoning: string;
  }>;
  keyConsiderations: string[];
  risks: string[];
};

// Rounds to one decimal place, e.g. 76.666... -> 76.7. Used for every
// number that appears in the output, so the numbers shown in text and the
// numbers returned in the structured fields always match.
function roundToOneDecimal(value: number): number {
  return Math.round(value * 10) / 10;
}

/**
 * Computes the 0–100 weighted score for a single option:
 *   weighted score = sum(score × criterion weight) / sum(all criterion weights)
 * which produces a 0–10 value, then multiplied by 10 to land on a 0–100
 * scale. `criteria` and `scores` are matched up by criterion name (already
 * validated to correspond 1:1 by the schema above).
 */
function calculateWeightedScore(
  scores: AnalyzeDecisionInput["options"][number]["scores"],
  criteria: AnalyzeDecisionInput["criteria"]
): number {
  const weightByCriterion = new Map(
    criteria.map((criterion) => [criterion.name, criterion.weight])
  );

  const totalWeight = criteria.reduce(
    (sum, criterion) => sum + criterion.weight,
    0
  );

  const weightedSum = scores.reduce((sum, entry) => {
    const weight = weightByCriterion.get(entry.criterion) ?? 0;
    return sum + entry.score * weight;
  }, 0);

  const weightedAverageOutOfTen = weightedSum / totalWeight;
  return roundToOneDecimal(weightedAverageOutOfTen * 10);
}

export const analyzeDecision = tool({
  description:
    "Calculates a deterministic, weighted 0-100 score for each option in a decision, based on user-supplied criteria weights (1-5) and per-option scores (0-10). Performs plain arithmetic only - it does not use a language model or invent any scores.",
  inputSchema: analyzeDecisionInputSchema,
  execute: (input): AnalyzeDecisionOutput => {
    const { decision, criteria, options } = input;

    const totalWeight = criteria.reduce(
      (sum, criterion) => sum + criterion.weight,
      0
    );

    const scored = options.map((option) => ({
      option,
      score: calculateWeightedScore(option.scores, criteria),
    }));

    const ranked = [...scored].sort((a, b) => b.score - a.score);
    const topOption = ranked[0];

    // Per-option reasoning: for each option, find which criterion it scored
    // highest and lowest on, so the reasoning references the option's own
    // actual numbers rather than a generic template.
    const optionResults = scored.map(({ option, score }) => {
      const withWeights = option.scores.map((entry) => {
        const criterion = criteria.find((c) => c.name === entry.criterion);
        return {
          criterion: entry.criterion,
          score: entry.score,
          weight: criterion?.weight ?? 0,
        };
      });

      const strongest = [...withWeights].sort((a, b) => b.score - a.score)[0];
      const weakest = [...withWeights].sort((a, b) => a.score - b.score)[0];

      const reasoning =
        `Weighted score: ${score}/100, based on ${withWeights.length} ` +
        `criterion score${withWeights.length === 1 ? "" : "s"} weighted by ` +
        `importance (total weight ${totalWeight}). Strongest on ` +
        `"${strongest.criterion}" (${strongest.score}/10, weight ${strongest.weight}/5); ` +
        `weakest on "${weakest.criterion}" (${weakest.score}/10, weight ${weakest.weight}/5).`;

      return { name: option.name, score, reasoning };
    });

    const summary =
      `Comparing ${options.length} options for "${decision}" across ` +
      `${criteria.length} ${criteria.length === 1 ? "criterion" : "criteria"}. ` +
      `"${topOption.option.name}" has the highest weighted score ` +
      `(${topOption.score}/100) based on the scores and weights provided. ` +
      `This reflects only the supplied ratings, not an independent or ` +
      `objective judgment of which option is truly best.`;

    // Key considerations: which criteria carried the most weight, and where
    // options disagreed most on a given criterion (a wide spread means that
    // criterion is doing a lot of work in separating the options).
    const criteriaByWeightDesc = [...criteria].sort(
      (a, b) => b.weight - a.weight
    );
    const maxWeight = criteriaByWeightDesc[0]?.weight;
    const mostWeightedNames = criteriaByWeightDesc
      .filter((criterion) => criterion.weight === maxWeight)
      .map((criterion) => criterion.name);

    const keyConsiderations: string[] = [
      `Most heavily weighted criteri${mostWeightedNames.length === 1 ? "on" : "a"}: ` +
        `${mostWeightedNames.join(", ")} (weight ${maxWeight}/5).`,
    ];

    for (const criterion of criteria) {
      const valuesForCriterion = options.map(
        (option) =>
          option.scores.find((entry) => entry.criterion === criterion.name)
            ?.score ?? 0
      );
      const min = Math.min(...valuesForCriterion);
      const max = Math.max(...valuesForCriterion);
      if (max - min >= 5) {
        keyConsiderations.push(
          `Options varied widely on "${criterion.name}" (scores ranged from ` +
            `${min} to ${max} out of 10), so this criterion had a large ` +
            `effect on the final ranking.`
        );
      }
    }

    // Risks: the fixed caveats requested, plus a data-driven one when the
    // top two options are close enough that small rating changes could
    // change the ranking.
    const risks: string[] = [
      "The scores and weights were supplied by the user or a language model, not measured independently - they reflect subjective judgment, not verified facts.",
      "The analysis only considers the criteria and options that were provided; relevant factors that were left out are not reflected in these results.",
    ];

    if (ranked.length >= 2) {
      const gap = ranked[0].score - ranked[1].score;
      if (gap <= 5) {
        risks.push(
          `The top two options are close (${ranked[0].option.name}: ` +
            `${ranked[0].score}/100 vs. ${ranked[1].option.name}: ` +
            `${ranked[1].score}/100), so a small change in any score or ` +
            `weight could change which option ranks highest.`
        );
      }
    }

    return {
      summary,
      options: optionResults,
      keyConsiderations,
      risks,
    };
  },
});
