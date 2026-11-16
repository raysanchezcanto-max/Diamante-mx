/** Presentación editorial de un registro oficial; nunca altera los hechos de la fuente. */
export function describeLmpMovement(description: string): {title:string;type:string} {
  const active = /\bactiv(?:a|an|ado|ados|aci[oó]n|aciones|ando|ar|aci[oó]n de|aci[oó]n a)\b/i.test(description)
    || /\b(?:da(?:n)? de alta|alta de|altas de|incorpora(?:n|ci[oó]n)?)\b/i.test(description);
  const inactive = /\b(?:desactiv(?:a|an|ado|ados|ando|ar|aci[oó]n)|inactiv(?:a|an|ando|aci[oó]n)|bajas? de|da(?:n)? de baja)\b/i.test(description);
  const transfer = /\b(?:traspas(?:a|o|ado)|ced(?:e[n]?|i[oó]|idos?)|derechos|intercambio|pr[eé]stamo)\b/i.test(description);
  const signed = /\b(?:contrat(?:a|aci[oó]n)|firma(?:n|do)?|agente libre)\b/i.test(description);

  let type = "Actualización de plantilla";
  if(active && inactive) type="Altas y bajas";
  else if(active) type="Activación";
  else if(inactive) type="Baja de plantilla";
  else if(transfer) type="Traspaso o derechos";
  else if(signed) type="Contratación";

  // Primer nombre o grupo mencionado, sin recortar la descripción oficial.
  const actor = description.match(/\b(?:activaci[oó]n de|activ(?:a|an|ando)\s+(?:a|al|en su lugar a)|desactiv(?:a|an|ando)\s+(?:a|al)|inactiv(?:a|an|ando)\s+(?:a|al)|alta de|baja de)\s+([^.;]+)/i)?.[1]
    ?.split(/,\s*desactivando|,\s*inactivando|\s+desactivando|\s+inactivando|\s+para\s+/i)[0]
    ?.trim();
  const actorNames=actor?.replace(/^(?:los|las|el|la)\s+(?:lanzadores?|jugadores? de cuadro|receptores?|jardineros?)\s+/i,"").trim();
  const shortNames=actorNames && actorNames.length>75
    ? actorNames.split(/,\s*/)[0]?.trim() + " y otros"
    : actorNames;
  const names = shortNames && !/\b(?:plantilla|jugadores|lanzadores|receptores)\b/i.test(shortNames) ? shortNames : null;
  // La categoría ya aparece en la píldora superior; el título no debe repetirla.
  // Si la fuente no permite extraer nombres sin ambigüedad, se omite el título.
  const title = names ?? "";
  return {title,type};
}
