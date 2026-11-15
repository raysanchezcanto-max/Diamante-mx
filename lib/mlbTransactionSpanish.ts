/**
 * Traducción conservadora de las transacciones de MLB StatsAPI.
 * Nunca se publica la descripción original en inglés como alternativa:
 * cuando el texto no permite identificar el movimiento con seguridad, se
 * muestra un aviso general en español y se conserva el enlace a MLB.
 */

export type SpanishMlbTransaction = { label: string; description: string };

const POSITIONS: Readonly<Record<string, string>> = {
  RHP: "lanzador derecho", LHP: "lanzador zurdo", P: "lanzador",
  C: "receptor", "1B": "primera base", "2B": "segunda base",
  "3B": "tercera base", SS: "campocorto", LF: "jardinero izquierdo",
  CF: "jardinero central", RF: "jardinero derecho", OF: "jardinero",
  IF: "jugador de cuadro", DH: "bateador designado",
};

const ACTIONS: Readonly<Record<string, string>> = {
  activated: "Activación",
  reinstated: "Reincorporación",
  recalled: "Llamado al equipo",
  optioned: "Asignación a ligas menores",
  placed: "Cambio de estatus",
  transferred: "Transferencia",
  designated: "Designación para asignación",
  released: "Baja de plantilla",
  signed: "Contratación",
  claimed: "Incorporación",
  acquired: "Adquisición",
  traded: "Intercambio",
  assigned: "Asignación",
  selected: "Selección de contrato",
  suspended: "Suspensión",
  outrighted: "Asignación a ligas menores",
  promoted: "Ascenso",
  returned: "Reincorporación",
  purchased: "Incorporación",
  invited: "Invitación",
};

function fallbackType(typeDesc: string): string {
  const type = typeDesc.toLowerCase();
  if (/status|estatus|roster move/.test(type)) return "Cambio de estatus";
  if (/injur|disabled|lesion/.test(type)) return "Lista de lesionados";
  if (/trade|intercambio/.test(type)) return "Intercambio";
  if (/sign|contract|contrato/.test(type)) return "Contratación";
  if (/release|baja/.test(type)) return "Baja de plantilla";
  if (/assign|option|minors|ligas menores/.test(type)) return "Asignación";
  if (/recall|activate|activaci/.test(type)) return "Activación";
  if (/claim|waiver/.test(type)) return "Incorporación";
  if (/suspend/.test(type)) return "Suspensión";
  return "Movimiento de plantilla";
}

function positionOf(description: string, player: string | null): string | null {
  if (!player) return null;
  // Los códigos de posición oficiales aparecen en mayúsculas. La búsqueda
  // insensible a mayúsculas interpretaba la preposición inglesa "of" como
  // OF (jardinero), incluso en transacciones de lanzadores sin posición.
  const escapedName = player.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const position = description.match(new RegExp(
    "\\b(RHP|LHP|1B|2B|3B|SS|LF|CF|RF|OF|IF|DH|C|P)\\s+" + escapedName + "\\b",
  ));
  return position ? POSITIONS[position[1].toUpperCase()] ?? null : null;
}

function injuryList(description: string): string {
  const days = description.match(/\b(7|10|15|60)-day injured list\b/i)?.[1];
  return days ? " de " + days + " días" : "";
}

function detailAfterActivation(description: string): string {
  if (/\bfrom the (?:\d+-day )?injured list\b/i.test(description)) {
    return " tras salir de la lista de lesionados" + injuryList(description);
  }
  if (/\bfrom the paternity list\b/i.test(description)) return " tras su permiso de paternidad";
  if (/\bfrom the bereavement list\b/i.test(description)) return " tras su permiso por duelo";
  if (/\bfrom the restricted list\b/i.test(description)) return " desde la lista de restringidos";
  return "";
}

