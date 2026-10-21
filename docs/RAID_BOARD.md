# Registro RAID del Proyecto (Riesgos, Supuestos, Incidentes y Dependencias)

**Documento:** RAID-01  
**Proyecto:** Diagrama-HTML (AXON CAD Web)  
**Estándar:** Guía Davichuder & GAMP 5 / ALCOA+  
**Versión:** 1.1.0  
**Fecha:** 2026-10-21  

---

## 1. Riesgos (Risks)
Eventos potenciales que podrían afectar negativamente el cronograma, la calidad o el rendimiento del sistema.

| ID | Riesgo | Probabilidad | Impacto | Nivel | Estrategia de Mitigación | Responsable |
| :--- | :--- | :---: | :---: | :---: | :--- | :--- |
| **R-01** | Caída de FPS (< 60 FPS) al renderizar planos con más de 500 entidades vectoriales concurrentes. | Media | Alto | **Alto** | Uso de Zustand con suscripciones atómicas por componente y virtualización SVG/Canvas; evitar re-renderizados globales de React en eventos `mousemove`. | Tech Lead CAD |
| **R-02** | Rutas ortogonales erráticas (bucles o solapamientos) en ruteo automático de cables complejos. | Alta | Medio | **Medio** | Implementar algoritmo de ruteo Manhattan con restricciones de esquinas mínimas y snap magnético a cuadrícula de 4mm/8mm. | Desarrollador Motor CAD |
| **R-03** | Inconsistencia en exportaciones DXF ante versiones antiguas de AutoCAD utilizadas por clientes. | Baja | Alto | **Medio** | Mantener como estándar el formato AutoCAD R12 ASCII (máxima compatibilidad retroactiva 1:1) verificado con tests automatizados. | Ing. de Software |
| **R-04** | Latencia destructiva si se procesa el snap magnético en el backend del servidor Ubuntu. | Alta | Crítico | **Crítico** | Procesar el 100% de la geometría, snap y arrastre localmente en el navegador (Frontend Web); el backend solo gestiona almacenamiento y exportaciones pesadas. | Arquitecto de Software |
| **R-05** | Pérdida de datos por desconexión de red o cierre accidental del navegador. | Media | Medio | **Medio** | Auto-guardado transaccional en `localStorage` / IndexedDB cada 5 segundos y sincronización asíncrona con el servidor. | Desarrollador Frontend |

---

## 2. Supuestos (Assumptions)
Premisas que se consideran verdaderas para el diseño de la arquitectura y la planificación.

| ID | Supuesto | Validación / Fundamento |
| :--- | :--- | :--- |
| **S-01** | Los ingenieros y diseñadores de AXON operan en computadores con pantallas Full HD (1920x1080) o superior. | Verificado en el parque computacional de ingeniería de AXON; el layout A3 está optimizado para 1080p y 4K. |
| **S-02** | Los navegadores de destino son modernos (Google Chrome, Microsoft Edge, Firefox) con soporte nativo de SVG, ES6+, Web Workers y CSS Grid. | No se requerirá soporte para navegadores obsoletos como Internet Explorer. |
| **S-03** | El Servidor Ubuntu de AXON cuenta con Ubuntu 24.04 LTS, Node.js v20+, Python 3.10+ y Nginx disponible en la intranet. | Arquitectura corporativa estándar de TI de AXON. |
| **S-04** | Los planos generados corresponden a formato normalizado DIN ISO 5457 A3 (420 x 297 mm) con orientación horizontal. | Norma corporativa establecida en `NORMA.md`. |
| **S-05** | La biblioteca de simbología electrotécnica se regirá por la norma internacional IEC 60617. | Mandato técnico de proyectos industriales AXON. |

---

## 3. Incidentes / Problemas Activos (Issues)
Desafíos técnicos actuales detectados en la versión base que deben resolverse en la Fase 2.

