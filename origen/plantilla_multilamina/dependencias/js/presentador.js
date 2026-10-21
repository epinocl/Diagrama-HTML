/**
 * Logica Principal del Presentador de Planos A3 (Estilo PPT) - AXON CAD
 * Soporta renderizado vectorial inline (manipulación directa de textos y elementos),
 * arrastre y edición de textos en vivo, modo continuo vertical, comparación con boceto original,
 * impresión A3 normalizada 1:1 y atajos completos de teclado.
 */

let zoomController = null;
let currentSheetIndex = 0;
let mostrandoBocetoOriginal = false;
let modoContinuoActivo = false;

document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("theme-autocad");
  initUI();
  initZoomPan();
  initEventListeners();
  initCadHUD();
  if (typeof initEditorTextos === "function") {
    initEditorTextos();
  }
  irAHoja(0);
});

function initUI() {
  const picker = document.getElementById("sheetPicker");
  const slideStrip = document.getElementById("slideStrip");
  const tocList = document.getElementById("tocList");

  if (picker) picker.innerHTML = "";
  if (slideStrip) slideStrip.innerHTML = "";
  if (tocList) tocList.innerHTML = "";

  if (typeof HOJAS_DATA === "undefined" || !Array.isArray(HOJAS_DATA)) {
    console.warn("HOJAS_DATA no está definido o no es un arreglo.");
    return;
  }

  HOJAS_DATA.forEach((hoja, idx) => {
    // 1. Selector desplegable
    if (picker) {
      const opt = document.createElement("option");
      opt.value = idx;
      opt.textContent = `[${hoja.codigo_lamina}] ${hoja.titulo_corto} - ${hoja.titulo_largo}`;
      picker.appendChild(opt);
    }

    // 2. Tira de miniaturas
    if (slideStrip) {
      const thumb = document.createElement("div");
      thumb.className = `thumb-item ${idx === 0 ? "active" : ""}`;
      thumb.dataset.index = idx;
      thumb.title = `[${hoja.codigo_lamina}] ${hoja.titulo_largo}`;
      const thumbSrc = hoja.archivo_thumb || hoja.archivo_svg;
      thumb.innerHTML = `
        <img src="${thumbSrc}" alt="${hoja.titulo_corto}">
        <span class="thumb-badge">${hoja.codigo_lamina}</span>
      `;
      thumb.addEventListener("click", () => {
        if (modoContinuoActivo) toggleModoContinuo(false);
        irAHoja(idx);
      });
      slideStrip.appendChild(thumb);
    }

    // 3. Índice en panel lateral
    if (tocList) {
      const tocItem = document.createElement("div");
      tocItem.className = "toc-row";
      tocItem.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:10px; border-bottom:1px solid rgba(255,255,255,0.08); cursor:pointer;">
          <div>
            <span style="font-family:monospace; color:#38bdf8; font-weight:bold; margin-right:8px;">[${hoja.codigo_lamina}]</span>
            <span style="font-size:13px; color:#f8fafc; font-weight:600;">${hoja.titulo_corto}</span>
            <div style="font-size:11px; color:#94a3b8; margin-top:3px;">${hoja.titulo_largo}</div>
          </div>
          <span style="font-size:11px; background:rgba(255,255,255,0.08); padding:3px 8px; border-radius:10px; color:#cbd5e1;">${hoja.disciplina || "General"}</span>
        </div>
      `;
      tocItem.addEventListener("click", () => {
        if (modoContinuoActivo) toggleModoContinuo(false);
        irAHoja(idx);
        toggleSidebar(false);
      });
      tocList.appendChild(tocItem);
    }
  });
}

function initZoomPan() {
  const viewport = document.getElementById("viewport");
  const stage = document.getElementById("stage");
  const zoomLabel = document.getElementById("zoomLevel");

  if (viewport && stage && typeof ZoomPanController !== "undefined") {
    zoomController = new ZoomPanController(viewport, stage, (pct) => {
      if (zoomLabel) zoomLabel.textContent = `${pct}%`;
    });
  }
}

function irAHoja(index) {
  if (typeof HOJAS_DATA === "undefined" || index < 0 || index >= HOJAS_DATA.length) return;
  currentSheetIndex = index;
  mostrandoBocetoOriginal = false;
  actualizarBotonComparacion();

  const hoja = HOJAS_DATA[index];
  const container = document.getElementById("activeSheetContainer") || document.getElementById("activeSheet");
  if (!container) return;

  // Inserción directa de SVG Inline cuando esté disponible (permite manipular DOM y arrastrar textos)
  const svgContent = (typeof HOJAS_SVG_CONTENT !== "undefined" && HOJAS_SVG_CONTENT && HOJAS_SVG_CONTENT[hoja.numero]) 
    ? HOJAS_SVG_CONTENT[hoja.numero] 
    : null;

  if (svgContent) {
    container.innerHTML = svgContent;
  } else if (hoja.archivo_svg) {
    container.innerHTML = `<img src="${hoja.archivo_svg}" class="sheet-svg" alt="${hoja.titulo_largo}">`;
  }

  // Aplicar ajustes manuales guardados por el usuario
  if (typeof aplicarAjustesGuardados === "function") {
    aplicarAjustesGuardados();
  }

  // Si estamos en modo impresión, forzar de inmediato el contraste para evitar textos blancos
  if (document.body.classList.contains("theme-print") && typeof forzarContrasteImpresion === "function") {
    forzarContrasteImpresion(container);
  }

  // Actualizar controles
  const picker = document.getElementById("sheetPicker");
  if (picker) picker.value = index;

  const counter = document.getElementById("sheetCounter");
  if (counter) {
    const totalStr = HOJAS_DATA.length < 10 ? `0${HOJAS_DATA.length}` : `${HOJAS_DATA.length}`;
    counter.textContent = `${hoja.codigo_lamina} / ${totalStr}`;
  }

  document.querySelectorAll(".thumb-item").forEach((el, idx) => {
    el.classList.toggle("active", idx === index);
  });

  const activeThumb = document.querySelector(`.thumb-item[data-index="${index}"]`);
  if (activeThumb) {
    activeThumb.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }

  if (zoomController && !modoContinuoActivo) {
    zoomController.fitToScreen();
  }
}

function toggleBocetoOriginal() {
  if (typeof HOJAS_DATA === "undefined") return;
  const hoja = HOJAS_DATA[currentSheetIndex];
  if (!hoja || !hoja.boceto_original) {
    if (typeof mostrarNotificacion === "function") {
      mostrarNotificacion("Esta lámina no tiene boceto escaneado asociado.");
    }
    return;
  }

  mostrandoBocetoOriginal = !mostrandoBocetoOriginal;
  const container = document.getElementById("activeSheetContainer") || document.getElementById("activeSheet");
  if (!container) return;

  if (mostrandoBocetoOriginal) {
    container.innerHTML = `<img src="${hoja.boceto_original}" class="sheet-svg" style="object-fit:contain; background:#ffffff;" alt="Boceto Original">`;
  } else {
    irAHoja(currentSheetIndex);
  }

  actualizarBotonComparacion();
}

function actualizarBotonComparacion() {
  const btn = document.getElementById("btnToggleBoceto");
  if (!btn) return;
  if (mostrandoBocetoOriginal) {
    btn.innerHTML = "✏️ Ver Plano CAD";
    btn.style.background = "#10b981";
    btn.style.borderColor = "#10b981";
  } else {
    btn.innerHTML = "📝 Boceto Original (C)";
    btn.style.background = "rgba(255, 255, 255, 0.08)";
    btn.style.borderColor = "rgba(255, 255, 255, 0.15)";
  }
}

function toggleModoContinuo(forzar) {
  if (typeof forzar === "boolean") {
    modoContinuoActivo = forzar;
  } else {
    modoContinuoActivo = !modoContinuoActivo;
  }

  const btn = document.getElementById("btnModoContinuo");
  const stage = document.getElementById("stage");
  const viewport = document.getElementById("viewport");
  const floatingZoom = document.querySelector(".zoom-floating-bar");

  if (!stage || !viewport) return;

  if (modoContinuoActivo) {
    if (btn) {
      btn.innerHTML = "🖼️ Modo Diapositivas";
      btn.style.background = "#0284c7";
      btn.style.borderColor = "#0284c7";
    }

    viewport.classList.add("continuous-view");
    stage.style.transform = "none";
    if (floatingZoom) floatingZoom.style.display = "none";

    // Renderizar todas las láminas en secuencia vertical
    let allHtml = "";
    HOJAS_DATA.forEach((h) => {
      const svg = (typeof HOJAS_SVG_CONTENT !== "undefined" && HOJAS_SVG_CONTENT && HOJAS_SVG_CONTENT[h.numero]) 
        ? HOJAS_SVG_CONTENT[h.numero] 
        : null;
      allHtml += `
        <div class="a3-sheet continuous-sheet" style="margin-bottom: 24px; box-shadow: 0 15px 35px rgba(0,0,0,0.5);">
          ${svg || `<img src="${h.archivo_svg}" class="sheet-svg" alt="${h.titulo_largo}">`}
        </div>
      `;
    });
    stage.innerHTML = allHtml;
    if (typeof mostrarNotificacion === "function") {
      mostrarNotificacion(`Modo Continuo activo: Desplázate verticalmente para ver las ${HOJAS_DATA.length} láminas.`);
    }
  } else {
    if (btn) {
      btn.innerHTML = "📄 Ver Láminas";
      btn.style.background = "rgba(255, 255, 255, 0.08)";
      btn.style.borderColor = "rgba(255, 255, 255, 0.15)";
    }

    viewport.classList.remove("continuous-view");
    if (floatingZoom) floatingZoom.style.display = "flex";

    stage.innerHTML = `
      <div class="a3-sheet" id="activeSheetContainer"></div>
    `;
    irAHoja(currentSheetIndex);
  }
}

function hojaSiguiente() {
  if (modoContinuoActivo) toggleModoContinuo(false);
  if (currentSheetIndex < HOJAS_DATA.length - 1) {
    irAHoja(currentSheetIndex + 1);
  } else {
    irAHoja(0);
  }
}

function hojaAnterior() {
  if (modoContinuoActivo) toggleModoContinuo(false);
  if (currentSheetIndex > 0) {
    irAHoja(currentSheetIndex - 1);
  } else {
    irAHoja(HOJAS_DATA.length - 1);
  }
}

function initEventListeners() {
  const btnPrev = document.getElementById("btnPrev");
  if (btnPrev) btnPrev.addEventListener("click", hojaAnterior);

  const btnNext = document.getElementById("btnNext");
  if (btnNext) btnNext.addEventListener("click", hojaSiguiente);

  const picker = document.getElementById("sheetPicker");
  if (picker) {
    picker.addEventListener("change", (e) => {
      if (modoContinuoActivo) toggleModoContinuo(false);
      irAHoja(parseInt(e.target.value, 10));
    });
  }

  const btnBoceto = document.getElementById("btnToggleBoceto");
  if (btnBoceto) btnBoceto.addEventListener("click", toggleBocetoOriginal);

  const btnContinuo = document.getElementById("btnModoContinuo");
  if (btnContinuo) btnContinuo.addEventListener("click", () => toggleModoContinuo());

  const btnMover = document.getElementById("btnModoMover");
  if (btnMover && typeof toggleModoMoverTextos === "function") {
    btnMover.addEventListener("click", toggleModoMoverTextos);
  }

  const btnMoverSimbolos = document.getElementById("btnModoMoverSimbolos");
  if (btnMoverSimbolos && typeof toggleModoMoverSimbolos === "function") {
    btnMoverSimbolos.addEventListener("click", toggleModoMoverSimbolos);
  }

  const btnDownloadSvg = document.getElementById("btnDownloadSvg");
  if (btnDownloadSvg && typeof descargarSVGActual === "function") {
    btnDownloadSvg.addEventListener("click", descargarSVGActual);
  }

  // Zoom
  const btnZoomIn = document.getElementById("btnZoomIn");
  if (btnZoomIn && zoomController) btnZoomIn.addEventListener("click", () => zoomController.zoomIn());

  const btnZoomOut = document.getElementById("btnZoomOut");
  if (btnZoomOut && zoomController) btnZoomOut.addEventListener("click", () => zoomController.zoomOut());

  const btnZoomFit = document.getElementById("btnZoomFit");
  if (btnZoomFit && zoomController) btnZoomFit.addEventListener("click", () => zoomController.fitToScreen());

  const btnZoom100 = document.getElementById("btnZoom100");
  if (btnZoom100 && zoomController) btnZoom100.addEventListener("click", () => zoomController.setZoom100());

  // Pantalla Completa
  const btnFullscreen = document.getElementById("btnFullscreen");
  if (btnFullscreen) btnFullscreen.addEventListener("click", toggleFullscreen);

  // Impresión A3 (Prepara las láminas en el contenedor de impresión)
  const btnPrintSheet = document.getElementById("btnPrintSheet");
  if (btnPrintSheet) {
    btnPrintSheet.addEventListener("click", () => {
      prepararImpresionCompleta();
      window.print();
    });
  }

  // Alternar Tema AutoCAD Electrical / Impresión A3
  const btnToggleTema = document.getElementById("btnToggleTema");
  if (btnToggleTema) {
    btnToggleTema.addEventListener("click", () => {
      const isAutoCad = document.body.classList.contains("theme-autocad");
      if (isAutoCad) {
        document.body.classList.remove("theme-autocad");
        document.body.classList.add("theme-print");
        btnToggleTema.innerHTML = "📄 Modo Impresión";
        btnToggleTema.title = "Cambiar a Modo AutoCAD Electrical (Modelo Oscuro)";
        const badge = document.getElementById("hudModeBadge");
        if (badge) badge.textContent = "PAPER SPACE (A3)";
        const container = document.getElementById("activeSheetContainer") || document.getElementById("activeSheet");
        if (typeof forzarContrasteImpresion === "function") {
          forzarContrasteImpresion(container);
        }
      } else {
        document.body.classList.remove("theme-print");
        document.body.classList.add("theme-autocad");
        btnToggleTema.innerHTML = "⚡ Modo AutoCAD";
        btnToggleTema.title = "Cambiar a Modo Impresión (Papel Blanco)";
        const badge = document.getElementById("hudModeBadge");
        if (badge) badge.textContent = "MODEL SPACE (ACI)";
        // Restaurar SVG limpio de CAD
        irAHoja(currentSheetIndex);
      }
    });
  }

  // Exportar Lámina Actual a DXF (AutoCAD Electrical 1:1 en mm)
  const btnExportDxf = document.getElementById("btnExportDxf");
  if (btnExportDxf) {
    btnExportDxf.addEventListener("click", () => {
      if (typeof window.exportarDxfActual === "function") {
        window.exportarDxfActual();
      } else {
        alert("El exportador DXF no está disponible.");
      }
    });
  }

  // Exportar Lote Completo a DXF
  const btnActionExportarDxfLote = document.getElementById("btnActionExportarDxfLote");
  if (btnActionExportarDxfLote) {
    btnActionExportarDxfLote.addEventListener("click", () => {
      if (typeof window.exportarDxfLote === "function") {
        window.exportarDxfLote();
      }
    });
  }

  // Paneles
  const btnToggleSidebar = document.getElementById("btnToggleSidebar");
  if (btnToggleSidebar) btnToggleSidebar.addEventListener("click", () => toggleSidebar());

  const btnCloseSidebar = document.getElementById("btnCloseSidebar");
  if (btnCloseSidebar) btnCloseSidebar.addEventListener("click", () => toggleSidebar(false));

  // Pestañas lateral
  document.querySelectorAll(".sidebar-tab").forEach((tab) => {
    tab.addEventListener("click", (e) => {
      document.querySelectorAll(".sidebar-tab").forEach((t) => t.classList.remove("active"));
      e.target.classList.add("active");
      const target = e.target.dataset.tab;
      const tabToc = document.getElementById("tabToc");
      const tabBom = document.getElementById("tabBom");
      if (tabToc) tabToc.style.display = target === "toc" ? "block" : "none";
      if (tabBom) tabBom.style.display = target === "bom" ? "block" : "none";
    });
  });

  // Atajos de teclado
  window.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT" || e.target.isContentEditable) return;

    switch (e.key) {
      case "ArrowRight":
      case "PageDown":
      case " ":
      case "d":
      case "D":
        hojaSiguiente();
        break;
      case "ArrowLeft":
      case "PageUp":
      case "Backspace":
      case "a":
      case "A":
        hojaAnterior();
        break;
      case "c":
      case "C":
        toggleBocetoOriginal();
        break;
      case "m":
      case "M":
        if (typeof toggleModoMoverTextos === "function") toggleModoMoverTextos();
        break;
      case "v":
      case "V":
        toggleModoContinuo();
        break;
      case "f":
      case "F":
        toggleFullscreen();
        break;
      case "p":
      case "P":
        if (!e.ctrlKey) {
          prepararImpresionCompleta();
          window.print();
        }
        break;
      case "s":
      case "S":
        if (typeof abrirModalGuardar === "function") {
          e.preventDefault();
          abrirModalGuardar();
        }
        break;
      case "0":
      case "r":
      case "R":
        if (!modoContinuoActivo && zoomController) zoomController.fitToScreen();
        break;
      case "+":
      case "=":
        if (!modoContinuoActivo && zoomController) zoomController.zoomIn();
        break;
      case "-":
      case "_":
        if (!modoContinuoActivo && zoomController) zoomController.zoomOut();
        break;
      case "b":
      case "B":
        toggleSidebar();
        break;
      case "Escape":
        toggleSidebar(false);
        if (typeof cerrarModalGuardar === "function") cerrarModalGuardar();
        if (typeof modoEdicionActivo !== "undefined" && modoEdicionActivo && typeof toggleModoMoverTextos === "function") {
          toggleModoMoverTextos();
        }
        break;
    }
  });
}

function prepararImpresionCompleta() {
  const printCont = document.getElementById("printAllContainer");
  if (!printCont || typeof HOJAS_DATA === "undefined") return;

  // Sincronizar en memoria viva cualquier ajuste de la lámina actual
  if (typeof sincronizarSvgActivoEnMemoria === "function") {
    sincronizarSvgActivoEnMemoria();
  }

  printCont.innerHTML = "";
  HOJAS_DATA.forEach((hoja) => {
    const div = document.createElement("div");
    div.className = "a3-sheet";
    const svg = (typeof HOJAS_SVG_CONTENT !== "undefined" && HOJAS_SVG_CONTENT && HOJAS_SVG_CONTENT[hoja.numero]) 
      ? HOJAS_SVG_CONTENT[hoja.numero] 
      : null;
    div.innerHTML = svg || `<img src="${hoja.archivo_svg}" class="sheet-svg" alt="${hoja.titulo_largo}">`;
    printCont.appendChild(div);
  });
}

// Sincronizar automáticamente al imprimir por cualquier vía (botón, Ctrl+P o menú)
let temaPrevioAntesDeImprimir = null;
window.addEventListener("beforeprint", () => {
  prepararImpresionCompleta();
  if (document.body.classList.contains("theme-autocad")) {
    temaPrevioAntesDeImprimir = "theme-autocad";
    document.body.classList.remove("theme-autocad");
    document.body.classList.add("theme-print");
  }
});

window.addEventListener("afterprint", () => {
  const printCont = document.getElementById("printAllContainer");
  if (printCont) printCont.innerHTML = "";
  if (temaPrevioAntesDeImprimir) {
    document.body.classList.remove("theme-print");
    document.body.classList.add(temaPrevioAntesDeImprimir);
    temaPrevioAntesDeImprimir = null;
  }
});

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen().catch(() => {});
  }
}

function toggleSidebar(forceState) {
  const panel = document.getElementById("sidebarPanel");
  if (!panel) return;
  if (typeof forceState === "boolean") {
    panel.classList.toggle("open", forceState);
  } else {
    panel.classList.toggle("open");
  }
}

function initCadHUD() {
  const viewport = document.getElementById("viewport");
  const lblCoords = document.getElementById("hudCoordinates");
  if (!viewport || !lblCoords) return;

  viewport.addEventListener("mousemove", (e) => {
    const sheet = document.querySelector(".a3-sheet");
    if (!sheet) return;
    const rect = sheet.getBoundingClientRect();
    if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
      const relX = (e.clientX - rect.left) / rect.width;
      const relY = (e.clientY - rect.top) / rect.height;
      const cadX = (relX * 420.0).toFixed(2);
      const cadY = (297.0 - (relY * 297.0)).toFixed(2);
      lblCoords.textContent = `X: ${cadX} mm  Y: ${cadY} mm`;
    }
  });

  viewport.addEventListener("mouseleave", () => {
    lblCoords.textContent = `X: --- mm  Y: --- mm`;
  });
}

/**
 * Forzar contraste inmediato en Modo Impresión sobre cualquier SVG.
 * Garantiza que textos ex-blancos se muestren en negro, los grises en gris oscuro,
 * y los celestes en el color cyan configurado, sin depender de la caché del navegador.
 */
function forzarContrasteImpresion(container) {
  if (!container || !document.body || !document.body.classList.contains("theme-print")) return;

  const textColor = (getComputedStyle(document.documentElement).getPropertyValue("--print-color-text") || "#000000").trim();
  const mutedColor = (getComputedStyle(document.documentElement).getPropertyValue("--print-color-muted") || "#334155").trim();
  const cyanColor = (getComputedStyle(document.documentElement).getPropertyValue("--print-color-cyan") || "#0284c7").trim();
  const blueColor = (getComputedStyle(document.documentElement).getPropertyValue("--print-color-blue") || "#1e3a8a").trim();

  // 1. Textos y tspans
  const textNodes = container.querySelectorAll("text, tspan");
  textNodes.forEach((t) => {
    // Si pertenece al logo AXON, no tocarlo
    if (t.closest("#logo_axon")) return;

    const fillAttr = (t.getAttribute("fill") || "").toLowerCase().trim();
    if (fillAttr === "#ffffff" || fillAttr === "white" || fillAttr === "#fff" || fillAttr === "#f8fafc" || fillAttr === "#f1f5f9") {
      t.style.setProperty("fill", textColor, "important");
    } else if (fillAttr === "#cbd5e1" || fillAttr === "#e2e8f0" || fillAttr === "#94a3b8" || fillAttr === "#64748b") {
      t.style.setProperty("fill", mutedColor, "important");
    } else if (fillAttr === "#38bdf8" || fillAttr === "#60a5fa" || fillAttr === "#00e5ff" || fillAttr === "#00ffff") {
      t.style.setProperty("fill", cyanColor, "important");
    } else if (fillAttr === "#1a66ff") {
      t.style.setProperty("fill", blueColor, "important");
    }
  });

  // 2. Líneas, rectángulos y bordes
  const shapeNodes = container.querySelectorAll("line, rect, circle, path");
  shapeNodes.forEach((el) => {
    if (el.closest("#logo_axon")) return;

    const strokeAttr = (el.getAttribute("stroke") || "").toLowerCase().trim();
    if (strokeAttr === "#ffffff" || strokeAttr === "white" || strokeAttr === "#fff") {
      el.style.setProperty("stroke", "#000000", "important");
    } else if (strokeAttr === "#38bdf8" || strokeAttr === "#60a5fa" || strokeAttr === "#00e5ff") {
      el.style.setProperty("stroke", cyanColor, "important");
    } else if (strokeAttr === "#1a66ff") {
      el.style.setProperty("stroke", blueColor, "important");
    }

    const fillAttr = (el.getAttribute("fill") || "").toLowerCase().trim();
    // Convertir recuadros oscuros de CAD a fondo blanco
    if (
      fillAttr === "#1a2230" || fillAttr === "#162030" || fillAttr === "#1e2433" ||
      fillAttr === "#232d42" || fillAttr === "#0f172a" || fillAttr === "#162032" ||
      fillAttr === "#1e293b" || fillAttr === "#131b28" || fillAttr === "#172033" ||
      fillAttr === "#161f30" || fillAttr === "#131822"
    ) {
      el.style.setProperty("fill", "#ffffff", "important");
      if (el.tagName.toLowerCase() === "rect" && (!strokeAttr || strokeAttr === "none")) {
        el.style.setProperty("stroke", "#000000", "important");
      }
    }
  });
}
window.forzarContrasteImpresion = forzarContrasteImpresion;
