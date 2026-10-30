# Diamante MX — Estado del proyecto

**Última revisión:** 29 de octubre de 2026  
**Repositorio:** `raysanchezcanto-max/Diamante-mx` (`main`)  
**Prioridad actual:** LMP, después LMB.  
**Propósito de este archivo:** retomar el proyecto desde cualquier conversación sin repetir pasos ni asumir que una función está lista solamente porque compila.

> **Cómo usarlo en una nueva conversación:** “Amistad, continuemos Diamante MX. Lee `PROJECT_STATUS.md` y consulta el código actual de GitHub antes de indicarme el siguiente cambio. Vamos uno por uno, compilando después de cada paso”.

## 1. Acuerdos permanentes

- **MLB es la referencia de diseño y comportamiento** para LMB y LMP. Replicar tarjetas, alineación, color, espaciados y automatizaciones, pero adaptar cada liga a su API y formato de competición.
- **Trabajar un cambio pequeño por vez**: indicar archivo, búsqueda exacta, qué reemplazar, qué no tocar; esperar confirmación de compilación antes del siguiente cambio.
- Distinguir **código implementado**, **compilación correcta** y **comportamiento verificado visualmente/con datos reales**. No son lo mismo.
- Estados objetivo para partidos de temporada regular y postemporada: **PRÓXIMO** (fecha futura), **HOY** (programado para hoy), **POR COMENZAR** (calentamiento antes del primer lanzamiento, ámbar), **EN VIVO** (rojo pulsante), **FINAL** (resultado definitivo).
- Cuando comienza el partido, reemplazar los pitchers *probables* por datos de **bateador y pitcher actuales**, diamante/bases, B/S/O; evitar etiquetas duplicadas.
- El **lima** en marcadores identifica al equipo que lleva ventaja, no se usa sin motivo para números de cuenta regresiva (esos números son blancos).
- Indicador “Datos MLB/LMB/LMP”: **gris** si no hay actividad verificada y **lima** cuando la consulta de calendario responde con partidos del día. **Limitación actual:** `lib/sourceActivity.ts` confirma respuesta y juegos, pero **no** confirma que jugadas/marcadores hayan cambiado recientemente. No presentarlo como verificación de actualización de jugadas.
- Campeón durante la temporada baja; contador para la siguiente temporada solo cuando se conoce fecha oficial. Revisar cada implementación para asegurar que cumple exactamente la misma condición.

## 2. Arquitectura principal

| Archivo | Responsabilidad |
|---|---|
| `app/page.tsx` | Selección de liga, consultas, secciones de inicio, campeón y avisos de temporada, atributo `data-source-active`, refresco |
| `components/Games.tsx` | Tarjetas de partidos, estados, pitchers, campeón y presentación de la Serie Mundial MLB |
| `lib/mlb.ts` | Partidos y datos MLB; incluye `attachFirstPitchRecorded` para detectar primer lanzamiento |
| `lib/lmp.ts` | Calendario y estadísticas LMP; consulta `probablePitcher` |
| `lib/lmpLive.ts` | Reutiliza `getMlbPlayState` para juegos LMP |
| `lib/lmpChampion.ts` | Detección del campeón LMP a partir de resultados de la Serie Final |
| `lib/lmbLive.ts` | Fuente/calendario LMB |
| `lib/lmbChampion.ts` | Detección de campeón LMB |
| `lib/sourceActivity.ts` | Comprobación de respuesta con juegos en el calendario del día |
| `app/game/[league]/[id]/page.tsx` | Detalle de encuentro, integración de datos en vivo |
| `components/LiveGamePanel.tsx` | Bases, B/S/O, pitcher, bateador, jugadas |

## 3. MLB — estado de referencia

**Implementado en el código:**
- Tarjetas regulares con HOY, PRÓXIMO, POR COMENZAR (calentamiento con comprobación de primer lanzamiento), EN VIVO y FINAL.
- Pitchers probables en tarjetas regulares de hoy, con fotografía o placeholder cuando corresponde; etiqueta ABRIDOR durante calentamiento.
- Serie Mundial y tarjeta de campeón; historial “CAMINO A LA SERIE MUNDIAL”.
- Aviso de próxima temporada y cuenta regresiva condicionada a fecha disponible; ajustes visuales de anchos, separación y color.
- Marcador en vivo, inning/alta-baja, corredores, B/S/O, bateador/pitcher; integración de jugadas y traducción trabajada en etapas anteriores.

**Advertencia:** la revisión del código demuestra la implementación, pero no sustituye pruebas de cada transición con un juego real.

## 4. LMP — estado actual (prioridad)

