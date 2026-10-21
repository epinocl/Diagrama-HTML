# Estudio Técnico y Plan de Mejoras del Motor CAD — Diagrama-HTML

**Documento:** EST-01  
**Proyecto:** Diagrama-HTML (AXON CAD Web)  
**Versión:** 1.0.0  
**Fecha:** 2026-10-21  
**Autor:** AXON Ingeniería Eléctrica SpA  
**Estándar Regulatorio:** Davichuder / GAMP 5 / ALCOA+ / IEC 60617

---

## 1. Resumen Ejecutivo

El presente estudio establece la hoja de ruta técnica y de ingeniería de software para evolucionar la herramienta **Diagrama-HTML** desde su versión actual (visor estático interactivo con manipulación básica de textos y símbolos pre-dibujados) hacia un **Editor Esquemático Industrial Completo en la Web (AXON CAD Web)**, capaz de:

1. **Líneas Inteligentes**: Dibujar, cortar (trim/split), extender y enrutar conductores ortogonales con generación automática de nodos de unión (*junction dots*).
2. **Componentes con Puertos de Conexión (Snap Ports)**: Desacoplar los símbolos de las líneas, con bornes reconocibles que mantengan los cables conectados al mover el componente (*rubber-banding*).
3. **Objetos y Geometrías Autónomas**: Cada elemento visual como entidad independiente en un árbol de objetos (*Scene Graph*).
4. **Agrupamiento y Desagrupamiento**: Capacidad de agrupar geometrías compuestas y desagruparlas sin distorsión de coordenadas.
5. **Inspector de Propiedades Flotante / Emergente**: Modificación interactiva de tags, descripciones, atributos eléctricos y referencias comerciales de cada objeto.
6. **Modernización Tecnológica**: Evaluación de frameworks modernos (React + Vite, Svelte, Canvas 2D/SVG) frente a opciones en Java.

---

## 2. Estudio Técnico de Mejoras Funcionales

### 2.1. Independización y Edición Avanzada de Líneas Eléctricas

#### Diagnóstico del Estado Actual:
En la versión base, las líneas son elementos vectoriales SVG rígidos (`<line x1="..." y1="..." x2="..." y2="...">`). No existe un modelo topológico relacional: si un elemento se traslada, la línea permanece inmóvil; y para dibujar o modificar un conductor se requiere editar coordenadas numéricas.

#### Modelo Propuesto: Conductor Topológico (`WireNet & WireSegment`)
El sistema debe modelar los cables como un grafo de conexiones eléctricas:

```text
WireNet ("+24VDC_CONTROL")
  ├── WireSegment 1: P1(120, 200) ───────> P2(350, 200)
  ├── JunctionNode: P2(350, 200) [Conecta con borne -K1:A1]
  └── WireSegment 2: P2(350, 200) ───────> P3(350, 320)
```

#### Operaciones CAD a Implementar:
1. **Herramienta de Dibujo de Cables (Ortho Wiring Tool)**:
   - Trazado forzado a ángulos rectos de 90° (Algoritmo de Enrutamiento Manhattan).
   - *Grid Snapping* métrico configurable (paso de 2.5 mm, 5 mm o 10 mm en escala A3).
   - Auto-detección de terminales de componentes a una distancia de captura (*snap radius* de 5 píxeles).
2. **Cortar / Dividir Conductor (Trim / Split Tool)**:
   - Dividir un segmento en dos en el punto de intersección con otro cable o al hacer clic con la herramienta tijeras/cortador.
   - **Auto-Split por inserción de componente**: Al soltar un disyuntor, fusible o contacto sobre un cable continuo existente, el sistema debe abrir el cable automáticamente y conectar los dos extremos resultantes a los bornes de entrada y salida del aparato.
3. **Extender Conductor (Extend Tool)**:
   - Prolongar un segmento ortogonalmente hasta hacer colisión con el siguiente conductor o borna más cercana en la misma dirección.
4. **Nodos de Empalme Automáticos (Junction Dots)**:
   - Inyección automática de un punto negro de conexión (`<circle r="3" fill="#000000">` en modo impresión / blanco en modo CAD) en cada unión en `T` o en cruz con continuidad de red.
5. **Manivelas de Vértice (Vertex Drag)**:
   - Al seleccionar una línea quebrada, habilitar puntos de control (*handles*) en cada quiebre para desplazar tramos paralelos sin romper la continuidad eléctrica.

---

### 2.2. Componentes Independientes con Puntos de Conexión (Terminal Ports)

