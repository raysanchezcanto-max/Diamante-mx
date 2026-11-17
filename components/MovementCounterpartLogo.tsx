import {getTeamDisplayName,getTeamLogo,type LeagueCode} from "@/lib/teamLogos";
import {MLB_CLUBS} from "@/lib/mlbClubDirectory";

const normalize=(name:string)=>name.normalize("NFD")
 .replace(/[\u0300-\u036f]/g,"").replace(/[.]+$/g,"").trim().toLowerCase();
const lightSurface:Record<LeagueCode,Set<string>>={
 MLB:new Set(),
 LMB:new Set([
  "rieleros de aguascalientes","conspiradores de queretaro",
  "algodoneros de union laguna","algodoneros del union laguna",
  "algodoneros union laguna","sultanes de monterrey"
 ]),
 // Revisión inicial de escudos de trazos oscuros en la LMP.
 LMP:new Set(["yaquis de obregon","charros de jalisco","aguilas de mexicali"]),
};

/** Todos los movimientos comparten la misma escala, borde y selección estable de fondo. */
export default function MovementCounterpartLogo({league,name}:{league:LeagueCode;name:string}){
 const original=name.replace(/\s+/g," ").trim().replace(/[.]+$/g,"");
 const normalized=normalize(original);
 const cleanName=original.replace(/^(?:club(?: de beisbol)?|equipo)\s+/i,"");
 const canonical=getTeamDisplayName(league,cleanName);
 const mlbClub=league==="MLB"?MLB_CLUBS.find(club=>
   normalize(club.name)===normalized
   || normalize(club.name)===normalize(cleanName)
   || (club.name==="Athletics"&&normalized==="oakland athletics")
 ):null;
 const logo=league==="MLB"
   ?mlbClub?getTeamLogo("MLB",mlbClub.id,mlbClub.name):null
   :getTeamLogo(league,0,cleanName)??getTeamLogo(league,0,canonical);
 const normalizedCanonical=normalize(canonical);
 const wide=league==="LMB"&&normalizedCanonical.includes("conspiradores");
 const light=lightSurface[league].has(normalizedCanonical)||lightSurface[league].has(normalize(cleanName));
 return logo?<img
   className={"geminiCounterpartLogo"+(wide?" geminiCounterpartLogo--wide":"")+(light?" geminiCounterpartLogo--light":"")+(league==="MLB"?" geminiCounterpartLogo--mlb":"")+(league==="LMP"?" geminiCounterpartLogo--lmp":"")}
   src={logo} width={wide?44:32} height={32} alt={"Escudo de "+name} loading="lazy"
 />:null;
}
