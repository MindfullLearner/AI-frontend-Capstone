"use client";

import {
  useLayoutEffect,
  useRef,
  useState,
  type FormEvent,
  type UIEvent,
} from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { MarkdownMessage } from "./markdown-message";

// How close to the bottom (in pixels) still counts as "at the bottom".
// A small threshold avoids auto-follow flickering on/off from tiny,
// insignificant scroll differences.
const NEAR_BOTTOM_THRESHOLD_PX = 64;

/**
 * Basic ThinkLens chat component. Connects to the existing POST /api/chat
 * streaming endpoint via useChat, and renders the conversation as it
 * streams in.
 *
 * Assistant text is rendered as Markdown via <MarkdownMessage />; user
 * text always stays plain. No persistence, no regenerate button — those
 * are later milestones. It does include a "Thinking..." indicator, a Stop
 * button, and streaming-aware auto-scroll — all driven by useChat's own
 * `status`/`stop()` plus the message container's real scroll position, no
 * invented timers.
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

  // Whether the message list is currently scrolled to (or near) the
  // bottom. This is the single source of truth for auto-scroll: we never
  // try to guess whether a given scroll was "us" or "the user" — we just
  // always trust the real scroll position.
  const [isNearBottom, setIsNearBottom] = useState(true);
  const messageListRef = useRef<HTMLDivElement>(null);

  function handleMessageListScroll(event: UIEvent<HTMLDivElement>) {
    const container = event.currentTarget;
    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    setIsNearBottom(distanceFromBottom <= NEAR_BOTTOM_THRESHOLD_PX);
  }

  function handleJumpToLatest() {
    const container = messageListRef.current;
    if (!container) {
      return;
    }
    container.scrollTop = container.scrollHeight;
    // Update immediately rather than waiting for the resulting scroll
    // event, so the "Jump to latest" button disappears right away.
    setIsNearBottom(true);
  }

  // Keep the view pinned to the bottom while streaming, but only if the
  // user was already there. Runs on every new message AND on every
  // streamed token (messages gets a new reference on each chunk), plus
  // whenever the "Thinking..." indicator appears/disappears. useLayoutEffect
  // (rather than useEffect) runs before the browser paints, so pinning the
  // scroll position doesn't cause a visible flicker.
  useLayoutEffect(() => {
    if (!isNearBottom) {
      return;
    }
    const container = messageListRef.current;
    if (!container) {
      return;
    }
    container.scrollTop = container.scrollHeight;
  }, [messages, isSubmitted, isNearBottom]);

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
      <div className="relative flex flex-col">
        <div
          ref={messageListRef}
          onScroll={handleMessageListScroll}
          className="flex h-[60vh] flex-col gap-3 overflow-y-auto rounded-lg border border-border bg-surface p-4"
        >
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
                      text parts. User text always stays plain text — only
                      the assistant's text is ever parsed as Markdown. */}
                  {message.parts.map((part, index) =>
                    part.type === "text" ? (
                      isUser ? (
                        <span key={index}>{part.text}</span>
                      ) : (
                        <MarkdownMessage key={index} text={part.text} />
                      )
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

        {!isNearBottom ? (
          <button
            type="button"
            onClick={handleJumpToLatest}
            aria-label="Jump to latest message"
            className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-foreground shadow-none hover:border-accent"
          >
            Jump to latest
          </button>
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