#### Concepto de Objeto Símbolo Inteligente (`SchematicComponent`):
Cada símbolo de la biblioteca IEC 60617 (disyuntor, contactor, relé, sensor, PLC, borna) debe encapsular:
1. **Contorno Gráfico**: Geometría SVG normalizada.
2. **Puertos de Conexión (Snap Ports)**:
   - Ubicación vectorial relativa dentro del símbolo: `port.relX`, `port.relY`.
   - Orientación del cable esperado: `NORTH`, `SOUTH`, `EAST`, `WEST`.
   - Rótulo de borne: `1/L1`, `2/T1`, `13`, `14`, `A1`, `A2`, `+`, `-`, `PE`.
3. **Vínculo Reactivo (Rubber-Banding)**:
   - Los segmentos de cable conectados a un puerto registran la referencia `connectedTo: { componentId: "QA1", portId: "T1" }`.
   - Al mover el componente con el ratón, las líneas conectadas se recalculan y deforman ortogonalmente de forma elástica sin desconectarse.

```text
[ Borne 13 (Snap Port) ]  ─── Cable reactivo ortogonal ───> [ Borne +24V ]
       ┌────────┐
       │   QA1  │  (Al mover QA1, los cables se extienden/retraen
       │ Disy.  │   manteniendo los 90° de curvatura)
       └────────┘
[ Borne 14 (Snap Port) ]  ─── Cable reactivo ortogonal ───> [ Borne 1_PLC ]
```

---

### 2.3. Geometrías Genéricas como Objetos Autónomos

Toda geometría dibujada o insertada en la lámina debe ser tratada como un nodo de datos de primer nivel en el árbol de escena (*Scene Graph*):

| Tipo de Objeto | Atributos Parametrizables | Comportamiento en Lienzo |
| :--- | :--- | :--- |
| **`CadRect`** | `x, y, width, height, rx, ry, stroke, strokeWidth, fill, strokeDash` | Envolventes de tablero, canaletas, bornes, cajas de módulo. Manivelas en las 4 esquinas para redimensionar. |
| **`CadCircle`** | `cx, cy, r, stroke, strokeWidth, fill` | Luces piloto, pulsadores, motores, nodos de empalme. |
| **`CadPolyline`** | `points: [{x, y}], stroke, strokeWidth, strokeDash` | Barras colectoras de distribución de potencia, blindajes, tierras de protección. |
| **`CadText`** | `x, y, textContent, fontSize, fontFamily, fontWeight, fill, textAnchor` | Identificadores TAG, marcas de borne, descripciones de función, títulos de cajetín. |

---

### 2.4. Agrupamiento y Desagrupamiento (Group / Ungroup)

1. **Agrupar (`Group - Ctrl+G`)**:
   - Agrupa $N$ objetos seleccionados en una entidad `CadGroup`.
   - Calcula el *Bounding Box* envolvente del conjunto.
   - Permite arrastrar, escalar o rotar el grupo completo sin alterar las posiciones relativas internas.
2. **Desagrupamiento Seguro (`Ungroup - Ctrl+Shift+G`)**:
   - Descompone el grupo en sus geometrías individuales.
   - **Algoritmo de Preservación de Coordenadas**: Aplica la matriz de transformación del grupo padre a cada hijo (`MatrixTransform(parentMat * childMat)`) antes de eliminar el `<g>`, garantizando que ningún elemento "salte" o cambie de posición en el lienzo al desagrupar.
3. **Promover Grupo a Componente de Biblioteca**:
   - Función para guardar cualquier grupo personalizado con sus puntos de conexión directamente en la biblioteca de símbolos IEC del usuario.

---

### 2.5. Ventana Emergente e Inspector de Propiedades

Al hacer doble clic sobre cualquier objeto o símbolo, se desplegará una ventana emergente / panel inspector modal:

- **Pestaña 1: Identificación y Nomenclatura**:
  - `Tag del Componente`: Ej. `-QA1`, `-K1`, `-B1` (Validación según norma IEC 81346).
  - `Descripción Funcional`: Ej. *Interruptor Termomagnético de Control 2P 10A*.
  - `Ubicación Física`: Ej. *Tablero TDC / Riel DIN Superior*.
- **Pestaña 2: Especificación Técnica y BOM**:
  - `Fabricante`: Ej. *Phoenix Contact / Schneider Electric / Siemens*.
  - `Número de Parte / Código Comercial`: Ej. *2903661 / 1088494*.
  - `Parámetros Eléctricos`: Tensión (230VAC / 24VDC), Corriente (10A), Contactos auxiliares.
- **Pestaña 3: Bornes y Puntos de Conexión**:
  - Lista de terminales con estado de conexión actual (conectado a qué red y cable).
