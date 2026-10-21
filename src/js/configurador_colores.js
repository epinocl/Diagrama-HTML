/**
 * Configurador Dinámico de Colores de Impresión - AXON CAD
 * Permite cambiar en tiempo real los conjuntos de colores de textos y elementos
 * en Modo Impresión (Paper Space DIN A3) y en exportación PDF / impresión física.
 * Guarda las preferencias en localStorage y se sincroniza con variables CSS.
 */

const PRINT_COLOR_DEFAULTS = {
  cyan: "#0284c7",   // Celeste Claro / Cyan (Títulos, tags, subtítulos)
  blue: "#1e3a8a",   // Azul Técnico / Cuadrícula
  text: "#000000",   // Texto Principal (Ex-Blanco en CAD)
  muted: "#334155",  // Texto Secundario (Ex-Silver en CAD)
  amber: "#b45309",  // Ámbar / Naranja (Señales, bornas X1)
  green: "#15803d",  // Verde Industrial (PLC, Ethernet, OK)
  red: "#dc2626"     // Rojo de Seguridad (Paro, 24V, cajetín)
};

const PRINT_COLOR_PRESETS = {
  axon: {
    nombre: "🌟 Técnico AXON (Por Defecto)",
    colors: { cyan: "#0284c7", blue: "#1e3a8a", text: "#000000", muted: "#334155", amber: "#b45309", green: "#15803d", red: "#dc2626" }
  },
  cad_celeste: {
    nombre: "⚡ Celeste Original CAD",
    colors: { cyan: "#38bdf8", blue: "#1a66ff", text: "#000000", muted: "#334155", amber: "#b45309", green: "#15803d", red: "#dc2626" }
  },
  marino: {
    nombre: "🏢 Azul Marino Oscuro",
    colors: { cyan: "#1e3a8a", blue: "#1e3a8a", text: "#000000", muted: "#1e293b", amber: "#92400e", green: "#166534", red: "#991b1b" }
  },
  royal: {
    nombre: "🔷 Azul Royal Contraste",
    colors: { cyan: "#2563eb", blue: "#1d4ed8", text: "#000000", muted: "#334155", amber: "#d97706", green: "#16a34a", red: "#e11d48" }
  },
  monocromo: {
    nombre: "🖨️ Monocromático Puro (B/N)",
    colors: { cyan: "#000000", blue: "#000000", text: "#000000", muted: "#475569", amber: "#000000", green: "#000000", red: "#000000" }
  }
};

const STORAGE_KEY_PRINT_COLORS = "axon_5266_print_colors_v2";

let coloresActuales = Object.assign({}, PRINT_COLOR_DEFAULTS);

function inicializarConfiguradorColores() {
  cargarColoresDesdeStorage();
  vincularEventosConfigurador();
}

function cargarColoresDesdeStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PRINT_COLORS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        // Asegurar que el texto principal de impresión nunca sea blanco
        if (parsed.text === "#ffffff" || parsed.text === "#fff" || parsed.text === "white" || parsed.text === "#f8fafc") {
          parsed.text = "#000000";
        }
        coloresActuales = Object.assign({}, PRINT_COLOR_DEFAULTS, parsed);
      }
    }
  } catch (err) {
    console.warn("No se pudieron cargar colores guardados de localStorage:", err);
  }
  aplicarColoresARoot(coloresActuales);
}

function aplicarColoresARoot(colores) {
  const root = document.documentElement;
  if (!root) return;

  if (colores.cyan) root.style.setProperty("--print-color-cyan", colores.cyan);
  if (colores.blue) root.style.setProperty("--print-color-blue", colores.blue);
  if (colores.text) root.style.setProperty("--print-color-text", colores.text);
  if (colores.muted) root.style.setProperty("--print-color-muted", colores.muted);
  if (colores.amber) root.style.setProperty("--print-color-amber", colores.amber);
  if (colores.green) root.style.setProperty("--print-color-green", colores.green);
  if (colores.red) root.style.setProperty("--print-color-red", colores.red);

  sincronizarInputsUI(colores);

  // Si estamos en modo impresión, forzar actualización inmediata sobre el DOM de la lámina activa
  if (document.body && document.body.classList.contains("theme-print")) {
    const container = document.getElementById("activeSheetContainer") || document.getElementById("activeSheet");
    if (typeof window.forzarContrasteImpresion === "function") {
      window.forzarContrasteImpresion(container);
    }
  }
}

function sincronizarInputsUI(colores) {
  const mapInputs = [
    { key: "cyan", picker: "cfgColorCyanPicker", hex: "cfgColorCyanHex", preview: "prevBadgeCyan" },
    { key: "blue", picker: "cfgColorBluePicker", hex: "cfgColorBlueHex", preview: "prevBadgeBlue" },
    { key: "text", picker: "cfgColorTextPicker", hex: "cfgColorTextHex", preview: "prevBadgeText" },
    { key: "muted", picker: "cfgColorMutedPicker", hex: "cfgColorMutedHex", preview: "prevBadgeMuted" },
    { key: "amber", picker: "cfgColorAmberPicker", hex: "cfgColorAmberHex", preview: "prevBadgeAmber" },
    { key: "green", picker: "cfgColorGreenPicker", hex: "cfgColorGreenHex", preview: "prevBadgeGreen" },
    { key: "red", picker: "cfgColorRedPicker", hex: "cfgColorRedHex", preview: "prevBadgeRed" }
  ];

  mapInputs.forEach((item) => {
    const val = colores[item.key];
    if (!val) return;
    const elPicker = document.getElementById(item.picker);
    const elHex = document.getElementById(item.hex);
    const elPrev = document.getElementById(item.preview);

    if (elPicker) elPicker.value = val;
    if (elHex) elHex.value = val.toUpperCase();
    if (elPrev) {
      elPrev.style.color = val;
      elPrev.style.borderColor = val;
    }
  });
}

