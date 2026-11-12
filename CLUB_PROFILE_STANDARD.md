# Estándar maestro de fichas de equipo — Diamante MX

**Versión:** 1.0 · 11 de noviembre de 2026  
**Referencia aprobada:** fichas de LMB, especialmente Toros de Tijuana.  
**Cobertura:** perfiles de LMB y LMP existentes y futuros perfiles individuales de MLB. MLB aún no dispone de fichas completas equivalentes: NO declararlas implementadas.

## Principios innegociables

1. **Mismo diseño, mismos títulos, mismo orden de bloques, misma semántica y mismos estados de datos** para equipos comparables de cualquier liga. Cambian exclusivamente el nombre, la liga, los datos, las fechas, el rival, las fuentes y el contenido comprobado.
2. **Un único componente por función visual.** Prohibido repetir a mano el JSX de KPIs históricos, rótulos de estadio o la redacción de una sección. `lib/clubProfileCopy.ts` es el origen de títulos editoriales; `components/ClubHistoryFacts.tsx` es el origen de las tres métricas de Historia y el sello del estadio.
3. **Jamás se reutiliza un espacio semántico para una cifra diferente:** una casilla de apertura de estadio no puede contener capacidad, temporada actual, sede o fundación de la franquicia.
4. **Sin evidencia, mostrar «—» y «Año por verificar» o una aclaración explícita**; nunca trasladar un número de otro campo para llenar el diseño. Mantener fuentes junto a hechos documentados. No asumir que el año del club equivale al año del estadio.
5. **No confundir personas ni ligas:** Algodoneros del Unión Laguna (LMB) ≠ Algodoneros de Guasave (LMP); una firma MiLB ≠ debut en MLB; haber jugado en ambos circuitos ≠ traspaso directo.
6. **Responsive:** escritorio conserva estructura completa; calendario de próximas fechas plegado inicialmente *solo* en pantalla de teléfono (hasta 650 px). Datos iguales en ambas presentaciones; no duplicar consultas.
7. **La ficha debe fallar con claridad** si faltan datos. Nunca reemplazar noticias de un club con noticias de otro ni imágenes de un jugador por retratos falsos. Un monograma del nombre es fallback aceptable sin fotografía.

## Contrato de la navegación del club

Todas las fichas existentes siguen el mismo orden de pestañas:

| Posición | Pestaña | Campos mínimos |
|---|---|---|
| 1 | **Resumen** | Identidad, estadio, récord de temporada cuando la liga lo proporcione, calendario real enlazado, noticias oficiales propias, videos oficiales atribuibles |
| 2 | **Plantilla** | Foto oficial cuando exista, nombre correcto, dorsal, posición, agrupación consistente; sin cuerpo técnico mezclado con jugadores |
| 3 | **Movimientos** | Fecha, tipo, nombres, **dirección** y fuente. Distinguir registro formal de una nota de prensa; no atribuir altas y bajas sin prueba |
| 4 | **Grandes Ligas** | Misma introducción y jerarquía; diferenciar debut MLB posterior, experiencia anterior y Ligas Menores, siempre con evidencia cronológica |
| 5 | **Historia** | Hero, tres indicadores, palmarés, línea del tiempo, figuras históricas, inmortales vinculados, casa del equipo y fuentes históricas |

## Contrato exacto de Historia

**Hero:** «HISTORIA · LIGA MEXICANA DE BEISBOL» o «HISTORIA · LIGA MEXICANA DEL PACÍFICO», «La historia de {equipo}», introducción propia fundamentada en fuentes, escudo del club.

**Tarjetas superiores** — mismo tipo de dato y textos en todas las fichas:

1. **DEBUT HISTÓRICO {liga}** → año de debut del club en la liga indicada; subtítulo «Primeras temporadas documentadas», o «Año por verificar».
2. **CAMPEONATOS {liga}** → total de títulos de la liga indicada, con dos dígitos; subtítulo «Hasta la temporada {temporada de corte}».
3. **APERTURA DEL ESTADIO** → año de inauguración del recinto actual; subtítulo con su nombre. Si se desconoce: «—» + «Año por verificar · {estadio}». No mostrar capacidad, temporada, cambio de patrocinador ni año de remodelación aquí.

**Secciones restantes** en este orden:

