import { useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/seo";
import { LETTERS, LOAN_LETTERS, SOUND_NOTES } from "@/data/alphabet";
import { PageHeader, Paper, Hu } from "@/components/page";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/alphabet")({
  component: AlphabetPage,
  head: ({ match }) =>
    pageHead("Alphabet", "Forty-four letters, the s/sz trap, and long vowels.", match.pathname, {
      kind: "lesson",
      crumbs: [{ name: "Desk", path: "/" }],
      teaches: "the Hungarian alphabet and its 44 letters",
    }),
});

function AlphabetPage() {
  const [active, setActive] = useState(LETTERS[0].glyph);
  const letter = LETTERS.find((l) => l.glyph === active) ?? LETTERS[0];
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Exactly one letter is ever selected, so the grid is a radio group, not a
  // set of independent toggles. Arrow keys move both selection and focus,
  // matching how a native radio group behaves regardless of visual columns.
  function moveTo(index: number) {
    const next = LETTERS[(index + LETTERS.length) % LETTERS.length];
    setActive(next.glyph);
    buttonRefs.current[(index + LETTERS.length) % LETTERS.length]?.focus();
  }

  function onKeyDown(e: ReactKeyboardEvent<HTMLButtonElement>, index: number) {
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        e.preventDefault();
        moveTo(index + 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        e.preventDefault();
        moveTo(index - 1);
        break;
      case "Home":
        e.preventDefault();
        moveTo(0);
        break;
      case "End":
        e.preventDefault();
        moveTo(LETTERS.length - 1);
        break;
      default:
        break;
    }
  }

  return (
    <div>
      <PageHeader
        id="alphabet"
        kicker="Sound"
        title="Forty-four letters, no guessing"
        lead="Hungarian is close to one sound per letter. The catch: some letters are two Latin keys, s is sh, and length changes the word."
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div>
          <div
            role="radiogroup"
            aria-label="Alphabet letters"
            className="grid grid-cols-5 gap-1.5 sm:grid-cols-8"
          >
            {LETTERS.map((l, index) => (
              <button
                key={l.glyph}
                ref={(el) => {
                  buttonRefs.current[index] = el;
                }}
                type="button"
                role="radio"
                aria-checked={l.glyph === active}
                tabIndex={l.glyph === active ? 0 : -1}
                onClick={() => setActive(l.glyph)}
                onKeyDown={(e) => onKeyDown(e, index)}
                className={cn(
                  "flex min-h-12 flex-col items-center justify-center rounded-lg px-1 py-2",
                  l.glyph === active
                    ? "bg-primary text-primary-fg"
                    : l.kind === "loan"
                      ? "border border-dashed border-border bg-transparent text-muted"
                      : "bg-surface text-fg shadow-[var(--shadow-border)]",
                )}
              >
                <span className="font-display text-lg leading-none">{l.glyph}</span>
                <span className="mt-1 text-xs opacity-70">
                  {l.kind.startsWith("vowel") ? "v" : l.kind === "loan" ? "·" : ""}
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
            <h2 className="font-display text-lg font-semibold">The four rare ones</h2>
            <p className="mt-2 text-sm text-muted">
              Dashed in the grid above. They are part of the alphabet, but you will meet them almost
              only in foreign words and old family names.
            </p>
            <ul className="mt-3 space-y-1 text-sm">
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
