import type {
  LmbPostseason, LmbPlayoffRound, LmbPlayoffSeries,
  LmbPlayoffTeam, LmbSerieDelReyGame, LmbPlayoffZone,
} from "./lmbPostseason";

/**
 * Generación de playoffs LMB desde el calendario StatsAPI, sportId=23
 * (Independent Leagues), leagueId=125. A diferencia de la temporada 2026
 * archivada, no hay enfrentamientos ni campeones predeterminados.
 */
const PHASES: Record<string, LmbPlayoffRound> = {
  F: "first", D: "zone", L: "championship", W: "rey",
};
const ZONES: Record<number, LmbPlayoffZone> = { 222: "Norte", 223: "Sur" };

function positiveInt(value: unknown): number | null {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
}
function runs(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isInteger(n) && n >= 0 ? n : null;
}
function realTeam(raw: any): boolean {
  const id = positiveInt(raw?.id);
  const name = String(raw?.name ?? "").trim();
  return Boolean(id && name && !/to be determined|por definir|tbd|pendiente/i.test(name));
}
function status(game: any): "Preview" | "Live" | "Final" | "Postponed" {
  const code = String(game?.status?.abstractGameState ?? "").toLowerCase();
  const detailed = String(game?.status?.detailedState ?? "").toLowerCase();
  // StatsAPI puede devolver el mismo gamePk dos veces: un registro de
  // posposición con abstractGameState=Final y el juego jugado después.
  if (/postpon|cancel|suspend|pospuest|reprogramad/.test(detailed)) return "Postponed";
  if (code === "final" || detailed.startsWith("final") ||
      String(game?.status?.codedGameState ?? "").toUpperCase() === "F") return "Final";
  if (code === "live" || code === "in progress" || detailed.includes("progress") ||
      detailed.includes("delay") || detailed.includes("suspend")) return "Live";
  return "Preview";
}

