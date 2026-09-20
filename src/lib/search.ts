import { LETTERS } from "@/data/alphabet";
import { CASES } from "@/data/cases";
import { VERB_TOPICS, VERBS, COVERBS } from "@/data/verbs";
import { POSTPOSITIONS, WORD_BUILDING } from "@/data/grammar";
import {
  COLOURS,
  COUNTRIES,
  DAYS,
  GREETINGS,
  INTRODUCTIONS,
  MONTHS,
  NUMBERS,
  PHRASES,
} from "@/data/vocab";
import { NAV } from "@/data/nav";
import { searchHits, type SearchHit } from "./search-core";

export type { SearchHit };
export { searchHits };

export function buildSearchIndex(): SearchHit[] {
  const hits: SearchHit[] = NAV.map((n) => ({
    href: n.href,
    title: n.label,
    subtitle: n.blurb,
  }));

  for (const l of LETTERS) {
    hits.push({
      href: "/alphabet",
      title: `${l.glyph}  ·  ${l.name}`,
      subtitle: `${l.example.hu} — ${l.hint}`,
    });
  }
  for (const c of CASES) {
    // suffixes is ["—"] for the nominative (no ending) — join only real endings
    // so the subtitle never doubles up on dashes.
    const endings = c.suffixes.filter((s) => s !== "—").join(" / ");
    // c.english (e.g. genitive's "the one belonging to…") can already end in
    // its own punctuation — strip it before appending our period so the
    // subtitle never reads "…. ".
    const gloss = c.english.replace(/[.…]+$/, "");
    hits.push({
      href: `/cases/${c.id}`,
      title: `${c.headline} · ${c.name}`,
      subtitle: `${c.huName}${endings ? `  ${endings}` : ""} — ${gloss}. ${c.summary}`,
    });
  }
  for (const v of VERB_TOPICS) {
    hits.push({ href: `/verbs#${v.id}`, title: v.title, subtitle: v.summary });
  }
  for (const v of VERBS) {
    hits.push({
      href: "/lab",
      title: `${v.stem} — ${v.en}`,
      subtitle: v.presentIndef.slice(0, 3).join(", "),
    });
  }
  for (const c of COVERBS) {
    hits.push({ href: "/verbs#coverbs", title: `Coverb ${c.prefix}`, subtitle: c.sense });
  }
  for (const p of POSTPOSITIONS) {
    hits.push({ href: "/grammar", title: p.hu, subtitle: `${p.en} (${p.personal})` });
  }
  for (const w of WORD_BUILDING) {
    hits.push({ href: "/word-building", title: w.suffix, subtitle: `${w.makes} — ${w.ex}` });
  }
  const bags: { href: string; items: { hu: string; en: string }[] }[] = [
    { href: "/phrases", items: [...GREETINGS, ...INTRODUCTIONS, ...PHRASES] },
    { href: "/basics", items: [...NUMBERS, ...COLOURS, ...DAYS, ...MONTHS, ...COUNTRIES] },
  ];
  for (const bag of bags) {
    for (const it of bag.items) {
      hits.push({ href: bag.href, title: it.hu, subtitle: it.en });
    }
  }
  return hits;
}
