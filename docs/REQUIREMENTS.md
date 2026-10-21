# Especificación de Requerimientos de Usuario y Técnicos (URS)

**Documento:** REQ-01  
**Proyecto:** Diagrama-HTML (AXON CAD Web)  
**Versión:** 1.0.0  
**Fecha:** 2026-10-21  
**Estándar Regulatorio:** GAMP 5 (Categoría 4) / ALCOA+ / IEC 60617

---

## 1. Alcance y Contexto Regulatorio

Este documento define los requisitos funcionales y no funcionales para el sistema **Diagrama-HTML**.
En conformidad con **`axon-standard`** y los estándares industriales farmacéuticos (GxP), el sistema clasifica como **GAMP 5 Categoría 4** (Software de ingeniería configurable) con cumplimiento estricto de los principios **ALCOA+** para garantizar que los planos eléctricos digitalizados mantengan valor de evidencia técnica y legal.

---

## 2. Requerimientos de Cumplimiento Industrial (ALCOA+ / GAMP 5)

| Principio ALCOA+ | Implementación en Diagrama-HTML |
| :--- | :--- |
| **Attributable (Atribuible)** | Cada emisión o guardado registra en cajetín y metadatos: dibujado por, revisado por, aprobado por y código de proyecto. |
| **Legible (Legible)** | Prohibición absoluta de textos blancos sobre fondo blanco en modo impresión; contraste mínimo tipográfico según norma editorial. |
| **Contemporaneous (Contemporáneo)** | Registro de fecha en formato ISO `AAAA-MM-DD` generado al momento del cambio, sin fechas retroactivas en firmas. |
| **Original (Original)** | Preservación del bosquejo inicial o PDF recibido en carpeta protegida (`BOSQUEJO/` o `1_RECIBIDO/`), con historial en `OLD/` o `ANTERIORES/`. |
| **Accurate (Exacto)** | Geometría métrica exacta 1:1 en DIN A3 (420 x 297 mm, 1191 x 842 pt), con coordenadas trazables y exportación DXF precisa. |
| **Complete (Completo)** | Integración de todas las láminas del sistema (portada, unifilar, control, I/O PLC, regletas bornas y listado BOM). |
| **Consistent (Consistente)** | Nomenclatura uniforme según norma IEC 60617 / EPLAN, numeración correlativa y tags de aparamenta normalizados. |
| **Enduring (Duradero)** | Formatos abiertos vectoriales (SVG, HTML, DXF R12, CSS, JS plano), independientes de licencias o versiones de software privativo. |
| **Available (Disponible)** | Acceso instantáneo tanto offline en estaciones de trabajo como en red interna mediante el Servidor Ubuntu de AXON. |

---

## 3. Requerimientos Funcionales (RF)

### 3.1. Visualización y Navegación
- **RF-01 (Geometría Normalizada DIN A3)**: El lienzo debe ajustarse a las dimensiones estándar A3 horizontal (420 x 297 mm, ratio 1.4142), renderizando con nitidez vectorial en cualquier resolución de pantalla.
- **RF-02 (Navegación tipo Presentación)**: Permitir transición inmediata entre láminas mediante teclado (`←`, `→`, `D`, `A`, `Inicio`, `Fin`), selector dropdown con títulos largos y tira inferior de miniaturas interactivas.
- **RF-03 (Modo Continuo Vertical)**: Capacidad de alternar con la tecla `V` entre visualización de diapositiva única y visualización continua de todas las láminas apiladas en scroll vertical.
- **RF-04 (HUD de Coordenadas Métricas)**: Despliegue en la barra inferior de las coordenadas precisas del puntero del ratón en milímetros métricos reales (`X: 0..420 mm`, `Y: 0..297 mm`).
- **RF-05 (Zoom y Desplazamiento Panorámico)**: Control fluido con rueda de ratón centrado en el cursor (zoom in / zoom out), arrastre libre con botón izquierdo, ajuste a pantalla con tecla `0` / `R` y pantalla completa con `F`.

### 3.2. Gestión de Modos y Colorimetría
- **RF-06 (Conmutación de Modo AutoCAD vs Impresión)**:
  - Botón interactivo en navbar para alternar entre `MODEL SPACE (ACI)` (fondo oscuro `#131822`, colores AutoCAD Electrical) y `PAPER SPACE (DIN A3)` (papel blanco).
