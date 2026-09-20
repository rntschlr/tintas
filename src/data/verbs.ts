export type PersonRow = {
  person: string;
  back: string;
  front: string;
  rounded: string;
};

export const INDEF_PRESENT: PersonRow[] = [
  { person: "én", back: "-ok", front: "-ek", rounded: "-ök" },
  { person: "te", back: "-sz / -ol / -asz", front: "-sz / -el / -esz", rounded: "-sz / -öl" },
  { person: "ő", back: "—", front: "—", rounded: "—" },
  { person: "mi", back: "-unk", front: "-ünk", rounded: "-ünk" },
  { person: "ti", back: "-tok / -otok", front: "-tek / -etek", rounded: "-tök / -ötök" },
  { person: "ők", back: "-nak", front: "-nek", rounded: "-nek" },
];

export const DEF_PRESENT: PersonRow[] = [
  { person: "én", back: "-om", front: "-em", rounded: "-öm" },
  { person: "te", back: "-od", front: "-ed", rounded: "-öd" },
  { person: "ő", back: "-ja / -a", front: "-i / -e", rounded: "-i / -ö" },
  { person: "mi", back: "-juk", front: "-jük", rounded: "-jük" },
  { person: "ti", back: "-játok", front: "-itek", rounded: "-itek" },
  { person: "ők", back: "-ják", front: "-ik", rounded: "-ik" },
];

export type VerbEntry = {
  id: string;
  stem: string;
  en: string;
  harmony: "back" | "front" | "rounded";
  ik?: boolean;
  irregular?: boolean;
  presentIndef: string[];
  presentDef: string[];
  pastIndef: string[];
  note?: string;
};

