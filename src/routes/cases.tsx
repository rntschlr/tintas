import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { CASES, PLACE_ADVERBS, TRIADS } from "@/data/cases";
import { PageHeader, Paper } from "@/components/page";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/cases")({
  component: CasesPage,
  head: ({ match, matches }) =>
    matches.at(-1)?.id === match.id
      ? pageHead(
          "Noun cases",
          "Eighteen Hungarian noun cases, the movement triads, and here/there/where.",
          match.pathname,
          {
            kind: "lesson",
            crumbs: [{ name: "Desk", path: "/" }],
            teaches: "The Hungarian noun case system",
          },
        )
      : // Returning nothing keeps this layout route from emitting a second
        // JSON-LD graph on top of the case sheet's own.
        {},
});

function CasesPage() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  if (pathname !== "/cases" && pathname !== "/cases/") return <Outlet />;
  const grammatical = CASES.filter((c) => !c.triad);
  return (
    <div>
      <PageHeader
        id="cases"
        kicker="Nouns"
        title="Eighteen cases, three pictures of space"
        lead="English hides grammar in prepositions. Hungarian glues the relation onto the noun. Learn the three movement triads first — interiors, surfaces, vicinity — and the rest is a short list of jobs."
      />

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        {TRIADS.map((t) => {
          const trio = CASES.filter((c) => c.triad === t.id);
          return (
            <Paper key={t.id}>
              <p className="text-xs tracking-[0.16em] text-primary uppercase">{t.label}</p>
              <p className="mt-2 text-sm text-muted">{t.blurb}</p>
              <ul className="mt-4 space-y-2">
                {trio.map((c) => (
                  <li key={c.id}>
                    <Link to="/cases/$slug" params={{ slug: c.id }} className="block min-h-11">
                      <span className="font-serif text-lg">{c.suffixes.join(" ")}</span>
                      <span className="ml-2 text-sm text-muted">{c.english}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-subtle">{t.nouns}</p>
            </Paper>
          );
        })}
      </div>

      <h2 className="mb-3 font-display text-2xl font-semibold">The other jobs</h2>
      <div className="mb-8 grid gap-3 sm:grid-cols-2">
        {grammatical.map((c) => (
          <Link key={c.id} to="/cases/$slug" params={{ slug: c.id }} className="sheet-card p-5">
            <p className="font-display text-xl font-semibold">{c.name}</p>
            <p className="font-serif text-primary">{c.suffixes.join("  ")}</p>
            <p className="mt-1 text-sm text-muted">{c.english}</p>
          </Link>
        ))}
      </div>

      <Paper>
        <h2 className="font-display text-xl font-semibold">
          Here / there / where also come in threes
        </h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-lg text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs tracking-wide text-muted uppercase">
                <th className="py-2 font-medium">English</th>
                <th className="py-2 font-medium">To</th>
                <th className="py-2 font-medium">At</th>
                <th className="py-2 font-medium">From</th>
              </tr>
            </thead>
            <tbody>
              {PLACE_ADVERBS.map((r) => (
                <tr key={r.en} className="border-b border-border/70">
                  <td className="py-2 text-muted">{r.en}</td>
                  <td className="py-2 font-serif">{r.goal}</td>
                  <td className="py-2 font-serif">{r.pos}</td>
                  <td className="py-2 font-serif">{r.src}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Paper>
    </div>
  );
}
