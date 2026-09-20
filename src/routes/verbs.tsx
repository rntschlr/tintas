import { createFileRoute, Link } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";
import { COVERBS, DEF_PRESENT, INDEF_PRESENT, VERB_TOPICS } from "@/data/verbs";
import { PageHeader, Paper } from "@/components/page";

export const Route = createFileRoute("/verbs")({
  component: VerbsPage,
  head: ({ match }) =>
    pageHead("Verbs", "Indefinite vs definite, coverbs, and the conjugator.", match.pathname, {
      kind: "lesson",
      crumbs: [{ name: "Desk", path: "/" }],
      teaches: "Hungarian verb conjugation",
    }),
});

function EndingTable({
  title,
  rows,
}: {
  title: string;
  rows: { person: string; back: string; front: string; rounded: string }[];
}) {
  return (
    <Paper>
      <h2 className="font-display text-xl font-semibold">{title}</h2>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[28rem] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs tracking-wide text-muted uppercase">
              <th className="py-2 font-medium">Person</th>
              <th className="py-2 font-medium">Back</th>
              <th className="py-2 font-medium">Front</th>
              <th className="py-2 font-medium">Rounded</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.person} className="border-b border-border/70">
                <td className="py-2 text-muted">{r.person}</td>
                <td className="py-2 font-serif">{r.back}</td>
                <td className="py-2 font-serif">{r.front}</td>
                <td className="py-2 font-serif">{r.rounded}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Paper>
  );
}

function VerbsPage() {
  return (
    <div>
      <PageHeader
        id="verbs"
        kicker="The engine"
        title="Two conjugations, one past, coverbs that jump"
        lead="If the object is specific, the verb changes shape. If you finish the action, meg- (or a friend) usually shows up — and then leaves the verb when something else is in focus."
      />
      <p className="mb-8">
        <Link to="/lab" className="text-sm font-medium text-primary">
          Open the conjugator workbench →
        </Link>
      </p>
      <div className="mb-8 grid gap-4 lg:grid-cols-2">
        <EndingTable title="Present indefinite" rows={INDEF_PRESENT} />
        <EndingTable title="Present definite" rows={DEF_PRESENT} />
      </div>
      <div className="flex flex-col gap-4">
        {VERB_TOPICS.map((t) => (
          <Paper key={t.id}>
            <div id={t.id} className="scroll-mt-28">
              <h2 className="font-display text-2xl font-semibold">{t.title}</h2>
              <p className="mt-2 text-muted">{t.summary}</p>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted">
                {t.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <div className="mt-4 space-y-2">
                {t.examples.map((ex) => (
                  <p key={ex.hu} className="text-sm">
                    <span className="font-serif text-base text-fg">{ex.hu}</span>
                    <span className="ml-2 text-muted">{ex.en}</span>
                  </p>
                ))}
              </div>
            </div>
          </Paper>
        ))}
        <Paper>
          <div id="coverbs" className="scroll-mt-28">
            <h2 className="font-display text-2xl font-semibold">Coverb cheat sheet</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {COVERBS.map((c) => (
                <li key={c.prefix} className="rounded-lg bg-bg-elevated px-3 py-2">
                  <span className="font-serif text-lg">{c.prefix}</span>
                  <span className="ml-2 text-sm text-muted">{c.sense}</span>
                </li>
              ))}
            </ul>
          </div>
        </Paper>
      </div>
    </div>
  );
}
