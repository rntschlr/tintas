export type NavItem = {
  href: string;
  label: string;
  id: string;
  blurb: string;
};

export type NavGroup = {
  id: string;
  label: string;
  items: NavItem[];
};

export const NAV_GROUPS: NavGroup[] = [
  {
    id: "foundations",
    label: "Foundations",
    items: [
      { id: "alphabet", href: "/alphabet", label: "Alphabet", blurb: "40 letters, the s/sz trap" },
      { id: "harmony", href: "/harmony", label: "Vowel harmony", blurb: "Back, front, rounded" },
    ],
  },
  {
    id: "grammar",
    label: "Grammar",
    items: [
      { id: "cases", href: "/cases", label: "Noun cases", blurb: "18 endings and the triads" },
      { id: "verbs", href: "/verbs", label: "Verbs", blurb: "Definite, coverbs, mood" },
      { id: "possession", href: "/possession", label: "Possession", blurb: "házam, van kutyám" },
      { id: "pronouns", href: "/pronouns", label: "Pronouns", blurb: "Drop them, case them" },
      { id: "adjectives", href: "/adjectives", label: "Adjectives", blurb: "Comparative, no agreement" },
      { id: "word-building", href: "/word-building", label: "Word-building", blurb: "Suffix machinery" },
      { id: "grammar", href: "/grammar", label: "Syntax", blurb: "van, plurals, word order" },
    ],
  },
  {
    id: "reference",
    label: "Reference",
    items: [
      { id: "basics", href: "/basics", label: "Basics", blurb: "Numbers, colours, time" },
      { id: "phrases", href: "/phrases", label: "How to say", blurb: "Hello to I love you" },
    ],
  },
  {
    id: "practice",
    label: "Practice",
    items: [
      { id: "lab", href: "/lab", label: "Workbenches", blurb: "Case lab, conjugator" },
      { id: "practice", href: "/practice", label: "Drill", blurb: "Twenty questions" },
    ],
  },
];

export const NAV: NavItem[] = [
  { id: "desk", href: "/", label: "Desk", blurb: "Start here" },
  ...NAV_GROUPS.flatMap((group) => group.items),
];

export const STUDY_PATH: NavItem[] = [
  { id: "alphabet", href: "/alphabet", label: "Alphabet", blurb: "s vs sz, long vowels" },
  { id: "harmony", href: "/harmony", label: "Harmony", blurb: "The rule that runs the rest" },
  { id: "cases", href: "/cases", label: "Cases", blurb: "Three pictures of space" },
  { id: "verbs", href: "/verbs", label: "Verbs", blurb: "Two conjugations" },
  { id: "phrases", href: "/phrases", label: "Phrases", blurb: "What you actually say" },
  { id: "practice", href: "/practice", label: "Drill", blurb: "Twenty questions" },
];
