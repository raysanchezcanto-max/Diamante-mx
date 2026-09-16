import { translateBaseballText } from "@/lib/translateBaseball";
export type MlbPlayState = {
  first: number;
  second: number;
  third: number;

  balls: number;
  strikes: number;
  outs: number;

  inning?: number;
  inningState?: string;

  description?: string;
  batterName?: string;
  pitcherName?: string;
pitchCount?: number;
  inningLines?: {
  inning: number;
  away?: number;
  home?: number;
}[];

lineScoreTotals?: {
  away: {
    runs: number;
    hits: number;
    errors: number;
  };
  home: {
    runs: number;
    hits: number;
    errors: number;
  };
};
  plays?: string[];
};
function translateMlbDescription(
  description: string
) {
  let text = description.trim();

  /*
    Primero traducimos estructuras completas.
    Esto evita mezclar inglés y español.
  */

  text = text
    // Ponches
    .replace(
      /^(.+?) strikes out swinging\.?$/i,
      "$1 se poncha tirándole."
    )
    .replace(
      /^(.+?) strikes out looking\.?$/i,
      "$1 se poncha sin tirarle."
    )
    .replace(
      /^(.+?) strikes out on a foul tip\.?$/i,
      "$1 se poncha con foul tip."
    )

    // Base por bolas / golpeado
    .replace(
      /^(.+?) walks\.?$/i,
      "$1 recibe base por bolas."
    )
    .replace(
      /^(.+?) intentionally walks\.?$/i,
      "$1 recibe base por bolas intencional."
    )
    .replace(
      /^(.+?) hit by pitch\.?$/i,
      "$1 es golpeado por lanzamiento."
    )
// Hits con tipo de batazo
.replace(
  /^(.+?) singles on a line drive to (.+?)\.?$/i,
  "$1 conecta sencillo con línea hacia $2."
)
.replace(
  /^(.+?) singles on a ground ball to (.+?)\.?$/i,
  "$1 conecta sencillo con rodado hacia $2."
)
.replace(
  /^(.+?) singles on a fly ball to (.+?)\.?$/i,
  "$1 conecta sencillo con elevado hacia $2."
)
.replace(
  /^(.+?) doubles on a line drive to (.+?)\.?$/i,
  "$1 conecta doble con línea hacia $2."
)
.replace(
  /^(.+?) doubles on a ground ball to (.+?)\.?$/i,
  "$1 conecta doble con rodado hacia $2."
)
.replace(
  /^(.+?) doubles on a fly ball to (.+?)\.?$/i,
  "$1 conecta doble con elevado hacia $2."
)
.replace(
  /^(.+?) triples on a line drive to (.+?)\.?$/i,
  "$1 conecta triple con línea hacia $2."
)
.replace(
  /^(.+?) triples on a ground ball to (.+?)\.?$/i,
  "$1 conecta triple con rodado hacia $2."
)
.replace(
  /^(.+?) triples on a fly ball to (.+?)\.?$/i,
  "$1 conecta triple con elevado hacia $2."
)
    // Elevados
    .replace(
      /^(.+?) flies out sharply to (.+?)\.?$/i,
      "$1 es puesto out con elevado fuerte hacia $2."
    )
    .replace(
      /^(.+?) flies out softly to (.+?)\.?$/i,
      "$1 es puesto out con elevado suave hacia $2."
    )
    .replace(
      /^(.+?) flies out to (.+?)\.?$/i,
      "$1 es puesto out con elevado hacia $2."
    )

    // Líneas
    .replace(
      /^(.+?) lines out sharply to (.+?)\.?$/i,
      "$1 es puesto out con línea fuerte hacia $2."
    )
    .replace(
      /^(.+?) lines out softly to (.+?)\.?$/i,
      "$1 es puesto out con línea suave hacia $2."
    )
    .replace(
      /^(.+?) lines out to (.+?)\.?$/i,
      "$1 es puesto out con línea hacia $2."
    )

    // Rodados
    .replace(
  /^(.+?) grounds out, (.+?) to (.+?)\.?$/i,
  "$1 es puesto out con rodado, de $2 a $3."
)
    .replace(
      /^(.+?) grounds out sharply to (.+?)\.?$/i,
      "$1 es puesto out con rodado fuerte hacia $2."
    )
    .replace(
      /^(.+?) grounds out softly to (.+?)\.?$/i,
      "$1 es puesto out con rodado suave hacia $2."
    )
    .replace(
      /^(.+?) grounds out to (.+?)\.?$/i,
      "$1 es puesto out con rodado hacia $2."
    )

    // Pop out
    .replace(
      /^(.+?) pops out to (.+?)\.?$/i,
      "$1 es puesto out con elevado corto hacia $2."
    )

    // Cambios de lanzador
    .replace(
      /^Pitching Change:\s*(.+?) replaces (.+?)\.?$/i,
      "Cambio de lanzador: $1 reemplaza a $2."
    )

    // Sustituciones defensivas
    .replace(
      /^Defensive Substitution:\s*(.+?) replaces (.+?), batting (\d+)(?:st|nd|rd|th), playing (.+?)\.?$/i,
      "Sustitución defensiva: $1 reemplaza a $2, bateando $3.º en el orden, jugando como $4."
    )

    // Tiempos
    .replace(
      /^Batter Timeout\.?$/i,
      "Tiempo solicitado por el bateador."
    )
    .replace(
      /^Pitcher Timeout\.?$/i,
      "Tiempo solicitado por el lanzador."
    )
    .replace(
      /^Mound Visit\.?$/i,
      "Visita al montículo."
    )
    .replace(
      /^Injury Delay\.?$/i,
      "Pausa por lesión."
    );

  /*
    Después traducimos términos que pueden quedar
    dentro de descripciones más largas.
  */
text = text.replace(
  /^Status Change\s*-\s*Warmup\.?$/i,
  "Cambio de estado: Calentamiento."
);


  return text
    .replace(
      /right fielder/gi,
      "jardinero derecho"
    )
    .replace(
      /center fielder/gi,
      "jardinero central"
    )
    .replace(
      /left fielder/gi,
      "jardinero izquierdo"
    )
    .replace(
      /shortstop/gi,
      "campocorto"
    )
    .replace(
      /first baseman/gi,
      "primera base"
    )
    .replace(
      /second baseman/gi,
      "segunda base"
    )
    .replace(
      /third baseman/gi,
      "tercera base"
    )
    .replace(
  /\bin foul territory\b/gi,
  "en territorio de foul"
)
    .replace(
      /catcher/gi,
      "receptor"
    )
    .replace(
      /pitcher/gi,
      "lanzador"
    )
    .replace(
  /([^.]+?) scores\./gi,
  "$1 anota."
)
.replace(
  /([^.]+?) to 3rd\./gi,
  "$1 avanza a tercera."
)
.replace(
  /([^.]+?) to 2nd\./gi,
  "$1 avanza a segunda."
)
.replace(
  /([^.]+?) to 1st\./gi,
  "$1 avanza a primera."
)
.replace(
  /([^.]+?) out at 2nd\./gi,
  "$1 es puesto out en segunda."
)
.replace(
  /([^.]+?) out at 1st\./gi,
  "$1 es puesto out en primera."
)
    .replace(
      /\breplaces\b/gi,
      "reemplaza a"
    )
    .replace(
      /\bbatting\b/gi,
      "bateando"
    )
    .replace(
      /\bplaying\b/gi,
      "jugando como"
    )
    .replace(
      /\bsharply\b/gi,
      "con fuerza"
    )
    .replace(
      /\bsoftly\b/gi,
      "suavemente"
    )
    .replace(
      /\bscores\b/gi,
      "anota"
    )
    .replace(
      /advances to second/gi,
      "avanza a segunda"
    )
    .replace(
      /advances to third/gi,
      "avanza a tercera"
    )
    .replace(
      /advances to home/gi,
      "avanza al home"
    )
    .replace(
      /steals second base/gi,
      "se roba la segunda base"
    )
    .replace(
      /steals third base/gi,
      "se roba la tercera base"
    )
    .replace(
      /steals home/gi,
      "se roba el home"
    )
    .replace(
      /wild pitch/gi,
      "lanzamiento descontrolado"
    )
    .replace(
      /passed ball/gi,
      "passed ball"
    )
    .replace(
      /sacrifice fly/gi,
      "elevado de sacrificio"
    )
    .replace(
      /sacrifice bunt/gi,
      "toque de sacrificio"
    )
    .replace(
      /fielder's choice/gi,
      "elección del fildeador"
    );
}
export async function getMlbPlayState(
  gameId: number
): Promise<MlbPlayState | null> {
  try {
    const response = await fetch(
      `https://statsapi.mlb.com/api/v1.1/game/${gameId}/feed/live`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    const currentPlay =
      data?.liveData?.plays?.currentPlay;
    const batterName =
  currentPlay?.matchup?.batter?.fullName ??
  "";

const pitcherName =
  currentPlay?.matchup?.pitcher?.fullName ??
  "";

const pitcherId =
  currentPlay?.matchup?.pitcher?.id;

const boxscore =
  data?.liveData?.boxscore;

const awayPlayers =
  boxscore?.teams?.away?.players ?? {};

const homePlayers =
  boxscore?.teams?.home?.players ?? {};

const pitcherKey =
  pitcherId
    ? `ID${pitcherId}`
    : "";

const pitcherStats =
  pitcherKey
    ? awayPlayers[pitcherKey]
        ?.stats?.pitching ??
      homePlayers[pitcherKey]
        ?.stats?.pitching
    : undefined;

const pitchCount =
  typeof pitcherStats?.numberOfPitches ===
  "number"
    ? pitcherStats.numberOfPitches
    : undefined;
    const allPlays =
  data?.liveData?.plays?.allPlays ?? [];

const lastCompletedPlay =
  [...allPlays]
    .reverse()
    .find(
      (play: any) =>
        play?.about?.isComplete &&
        play?.result?.description
    );

const description =
  currentPlay?.result?.description ||
  lastCompletedPlay?.result?.description ||
  "";
   const automaticDescription =
  await translateBaseballText(
    description
  );

const finalDescription =
  automaticDescription !== description
    ? automaticDescription
    : translateMlbDescription(
        description
      );

    const linescore =
      data?.liveData?.linescore;
    const inningLines =
  (linescore?.innings ?? []).map(
    (item: any) => ({
      inning: Number(item?.num ?? 0),

      away:
        typeof item?.away?.runs === "number"
          ? item.away.runs
          : undefined,

      home:
        typeof item?.home?.runs === "number"
          ? item.home.runs
          : undefined,
    })
  );

const lineScoreTotals = {
  away: {
    runs: Number(
      linescore?.teams?.away?.runs ?? 0
    ),
    hits: Number(
      linescore?.teams?.away?.hits ?? 0
    ),
    errors: Number(
      linescore?.teams?.away?.errors ?? 0
    ),
  },

  home: {
    runs: Number(
      linescore?.teams?.home?.runs ?? 0
    ),
    hits: Number(
      linescore?.teams?.home?.hits ?? 0
    ),
    errors: Number(
      linescore?.teams?.home?.errors ?? 0
    ),
  },
};

    if (!currentPlay || !linescore) {
      return null;
    }

    const offense =
      linescore?.offense ?? {};
const currentInning =
  Number(
    linescore?.currentInning ??
    currentPlay?.about?.inning ??
    0
  );
const currentHalf =
  String(
    linescore?.inningState ??
    currentPlay?.about?.halfInning ??
    ""
  ).toLowerCase();

const rawInningPlays =
  (
    data?.liveData?.plays?.allPlays ??
    []
  ).filter(
    (item: any) =>
      item?.about?.isComplete === true &&
      Number(item?.about?.inning ?? 0) ===
        currentInning &&
      String(
        item?.about?.halfInning ?? ""
      ).toLowerCase() === currentHalf &&
      item?.result?.description
  );

const plays =
  await Promise.all(
    rawInningPlays.map(
      async (item: any) => {
        const original =
          String(
            item.result.description
          ).trim();

        const automatic =
          await translateBaseballText(
            original
          );

        return automatic !== original
          ? automatic
          : translateMlbDescription(
              original
            );
      }
    )
  );
    return {
      first: offense.first ? 1 : 0,
      second: offense.second ? 1 : 0,
      third: offense.third ? 1 : 0,

      balls: Number(
        currentPlay?.count?.balls ?? 0
      ),

      strikes: Number(
        currentPlay?.count?.strikes ?? 0
      ),

     outs:
  Number(
    linescore?.outs ??
    currentPlay?.count?.outs ??
    0
  ),
    

    inning: Number(
  linescore?.currentInning ??
  currentPlay?.about?.inning ??
  0
),

    inningState:
  linescore?.inningState ??
  currentPlay?.about?.halfInning ??
  "",

     description:
  finalDescription,
      batterName,
pitcherName,
pitchCount,
      inningLines,
lineScoreTotals,
      plays,
  
    };
  } catch {
    return null;
  }
}
