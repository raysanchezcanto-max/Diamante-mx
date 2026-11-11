// Catálogo de los nueve equipos LMP con perfiles parametrizados.
// Los campeonatos de cada club provienen de los palmares históricos LMP.
// Ojo: Mazatlán también tiene títulos de la antigua Liga de la Costa del Pacífico:
// aquí se cuentan únicamente las temporadas de LMP desde los años setenta.
export type LmpClubDefinition = {
 slug:string;id:number;name:string;city:string;stadium:string;website:string|null;
 championships:readonly string[]; debut:string; historicalSource:string;
};
const historySource="https://www.baseball-reference.com/bullpen/LMP";
const recentSource="https://mexico.as.com/masdeporte/liga-mexicana-del-pacifico-equipo-con-mas-campeonatos-y-todos-los-titulos-ano-por-ano-f202601-n/";
export const LMP_CLUB_DIRECTORY:readonly LmpClubDefinition[]=[
 {slug:"aguilas",id:673,name:"Águilas de Mexicali",city:"Mexicali, Baja California",stadium:"Estadio Nido de los Águilas",website:"https://aguilasdemexicali.mx/",debut:"1976",championships:["1985–86","1988–89","1998–99","2016–17"],historicalSource:historySource},
 {slug:"naranjeros",id:677,name:"Naranjeros de Hermosillo",city:"Hermosillo, Sonora",stadium:"Estadio Fernando Valenzuela",website:"https://naranjeros.com.mx/",debut:"1958",championships:["1960–61","1961–62","1963–64","1970–71","1974–75","1975–76","1979–80","1981–82","1989–90","1991–92","1993–94","1994–95","2000–01","2006–07","2009–10","2013–14","2023–24"],historicalSource:"https://www.lmp.mx/noticias/naranjeros-gana-su-campeonato-17-en-la-liga-arco-mexicana-del-pacifico"},
 {slug:"yaquis",id:680,name:"Yaquis de Obregón",city:"Ciudad Obregón, Sonora",stadium:"Estadio Yaquis",website:"https://www.yaquis.com.mx/",debut:"1960",championships:["1965–66","1972–73","1980–81","2007–08","2010–11","2011–12","2012–13"],historicalSource:historySource},
 {slug:"caneros",id:675,name:"Cañeros de Los Mochis",city:"Los Mochis, Sinaloa",stadium:"Chevron Park",website:"https://www.caneros.net/",debut:"1962",championships:["1968–69","1983–84","2002–03","2022–23"],historicalSource:historySource},
 {slug:"tomateros",id:678,name:"Tomateros de Culiacán",city:"Culiacán, Sinaloa",stadium:"Estadio Tomateros",website:"https://tomateros.com.mx/es",debut:"1965",championships:["1966–67","1969–70","1977–78","1982–83","1984–85","1995–96","1996–97","2001–02","2003–04","2014–15","2017–18","2019–20","2020–21"],historicalSource:"https://tomateros.com.mx/es"},
 {slug:"venados",id:679,name:"Venados de Mazatlán",city:"Mazatlán, Sinaloa",stadium:"Estadio Teodoro Mariscal",website:"https://www.venados.com/",debut:"1965",championships:["1973–74","1976–77","1986–87","1992–93","1997–98","2004–05","2005–06","2008–09","2015–16"],historicalSource:historySource},
 {slug:"jaguares",id:6483,name:"Jaguares de Nayarit",city:"Tepic, Nayarit",stadium:"Coloso del Pacífico",website:null,debut:"2025",championships:[],historicalSource:recentSource},
 {slug:"charros",id:674,name:"Charros de Jalisco",city:"Zapopan, Jalisco",stadium:"Estadio Panamericano de los Charros",website:"https://charrosjalisco.com/",debut:"2014",championships:["2018–19","2021–22","2024–25","2025–26"],historicalSource:"https://www.mlb.com/es/news/charros-barren-a-tomateros-y-repiten-como-campeones-de-lmp"},
 {slug:"mayos",id:676,name:"Mayos de Navojoa",city:"Navojoa, Sonora",stadium:"Estadio Manuel Ciclón Echeverría",website:"https://mayosbeisbol.mx/",debut:"1962",championships:["1978–79","1999–00"],historicalSource:historySource}
];
export const getLmpDirectoryClub=(slug:string)=>LMP_CLUB_DIRECTORY.find(c=>c.slug===slug);
const normalize=(name:string)=>name.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
export function lmpClubHref(name:string):string|null{
 const normalized=normalize(name);
 const club=LMP_CLUB_DIRECTORY.find(c=>normalize(c.name)===normalized)
   ?? (normalized.includes("algodoneros")&&normalized.includes("guasave")?null:undefined);
 if(normalized.includes("algodoneros")&&normalized.includes("guasave"))return "/equipos/lmp/algodoneros";
 return club?"/equipos/lmp/"+club.slug:null;
}
