# Evaluación Técnica y Mejoras del Roadmap Interactivo (Mapa Vivo)

**Documento:** EVAL-RDM-01  
**Proyecto:** Diagrama-HTML (AXON CAD Web)  
**Referencia Base:** `C:\IA EPINO LOCAL\mapa.html`  
**Implementación Final:** `C:\IA EPINO LOCAL\DIAGRAMA-HTML\roadmap.html` y `C:\IA EPINO LOCAL\roadmap_diagrama.html`  
**Fecha:** 2026-10-21  

---

## 1. Resumen Ejecutivo

El usuario propuso como inspiración el archivo `C:\IA EPINO LOCAL\mapa.html`, un panel de control interactivo desarrollado para el proyecto de telemetría industrial `opc-ua_to_mqtt`. Dicha herramienta combina un diagrama de flujo en SVG animado con un checklist reactivo conectado a `localStorage` y exportación a Markdown.

Se realizó un análisis exhaustivo de sus fortalezas y áreas de oportunidad para diseñar el nuevo **Mapa Vivo de Desarrollo para Diagrama-HTML (AXON CAD Web)**, elevándolo al estándar de una suite de ingeniería de software con gobernanza GAMP 5, trazabilidad ALCOA+ y control topológico de fases.

---

## 2. Matriz Comparativa: `mapa.html` vs `roadmap.html` (Diagrama-HTML)

