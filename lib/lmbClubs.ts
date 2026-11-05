// Directorio 2026 verificado contra https://lmb.com.mx/equipos
// Son equipos de LMB: excluir clubes de Liga Mexicana de Softbol y LMP.
export type LmbClubRecord = {
  slug: string;
  name: string;
  aliases: readonly string[];
  bulletinHeading: string;
  region: "Norte" | "Sur";
};
export const LMB_CLUB_DIRECTORY: readonly LmbClubRecord[] = [
  {slug:"algodoneros",name:"Algodoneros del Unión Laguna",aliases:["algodoneros","algodoneros union laguna","algodoneros de union laguna"],bulletinHeading:"LAGUNA",region:"Norte"},
  {slug:"tecos",name:"Tecos de los Dos Laredos",aliases:["tecos","tecos de los dos laredos"],bulletinHeading:"DOS LAREDOS",region:"Norte"},
  {slug:"acereros",name:"Acereros de Monclova",aliases:["acereros","acereros del norte","acereros de monclova"],bulletinHeading:"MONCLOVA",region:"Norte"},
  {slug:"caliente",name:"Caliente de Durango",aliases:["caliente","caliente de durango"],bulletinHeading:"DURANGO",region:"Norte"},
  {slug:"charros",name:"Charros de Jalisco",aliases:["charros","charros de jalisco"],bulletinHeading:"JALISCO",region:"Norte"},
  {slug:"rieleros",name:"Rieleros de Aguascalientes",aliases:["rieleros","rieleros de aguascalientes"],bulletinHeading:"AGUASCALIENTES",region:"Norte"},
  {slug:"saraperos",name:"Saraperos de Saltillo",aliases:["saraperos","saraperos de saltillo"],bulletinHeading:"SALTILLO",region:"Norte"},
  {slug:"sultanes",name:"Sultanes de Monterrey",aliases:["sultanes","sultanes de monterrey"],bulletinHeading:"MONTERREY",region:"Norte"},
  {slug:"toros",name:"Toros de Tijuana",aliases:["toros","toros de tijuana"],bulletinHeading:"TIJUANA",region:"Norte"},
  {slug:"diablos-rojos",name:"Diablos Rojos del México",aliases:["diablos","diablos rojos","diablos rojos del mexico"],bulletinHeading:"MÉXICO",region:"Sur"},
  {slug:"el-aguila",name:"El Águila de Veracruz",aliases:["el aguila","aguila","el aguila de veracruz"],bulletinHeading:"VERACRUZ",region:"Sur"},
  {slug:"guerreros",name:"Guerreros de Oaxaca",aliases:["guerreros","guerreros de oaxaca"],bulletinHeading:"OAXACA",region:"Sur"},
  {slug:"leones",name:"Leones de Yucatán",aliases:["leones","leones de yucatan"],bulletinHeading:"YUCATÁN",region:"Sur"},
  {slug:"pericos",name:"Pericos de Puebla",aliases:["pericos","pericos de puebla"],bulletinHeading:"PUEBLA",region:"Sur"},
  {slug:"piratas",name:"Piratas de Campeche",aliases:["piratas","piratas de campeche"],bulletinHeading:"CAMPECHE",region:"Sur"},
  {slug:"tigres",name:"Tigres de Quintana Roo",aliases:["tigres","tigres de quintana roo"],bulletinHeading:"TIGRES",region:"Sur"},
  {slug:"bravos",name:"Bravos de León",aliases:["bravos","bravos de leon"],bulletinHeading:"LEÓN",region:"Sur"},
  {slug:"olmecas",name:"Olmecas de Tabasco",aliases:["olmecas","olmecas de tabasco"],bulletinHeading:"TABASCO",region:"Sur"},
  {slug:"dorados",name:"Dorados de Chihuahua",aliases:["dorados","dorados de chihuahua"],bulletinHeading:"CHIHUAHUA",region:"Norte"},
  {slug:"conspiradores",name:"Conspiradores de Querétaro",aliases:["conspiradores","conspiradores de queretaro"],bulletinHeading:"QUERÉTARO",region:"Sur"},
] as const;

function normalize(value:string):string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g,"")
    .toLowerCase().replace(/[^a-z0-9]+/g," ").trim();
}
const clubBySlug=new Map(LMB_CLUB_DIRECTORY.map(club=>[club.slug,club]));
const clubByAlias=new Map(LMB_CLUB_DIRECTORY.flatMap(club=>club.aliases.map(alias=>[normalize(alias),club] as const)));
export function getLmbClub(slug:string):LmbClubRecord|undefined {return clubBySlug.get(slug);}
export function findLmbClubByName(name:string):LmbClubRecord|undefined {
  const cleaned=normalize(name);
  return clubByAlias.get(cleaned) ?? LMB_CLUB_DIRECTORY.find(c=>cleaned===normalize(c.name));
}
export function lmbClubHref(name:string):string|null {
  const club=findLmbClubByName(name);
  return club?"/equipos/lmb/"+club.slug:null;
}
