# Sistema de Planos Eléctricos en HTML - Plantillas y Visor A3 (AXON CAD)

Sistema 100% offline para diseño, digitalización, visualización, navegación estilo presentación (PPT) e impresión en formato normalizado **A3 Horizontal (420 x 297 mm)** de esquemas eléctricos industriales según normas IEC 60617 / EPLAN.

---

## 🚨 REGLA FUNDAMENTAL DE UBICACIÓN (SALIDA OBLIGATORIA)

> [!IMPORTANT]
> **NUNCA guardar archivos de un encargo o cliente dentro de `HERRAMIENTAS/Diagrama-html/`.**
> Esta carpeta es exclusivamente la infraestructura base, biblioteca de componentes y herramientas offline.
>
> Cuando la herramienta sea llamada para trabajar en un proyecto, **siempre** debe guardar el HTML y sus dependencias en:
> 1. **Si el origen es un Bosquejo (`BOSQUEJO/`):**
>    - Se guarda en la **carpeta raíz de la carpeta del bosquejo** (el directorio padre contenedor de `BOSQUEJO/`).
>    - *Ejemplo:* Si el bosquejo está en `C:\...\5266 polyphem blistera 3\CAD\BOSQUEJO`, el HTML y la carpeta `dependencias/` deben quedar en `C:\...\5266 polyphem blistera 3\CAD\`.
> 2. **Si el origen es un archivo PDF:**
>    - Se guarda en la **misma carpeta donde está ubicado el PDF**.
>    - *Ejemplo:* Si el plano está en `C:\...\1_RECIBIDO\plano.pdf`, el HTML y la carpeta `dependencias/` deben quedar en `C:\...\1_RECIBIDO\`.

### 📂 Estructura Generada en el Destino del Proyecto
```text
<CARPETA_DESTINO>/                    (ej. CAD/ o 1_RECIBIDO/)
├── index.html                        (Visor directo de acceso inmediato)
├── diagrama_<codigo>_<nombre>.html   (Visor principal de presentación A3)
├── BOSQUEJO/ o plano.pdf             (Insumo original de entrada)
└── dependencias/
    ├── css/                          (layout-a3.css, presentador-ppt.css, print-a3.css)
    ├── js/                           (datos_proyecto.js, hojas_svg_inline.js, presentador.js, editor_textos.js, zoom-pan.js)
    ├── hojas/                        (hoja_01.svg, hoja_02.svg, ...)
    │   └── miniaturas/               (thumb_01.png, thumb_02.png, ...)
    └── bocetos_originales/           (boceto_01.png, ... para alternar con 'C' si aplica)
