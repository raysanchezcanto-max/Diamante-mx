// Temporary QA for old official LMP member archives. Delete after validation.
import {findLmpYoutubeReplay,findLmpYoutubeHighlight} from "@/lib/lmpYoutubeVideos";
export const dynamic="force-dynamic";export const runtime="nodejs";
export async function GET(){
 const ctx={startTime:"2026-10-26T01:00:00Z",away:"Cañeros de Los Mochis",home:"Yaquis de Ciudad Obregon",gameNumber:1,doubleHeader:"N"};
 const [replay,highlight]=await Promise.all([findLmpYoutubeReplay(123456,ctx),findLmpYoutubeHighlight(ctx)]);
 return Response.json({replay,highlight},{headers:{"Cache-Control":"no-store"}});
}
