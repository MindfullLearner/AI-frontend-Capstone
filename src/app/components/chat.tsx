"use client";

import { useState, type FormEvent } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

/**
 * Basic ThinkLens chat component. Connects to the existing POST /api/chat
 * streaming endpoint via useChat, and renders the conversation as it
 * streams in.
 *
 * This is intentionally minimal: no auto-scroll, no markdown rendering, no
 * persistence. Those are later milestones. It does include a "Thinking..."
 * indicator and a Stop button, driven entirely by useChat's own `status`
 * and `stop()` — no invented timers or extra state.
 */
export function Chat() {
  // useChat in this version of the SDK does not manage the text input for
  // you (no `input` / `handleInputChange`), so the component owns it.
  const [input, setInput] = useState("");

  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  // status is the SDK's own source of truth for the request lifecycle:
  // "submitted" (sent, no tokens yet), "streaming" (tokens arriving),
  // "ready" (idle/finished/stopped), "error" (failed). We derive our UI
  // states from it directly instead of tracking anything separately.
  const isSubmitted = status === "submitted";
  const isStreaming = status === "streaming";
  const isBusy = isSubmitted || isStreaming;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // The input stays enabled while busy (so it doesn't get "stuck"), but
    // the visible action is Stop, not Send — so pressing Enter shouldn't
    // start a second overlapping request.
    if (isBusy) {
      return;
    }

    const trimmed = input.trim();
    if (trimmed.length === 0) {
      // Ignore empty or whitespace-only submissions.
      return;
    }

    sendMessage({ text: trimmed });
    setInput("");
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4">
        {messages.length === 0 ? (
          <p className="text-sm text-muted">
            No messages yet. Say hello to ThinkLens.
          </p>
        ) : (
          messages.map((message) => {
            const isUser = message.role === "user";

            return (
              <div
                key={message.id}
                className={
                  isUser
                    ? "max-w-[80%] self-end rounded-md bg-accent px-3 py-2 text-sm text-white"
                    : "max-w-[80%] self-start rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
                }
              >
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted">
                  {isUser ? "You" : "ThinkLens"}
                </p>

                {/* Messages are made of parts, not a single content string.
                    A message can have multiple parts (e.g. reasoning, tool
                    calls); for this basic milestone we only render the
                    text parts. Each text part's `text` string grows in
                    place as the response streams in. */}
                {message.parts.map((part, index) =>
                  part.type === "text" ? (
                    <span key={index}>{part.text}</span>
                  ) : null
                )}
              </div>
            );
          })
        )}

        {/* "submitted" means the request has been sent but the assistant
            hasn't produced a first token yet — the SDK doesn't even add an
            assistant message to `messages` until then, so this indicator
            is a separate bubble, not something that could overlap with
            the real streamed message. Once the first chunk arrives,
            status flips to "streaming" and the real message takes over. */}
        {isSubmitted ? (
          <div className="max-w-[80%] self-start rounded-md border border-border bg-background px-3 py-2 text-sm text-muted">
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted">
              ThinkLens
            </p>
            Thinking...
          </div>
        ) : null}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <label htmlFor="chat-input" className="sr-only">
          Message
        </label>
        <input
          id="chat-input"
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask ThinkLens about your decision..."
          className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
        />
        {isBusy ? (
          <button
            type="button"
            onClick={() => stop()}
            className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:border-accent"
          >
            Stop
          </button>
        ) : (
          <button
            type="submit"
            disabled={input.trim().length === 0}
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            Send
          </button>
        )}
      </form>
    </div>
  );
}
