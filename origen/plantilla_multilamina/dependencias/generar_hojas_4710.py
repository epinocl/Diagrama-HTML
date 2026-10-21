"""
Generador Perfeccionado de las 4 Láminas Vectoriales A3 para DE-4710
=====================================================================
- Cajetín ampliado con textos grandes y legibles.
- Espaciado generoso sin colisiones de texto ni líneas sobrepuestas.
- Formato A3 normalizado (1191 x 842 pt).
- Etiquetas con clase 'draggable-text' para reubicación manual interactiva.
"""

import os
import json
import pymupdf

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
HOJAS_DIR = os.path.join(BASE_DIR, "hojas")
THUMBS_DIR = os.path.join(HOJAS_DIR, "miniaturas")
JS_DIR = os.path.join(BASE_DIR, "js")

os.makedirs(HOJAS_DIR, exist_ok=True)
os.makedirs(THUMBS_DIR, exist_ok=True)
os.makedirs(JS_DIR, exist_ok=True)

def marco_cajetin_svg(num_hoja, total_hojas, titulo_lamina, disciplina):
    """
    Cajetín de ingeniería AXON ampliado:
    - Altura aumentada a 90 pt (Y: 705 a 795) para máxima amplitud y legibilidad.
    - Celdas anchas, textos grandes y sin abreviaturas forzadas.
    """
    return f"""
  <!-- Marco Exterior A3 (420x297mm) -->
  <rect x="15" y="15" width="1161" height="812" class="cad-thin"/>
  <!-- Marco Interior Principal -->
  <rect x="40" y="30" width="1125" height="782" class="cad-border"/>

  <!-- Cuadrícula Superior e Inferior (Columnas 8 a 1) -->
  <line x1="40" y1="45" x2="1165" y2="45" class="cad-thin"/>
  <line x1="40" y1="797" x2="1165" y2="797" class="cad-thin"/>

  <line x1="180.6" y1="30" x2="180.6" y2="45" class="cad-thin"/><line x1="180.6" y1="797" x2="180.6" y2="812" class="cad-thin"/>
  <line x1="321.2" y1="30" x2="321.2" y2="45" class="cad-thin"/><line x1="321.2" y1="797" x2="321.2" y2="812" class="cad-thin"/>
  <line x1="461.8" y1="30" x2="461.8" y2="45" class="cad-thin"/><line x1="461.8" y1="797" x2="461.8" y2="812" class="cad-thin"/>
  <line x1="602.5" y1="30" x2="602.5" y2="45" class="cad-thin"/><line x1="602.5" y1="797" x2="602.5" y2="812" class="cad-thin"/>
  <line x1="743.1" y1="30" x2="743.1" y2="45" class="cad-thin"/><line x1="743.1" y1="797" x2="743.1" y2="812" class="cad-thin"/>
  <line x1="883.7" y1="30" x2="883.7" y2="45" class="cad-thin"/><line x1="883.7" y1="797" x2="883.7" y2="812" class="cad-thin"/>
  <line x1="1024.3" y1="30" x2="1024.3" y2="45" class="cad-thin"/><line x1="1024.3" y1="797" x2="1024.3" y2="812" class="cad-thin"/>

  <text x="110.3" y="39" class="grid-label">8</text><text x="110.3" y="806" class="grid-label">8</text>
  <text x="250.9" y="39" class="grid-label">7</text><text x="250.9" y="806" class="grid-label">7</text>
  <text x="391.5" y="39" class="grid-label">6</text><text x="391.5" y="806" class="grid-label">6</text>
  <text x="532.1" y="39" class="grid-label">5</text><text x="532.1" y="806" class="grid-label">5</text>
  <text x="672.8" y="39" class="grid-label">4</text><text x="672.8" y="806" class="grid-label">4</text>
  <text x="813.4" y="39" class="grid-label">3</text><text x="813.4" y="806" class="grid-label">3</text>
  <text x="954.0" y="39" class="grid-label">2</text><text x="954.0" y="806" class="grid-label">2</text>
  <text x="1094.6" y="39" class="grid-label">1</text><text x="1094.6" y="806" class="grid-label">1</text>

  <!-- Cuadrícula Lateral (Filas A a F) -->
  <line x1="55" y1="45" x2="55" y2="797" class="cad-thin"/>
  <line x1="1150" y1="45" x2="1150" y2="797" class="cad-thin"/>

  <line x1="40" y1="170.3" x2="55" y2="170.3" class="cad-thin"/><line x1="1150" y1="170.3" x2="1165" y2="170.3" class="cad-thin"/>
  <line x1="40" y1="295.6" x2="55" y2="295.6" class="cad-thin"/><line x1="1150" y1="295.6" x2="1165" y2="295.6" class="cad-thin"/>
  <line x1="40" y1="421.0" x2="55" y2="421.0" class="cad-thin"/><line x1="1150" y1="421.0" x2="1165" y2="421.0" class="cad-thin"/>
  <line x1="40" y1="546.3" x2="55" y2="546.3" class="cad-thin"/><line x1="1150" y1="546.3" x2="1165" y2="546.3" class="cad-thin"/>
  <line x1="40" y1="671.6" x2="55" y2="671.6" class="cad-thin"/><line x1="1150" y1="671.6" x2="1165" y2="671.6" class="cad-thin"/>

  <text x="47.5" y="107.6" class="grid-label">A</text><text x="1157.5" y="107.6" class="grid-label">A</text>
  <text x="47.5" y="233.0" class="grid-label">B</text><text x="1157.5" y="233.0" class="grid-label">B</text>
  <text x="47.5" y="358.3" class="grid-label">C</text><text x="1157.5" y="358.3" class="grid-label">C</text>
  <text x="47.5" y="483.6" class="grid-label">D</text><text x="1157.5" y="483.6" class="grid-label">D</text>
  <text x="47.5" y="609.0" class="grid-label">E</text><text x="1157.5" y="609.0" class="grid-label">E</text>
  <text x="47.5" y="734.3" class="grid-label">F</text><text x="1157.5" y="734.3" class="grid-label">F</text>

  <!-- ========================================================================= -->
  <!-- CAJETÍN AMPLIADO DE INGENIERÍA AXON (X: 280..1150, Y: 705..795, Alto: 90) -->
  <!-- ========================================================================= -->
  <g id="cajetin_axon">
    <!-- Contenedor general -->
    <rect x="280" y="705" width="870" height="90" fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/>

    <!-- Divisiones Verticales -->
    <line x1="380" y1="705" x2="380" y2="795" class="cad-thin"/>
    <line x1="450" y1="705" x2="450" y2="795" class="cad-thin"/>
    <line x1="535" y1="705" x2="535" y2="795" class="cad-thin"/>
    <line x1="880" y1="705" x2="880" y2="795" class="cad-thin"/>
    <line x1="1025" y1="705" x2="1025" y2="795" class="cad-thin"/>

    <!-- Divisiones Horizontales -->
    <line x1="280" y1="727" x2="535" y2="727" class="cad-thin"/>
    <line x1="280" y1="750" x2="535" y2="750" class="cad-thin"/>
    <line x1="280" y1="772" x2="535" y2="772" class="cad-thin"/>

    <line x1="535" y1="732" x2="880" y2="732" class="cad-thin"/>
    
    <line x1="880" y1="735" x2="1025" y2="735" class="cad-thin"/>
    <line x1="880" y1="765" x2="1025" y2="765" class="cad-thin"/>
    
    <line x1="1025" y1="755" x2="1150" y2="755" class="cad-thin"/>

    <!-- 1. Bloque de Firmas y Responsables -->
    <text x="285" y="720" class="title-label">DIBUJADO</text>
    <text x="385" y="720" class="title-value">AXON ING.</text>
    <text x="455" y="720" class="title-value">2026-10-16</text>

    <text x="285" y="743" class="title-label">REVISADO</text>
    <text x="385" y="743" class="title-value">EPINO</text>
    <text x="455" y="743" class="title-value">2026-10-16</text>

    <text x="285" y="765" class="title-label">APROBADO</text>
    <text x="385" y="765" class="title-value">GARDEN HOUSE</text>
    <text x="455" y="765" class="title-value">2026-10-16</text>

    <text x="285" y="788" class="title-label">ESTÁNDAR</text>
    <text x="385" y="788" class="title-value">IEC 60617</text>
    <text x="455" y="788" class="title-value">REV. 0</text>

    <!-- 2. Bloque de Cliente y Título del Proyecto (Amplio y Despejado) -->
    <text x="545" y="722" class="title-label">CLIENTE:</text>
    <text x="610" y="723" class="title-value" font-size="14" fill="#0f172a">GARDEN HOUSE S.A.</text>

    <text x="545" y="750" class="title-main" font-size="17">4710 - CONTROL SEMÁFORO DE AGUA</text>
    <text x="545" y="776" class="title-value" font-size="13" fill="#0284c7">{titulo_lamina}</text>

    <!-- 3. Bloque de Identificación Técnica -->
    <text x="888" y="723" class="title-label">CÓDIGO:</text>
    <text x="945" y="725" class="title-value" font-size="13" fill="#dc2626">DE-4710</text>

    <text x="888" y="753" class="title-label">DISCIPLINA:</text>
    <text x="955" y="754" class="title-value" font-size="12">{disciplina}</text>

    <text x="888" y="783" class="title-label">PLANO N°:</text>
    <text x="948" y="784" class="title-value" font-size="12">4710-E-0{num_hoja}</text>

    <!-- 4. Bloque de Lámina y Estado -->
    <text x="1035" y="725" class="title-label">LÁMINA / HOJA</text>
    <text x="1088" y="746" class="title-value" font-size="20" fill="#0284c7" text-anchor="middle">{num_hoja:02d} / {total_hojas:02d}</text>

    <text x="1035" y="770" class="title-label">ESTADO</text>
    <text x="1088" y="786" class="title-value" font-size="13" fill="#16a34a" text-anchor="middle">AS-BUILT</text>
  </g>
"""

