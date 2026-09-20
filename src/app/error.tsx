"use client";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-5 px-6 py-20 sm:px-8 sm:py-24">
      <div
        role="alert"
        className="flex flex-col gap-4 rounded-lg border border-red-500/30 bg-surface p-6"
      >
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Something went wrong
        </h1>

        <p className="max-w-prose text-base leading-7 text-muted">
          ThinkLens ran into an unexpected error while loading this page.
          Your other conversations and decisions are unaffected. Trying
          again usually resolves it.
        </p>

        {error.message ? (
          <p className="text-sm text-red-500">{error.message}</p>
        ) : null}

        <button
          type="button"
          onClick={() => reset()}
          className="w-fit rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
        >
          Try again
        </button>
      </div>
    </section>
  );
}
