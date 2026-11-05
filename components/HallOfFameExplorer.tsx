"use client";

import { useMemo, useState } from "react";
import {
  ALGODONEROS_HALL_DETAILS,
  HALL_FEATURED,
  HALL_OFFICIAL_ACTIVITY,
  HALL_OFFICIAL_DIRECTORY,
  hallKey,
  type HallInductee,
} from "@/lib/hallOfFame";

type Props={
  records:HallInductee[];
  sourceStatus:"connected"|"fallback";
  activitiesVerified:boolean;
  initialClub?:string;
  initialPerson?:string;
};
const PAGE_SIZE=36;

function monogram(name:string):string {
  return name.split(/\s+/).filter(Boolean).slice(0,2)
    .map(word=>word[0]?.toLocaleUpperCase("es")??"").join("");
}
function searchKey(value:string):string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^\p{L}\p{N}\s]/gu,"").trim();
}
export default function HallOfFameExplorer({
  records,sourceStatus,activitiesVerified,initialClub="",initialPerson=""
}:Props){
  const [query,setQuery]=useState(initialPerson);
  const [club,setClub]=useState(initialClub==="algodoneros"?"algodoneros":"todos");
  const [activity,setActivity]=useState("todos");
  const [year,setYear]=useState("todos");
  const [limit,setLimit]=useState(PAGE_SIZE);
  const [expanded,setExpanded]=useState<string|null>(initialPerson?hallKey(initialPerson):null);
  const years=useMemo(()=>[...new Set(records.map(r=>r.year))].sort((a,b)=>b-a),[records]);
  const roles=useMemo(()=>[...new Set(records.map(r=>r.activity))].sort((a,b)=>a.localeCompare(b,"es")),[records]);
  const filtered=useMemo(()=>{
    const term=searchKey(query);
    return records.filter(p=>(
      (!term||searchKey(p.name).includes(term)) &&
      (club==="todos"||p.algodoneros) &&
      (activity==="todos"||p.activity===activity) &&
      (year==="todos"||String(p.year)===year)
    ));
  },[records,query,club,activity,year]);
  const displayed=filtered.slice(0,limit);
  const featured=records.filter(p=>Boolean(HALL_FEATURED[hallKey(p.name)]));
  const isNarrowed=query||club!=="todos"||activity!=="todos"||year!=="todos";
  const reset=()=>{setQuery("");setClub("todos");setActivity("todos");setYear("todos");setLimit(PAGE_SIZE);setExpanded(null)};
  const updateFilters=(fn:()=>void)=>{fn();setLimit(PAGE_SIZE);setExpanded(null)};
  const resultsLabel=sourceStatus==="connected"
    ? "Registros del directorio alfabético oficial"
    : "Selección de respaldo · directorio oficial no disponible";
  return (
    <div className="hallExplorer">
      <div className="hallSummary">
        <div>
          <strong>{records.length.toLocaleString("es-MX")}</strong>
          <span>{resultsLabel}</span>
        </div>
        <div>
          <strong>{years.length}</strong><span>Años de entronización representados</span>
        </div>
        <div>
          <strong>1939</strong><span>Primera elección histórica</span>
        </div>
      </div>

      {!isNarrowed&&featured.length>0&&(
        <section className="hallFeatured" aria-labelledby="hallFeaturedTitle">
          <div className="hallSectionHeading">
            <div>
              <span className="hallEyebrow">MEMORIA DEL DIAMANTE</span>
              <h2 id="hallFeaturedTitle">Tres nombres inolvidables</h2>
            </div>
            <span>Selección editorial · miembros oficialmente entronizados</span>
          </div>
          <div className="hallFeaturedGrid">
            {featured.map(person=>{
              const note=HALL_FEATURED[hallKey(person.name)];
              return <button type="button" className="hallFeaturedItem" key={person.name}
                onClick={()=>{setQuery(person.name);setExpanded(hallKey(person.name));setLimit(PAGE_SIZE)}}>
                <span className="hallFeaturedMonogram" aria-hidden="true">{monogram(person.name)}</span>
                <span className="hallFeaturedText">
                  <small>ENTRONIZADO EN {person.year}</small>
                  <strong>{person.name}</strong>
                  <span>{note.title}</span>
                  <span>{note.description}</span>
                </span>
                <span className="hallFeaturedArrow" aria-hidden="true">↗</span>
              </button>;
            })}
          </div>
        </section>
      )}

      <section className="hallDirectory" aria-labelledby="hallDirectoryTitle">
        <div className="hallSectionHeading">
          <div>
            <span className="hallEyebrow">DIRECTORIO DE INMORTALES</span>
            <h2 id="hallDirectoryTitle">Explora su legado</h2>
          </div>
          <a href={HALL_OFFICIAL_DIRECTORY} target="_blank" rel="noopener noreferrer">Consultar directorio oficial ↗</a>
        </div>
        <div className="hallFilters">
          <label className="hallSearch">
            <span>Buscar por nombre</span>
            <input type="search" placeholder="Ej. Martín Dihigo, Héctor Espino..." value={query}
              onChange={e=>updateFilters(()=>setQuery(e.target.value))}/>
          </label>
          <label>
            <span>Vínculo con un club</span>
            <select value={club} onChange={e=>updateFilters(()=>setClub(e.target.value))}>
              <option value="todos">Todos los inmortales</option>
              <option value="algodoneros">Algodoneros del Unión Laguna</option>
            </select>
          </label>
          <label>
            <span>Actividad</span>
            <select value={activity} onChange={e=>updateFilters(()=>setActivity(e.target.value))}>
              <option value="todos">Todas las actividades</option>
              {roles.map(role=><option value={role} key={role}>{role}</option>)}
            </select>
          </label>
          <label>
            <span>Año de entronización</span>
            <select value={year} onChange={e=>updateFilters(()=>setYear(e.target.value))}>
              <option value="todos">Todos los años</option>
              {years.map(value=><option key={value} value={String(value)}>{value}</option>)}
            </select>
          </label>
        </div>

        <div className="hallResultsHeading">
          <p><strong>{filtered.length}</strong> {filtered.length===1?"registro encontrado":"registros encontrados"}
            {club==="algodoneros"?" · Relación con Unión Laguna verificada":""}</p>
          {Boolean(isNarrowed)&&<button type="button" onClick={reset}>Limpiar filtros</button>}
        </div>
        {filtered.length?(
          <>
            <div className="hallMemberGrid">
              {displayed.map((person)=>{
                const key=hallKey(person.name);
                const open=expanded===key;
                const relation=ALGODONEROS_HALL_DETAILS[key];
                const featuredNote=HALL_FEATURED[key];
                return <article className={"hallMember"+(open?" hallMemberOpen":"")} key={key}>
                  <button type="button" className="hallMemberTrigger"
                    aria-expanded={open}
                    onClick={()=>setExpanded(prev=>prev===key?null:key)}>
                    <span className="hallMemberTop">
                      <span className="hallMemberAvatar" aria-hidden="true">{monogram(person.name)}</span>
                      <span className="hallMemberYear">{person.year}</span>
                    </span>
                    <strong>{person.name}</strong>
                    <span className="hallMemberRole">{person.activity}</span>
                    {person.algodoneros&&<span className="hallClubTag">Algodoneros · Unión Laguna</span>}
                    <span className="hallMemberMore">{open?"Ocultar ficha −":"Ver ficha +"} </span>
                  </button>
                  {open&&(
                    <div className="hallMemberDetail">
                      <span className="hallDetailKicker">FICHA DE INMORTAL</span>
                      <p><b>Entronización:</b> {person.year}</p>
                      <p><b>Actividad registrada:</b> {person.activity}</p>
                      {relation&&<p><b>Vínculo con Unión Laguna:</b> {relation.relation}. {relation.highlight}</p>}
                      {!relation&&featuredNote&&<p>{featuredNote.description}</p>}
                      <a href={HALL_OFFICIAL_DIRECTORY} target="_blank" rel="noopener noreferrer">Ver registro oficial ↗</a>
                    </div>
                  )}
                </article>;
              })}
            </div>
            {filtered.length>limit&&(
              <div className="hallLoadMore">
                <button type="button" onClick={()=>setLimit(n=>n+PAGE_SIZE)}>
                  Ver más inmortales ({filtered.length-limit} restantes) ↓
                </button>
              </div>
            )}
          </>
        ):(
          <div className="hallEmpty">
            <strong>No encontramos coincidencias.</strong>
            <p>Intenta otro nombre o elimina algún filtro.</p>
            <button type="button" onClick={reset}>Mostrar todos los registros</button>
          </div>
        )}
      </section>
      <div className="hallMethodology">
        <strong>¿De dónde proviene la información?</strong>
        <p>
          Los nombres y años proceden del catálogo alfabético oficial del Salón de la Fama
          del Beisbol Mexicano. {activitiesVerified
            ? "Las actividades se contrastan con el catálogo oficial por actividad. Cuando no es posible confirmar una equivalencia, se muestra «Sin clasificar»."
            : "La clasificación por actividad no pudo verificarse íntegramente en esta consulta."}
          {" "}La vinculación con Unión Laguna se limita a jugadores cuya trayectoria hemos verificado;
          los demás equipos se incorporarán progresivamente. No se inventan fotografías ni biografías.
        </p>
        <div>
          <a href={HALL_OFFICIAL_DIRECTORY} target="_blank" rel="noopener noreferrer">Directorio oficial por nombre ↗</a>
          <a href={HALL_OFFICIAL_ACTIVITY} target="_blank" rel="noopener noreferrer">Directorio oficial por actividad ↗</a>
          <a href="https://www.salondelafamadelbeisbolmexicano.com/" target="_blank" rel="noopener noreferrer">Museo en Monterrey ↗</a>
        </div>
      </div>
    </div>
  );
}
