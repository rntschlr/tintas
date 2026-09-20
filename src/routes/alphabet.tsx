import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";
import { LETTERS, LOAN_LETTERS, SOUND_NOTES } from "@/data/alphabet";
import { PageHeader, Paper, Hu } from "@/components/page";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/alphabet")({
  component: AlphabetPage,
  head: ({ match }) =>
    pageHead("Alphabet", "Forty letters, the s/sz trap, and long vowels.", match.pathname, {
      kind: "lesson",
      crumbs: [{ name: "Desk", path: "/" }],
      teaches: "the Hungarian alphabet and its 40 letters",
    }),
});

function AlphabetPage() {
  const [active, setActive] = useState(LETTERS[0].glyph);
  const letter = LETTERS.find((l) => l.glyph === active) ?? LETTERS[0];

  return (
    <div>
      <PageHeader
        id="alphabet"
        kicker="Sound"
        title="Forty letters, no guessing"
        lead="Hungarian is close to one sound per letter. The catch: some letters are two Latin keys, s is sh, and length changes the word."
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div>
          <div className="grid grid-cols-5 gap-1.5 sm:grid-cols-8">
            {LETTERS.map((l) => (
              <button
                key={l.glyph}
                onClick={() => setActive(l.glyph)}
                className={cn(
                  "flex min-h-12 flex-col items-center justify-center rounded-lg px-1 py-2",
                  l.glyph === active
                    ? "bg-primary text-primary-fg"
                    : "bg-surface text-fg shadow-[var(--shadow-border)]",
                )}
              >
                <span className="font-display text-lg leading-none">{l.glyph}</span>
                <span className="mt-1 text-xs opacity-70">
                  {l.kind.startsWith("vowel") ? "v" : ""}
                </span>
              </button>
            ))}
          </div>
          <Paper className="mt-6">
            <div className="flex flex-wrap items-end gap-4">
              <p className="font-display text-6xl leading-none">{letter.glyph}</p>
              <div>
                <p className="text-sm text-muted">
                  {letter.name} · /{letter.ipa}/
                </p>
                <p className="font-serif text-xl">
                  {letter.example.hu}{" "}
                  <span className="font-sans text-sm text-muted">— {letter.example.en}</span>
                </p>
              </div>
            </div>
            <p className="mt-4 text-muted">{letter.hint}</p>
          </Paper>
        </div>
        <div className="flex flex-col gap-4">
          {SOUND_NOTES.map((n) => (
            <Paper key={n.title}>
              <h2 className="font-display text-lg font-semibold">{n.title}</h2>
              <p className="mt-2 text-sm text-muted">{n.body}</p>
            </Paper>
          ))}
          <Paper>
            <h2 className="font-display text-lg font-semibold">Loan letters</h2>
            <ul className="mt-2 space-y-1 text-sm">
              {LOAN_LETTERS.map((l) => (
                <li key={l.glyph}>
                  <Hu>{l.glyph}</Hu> <span className="text-muted">({l.name})</span> — {l.note}
                </li>
              ))}
            </ul>
          </Paper>
        </div>
      </div>
    </div>
  );
}
