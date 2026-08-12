import Link from "next/link";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/decisions", label: "Decisions" },
  { href: "/decisions/new", label: "Create Decision" },
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
    <header className="border-b border-gray-200">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex w-full max-w-4xl items-center justify-between px-6 py-4"
      >
        <Link href="/" className="text-sm font-semibold tracking-tight text-gray-900">
          ThinkLens
        </Link>

        <ul className="flex items-center gap-6 text-sm text-gray-600">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="hover:text-gray-900">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
