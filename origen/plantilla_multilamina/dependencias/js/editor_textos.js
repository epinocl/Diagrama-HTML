/**
 * Módulo de Edición, Reubicación Manual y Versionado de Planos SVG
 * AXON CAD - DE-5266 Sistema de Visión Blistera Cricca (Polyphem)
 * Soporta arrastre de textos y de símbolos, edición de contenido y ajuste de tamaño de letra (A- / A+).
 */

let modoEdicionActivo = false;
let modoMoverSimbolosActivo = false;
let textoSeleccionado = null;
let textoActivoParaFuente = null;
let simboloSeleccionado = null;
let offsetDragX = 0;
let offsetDragY = 0;
let offsetSimboloX = 0;
let offsetSimboloY = 0;
let transformInicialSimbolo = { x: 0, y: 0 };
let hayCambiosSinGuardar = false;

// Purga automática preventiva de claves localStorage obsoletas (v1) para eliminar desfases por adición de carátula
(function purgarClavesObsoletasV1() {
  try {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith("DE-5266_v1_")) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  } catch (e) {
    // Silencioso en caso de restricciones de storage
  }
})();

function initEditorTextos() {
  const stage = document.getElementById("stage");
  if (!stage) return;

  // Eventos de arrastre con captura (capture: true) para tomar el control antes que zoom-pan
  document.addEventListener("mousedown", onEditorMouseDown, true);
  window.addEventListener("mousemove", onEditorMouseMove, true);
  window.addEventListener("mouseup", onEditorMouseUp, true);
  stage.addEventListener("dblclick", onTextDoubleClick);

  // Rueda del ratón con Alt para ajustar tamaño de fuente sobre cualquier texto
  stage.addEventListener("wheel", onTextWheel, { passive: false });

  // Atajos de teclado para achicar/agrandar fuente con [ y ]
  window.addEventListener("keydown", onEditorKeyDown);

  // Botón para mover símbolos
  const btnMoverSimbolos = document.getElementById("btnModoMoverSimbolos");
  if (btnMoverSimbolos) {
    btnMoverSimbolos.addEventListener("click", toggleModoMoverSimbolos);
  }

  // Botones de ajuste de tamaño de letra en la barra superior
  const btnFontDec = document.getElementById("btnFontDec");
  if (btnFontDec) {
    btnFontDec.addEventListener("click", () => ajustarTamanoFuente(-1));
  }

  const btnFontInc = document.getElementById("btnFontInc");
  if (btnFontInc) {
    btnFontInc.addEventListener("click", () => ajustarTamanoFuente(1));
  }

  // Botón para traer elemento/texto al frente
  const btnBring = document.getElementById("btnBringToFront");
  if (btnBring) {
    btnBring.addEventListener("click", () => traerAlFrente());
  }

  const btnSendBack = document.getElementById("btnSendToBack");
  if (btnSendBack) {
    btnSendBack.addEventListener("click", () => enviarAlFondo());
  }

  // Selector y paleta de colores de texto
  const inputColor = document.getElementById("inputTextColor");
  if (inputColor) {
    inputColor.addEventListener("input", (e) => cambiarColorTexto(e.target.value));
    inputColor.addEventListener("change", (e) => cambiarColorTexto(e.target.value));
  }

  document.querySelectorAll(".btn-color-swatch").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const color = e.currentTarget.dataset.color;
      if (color) cambiarColorTexto(color);
    });
  });

  // Botón principal de Guardar / Versionar
  const btnGuardar = document.getElementById("btnAbrirGuardar");
  if (btnGuardar) {
    btnGuardar.addEventListener("click", abrirModalGuardar);
  }

  // Controles del modal
  const btnClose = document.getElementById("btnCloseModalGuardar");
  if (btnClose) btnClose.addEventListener("click", cerrarModalGuardar);

  const btnCloseBottom = document.getElementById("btnCerrarModalGuardarBottom");
  if (btnCloseBottom) btnCloseBottom.addEventListener("click", cerrarModalGuardar);

  const modal = document.getElementById("modalGuardar");
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) cerrarModalGuardar();
    });
  }

  // Pestañas del modal
  const tabHoja = document.getElementById("tabBtnHoja");
  if (tabHoja) tabHoja.addEventListener("click", () => cambiarTabGuardar("hoja"));

  const tabConjunto = document.getElementById("tabBtnConjunto");
  if (tabConjunto) tabConjunto.addEventListener("click", () => cambiarTabGuardar("conjunto"));

  // Acciones de guardado de hoja
  const btnSobreescribirHoja = document.getElementById("btnActionSobreescribirHoja");
  if (btnSobreescribirHoja) {
    btnSobreescribirHoja.addEventListener("click", sobreescribirHojaActual);
  }

  const btnVersionarHoja = document.getElementById("btnActionVersionarHoja");
  if (btnVersionarHoja) {
    btnVersionarHoja.addEventListener("click", guardarHojaNuevaVersion);
  }

  // Acciones de guardado de conjunto
  const btnSobreescribirJs = document.getElementById("btnActionSobreescribirJs");
  if (btnSobreescribirJs) {
    btnSobreescribirJs.addEventListener("click", sobreescribirTodoElConjuntoJs);
  }

  const btnVersionarHtml = document.getElementById("btnActionVersionarHtml");
  if (btnVersionarHtml) {
    btnVersionarHtml.addEventListener("click", guardarConjuntoNuevoHtml);
  }

  // Botón reset
  const btnReset = document.getElementById("btnResetTexts");
  if (btnReset) {
    btnReset.addEventListener("click", resetearAjustesTextos);
  }
}

