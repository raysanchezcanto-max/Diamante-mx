/** Base única para métricas históricas de perfiles Diamante MX.
 * La tercera métrica y el sello del estadio siempre expresan AÑO DE INAUGURACIÓN.
 * Una fecha no comprobada se muestra como dato pendiente, nunca como capacidad.
 */
export type ClubHistoryMetricFacts = {
 league:"LMB"|"LMP"|"MLB";
 debutYear:string|null|undefined;
 championships:number|null;
 seasonLabel:string;
 stadiumName:string|null|undefined;
 stadiumOpened:string|null|undefined;
};
export function ClubHistoryMetrics({league,debutYear,championships,seasonLabel,stadiumName,stadiumOpened}:ClubHistoryMetricFacts){
 return <div className="clubHistoryStats">
  <div><span>DEBUT HISTÓRICO {league}</span><strong>{debutYear||"—"}</strong><small>{debutYear?"Primeras temporadas documentadas":"Año por verificar"}</small></div>
  <div><span>CAMPEONATOS {league}</span><strong>{championships===null?"—":String(championships).padStart(2,"0")}</strong><small>{championships===null?"Por verificar":"Hasta la temporada "+seasonLabel}</small></div>
  <div><span>APERTURA DEL ESTADIO</span><strong>{stadiumOpened||"—"}</strong><small>{stadiumOpened?(stadiumName||"Recinto del club"):"Año por verificar · "+(stadiumName||"estadio")}</small></div>
 </div>;
}
export function ClubHistoryStadiumYear({stadiumOpened}:{stadiumOpened:string|null|undefined}){
 return <div className="clubHistoryStadiumMark" aria-label={"Estadio · Año de inauguración: "+(stadiumOpened||"por verificar")}>
  <span>ESTADIO</span><strong>{stadiumOpened||"—"}</strong><span>AÑO DE INAUGURACIÓN</span>
 </div>;
}
