# AV-20261021-002 - Línea Base 'origen/' v3.0, Estudio Técnico y Plan de Mejoras CAD Web

## Objetivo
1. Establecer en la raíz de `C:\IA EPINO LOCAL\DIAGRAMA-HTML` la carpeta `origen/` como la línea base (baseline) inmutable de la versión final de la herramienta (`v3.0`), conteniendo todas las mejoras validadas y operativas (Modo Impresión bivalente, Configurador Dinámico de Colores, Exportador DXF 1:1 métrico y corrección de contraste para textos en fondos claros).
2. Elaborar el estudio técnico de ingeniería y plan de mejoras profundas para la transformación de Diagrama-HTML en un CAD esquemático web profesional:
   - Independización de líneas y conductores con operaciones topológicas (cortar/split, extender, ruteo ortogonal y auto-empalme con nodo).
   - Componentes y símbolos IEC 60617 independientes con puntos de conexión (snap terminal ports).
   - Geometrías y primitivas gráficas independientes.
   - Sistema de agrupación y desagrupación (`Group` / `Ungroup`) con conservación de coordenadas relativas/absolutas.
   - Inspector de propiedades modal / emergente para edición de cualquier entidad.
3. Evaluar frameworks modernos (React/Vite, Svelte, Web Components) y Java (JavaFX, Vaadin/Spring Boot) analizando latencia, experiencia de usuario (UX) e interoperabilidad con el Servidor Ubuntu de AXON.
4. Definir las preguntas estratégicas clave a resolver con el usuario antes del inicio de la implementación.

## Requisitos / documentos relacionados
- Solicitud de usuario: Carpeta `origen/` con lo último final corriendo, estudio y plan de mejoras CAD (líneas, objetos, puertos IEC, agrupar/desagrupar, ventana emergente, evaluación frameworks/Java y preguntas a resolver).
- `docs/ESTUDIO_Y_PLAN_MEJORAS_CAD.md`: Documento maestro de ingeniería y arquitectura.
- Estándares `davichuder` y `axon-standard` (GAMP 5, ALCOA+).

## Estado inicial
- El repositorio contaba con la estructura de Fase 1 documental y un directorio `src/` inicial.
- No existía una carpeta `origen/` dedicada que resguardara de forma limpia e inalterable la versión v3.0 operativa.
- Las líneas y conductores en la herramienta estaban codificados como rutas polilíneas estáticas vinculadas rígidamente dentro del SVG del plano.
- Los símbolos de la librería IEC 60617 no contaban con metadatos explícitos de bornes/puertos magnéticos para auto-conexión.

## Trabajo realizado
1. **Creación de Carpeta `origen/` (Línea Base v3.0)**:
   - Se copiaron íntegramente los 108 archivos de la versión final probada desde `HERRAMIENTAS/Diagrama-html`.
   - Se validó la presencia de los módulos clave: `configurador_colores.js`, `exportador_dxf.js`, `presentador.js` (con `forzarContrasteImpresion`), `editor_textos.js`, `editor_simbolos.js`, `zoom-pan.js`.
   - Se validaron las hojas de estilo actualizadas: `layout-a3.css` y `print-a3.css`.
   - Se incorporó la librería completa de símbolos IEC 60617 vectoriales y cajetines normalizados en `origen/simbologia/`.
   - Se verificó la plantilla maestra `origen/plantilla_multilamina/index.html` con todos sus modales y barras de herramientas operativas.
2. **Elaboración del Estudio de Ingeniería y Plan de Mejoras**:
   - Se redactó y formalizó `docs/ESTUDIO_Y_PLAN_MEJORAS_CAD.md` cubriendo:
     - Modelado topológico de conductores (`WireNet`, `WireSegment`, `ConnectionPoint`).
     - Algoritmos para cortar (split interactivo o por intersección con inserción automática de bornes/nodos) y extender (raycasting hasta objetivo).
     - Especificación de puertos magnéticos en la librería IEC 60617 (`data-port-id`, posición relativa `(px, py)` y dirección ortogonal).
     - Estructura de Scene Graph jerárquico (`CanvasDoc` -> `Entities` -> `Layers`) con soporte para geometrías primitivas y agrupaciones recursivas con matrices de transformación `DOMMatrix`.
     - Diseño de Inspector de Propiedades Emergente/Modal desacoplado.
3. **Evaluación de Tecnologías y Frameworks**:
   - Se analizaron a fondo las opciones:
     - **Java (JavaFX Desktop)**: Excelente para CAD de escritorio, pero incompatible con la meta de accesibilidad web sin instalación cliente.
     - **Java (Vaadin / Spring Boot)**: Inviable para interacción CAD fluida (pan, zoom, arrastre, snap magnético) debido a la latencia de ida y vuelta HTTP/WebSocket por cada evento de mouse.
     - **Frontend Moderno (React 19 + TypeScript + Vite)**: **Seleccionada como la opción óptima**. Permite estado reactivo de alto rendimiento (Zustand/Redux), tipado estricto para modelos geométricos, reutilización directa del SVG/CSS3 existente y compilación ligera a SPA estática de máxima velocidad (60-120 FPS).
     - **Backend Servidor Ubuntu AXON**: Arquitectura ligera basada en Node.js (API REST + WebSockets para colaboración multi-usuario y almacenamiento de proyectos en JSON) + Python CLI (PyMuPDF / ezdxf para conversiones pesadas a PDF/DXF en background), servido tras Nginx con HTTPS.
4. **Formulación de Preguntas Estratégicas**:
   - Se formularon 5 preguntas clave con opciones concretas y recomendaciones para que el usuario defina la dirección de diseño antes de iniciar la Fase 2.

## Archivos modificados / creados
- `origen/` (Nuevo árbol de 108 archivos de la versión v3.0 operativa)
- `docs/ESTUDIO_Y_PLAN_MEJORAS_CAD.md` (Nuevo documento maestro de ingeniería)
- `docs/avances/AV-20261021-002-estudio-tecnico-mejoras-cad-y-origen.md` (Nuevo registro de avance)

## Decisiones tomadas
1. **Inmutabilidad de `origen/`**: La carpeta `origen/` queda fijada como punto de restauración de emergencia y referencia de la herramienta original funcional sin modificaciones de arquitectura.
2. **Recomendación Tecnológica**: Se descartó Java en el frontend en favor de una Single Page Application (SPA) moderna en TypeScript para asegurar latencia cero en la manipulación gráfica.
3. **Topología de Cables Desacoplada**: Los conductores dejarán de ser simples etiquetas visuales `<line>` y pasarán a ser entidades de red lógica (`WireNet`) que conocen los puertos que conectan y su potencial eléctrico (fase, neutro, señal, 24VDC).

## Próximos pasos
1. Someter las 5 preguntas estratégicas a aprobación del usuario.
2. Consignar respuestas y cerrar especificación detallada de modelos de datos.
3. Iniciar Fase 2: Configuración del entorno de desarrollo de la nueva GUI Web.