- **EL PALMARÉS** → «Campeonatos de {liga}». Primera y última corona con tarjetas visuales uniformes cuando existan; casos sin títulos deben usar el mismo contenedor de estado vacío, no una corona ficticia. Historial completo si se dispone.
- **MOMENTOS QUE DEFINIERON AL CLUB** → «Línea del tiempo», hitos por año y fuente.
- **NOMBRES QUE DEJARON HUELLA** → «Figuras históricas del club», tarjetas uniformes con nombre, papel, época, relevancia y enlace de fuente.
- **RECONOCIMIENTO OFICIAL** → «Inmortales vinculados al club». Solo personas con vínculo al club y entronización documentada (año y fuente). Un coach histórico puede ser inmortal sin haber sido pelotero del club: describir con precisión.
- **LA CASA DEL EQUIPO** → nombre del estadio, descripción factual, capacidad en el texto cuando esté comprobada, CTA **«Conocer el estadio ↗»**. El sello lateral muestra exclusivamente «ESTADIO / {año o —} / AÑO DE INAUGURACIÓN».
- **FUENTES HISTÓRICAS** → enlaces a fuentes de palmarés, trayectoria, inmortales y estadio. Si un hito solo tiene fuente general, marcarlo como tal.

**Notas:** las sedes históricas múltiples requieren explicación textual y un dato equivalente bien delimitado para el estadio actual; no mostrar varios años inconexos en un KPI singular. No inventar cifras ni mezclar LMP moderna con la antigua Liga de la Costa.

## Contrato exacto de Grandes Ligas

- Kicker: **DEL BÉISBOL MEXICANO AL DIAMANTE INTERNACIONAL**.
- Encabezado: **De {equipo} a Grandes Ligas**.
- Introducción compartida: `CLUB_PROFILE_COPY.mlb.intro`.
- Tres grupos semánticos cuando corresponda: **Debutaron en MLB después de su paso por el club** (necesita evidencia de cronología); **Jugadores con experiencia MLB previa**; **Prospectos firmados por organizaciones MLB** (no presumir debut).
- Cada tarjeta debe mostrar persona, posición, organización, fecha, estado y fuente. La ausencia de casos documentados no demuestra que no existan.
- Las tarjetas de resumen cuentan **exactamente** los casos mostrados y su tipo de trayectoria; no comparar por error debuts históricos con jugadores activos únicamente.

## Contrato de datos y calidad de las demás secciones

**Resumen:** misma estructura, posiciones y títulos; el récord viene de la liga/temporada correspondiente, el calendario usa juegos reales y URLs verificadas, fotografías oficiales de noticias cuando existan; no presentar vínculos genéricos como si fueran clips individuales de ese equipo.

**Plantilla:** cuatro grupos comparables (lanzadores, receptores, cuadro, jardineros), nombres/dorsales/posición y retratos reales. Ante falta de foto, monograma neutro. La fecha y condición de activo corresponden a la fuente, no a una suposición.

**Movimientos:** siempre separar alta, baja y transferencia, indicar **origen y destino desde la perspectiva correcta**, no confundir participación de MLB con movimiento a LMB o LMP. Una nota periodística no constituye por sí sola el registro completo de transacciones.

## Reglas de verificación automática y manual

- Probar que cada logo de equipo navegue a una ficha correcta, sin mezclar ligas o clubes homónimos.
- Para cada liga, verificar el HTTP de las cinco vistas por equipo y la presencia del mismo set de pestañas.
- En todas las rutas Historia, comprobar la presencia de las clases `clubHistoryStats`, `clubHistoryOrigins` y `clubHistoryStadiumMark`, el kicker común y las palabras exactas en cada KPI. Valores distintos por equipo son esperados; etiquetas no.
- Comprobar que `clubHistoryStats` tenga exactamente tres KPIs y que el tercero muestre un **año verificado** o `—`; jamás una capacidad o temporada.
- Revisar por separado los casos con datos ausentes y no atribuirles «completos» en el registro de proyecto.
- Probar al menos un teléfono y un escritorio con capturas: visual QA no equivale a HTTP 200.
- Compilación y regresiones de proyecto antes de anunciar cambios como publicados.
- El proyecto aún tiene trabajo editorial pendiente (historias profundas de LMP, algunos vínculos MLB, Salón de la Fama LMB, movimientos y videos). Mantener abiertos los pendientes en `PROJECT_STATUS.md`.

## Estado de adopción

La normalización inicial de KPIs históricos y sello de inauguración se aplicó en componentes compartidos LMB y las fichas LMP existentes. La **uniformidad exhaustiva** de todos los bloques de las tres ligas requiere todavía completar históricos por club y desarrollar fichas equivalentes MLB. No llamar «terminado» a ese trabajo hasta pasar el control completo.
