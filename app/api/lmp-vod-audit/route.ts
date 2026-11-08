// Temporary QA against the official LMP YouTube replay resolver.
// This endpoint is removed after tests.
import { findLmpYoutubeReplay, findLmpYoutubeHighlight } from "@/lib/lmpYoutubeVideos";
export const runtime="nodejs";export const dynamic="force-dynamic";
export async function GET(){
 const fixtures=[
  {id:850456,name:"Naranjeros Algodoneros J1",context:{startTime:"2026-11-08T00:00:00Z",away:"Naranjeros de Hermosillo",home:"Algodoneros de Guasave",gameNumber:1,doubleHeader:"Y"}},
  {id:850479,name:"Naranjeros Algodoneros J2",context:{startTime:"2026-11-08T02:16:00Z",away:"Naranjeros de Hermosillo",home:"Algodoneros de Guasave",gameNumber:2,doubleHeader:"Y"}},
  {id:850466,name:"Venados Mayos J1",context:{startTime:"2026-11-07T22:00:00Z",away:"Venados de Mazatlan",home:"Mayos de Navojoa",gameNumber:1,doubleHeader:"Y"}},
  {id:850474,name:"Venados Mayos J2",context:{startTime:"2026-11-07T23:05:00Z",away:"Venados de Mazatlan",home:"Mayos de Navojoa",gameNumber:2,doubleHeader:"Y"}},
  {id:123456,name:"Cañeros Yaquis Oct25 search fallback",context:{startTime:"2026-10-26T01:00:00Z",away:"Cañeros de Los Mochis",home:"Yaquis de Ciudad Obregon",gameNumber:1,doubleHeader:"N"}},
  {id:123457,name:"Mismatched day must not show Oct25",context:{startTime:"2026-10-27T01:00:00Z",away:"Cañeros de Los Mochis",home:"Yaquis de Ciudad Obregon",gameNumber:1,doubleHeader:"N"}},
  {id:850456,name:"Wrong game number must not misassign",context:{startTime:"2026-11-08T00:00:00Z",away:"Naranjeros de Hermosillo",home:"Algodoneros de Guasave",gameNumber:3,doubleHeader:"Y"}},
 ];
 const results=await Promise.all(fixtures.map(async x=>{
  const [replay,highlight]=await Promise.all([findLmpYoutubeReplay(x.id,x.context),findLmpYoutubeHighlight(x.context)]);
  return{name:x.name,id:x.id,replay,highlight};
 }));
 return Response.json({results},{headers:{"Cache-Control":"no-store"}});
}
