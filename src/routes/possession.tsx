import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";
import { POSSESSION } from "@/data/grammar";
import { PageHeader, Paper } from "@/components/page";

export const Route = createFileRoute("/possession")({
  component: PossessionPage,
  head: ({ match }) =>
    pageHead("Possession", "házam, van kutyám — marking what is yours.", match.pathname, {
      kind: "lesson",
      crumbs: [{ name: "Desk", path: "/" }],
      teaches: "Hungarian possessive suffixes",
    }),
});

function PossessionPage() {
  return (
    <div className="max-w-3xl">
      <PageHeader
        id="possession"
        kicker="Mine, yours"
        title="Possession"
        lead={POSSESSION.summary}
      />
      <Paper className="mb-4">
        <h2 className="font-display text-xl font-semibold">One thing</h2>
        <ul className="mt-3 space-y-2">
          {POSSESSION.single.map((r) => (
            <li
              key={r.person}
              className="flex flex-col border-b border-border py-2 last:border-0 sm:flex-row sm:justify-between"
            >
              <span className="text-sm text-muted">{r.person}</span>
              <span className="font-serif">
                {r.back} · {r.front}
              </span>
              <span className="text-sm text-muted">{r.ex}</span>
            </li>
          ))}
        </ul>
      </Paper>
      <Paper className="mb-4">
        <h2 className="font-display text-xl font-semibold">Several things</h2>
        <p className="mt-1 text-sm text-muted">No extra -k. The possessive already pluralises.</p>
        <ul className="mt-3 space-y-2">
          {POSSESSION.multiple.map((r) => (
            <li
              key={r.person}
              className="flex flex-col border-b border-border py-2 last:border-0 sm:flex-row sm:justify-between"
            >
              <span className="text-sm text-muted">{r.person}</span>
              <span className="font-serif">{r.form}</span>
              <span className="text-sm text-muted">{r.ex}</span>
            </li>
          ))}
        </ul>
      </Paper>
      <Paper>
        <ul className="list-disc space-y-2 pl-5 text-sm text-muted">
          {POSSESSION.notes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
        <div className="mt-4 space-y-2">
          {POSSESSION.examples.map((ex) => (
            <p key={ex.hu}>
              <span className="font-serif text-lg">{ex.hu}</span>
              <span className="ml-2 text-sm text-muted">{ex.en}</span>
            </p>
          ))}
        </div>
      </Paper>
    </div>
  );
}
