import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";
import { PRONOUNS } from "@/data/grammar";
import { PageHeader, Paper } from "@/components/page";

export const Route = createFileRoute("/pronouns")({
  component: PronounsPage,
  head: ({ match }) =>
    pageHead("Pronouns", "Drop them, case them, and the -lak/-lek form.", match.pathname, {
      kind: "lesson",
      crumbs: [{ name: "Desk", path: "/" }],
      teaches: "Hungarian pronouns",
    }),
});

function PronounsPage() {
  return (
    <div className="max-w-3xl">
      <PageHeader
        id="pronouns"
        kicker="People and pointing"
        title="Pronouns"
        lead="The verb already tells you who. Keep pronouns for contrast, cases, and pointing."
      />
      <Paper className="mb-4">
        <h2 className="font-display text-xl font-semibold">Personal</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[28rem] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs tracking-wide text-muted uppercase">
                <th className="py-2 font-medium">Nom</th>
                <th className="py-2 font-medium">Acc</th>
                <th className="py-2 font-medium">Dat</th>
                <th className="py-2 font-medium">English</th>
              </tr>
            </thead>
            <tbody>
              {PRONOUNS.personal.map((r) => (
                <tr key={r.nom} className="border-b border-border/70">
                  <td className="py-2 font-serif">{r.nom}</td>
                  <td className="py-2 font-serif">{r.acc}</td>
                  <td className="py-2 font-serif">{r.dat}</td>
                  <td className="py-2 text-muted">{r.en}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Paper>
      <div className="grid gap-4 md:grid-cols-2">
        <Paper>
          <h2 className="font-display text-xl font-semibold">Polite you</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {PRONOUNS.polite.map((p) => (
              <li key={p.nom}>
                <span className="font-serif text-base">{p.nom}</span>
                <span className="ml-2 text-muted">{p.en}</span>
              </li>
            ))}
          </ul>
        </Paper>
        <Paper>
          <h2 className="font-display text-xl font-semibold">Reflexive</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {PRONOUNS.reflexive.map((p) => (
              <li key={p.hu}>
                <span className="font-serif text-fg">{p.hu}</span>
                <span className="mt-0.5 block">{p.en}</span>
              </li>
            ))}
          </ul>
        </Paper>
      </div>
      <Paper className="mt-4">
        <h2 className="font-display text-xl font-semibold">Demonstrative, question, relative</h2>
        <div className="mt-3 grid gap-4 md:grid-cols-3">
          {[PRONOUNS.demonstrative, PRONOUNS.interrogative, PRONOUNS.relative].map((list, i) => (
            <ul key={i} className="space-y-2 text-sm">
              {list.map((p) => (
                <li key={p.hu}>
                  <span className="font-serif">{p.hu}</span>
                  <span className="block text-muted">{p.en}</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
        <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-muted">
          {PRONOUNS.notes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      </Paper>
    </div>
  );
}
