/**
 * Módulo Avanzado de Edición de Símbolos CAD - AXON DE-5266
 * Implementa las 3 opciones de edición solicitadas:
 * 1. Inspector de Propiedades Eléctricas (Tag, Calibre, Sensibilidad, Fabricante, etc.)
 * 2. Catálogo y Biblioteca de Símbolos IEC 60617 (Reemplazo directo de componentes)
 * 3. Herramientas de Transformación Gráfica (Gizmo flotante: Rotación 90°, Flip H/V, Escala +/-)
 */

let simboloActivoGizmo = null;

// =========================================================================
// 1. CATÁLOGO DE SÍMBOLOS NORMALIZADOS IEC 60617
// =========================================================================
const BIBLIOTECA_IEC = {
  qa1_diferencial_2p: {
    nombre: "Disyuntor con Diferencial 2P (RCBO)",
    norma: "IEC 60617 / UNE-EN 61009",
    categoria: "protecciones",
    descripcion: "Interruptor magnetotérmico bipolar con protección diferencial integrada (corte térmico, magnético y cámara Id).",
    tagSugerido: "-QA1",
    calibreSugerido: "10 A",
    sensibilidadSugerida: "30 mA",
    svgPreview: `
      <svg viewBox="0 0 120 120" width="80" height="80">
        <text x="35" y="20" font-size="10" font-weight="bold" fill="#0284c7" text-anchor="end">-QA</text>
        <line x1="50" y1="10" x2="50" y2="25" stroke="#0f172a" stroke-width="1.8"/>
        <line x1="47" y1="22" x2="53" y2="28" stroke="#0f172a" stroke-width="1.4"/>
        <line x1="47" y1="28" x2="53" y2="22" stroke="#0f172a" stroke-width="1.4"/>
        <line x1="50" y1="42" x2="40" y2="25" stroke="#0f172a" stroke-width="1.8"/>
        <line x1="75" y1="10" x2="75" y2="25" stroke="#0f172a" stroke-width="1.8"/>
        <line x1="72" y1="22" x2="78" y2="28" stroke="#0f172a" stroke-width="1.4"/>
        <line x1="72" y1="28" x2="78" y2="22" stroke="#0f172a" stroke-width="1.4"/>
        <line x1="75" y1="42" x2="65" y2="25" stroke="#0f172a" stroke-width="1.8"/>
        <line x1="45" y1="33" x2="70" y2="33" stroke="#0f172a" stroke-width="1" stroke-dasharray="2,2"/>
        <rect x="37" y="42" width="51" height="50" fill="#ffffff" stroke="#0f172a" stroke-width="1.6"/>
        <line x1="62" y1="42" x2="62" y2="92" stroke="#0f172a" stroke-width="1.2"/>
        <line x1="37" y1="58" x2="88" y2="58" stroke="#0f172a" stroke-width="1"/>
        <path d="M 50 42 L 50 47 L 55 47 L 55 53 L 50 53 L 50 58" fill="none" stroke="#0f172a" stroke-width="1.4"/>
        <path d="M 75 42 L 75 47 L 80 47 L 80 53 L 75 53 L 75 58" fill="none" stroke="#0f172a" stroke-width="1.4"/>
        <line x1="37" y1="74" x2="88" y2="74" stroke="#0f172a" stroke-width="1"/>
        <path d="M 50 58 L 50 63 A 3 3 0 0 1 50 69 L 50 74" fill="none" stroke="#0f172a" stroke-width="1.4"/>
        <path d="M 75 58 L 75 63 A 3 3 0 0 1 75 69 L 75 74" fill="none" stroke="#0f172a" stroke-width="1.4"/>
        <line x1="50" y1="74" x2="50" y2="92" stroke="#0f172a" stroke-width="1.4"/>
        <line x1="75" y1="74" x2="75" y2="92" stroke="#0f172a" stroke-width="1.4"/>
        <text x="50" y="86" font-size="8" font-weight="bold" fill="#0f172a" text-anchor="middle">Id</text>
        <text x="75" y="86" font-size="8" font-weight="bold" fill="#0f172a" text-anchor="middle">Id</text>
      </svg>
    `,
    generarSvg: (tag = "-QA1", cal = "10 A", sens = "30 mA") => `
      <!-- Tag y Datos Técnicos a la izquierda -->
      <text x="78" y="348" class="tag draggable-text" text-anchor="end" font-weight="bold">${tag}</text>
      <text x="78" y="388" class="subtag draggable-text" text-anchor="end" font-size="10" font-weight="bold" fill="#0f172a">${cal}</text>
      <text x="78" y="402" class="subtag draggable-text" text-anchor="end" font-size="10" font-weight="bold" fill="#0f172a">${sens}</text>

      <!-- Contactos Principales con corte automático (Cruz x) -->
      <line x1="97" y1="342" x2="103" y2="348" stroke="#0f172a" stroke-width="1.6"/>
      <line x1="97" y1="348" x2="103" y2="342" stroke="#0f172a" stroke-width="1.6"/>
      <line x1="100" y1="365" x2="88" y2="346" stroke="#0f172a" stroke-width="2"/>

      <line x1="137" y1="342" x2="143" y2="348" stroke="#0f172a" stroke-width="1.6"/>
      <line x1="137" y1="348" x2="143" y2="342" stroke="#0f172a" stroke-width="1.6"/>
      <line x1="140" y1="365" x2="128" y2="346" stroke="#0f172a" stroke-width="2"/>

      <line x1="94" y1="355" x2="134" y2="355" stroke="#0f172a" stroke-width="1.2" stroke-dasharray="2,2"/>

      <rect x="85" y="365" width="70" height="60" fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/>
      <line x1="120" y1="365" x2="120" y2="425" stroke="#0f172a" stroke-width="1.4"/>
      <line x1="85" y1="385" x2="155" y2="385" stroke="#0f172a" stroke-width="1.2"/>

      <path d="M 100 365 L 100 371 L 107 371 L 107 379 L 100 379 L 100 385" fill="none" stroke="#0f172a" stroke-width="1.8"/>
      <path d="M 140 365 L 140 371 L 147 371 L 147 379 L 140 379 L 140 385" fill="none" stroke="#0f172a" stroke-width="1.8"/>

      <line x1="85" y1="405" x2="155" y2="405" stroke="#0f172a" stroke-width="1.2"/>
      <path d="M 100 385 L 100 391 A 4 4 0 0 1 100 399 L 100 405" fill="none" stroke="#0f172a" stroke-width="1.8"/>
      <path d="M 140 385 L 140 391 A 4 4 0 0 1 140 399 L 140 405" fill="none" stroke="#0f172a" stroke-width="1.8"/>

      <line x1="100" y1="405" x2="100" y2="425" stroke="#0f172a" stroke-width="1.8"/>
      <line x1="140" y1="405" x2="140" y2="425" stroke="#0f172a" stroke-width="1.8"/>
      <rect x="92" y="410" width="16" height="10" fill="#ffffff" stroke="none"/>
      <text x="100" y="418" font-family="'Segoe UI', Arial, sans-serif" font-size="9" font-weight="bold" fill="#0f172a" text-anchor="middle">Id</text>
      <rect x="132" y="410" width="16" height="10" fill="#ffffff" stroke="none"/>
      <text x="140" y="418" font-family="'Segoe UI', Arial, sans-serif" font-size="9" font-weight="bold" fill="#0f172a" text-anchor="middle">Id</text>
    `
  },

  q1_termomagnetico_2p: {
    nombre: "Disyuntor Termomagnético 2P (MCB)",
    norma: "IEC 60617 / UNE-EN 60898",
    categoria: "protecciones",
    descripcion: "Interruptor automático magnetotérmico 2P sin diferencial (solo disparo por sobrecarga y cortocircuito).",
    tagSugerido: "-QA1",
    calibreSugerido: "16 A",
    sensibilidadSugerida: "Curva C",
    svgPreview: `
      <svg viewBox="0 0 120 120" width="80" height="80">
        <text x="35" y="25" font-size="10" font-weight="bold" fill="#0284c7" text-anchor="end">-Q</text>
        <line x1="50" y1="15" x2="50" y2="30" stroke="#0f172a" stroke-width="1.8"/>
        <line x1="47" y1="27" x2="53" y2="33" stroke="#0f172a" stroke-width="1.4"/>
        <line x1="47" y1="33" x2="53" y2="27" stroke="#0f172a" stroke-width="1.4"/>
        <line x1="50" y1="48" x2="40" y2="30" stroke="#0f172a" stroke-width="1.8"/>
        <line x1="75" y1="15" x2="75" y2="30" stroke="#0f172a" stroke-width="1.8"/>
        <line x1="72" y1="27" x2="78" y2="33" stroke="#0f172a" stroke-width="1.4"/>
        <line x1="72" y1="33" x2="78" y2="27" stroke="#0f172a" stroke-width="1.4"/>
        <line x1="75" y1="48" x2="65" y2="30" stroke="#0f172a" stroke-width="1.8"/>
        <line x1="45" y1="39" x2="70" y2="39" stroke="#0f172a" stroke-width="1" stroke-dasharray="2,2"/>
        <rect x="37" y="48" width="51" height="42" fill="#ffffff" stroke="#0f172a" stroke-width="1.6"/>
        <line x1="62" y1="48" x2="62" y2="90" stroke="#0f172a" stroke-width="1.2"/>
        <line x1="37" y1="69" x2="88" y2="69" stroke="#0f172a" stroke-width="1"/>
        <path d="M 50 48 L 50 55 L 55 55 L 55 62 L 50 62 L 50 69" fill="none" stroke="#0f172a" stroke-width="1.4"/>
        <path d="M 75 48 L 75 55 L 80 55 L 80 62 L 75 62 L 75 69" fill="none" stroke="#0f172a" stroke-width="1.4"/>
        <path d="M 50 69 L 50 75 A 4 4 0 0 1 50 84 L 50 90" fill="none" stroke="#0f172a" stroke-width="1.4"/>
        <path d="M 75 69 L 75 75 A 4 4 0 0 1 75 84 L 75 90" fill="none" stroke="#0f172a" stroke-width="1.4"/>
      </svg>
    `,
    generarSvg: (tag = "-QA1", cal = "16 A", sens = "Curva C") => `
      <text x="78" y="348" class="tag draggable-text" text-anchor="end" font-weight="bold">${tag}</text>
      <text x="78" y="388" class="subtag draggable-text" text-anchor="end" font-size="10" font-weight="bold" fill="#0f172a">${cal}</text>
      <text x="78" y="402" class="subtag draggable-text" text-anchor="end" font-size="10" font-weight="bold" fill="#0f172a">${sens}</text>

      <line x1="97" y1="342" x2="103" y2="348" stroke="#0f172a" stroke-width="1.6"/>
      <line x1="97" y1="348" x2="103" y2="342" stroke="#0f172a" stroke-width="1.6"/>
      <line x1="100" y1="365" x2="88" y2="346" stroke="#0f172a" stroke-width="2"/>

      <line x1="137" y1="342" x2="143" y2="348" stroke="#0f172a" stroke-width="1.6"/>
      <line x1="137" y1="348" x2="143" y2="342" stroke="#0f172a" stroke-width="1.6"/>
      <line x1="140" y1="365" x2="128" y2="346" stroke="#0f172a" stroke-width="2"/>

      <line x1="94" y1="355" x2="134" y2="355" stroke="#0f172a" stroke-width="1.2" stroke-dasharray="2,2"/>

      <rect x="85" y="365" width="70" height="60" fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/>
      <line x1="120" y1="365" x2="120" y2="425" stroke="#0f172a" stroke-width="1.4"/>

      <!-- Nivel Térmico -->
      <line x1="85" y1="395" x2="155" y2="395" stroke="#0f172a" stroke-width="1.2"/>
      <path d="M 100 365 L 100 375 L 107 375 L 107 385 L 100 385 L 100 395" fill="none" stroke="#0f172a" stroke-width="1.8"/>
      <path d="M 140 365 L 140 375 L 147 375 L 147 385 L 140 385 L 140 395" fill="none" stroke="#0f172a" stroke-width="1.8"/>

      <!-- Nivel Magnético -->
      <path d="M 100 395 L 100 403 A 6 6 0 0 1 100 417 L 100 425" fill="none" stroke="#0f172a" stroke-width="1.8"/>
      <path d="M 140 395 L 140 403 A 6 6 0 0 1 140 417 L 140 425" fill="none" stroke="#0f172a" stroke-width="1.8"/>
    `
  },

  diferencial_puro_2p: {
    nombre: "Interruptor Diferencial Puro 2P (RCCB)",
    norma: "IEC 60617 / UNE-EN 61008",
    categoria: "protecciones",
    descripcion: "Interruptor diferencial puro 2P (corte por corriente de fuga a tierra sin disparador termomagnético incorporado).",
    tagSugerido: "-QF1",
    calibreSugerido: "25 A",
    sensibilidadSugerida: "30 mA",
    svgPreview: `
      <svg viewBox="0 0 120 120" width="80" height="80">
        <text x="35" y="25" font-size="10" font-weight="bold" fill="#0284c7" text-anchor="end">-QF</text>
        <line x1="50" y1="15" x2="50" y2="35" stroke="#0f172a" stroke-width="1.8"/>
        <line x1="50" y1="55" x2="40" y2="35" stroke="#0f172a" stroke-width="1.8"/>
        <line x1="75" y1="15" x2="75" y2="35" stroke="#0f172a" stroke-width="1.8"/>
        <line x1="75" y1="55" x2="65" y2="35" stroke="#0f172a" stroke-width="1.8"/>
        <line x1="45" y1="45" x2="70" y2="45" stroke="#0f172a" stroke-width="1" stroke-dasharray="2,2"/>
        <rect x="37" y="55" width="51" height="35" fill="#ffffff" stroke="#0f172a" stroke-width="1.6"/>
        <line x1="62" y1="55" x2="62" y2="90" stroke="#0f172a" stroke-width="1.2"/>
        <line x1="50" y1="55" x2="50" y2="90" stroke="#0f172a" stroke-width="1.6"/>
        <line x1="75" y1="55" x2="75" y2="90" stroke="#0f172a" stroke-width="1.6"/>
        <rect x="42" y="65" width="16" height="12" fill="#ffffff" stroke="none"/>
        <text x="50" y="74" font-size="9" font-weight="bold" fill="#0f172a" text-anchor="middle">Id</text>
        <rect x="67" y="65" width="16" height="12" fill="#ffffff" stroke="none"/>
        <text x="75" y="74" font-size="9" font-weight="bold" fill="#0f172a" text-anchor="middle">Id</text>
      </svg>
    `,
    generarSvg: (tag = "-QF1", cal = "25 A", sens = "30 mA") => `
      <text x="78" y="348" class="tag draggable-text" text-anchor="end" font-weight="bold">${tag}</text>
      <text x="78" y="388" class="subtag draggable-text" text-anchor="end" font-size="10" font-weight="bold" fill="#0f172a">${cal}</text>
      <text x="78" y="402" class="subtag draggable-text" text-anchor="end" font-size="10" font-weight="bold" fill="#0f172a">${sens}</text>

      <line x1="100" y1="365" x2="88" y2="346" stroke="#0f172a" stroke-width="2"/>
      <line x1="140" y1="365" x2="128" y2="346" stroke="#0f172a" stroke-width="2"/>
      <line x1="94" y1="355" x2="134" y2="355" stroke="#0f172a" stroke-width="1.2" stroke-dasharray="2,2"/>

      <rect x="85" y="365" width="70" height="60" fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/>
      <line x1="120" y1="365" x2="120" y2="425" stroke="#0f172a" stroke-width="1.4"/>
      <line x1="100" y1="365" x2="100" y2="425" stroke="#0f172a" stroke-width="1.8"/>
      <line x1="140" y1="365" x2="140" y2="425" stroke="#0f172a" stroke-width="1.8"/>

      <rect x="92" y="388" width="16" height="14" fill="#ffffff" stroke="none"/>
      <text x="100" y="399" font-family="'Segoe UI', Arial, sans-serif" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">Id</text>
      <rect x="132" y="388" width="16" height="14" fill="#ffffff" stroke="none"/>
      <text x="140" y="399" font-family="'Segoe UI', Arial, sans-serif" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">Id</text>
    `
  },

  guardamotor_3p: {
    nombre: "Guardamotor Magnetotérmico 3P (MPCB)",
    norma: "IEC 60617 / UNE-EN 60947-4-1",
    categoria: "protecciones",
    descripcion: "Interruptor guardamotor tripolar con protección térmica ajustable y disparo magnético instantáneo.",
    tagSugerido: "-QM1",
    calibreSugerido: "2.5 - 4 A",
    sensibilidadSugerida: "Motor",
    svgPreview: `
      <svg viewBox="0 0 120 120" width="80" height="80">
        <text x="25" y="25" font-size="10" font-weight="bold" fill="#0284c7" text-anchor="end">-QM</text>
        <line x1="40" y1="15" x2="40" y2="30" stroke="#0f172a" stroke-width="1.5"/>
        <line x1="60" y1="15" x2="60" y2="30" stroke="#0f172a" stroke-width="1.5"/>
        <line x1="80" y1="15" x2="80" y2="30" stroke="#0f172a" stroke-width="1.5"/>
        <line x1="40" y1="45" x2="33" y2="30" stroke="#0f172a" stroke-width="1.6"/>
        <line x1="60" y1="45" x2="53" y2="30" stroke="#0f172a" stroke-width="1.6"/>
        <line x1="80" y1="45" x2="73" y2="30" stroke="#0f172a" stroke-width="1.6"/>
        <line x1="36" y1="38" x2="76" y2="38" stroke="#0f172a" stroke-width="1" stroke-dasharray="2,2"/>
        <rect x="28" y="45" width="64" height="42" fill="#ffffff" stroke="#0f172a" stroke-width="1.6"/>
        <line x1="40" y1="45" x2="40" y2="87" stroke="#0f172a" stroke-width="1.5"/>
        <line x1="60" y1="45" x2="60" y2="87" stroke="#0f172a" stroke-width="1.5"/>
        <line x1="80" y1="45" x2="80" y2="87" stroke="#0f172a" stroke-width="1.5"/>
      </svg>
    `,
    generarSvg: (tag = "-QM1", cal = "2.5 - 4 A", sens = "Motor") => `
      <text x="78" y="348" class="tag draggable-text" text-anchor="end" font-weight="bold">${tag}</text>
      <text x="78" y="388" class="subtag draggable-text" text-anchor="end" font-size="10" font-weight="bold" fill="#0f172a">${cal}</text>
      <text x="78" y="402" class="subtag draggable-text" text-anchor="end" font-size="10" font-weight="bold" fill="#0f172a">${sens}</text>

      <line x1="97" y1="342" x2="103" y2="348" stroke="#0f172a" stroke-width="1.6"/>
      <line x1="97" y1="348" x2="103" y2="342" stroke="#0f172a" stroke-width="1.6"/>
      <line x1="100" y1="365" x2="88" y2="346" stroke="#0f172a" stroke-width="2"/>

      <line x1="137" y1="342" x2="143" y2="348" stroke="#0f172a" stroke-width="1.6"/>
      <line x1="137" y1="348" x2="143" y2="342" stroke="#0f172a" stroke-width="1.6"/>
      <line x1="140" y1="365" x2="128" y2="346" stroke="#0f172a" stroke-width="2"/>

      <line x1="94" y1="355" x2="134" y2="355" stroke="#0f172a" stroke-width="1.2" stroke-dasharray="2,2"/>
      <rect x="85" y="365" width="70" height="60" fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/>
      <line x1="120" y1="365" x2="120" y2="425" stroke="#0f172a" stroke-width="1.4"/>

      <path d="M 100 365 L 100 375 L 107 375 L 107 385 L 100 385 L 100 395 A 5 5 0 0 1 100 409 L 100 425" fill="none" stroke="#0f172a" stroke-width="1.8"/>
      <path d="M 140 365 L 140 375 L 147 375 L 147 385 L 140 385 L 140 395 A 5 5 0 0 1 140 409 L 140 425" fill="none" stroke="#0f172a" stroke-width="1.8"/>
    `
  },

  fusible_seccionable_1p: {
    nombre: "Portafusible Seccionable 1P con Fusible",
    norma: "IEC 60617 / UNE-EN 60269",
    categoria: "protecciones",
    descripcion: "Base portafusible cilíndrico de carril DIN con cartucho cerámico gG (protección general).",
    tagSugerido: "-F1",
    calibreSugerido: "2A gG",
    sensibilidadSugerida: "10x38",
    svgPreview: `
      <svg viewBox="0 0 120 120" width="80" height="80">
        <text x="35" y="55" font-size="10" font-weight="bold" fill="#0284c7" text-anchor="end">-F</text>
        <line x1="60" y1="15" x2="60" y2="35" stroke="#0f172a" stroke-width="2"/>
        <rect x="50" y="35" width="20" height="45" fill="#ffffff" stroke="#0f172a" stroke-width="1.8" rx="2"/>
        <line x1="60" y1="35" x2="60" y2="80" stroke="#0f172a" stroke-width="1.8"/>
        <line x1="60" y1="80" x2="60" y2="100" stroke="#0f172a" stroke-width="2"/>
      </svg>
    `,
    generarSvg: (tag = "-F1", cal = "2A gG", sens = "10x38") => `
      <text x="78" y="380" class="tag draggable-text" text-anchor="end" font-weight="bold">${tag}</text>
      <text x="78" y="398" class="subtag draggable-text" text-anchor="end" font-size="10" font-weight="bold" fill="#0f172a">${cal}</text>
      <line x1="100" y1="345" x2="100" y2="370" class="wire-phase"/>
      <rect x="90" y="370" width="20" height="40" fill="#ffffff" stroke="#0f172a" stroke-width="1.8" rx="2"/>
      <line x1="100" y1="370" x2="100" y2="410" stroke="#0f172a" stroke-width="1.8"/>
      <line x1="100" y1="410" x2="100" y2="425" class="wire-phase"/>
      <!-- Conductor de neutro directo al lado -->
      <line x1="140" y1="345" x2="140" y2="425" class="wire-neutral"/>
    `
  },

  fuente_switching_24v: {
    nombre: "Fuente de Poder Switching Industrial (220VAC / 24VDC)",
    norma: "IEC 60617 / Rectificador y Regulador",
    categoria: "fuentes",
    descripcion: "Convertidor estático de tensión con entrada alterna monofásica y salida continua estabilizada.",
    tagSugerido: "-G1",
    calibreSugerido: "24V / 7.5A",
    sensibilidadSugerida: "180W",
    svgPreview: `
      <svg viewBox="0 0 120 120" width="80" height="80">
        <rect x="25" y="25" width="70" height="70" fill="#ffffff" stroke="#0f172a" stroke-width="1.8" rx="3"/>
        <line x1="25" y1="95" x2="95" y2="25" stroke="#0f172a" stroke-width="1.4"/>
        <text x="45" y="55" font-size="14" font-weight="bold" fill="#0f172a" text-anchor="middle">1 ~</text>
        <text x="75" y="80" font-size="18" font-weight="bold" fill="#0f172a" text-anchor="middle">=</text>
      </svg>
    `,
    generarSvg: (tag = "-G1", cal = "24V / 7.5A", sens = "TRACO POWER") => `
      <rect x="195" y="540" width="115" height="110" fill="#ffffff" stroke="#0f172a" stroke-width="2" rx="3"/>
      <line x1="195" y1="650" x2="310" y2="540" stroke="#0f172a" stroke-width="1.6"/>
      <text x="225" y="585" class="title-value draggable-text" font-size="18" fill="#0f172a" text-anchor="middle">1 ~</text>
      <text x="280" y="625" class="title-value draggable-text" font-size="22" fill="#0f172a" text-anchor="middle">=</text>
      <text x="325" y="565" class="tag draggable-text">${tag}</text>
      <text x="325" y="580" class="subtag draggable-text">${sens}</text>
      <text x="325" y="610" class="subtag draggable-text" fill="#16a34a">OUT: ${cal}</text>
    `
  },

  rele_industrial_24v: {
    nombre: "Relé de Interfase / Contactor Auxiliar (Bobina 24VDC)",
    norma: "IEC 60617 / Bobina con Contacto NA",
    categoria: "control",
    descripcion: "Bobina electromagnética de relé con bornes A1-A2 y contacto auxiliar normalmente abierto 13-14.",
    tagSugerido: "-K1",
    calibreSugerido: "24VDC",
    sensibilidadSugerida: "6A / 250VAC",
    svgPreview: `
      <svg viewBox="0 0 120 120" width="80" height="80">
        <text x="25" y="60" font-size="10" font-weight="bold" fill="#0284c7" text-anchor="end">-K</text>
        <line x1="60" y1="15" x2="60" y2="35" stroke="#0f172a" stroke-width="1.8"/>
        <rect x="45" y="35" width="30" height="50" fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/>
        <line x1="45" y1="35" x2="75" y2="85" stroke="#0f172a" stroke-width="1.2"/>
        <text x="50" y="30" font-size="8" fill="#475569">A1</text>
        <text x="50" y="96" font-size="8" fill="#475569">A2</text>
        <line x1="60" y1="85" x2="60" y2="105" stroke="#0f172a" stroke-width="1.8"/>
      </svg>
    `,
    generarSvg: (tag = "-K1", cal = "24VDC", sens = "RIFLINE") => `
      <text x="75" y="275" class="tag draggable-text" text-anchor="end" font-weight="bold">${tag}</text>
      <text x="75" y="290" class="subtag draggable-text" text-anchor="end" font-size="10">${sens}</text>
      <rect x="85" y="260" width="30" height="50" fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/>
      <line x1="85" y1="260" x2="115" y2="310" stroke="#0f172a" stroke-width="1.4"/>
      <text x="100" y="255" font-size="9" fill="#475569" text-anchor="middle">A1</text>
      <text x="100" y="322" font-size="9" fill="#475569" text-anchor="middle">A2</text>
    `
  },

  paro_emergencia: {
    nombre: "Pulsador de Paro de Emergencia (Seta NC)",
    norma: "IEC 60617 / EN ISO 13850",
    categoria: "control",
    descripcion: "Pulsador con cabeza de seta y desenclavamiento por giro con contacto de apertura positiva NC.",
    tagSugerido: "-S0",
    calibreSugerido: "24V / 2A",
    sensibilidadSugerida: "Seguridad",
    svgPreview: `
      <svg viewBox="0 0 120 120" width="80" height="80">
        <text x="25" y="60" font-size="10" font-weight="bold" fill="#dc2626" text-anchor="end">-S</text>
        <line x1="60" y1="15" x2="60" y2="40" stroke="#0f172a" stroke-width="1.8"/>
        <path d="M 45 40 Q 60 25 75 40 Z" fill="#dc2626" stroke="#0f172a" stroke-width="1.5"/>
        <line x1="60" y1="40" x2="60" y2="60" stroke="#0f172a" stroke-width="1.8"/>
        <line x1="60" y1="60" x2="48" y2="78" stroke="#0f172a" stroke-width="2"/>
        <line x1="45" y1="78" x2="52" y2="78" stroke="#0f172a" stroke-width="2"/>
        <line x1="60" y1="78" x2="60" y2="105" stroke="#0f172a" stroke-width="1.8"/>
      </svg>
    `,
    generarSvg: (tag = "-S0", cal = "24V / 2A", sens = "Paro Cricca") => `
      <text x="75" y="275" class="tag draggable-text" text-anchor="end" font-weight="bold" fill="#dc2626">${tag}</text>
      <text x="75" y="290" class="subtag draggable-text" text-anchor="end" font-size="10">${sens}</text>
      <path d="M 85 260 Q 100 245 115 260 Z" fill="#dc2626" stroke="#0f172a" stroke-width="1.6"/>
      <line x1="100" y1="260" x2="100" y2="280" stroke="#0f172a" stroke-width="1.8"/>
      <line x1="100" y1="280" x2="88" y2="300" stroke="#0f172a" stroke-width="2"/>
      <line x1="85" y1="300" x2="92" y2="300" stroke="#0f172a" stroke-width="2"/>
      <line x1="100" y1="300" x2="100" y2="325" stroke="#0f172a" stroke-width="1.8"/>
    `
  }
};

