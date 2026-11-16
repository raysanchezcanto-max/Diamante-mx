import {getTeamLogo,type LeagueCode} from "@/lib/teamLogos";

/** No coloca iniciales ni escudos supuestos si no hay coincidencia oficial. */
export default function MovementCounterpartLogo({league,name}:{league:LeagueCode;name:string}){
 const logo=league==="MLB"?null:getTeamLogo(league,0,name);
 return logo?<img className="geminiCounterpartLogo" src={logo} width={24} height={24} alt={"Escudo de "+name} loading="lazy"/>:null;
}