function toggleModoMoverTextos() {
  modoEdicionActivo = !modoEdicionActivo;
  const btn = document.getElementById("btnModoMover");
  const stage = document.getElementById("stage");
  const fontCtrls = document.getElementById("fontSizeControls");
  const colorCtrls = document.getElementById("colorControls");
  const layerCtrls = document.getElementById("layerOrderControls");

  if (modoEdicionActivo) {
    if (modoMoverSimbolosActivo) {
      toggleModoMoverSimbolos();
    }
    if (btn) {
      btn.innerHTML = "✋ Modo Mover: ACTIVO";
      btn.style.background = "#f59e0b";
      btn.style.borderColor = "#d97706";
      btn.style.color = "#0f172a";
      btn.style.fontWeight = "bold";
    }
    if (fontCtrls) fontCtrls.style.display = "inline-flex";
    if (colorCtrls) colorCtrls.style.display = "inline-flex";
    if (layerCtrls) layerCtrls.style.display = "inline-flex";
    if (stage) stage.classList.add("text-edit-mode");
    mostrarNotificacion("Modo Mover Textos ACTIVO. Arrastra textos, edita tamaño o color.");
  } else {
    if (btn) {
      btn.innerHTML = "🖐️ Mover Textos";
      btn.style.background = "rgba(255, 255, 255, 0.08)";
      btn.style.borderColor = "rgba(255, 255, 255, 0.15)";
      btn.style.color = "#f8fafc";
      btn.style.fontWeight = "normal";
    }
    if (fontCtrls) fontCtrls.style.display = "none";
    if (colorCtrls) colorCtrls.style.display = "none";
    if (layerCtrls) layerCtrls.style.display = "none";
    if (stage) stage.classList.remove("text-edit-mode");
    guardarAjustesTextos();
  }
}

function toggleModoMoverSimbolos() {
  modoMoverSimbolosActivo = !modoMoverSimbolosActivo;
  const btn = document.getElementById("btnModoMoverSimbolos");
  const stage = document.getElementById("stage");

  if (modoMoverSimbolosActivo) {
    if (modoEdicionActivo) {
      toggleModoMoverTextos();
    }
    if (btn) {
      btn.innerHTML = "🔲 Modo Símbolos: ACTIVO";
      btn.style.background = "#0284c7";
      btn.style.borderColor = "#38bdf8";
      btn.style.color = "#ffffff";
      btn.style.fontWeight = "bold";
    }
    if (stage) stage.classList.add("symbol-edit-mode");
    mostrarNotificacion("🔲 Modo Símbolos ACTIVO. Haz clic y arrastra cualquier símbolo o bloque.");
  } else {
    if (btn) {
      btn.innerHTML = "🔲 Mover Símbolos";
      btn.style.background = "rgba(255, 255, 255, 0.08)";
      btn.style.borderColor = "rgba(255, 255, 255, 0.15)";
      btn.style.color = "#f8fafc";
      btn.style.fontWeight = "normal";
    }
    if (stage) stage.classList.remove("symbol-edit-mode");
    guardarAjustesTextos();
  }
}

function getElementTranslate(el) {
  if (!el) return { x: 0, y: 0 };
  const transform = el.getAttribute("transform") || "";
  const match = /translate\(\s*([-\d.]+)[,\s]+([-\d.]+)\s*\)/.exec(transform);
  if (match) {
    return { x: parseFloat(match[1]), y: parseFloat(match[2]) };
  }
  return { x: 0, y: 0 };
}

function setElementTranslate(el, x, y) {
  if (!el) return;
  let transform = el.getAttribute("transform") || "";
  if (/translate\([^)]*\)/.test(transform)) {
    transform = transform.replace(/translate\([^)]*\)/, `translate(${x}, ${y})`);
  } else if (transform.trim().length > 0) {
    transform = `translate(${x}, ${y}) ` + transform;
  } else {
    transform = `translate(${x}, ${y})`;
  }
  el.setAttribute("transform", transform);
}

