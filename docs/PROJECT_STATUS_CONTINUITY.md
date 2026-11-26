# Diamante MX — Continuidad desde el 25–26 de noviembre de 2026

Complemento de [PROJECT_STATUS.md](../PROJECT_STATUS.md). No sustituye ni elimina el historial: el conector devuelve el archivo principal truncado y no es seguro reescribirlo.

## Cambios confirmados
- Tomateros: tres incorporaciones y reasignación de Robinson Cancel; commit 243eac6, Vercel READY. Validación visual de fichas pendiente.
- Pizarra: a3076d3 conserva estructura con datos pendientes sin simular bases u outs. 62016ee (READY en producción) elimina DOBLE, compacta FINAL y alinea tarjetas EN VIVO. La usuaria aprobó continuar; comprobación exhaustiva con partidos reales y sincronización de feeds pendientes.
- 04cbeff (READY en producción): conserva boletines históricos LMB fuera de la ventana reciente; incluye 16/oct/2026. Pendiente validar contenido efectivo de Toros, Sultanes y Bravos.

## Nuevo cambio de esta fase
Conexión editorial exacta entre noticia de Gustavo Núñez y boletín del 16/oct/2026, sin crear otro movimiento. Exige fecha, identidad, URL, dirección y contraparte del registro ya presente. No confirma roster activo. Noticias destacadas, secundarias y titulares laterales en ficha general LMB; enlace inverso en Movimientos. Pruebas agregadas; build y comprobación pública pendientes al registrar esta nota.

Siguiente: comprobar Vercel y las fichas; si el boletín no aparece, diagnosticar extracción y fallback. No modificar bandeja editorial ni workflows. Después continuar auditoría de clubes.
