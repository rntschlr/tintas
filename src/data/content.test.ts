import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CASES, LAB_NOUNS, labCaseForm } from "./cases.ts";
import { VERBS } from "./verbs.ts";

describe("verb paradigms", () => {
  it("gives eszik the real second-person form", () => {
    const eszik = VERBS.find((verb) => verb.id === "eszik");
    assert.ok(eszik);
    assert.equal(eszik.presentIndef[1], "eszel");
  });

  it("does not invent a definite column for intransitive ül", () => {
    const ul = VERBS.find((verb) => verb.id === "ul");
    assert.ok(ul);
    assert.deepEqual(ul.presentDef, ["—", "—", "—", "—", "—", "—"]);
  });
});

describe("case lab forms", () => {
  const budapest = LAB_NOUNS.find((noun) => noun.stem === "Budapest");
  const haz = LAB_NOUNS.find((noun) => noun.stem === "ház");

  it("keeps Budapest front and warns on the interior triad", () => {
    assert.ok(budapest);
    assert.equal(budapest.harmony, "front");
    const shown = labCaseForm(budapest, "inessive");
    assert.equal(shown.form, "Budapestben");
    assert.match(shown.caution ?? "", /Budapesten/);
  });

  it("does not pretend the bare stem is a temporal form", () => {
    assert.ok(haz);
    const shown = labCaseForm(haz, "temporal");
    assert.equal(shown.form, "—");
    assert.match(shown.caution ?? "", /-kor/);
  });

  it("teaches Pécsett as the locative", () => {
    const inessive = CASES.find((item) => item.id === "inessive");
    assert.ok(inessive);
    assert.match(inessive.notWhen, /Pécsett/);
    assert.equal(inessive.notWhen.includes("Pécsen"), false);
  });
});
