# AV-20261021-005 - Puesta en Marcha del Entorno React 19 + TypeScript, Docker Desktop y Motor Topológico CAD

## Objetivo
1. Validar e instalar todas las dependencias locales requeridas en el entorno de desarrollo (Node.js, npm, Python con `ezdxf`, Docker Desktop).
2. Inicializar la estructura modular de la GUI Web en **React 19 + TypeScript + Vite**, configurando soporte de compilación local y contenedores Docker para desarrollo (`dev`) y producción (`prod` con Nginx Alpine).
3. Implementar y validar los algoritmos topológicos iniciales de la **Fase 2** (`CAD-01` a `CAD-08`):
   - Modelado de conductores (`WireNet`, `WireSegment`) con potencial eléctrico.
   - Puertos magnéticos de conexión IEC 60617 (`ConnectionPort`).
   - Ruteo ortogonal adaptativo en 90° (Manhattan routing).
   - Cortar (Split) y extender tramos de cables.
   - Adaptación elástica de conductores (*rubber-banding*) al arrastrar componentes en el plano.
   - Inspector de propiedades híbrido (panel lateral y modal desacoplable flotante).
4. Ejecutar la suite de pruebas unitarias automatizadas con **Vitest** (6/6 aprobadas) y verificar la compilación de producción con `npm run build` (0 errores).

## Requisitos / documentos relacionados
- Solicitud de usuario: "PROCEDE AQUI PODEMOS COMPILAR Y PROBAR LOCAL, TENEMOS DOCKER DESKTOP, REVISA SI NOS FALTAN DEPENDENCIAS".
- ADR-01 (React 19 + Vite), ADR-02 (Ruteo Ortogonal 90°), ADR-03 (Inspector Híbrido) y ADR-04 (GAMP 5 Cat. 4).
- `docs/ARCHITECTURE.md`, `docs/RAID_BOARD.md` y `docs/ROADMAP.md`.

## Estado inicial
- El repositorio contaba con la estructura documental de Fase 1 y la copia inmutable de `origen/`.
- No existía `package.json`, configuración de TypeScript ni dependencias instaladas en la raíz.
- En el entorno de Python faltaba la librería `ezdxf` para conversiones CAD en background.
- No existían archivos de configuración de Docker para pruebas en contenedores.

## Trabajo realizado
1. **Auditoría e Instalación de Dependencias**:
   - Se verificó **Node.js v24.18.0** y **npm v11.16.0**.
   - Se verificó **Docker Desktop v29.6.2** activo y respondiendo a comandos de contenedor.
   - Se verificó **Python 3.14.6** con `pymupdf` (1.28.0), `pillow` (12.2.0) y `pytest` (8.3.5).
   - Se instaló la dependencia faltante **`ezdxf` (v1.4.5)** mediante `python -m pip install ezdxf`.
2. **Inicialización del Ecosistema Frontend React 19 + TypeScript**:
   - `package.json`: Configurado con scripts `dev`, `build`, `test`, `preview` y dependencias clave: `react@19.0.0`, `react-dom@19.0.0`, `zustand@5.0.3`, `lucide-react@0.475.0`, `typescript@5.7.3`, `vite@6.1.0` y `vitest@3.0.5`.
   - `tsconfig.json`: Tipado estricto ES2022 con soporte JSX y resolución moderna Bundler.
   - `vite.config.ts`: Configurado para desarrollo interactivo en puerto `3000` con soporte `--host`.
3. **Configuración de Docker Desktop**:
   - `Dockerfile`: Multi-etapa optimizado con Node.js 24 Alpine para desarrollo con recarga en caliente (`dev`), y Nginx Alpine para producción (`prod`), reproduciendo fielmente la arquitectura del Servidor Ubuntu de AXON.
   - `docker-compose.yml`: Servicios `cad-dev` (puerto 3000) y `cad-prod` (puerto 8088).
4. **Implementación del Motor Topológico CAD (`src/cad/`)**:
   - `src/cad/types.ts`: Definición de interfaces tipadas para `WireNet`, `WireSegment`, `ConnectionPort`, `ComponentEntity`, `GeometryEntity` y `ProjectDocument`.
   - `src/cad/topology.ts`: Algoritmos matemáticos puros para `snapToGrid`, `snapToNearestPort`, `routeOrthoWire` (90° Manhattan), `splitWireSegment`, `extendWireSegment` y `findIntersection`.
5. **Testing Automatizado con Vitest (`tests/topology.test.ts`)**:
   - 6 pruebas unitarias implementadas validando anclaje métrico, generación de esquinas 90°, división de cables, proyección elástica y detección magnética de bornes IEC.
   - **Resultado: 6/6 tests pasando en 8 ms**.
6. **Construcción de la Interfaz Gráfica (`src/components/` & `src/store/`)**:
   - `src/store/useCadStore.ts`: Store global reactivo con Zustand que gestiona herramientas, selección, zoom, pan, componentes y actualización en tiempo real de cables conectados (rubber-banding).
   - `src/components/Toolbar.tsx`: Barra de herramientas CAD (Seleccionar, Cable 90°, Cortar/Split, Extender, Rejilla, Magnetismo, Modo Impresión/Oscuro, Inspector).
   - `src/components/PropertyInspector.tsx`: Inspector híbrido lateral derecho con opción de desacoplar como ventana flotante modal.
   - `src/components/CadCanvas.tsx`: Canvas interactivo SVG A3 (420 x 297 mm) con previsualización ortogonal, halos de selección y bornas magnéticas.
7. **Compilación de Producción**:
   - Se ejecutó `npm run build` (`tsc && vite build`), generando `dist/` en 3.03 segundos con **cero errores de compilación**.
8. **Verificación en Servidor de Desarrollo**:
   - Servidor Vite activo en `http://localhost:3000/` verificado mediante subagente de navegador.

## Archivos creados
- `package.json` y `package-lock.json`
- `tsconfig.json` y `vite.config.ts`
- `Dockerfile` y `docker-compose.yml`
- `src/cad/types.ts`
- `src/cad/topology.ts`
- `src/store/useCadStore.ts`
- `src/components/Toolbar.tsx`
- `src/components/PropertyInspector.tsx`
- `src/components/CadCanvas.tsx`
- `src/App.tsx` y `src/main.tsx`
- `index.html`
- `tests/topology.test.ts`
- `docs/avances/AV-20261021-005-entorno-react19-docker-motor-cad-verificado.md`

## Decisiones tomadas
- El entorno local queda 100% equipado para compilación directa nativa con Node.js o mediante contenedores con Docker Desktop, garantizando paridad exacta con el futuro despliegue en Ubuntu Server.
- Los algoritmos de topología de líneas y magnetismo de bornas se mantienen desacoplados de la UI en funciones puras para asegurar testabilidad continua.

## Próximos pasos
1. Integrar el catálogo completo de símbolos SVG de `origen/simbologia/` como componentes instanciables con drag-and-drop al canvas.
2. Añadir herramienta interactiva de trazado de primitivas geométricas (rectángulo, círculo, cota).