function onEditorMouseDown(e) {
  if (e.button !== 0) return; // Solo clic primario
  if (!modoEdicionActivo && !modoMoverSimbolosActivo) return;

  const stage = document.getElementById("stage");
  if (!stage || !stage.contains(e.target)) return;

  // 1. MODO MOVER SÍMBOLOS ACTIVO
  if (modoMoverSimbolosActivo) {
    let sym = e.target.closest(".draggable-symbol");
    if (!sym) {
      let candidate = e.target.closest("g[id]");
      if (candidate && candidate.id !== "cajetin_axon" && candidate.id !== "activeSheetContainer" && candidate.id !== "stage") {
        sym = candidate;
      }
    }

    if (sym && !sym.closest("#cajetin_axon")) {
      e.preventDefault();
      e.stopPropagation();

      simboloSeleccionado = sym;
      simboloSeleccionado.classList.add("dragging-symbol");

      if (typeof window.onSimboloSeleccionado === "function") {
        window.onSimboloSeleccionado(sym);
      }

      const svg = sym.ownerSVGElement || document.querySelector("#activeSheetContainer svg") || document.querySelector("svg");
      if (!svg) return;
      const pt = getSVGCoords(e, svg);
      transformInicialSimbolo = getElementTranslate(sym);

      offsetSimboloX = pt.x - transformInicialSimbolo.x;
      offsetSimboloY = pt.y - transformInicialSimbolo.y;
      return;
    } else {
      if (typeof deseleccionarSimboloGizmo === "function") {
        deseleccionarSimboloGizmo();
      }
    }
  }

  // 2. MODO MOVER TEXTOS ACTIVO
  if (modoEdicionActivo) {
    const target = (e.target && e.target.closest) ? e.target.closest("text") : null;
    if (!target) return;

    e.preventDefault();
    e.stopPropagation();

    textoSeleccionado = target;
    textoActivoParaFuente = target;
    textoSeleccionado.classList.add("dragging-text");

    actualizarIndicadorFuente(target);
    actualizarIndicadorColor(target);

    const svg = textoSeleccionado.ownerSVGElement || document.querySelector("#activeSheetContainer svg") || document.querySelector("svg");
    if (!svg) return;
    const pt = getSVGCoords(e, svg);

    let curX = parseFloat(textoSeleccionado.getAttribute("x"));
    let curY = parseFloat(textoSeleccionado.getAttribute("y"));
    if (isNaN(curX)) {
      const firstTspan = textoSeleccionado.querySelector("tspan");
      curX = firstTspan ? parseFloat(firstTspan.getAttribute("x") || 0) : 0;
    }
    if (isNaN(curY)) {
      const firstTspan = textoSeleccionado.querySelector("tspan");
      curY = firstTspan ? parseFloat(firstTspan.getAttribute("y") || 0) : 0;
    }

    offsetDragX = pt.x - curX;
    offsetDragY = pt.y - curY;
  }
}

function onEditorMouseMove(e) {
  // Arrastre activo de símbolo
  if (modoMoverSimbolosActivo && simboloSeleccionado) {
    e.preventDefault();
    e.stopPropagation();

    const svg = simboloSeleccionado.ownerSVGElement || document.querySelector("#activeSheetContainer svg") || document.querySelector("svg");
    if (!svg) return;
    const pt = getSVGCoords(e, svg);

    const newX = Math.round(pt.x - offsetSimboloX);
    const newY = Math.round(pt.y - offsetSimboloY);

    setElementTranslate(simboloSeleccionado, newX, newY);
    hayCambiosSinGuardar = true;
    return;
  }

  // Arrastre activo de texto
  if (modoEdicionActivo && textoSeleccionado) {
    e.preventDefault();
    e.stopPropagation();

    const svg = textoSeleccionado.ownerSVGElement || document.querySelector("#activeSheetContainer svg") || document.querySelector("svg");
    if (!svg) return;
    const pt = getSVGCoords(e, svg);

    const newX = Math.round(pt.x - offsetDragX);
    const newY = Math.round(pt.y - offsetDragY);

    textoSeleccionado.setAttribute("x", newX);
    textoSeleccionado.setAttribute("y", newY);

    textoSeleccionado.querySelectorAll("tspan").forEach((tspan) => {
      tspan.setAttribute("x", newX);
    });
    hayCambiosSinGuardar = true;
  }
}

function onEditorMouseUp(e) {
  let huboCambio = false;

  if (simboloSeleccionado) {
    simboloSeleccionado.classList.remove("dragging-symbol");
    if (typeof posicionarGizmo === "function") {
      posicionarGizmo(simboloSeleccionado);
    }
    simboloSeleccionado = null;
    huboCambio = true;
  }

  if (textoSeleccionado) {
    textoSeleccionado.classList.remove("dragging-text");
    textoSeleccionado = null;
    huboCambio = true;
  }

  if (huboCambio) {
    guardarAjustesTextos();
  }
}