- **Pestaña 4: Estilos y Geometría**:
  - Coordenadas milimétricas `X`, `Y`.
  - Capa CAD (`CAD_DEVICES`, `CAD_WIRES`, `CAD_TEXT`).
  - Color en Modo AutoCAD y color en Modo Impresión.

---

## 3. Estudio y Evaluación Tecnológica (Frameworks Modernos vs Java)

Se evaluaron tres grandes alternativas para la construcción de la nueva interfaz gráfica de usuario (GUI Web) y el motor esquemático:

### Alternativa 1: Stack Web Moderno SPA (React 19 / Vite + TypeScript + SVG/Canvas Híbrido)

- **Descripción**: Aplicación de página única construida con React 19 y Vite con tipado TypeScript estricto. Utiliza un motor de renderizado vectorial basado en SVG para el lienzo de ingeniería y manipulación del DOM, combinado con Canvas 2D/WebGL para renderizado acelerado de fondo.
- **Ventajas**:
  - **Experiencia de Usuario (UX) de Nivel Mundial**: Soporte nativo para drag & drop fluido a 60-120 FPS, paneles laterales desacoplables (*dockable panels*), paletas flotantes, snapping magnético y atajos de teclado sin latencia.
  - **Cero Instalación en Estaciones**: Se ejecuta directamente en el navegador de cualquier estación de planta (Windows, Mac, Linux o tablets en terreno).
  - **Reutilización del Código Actual**: Las hojas de estilo (`layout-a3.css`, `print-a3.css`), los algoritmos de conversión DXF (`exportador_dxf.js`) y las bibliotecas SVG actuales se integran de forma natural e inmediata.
  - **Despliegue Nativo en Servidor Ubuntu**: Servido como activos estáticos optimizados mediante Nginx, con consumo insignificante de memoria RAM y CPU en el servidor AXON.
- **Desventajas**:
  - Requiere un backend complementario (Node.js o Python) para operaciones que requieran acceso a disco o librerías pesadas como PyMuPDF.

### Alternativa 2: Ecosistema Java (Spring Boot + JavaFX Desktop o Vaadin Web)

- **Descripción**: Construcción de la herramienta utilizando Java:
  - *Opción JavaFX Desktop*: Aplicación de escritorio tradicional empaquetada como ejecutable `.exe` / `.deb`.
  - *Opción Vaadin / GWT Web*: Aplicación web donde la lógica de interfaz se programa en Java en el servidor y se sincroniza con el navegador vía WebSocket/HTTP.
- **Ventajas de Java**:
  - Tipado extremadamente robusto, arquitectura corporativa madura y excelente para procesamiento backend intensivo de datos o integración con bases de datos SQL empresariales.
  - Manejo determinista de hilos y memoria en el servidor.
- **Desventajas Críticas para este Proyecto**:
  - **En Aplicaciones Web (Vaadin / GWT)**: El dibujo y manipulación CAD requiere interacción continua en tiempo real con el ratón (cada movimiento genera eventos de coordenadas en milímetros). En Vaadin, sincronizar cada micro-movimiento a través del servidor genera una latencia inaceptable para un software de diseño vectorial interactivo ("lag" al arrastrar líneas o hacer zoom).
  - **En Escritorio (JavaFX)**: Obliga a empaquetar e instalar binarios pesados con el JRE/JDK en cada máquina cliente, perdiendo la ventaja central solicitada por el usuario de acceder al sistema de forma ligera desde cualquier estación a través del servidor web de AXON.
  - **Consumo de Recursos en Ubuntu Server**: La JVM de Java consume un piso de 500 MB a 2 GB de memoria RAM incluso en reposo, en comparación con los 40-80 MB que requiere un servicio equivalente en Node.js o Python FastAPI.

### Alternativa 3: Motor Especializado de Diagramas sobre Web (Svelte 5 / React + Paper.js / Konva / Excalidraw Engine)

- **Descripción**: Utilizar una librería probada de grafos y diagramas vectoriales montada sobre React o Svelte:
  - **Paper.js / SVG.js**: Especializadas en matemáticas vectoriales exactas, curvas Bezier, intersecciones de líneas y agrupamiento de paths.
  - **Konva.js / Fabric.js**: Especializadas en selección interactiva con manivelas de rotación, escalado y manipulación por capas.
- **Ventajas**:
  - Ahorra meses de desarrollo en los algoritmos de recorte de líneas (*line trimming*), detección de colisiones de puntos y cálculo de matrices de transformación.

---

