# Diamante MX — Estado del proyecto

**Última revisión:** 2 de noviembre de 2026  
**Repositorio:** `raysanchezcanto-max/Diamante-mx` (`main`)  
**Prioridad actual:** registrar cambios verificados, comprobar experiencias móviles y preparar PWA/Android; continuar validaciones pendientes LMP/LMB.  
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

**Última verificación (30/oct/2026 aprox. 07:02 CDT):** la usuaria compartió captura de Vercel Deployments: commits `9668cbf` y `cc4d756` fueron desplegados después del manual `391eb03`; ambos muestran **Ready**, y `cc4d756` tiene distintivo azul **Production**. Por lo tanto, GitHub→Vercel vuelve a publicar automáticamente en `main`; la causa de la interrupción temporal no quedó determinada. Revisión conjunta: Settings → Git confirma repo conectado, permisos instalación Vercel en GitHub a todos los repos y con lectura/escritura, Ignored Build Step Automatic, Environments → Production: Branch Tracking `main`, autoasignación del dominio habilitada; no se requirió cambiar ninguna opción. **Verificación visual anterior:** LMP Resultados recientes muestra ganador lima, perdedor gris y últimos 10 finales en captura tras deploy `391eb03`; funcional. **Paso 73 (pendiente):** en `components/Games.tsx` `gameTime()` aún tiene `(league === "LMP" || league === "MLB") && game.doubleHeader === "Y" && game.gameNumber === 2 && game.status === "Preview"`; agregar `league === "LMB"` solo a esa condición, para segunda jornada LMB confirmada tipo Y, NO tipo S o INFERRED. Pedir compilación y verificar que Vercel genera un deploy nuevo automáticamente. **Otras validaciones:** partidas MLB/LMB cruzando medianoche y dobles carteleras oficiales reales LMB; no confundir build correcta con prueba visual. Documentar solo cambios confirmados.

**Registro anterior:** Paso 39 compilado sin errores el 29/oct/2026: la rama LMB en `lib/recentGames.ts` ahora usa `return sortedRecentGames.slice(0, 10);`; MLB/LMP ya usaban `finishedDates.flatMap` + ordenamiento por `gameDate` + máximo 10 (Paso 38). **Las tres ligas** muestran hasta 10 resultados FINAL de los últimos 14 días consultados, excluyendo estados especiales. **LMB en temporada baja puede mostrar 0 resultados** porque no hay finales en esos 14 días; esto está dentro de la lógica implementada y no se considera error. **Siguiente paso propuesto:** agregar `!specialStatus` a las dos condiciones de colores de ganador/perdedor en tarjetas `components/Games.tsx` (solo MLB regular), para que un estado especial etiquetado como `Final` por la API no tiña los guiones de resultado con lima. Luego revisar marcador en página de detalle de POSPUESTO y clasificación visual de listas. **Evidencia visual:** etiqueta RETRASADO amarillo de Tomateros–Yaquis en LMP, junto a EN VIVO y doble cartelera.

**Compilaciones anteriores:** Paso 36 confirmado sin errores el 29/oct/2026: la rama LMB de `lib/recentGames.ts` excluye `getGameSpecialStatus(g.detailedStatus)` de Resultados recientes cuando `g.status===F` o `detailedStatus` contiene final. Paso 35 aplicó protección equivalente a MLB y LMP. Paso 34 corrigió etiquetas/colores de detalles. **Siguiente:** revisar marcadores de POSPUESTO para que no muestren resultado aun si StatsAPI indica `Final` y datos de carreras, preservando los marcadores de SUSPENDIDO; no mostrar colores de victoria cuando `specialStatus` existe. Posteriormente validar clasificación de listas y datos LMB reales.