function minorLeagueDestination(description: string): string {
  const match = description.match(/\bto\s+([A-Za-zÀ-ÿ0-9 .'’\-]+)\.?$/i);
  return match ? " (" + match[1].trim().replace(/\.$/, "") + ")" : "";
}

function minorLeagueOrigin(description: string): string {
  const match = description.match(/\bfrom\s+([A-Za-zÀ-ÿ0-9 .'’\-]+)\.?$/i);
  if (!match || /^(the |an? )?(injured|restricted|paternity|bereavement)\b/i.test(match[1])) return "";
  return " procedente de " + match[1].trim().replace(/\.$/, "");
}

export function translateMlbTransaction(
  description: string,
  typeDesc: string,
  player: string | null,
  clubName: string,
): SpanishMlbTransaction {
  const original = description.replace(/\s+/g, " ").trim();
  const action = original.match(/\b(activated|reinstated|recalled|optioned|placed|transferred|designated|released|signed|claimed|acquired|traded|assigned|selected|suspended|outrighted|promoted|returned|purchased|invited)\b/i)?.[1].toLowerCase();
  const label = action ? ACTIONS[action] : fallbackType(typeDesc);
  const position = positionOf(original, player);
  const person = player ? player + (position ? " (" + position + ")" : "") : null;
  const subject = person ?? "un integrante de su plantilla";

  // Algunas acciones de StatsAPI están en la descripción, pero no son verbos
  // incluidos en su clasificación general («Declared Free Agency», etc.).
  if (/\belected free agency\b/i.test(original)) {
    return { label: "Agencia libre", description: subject + " optó por declararse agente libre." };
  }
  if (/\bsent\b.*\boutright to\b/i.test(original)) {
    const destino = original.match(/\boutright to\s+(.+?)\.?$/i)?.[1]?.replace(/\.$/, "");
    return { label: "Asignación definitiva", description: clubName + " asignó a " + subject +
      " de forma definitiva" + (destino ? " a " + destino : " a ligas menores") + "." };
  }
  if (/\bnon-tendered\b/i.test(original)) {
    return { label: "Sin oferta de contrato", description: clubName + " no ofreció un nuevo contrato a " + subject + "." };
  }

  // Cada variante utiliza únicamente información comprobable de la transacción.
  switch (action) {
    case "activated": return { label, description: clubName + " activó a " + subject + detailAfterActivation(original) + "." };
    case "reinstated": return { label, description: clubName + " reincorporó a " + subject + detailAfterActivation(original) + "." };
    case "recalled": return { label, description: clubName + " llamó de ligas menores a " + subject + minorLeagueOrigin(original) + "." };
    case "optioned": return { label, description: clubName + " envió a " + subject + " a ligas menores" + minorLeagueDestination(original) + "." };
    case "placed": {
      if (/\binjured list\b/i.test(original)) {
        return { label: "Lista de lesionados", description: clubName + " colocó a " + subject + " en la lista de lesionados" + injuryList(original) + "." };
      }
      if (/\bpaternity list\b/i.test(original)) return { label: "Permiso de paternidad", description: clubName + " otorgó permiso de paternidad a " + subject + "." };
      if (/\bbereavement list\b/i.test(original)) return { label: "Permiso por duelo", description: clubName + " registró un permiso por duelo para " + subject + "." };
      return { label, description: clubName + " registró un cambio de estatus para " + subject + "." };
    }
    case "transferred": return { label, description: clubName + " registró una transferencia de " + subject + "." };
    case "designated": return { label, description: clubName + " designó a " + subject + " para asignación." };
    case "released": return { label, description: clubName + " dio de baja a " + subject + "." };
    case "signed": return { label, description: clubName + " contrató a " + subject + (/\bfree agent\b/i.test(original) ? " como agente libre" : "") + "." };
    case "claimed": return { label, description: clubName + " incorporó a " + subject + " desde la lista de jugadores disponibles." };
    case "acquired": return { label, description: clubName + " adquirió a " + subject + "." };
    case "traded": {
      const deal = original.match(/\btraded\b.*?\bto\s+(.+?)\s+for\s+cash(?: considerations)?\.?$/i);
      const inferred = !person ? original.match(/\btraded\s+(?:(RHP|LHP|C|1B|2B|3B|SS|LF|CF|RF|OF|IF|DH|P)\s+)?(.+?)\s+to\b/i) : null;
      const playerName = person ?? (inferred ? inferred[2] + (inferred[1] ? " (" + POSITIONS[inferred[1].toUpperCase()] + ")" : "") : subject);
      return { label, description: deal
        ? clubName + " intercambió a " + playerName + " con " + deal[1].trim() + " a cambio de dinero."
        : clubName + " registró un intercambio relacionado con " + playerName + "." };
    }
    case "assigned": return { label, description: clubName + " asignó a " + subject + "." };
    case "selected": return { label, description: clubName + " seleccionó el contrato de " + subject +
      " para su plantilla" + minorLeagueOrigin(original) + "." };
    case "suspended": return { label, description: clubName + " registró una suspensión de " + subject + "." };
    case "outrighted": return { label, description: clubName + " asignó a " + subject + " a ligas menores." };
    case "promoted": return { label, description: clubName + " ascendió a " + subject + "." };
    case "returned": return { label, description: clubName + " reincorporó a " + subject + "." };
    case "purchased": return { label, description: clubName + " incorporó a " + subject + " mediante la compra de su contrato." };
    case "invited": return { label, description: clubName + " invitó a " + subject + "." };
    default: return { label, description: person
      ? clubName + " registró un movimiento de plantilla relacionado con " + person + "."
      : clubName + " registró un movimiento oficial de plantilla. Consulta la fuente para más detalles." };
  }
}
