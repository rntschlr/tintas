import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";
import { PageHeader, Paper, Hu } from "@/components/page";
import { HarmonyLab } from "@/components/labs";

export const Route = createFileRoute("/harmony")({
  component: HarmonyPage,
  head: ({ match }) =>
    pageHead(
      "Vowel harmony",
      "Back, front, and rounded vowels — the rule that runs the language.",
      match.pathname,
      { kind: "lesson", crumbs: [{ name: "Desk", path: "/" }], teaches: "Hungarian vowel harmony" },
    ),
});

function HarmonyPage() {
  return (
    <div>
      <PageHeader
        id="harmony"
        kicker="The rule that runs the language"
        title="Vowel harmony"
        lead="Suffixes come in two or three outfits. The last classifying vowel of the word chooses the outfit. Get this, and cases stop looking random."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <HarmonyLab />
        <div className="flex flex-col gap-4">
          <Paper>
            <h2 className="font-display text-xl font-semibold">The three camps</h2>
            <ul className="mt-3 space-y-3 text-sm text-muted">
              <li>
                <span className="font-medium text-fg">Back</span> — a á o ó u ú. Deep in the mouth.{" "}
                <Hu>ház, három, autó</Hu>
              </li>
              <li>
                <span className="font-medium text-fg">Front unrounded</span> — e é.{" "}
                <Hu>ember, kér, szép</Hu>
              </li>
              <li>
                <span className="font-medium text-fg">Front rounded</span> — ö ő ü ű. Purse.{" "}
                <Hu>könyv, ül, tűz</Hu>
              </li>
              <li>
                <span className="font-medium text-fg">Neutral</span> — i í sit out. Alone they act
                back: <Hu>írok</Hu>, not írek. In <Hu>segít</Hu> the e decides (front).
              </li>
            </ul>
          </Paper>
          <Paper>
            <h2 className="font-display text-xl font-semibold">Two-fold vs three-fold</h2>
            <p className="mt-2 text-sm text-muted">
              Two-fold endings only care about back vs front:{" "}
              <Hu>-ban/-ben, -nak/-nek, -val/-vel</Hu>. Rounded and unrounded front collapse
              together.
            </p>
            <p className="mt-2 text-sm text-muted">
              Three-fold endings split the front camp: <Hu>látok, szeretek, ülök</Hu>. Same split on{" "}
              <Hu>-hoz/-hez/-höz</Hu> and <Hu>-on/-en/-ön</Hu>.
            </p>
          </Paper>
          <Paper>
            <h2 className="font-display text-xl font-semibold">Mixed stems</h2>
            <p className="mt-2 text-sm text-muted">
              Last classifying vowel usually wins: <Hu>béka</Hu> (frog) takes back endings because
              of the a. <Hu>kettő</Hu> is rounded because of ő. Loans sometimes freeze an unexpected
              suffix — learn those as words, not as rebellions.
            </p>
          </Paper>
        </div>
      </div>
    </div>
  );
}
