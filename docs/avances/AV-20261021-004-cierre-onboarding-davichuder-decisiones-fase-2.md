# AV-20261021-004 - Cierre de Onboarding Davichuder y Registro de Decisiones de Arquitectura (Fase 2)

## Objetivo
1. Aplicar el protocolo estricto de la skill **`davichuder`** para el paso de fase (transición de Fase 1 a Fase 2), resolviendo las preguntas abiertas de arquitectura y gobernanza mediante consulta interactiva con el usuario.
2. Crear e integrar el **Tablero RAID** (`docs/RAID_BOARD.md`: Riesgos, Supuestos, Incidentes y Dependencias) exigido por el estándar `davichuder` como instrumento de control continuo.
3. Formalizar los 4 Registros de Decisión de Arquitectura (ADRs) aprobados en `docs/ARCHITECTURE.md` y `docs/RAID_BOARD.md` para iniciar el desarrollo del Motor CAD y la GUI Web en `src/`.

## Requisitos / documentos relacionados
- Solicitud de usuario: "QUEDAN PREGUNTAS ABIERTAS PARA SEGUIR A LA FASE 2, REVISA /davichuder".
- Guía Integral de Ingeniería de Software (`davichuder/SKILL.md`).
- `docs/ARCHITECTURE.md`, `docs/RAID_BOARD.md`, `docs/ROADMAP.md` y `docs/ESTUDIO_Y_PLAN_MEJORAS_CAD.md`.
- Estándares `axon-standard` (GAMP 5, ALCOA+).

## Estado inicial
- Se completó la Fase 1 (Gobernanza, Documentación, Línea base `origen/` v3.0 y Roadmap Interactivo `roadmap.html`).
- Quedaban 4 decisiones estratégicas pendientes de validación por parte del usuario (stack tecnológico, ruteo elástico, inspector de propiedades y nivel de criticidad/compliance).
- Faltaba el archivo `docs/RAID_BOARD.md` estipulado en la sección 2.3 y 4 de la skill `davichuder`.

## Trabajo realizado
1. **Auditoría según `/davichuder`**: Se verificó la estructura del repositorio (`src/`, `tests/`, `docs/`) y se detectó la necesidad de incorporar el Tablero RAID de gestión de riesgos y supuestos.
2. **Creación del Registro RAID (`docs/RAID_BOARD.md`)**:
   - **Riesgos (R-01 a R-05)**: Control de FPS en planos densos (>500 entidades), ruteo ortogonal errático, compatibilidad DXF retroactiva, latencia de red y persistencia ante caídas.
   - **Supuestos (S-01 a S-05)**: Estaciones 1080p+, navegadores modernos, Servidor Ubuntu 24.04 LTS, formato A3 DIN ISO 5457 y simbología IEC 60617.
   - **Incidentes / Issues (I-01 a I-05)**: Líneas SVG no topológicas, falta de bornas magnéticas, cables desconectados al arrastrar y falta de herramientas interactivas de corte/extensión.
   - **Dependencias (D-01 a D-05)**: Node.js, Python/ezdxf, Servidor Ubuntu, GitHub y Aprobación de Arquitectura.
3. **Consulta de Onboarding y Respuestas Aprobadas**:
   - **Pregunta 1 (Stack Frontend)**: Aprobado **React 19 + TypeScript + Vite + Zustand** (ADR-01).
   - **Pregunta 2 (Comportamiento de Cables)**: Aprobado **Ruteo ortogonal adaptativo en 90° (Rubber-Banding)** sin desconexión de bornes (ADR-02).
   - **Pregunta 3 (Inspector de Propiedades)**: Aprobado **Diseño Híbrido: Panel lateral derecho con desacople modal flotante** (ADR-03).
   - **Pregunta 4 (Criticidad / Compliance)**: Aprobado **Criticidad Alta (GAMP 5 Cat. 4 / ALCOA+) con Audit Trail criptográfico** (ADR-04).
4. **Actualización de Documentación de Arquitectura**:
   - Se incorporó la sección `6. Registro de Decisiones de Arquitectura para Fase 2 (ADRs Aprobados)` en `docs/ARCHITECTURE.md`.
   - Se actualizó `docs/RAID_BOARD.md` cerrando la dependencia `D-05` como resuelta.

## Archivos modificados / creados
- `docs/RAID_BOARD.md` (Nuevo tablero RAID estándar Davichuder)
- `docs/ARCHITECTURE.md` (Actualizado con ADR-01 a ADR-04)
- `docs/avances/AV-20261021-004-cierre-onboarding-davichuder-decisiones-fase-2.md` (Nuevo registro de avance)

## Decisiones tomadas
- Se cierran todas las compuertas de gobernanza y especificación de la Fase 1. El proyecto queda formalmente habilitado para comenzar la codificación de la **Fase 2: Motor Gráfico & Topología CAD** en TypeScript.

## Próximos pasos
1. Sincronizar cambios en GitHub (`git push`).
2. Iniciar la tarea `CAD-01`: Modelado de las clases e interfaces topológicas `WireNet`, `WireSegment`, `ConnectionPort` y `CanvasEntity` en TypeScript.
