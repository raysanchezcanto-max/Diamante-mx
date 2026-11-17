/** El tipo de operación vive en la etiqueta de la tarjeta, como en MLB. */
export function lmbMovementPlayerTitle(title:string):string {
  const cleaned=title.trim();
  // Los titulares creados a partir de boletines suelen ser «Operación: Jugador».
  const colon=cleaned.indexOf(": ");
  if(colon>=0){
    const after=cleaned.slice(colon+2).trim();
    if(after)return after;
  }
  // Archivo editorial histórico: «Alta de Jesús…», «Bajas de Gregorius y Martínez».
  const archive=cleaned.match(/^(?:altas?|bajas?|activaci[oó]n|desactivaci[oó]n) de (.+)$/i);
  if(archive)return archive[1];
  // Los comunicados antiguos pueden usar una oración entera como titular.
  // Solo acortarla si el nombre está identificado explícitamente.
  const staff=cleaned.match(/\b(?:al entrenador|a la entrenadora)\s+([A-ZÁÉÍÓÚÑ][\p{L}.'-]+(?:\s+[A-ZÁÉÍÓÚÑ][\p{L}.'-]+){1,3})\.?$/u);
  if(staff)return staff[1];
  const rights=cleaned.match(/\b(?:derechos de|contrata a|activa a|desactiva a)\s+([A-ZÁÉÍÓÚÑ][\p{L}.'-]+(?:\s+[A-ZÁÉÍÓÚÑ][\p{L}.'-]+){1,3})(?=\s*\(|\s+(?:al club|a los|de su)|[.;]|$)/u);
  if(rights)return rights[1];
  // No adivinar nombres cuando un boletín resume colectivos u otras acciones.
  return cleaned;
}
