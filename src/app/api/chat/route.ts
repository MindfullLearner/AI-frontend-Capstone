import { streamText, convertToModelMessages } from "ai";

import { model, systemPrompt } from "@/lib/ai/config";

import { analyzeDecision } from "@/lib/ai/tools/analyze-decision";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model,
    system: systemPrompt,
    messages: modelMessages,
    tools: {
      analyzeDecision,
    },
  });

  return result.toUIMessageStreamResponse();
}