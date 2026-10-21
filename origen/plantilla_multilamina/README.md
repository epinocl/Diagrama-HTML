# Plantilla de Proyecto Multilámina A3 - AXON CAD

Esta carpeta contiene la **Segunda Plantilla (Proyecto Completo Multilámina)** del sistema AXON CAD, basada en el ejercicio real normalizado **DE-4710 Control Semáforos de Agua (Garden House)**.

---

## 📦 ¿Qué incluye esta plantilla?

1. **Visor / Presentador de Diapositivas A3 (`index.html`)**:
   - Navegación con teclado (`→` / `D`, `←` / `A`, `Inicio`, `Fin`).
   - Tira inferior de miniaturas interactivas (thumbnails).
   - Selector rápido desplegable por lámina.
   - Índice técnico estructurado (TOC) y Listado de Materiales (BOM).
2. **Editor de Textos y Reubicación Vectorial Inline**:
   - Botón **"🖐️ Mover Textos"** (Tecla `M`): arrastra cualquier etiqueta técnica o número de borna con el ratón.
   - Controles de tamaño tipográfico: botones `A-` / `A+` y atajos de teclado `[` y `]`.
   - Paleta de 8 colores eléctricos rápidos + selector nativo HTML5.
   - Doble clic sobre cualquier texto para editar su contenido en vivo.
   - Botón **"Guardar / Versionar"** (Tecla `S`):
     - Sobreescribir archivo SVG de la lámina actual.
     - Guardar versión nueva con revisión y fecha actualizadas en el cajetín.
     - Sobreescribir el conjunto completo `hojas_svg_inline.js`.
     - Exportar nuevo archivo HTML autónomo versionado.
3. **Modo Continuo Vertical**:
   - Botón **"📄 Ver 4 Láminas"** (Tecla `V`): despliega todas las láminas verticalmente en cascada con scroll.
4. **Comparador Instantáneo con Boceto Original**:
   - Botón **"📝 Boceto Original"** (Tecla `C`): alterna en milisegundos entre el plano vectorial CAD y el boceto a mano alzada para control de calidad.
5. **Impresión Normalizada A3 1:1**:
   - Botón **"Imprimir A3"** (`Ctrl + P` / Tecla `P`): genera el PDF vectorial completo a escala 1:1 sin márgenes ni duplicación de hojas.

---

## 🚀 Cómo usarla para un nuevo proyecto

> [!IMPORTANT]
> **REGLA DE UBICACIÓN OBLIGATORIA:**
> - Si el origen es un **Bosquejo** (carpeta `BOSQUEJO/`), copia o genera la plantilla en la **carpeta raíz de la carpeta del bosquejo** (ej. `.../CAD/`).
> - Si el origen es un **PDF**, copia o genera la plantilla en la **misma carpeta donde está ubicado el PDF** (ej. `.../1_RECIBIDO/` o `.../CAD/ELECTRICAL/`).
> - **NUNCA** trabajes ni guardes proyectos de clientes dentro de `HERRAMIENTAS/Diagrama-html/`.

1. **Copia esta carpeta completa** o usa el script maestro:
   `python herramientas_offline\iniciar_proyecto.py "<ruta_a_bosquejo_o_pdf>"`
2. Abre `dependencias/js/datos_proyecto.js` y ajusta el código del proyecto, cliente y títulos de lámina si es necesario.
3. Abre `index.html` en tu navegador favorito (Chrome, Edge, Firefox). ¡100% offline, sin dependencias externas ni instalación!
4. Edita o reemplaza los SVGs en `dependencias/hojas/` con tus esquemas vectoriales.
