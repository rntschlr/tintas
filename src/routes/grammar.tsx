import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";
import { HOGY, NEGATIVES, PLURALS, POSTPOSITIONS, SYNTAX, VAN } from "@/data/grammar";
import { PageHeader, Paper } from "@/components/page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/grammar")({
  component: GrammarPage,
  head: ({ match }) =>
    pageHead(
      "Syntax",
      "van, plurals, word order, and the extras that keep coming up.",
      match.pathname,
      {
        kind: "lesson",
        crumbs: [{ name: "Desk", path: "/" }],
        teaches: "Hungarian syntax and word order",
      },
    ),
});

function Block({
  title,
  summary,
  points,
  examples,
}: {
  title: string;
  summary: string;
  points: string[];
  examples?: { hu: string; en: string }[];
}) {
  return (
    <Paper>
      <h2 className="font-display text-2xl font-semibold">{title}</h2>
      <p className="mt-2 text-muted">{summary}</p>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted">
        {points.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
      {examples ? (
        <div className="mt-4 space-y-2">
          {examples.map((ex) => (
            <p key={ex.hu}>
              <span className="font-serif text-lg">{ex.hu}</span>
              <span className="ml-2 text-sm text-muted">{ex.en}</span>
            </p>
          ))}
        </div>
      ) : null}
    </Paper>
  );
}

function GrammarPage() {
  return (
    <div>
      <PageHeader
        id="grammar"
        kicker="The rest of the machine"
        title="Syntax"
        lead="van that disappears, plurals that refuse to double-count, word order that is really focus order, and postpositions with personal forms."
      />
      <Tabs defaultValue="van">
        <TabsList>
          <TabsTrigger value="van">van</TabsTrigger>
          <TabsTrigger value="plurals">Plurals</TabsTrigger>
          <TabsTrigger value="syntax">Word order</TabsTrigger>
          <TabsTrigger value="neg">Negation</TabsTrigger>
          <TabsTrigger value="hogy">hogy</TabsTrigger>
          <TabsTrigger value="post">Postpositions</TabsTrigger>
        </TabsList>
        <TabsContent value="van">
          <Block
            title="van / nincs"
            summary={VAN.summary}
            points={VAN.points}
            examples={VAN.examples}
          />
        </TabsContent>
        <TabsContent value="plurals">
          <Block
            title="Plurals"
            summary={PLURALS.summary}
            points={PLURALS.points}
            examples={PLURALS.examples}
          />
        </TabsContent>
        <TabsContent value="syntax">
          <Block
            title="Topic, focus, verb"
            summary={SYNTAX.summary}
            points={SYNTAX.points}
            examples={SYNTAX.examples}
          />
        </TabsContent>
        <TabsContent value="neg">
          <Block
            title="nem, ne, sem"
            summary={NEGATIVES.summary}
            points={NEGATIVES.points}
            examples={NEGATIVES.examples}
          />
        </TabsContent>
        <TabsContent value="hogy">
          <Block
            title="hogy"
            summary={HOGY.summary}
            points={HOGY.points}
            examples={HOGY.examples}
          />
        </TabsContent>
        <TabsContent value="post">
          <Paper>
            <h2 className="font-display text-2xl font-semibold">Postpositions</h2>
            <p className="mt-2 text-sm text-muted">
              They follow the noun (ház előtt) and take personal endings when the noun is a person:
              előttem — in front of me.
            </p>
            <ul className="mt-4">
              {POSTPOSITIONS.map((p) => (
                <li
                  key={p.hu}
                  className="flex flex-col border-b border-border py-2 last:border-0 sm:flex-row sm:justify-between"
                >
                  <span className="font-serif text-lg">{p.hu}</span>
                  <span className="text-sm text-muted">{p.en}</span>
                  <span className="font-serif text-sm text-subtle">{p.personal}</span>
                </li>
              ))}
            </ul>
          </Paper>
        </TabsContent>
      </Tabs>
    </div>
  );
}