| Dimensión | `mapa.html` (Referencia) | `roadmap.html` (Nueva Implementación) | Impacto de la Mejora |
| :--- | :--- | :--- | :--- |
| **Topología Visual** | Pipeline en zigzag fijo para captura y reenvío de datos IoT (8 nodos secuenciales). | **Arquitectura de capas de software CAD**: Gobernanza/Docs -> Motor CAD Topológico -> Frontend React 19/Vite -> Servidor Ubuntu -> QA GAMP 5. | Modela con precisión la arquitectura cliente-servidor real del sistema CAD. |
| **Monitoreo en Nodos SVG** | Solo texto estático ("COMPLETADA" o "PENDIENTE"). | **Mini-barras de progreso integradas en cada nodo** con cálculo en tiempo real de porcentaje completado y cambio dinámico de color. | Visibilidad gráfica instantánea del avance relativo de cada subsistema. |
| **Métricas & KPIs** | 5 métricas básicas (Progreso %, Listas, Pendientes, Total, RAM). | **6 KPIs ejecutivos**: Progreso Global %, Tareas Completadas, Tareas Pendientes, Total Tareas (39), **Fases Cerradas (ej. 1/5)** y **Próximo Hito Crítico (Fase actual)**. | Permite a la gerencia de ingeniería auditar compuertas de entrega en un segundo. |
| **Priorización de Tareas** | Sin niveles de prioridad visible. | **Badges de prioridad con código de color**: `Crítica` (#fb7185), `Alta` (#fbbf24) y `Media` (#cbd5e1). | Identificación inmediata de los componentes bloqueantes del motor CAD. |
| **Operaciones Masivas** | Marcado individual casilla por casilla. | **Botón de acción masiva "✓ Completar Fase"**: Cierra todas las tareas de una fase aprobada en un solo clic. | Acelera la actualización tras la firma de actas o avances semanales. |
| **Interoperabilidad** | Solo exportación a `ROADMAP.md`. | **Sincronización total**: Exportar a Markdown, **Exportar snapshot a JSON**, e **Importar backup desde JSON**. | Facilita respaldos, migración entre navegadores y control de versiones. |
| **Filtros por Disciplina** | 3 píldoras fijas (`opc`, `mqtt`, `web`). | **6 píldoras de disciplina de ingeniería**: `Motor CAD`, `Símbolos IEC`, `Frontend UI`, `Ubuntu Server`, `Doc / GAMP 5`, `Testing QA`. | Filtra instantáneamente tareas según el rol del desarrollador/revisor. |
| **Feedback al Usuario** | Sin notificación de guardado. | **Toast flotante no intrusivo** que confirma auto-guardado en almacenamiento local o exportación de archivos. | Certeza visual de que ningún cambio se pierde. |
| **Estética y Rendimiento** | Estilo dark funcional. | **Estética Cyber-CAD Industrial**: Gradientes sutiles, micro-animaciones en conductos SVG, tipografía Segoe UI/Roboto y 60 FPS nativo sin librerías externas. | Imagen corporativa de alto impacto para presentaciones ejecutivas. |

---

## 3. Desglose de Mejoras Técnicas Implementadas

### 3.1. Topología Gráfica Adaptada a Ingeniería CAD
En lugar de una cadena serial de periféricos, el mapa SVG integra:
1. **Flujo Principal de Fases**: Los 5 hitos del proyecto vinculados por tuberías vectoriales con animación de pulso (`pipe-link active`).
2. **Periféricos de Contexto**:
   - *Simbología & Normativa*: Biblioteca IEC 60617, terminales magnéticos `(px, py)` y cajetines DIN ISO 5457 A3.
   - *Infraestructura AXON*: Ubuntu Server 24.04 LTS, Nginx `:8080` y Audit Trail ALCOA+.
   - *Interoperabilidad CAD*: Exportador AutoCAD DXF R12 métrico 1:1 y SVG multilámina.

### 3.2. Lógica Reactiva de Nodos en Tiempo Real
Cada vez que el usuario activa o desactiva un checkbox en el panel derecho:
```javascript
// Cálculo y actualización gráfica de cada nodo en el SVG
const phTasks = tasks.filter(t => t.phase === ph);
const pct = Math.round((done / total) * 100);
nodeBar.setAttribute('width', Math.round((pct / 100) * maxW));
if (pct === 100) {
  nodeStatus.textContent = '✓ 100% COMPLETADA';
  nodeStatus.setAttribute('fill', '#10b981');
} else if (pct > 0) {
  nodeStatus.textContent = `⚡ ${pct}% EN CURSO`;
  nodeStatus.setAttribute('fill', '#f59e0b');
} else {
  nodeStatus.textContent = '⏳ PENDIENTE';
  nodeStatus.setAttribute('fill', '#94a3b8');
}
```

### 3.3. Estructuración Completa de las 39 Tareas Semilla
Se consolidaron en el JSON semilla las 39 tareas críticas del proyecto:
- **Fase 1 (9 tareas / 100% completada)**: Inicialización Git, Línea base `origen/` v3.0, URS GAMP 5, Arquitectura C4, Dependencias, Planes y Estudio Técnico CAD.
- **Fase 2 (12 tareas / Prioridad actual)**: Conductores topológicos `WireNet`, ruteo ortogonal 90°, corte interactivo, extensión, bornas magnéticas IEC 60617, auto-anclaje snap, rubber-banding elástico, geometrías primitivas, agrupación `DOMMatrix`, inspector modal de propiedades y comando Undo/Redo.
- **Fase 3 (7 tareas)**: Setup React 19 + TypeScript + Vite, Store Zustand a 60 FPS, modularización del visor, configurador cromático, exportador DXF y catálogo IEC drag & drop.
- **Fase 4 (6 tareas)**: Aprovisionamiento en `/opt/axon/diagrama-html/`, API REST Node.js, microservicios Python `PyMuPDF`/`ezdxf`, Nginx SSL, PM2 y Audit Trail ALCOA+.
- **Fase 5 (5 tareas)**: Suite Vitest, pruebas E2E Playwright, GitHub Actions CI/CD, protocolo IQ/OQ GAMP 5 y manual operativo.

---

## 4. Disponibilidad y Accesibilidad

El archivo se encuentra disponible para su apertura inmediata mediante doble clic en el navegador en dos ubicaciones convenientes:
*   Repositorio: [`C:\IA EPINO LOCAL\DIAGRAMA-HTML\roadmap.html`](file:///C:/IA%20EPINO%20LOCAL/DIAGRAMA-HTML/roadmap.html)
*   Raíz local: [`C:\IA EPINO LOCAL\roadmap_diagrama.html`](file:///C:/IA%20EPINO%20LOCAL/roadmap_diagrama.html)
