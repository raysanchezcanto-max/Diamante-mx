import type {LmpDirectoryMovement} from "@/lib/lmpClubDirectoryData";
import {describeLmpMovement} from "@/lib/lmpMovementPresentation";
import {lmpTransferPresentation,lmpTransferTitle} from "@/lib/movementTransferPresentation";

type Props={movements:LmpDirectoryMovement[];logo:string|null;sourceUrl:string};
const spanishDate=(value:string)=>new Intl.DateTimeFormat("es-MX",{
 day:"numeric",month:"long",year:"numeric",timeZone:"UTC"
}).format(new Date(value+"T12:00:00Z"));

/** El mismo diseño de movimientos para los diez equipos del Pacífico. */
export default function LmpMovementTimeline({movements,logo,sourceUrl}:Props){
 return <>
  <p className="clubSmallNote">Registro de altas, bajas y otros cambios publicado por la Liga Mexicana del Pacífico. Se muestran los {movements.length} movimientos recientes disponibles en esta consulta; el historial completo está en la fuente oficial. Los datos se actualizan periódicamente.</p>
  {movements.length?<div className="clubMovementsTimeline">
   {movements.map((item,index)=>{const presentation=describeLmpMovement(item.description);const transfer=lmpTransferPresentation(item.description);return <article className="clubMovementItem" key={item.date+"-"+index}>
    <div className="clubMovementDate"><span>{spanishDate(item.date)}</span><span className="clubMovementType">{presentation.type}</span></div>
    <div className="clubMovementBody">{logo&&<img src={logo} alt="" width={53} height={53}/>}
     <div>{(transfer||presentation.title)&&<h3>{transfer?lmpTransferTitle(item.description,transfer.heading):presentation.title}</h3>}<p>{item.description}</p>{transfer&&<div className="clubMovementDirection"><span>{transfer.label}</span><strong>{transfer.otherClub}</strong></div>}<a href={sourceUrl} target="_blank" rel="noopener noreferrer">Consultar registro oficial LMP ↗</a></div>
    </div>
   </article>})}
  </div>:<div className="clubDirectoryNotice">
   <h3>No fue posible consultar movimientos en este momento</h3>
   <p>La fuente oficial no devolvió registros para esta consulta. Puedes revisar las transacciones directamente en el sitio de la Liga.</p>
   <a href={sourceUrl} target="_blank" rel="noopener noreferrer">Ver movimientos oficiales LMP ↗</a>
  </div>}
 </>;
}