- **RF-07 (Inversión Forzada de Contraste en Modo Impresión)**:
  - En modo impresión, todos los elementos que en CAD son blancos (`fill="#ffffff"`, `stroke="#ffffff"`) deben forzarse automáticamente a negro puro (`#000000`).
  - Los textos plateados/grises deben pasar a gris pizarra oscuro (`#334155`).
  - Los fondos de envolventes o cajas oscuras deben pasar a blanco con contorno negro.
  - El logo oficial bicolor de AXON (`#2828ff` azul y `#f66c1e` naranja) debe preservarse intacto.
- **RF-08 (Configurador Dinámico de Colores de Impresión)**:
  - Modal accesible con 7 canales independientes de color:
    1. Celeste Claro / Cyan (Títulos, tags, recuadro de portada, neutro/0V).
    2. Textos Principales (Ex-Blanco a Negro).
    3. Textos Secundarios (Ex-Silver a Gris Pizarra).
    4. Azul Técnico (Marco exterior A3 y coordenadas 1-8 / A-F).
    5. Ámbar / Naranja (Tags de cable, bornas X1).
    6. Verde Industrial (Módulos PLC Inline, red Ethernet, estado OK).
    7. Rojo de Seguridad (Circuito paroEQ, línea 24V, acometida).
  - 5 presets corporativos de un solo clic: *Técnico AXON*, *Celeste Original CAD*, *Azul Marino*, *Azul Royal*, *Monocromo (B/N)*.
  - Sincronización en vivo en el DOM sin recargar la página y persistencia en `localStorage`.

### 3.3. Edición Asistida y Biblioteca de Símbolos
- **RF-09 (Modo Mover Textos - Tecla `M`)**: Arrastre libre con el ratón de cualquier texto o etiqueta, con controles de aumento/disminución de tamaño tipográfico (`A-` / `A+`, teclas `[` y `]`) y edición de contenido por doble clic.
- **RF-10 (Modo Mover Símbolos y Gizmo)**: Manipulación de símbolos complejos con barra de herramientas flotante: rotación en pasos de 90°, espejo horizontal/vertical, traer al frente (`T`), enviar al fondo y duplicar.
- **RF-11 (Biblioteca de Símbolos IEC 60617)**: Catálogo modal interactivo con buscador y copia rápida para inyectar aparamenta industrial (disyuntores, diferenciales, PLCs, fuentes, sensores).
- **RF-12 (Comparador con Boceto Original - Tecla `C`)**: Alternar en milisegundos entre el plano CAD vectorial y la imagen escaneada del bosquejo a mano alzada para control de calidad y verificación as-built.

### 3.4. Exportación e Impresión
- **RF-13 (Exportación DXF 1:1 para AutoCAD Electrical)**: Exportador en cliente capaz de convertir la lámina activa o el lote completo a archivos DXF R12 compatibles con AutoCAD a escala 1:1 métrica en milímetros.
- **RF-14 (Impresión Normalizada en Lote A3 - Tecla `P` / `Ctrl+P`)**: Impresión directa de las láminas en hojas separadas DIN A3 horizontal sin márgenes parásitos ni hojas en blanco sobrantes.

---

## 4. Requerimientos No Funcionales (RNF)

- **RNF-01 (Rendimiento)**: Carga y renderizado inicial de cualquier lámina vectorial en menos de 300 ms en estaciones estándar.
- **RNF-02 (Arquitectura Offline-First)**: La herramienta debe ser 100% funcional en estaciones locales de planta sin conexión a internet ni dependencias de CDNs externas.
- **RNF-03 (Compatibilidad)**: Funcionamiento uniforme en navegadores basados en Chromium (Google Chrome, Microsoft Edge, Brave) y Mozilla Firefox.
- **RNF-04 (Seguridad y Secretos)**: Cero almacenamiento de contraseñas, tokens de API o credenciales en los archivos de proyecto (`.gitignore` estricto).
- **RNF-05 (Mantenibilidad)**: Separación estricta de responsabilidades: estructura en HTML/SVG, diseño en CSS parametrizado con variables, lógica en módulos JS desacoplados.
