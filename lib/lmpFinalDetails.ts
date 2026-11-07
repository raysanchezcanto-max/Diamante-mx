import type { LmpPlayoffSeries } from "./lmpPostseason";

/**
 * Datos de Serie Final LMP por temporada: nunca usar boxscores de otra
 * temporada ni almacenar participantes de forma fija.
 * Se consulta únicamente después de que la Serie Final tiene campeón.
 */
export type LmpFinalDecision = { id: number; name: string };
export type LmpFinalGame = {
  id: number;
  date: string;
  awayId: number;
  homeId: number;
  awayRuns: number;
  homeRuns: number;
  winner?: LmpFinalDecision;
  loser?: LmpFinalDecision;
  save?: LmpFinalDecision;
};
export type LmpFinalHitter = {
  id: number; name: string; team: string; teamCode: number;
  atBats: number; hits: number; homeRuns: number; rbi: number; runs: number;
  avg: string;
};
export type LmpFinalPitcher = {
  id: number; name: string; team: string; teamCode: number;
  strikeOuts: number; wins: number; losses: number; saves: number;
  inningsPitched: string; era: string;
};
export type LmpFinalDetails = {
  teams: [{ id: number; name: string }, { id: number; name: string }];
  games: LmpFinalGame[];
  stats: { hitting: LmpFinalHitter[]; pitching: LmpFinalPitcher[] } | null;
};

function nonnegative(value: unknown): number {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? Math.floor(number) : 0;
}
function decision(raw: any): LmpFinalDecision | undefined {
  if (Number.isInteger(raw?.id) && raw.id > 0 && typeof raw?.fullName === "string" && raw.fullName) {
    return { id: raw.id, name: raw.fullName };
  }
  return undefined;
}

export function buildLmpFinalDetails(
  series: LmpPlayoffSeries,
  feeds: Map<number, any>
): LmpFinalDetails | null {
  if (series.phase !== "W" || series.winnerId === null) return null;
  const finished = series.games.filter(game =>
    game.status === "Final" && game.awayRuns !== null && game.homeRuns !== null
  );
  if (finished.length < 4) return null;

  const batting = new Map<string, LmpFinalHitter>();
  const pitching = new Map<string, LmpFinalPitcher & { outs: number; earnedRuns: number }>();
  let allBoxscores = finished.every(game => {
    const feed = feeds.get(game.id);
    return feed?.gamePk === game.id &&
      Boolean(feed?.liveData?.boxscore?.teams?.away?.players) &&
      Boolean(feed?.liveData?.boxscore?.teams?.home?.players);
  });

  const teams: LmpFinalDetails["teams"] = [
    { id: series.teamA.id, name: series.teamA.name },
    { id: series.teamB.id, name: series.teamB.name },
  ];

  const games = finished.map(game => {
    const feed = feeds.get(game.id);
    const decisions = feed?.gamePk === game.id ? feed?.liveData?.decisions : null;
    const result: LmpFinalGame = {
      id: game.id,
      date: game.date,
      awayId: game.awayId,
      homeId: game.homeId,
      awayRuns: game.awayRuns!,
      homeRuns: game.homeRuns!,
      ...(decision(decisions?.winner) ? { winner: decision(decisions.winner) } : {}),
      ...(decision(decisions?.loser) ? { loser: decision(decisions.loser) } : {}),
      ...(decision(decisions?.save) ? { save: decision(decisions.save) } : {}),
    };

    if (!allBoxscores) return result;
    for (const side of ["away", "home"] as const) {
      const id = side === "away" ? game.awayId : game.homeId;
      const name = teams.find(team => team.id === id)?.name;
      const box = feed.liveData.boxscore.teams[side];
      if (!name || !box) { allBoxscores = false; break; }

      for (const personId of box.batters ?? []) {
        const person = box.players?.["ID" + personId];
        const stat = person?.stats?.batting;
        if (!stat || !person?.person?.fullName) continue;
        const atBats = nonnegative(stat.atBats);
        const hits = nonnegative(stat.hits);
        const homeRuns = nonnegative(stat.homeRuns);
        const rbi = nonnegative(stat.rbi);
        const runs = nonnegative(stat.runs);
        if (!(atBats || hits || homeRuns || rbi || runs || nonnegative(stat.baseOnBalls))) continue;
        const key = String(id) + "-" + personId;
        let player = batting.get(key);
        if (!player) {
          player = {
            id: personId, name: person.person.fullName, team: name, teamCode: id,
            atBats: 0, hits: 0, homeRuns: 0, rbi: 0, runs: 0, avg: ".---",
          };
          batting.set(key, player);
        }
        player.atBats += atBats; player.hits += hits; player.homeRuns += homeRuns;
        player.rbi += rbi; player.runs += runs;
      }

      for (const personId of box.pitchers ?? []) {
        const person = box.players?.["ID" + personId];
        const stat = person?.stats?.pitching;
        if (!stat || !person?.person?.fullName) continue;
        const key = String(id) + "-" + personId;
        let player = pitching.get(key);
        if (!player) {
          player = {
            id: personId, name: person.person.fullName, team: name, teamCode: id,
            strikeOuts: 0, wins: 0, losses: 0, saves: 0,
            outs: 0, earnedRuns: 0, inningsPitched: "0.0", era: "-.--",
          };
          pitching.set(key, player);
        }
        player.strikeOuts += nonnegative(stat.strikeOuts);
        player.wins += nonnegative(stat.wins);
        player.losses += nonnegative(stat.losses);
        player.saves += nonnegative(stat.saves);
        player.outs += nonnegative(stat.outs);
        player.earnedRuns += nonnegative(stat.earnedRuns);
      }
    }
    return result;
  });

  if (allBoxscores) {
    for (const player of batting.values()) {
      player.avg = player.atBats
        ? "." + String(Math.round(player.hits / player.atBats * 1000)).padStart(3, "0")
        : ".---";
    }
    for (const player of pitching.values()) {
      player.inningsPitched = String(Math.floor(player.outs / 3)) + "." + (player.outs % 3);
      player.era = player.outs
        ? (player.earnedRuns * 27 / player.outs).toFixed(2) : "-.--";
    }
  }

  return {
    teams,
    games,
    stats: allBoxscores ? {
      hitting: [...batting.values()].sort((a,b) =>
        b.hits - a.hits || b.homeRuns - a.homeRuns || a.name.localeCompare(b.name)
      ),
      pitching: [...pitching.values()].map(({ outs, earnedRuns, ...player }) => player)
        .sort((a,b) => b.strikeOuts - a.strikeOuts || b.wins - a.wins || a.name.localeCompare(b.name)),
    } : null,
  };
}

export async function getLmpFinalDetails(
  series: LmpPlayoffSeries
): Promise<LmpFinalDetails | null> {
  if (series.phase !== "W" || series.winnerId === null) return null;
  const finalGames = series.games.filter(game => game.status === "Final");
  if (finalGames.length < 4) return null;

  const results = await Promise.all(finalGames.map(async game => {
    try {
      const res = await fetch(
        "https://statsapi.mlb.com/api/v1.1/game/" + game.id + "/feed/live",
        { next: { revalidate: 3600 }, signal: AbortSignal.timeout(8500) }
      );
      if (!res.ok) return null;
      const payload = await res.json();
      return payload?.gamePk === game.id ? payload : null;
    } catch {
      return null;
    }
  }));
  const feeds = new Map<number, any>();
  finalGames.forEach((game, index) => {
    if (results[index]) feeds.set(game.id, results[index]);
  });
  return buildLmpFinalDetails(series, feeds);
}
