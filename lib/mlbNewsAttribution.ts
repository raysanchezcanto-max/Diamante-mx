/**
 * Etiqueta editorial, no verificación de contratación.
 * MLB.com publica notas propias, incluidas negociaciones atribuidas a fuentes.
 * Solamente clasificamos los calificadores explícitos del titular original.
 */
export function isReportedMlbHeadline(title: string): boolean {
  return /\((?:sources?|reports?)\)\s*$/i.test(title.trim());
}
