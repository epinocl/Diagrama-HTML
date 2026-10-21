# AV-20261021-003 - Creación del Roadmap Interactivo (Mapa Vivo HTML) y Evaluación de Mejoras

## Objetivo
1. Desarrollar un mapa interactivo vivo en HTML (`roadmap.html`) para el proyecto **Diagrama-HTML (AXON CAD Web)**, inspirado en la solución de referencia `C:\IA EPINO LOCAL\mapa.html`, integrando la topología arquitectónica de 5 fases, métricas ejecutivas, checklist reactivo persistente en `localStorage` y exportador a Markdown/JSON.
2. Realizar la evaluación técnica de mejoras e innovaciones sobre la idea base, adaptándola estrictamente a las necesidades de un sistema de ingeniería CAD esquemático bajo estándares GAMP 5 y ALCOA+.
3. Documentar las mejoras en `docs/EVALUACION_MEJORAS_MAPA_VIVO.md` y sincronizar los cambios en el repositorio remoto GitHub.

## Requisitos / documentos relacionados
- Solicitud de usuario: "CREA UN HTML DEL ROADMAP, MIRA ESTA IDEA C:\IA EPINO LOCAL\mapa.html, EVALUA MEJORAS".
- `docs/ROADMAP.md` y `docs/PLANS.md`.
- `docs/ESTUDIO_Y_PLAN_MEJORAS_CAD.md`.
- Estándares `davichuder` y `axon-standard`.

## Estado inicial
- Existía un archivo `docs/ROADMAP.md` estático en formato Markdown.
- El usuario facilitó el archivo `C:\IA EPINO LOCAL\mapa.html` como referencia conceptual de un "mapa vivo" interactivo para otro proyecto (telemetría IoT).
- No existía una interfaz visual interactiva que permitiera auditar en tiempo real el progreso de las 5 fases y 39 tareas del proyecto Diagrama-HTML.

## Trabajo realizado
1. **Análisis de la Referencia `mapa.html`**: Se descompuso su arquitectura visual (layout dividido, SVG pipeline con animación de tuberías, checklist de tareas, filtrado dinámico y exportación a Markdown).
2. **Diseño y Desarrollo de `roadmap.html`**:
   - Se diseñó la interfaz con la estética corporativa **AXON Dark Cyber-CAD** (`#070c18`, `#111c33`, `#38bdf8`, `#10b981`, `#f59e0b`).
   - Se construyó el diagrama topológico SVG adaptado a la arquitectura del CAD: 5 nodos maestros vinculados por conductos animados, más 3 paneles contextuales de periferia (Simbología IEC 60617, Infraestructura Ubuntu e Interoperabilidad DXF/SVG).
   - Se programaron **mini-barras de progreso y estados porcentuales reactivos dentro de cada nodo del SVG** que se recalculan en tiempo real ante cualquier cambio de estado.
   - Se implementaron 6 tarjetas métricas ejecutivas (Progreso %, Completadas, Pendientes, Total 39, Fases Cerradas 1/5 y Próximo Hito).
   - Se estructuraron las 39 tareas maestras con tags de disciplina y niveles de prioridad (`Crítica`, `Alta`, `Media`).
   - Se añadieron capacidades avanzadas: **Acción masiva "✓ Completar Fase"**, **Exportación a JSON**, **Importación desde archivo JSON**, **Exportación a ROADMAP.md** y **Auto-guardado con Toast**.
3. **Publicación y Accesibilidad Dual**:
   - Se generó el archivo en el repositorio: `C:\IA EPINO LOCAL\DIAGRAMA-HTML\roadmap.html`.
   - Se dejó una copia lista para ejecutar en la raíz: `C:\IA EPINO LOCAL\roadmap_diagrama.html`.
4. **Evaluación Formal de Mejoras**:
   - Se redactó `docs/EVALUACION_MEJORAS_MAPA_VIVO.md` con la matriz comparativa de 9 dimensiones técnicas frente a `mapa.html`.

## Archivos creados / modificados
- `roadmap.html` (Nuevo visor interactivo, 51 KB autónomo)
- `tasks_data.json` (Nuevo inventario estructurado de 39 tareas semilla)
- `docs/EVALUACION_MEJORAS_MAPA_VIVO.md` (Nuevo documento de evaluación técnica)
- `docs/avances/AV-20261021-003-roadmap-interactivo-html-y-evaluacion-mejoras.md` (Nuevo registro de avance)
- `C:\IA EPINO LOCAL\roadmap_diagrama.html` (Copia de acceso directo)

## Decisiones tomadas
1. **Autonomía 100% Offline (Zero-Bloat)**: El archivo `roadmap.html` no requiere internet, librerías externas ni servidores para funcionar; opera con JavaScript y CSS nativos directamente en cualquier navegador.
2. **Persistencia Local Segura**: Los cambios se guardan bajo la clave `AXON_DIAGRAMA_ROADMAP_v1` en `localStorage`, permitiendo al usuario marcar avances día a día sin perder información al recargar.
3. **Priorización Explícita**: Todas las tareas críticas relacionadas con el nuevo motor de líneas, puertos IEC e inspector modal fueron catalogadas como prioridad `Crítica` o `Alta` para guiar la ejecución de la Fase 2.

## Próximos pasos
1. Abrir `roadmap.html` en el navegador para validación de experiencia de usuario.
2. Resolver las 5 preguntas de arquitectura planteadas en el avance anterior para iniciar formalmente la Fase 2.
