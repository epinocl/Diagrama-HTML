# Hoja de Ruta del Proyecto (Roadmap) — Diagrama-HTML

**Documento:** RDM-01  
**Proyecto:** Diagrama-HTML (AXON CAD Web)  
**Versión:** 1.0.0  
**Fecha:** 2026-10-21  

---

## 📅 Cronograma Estratégico de Fases

```text
2026-Q4                       2026-Q4 / 2027-Q1             2027-Q1                       2027-Q1 / Q2
[FASE 1: DOCUMENTACIÓN] ───> [FASE 2: MODULARIZACIÓN] ───> [FASE 3: BACKEND UBUNTU] ───> [FASE 4: GUI WEB & PROD]
  (Estado: Completado)          (Arquitectura src/)           (API, Nginx, Storage)        (Testing GAMP 5 & Deploy)
```

---

## 🎯 Desglose de Fases y Criterios de Aceptación (Definition of Done)

### FASE 1: Inicialización, Gobernanza y Documentación (ACTUAL)
- [x] Inicializar repositorio Git en `C:\IA EPINO LOCAL\DIAGRAMA-HTML` vinculado a `https://github.com/epinocl/Diagrama-HTML`.
- [x] Configuración de `.gitignore` integral para entornos Node, Python y sistemas operativos.
- [x] Definición formal de la Arquitectura del Sistema (`docs/ARCHITECTURE.md`).
- [x] Especificación de Requerimientos de Usuario (URS) con cumplimiento GAMP 5 y ALCOA+ (`docs/REQUIREMENTS.md`).
- [x] Inventario exhaustivo de dependencias (`docs/DEPENDENCIES.md`).
- [x] Planes maestros de implementación y migración a Ubuntu Server (`docs/PLANS.md`).
- [x] Checklist de control de producción (`docs/PRODUCTION_CHECKLIST.md`).
- [x] Registro inicial de avance según `axon-standard` (`docs/avances/AV-20261021-001-inicializacion-fase-1-documentacion.md`).
- [x] Migración inicial del código base desde `HERRAMIENTAS/Diagrama-html` hacia `src/`.

### FASE 2: Modularización y Clean Architecture (`src/`)
- [ ] Desacoplar `presentador.js` en módulos especializados ES6: `viewport.js`, `theme.js`, `hud.js`, `slide_strip.js`.
- [ ] Separar `configurador_colores.js` para desacoplar el estado de la UI del motor de inyección de estilos.
- [ ] Empaquetar `exportador_dxf.js` como módulo independiente reutilizable tanto en cliente como en Node.js.
- [ ] Estandarizar la biblioteca de símbolos IEC 60617 en un índice estructurado JSON/SVG.
- **DoD**: El código fuente en `src/` no contiene funciones globales dependientes de orden arbitrario de carga en HTML.

### FASE 3: Backend y Servicios en Ubuntu Server
- [ ] Configuración del servidor Ubuntu en AXON (`/opt/axon/diagrama-html/`).
- [ ] Desarrollo de la API REST liviana en Node.js para navegación de carpetas de clientes y proyectos.
- [ ] Integración del microservicio Python (`PyMuPDF`) para extracción automatizada de páginas desde PDFs.
- [ ] Configuración del reverse proxy Nginx con compresión gzip, caché de activos estáticos y SSL.
- [ ] Implementación del Audit Trail ALCOA+ (registro inmutable de cambios y firmas de revisión).
- **DoD**: Un usuario puede subir un PDF de planos vía API y obtener automáticamente el visor web A3 estructurado.

### FASE 4: Interfaz Gráfica Web Integral (GUI Web)
- [ ] Desarrollo del Dashboard principal de proyectos AXON (búsqueda por número, cliente y estado).
- [ ] Canvas de edición web con barra de herramientas unificada y paleta lateral de componentes IEC.
- [ ] Editor visual interactivo de cajetines y tablas BOM.
- [ ] Sistema de exportación multi-formato con un solo clic (descarga directa de SVG, PDF vectorial y ZIP de DXFs).
- **DoD**: Experiencia de usuario completa en navegador web sin requerir manipular archivos manualmente en disco.

### FASE 5: Calificación GAMP 5, Testing CI/CD y Puesta en Marcha
- [ ] Suite de pruebas unitarias en Jest/Vitest y Pytest con cobertura mínima del 80% en motores de cálculo.
- [ ] Suite de pruebas E2E en Playwright validando flujos de edición, zoom e impresión.
- [ ] Pipeline de GitHub Actions para validación automática de pull requests y despliegue a Ubuntu Server.
- [ ] Protocolo de Calificación de Instalación y Operación (IQ/OQ) según GAMP 5 para clientes farmacéuticos.
- **DoD**: Despliegue en producción estable en la intranet de AXON con validación documental completa.
