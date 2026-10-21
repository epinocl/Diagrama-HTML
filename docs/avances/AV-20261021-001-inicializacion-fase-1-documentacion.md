# AV-20261021-001 — Inicialización del Repositorio Diagrama-HTML (Fase 1: Documentación y Estructura)

## Objetivo
Establecer el repositorio oficial de ingeniería de software para el proyecto **Diagrama-HTML** en `C:\IA EPINO LOCAL\DIAGRAMA-HTML`, vinculado al repositorio remoto GitHub `https://github.com/epinocl/Diagrama-HTML`, aplicando los estándares de calidad de **`davichuder`** (scaffolding estricto, documentación humana y preparación para testing) y de **`axon-standard`** (principios ALCOA+, clasificación GAMP 5 y registro formal de avances), sentando las bases para su futura migración como aplicación web con GUI en el Servidor Ubuntu de AXON.

## Requisitos / documentos relacionados
- Solicitud de usuario: Inicialización del repositorio bajo estándares `/davichuder` y revisión de directivas de `/axon-standard`.
- Estandarización de proyectos AXON Ingeniería (`AGENTS.md` y `NORMA.md`).
- Norma IEC 60617 (Símbolos electrotécnicos) y DIN ISO 5457 (Formato A3).

## Estado inicial
- La carpeta `C:\IA EPINO LOCAL\DIAGRAMA-HTML` existía como un directorio vacío sin repositorio Git inicializado ni vinculación a GitHub.
- Las herramientas previas operaban como scripts y plantillas distribuidas en `HERRAMIENTAS/Diagrama-html` dentro del OneDrive de proyectos.
- No existía documentación formal de arquitectura cliente-servidor, especificación de requerimientos URS, inventario de dependencias ni roadmap de fases para el Servidor Ubuntu.

## Trabajo realizado
1. **Inicialización de Git y Remoto**: Se inicializó el repositorio con rama `main` y se enlazó con el origen remoto `https://github.com/epinocl/Diagrama-HTML.git`.
2. **Scaffolding Estándar Davichuder**: Se crearon las carpetas maestras `docs/`, `docs/avances/`, `src/` y `tests/`.
3. **Configuración de Control de Versiones**: Se creó el archivo `.gitignore` profesional para entornos Node.js, Python, temporales y cachés de agentes.
4. **Documentación de Fase 1 Completada**:
   - `README.md`: Visión del proyecto, capacidades clave y estructura.
   - `docs/ARCHITECTURE.md`: Arquitectura del sistema, diagrama C4/Mermaid, diseño bivalente (AutoCAD vs Impresión) y especificación para Servidor Ubuntu.
   - `docs/REQUIREMENTS.md`: Especificación de Requerimientos de Usuario (URS) con 14 requerimientos funcionales y 5 no funcionales, integrando los principios ALCOA+ y GAMP 5.
   - `docs/DEPENDENCIES.md`: Inventario de dependencias frontend (zero-bloat nativo), herramientas offline (PyMuPDF, Pillow, ezdxf) y servicios del Servidor Ubuntu (Nginx, Node.js, PM2).
   - `docs/PLANS.md`: Planes maestros para las 5 fases del proyecto y matriz de gestión de riesgos técnicos.
   - `docs/ROADMAP.md`: Cronograma estratégico con criterios de aceptación (Definition of Done) por fase.
   - `docs/PRODUCTION_CHECKLIST.md`: Checklist exhaustivo para control de calidad antes de puestas en producción.
5. **Copia de Respaldo y Base de Código**: Se migraron ordenadamente los activos base desde `HERRAMIENTAS/Diagrama-html` a `src/` (CSS, JS, simbología, plantillas y herramientas offline).

## Archivos modificados
- `.gitignore` (Nuevo)
- `README.md` (Nuevo)
- `docs/ARCHITECTURE.md` (Nuevo)
- `docs/REQUIREMENTS.md` (Nuevo)
- `docs/DEPENDENCIES.md` (Nuevo)
- `docs/PLANS.md` (Nuevo)
- `docs/ROADMAP.md` (Nuevo)
- `docs/PRODUCTION_CHECKLIST.md` (Nuevo)
- `docs/avances/AV-20261021-001-inicializacion-fase-1-documentacion.md` (Nuevo)
- `src/css/*` (Copiados desde HERRAMIENTAS)
- `src/js/*` (Copiados desde HERRAMIENTAS)
- `src/simbologia/*` (Copiados desde HERRAMIENTAS)
- `src/herramientas_offline/*` (Copiados desde HERRAMIENTAS)
- `src/templates/*` (Copiados desde HERRAMIENTAS)

## Decisiones tomadas
1. **Fase 1 Estrictamente Documental**: De acuerdo con la instrucción del usuario y la regla principal de `axon-standard` ("No codificar por iniciativa propia más allá del alcance"), no se modificó la lógica interna del código fuente en esta entrega, concentrando todo el esfuerzo en la arquitectura y documentación de ingeniería.
2. **Adopción de Principios ALCOA+ y GAMP 5**: Se formalizó en los requerimientos que toda emisión de diagramas conserve trazabilidad inmutable, autoría, fecha y formatos abiertos (SVG/DXF/CSS/JS) para su uso en plantas farmacéuticas y entornos industriales.
3. **Estrategia Frontend Zero-Bloat**: Se definió mantener el motor gráfico de planos en SVG/CSS3/Vanilla JS sin frameworks pesados para garantizar 60 FPS en visualización y operación 100% offline.
4. **Arquitectura Servidor Ubuntu**: Se seleccionó Nginx como reverse proxy y Node.js/Python como capa de servicios de API REST para la futura gestión multi-proyecto en el servidor de AXON.
