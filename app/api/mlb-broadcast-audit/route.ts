// Temporary regression test for public MLB game broadcast mapping.
// Read-only; remove immediately once checks pass.
import { getGameBroadcasts } from "@/lib/broadcasts";
import { getGameDetails } from "@/lib/gameDetails";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const fixtures = [
  {id: 824766, startTime: "2026-07-17T17:35:00Z", label: "rescheduled played"},
  {id: 824766, startTime: "2026-05-09T20:10:00Z", label: "original postponed"},
  {id: 823440, startTime: "2026-07-16T22:10:00Z", label: "ESPN"},
  {id: 822789, startTime: "2026-07-17T23:15:00Z", label: "Apple TV"},
  {id: 849805, startTime: "2026-10-24T00:00:00Z", label: "FOX World Series"},
  {id: 822758, startTime: "2026-04-03T17:05:00Z", label: "regional - test fallback"},
  {id: 824766, startTime: "2026-07-18T17:35:00Z", label: "mismatched start => fallback"},
];
export async function GET() {
  const results = await Promise.all(fixtures.map(async item => ({
    ...item, signals: await getGameBroadcasts("MLB",item.id,{startTime:item.startTime}),
  })));
  const real = await getGameDetails("MLB",824766);
  const matched = real ? await getGameBroadcasts("MLB",824766,{
    startTime:real.startTime,
    awayId:real.awayId,homeId:real.homeId,
    away:real.away,home:real.home,
  }) : [];
  return Response.json({
    results,actualGame:real?{startTime:real.startTime,status:real.status,home:real.home,away:real.away,signals:matched}:null,
  },{headers:{"Cache-Control":"no-store"}});
}
