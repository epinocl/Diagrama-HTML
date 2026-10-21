# Registro RAID del Proyecto (Riesgos, Supuestos, Incidentes y Dependencias)

**Documento:** RAID-01  
**Proyecto:** Diagrama-HTML (AXON CAD Web)  
**Estándar:** Guía Davichuder & GAMP 5 / ALCOA+  
**Versión:** 1.2.0  
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
| **R-06** | Incompatibilidad de versiones en el esquema `project.json` entre agentes IA locales y la web. | Baja | Alto | **Medio** | Incorporar campo `schemaVersion: "1.0"` en `project.json` con migradores retrocompatibles automáticos. | Arquitecto de Software |
| **R-07** | Latencia excesiva o fallos de lectura en modelos de visión multimodal en el servidor. | Media | Medio | **Medio** | Usar Google Gemini 2.0 Flash API (latencia < 2s) con preprocesamiento OpenCV y esquema Pydantic forzado. | Desarrollador IA |

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
| **S-06** | Los proyectos digitalizados por agentes locales pueden ser transportados y cargados mediante contenedores `.axon.zip` sin pérdida de precisión. | Validado mediante la especificación de `project.json` y la librería `jszip`. |

---

## 3. Incidentes / Problemas Activos (Issues)
Desafíos técnicos actuales detectados en la versión base que deben resolverse en la Fase 2.

| ID | Incidente / Problema | Severidad | Estado | Plan de Resolución |
| :--- | :--- | :---: | :---: | :--- |
| **I-01** | Las líneas en la versión base eran elementos `<line>` y `<polyline>` rígidos en SVG. | **Alta** | **Resuelto** | Modelo topológico desacoplado `WireNet` y `WireSegment` implementado y probado en Fase 2. |
| **I-02** | Los símbolos de la librería IEC 60617 no tenían metadatos explícitos de bornas magnéticas. | **Alta** | **Resuelto** | Definido contrato `ConnectionPort` con snap a 8 px en `src/cad/topology.ts`. |
| **I-03** | Al desplazar un componente en el plano, los conductores no lo seguían y quedaban rotos. | **Alta** | **Resuelto** | Motor de adaptación elástica ortogonal (*rubber-banding*) implementado en Zustand store. |
| **I-04** | No existía herramienta interactiva para partir (split) o extender cables en el canvas web. | **Media** | **Resuelto** | Herramientas Cortar y Extender integradas en `Toolbar.tsx` y validadas con tests unitarios. |
| **I-05** | La edición de textos y propiedades estaba dispersa en scripts separados. | **Media** | **Resuelto** | Unificado en el Inspector de Propiedades Híbrido (`PropertyInspector.tsx`). |
| **I-06** | Necesidad de intercambiar proyectos entre agentes locales y la plataforma web sin fricción. | **Alta** | En Curso | Creación del formato de contenedor `.axon.zip` y módulo de importación drag & drop (`ZIP-01` a `ZIP-03`). |

---

## 4. Dependencias (Dependencies)

| ID | Dependencia Externa | Tipo | Impacto si falla | Estado |
| :--- | :--- | :---: | :--- | :---: |
| **D-01** | **Node.js (v24 LTS) y Vite (v6)**: Entorno de ejecución y bundling. | Herramienta | Bloquea el desarrollo modular en React 19 / TypeScript. | **Cerrado** (Operativo). |
| **D-02** | **Python (PyMuPDF y ezdxf v1.4.5)**: Utilidades de procesamiento vectorial y CAD. | Librería | Impide la conversión de planos heredados y validación DXF offline. | **Cerrado** (Instalado y verificado). |
| **D-03** | **Docker Desktop (v29.6)**: Entorno de pruebas locales en contenedores. | Herramienta | Impide reproducir el entorno Nginx de Ubuntu Server localmente. | **Cerrado** (Operativo). |
| **D-04** | **Repositorio GitHub (`epinocl/Diagrama-HTML`)**: Control de versiones y canal de sincronización. | Servicio | Pérdida de trazabilidad o desincronización entre ingenieros. | **Cerrado** (Sincronizado en main). |
| **D-05** | **Aprobación de Decisiones de Arquitectura (ADRs 01 a 05)**: Stack, ruteo elástico, inspector y arquitectura híbrida ZIP. | Gobernanza | Bloquea el desarrollo de las tareas de Fase 2. | **Cerrado y Aprobado por el Usuario** (2026-10-21). |

---

## 5. Registro de Decisiones de Arquitectura (ADR - Davichuder)

1. **ADR-01**: Stack Frontend React 19 + TypeScript + Vite + Zustand (60-120 FPS).
2. **ADR-02**: Ruteo Topológico Ortogonal Adaptativo en 90° (Rubber-Banding).
3. **ADR-03**: Inspector de Propiedades Híbrido (Panel Lateral Fijo + Ventana Desacoplable).
4. **ADR-04**: Nivel de Criticidad Alta (GAMP 5 Categoría 4 / ALCOA+).
5. **ADR-05**: **Arquitectura Híbrida de Digitalización (Agente IA Local + Paquete Portable `.axon.zip` + GUI Web / Servidor Ubuntu)**.
