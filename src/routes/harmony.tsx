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
            <h2 className="font-display text-xl font-semibold">Two words hold the whole rule</h2>
            <p className="mt-2 text-sm text-muted">
              Hungarian classrooms teach the split with two words that each carry their camp’s
              vowels. Learn the pair and you can classify almost any word on sight.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <p className="font-serif text-2xl">
                  <Hu>autó</Hu>
                </p>
                <p className="text-xs text-muted">car · a á o ó u ú</p>
                <p className="mt-1 text-sm text-muted">Takes the back endings.</p>
              </div>
              <div>
                <p className="font-serif text-2xl">
                  <Hu>teniszütő</Hu>
                </p>
                <p className="text-xs text-muted">tennis racket · e é i í ö ő ü ű</p>
                <p className="mt-1 text-sm text-muted">Takes the front and rounded endings.</p>
              </div>
            </div>
            <p className="mt-4 border-t border-border pt-3 text-sm text-muted">
              So in any three-column ending table, <Hu>autó</Hu> words read the{" "}
              <span className="font-medium text-fg">back</span> column and <Hu>teniszütő</Hu> words
              read <span className="font-medium text-fg">front</span> or{" "}
              <span className="font-medium text-fg">rounded</span>. Hungarian calls the two camps{" "}
              <Hu>mély</Hu> (deep) and <Hu>magas</Hu> (high); English grammars say back and front —
              same split, different name.
            </p>
          </Paper>
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
                <span className="font-medium text-fg">Neutral</span> — i í sit out of mixed words.
                The <Hu>i</Hu> in <Hu>teniszütő</Hu> rides along with the front camp. Alone they
                split, which is why this page will not say “they act back”: <Hu>ír</Hu> takes back
                endings (<Hu>írok</Hu>), <Hu>víz</Hu> takes front (<Hu>vizet, vízben</Hu>). In{" "}
                <Hu>segít</Hu> the e decides (front).
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
