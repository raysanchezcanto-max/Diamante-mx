import { getMlbPlayState } from "@/lib/mlbLive";

// LMP: normalizar las transiciones entre medias entradas sin alterar MLB.
export function getLmpPlayState(gameId: number) {
  return getMlbPlayState(gameId, "LMP");
}
