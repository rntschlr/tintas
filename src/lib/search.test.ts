import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createSearchMatcher, searchHits, type SearchHit } from "./search-core.ts";

describe("searchHits", () => {
  const index: SearchHit[] = [
    { href: "/cases/inessive", title: "Inessive -ban/-ben", subtitle: "in / inside" },
    { href: "/verbs", title: "Verbs", subtitle: "conjugation patterns" },
    { href: "/lab", title: "ír — to write", subtitle: "írok, írsz, ír" },
    { href: "/lab", title: "ír — to write", subtitle: "duplicate" },
    { href: "/alphabet", title: "A  ·  a", subtitle: "alma — apple" },
    { href: "/phrases", title: "Jó napot", subtitle: "Good day" },
  ];

  it("returns empty for blank query", () => {
    assert.deepEqual(searchHits("   ", index), []);
  });

  it("ranks exact / prefix title matches above subtitle-only hits", () => {
    const hits = searchHits("ír", index);
    assert.ok(hits.length >= 1);
    assert.equal(hits[0]?.title.startsWith("ír"), true);
  });

  it("matches case-insensitively on title and subtitle", () => {
    const hits = searchHits("INESSIVE", index);
    assert.ok(hits.some((h) => h.href === "/cases/inessive"));
    const sub = searchHits("apple", index);
    assert.ok(sub.some((h) => h.href === "/alphabet"));
  });

  it("dedupes by href+title", () => {
    const hits = searchHits("ír — to write", index);
    const keys = hits.map((h) => h.href + h.title);
    assert.equal(new Set(keys).size, keys.length);
    assert.equal(hits.filter((h) => h.title === "ír — to write").length, 1);
  });

  it("respects limit", () => {
    const wide: SearchHit[] = Array.from({ length: 40 }, (_, i) => ({
      href: `/x/${i}`,
      title: `alpha ${i}`,
      subtitle: "note",
    }));
    assert.equal(searchHits("alpha", wide, 5).length, 5);
  });

  it("prefers title start over loose includes", () => {
    const hits = searchHits("ver", index);
    assert.equal(hits[0]?.title, "Verbs");
  });

  it("normalizes hit text once for repeated queries", () => {
    let titleReads = 0;
    let subtitleReads = 0;
    const matcher = createSearchMatcher([
      {
        href: "/test",
        get title() {
          titleReads += 1;
          return "Hungarian";
        },
        get subtitle() {
          subtitleReads += 1;
          return "Language notes";
        },
      },
    ]);

    assert.equal(matcher("hung").length, 1);
    assert.equal(matcher("language").length, 1);
    assert.equal(titleReads, 1);
    assert.equal(subtitleReads, 1);
  });
});

describe("accent-insensitive fallback", () => {
  const index: SearchHit[] = [
    { href: "/basics", title: "ház", subtitle: "house" },
    { href: "/basics", title: "haz-ish", subtitle: "plain ascii" },
    { href: "/phrases", title: "Köszönöm", subtitle: "Thank you" },
  ];

  it("finds accented titles from unaccented queries", () => {
    assert.ok(searchHits("koszonom", index).some((hit) => hit.title === "Köszönöm"));
  });

  it("ranks accent-faithful matches above folded ones", () => {
    assert.equal(searchHits("ház", index)[0]?.title, "ház");
    assert.equal(searchHits("haz", index)[0]?.title, "haz-ish");
    assert.ok(searchHits("haz", index).some((hit) => hit.title === "ház"));
  });

  it("treats decomposed input like composed input", () => {
    assert.equal(searchHits("ha\u0301z", index)[0]?.title, "ház");
  });
});
