import { verifiedPersonnelEventsForClub, type VerifiedStaffKind } from "./verifiedPersonnelEvents.ts";

/** Adaptador de LMB: eventos editoriales fechados y verificados; no roster. */
export type LmbPersonnelAppointment = {
  clubSlug: string;
  date: string;
  person: string;
  role: string;
  kind: VerifiedStaffKind;
  effectiveSeason: string;
  url: string;
  description: string;
};

export function officialLmbPersonnelAppointments(profileUrl: string): LmbPersonnelAppointment[] {
  const match = /^https:\/\/lmb\.com\.mx\/equipos\/([a-z0-9-]+)$/.exec(profileUrl);
  if (!match) return [];
  return verifiedPersonnelEventsForClub("LMB", match[1]);
}
