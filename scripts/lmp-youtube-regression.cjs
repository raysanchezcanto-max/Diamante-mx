/* Reproducible offline QA for the YouTube LMP resolver.
   No YouTube access, member credentials, or hardcoded known gamePk required.
   Run: node scripts/lmp-youtube-regression.cjs
*/
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { stripTypeScriptTypes } = require("node:module");
const CHANNEL = "UCdW_4rN3OarOoawQ4Er-ZXw";
const full = [
  { id: "AaBbCcDd001", title: "Águilas de Mexicali vs Cañeros de Los Mochis | 8 nov 2026", duration: "2:10:00" },
  { id: "AaBbCcDd003", title: "Naranjeros de Hermosillo vs Algodoneros de Guasave | 08-nov-2026 | J1", duration: "2:25:00" },
  { id: "AaBbCcDd004", title: "Naranjeros de Hermosillo vs Algodoneros de Guasave | 08-nov-2026 | J2", duration: "2:32:00" },
  { id: "AaBbCcDd005", title: "Águilas de Mexicali vs Cañeros de Los Mochis | 9 nov 2026", duration: "2:10:00" },
  { id: "AaBbCcDd006", title: "Yaquis de Ciudad Obregon vs Jaguares de Nayarit | Nov 8, 2026", duration: "2:10:00", unfinished: true },
  { id: "AaBbCcDd007", title: "Venados de Mazatlan vs Mayos de Navojoa | 08/11/2026", duration: "2:10:00" },
];
const clips = [
  { id: "AaBbCcDd002", title: "RESUMEN | Águilas de Mexicali vs Cañeros de Los Mochis | Nov 8, 2026", duration: "8:00" },
];
const videos = new Map([...full, ...clips].map(v => [v.id, v]));

function channelHtml(items) {
  const contents = items.map(({ id, title, duration }) => ({
    lockupViewModel: {
      contentId: id,
      metadata: { lockupMetadataViewModel: { title: { content: title } } },
      contentImage: { thumbnailViewModel: { overlays: [
        { thumbnailBottomOverlayViewModel: { badges: [
          { thumbnailBadgeViewModel: { text: duration } },
        ] } },
      ] } },
    },
  }));
  return "var ytInitialData = " + JSON.stringify({ contents }) + ";</script>";
}

function videoHtml(video) {
  const parts = video.duration.split(":").map(Number);
  const seconds = parts.reduce((acc, part) => acc * 60 + part, 0);
  const response = {
    videoDetails: {
      videoId: video.id, title: video.title, channelId: CHANNEL,
      lengthSeconds: String(seconds), isLiveContent: true,
    },
    playabilityStatus: { status: "UNPLAYABLE", reason: "Join this channel to access members-only content" },
    microformat: { playerMicroformatRenderer: { liveBroadcastDetails: {
      isLiveNow: false, ...(video.unfinished ? {} : { endTimestamp: "2026-11-09T03:00:00Z" }),
    } } },
  };
  return "var ytInitialPlayerResponse = " + JSON.stringify(response) + ";</script>";
}
async function fakeFetch(address) {
  const url = new URL(address);
  let html = "";
  if (url.pathname.endsWith("/streams")) html = channelHtml(full);
  else if (url.pathname.endsWith("/videos")) html = channelHtml(clips);
  else if (url.pathname.endsWith("/search")) html = channelHtml([]);
  else if (url.pathname === "/watch") {
    const entry = videos.get(url.searchParams.get("v"));
    if (entry) html = videoHtml(entry);
  }
  return {
    ok: Boolean(html), url: url.toString(),
    headers: { get: () => "text/html" },
    text: async () => html,
  };
}

const source = fs.readFileSync(path.join(__dirname, "..", "lib", "lmpYoutubeVideos.ts"), "utf8");
const standalone = source.replace(
  'import { cache } from "react";',
  "const cache = (fn) => fn;",
);
if (standalone === source) throw new Error("LMP resolver import changed; update offline QA");
const compiled = stripTypeScriptTypes(standalone, { mode: "strip" });
globalThis.fetch = fakeFetch;

const start = "2026-11-09T00:00:00Z"; // 8 Nov in America/Mexico_City
const context = (away, home, opts = {}) => ({
  startTime: start, away, home, gameNumber: 1, doubleHeader: "N", ...opts,
});

async function run() {
  const resolver = await import("data:text/javascript;charset=utf-8," + encodeURIComponent(compiled));
  const { findLmpYoutubeReplay: replay, findLmpYoutubeHighlight: highlight } = resolver;
  const normal = context("Águilas de Mexicali", "Cañeros de Los Mochis");
  const newReplay = await replay(999901, normal);
  assert.equal(newReplay?.url, "https://www.youtube.com/watch?v=AaBbCcDd001");
  assert.equal(newReplay?.membersOnly, true);
  const newHighlight = await highlight(999901, normal);
  assert.equal(newHighlight?.url, "https://www.youtube.com/watch?v=AaBbCcDd002");

  const double = context("Naranjeros de Hermosillo", "Algodoneros de Guasave", { doubleHeader: "S" });
  assert.equal((await replay(999902, double))?.url, "https://www.youtube.com/watch?v=AaBbCcDd003");
  assert.equal((await replay(999903, { ...double, gameNumber: 2 }))?.url,
    "https://www.youtube.com/watch?v=AaBbCcDd004");
  assert.equal(await replay(999904, { ...double, gameNumber: 3 }), null);

  // Fail closed on mismatched date, non-ended stream, or ambiguous slash date.
  assert.equal(await replay(999905, { ...normal, startTime: "2026-11-11T00:00:00Z" }), null);
  assert.equal(await replay(999906, context("Yaquis de Obregon", "Jaguares de Nayarit")), null);
  assert.equal(await replay(999907, context("Venados de Mazatlan", "Mayos de Navojoa")), null);
  assert.equal(await replay(999908, context("Águilas de Mexicali", "Mayos de Navojoa")), null);

  console.log("LMP YouTube offline QA: 9 assertions passed (unmapped games, date, J1/J2, no false replays).");
}
run().catch(error => { console.error(error); process.exitCode = 1; });