// =========================================================================
// 2. INICIALIZACIÓN DEL SISTEMA DE EDICIÓN DE SÍMBOLOS
// =========================================================================
function initEditorSimbolos() {
  crearUIModalesYGizmo();
  vincularEventosGizmo();
}

// =========================================================================
// 3. INYECCIÓN DINÁMICA DE LA UI (GIZMO, INSPECTOR Y BIBLIOTECA)
// =========================================================================
function crearUIModalesYGizmo() {
  // 1. Barra Flotante de Herramientas (Gizmo)
  if (!document.getElementById("symbolFloatingGizmo")) {
    const gizmo = document.createElement("div");
    gizmo.id = "symbolFloatingGizmo";
    gizmo.className = "symbol-floating-gizmo no-print";
    gizmo.innerHTML = `
      <button id="btnGizmoRotate" class="gizmo-btn" title="Girar 90° en sentido horario">🔄 Girar 90°</button>
      <button id="btnGizmoFlipH" class="gizmo-btn" title="Reflejar Horizontalmente (Invertir izquierda/derecha)">↔️ Flip H</button>
      <button id="btnGizmoFlipV" class="gizmo-btn" title="Reflejar Verticalmente (Invertir arriba/abajo)">↕️ Flip V</button>
      <button id="btnGizmoScaleDown" class="gizmo-btn" title="Achicar tamaño (-10%)">🔍 -</button>
      <button id="btnGizmoScaleUp" class="gizmo-btn" title="Agrandar tamaño (+10%)">🔍 +</button>
      <div class="gizmo-divider"></div>
      <button id="btnGizmoProps" class="gizmo-btn gizmo-btn-accent" title="Abrir Inspector de Parámetros y Calibres">⚙️ Propiedades</button>
      <button id="btnGizmoLibrary" class="gizmo-btn gizmo-btn-primary" title="Cambiar por otro símbolo de la Biblioteca IEC">⚡ Cambiar Símbolo</button>
      <button id="btnGizmoClose" class="gizmo-btn gizmo-btn-close" title="Deseleccionar símbolo">✕</button>
    `;
    document.body.appendChild(gizmo);
  }

  // 2. Modal Inspector de Propiedades
  if (!document.getElementById("modalInspectorSimbolo")) {
    const modalProps = document.createElement("div");
    modalProps.id = "modalInspectorSimbolo";
    modalProps.className = "modal-overlay no-print";
    modalProps.innerHTML = `
      <div class="modal-card" style="max-width: 480px;">
        <div class="modal-title">
          <span style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:18px;">⚙️</span>
            Inspector de Propiedades Eléctricas
          </span>
          <button class="btn-icon" id="btnCloseInspectorModal" style="width:28px; height:28px;">✕</button>
        </div>

        <div style="font-size: 12px; color: #94a3b8; margin-bottom: 14px;">
          Edita los identificadores, calibres y características del componente seleccionado:
        </div>

        <div style="display:flex; flex-direction:column; gap:12px;">
          <div>
            <label style="font-size:11px; font-weight:700; color:#cbd5e1; text-transform:uppercase;">Tag / Designador IEC:</label>
            <input type="text" id="propTag" class="modal-input" placeholder="Ej: -QA1, -G1, -A1">
          </div>

          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
            <div>
              <label style="font-size:11px; font-weight:700; color:#cbd5e1; text-transform:uppercase;">Calibre / Tensión:</label>
              <input type="text" id="propCalibre" class="modal-input" placeholder="Ej: 10 A, 16 A, 24V">
            </div>
            <div>
              <label style="font-size:11px; font-weight:700; color:#cbd5e1; text-transform:uppercase;">Sensibilidad / Curva:</label>
              <input type="text" id="propSensibilidad" class="modal-input" placeholder="Ej: 30 mA, Curva C">
            </div>
          </div>

          <div>
            <label style="font-size:11px; font-weight:700; color:#cbd5e1; text-transform:uppercase;">Descripción / Función:</label>
            <input type="text" id="propDescripcion" class="modal-input" placeholder="Ej: Alimentación General Tablero">
          </div>

          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
            <div>
              <label style="font-size:11px; font-weight:700; color:#cbd5e1; text-transform:uppercase;">Fabricante / Marca:</label>
              <input type="text" id="propFabricante" class="modal-input" placeholder="Ej: Schneider, Traco, Phoenix">
            </div>
            <div>
              <label style="font-size:11px; font-weight:700; color:#cbd5e1; text-transform:uppercase;">Modelo / Ref:</label>
              <input type="text" id="propModelo" class="modal-input" placeholder="Ej: iC60N, TSP 180-124">
            </div>
          </div>
        </div>

        <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:20px;">
          <button id="btnCancelarInspector" class="btn-tool" style="background:rgba(255,255,255,0.08);">Cancelar</button>
          <button id="btnAplicarInspector" class="btn-tool btn-accent" style="padding:8px 16px;">💾 Aplicar Cambios al Plano</button>
        </div>
      </div>
    `;
    document.body.appendChild(modalProps);
  }

  // 3. Modal Biblioteca de Símbolos IEC 60617
  if (!document.getElementById("modalBibliotecaIEC")) {
    const modalLib = document.createElement("div");
    modalLib.id = "modalBibliotecaIEC";
    modalLib.className = "modal-overlay no-print";
    modalLib.innerHTML = `
      <div class="modal-card" style="max-width: 820px; width:95%;">
        <div class="modal-title">
          <span style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:20px;">⚡</span>
            Biblioteca de Símbolos Normalizados IEC 60617
          </span>
          <button class="btn-icon" id="btnCloseBibliotecaModal" style="width:28px; height:28px;">✕</button>
        </div>

        <div style="font-size: 12px; color: #94a3b8; margin-bottom: 14px;">
          Catálogo gráfico oficial para sustituir o insertar componentes en esquemas eléctricos AXON:
        </div>

        <!-- Pestañas de categorías -->
        <div style="display:flex; gap:6px; margin-bottom:14px; border-bottom:1px solid rgba(255,255,255,0.12); padding-bottom:8px;">
          <button class="tab-guardar-btn active" data-cat="todas">Todos los Símbolos</button>
          <button class="tab-guardar-btn" data-cat="protecciones">Protecciones (QA/QM/F)</button>
          <button class="tab-guardar-btn" data-cat="fuentes">Fuentes y Transformadores (G)</button>
          <button class="tab-guardar-btn" data-cat="control">Maniobra y Seguridad (K/S)</button>
        </div>

        <!-- Cuadrícula de Símbolos -->
        <div id="gridBibliotecaIEC" class="grid-biblioteca-iec">
          <!-- Renderizado dinámico -->
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:16px; border-top:1px solid rgba(255,255,255,0.1); padding-top:12px;">
          <span style="font-size:11px; color:#64748b;">Normas de referencia: IEC 60617 / EPLAN Style / UNE-EN 60204-1</span>
          <button id="btnCerrarBibliotecaBottom" class="btn-tool">Cerrar</button>
        </div>
      </div>
    `;
    document.body.appendChild(modalLib);
    renderizarCatalogoBiblioteca("todas");
  }
}

