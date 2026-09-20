import { useMemo, useState } from "react";
import { CASES, LAB_NOUNS } from "@/data/cases";
import { PERSONS, VERBS } from "@/data/verbs";
import { classifyHarmony, sampleSuffixes } from "@/lib/hungarian";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Paper, Hu } from "@/components/page";
import { cn } from "@/lib/utils";

export function HarmonyLab({ compact = false }: { compact?: boolean }) {
  const [word, setWord] = useState("ház");

  const result = classifyHarmony(word || "a");
  const suffixes = sampleSuffixes(result.class);

  return (
    <Paper>
      <p className="text-xs font-medium tracking-[0.16em] text-primary uppercase">Harmony bench</p>
      <h2 className="mt-1 font-display text-2xl font-semibold">Type a word</h2>
      <p className="mt-1 text-sm text-muted">
        Last classifying vowel wins. i/í sit out in mixed words; alone, the stem decides.
      </p>
      <Input
        className="mt-4 font-serif text-lg"
        value={word}
        onChange={(e) => setWord(e.target.value)}
        aria-label="Hungarian word"
        spellCheck={false}
        suppressHydrationWarning
      />
      <div className="mt-4 flex flex-wrap gap-2">
        <Badge>{result.label}</Badge>
        <Badge variant="muted">vowels {result.vowels.join(" · ") || "—"}</Badge>
      </div>
      {result.caveat ? <p className="mt-3 text-sm text-muted">{result.caveat}</p> : null}
      {!compact && suffixes.length ? (
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {suffixes.map((s) => (
            <li key={s.name} className="rounded-lg bg-bg-elevated px-3 py-2 text-sm">
              <span className="text-muted">{s.name}</span>
              <span className="ml-2 font-serif text-fg">{s.form}</span>
            </li>
          ))}
        </ul>
      ) : null}
      {!compact && result.caveat ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg bg-bg-elevated px-3 py-2 text-sm">
            <p className="text-xs tracking-wide text-muted uppercase">If back · híd</p>
            <p className="mt-1 font-serif text-fg">-ban · -nak · -hoz · -ok</p>
          </div>
          <div className="rounded-lg bg-bg-elevated px-3 py-2 text-sm">
            <p className="text-xs tracking-wide text-muted uppercase">If front · víz</p>
            <p className="mt-1 font-serif text-fg">-ben · -nek · -hez · -ek</p>
          </div>
        </div>
      ) : null}
    </Paper>
  );
}

export function CaseLab() {
  const [stem, setStem] = useState(LAB_NOUNS[0].stem);
  const [caseId, setCaseId] = useState("inessive");
  const noun = LAB_NOUNS.find((n) => n.stem === stem) ?? LAB_NOUNS[0];
  const cas = CASES.find((c) => c.id === caseId) ?? CASES[0];
  const form = noun.forms[caseId] ?? noun.stem;
  const triadCases = useMemo(
    () => CASES.filter((c) => c.triad),
    [],
  );

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
      <Paper>
        <p className="text-xs font-medium tracking-[0.16em] text-primary uppercase">Case lab</p>
        <h2 className="mt-1 font-display text-2xl font-semibold">Pick a noun</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {LAB_NOUNS.map((n) => (
            <button
              key={n.stem}
              onClick={() => setStem(n.stem)}
              className={cn(
                "h-11 rounded-lg px-3 text-sm",
                n.stem === stem ? "bg-primary text-primary-fg" : "bg-bg-elevated text-fg",
              )}
            >
              <Hu>{n.stem}</Hu>
              <span className="ml-1 text-xs opacity-70">{n.en}</span>
            </button>
          ))}
        </div>
        <div className="mt-6 rounded-xl bg-bg px-4 py-6 text-center">
          <p className="text-xs tracking-wide text-muted uppercase">{cas.name}</p>
          <p className="mt-2 font-display text-4xl font-semibold">{form}</p>
          <p className="mt-2 text-sm text-muted">
            {cas.suffixes.join(" / ")} · {cas.english}
          </p>
        </div>
      </Paper>
      <Paper>
        <p className="mb-3 text-sm text-muted">Grammatical</p>
        <div className="flex flex-wrap gap-1.5">
          {CASES.filter((c) => !c.triad).map((c) => (
            <button
              key={c.id}
              onClick={() => setCaseId(c.id)}
              className={cn(
                "h-10 rounded-md px-2.5 text-xs",
                c.id === caseId ? "bg-primary text-primary-fg" : "bg-bg-elevated text-fg",
              )}
            >
              {c.suffixes[0]} {c.name}
            </button>
          ))}
        </div>
        <p className="mt-5 mb-3 text-sm text-muted">Movement triads</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {(["space", "surface", "proximity"] as const).map((t) => (
            <div key={t} className="rounded-xl bg-bg-elevated p-3">
              <p className="mb-2 text-xs tracking-wide text-muted uppercase">{t}</p>
              <div className="flex flex-col gap-1">
                {triadCases
                  .filter((c) => c.triad === t)
                  .map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setCaseId(c.id)}
                      className={cn(
                        "rounded-md px-2 py-1.5 text-left text-xs",
                        c.id === caseId ? "bg-primary text-primary-fg" : "bg-surface text-fg",
                      )}
                    >
                      {c.suffixes.join(" ")}
                      <span className="mt-0.5 block opacity-70">{c.english}</span>
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </Paper>
    </div>
  );
}

export function Conjugator() {
  const [id, setId] = useState(VERBS[0].id);
  const verb = VERBS.find((v) => v.id === id) ?? VERBS[0];
  const hasDef = verb.presentDef[0] !== "—";

  return (
    <Paper>
      <p className="text-xs font-medium tracking-[0.16em] text-primary uppercase">Conjugator</p>
      <h2 className="mt-1 font-display text-2xl font-semibold">
        <Hu>{verb.stem}</Hu>
        <span className="ml-2 text-lg font-sans font-normal text-muted">{verb.en}</span>
      </h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {VERBS.map((v) => (
          <button
            key={v.id}
            onClick={() => setId(v.id)}
            className={cn(
              "h-10 rounded-lg px-3 text-sm",
              v.id === id ? "bg-primary text-primary-fg" : "bg-bg-elevated text-fg",
            )}
          >
            {v.stem}
          </button>
        ))}
      </div>
      {verb.note ? <p className="mt-4 text-sm text-muted">{verb.note}</p> : null}
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[32rem] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs tracking-wide text-muted uppercase">
              <th className="py-2 pr-3 font-medium">Person</th>
              <th className="py-2 pr-3 font-medium">Present indef.</th>
              {hasDef ? <th className="py-2 pr-3 font-medium">Present def.</th> : null}
              <th className="py-2 font-medium">Past indef.</th>
            </tr>
          </thead>
          <tbody>
            {PERSONS.map((p, i) => (
              <tr key={p} className="border-b border-border/70">
                <td className="py-2 pr-3 text-muted">{p}</td>
                <td className="py-2 pr-3 font-serif text-base">{verb.presentIndef[i]}</td>
                {hasDef ? <td className="py-2 pr-3 font-serif text-base">{verb.presentDef[i]}</td> : null}
                <td className="py-2 font-serif text-base">{verb.pastIndef[i]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Paper>
  );
}
