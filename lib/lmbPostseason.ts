/**
 * Archivo verificado de playoffs LMB 2026.
 * Datos derivados del calendario de juegos de lmb.com.mx/juegos/api/calendar
 * consultado con fecha MM/DD/YYYY y límites epoch en milisegundos.
 * Los 13 cruces, 72 partidos disputados, victorias por serie y enlaces
 * /juegos/{gameId} se contrastaron con la fuente oficial.
 * NO extrapolar estos enfrentamientos a temporadas posteriores.
 */
export type LmbPlayoffRound = "first" | "zone" | "championship" | "rey";
export type LmbPlayoffZone = "Norte" | "Sur" | "General";
export type LmbPlayoffTeam = { code: string; name: string; wins: number; id?: number };
export type LmbSerieDelReyPitcherDecision = { id: number; name: string };
export type LmbSerieDelReyGame = {
  id: number;
  date: string; // Fecha local México, extraída del calendario oficial
  awayCode: string;
  homeCode: string;
  awayId?: number;
  homeId?: number;
  awayRuns: number;
  homeRuns: number;
  winner?: LmbSerieDelReyPitcherDecision;
  loser?: LmbSerieDelReyPitcherDecision;
  save?: LmbSerieDelReyPitcherDecision;
};
export type LmbPlayoffSeries = {
  round: LmbPlayoffRound;
  zone: LmbPlayoffZone;
  teams: [LmbPlayoffTeam, LmbPlayoffTeam];
  winnerCode: string;
  bestLoserCode: string | null;
  lastGameId: number;
  gameIds: number[];
  games?: LmbSerieDelReyGame[];
  timeline?: Array<{
    id: number;
    date: string;
    status: "Preview" | "Live" | "Final" | "Postponed";
    gameNumber: number | null;
    startTimeTBD: boolean;
  }>;
};
export type LmbPostseason = { season: number; series: LmbPlayoffSeries[] };

export const LMB_PLAYOFF_ROUNDS: LmbPlayoffRound[] = [
  "first", "zone", "championship", "rey",
];
export const LMB_PLAYOFF_ROUND_LABELS: Record<LmbPlayoffRound, string> = {
  first: "Primer Playoff",
  zone: "Series de Zona",
  championship: "Series de Campeonato",
  rey: "Serie del Rey",
};