function onTextDoubleClick(e) {
  const target = e.target.closest("text");
  if (!target) return;

  e.stopPropagation();
  textoActivoParaFuente = target;
  actualizarIndicadorFuente(target);
  actualizarIndicadorColor(target);

  const textoActual = target.textContent;
  const nuevoTexto = prompt("Editar contenido de texto:", textoActual);

  if (nuevoTexto !== null && nuevoTexto.trim() !== "") {
    target.textContent = nuevoTexto;
    guardarAjustesTextos();
    mostrarNotificacion("Texto actualizado.");
  }
}

function onTextWheel(e) {
  if (!modoEdicionActivo || !e.altKey) return;
  const target = e.target.closest("text");
  if (!target) return;

  e.preventDefault();
  e.stopPropagation();
  ajustarTamanoFuente(e.deltaY < 0 ? 1 : -1, target);
}

function onEditorKeyDown(e) {
  if (!modoEdicionActivo) return;
  if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT") return;

  if (e.key === "[" || (e.key === "-" && !e.ctrlKey)) {
    e.preventDefault();
    ajustarTamanoFuente(-1);
  } else if (e.key === "]" || (e.key === "+" && !e.ctrlKey)) {
    e.preventDefault();
    ajustarTamanoFuente(1);
  } else if (e.key === "t" || e.key === "T") {
    e.preventDefault();
    traerAlFrente();
  } else if (e.key === "b" || e.key === "B") {
    // Si la tecla B se presiona en modo edición sin modal abierto, enviar al fondo
    if (modoEdicionActivo && (textoActivoParaFuente || textoSeleccionado)) {
      e.preventDefault();
      enviarAlFondo();
    }
  }
}

function traerAlFrente(targetOverride) {
  const target = targetOverride || textoActivoParaFuente || textoSeleccionado;
  if (!target) {
    mostrarNotificacion("Haz clic sobre un texto o elemento para seleccionarlo y traerlo al frente.");
    return;
  }
  
  if (target.parentNode) {
    target.parentNode.appendChild(target);
    // Si está dentro de un grupo que no es la raíz, elevar también el grupo
    let grupo = target.closest("g");
    if (grupo && grupo.parentNode && grupo.parentNode.tagName && grupo.parentNode.tagName.toLowerCase() === "svg") {
      grupo.parentNode.appendChild(grupo);
    }
  }
  
  hayCambiosSinGuardar = true;
  guardarAjustesTextos();
  mostrarNotificacion("🔝 Elemento traído al frente (z-index superior).");
}

function enviarAlFondo(targetOverride) {
  const target = targetOverride || textoActivoParaFuente || textoSeleccionado;
  if (!target) {
    mostrarNotificacion("Haz clic sobre un texto o elemento para seleccionarlo y enviarlo al fondo.");
    return;
  }
  
  if (target.parentNode) {
    target.parentNode.insertBefore(target, target.parentNode.firstChild);
  }
  
  hayCambiosSinGuardar = true;
  guardarAjustesTextos();
  mostrarNotificacion("⏬ Elemento enviado al fondo.");
}

function actualizarIndicadorFuente(target) {
  const lbl = document.getElementById("lblFontSize");
  if (!lbl || !target) return;
  const curSize = parseFloat(target.getAttribute("font-size") || window.getComputedStyle(target).fontSize || 12);
  lbl.textContent = `${Math.round(curSize)}px`;
}

function ajustarTamanoFuente(delta, targetOverride) {
  const target = targetOverride || textoActivoParaFuente || textoSeleccionado;
  if (!target) {
    mostrarNotificacion("Selecciona un texto con un clic para cambiar su tamaño.");
    return;
  }
  textoActivoParaFuente = target;

  const curSize = parseFloat(target.getAttribute("font-size") || window.getComputedStyle(target).fontSize || 12);
  let newSize = Math.round(curSize + delta);
  if (newSize < 6) newSize = 6;
  if (newSize > 42) newSize = 42;

  target.setAttribute("font-size", newSize);
  target.style.fontSize = `${newSize}px`;

  // Si tiene tspan hijos, ajustar sus tamaños también
  target.querySelectorAll("tspan").forEach((ts) => {
    ts.setAttribute("font-size", newSize);
    ts.style.fontSize = `${newSize}px`;
  });

  const lbl = document.getElementById("lblFontSize");
  if (lbl) lbl.textContent = `${newSize}px`;

  guardarAjustesTextos();
  mostrarNotificacion(`Tamaño de letra: ${newSize}px`);
}

