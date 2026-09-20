import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";
import { ADJECTIVES } from "@/data/grammar";
import { PageHeader, Paper } from "@/components/page";

export const Route = createFileRoute("/adjectives")({
  component: AdjectivesPage,
  head: ({ match }) =>
    pageHead(
      "Adjectives",
      "Comparatives, no agreement, and how Hungarian paints nouns.",
      match.pathname,
      {
        kind: "lesson",
        crumbs: [{ name: "Desk", path: "/" }],
        teaches: "Hungarian adjectives and comparison",
      },
    ),
});

function AdjectivesPage() {
  return (
    <div className="max-w-3xl">
      <PageHeader id="adjectives" kicker="Quality" title="Adjectives" lead={ADJECTIVES.summary} />
      <Paper className="mb-4">
        <ul className="list-disc space-y-2 pl-5 text-sm text-muted">
          {ADJECTIVES.points.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
        <div className="mt-4 space-y-2">
          {ADJECTIVES.examples.map((ex) => (
            <p key={ex.hu}>
              <span className="font-serif text-lg">{ex.hu}</span>
              <span className="ml-2 text-sm text-muted">{ex.en}</span>
            </p>
          ))}
        </div>
      </Paper>
      <Paper>
        <h2 className="font-display text-xl font-semibold">A short list</h2>
        <ul className="mt-3">
          {ADJECTIVES.list.map((a) => (
            <li
              key={a.hu}
              className="flex flex-col border-b border-border py-2 last:border-0 sm:flex-row sm:items-baseline sm:justify-between"
            >
              <span className="font-serif text-lg">
                {a.hu} → {a.cmp}
              </span>
              <span className="text-sm text-muted">{a.en}</span>
            </li>
          ))}
        </ul>
      </Paper>
    </div>
  );
}
