# Diamante MX — Continuidad desde el 25–26 de noviembre de 2026

Complemento de [PROJECT_STATUS.md](../PROJECT_STATUS.md). No sustituye ni elimina el historial: el conector devuelve el archivo principal truncado y no es seguro reescribirlo.

## Cambios confirmados
- Tomateros: tres incorporaciones y reasignación de Robinson Cancel; commit 243eac6, Vercel READY. Validación visual de fichas pendiente.
- Pizarra: a3076d3 conserva estructura con datos pendientes sin simular bases u outs. 62016ee (READY en producción) elimina DOBLE, compacta FINAL y alinea tarjetas EN VIVO. La usuaria aprobó continuar; comprobación exhaustiva con partidos reales y sincronización de feeds pendientes.
- 04cbeff (READY en producción): conserva boletines históricos LMB fuera de la ventana reciente; incluye 16/oct/2026. Pendiente validar contenido efectivo de Toros, Sultanes y Bravos.

## Nuevo cambio de esta fase
Conexión editorial exacta entre noticia de Gustavo Núñez y boletín del 16/oct/2026, sin crear otro movimiento. Exige fecha, identidad, URL, dirección y contraparte del registro ya presente. No confirma roster activo. Noticias destacadas, secundarias y titulares laterales en ficha general LMB; enlace inverso en Movimientos. Pruebas agregadas; build y comprobación pública pendientes al registrar esta nota.

Siguiente: comprobar Vercel y las fichas; si el boletín no aparece, diagnosticar extracción y fallback. No modificar bandeja editorial ni workflows. Después continuar auditoría de clubes.

## Confirmación de despliegue — 26/nov/2026
- Commit funcional `897c5f82ba9e09871b46b664b0ab370b5e84d13c`: Vercel `dpl_2xR2h1ELPG87CU9uDhjEPjK5uQ7p` READY, production, dominio asignado sin error. Confirmado por consulta directa a Vercel. Queda pendiente verificar el movimiento real y el distintivo editorial en las fichas públicas; READY no equivale a QA visual ni confirma la disponibilidad del boletín.

## QA de producción — 26/nov/2026
- Consulta directa mediante Vercel de `/equipos/lmb/toros?vista=movimientos`, `/equipos/lmb/sultanes?vista=movimientos`, `/equipos/lmb/bravos?vista=movimientos` y `/equipos/lmb/toros`: HTTP 200 en las cuatro rutas.
- Gustavo Adolfo Núñez Castillo: registro visible en Toros como derechos recibidos de Sultanes, y en Sultanes como derechos cedidos a Toros; ambos registros contienen enlace Noticia relacionada hacia el comunicado LMB. Resumen de Toros contiene el movimiento de derechos recibidos.
- Aderlín Rodríguez Sánchez: visible en Sultanes como derechos recibidos de Bravos y en Bravos como derechos cedidos a Sultanes. No se añade una relación editorial de Gustavo al movimiento de Aderlín.
- No se observó el distintivo de cesión en las noticias visibles del Resumen de Toros en esta consulta; el enlace inverso desde Movimientos sí está confirmado. Inspección HTML, no prueba visual manual móvil/escritorio. Pendiente comprobar Tomateros y avanzar con los demás clubes; preservar workflows y bandeja editorial.
