import type { Metadata } from "next";
import HallOfFameExplorer from "@/components/HallOfFameExplorer";
import { getHallOfFame } from "@/lib/hallOfFame";

export const metadata:Metadata = {
  title:"Salón de la Fama del Beisbol Mexicano | Diamante MX",
  description:"Consulta el catálogo oficial de inmortales del beisbol mexicano, años de entronización, actividades y su vínculo con Algodoneros de Unión Laguna.",
};
export const revalidate=86400;
type Props={searchParams?:Promise<{club?:string;persona?:string}>};

export default async function SalonDeLaFama({searchParams}:Props){
  const [params,report]=await Promise.all([searchParams,getHallOfFame()]);
  return (
    <main className="hallPage">
      <header className="hallTopbar">
        <a href="/?league=lmb" className="hallBrand">
          <span>◆</span><strong>DIAMANTE <em>MX</em></strong>
        </a>
        <nav aria-label="Navegación del Salón de la Fama">
          <a href="/?league=lmb">LMB</a>
          <a href="/equipos/lmb/algodoneros?vista=historia">Historia de Algodoneros</a>
          <a href="/" className="hallHomeLink">Inicio</a>
        </nav>
      </header>
      <div className="hallShell">
        <section className="hallHero">
          <div className="hallHeroContent">
            <span className="hallEyebrow">DIAMANTE MX · LEGADO DEL BEISBOL</span>
            <h1>Salón de la <em>Fama</em></h1>
            <p className="hallHeroSubtitle">Los inmortales del béisbol mexicano.</p>
            <p className="hallHeroDescription">
              Desde la primera elección de 1939, el Salón reconoce a jugadores,
              mánagers, ampáyers, directivos y cronistas que dejaron huella
              en la historia del diamante. Descubre sus nombres y su legado.
            </p>
            <div className="hallHeroBadges">
              <span>{report.sourceStatus==="connected"?"Catálogo oficial conectado":"Archivo verificado de respaldo"}</span>
              <span>Monterrey · Nuevo León</span>
            </div>
          </div>
          <div className="hallHeroEmblem" aria-hidden="true">
            <div className="hallHeroLaurel">✦</div>
            <strong>1939</strong>
            <span>LOS INMORTALES</span>
          </div>
        </section>
        <HallOfFameExplorer records={report.inductees}
          sourceStatus={report.sourceStatus}
          activitiesVerified={report.activitiesVerified}
          initialClub={params?.club??""}
          initialPerson={params?.persona??""}/>
      </div>
      <footer className="hallFooter">
        <span>DIAMANTE MX · HISTORIA QUE PERMANECE</span>
        <a href="https://www.salondelafamadelbeisbolmexicano.com/" target="_blank" rel="noopener noreferrer">Fuente: Salón de la Fama del Beisbol Mexicano ↗</a>
      </footer>
    </main>
  );
}
