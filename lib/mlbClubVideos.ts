/** Selección editorial de videos oficiales verificados, por franquicia MLB.
 *  No se inventan clips ni se incrustan reproducciones sin autorización.
 *  Se amplía club por club junto con la auditoría del perfil completo.
 */
export type MlbClubVideo = {
  title: string;
  date: string;
  duration: string;
  description: string;
  url: string;
};

const verified: Readonly<Record<number, readonly MlbClubVideo[]>> = {
  121: [
    {title:"Los Mets conquistan su primera Serie Mundial",date:"16 oct 1969",duration:"1:04",description:"Los Miracle Mets consiguen el último out ante Baltimore para levantar la corona de 1969.",url:"https://www.mlb.com/mets/video/mets-win-1969-world-series-c5617605"},
    {title:"El histórico rodado de Mookie Wilson",date:"25 oct 1986",duration:"0:32",description:"La remontada del sexto juego ante Boston que dio vida a los Mets en la Serie Mundial.",url:"https://www.mlb.com/video/it-gets-by-buckner-c13062925"},
    {title:"Jesse Orosco cierra la Serie Mundial de 1986",date:"27 oct 1986",duration:"1:16",description:"Último ponche del séptimo juego para la segunda Serie Mundial de Nueva York.",url:"https://www.mlb.com/mets/video/mets-win-world-series-c3531549"}
  ],
  142: [
    {title: "Minnesota gana la Serie Mundial de 1987", date: "25 oct 1987", duration: "1:29", description: "Jeff Reardon consigue el último out del Juego 7 ante St. Louis Cardinals.", url: "https://www.mlb.com/video/twins-win-1987-world-series-c31110999"},
    {title: "Kirby Puckett fuerza el Juego 7 en 1991", date: "26 oct 1991", duration: "5:06", description: "El jardinero conecta un jonrón para dejar en el terreno a Atlanta en la undécima entrada.", url: "https://www.mlb.com/twins/video/puckett-s-game-6-walk-off-homer"},
    {title: "Jack Morris y la victoria de 1991", date: "27 oct 1991", duration: "10:30", description: "Morris lanza diez entradas sin permitir carrera y Minnesota conquista su segunda corona en la era Twins.", url: "https://www.mlb.com/twins/video/twins-walk-off-win-world-series"},
  ],
  146: [
    {title: "Édgar Rentería decide la Serie Mundial de 1997", date: "26 oct 1997", duration: "0:59", description: "Sencillo para dejar en el terreno a Cleveland en la undécima entrada del séptimo juego.", url: "https://www.mlb.com/marlins/video/marlins-walk-off-the-1997-ws"},
    {title: "Josh Beckett cierra la Serie Mundial de 2003", date: "25 oct 2003", duration: "1:50", description: "Beckett retira a Jorge Posada para terminar el sexto juego y asegurar el título ante los Yankees.", url: "https://www.mlb.com/marlins/video/marlins-win-03-world-series-c5506875"},
    {title: "Documental oficial de la Serie Mundial de 2003", date: "18 nov 2003", duration: "1:11:58", description: "La película oficial de MLB sobre la segunda corona de los Marlins.", url: "https://www.mlb.com/video/2003-world-series-film"},
  ],
  119: [
    {title: "Los Dodgers conquistan su novena Serie Mundial en 2025", date: "1 nov 2025", duration: "1:57", description: "Yoshinobu Yamamoto provoca una doble matanza para cerrar el séptimo juego ante Toronto y conquistar el bicampeonato.", url: "https://www.mlb.com/dodgers/video/yoshinobu-yamamoto-in-play-out-s-to-alejandro-kirk"},
    {title: "Los nueve últimos outs de los Dodgers campeones", date: "1 nov 2025", duration: "1:59", description: "Recorrido histórico por las jugadas finales de cada una de las nueve Series Mundiales ganadas por la franquicia.", url: "https://www.mlb.com/es/video/every-final-out-from-dodgers-nine-world-series-wins"},
    {title: "Kirk Gibson conecta su histórico jonrón de 1988", date: "15 oct 1988", duration: "2:15", description: "El bateador emergente, lesionado, conecta el cuadrangular que decide el primer juego de la Serie Mundial frente a Oakland.", url: "https://www.mlb.com/video/gibson-s-pinch-hit-hr-c3731660"},
    {title: "La épica remontada para conquistar el título de 2024", date: "30 oct 2024", duration: "2:47:56", description: "Partido completo: Los Dodgers superan una desventaja de cinco carreras en el quinto juego y vencen a los Yankees.", url: "https://www.mlb.com/video/dodgers-overcome-5-run-deficit-to-win-world-series"},
  ],
  108: [
    {title: "Los Angels ganan la Serie Mundial de 2002", date: "27 oct 2002", duration: "2:01", description: "Troy Percival consigue el último out del séptimo juego ante San Francisco para dar a Anaheim su primer campeonato mundial.", url: "https://www.mlb.com/angels/video/angels-win-2002-world-series"},
  ],
  118: [
    {title: "Kansas City gana su primera Serie Mundial de 1985", date: "27 oct 1985", duration: "1:26", description: "Bret Saberhagen completa la blanqueada del séptimo juego ante St. Louis y los Royals celebran el primer campeonato de su historia.", url: "https://www.mlb.com/royals/video/royals-win-1985-world-series-c20084983"},
    {title: "El inolvidable Juego de Comodines de 2014", date: "30 sep 2014", duration: "3:51:35", description: "Partido completo: Kansas City remonta dos veces y derrota 9–8 a Oakland en doce entradas para iniciar su histórica postemporada.", url: "https://www.mlb.com/video/royals-win-2014-al-wild-card-game"},
    {title: "Los Royals vuelven a ser campeones en 2015", date: "1 nov 2015", duration: "4:23", description: "Celebración del segundo título mundial de Kansas City después de derrotar a New York Mets en cinco juegos.", url: "https://www.mlb.com/royals/video/royals-win-the-2015-world-series-c527664183"},
  ],
  117: [
    {title: "Houston llega a su primera Serie Mundial", date: "19 oct 2005", duration: "0:55", description: "Dan Wheeler obtiene el último out de la Serie de Campeonato ante St. Louis y los Astros ganan su primer banderín de la Liga Nacional.", url: "https://www.mlb.com/video/astros-advance-to-world-series-c20047525"},
    {title: "Los Astros ganan su primera Serie Mundial en 2017", date: "1 nov 2017", duration: "0:28", description: "José Altuve completa la jugada final del séptimo partido ante Los Angeles Dodgers para asegurar la primera corona de la franquicia.", url: "https://www.mlb.com/astros/video/astros-win-the-world-series-c1866378083"},
    {title: "Houston se corona campeón mundial de 2022", date: "5 nov 2022", duration: "0:29", description: "Kyle Tucker captura el último out del sexto juego ante Philadelphia y los Astros celebran su segunda Serie Mundial.", url: "https://www.mlb.com/astros/video/astros-win-the-world-series"},
  ],
  116: [
    {title: "Detroit conquista la Serie Mundial de 1968", date: "10 oct 1968", duration: "1:08", description: "El último out del séptimo juego ante St. Louis completa el tercer campeonato mundial de los Tigers.", url: "https://www.mlb.com/video/tigers-win-the-series-c19973569"},
    {title: "El último out de la Serie Mundial de 1984", date: "14 oct 1984", duration: "0:23", description: "La narración de Ernie Harwell acompaña el último out ante San Diego y el cuarto título de Detroit.", url: "https://www.mlb.com/tigers/video/tigers-win-the-1984-world-series-c7839515"},
    {title: "Miguel Cabrera alcanza los 3,000 hits", date: "23 abr 2022", duration: "2:13", description: "El inolvidable imparable 3,000 de Miguel Cabrera ante Colorado y la ovación del público de Comerica Park.", url: "https://www.mlb.com/tigers/video/cabrera-reaches-3-000th-hit"},
  ],
  114: [
    {title: "Cleveland conquista la Serie Mundial de 1948", date: "11 oct 1948", duration: "0:33", description: "Gene Bearden consigue el último out ante Boston Braves para asegurar el segundo título mundial del club.", url: "https://www.mlb.com/video/indians-win-world-series-c1208509483"},
    {title: "Rajai Davis empata el séptimo juego de 2016", date: "2 nov 2016", duration: "0:30", description: "Narración histórica del cuadrangular de dos carreras de Davis en la octava entrada frente a Cubs.", url: "https://www.mlb.com/video/davis-clutch-game-tying-homer-c1211132983"},
    {title: "Cleveland celebra el título divisional de 2026", date: "26 sep 2026", duration: "0:13", description: "Los Guardians celebran su tercera corona consecutiva de la Central de la Liga Americana.", url: "https://www.mlb.com/video/guardians-react-to-being-2026-al-central-champions"},
  ],
  115: [
    {title: "Colorado conquista la Liga Nacional en 2007", date: "15 oct 2007", duration: "3:05", description: "Los Rockies barren a Arizona en la Serie de Campeonato y obtienen el primer banderín de su historia.", url: "https://www.mlb.com/rockies/video/rockies-win-2007-nlcs-c22639773"},
    {title: "Colorado celebra su triunfo de comodín en 2018", date: "2 oct 2018", duration: "1:58", description: "Celebración después de superar 2–1 a Chicago Cubs en trece entradas.", url: "https://www.mlb.com/rockies/video/rockies-celebrate-wild-card-win-c2513327983"},
    {title: "Todd Helton recuerda su legado en Cooperstown", date: "21 jul 2024", duration: "4:32", description: "Entrevista oficial de MLB durante la ceremonia de ingreso del primera base al Salón de la Fama.", url: "https://www.mlb.com/rockies/video/todd-helton-talks-his-career-and-legacy-hall-of-fame"},
  ],
  113: [
    {title: "Johnny Bench lidera a Cincinnati en 1975", date: "7 dic 2020", duration: "1:15", description: "MLB recuerda la actuación del receptor durante la Serie Mundial de 1975 ante Boston.", url: "https://www.mlb.com/reds/video/johnny-bench-leads-reds-in-75-ws"},
    {title: "El último out del bicampeonato de 1976", date: "21 oct 1976", duration: "0:44", description: "Will McEnaney completa el último out ante Yankees y los Reds celebran la corona de 1976.", url: "https://www.mlb.com/video/reds-win-the-1976-series-c19970319"},
    {title: "Cincinnati gana el primer juego de la Serie Mundial de 1990", date: "16 oct 1990", duration: "0:29", description: "Randy Myers asegura el último out del triunfo 7–0 sobre Oakland en el primer juego de la Serie Mundial de 1990.", url: "https://www.mlb.com/video/reds-win-game-1-of-90-ws-c1451560183"},
  ],
  145: [
    {title: "El último out de la Serie Mundial de 2005", date: "26 oct 2005", duration: "0:32", description: "Juan Uribe asegura el último out ante Houston y Chicago conquista su primera Serie Mundial en 88 años.", url: "https://www.mlb.com/whitesox/video/white-sox-are-world-champions-c3461473"},
    {title: "Película oficial de la Serie Mundial de 2005", date: "29 nov 2005", duration: "1:15:01", description: "Documental de MLB sobre el barrido de los White Sox a Houston y la actuación de Jermaine Dye.", url: "https://www.mlb.com/video/2005-world-series-film"},
    {title: "Los White Sox celebran 20 años del campeonato", date: "12 jul 2025", duration: "4:07", description: "Ceremonia oficial para recordar a los campeones de la Serie Mundial de 2005 ante su afición.", url: "https://www.mlb.com/whitesox/video/white-sox-celebrate-2005-world-series-championship"},
  ],
  112: [
    {
      title: "Los Cubs conquistan la Serie Mundial después de 108 años",
      date: "3 nov 2016",
      duration: "1:31",
      description: "MLB resume el campeonato de Chicago en siete juegos ante Cleveland, con remontada desde una desventaja de 1-3.",
      url: "https://www.mlb.com/cubs/video/cubs-win-ws-in-seven-games-c1211088483",
    },
    {
      title: "Los diez momentos inolvidables de Chicago en 2016",
      date: "4 may 2020",
      duration: "3:59",
      description: "Selección oficial del club con las diez jugadas y momentos que definieron su temporada campeona.",
      url: "https://www.mlb.com/cubs/video/cubs-top-10-moments-of-2016",
    },
    {
      title: "La celebración del campeonato de los Cubs",
      date: "11 nov 2016",
      duration: "4:19",
      description: "Video oficial del club sobre la histórica Serie Mundial de 2016 y su celebración.",
      url: "https://www.mlb.com/cubs/video/2016-world-champion-chicago-cubs-c1211980383",
    },
  ],
  111: [
    {
      title: "Boston rompe la sequía de 86 años en 2004",
      date: "15 nov 2004",
      duration: "1:02:02",
      description: "Documental oficial de MLB sobre la Serie Mundial de 2004 y el campeonato de Boston ante San Luis.",
      url: "https://www.mlb.com/video/2004-world-series-film",
    },
    {
      title: "Koji Uehara asegura la Serie Mundial de 2013",
      date: "30 oct 2013",
      duration: "3:05",
      description: "El último ponche de Boston en el sexto juego contra St. Louis Cardinals y su octavo título de Serie Mundial.",
      url: "https://www.mlb.com/es/video/red-sox-are-2013-champs-c31197263",
    },
    {
      title: "El camino de Boston al título de 2018",
      date: "30 oct 2018",
      duration: "5:06",
      description: "MLB repasa la temporada que culminó con la novena Serie Mundial de los Red Sox ante Dodgers.",
      url: "https://www.mlb.com/video/how-they-got-there-red-sox-c2518426383",
    },
  ],
  110: [
    {
      title: "Gunnar Henderson decide un triunfo sobre los Mets",
      date: "14 sep 2026",
      duration: "3:29",
      description: "Resumen oficial de la victoria 2-1 de Baltimore, con el jonrón de la ventaja de Gunnar Henderson y un doblete productor de Heston Kjerstad.",
      url: "https://www.mlb.com/orioles/video/gunnar-henderson-homers-in-orioles-2-1-win",
    },
    {
      title: "Homenaje a los 2,131 juegos de Cal Ripken Jr.",
      date: "6 sep 2025",
      duration: "1:04",
      description: "Los Orioles recuerdan el trigésimo aniversario de la noche en que Ripken superó la marca de Lou Gehrig.",
      url: "https://www.mlb.com/video/orioles-honor-cal-ripken-jr-on-anniversary-of-streak",
    },
    {
      title: "Baltimore conquista la Serie Mundial de 1983",
      date: "16 oct 1983",
      duration: "1:53:42",
      description: "Partido completo del quinto juego, con los dos cuadrangulares de Eddie Murray y la blanqueada de Scott McGregor.",
      url: "https://www.mlb.com/orioles/video/orioles-win-1983-world-series",
    },
  ],
  144: [
    {
      title: "Los mejores momentos de Chris Sale en 2026",
      date: "9 oct 2026",
      duration: "12:50",
      description: "Repaso oficial de la temporada 2026 del lanzador de Atlanta.",
      url: "https://www.mlb.com/braves/video/chris-sale-s-best-moments-of-2026",
    },
    {
      title: "Chris Sale completa una blanqueada ante Dodgers",
      date: "27 ago 2026",
      duration: "0:29",
      description: "Ángulo de campo del último ponche en su blanqueada de juego completo.",
      url: "https://www.mlb.com/braves/video/field-view-chris-sale-notches-complete-game-shutout",
    },
    {
      title: "Atlanta conquista la Serie Mundial de 2021",
      date: "2 nov 2021",
      duration: "5:16",
      description: "El video de MLB sobre el cuarto campeonato de la franquicia.",
      url: "https://www.mlb.com/braves/video/braves-are-world-champions",
    },
  ],
};

export function getMlbClubVerifiedVideos(clubId: number): readonly MlbClubVideo[] {
  return verified[clubId] ?? [];
}