**Confirmado en código actual y compilado:**
- `lib/lmp.ts` consulta juegos del día y próxima fecha; `hydrate=linescore,probablePitcher`.
- **Últimos cambios en `lib/lmp.ts`:** `awayProbablePitcher` y `homeProbablePitcher` se mapean en `todayGames` y `nextGames`. Además, ya existe `attachLmpFirstPitchRecorded(games)` y se llama desde `getLmpGames()` para los partidos de hoy (cambio compilado sin errores el 29 de octubre de 2026). **Se comprobó `isPitch:true` en el partido finalizado LMP `850512`, pero falta comprobar la transición completa con un partido en curso.**
- `components/Games.tsx` muestra HOY y PRÓXIMO para LMP, además de EN VIVO y FINAL compartidos. **Paso 18 confirmado sin errores:** tarjetas de LMP ahora admiten POR COMENZAR (naranja `#FF7A00`) solo si el estado detallado indica Warmup/Calentamiento y no hay primer lanzamiento confirmado. **Falta verificación visual durante un calentamiento real**. En los pasos 19–20 ya se agregó `firstPitchRecorded` a `lib/gameDetails.ts` y se usa en `app/game/[league]/[id]/page.tsx` para que el detalle muestre POR COMENZAR en naranja y no represente calentamiento como EN VIVO. Estos cambios compilaron correctamente; queda pendiente probarlos en un partido real.
- **Último cambio compilado y confirmado por la usuaria:** `showMlbRegularPitchers` ahora permite LMP (además de MLB regular), para partidos de **hoy** en `Preview` cuando hay al menos un pitcher probable.
- La tarjeta utiliza nombres, fotografías mediante ID/URL de imágenes MLB y placeholders; **todavía falta comprobar visualmente si la fuente tiene IDs/fotos válidos de LMP**.
- El detalle del partido LMP utiliza `getLmpPlayState` + `LiveGamePanel` para bases, B/S/O, bateador, pitcher, jugadas, etc.
- Existen `getLmpChampion`, temporada LMP y aviso de próxima temporada en la página.

**Pendientes concretos:**
1. **POR COMENZAR LMP (implementación compilada):** detector `firstPitchRecorded` en `getLmpGames()`; estado naranja `#FF7A00` en tarjetas (`components/Games.tsx`, Paso 18) y página de detalle (`lib/gameDetails.ts` + `app/game/[league]/[id]/page.tsx`, Pasos 19–20). Se exige estado detallado Warmup/Calentamiento y que no exista lanzamiento confirmado. **Pendiente solamente validar visualmente** la transición completa con juego real y comprobar qué ocurre cuando los datos llegan con retraso.
2. Verificar visualmente P. PROBABLE/ABRIDOR y fotografías reales en LMP. Actualmente el bloque de pitchers no se muestra si **ninguno** está anunciado; decidir si presentar “Por confirmar” aun sin datos.
3. Validar con partidos reales las transiciones HOY → POR COMENZAR → EN VIVO → FINAL, horarios y datos en vivo.
4. Ajustar presentación de postemporada LMP con estructura acordada **temporada regular → primera ronda → semifinales → Serie Final → campeón**. Tomar como referencia MLB, adaptar el formato y tipos de partido reales de LMP; verificar las series y sus resultados en la fuente.
5. Revisar aviso/contador de la siguiente temporada: actualmente el aviso LMP puede aparecer sin fecha y mostrar “CALENDARIO PENDIENTE”; contrastar con el criterio acordado de mostrar contador solo con fecha oficial.

**Validación de API con evidencia (29/oct/2026):** capturas del partido LMP `gamePk=850512` del calendario del **28/oct/2026** muestran **358 coincidencias de texto** `"isPitch":true` en `/game/850512/playByPlay` (no implica 358 lanzamientos distintos) y eventos de cambio de estado Pre-Game → Warmup. Por tanto, **al menos este partido finalizado sí tiene eventos `isPitch: true`**. Aún NO se ha verificado con capturas de la API durante un calentamiento en curso, ni la cobertura de todos los juegos LMP. También se observó en el calendario que algunos juegos pospuestos tienen `abstractGameState:"Final"` junto a `detailedState:"Postponed"`, por lo que hay que distinguir pospuestos de resultados finales.

**Pasos 21–24 confirmados:** Paso 21 agregó POSPUESTO a la tarjeta LMP; Paso 22 creó `lib/gameSpecialStatus.ts` con normalización por descripción de POSPUESTO/SUSPENDIDO/RETRASADO; Paso 23 definió variables CSS `--estado-pospuesto:#F472B6`, `--estado-suspendido:#A78BFA`, `--estado-retrasado:#FACC15`; Paso 24 integró el detector común en tarjetas `components/Games.tsx` para las tres ligas, con colores y etiquetas. Todos confirmados sin errores el 29/oct/2026. **Pendientes:** priorizar estado especial sobre POR COMENZAR (MLB Live puede interpretarse erróneamente como calentamiento), impedir estilos `live` en estados especiales, conectar página de detalle, verificar marcadores, orden de listas y clasificación de resultados; revisar códigos propios de LMB antes de inferir semántica de estados.

## 5. LMB — estado y siguientes fases

**En código:** consulta de calendario LMB mediante `lib/lmbLive.ts`, partidos/estadísticas, `lib/lmbChampion.ts`, aviso de próxima temporada, estilos e indicador de fuente compartido.

**Pendiente:** auditar y replicar cuidadosamente en tarjetas LMB los estados PRÓXIMO/HOY/POR COMENZAR, pitchers, indicadores y tratamiento completo de postemporada (serie final propia), manteniendo su fuente y nomenclatura. No asumir que todo lo de MLB ya funciona en LMB.

