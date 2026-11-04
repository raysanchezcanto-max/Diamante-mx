// TEMPORARY PUBLIC-SOURCE DIAGNOSTIC: remove after validation.
export const dynamic = "force-dynamic";
export async function GET() {
  const urls = [
    "https://lmb.com.mx/equipos/algodoneros",
    "https://lmb.com.mx/noticias/lmb-movimientos-en-listas-de-reserva-28-de-octubre-de-2026",
  ];
  const result = await Promise.all(urls.map(async url => {
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(9000), cache: "no-store", headers: { Accept: "text/html" } });
      const html = await r.text();
      const movement = [...html.matchAll(/\/noticias\/lmb-movimientos-en-listas-de-reserva-[^"'<\s\\]+/gi)].slice(0,10).map(m=>m[0]);
      const tokens = ["Movimientos", "Ramón Armando", "LAGUNA", "__next_f", "El club Algodoneros", "academia rookie"];
      const snippets = Object.fromEntries(tokens.map(token=>{
        const at=html.toLowerCase().indexOf(token.toLowerCase());
        return [token, at < 0 ? null : html.slice(Math.max(0,at-200),Math.min(html.length,at+900))];
      }));
      return { url, status: r.status, length: html.length, movement, snippets };
    } catch (error) { return { url, error: String(error) }; }
  }));
  return Response.json({ result });
}
