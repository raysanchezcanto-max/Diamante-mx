import { getLmpFinalDetails } from "./lmpFinalDetails";
import type { LmpPlayoffSeries } from "./lmpPostseason";
import type { LmbPlayoffSeries, LmbSerieDelReyGame } from "./lmbPostseason";
import type { LmbSerieDelReyStats } from "./lmbSerieDelReyStats";

export type LmbFinalDetails = {
  series: LmbPlayoffSeries;
  stats: LmbSerieDelReyStats | null;
};

/** Reutiliza el agregador por partido de LMP: misma StatsAPI, IDs reales
 * de las dos novenas LMB. No se recuperan resultados ni jugadores de 2026. */
export async function getLmbFinalDetails(
  series: LmbPlayoffSeries
): Promise<LmbFinalDetails | null> {
  if (series.round !== "rey" || !series.winnerCode || !series.games?.length) return null;
  const [one, two] = series.teams;
  if (!one.id || !two.id) return null;
  const winner = series.teams.find(team => team.code === series.winnerCode);
  if (!winner?.id) return null;

  const finalGames = series.games.filter(game =>
    game.awayId && game.homeId && game.awayRuns !== game.homeRuns
  );
  if (finalGames.length < 4) return null;

  const converted: LmpPlayoffSeries = {
    key: "lmb-" + series.teams.map(team => team.id).join("-"),
    phase: "W",
    teamA: {id:one.id,name:one.name,wins:one.wins},
    teamB: {id:two.id,name:two.name,wins:two.wins},
    winnerId:winner.id,
    games:finalGames.map(game => ({
      id:game.id,
      date:game.date + "T12:00:00-06:00",
      gameNumber:series.gameIds.indexOf(game.id)+1,
      startTimeTBD:false,
      status:"Final" as const,
      awayId:game.awayId!,
      homeId:game.homeId!,
      awayRuns:game.awayRuns,
      homeRuns:game.homeRuns,
    })),
  };
  const details = await getLmpFinalDetails(converted);
  if (!details) return null;

  const localGames = new Map<number,LmbSerieDelReyGame>(
    series.games.map(game => [game.id,game])
  );
  const games = details.games.map(game => ({
    ...localGames.get(game.id)!,
    ...(game.winner ? {winner:game.winner} : {}),
    ...(game.loser ? {loser:game.loser} : {}),
    ...(game.save ? {save:game.save} : {}),
  }));
  const codes = new Map(series.teams.map(team => [team.id,team.code]));
  const stats: LmbSerieDelReyStats | null = details.stats
    ? {
        hitting: details.stats.hitting.map(player => ({
          ...player, teamCode: codes.get(player.teamCode) ?? "",
        })),
        pitching: details.stats.pitching.map(player => ({
          ...player, teamCode: codes.get(player.teamCode) ?? "",
        })),
      }
    : null;
  return {series:{...series,games},stats};
}