**Seguimiento tras Paso 36 (29/oct/2026):** código de `components/Games.tsx` ya contiene ajuste del Paso 37: para tarjetas de MLB/LMB/LMP oculta carreras con `–` cuando `specialStatus === "POSPUESTO"`, sin ocultar intencionalmente marcador suspendido; la usuaria confirmó compilación sin errores del Paso 37. Captura de LMP muestra POR COMENZAR en Cañeros–Charros, mientras otros partidos están EN VIVO (verificación visual). La usuaria observó desaparición de partidos en Resultados recientes. Confirmado que `lib/recentGames.ts` excluye pospuestos: el 28/oct/2026 hubo 3 FINAL y 2 POSPUESTO, así que la disminución de 5 a 3 en ese día es correcta. **Limitación preexistente independiente:** aunque consulta últimos 14 días, el código retorna **solo la fecha más reciente que tenga finales** (`finishedDates[0]` en MLB/LMP y `latestDate` en LMB), ocultando resultados genuinos de días anteriores. Decisión aprobada por la usuaria: mostrar **los últimos 10 partidos realmente FINAL**, ordenados del más nuevo al más antiguo, aunque sean de fechas distintas. **Paso 38 confirmado:** en rama MLB/LMP de `lib/recentGames.ts`, `flatMap` de las fechas, ordenar por `gameDate` descendente y `slice(0,10)`; mantiene la exclusión de estados especiales. **Paso 39 confirmado:** la rama LMB ya usa `sortedRecentGames.slice(0,10)` y compiló sin errores. Trabajar un cambio a la vez.

**Última confirmación de compilación y verificación visual:** Paso 29: `components/Games.tsx` muestra `DESPUÉS DEL PRIMERO` desde `gameTime()` para segundos juegos de LMP con `doubleHeader=Y`, `gameNumber=2` y `status=Preview`; confirmado sin errores el 29 de octubre de 2026. **Captura visual posterior confirma siete tarjetas, JUEGO 1 y JUEGO 2 en Mayos–Algodoneros y Águilas–Jaguares, dos encuentros EN VIVO y HOY · DESPUÉS DEL PRIMERO en segundos juegos.** Pasos 26–28 mapearon los datos de doble cartelera para el calendario del día. Pendiente extender el mapeo a fechas futuras desde `lib/nextGames.ts` y revisar hora en la página de detalle. Los estados especiales POSPUESTO/SUSPENDIDO/RETRASADO están implementados **como etiquetas y colores de tarjetas** en MLB/LMB/LMP, pero no aún en detalle, clasificación y resultados; verificar códigos LMB. **Pasos 31 y 32 confirmados sin errores:** `components/Games.tsx` ahora condiciona calentamiento visual con `isMlbWarmup && !specialStatus`, y `className="gameStatus live"` exige `!specialStatus`, eliminando estilo rojo y pulso para estados especiales. **Siguiente:** integrar detector compartido en página de detalle; asegurar que `isFinal`/`isLive` no incluyan partidas pospuestas, suspendidas o retrasadas y después traducir/colorear la etiqueta de detalle.

**Hallazgo y corrección en vivo de LMP (29/oct/2026):** en pantalla de inicio, `components/Games.tsx` eliminaba juegos de doble cartelera al deduplicar con `fecha-equipos`; se reemplazó por `game.id` cuando es distinto de cero. Captura de la usuaria confirma **siete tarjetas** y **dos EN VIVO** (Mayos–Algodoneros y Águilas–Jaguares), frente a cinco tarjetas HOY antes del cambio. **No eran duplicados**: esos dos cruces disputan dos encuentros distintos en el mismo día por la reprogramación de la lluvia del 28/oct. Aún existe un problema de UX/dato horario: los **segundos juegos** aparecen HOY **6:05 p.m.**, misma hora que el primero; fuentes de calendario externo los listan con horario posterior/tentativo. **Progreso:** `gameNumber` y `doubleHeader` ya se mapean para juegos de hoy y las tarjetas tienen etiquetas JUEGO 1 / JUEGO 2 (Pasos 26–28), aunque falta prueba visual de ambas etiquetas. **Próximo paso:** no anunciar una hora engañosa para el segundo juego consecutivo (`doubleHeader=Y`, `gameNumber=2`), sin cambiar las horas específicas que la fuente publique para jornadas de boleto separado (`doubleHeader=S`). Hacer un cambio pequeño por vez. No alterar husos horarios por este hallazgo; EN VIVO ya funcionó al conservar IDs.