function rgbToHex(col) {
  if (!col) return "#000000";
  if (col.startsWith("#")) {
    if (col.length === 4) {
      return "#" + col[1] + col[1] + col[2] + col[2] + col[3] + col[3];
    }
    return col.slice(0, 7);
  }
  const rgb = col.match(/\d+/g);
  if (rgb && rgb.length >= 3) {
    const r = parseInt(rgb[0], 10).toString(16).padStart(2, "0");
    const g = parseInt(rgb[1], 10).toString(16).padStart(2, "0");
    const b = parseInt(rgb[2], 10).toString(16).padStart(2, "0");
    return `#${r}${g}${b}`;
  }
  return "#0f172a";
}

function actualizarIndicadorColor(target) {
  if (!target) return;
  const inputColor = document.getElementById("inputTextColor");
  let curColor = target.style.fill || target.getAttribute("fill") || "";
  if (!curColor) {
    const comp = window.getComputedStyle(target);
    curColor = comp.fill || "#0f172a";
  }

  const hex = rgbToHex(curColor);
  if (inputColor && hex) {
    inputColor.value = hex;
  }

  // Marcar activo el botón de la paleta si coincide
  document.querySelectorAll(".btn-color-swatch").forEach((swatch) => {
    const sColor = swatch.dataset.color.toLowerCase();
    swatch.classList.toggle("active", hex && hex.toLowerCase() === sColor);
  });
}

function cambiarColorTexto(nuevoColor, targetOverride) {
  const target = targetOverride || textoActivoParaFuente || textoSeleccionado;
  if (!target) {
    mostrarNotificacion("Haz clic primero sobre un texto para seleccionarlo y cambiar su color.");
    return;
  }
  textoActivoParaFuente = target;

  target.setAttribute("fill", nuevoColor);
  target.style.fill = nuevoColor;
  target.style.setProperty("fill", nuevoColor, "important");

  // Si tiene tspan hijos, actualizar sus colores también
  target.querySelectorAll("tspan").forEach((ts) => {
    ts.setAttribute("fill", nuevoColor);
    ts.style.fill = nuevoColor;
    ts.style.setProperty("fill", nuevoColor, "important");
  });

  actualizarIndicadorColor(target);
  guardarAjustesTextos();
  mostrarNotificacion(`Color aplicado: ${nuevoColor}`);
}

function getSVGCoords(e, svg) {
  if (!svg) {
    svg = document.querySelector("#activeSheetContainer svg") || document.querySelector("svg");
  }
  if (!svg || !svg.createSVGPoint) {
    return { x: e.clientX, y: e.clientY };
  }
  const pt = svg.createSVGPoint();
  pt.x = e.clientX;
  pt.y = e.clientY;
  const ctm = svg.getScreenCTM();
  if (!ctm) return { x: e.clientX, y: e.clientY };
  return pt.matrixTransform(ctm.inverse());
}

function getStorageKey(sheetNum) {
  let cod = "";
  if (typeof sheetNum !== "undefined") {
    const sIdx = Number(sheetNum) - 1;
    if (typeof HOJAS_DATA !== "undefined" && HOJAS_DATA[sIdx]) {
      cod = HOJAS_DATA[sIdx].codigo_lamina;
    } else {
      cod = String(sheetNum).padStart(2, "0");
    }
  } else if (typeof currentSheetIndex !== "undefined" && typeof HOJAS_DATA !== "undefined" && HOJAS_DATA[currentSheetIndex]) {
    cod = HOJAS_DATA[currentSheetIndex].codigo_lamina;
  } else {
    cod = String((typeof currentSheetIndex !== "undefined" ? currentSheetIndex : 0) + 1).padStart(2, "0");
  }
  return `DE-5266_v2_custom_sheet_${cod}`;
}

function sincronizarSvgActivoEnMemoria() {
  const container = document.getElementById("activeSheetContainer");
  if (!container) return;

  const svg = container.querySelector("svg");
  if (svg && typeof HOJAS_SVG_CONTENT !== "undefined") {
    const serializer = new XMLSerializer();
    HOJAS_SVG_CONTENT[currentSheetIndex + 1] = serializer.serializeToString(svg);
  }
}