| ID | Incidente / Problema | Severidad | Estado | Plan de Resolución |
| :--- | :--- | :---: | :---: | :--- |
| **I-01** | Las líneas en la versión base son elementos `<line>` y `<polyline>` rígidamente codificados en el SVG, sin entidad propia de red eléctrica. | **Alta** | Abierto | Crear modelo topológico desacoplado `WireNet` y `WireSegment` (Tarea `CAD-01`). |
| **I-02** | Los símbolos de la librería IEC 60617 no tienen metadatos explícitos de bornas magnéticas, dificultando la conexión guiada. | **Alta** | Abierto | Definir array `ports` normalizado (id, label, x, y, dir) para cada símbolo (Tarea `CAD-06`). |
| **I-03** | Al desplazar un componente en el plano, los conductores no lo siguen y quedan rotos o flotando. | **Alta** | Abierto | Desarrollar motor de adaptación elástica ortogonal (*rubber-banding*) en tiempo real (Tarea `CAD-08`). |
| **I-04** | No existe herramienta interactiva para partir (split) o extender cables en el canvas web. | **Media** | Abierto | Implementar herramientas Cortar y Extender en la barra de herramientas CAD (Tareas `CAD-03` y `CAD-04`). |
| **I-05** | La edición de textos y propiedades está dispersa en scripts separados (`editor_textos.js`, `editor_simbolos.js`). | **Media** | Abierto | Unificar en un Inspector de Propiedades Modal / Lateral desacoplado (Tarea `CAD-11`). |

---

## 4. Dependencias (Dependencies)
Factores técnicos externos y prerrequisitos requeridos para la ejecución exitosa de las fases.

| ID | Dependencia Externa | Tipo | Impacto si falla | Estado |
| :--- | :--- | :---: | :--- | :---: |
| **D-01** | **Node.js (v20 LTS) y Vite**: Entorno de ejecución y bundling para el nuevo frontend. | Herramienta | Bloquea el desarrollo modular en React 19 / TypeScript. | **Cerrado** (Disponible en entorno). |
| **D-02** | **Python (PyMuPDF y ezdxf)**: Utilidades para procesamiento vectorial de planos y exportación a DXF/PDF. | Librería | Impide la conversión de planos heredados y validación DXF offline. | **Cerrado** (Verificado Python 3.14). |
| **D-03** | **Servidor Ubuntu AXON**: Máquina física/virtual en la red local con Nginx configurado. | Infraestructura | Demora el despliegue centralizado multi-usuario de la Fase 4. | Programado para Fase 4. |
| **D-04** | **Repositorio GitHub (`epinocl/Diagrama-HTML`)**: Control de versiones y canal de sincronización. | Servicio | Pérdida de trazabilidad o desincronización entre ingenieros. | **Cerrado** (Conectado y sincronizado). |
| **D-05** | **Aprobación de Decisiones de Arquitectura de Fase 2**: Definición del stack frontend, ruteo elástico, inspector modal y nivel de cumplimiento. | Gobernanza | Bloquea el inicio de la codificación en `src/`. | **Cerrado y Aprobado por el Usuario** (2026-10-21). |

---

## 5. Decisiones de Arquitectura Aprobadas (ADR - Davichuder)

1. **ADR-01: Stack Frontend React 19 + TypeScript + Vite**:
   - *Decisión*: Se selecciona React 19 con TypeScript, empaquetador Vite y gestión de estado con Zustand.
   - *Fundamento*: Garantiza renderizado a 60-120 FPS sin bloqueos en el hilo principal durante eventos `mousemove`/`drag`, con tipado geométrico estricto (`Point`, `WireNet`, `Port`, `BoundingBox`).
2. **ADR-02: Ruteo Ortogonal Adaptativo en 90° (Rubber-Banding)**:
   - *Decisión*: Los conductores conectados a componentes IEC recalculan automáticamente sus codos en 90° al desplazar el símbolo por el plano, sin desconectarse.
   - *Fundamento*: Cumple con el estándar de dibujo electrotécnico IEC (nunca cables en diagonal descontrolada).
3. **ADR-03: Inspector de Propiedades Híbrido (Panel Lateral + Ventana Desacoplable)**:
   - *Decisión*: Panel lateral derecho desplegable integrado (estilo AutoCAD / EPLAN) que puede desacoplarse como ventana modal flotante no bloqueante.
   - *Fundamento*: Permite inspeccionar y editar propiedades sin tapar la lámina A3.
4. **ADR-04: Nivel de Criticidad Alta (GAMP 5 Categoría 4 / ALCOA+)**:
   - *Decisión*: El sistema califica como Software Configurado para aplicaciones industriales/farmacéuticas de alta criticidad, exigiendo Audit Trail inmutable con firmas SHA-256, versionado formal de emisiones y suites de testing unitario y E2E (Vitest y Playwright).
