import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { budapestYmd, namesForDate } from "./namedays.ts";

describe("budapestYmd", () => {
  it("reads 20 September 2026 in Hungary as day 20, month 9", () => {
    // 19 Sep 22:30 in New York is already 20 Sep 04:30 in Budapest.
    const nyEvening = new Date("2026-09-20T02:30:00.000Z");
    const ymd = budapestYmd(nyEvening);
    assert.equal(ymd.year, 2026);
    assert.equal(ymd.month, 9);
    assert.equal(ymd.day, 20);
  });

  it("does not roll back a Budapest morning to the previous US day", () => {
    const budapestMorning = new Date("2026-09-20T07:11:00.000Z"); // 09:11 CEST
    assert.equal(budapestYmd(budapestMorning).day, 20);
  });
});

describe("namesForDate", () => {
  it("uses the Hungarian calendar day, not the visitor's timezone", () => {
    const { names, label } = namesForDate(new Date("2026-09-20T02:30:00.000Z"));
    assert.equal(label, "20 Sep");
    assert.deepEqual(names, ["Friderika"]);
  });

  it("returns Vilhelmina on 19 September", () => {
    const { names, label } = namesForDate(new Date("2026-09-19T12:00:00.000Z"));
    assert.equal(label, "19 Sep");
    assert.deepEqual(names, ["Vilhelmina"]);
  });
});
