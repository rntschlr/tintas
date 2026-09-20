import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CASES } from "@/data/cases";
import { BackLink, Hu, PageHeader, Paper } from "@/components/page";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/cases/$slug")({
  component: CaseDetail,
  beforeLoad: ({ params }) => {
    if (!CASES.some((item) => item.id === params.slug)) throw notFound();
  },
  head: ({ params, match }) => {
    const cas = CASES.find((c) => c.id === params.slug);
    return pageHead(
      cas ? cas.headline : "Case",
      cas?.summary ?? "Hungarian noun case sheet.",
      match.pathname,
      {
        kind: "lesson",
        crumbs: [
          { name: "Desk", path: "/" },
          { name: "Noun cases", path: "/cases" },
        ],
        teaches: cas ? `The Hungarian ${cas.name.toLowerCase()} case` : "Hungarian noun cases",
        term: cas
          ? { name: cas.name, suffixes: cas.suffixes, huName: cas.huName, summary: cas.summary }
          : undefined,
      },
    );
  },
});

function CaseDetail() {
  const { slug } = Route.useParams();
  const cas = CASES.find((c) => c.id === slug);
  if (!cas) {
    return (
      <div className="max-w-3xl">
        <BackLink href="/cases" label="All cases" />
        <PageHeader title="No such case" lead="That sheet isn’t on the desk." />
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <BackLink href="/cases" label="All cases" />
      <PageHeader
        id={`case-${cas.id}`}
        kicker={cas.huName}
        title={cas.headline}
        lead={cas.summary}
      />

      <Paper>
        <p className="leading-relaxed text-muted">{cas.rule}</p>
        <p className="mt-4 text-xs tracking-[0.16em] text-primary uppercase">Endings</p>
        <p className="mt-1 text-2xl">
          <Hu>{cas.suffixes.join("  ·  ")}</Hu>
        </p>
        <p className="mt-3 text-sm text-subtle">
          {cas.name} · {cas.english}
          {cas.triad ? ` · ${cas.triad} triad, ${cas.role}` : ""}
        </p>
      </Paper>

      <Paper className="mt-4">
        <p className="text-xs tracking-[0.16em] text-primary uppercase">When not to use it</p>
        <p className="mt-2 leading-relaxed text-muted">{cas.notWhen}</p>
      </Paper>

      {cas.contrast ? (
        <Paper className="mt-4">
          <p className="text-xs tracking-[0.16em] text-primary uppercase">Tell them apart</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {[cas.contrast.a, cas.contrast.b].map((side) => (
              <div key={side.hu}>
                <p className="font-serif text-xl" lang="hu">
                  {side.hu}
                </p>
                <p className="mt-1 text-sm text-muted">{side.en}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 border-t border-border pt-3 text-sm text-muted">{cas.contrast.note}</p>
        </Paper>
      ) : null}

      <Paper className="mt-4">
        <p className="text-xs tracking-[0.16em] text-primary uppercase">Notes</p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-muted">
          {cas.notes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      </Paper>

      <h2 className="mt-8 mb-3 font-display text-2xl font-semibold">Examples</h2>
      <div>
        {cas.examples.map((ex) => (
          <Paper key={ex.hu} className="mb-3">
            <p className="font-serif text-xl" lang="hu">
              {ex.hu}
            </p>
            <p className="mt-1 text-sm text-muted">{ex.en}</p>
          </Paper>
        ))}
      </div>

      <p className="mt-6 text-sm">
        <Link to="/lab" className="font-medium text-primary">
          Inflect this on the workbench →
        </Link>
      </p>
    </div>
  );
}
