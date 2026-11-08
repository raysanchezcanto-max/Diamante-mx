// Temporary read-only investigation of MLB's PUBLIC metadata, never player URLs.
// Delete immediately after QA.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function probe(name: string, url: string) {
  try {
    const r = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(8000), headers: { Accept: "application/json,text/html" } });
    const text = await r.text();
    const lower = text.toLowerCase();
    const probes = ["850466", "850456", "lmp-live", "venados", "mayos", "naranjeros", "algodoneros", "251314", "251315", "gamepk", "__next_data__", "videoid", "video_id", "canonical", "data-content-id"];
    const positions = Object.fromEntries(probes.filter(v => lower.includes(v)).map(v => [v, lower.indexOf(v)]));
    const snippets = Object.fromEntries(["850466", "251314", "gamepk", "videoid", "data-content-id"].filter(v => positions[v] != null).map(v => [v, text.slice(Math.max(0, positions[v]-160), positions[v]+280)]));
    return { name, status: r.status, bytes: text.length, type: r.headers.get("content-type"), positions, snippets, preview: text.slice(0,180) };
  } catch(e) { return {name, error: String(e)}; }
}
export async function GET() {
  const specs = [
    ["stats-content-850466", "https://statsapi.mlb.com/api/v1/game/850466/content"],
    ["stats-content-850456", "https://statsapi.mlb.com/api/v1/game/850456/content"],
    ["mlb-video-venados", "https://www.mlb.com/es/video/lmp-live-1-venados-vs-navojoa-251314"],
    ["mlb-video-naranjeros", "https://www.mlb.com/es/video/lmp-live-1-naranjeros-vs-algodoneros-251315"],
    ["mlb-winter-topic", "https://www.mlb.com/es/video/topic/mexican-pacific-league"],
  ];
  const results = await Promise.all(specs.map(([name, url]) => probe(name, url)));
  return Response.json({ results }, { headers: { "Cache-Control": "no-store" } });
}