### Tabla Comparativa de Decisiones

| Criterio de Selección | React + Vite (Web SPA) | JavaFX (Desktop) | Java Vaadin (Web) | Recomendación AXON |
| :--- | :---: | :---: | :---: | :---: |
| **Fluidez de Dibujo y Drag (FPS)** | ⚡ 60-120 FPS | ⚡ 60 FPS | ❌ Latencia de red | **React + Vite (Ganador)** |
| **Despliegue en Servidor Ubuntu** | 🟢 Muy simple (Nginx) | ❌ Inaplicable (Es Desktop) | 🟡 Complejo (Tomcat/JVM) | **React + Vite (Ganador)** |
| **Acceso Multiplataforma sin Instalar** | 🟢 100% en navegador | ❌ Requiere instalador | 🟢 En navegador | **React + Vite (Ganador)** |
| **Reutilización de Código Actual** | 🟢 Directa (CSS, SVG, JS) | ❌ Reescribir todo en Java | 🟡 Parcial | **React + Vite (Ganador)** |
| **Consumo de Memoria en Servidor** | 🟢 < 100 MB | N/A | 🔴 > 1.5 GB | **React + Vite (Ganador)** |
| **Ecosistema de Componentes UI** | 🟢 Gigante (Tailwind, Lucide) | 🟡 Limitado | 🟡 Propietario | **React + Vite (Ganador)** |

---

## 4. Arquitectura Híbrida Recomendada para AXON

Para cumplir al 100% con los objetivos de rendimiento industrial, despliegue en Ubuntu Server y máxima experiencia de usuario:

```text
[ ESTACIÓN CLIENTE (Navegador) ]
  ├── React 19 + TypeScript + Vite (UI, Paneles, Modales, Dashboard)
  ├── Motor Vectorial Híbrido SVG/Canvas (Interactividad CAD, Snap, Manivelas)
  ├── Serializador DXF R12 en Cliente (Descarga instantánea sin tocar servidor)
  └── Persistencia Local (IndexedDB / LocalStorage para trabajo offline)
                 ↕  (API REST + WebSockets ligeros)
[ SERVIDOR UBUNTU DE AXON ]
  ├── Nginx (Reverse Proxy, SSL, Cache de Activos Estáticos)
  ├── Node.js LTS / Express (Gestión multi-proyecto, control de usuarios y bloqueos)
  ├── Microservicio Python (PyMuPDF / Pillow para extracción de PDFs y miniaturas)
  └── Repositorio Multi-tenant (/opt/axon/proyectos/<CLIENTE>/<PROYECTO>/)
```

---

## 5. Preguntas Clave a Resolver (Decisiones de Diseño y Alcance)

Para fijar la arquitectura definitiva antes de iniciar la codificación de la Fase 2, se definen las siguientes preguntas estratégicas:

1. **Stack Tecnológico de la Nueva GUI Web**:
   - *Opción A (Recomendada)*: **React 19 + TypeScript + Vite** con componentes Tailwind / shadcn y motor SVG interactivo acelerado.
   - *Opción B*: **Vanilla JavaScript Modular (ES6 Modules)** evolucionando directamente los archivos actuales de `src/` sin dependencias de compilación npm.
   - *Opción C*: **Java Backend (Spring Boot)** con cliente web REST.
2. **Nivel de Autonomía de Líneas y Cables**:
   - ¿Las líneas deben ser **puramente ortogonales** (solo ángulos rectos de 90° estilo EPLAN / AutoCAD Electrical), o se debe permitir también líneas diagonales / ángulos libres? *(En esquemas industriales se recomienda 100% ortogonal)*.
3. **Persistencia de Conexiones al Mover Componentes**:
   - Al trasladar un aparato en el plano, ¿los cables conectados deben:
     - *Opción 1*: Seguir al aparato estirándose elásticamente en ángulos de 90° (*rubber-banding* industrial automático).
     - *Opción 2*: Desconectarse del aparato dejando las puntas abiertas para reconectar manualmente.
4. **Modal vs Panel Lateral para el Inspector de Propiedades**:
   - Al editar un objeto: ¿Prefieres una **ventana emergente modal** en el centro de la pantalla, o un **panel lateral retráctil (Inspector Sidebar)** a la derecha tipo AutoCAD / Figma?
5. **Autenticación y Permisos en el Servidor Ubuntu**:
   - ¿La herramienta en el Servidor Ubuntu tendrá usuarios con login y contraseña (e.g. Rol Dibujante, Rol Revisor, Rol Aprobador con firma digital GAMP 5), o acceso abierto dentro de la red local de AXON?
