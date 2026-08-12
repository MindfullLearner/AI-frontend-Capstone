type PlaceholderPageProps = {
  /** The page title shown as the main heading. */
  title: string;
  /** A short description of what this page will do once implemented. */
  description: string;
  /** Optional extra detail line, e.g. to surface a dynamic route parameter. */
  detail?: string;
};

/**
 * Shared layout for every placeholder route created during the Foundation
 * phase. Keeps all placeholder pages visually and structurally consistent,
 * and makes it clear that a page has not been implemented yet.
 *
 * This is a Server Component: it renders static content only and has no
 * interactivity, so no "use client" directive is needed.
 */
export function PlaceholderPage({
  title,
  description,
  detail,
}: PlaceholderPageProps) {
  return (
    <section className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-4 px-6 py-16">
      <span className="inline-flex w-fit items-center gap-2 rounded-full border border-dashed border-gray-400 px-3 py-1 text-xs font-medium uppercase tracking-wide text-gray-600">
        Foundation &middot; Placeholder page
      </span>

      <h1 className="text-3xl font-semibold text-gray-900">{title}</h1>

      <p className="text-base leading-7 text-gray-600">{description}</p>

      {detail ? <p className="text-sm text-gray-500">{detail}</p> : null}
    </section>
  );
}
