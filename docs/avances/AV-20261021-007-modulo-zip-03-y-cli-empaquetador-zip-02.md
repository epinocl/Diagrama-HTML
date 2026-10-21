# AV-20261021-007 - Implementación del Módulo Drag & Drop .axon.zip (ZIP-03) y Empaquetador CLI (ZIP-02)

## Objetivo
1. Implementar la tarea **`ZIP-03`**: Integrar la librería `jszip` en la GUI Web React 19 / Vite para soportar importación (arrastrar y soltar o botón) y exportación directa de contenedores portables `.axon.zip` con descompresión instantánea en memoria hacia el store Zustand.
2. Implementar la tarea **`ZIP-02`**: Desarrollar la herramienta CLI `scripts/empaquetar_proyecto.py` para que los Agentes IA locales puedan procesar bocetos en terreno, calcular sus hashes criptográficos SHA-256 (GAMP 5 / ALCOA+) y empaquetar automáticamente el proyecto listo para ser subido a la web.
3. Crear y ejecutar la suite de pruebas unitarias automatizadas con Vitest (`tests/zipPackage.test.ts`), verificando la integridad de los contratos de datos `project.json` y `metadata.json`.

## Requisitos / documentos relacionados
- Solicitud de usuario: "CONTINUEMOS CON ZIP-03".
- ADR-05 (Arquitectura Híbrida y Contenedor Portable `.axon.zip`).
- `docs/ARCHITECTURE.md`, `docs/PLANS.md`, `docs/ROADMAP.md` y `docs/RAID_BOARD.md`.

## Estado inicial
- La arquitectura híbrida estaba documentada pero no existía soporte en la GUI Web para procesar archivos ZIP.
- El usuario solo podía manipular datos en memoria sin persistencia de paquetes autocontenidos.
- No existía un script CLI para que los agentes locales empaquetaran sus entregas con hashes ALCOA+.

## Trabajo realizado
1. **Instalación y Configuración de Dependencias**:
   - Se instaló la librería `jszip` (v3.10.1) como dependencia de producción en `package.json`.
2. **Desarrollo del Servicio de Empaquetado (`src/cad/zipPackage.ts`)**:
   - `exportProjectToZip`: Genera un Blob comprimido con `project.json`, `metadata.json` y la subcarpeta opcional `bocetos/`.
   - `importProjectFromZip`: Lee y valida un archivo ZIP o `.axon.zip` en memoria, extrayendo el modelo topológico y las imágenes de referencia como Object URLs.
   - `downloadBlob`: Función auxiliar para disparar la descarga en el navegador.
3. **Ampliación de Tipos e Interfaces (`src/cad/types.ts`)**:
   - Se agregaron las interfaces `SheetMetadata`, `SheetDocument`, `ProjectDocument` y `PackageMetadata` con soporte de `schemaVersion: "1.0"`.
4. **Integración en Zustand Store (`src/store/useCadStore.ts`)**:
   - Acciones `loadProjectDocument`, `importZipFile` y `exportCurrentZip` integradas con notificaciones toast en tiempo real.
5. **Zona Drag & Drop en Canvas Web (`src/components/CadCanvas.tsx`)**:
   - Detección de eventos `dragOver`, `dragLeave` y `drop`.
   - Overlay visual moderno con borde cian punteado y fondo difuminado al arrastrar archivos `.axon.zip` sobre el plano.
6. **Controles en la Barra Superior (`src/App.tsx`)**:
   - Botón **"Importar .axon.zip"** (con selector de archivo nativo oculto).
   - Botón **"Exportar .axon.zip"** con descarga directa.
   - Toast emergente flotante inferior que confirma las operaciones de importación/exportación.
7. **Desarrollo de la Utilidad CLI (`scripts/empaquetar_proyecto.py`)**:
   - Script Python que valida `project.json`, escanea la carpeta `bocetos/`, calcula hashes SHA-256 de cada imagen y genera el paquete comprimido `.axon.zip` con metadatos GAMP Categoría 4.
8. **Testing Automatizado con Vitest (`tests/zipPackage.test.ts`)**:
   - 3 pruebas unitarias probando compresión, descompresión con fidelidad total y manejo de errores ante ZIPs corruptos.
   - **Resultado: 9/9 tests totales pasando exitosamente** (6 de topología + 3 de empaquetado).
9. **Compilación de Producción Verificada**:
   - `npm run build` ejecutado (`tsc && vite build`) generando `dist/` en 3.71 segundos con **0 errores**.

## Archivos creados / modificados
- `package.json` y `package-lock.json` (Añadido `jszip`)
- `src/cad/types.ts` (Actualizado con contratos de proyecto y metadatos)
- `src/cad/zipPackage.ts` (Nuevo servicio de empaquetado/desempaquetado)
- `src/store/useCadStore.ts` (Actualizado con import/export ZIP)
- `src/components/CadCanvas.tsx` (Actualizado con zona Drag & Drop)
- `src/App.tsx` (Actualizado con botones de importación/exportación y toast)
- `scripts/empaquetar_proyecto.py` (Nuevo script CLI para agentes locales)
- `tests/zipPackage.test.ts` (Nueva suite de tests de empaquetado)
- `docs/avances/AV-20261021-007-modulo-zip-03-y-cli-empaquetador-zip-02.md` (Nuevo registro)

## Decisiones tomadas
- El flujo de descompresión se ejecuta completamente del lado del cliente en WebAssembly/JavaScript puro (`jszip`) sin enviar datos preliminares al servidor, logrando latencia cero y manteniendo la privacidad del diseño.

## Próximos pasos
1. Sincronizar cambios en GitHub (`git push`).
2. Implementar la tarea `CAD-12`: Catálogo visual interactivo de simbología IEC 60617 con arrastre directo al canvas desde una paleta lateral clasificada.
