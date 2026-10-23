
import { generateObject } from "ai";
import { z } from "zod";
import { model } from "@/lib/ai/config";
import { aiRateLimit } from "@/lib/ai/rate-limit";
import { headers } from "next/headers";

export const maxDuration = 30;

const requestSchema = z.object({
  decision: z.string().trim().min(1).max(2000),
  context: z.string().trim().min(1).max(5000),
  options: z.array(z.string().trim().min(1).max(200)).min(2).max(10),
  criteria: z
    .array(
      z.object({
        name: z.string().trim().min(1).max(200),
        weight: z.number().int().min(1).max(5),
      })
    )
    .min(1)
    .max(10),
  constraints: z.string().max(5000).default(""),
  stakeholders: z.string().max(2000).default(""),
});

const suggestionSchema = z.object({
  suggestions: z.array(
    z.object({
      option: z.string(),
      criterion: z.string(),
      score: z.number().min(0).max(10),
      reasoning: z.string(),
      uncertain: z.boolean(),
    })
  ),
});

export async function POST(req: Request) {

  const requestHeaders = await headers();
  const ip = requestHeaders.get("x-real-ip");

  if (!ip) {
    return Response.json(
      { error: "Unable to identify the request source." },
      { status: 503 }
    );
  }

  try {
    const { success, reset } = await aiRateLimit.limit(ip);

    if (!success) {
      const retryAfter = Math.max(
        1,
        Math.ceil((reset - Date.now()) / 1000)
      );

      return Response.json(
        { error: "Too many requests. Please try again shortly." },
        {
          status: 429,
          headers: { "Retry-After": String(retryAfter) },
        }
      );
    }
  } catch {
    console.error("Rate-limiting service unavailable.");

    return Response.json(
      { error: "Request protection is temporarily unavailable." },
      { status: 503 }
    );
  }

  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON request." }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "Invalid decision data.", details: parsed.error.issues },
      { status: 400 }
    );
  }

  const input = parsed.data;

  if (new Set(input.options).size !== input.options.length) {
    return Response.json(
      { error: "Option names must be unique." },
      { status: 400 }
    );
  }

  if (new Set(input.criteria.map((criterion) => criterion.name)).size !== input.criteria.length) {
    return Response.json(
      { error: "Criterion names must be unique." },
      { status: 400 }
    );
  }

  try {
    const { object } = await generateObject({
      model,
      schema: suggestionSchema,
      prompt: `
You are helping a user compare options for a decision.

Suggest a score from 0 to 10 for every option against every criterion.
A higher score means the option performs better on that criterion.
Use the criterion weights to understand importance, but do not alter them.

Decision: ${input.decision}
Context: ${input.context}
Options: ${JSON.stringify(input.options)}
Criteria and weights: ${JSON.stringify(input.criteria)}
Constraints: ${input.constraints}
Stakeholders: ${input.stakeholders}

Rules:
- Return exactly one suggestion for every option-criterion pair.
- Use only the supplied option and criterion names.
- Never invent facts about prices, distances, or other real-world details.
- If important information is missing, make a cautious provisional estimate,
  set uncertain to true, and explain what is unknown.
- Keep reasoning brief and explain the basis for each suggested score.
- These are AI suggestions, not verified facts. The user will review them.
`,
    });

    const expectedCount = input.options.length * input.criteria.length;

    if (object.suggestions.length !== expectedCount) {
      return Response.json(
        { error: "The AI returned an incomplete set of scores. Please try again." },
        { status: 502 }
      );
    }

    const expectedPairs = new Set(
      input.options.flatMap((option) =>
        input.criteria.map((criterion) => `${option}::${criterion.name}`)
      )
    );

    const returnedPairs = object.suggestions.map(
      (suggestion) => `${suggestion.option}::${suggestion.criterion}`
    );

    if (
      returnedPairs.some((pair) => !expectedPairs.has(pair)) ||
      new Set(returnedPairs).size !== expectedCount
    ) {
      return Response.json(
        { error: "The AI returned invalid or duplicate score entries. Please try again." },
        { status: 502 }
      );
    }

    return Response.json({ suggestions: object.suggestions });
  } catch (error) {
    console.error("Decision score suggestion failed:", error);

    return Response.json(
      { error: "Unable to suggest scores right now. Please try again." },
      { status: 502 }
    );
  }
}