export const VERBS: VerbEntry[] = [
  {
    id: "lat",
    stem: "lát",
    en: "see",
    harmony: "back",
    presentIndef: ["látok", "látsz", "lát", "látunk", "láttok", "látnak"],
    presentDef: ["látom", "látod", "látja", "látjuk", "látjátok", "látják"],
    pastIndef: ["láttam", "láttál", "látott", "láttunk", "láttatok", "láttak"],
    note: "Textbook regular. Also látlak — I see you (the -lak/-lek form).",
  },
  {
    id: "szeret",
    stem: "szeret",
    en: "like / love",
    harmony: "front",
    presentIndef: ["szeretek", "szeretsz", "szeret", "szeretünk", "szerettek", "szeretnek"],
    presentDef: ["szeretem", "szereted", "szereti", "szeretjük", "szeretitek", "szeretik"],
    pastIndef: ["szerettem", "szerettél", "szeretett", "szerettünk", "szerettetek", "szerettek"],
    note: "szeretlek is ‘I love you’. Definite szerettem őt vs indefinite szerettem valakit.",
  },
  {
    id: "ul",
    stem: "ül",
    en: "sit",
    harmony: "rounded",
    presentIndef: ["ülök", "ülsz", "ül", "ülünk", "ültök", "ülnek"],
    presentDef: ["ülöm", "ülöd", "üli", "üljük", "ülitek", "ülik"],
    pastIndef: ["ültem", "ültél", "ült", "ültünk", "ültetek", "ültek"],
  },
  {
    id: "olvas",
    stem: "olvas",
    en: "read",
    harmony: "back",
    presentIndef: ["olvasok", "olvasol", "olvas", "olvasunk", "olvastok", "olvasnak"],
    presentDef: ["olvasom", "olvasod", "olvassa", "olvassuk", "olvassátok", "olvassák"],
    pastIndef: ["olvastam", "olvastál", "olvasott", "olvastunk", "olvastatok", "olvastak"],
    note: "Sibilant stem: -j of definite becomes s — olvassa, not olvasja. te = olvasol.",
  },
  {
    id: "nez",
    stem: "néz",
    en: "look / watch",
    harmony: "front",
    presentIndef: ["nézek", "nézel", "néz", "nézünk", "néztek", "néznek"],
    presentDef: ["nézem", "nézed", "nézi", "nézzük", "nézitek", "nézik"],
    pastIndef: ["néztem", "néztél", "nézett", "néztünk", "néztetek", "néztek"],
    note: "nézzük assimilates z + j → zz.",
  },
  {
    id: "ad",
    stem: "ad",
    en: "give",
    harmony: "back",
    presentIndef: ["adok", "adsz", "ad", "adunk", "adtok", "adnak"],
    presentDef: ["adom", "adod", "adja", "adjuk", "adjátok", "adják"],
    pastIndef: ["adtam", "adtál", "adott", "adtunk", "adtatok", "adtak"],
  },
  {
    id: "ker",
    stem: "kér",
    en: "ask for / please (polite request)",
    harmony: "front",
    presentIndef: ["kérek", "kérsz", "kér", "kérünk", "kértek", "kérnek"],
    presentDef: ["kérem", "kéred", "kéri", "kérjük", "kéritek", "kérik"],
    pastIndef: ["kértem", "kértél", "kért", "kértünk", "kértetek", "kértek"],
    note: "Egy kávét kérek — a coffee, please. Kérem is also ‘here you are’ / ‘I beg you’.",
  },
  {
    id: "tud",
    stem: "tud",
    en: "know / can",
    harmony: "back",
    presentIndef: ["tudok", "tudsz", "tud", "tudunk", "tudtok", "tudnak"],
    presentDef: ["tudom", "tudod", "tudja", "tudjuk", "tudjátok", "tudják"],
    pastIndef: ["tudtam", "tudtál", "tudott", "tudtunk", "tudtatok", "tudtak"],
    note: "Tudok úszni — I can swim (indefinite + infinitive). Tudom a választ — I know the answer (definite).",
  },
  {
    id: "akar",
    stem: "akar",
    en: "want",
    harmony: "back",
    presentIndef: ["akarok", "akarsz", "akar", "akarunk", "akartok", "akarnak"],
    presentDef: ["akarom", "akarod", "akarja", "akarjuk", "akarjátok", "akarják"],
    pastIndef: ["akartam", "akartál", "akart", "akartunk", "akartatok", "akartak"],
  },
  {
    id: "beszel",
    stem: "beszél",
    en: "speak",
    harmony: "front",
    presentIndef: ["beszélek", "beszélsz", "beszél", "beszélünk", "beszéltek", "beszélnek"],
    presentDef: ["beszélem", "beszéled", "beszéli", "beszéljük", "beszélitek", "beszélik"],
    pastIndef: ["beszéltem", "beszéltél", "beszélt", "beszéltünk", "beszéltetek", "beszéltek"],
    note: "Beszélek magyarul — I speak Hungarian (language in -ul/-ül, indefinite).",
  },
  {
    id: "ir",
    stem: "ír",
    en: "write",
    harmony: "back",
    presentIndef: ["írok", "írsz", "ír", "írunk", "írtok", "írnak"],
    presentDef: ["írom", "írod", "írja", "írjuk", "írjátok", "írják"],
    pastIndef: ["írtam", "írtál", "írt", "írtunk", "írtatok", "írtak"],
    note: "ír is a back i-stem: írok, not írek. Compare visz → viszek — i/í-only verbs split.",

  },
  {
    id: "dolgozik",
    stem: "dolgozik",
    en: "work",
    harmony: "back",
    ik: true,
    presentIndef: ["dolgozom", "dolgozol", "dolgozik", "dolgozunk", "dolgoztok", "dolgoznak"],
    presentDef: ["dolgozom", "dolgozod", "dolgozza", "dolgozzuk", "dolgozzátok", "dolgozzák"],
    pastIndef: ["dolgoztam", "dolgoztál", "dolgozott", "dolgoztunk", "dolgoztatok", "dolgoztak"],
    note: "-ik verbs: én looks like definite (-om) even in the indefinite set. ő = dolgozik.",
  },
  {
    id: "eszik",
    stem: "eszik",
    en: "eat",
    harmony: "front",
    ik: true,
    irregular: true,
    presentIndef: ["eszem", "eszél", "eszik", "eszünk", "esztek", "esznek"],
    presentDef: ["eszem", "eszed", "eszi", "esszük", "eszitek", "eszik"],
    pastIndef: ["ettem", "ettél", "evett", "ettünk", "ettetek", "ettek"],
    note: "Stem splits: esz- / ev- / ett-. Classic irregular.",
  },
  {
    id: "megy",
    stem: "megy",
    en: "go",
    harmony: "front",
    irregular: true,
    presentIndef: ["megyek", "mész", "megy", "megyünk", "mentek", "mennek"],
    presentDef: ["—", "—", "—", "—", "—", "—"],
    pastIndef: ["mentem", "mentél", "ment", "mentünk", "mentetek", "mentek"],
    note: "Intransitive, so no definite set. te = mész. Coverbs: elmegy, bemegy, kimegy, felmegy.",
  },
  {
    id: "jon",
    stem: "jön",
    en: "come",
    harmony: "rounded",
    irregular: true,
    presentIndef: ["jövök", "jössz", "jön", "jövünk", "jöttök", "jönnek"],
    presentDef: ["—", "—", "—", "—", "—", "—"],
    pastIndef: ["jöttem", "jöttél", "jött", "jöttünk", "jöttetek", "jöttek"],
  },
  {
    id: "van",
    stem: "van",
    en: "be / exist",
    harmony: "back",
    irregular: true,
    presentIndef: ["vagyok", "vagy", "van", "vagyunk", "vagytok", "vannak"],
    presentDef: ["—", "—", "—", "—", "—", "—"],
    pastIndef: ["voltam", "voltál", "volt", "voltunk", "voltatok", "voltak"],
    note: "Dropped in 3rd person when it only links a quality: Ő tanár. Kept for location and existence: Itt van. Van kenyér.",
  },
];

