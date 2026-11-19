const assert = require("node:assert/strict");
const { isLmpOvernightLiveGame: include, LMP_OVERNIGHT_LIVE_WINDOW_MS: windowMs } =
  require("../lib/lmpOvernightLive.ts");

const startTime = "2026-11-19T02:30:00Z"; // 18 Nov, 20:30 Mexico City
const start = Date.parse(startTime);
const base = {
  scheduledDay: "2026-11-18",
  yesterday: "2026-11-18",
  status: "Live",
  startTime,
};

assert.equal(windowMs, 12 * 60 * 60 * 1000);
assert.equal(include(base, start + 4 * 60 * 60 * 1000), true,
  "An authentic overnight game remains visible after midnight");
assert.equal(include(base, start + windowMs), true,
  "An ongoing game remains visible at the overnight limit");
assert.equal(include(base, start + windowMs + 1), false,
  "A stale live flag expires after the maximum overnight window");
assert.equal(include(base, Date.parse("2026-11-19T21:55:00Z")), false,
  "A previous-night live game must not appear at 15:55 next afternoon");
assert.equal(include({ ...base, scheduledDay: "2026-11-19" }, start + 4 * 3600000), false,
  "Today's games follow the normal today's-date branch instead");
assert.equal(include({ ...base, status: "Final" }, start + 3600000), false,
  "A final game is never carried as a live game");
assert.equal(include({ ...base, status: "Preview" }, start + 3600000), false);
assert.equal(include({ ...base, startTime: "invalid" }, start + 3600000), false);
assert.equal(include(base, start - 1000), false, "Future games cannot be overnight");
console.log("LMP overnight live rollover: 10 checks passed.");
