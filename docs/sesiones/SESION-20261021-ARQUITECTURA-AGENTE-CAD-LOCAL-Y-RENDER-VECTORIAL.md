# SESIÓN DE TRABAJO: ARQUITECTURA DEL AGENTE CAD LOCAL, RENDER VECTORIAL A3 Y HERRAMIENTAS AVANZADAS

**Fecha:** 2026-10-21  
**Proyecto:** AXON CAD Web & Standalone CAD Engine  
**Plataforma Web:** React 19 / TypeScript / Vite (`http://localhost:5173/`)  
**Estándar de Ingeniería:** DIN ISO 5457 A3 (420 x 297 mm) / IEC 60617 / GAMP 5 Cat. 4 / ALCOA+  
**Proyectos de Referencia:**
- Gold Standard Reference: `EUROFARMA / 5266 polyphem blistera 3 / CAD`
- Proyecto Generado: `GARDEN / 4710 GARDEN - SEMAFORO-AGUA / 4_CAD / CAD_HTML`

---

## 1. Resumen Ejecutivo y Diagnóstico del Problema

### 1.1 El Síntoma: "¿Por qué solo veo 4 cajas?"
Al acceder a la plataforma web en `http://localhost:5173/`, el usuario visualizó una lámina donde únicamente flotaban 4 cajas azules con etiquetas `-Q0`, `-PS0`, `-F0` y `-P0` sobre un boceto escaneado en fondo oscuro. La consulta del usuario fue concluyente:

> *"solo veo esto. La idea es que el agente genere un diagrama completo localmente primero en el IDE en una carpeta como este: `C:\Users\Public\ONEDRIVE SERVICIO\OneDrive - AXON\AXON_PROYECTOS\EUROFARMA\5266 polyphem blistera 3\CAD\diagrama_5266_control_vision_polyphem.html` con las mejoras que revisamos."*

### 1.2 Causa Raíz Técnica
1. **Lienzo React Incompleto (`CadCanvas.tsx`):** El componente del lienzo de React únicamente mapeaba las entidades interactivas del store (`components.map(...)` y `wires.map(...)`). No contaba con renderizado del plano vectorial SVG de ingeniería (`svgContent`), asumiendo que los componentes debían agregarse manualmente uno a uno en la UI web.
2. **Componentes Mock Residuales:** En `project.json` existía un array residual con 4 componentes manuales que no coincidían ni aprovechaban el trazado completo ya calculado en `hoja_01.svg` a `hoja_04.svg`.
3. **Caché y Desconexión de Paquete:** La plataforma web iniciaba con un estado vacío en `useCadStore`, requiriendo un drag-and-drop manual para cargar el archivo `.axon.zip`.

---

## 2. Definición Arquitectónica: El Rol del Agente IA y la Generación Local

Se consolidó el principio operativo de **Arquitectura Híbrida**:

```
+-----------------------------------------------------------------------------------+
|                        1. AGENTE IA DIBUJANTE (IDE LOCAL)                         |
|  - Procesa requisitos, URS y bocetos manuscritos escaneados de terreno.           |
|  - Genera la carpeta CAD completa autónoma (HTML + SVG + CSS + JS).               |
|  - Dibuja todos los conductores, protecciones, bornas, PLC y cajetín oficial A3. |
|  - Empaqueta el contenedor portable estandarizado (.axon.zip con SHA-256).       |
+-----------------------------------------------------------------------------------+
                                         │
                         (Exporta contenedor .axon.zip)
                                         ▼
+-----------------------------------------------------------------------------------+
|                     2. PLATAFORMA WEB / SERVIDOR AXON CLOUD                       |
|  - Carga instantánea de .axon.zip sin pérdida de fidelidad ni dependencias.       |
|  - Renderiza el esquema vectorial completo 1:1 (420 x 297 mm).                    |
|  - Habilita herramientas interactivas de revisión y edición sobre el plano:       |
|    * Cortar conductores (C)        * Prolongar extremos (E)                      |
|    * Cableado ortogonal 90° (W)    * Inspector modal de propiedades (Doble Clic)  |
|    * Calco con opacidad (B)        * Sincronización de vuelta al servidor (.zip) |
+-----------------------------------------------------------------------------------+
```

