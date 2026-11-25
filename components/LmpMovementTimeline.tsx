import type {LmpDirectoryMovement} from "@/lib/lmpClubDirectoryData";
import {describeLmpMovement} from "@/lib/lmpMovementPresentation";
import {lmpTransferPresentation,lmpTransferTitle} from "@/lib/movementTransferPresentation";
import MovementGeminiDetails from "./MovementGeminiDetails";
import MovementCounterpartLogo from "./MovementCounterpartLogo";
import { staffEventLabel } from "@/lib/verifiedPersonnelEvents";

type Props={movements:LmpDirectoryMovement[];logo:string|null;sourceUrl:string;gemini?:boolean};
const spanishDate=(value:string)=>new Intl.DateTimeFormat("es-MX",{
 day:"numeric",month:"long",year:"numeric",timeZone:"UTC"
}).format(new Date(value+"T12:00:00Z"));

/** El mismo diseño de movimientos para los diez equipos del Pacífico. */
export default function LmpMovementTimeline({movements,logo,sourceUrl,gemini=false}:Props){
 return <>
  <p className="clubSmallNote">Historial de altas, bajas y otros cambios del registro LMP, complementado con anuncios institucionales verificados del cuerpo técnico. Los nombramientos conservan su fecha y fuente; no se consideran altas de jugadores ni prueban quién ocupa actualmente el cargo.</p>
  {movements.length?<div className="clubMovementsTimeline">
   {movements.map((item,index)=>{const presentation=describeLmpMovement(item.description);const isStaff=item.sourceKind==="official-appointment" && Boolean(item.staffKind);const transfer=isStaff?null:lmpTransferPresentation(item.description);const title=isStaff?item.person:(transfer?lmpTransferTitle(item.description):null)||presentation.title;return <article className="clubMovementItem" key={item.date+"-"+index}>
    <div className="clubMovementDate"><span>{spanishDate(item.date)}</span><span className="clubMovementType">{isStaff ? "Cuerpo técnico · "+staffEventLabel(item.staffKind!) : presentation.type}</span></div>
    <div className="clubMovementBody">{logo&&<img src={logo} alt="" width={53} height={53}/>}
     <div>{title&&<h3>{title}</h3>}{gemini?<MovementGeminiDetails text={item.description}/>:<p>{item.description}</p>}{transfer&&<div className="clubMovementDirection" data-direction={transfer.label.includes("CEDIDOS")?"out":"in"}><span>{gemini?(transfer.label.includes("CEDIDOS")?"→ ":"← ")+transfer.label:transfer.label}</span>{gemini&&<MovementCounterpartLogo league="LMP" name={transfer.otherClub}/>}<strong>{transfer.otherClub}</strong></div>}<a href={isStaff ? item.sourceUrl : sourceUrl} target="_blank" rel="noopener noreferrer">{isStaff?"Consultar anuncio oficial LMP ↗":"Consultar registro oficial LMP ↗"}</a></div>
    </div>
   </article>})}
  </div>:<div className="clubDirectoryNotice">
   <h3>No fue posible consultar movimientos en este momento</h3>
   <p>La fuente oficial no devolvió registros para esta consulta. Puedes revisar las transacciones directamente en el sitio de la Liga.</p>
   <a href={sourceUrl} target="_blank" rel="noopener noreferrer">Ver movimientos oficiales LMP ↗</a>
  </div>}
 </>;
}