const LMB_PLAYOFF_2026: LmbPostseason = {
  season: 2026,
  series: [
  {
    "round": "first",
    "zone": "Norte",
    "teams": [
      {
        "code": "TIJ",
        "name": "Toros de Tijuana",
        "wins": 4
      },
      {
        "code": "LAG",
        "name": "Algodoneros de Unión Laguna",
        "wins": 1
      }
    ],
    "winnerCode": "TIJ",
    "bestLoserCode": null,
    "lastGameId": 862939,
    "gameIds": [
      862942,
      862938,
      862941,
      862940,
      862939
    ]
  },
  {
    "round": "first",
    "zone": "Norte",
    "teams": [
      {
        "code": "DUR",
        "name": "Caliente de Durango",
        "wins": 4
      },
      {
        "code": "MVA",
        "name": "Acereros de Monclova",
        "wins": 1
      }
    ],
    "winnerCode": "DUR",
    "bestLoserCode": null,
    "lastGameId": 862930,
    "gameIds": [
      862933,
      862932,
      862937,
      862936,
      862930
    ]
  },
  {
    "round": "first",
    "zone": "Norte",
    "teams": [
      {
        "code": "MTY",
        "name": "Sultanes de Monterrey",
        "wins": 4
      },
      {
        "code": "JAL",
        "name": "Charros de Jalisco",
        "wins": 1
      }
    ],
    "winnerCode": "MTY",
    "bestLoserCode": "JAL",
    "lastGameId": 862931,
    "gameIds": [
      862927,
      862926,
      862925,
      862924,
      862931
    ]
  },
  {
    "round": "first",
    "zone": "Sur",
    "teams": [
      {
        "code": "MEX",
        "name": "Diablos Rojos del México",
        "wins": 4
      },
      {
        "code": "OAX",
        "name": "Guerreros de Oaxaca",
        "wins": 3
      }
    ],
    "winnerCode": "MEX",
    "bestLoserCode": "OAX",
    "lastGameId": 862958,
    "gameIds": [
      862963,
      862961,
      862962,
      862960,
      862953,
      862959,
      862958
    ]
  },
  {
    "round": "first",
    "zone": "Sur",
    "teams": [
      {
        "code": "TAB",
        "name": "Olmecas de Tabasco",
        "wins": 4
      },
      {
        "code": "LEO",
        "name": "Bravos de León",
        "wins": 2
      }
    ],
    "winnerCode": "TAB",
    "bestLoserCode": null,
    "lastGameId": 862952,
    "gameIds": [
      862957,
      862956,
      862955,
      862954,
      862944,
      862952
    ]
  },
  {
    "round": "first",
    "zone": "Sur",
    "teams": [
      {
        "code": "PUE",
        "name": "Pericos de Puebla",
        "wins": 4
      },
      {
        "code": "CAM",
        "name": "Piratas de Campeche",
        "wins": 1
      }
    ],
    "winnerCode": "PUE",
    "bestLoserCode": null,
    "lastGameId": 862946,
    "gameIds": [
      862950,
      862949,
      862948,
      862947,
      862946
    ]
  },
  {
    "round": "zone",
    "zone": "Norte",
    "teams": [
      {
        "code": "TIJ",
        "name": "Toros de Tijuana",
        "wins": 4
      },
      {
        "code": "JAL",
        "name": "Charros de Jalisco",
        "wins": 1
      }
    ],
    "winnerCode": "TIJ",
    "bestLoserCode": null,
    "lastGameId": 867442,
    "gameIds": [
      867447,
      867445,
      867446,
      867441,
      867442
    ]
  },
  {
    "round": "zone",
    "zone": "Norte",
    "teams": [
      {
        "code": "MTY",
        "name": "Sultanes de Monterrey",
        "wins": 4
      },
      {
        "code": "DUR",
        "name": "Caliente de Durango",
        "wins": 1
      }
    ],
    "winnerCode": "MTY",
    "bestLoserCode": null,
    "lastGameId": 867439,
    "gameIds": [
      867435,
      867436,
      867437,
      867438,
      867439
    ]
  },
  {
    "round": "zone",
    "zone": "Sur",
    "teams": [
      {
        "code": "PUE",
        "name": "Pericos de Puebla",
        "wins": 4
      },
      {
        "code": "MEX",
        "name": "Diablos Rojos del México",
        "wins": 2
      }
    ],
    "winnerCode": "PUE",
    "bestLoserCode": null,
    "lastGameId": 867473,
    "gameIds": [
      867478,
      867477,
      867476,
      867475,
      867474,
      867473
    ]
  },
  {
    "round": "zone",
    "zone": "Sur",
    "teams": [
      {
        "code": "TAB",
        "name": "Olmecas de Tabasco",
        "wins": 4
      },
      {
        "code": "OAX",
        "name": "Guerreros de Oaxaca",
        "wins": 3
      }
    ],
    "winnerCode": "TAB",
    "bestLoserCode": null,
    "lastGameId": 867465,
    "gameIds": [
      867470,
      867472,
      867469,
      867468,
      867467,
      867466,
      867465
    ]
  },
  {
    "round": "championship",
    "zone": "Norte",
    "teams": [
      {
        "code": "TIJ",
        "name": "Toros de Tijuana",
        "wins": 4
      },
      {
        "code": "MTY",
        "name": "Sultanes de Monterrey",
        "wins": 1
      }
    ],
    "winnerCode": "TIJ",
    "bestLoserCode": null,
    "lastGameId": 867494,
    "gameIds": [
      867500,
      867499,
      867498,
      867493,
      867494
    ]
  },
  {
    "round": "championship",
    "zone": "Sur",
    "teams": [
      {
        "code": "TAB",
        "name": "Olmecas de Tabasco",
        "wins": 4
      },
      {
        "code": "PUE",
        "name": "Pericos de Puebla",
        "wins": 1
      }
    ],
    "winnerCode": "TAB",
    "bestLoserCode": null,
    "lastGameId": 867483,
    "gameIds": [
      867497,
      867491,
      867492,
      867482,
      867483
    ]
  },
  {
    "round": "rey",
    "zone": "General",
    "teams": [
      {
        "code": "TIJ",
        "name": "Toros de Tijuana",
        "wins": 4
      },
      {
        "code": "TAB",
        "name": "Olmecas de Tabasco",
        "wins": 2
      }
    ],
    "winnerCode": "TIJ",
    "bestLoserCode": null,
    "lastGameId": 867481,
    "gameIds": [
      867486,
      867487,
      867488,
      867489,
      867490,
      867481
    ],
    // Serie del Rey 2026: seis resultados oficiales (LMB API calendar).
    "games": [
      { "id": 867486, "date": "2026-09-08", "awayCode": "TAB", "homeCode": "TIJ", "awayRuns": 7, "homeRuns": 1, "winner": {"id": 677369, "name": "Austin Warner"}, "loser": {"id": 681979, "name": "Daniel Martinez"} },
      { "id": 867487, "date": "2026-09-09", "awayCode": "TAB", "homeCode": "TIJ", "awayRuns": 2, "homeRuns": 13, "winner": {"id": 658431, "name": "Adonis Medina"}, "loser": {"id": 656889, "name": "Jeremy Rhoades"} },
      { "id": 867488, "date": "2026-09-11", "awayCode": "TIJ", "homeCode": "TAB", "awayRuns": 2, "homeRuns": 0, "winner": {"id": 547862, "name": "David Reyes"}, "loser": {"id": 657122, "name": "Ronnie Williams"}, "save": {"id": 676969, "name": "Brett de Geus"} },
      { "id": 867489, "date": "2026-09-12", "awayCode": "TIJ", "homeCode": "TAB", "awayRuns": 1, "homeRuns": 9, "winner": {"id": 547176, "name": "Daniel Camarena"}, "loser": {"id": 659418, "name": "Noah Skirrow"} },
      { "id": 867490, "date": "2026-09-13", "awayCode": "TIJ", "homeCode": "TAB", "awayRuns": 6, "homeRuns": 5, "winner": {"id": 641995, "name": "Roel Ramírez"}, "loser": {"id": 677868, "name": "Francis Peguero"}, "save": {"id": 676969, "name": "Brett de Geus"} },
      { "id": 867481, "date": "2026-09-15", "awayCode": "TAB", "homeCode": "TIJ", "awayRuns": 0, "homeRuns": 2, "winner": {"id": 658431, "name": "Adonis Medina"}, "loser": {"id": 656889, "name": "Jeremy Rhoades"}, "save": {"id": 676969, "name": "Brett de Geus"} }
    ]
  }
]
};

export function getLmbPostseason(season: number): LmbPostseason | null {
  // 2027+ requiere las fechas de fases oficiales de esa temporada y
  // clasificación de juegos del nuevo calendario; nunca reutilizar 2026.
  if (season !== 2026) return null;
  return LMB_PLAYOFF_2026;
}
