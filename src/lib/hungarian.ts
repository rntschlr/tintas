export type Harmony = "back" | "front" | "rounded" | "neutral";

const BACK = "aáoóuú";
const FRONT_UNROUNDED = "eé";
const FRONT_ROUNDED = "öőüű";
const NEUTRAL = "ií";

/**
 * i/í-only stems are lexical, not a rule. The workbench looks up the common
 * ones a learner will type; anything else is flagged instead of being sold as
 * back (the old lie that made víz take -ban).
 */
const I_STEM_FRONT = new Set(["víz", "szív", "hit", "visz", "szín", "cím", "tíz", "íz", "csíp"]);
const I_STEM_BACK = new Set(["híd", "síp", "nyíl", "ír", "hív", "sír", "ín", "díj", "nyit"]);

function lastClassifying(word: string): Harmony {
  const w = word.toLowerCase().normalize("NFC");
  let seen: Harmony = "neutral";
  for (const ch of w) {
    if (BACK.includes(ch)) seen = "back";
    else if (FRONT_ROUNDED.includes(ch)) seen = "rounded";
    else if (FRONT_UNROUNDED.includes(ch)) seen = "front";
  }
  return seen;
}

function resolveNeutral(stem: string): { cls: Harmony; caveat?: string } {
  if (I_STEM_FRONT.has(stem)) return { cls: "front" };
  if (I_STEM_BACK.has(stem)) return { cls: "back" };
  return {
    cls: "neutral",
    caveat:
      "i/í-only stems split. híd, síp, ír take back; víz, szív, hit take front. This bench will not guess.",
  };
}

export function classifyHarmony(word: string): {
  class: Harmony;
  vowels: string[];
  label: string;
  twoFold: string;
  threeFold: string;
  /** Set when the stem is i/í-only and not in the lexicon — do not pick a camp. */
  caveat?: string;
} {
  const w = word.toLowerCase().normalize("NFC").trim();
  const vowels = [...w].filter(
    (ch) =>
      BACK.includes(ch) || FRONT_UNROUNDED.includes(ch) || FRONT_ROUNDED.includes(ch) || NEUTRAL.includes(ch),
  );
  let cls = lastClassifying(w);
  let caveat: string | undefined;
  if (cls === "neutral" && vowels.length > 0) {
    const resolved = resolveNeutral(w);
    cls = resolved.cls;
    caveat = resolved.caveat;
  }
  const label =
    cls === "back"
      ? "Back — endings like -ban, -ok, -hoz"
      : cls === "rounded"
        ? "Front rounded — endings like -ben, -ök, -höz"
        : cls === "front"
          ? "Front unrounded — endings like -ben, -ek, -hez"
          : "i/í only — the stem decides, not the vowel";
  return {
    class: cls,
    vowels,
    label,
    twoFold:
      cls === "neutral"
        ? "back or front — look the word up"
        : cls === "back"
          ? "back (-ban, -nak, -val)"
          : "front (-ben, -nek, -vel)",
    threeFold:
      cls === "neutral"
        ? "—"
        : cls === "back"
          ? "-ok / -hoz / -on"
          : cls === "rounded"
            ? "-ök / -höz / -ön"
            : "-ek / -hez / -en",
    ...(caveat ? { caveat } : {}),
  };
}

export function sampleSuffixes(cls: Harmony) {
  if (cls === "neutral") return [];
  const back = cls === "back";
  const rounded = cls === "rounded";
  return [
    { name: "inessive", form: back ? "-ban" : "-ben" },
    { name: "dative", form: back ? "-nak" : "-nek" },
    { name: "allative", form: back ? "-hoz" : rounded ? "-höz" : "-hez" },
    { name: "plural", form: back ? "-ok" : rounded ? "-ök" : "-ek" },
    { name: "1sg indef.", form: back ? "-ok" : rounded ? "-ök" : "-ek" },
  ];
}