// =========================================================================
// 4. GESTIÓN DEL GIZMO DE TRANSFORMACIÓN (OPCIÓN C)
// =========================================================================
function vincularEventosGizmo() {
  const btnRot = document.getElementById("btnGizmoRotate");
  if (btnRot) btnRot.addEventListener("click", () => rotarSimboloSeleccionado(90));

  const btnFlipH = document.getElementById("btnGizmoFlipH");
  if (btnFlipH) btnFlipH.addEventListener("click", () => reflejarSimboloSeleccionado("x"));

  const btnFlipV = document.getElementById("btnGizmoFlipV");
  if (btnFlipV) btnFlipV.addEventListener("click", () => reflejarSimboloSeleccionado("y"));

  const btnScaleUp = document.getElementById("btnGizmoScaleUp");
  if (btnScaleUp) btnScaleUp.addEventListener("click", () => escalarSimboloSeleccionado(1.1));

  const btnScaleDown = document.getElementById("btnGizmoScaleDown");
  if (btnScaleDown) btnScaleDown.addEventListener("click", () => escalarSimboloSeleccionado(0.9));

  const btnProps = document.getElementById("btnGizmoProps");
  if (btnProps) btnProps.addEventListener("click", () => abrirInspectorSimbolo(simboloActivoGizmo));

  const btnLib = document.getElementById("btnGizmoLibrary");
  if (btnLib) btnLib.addEventListener("click", () => abrirBibliotecaIEC(simboloActivoGizmo));

  const btnClose = document.getElementById("btnGizmoClose");
  if (btnClose) btnClose.addEventListener("click", deseleccionarSimboloGizmo);

  // Botón superior de la barra para abrir la biblioteca en cualquier momento
  const btnTopLib = document.getElementById("btnAbrirBibliotecaIEC");
  if (btnTopLib) btnTopLib.addEventListener("click", () => abrirBibliotecaIEC(simboloActivoGizmo));

  // Inspector
  const btnCloseInsp = document.getElementById("btnCloseInspectorModal");
  if (btnCloseInsp) btnCloseInsp.addEventListener("click", cerrarInspectorSimbolo);

  const btnCancInsp = document.getElementById("btnCancelarInspector");
  if (btnCancInsp) btnCancInsp.addEventListener("click", cerrarInspectorSimbolo);

  const btnApplyInsp = document.getElementById("btnAplicarInspector");
  if (btnApplyInsp) btnApplyInsp.addEventListener("click", aplicarPropiedadesInspector);

  // Biblioteca
  const btnCloseLib = document.getElementById("btnCloseBibliotecaModal");
  if (btnCloseLib) btnCloseLib.addEventListener("click", cerrarBibliotecaIEC);

  const btnCloseLibBtm = document.getElementById("btnCerrarBibliotecaBottom");
  if (btnCloseLibBtm) btnCloseLibBtm.addEventListener("click", cerrarBibliotecaIEC);

  // Pestañas de la biblioteca
  document.querySelectorAll("#modalBibliotecaIEC .tab-guardar-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      document.querySelectorAll("#modalBibliotecaIEC .tab-guardar-btn").forEach((b) => b.classList.remove("active"));
      e.currentTarget.classList.add("active");
      renderizarCatalogoBiblioteca(e.currentTarget.dataset.cat);
    });
  });
}

