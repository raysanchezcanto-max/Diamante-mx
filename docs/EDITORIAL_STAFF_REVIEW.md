# Mesa editorial · Cambios de cuerpo técnico (LMB / LMP)

## Objetivo y límite de confianza

Este flujo es una **bandeja de candidatos**, no un servicio de confirmación automática. Un título de prensa puede ser un rumor, un análisis o un anuncio desactualizado. Ni la detección del título ni el uso del sitio oficial implican por sí solos que se produjo un nombramiento, renuncia o relevo.

La mesa editorial inicial funciona en **GitHub Issues** usando la autenticación y los permisos del repositorio. No requiere un administrador público en Diamante MX ni contraseñas adicionales. Si el repositorio es público, las incidencias también pueden ser visibles al público: todas deben mantener la etiqueta y el aviso **POR VERIFICAR / NO CONFIRMADO**.

## Abrir la bandeja

1. Visitar [Issues pendientes](https://github.com/raysanchezcanto-max/Diamante-mx/issues?q=is%3Aissue+label%3Aeditorial-pendiente).
2. Abrir la incidencia individual. El bot indica liga, club, tipo **sugerido**, fecha del RSS cuando existe y artículo de origen.
3. Abrir el comunicado oficial **completo**. Confirmar que se refiere al club, persona, función y temporada descritos, revisar negaciones y cambios posteriores, verificar fecha del anuncio y existencia de eventos previos.
4. Si no cumple, aplicar **editorial-descartado**. GitHub Actions cierra la incidencia; el historial y las noticias públicas no se modifican.
5. Si sí cumple, editar el bloque **JSON** en la incidencia: completar `person`, `role`, `kind`, `date` (AAAA-MM-DD), `effectiveSeason`, `description` y `replaces` cuando corresponda. **Establecer `reviewed: true`** únicamente tras revisar la fuente. No modificar los campos originales de la liga, club, URL y candidateKey.
6. Aplicar **editorial-aprobado**. Solo los colaboradores con permiso **write, maintain o admin** pueden tomar esta decisión. Se intentará crear una **pull request en borrador** con una única entrada añadida a `lib/verifiedPersonnelEvents.ts`; **NO se publicará automáticamente**. Validar el cambio y sus pruebas, marcar PR como lista y hacer merge manual.
7. Si el flujo no puede crear pull requests por la política de GitHub Actions del repositorio, consultar los logs de [Decisiones editoriales](https://github.com/raysanchezcanto-max/Diamante-mx/actions/workflows/staff-review-decision.yml) y habilitar explícitamente los permisos pertinentes en GitHub antes de continuar. **No usar aprobaciones para saltarse controles.**

## Fuente de los candidatos

La acción [Auditoría de nombramientos LMB y LMP](https://github.com/raysanchezcanto-max/Diamante-mx/actions/workflows/staff-announcement-audit.yml) está programada diariamente a las **12:17 UTC** (06:17 hora de Mérida sin horario de verano) y admite **Run workflow** manual. Escanea los 20 clubes LMB y 10 LMP; genera `staff-audit.md` y `staff-audit.json` como artefactos y crea hasta 15 incidencias nuevas por corrida, sin duplicar ya cerradas.

Si fallan 10 o más consultas oficiales, o la cobertura es inferior a 20 clubes, la bandeja no se actualiza a partir de un informe incompleto. Esto es una *alerta de confiabilidad*, no «cero noticias». El detector de LMB no infiere fechas a partir del día de la consulta.

**Importante:** el workflow y los tests no demuestran que GitHub Actions ya haya ejecutado un escaneo real. Confirmar fecha, estado y alcance en el historial de Actions y abrir el primer artefacto antes de reportar estadísticas de aciertos/falsos positivos.

## Estados y publicación

| Estado | Ubicación | Efecto |
|---|---|---|
| Pendiente de revisión | Issue con editorial-pendiente | No confirmado, nunca se muestra como movimiento |
| Descartado | Issue cerrado por editorial-descartado | No cambia datos públicos |
| Aprobado para propuesta | Issue con editorial-aprobado | Se intenta crear PR draft; no cambia producción |
| PR pendiente | Issue con editorial-pr | Revisar código/fuente y aprobar merge manual |
| Verificado y publicado | Registro incluido en rama principal, CI y Vercel READY | Aparece como evento histórico, sin asegurar ocupante actual |

## Indicadores del primer informe real

Registrar cobertura de fuentes, candidatos nuevos, ya verificados, rechazados tras abrir el artículo, falsos positivos, fallos de consulta y casos que faltaron (falsos negativos). Una tasa de precisión solo es válida después de revisar la muestra manualmente y distinguir explícitamente noticias sin evidencia. No inventar métricas a partir del detector o de fixtures de regresión.

En el futuro puede añadirse una interfaz privada propia de Diamante MX si existe control de acceso adecuado. **No exponer una página con funciones administrativas sin autenticación.**