## 6. Fuente “Datos” de las tres ligas

- `sourceActivity` se calcula en `app/page.tsx` según la liga seleccionada y alimenta `data-source-active` en `#juegos`.
- `.liveDot .sourceActivityDot` tiene estilo gris por defecto; el CSS lo vuelve lima si `data-source-active="true"`.
- No hay que modificar manualmente el color por mes, ni confundir calendario con frescura de jugadas.
- Si se decide exigir frescura real de *marcador/jugadas*, ampliar la comprobación con un indicador verificable de actualización; **no está implementado todavía**.

## 7. Método de trabajo en futuras sesiones

1. Leer este documento **y** revisar el estado más reciente del código GitHub (`main`); este archivo puede quedar desactualizado.
2. Revisar último cambio realizado y si se confirmó compilación.
3. Elegir **un** ajuste, explicar su alcance (tarjetas normales, detalle, o tarjeta especial), mostrar reemplazo exacto y pedir compilación/verificación.
4. Tras cada conjunto de funciones cerradas, actualizar `PROJECT_STATUS.md` con **qué se comprobó** y **qué sigue**, sin prometer automatizaciones que aún no se hayan validado.

**Última confirmación de compilación:** Paso 33, página de detalle `app/game/[league]/[id]/page.tsx` importa `getGameSpecialStatus`, excluye los estados especiales de `isFinal` y `isLive`, compilado sin errores el 29/oct/2026. Pasos 31–32 mantienen prioridad de los estados especiales sobre calentamiento y quitan el estilo EN VIVO en tarjetas. **Próximo paso:** insertar etiqueta traducida/colorida en página de detalle antes de POR COMENZAR, sin alterar MLB/LMB/LMP restantes. Más adelante verificar marcadores, clasificación y fuentes particulares LMB.

**Última confirmación de compilación y verificación visual:** Paso 29: `components/Games.tsx` muestra `DESPUÉS DEL PRIMERO` desde `gameTime()` para segundos juegos de LMP con `doubleHeader=Y`, `gameNumber=2` y `status=Preview`; confirmado sin errores el 29 de octubre de 2026. **Captura visual posterior confirma siete tarjetas, JUEGO 1 y JUEGO 2 en Mayos–Algodoneros y Águilas–Jaguares, dos encuentros EN VIVO y HOY · DESPUÉS DEL PRIMERO en segundos juegos.** Pasos 26–28 mapearon los datos de doble cartelera para el calendario del día. Pendiente extender el mapeo a fechas futuras desde `lib/nextGames.ts` y revisar hora en la página de detalle. Los estados especiales POSPUESTO/SUSPENDIDO/RETRASADO están implementados **como etiquetas y colores de tarjetas** en MLB/LMB/LMP, pero no aún en detalle, clasificación y resultados; verificar códigos LMB. **Pasos 31 y 32 confirmados sin errores:** `components/Games.tsx` ahora condiciona calentamiento visual con `isMlbWarmup && !specialStatus`, y `className="gameStatus live"` exige `!specialStatus`, eliminando estilo rojo y pulso para estados especiales. **Siguiente:** integrar detector compartido en página de detalle; asegurar que `isFinal`/`isLive` no incluyan partidas pospuestas, suspendidas o retrasadas y después traducir/colorear la etiqueta de detalle.

**Hallazgo y corrección en vivo de LMP (29/oct/2026):** en pantalla de inicio, `components/Games.tsx` eliminaba juegos de doble cartelera al deduplicar con `fecha-equipos`; se reemplazó por `game.id` cuando es distinto de cero. Captura de la usuaria confirma **siete tarjetas** y **dos EN VIVO** (Mayos–Algodoneros y Águilas–Jaguares), frente a cinco tarjetas HOY antes del cambio. **No eran duplicados**: esos dos cruces disputan dos encuentros distintos en el mismo día por la reprogramación de la lluvia del 28/oct. Aún existe un problema de UX/dato horario: los **segundos juegos** aparecen HOY **6:05 p.m.**, misma hora que el primero; fuentes de calendario externo los listan con horario posterior/tentativo. **Progreso:** `gameNumber` y `doubleHeader` ya se mapean para juegos de hoy y las tarjetas tienen etiquetas JUEGO 1 / JUEGO 2 (Pasos 26–28), aunque falta prueba visual de ambas etiquetas. **Próximo paso:** no anunciar una hora engañosa para el segundo juego consecutivo (`doubleHeader=Y`, `gameNumber=2`), sin cambiar las horas específicas que la fuente publique para jornadas de boleto separado (`doubleHeader=S`). Hacer un cambio pequeño por vez. No alterar husos horarios por este hallazgo; EN VIVO ya funcionó al conservar IDs.

**Revisión técnica independiente recibida:** Claude identificó riesgos adicionales (pospuestos/suspendidos, diferencia entre estado en tarjetas y detalle, broadcasts `channels`/`tvChannels`, llamadas numerosas a LMB, doble jornada, fotos de pitchers). Se deben verificar y priorizar después de cerrar la detección LMP; no se consideran defectos confirmados hasta probarlos.