// Hook disparado por editor_textos.js cuando se hace clic sobre un símbolo
window.onSimboloSeleccionado = function (sym) {
  seleccionarSimboloGizmo(sym);
};

function seleccionarSimboloGizmo(sym) {
  if (simboloActivoGizmo && simboloActivoGizmo !== sym) {
    simboloActivoGizmo.classList.remove("selected-symbol-outline");
  }

  simboloActivoGizmo = sym;
  if (!simboloActivoGizmo) {
    deseleccionarSimboloGizmo();
    return;
  }

  simboloActivoGizmo.classList.add("selected-symbol-outline");
  posicionarGizmo(simboloActivoGizmo);
}

function deseleccionarSimboloGizmo() {
  if (simboloActivoGizmo) {
    simboloActivoGizmo.classList.remove("selected-symbol-outline");
    simboloActivoGizmo = null;
  }
  const gizmo = document.getElementById("symbolFloatingGizmo");
  if (gizmo) gizmo.style.display = "none";
}

function posicionarGizmo(sym) {
  const gizmo = document.getElementById("symbolFloatingGizmo");
  if (!gizmo || !sym) return;

  const rect = sym.getBoundingClientRect();
  let top = rect.top - 46;
  let left = rect.left + rect.width / 2 - 190;

  if (top < 70) top = rect.bottom + 12;
  if (left < 10) left = 10;
  if (left + 390 > window.innerWidth) left = window.innerWidth - 400;

  gizmo.style.top = `${Math.round(top)}px`;
  gizmo.style.left = `${Math.round(left)}px`;
  gizmo.style.display = "flex";
}

