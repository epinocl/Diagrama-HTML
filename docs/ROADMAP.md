# Hoja de Ruta del Proyecto (Roadmap) - Diagrama-HTML (AXON CAD Web)

**Documento:** RDM-01  
**Proyecto:** Diagrama-HTML (AXON CAD Web)  
**Versión:** 1.2.0  
**Fecha:** 2026-10-21  
**Alineación:** GAMP 5 / ALCOA+ / Arquitectura Híbrida ADR-05

---

## 🎯 Cronograma Estratégico de Fases

```text
2026-Q4                       2026-Q4 / 2027-Q1             2027-Q1                       2027-Q1 / Q2
[FASE 1: GOBERNANZA & DOC] ──> [FASE 2: MOTOR CAD & ZIP] ──> [FASE 3: BACKEND UBUNTU] ──> [FASE 4: GUI & IA SERVER]
  (Estado: Completado ✓)        (React 19 + TypeScript)        (API REST, Nginx, Storage)    (Visión LLM, QA GAMP 5)
```

---

## 📋 Desglose de Fases y Criterios de Aceptación (Definition of Done)

### FASE 1: Inicialización, Gobernanza y Línea Base v3.0 (COMPLETADA ✓)
- [x] **DOC-01**: Inicializar repositorio Git en `C:\IA EPINO LOCAL\DIAGRAMA-HTML` vinculado a `https://github.com/epinocl/Diagrama-HTML`.
- [x] **DOC-02**: Creación de carpeta `origen/` con versión final operativa v3.0 inmutable (108 archivos).
- [x] **DOC-03**: Definición formal de la Arquitectura del Sistema (`docs/ARCHITECTURE.md`) con ADRs 01 a 04.
- [x] **DOC-04**: Especificación de Requerimientos de Usuario (URS) con cumplimiento GAMP 5 y ALCOA+ (`docs/REQUIREMENTS.md`).
- [x] **DOC-05**: Inventario exhaustivo de dependencias y políticas Zero-Bloat (`docs/DEPENDENCIES.md`).
- [x] **DOC-06**: Planes maestros de implementación y mitigación de riesgos (`docs/PLANS.md`).
- [x] **DOC-07**: Checklist de control de calidad para producción (`docs/PRODUCTION_CHECKLIST.md`).
- [x] **DOC-08**: Registro RAID de riesgos, supuestos, incidentes y dependencias (`docs/RAID_BOARD.md`).
- [x] **DOC-09**: Estudio técnico y plan de mejoras CAD (`docs/ESTUDIO_Y_PLAN_MEJORAS_CAD.md`).
- [x] **DOC-10**: Creación y publicación del Roadmap Interactivo en HTML (`roadmap.html`).
- [x] **DOC-11**: Formalización de la Arquitectura Híbrida y Contenedor Portable (`.axon.zip`) en ADR-05.

