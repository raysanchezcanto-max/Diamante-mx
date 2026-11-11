import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {getLmpDirectoryClub} from "@/lib/lmpClubDirectory";
import {getLmpDirectoryRoster,getLmpDirectoryFixtures,getLmpDirectoryStanding,getLmpDirectoryNews,getLmpDirectoryMovements,getLmpDirectoryMlbAlumni} from "@/lib/lmpClubDirectoryData";
import LmpDirectoryClubProfile from "@/components/LmpDirectoryClubProfile";
import type {LmbClubView} from "@/components/LmbClubTabs";

export const revalidate=900;
type Props={params:Promise<{slug:string}>;searchParams?:Promise<{vista?:string}>};
const views:readonly LmbClubView[]=["resumen","plantilla","movimientos","grandes-ligas","historia"];
export async function generateMetadata({params}:Pick<Props,"params">):Promise<Metadata>{
 const {slug}=await params;const club=getLmpDirectoryClub(slug);
 return {title:club?club.name+" | Equipos LMP | Diamante MX":"Equipos LMP | Diamante MX",
 description:club?"Noticias oficiales, plantilla, próximos juegos e historia documentada de "+club.name+".":"Equipos de la Liga Mexicana del Pacífico"};
}
export default async function LmpClubDirectoryPage({params,searchParams}:Props){
 const [{slug},query]=await Promise.all([params,searchParams]);
 const club=getLmpDirectoryClub(slug);
 if(!club)notFound();
 const view:LmbClubView=views.includes(query?.vista as LmbClubView)?query!.vista as LmbClubView:"resumen";
 const [roster,fixtures,record,news,mlbAlumni,movements]=await Promise.all([
  view==="plantilla"?getLmpDirectoryRoster(club.id):Promise.resolve([]),
  view==="resumen"?getLmpDirectoryFixtures(club.id):Promise.resolve([]),
  view==="resumen"?getLmpDirectoryStanding(club.id):Promise.resolve(null),
  view==="resumen"?getLmpDirectoryNews(club.id):Promise.resolve([]),
  view==="grandes-ligas"?getLmpDirectoryMlbAlumni(club.id):Promise.resolve([]),
  view==="movimientos"?getLmpDirectoryMovements(club):Promise.resolve([])
 ]);
 return <LmpDirectoryClubProfile club={club} view={view} roster={roster} fixtures={fixtures} record={record} news={news} mlbAlumni={mlbAlumni} movements={movements}/>;
}