// Reposicionar gizmo en scroll o zoom
window.addEventListener("scroll", () => {
  if (simboloActivoGizmo) posicionarGizmo(simboloActivoGizmo);
});

// =========================================================================
// 5. MOTOR VECTORIAL: ROTAR, REFLEJAR Y ESCALAR (OPCIÓN C)
// =========================================================================
function getSymbolTransformState(el) {
  return {
    tx: parseFloat(el.dataset.tx || 0),
    ty: parseFloat(el.dataset.ty || 0),
    rot: parseFloat(el.dataset.rot || 0),
    flipX: parseFloat(el.dataset.flipX || 1),
    flipY: parseFloat(el.dataset.flipY || 1),
    scale: parseFloat(el.dataset.scale || 1)
  };
}

function applySymbolTransform(el, state) {
  el.dataset.tx = state.tx;
  el.dataset.ty = state.ty;
  el.dataset.rot = state.rot;
  el.dataset.flipX = state.flipX;
  el.dataset.flipY = state.flipY;
  el.dataset.scale = state.scale;

  let bbox;
  try {
    bbox = el.getBBox();
  } catch (e) {
    bbox = { x: 0, y: 0, width: 60, height: 60 };
  }
  const cx = Math.round(bbox.x + bbox.width / 2);
  const cy = Math.round(bbox.y + bbox.height / 2);

  let transformStr = `translate(${state.tx}, ${state.ty})`;
  if (state.rot !== 0 || state.flipX !== 1 || state.flipY !== 1 || state.scale !== 1) {
    transformStr += ` translate(${cx}, ${cy}) rotate(${state.rot}) scale(${state.flipX * state.scale}, ${state.flipY * state.scale}) translate(${-cx}, ${-cy})`;
  }
  el.setAttribute("transform", transformStr);

  if (typeof guardarAjustesTextos === "function") {
    guardarAjustesTextos();
  }
  posicionarGizmo(el);
}

