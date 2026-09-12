import { streamText, convertToModelMessages, stepCountIs } from "ai";
import { model, systemPrompt } from "@/lib/ai/config";
import { analyzeDecision } from "@/lib/ai/tools/analyze-decision";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model,
    system: systemPrompt,
    messages: modelMessages,
    tools: { analyzeDecision },
    // By default, streamText stops after a single step (isStepCount(1)),
    // so a tool call would end the response with no chance for the model
    // to see the tool's output and reply to it. Allowing 2 steps lets the
    // model: 1) call analyzeDecision, then 2) read its result and produce
    // a normal final assistant response based on it.
    stopWhen: stepCountIs(2),
    onError({ error }) {
      console.error("Gemini streaming error:", error);
    },
  });

  return result.toUIMessageStreamResponse();
}