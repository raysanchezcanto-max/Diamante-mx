/** Terminología de fuentes oficiales en inglés que aparece dentro de textos en español. */
const ROLES: Readonly<Record<string, string>> = {
  pitcher: "Lanzador", catcher: "Receptor", infield: "Jugador de cuadro",
  infielder: "Jugador de cuadro", outfield: "Jardinero", outfielder: "Jardinero",
  "first baseman": "Primera base", "second baseman": "Segunda base",
  "third baseman": "Tercera base", shortstop: "Campocorto",
  "designated hitter": "Bateador designado", "two-way player": "Jugador de dos vías",
};

export function spanishBaseballRole(role: string): string {
  return ROLES[role.trim().toLowerCase()] ?? "Jugador";
}

/** Conserva nombres propios y hechos del comunicado oficial de la LMP. */
export function localizeLmpMovement(text: string): string {
  return text
    .replace(/\bal roster\b/gi, "a la plantilla")
    .replace(/\bdel roster\b/gi, "de la plantilla")
    .replace(/\ben el roster\b/gi, "en la plantilla")
    .replace(/\bun roster\b/gi, "una plantilla")
    .replace(/\brosters\b/gi, "plantillas")
    .replace(/\broster\b/gi, "plantilla")
    .replace(/\binfielders?\b/gi, "jugador de cuadro")
    .replace(/\binfields?\b/gi, "jugador de cuadro")
    .replace(/\boutfielders?\b/gi, "jardinero")
    .replace(/\boutfields?\b/gi, "jardinero")
    .replace(/\bcoaches\b/gi, "entrenadores")
    .replace(/\bcoach\b/gi, "entrenador")
    .replace(/\bpitchers?\b/gi, "lanzador")
    .replace(/\bcatchers?\b/gi, "receptor")
    .replace(/\binactivanco\b/gi, "inactivando");
}
