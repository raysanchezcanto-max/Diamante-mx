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
