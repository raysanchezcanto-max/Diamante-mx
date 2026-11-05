// Temporary test endpoint for public official registry; remove before final release.
import { getHallOfFame } from "@/lib/hallOfFame";
export const dynamic="force-dynamic";
export async function GET(){
  const r=await getHallOfFame();
  return Response.json({
    status:r.sourceStatus,
    count:r.inductees.length,
    categories:r.activitiesVerified,
    categoryCounts:r.inductees.reduce((m,p)=>({...m,[p.activity]:(m[p.activity]??0)+1}),{} as Record<string,number>),
    sample:r.inductees.slice(0,8),
    algodoneros:r.inductees.filter(p=>p.algodoneros),
    latest:r.inductees.filter(p=>p.year>=2023).slice(0,20),
  });
}