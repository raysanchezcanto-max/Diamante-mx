/** Fechas de inauguración respaldadas por fuentes identificadas.
 * Un valor ausente NO se reemplaza por temporada, capacidad ni año de renovación.
 */
export const LMP_STADIUM_OPENED: Record<string,{year:string;source:string}|undefined> = {
 aguilas:{year:"1976",source:"https://editor.lmp.mx/el-club-aguilas-de-mexicali-celebra-sus-74-anos-de-existencia/"},
 naranjeros:{year:"2013",source:"https://viewer.lmp.mx/files/Enciclopedia75aniversarioLMP.pdf"},
 algodoneros:{year:"1970",source:"https://www.kuroda.com/kuroda-park"},
 yaquis:{year:"2016",source:"https://www.yaquis.com.mx/2016/10/12/estrenan-yaquis-su-nueva-casa-con-colorida-fiesta/"},
 caneros:{year:"1962",source:"https://www.meganoticias.mx/tepic/noticia/cambio-de-nombre-a-chevronpark-toco-fibras-profundas/367185"},
 tomateros:{year:"2015",source:"https://www.noroeste.com.mx/deportes/beisbol/ya-es-oficial-instalan-las-letras-del-estadio-juan-ley-fong-en-la-casa-de-los-tomateros-de-culiacan-NJ26499150"},
 venados:{year:"1962",source:"https://www.venados.com/el-estadio-teodoro-mariscal-llega-a-los-62-anos-de-su-gloriosa-inauguracion/"},
 charros:{year:"2011",source:"https://www.lmp.mx/"},
 // Jaguares y Mayos: contrastar primero el recinto actual y su fecha real.
 jaguares:undefined,
 mayos:undefined
};
export function getLmpStadiumYear(slug:string):string|null{
 return LMP_STADIUM_OPENED[slug]?.year??null;
}