### FASE 2: Motor Topológico CAD, Contenedor .axon.zip y GUI React 19 (EN CURSO ⚡)
- [x] **CAD-01**: Independización de conductores: Modelo topológico `WireNet` y `WireSegment` con potencial y calibre.
- [x] **CAD-02**: Herramienta dibujar cable con ruteo ortogonal 90° (Manhattan routing) y snap métrico.
- [x] **CAD-03**: Herramienta cortar / split interactivo de conductores en dos segmentos independientes.
- [x] **CAD-04**: Herramienta extender conductores hacia terminales y colisiones.
- [x] **CAD-05**: Algoritmo de detección geométrica de cruces perpendiculares y derivaciones.
- [x] **CAD-06**: Definición de bornas magnéticas (`ConnectionPort`) en simbología IEC 60617.
- [x] **CAD-07**: Algoritmo de auto-conexión magnética (*snap to pin*) con halo visual.
- [x] **CAD-08**: Adaptación elástica de cables (*rubber-banding*) al mover componentes por el plano.
- [x] **CAD-09**: Inspector de propiedades híbrido (panel lateral integrado + modal flotante desacoplable).
- [x] **CAD-10**: Suite de pruebas unitarias con Vitest (`tests/topology.test.ts` con 6/6 tests pasando).
- [x] **CAD-11**: Configuración de entorno Docker Desktop (`Dockerfile` y `docker-compose.yml`).
- [ ] **ZIP-01**: Especificación del formato portable `.axon.zip` (`project.json`, `metadata.json`, `bocetos/`).
- [ ] **ZIP-02**: Script CLI local para Agente IA (`scripts/empaquetar_proyecto.py`) con cálculo SHA-256.
- [ ] **ZIP-03**: Módulo Drag & Drop en Canvas Web para importar y exportar `.axon.zip` con `jszip`.
- [ ] **CAD-12**: Catálogo visual interactivo de simbología IEC 60617 con arrastre directo al canvas.
- **DoD**: Un ingeniero o agente local puede generar un `.axon.zip`, arrastrarlo a la GUI Web React 19, y continuar la edición en tiempo real a 60 FPS con rubber-banding activo.

### FASE 3: Backend y Servicios en Servidor Ubuntu AXON
- [ ] **SRV-01**: Aprovisionamiento de estructura en Ubuntu Server (`/opt/axon/diagrama-html/`).
- [ ] **SRV-02**: API REST en Node.js para navegación de carpetas de clientes y proyectos.
- [ ] **SRV-03**: Endpoint `POST /api/proyectos/importar-zip` para recibir e instalar paquetes `.axon.zip`.
- [ ] **SRV-04**: Microservicio Python (`PyMuPDF` / `ezdxf`) para extracción de planos PDF y conversión DXF en background.
- [ ] **SRV-05**: Configuración del reverse proxy Nginx con SSL, compresión gzip/brotli y HTTP/2.
- [ ] **SRV-06**: Implementación del Audit Trail inmutable ALCOA+ con base de datos de firmas.
- **DoD**: Un usuario puede subir un `.axon.zip` vía web o API y obtener almacenamiento centralizado con trazabilidad GAMP 5.

### FASE 4: Digitalización Asistida por IA en Servidor y GUI Completa
- [ ] **AI-01**: Microservicio FastAPI en Ubuntu Server para digitalización de bocetos vía Google Gemini 2.0 Flash / Claude 3.5 Sonnet Vision.
- [ ] **AI-02**: Pipeline de preprocesamiento de bocetos manuscritos con OpenCV (binarización y corrección de perspectiva).
- [ ] **GUI-01**: Dashboard principal de proyectos AXON (búsqueda por número, cliente y estado documental).
- [ ] **GUI-02**: Editor visual de cajetines y extractor de listado de materiales (BOM) a CSV.
- [ ] **GUI-03**: Exportador multi-formato en 1 clic (descarga directa de SVG, PDF vectorial A3 y ZIP con DXFs 1:1).
- **DoD**: Un usuario puede tomar una foto con su smartphone, subirla a la web y obtener el esquema inicial trazado automáticamente por la IA en el servidor.

### FASE 5: Calificación GAMP 5, Testing CI/CD y Puesta en Marcha
- [ ] **QA-01**: Suite de pruebas unitarias automatizadas en Vitest con cobertura >= 80%.
- [ ] **QA-02**: Suite de pruebas E2E en Playwright validando dibujo, corte, rubber-banding e impresión A3.
- [ ] **QA-03**: Pipeline de GitHub Actions para validación continua y despliegue automático a Ubuntu Server.
- [ ] **QA-04**: Protocolo de Calificación de Instalación y Operación (IQ/OQ) según GAMP 5.
- [ ] **QA-05**: Despliegue en producción estable en la intranet corporativa de AXON.
- **DoD**: Despliegue en producción validado documentalmente y en operación para proyectos reales.