export const PERSONS = ["én", "te", "ő", "mi", "ti", "ők"];

export const VERB_TOPICS = [
  {
    id: "definite",
    title: "Definite vs indefinite",
    summary: "Hungarian verbs have two present (and past) conjugations, chosen by how specific the object is.",
    points: [
      "Indefinite: no object, an indefinite object (egy, valami), or a first/second-person object that isn’t ‘you-as-object of I/we’.",
      "Definite: a/az, ez/az, possessives, proper names, third-person pronouns, clauses with hogy.",
      "Extra form: -lak/-lek when I/we act on you: látlak, szeretlek.",
      "Learn definite first if you like patterns — it tracks possession endings.",
    ],
    examples: [
      { hu: "Olvasok egy könyvet.", en: "I’m reading a book. (indefinite)" },
      { hu: "Olvasom a könyvet.", en: "I’m reading the book. (definite)" },
      { hu: "Szeretlek.", en: "I love you." },
    ],
  },
  {
    id: "past",
    title: "Past tense",
    summary: "One past. Marker -t / -tt / -ott / -ett / -ött, then personal endings. Definite and indefinite still split.",
    points: [
      "Indefinite past endings: -am/-em, -ál/-él, -ott/-ett/-ött (or -t), -unk/-ünk, -atok/-etek, -ak/-ek.",
      "Definite past: -am/-em, -ad/-ed, -a/-e, -uk/-ük, -átok/-étek, -ák/-ék (with the t already on the stem).",
      "láttam / láttam őt — I saw / I saw him. The definite is often identical in 1sg, distinguished by the object.",
      "vowel-harmony and stem-final sounds pick -t vs -ott: kért, szeretett, ült, mondott.",
    ],
    examples: [
      { hu: "Tegnap moziban voltam.", en: "Yesterday I was at the cinema." },
      { hu: "Megírtam a levelet.", en: "I wrote the letter (and finished it)." },
    ],
  },
  {
    id: "future",
    title: "Future",
    summary: "No dedicated future tense. Use present + time word, or fog + infinitive.",
    points: [
      "Holnap megyek — I’m going tomorrow. Present covers scheduled future.",
      "fogok / fogsz / fog / fogunk / fogtok / fognak + infinitive (indefinite).",
      "Definite: fogom / fogod / fogja / fogjuk / fogjátok / fogják + infinitive.",
      "foglak látni — I will see you.",
      "Two-verb frames (akar, tud, szeret, kell) already take an infinitive; don’t stack fog unless you mean a real future of that verb.",
    ],
    examples: [
      { hu: "Holnap találkozunk.", en: "We’ll meet tomorrow." },
      { hu: "Fogom szeretni ezt a várost.", en: "I will come to love this city." },
    ],
  },
  {
    id: "conditional",
    title: "Conditional",
    summary: "Would / should. Present conditional adds -na/-ne plus personal endings. Past uses past + volna.",
    points: [
      "Indefinite: látnék, látnál, látna, látnánk, látnátok, látnának.",
      "Definite: látnám, látnád, látná, látnánk, látnátok, látnák.",
      "Past conditional: láttam volna — I would have seen.",
      "Szeretnék egy kávét — I would like a coffee (the polite default).",
    ],
    examples: [
      { hu: "Ha időm lenne, mennék.", en: "If I had time, I would go." },
      { hu: "Megnézném azt a filmet.", en: "I’d watch that film." },
    ],
  },
  {
    id: "imperative",
    title: "Imperative / subjunctive",
    summary: "Commands, wishes, and the mood after hogy in ‘I want you to…’. Marker is often a long/short -j- with assimilation.",
    points: [
      "Indefinite: láss / lássál, nézz, gyere, ülj le.",
      "Definite: lásd, nézd, add ide — notice d instead of j on some stems.",
      "1pl: menjünk, nézzük — let’s…",
      "Negative command uses ne, not nem: Ne menj! Ne edd meg!",
      "Polite: tessék + infinitive, or 3rd person subjunctive: jöjjön be.",
    ],
    examples: [
      { hu: "Gyere ide!", en: "Come here!" },
      { hu: "Ne beszélj hangosan.", en: "Don’t speak loudly." },
      { hu: "Azt akarom, hogy maradj.", en: "I want you to stay." },
    ],
  },
  {
    id: "coverbs",
    title: "Verbal prefixes (coverbs)",
    summary: "meg, el, ki, be, fel, le, át, vissza and friends. They add direction or perfectivity, and they split off the verb.",
    points: [
      "meg — completion: ír vs megír (write vs get it written).",
      "el — away / thoroughly: elmegy, elolvas.",
      "ki / be / fel / le — out / in / up / down.",
      "In neutral statements the coverb stays on the verb: Megírtam a levelet.",
      "It splits when something else is focused, in imperatives, and with negation: Nem írtam meg. Írd meg! Most írom meg.",
      "The coverb is the stressed piece when it is the new information.",
    ],
    examples: [
      { hu: "Bemegyek a házba.", en: "I go into the house." },
      { hu: "Nem megyek be.", en: "I’m not going in." },
      { hu: "Olvasd el ezt.", en: "Read this (through)." },
    ],
  },
  {
    id: "hat-het",
    title: "Potential -hat / -het",
    summary: "May / can (permission or possibility), stacked onto the stem before personal endings.",
    points: [
      "láthatok — I can/may see. mehetünk — we may go.",
      "Free of the definite/indefinite split in meaning, but still conjugated in both if there’s an object: láthatom.",
      "Different from tud, which is ability as a lexical verb.",
    ],
    examples: [
      { hu: "Itt lehet dohányozni?", en: "May one smoke here?" },
      { hu: "Holnap jöhetsz.", en: "You may come tomorrow." },
    ],
  },
  {
    id: "kell",
    title: "kell — need / must",
    summary: "Impersonal necessity. The person goes on the infinitive, not on kell.",
    points: [
      "Mennem kell — I have to go (literally ‘my-going is-necessary’).",
      "Infinitive personal suffixes: mennem, menned, mennie, mennünk, mennetek, menniük.",
      "Past: kellett mennem. Conditional: kellene mennem.",
      "Free-standing: Kell a kulcs — the key is needed.",
    ],
    examples: [
      { hu: "Várnod kell.", en: "You have to wait." },
      { hu: "Nem kell sietned.", en: "You don’t have to hurry." },
    ],
  },
  {
    id: "szokott",
    title: "szokott — usually",
    summary: "A past-shaped helper that means habitual present. Pair it with an infinitive.",
    points: [
      "Reggel kávézni szoktam — I usually have coffee in the morning.",
      "Conjugation is past-like: szoktam, szoktál, szokott, szoktunk, szoktatok, szoktak.",
      "Negate the helper: Nem szoktam dohányozni.",
    ],
    examples: [
      { hu: "Este olvasni szokott.", en: "She usually reads in the evening." },
    ],
  },
];

export const COVERBS = [
  { prefix: "meg", sense: "completion / perfective" },
  { prefix: "el", sense: "away, thoroughly" },
  { prefix: "ki", sense: "out" },
  { prefix: "be", sense: "in" },
  { prefix: "fel / föl", sense: "up" },
  { prefix: "le", sense: "down" },
  { prefix: "át", sense: "across, over" },
  { prefix: "vissza", sense: "back" },
  { prefix: "össze", sense: "together" },
  { prefix: "szét", sense: "apart" },
  { prefix: "oda", sense: "to there" },
  { prefix: "ide", sense: "to here" },
  { prefix: "tovább", sense: "onward" },
  { prefix: "haza", sense: "homeward" },
];
