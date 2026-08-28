import Markdown, { type Components } from "react-markdown";

// Maps Markdown elements to the same Tailwind tokens already used
// throughout ThinkLens (foreground/muted/border/accent/background), so
// rendered Markdown looks consistent with the rest of the app instead of
// introducing a new visual style.
const components: Components = {
  h1: (props) => (
    <h1 className="mt-2 text-lg font-semibold text-foreground" {...props} />
  ),
  h2: (props) => (
    <h2 className="mt-2 text-base font-semibold text-foreground" {...props} />
  ),
  h3: (props) => (
    <h3 className="mt-2 text-sm font-semibold text-foreground" {...props} />
  ),
  p: (props) => <p className="text-sm leading-6 text-foreground" {...props} />,
  strong: (props) => (
    <strong className="font-semibold text-foreground" {...props} />
  ),
  em: (props) => <em className="italic text-foreground" {...props} />,
  ul: (props) => (
    <ul className="list-disc space-y-1 pl-5 text-sm text-foreground" {...props} />
  ),
  ol: (props) => (
    <ol
      className="list-decimal space-y-1 pl-5 text-sm text-foreground"
      {...props}
    />
  ),
  li: (props) => <li className="text-sm text-foreground" {...props} />,
  a: (props) => (
    <a
      className="text-accent underline hover:text-accent-hover"
      target="_blank"
      rel="noreferrer noopener"
      {...props}
    />
  ),
  // Inline code (`like this`) and fenced code blocks both come through as
  // `code`; a fenced block is additionally wrapped in a `pre` by
  // react-markdown, so we can tell them apart by checking for that parent.
  code: ({ className, children, node, ...props }) => {
    const isBlock = node?.position
      ? node.position.start.line !== node.position.end.line
      : className?.includes("language-");

    if (isBlock) {
      return (
        <code
          className="block whitespace-pre-wrap font-mono text-xs text-foreground"
          {...props}
        >
          {children}
        </code>
      );
    }

    return (
      <code
        className="rounded bg-background px-1 py-0.5 font-mono text-xs text-foreground"
        {...props}
      >
        {children}
      </code>
    );
  },
  pre: (props) => (
    <pre
      className="overflow-x-auto rounded-md border border-border bg-background p-3"
      {...props}
    />
  ),
};

type MarkdownMessageProps = {
  text: string;
};

/**
 * Renders an assistant message's text as Markdown, styled with ThinkLens's
 * existing design tokens. Only used for assistant messages — user messages
 * are always rendered as plain text elsewhere in Chat.
 *
 * `text` is the full cumulative message content on every render (that's
 * how useChat delivers it while streaming), so this component doesn't
 * need to buffer or accumulate anything itself: it just re-renders
 * react-markdown with the latest complete string each time. Incomplete
 * Markdown (like an unclosed `**` or an open code fence) is handled by
 * react-markdown/CommonMark's own parsing rules, not by any custom logic
 * here — no `dangerouslySetInnerHTML` and no HTML-parsing plugin are used,
 * so raw HTML in the text is never rendered as live markup.
 */
export function MarkdownMessage({ text }: MarkdownMessageProps) {
  return (
    <div className="flex flex-col gap-2">
      <Markdown components={components}>{text}</Markdown>
    </div>
  );
}
