// Vínculos documentados del sistema de desarrollo de clubes LMB hacia
// organizaciones de Major League Baseball (incluidas sus sucursales).
// Una firma de Ligas Menores NO acredita debut en la MLB.
export type LmbToMlbProspect = {
  name: string;
  role: string;
  organization: string;
  seasonLabel: string;
  note: string;
  source: string;
  initials: string;
};
export type LmbToMlbExport = {
  title: string;
  description: string;
  mlbClub: string;
  debutDate: string;
  source: string;
};
export type LmbToMlbClub = {
  abbreviation: string;
  intro: string;
  prospects: readonly LmbToMlbProspect[];
  debuts: readonly LmbToMlbExport[];
  source: string;
};
const olmecasSources = {
  overview:"https://olmecastabasco.mx/lo-mejor-del-2023/novatos-a-grandes-ligas/",
  six:"https://olmecastabasco.mx/boletin-de-prensa/braulio-torres-perez-a-saraperos-de-saltillo/",
  jonathan:"https://olmecastabasco.mx/boletin-de-prensa/los-atleticos-de-oakland-firman-a-prospecto-de-los-olmecas/",
  jesus:"https://olmecastabasco.mx/boletin-de-prensa/jesus-broca-firma-para-cerveceros-de-milwaukee/",
  daniel:"https://olmecastabasco.mx/boletin-de-prensa/daniel-nunez-el-noveno-en-la-historia-de-los-olmecas-en-llegar-a-las-grandes-ligas/",
};
const documented: Record<string,LmbToMlbClub> = {
  olmecas:{
    abbreviation:"TAB",
    intro:"Del sistema de desarrollo de los Olmecas de Tabasco a organizaciones del béisbol estadounidense. Estas seis firmas fueron publicadas por el propio club. Estar en sus sucursales no equivale a jugar en MLB.",
    source:olmecasSources.six,
    debuts:[],
    prospects:[
      {
        name:"Eddy Félix",initials:"EF",role:"Lanzador",
        organization:"Detroit Tigers",seasonLabel:"2022",
        note:"El club identificó a Eddy Félix como uno de sus lanzadores desarrollados y firmados por Detroit en 2022.",
        source:olmecasSources.overview,
      },
      {
        name:"Jonathan Cortés Moreno",initials:"JC",role:"Lanzador derecho",
        organization:"Oakland Athletics",seasonLabel:"2023",
        note:"Formado en el sistema de Olmecas. Firmó con los Athletics y fue enviado a su circuito de desarrollo en República Dominicana.",
        source:olmecasSources.jonathan,
      },
      {
        name:"César Rivera",initials:"CR",role:"Lanzador",
        organization:"Cincinnati Reds",seasonLabel:"2023",
        note:"El club lo incluyó entre los prospectos que pasaron de su sistema de desarrollo a la organización de Cincinnati.",
        source:olmecasSources.overview,
      },
      {
        name:"Jesús Manuel Broca",initials:"JB",role:"Lanzador zurdo",
        organization:"Milwaukee Brewers",seasonLabel:"2023",
        note:"El pitcher tabasqueño, formado en la granja de Olmecas, firmó con Milwaukee en julio de 2023.",
        source:olmecasSources.jesus,
      },
      {
        name:"Daniel Núñez",initials:"DN",role:"Lanzador",
        organization:"Arizona Diamondbacks",seasonLabel:"2023",
        note:"El lanzador yucateco firmó con Arizona en diciembre de 2023 como prospecto de la organización tabasqueña.",
        source:olmecasSources.daniel,
      },
      {
        name:"Hugo Trejo",initials:"HT",role:"Prospecto",
        organization:"Oakland Athletics",seasonLabel:"Reportado en 2024",
        note:"Olmecas lo menciona entre los peloteros con derechos de retorno vinculados a organizaciones MLB, dentro de las firmas realizadas desde 2022.",
        source:olmecasSources.six,
      },
    ],
  },
};
export function getLmbToMlbClub(slug:string):LmbToMlbClub|null{
  return documented[slug]??null;
}
