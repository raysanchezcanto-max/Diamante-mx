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
      /\bwalks\b/gi,
      "recibe base por bolas"
    )
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
    currentPlay?.result?.description ??
    ""
  ),
    };
  } catch {
    return null;
  }
}
