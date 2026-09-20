import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { NAV, STUDY_PATH } from "@/data/nav";
import { CASES, TRIADS } from "@/data/cases";
import { namesForDate } from "@/data/namedays";
import { pageHead } from "@/lib/seo";
import { useProgress } from "@/lib/progress";
import { HarmonyLab } from "@/components/labs";
import { Hu, Paper } from "@/components/page";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => pageHead(undefined, undefined, "/", { kind: "home" }),
});

function sheetTarget(last: string | undefined) {
  if (!last) return null;
  const nav = NAV.find((item) => item.id === last);
  if (nav) return { href: nav.href, label: nav.label };
  if (last.startsWith("case-")) {
    const slug = last.slice(5);
    const cas = CASES.find((c) => c.id === slug);
    if (cas) return { href: `/cases/${slug}`, label: cas.headline };
  }
  return null;
}

function Home() {
  const nev = namesForDate(new Date());
  const seen = useProgress((s) => s.seen);
  const bookmarks = useProgress((s) => s.bookmarks);
  const quizBest = useProgress((s) => s.quizBest);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const resume = ready ? sheetTarget([...seen].reverse().find((id) => id !== "desk")) : null;
  const savedSheets = ready ? bookmarks.map(sheetTarget).filter((sheet) => sheet !== null) : [];
  const openedSteps = ready ? STUDY_PATH.filter((step) => seen.includes(step.id)).length : 0;
  const nextStep =
    STUDY_PATH.find((step) => !seen.includes(step.id)) ?? STUDY_PATH[STUDY_PATH.length - 1];
  const sections = NAV.filter((n) => n.href !== "/");

  return (
    <div>
      <header className="mb-10 max-w-3xl">
        <p className="mb-3 text-xs font-medium tracking-[0.18em] text-primary uppercase">
          tinta, ink
        </p>
        <h1 lang="hu" className="font-display text-3xl font-semibold text-fg md:text-5xl">
          A magyar nyelv nem nehéz. Csak más.
        </h1>
        <span className="mt-4 block h-px w-16 bg-primary" />
        <p className="mt-5 max-w-2xl text-lg text-muted">
          Field notes for English speakers: the alphabet trap, vowel harmony, eighteen cases, two
          conjugations, and the phrases you need on the street. Search anything, then drill it.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <Link to={ready ? nextStep.href : "/alphabet"}>
              {ready && openedSteps > 0 ? `Next: ${nextStep.label}` : "Start with the alphabet"}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/practice">Open the drill</Link>
          </Button>
        </div>
      </header>

      <div className="mb-10 grid max-w-xl grid-cols-3 gap-3">
        {[
          { form: "házba", en: "into the house" },
          { form: "házban", en: "in the house" },
          { form: "házból", en: "out of the house" },
        ].map((row) => (
          <Link key={row.form} to="/cases" className="sheet-card px-3 py-4 text-center">
            <span lang="hu" className="block font-serif text-xl text-fg md:text-2xl">
              {row.form}
            </span>
            <span className="mt-1 block text-xs text-muted">{row.en}</span>
          </Link>
        ))}
      </div>

      {resume ? (
        <Link
          to={resume.href}
          className="sheet-card mb-8 flex items-center justify-between gap-4 p-5"
        >
          <span>
            <span className="block text-xs font-medium tracking-[0.16em] text-primary uppercase">
              Continue
            </span>
            <span className="mt-1 block font-display text-xl font-semibold text-fg">
              {resume.label}
            </span>
            <span className="mt-1 block text-sm text-muted">
              Pick up the last sheet you opened.
            </span>
          </span>
          <ArrowRight className="size-5 shrink-0 text-primary" />
        </Link>
      ) : null}

      <div className="mb-10 grid gap-4 md:grid-cols-3">
        <Paper>
          <p className="text-xs tracking-[0.16em] text-primary uppercase">Today</p>
          <p className="mt-2 font-display text-2xl">
            {nev.names.length ? nev.names.join(", ") : "—"}
          </p>
          <p className="mt-1 text-sm text-muted">
            Névnap · {nev.label}. Wish someone boldog névnapot.
          </p>
        </Paper>
        <Paper>
          <p className="text-xs tracking-[0.16em] text-primary uppercase">Sheets opened</p>
          <p className="mt-2 font-display text-2xl tabular-nums">{ready ? seen.length : "—"}</p>
          <p className="mt-1 text-sm text-muted">
            Bookmarks {ready ? bookmarks.length : "—"}. Progress stays on this device.
          </p>
        </Paper>
        <Paper>
          <p className="text-xs tracking-[0.16em] text-primary uppercase">Best drill</p>
          <p className="mt-2 font-display text-2xl tabular-nums">{ready ? quizBest : "—"}</p>
          <p className="mt-1 text-sm text-muted">
            Twenty questions. Learn <Hu>s</Hu> vs <Hu>sz</Hu> first if you are new.
          </p>
        </Paper>
      </div>

      <section className="mb-10" aria-labelledby="saved-heading">
        <h2 id="saved-heading" className="mb-4 font-display text-2xl font-semibold">
          Your bookmarked sheets
        </h2>
        {savedSheets.length ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {savedSheets.map((sheet) => (
              <Link
                key={sheet.href}
                to={sheet.href}
                className="sheet-card flex items-center justify-between gap-3 p-4"
              >
                <span className="font-medium">{sheet.label}</span>
                <ArrowRight className="size-4 text-primary" aria-hidden />
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">
            Tap the bookmark on any lesson to keep it here for quick reference.
          </p>
        )}
      </section>

      <section className="mb-12">
        <h2 className="mb-4 font-display text-2xl font-semibold">A path through the notebook</h2>
        <p className="mb-4 text-sm text-muted">
          {openedSteps} of {STUDY_PATH.length} sheets explored · opening a sheet marks it as
          visited, not mastered.
        </p>
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {STUDY_PATH.map((step, i) => (
            <li key={step.id}>
              <Link to={step.href} className="sheet-card flex h-full flex-col p-5">
                <span className="text-xs tabular-nums tracking-[0.16em] text-subtle">
                  {String(i + 1).padStart(2, "0")}{" "}
                  {ready && seen.includes(step.id) ? "· Visited" : ""}
                </span>
                <span className="mt-2 font-display text-xl font-semibold">{step.label}</span>
                <span className="mt-1 text-sm text-muted">{step.blurb}</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <h2 className="mb-4 font-display text-2xl font-semibold">The desk</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {sections.map((s) => (
              <Link key={s.id} to={s.href} className="sheet-card p-5">
                <p className="font-display text-xl font-semibold">{s.label}</p>
                <p className="mt-1 text-sm text-muted">{s.blurb}</p>
              </Link>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <HarmonyLab compact />
          <Paper>
            <p className="text-xs tracking-[0.16em] text-primary uppercase">Movement triads</p>
            <h2 className="mt-1 font-display text-2xl font-semibold">Goal · place · source</h2>
            <ul className="mt-4 space-y-3">
              {TRIADS.map((t) => (
                <li key={t.id}>
                  <p className="font-medium">{t.label}</p>
                  <p className="text-sm text-muted">{t.blurb}</p>
                </li>
              ))}
            </ul>
            <Link to="/cases" className="mt-4 inline-block text-sm font-medium text-primary">
              All {CASES.length} cases →
            </Link>
          </Paper>
        </div>
      </div>
    </div>
  );
}
