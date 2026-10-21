# Inventario y Gestión de Dependencias

**Documento:** DEP-01  
**Proyecto:** Diagrama-HTML (AXON CAD Web)  
**Versión:** 1.0.0  
**Fecha:** 2026-10-21  

---

## 1. Filosofía de Dependencias

Para entornos industriales de alta criticidad y plantas farmacéuticas, la regla de oro es **minimizar la huella de dependencias externas** ("Zero-Bloat"). 
El motor de renderizado vectorial opera sobre tecnologías estándar del W3C (SVG 1.1, CSS3, ES6+) sin librerías pesadas de frontend en el núcleo gráfico, asegurando:
1. Rendimiento fluido de 60 FPS al manipular esquemas complejos con miles de nodos.
2. Inmunidad ante vulnerabilidades de la cadena de suministro de paquetes npm.
3. Operatividad 100% offline en estaciones de planta aisladas de internet.

---

## 2. Dependencias del Frontend (Lado Cliente / Visor y Editor)

| Componente | Tecnología | Versión | Propósito | Dependencia Externa |
| :--- | :--- | :---: | :--- | :---: |
| **Estructura Gráfica** | SVG Vectorial W3C | 1.1 / 2.0 | Renderizado de planos DIN A3 (1191 x 842 pt) | Ninguna (Nativa) |
| **Estilos & Layout** | CSS3 (Variables, Grid, Flex) | W3C Rec. | Paletas de color, Modos AutoCAD/Impresión, `@media print` | Ninguna (Nativa) |
| **Lógica de Interfaz** | Vanilla JavaScript | ES2022+ | Control de zoom, pan, arrastre de textos, gizmos, modales | Ninguna (Nativa) |
| **Tipografía Técnica** | OpenType / Sistema | - | `ISOCPEUR`, `Consolas`, `Segoe UI`, `Arial` | Fuentes de sistema |
| **Motor DXF Cliente** | JavaScript puro (`exportador_dxf.js`) | 1.0 | Conversor matemático de SVG a primitivas DXF R12 en mm | Ninguna (Nativa) |

---

## 3. Dependencias de Automatización Local (Python Tools)

Herramientas ubicadas en `src/herramientas_offline/` para extracción y preprocesamiento de planos:

| Paquete Python | Versión Recomendada | Licencia | Propósito | Requerido |
| :--- | :---: | :---: | :--- | :---: |
| **Python** | 3.10+ / 3.11+ / 3.12+ | PSF | Runtime de ejecución de scripts | Sí |
| **PyMuPDF (`fitz`)** | >= 1.23.0 | AGPL / Comercial | Extracción directa de páginas PDF como SVG vectoriales limpios | Sí (para ingestión PDF) |
| **Pillow (`PIL`)** | >= 10.0.0 | HPND | Generación y reescalado de miniaturas rasterizadas (PNG) a 72 DPI | Sí (para miniaturas) |
| **ezdxf** | >= 1.1.0 | MIT | Validación e inspección de archivos DXF exportados | Opcional |

Instalación en entorno de desarrollo:
```powershell
pip install PyMuPDF Pillow ezdxf
```

---

## 4. Dependencias del Servidor Ubuntu (Servidor AXON - Fases 3 & 4)

Infraestructura planificada para alojar la plataforma centralizada en el Servidor Ubuntu:

| Servicio / Software | Versión | Rol en la Arquitectura | Configuración |
| :--- | :---: | :--- | :--- |
| **Ubuntu Server** | 22.04 LTS / 24.04 LTS | Sistema Operativo base | Kernel Linux 6.x |
| **Nginx** | >= 1.18.0 | Reverse proxy, servidor estático, SSL y compresión gzip | `/etc/nginx/sites-available/` |
| **Node.js** | 20.x LTS | Runtime para API REST y servicio de proyectos | Administrado vía PM2 |
| **Express / Fastify** | >= 4.19.0 / >= 4.26.0 | Framework HTTP liviano para gestión de proyectos y archivos | API REST en puerto interno 3050 |
| **PM2** | >= 5.3.0 | Gestor de procesos Node.js con auto-reinicio y rotación de logs | `pm2 start server.js` |
| **Git** | >= 2.34.0 | Control de versiones y despliegue continuo desde GitHub | Integrado con `epinocl/Diagrama-HTML` |

---

## 5. Dependencias del Entorno de Pruebas (Fase 5)

| Herramienta | Rol | Ámbito |
| :--- | :--- | :--- |
| **Vitest / Jest** | Pruebas unitarias automatizadas | Lógica de cálculo de coordenadas, inversión de estilos y parser DXF |
| **Playwright** | Pruebas E2E en navegadores reales | Validación de apertura, interacción con el ratón, zoom y generación de PDF |
| **Pytest** | Pruebas de scripts Python | Validación de extracción de páginas vectoriales desde PDFs |
