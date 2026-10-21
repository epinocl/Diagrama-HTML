# AV-20261021-006 - Formalización de la Arquitectura Híbrida: Agente IA Local, Paquete Portable .axon.zip y Servidor Web

## Objetivo
1. Formalizar y documentar la **Opción C: Arquitectura Híbrida** para la digitalización asistida por IA de bocetos y planos eléctricos, desacoplando la generación inicial ejecutada por un Agente IA local de la edición técnica continua y gobernanza en la Plataforma Web / Servidor Ubuntu AXON.
2. Actualizar integralmente la documentación humana de ingeniería de software según los estándares `davichuder` y `axon-standard`:
   - `docs/ARCHITECTURE.md`: Incorporación de la Sección 7 y ADR-05 con especificación técnica del contenedor `.axon.zip` y contratos `project.json` / `metadata.json`.
   - `docs/PLANS.md`: Extensión del plan con la Sección 4 (Hitos 1 a 4 de integración híbrida).
   - `docs/ROADMAP.md`: Actualización del cronograma y definición de tareas `ZIP-01` a `ZIP-03` y `AI-01`.
   - `roadmap.html` y `tasks_data.json`: Actualización del mapa vivo interactivo (42 tareas registradas y sincronizadas).
   - `docs/RAID_BOARD.md`: Cierre de problemas activos resueltos y adición de supuestos/riesgos asociados al esquema de intercambio de datos.

## Requisitos / documentos relacionados
- Solicitud de usuario: "ACTUALIZA LA DOCUMENTACION Opción C: Arquitectura Híbrida (Recomendada), EXTIENDE EL PLAN, ACTUALIZA ARQUITECTURA, ROADMAP, PLANES".
- Guía Integral de Ingeniería de Software (`davichuder/SKILL.md`).
- `docs/ARCHITECTURE.md`, `docs/PLANS.md`, `docs/ROADMAP.md`, `docs/RAID_BOARD.md`.

## Estado inicial
- Se completó la inicialización del entorno React 19 + TypeScript y el motor topológico CAD inicial (`AV-20261021-005`).
- No existía especificación formal para el flujo de trabajo entre agentes de IA que crean diagramas a partir de fotos de bocetos y la plataforma web.
- Faltaba definir el formato de empaquetado portable y los puntos de ingesta en el servidor.

## Trabajo realizado
1. **Especificación del Contenedor Portable (`.axon.zip`)**:
   - Se diseñó el estándar de empaquetado autocontenido: `project.json` (topología de componentes, bornas y cables), `metadata.json` (trazabilidad ALCOA+ con SHA-256 de las fotos originales) y carpetas `bocetos/` y `preview/`.
2. **Actualización de `docs/ARCHITECTURE.md`**:
   - Se redactó la Sección 7 con diagrama C4/Mermaid del flujo híbrido.
   - Se formalizó el **ADR-05 (Arquitectura Híbrida y Paquete Portable .axon.zip)**.
3. **Extensión de `docs/PLANS.md`**:
   - Se incorporó la Sección 4 estructurada en 4 hitos secuenciales:
     * Hito 1: Esquema y empaquetador CLI local (`scripts/empaquetar_proyecto.py`).
     * Hito 2: Módulo Drag & Drop en Canvas Web con `jszip` (Fase 2).
     * Hito 3: Ingestión y persistencia centralizada en Servidor Ubuntu (`POST /api/proyectos/importar-zip`).
     * Hito 4: Microservicio de visión multimodal en servidor con Gemini 2.0 Flash / Claude 3.5 (Fase 4).
4. **Actualización de `docs/ROADMAP.md` y Mapa Vivo**:
   - Se actualizaron las tareas del cronograma reflejando el estado actual de la Fase 2 (11 tareas completadas del motor CAD y 4 tareas en curso).
   - Se sincronizó `tasks_data.json` y se re-generaron `roadmap.html` y `C:\IA EPINO LOCAL\roadmap_diagrama.html` con 42 tareas totales.
5. **Actualización del Tablero RAID (`docs/RAID_BOARD.md`)**:
   - Se cerraron como **Resueltos** los problemas `I-01` a `I-05` tras la implementación y testeo unitario del motor topológico.
   - Se añadieron el supuesto `S-06` (portabilidad de proyectos vía ZIP) y los riesgos `R-06` (versionado de esquema JSON) y `R-07` (latencia de modelos de visión).

## Archivos modificados
- `docs/ARCHITECTURE.md` (Actualizado con Sección 7 y ADR-05)
- `docs/PLANS.md` (Actualizado con Sección 4)
- `docs/ROADMAP.md` (Actualizado a v1.2.0 con tareas ZIP y AI)
- `docs/RAID_BOARD.md` (Actualizado a v1.2.0)
- `tasks_data.json` (Actualizado con 42 tareas de ingeniería)
- `roadmap.html` y `C:\IA EPINO LOCAL\roadmap_diagrama.html` (Actualizados)
- `docs/avances/AV-20261021-006-arquitectura-hibrida-agente-ia-paquete-zip.md` (Nuevo registro)

## Decisiones tomadas
- Se establece `.axon.zip` como el formato estándar de intercambio entre agentes IA y la suite AXON CAD Web.
- La digitalización de bocetos puede realizarse en local a costo cero por el agente en su IDE, preservando la capacidad de agregar servicios de visión en la nube en el servidor para usuarios finales en fases posteriores.

## Próximos pasos
1. Sincronizar cambios en GitHub (`git push`).
2. Instalar `jszip` y desarrollar el componente de importación/exportación Drag & Drop `.axon.zip` en la interfaz web de React 19 (`ZIP-03`).
3. Crear el script de empaquetado para el agente local `scripts/empaquetar_proyecto.py` (`ZIP-02`).
