"""
Herramienta Offline: Generación y Extracción de Simbología Industrial y BOM
=============================================================================
Extrae los símbolos gráficos desde el plano PDF DE-1708, genera las variantes
vectoriales SVG limpias, guarda el BOM en JSON/CSV y crea la base de datos de
simbología reutilizable.
"""

import os
import json
import csv
import pymupdf

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
PDF_PATH = r"C:\Users\epite\OneDrive - AXON\AXON_PROYECTOS\GARDEN\1708 PICK AND PLACE\CAD\ELECTRICAL\DE-1708-PICK AND PLACE-GARDEN HAUSE.pdf"

def extraer_simbolos_pdf():
    doc = pymupdf.open(PDF_PATH)
    # Page 6 in PDF is SIMBOLOGIA (index 5)
    p6 = doc[5]
    
    simb_dir = os.path.join(BASE_DIR, 'simbologia')
    
    # 15 símbolos de la lámina 6
    simbolos_p6 = [
        # (col, row, categoria, id, nombre, descripcion, tags_default)
        (0, 0, 'fuerza', 'fuente_poder_24v', 'Fuente de Poder 24VDC', 'Fuente switching 24VDC para alimentación de control y sensores', ['PS', '24VDC', 'GND', 'L', 'N']),
        (0, 1, 'fuerza', 'disyuntor_diferencial', 'Disyuntor con Diferencial', 'Interruptor termomagnético bifásico/trifásico con protección diferencial', ['QA1', 'Id', '2P', 'Diferencial']),
        (0, 2, 'control', 'optocupla_bobina', 'Optocupla Bobina', 'Bobina de excitación de optoacoplador o relé de interfaz 24VDC', ['OP', 'A1', 'A2', '24V']),
        (0, 3, 'neumatica', 'bobina_electrovalvula', 'Bobina de Electroválvula', 'Solenoide de accionamiento para válvula neumática', ['V', 'A1', 'A2', 'Solenoide']),
        (0, 4, 'control', 'contacto_no_optocupla', 'Contacto NO de Optocupla', 'Contacto normalmente abierto (13-14) de optoacoplador o relé', ['OP', '13', '14', 'NO']),
        
        (1, 0, 'neumatica', 'valvula_3_2', 'Válvula Neumática 3/2', 'Válvula direccional 3 vías 2 posiciones monoestable', ['V', 'Pneumatic', '3/2']),
        (1, 1, 'neumatica', 'valvula_5_2', 'Válvula Neumática 5/2', 'Válvula direccional 5 vías 2 posiciones biestable/monoestable', ['V', 'Pneumatic', '5/2']),
        (1, 2, 'plc_io', 'in_out_modulo_plc', 'IN/OUT Módulo PLC', 'Punto de conexión de entrada o salida de PLC Siemens con LED', ['DI', 'DQ', 'PLC', 'I/O']),
        (1, 3, 'fuerza', 'motor_trifasico_pe', 'Motor Trifásico con PE', 'Motor eléctrico asíncrono trifásico con conexión de puesta a tierra', ['M', '3~', 'PE', 'U', 'V', 'W']),
        (1, 4, 'bornas_conexiones', 'conector_macho_hembra', 'Conector Macho y Hembra', 'Clavija y base de conexión multiconductor desacoplable', ['X', 'Macho', 'Hembra', 'Harting']),
        
        (2, 0, 'bornas_conexiones', 'referencia_cordon_multipar', 'Referencia a Cordón Multipar', 'Identificador de manguera o cordón multinúcleo apantallado', ['W', 'Cordón', 'Multipar', 'Cable']),
        (2, 1, 'sensores_campo', 'encoder_electrico', 'Encoder Eléctrico', 'Encoder incremental con señales A, B, Z (+, -, 0, 1, 2)', ['ENC', 'Incremental', 'A/B/Z', '24V']),
        (2, 2, 'bornas_conexiones', 'referencia_ida_vuelta_cable', 'Referencia Ida/Vuelta Cable', 'Flecha de salto de señal / potencial hacia otra lámina del plano', ['REF', 'Cruzada', 'Interrupción', 'Potencial']),
        (2, 3, 'bornas_conexiones', 'bornera_paso', 'Bornera de Paso', 'Borne seccionable o de paso montado en riel DIN', ['X', 'Borne', 'Riel DIN']),
        (2, 4, 'accionamientos_vdf', 'variador_frecuencia_vdf', 'Variador de Frecuencia VDF', 'Convertidor de frecuencia para control de velocidad de motores', ['VDF', 'Mitsubishi', 'D700', 'Inverter'])
    ]
    
    col_x = [(135, 245), (445, 555), (755, 865)]
    row_y = [(275, 332), (332, 389), (389, 446), (446, 503), (503, 560)]
    
    db_simbolos = []
    
    print("Extrayendo símbolos gráficos de la Lámina 6...")
    for c_idx, r_idx, cat, s_id, nombre, desc, tags in simbolos_p6:
        x0, x1 = col_x[c_idx]
        y0, y1 = row_y[r_idx]
        rect = pymupdf.Rect(x0, y0, x1, y1)
        
        # Guardar PNG en alta resolución (300 DPI)
        cat_dir = os.path.join(simb_dir, cat)
        os.makedirs(cat_dir, exist_ok=True)
        
        png_name = f"{s_id}.png"
        png_path = os.path.join(cat_dir, png_name)
        pix = p6.get_pixmap(clip=rect, dpi=300)
        pix.save(png_path)
        
        # Generar SVG correspondiente
        svg_name = f"{s_id}.svg"
        svg_path = os.path.join(cat_dir, svg_name)
        svg_code = generar_svg_simbolo(s_id, nombre)
        with open(svg_path, 'w', encoding='utf-8') as f:
            f.write(svg_code)
            
        rel_png = f"simbologia/{cat}/{png_name}"
        rel_svg = f"simbologia/{cat}/{svg_name}"
        
        db_simbolos.append({
            "id": s_id,
            "nombre": nombre,
            "categoria": cat,
            "descripcion": desc,
            "tags": tags,
            "archivo_png": rel_png,
            "archivo_svg": rel_svg,
            "ancho_px": pix.width,
            "alto_px": pix.height
        })
        print(f" -> Guardado símbolo: {nombre} ({cat})")

    # Extraer también Cajetín y Marco estándar (desde hoja 1 o 2)
    p2 = doc[1]
    # Cajetín está en la esquina inferior derecha: x: 740 to 1175, y: 740 to 825
    rect_cajetin = pymupdf.Rect(740, 740, 1175, 825)
    cajetin_png = os.path.join(simb_dir, 'cajetines_marcos', 'cajetin_rotulo_axon.png')
    pix_caj = p2.get_pixmap(clip=rect_cajetin, dpi=300)
    pix_caj.save(cajetin_png)
    
    db_simbolos.append({
        "id": "cajetin_rotulo_axon",
        "nombre": "Cajetín / Rótulo de Proyecto A3",
        "categoria": "cajetines_marcos",
        "descripcion": "Rótulo técnico normalizado con campos de proyecto, cliente, fecha, lámina y aprobación",
        "tags": ["Cajetín", "Rótulo", "A3", "Título", "Norma"],
        "archivo_png": "simbologia/cajetines_marcos/cajetin_rotulo_axon.png",
        "archivo_svg": "simbologia/cajetines_marcos/cajetin_rotulo_axon.svg",
        "ancho_px": pix_caj.width,
        "alto_px": pix_caj.height
    })

    # Guardar base de datos en JSON
    json_path = os.path.join(simb_dir, 'base_datos_simbolos.json')
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(db_simbolos, f, indent=2, ensure_ascii=False)
        
    print(f"Base de datos de símbolos guardada en: {json_path}")
    return db_simbolos