---

## 3. Implementación Detallada de Mejoras Funcionales y Técnicas

### 3.1 Soporte para Esquema Vectorial Completo en Web (`CadCanvas.tsx`)
Se modificó `CadCanvas.tsx` para aceptar `activeSheet.svgContent`. Utiliza un elemento `<svg>` anidado con `viewBox="0 0 1191 842"`, mapeado a las dimensiones normalizadas A3 de 420 x 297 mm:

```tsx
{/* Esquema Eléctrico Vectorial Completo (Generado por el Agente / Estándar CAD AXON) */}
{activeSheet?.svgContent && (
  <svg
    x="0"
    y="0"
    width="420"
    height="297"
    viewBox="0 0 1191 842"
    style={{ overflow: 'visible', pointerEvents: 'none' }}
    dangerouslySetInnerHTML={{
      __html: activeSheet.svgContent
        .replace(/<svg[^>]*>/i, '')
        .replace(/<\/svg>/i, '')
    }}
  />
)}
```

### 3.2 Limpieza del Contenedor `project.json`
Se eliminaron las entidades simuladas superpuestas en `project.json`. Ahora cada una de las 4 láminas incorpora su definición vectorial completa:
- **Lámina 01:** Acometida 220VAC, Interruptor Diferencial `-Q0`, Fusible `-F0`, Luz Piloto `-P0`, Fuente Switching 24VDC `-PS0` y Borneras de Distribución `X0` y `X1`.
- **Lámina 02:** Entradas Digitales PLC Siemens LOGO! 24RCE (`-S1` a `-S5`, sensores de nivel, selectores, bornera de campo `X9` y conexionado a entradas `I1` a `I5`).
- **Lámina 03:** Salidas Digitales a Relé (`Q1` a `Q4` de LOGO!), actuadores electrohidráulicos, contactores de bomba y señalización.
- **Lámina 04:** Control y Semáforos de Estado (balizas verde, amarilla y roja con sirena acústica y rearme).

### 3.3 Módulo de Herramientas Avanzadas: `herramientas_edicion_avanzada.js`
Se construyó un script modular e independiente, insertado tanto en el proyecto **Garden 4710** como en **Eurofarma 5266**:

1. **Cortar Cables (`C`):**
   - Al presionar `C` o pulsar el botón, el cursor cambia a cruz de corte (`crosshair`).
   - El clic sobre cualquier `<line class="wire-...">` calcula la proyección en coordenadas SVG y divide el segmento en dos conductores continuos con una holgura de 4 px para desconexión física/lógica.
2. **Prolongar Cables (`E`):**
   - Al pulsar `E`, activa el modo de prolongación ortogonal, permitiendo extender cualquier extremo de conductor hacia el siguiente obstáculo o borne.
3. **Cablear (`W`):**
   - Herramienta para incorporar nuevos conductores con 90° de ortogonalidad.
4. **Inspector Modal de Propiedades (Doble Clic):**
   - Detección de `dblclick` en cualquier elemento SVG (`g[id^="comp_"]`, `line.wire-...`, textos de tags).
   - Abre una ventana flotante modal oscura estilo AutoCAD con campos:
     - **TAG / Identificador:** Ej. `-Q0`, `-PS0`, `-KM1`.
     - **Función / Descripción:** Ej. "Disyuntor Diferencial 2P 16A 30mA".
     - **Tensión / Potencial:** Ej. "220VAC Fase", "24VDC", "Neutro".
     - **Calibre / Sección:** Ej. "1.5 mm²", "2.5 mm²".
     - **Bornera / Terminal:** Ej. "X1:1", "CN16:P1".
   - Botón **Guardar** que sincroniza el DOM SVG inmediatamente en memoria viva.