function guardarAjustesTextos() {
  const container = document.getElementById("activeSheetContainer");
  if (!container) return;

  // 1. Sincronizar en memoria viva para navegación continua e inmediata
  sincronizarSvgActivoEnMemoria();

  // 2. Guardar en localStorage las posiciones, tamaños y colores de textos
  const texts = container.querySelectorAll("text");
  const dataTexts = [];

  texts.forEach((t, idx) => {
    dataTexts.push({
      idx: idx,
      id: t.id || "",
      text: t.textContent,
      x: t.getAttribute("x"),
      y: t.getAttribute("y"),
      fontSize: t.getAttribute("font-size") || "",
      fill: t.style.fill || t.getAttribute("fill") || ""
    });
  });

  // 3. Guardar desplazamientos translate de símbolos
  const symbols = container.querySelectorAll(".draggable-symbol, g[id^='sym_'], g[id^='col_']");
  const dataSymbols = [];
  symbols.forEach((sym) => {
    if (sym.id && sym.hasAttribute("transform")) {
      dataSymbols.push({
        id: sym.id,
        transform: sym.getAttribute("transform")
      });
    }
  });

  const payload = {
    texts: dataTexts,
    symbols: dataSymbols
  };

  try {
    localStorage.setItem(getStorageKey(), JSON.stringify(payload));
  } catch (err) {
    console.warn("No se pudo guardar en localStorage:", err);
  }

  notificarCambioPendiente(true);
}

function aplicarAjustesGuardados() {
  const container = document.getElementById("activeSheetContainer");
  if (!container) return;

  try {
    const raw = localStorage.getItem(getStorageKey());
    if (!raw) return;

    const parsed = JSON.parse(raw);
    const dataTexts = Array.isArray(parsed) ? parsed : (parsed.texts || []);
    const dataSymbols = parsed.symbols || [];

    const texts = container.querySelectorAll("text");
    dataTexts.forEach((item) => {
      if (item.idx < texts.length) {
        const t = texts[item.idx];
        // Proteger el cajetín de ingeniería para que conserve su geometría normalizada maestra
        if (t.closest("#cajetin_axon") || t.closest("#cajetin_portada_completo")) return;

        // Solo aplicar si el texto registrado coincide con el elemento actual, o si hay ID unívoco
        const textoCoincide = !item.text || item.text.trim() === t.textContent.trim();
        const idCoincide = item.id && t.id && item.id === t.id;

        if (textoCoincide || idCoincide) {
          if (item.x) t.setAttribute("x", item.x);
          if (item.y) t.setAttribute("y", item.y);
          if (item.fontSize) {
            t.setAttribute("font-size", item.fontSize);
            t.style.fontSize = `${item.fontSize}px`;
          }
          if (item.fill) {
            t.setAttribute("fill", item.fill);
            t.style.fill = item.fill;
            t.style.setProperty("fill", item.fill, "important");
            t.querySelectorAll("tspan").forEach((ts) => {
              ts.setAttribute("fill", item.fill);
              ts.style.fill = item.fill;
              ts.style.setProperty("fill", item.fill, "important");
            });
          }
          // Solo actualizar textContent si hay coincidencia de ID explícita
          if (idCoincide && item.text && item.text !== t.textContent) {
            t.textContent = item.text;
          }
        }
      }
    });

    dataSymbols.forEach((item) => {
      if (item.id && item.transform) {
        const sym = container.querySelector(`#${item.id}`);
        if (sym) {
          sym.setAttribute("transform", item.transform);
        }
      }
    });

    sincronizarSvgActivoEnMemoria();
  } catch (err) {
    console.warn("Error aplicando ajustes guardados:", err);
  }
}

function notificarCambioPendiente(hayCambios) {
  hayCambiosSinGuardar = hayCambios;
  const btn = document.getElementById("btnAbrirGuardar");
  const lbl = document.getElementById("btnGuardarTexto");
  if (!btn) return;

  if (hayCambios) {
    if (lbl) lbl.innerHTML = `Guardar Cambios <span style="display:inline-block; width:8px; height:8px; background:#facc15; border-radius:50%; margin-left:4px;" title="Hay correcciones sin guardar en disco"></span>`;
    btn.style.background = "#15803d";
    btn.style.borderColor = "#22c55e";
  } else {
    if (lbl) lbl.textContent = "Guardar / Versionar";
    btn.style.background = "#16a34a";
    btn.style.borderColor = "#15803d";
  }
}

function resetearAjustesTextos() {
  if (confirm("¿Deseas restablecer los textos y símbolos al diseño maestro original de fábrica?")) {
    try {
      localStorage.removeItem(getStorageKey());
      for (let i = 1; i <= 20; i++) {
        localStorage.removeItem(`DE-5266_v1_custom_sheet_${i}`);
        localStorage.removeItem(`DE-5266_v2_custom_sheet_${String(i).padStart(2, "0")}`);
      }
    } catch (e) {}

    if (typeof HOJAS_DATA !== "undefined" && HOJAS_DATA[currentSheetIndex]) {
      const hoja = HOJAS_DATA[currentSheetIndex];
      fetch(hoja.archivo_svg)
        .then((r) => r.text())
        .then((svgText) => {
          if (typeof HOJAS_SVG_CONTENT !== "undefined") {
            HOJAS_SVG_CONTENT[hoja.numero] = svgText;
          }
          irAHoja(currentSheetIndex);
          mostrarNotificacion("Diseño restablecido al original maestro.");
          notificarCambioPendiente(false);
        })
        .catch(() => {
          irAHoja(currentSheetIndex);
          mostrarNotificacion("Diseño restablecido.");
          notificarCambioPendiente(false);
        });
    } else {
      irAHoja(currentSheetIndex);
      mostrarNotificacion("Diseño restablecido.");
      notificarCambioPendiente(false);
    }
  }
}