```

---

## 🛠️ Herramientas Offline Automatizadas

En `herramientas_offline/` dispones de scripts que aplican automáticamente esta regla:

### 1. Iniciar Proyecto desde Bosquejo o PDF (`iniciar_proyecto.py`)
Detecta automáticamente el tipo de origen, resuelve el directorio de salida según la regla, copia las dependencias y crea el visor listo para usar:
```powershell
python herramientas_offline\iniciar_proyecto.py "<ruta_a_bosquejo_o_pdf>" [codigo] [cliente] [titulo]
```
- *Ejemplo Bosquejo:*
  `python herramientas_offline\iniciar_proyecto.py "C:\...\CAD\BOSQUEJO" DE-5266 "EUROFARMA" "VISION BLISTERA 3"`
  *(Genera todo automáticamente en `C:\...\CAD\`)*.
- *Ejemplo PDF:*
  `python herramientas_offline\iniciar_proyecto.py "C:\...\CAD\ELECTRICAL\plano.pdf"`
  *(Genera todo automáticamente en `C:\...\CAD\ELECTRICAL\`)*.

### 2. Extractor de PDFs a SVG y Miniaturas (`extraer_hojas_pdf.py`)
Convierte cada página del PDF en un SVG vectorial puro a 1191x842 pt y genera el visor completo en la misma carpeta del PDF:
```powershell
python herramientas_offline\extraer_hojas_pdf.py "<ruta_al_archivo.pdf>"
```

### 3. Creador de Nueva Lámina (`crear_nueva_hoja.py`)
Genera una lámina individual a partir de la plantilla A3 con cajetín preconfigurado:
```powershell
python herramientas_offline\crear_nueva_hoja.py [num] [codigo] [cliente] [titulo] [disciplina] [ruta_destino_o_bosquejo]
```

---

## 📁 Estructura del Directorio `Diagrama-html/`

```text
HERRAMIENTAS/Diagrama-html/
├── AGENTS.md                          # Reglas e instrucciones estrictas para agentes de IA
├── README.md                          # Documentación del sistema y reglas de ubicación
├── plantilla.html                     # [PLANTILLA 1] Lámina A3 Individual interactiva (Drag & Edit, Colores, Cajetín 90pt, Zoom)
├── plantilla_multilamina.html         # [PLANTILLA 2] Proyecto Completo Multilámina A3 (Acceso directo a visor PPT 4 láminas)
├── plantilla_multilamina/             # Carpeta lista para clonar de la Plantilla 2 (Proyecto Multilámina DE-4710)
│   ├── index.html                     # Visor y editor interactivo del conjunto
│   ├── dependencias/                  # Hojas SVG, miniaturas, bocetos, CSS y scripts
│   └── README.md                      # Instrucciones de uso para nuevos proyectos
├── index.html                         # Visor y Presentador de 38 láminas de referencia (DE-1708 Pick and Place)
├── catalogo_simbolos.html             # Catálogo interactivo de simbología con buscador y copia rápida
├── css/
│   ├── layout-a3.css                  # Geometría A3 landscape (420x297 mm), ratio 1.414 y escenario
│   ├── presentador-ppt.css            # Controles PPT, herramientas interactivas, swatches y modales
│   ├── print-a3.css                   # Reglas @media print para impresión a escala 1:1 sin bordes
│   └── catalogo.css                   # Estilos del catálogo de componentes y símbolos
├── js/
│   ├── presentador.js                 # Lógica PPT, cambio de lámina, modo continuo, HUD de coordenadas e inversión de impresión
│   ├── configurador_colores.js        # Configurador dinámico de paletas de impresión (7 conjuntos de colores, 5 presets)
│   ├── exportador_dxf.js              # Conversor vectorial SVG a DXF métrico 1:1 real para AutoCAD Electrical
│   ├── editor_textos.js               # Motor de arrastre v2 con aislamiento por lámina, tamaño y colores
│   ├── editor_simbolos.js             # Motor de arrastre/rotación de símbolos, Gizmo y biblioteca IEC 60617
│   ├── zoom-pan.js                    # Zoom fluido con rueda de ratón y arrastre (pan)
│   ├── datos_proyecto.js              # Metadatos del proyecto y catálogo de láminas
│   └── catalogo_datos.js              # Base de datos de símbolos para carga offline directa
├── hojas/                             # Hojas vectoriales del proyecto DE-1708
├── simbologia/                        # Biblioteca de símbolos clasificada por disciplina (IEC / EPLAN)
│   └── cajetines_marcos/              # Cajetín 930x90, marco A3, cajetín portada 1125x72 y logo AXON vectorial
├── ejemplos/
│   └── 4710_CONTROL_SEMAFOROS/        # Ejercicio real digitalizado DE-4710 (Garden House)
└── herramientas_offline/              # Scripts Python de automatización para generar láminas
```

---

## 🎯 Las Dos Plantillas Disponibles

### 📄 Plantilla 1: Lámina Individual A3 Interactiva (`plantilla.html`)
Diseñada para crear, editar o digitalizar **una lámina eléctrica independiente** (esquema unifilar, fuerza o control):
- **Cajetín Ampliado AXON (90 pt)**: Celdas amplias, textos legibles y sin abreviaturas forzadas.
- **Herramienta "🖐️ Mover Textos" (Tecla `M`)**: Arrastra libremente cualquier etiqueta o tag con el ratón.
- **Controles de Tamaño de Letra**: Botones `A-` / `A+` y teclas `[` y `]`.
- **Paleta de Colores Eléctricos**: 8 swatches rápidos (blanco, negro carbón, azul neutro, rojo 24V, verde OK, ámbar alerta, cian display, verde neón) + selector nativo HTML5.
- **Doble Clic para Editar**: Modifica cualquier texto directamente en pantalla.
- **Guardar / Exportar (Tecla `S` / `Ctrl+S`)**: Descarga el SVG limpio, guarda nueva versión o genera el HTML autónomo.
- **Zoom / Pan**: Rueda de ratón centrada en cursor, arrastre con botón izquierdo, botones de zoom y pantalla completa (`F`).

### 📦 Plantilla 2: Proyecto Completo Multilámina (`plantilla_multilamina.html` / `plantilla_multilamina/`)
Ideal para proyectos completos con varias láminas organizadas (portada, fuerza, control, I/O PLC, bornas):
- **⚡ Modo AutoCAD vs 📄 Modo Impresión**: Conmuta con un solo clic entre el espacio de modelo oscuro de AutoCAD Electrical (`MODEL SPACE ACI`) y el espacio papel blanco de impresión editorial (`PAPER SPACE DIN A3`).
- **🎨 Configurador Dinámico de Colores de Impresión**: Ajusta en vivo los 7 canales de color de la lámina (celeste claro/cyan, textos ex-blancos a negro, textos secundarios ex-silver, azul técnico, ámbar, verde industrial y rojo) con 5 presets de 1 clic (Técnico AXON, Celeste Original CAD, Azul Marino, Azul Royal y Monocromo B/N).
- **📐 Exportador Directo a DXF (AutoCAD Electrical 1:1 en mm)**: Genera archivos DXF R12 compatibles nativamente con AutoCAD, con capas normalizadas (`CAD_TEXT`, `CAD_LINES`, `CAD_COMP`, etc.) y escala métrica real de 420x297 mm, eliminando el problema de láminas reducidas al importar desde PDF.
- **Navegación Diapositivas PPT**: Flechas de teclado `→` / `D`, `←` / `A`, `Inicio`, `Fin`.
- **Tira Inferior de Diapositivas**: Miniaturas visuales interactivas de cada hoja.
- **Selector Rápido y Contador**: Salto inmediato a cualquier lámina.
- **HUD Métrico en Tiempo Real**: Coordenadas de cursor en milímetros normalizados DIN A3 (X: 0..420 mm, Y: 0..297 mm).
- **Modo Continuo Vertical (Tecla `V`)**: Muestra todas las láminas en secuencia vertical con desplazamiento.
- **Modo "🖐️ Mover Textos" (Tecla `M`)**: Manipulación directa con almacenamiento `v2` seguro por lámina.
- **Modo "🔲 Mover Símbolos"**: Arrastre libre de componentes (sensores, cámaras, PLCs, disyuntores, borneras).
- **Gizmo Flotante de Símbolos**: Botones para rotación de 90°, espejo horizontal/vertical, traer al frente (`T`), enviar al fondo, duplicar, escalar y borrar.
- **⚡ Biblioteca de Símbolos IEC 60617**: Catálogo modal con previsualización vectorial e inserción con un clic.
- **Soporte Portada / Carátula**: Cajetín de ancho completo (`cajetin_portada_ancho_completo.svg`) con tabla de modificaciones, aprobaciones y logo oficial vectorial AXON (`axon_logo_vector.svg`).
- **Comparador con Boceto a Mano Alzada (Tecla `C`)**: Alterna en milisegundos entre el plano CAD vectorial y la foto/escaneo del boceto para control de calidad.
- **Panel Lateral TOC y BOM**: Índice técnico y Listado de Materiales (BOM) integrado.
- **Impresión Normalizada en Lote (Tecla `P` / `Ctrl+P`)**: Imprime todas las láminas en hojas separadas A3 1:1 sin duplicados ni saltos en blanco, con inversión forzada de textos blancos a negro.
- **Guardado y Versionado**: Sobreescritura individual de SVG, generación de revisiones (REV. A, REV. B, etc.) o guardado permanente del conjunto.

---

## ⌨️ Atajos de Teclado del Sistema

| Tecla | Acción |
| :--- | :--- |
| `→` / `D` / `Espacio` | Lámina siguiente |
| `←` / `A` / `Retroceso` | Lámina anterior |
| `Inicio` / `Fin` | Primera / Última lámina |
| `M` | Activar / desactivar modo para arrastrar y mover textos |
| `T` | Traer texto o símbolo seleccionado al frente |
| `[` / `]` o `-` / `+` | Disminuir / aumentar tamaño de letra del texto seleccionado |
| `C` | Alternar entre plano CAD y boceto original escaneado |
| `V` | Alternar vista continua vertical (todas las láminas) |
| `S` / `Ctrl + S` | Abrir modal de Guardar / Versionar / Exportar |
| `P` / `Ctrl + P` | Imprimir en hoja A3 Horizontal (escala 1:1) |
| `0` o `R` | Encajar zoom en pantalla (Reset zoom) |
| `F` | Pantalla completa |
| `B` | Abrir / cerrar panel lateral de Índice y BOM |
| `Esc` | Cerrar paneles, modales abiertos y deseleccionar elementos |