function cambiarColor(key, nuevoValor) {
  if (!nuevoValor || !nuevoValor.startsWith("#") || (nuevoValor.length !== 7 && nuevoValor.length !== 4)) {
    return;
  }
  coloresActuales[key] = nuevoValor;
  aplicarColoresARoot(coloresActuales);
  guardarColoresEnStorage();
}

function aplicarPresetColores(presetKey) {
  const preset = PRINT_COLOR_PRESETS[presetKey];
  if (!preset || !preset.colors) return;
  coloresActuales = Object.assign({}, preset.colors);
  aplicarColoresARoot(coloresActuales);
  guardarColoresEnStorage();
  if (typeof mostrarNotificacion === "function") {
    mostrarNotificacion(`Paleta aplicada: ${preset.nombre}`);
  }
}

function restablecerColoresPorDefecto() {
  coloresActuales = Object.assign({}, PRINT_COLOR_DEFAULTS);
  aplicarColoresARoot(coloresActuales);
  try {
    localStorage.removeItem(STORAGE_KEY_PRINT_COLORS);
  } catch (e) {}
  if (typeof mostrarNotificacion === "function") {
    mostrarNotificacion("Colores de impresión restablecidos a los valores de fábrica.");
  }
}

function guardarColoresEnStorage() {
  try {
    localStorage.setItem(STORAGE_KEY_PRINT_COLORS, JSON.stringify(coloresActuales));
  } catch (err) {
    console.warn("Error al guardar colores en localStorage:", err);
  }
}

function abrirModalColores() {
  const modal = document.getElementById("modalConfigColores");
  if (!modal) return;
  sincronizarInputsUI(coloresActuales);
  modal.classList.add("open");
}

function cerrarModalColores() {
  const modal = document.getElementById("modalConfigColores");
  if (!modal) return;
  modal.classList.remove("open");
}

function vincularEventosConfigurador() {
  // Botón en la barra superior
  const btnAbrir = document.getElementById("btnConfigColores");
  if (btnAbrir) {
    btnAbrir.addEventListener("click", abrirModalColores);
  }

  // Botones de cierre del modal
  const btnClose = document.getElementById("btnCloseModalColores");
  if (btnClose) btnClose.addEventListener("click", cerrarModalColores);

  const btnCloseBottom = document.getElementById("btnCerrarModalColoresBottom");
  if (btnCloseBottom) btnCloseBottom.addEventListener("click", cerrarModalColores);

  const modal = document.getElementById("modalConfigColores");
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) cerrarModalColores();
    });
  }

  // Presets
  document.querySelectorAll("[data-preset-print]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const preset = btn.dataset.presetPrint;
      aplicarPresetColores(preset);
    });
  });

  // Botón Restablecer
  const btnReset = document.getElementById("btnResetPrintColors");
  if (btnReset) {
    btnReset.addEventListener("click", restablecerColoresPorDefecto);
  }

  // Mapear Color Pickers y Text Inputs
  const fields = [
    { key: "cyan", picker: "cfgColorCyanPicker", hex: "cfgColorCyanHex" },
    { key: "blue", picker: "cfgColorBluePicker", hex: "cfgColorBlueHex" },
    { key: "text", picker: "cfgColorTextPicker", hex: "cfgColorTextHex" },
    { key: "muted", picker: "cfgColorMutedPicker", hex: "cfgColorMutedHex" },
    { key: "amber", picker: "cfgColorAmberPicker", hex: "cfgColorAmberHex" },
    { key: "green", picker: "cfgColorGreenPicker", hex: "cfgColorGreenHex" },
    { key: "red", picker: "cfgColorRedPicker", hex: "cfgColorRedHex" }
  ];

  fields.forEach(({ key, picker, hex }) => {
    const elPicker = document.getElementById(picker);
    const elHex = document.getElementById(hex);

    if (elPicker) {
      elPicker.addEventListener("input", (e) => {
        const val = e.target.value;
        if (elHex) elHex.value = val.toUpperCase();
        cambiarColor(key, val);
      });
    }

    if (elHex) {
      elHex.addEventListener("change", (e) => {
        let val = e.target.value.trim();
        if (!val.startsWith("#")) val = "#" + val;
        if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
          if (elPicker) elPicker.value = val;
          cambiarColor(key, val);
        }
      });
    }
  });
}

// Inicialización automática
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", inicializarConfiguradorColores);
} else {
  inicializarConfiguradorColores();
}

window.abrirModalConfigColores = abrirModalColores;
window.cerrarModalConfigColores = cerrarModalColores;
window.aplicarPresetColores = aplicarPresetColores;
window.restablecerColoresPorDefecto = restablecerColoresPorDefecto;
