// Campeonatos por denominación/franquicia actual de LMB, al cierre de 2026.
// Fuentes cruzadas:
// https://cerocero.com.mx/noticias/todos-campeones-serie-del-rey-lmb/
// https://www.clarosports.com/beisbol/mexicano/todos-los-campeones-de-la-liga-mexicana-de-beisbol-ano-por-ano/
// https://www.milb.com/news/gcs-16712968
// El año 2018 en Leones indica Primavera; Sultanes ganó Otoño.
export const LMB_CHAMPIONSHIP_SOURCE =
  "https://cerocero.com.mx/noticias/todos-campeones-serie-del-rey-lmb/";
export type ClubChampionships = { years: readonly string[]; note?: string };
const titles:Record<string,ClubChampionships>={
  "algodoneros":{years:["1942","1950"]},
  "tecos":{years:["1953","1954","1958","1977","1989"],note:"Títulos históricos de Tecolotes de los Dos Laredos."},
  "acereros":{years:["2019"]},
  "caliente":{years:[]},
  "charros":{years:["1967","1971"],note:"Títulos históricos con la denominación Charros de Jalisco."},
  "rieleros":{years:["1978"]},
  "saraperos":{years:["1980","2009","2010"],note:"1980 correspondió a una temporada extraordinaria."},
  "sultanes":{years:["1943","1947","1948","1949","1962","1991","1995","1996","2007","2018 Otoño"],note:"Incluye la trayectoria histórica de Industriales de Monterrey."},
  "toros":{years:["2017","2021","2026"]},
  "diablos-rojos":{years:["1956","1964","1968","1973","1974","1976","1981","1985","1987","1988","1994","1999","2002","2003","2008","2014","2024","2025"]},
  "el-aguila":{years:["1937","1938","1952","1961","1970","2012"],note:"Incluye las coronas históricas de Rojos del Águila."},
  "guerreros":{years:["1998"]},
  "leones":{years:["1957","1984","2006","2018 Primavera","2022"]},
  "pericos":{years:["1963","1979","1986","2016","2023"],note:"Historial poblano de Pericos/Ángeles; el campeón de 1925 no se contabiliza como Pericos."},
  "piratas":{years:["1983","2004"]},
  "tigres":{years:["1955","1960","1965","1966","1992","1997","2000","2001","2005","2011","2013","2015"],note:"Incluye los títulos ganados por los Tigres antes de establecerse en Quintana Roo."},
  "bravos":{years:["1990"],note:"Historial del club Bravos de León."},
  "olmecas":{years:["1993"]},
  "dorados":{years:[]},
  "conspiradores":{years:[]},
};
export function lmbClubChampionships(slug:string):ClubChampionships {
  return titles[slug]??{years:[]};
}
