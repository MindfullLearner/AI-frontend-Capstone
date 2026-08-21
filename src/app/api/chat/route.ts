import { streamText } from "ai";
import { model, systemPrompt } from "@/lib/ai/config";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model,
    system: systemPrompt,
    messages,
    onError({ error }) {
      console.error("Gemini streaming error:", error);
    },
  });

  return result.toUIMessageStreamResponse();
}