**Revisión técnica independiente recibida:** Claude identificó riesgos adicionales (pospuestos/suspendidos, diferencia entre estado en tarjetas y detalle, broadcasts `channels`/`tvChannels`, llamadas numerosas a LMB, doble jornada, fotos de pitchers). Se deben verificar y priorizar después de cerrar la detección LMP; no se consideran defectos confirmados hasta probarlos.


## 8. Actualización consolidada — 2 de noviembre de 2026 (vigente)

**Nota de vigencia:** los registros anteriores de este documento son históricos y pueden contener pasos indicados como pendientes que se completaron posteriormente. Para continuar, usar esta sección junto con una inspección del código actual de GitHub (`main`), y no asumir que un despliegue exitoso equivale a funcionamiento comprobado.

### 8.1. MLB — pantalla móvil y Serie Mundial

- **Código implementado y comprobado visualmente en móvil:** en `app/globals.css`, la tarjeta del campeón es adaptable a pantallas pequeñas (`.championCardBody`, `.championTeamName`, `.championResultPill` y `.championResultText`). La usuaria compartió captura en Brave donde el nombre de Milwaukee Brewers y el texto de resultado permanecen dentro de los bordes de la tarjeta. Se conserva el diseño de escritorio.
- **Código implementado y comprobado visualmente:** dentro de los detalles/historial de la Serie Mundial MLB, `.mlbWorldSeriesResults` y `.mlbWorldSeriesDecisions` pasan a una sola columna en móviles (regla `@media (max-width: 760px)`). La usuaria confirmó que el detalle de la serie ya se veía correctamente.
- **Encabezado móvil inteligente, implementado y probado en teléfono:** `components/SmartHeader.tsx` escucha el desplazamiento y alterna `smart-header` e `is-hidden`; `app/page.tsx` importa y monta `<SmartHeader />`. `app/globals.css` usa el encabezado sticky en móvil con animación al ocultar/mostrar. **La usuaria confirmó que se oculta al bajar y reaparece al subir, sin volver al inicio.** La experiencia de escritorio no se cambió intencionalmente.
- Siguen pendientes pruebas en otros tamaños y navegadores, así como auditoría completa de accesibilidad y transiciones con partidos MLB en vivo.

### 8.2. Dobles carteleras y Resultados recientes (MLB/LMB/LMP)

- **Tarjetas de partidos principales:** `components/Games.tsx` muestra `DOBLE · JUEGO 1/2` para dobles carteleras identificadas; se retiró la antigua etiqueta adicional `DOBLE CARTELERA`. `gameTime()` devuelve `HORA POR CONFIRMAR` para el segundo juego consecutivo `doubleHeader="Y"`, `gameNumber=2` y `status="Preview"` de las ligas consideradas en la condición actual (MLB, LMB, LMP). **No asumir que la hora mostrada en la tarjeta principal está sincronizada con la verificación más estricta del detalle.**
- **Detalle de LMP:** `lib/gameDetails.ts` incorpora `verifyLmpSecondGameTime()` y `secondGameTimeVerified`; `app/game/[league]/[id]/page.tsx` evita anunciar una hora no verificada para la segunda jornada consecutiva. Seguir comprobando casos reales de reprogramación y horarios.
- **Resultados recientes:** `lib/recentGames.ts` conserva `gameNumber` y `doubleHeader` en MLB/LMP (StatsAPI) y LMB (calendario oficial cuando sus campos están presentes). Mantiene el esquema de hasta **10 partidos Final** recientes, excluyendo estados especiales; en temporada baja algunas ligas pueden no mostrar resultados.
- **Interfaz común para las tres ligas:** `components/RecentResults.tsx` muestra `JUEGO 1` o `JUEGO 2` arriba a la derecha **únicamente cuando existe una identificación oficial o una pareja inferible de dos juegos** de los mismos equipos y fecha. La etiqueta usa el gris `var(--muted)`, no el verde lima que señala al equipo ganador.
- **Orden de resultados:** `RecentResults.tsx` construye `orderedGames` y agrupa las parejas disponibles en **JUEGO 1 → JUEGO 2**, conservando los demás resultados sin duplicación. **Verificación visual de la usuaria en LMP (2/nov/2026):** Yaquis de Obregón–Algodoneros de Guasave del 1/nov aparecen juntos como Juego 1 (4–6) y Juego 2 (3–4); Águilas de Mexicali–Mayos de Navojoa del 1/nov aparecen juntos como Juego 1 (6–1) y Juego 2 (1–3). Etiquetas grises y ganadores lima confirmados por captura. También se observaron partidos sin etiqueta y un Juego 2 aislado de fecha anterior, esperado cuando Juego 1 queda fuera del límite de 10 resultados.
- **Límite de verificación:** el componente se comparte entre MLB, LMB y LMP, pero el agrupamiento y numeración se comprobaron visualmente **solo con la captura LMP**. La inferencia mediante hora únicamente es válida si están disponibles ambos juegos con identificadores/horas diferentes; la API puede omitir metadatos o modificar horas en reprogramaciones. No presentarlo como detección infalible ni deducir números inexistentes.

