const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

function loadTs(relativePath) {
  const file = path.join(__dirname, "..", relativePath);
  const source = fs.readFileSync(file, "utf8");
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: file,
  }).outputText;
  const module = { exports: {} };
  new Function("module", "exports", transpiled)(module, module.exports);
  return module.exports;
}

const { getScheduleCardMeta, isSecondGameTimeUnconfirmed } =
  loadTs("lib/gameScheduleMeta.ts");
const { getGameSpecialStatus } = loadTs("lib/gameSpecialStatus.ts");

let checks = 0;
const check = (actual, expected, name) => {
  assert.deepEqual(actual, expected, name);
  checks++;
};

check(getScheduleCardMeta({
  status: { reason: "Rain", startTimeTBD: true },
  rescheduleGameDate: "2026-11-16T22:00:00Z",
}), {
  statusReason: "Rain",
  rescheduleDate: "2026-11-16",
  startTimeTBD: true,
}, "MLB/LMP official status fields");

check(getScheduleCardMeta({
  statusReason: " Lluvia ",
  rescheduleDate: "2026-07-09",
  startTimeTBD: false,
}), {
  statusReason: "Lluvia",
  rescheduleDate: "2026-07-09",
  startTimeTBD: false,
}, "LMB calendar fields");

check(getScheduleCardMeta({ rescheduledFromDate: "2026-08-01" }), {
  statusReason: undefined,
  rescheduleDate: undefined,
  startTimeTBD: undefined,
}, "An original date is not a reschedule destination");

check(getScheduleCardMeta({
  status: { reason: " " },
  rescheduleDate: "2026-02-31",
}), {
  statusReason: undefined,
  rescheduleDate: undefined,
  startTimeTBD: undefined,
}, "Do not fabricate invalid/empty metadata");

const startTime = "2026-11-14T22:00:00Z";
const base = { status: "Preview", gameNumber: 2, doubleHeader: "Y", startTime };
check(isSecondGameTimeUnconfirmed(base), true, "Traditional game 2 remains TBD if confirmation is missing");
check(isSecondGameTimeUnconfirmed({ ...base, startTimeTBD: true }), true, "Official TBD");
check(isSecondGameTimeUnconfirmed({ ...base, startTimeTBD: false }), false, "Official confirmation shows the known hour");
check(isSecondGameTimeUnconfirmed({ ...base, gameNumber: 1 }), false, "Game 1 retains its schedule");
check(isSecondGameTimeUnconfirmed({ ...base, status: "Live" }), false, "Live game never shows TBD");
check(isSecondGameTimeUnconfirmed({ ...base, doubleHeader: "S" }), false, "Split game 2 can display a published hour");
check(isSecondGameTimeUnconfirmed({ ...base, doubleHeader: "S", startTimeTBD: true }), true, "Split game 2 with explicit TBD");
check(isSecondGameTimeUnconfirmed({ ...base, doubleHeader: "INFERRED" }), false, "LMB inferred game 2 keeps its scheduled time");
check(isSecondGameTimeUnconfirmed({ ...base, startTime: "" }), true, "Invalid start time is not presented as official");
check(isSecondGameTimeUnconfirmed({ ...base, doubleHeader: "N" }), false, "Single game is unchanged");

check(getGameSpecialStatus("Postponed"), "POSPUESTO", "Postponed state");
check(getGameSpecialStatus("Rain delay"), "RETRASADO", "Delayed state");
check(getGameSpecialStatus("Suspended"), "SUSPENDIDO", "Suspended state");
check(getGameSpecialStatus("Final"), null, "Finished game is not special");

const games = fs.readFileSync(path.join(__dirname, "..", "components/Games.tsx"), "utf8");
assert.match(games, /isSecondGameTimeUnconfirmed\(game\)/); checks++;
assert.doesNotMatch(games, /\{\(league === "LMP" \|\| league === "LMB"\) &&\s*specialStatus/); checks++;
for (const [file, count] of [
  ["lib/mlb.ts", 2],
  ["lib/lmp.ts", 2],
  ["lib/lmb.ts", 3],
  ["lib/nextGames.ts", 2],
]) {
  const text = fs.readFileSync(path.join(__dirname, "..", file), "utf8");
  check((text.match(/getScheduleCardMeta\(g\)/g) || []).length, count,
    `${file} preserves schedule metadata in all active mappings`);
}

process.stdout.write(`Game-card regression: ${checks} checks OK.\n`);