// =========================================================================
// GESTION DEL MODAL DE GUARDAR Y VERSIONAR
// =========================================================================

function abrirModalGuardar() {
  sincronizarSvgActivoEnMemoria();

  const numHoja = currentSheetIndex + 1;
  const numStr = String(numHoja).padStart(2, "0");

  const lblHoja = document.getElementById("lblHojaActivaModal");
  if (lblHoja) lblHoja.textContent = `Hoja ${numStr}`;

  const lblNombreSvg = document.getElementById("lblNombreSvgHoja");
  if (lblNombreSvg) lblNombreSvg.textContent = `dependencias/hojas/hoja_${numStr}.svg`;

  const lblEjemploHtml = document.getElementById("lblEjemploHtml");
  if (lblEjemploHtml) lblEjemploHtml.textContent = `diagrama_4710_control_semaforos_RevA.html`;

  const modal = document.getElementById("modalGuardar");
  if (modal) modal.classList.add("open");
}

function cerrarModalGuardar() {
  const modal = document.getElementById("modalGuardar");
  if (modal) modal.classList.remove("open");
}

function cambiarTabGuardar(tab) {
  const btnHoja = document.getElementById("tabBtnHoja");
  const btnConjunto = document.getElementById("tabBtnConjunto");
  const panelHoja = document.getElementById("panelGuardarHoja");
  const panelConjunto = document.getElementById("panelGuardarConjunto");

  if (tab === "hoja") {
    btnHoja.classList.add("active");
    btnConjunto.classList.remove("active");
    panelHoja.style.display = "block";
    panelConjunto.style.display = "none";
  } else {
    btnHoja.classList.remove("active");
    btnConjunto.classList.add("active");
    panelHoja.style.display = "none";
    panelConjunto.style.display = "block";
  }
}

// =========================================================================
// MOTOR DE ESCRITURA Y DESCARGA DE ARCHIVOS (FILE SYSTEM ACCESS + FALLBACK)
// =========================================================================

async function guardarArchivoDirecto(contenido, nombreSugerido, mimeType, descripcion) {
  // Intentar usar la API nativa File System Access (Chrome / Edge en Windows)
  if ("showSaveFilePicker" in window) {
    try {
      const ext = "." + nombreSugerido.split(".").pop();
      const handle = await window.showSaveFilePicker({
        suggestedName: nombreSugerido,
        types: [{
          description: descripcion || "Archivo",
          accept: { [mimeType]: [ext] }
        }]
      });
      const writable = await handle.createWritable();
      await writable.write(contenido);
      await writable.close();
      mostrarNotificacion(`✅ Archivo guardado con éxito: ${handle.name}`);
      notificarCambioPendiente(false);
      cerrarModalGuardar();
      return true;
    } catch (err) {
      if (err.name === "AbortError") {
        mostrarNotificacion("Guardado cancelado por el usuario.");
        return false;
      }
      console.warn("showSaveFilePicker falló o fue denegado, usando descarga estándar:", err);
    }
  }

  // Fallback: Descarga estándar mediante Blob
  descargarBlob(contenido, nombreSugerido, mimeType);
  notificarCambioPendiente(false);
  cerrarModalGuardar();
  return true;
}

function descargarBlob(contenido, nombreArchivo, mimeType) {
  const blob = new Blob([contenido], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nombreArchivo;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  mostrarNotificacion(`📥 Archivo descargado: ${nombreArchivo}`);
}

function obtenerSvgLimpio(numeroHoja) {
  sincronizarSvgActivoEnMemoria();
  let source = HOJAS_SVG_CONTENT[numeroHoja] || "";

  if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
    source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  }

  if (!source.startsWith("<?xml")) {
    source = '<?xml version="1.0" encoding="UTF-8"?>\n' + source;
  }

  return source;
}

// 1. Sobreescribir Hoja Actual
async function sobreescribirHojaActual() {
  const numHoja = currentSheetIndex + 1;
  const numStr = String(numHoja).padStart(2, "0");
  const svgContent = obtenerSvgLimpio(numHoja);
  const nombreArchivo = `hoja_${numStr}.svg`;

  await guardarArchivoDirecto(svgContent, nombreArchivo, "image/svg+xml;charset=utf-8", "Plano CAD SVG");
}