def generar_hoja_01():
    """Lámina 01: Fuerza 220VAC / 24VDC con espaciado amplio y sin colisiones."""
    cajetin = marco_cajetin_svg(1, 4, "DIAGRAMA DE FUERZA GENERAL 220VAC / 24VDC", "Fuerza")
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1191 842" width="1191" height="842" style="background:#ffffff;" id="svg_sheet_1">
  <defs>
    <style>
      .cad-border {{ stroke: #0f172a; stroke-width: 1.5; fill: none; }}
      .cad-thin {{ stroke: #334155; stroke-width: 0.8; fill: none; }}
      .grid-label {{ font-family: 'Segoe UI', Arial, sans-serif; font-size: 13px; font-weight: bold; fill: #0f172a; text-anchor: middle; dominant-baseline: middle; }}
      .title-label {{ font-size: 10px; fill: #475569; font-weight: 700; text-transform: uppercase; }}
      .title-value {{ font-size: 12px; fill: #0f172a; font-weight: bold; }}
      .title-main {{ font-family: 'Segoe UI', Arial, sans-serif; font-size: 16px; fill: #0284c7; font-weight: 800; letter-spacing: 0.5px; }}

      .wire-phase {{ stroke: #78350f; stroke-width: 2.2; fill: none; }}
      .wire-neutral {{ stroke: #0284c7; stroke-width: 2.2; fill: none; }}
      .wire-24v {{ stroke: #dc2626; stroke-width: 2.2; fill: none; }}
      .wire-0v {{ stroke: #0284c7; stroke-width: 2.2; fill: none; }}
      .dot {{ fill: #0f172a; }}
      .comp-box {{ fill: #f8fafc; stroke: #0f172a; stroke-width: 2; }}
      .tag {{ font-family: 'Segoe UI', Arial, sans-serif; font-size: 13px; font-weight: bold; fill: #0f172a; }}
      .subtag {{ font-family: 'Segoe UI', Arial, sans-serif; font-size: 11px; fill: #475569; }}
      .wire-tag {{ font-family: monospace; font-size: 11px; font-weight: bold; fill: #dc2626; }}
      .draggable-text {{ cursor: move; user-select: none; }}
      .draggable-text:hover {{ fill: #0284c7; }}
    </style>
  </defs>

  {cajetin}

  <!-- Título de Sección -->
  <g id="layer_titles">
    <text x="100" y="80" class="tag draggable-text" font-size="16" fill="#0284c7">CIRCUITO DE FUERZA Y ALIMENTACIÓN GENERAL (220VAC / 24VDC)</text>
    <text x="100" y="100" class="subtag draggable-text">PROTECCIÓN GENERAL CON DIFERENCIAL Y FUENTE SWITCHING PARA CONTROL</text>
  </g>

  <!-- ========================================================================= -->
  <!-- ESQUEMA ELÉCTRICO DE FUERZA (Líneas amplias y despejadas)                -->
  <!-- ========================================================================= -->
  <g id="circuito_fuerza">
    <!-- Entrada de Red 220VAC: L en X=300, N en X=440 -->
    <polygon points="300,120 294,135 306,135" fill="#78350f"/>
    <text x="300" y="112" class="tag draggable-text" text-anchor="middle" fill="#78350f">L</text>
    <text x="245" y="132" class="subtag draggable-text">220VAC 50Hz</text>

    <polygon points="440,120 434,135 446,135" fill="#0284c7"/>
    <text x="440" y="112" class="tag draggable-text" text-anchor="middle" fill="#0284c7">N</text>
    <text x="465" y="132" class="subtag draggable-text">NEUTRO</text>

    <!-- Líneas de Alimentación Principal -->
    <line x1="300" y1="135" x2="300" y2="280" class="wire-phase"/>
    <line x1="440" y1="135" x2="440" y2="280" class="wire-neutral"/>

    <!-- Rama Señalización Presencia de Red: F0 y P0 -->
    <circle cx="300" cy="180" r="3.5" class="dot"/>
    <line x1="300" y1="180" x2="580" y2="180" class="wire-phase"/>
    
    <!-- Fusible F0 -->
    <rect x="580" y="172" width="40" height="16" class="comp-box"/>
    <line x1="580" y1="180" x2="620" y2="180" class="wire-phase"/>
    <text x="600" y="162" class="tag draggable-text" text-anchor="middle">-F0</text>
    <text x="600" y="204" class="subtag draggable-text" text-anchor="middle">2A (10x38)</text>

    <line x1="620" y1="180" x2="720" y2="180" class="wire-phase"/>

    <!-- Luz Piloto P0 -->
    <circle cx="740" cy="180" r="18" class="comp-box"/>
    <line x1="727" y1="167" x2="753" y2="193" stroke="#0f172a" stroke-width="2"/>
    <line x1="753" y1="167" x2="727" y2="193" stroke="#0f172a" stroke-width="2"/>
    <text x="740" y="154" class="tag draggable-text" text-anchor="middle">-P0</text>
    <text x="770" y="184" class="subtag draggable-text">BLANCA (PRESENCIA RED)</text>

    <!-- Retorno de P0 a Neutro -->
    <line x1="758" y1="180" x2="800" y2="180" class="wire-neutral"/>
    <line x1="800" y1="180" x2="800" y2="220" class="wire-neutral"/>
    <line x1="800" y1="220" x2="440" y2="220" class="wire-neutral"/>
    <circle cx="440" cy="220" r="3.5" class="dot"/>

    <!-- Disyuntor Bipolar Diferencial Q0 -->
    <g id="disyuntor_Q0">
      <!-- Contacto Fase L -->
      <line x1="300" y1="280" x2="312" y2="315" class="wire-phase" stroke-width="2.5"/>
      <circle cx="300" cy="280" r="3" fill="#0f172a"/>
      <circle cx="300" cy="325" r="3" fill="#0f172a"/>
      <line x1="300" y1="325" x2="300" y2="385" class="wire-phase"/>

      <!-- Contacto Neutro N -->
      <line x1="440" y1="280" x2="452" y2="315" class="wire-neutral" stroke-width="2.5"/>
      <circle cx="440" cy="280" r="3" fill="#0f172a"/>
      <circle cx="440" cy="325" r="3" fill="#0f172a"/>
      <line x1="440" y1="325" x2="440" y2="385" class="wire-neutral"/>

      <!-- Mando y Disparo Diferencial -->
      <line x1="280" y1="300" x2="460" y2="300" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="3,2"/>
      <ellipse cx="370" cy="300" rx="18" ry="34" stroke="#0f172a" stroke-width="1.8" fill="none"/>
      
      <!-- Rótulos de Q0 a la izquierda con amplio espacio -->
      <rect x="220" y="288" width="24" height="24" class="comp-box"/>
      <text x="232" y="305" class="tag" text-anchor="middle" font-size="11">I</text>
      <line x1="244" y1="300" x2="280" y2="300" stroke="#0f172a" stroke-width="1.5" stroke-dasharray="2,2"/>
      
      <text x="140" y="295" class="tag draggable-text" font-size="15">-Q0</text>
      <text x="140" y="312" class="subtag draggable-text">DISYUNTOR CON DIFERENCIAL</text>
      <text x="140" y="326" class="subtag draggable-text">2P 10A / 30mA (IΔn)</text>
    </g>

    <!-- Regleta de Bornas (X0) -->
    <g id="bornera_X0">
      <line x1="250" y1="385" x2="490" y2="385" stroke="#94a3b8" stroke-width="1.2" stroke-dasharray="4,4"/>
      <text x="210" y="389" class="tag draggable-text" font-size="14" fill="#dc2626">(X0)</text>

      <circle cx="300" cy="385" r="10" class="comp-box"/>
      <text x="300" y="389" class="subtag" text-anchor="middle" font-weight="bold">1</text>
      <text x="270" y="410" class="wire-tag draggable-text">L1</text>

      <circle cx="440" cy="385" r="10" class="comp-box"/>
      <text x="440" y="389" class="subtag" text-anchor="middle" font-weight="bold">2</text>
      <text x="455" y="410" class="wire-tag draggable-text">N1</text>
    </g>

    <!-- Conexión hacia Fuente de Poder PS0 -->
    <line x1="300" y1="395" x2="300" y2="460" class="wire-phase"/>
    <line x1="440" y1="395" x2="440" y2="460" class="wire-neutral"/>

    <!-- ===================================================================== -->
    <!-- FUENTE DE PODER PS0 (Caja amplia y despejada)                         -->
    <!-- ===================================================================== -->
    <g id="fuente_PS0">
      <rect x="240" y="460" width="260" height="135" rx="5" class="comp-box"/>
      
      <!-- Banner superior de identificación -->
      <rect x="240" y="460" width="260" height="28" fill="#e2e8f0" stroke="#0f172a" stroke-width="1.5" rx="4"/>
      <text x="370" y="479" class="tag draggable-text" text-anchor="middle" font-size="12">-PS0 : FUENTE 24VDC 5A (MEAN WELL)</text>
      
      <!-- Diagonal simbólica AC/DC -->
      <line x1="240" y1="488" x2="500" y2="595" stroke="#cbd5e1" stroke-width="1.5"/>
      <text x="300" y="525" class="tag draggable-text" font-size="18">~</text>
      <text x="430" y="565" class="tag draggable-text" font-size="18">=</text>

      <!-- Bornas de Entrada AC -->
      <circle cx="300" cy="488" r="3.5" class="dot"/>
      <text x="300" y="504" class="subtag draggable-text" text-anchor="middle">L</text>

      <circle cx="440" cy="488" r="3.5" class="dot"/>
      <text x="440" y="504" class="subtag draggable-text" text-anchor="middle">N</text>

      <!-- Bornas de Salida DC separadas a X=280 y X=460 -->
      <circle cx="280" cy="595" r="4" fill="#dc2626"/>
      <text x="280" y="585" class="subtag draggable-text" text-anchor="middle" font-weight="bold" fill="#dc2626">+</text>

      <circle cx="460" cy="595" r="4" fill="#0284c7"/>
      <text x="460" y="585" class="subtag draggable-text" text-anchor="middle" font-weight="bold" fill="#0284c7">-</text>
    </g>

    <!-- Salidas DC +24V (X=280) y -0V (X=460) Ampliamente Separadas -->
    <line x1="280" y1="595" x2="280" y2="650" class="wire-24v"/>
    <line x1="460" y1="595" x2="460" y2="650" class="wire-0v"/>

    <!-- Flecha +24VDC y Textos perfectamente alineados -->
    <polygon points="280,655 274,640 286,640" fill="#dc2626"/>
    <text x="280" y="675" class="tag draggable-text" font-size="15" text-anchor="middle" fill="#dc2626">+24V</text>
    <text x="280" y="692" class="subtag draggable-text" text-anchor="middle" font-weight="bold">ALIMENTACIÓN CONTROL</text>
    <text x="280" y="706" class="wire-tag draggable-text" text-anchor="middle">HACIA /02.8, /03.8, /04.8</text>

    <!-- Flecha -0VDC y Textos perfectamente alineados -->
    <polygon points="460,655 454,640 466,640" fill="#0284c7"/>
    <text x="460" y="675" class="tag draggable-text" font-size="15" text-anchor="middle" fill="#0284c7">-0V</text>
    <text x="460" y="692" class="subtag draggable-text" text-anchor="middle" font-weight="bold">REFERENCIA 0VDC</text>
    <text x="460" y="706" class="wire-tag draggable-text" text-anchor="middle" fill="#0284c7">HACIA /02.8, /03.8, /04.8</text>
  </g>
</svg>"""
    return svg

def generar_hoja_02():
    """Lámina 02: Entradas PLC Siemens LOGO! con espaciado amplio."""
    cajetin = marco_cajetin_svg(2, 4, "ENTRADAS DIGITALES PLC SIEMENS LOGO!", "PLC & I/O")
    
    xs = [240, 360, 500, 630, 760]
    cables = ["101", "102", "103", "104", "105"]
    inputs = ["I1", "I2", "I3", "I4", "I5"]
    nombres_func = [
        "AGUA APROBADA (S1)",
        "AGUA RECHAZADA (S2)",
        "DESHABILITAR (S3)",
        "PULSADOR 4 (S4)",
        "PULSADOR 5 (S5)"
    ]
    
    pulsadores_svg = ""
    for i in range(5):
        x = xs[i]
        c = cables[i]
        func = nombres_func[i]
        
        pulsadores_svg += f"""
      <!-- Pulsador S{i+1} en X={x} -->
      <circle cx="{x}" cy="130" r="3.5" class="dot" fill="#dc2626"/>
      <line x1="{x}" y1="130" x2="{x}" y2="190" class="wire-24v"/>
      
      <!-- Borna de repartidor X+ -->
      <circle cx="{x}" cy="190" r="5" class="comp-box"/>
      <line x1="{x}" y1="195" x2="{x}" y2="240" class="wire-ctrl"/>

      <!-- Contacto NA S{i+1} -->
      <circle cx="{x}" cy="240" r="3" fill="#0f172a"/>
      <line x1="{x}" y1="240" x2="{x+14}" y2="280" class="wire-ctrl" stroke-width="2.5"/>
      <circle cx="{x}" cy="290" r="3" fill="#0f172a"/>
      <!-- Símbolo caperuza pulsador -->
      <line x1="{x+7}" y1="260" x2="{x+25}" y2="260" stroke="#0f172a" stroke-width="1.5" stroke-dasharray="2,2"/>
      <line x1="{x+25}" y1="252" x2="{x+25}" y2="268" stroke="#0f172a" stroke-width="2"/>
      
      <text x="{x-10}" y="265" class="tag draggable-text" text-anchor="end">-S{i+1}</text>
      <text x="{x+28}" y="265" class="subtag draggable-text" font-size="9.5">{func}</text>

      <line x1="{x}" y1="290" x2="{x}" y2="370" class="wire-ctrl"/>

      <!-- Borna de campo X9 -->
      <circle cx="{x}" cy="370" r="9" class="comp-box"/>
      <text x="{x}" y="374" class="subtag" text-anchor="middle" font-weight="bold">{i+1}</text>
      <text x="{x+14}" y="355" class="wire-tag draggable-text">{c}</text>

      <line x1="{x}" y1="379" x2="{x}" y2="490" class="wire-ctrl"/>
      <circle cx="{x}" cy="490" r="3.5" fill="#0f172a"/>
"""

    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1191 842" width="1191" height="842" style="background:#ffffff;" id="svg_sheet_2">
  <defs>
    <style>
      .cad-border {{ stroke: #0f172a; stroke-width: 1.5; fill: none; }}
      .cad-thin {{ stroke: #334155; stroke-width: 0.8; fill: none; }}
      .grid-label {{ font-family: 'Segoe UI', Arial, sans-serif; font-size: 13px; font-weight: bold; fill: #0f172a; text-anchor: middle; dominant-baseline: middle; }}
      .title-label {{ font-size: 10px; fill: #475569; font-weight: 700; text-transform: uppercase; }}
      .title-value {{ font-size: 12px; fill: #0f172a; font-weight: bold; }}
      .title-main {{ font-family: 'Segoe UI', Arial, sans-serif; font-size: 16px; fill: #0284c7; font-weight: 800; letter-spacing: 0.5px; }}

      .wire-ctrl {{ stroke: #0f172a; stroke-width: 1.8; fill: none; }}
      .wire-24v {{ stroke: #dc2626; stroke-width: 2.2; fill: none; }}
      .wire-0v {{ stroke: #0284c7; stroke-width: 2.2; fill: none; }}
      .dot {{ fill: #0f172a; }}
      .comp-box {{ fill: #f8fafc; stroke: #0f172a; stroke-width: 2; }}
      .tag {{ font-family: 'Segoe UI', Arial, sans-serif; font-size: 13px; font-weight: bold; fill: #0f172a; }}
      .subtag {{ font-family: 'Segoe UI', Arial, sans-serif; font-size: 11px; fill: #475569; }}
      .wire-tag {{ font-family: monospace; font-size: 11px; font-weight: bold; fill: #dc2626; }}
      .draggable-text {{ cursor: move; user-select: none; }}
      .draggable-text:hover {{ fill: #0284c7; }}
    </style>
  </defs>

  {cajetin}

  <g id="layer_titles">
    <text x="100" y="80" class="tag draggable-text" font-size="16" fill="#0284c7">ENTRADAS DIGITALES - CONTROL SEMÁFOROS</text>
    <text x="100" y="100" class="subtag draggable-text">PLC SIEMENS LOGO! 24CE (8 ENTRADAS DIGITALES 24VDC) | PUESTOS DE BOTONERA PA1 Y PA2</text>
  </g>

  <g id="entradas_plc">
    <!-- Bus Superior +24VDC -->
    <line x1="80" y1="130" x2="860" y2="130" class="wire-24v"/>
    <polygon points="80,125 65,130 80,135" fill="#dc2626"/>
    <text x="90" y="122" class="tag draggable-text" fill="#dc2626">+24V</text>
    <text x="90" y="145" class="subtag draggable-text">DESDE /01.8</text>

    <!-- Regleta Repartidora Positiva (X+) -->
    <line x1="180" y1="190" x2="800" y2="190" stroke="#94a3b8" stroke-width="1.2" stroke-dasharray="4,4"/>
    <text x="135" y="194" class="tag draggable-text" fill="#dc2626">(X+)</text>
    <text x="135" y="208" class="subtag draggable-text">REPARTIDOR +24V</text>

    <!-- Recuadros de Puestos de Mando PA1 y PA2 -->
    <rect x="200" y="225" width="220" height="95" rx="4" fill="none" stroke="#0284c7" stroke-width="1.5" stroke-dasharray="5,3"/>
    <text x="210" y="240" class="tag draggable-text" fill="#0284c7">PA1 (PUESTO 1 - PRODUCCIÓN)</text>

    <rect x="460" y="225" width="360" height="95" rx="4" fill="none" stroke="#0284c7" stroke-width="1.5" stroke-dasharray="5,3"/>
    <text x="470" y="240" class="tag draggable-text" fill="#0284c7">PA2 (PUESTO 2 - SUPERVISIÓN)</text>

    <!-- Regleta de Bornas de Campo (X9) -->
    <line x1="180" y1="370" x2="800" y2="370" stroke="#94a3b8" stroke-width="1.2" stroke-dasharray="4,4"/>
    <text x="135" y="374" class="tag draggable-text" fill="#dc2626">(X9)</text>
    <text x="135" y="388" class="subtag draggable-text">BORNERA DE CAMPO</text>

    {pulsadores_svg}

    <!-- Alimentación de la CPU LOGO! -->
    <!-- L+ a +24V (X=110) -->
    <circle cx="110" cy="130" r="3.5" class="dot" fill="#dc2626"/>
    <line x1="110" y1="130" x2="110" y2="490" class="wire-24v"/>
    
    <!-- M a -0V (X=150) -->
    <line x1="150" y1="430" x2="150" y2="490" class="wire-0v"/>
    <polygon points="150,430 144,445 156,445" fill="#0284c7"/>
    <text x="150" y="420" class="tag draggable-text" text-anchor="middle" fill="#0284c7">-0V</text>
    <text x="150" y="405" class="subtag draggable-text" text-anchor="middle">DESDE /01.8</text>

    <!-- Bloque Físico de CPU Siemens LOGO! -->
    <g id="cpu_logo_entradas">
      <rect x="80" y="490" width="800" height="170" rx="4" class="comp-box"/>
      <rect x="80" y="490" width="800" height="35" fill="#1e293b"/>
      <text x="480" y="513" class="tag draggable-text" fill="#f8fafc" font-size="14" text-anchor="middle">CPU SIEMENS LOGO! 24CE (6ED1052-1CC08-0BA1)</text>

      <!-- Bornas L+, M -->
      <rect x="95" y="525" width="30" height="30" class="comp-box"/><text x="110" y="545" class="tag" text-anchor="middle" font-size="11" fill="#dc2626">L+</text>
      <rect x="135" y="525" width="30" height="30" class="comp-box"/><text x="150" y="545" class="tag" text-anchor="middle" font-size="11" fill="#0284c7">M</text>

      <!-- Bornas I1 a I5 -->
      <rect x="225" y="525" width="30" height="30" class="comp-box"/><text x="240" y="545" class="tag" text-anchor="middle">I1</text>
      <rect x="345" y="525" width="30" height="30" class="comp-box"/><text x="360" y="545" class="tag" text-anchor="middle">I2</text>
      <rect x="485" y="525" width="30" height="30" class="comp-box"/><text x="500" y="545" class="tag" text-anchor="middle">I3</text>
      <rect x="615" y="525" width="30" height="30" class="comp-box"/><text x="630" y="545" class="tag" text-anchor="middle">I4</text>
      <rect x="745" y="525" width="30" height="30" class="comp-box"/><text x="760" y="545" class="tag" text-anchor="middle">I5</text>

      <!-- Reservas I6, I7, I8 -->
      <rect x="790" y="525" width="25" height="30" class="comp-box" opacity="0.6"/><text x="802" y="545" class="subtag" text-anchor="middle">I6</text>
      <rect x="820" y="525" width="25" height="30" class="comp-box" opacity="0.6"/><text x="832" y="545" class="subtag" text-anchor="middle">I7</text>
      <rect x="850" y="525" width="25" height="30" class="comp-box" opacity="0.6"/><text x="862" y="545" class="subtag" text-anchor="middle">I8</text>

      <!-- Pantalla Display LOGO! -->
      <rect x="250" y="575" width="400" height="65" rx="3" fill="#0f172a"/>
      <text x="450" y="605" class="subtag draggable-text" fill="#22c55e" font-size="13" text-anchor="middle">RUN - LOGO! 24CE (SEMAFOROS AGUA)</text>
      <text x="450" y="625" class="subtag draggable-text" fill="#94a3b8" font-size="11" text-anchor="middle">I1: APROBADA | I2: RECHAZADA | I3: DESHABILITAR</text>
    </g>
  </g>
</svg>"""
    return svg

def generar_hoja_03():
    """Lámina 03: Salidas PLC Siemens LOGO! con espaciado amplio."""
    cajetin = marco_cajetin_svg(3, 4, "SALIDAS DIGITALES A RELE PLC SIEMENS LOGO!", "PLC & I/O")
    
    xs = [240, 430, 620, 810]
    cables = ["201", "202", "203", "204"]
    reles = ["R1", "R2", "R3", "R4"]
    desc_reles = [
        "RELE 1: CONTROL SEMAFORO (VERDE / ROJO)",
        "RELE 2: CONTROL LUZ AUXILIAR 1 (P5)",
        "RELE 3: CONTROL LUZ AUXILIAR 2 (P6)",
        "RELE 4: CONTROL LUZ AUXILIAR 3 (P7)"
    ]

    salidas_svg = ""
    for i in range(4):
        x = xs[i]
        c = cables[i]
        r = reles[i]
        d = desc_reles[i]
        
        x_out = x - 30
        x_com = x + 30
        
        salidas_svg += f"""
      <!-- Salida Q{i+1} del LOGO! -->
      <!-- Común Q{i+1}.2 a bus +24V en Y=320 -->
      <circle cx="{x_com}" cy="320" r="3.5" class="dot" fill="#dc2626"/>
      <line x1="{x_com}" y1="320" x2="{x_com}" y2="235" class="wire-24v"/>

      <!-- Contacto interno a relé -->
      <line x1="{x_com}" y1="230" x2="{x_out+12}" y2="195" class="wire-ctrl" stroke-width="2.2"/>
      <circle cx="{x_com}" cy="230" r="3" fill="#0f172a"/>
      <circle cx="{x_out}" cy="190" r="3" fill="#0f172a"/>

      <!-- Salida Q{i+1}.1 hacia bobina de relé -->
      <line x1="{x_out}" y1="190" x2="{x_out}" y2="430" class="wire-ctrl"/>
      <text x="{x_out-10}" y="360" class="wire-tag draggable-text" text-anchor="end">{c}</text>

      <!-- Bobina Relé {r} (A1-A2) -->
      <rect x="{x_out-25}" y="430" width="50" height="55" rx="3" class="comp-box"/>
      <line x1="{x_out-25}" y1="457" x2="{x_out+25}" y2="457" stroke="#cbd5e1" stroke-width="1"/>
      <text x="{x_out}" y="450" class="tag draggable-text" text-anchor="middle" font-size="12">-{r}</text>
      <text x="{x_out-30}" y="438" class="subtag">A1</text>
      <text x="{x_out-30}" y="482" class="subtag">A2</text>
      <text x="{x_out}" y="475" class="subtag draggable-text" font-size="10" fill="#0284c7" text-anchor="middle">24VDC</text>

      <text x="{x_out}" y="505" class="subtag draggable-text" font-size="10" text-anchor="middle" font-weight="bold">{d}</text>
      <text x="{x_out}" y="522" class="wire-tag draggable-text" text-anchor="middle" fill="#0284c7">CONTACTOS EN LÁMINA /04</text>

      <!-- Retorno A2 a Bus -0V en Y=600 -->
      <line x1="{x_out}" y1="485" x2="{x_out}" y2="600" class="wire-0v"/>
      <circle cx="{x_out}" cy="600" r="3.5" class="dot" fill="#0284c7"/>
"""

    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1191 842" width="1191" height="842" style="background:#ffffff;" id="svg_sheet_3">
  <defs>
    <style>
      .cad-border {{ stroke: #0f172a; stroke-width: 1.5; fill: none; }}
      .cad-thin {{ stroke: #334155; stroke-width: 0.8; fill: none; }}
      .grid-label {{ font-family: 'Segoe UI', Arial, sans-serif; font-size: 13px; font-weight: bold; fill: #0f172a; text-anchor: middle; dominant-baseline: middle; }}
      .title-label {{ font-size: 10px; fill: #475569; font-weight: 700; text-transform: uppercase; }}
      .title-value {{ font-size: 12px; fill: #0f172a; font-weight: bold; }}
      .title-main {{ font-family: 'Segoe UI', Arial, sans-serif; font-size: 16px; fill: #0284c7; font-weight: 800; letter-spacing: 0.5px; }}

      .wire-ctrl {{ stroke: #0f172a; stroke-width: 1.8; fill: none; }}
      .wire-24v {{ stroke: #dc2626; stroke-width: 2.2; fill: none; }}
      .wire-0v {{ stroke: #0284c7; stroke-width: 2.2; fill: none; }}
      .dot {{ fill: #0f172a; }}
      .comp-box {{ fill: #f8fafc; stroke: #0f172a; stroke-width: 2; }}
      .tag {{ font-family: 'Segoe UI', Arial, sans-serif; font-size: 13px; font-weight: bold; fill: #0f172a; }}
      .subtag {{ font-family: 'Segoe UI', Arial, sans-serif; font-size: 11px; fill: #475569; }}
      .wire-tag {{ font-family: monospace; font-size: 11px; font-weight: bold; fill: #dc2626; }}
      .draggable-text {{ cursor: move; user-select: none; }}
      .draggable-text:hover {{ fill: #0284c7; }}
    </style>
  </defs>

  {cajetin}

  <g id="layer_titles">
    <text x="100" y="80" class="tag draggable-text" font-size="16" fill="#0284c7">SALIDAS DIGITALES A RELÉ - ACCIONAMIENTO DE RELÉS INTERMEDIOS</text>
    <text x="100" y="100" class="subtag draggable-text">PLC SIEMENS LOGO! 24RCE / 24CE | BOBINAS DE RELÉS R1..R4 (24VDC)</text>
  </g>

  <g id="salidas_plc">
    <!-- Bloque Físico de Salidas CPU Siemens LOGO! -->
    <g id="cpu_logo_salidas">
      <rect x="150" y="120" width="780" height="110" rx="4" class="comp-box"/>
      <rect x="150" y="120" width="780" height="30" fill="#1e293b"/>
      <text x="540" y="140" class="tag draggable-text" fill="#f8fafc" font-size="13" text-anchor="middle">SALIDAS DIGITALES A RELÉ Q1..Q4 - CPU SIEMENS LOGO!</text>

      <!-- Q1 -->
      <rect x="195" y="165" width="24" height="25" class="comp-box"/><text x="207" y="182" class="subtag" font-size="10" text-anchor="middle">1</text>
      <rect x="255" y="165" width="24" height="25" class="comp-box"/><text x="267" y="182" class="subtag" font-size="10" text-anchor="middle">2</text>
      <text x="237" y="210" class="tag draggable-text" font-size="12" text-anchor="middle">Q1</text>

      <!-- Q2 -->
      <rect x="385" y="165" width="24" height="25" class="comp-box"/><text x="397" y="182" class="subtag" font-size="10" text-anchor="middle">1</text>
      <rect x="445" y="165" width="24" height="25" class="comp-box"/><text x="457" y="182" class="subtag" font-size="10" text-anchor="middle">2</text>
      <text x="427" y="210" class="tag draggable-text" font-size="12" text-anchor="middle">Q2</text>

      <!-- Q3 -->
      <rect x="575" y="165" width="24" height="25" class="comp-box"/><text x="587" y="182" class="subtag" font-size="10" text-anchor="middle">1</text>
      <rect x="635" y="165" width="24" height="25" class="comp-box"/><text x="647" y="182" class="subtag" font-size="10" text-anchor="middle">2</text>
      <text x="617" y="210" class="tag draggable-text" font-size="12" text-anchor="middle">Q3</text>

      <!-- Q4 -->
      <rect x="765" y="165" width="24" height="25" class="comp-box"/><text x="777" y="182" class="subtag" font-size="10" text-anchor="middle">1</text>
      <rect x="825" y="165" width="24" height="25" class="comp-box"/><text x="837" y="182" class="subtag" font-size="10" text-anchor="middle">2</text>
      <text x="807" y="210" class="tag draggable-text" font-size="12" text-anchor="middle">Q4</text>
    </g>

    <!-- Bus +24VDC Común de Contactos en Y=320 -->
    <line x1="80" y1="320" x2="880" y2="320" class="wire-24v"/>
    <polygon points="80,315 65,320 80,325" fill="#dc2626"/>
    <text x="90" y="312" class="tag draggable-text" fill="#dc2626">+24V</text>
    <text x="90" y="335" class="subtag draggable-text">DESDE /01.8</text>

    {salidas_svg}

    <!-- Bus -0VDC de Retorno Bobinas en Y=600 -->
    <line x1="80" y1="600" x2="880" y2="600" class="wire-0v"/>
    <polygon points="80,595 65,600 80,605" fill="#0284c7"/>
    <text x="90" y="592" class="tag draggable-text" fill="#0284c7">-0V</text>
    <text x="90" y="615" class="subtag draggable-text">RETORNO /01.8</text>
    
    <!-- Repartidor de Bornas Negativas (X-) -->
    <text x="900" y="604" class="tag draggable-text" fill="#0284c7">(X-)</text>
    <text x="900" y="618" class="subtag draggable-text">BORNERA REPARTIDORA 0V</text>
  </g>
</svg>"""
    return svg

def generar_hoja_04():
    """Lámina 04: Circuito de Control y Semáforos con separación total."""
    cajetin = marco_cajetin_svg(4, 4, "CIRCUITO DE CONTROL Y MANIOBRA DE SEMÁFOROS", "Control")
    
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1191 842" width="1191" height="842" style="background:#ffffff;" id="svg_sheet_4">
  <defs>
    <style>
      .cad-border {{ stroke: #0f172a; stroke-width: 1.5; fill: none; }}
      .cad-thin {{ stroke: #334155; stroke-width: 0.8; fill: none; }}
      .grid-label {{ font-family: 'Segoe UI', Arial, sans-serif; font-size: 13px; font-weight: bold; fill: #0f172a; text-anchor: middle; dominant-baseline: middle; }}
      .title-label {{ font-size: 10px; fill: #475569; font-weight: 700; text-transform: uppercase; }}
      .title-value {{ font-size: 12px; fill: #0f172a; font-weight: bold; }}
      .title-main {{ font-family: 'Segoe UI', Arial, sans-serif; font-size: 16px; fill: #0284c7; font-weight: 800; letter-spacing: 0.5px; }}

      .wire-ctrl {{ stroke: #0f172a; stroke-width: 1.8; fill: none; }}
      .wire-phase {{ stroke: #78350f; stroke-width: 2.2; fill: none; }}
      .wire-neutral {{ stroke: #0284c7; stroke-width: 2.2; fill: none; }}
      .wire-24v {{ stroke: #dc2626; stroke-width: 2.2; fill: none; }}
      .wire-0v {{ stroke: #0284c7; stroke-width: 2.2; fill: none; }}
      .dot {{ fill: #0f172a; }}
      .comp-box {{ fill: #f8fafc; stroke: #0f172a; stroke-width: 2; }}
      .tag {{ font-family: 'Segoe UI', Arial, sans-serif; font-size: 13px; font-weight: bold; fill: #0f172a; }}
      .subtag {{ font-family: 'Segoe UI', Arial, sans-serif; font-size: 11px; fill: #475569; }}
      .wire-tag {{ font-family: monospace; font-size: 11px; font-weight: bold; fill: #dc2626; }}
      .draggable-text {{ cursor: move; user-select: none; }}
      .draggable-text:hover {{ fill: #0284c7; }}
    </style>
  </defs>

  {cajetin}

  <g id="layer_titles">
    <text x="100" y="80" class="tag draggable-text" font-size="16" fill="#0284c7">CIRCUITO DE MANIOBRA Y SEÑALIZACIÓN - SEMÁFOROS DE PLANTA</text>
    <text x="100" y="100" class="subtag draggable-text">SEMAFORO 1 BICOLOR (AGUA APROBADA / RECHAZADA) Y LUCES DE PROCESO (24VDC / 220VAC)</text>
  </g>

  <!-- ========================================================================= -->
  <!-- SECCIÓN A: CIRCUITO 24VDC (LADO DERECHO DEL BOCETO)                   -->
  <!-- ========================================================================= -->
  <g id="circuito_24vdc">
    <!-- Bus Superior +24VDC -->
    <line x1="420" y1="140" x2="1080" y2="140" class="wire-24v"/>
    <polygon points="420,135 405,140 420,145" fill="#dc2626"/>
    <text x="430" y="132" class="tag draggable-text" fill="#dc2626">+24V</text>
    <text x="430" y="155" class="subtag draggable-text">DESDE /01.8</text>

    <!-- Regleta de Bornas de Campo (X2) en Y=390 -->
    <line x1="440" y1="390" x2="1080" y2="390" stroke="#94a3b8" stroke-width="1.2" stroke-dasharray="4,4"/>
    <text x="390" y="394" class="tag draggable-text" fill="#dc2626">(X2)</text>
    <text x="380" y="410" class="subtag draggable-text">BORNERA SEMÁFOROS</text>

    <!-- Bus Inferior -0VDC en Y=640 -->
    <line x1="420" y1="640" x2="1080" y2="640" class="wire-0v"/>
    <polygon points="420,635 405,640 420,645" fill="#0284c7"/>
    <text x="430" y="632" class="tag draggable-text" fill="#0284c7">-0V</text>
    <text x="430" y="655" class="subtag draggable-text">RETORNO /01.8</text>

    <!-- 1. SEMÁFORO 1: CONMUTADO POR RELÉ R1 (VERDE NC / ROJO NO) -->
    <!-- Común C de R1 en X=520, Y=220 -->
    <circle cx="520" cy="140" r="3.5" class="dot" fill="#dc2626"/>
    <line x1="520" y1="140" x2="520" y2="220" class="wire-24v"/>
    <circle cx="520" cy="220" r="3" fill="#0f172a"/>
    <text x="495" y="224" class="subtag">C</text>
    <text x="475" y="250" class="tag draggable-text" font-size="14">-R1</text>
    <text x="430" y="265" class="subtag draggable-text">BOBINA EN /03.7</text>

    <!-- Contacto NC (X=470) -->
    <circle cx="470" cy="280" r="3" fill="#0f172a"/>
    <text x="450" y="280" class="subtag">NC</text>
    <line x1="520" y1="220" x2="472" y2="277" class="wire-ctrl" stroke-width="2.5"/>

    <!-- Contacto NO (X=570) -->
    <circle cx="570" cy="280" r="3" fill="#0f172a"/>
    <text x="585" y="280" class="subtag">NO</text>
    
    <line x1="470" y1="280" x2="470" y2="390" class="wire-ctrl"/>
    <line x1="570" y1="280" x2="570" y2="390" class="wire-ctrl"/>

    <!-- Borna 1 de X2 (Luz Verde P3) -->
    <circle cx="470" cy="390" r="9" class="comp-box"/>
    <text x="470" y="394" class="subtag" text-anchor="middle" font-weight="bold">1</text>
    <line x1="470" y1="399" x2="470" y2="470" class="wire-ctrl"/>
    
    <!-- Luz Piloto P3 (VERDE - AGUA APROBADA) -->
    <circle cx="470" cy="490" r="18" class="comp-box" fill="#ecfdf5" stroke="#10b981" stroke-width="2.2"/>
    <line x1="457" y1="477" x2="483" y2="503" stroke="#10b981" stroke-width="2"/>
    <line x1="483" y1="477" x2="457" y2="503" stroke="#10b981" stroke-width="2"/>
    <text x="470" y="465" class="tag draggable-text" text-anchor="middle">-P3</text>
    <text x="470" y="525" class="tag draggable-text" font-size="12" fill="#10b981" text-anchor="middle">VERDE (V)</text>
    <text x="470" y="542" class="subtag draggable-text" text-anchor="middle" font-weight="bold">AGUA APROBADA</text>

    <line x1="470" y1="508" x2="470" y2="640" class="wire-0v"/>
    <circle cx="470" cy="640" r="3.5" class="dot" fill="#0284c7"/>

    <!-- Borna 2 de X2 (Luz Roja P4) -->
    <circle cx="570" cy="390" r="9" class="comp-box"/>
    <text x="570" y="394" class="subtag" text-anchor="middle" font-weight="bold">2</text>
    <line x1="570" y1="399" x2="570" y2="470" class="wire-ctrl"/>

    <!-- Luz Piloto P4 (ROJA - AGUA RECHAZADA) -->
    <circle cx="570" cy="490" r="18" class="comp-box" fill="#fef2f2" stroke="#ef4444" stroke-width="2.2"/>
    <line x1="557" y1="477" x2="583" y2="503" stroke="#ef4444" stroke-width="2"/>
    <line x1="583" y1="477" x2="557" y2="503" stroke="#ef4444" stroke-width="2"/>
    <text x="570" y="465" class="tag draggable-text" text-anchor="middle">-P4</text>
    <text x="570" y="525" class="tag draggable-text" font-size="12" fill="#ef4444" text-anchor="middle">ROJO (R)</text>
    <text x="570" y="542" class="subtag draggable-text" text-anchor="middle" font-weight="bold">AGUA RECHAZADA</text>

    <line x1="570" y1="508" x2="570" y2="640" class="wire-0v"/>
    <circle cx="570" cy="640" r="3.5" class="dot" fill="#0284c7"/>

    <!-- Recuadro Semáforo 1 -->
    <rect x="435" y="445" width="170" height="115" rx="4" fill="none" stroke="#64748b" stroke-width="1.2" stroke-dasharray="4,4"/>
    <text x="520" y="438" class="subtag draggable-text" font-weight="bold" text-anchor="middle">SEMÁFORO 1 (24VDC)</text>

    <!-- 2. LUCES ADICIONALES P5, P6, P7 (R2, R3, R4) -->
    <!-- P5 / R2 (X=720) -->
    <circle cx="720" cy="140" r="3.5" class="dot" fill="#dc2626"/>
    <line x1="720" y1="140" x2="720" y2="240" class="wire-24v"/>
    <circle cx="720" cy="240" r="3" fill="#0f172a"/>
    <line x1="720" y1="240" x2="734" y2="280" class="wire-ctrl" stroke-width="2.5"/>
    <circle cx="720" cy="285" r="3" fill="#0f172a"/>
    <text x="700" y="244" class="subtag">C</text>
    <text x="690" y="270" class="tag draggable-text">-R2</text>
    <text x="738" y="280" class="subtag">NO</text>
    
    <line x1="720" y1="285" x2="720" y2="390" class="wire-ctrl"/>
    <circle cx="720" cy="390" r="9" class="comp-box"/><text x="720" y="394" class="subtag" text-anchor="middle" font-weight="bold">3</text>
    <line x1="720" y1="399" x2="720" y2="470" class="wire-ctrl"/>
    
    <circle cx="720" cy="490" r="18" class="comp-box"/>
    <line x1="707" y1="477" x2="733" y2="503" stroke="#0f172a" stroke-width="1.8"/><line x1="733" y1="477" x2="707" y2="503" stroke="#0f172a" stroke-width="1.8"/>
    <text x="720" y="465" class="tag draggable-text" text-anchor="middle">-P5</text>
    <text x="720" y="525" class="subtag draggable-text" text-anchor="middle" font-weight="bold">LUZ PROCESO 1</text>
    
    <line x1="720" y1="508" x2="720" y2="640" class="wire-0v"/><circle cx="720" cy="640" r="3.5" class="dot" fill="#0284c7"/>

    <!-- P6 / R3 (X=860) -->
    <circle cx="860" cy="140" r="3.5" class="dot" fill="#dc2626"/>
    <line x1="860" y1="140" x2="860" y2="240" class="wire-24v"/>
    <circle cx="860" cy="240" r="3" fill="#0f172a"/>
    <line x1="860" y1="240" x2="874" y2="280" class="wire-ctrl" stroke-width="2.5"/>
    <circle cx="860" cy="285" r="3" fill="#0f172a"/>
    <text x="840" y="244" class="subtag">C</text>
    <text x="830" y="270" class="tag draggable-text">-R3</text>
    <text x="878" y="280" class="subtag">NO</text>
    
    <line x1="860" y1="285" x2="860" y2="390" class="wire-ctrl"/>
    <circle cx="860" cy="390" r="9" class="comp-box"/><text x="860" y="394" class="subtag" text-anchor="middle" font-weight="bold">4</text>
    <line x1="860" y1="399" x2="860" y2="470" class="wire-ctrl"/>
    
    <circle cx="860" cy="490" r="18" class="comp-box"/>
    <line x1="847" y1="477" x2="873" y2="503" stroke="#0f172a" stroke-width="1.8"/><line x1="873" y1="477" x2="847" y2="503" stroke="#0f172a" stroke-width="1.8"/>
    <text x="860" y="465" class="tag draggable-text" text-anchor="middle">-P6</text>
    <text x="860" y="525" class="subtag draggable-text" text-anchor="middle" font-weight="bold">LUZ PROCESO 2</text>
    
    <line x1="860" y1="508" x2="860" y2="640" class="wire-0v"/><circle cx="860" cy="640" r="3.5" class="dot" fill="#0284c7"/>

    <!-- P7 / R4 (X=1000) -->
    <circle cx="1000" cy="140" r="3.5" class="dot" fill="#dc2626"/>
    <line x1="1000" y1="140" x2="1000" y2="240" class="wire-24v"/>
    <circle cx="1000" cy="240" r="3" fill="#0f172a"/>
    <line x1="1000" y1="240" x2="1014" y2="280" class="wire-ctrl" stroke-width="2.5"/>
    <circle cx="1000" cy="285" r="3" fill="#0f172a"/>
    <text x="980" y="244" class="subtag">C</text>
    <text x="970" y="270" class="tag draggable-text">-R4</text>
    <text x="1018" y="280" class="subtag">NO</text>
    
    <line x1="1000" y1="285" x2="1000" y2="390" class="wire-ctrl"/>
    <circle cx="1000" cy="390" r="9" class="comp-box"/><text x="1000" y="394" class="subtag" text-anchor="middle" font-weight="bold">5</text>
    <line x1="1000" y1="399" x2="1000" y2="470" class="wire-ctrl"/>
    
    <circle cx="1000" cy="490" r="18" class="comp-box"/>
    <line x1="987" y1="477" x2="1013" y2="503" stroke="#0f172a" stroke-width="1.8"/><line x1="1013" y1="477" x2="987" y2="503" stroke="#0f172a" stroke-width="1.8"/>
    <text x="1000" y="465" class="tag draggable-text" text-anchor="middle">-P7</text>
    <text x="1000" y="525" class="subtag draggable-text" text-anchor="middle" font-weight="bold">LUZ PROCESO 3</text>
    
    <line x1="1000" y1="508" x2="1000" y2="640" class="wire-0v"/><circle cx="1000" cy="640" r="3.5" class="dot" fill="#0284c7"/>
  </g>

  <!-- ========================================================================= -->
  <!-- SECCIÓN B: CIRCUITO AUXILIAR 220VAC (LADO IZQUIERDO DEL BOCETO)       -->
  <!-- ========================================================================= -->
  <g id="circuito_220vac_aux">
    <rect x="75" y="125" width="285" height="550" rx="4" fill="rgba(148,163,184,0.06)" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="4,4"/>
    <text x="217" y="145" class="tag draggable-text" text-anchor="middle" font-size="11" fill="#78350f">OPCIÓN SEMÁFORO 220VAC EXTERIOR</text>

    <!-- Entrada L1 -->
    <polygon points="120,170 105,175 120,180" fill="#78350f"/>
    <text x="130" y="178" class="tag draggable-text" fill="#78350f">L1</text>
    <text x="130" y="194" class="subtag draggable-text">DESDE /01.5</text>
    <line x1="120" y1="175" x2="220" y2="175" class="wire-phase"/>

    <!-- Común C de R1 -->
    <line x1="220" y1="175" x2="220" y2="240" class="wire-phase"/>
    <circle cx="220" cy="240" r="3" fill="#0f172a"/>
    <text x="200" y="244" class="subtag">C</text>
    <text x="160" y="260" class="tag draggable-text">-R1</text>
    <text x="135" y="275" class="subtag draggable-text">2° CONTACTO</text>

    <!-- Contacto NC (X=170) -->
    <circle cx="170" cy="300" r="3" fill="#0f172a"/>
    <text x="150" y="300" class="subtag">NC</text>
    <line x1="220" y1="240" x2="172" y2="297" class="wire-phase" stroke-width="2.5"/>

    <!-- Contacto NO (X=270) -->
    <circle cx="270" cy="300" r="3" fill="#0f172a"/>
    <text x="285" y="300" class="subtag">NO</text>
    <line x1="170" y1="300" x2="170" y2="390" class="wire-phase"/>
    <line x1="270" y1="300" x2="270" y2="390" class="wire-phase"/>

    <!-- Bornera (X1) -->
    <line x1="130" y1="390" x2="310" y2="390" stroke="#94a3b8" stroke-width="1.2" stroke-dasharray="4,4"/>
    <text x="100" y="394" class="tag draggable-text" fill="#dc2626">(X1)</text>

    <circle cx="170" cy="390" r="9" class="comp-box"/><text x="170" y="394" class="subtag" text-anchor="middle" font-weight="bold">1</text>
    <line x1="170" y1="399" x2="170" y2="470" class="wire-phase"/>

    <circle cx="270" cy="390" r="9" class="comp-box"/><text x="270" y="394" class="subtag" text-anchor="middle" font-weight="bold">2</text>
    <line x1="270" y1="399" x2="270" y2="470" class="wire-phase"/>

    <!-- Luz P1 (Verde 220V) -->
    <circle cx="170" cy="490" r="18" class="comp-box" fill="#ecfdf5" stroke="#10b981" stroke-width="2.2"/>
    <line x1="157" y1="477" x2="183" y2="503" stroke="#10b981" stroke-width="2"/><line x1="183" y1="477" x2="157" y2="503" stroke="#10b981" stroke-width="2"/>
    <text x="170" y="465" class="tag draggable-text" text-anchor="middle">-P1</text>
    <text x="170" y="525" class="tag draggable-text" font-size="11" fill="#10b981" text-anchor="middle">VERDE (V)</text>
    <text x="170" y="542" class="subtag draggable-text" text-anchor="middle">220VAC</text>

    <!-- Luz P2 (Roja 220V) -->
    <circle cx="270" cy="490" r="18" class="comp-box" fill="#fef2f2" stroke="#ef4444" stroke-width="2.2"/>
    <line x1="257" y1="477" x2="283" y2="503" stroke="#ef4444" stroke-width="2"/><line x1="283" y1="477" x2="257" y2="503" stroke="#ef4444" stroke-width="2"/>
    <text x="270" y="465" class="tag draggable-text" text-anchor="middle">-P2</text>
    <text x="270" y="525" class="tag draggable-text" font-size="11" fill="#ef4444" text-anchor="middle">ROJO (R)</text>
    <text x="270" y="542" class="subtag draggable-text" text-anchor="middle">220VAC</text>

    <!-- Retorno a N1 en Y=640 -->
    <line x1="170" y1="508" x2="170" y2="640" class="wire-neutral"/>
    <line x1="270" y1="508" x2="270" y2="640" class="wire-neutral"/>
    <line x1="170" y1="640" x2="120" y2="640" class="wire-neutral"/>
    <line x1="170" y1="640" x2="270" y2="640" class="wire-neutral"/>
    <circle cx="170" cy="640" r="3.5" class="dot"/>
    <circle cx="270" cy="640" r="3.5" class="dot"/>
    
    <polygon points="120,635 105,640 120,645" fill="#0284c7"/>
    <text x="130" y="632" class="tag draggable-text" fill="#0284c7">N1</text>
    <text x="130" y="655" class="subtag draggable-text">RETORNO /01.5</text>
  </g>
</svg>"""
    return svg

def ejecutar():
    print("Regenerando las 4 láminas vectoriales con cajetín ampliado...")
    
    hojas = [
        (1, "01", "FUERZA 220V/24V", "Diagrama de Fuerza General 220VAC / 24VDC", "Fuerza", generar_hoja_01()),
        (2, "02", "ENTRADAS PLC", "Entradas Digitales PLC Siemens LOGO!", "PLC & I/O", generar_hoja_02()),
        (3, "03", "SALIDAS PLC", "Salidas Digitales a Relé PLC Siemens LOGO!", "PLC & I/O", generar_hoja_03()),
        (4, "04", "CONTROL SEMAFOROS", "Circuito de Control y Semáforos (24VDC / 220VAC)", "Control", generar_hoja_04())
    ]
    
    hojas_data = []
    
    for num, code, short_t, long_t, disc, svg_content in hojas:
        svg_filename = f"hoja_{code}.svg"
        svg_path = os.path.join(HOJAS_DIR, svg_filename)
        with open(svg_path, "w", encoding="utf-8") as f:
            f.write(svg_content)
            
        doc_svg = pymupdf.open("svg", svg_content.encode("utf-8"))
        page_svg = doc_svg[0]
        pix = page_svg.get_pixmap(dpi=72)
        thumb_filename = f"thumb_{code}.png"
        thumb_path = os.path.join(THUMBS_DIR, thumb_filename)
        pix.save(thumb_path)
        
        hojas_data.append({
            "numero": num,
            "codigo_lamina": code,
            "titulo_corto": short_t,
            "titulo_largo": long_t,
            "disciplina": disc,
            "archivo_svg": f"dependencias/hojas/{svg_filename}",
            "archivo_thumb": f"dependencias/hojas/miniaturas/{thumb_filename}",
            "boceto_original": f"dependencias/bocetos_originales/boceto_{code}.png"
        })
        print(f" -> Lámina {code} regenerada: {short_t}")

    js_path = os.path.join(JS_DIR, "datos_proyecto.js")
    with open(js_path, "w", encoding="utf-8") as f:
        f.write("// Datos Generados del Proyecto DE-4710 - Control Semáforos de Agua\n")
        f.write("const PROYECTO_INFO = {\n")
        f.write("  codigo: 'DE-4710',\n")
        f.write("  nombre: '4710 GARDEN - CONTROL SEMAFORO-AGUA',\n")
        f.write("  cliente: 'GARDEN HOUSE',\n")
        f.write("  total_hojas: 4,\n")
        f.write("  formato: 'A3 Horizontal (420 x 297 mm)',\n")
        f.write("  norma: 'IEC 60617 / EPLAN Style',\n")
        f.write("  version: 'Rev. 0',\n")
        f.write("  fecha: '2026-10-16'\n")
        f.write("};\n\n")
        f.write("const HOJAS_DATA = " + json.dumps(hojas_data, indent=2, ensure_ascii=False) + ";\n")

    # Guardar también el contenido de los SVGs embebidos en JS para poder insertarlos inline en el DOM
    # Esto permite manipular y arrastrar textos con el ratón sin restricciones de CORS ni iframe!
    svgs_js = os.path.join(JS_DIR, "hojas_svg_inline.js")
    with open(svgs_js, "w", encoding="utf-8") as f:
        f.write("// Contenido SVG embebido para manipulación directa del DOM (Drag & Edit)\n")
        f.write("const HOJAS_SVG_CONTENT = {\n")
        for num, code, _, _, _, svg_content in hojas:
            f.write(f"  {num}: " + json.dumps(svg_content, ensure_ascii=False) + ",\n")
        f.write("};\n")

    print(f"Archivos regenerados con éxito.")

if __name__ == "__main__":
    ejecutar()