export function buildLmbPostseasonDynamic(
  season: number, schedule: any, roster: any
): LmbPostseason | null {
  const metadata = new Map<number, { code: string; name: string; zone: LmbPlayoffZone }>();
  for (const team of roster?.teams ?? []) {
    const id = positiveInt(team?.id);
    const zone = ZONES[Number(team?.division?.id)];
    const code = String(team?.abbreviation ?? "").trim().toUpperCase();
    const name = String(team?.name ?? "").trim();
    if (id && zone && code && realTeam(team)) {
      metadata.set(id, { code, name, zone });
    }
  }
  if (!metadata.size) return null;

  type Saved = { game: any; state: "Preview" | "Live" | "Final" | "Postponed" };
  const groups = new Map<string, {
    round: LmbPlayoffRound;
    zone: LmbPlayoffZone;
    awayId: number;
    homeId: number;
    games: Saved[];
  }>();
  const seen = new Map<number, {key: string; index: number; rank: number}>();

  for (const day of schedule?.dates ?? []) {
    for (const game of day?.games ?? []) {
      const round = PHASES[String(game?.gameType ?? "")];
      const id = positiveInt(game?.gamePk);
      const away = positiveInt(game?.teams?.away?.team?.id);
      const home = positiveInt(game?.teams?.home?.team?.id);
      if (!round || !id || !away || !home || away === home ||
          !realTeam(game?.teams?.away?.team) || !realTeam(game?.teams?.home?.team)) continue;
      if (!metadata.has(away) || !metadata.has(home)) continue;
      const zone = round === "rey" ? "General" : metadata.get(home)!.zone;
      if (round !== "rey" && metadata.get(away)!.zone !== zone) continue;
      const code = [away,home].sort((a,b)=>a-b).join("-");
      const key = round + ":" + code;
      const state = status(game);
      const validScores = runs(game?.teams?.away?.score) !== null &&
        runs(game?.teams?.home?.score) !== null;
      const rank = state === "Final" && validScores ? 4 :
        state === "Live" ? 3 : state === "Preview" ? 2 : 1;
      const existing = seen.get(id);
      if (existing) {
        // Prevalece SIEMPRE el resultado jugado frente a un aplazamiento,
        // incluso si la API entrega primero el evento reprogramado.
        if (existing.key === key && rank > existing.rank) {
          groups.get(key)!.games[existing.index] = {game,state};
          seen.set(id,{...existing,rank});
        }
        continue;
      }
      if (!groups.has(key)) {
        groups.set(key, {round, zone, awayId: away, homeId: home, games: []});
      }
      const match = groups.get(key)!;
      seen.set(id,{key,index:match.games.length,rank});
      match.games.push({game,state});
    }
  }
  if (!groups.size) return null;

  const all: LmbPlayoffSeries[] = [];
  for (const group of groups.values()) {
    const match = [...group.games].sort((a,b) =>
      String(a.game.gameDate ?? a.game.officialDate ?? "").localeCompare(
        String(b.game.gameDate ?? b.game.officialDate ?? "")
      ) || a.game.gamePk-b.game.gamePk
    );
    const wins = new Map<number, number>([[group.awayId, 0],[group.homeId, 0]]);
    const finalGames: LmbSerieDelReyGame[] = [];
    const timeline: NonNullable<LmbPlayoffSeries["timeline"]> = [];
    let lastGameId = 0;

    for (const {game, state} of match) {
      const away = Number(game.teams.away.team.id), home = Number(game.teams.home.team.id);
      const ar = runs(game.teams.away.score), hr = runs(game.teams.home.score);
      timeline.push({
        id:game.gamePk, date:String(game.gameDate ?? ""),
        status:state,
        gameNumber:positiveInt(game.seriesGameNumber),
        startTimeTBD:Boolean(game?.status?.startTimeTBD),
      });
      if (state === "Final" && ar !== null && hr !== null && ar !== hr) {
        const winner = ar > hr ? away : home;
        wins.set(winner,(wins.get(winner) ?? 0)+1);
        lastGameId = game.gamePk;
        if (group.round === "rey") {
          finalGames.push({
            id:game.gamePk,
            date:String(game.officialDate ?? String(game.gameDate ?? "").slice(0,10)),
            awayCode: metadata.get(away)!.code,
            homeCode: metadata.get(home)!.code,
            awayId:away, homeId:home, awayRuns:ar, homeRuns:hr,
          });
        }
      }
    }
    const sides = [group.awayId,group.homeId] as const;
    const teams = sides.map(id => {
      const info = metadata.get(id)!;
      return {id,code:info.code,name:info.name,wins:wins.get(id) ?? 0};
    }) as [LmbPlayoffTeam,LmbPlayoffTeam];
    const winningTeam = teams.find(team => team.wins >= 4);
    all.push({
      round:group.round,zone:group.zone,teams,
      winnerCode:winningTeam?.code ?? "",
      bestLoserCode:null,
      lastGameId,
      gameIds:match.map(x=>x.game.gamePk),
      ...(group.round==="rey"?{games:finalGames}:{}),
      timeline,
    });
  }

  // Mejor perdedor real = perdedor de Primera ronda que figura en el
  // calendario oficial de Series de Zona. Nunca inferir por porcentaje/rumor.
  const advancedIds = new Set(
    all.filter(s=>s.round==="zone").flatMap(s=>s.teams.map(t=>t.id))
  );
  for (const first of all.filter(s=>s.round==="first" && s.winnerCode)) {
    const loser = first.teams.find(team => team.code !== first.winnerCode);
    if (loser?.id && advancedIds.has(loser.id)) first.bestLoserCode = loser.code;
  }
  const rank: Record<LmbPlayoffRound,number> = {first:0,zone:1,championship:2,rey:3};
  all.sort((a,b)=>rank[a.round]-rank[b.round] ||
    (a.zone==="Norte"?0:a.zone==="Sur"?1:2) -
    (b.zone==="Norte"?0:b.zone==="Sur"?1:2) ||
    (a.timeline?.[0]?.date ?? "").localeCompare(b.timeline?.[0]?.date ?? "") ||
    a.teams[0].code.localeCompare(b.teams[0].code));
  return {season,series:all};
}

export async function getLmbPostseasonDynamic(
  season: number
): Promise<LmbPostseason | null> {
  if (!Number.isInteger(season) || season < 2027 || season > 2100) return null;
  const from = season + "-07-15";
  const to = season + "-11-15";
  const scheduleUrl = "https://statsapi.mlb.com/api/v1/schedule" +
    "?sportId=23&leagueId=125&season=" + season +
    "&startDate=" + from + "&endDate=" + to;
  const rosterUrl = "https://statsapi.mlb.com/api/v1/teams?leagueIds=125&season=" + season;
  try {
    const [games,teams] = await Promise.all([
      fetch(scheduleUrl,{next:{revalidate:60},signal:AbortSignal.timeout(9000)}),
      fetch(rosterUrl,{next:{revalidate:21600},signal:AbortSignal.timeout(9000)}),
    ]);
    if (!games.ok || !teams.ok) return null;
    return buildLmbPostseasonDynamic(season,await games.json(),await teams.json());
  } catch {
    return null;
  }
}
