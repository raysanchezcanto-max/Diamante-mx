import { cache } from "react";

/**
 * Verify that a public LMB.TV /watch/ page still exists before showing the
 * full-game replay option for a FINAL matchup. This checks the *landing page*,
 * NOT playback entitlement; paywall, rights and regional limits still apply.
 */
export const verifyLmbTvGamePage = cache(async (url: string): Promise<boolean> => {
  if (!/^https:\/\/(?:www\.)?lmb\.tv\/watch\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/?$/i.test(url)) {
    return false;
  }
  try {
    const response = await fetch(url, {
      next: { revalidate: 900 },
      signal: AbortSignal.timeout(5000),
      headers: { Accept: "text/html" },
    });
    if (!response.ok ||
        !response.headers.get("content-type")?.toLowerCase().includes("text/html") ||
        !/^https:\/\/(?:www\.)?lmb\.tv\/watch\//i.test(response.url)) {
      return false;
    }
    const html = await response.text();
    if (!html || html.length > 3_000_000) return false;
    // Landing page must identify an LMB.TV individual event, not the
    // catalog home page, sign-in page, or generic/error page.
    return /<title>[^<]*LMB TV\s*-\s*[^<]+<\/title>/i.test(html) &&
      /<h1\b[^>]*>[^<]+<\/h1>/i.test(html);
  } catch {
    return false;
  }
});
