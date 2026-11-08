/* Unit/integration regression for LMP FINAL video refresh deadlines.
   Offline: node scripts/lmp-postgame-regression.cjs
*/
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { stripTypeScriptTypes } = require("node:module");
const DAY = 24 * 60 * 60 * 1000;
const HOUR = 60 * 60 * 1000;
let count = 0;
function eq(actual, expected, message) {
  assert.equal(actual, expected, message);
  count++;
}

async function run() {
  const src = fs.readFileSync(path.join(__dirname, "..", "lib/lmpPostgameRefresh.ts"), "utf8");
  const mod = await import("data:text/javascript;charset=utf-8," +
    encodeURIComponent(stripTypeScriptTypes(src, { mode: "strip" })));
  const { getLmpPostgameRefreshUntil: deadline, LMP_POSTGAME_REFRESH_MS } = mod;

  const start = "2026-11-08T01:00:00Z"; // November 7 in Mexico City
  const finish = "2026-11-08T03:15:00Z"; // crosses local midnight
  const t0 = Date.parse("2026-11-08T04:00:00Z");
  const args = { league: "LMP", isFinal: true, startTime: start, lastPlayEndedAt: finish };
  const until = Date.parse(finish) + DAY;

  eq(LMP_POSTGAME_REFRESH_MS, 300000, "Five minute polling");
  eq(deadline(args, t0), until, "Actual last-play time anchors 24h after ending");
  eq(deadline(args, until - 1), until, "Poll until just before deadline");
  eq(deadline(args, until), undefined, "Stop precisely at deadline");
  eq(deadline(args, until + 1), undefined, "Never resume after deadline");

  const fallback = Date.parse(start) + 6 * HOUR + DAY;
  eq(deadline({ league: "LMP", isFinal: true, startTime: start }, t0), fallback,
    "No final timestamp uses bounded 30h-from-start fallback");
  eq(deadline({ ...args, lastPlayEndedAt: "not-a-date" }, t0), fallback,
    "Invalid feed timestamp uses bounded fallback");
  eq(deadline({ ...args, lastPlayEndedAt: "2026-11-09T01:00:00Z" }, t0), fallback,
    "Future last play must not extend deadline");
  eq(deadline({ ...args, lastPlayEndedAt: "2026-11-07T01:00:00Z" }, t0), fallback,
    "Impossible play timestamp before game start is rejected");
  eq(deadline({ ...args, lastPlayEndedAt: "2026-11-09T00:30:00Z" }, Date.parse("2026-11-09T03:00:00Z")), fallback,
    "Implausible >18h game timestamp is bounded");
  eq(deadline({ ...args, league: "MLB" }, t0), undefined, "No new MLB polling");
  eq(deadline({ ...args, league: "LMB" }, t0), undefined, "No new LMB polling");
  eq(deadline({ ...args, isFinal: false }, t0), undefined, "Preview/Live excluded");
  eq(deadline({ ...args, startTime: "" }, t0), undefined, "Missing start date excluded");
  eq(deadline({ ...args, startTime: "unknown" }, t0), undefined, "Invalid start date excluded");
  eq(deadline(args, Date.parse(start) - 1), undefined, "Before game's scheduled start excluded");
  eq(deadline({ league: "LMP", isFinal: true, startTime: "2026-10-01T00:00:00Z" }, t0),
    undefined, "Historic FINAL must not keep polling");

  const component = fs.readFileSync(path.join(__dirname, "..", "components/AutoRefresh.tsx"), "utf8");
  const page = fs.readFileSync(path.join(__dirname, "..", "app/game/[league]/[id]/page.tsx"), "utf8");
  const youtube = fs.readFileSync(path.join(__dirname, "..", "lib/lmpYoutubeVideos.ts"), "utf8");
  assert.match(component, /now >= stopAt/, "Client timer must honor deadline even without navigation"); count++;
  assert.match(page, /stopAt=\{postgameRefreshUntil\}/, "FINAL page must pass deadline to client"); count++;
  assert.match(page, /isFinal \? LMP_POSTGAME_REFRESH_MS/, "FINAL page must switch cadence"); count++;
  assert.match(youtube, /next: \{ revalidate: 300 \}/, "YouTube cache should not be longer than cadence"); count++;
  console.log("LMP postgame refresh regression: " + count + " checks passed.");
}
run().catch(err => { console.error(err); process.exitCode = 1; });
