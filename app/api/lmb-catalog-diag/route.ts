// Temporary diagnostic for public LMB.TV catalog structure.
// Remove this route once we finish validating a safe game-to-video matcher.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const response = await fetch("https://www.lmb.tv/results/2026/all", {
      cache: "no-store",
      signal: AbortSignal.timeout(12000),
      headers: { Accept: "text/html" },
    });
    const html = await response.text();
    const ids = [
      "8990fc5b-6a79-4519-a38f-9a00e2988109",
      "1f867e78-4968-4764-9c88-1bb0d2170978",
    ];
    const examples = ids.map(id => {
      const index = html.indexOf(id);
      return {
        id, index,
        snippet: index < 0 ? "" : html.slice(Math.max(0, index - 1050), index + 650),
      };
    });
    return Response.json({
      status: response.status,
      bytes: html.length,
      hasWatch: html.includes("/watch/"),
      totalWatchMentions: html.match(/\/watch\/[0-9a-f-]{36}/g)?.length ?? 0,
      firstChars: html.slice(0, 450),
      examples,
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 502 });
  }
}