function rotarSimboloSeleccionado(deltaAngle = 90) {
  if (!simboloActivoGizmo) {
    mostrarNotificacion("Selecciona primero un símbolo con el ratón.");
    return;
  }
  const state = getSymbolTransformState(simboloActivoGizmo);
  state.rot = (state.rot + deltaAngle) % 360;
  applySymbolTransform(simboloActivoGizmo, state);
  mostrarNotificacion(`🔄 Rotación aplicada: ${state.rot}°`);
}

function reflejarSimboloSeleccionado(eje = "x") {
  if (!simboloActivoGizmo) {
    mostrarNotificacion("Selecciona primero un símbolo con el ratón.");
    return;
  }
  const state = getSymbolTransformState(simboloActivoGizmo);
  if (eje === "x") {
    state.flipX = state.flipX * -1;
    mostrarNotificacion(state.flipX < 0 ? "↔️ Reflejo horizontal aplicado." : "↔️ Orientación horizontal normal.");
  } else {
    state.flipY = state.flipY * -1;
    mostrarNotificacion(state.flipY < 0 ? "↕️ Reflejo vertical aplicado." : "↕️ Orientación vertical normal.");
  }
  applySymbolTransform(simboloActivoGizmo, state);
}

function escalarSimboloSeleccionado(factor = 1.1) {
  if (!simboloActivoGizmo) {
    mostrarNotificacion("Selecciona primero un símbolo con el ratón.");
    return;
  }
  const state = getSymbolTransformState(simboloActivoGizmo);
  let newScale = Math.round(state.scale * factor * 100) / 100;
  if (newScale < 0.4) newScale = 0.4;
  if (newScale > 2.5) newScale = 2.5;
  state.scale = newScale;
  applySymbolTransform(simboloActivoGizmo, state);
  mostrarNotificacion(`🔍 Escala del componente: ${Math.round(newScale * 100)}%`);
}

