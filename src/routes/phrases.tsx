import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";
import { GREETINGS, INTRODUCTIONS, PHRASES } from "@/data/vocab";
import { PageHeader, Paper, PairRow } from "@/components/page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/phrases")({
  component: PhrasesPage,
  head: ({ match }) =>
    pageHead(
      "How to say",
      "Hello, thank you, I love you, and the rest of the street.",
      match.pathname,
      {
        kind: "lesson",
        crumbs: [{ name: "Desk", path: "/" }],
        teaches: "everyday Hungarian phrases",
      },
    ),
});

function PhrasesPage() {
  return (
    <div className="max-w-3xl">
      <PageHeader
        id="phrases"
        kicker="How to say"
        title="Hello, thank you, I love you"
        lead="Polite default on the street: jó napot. Informal default: szia — which is also goodbye. Szeretlek is I→you; don’t conjugate around it."
      />
      <Tabs defaultValue="greet">
        <TabsList>
          <TabsTrigger value="greet">Greetings</TabsTrigger>
          <TabsTrigger value="intro">Introductions</TabsTrigger>
          <TabsTrigger value="life">Life & love</TabsTrigger>
        </TabsList>
        <TabsContent value="greet">
          <Paper>
            {GREETINGS.map((p) => (
              <PairRow key={p.hu} hu={p.hu} en={p.en} note={p.ipa} />
            ))}
          </Paper>
        </TabsContent>
        <TabsContent value="intro">
          <Paper>
            {INTRODUCTIONS.map((p) => (
              <PairRow key={p.hu} hu={p.hu} en={p.en} />
            ))}
          </Paper>
        </TabsContent>
        <TabsContent value="life">
          <Paper>
            {PHRASES.map((p) => (
              <PairRow key={p.hu} hu={p.hu} en={p.en} />
            ))}
          </Paper>
        </TabsContent>
      </Tabs>
    </div>
  );
}