### 8.3. Estados especiales y validaciones por completar

- LMP muestra etiqueta y motivo de **POSPUESTO** y segunda línea **REPROGRAMADO · fecha** cuando hay datos; en capturas se verificaron casos por lluvia. Colores compartidos para POSPUESTO (rosa), RETRASADO (amarillo) y SUSPENDIDO (violeta); algunos estados aún deben comprobarse con ejemplos reales en cada liga.
- En tarjetas POSPUESTO se evita mostrar carreras como si el juego hubiera finalizado normalmente. Se preservan los resultados FINAL válidos y se excluyen pospuestos de Resultados recientes.
- **Pendientes técnicos:** comprobar LMP HOY → POR COMENZAR → EN VIVO → FINAL durante juegos reales, pitchers/identidades/fotografías; contrastar los estados especiales y doble cartelera contra datos reales de LMB/MLB; revisar clasificación/orden y horarios de dobles jornadas cuando no se anuncia el segundo inicio; revisar presentación de postemporada LMP y condiciones de contador con fecha oficial. No repetir cambios ya comprobados sin una regresión nueva.

### 8.4. Próxima fase — PWA / APK Android

- **Estado al 2/nov/2026:** sitio web en Vercel y acceso directo desde Brave en Android; **todavía no se ha creado una PWA instalable completa ni generado APK**. No afirmar que la app Android esté publicada.
- Próximo trabajo propuesto, en cambios pequeños con commit y validación: definir nombre, íconos e identidad para PWA; crear/validar manifest web e instalación; decidir la estrategia de caché/actualizaciones; verificar funcionamiento en pantalla completa, navegación y recarga de datos; después evaluar empaquetado APK/AAB mediante Trusted Web Activity u otra estrategia adecuada.
- **Actualizaciones futuras:** mejoras del sitio web pueden reflejarse en el contenedor Android sin reinstalación, sujetas a caché y conexión. Cambios nativos, paquetes/firmas o configuración Android pueden requerir una nueva compilación y actualización instalada. Conservar identificador de paquete y clave de firma para futuras versiones.
- **Flujo de trabajo preferido:** un paso de código por vez, confirmación «listo sin error», verificación de GitHub/Vercel y prueba visual en el dispositivo cuando corresponda. Actualizar este documento después de cada bloque de funcionalidades verificado.


## 9. Piloto LMP — ABRIDOR → ABRIÓ (2/nov/2026)

- **Implementado en GitHub y desplegado en Vercel:** `lib/gameDetails.ts` obtiene los IDs y nombres de pitchers que efectivamente lanzaron en LMP a partir de `liveData.plays.allPlays` / `currentPlay`, filtrando por media entrada del equipo defensor y eventos `isPitch === true`. El primer lanzador observado por cada equipo se considera el abridor del juego para esta prueba; otro ID observado en lanzamientos confirma un relevo.
- **Detalle LMP:** `app/game/[league]/[id]/page.tsx` mantiene nombre y foto del abridor real debajo del equipo durante EN VIVO, etiqueta **ABRIDOR** mientras no se haya observado otro lanzador y **ABRIÓ** cuando ya se detecta un relevo. Si falta evidencia de quién abrió, no se muestra un abridor inventado. Antes del juego conserva su comportamiento con pitchers probables; el estado FINAL sigue pendiente de resultados de pitcher ganador/perdedor/salvamento.
- **Sin cambios en `LiveGamePanel`:** `LANZANDO` sigue indicando al pitcher actual y `AL BAT` al bateador. Tampoco se modificaron los detalles MLB/LMB ni las tarjetas especiales de finales.
- **Pendiente principal:** prueba visual con partidos LMP realmente **EN VIVO el 3/nov/2026**, incluyendo visita/local, relevo real, nombres, fotos y distribución móvil. La implementación se confirmó en código y Vercel, **no se ha comprobado aún que todos los partidos de LMP expongan los eventos necesarios**, ni que la fuente de fotos funcione en todos los casos. Si la UI no convence, valorar ocultar las fotos en vivo o usar presentación compacta, sin alterar SITUACIÓN DEL JUEGO.
- **Otro pendiente independiente:** el respaldo de pitchers probables mediante un endpoint de calendario `gamePk` descrito en la conversación no está presente en `lib/gameDetails.ts` al realizar esta revisión; por tanto, **no darlo por implementado** hasta confirmar un commit posterior. Hay que revisar ese fallback y fotos en un paso separado.


