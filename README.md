# Diagrama-HTML — Creador y Visor Web de Diagramas Eléctricos Industriales

[![AXON CAD Standard](https://img.shields.io/badge/Standard-IEC%2060617%20%7C%20EPLAN-blue.svg)](#)
[![Industrial Compliance](https://img.shields.io/badge/Compliance-GAMP%205%20%7C%20ALCOA%2B-green.svg)](#)
[![Output Format](https://img.shields.io/badge/Output-DIN%20A3%20(420x297mm)%20%7C%20DXF%201%3A1-orange.svg)](#)
[![Repository](https://img.shields.io/badge/GitHub-epinocl%2FDiagrama--HTML-181717?logo=github)](https://github.com/epinocl/Diagrama-HTML)

Sistema de ingeniería de software para digitalización, edición asistida, visualización tipo presentación (PPT), configuración dinámica de colores, exportación métrica DXF e impresión en escala 1:1 de planos eléctricos industriales en formato normalizado **DIN A3 Horizontal (420 x 297 mm)**.

Este repositorio es la base central que evoluciona desde la herramienta local offline de AXON Ingeniería hacia una **Plataforma Web alojada en el Servidor Ubuntu de AXON**, con arquitectura cliente-servidor e interfaz gráfica de usuario interactiva (GUI Web).

---

## 📌 Visión del Proyecto y Fases de Desarrollo

El objetivo principal es dotar a AXON de un software propio de planos eléctricos en la nube interna, eliminando la dependencia de licencias CAD costosas para visualización y revisiones técnicas, asegurando integridad de datos (**ALCOA+**) y conformidad regulatoria farmacéutica e industrial (**GAMP 5**).

| Fase | Alcance | Estado |
| :--- | :--- | :---: |
| **Fase 1** | **Estandarización y Documentación** (Arquitectura, Requerimientos, Dependencias, Roadmap, Avances) | 🚀 **ACTUAL** |
| **Fase 2** | **Modularización del Código Fuente (`src/`)** (Desacoplar motor SVG, lógica de arrastre, convertidor DXF) | 📋 Planificada |
| **Fase 3** | **Backend y Servicios en Servidor Ubuntu** (API Node/Python, extracción PDF, almacenamiento multi-proyecto) | 📋 Planificada |
| **Fase 4** | **Interfaz Gráfica Web Integral (GUI Web)** (Dashboard de proyectos, explorador, canvas interactivo) | 📋 Planificada |
| **Fase 5** | **Testing Automatizado, CI/CD y Calificación GxP** (Jest, Pytest, Playwright, GitHub Actions) | 📋 Planificada |

---

## 🛠️ Capacidades Principales del Sistema

1. **Dualidad de Entorno: Modo AutoCAD vs Modo Impresión**:
   - `MODEL SPACE (ACI)`: Entorno de trabajo oscuro de alto contraste tradicional de AutoCAD Electrical.
   - `PAPER SPACE (DIN A3)`: Lámina blanca editorial normalizada con inversión forzada de textos blancos a negro y fondos limpios para lectura técnica.
2. **Configurador Dinámico de Colores de Impresión**:
   - 7 canales configurables (Celeste Claro/Cyan `#38bdf8`, Textos Ex-Blanco a Negro `#000000`, Textos Ex-Silver a Gris Pizarra `#334155`, Azul Técnico `#1e3a8a`, Ámbar `#b45309`, Verde `#15803d`, Rojo `#dc2626`).
   - 5 Presets de un clic: *Técnico AXON*, *Celeste Original CAD*, *Azul Marino*, *Azul Royal*, *Monocromo (B/N)*.
3. **Exportador Vectorial DXF 1:1 para AutoCAD Electrical**:
   - Conversión matemática real de elementos SVG a primitivas DXF R12 en milímetros métricos (420 x 297 mm), con capas estructuradas (`CAD_TEXT`, `CAD_LINES`, `CAD_COMP`, `CAD_WIRES`) y colores estándar ACI.
4. **Manipulación Interactiva de Textos y Símbolos**:
   - Reubicación con el ratón (Drag & Drop), ajuste de tamaño de tipografía en caliente (`A-` / `A+`), doble clic para edición de contenido.
   - Gizmo flotante de transformación para símbolos: rotación de 90°, reflejo espejo, orden de apilamiento (traer al frente / enviar al fondo).
5. **Biblioteca de Simbología Normalizada IEC 60617**:
   - Inserción modular de componentes: disyuntores, diferenciales, fuentes de poder, PLCs, relés de interfase, bornas y conectores multipolares.
6. **HUD Métrico en Tiempo Real**:
   - Indicador continuo de coordenadas reales en el plano ISO A3 (`X: 0..420 mm`, `Y: 0..297 mm`).
7. **Salida Normalizada A3 en Lote**:
   - Impresión sin márgenes parásitos ni hojas en blanco adicionales (`@media print` y contenedor de impresión exclusivo).

---

## 📁 Estructura del Repositorio (Estándar Davichuder + AXON)

```text
DIAGRAMA-HTML/
├── README.md                          # Visión general, manual de inicio y catálogo de capacidades
├── .gitignore                         # Exclusiones estrictas para Node, Python, logs y OS
├── docs/                              # DOCUMENTACIÓN HUMANA OBLIGATORIA (Fase 1)
│   ├── ARCHITECTURE.md                # Arquitectura técnica, diagramas C4 y diseño cliente-servidor
│   ├── REQUIREMENTS.md                # URS, Casos de Uso, Requisitos Funcionales y GAMP 5 / ALCOA+
│   ├── DEPENDENCIES.md                # Inventario de dependencias frontend, backend y servidor Ubuntu
│   ├── PLANS.md                       # Planes maestros de implementación y migración a Ubuntu Server
│   ├── ROADMAP.md                     # Cronograma detallado de entregables por fases
│   ├── PRODUCTION_CHECKLIST.md        # Lista de verificación de calidad, seguridad y rendimiento
│   └── avances/                       # Trazabilidad de Avances según AXON-STANDARD
│       └── AV-20261021-001-inicializacion-fase-1-documentacion.md
├── src/                               # CÓDIGO FUENTE
│   ├── css/                           # Hojas de estilo maestras (layout-a3, print-a3, presentador-ppt)
│   ├── js/                            # Motores interactivos (presentador, configurador, exportador dxf, editores)
│   ├── simbologia/                    # Biblioteca de símbolos IEC y cajetines normalizados
│   ├── templates/                     # Plantillas maestras individual y multilámina
│   └── herramientas_offline/          # Automatizaciones Python de generación y extracción de PDFs
└── tests/                             # PRUEBAS Y VALIDACIÓN (Fase 5)
    ├── unit/                          # Pruebas unitarias de parsers y transformaciones
    ├── integration/                   # Pruebas de integración visual y de exportación DXF
    └── fixtures/                      # SVGs, PDFs y datos de prueba normalizados
```

---

## 📜 Estándares y Cumplimiento Aplicados

- **Ingeniería de Software**: Aplicación del estándar **Davichuder** (separación estricta de `docs/`, `src/`, `tests/` y control de calidad continuo).
- **Entorno Industrial**: Normativas **GAMP 5** (Software Categoría 4/5 para ingeniería eléctrica) y principios **ALCOA+** (trazabilidad, inmutabilidad y registro de autoría en cada revisión técnica).
- **Normas Técnicas Eléctricas**: **IEC 60617** (Símbolos gráficos para esquemas), **IEC 61082** (Preparación de documentos usados en electrotecnia) e **ISO 5457** (Formatos y presentación de dibujos técnicos DIN A3).

---

## 🚀 Despliegue y Ejecución

### Ejecución Local Inmediata (Fase Actual)
Abre directamente cualquiera de las plantillas en un navegador moderno (Chrome, Edge, Firefox):
```powershell
Start-Process "src\templates\plantilla_multilamina.html"
```

### Próximo Despliegue en Servidor Ubuntu (Fase 3 & 4)
- **Host**: Servidor Ubuntu AXON (`192.168.x.x` / dominio interno).
- **Reverse Proxy**: Nginx con SSL/TLS interno.
- **Runtime**: Node.js LTS (API REST y WebSockets) + Python 3.11+ (Motor PyMuPDF y ezdxf).

---

## 👥 Autores y Mantenedores
- **AXON Ingeniería Eléctrica SpA**
- Repositorio Oficial: [https://github.com/epinocl/Diagrama-HTML](https://github.com/epinocl/Diagrama-HTML)
