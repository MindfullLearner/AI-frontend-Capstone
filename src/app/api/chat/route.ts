import {
  streamText,
  convertToModelMessages,
  stepCountIs,
  validateUIMessages,
} from "ai";
import { model, systemPrompt } from "@/lib/ai/config";
import { analyzeDecision } from "@/lib/ai/tools/analyze-decision";
import { aiRateLimit } from "@/lib/ai/rate-limit";
import { headers } from "next/headers";

export const maxDuration = 30;
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
        console.error("Chat rate-limiting service unavailable.");

        return Response.json(
          { error: "Request protection is temporarily unavailable." },
          { status: 503 }
        );
      }
    const MAX_BODY_BYTES = 1_000_000;

    const contentLength = req.headers.get("content-length");

    if (contentLength && Number(contentLength) > MAX_BODY_BYTES) {
    return new Response("Request body too large.", { status: 413 });
    }

    if (!req.body) {
    return new Response("Request body is required.", { status: 400 });
    }

    const reader = req.body.getReader();
    const chunks: Uint8Array[] = [];
    let totalBytes = 0;

    try {
    while (true) {
    const { done, value } = await reader.read();

    
      if (done) break;

      totalBytes += value.byteLength;

      if (totalBytes > MAX_BODY_BYTES) {
        await reader.cancel();
        return new Response("Request body too large.", { status: 413 });
      }

      chunks.push(value);
    }
    

    } catch {
    return new Response("Unable to read request body.", { status: 400 });
    }

    const bodyBytes = new Uint8Array(totalBytes);
    let offset = 0;

    for (const chunk of chunks) {
    bodyBytes.set(chunk, offset);
    offset += chunk.byteLength;
    }

    let body: unknown;

    try {
    body = JSON.parse(new TextDecoder().decode(bodyBytes));
    } catch {
    return new Response("Invalid JSON.", { status: 400 });
    }

    if (
    typeof body !== "object" ||
    body === null ||
    !("messages" in body) ||
    !Array.isArray(body.messages)
    ) {
    return new Response("A messages array is required.", { status: 400 });
    }

    const { messages } = body as { messages: unknown[] };

    if (messages.length === 0 || messages.length > 50) {
      return new Response("Invalid number of messages.", { status: 400 });
    }

    let validatedMessages;

    try {
      validatedMessages = await validateUIMessages({
        messages,
      });
    } catch {
      return new Response("Invalid chat messages.", { status: 400 });
    }

    const modelMessages = await convertToModelMessages(validatedMessages);

    const result = streamText({
      model,
      system: systemPrompt,
      messages: modelMessages,
      tools: { analyzeDecision },
      maxRetries: 1,
      stopWhen: stepCountIs(2),
      onError({ error }) {
        console.error("Gemini streaming error:", error);
      },
    });

    return result.toUIMessageStreamResponse();


}
