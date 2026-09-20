import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { classifyHarmony, sampleSuffixes } from "./hungarian.ts";

describe("classifyHarmony", () => {
  it("classifies back vowels (ház)", () => {
    const r = classifyHarmony("ház");
    assert.equal(r.class, "back");
    assert.match(r.twoFold, /back/);
    assert.ok(r.vowels.includes("á"));
  });

  it("classifies front unrounded (ember)", () => {
    const r = classifyHarmony("ember");
    assert.equal(r.class, "front");
    assert.match(r.threeFold, /-ek/);
  });

  it("classifies front rounded (tök)", () => {
    const r = classifyHarmony("tök");
    assert.equal(r.class, "rounded");
    assert.match(r.threeFold, /-ök/);
  });

  it("looks up víz as a front i-stem, not back", () => {
    const r = classifyHarmony("víz");
    assert.equal(r.class, "front");
    assert.equal(r.caveat, undefined);
    assert.match(r.twoFold, /front/);
  });

  it("looks up híd as a back i-stem", () => {
    const r = classifyHarmony("híd");
    assert.equal(r.class, "back");
    assert.equal(r.caveat, undefined);
  });

  it("looks up szív as front and ír as back", () => {
    assert.equal(classifyHarmony("szív").class, "front");
    assert.equal(classifyHarmony("ír").class, "back");
  });

  it("refuses to guess an unknown i/í-only stem", () => {
    const r = classifyHarmony("csíny");
    assert.equal(r.class, "neutral");
    assert.ok(r.caveat);
    assert.match(r.twoFold, /look the word up/);
  });

  it("uses the last classifying vowel (virág → back)", () => {
    const r = classifyHarmony("virág");
    assert.equal(r.class, "back");
  });

  it("lets i sit out in a mixed stem (Budapest → front)", () => {
    const r = classifyHarmony("Budapest");
    assert.equal(r.class, "front");
  });

  it("normalizes NFC and is case-insensitive", () => {
    const a = classifyHarmony("HÁZ");
    const b = classifyHarmony("ház");
    assert.equal(a.class, b.class);
  });
});

describe("sampleSuffixes", () => {
  it("returns five named endings for back harmony", () => {
    const s = sampleSuffixes("back");
    assert.equal(s.length, 5);
    assert.equal(s.find((x) => x.name === "inessive")?.form, "-ban");
    assert.equal(s.find((x) => x.name === "allative")?.form, "-hoz");
  });

  it("picks -höz for rounded and -hez for front", () => {
    assert.equal(sampleSuffixes("rounded").find((x) => x.name === "allative")?.form, "-höz");
    assert.equal(sampleSuffixes("front").find((x) => x.name === "allative")?.form, "-hez");
  });

  it("does not invent endings for an unknown i-stem", () => {
    assert.deepEqual(sampleSuffixes("neutral"), []);
  });
});
