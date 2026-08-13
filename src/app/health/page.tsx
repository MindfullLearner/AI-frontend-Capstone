import { headers } from "next/headers";

type HealthResponse = {
  status: string;
  service: string;
  timestamp: string;
};

/**
 * Fetches the internal /api/health endpoint from the server.
 *
 * Server Components can't resolve a relative URL, and no environment
 * variable is set up for the app's base URL yet, so the host is read from
 * the incoming request's headers instead. Returns null on any failure so
 * the page can render a clear "unhealthy" state instead of crashing.
 */
async function getHealth(): Promise<HealthResponse | null> {
  try {
    const headersList = await headers();
    const host = headersList.get("host");

    if (!host) {
      return null;
    }

    const protocol = headersList.get("x-forwarded-proto") ?? "http";

    const res = await fetch(`${protocol}://${host}/api/health`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    return (await res.json()) as HealthResponse;
  } catch {
    return null;
  }
}

/**
 * /health — Health Check
 *
 * Server Component: fetches live status from /api/health on the server and
 * renders it. Falls back to a clear unhealthy state if the fetch fails.
 */
export default async function HealthPage() {
  const health = await getHealth();

  return (
    <section className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-5 px-6 py-20 sm:px-8 sm:py-24">
      <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium uppercase tracking-wide text-muted">
        {health ? "Live status" : "Status unavailable"}
      </span>

      <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        Health Check
      </h1>

      <p className="max-w-prose text-base leading-7 text-muted">
        This page confirms ThinkLens is running by fetching live status data
        from an internal API route.
      </p>

      {health ? (
        <dl className="grid gap-4 rounded-lg border border-border bg-surface p-6 sm:grid-cols-3">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted">
              Status
            </dt>
            <dd className="mt-1 text-base font-semibold text-accent">
              {health.status}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted">
              Service
            </dt>
            <dd className="mt-1 text-base font-semibold text-foreground">
              {health.service}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted">
              Timestamp
            </dt>
            <dd className="mt-1 text-base font-semibold text-foreground">
              {health.timestamp}
            </dd>
          </div>
        </dl>
      ) : (
        <div className="rounded-lg border border-border bg-surface p-6">
          <p className="text-base font-semibold text-foreground">Unhealthy</p>
          <p className="mt-1 text-sm text-muted">
            ThinkLens could not reach its health API just now. This page will
            reflect the current status the next time it is loaded.
          </p>
        </div>
      )}
    </section>
  );
}
