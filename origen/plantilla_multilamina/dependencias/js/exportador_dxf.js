/**
 * Exportador Nativo a DXF (AutoCAD Electrical 1:1) para Navegador
 * Convierte cualquier lámina SVG activa en un archivo DXF ASCII (AC1015 / AutoCAD 2000)
 * en coordenadas métricas reales (420.0 x 297.0 mm, ISO A3) con capas y colores ACI normalizados.
 * Resuelve el problema de láminas microscópicas por importación PDF.
 */

(function(window) {
  const CAD_W_MM = 420.0;
  const CAD_H_MM = 297.0;
  const SVG_W_PT = 1190.55118;
  const SVG_H_PT = 841.88976;
  const SCALE_X = CAD_W_MM / SVG_W_PT;
  const SCALE_Y = CAD_H_MM / SVG_H_PT;

  function svgToCad(x, y) {
    const cx = (parseFloat(x) * SCALE_X).toFixed(3);
    const cy = (CAD_H_MM - (parseFloat(y) * SCALE_Y)).toFixed(3);
    return [parseFloat(cx), parseFloat(cy)];
  }

  function cadLen(l) {
    return parseFloat((parseFloat(l) * SCALE_X).toFixed(3));
  }

  class BrowserDxfWriter {
    constructor() {
      this.entities = [];
      this.layers = {
        "0": 7,              // Blanco / Continuo
        "MARCO": 5,          // Azul ACI 5
        "CAJETIN": 7,        // Blanco ACI 7
        "CAJETIN_ROT": 1,    // Rojo ACI 1
        "WIRES_24V": 1,      // Rojo ACI 1
        "WIRES_0V": 5,       // Azul ACI 5
        "WIRES_AC": 7,       // Blanco ACI 7
        "WIRES_PE": 3,       // Verde ACI 3
        "WIRES_SIG": 2,      // Amarillo ACI 2
        "SYMBOLS": 7,        // Blanco ACI 7
        "TAGS": 2,           // Amarillo ACI 2
        "DESC": 1,           // Rojo ACI 1
        "TERMS": 7           // Blanco ACI 7
      };
    }

    addLine(x1, y1, x2, y2, layer = "0", color = null) {
      this.entities.push({ type: "LINE", layer, color, x1, y1, x2, y2 });
    }

    addPolyline(points, closed = false, layer = "0", color = null) {
      if (!points || points.length < 2) return;
      for (let i = 0; i < points.length - 1; i++) {
        this.addLine(points[i][0], points[i][1], points[i+1][0], points[i+1][1], layer, color);
      }
      if (closed && points.length > 2) {
        this.addLine(points[points.length - 1][0], points[points.length - 1][1], points[0][0], points[0][1], layer, color);
      }
    }

    addRect(x, y, w, h, layer = "0", color = null) {
      this.addLine(x, y, x + w, y, layer, color);
      this.addLine(x + w, y, x + w, y + h, layer, color);
      this.addLine(x + w, y + h, x, y + h, layer, color);
      this.addLine(x, y + h, x, y, layer, color);
    }

    addCircle(cx, cy, r, layer = "0", color = null) {
      this.entities.push({ type: "CIRCLE", layer, color, cx, cy, r });
    }

    addText(text, x, y, height = 2.5, layer = "0", color = null, halign = 0) {
      const clean = text.replace(/[\r\n\t]/g, " ")
                        .replace(/[—–]/g, "-")
                        .replace(/[“”]/g, '"')
                        .replace(/[’]/g, "'")
                        .replace(/°/g, "%%d")
                        .trim();
      if (!clean) return;
      this.entities.push({ type: "TEXT", layer, color, text: clean, x, y, height, halign });
    }

    renderDxfString() {
      const lines = [
        "0", "SECTION",
        "2", "HEADER",
        "9", "$ACADVER", "1", "AC1009",
        "9", "$INSUNITS", "70", "4",       // 4 = Milímetros
        "9", "$MEASUREMENT", "70", "1",    // 1 = Métrico
        "9", "$EXTMIN", "10", "0.0", "20", "0.0", "30", "0.0",
        "9", "$EXTMAX", "10", "420.0", "20", "297.0", "30", "0.0",
        "9", "$LIMMIN", "10", "0.0", "20", "0.0",
        "9", "$LIMMAX", "10", "420.0", "20", "297.0",
        "0", "ENDSEC",

        "0", "SECTION",
        "2", "TABLES",
        "0", "TABLE",
        "2", "LAYER",
        "70", String(Object.keys(this.layers).length)
      ];

      for (const [lname, lcolor] of Object.entries(this.layers)) {
        lines.push(
          "0", "LAYER",
          "2", lname,
          "70", "0",
          "62", String(lcolor),
          "6", "CONTINUOUS"
        );
      }
      lines.push(
        "0", "ENDTAB",
        "0", "ENDSEC",

        "0", "SECTION",
        "2", "ENTITIES"
      );

      for (const e of this.entities) {
        const l = e.layer || "0";
        if (e.type === "LINE") {
          lines.push("0", "LINE", "8", l);
          if (e.color !== null) lines.push("62", String(e.color));
          lines.push(
            "10", e.x1.toFixed(3), "20", e.y1.toFixed(3), "30", "0.0",
            "11", e.x2.toFixed(3), "21", e.y2.toFixed(3), "31", "0.0"
          );
        } else if (e.type === "CIRCLE") {
          lines.push("0", "CIRCLE", "8", l);
          if (e.color !== null) lines.push("62", String(e.color));
          lines.push(
            "10", e.cx.toFixed(3), "20", e.cy.toFixed(3), "30", "0.0",
            "40", e.r.toFixed(3)
          );
        } else if (e.type === "TEXT") {
          lines.push("0", "TEXT", "8", l);
          if (e.color !== null) lines.push("62", String(e.color));
          const halign = e.halign || 0;
          lines.push(
            "10", e.x.toFixed(3), "20", e.y.toFixed(3), "30", "0.0",
            "40", e.height.toFixed(3),
            "1", e.text
          );
          if (halign !== 0) {
            lines.push(
              "72", String(halign),
              "11", e.x.toFixed(3), "21", e.y.toFixed(3), "31", "0.0"
            );
          }
        }
      }

      lines.push("0", "ENDSEC", "0", "EOF");
      return lines.join("\n") + "\n";
    }
  }

  function clasificarLayer(node, parentClass = "") {
    const cls = (node.getAttribute("class") || "") + " " + parentClass;
    const stroke = node.getAttribute("stroke") || "";

    if (cls.includes("wire-24v") || cls.includes("wire-phase")) return ["WIRES_24V", 1];
    if (cls.includes("wire-0v") || cls.includes("wire-neutral")) return ["WIRES_0V", 5];
    if (cls.includes("wire-pe")) return ["WIRES_PE", 3];
    if (cls.includes("wire-eth")) return ["WIRES_SIG", 3];
    if (cls.includes("wire-signal") || cls.includes("wire-control")) return ["WIRES_SIG", 2];
    if (cls.includes("comp-box")) return ["SYMBOLS", 7];
    if (cls.includes("grid-label") || cls.includes("cad-border") || cls.includes("cad-thin") || cls.includes("grid-tick")) return ["MARCO", 5];
    if (cls.includes("title-label") || cls.includes("cajetin-label-red")) return ["CAJETIN_ROT", 1];
    if (cls.includes("title-value") || cls.includes("title-main") || cls.includes("cajetin-val-white")) return ["CAJETIN", 7];
    if (cls.includes("tag") || cls.includes("wire-tag")) return ["TAGS", 2];
    if (cls.includes("subtag")) return ["DESC", 1];

    if (["#0284c7", "#0ea5e9", "#0066ff", "#1a66ff"].includes(stroke)) return ["WIRES_0V", 5];
    if (["#dc2626", "#ef4444", "#b91c1c"].includes(stroke)) return ["WIRES_24V", 1];
    if (["#16a34a", "#10b981", "#22c55e"].includes(stroke)) return ["WIRES_PE", 3];
    if (["#f59e0b", "#eab308", "#facc15"].includes(stroke)) return ["TAGS", 2];

    return ["0", null];
  }

  function convertirSvgADxf(svgElement) {
    const writer = new BrowserDxfWriter();

    function procesarNodo(node, parentLayer = "0", parentColor = null, parentClass = "") {
      if (node.nodeType !== 1) return;
      const tag = node.tagName.toLowerCase();
      const curClass = ((node.getAttribute("class") || "") + " " + parentClass).trim();

      let [layer, color] = clasificarLayer(node, parentClass);
      if (layer === "0" && parentLayer !== "0") layer = parentLayer;
      if (color === null && parentColor !== null) color = parentColor;

      const id = node.getAttribute("id") || "";
      if (id.includes("cajetin")) parentLayer = "CAJETIN";
      else if (id.includes("marco")) parentLayer = "MARCO";

      if (tag === "rect") {
        const w = parseFloat(node.getAttribute("width") || "0");
        const h = parseFloat(node.getAttribute("height") || "0");
        const fill = node.getAttribute("fill") || "";
        if (w >= 1180 && h >= 830 && ["#ffffff", "#131822", "#0f172a"].includes(fill)) return;

        const x = parseFloat(node.getAttribute("x") || "0");
        const y = parseFloat(node.getAttribute("y") || "0");
        const [cx, cyTop] = svgToCad(x, y);
        const cw = cadLen(w);
        const ch = cadLen(h);
        const cyBottom = parseFloat((cyTop - ch).toFixed(3));
        writer.addRect(cx, cyBottom, cw, ch, layer, color);

      } else if (tag === "line") {
        const x1 = parseFloat(node.getAttribute("x1") || "0");
        const y1 = parseFloat(node.getAttribute("y1") || "0");
        const x2 = parseFloat(node.getAttribute("x2") || "0");
        const y2 = parseFloat(node.getAttribute("y2") || "0");
        const [cx1, cy1] = svgToCad(x1, y1);
        const [cx2, cy2] = svgToCad(x2, y2);
        writer.addLine(cx1, cy1, cx2, cy2, layer, color);

      } else if (tag === "circle") {
        const cx = parseFloat(node.getAttribute("cx") || "0");
        const cy = parseFloat(node.getAttribute("cy") || "0");
        const r = parseFloat(node.getAttribute("r") || "0");
        const [ccx, ccy] = svgToCad(cx, cy);
        const cr = cadLen(r);
        writer.addCircle(ccx, ccy, cr, layer, color);

      } else if (tag === "text") {
        let textStr = node.textContent || "";
        const x = parseFloat(node.getAttribute("x") || "0");
        const y = parseFloat(node.getAttribute("y") || "0");
        const [cx, cy] = svgToCad(x, y);
        const fsize = parseFloat((node.getAttribute("font-size") || "10").replace(/[^\d.]/g, "")) || 10;
        let ch = parseFloat((fsize * SCALE_X * 0.9).toFixed(2));
        if (ch < 1.6) ch = 1.8;
        const anchor = node.getAttribute("text-anchor") || "start";
        const halign = anchor === "middle" ? 1 : (anchor === "end" ? 2 : 0);
        writer.addText(textStr, cx, cy, ch, layer, color, halign);

      } else if (tag === "polyline" || tag === "polygon") {
        const pstr = node.getAttribute("points") || "";
        if (pstr) {
          const raw = pstr.match(/[-+]?\d*\.?\d+/g);
          if (raw && raw.length >= 2) {
            const pts = [];
            for (let i = 0; i < raw.length - 1; i += 2) {
              pts.push(svgToCad(raw[i], raw[i + 1]));
            }
            writer.addPolyline(pts, tag === "polygon", layer, color);
          }
        }
      }

      for (let i = 0; i < node.children.length; i++) {
        procesarNodo(node.children[i], layer, color, curClass);
      }
    }

    for (let i = 0; i < svgElement.children.length; i++) {
      procesarNodo(svgElement.children[i]);
    }

    return writer.renderDxfString();
  }

  function descargarArchivo(contenido, nombreArchivo) {
    const blob = new Blob([contenido], { type: "application/dxf;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = nombreArchivo;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }

  window.exportarDxfActual = function() {
    const container = document.getElementById("activeSheetContainer");
    if (!container) return;
    const svg = container.querySelector("svg");
    if (!svg) {
      alert("No hay lámina SVG activa para exportar.");
      return;
    }

    let codigoLamina = "Lamina";
    let numHoja = "01";
    if (typeof HOJAS_DATA !== "undefined" && typeof currentSheetIndex !== "undefined") {
      const hoja = HOJAS_DATA[currentSheetIndex];
      if (hoja) {
        codigoLamina = hoja.codigo_lamina || `DE-5266-${hoja.numero}`;
        numHoja = String(hoja.numero).padStart(2, "0");
      }
    }

    const dxfContent = convertirSvgADxf(svg);
    const filename = `DE-5266_LAMINA_${numHoja}_${codigoLamina}.dxf`;
    descargarArchivo(dxfContent, filename);

    if (typeof mostrarNotificacion === "function") {
      mostrarNotificacion(`✅ Exportado DXF 1:1 AutoCAD: ${filename}`);
    }
  };

  window.exportarDxfLote = function() {
    if (typeof HOJAS_DATA === "undefined" || typeof HOJAS_SVG_CONTENT === "undefined") {
      alert("No se encuentran los datos de las láminas para exportación en lote.");
      return;
    }

    let total = 0;
    HOJAS_DATA.forEach((hoja, idx) => {
      const svgText = HOJAS_SVG_CONTENT[hoja.numero];
      if (svgText) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgText, "image/svg+xml");
        const svg = doc.querySelector("svg");
        if (svg) {
          const dxfContent = convertirSvgADxf(svg);
          const numHoja = String(hoja.numero).padStart(2, "0");
          const filename = `DE-5266_LAMINA_${numHoja}_${hoja.codigo_lamina}.dxf`;
          setTimeout(() => {
            descargarArchivo(dxfContent, filename);
          }, idx * 400);
          total++;
        }
      }
    });

    if (typeof mostrarNotificacion === "function") {
      mostrarNotificacion(`📦 Iniciando descarga en lote de ${total} láminas DXF 1:1...`);
    }
  };

})(window);