// 2. Guardar Hoja como Nueva Versión / Revisión
async function guardarHojaNuevaVersion() {
  const inputRev = document.getElementById("inputRevisionHoja");
  const revTexto = (inputRev && inputRev.value.trim()) ? inputRev.value.trim() : "REV. A";

  const numHoja = currentSheetIndex + 1;
  const numStr = String(numHoja).padStart(2, "0");

  // Actualizar el DOM de la hoja activa
  const container = document.getElementById("activeSheetContainer");
  if (container) {
    const texts = container.querySelectorAll("text");

    texts.forEach((t) => {
      // Casillero de revisión
      if (/REV\./i.test(t.textContent) || /^REV\s+/i.test(t.textContent)) {
        t.textContent = revTexto.toUpperCase();
      }
    });

    sincronizarSvgActivoEnMemoria();
  }

  const svgContent = obtenerSvgLimpio(numHoja);
  const revSuffix = revTexto.replace(/[^a-zA-Z0-9_-]/g, "_");
  const nombreArchivo = `DE-4710_Hoja_${numStr}_${revSuffix}.svg`;

  await guardarArchivoDirecto(svgContent, nombreArchivo, "image/svg+xml;charset=utf-8", "Plano CAD SVG Versionado");
}

// 3. Generar contenido JS completo de las 4 hojas
function generarJsHojasCompleto() {
  sincronizarSvgActivoEnMemoria();

  let js = "// Contenido SVG embebido para manipulación directa del DOM (Drag & Edit)\n";
  js += "// Generado y actualizado automáticamente por AXON CAD\n";
  js += "const HOJAS_SVG_CONTENT = {\n";
  for (let i = 1; i <= 4; i++) {
    const svgStr = HOJAS_SVG_CONTENT[i] || "";
    js += `  ${i}: ${JSON.stringify(svgStr)}${i < 4 ? "," : ""}\n`;
  }
  js += "};\n";
  return js;
}

// 4. Sobreescribir todo el conjunto (hojas_svg_inline.js)
async function sobreescribirTodoElConjuntoJs() {
  const jsContent = generarJsHojasCompleto();
  await guardarArchivoDirecto(jsContent, "hojas_svg_inline.js", "application/javascript;charset=utf-8", "Base de Datos de Láminas JS");
}

// 5. Guardar todo el proyecto como nuevo archivo HTML autónomo
async function guardarConjuntoNuevoHtml() {
  const inputVer = document.getElementById("inputVersionHtml");
  const sufijo = (inputVer && inputVer.value.trim()) ? inputVer.value.trim().replace(/[^a-zA-Z0-9_-]/g, "_") : "Rev_A";

  sincronizarSvgActivoEnMemoria();

  // Clonar documento actual para generar versión limpia
  const docClone = document.documentElement.cloneNode(true);

  // Remover elementos volátiles
  const toast = docClone.querySelector("#editorToast");
  if (toast) toast.remove();

  const modal = docClone.querySelector("#modalGuardar");
  if (modal) modal.classList.remove("open");

  // Actualizar título
  const title = docClone.querySelector("title");
  if (title) title.textContent = `DE-4710 Control Semáforos - ${sufijo}`;

  // Embeber el contenido actualizado de las 4 hojas directamente en el HTML
  const jsHojas = generarJsHojasCompleto();
  const scriptTags = docClone.querySelectorAll("script");
  scriptTags.forEach((s) => {
    const src = s.getAttribute("src") || "";
    if (src.includes("hojas_svg_inline.js")) {
      s.removeAttribute("src");
      s.textContent = "\n" + jsHojas + "\n";
    }
  });

  const htmlContent = "<!DOCTYPE html>\n" + docClone.outerHTML;
  const nombreArchivo = `diagrama_4710_control_semaforos_${sufijo}.html`;

  await guardarArchivoDirecto(htmlContent, nombreArchivo, "text/html;charset=utf-8", "Visualizador HTML AXON CAD");
}

function mostrarNotificacion(msg) {
  let toast = document.getElementById("editorToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "editorToast";
    toast.style.position = "fixed";
    toast.style.bottom = "84px";
    toast.style.left = "50%";
    toast.style.transform = "translateX(-50%)";
    toast.style.background = "#1e293b";
    toast.style.border = "1px solid #0ea5e9";
    toast.style.color = "#f8fafc";
    toast.style.padding = "8px 16px";
    toast.style.borderRadius = "6px";
    toast.style.fontSize = "12px";
    toast.style.boxShadow = "0 10px 25px rgba(0,0,0,0.5)";
    toast.style.zIndex = "350";
    toast.style.transition = "opacity 0.3s";
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = "1";
  setTimeout(() => {
    toast.style.opacity = "0";
  }, 3500);
}
