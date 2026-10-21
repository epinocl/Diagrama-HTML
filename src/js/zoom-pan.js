/**
 * Modulo Zoom y Pan Fluido para Planos A3
 * Permite acercar, alejar, encajar en pantalla y arrastrar con el ratón.
 */

class ZoomPanController {
  constructor(viewportEl, stageEl, onZoomChange) {
    this.viewport = viewportEl;
    this.stage = stageEl;
    this.onZoomChange = onZoomChange;

    this.scale = 1.0;
    this.minScale = 0.3;
    this.maxScale = 4.0;
    this.panX = 0;
    this.panY = 0;

    this.isDragging = false;
    this.startX = 0;
    this.startY = 0;

    this.baseWidth = 1191;
    this.baseHeight = 842;

    this.init();
  }

  init() {
    this.fitToScreen();

    // Eventos de ratón para Pan (Arrastre)
    this.viewport.addEventListener("mousedown", (e) => this.onMouseDown(e));
    window.addEventListener("mousemove", (e) => this.onMouseMove(e));
    window.addEventListener("mouseup", () => this.onMouseUp());

    // Zoom con Rueda del Ratón (centrado en cursor)
    this.viewport.addEventListener("wheel", (e) => this.onWheel(e), { passive: false });

    // Ajuste automático al redimensionar ventana
    window.addEventListener("resize", () => {
      if (this.scale <= this.getFitScale() * 1.05) {
        this.fitToScreen();
      }
    });
  }

  getFitScale() {
    const vWidth = this.viewport.clientWidth - 40;
    const vHeight = this.viewport.clientHeight - 40;
    const scaleX = vWidth / this.baseWidth;
    const scaleY = vHeight / this.baseHeight;
    return Math.min(scaleX, scaleY);
  }

  fitToScreen() {
    this.scale = this.getFitScale();
    this.panX = 0;
    this.panY = 0;
    this.applyTransform();
  }

  zoomAtPoint(delta, clientX, clientY) {
    const prevScale = this.scale;
    const newScale = Math.min(this.maxScale, Math.max(this.minScale, prevScale * (delta > 0 ? 1.15 : 0.85)));

    if (newScale === prevScale) return;

    // Centrar zoom en la posición del ratón
    const rect = this.viewport.getBoundingClientRect();
    const mouseX = clientX - rect.left - rect.width / 2;
    const mouseY = clientY - rect.top - rect.height / 2;

    this.panX -= (mouseX - this.panX) * (newScale / prevScale - 1);
    this.panY -= (mouseY - this.panY) * (newScale / prevScale - 1);
    this.scale = newScale;

    this.applyTransform();
  }

  zoomIn() {
    const rect = this.viewport.getBoundingClientRect();
    this.zoomAtPoint(1, rect.left + rect.width / 2, rect.top + rect.height / 2);
  }

  zoomOut() {
    const rect = this.viewport.getBoundingClientRect();
    this.zoomAtPoint(-1, rect.left + rect.width / 2, rect.top + rect.height / 2);
  }

  setZoom100() {
    this.scale = 1.0;
    this.panX = 0;
    this.panY = 0;
    this.applyTransform();
  }

  applyTransform() {
    this.stage.style.transform = `translate(${this.panX}px, ${this.panY}px) scale(${this.scale})`;
    if (this.onZoomChange) {
      this.onZoomChange(Math.round(this.scale * 100));
    }
  }

  onMouseDown(e) {
    if (e.button !== 0) return; // Solo botón izquierdo

    // Si estamos en modo mover texto y el clic fue sobre un elemento de texto, no iniciar paneo
    if (typeof modoEdicionActivo !== "undefined" && modoEdicionActivo) {
      if (e.target && (e.target.tagName === "text" || e.target.tagName === "tspan" || (e.target.closest && e.target.closest("text")))) {
        return;
      }
    }

    this.isDragging = true;
    this.startX = e.clientX - this.panX;
    this.startY = e.clientY - this.panY;
    this.viewport.classList.add("panning");
  }

  onMouseMove(e) {
    if (!this.isDragging) return;
    if (typeof modoEdicionActivo !== "undefined" && modoEdicionActivo && typeof textoSeleccionado !== "undefined" && textoSeleccionado) {
      this.isDragging = false;
      this.viewport.classList.remove("panning");
      return;
    }
    this.panX = e.clientX - this.startX;
    this.panY = e.clientY - this.startY;
    this.applyTransform();
  }

  onMouseUp() {
    if (this.isDragging) {
      this.isDragging = false;
      this.viewport.classList.remove("panning");
    }
  }

  onWheel(e) {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 1 : -1;
    this.zoomAtPoint(delta, e.clientX, e.clientY);
  }
}