## 10. Punto exacto de reanudación — 2 de noviembre de 2026

**IMPORTANTE — LEER AL INICIAR UNA CONVERSACIÓN NUEVA.** El objetivo inmediato es validar visualmente el **piloto de pitchers abridores LMP en el detalle de partidos EN VIVO**. El código ya está integrado y los despliegues de esos commits finalizaron correctamente; **no hay que volver a implementar el cambio ABRIDOR → ABRIÓ** salvo que las pruebas reales detecten un error.

**Commits confirmados en `main`:**
- `b76b78b5`: `lib/gameDetails.ts` incorpora `getLmpPitchersUsed`, `awayStartingPitcher`, `homeStartingPitcher`, `awayStarterReplaced` y `homeStarterReplaced`.
- `b2559844`: `app/game/[league]/[id]/page.tsx` deja visibles las fotos y nombres de abridores reales de LMP cuando `isLive`, con etiqueta **ABRIDOR** mientras no haya relevo registrado y **ABRIÓ** tras confirmar otro pitcher; mantiene `P. PROBABLE` antes del partido. No cambia los detalles MLB/LMB ni las tarjetas especiales de finales.
- `b4843cea`: documentación de la prueba en esta bitácora. **Los tres commits tenían estado Vercel `success` al verificarlos el 2/nov/2026.**

**Regla UX acordada y todavía a validar:** durante un partido LMP EN VIVO, debajo de cada equipo se conserva foto + nombre del pitcher que **realmente abrió**. Etiqueta **ABRIDOR** hasta detectar pitcheos de otro pitcher de ese equipo, luego **ABRIÓ**, dejando el nombre/foto original. **SITUACIÓN DEL JUEGO** muestra siempre el pitcher **LANZANDO** actualmente y el bateador **AL BAT**, sin tocar esa funcionalidad. En las tarjetas *especiales* de Serie Mundial MLB, Serie del Rey LMB y futura Serie Final LMP, se mantiene la regla separada de ocultar pitchers durante EN VIVO.

**Qué hacer en la próxima sesión (martes 3/nov/2026, con partidos LMP EN VIVO):**
1. Abrir `https://diamante-mx.vercel.app/`, elegir LMP y abrir el detalle de un partido en vivo. Revisar si aparecen **ABRIDOR**, foto y nombre de ambos equipos, sin atribuir un abridor a partir de un probable.
2. Si hay un relevo registrado, verificar que solo el equipo que hizo el cambio pase a **ABRIÓ** y conserve el nombre/foto del abridor; el panel `LANZANDO` debe actualizarse al relevista.
3. Inspeccionar en **celular y escritorio** alineación de logos, nombres, marcador, fotos y espacio de la cabecera. La usuaria quiere comparar el diseño con una opción más compacta que **oculte fotos en vivo** si el resultado no convence. No asumir éxito sin captura.
4. Investigar cualquier ausencia de nombres/fotos con datos de la API y comprobar si `isPitch` está disponible desde el inicio. El algoritmo usa el **primer pitcher observado con eventos `isPitch:true` en el feed**, que puede no coincidir con el abridor real si faltan jugadas o el feed empieza tarde; verificar con boxscore/lineup si hay discrepancia.
5. Completar más adelante el bloque de **GANADOR / PERDEDOR / SALVAMENTO** para partido FINAL y revisar etiquetas de calentamiento. Mantenerlo separado de la prueba actual.

