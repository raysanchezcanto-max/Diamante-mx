// Temporary bounded read-only MLB metadata diagnostic. Delete after QA.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function probe(name: string, url: string) {
  try {
    const r = await fetch(url, {
      cache: "no-store",
      signal: AbortSignal.timeout(7500),
      headers: { Accept: "text/html,application/json" },
    });
    const html = await r.text();
    const probes = ["gamepk-850456","gamepk-850466","gamepk-850465","lmp-live-1-naranjeros", "lmp-live-1-venados", "lmp-live-jaguares","en vivo:","videoresults", "videoresults__"];
    const positions=Object.fromEntries(probes.map(term=>[term,html.toLowerCase().indexOf(term)]));
    const snippets=Object.fromEntries(probes.filter(term=>positions[term]>=0).map(term=>[term,html.slice(Math.max(0,positions[term]-200),positions[term]+380)]));
    const videoHrefs=[...new Set([...html.matchAll(/href=["']([^"']*\/video\/[^"']+)["']/g)].map(m=>m[1]))].slice(0,12);
    return {name,status:r.status,bytes:html.length,positions,snippets,videoHrefs,title:html.match(/<title>(.*?)<\/title>/i)?.[1]};
  }catch(error){return{name,error:String(error)}}
}
export async function GET() {
  const q=id=>encodeURIComponent(`ContentTags = ["gamepk-${id}"] Order by Timestamp DESC`);
  const specs = [
    ["video-search-850456",`https://www.mlb.com/es/video/?q=${q(850456)}`],
    ["video-search-850466",`https://www.mlb.com/es/video/?q=${q(850466)}`],
    ["video-search-850465",`https://www.mlb.com/es/video/?q=${q(850465)}`],
    ["video-search-850474",`https://www.mlb.com/es/video/?q=${q(850474)}`],
    ["video-page-jaguares","https://www.mlb.com/es/video/lmp-live-jaguares-vs-tomateros-251316"],
  ];
  return Response.json({results:await Promise.all(specs.map(([name,url])=>probe(name,url)))},{headers:{"Cache-Control":"no-store"}});
}