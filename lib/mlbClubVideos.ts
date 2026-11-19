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
  114: [
    {title: "Cleveland conquista la Serie Mundial de 1948", date: "11 oct 1948", duration: "0:33", description: "Gene Bearden consigue el último out ante Boston Braves para asegurar el segundo título mundial del club.", url: "https://www.mlb.com/video/indians-win-world-series-c1208509483"},
    {title: "Rajai Davis empata el séptimo juego de 2016", date: "2 nov 2016", duration: "0:30", description: "Narración histórica del cuadrangular de dos carreras de Davis en la octava entrada frente a Cubs.", url: "https://www.mlb.com/video/davis-clutch-game-tying-homer-c1211132983"},
    {title: "Cleveland celebra el título divisional de 2026", date: "26 sep 2026", duration: "0:13", description: "Los Guardians celebran su tercera corona consecutiva de la Central de la Liga Americana.", url: "https://www.mlb.com/video/guardians-react-to-being-2026-al-central-champions"},
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
