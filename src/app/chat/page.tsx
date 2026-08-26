import { Chat } from "../components/chat";

/**
 * /chat — ThinkLens Chat
 *
 * Server Component: renders the static page header, then hands off to the
 * existing <Chat /> Client Component for the actual conversation. This
 * page only exists to make the chat reachable in the browser for testing
 * — it isn't wired into a specific decision yet.
 */
export default function ChatPage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-5 px-6 py-16 sm:px-8 sm:py-20">
      <header className="flex flex-col gap-3">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          ThinkLens Chat
        </h1>
        <p className="max-w-prose text-base leading-7 text-muted">
          Talk through a decision with ThinkLens. This is an early version
          of the chat, not yet connected to a specific decision.
        </p>
      </header>

      <Chat />
    </div>
  );
}
