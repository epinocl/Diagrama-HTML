"""
Herramienta Offline: Recortador y Extractor de Nuevos Símbolos
==============================================================
Permite recortar una zona rectangular de cualquier lámina de plano en PDF o SVG
y registrarla automáticamente en la base de datos de simbología reutilizable.

Uso:
    python recortar_simbolo.py [num_pagina] [x0] [y0] [x1] [y1] [categoria] [id_simbolo] [nombre] [descripcion]

Ejemplo:
    python recortar_simbolo.py 36 200 300 350 450 "seguridad" "seta_emergencia_xb4" "Seta de Emergencia 2NC" "Pulsador de parada de emergencia con enclavamiento"
"""

import sys
import os
import json
import pymupdf

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DEFAULT_PDF = r"C:\Users\epite\OneDrive - AXON\AXON_PROYECTOS\GARDEN\1708 PICK AND PLACE\CAD\ELECTRICAL\DE-1708-PICK AND PLACE-GARDEN HAUSE.pdf"

def recortar(num_pagina, x0, y0, x1, y1, categoria, s_id, nombre, descripcion, tags=""):
    doc = pymupdf.open(DEFAULT_PDF)
    page_idx = int(num_pagina) - 1
    page = doc[page_idx]
    
    cat_dir = os.path.join(BASE_DIR, "simbologia", categoria)
    os.makedirs(cat_dir, exist_ok=True)
    
    rect = pymupdf.Rect(float(x0), float(y0), float(x1), float(y1))
    
    # 1. Guardar PNG a 300 DPI
    png_path = os.path.join(cat_dir, f"{s_id}.png")
    pix = page.get_pixmap(clip=rect, dpi=300)
    pix.save(png_path)
    
    # 2. Generar SVG
    svg_path = os.path.join(cat_dir, f"{s_id}.svg")
    # Template genérico SVG si no se tiene dibujo nativo
    w_px = pix.width
    h_px = pix.height
    svg_code = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w_px} {h_px}" width="{w_px}" height="{h_px}">
  <image href="{s_id}.png" x="0" y="0" width="{w_px}" height="{h_px}" />
</svg>"""
    with open(svg_path, "w", encoding="utf-8") as f:
        f.write(svg_code)
        
    # 3. Registrar en base_datos_simbolos.json y js/catalogo_datos.js
    json_path = os.path.join(BASE_DIR, "simbologia", "base_datos_simbolos.json")
    simbolos = []
    if os.path.exists(json_path):
        with open(json_path, "r", encoding="utf-8") as f:
            simbolos = json.load(f)
            
    # Eliminar si ya existía con el mismo ID
    simbolos = [s for s in simbolos if s.get("id") != s_id]
    
    tag_list = [t.strip() for t in tags.split(",") if t.strip()] if tags else [categoria, s_id]
    
    simbolos.append({
        "id": s_id,
        "nombre": nombre,
        "categoria": categoria,
        "descripcion": descripcion,
        "tags": tag_list,
        "archivo_png": f"simbologia/{categoria}/{s_id}.png",
        "archivo_svg": f"simbologia/{categoria}/{s_id}.svg",
        "ancho_px": w_px,
        "alto_px": h_px
    })
    
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(simbolos, f, indent=2, ensure_ascii=False)
        
    js_path = os.path.join(BASE_DIR, "js", "catalogo_datos.js")
    with open(js_path, "w", encoding="utf-8") as f:
        f.write("// Base de datos de Simbologia Industrial AXON (Carga Offline Directa)\n")
        f.write("const BASE_DATOS_SIMBOLOS = " + json.dumps(simbolos, indent=2, ensure_ascii=False) + ";\n")
        
    print(f"Símbolo '{nombre}' extraído y registrado con éxito:")
    print(f" -> PNG: {png_path} ({w_px}x{h_px} px)")
    print(f" -> SVG: {svg_path}")
    print(f" -> Base de datos actualizada en: {json_path}")

if __name__ == "__main__":
    if len(sys.argv) < 9:
        print(__doc__)
        sys.exit(0)
        
    p_num = sys.argv[1]
    px0, py0, px1, py1 = sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5]
    p_cat = sys.argv[6]
    p_id = sys.argv[7]
    p_nom = sys.argv[8]
    p_desc = sys.argv[9] if len(sys.argv) > 9 else ""
    p_tags = sys.argv[10] if len(sys.argv) > 10 else ""
    
    recortar(p_num, px0, py0, px1, py1, p_cat, p_id, p_nom, p_desc, p_tags)
