// Temporary read-only QA for publicly listed LMB.TV results.
// Remove this endpoint after validating the matcher.
import { parseLmbTvResultCatalog, findLmbTvGamePage } from "@/lib/lmbTvCatalog";
import { getGameDetails } from "@/lib/gameDetails";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const response = await fetch("https://www.lmb.tv/results/2026/all", {
      cache: "no-store",
      signal: AbortSignal.timeout(12000),
      headers: { Accept: "text/html" },
    });
    if (!response.ok) return Response.json({ status: response.status });
    const html = await response.text();
    const entries = parseLmbTvResultCatalog(html);
    const gameIds = [867486, 867487, 867488, 867489, 867490, 867481];

    const games = await Promise.all(gameIds.map(async id => {
      const g = await getGameDetails("LMB", id);
      const matched = g ? await findLmbTvGamePage(g) : null;
      return { id, startTime: g?.startTime, away: g?.away, home: g?.home, matched };
    }));

    return Response.json({
      status: response.status,
      size: html.length,
      entries: entries.length,
      j1: entries.find(e => e.url.endsWith("/8990fc5b-6a79-4519-a38f-9a00e2988109")),
      j6: entries.find(e => e.url.endsWith("/1f867e78-4968-4764-9c88-1bb0d2170978")),
      games,
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 502 });
  }
}