5. **Calco de Boceto Subyacente con Opacidad Gradual (`B` + Slider):**
   - Botón toggle `B` para encender/apagar la capa de cotejo.
   - Slider interactivo de 5% a 100% (35% por defecto).
   - Inserta un `<g id="cadSketchUnderlayLayer">` detrás del plano vectorial que enlaza la imagen original escaneada para verificación visual inmediata.
6. **Auto-Fit A3 (`F`):**
   - Centra y ajusta el zoom al 100% del área visible sin cortes en cualquier monitor.
7. **Atajos Globales de Teclado:**
   - `C`: Cortar cable.
   - `E`: Prolongar cable.
   - `W`: Conductor nuevo.
   - `B`: Alternar calco de boceto.
   - `F`: Auto-ajustar a pantalla.
   - `G`: Agrupar selección.
   - `U`: Desagrupar selección.
   - `Escape`: Cancelar modo activo / cerrar modal.

---

## 4. Despliegue en los Proyectos Oficiales

### 4.1 Despliegue en Garden House 4710
Ruta oficial en el repositorio de proyectos:
`C:\Users\Public\ONEDRIVE SERVICIO\OneDrive - AXON\AXON_PROYECTOS\GARDEN\4710 GARDEN - SEMAFORO-AGUA\4_CAD\CAD_HTML\`

Archivos estructurados:
- `diagrama_4710_control_semaforo_agua.html` & `index.html`
- `project.json` (vector sheets) & `metadata.json`
- `DE-4710_GARDEN_HOUSE.axon.zip`
- `dependencias/hojas/` (`hoja_01.svg` a `hoja_04.svg`)
- `dependencias/js/` (incluyendo `herramientas_edicion_avanzada.js`)
- `dependencias/css/`

### 4.2 Actualización de Eurofarma 5266
Ruta de referencia:
`C:\Users\Public\ONEDRIVE SERVICIO\OneDrive - AXON\AXON_PROYECTOS\EUROFARMA\5266 polyphem blistera 3\CAD\`

- Se incorporó `herramientas_edicion_avanzada.js` en `diagrama_5266_control_vision_polyphem.html` e `index.html`.
- Se verificó en navegador que las 11 láminas operan con el nuevo juego de herramientas.

---

## 5. Pruebas y Validación Técnica

1. **Compilación Frontend:**
   - Comando: `cmd /c npm run build`
   - Resultado: Exitoso en 2.65 segundos. 1603 módulos transformados sin errores TypeScript.
2. **Servidor de Desarrollo:**
   - Vite ejecutándose como servicio daemon en `http://localhost:5173/`.
   - Auto-carga del paquete por defecto desde `public/default_project.axon.zip` (1.42 MB).
3. **Verificación Visual en Navegador (Subagentes Playwright):**
   - Captura `sheet_01_cleaned_1792631209191.png`: Lámina 01 completa, nítida, con boceto al 35% y cero cajas azules superpuestas.
   - Captura `sheet_02_cleaned_1792631233097.png`: Lámina 02 completa con conexionado de PLC LOGO! y regleta de bornas de campo.
   - Captura `eurofarma_sheet_07_1792631556053.png`: Lámina 07 de Eurofarma operando con la barra de herramientas avanzada.

---

## 6. Conclusiones y Próximos Pasos

- **Estándar Consolidado:** El Agente IA ahora cuenta con una plantilla comprobada para generar diagramas eléctricos normalizados A3 en minutos a partir de cualquier bosquejo manuscrito o especificación técnica.
- **Portabilidad Total:** El resultado final no depende de herramientas privativas ni de servidores en la nube para su revisión técnica inicial; funciona directamente haciendo doble clic desde el Explorador de Windows.
- **Integridad para Servidor:** Cuando se requiera transferir la ingeniería a la plataforma web o al servidor central Ubuntu, el contenedor `.axon.zip` transporta de forma inmutable la topología, los esquemas vectoriales y las evidencias de terreno.
