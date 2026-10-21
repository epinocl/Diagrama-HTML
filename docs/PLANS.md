# Planes de Trabajo e Implementación — Diagrama-HTML (AXON CAD Web)

**Documento:** PLN-01  
**Proyecto:** Diagrama-HTML (AXON CAD Web)  
**Versión:** 1.0.0  
**Fecha:** 2026-10-21  
**Alineación:** GAMP 5 Life Cycle Approach / AXON-STANDARD

---

## 1. Plan Maestro de Evolución del Proyecto

El proyecto se estructura en cinco planes específicos de trabajo para asegurar una transición ordenada desde los scripts y plantillas estáticas hacia la plataforma web en el Servidor Ubuntu:

```text
[PLAN 1: Documentación & Scaffolding] (FASE ACTUAL)
                  ↓
[PLAN 2: Modularización de Código en src/]
                  ↓
[PLAN 3: Backend & Servicios en Ubuntu Server]
                  ↓
[PLAN 4: Interfaz Gráfica Web Centralizada (GUI Web)]
                  ↓
[PLAN 5: Calificación GAMP 5, Testing & Despliegue en Producción]
```

---

## 2. Plan Detallado por Componente

### PLAN 1: Estandarización y Documentación Base (Fase Actual)
- **Objetivo**: Establecer el repositorio Git central, definir arquitectura, formalizar requerimientos (URS), inventariar dependencias y trazar el primer registro de avance según `axon-standard`.
- **Entregables**:
  - `README.md`
  - `docs/ARCHITECTURE.md`
  - `docs/REQUIREMENTS.md`
  - `docs/DEPENDENCIES.md`
  - `docs/PLANS.md`
  - `docs/ROADMAP.md`
  - `docs/PRODUCTION_CHECKLIST.md`
  - `docs/avances/AV-20261021-001-inicializacion-fase-1-documentacion.md`
  - Inicialización de Git con rama `main` y remoto `https://github.com/epinocl/Diagrama-HTML.git`.

### PLAN 2: Modularización y Refactorización del Código (`src/`)
- **Objetivo**: Separar el código monolítico actual en módulos limpios y desacoplados con responsabilidades únicas:
  - `src/core/viewport.js`: Control del lienzo, matriz de transformación, zoom y pan.
  - `src/core/theme.js`: Conmutador de temas (AutoCAD oscuro vs Impresión blanco) y motor de contraste.
  - `src/core/hud.js`: Rastreador de coordenadas métricas ISO A3.
  - `src/modules/color_configurator.js`: Gestor de paletas de impresión de 7 canales y presets.
  - `src/modules/dxf_exporter.js`: Generador de entidades DXF R12 en milímetros reales.
  - `src/modules/text_editor.js`: Lógica de arrastre de textos, cambio de tamaño y persistencia.
  - `src/modules/symbol_editor.js`: Transformador de símbolos, gizmo de rotación y biblioteca IEC.
- **Criterio de éxito**: Módulos independientes que puedan ser cargados mediante ES Modules o empaquetados sin variables globales huérfanas.

### PLAN 3: Backend y Servicios en Servidor Ubuntu (AXON Server)
- **Objetivo**: Implementar la capa de servicios en el servidor Ubuntu de AXON para dar soporte a múltiples proyectos y clientes:
  - Configuración del servicio Node.js con Express / Fastify para gestión de proyectos.
  - Servicio de ingesta y procesamiento de PDFs vectoriales (`PdfVectorExtractor`).
  - Almacenamiento seguro por cliente y proyecto con trazabilidad GAMP 5 y preservación de históricos (`ANTERIORES/`).
  - Configuración del reverse proxy en Nginx con compresión y políticas de seguridad perimetral.

### PLAN 4: Interfaz Gráfica Web Integral (GUI Web)
- **Objetivo**: Crear la interfaz gráfica web definitiva que unifique la gestión y edición:
  - **Dashboard de Proyectos**: Explorador de carpetas de clientes, búsqueda por número de proyecto (ej. `5266`, `4710`) y estado documental.
  - **Lienzo de Diseño Unificado**: Visualizador interactivo de planos con barra de herramientas completa, catálogo lateral de componentes IEC y panel de BOM en tiempo real.
  - **Exportador Multi-formato**: Descarga en 1 clic de SVG, PDF vectorial normalizado y paquetes ZIP con DXFs escala 1:1.

### PLAN 5: Testing Automatizado, Calificación GxP y Despliegue
- **Objetivo**: Validar el software bajo estándares de ingeniería y asegurar robustez para plantas farmacéuticas:
  - Pruebas unitarias de conversión geométrica y parsers DXF.
  - Pruebas E2E en Playwright para verificar navegación, click-flows y renderizado en impresión.
  - Checklist de producción (`docs/PRODUCTION_CHECKLIST.md`) completado y firmado.
  - Pipeline de integración continua (CI) en GitHub Actions hacia el Servidor Ubuntu.

---

## 3. Matriz de Riesgos Técnicos y Mitigaciones

| Riesgo Técnico | Impacto | Probabilidad | Estrategia de Mitigación |
| :--- | :---: | :---: | :--- |
| **Caché persistente en navegadores (`file:///`)** | Alto | Alta | Incorporación obligatoria de estilos en línea en plantillas maestras y cache-busters estrictos (`?v=X.X`). |
| **Escala distorsionada en AutoCAD Electrical al abrir DXF** | Crítico | Media | Mantener coordenadas métricas reales (420x297 mm) en R12, eliminando coordenadas de píxel sin escalar. |
| **Pérdida de legibilidad en impresión física o PDF** | Alto | Media | Reglas universales forzadas en `@media print` y función activa `forzarContrasteImpresion` en el visor. |
| **Sobreescritura accidental de planos vigentes** | Crítico | Baja | Política estricta de respaldos automáticos en `OLD/` y versionado documental (`REV. A`, `REV. B`). |
