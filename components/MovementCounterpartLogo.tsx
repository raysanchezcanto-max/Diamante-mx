import {getTeamLogo,type LeagueCode} from "@/lib/teamLogos";

/** No coloca iniciales ni escudos supuestos si no hay coincidencia oficial. */
export default function MovementCounterpartLogo({league,name}:{league:LeagueCode;name:string}){
 const logo=league==="MLB"?null:getTeamLogo(league,0,name);
 const wide=league==="LMB"&&/conspiradores de quer[eé]taro/i.test(name);
 return logo?<img className={"geminiCounterpartLogo"+(wide?" geminiCounterpartLogo--wide":"")} src={logo} width={wide?44:32} height={32} alt={"Escudo de "+name} loading="lazy"/>:null;
}