def generar_svg_simbolo(s_id, nombre):
    """Genera código SVG vectorial estándar para el símbolo indicado."""
    svg_header = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120" width="160" height="120" style="background:#ffffff;">\n'
    svg_header += '  <defs>\n    <style>\n'
    svg_header += '      .wire { stroke: #0f172a; stroke-width: 2; fill: none; stroke-linecap: round; }\n'
    svg_header += '      .component { stroke: #0f172a; stroke-width: 2.2; fill: none; }\n'
    svg_header += '      .fill-box { fill: #f8fafc; stroke: #0f172a; stroke-width: 2; }\n'
    svg_header += '      .sym-text { font-family: Arial, sans-serif; font-size: 11px; fill: #1e293b; text-anchor: middle; }\n'
    svg_header += '      .pin-label { font-family: monospace; font-size: 9px; fill: #475569; }\n'
    svg_header += '    </style>\n  </defs>\n'
    
    body = ""
    if s_id == 'fuente_poder_24v':
        body = """
  <!-- Fuente 24VDC -->
  <rect x="25" y="20" width="110" height="80" rx="4" class="fill-box"/>
  <line x1="25" y1="45" x2="135" y2="45" stroke="#cbd5e1" stroke-width="1.5" stroke-dasharray="3,3"/>
  <text x="80" y="38" class="sym-text" font-weight="bold">POWER SUPPLY</text>
  <text x="80" y="70" class="sym-text" font-size="13" font-weight="bold" fill="#0284c7">24 VDC</text>
  <!-- Bornas Entrada AC -->
  <circle cx="45" cy="20" r="3" fill="#0f172a"/>
  <text x="45" y="14" class="pin-label" text-anchor="middle">L</text>
  <circle cx="80" cy="20" r="3" fill="#0f172a"/>
  <text x="80" y="14" class="pin-label" text-anchor="middle">N</text>
  <circle cx="115" cy="20" r="3" fill="#0f172a"/>
  <text x="115" y="14" class="pin-label" text-anchor="middle">PE</text>
  <!-- Bornas Salida DC -->
  <circle cx="55" cy="100" r="3" fill="#0284c7"/>
  <text x="55" y="114" class="pin-label" text-anchor="middle" font-weight="bold" fill="#0284c7">+24V</text>
  <circle cx="105" cy="100" r="3" fill="#0284c7"/>
  <text x="105" y="114" class="pin-label" text-anchor="middle" font-weight="bold" fill="#0284c7">0V</text>
"""
    elif s_id == 'disyuntor_diferencial':
        body = """
  <!-- Disyuntor Diferencial -->
  <line x1="50" y1="10" x2="50" y2="35" class="wire"/>
  <line x1="110" y1="10" x2="110" y2="35" class="wire"/>
  <!-- Contactos principales -->
  <line x1="50" y1="35" x2="62" y2="70" class="wire" stroke-width="2.5"/>
  <line x1="110" y1="35" x2="122" y2="70" class="wire" stroke-width="2.5"/>
  <!-- Barra de disparo térmico/magnético y toroidal -->
  <line x1="45" y1="52" x2="127" y2="52" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="3,2"/>
  <ellipse cx="80" cy="52" rx="14" ry="24" stroke="#0f172a" stroke-width="1.8" fill="none"/>
  <line x1="50" y1="75" x2="50" y2="110" class="wire"/>
  <line x1="110" y1="75" x2="110" y2="110" class="wire"/>
  <text x="25" y="60" class="pin-label" fill="#dc2626" font-weight="bold">IΔn</text>
  <text x="135" y="60" class="pin-label">QA</text>
"""
    elif s_id == 'optocupla_bobina':
        body = """
  <!-- Optocupla Bobina -->
  <rect x="40" y="30" width="80" height="60" rx="3" class="fill-box"/>
  <line x1="40" y1="60" x2="120" y2="60" stroke="#cbd5e1" stroke-width="1"/>
  <path d="M 65 42 L 75 58 L 85 42 Z" fill="#0f172a"/>
  <line x1="60" y1="58" x2="90" y2="58" class="wire"/>
  <line x1="80" y1="10" x2="80" y2="30" class="wire"/>
  <line x1="80" y1="90" x2="80" y2="110" class="wire"/>
  <text x="95" y="24" class="pin-label">A1 (+)</text>
  <text x="95" y="104" class="pin-label">A2 (-)</text>
  <text x="80" y="78" class="sym-text" font-weight="bold">OPTO</text>
"""
    elif s_id == 'contacto_no_optocupla':
        body = """
  <!-- Contacto NO -->
  <line x1="80" y1="10" x2="80" y2="40" class="wire"/>
  <circle cx="80" cy="40" r="3" fill="#0f172a"/>
  <line x1="80" y1="40" x2="98" y2="76" class="wire" stroke-width="2.5"/>
  <circle cx="80" cy="80" r="3" fill="#0f172a"/>
  <line x1="80" y1="80" x2="80" y2="110" class="wire"/>
  <text x="65" y="36" class="pin-label">13</text>
  <text x="65" y="90" class="pin-label">14</text>
  <text x="120" y="62" class="sym-text" font-weight="bold">NO</text>
"""
    elif s_id == 'valvula_3_2':
        body = """
  <!-- Válvula 3/2 -->
  <rect x="40" y="35" width="80" height="50" class="component" fill="#f8fafc"/>
  <line x1="80" y1="35" x2="80" y2="85" class="wire"/>
  <!-- Flechas y tapones -->
  <line x1="55" y1="75" x2="65" y2="45" class="wire"/>
  <polygon points="65,45 61,50 69,48" fill="#0f172a"/>
  <line x1="100" y1="75" x2="100" y2="60" class="wire"/>
  <line x1="94" y1="60" x2="106" y2="60" class="wire"/>
  <!-- Solenoide y retorno por resorte -->
  <polygon points="25,48 40,35 40,85 25,72" fill="#e2e8f0" stroke="#0f172a" stroke-width="1.5"/>
  <path d="M 120 50 Q 128 45 132 60 Q 136 75 140 70" fill="none" stroke="#0f172a" stroke-width="2"/>
  <text x="80" y="24" class="sym-text" font-weight="bold">3/2 NC</text>
"""
    elif s_id == 'valvula_5_2':
        body = """
  <!-- Válvula 5/2 -->
  <rect x="25" y="35" width="110" height="50" class="component" fill="#f8fafc"/>
  <line x1="80" y1="35" x2="80" y2="85" class="wire"/>
  <!-- Símbolos vías -->
  <line x1="45" y1="75" x2="60" y2="45" class="wire"/>
  <polygon points="60,45 56,50 64,48" fill="#0f172a"/>
  <line x1="100" y1="45" x2="115" y2="75" class="wire"/>
  <polygon points="115,75 111,70 119,72" fill="#0f172a"/>
  <!-- Accionamientos en ambos lados -->
  <polygon points="10,48 25,35 25,85 10,72" fill="#e2e8f0" stroke="#0f172a" stroke-width="1.5"/>
  <polygon points="150,48 135,35 135,85 150,72" fill="#e2e8f0" stroke="#0f172a" stroke-width="1.5"/>
  <text x="80" y="24" class="sym-text" font-weight="bold">5/2 BI</text>
"""
    elif s_id == 'motor_trifasico_pe':
        body = """
  <!-- Motor Trifásico -->
  <circle cx="80" cy="65" r="35" class="fill-box" stroke-width="2.5"/>
  <text x="80" y="62" class="sym-text" font-size="20" font-weight="bold">M</text>
  <text x="80" y="78" class="sym-text" font-size="12">3 ~</text>
  <!-- Cables U, V, W -->
  <line x1="60" y1="10" x2="60" y2="30" class="wire"/>
  <line x1="80" y1="10" x2="80" y2="30" class="wire"/>
  <line x1="100" y1="10" x2="100" y2="30" class="wire"/>
  <text x="60" y="24" class="pin-label" text-anchor="middle">U</text>
  <text x="80" y="24" class="pin-label" text-anchor="middle">V</text>
  <text x="100" y="24" class="pin-label" text-anchor="middle">W</text>
  <!-- Borna PE -->
  <line x1="115" y1="65" x2="135" y2="65" class="wire" stroke="#16a34a"/>
  <text x="145" y="68" class="pin-label" fill="#16a34a" font-weight="bold">PE</text>
"""
    elif s_id == 'in_out_modulo_plc':
        body = """
  <!-- Terminal PLC -->
  <rect x="30" y="25" width="100" height="70" rx="3" class="fill-box"/>
  <circle cx="50" cy="45" r="5" fill="#22c55e"/>
  <circle cx="110" cy="45" r="3" fill="#0f172a"/>
  <line x1="110" y1="10" x2="110" y2="45" class="wire"/>
  <text x="80" y="49" class="sym-text" font-weight="bold">DI a.0</text>
  <text x="80" y="75" class="sym-text" font-size="10" fill="#64748b">SM 1221</text>
  <line x1="80" y1="95" x2="80" y2="110" class="wire"/>
  <text x="80" y="118" class="pin-label" text-anchor="middle">COM</text>
"""
    elif s_id == 'bornera_paso':
        body = """
  <!-- Bornera de Paso -->
  <line x1="80" y1="10" x2="80" y2="45" class="wire"/>
  <circle cx="80" cy="60" r="14" class="fill-box"/>
  <text x="80" y="64" class="sym-text" font-weight="bold">1</text>
  <line x1="80" y1="74" x2="80" y2="110" class="wire"/>
  <text x="110" y="63" class="sym-text" fill="#dc2626" font-weight="bold">-X1</text>
"""
    elif s_id == 'referencia_ida_vuelta_cable':
        body = """
  <!-- Referencia Cruzada -->
  <line x1="20" y1="60" x2="80" y2="60" class="wire"/>
  <polygon points="80,50 115,60 80,70" fill="#0f172a"/>
  <text x="65" y="44" class="sym-text" font-weight="bold">+24V</text>
  <text x="135" y="64" class="pin-label" font-size="11" font-weight="bold" fill="#0284c7">/12.4</text>
"""
    elif s_id == 'variador_frecuencia_vdf':
        body = """
  <!-- Variador de Frecuencia -->
  <rect x="25" y="20" width="110" height="80" rx="3" class="fill-box"/>
  <line x1="25" y1="20" x2="135" y2="100" stroke="#cbd5e1" stroke-width="1.5"/>
  <text x="50" y="45" class="sym-text" font-weight="bold" font-size="14">~</text>
  <text x="110" y="75" class="sym-text" font-weight="bold" font-size="14">=</text>
  <text x="80" y="92" class="sym-text" font-weight="bold" fill="#0284c7">VDF D700</text>
  <!-- Entradas L1, L2 -->
  <line x1="45" y1="10" x2="45" y2="20" class="wire"/>
  <line x1="70" y1="10" x2="70" y2="20" class="wire"/>
  <!-- Salidas U, V, W -->
  <line x1="45" y1="100" x2="45" y2="110" class="wire"/>
  <line x1="80" y1="100" x2="80" y2="110" class="wire"/>
  <line x1="115" y1="100" x2="115" y2="110" class="wire"/>
"""
    else:
        body = f"""
  <rect x="30" y="25" width="100" height="70" rx="4" class="fill-box"/>
  <text x="80" y="65" class="sym-text" font-weight="bold">{nombre[:15]}</text>
  <line x1="80" y1="10" x2="80" y2="25" class="wire"/>
  <line x1="80" y1="95" x2="80" y2="110" class="wire"/>
"""
    return svg_header + body + "\n</svg>"

