import {getTeamLogo,type LeagueCode} from "@/lib/teamLogos";
import {MLB_CLUBS} from "@/lib/mlbClubDirectory";

/** Solo muestra escudos de contrapartes que coinciden con un club verificado. */
export default function MovementCounterpartLogo({league,name}:{league:LeagueCode;name:string}){
 const normalized=name.normalize("NFD").replace(/[\u0300-\u036f]/g,"").trim().toLowerCase();
 const mlbClub=league==="MLB"?MLB_CLUBS.find(club=>
   club.name.toLowerCase()===normalized
   || (club.name==="Athletics"&&normalized==="oakland athletics")
 ):null;
 const logo=league==="MLB"
   ?mlbClub?getTeamLogo("MLB",mlbClub.id,mlbClub.name):null
   :getTeamLogo(league,0,name);
 const wide=league==="LMB"&&/conspiradores de quer[eé]taro/i.test(name);
 // Prueba visual controlada: fondos claros solo para tres escudos LMB oscuros.
 const lightPreview=league==="LMB"&&(
  normalized.includes("rieleros")&&normalized.includes("aguascalientes")
  || normalized.includes("conspiradores")&&normalized.includes("queretaro")
  || normalized.includes("algodoneros")&&normalized.includes("laguna")
  || normalized.includes("sultanes")&&normalized.includes("monterrey")
 );
 return logo?<img className={"geminiCounterpartLogo"+(wide?" geminiCounterpartLogo--wide":"")+(lightPreview?" geminiCounterpartLogo--light":"")+(league==="MLB"?" geminiCounterpartLogo--mlb":"")} src={logo} width={wide?44:32} height={32} alt={"Escudo de "+name} loading="lazy"/>:null;
}
