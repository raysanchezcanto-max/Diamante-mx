// Temporary verification of real official LMB movements; remove after validation.
import {getLmbClubMovements} from "@/lib/lmbMovements";
export const dynamic="force-dynamic";
export async function GET(){
 const teams=[["olmecas","TABASCO"],["acereros","MONCLOVA"],["leones","YUCATÁN"],["diablos-rojos","MÉXICO"],["toros","TIJUANA"]];
 const data=await Promise.all(teams.map(async([slug,alias])=>{
 const r=await getLmbClubMovements({profileUrl:"https://lmb.com.mx/equipos/"+slug,headingAliases:[alias],clubName:slug,archive:[]});
 return {slug,status:r.sourceStatus,count:r.movements.length,samples:r.movements.slice(0,20).map(x=>({date:x.date,type:x.type,title:x.title,description:x.description,url:x.url}))};
 }));
 return Response.json(data);
}