def extraer_bom():
    """Extrae el BOM de la lámina 3/4 a JSON y CSV."""
    comp_dir = os.path.join(BASE_DIR, 'componentes')
    os.makedirs(comp_dir, exist_ok=True)
    
    componentes = [
        {"item": 1, "cant": 1, "unid": "UN", "descripcion": "PLC CPU 1212C AC/DC/RLY", "fabricante": "SIEMENS", "modelo": "S7-1200 CPU 1212C", "tag": "CPU", "serie": "N/A", "observaciones": "Controlador principal"},
        {"item": 2, "cant": 1, "unid": "UN", "descripcion": "FUENTE DE PODER 24VDC 5A/10A", "fabricante": "MEAN WELL", "modelo": "XDR-120E-24", "tag": "PS0", "serie": "N/A", "observaciones": "Alimentación de control y sensores"},
        {"item": 3, "cant": 1, "unid": "UN", "descripcion": "DISYUNTOR CON DIFERENCIAL", "fabricante": "HYUNDAI", "modelo": "HR0 40M", "tag": "QA1", "serie": "N/A", "observaciones": "Protección general tablero control"},
        {"item": 4, "cant": 6, "unid": "UN", "descripcion": "OPTOCUPLA MAS BASE OPTO, 28VDC, 6A", "fabricante": "FCGK", "modelo": "41F-1Z-C4", "tag": "OP0...OP5", "serie": "N/A", "observaciones": "Aislamiento galvánico I/O"},
        {"item": 5, "cant": 6, "unid": "UN", "descripcion": "ELECTROVALVULA 3/2 - 5/2", "fabricante": "MICRO", "modelo": "CH1 GM", "tag": "V0...V5", "serie": "N/A", "observaciones": "Accionamiento neumático cilindros"},
        {"item": 6, "cant": 1, "unid": "UN", "descripcion": "MOTOR TRIFASICO 0.18 kW 230/400V 50Hz", "fabricante": "CEMER", "modelo": "IE2-MSE632-4", "tag": "M0", "serie": "N/A", "observaciones": "Cinta transportadora entrada"},
        {"item": 7, "cant": 1, "unid": "UN", "descripcion": "MOTOR TRIFASICO 0.18 kW 230/400V 50Hz", "fabricante": "CEMER", "modelo": "IE2-MSE632-4", "tag": "M1", "serie": "N/A", "observaciones": "Cinta transportadora salida"},
        {"item": 8, "cant": 2, "unid": "UN", "descripcion": "VARIADOR DE FRECUENCIA 0.4kW - 0.75kW", "fabricante": "MITSUBISHI", "modelo": "FR-D720S-NA", "tag": "VDF0, VDF1", "serie": "N/A", "observaciones": "Variadores de frecuencia cintas"},
        {"item": 9, "cant": 1, "unid": "UN", "descripcion": "HMI PANEL TACTIL 4.3 PULGADAS COLOR", "fabricante": "WEINTEK", "modelo": "MT8052iP", "tag": "HMI", "serie": "N/A", "observaciones": "Interfaz Hombre-Máquina Ethernet"},
        {"item": 10, "cant": 2, "unid": "UN", "descripcion": "SERVOCONTROLADOR MOVIDRIVE B", "fabricante": "SEW EURODRIVE", "modelo": "MDX61B", "tag": "SEW0, SEW1", "serie": "N/A", "observaciones": "Control de ejes Pick and Place"},
        {"item": 11, "cant": 1, "unid": "UN", "descripcion": "MODULO EXPANSION SM 1221 (8 DI)", "fabricante": "SIEMENS", "modelo": "SM 1221 DI 8x24VDC", "tag": "SM0", "serie": "N/A", "observaciones": "Expansión entradas digitales"},
        {"item": 12, "cant": 1, "unid": "UN", "descripcion": "MODULO EXPANSION SM 1222 (8 DQ)", "fabricante": "SIEMENS", "modelo": "SM 1222 DQ 8xRelay", "tag": "SM1", "serie": "N/A", "observaciones": "Expansión salidas digitales"},
        {"item": 13, "cant": 4, "unid": "UN", "descripcion": "PULSADOR PARADA DE EMERGENCIA TIPO SETA", "fabricante": "SCHNEIDER / TELE", "modelo": "XB4BS542", "tag": "S0...S3", "serie": "N/A", "observaciones": "Parada de emergencia con enclavamiento"}
    ]
    
    json_path = os.path.join(comp_dir, 'componentes_1708.json')
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(componentes, f, indent=2, ensure_ascii=False)
        
    csv_path = os.path.join(comp_dir, 'componentes_1708.csv')
    with open(csv_path, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=["item", "cant", "unid", "descripcion", "fabricante", "modelo", "tag", "serie", "observaciones"])
        writer.writeheader()
        writer.writerows(componentes)
        
    print(f"BOM guardado en JSON: {json_path}")
    print(f"BOM guardado en CSV: {csv_path}")

if __name__ == '__main__':
    extraer_simbolos_pdf()
    extraer_bom()