// =========================================================================
// 6. INSPECTOR DE PROPIEDADES ELÉCTRICAS (OPCIÓN A)
// =========================================================================
function abrirInspectorSimbolo(sym) {
  if (!sym) {
    mostrarNotificacion("Haz clic sobre un símbolo antes de abrir el inspector.");
    return;
  }
  simboloActivoGizmo = sym;

  // Extraer valores existentes desde los textos hijos
  const textTag = sym.querySelector(".tag") || sym.querySelector("text");
  const textSub = sym.querySelectorAll(".subtag");

  let tagVal = textTag ? textTag.textContent.trim() : sym.id;
  let calVal = textSub.length > 0 ? textSub[0].textContent.trim() : "";
  let sensVal = textSub.length > 1 ? textSub[1].textContent.trim() : "";
  let descVal = sym.getAttribute("title") || "";

  document.getElementById("propTag").value = tagVal;
  document.getElementById("propCalibre").value = calVal;
  document.getElementById("propSensibilidad").value = sensVal;
  document.getElementById("propDescripcion").value = descVal;
  document.getElementById("propFabricante").value = "AXON / Standard";
  document.getElementById("propModelo").value = sym.id || "Componente";

  const modal = document.getElementById("modalInspectorSimbolo");
  if (modal) modal.classList.add("open");
}