**Atención a otro pendiente aún NO implementado:** en `lib/gameDetails.ts` el bloque de `awayProbablePitcher` / `homeProbablePitcher` todavía depende de `gameData.probablePitchers`. No está integrado el respaldo desde `schedule?gamePk=...&hydrate=probablePitcher` propuesto anteriormente, aunque la usuaria había confirmado «listo sin error». Comprobar el código real antes de decir que el fallback existe. Revisar también las URL de fotografías de LMP.

**Mensaje listo para retomar sin pérdida de contexto:** «Amistad, continuemos Diamante MX. Lee `PROJECT_STATUS.md`, especialmente las secciones 9 y 10, y verifica GitHub antes de cambiar código. Tenemos implementado el piloto LMP ABRIDOR→ABRIÓ; quiero revisar un juego EN VIVO y mandarte capturas para valorar la presentación en celular. Vamos paso a paso.»

## 11. Android / PWA — instalación iniciada (2/nov/2026)

- **Objetivo:** crear APK Android instalable de Diamante MX (sitio principal `https://diamante-mx.vercel.app/`), conservando capacidad de actualizar contenidos web desde GitHub/Vercel y preparando futura distribución en Play Store. **La APK todavía NO existe.**
- **Vercel conectado a ChatGPT:** el 2/nov/2026 la usuaria instaló/autorizó el complemento Vercel y se validó acceso real a su proyecto `diamante-mx` (id `prj_Gxjd8K91mYbAi8iYlosAh70ix2de`). Ya pueden consultarse despliegues y logs de compilación mediante la integración, sin pedir capturas.
- **Configuración PWA creada en GitHub:** `app/manifest.ts` define nombre, colores, idioma, alcance y modo `standalone`; `lib/pwaIcon.ts` dibuja un ícono **PROVISIONAL** acorde al rombo lima sobre fondo verde oscuro; `app/pwa-icon-192.png/route.ts` y `app/pwa-icon-512.png/route.ts` generan imágenes PNG; `app/layout.tsx` declara `manifest`, icono, nombre de app y `themeColor`. La UI del sitio y ligas no se modificaron.
- **Error diagnosticado y corregido:** el despliegue `d04a9957` falló en TypeScript porque `app/manifest.ts` indicaba `purpose: "any maskable"`, mientras que el tipo actual de Next.js solo acepta `"any"`, `"maskable"` o `"monochrome"` individualmente. Commit `d01901cb61b2d68e5561bbcfe4309ef323e8ba6b`: corregido a `purpose: "any"` para 512 px. **Vercel READY en producción** (deployment `dpl_6VvuodCqoH884oCR7xdkffFnkQ6y`). Los logs de compilación confirman rutas `/manifest.webmanifest`, `/pwa-icon-192.png` y `/pwa-icon-512.png`.
- **Pendiente de probar con el dispositivo Android:** inspeccionar que Android/Chrome/Brave detecta el manifiesto y permite instalación; abrir sin barra del navegador, revisar navegación y funcionamiento móvil, recarga de marcadores, autenticidad de icono y tratamiento de caché. No afirmar que instalabilidad, notificaciones, funciones offline ni fotos hayan sido verificadas.
- **Fase APK pendiente:** decidir ícono oficial y crear versión maskable adecuada si la necesita PWABuilder; configurar digital asset links / verificación de dominio para Trusted Web Activity, nombre de paquete Android, versionado, clave de firma persistente, generar APK de prueba (y AAB para Play Store si se publica), instalar en Android y probar. No se ha generado APK ni AAB ni publicado en Google Play. Los cambios web se podrán actualizar sin reinstalar salvo cambios nativos/caché; una nueva APK requiere misma firma e ID de paquete.
- **Próximo paso recomendado:** en el teléfono abrir `https://diamante-mx.vercel.app/` y probar instalación desde Chrome, capturando cómo aparece el icono y si abre en modo independiente. Después evaluar PWABuilder en vez de asumir que la APK ya está lista.
