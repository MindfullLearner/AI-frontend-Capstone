import Link from "next/link";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/decisions", label: "Decisions" },
  { href: "/decisions/new", label: "Create Decision" },
  { href: "/chat", label: "Chat" },
  { href: "/health", label: "Health" },
] as const;

/**
 * Site-wide navigation. Links between the main sections of ThinkLens.
 * `/decisions/[id]/analysis` and `/decisions/[id]/summary` are intentionally
 * left out, since they belong to an individual decision rather than being
 * top-level sections.
 *
 * This is a Server Component: `next/link` handles client-side navigation
 * internally, so no "use client" directive is needed here.
 */
export function Nav() {
  return (
    <header className="border-b border-border bg-surface">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex w-full max-w-4xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-6 py-5 sm:px-8"
      >
        <Link
          href="/"
          className="text-base font-semibold tracking-tight text-foreground"
        >
          ThinkLens
        </Link>

        <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="text-muted hover:text-accent">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
