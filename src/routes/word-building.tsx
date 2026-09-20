import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";
import { WORD_BUILDING } from "@/data/grammar";
import { PageHeader, Paper } from "@/components/page";

export const Route = createFileRoute("/word-building")({
  component: WordBuildingPage,
  head: ({ match }) =>
    pageHead("Word-building", "The suffix machinery behind Hungarian words.", match.pathname, {
      kind: "lesson",
      crumbs: [{ name: "Desk", path: "/" }],
      teaches: "Hungarian derivational suffixes",
    }),
});

function WordBuildingPage() {
  return (
    <div className="max-w-3xl">
      <PageHeader
        id="word-building"
        kicker="Lego"
        title="Word-building"
        lead="Hungarian grows vocabulary by stacking suffixes. Learn twenty of them and dictionaries get quieter."
      />
      <Paper>
        <ul>
          {WORD_BUILDING.map((w) => (
            <li
              key={w.suffix}
              className="flex flex-col gap-1 border-b border-border py-3 last:border-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
            >
              <div>
                <p className="font-serif text-lg">{w.suffix}</p>
                <p className="text-sm text-muted">{w.makes}</p>
              </div>
              <p className="text-sm text-muted sm:text-right">{w.ex}</p>
            </li>
          ))}
        </ul>
      </Paper>
    </div>
  );
}
