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
};
function translateMlbDescription(
  description: string
) {
  return description
    // Cambios y sustituciones
    .replace(
      /^Pitching Change:\s*(.+?) replaces (.+?)\.?$/gi,
      "Cambio de lanzador: $1 reemplaza a $2."
    )
    .replace(
  /^Defensive Substitution:\s*(.+?) replaces (.+?), batting (\d+)(?:st|nd|rd|th), playing (.+?)\.?$/gi,
  "Sustitución defensiva: $1 reemplaza a $2, bateando $3.º en el orden, jugando como $4."
)
    .replace(
      /^Defensive Substitution:\s*/gi,
      "Sustitución defensiva: "
    )
    .replace(
      /^Offensive Substitution:\s*/gi,
      "Sustitución ofensiva: "
    )
    .replace(
      /^Pinch-hitter\s*/gi,
      "Bateador emergente "
    )
    .replace(
      /^Pinch-runner\s*/gi,
      "Corredor emergente "
    )

    // Ponches
    .replace(
      /strikes out on a foul tip/gi,
      "se poncha con foul tip"
    )
    .replace(
      /strikes out swinging/gi,
      "se poncha tirándole"
    )
    .replace(
      /strikes out looking/gi,
      "se poncha sin tirarle"
    )
    .replace(
      /strikes out/gi,
      "se poncha"
    )

    // Bases por bolas / pelotazo
    .replace(
      /intentionally walks/gi,
      "recibe base por bolas intencional"
    )
    .replace(
      /\bwalks\b/gi,
      "recibe base por bolas"
    )
    .replace(
      /hit by pitch/gi,
      "es golpeado por lanzamiento"
    )

    // Hits
    .replace(
      /\bsingles\b/gi,
      "conecta sencillo"
    )
    .replace(
      /\bdoubles\b/gi,
      "conecta doble"
    )
    .replace(
      /\btriples\b/gi,
      "conecta triple"
    )
    .replace(
      /\bhomers\b/gi,
      "conecta jonrón"
    )
    .replace(
      /home run/gi,
      "jonrón"
    )

    // Outs
    .replace(
      /grounds out/gi,
      "es puesto out con rodado"
    )
    .replace(
      /flies out/gi,
      "es puesto out con elevado"
    )
    .replace(
      /lines out/gi,
      "es puesto out con línea"
    )
    .replace(
      /pops out/gi,
      "es puesto out con elevado corto"
    )
    .replace(
      /force out/gi,
      "es puesto out forzado"
    )
    .replace(
      /grounds into a double play/gi,
      "bateó para doble play"
    )
    .replace(
      /double play/gi,
      "doble play"
    )
    .replace(
      /triple play/gi,
      "triple play"
    )

    // Sacrificios
    .replace(
      /sacrifice fly/gi,
      "elevado de sacrificio"
    )
    .replace(
      /sacrifice bunt/gi,
      "toque de sacrificio"
    )

    // Errores / elección del fildeador
    .replace(
      /reaches on a fielding error/gi,
      "llega a base por error de fildeo"
    )
    .replace(
      /reaches on a throwing error/gi,
      "llega a base por error de tiro"
    )
    .replace(
      /fielder's choice/gi,
      "elección del fildeador"
    )

    // Corredores
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
      /caught stealing second base/gi,
      "es puesto out intentando robar segunda"
    )
    .replace(
      /caught stealing third base/gi,
      "es puesto out intentando robar tercera"
    )
    .replace(
      /caught stealing home/gi,
      "es puesto out intentando robar home"
    )
    .replace(
      /picked off/gi,
      "es sorprendido fuera de base"
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

    // Lanzamientos
    .replace(
      /wild pitch/gi,
      "lanzamiento descontrolado"
    )
    .replace(
      /passed ball/gi,
      "passed ball"
    )
    .replace(
      /\bbalk\b/gi,
      "balk"
    )

    // Direcciones y posiciones
    .replace(
      /left fielder/gi,
      "jardinero izquierdo"
    )
    .replace(
      /center fielder/gi,
      "jardinero central"
    )
    .replace(
      /right fielder/gi,
      "jardinero derecho"
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
      /pitcher/gi,
      "lanzador"
    )
    .replace(
      /catcher/gi,
      "receptor"
    )

    // Tipo de batazo
    .replace(
      /on a line drive/gi,
      "con línea"
    )
    .replace(
      /on a ground ball/gi,
      "con rodado"
    )
    .replace(
      /on a fly ball/gi,
      "con elevado"
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

    const linescore =
      data?.liveData?.linescore;

    if (!currentPlay || !linescore) {
      return null;
    }

    const offense =
      linescore?.offense ?? {};

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

      outs: Number(
        currentPlay?.count?.outs ??
        linescore?.outs ??
        0
      ),

      inning: Number(
        currentPlay?.about?.inning ??
        linescore?.currentInning ??
        0
      ),

      inningState:
        currentPlay?.about?.halfInning ??
        linescore?.inningState ??
        "",

     description:
  translateMlbDescription(
    description
  ),
    };
  } catch {
    return null;
  }
}
