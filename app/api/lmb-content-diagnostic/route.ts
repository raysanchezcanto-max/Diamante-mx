// TEMPORAL: diagnóstico de integración con LMB. Se elimina antes de finalizar.
import { getAlgodonerosNews, getAlgodonerosRoster } from "@/lib/lmbClubContent";
export const dynamic = "force-dynamic";
export async function GET() {
  const [news, roster] = await Promise.all([getAlgodonerosNews(), getAlgodonerosRoster()]);
  return Response.json({
    news: {status:news.sourceStatus,count:news.stories.length,top:news.stories.slice(0,5)},
    roster: {status:roster.sourceStatus,total:roster.roster.reduce((n,g)=>n+g.players.length,0),
      groups:roster.roster.map(g=>({name:g.name,count:g.players.length,first:g.players.slice(0,2)}))},
  });
}
