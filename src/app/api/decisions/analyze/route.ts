import { NextResponse } from "next/server";
import {
  analyzeDecisionInputSchema,
  calculateDecisionAnalysis,
} from "@/lib/ai/tools/analyze-decision";
export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON request body." },
      { status: 400 }
    );
  }

  const validation = analyzeDecisionInputSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      {
        error: "Invalid decision data.",
        details: validation.error.flatten(),
      },
      { status: 400 }
    );
  }
    const result = calculateDecisionAnalysis(validation.data);

    return NextResponse.json(result);
}