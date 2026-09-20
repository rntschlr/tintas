import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";
import {
  COLOURS,
  COUNTRIES,
  DAYS,
  MONTHS,
  NUMBER_NOTES,
  NUMBERS,
  RELATIVE_TIME,
  SEASONS,
  TIME_EXAMPLES,
  TIME_NOTES,
} from "@/data/vocab";
import { PageHeader, Paper, PairRow } from "@/components/page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/basics")({
  component: BasicsPage,
  head: ({ match }) =>
    pageHead("Basics", "Numbers, colours, calendar, and Hungarian time of day.", match.pathname, {
      kind: "lesson",
      crumbs: [{ name: "Desk", path: "/" }],
      teaches: "Hungarian numbers, colours, and time",
    }),
});

function PairSheet({ items }: { items: { hu: string; en: string; note?: string }[] }) {
  return (
    <Paper>
      {items.map((it) => (
        <PairRow key={it.hu + it.en} hu={it.hu} en={it.en} note={it.note} />
      ))}
    </Paper>
  );
}

function BasicsPage() {
  return (
    <div>
      <PageHeader
        id="basics"
        kicker="Lists you will actually use"
        title="Numbers, colours, calendar, time"
        lead="Hungarian counting is regular after ten. Time of day is not: half-four is 3:30. Colours split red and grey by mood."
      />
      <Tabs defaultValue="numbers">
        <TabsList>
          <TabsTrigger value="numbers">Numbers</TabsTrigger>
          <TabsTrigger value="colours">Colours</TabsTrigger>
          <TabsTrigger value="cal">Calendar</TabsTrigger>
          <TabsTrigger value="time">Time</TabsTrigger>
          <TabsTrigger value="world">Countries</TabsTrigger>
        </TabsList>
        <TabsContent value="numbers">
          <PairSheet items={NUMBERS} />
          <Paper className="mt-4">
            <ul className="list-disc space-y-2 pl-5 text-sm text-muted">
              {NUMBER_NOTES.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </Paper>
        </TabsContent>
        <TabsContent value="colours">
          <PairSheet items={COLOURS} />
        </TabsContent>
        <TabsContent value="cal">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <h2 className="mb-2 font-display text-lg font-semibold">Days</h2>
              <PairSheet items={DAYS} />
            </div>
            <div>
              <h2 className="mb-2 font-display text-lg font-semibold">Months</h2>
              <PairSheet items={MONTHS} />
            </div>
            <div>
              <h2 className="mb-2 font-display text-lg font-semibold">Seasons & relative</h2>
              <PairSheet items={[...SEASONS, ...RELATIVE_TIME]} />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="time">
          <div className="grid gap-4 md:grid-cols-2">
            {TIME_NOTES.map((n) => (
              <Paper key={n.title}>
                <h2 className="font-display text-xl font-semibold">{n.title}</h2>
                <p className="mt-2 text-sm text-muted">{n.body}</p>
              </Paper>
            ))}
          </div>
          <div className="mt-4">
            <PairSheet items={TIME_EXAMPLES} />
          </div>
        </TabsContent>
        <TabsContent value="world">
          <PairSheet items={COUNTRIES} />
          <p className="mt-3 text-sm text-muted">
            Inhabitant + language: magyar / magyarul, angol / angolul. Cities: Hungarian towns take
            -ra/-en/-ről. Foreign towns take -ba/-ban/-ból.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