function cerrarInspectorSimbolo() {
  const modal = document.getElementById("modalInspectorSimbolo");
  if (modal) modal.classList.remove("open");
}

function aplicarPropiedadesInspector() {
  if (!simboloActivoGizmo) return;

  const nuevoTag = document.getElementById("propTag").value.trim();
  const nuevoCal = document.getElementById("propCalibre").value.trim();
  const nuevaSens = document.getElementById("propSensibilidad").value.trim();
  const nuevaDesc = document.getElementById("propDescripcion").value.trim();

  // Actualizar en el DOM del símbolo
  const textTag = simboloActivoGizmo.querySelector(".tag") || simboloActivoGizmo.querySelector("text");
  if (textTag && nuevoTag) textTag.textContent = nuevoTag;

  const textSubs = simboloActivoGizmo.querySelectorAll(".subtag");
  if (textSubs.length > 0 && nuevoCal) textSubs[0].textContent = nuevoCal;
  if (textSubs.length > 1 && nuevaSens) textSubs[1].textContent = nuevaSens;

  if (nuevaDesc) simboloActivoGizmo.setAttribute("title", nuevaDesc);

  cerrarInspectorSimbolo();
  if (typeof guardarAjustesTextos === "function") {
    guardarAjustesTextos();
  }
  mostrarNotificacion(`✅ Propiedades actualizadas para ${nuevoTag}`);
}

// =========================================================================
// 7. BIBLIOTECA DE SÍMBOLOS IEC 60617 (OPCIÓN B)
// =========================================================================
function renderizarCatalogoBiblioteca(filtroCat = "todas") {
  const grid = document.getElementById("gridBibliotecaIEC");
  if (!grid) return;
  grid.innerHTML = "";

  Object.keys(BIBLIOTECA_IEC).forEach((key) => {
    const item = BIBLIOTECA_IEC[key];
    if (filtroCat !== "todas" && item.categoria !== filtroCat) return;

    const card = document.createElement("div");
    card.className = "card-simbolo-iec";
    card.innerHTML = `
      <div class="card-simbolo-preview">
        ${item.svgPreview}
      </div>
      <div class="card-simbolo-info">
        <div class="card-simbolo-nombre">${item.nombre}</div>
        <div class="card-simbolo-norma">${item.norma}</div>
        <div class="card-simbolo-desc">${item.descripcion}</div>
      </div>
      <div class="card-simbolo-actions">
        <button class="btn-tool btn-accent btn-reemplazar-simbolo" data-key="${key}" title="Sustituye la simbología del componente seleccionado por esta">
          ⚡ Reemplazar en Plano
        </button>
        <button class="btn-tool btn-copiar-svg" data-key="${key}" title="Copiar código SVG">
          📋 Copiar
        </button>
      </div>
    `;

    grid.appendChild(card);
  });

  // Vincular eventos de reemplazo
  grid.querySelectorAll(".btn-reemplazar-simbolo").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const key = e.currentTarget.dataset.key;
      reemplazarSimboloConTemplate(key);
    });
  });

  // Vincular eventos de copia
  grid.querySelectorAll(".btn-copiar-svg").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const key = e.currentTarget.dataset.key;
      copiarSvgTemplate(key);
    });
  });
}

function abrirBibliotecaIEC(sym) {
  if (sym) simboloActivoGizmo = sym;
  const modal = document.getElementById("modalBibliotecaIEC");
  if (modal) modal.classList.add("open");
}

function cerrarBibliotecaIEC() {
  const modal = document.getElementById("modalBibliotecaIEC");
  if (modal) modal.classList.remove("open");
}

function reemplazarSimboloConTemplate(key) {
  const template = BIBLIOTECA_IEC[key];
  if (!template) return;

  if (!simboloActivoGizmo) {
    mostrarNotificacion("Selecciona primero el componente en el plano que deseas reemplazar.");
    return;
  }

  // Extraer valores del símbolo existente
  const tagEl = simboloActivoGizmo.querySelector(".tag") || simboloActivoGizmo.querySelector("text");
  const tagActual = tagEl ? tagEl.textContent.trim() : template.tagSugerido;

  // Generar nuevo marcado SVG
  const nuevoSvgInner = template.generarSvg(tagActual, template.calibreSugerido, template.sensibilidadSugerida);
  simboloActivoGizmo.innerHTML = nuevoSvgInner;

  cerrarBibliotecaIEC();
  if (typeof guardarAjustesTextos === "function") {
    guardarAjustesTextos();
  }
  posicionarGizmo(simboloActivoGizmo);
  mostrarNotificacion(`⚡ Símbolo actualizado con éxito: ${template.nombre}`);
}

function copiarSvgTemplate(key) {
  const template = BIBLIOTECA_IEC[key];
  if (!template) return;
  const svgCode = template.generarSvg(template.tagSugerido, template.calibreSugerido, template.sensibilidadSugerida);

  if (navigator.clipboard) {
    navigator.clipboard.writeText(svgCode).then(() => {
      mostrarNotificacion("📋 Código SVG del símbolo copiado al portapapeles.");
    });
  } else {
    prompt("Copia el código SVG del símbolo:", svgCode);
  }
}

// Iniciar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  initEditorSimbolos();
});
