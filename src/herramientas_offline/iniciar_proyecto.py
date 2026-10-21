"""
Herramienta Offline: Iniciar / Ensamblar Proyecto de Diagrama HTML (AXON CAD)
=============================================================================
Regla de ubicación obligatoria:
- Si el origen es un BOSQUEJO (carpeta o archivo dentro de BOSQUEJO):
    -> Se guarda en la CARPETA RAÍZ de la carpeta del bosquejo (padre de BOSQUEJO/).
- Si el origen es un archivo PDF:
    -> Se guarda en la MISMA CARPETA donde está ubicado dicho PDF.

Uso:
    python iniciar_proyecto.py <ruta_origen> [codigo] [cliente] [nombre_proyecto]

Ejemplos:
    python iniciar_proyecto.py "C:\\...\\CAD\\BOSQUEJO" DE-5266 "EUROFARMA" "SISTEMA VISION BLISTERA 3"
    python iniciar_proyecto.py "C:\\...\\1_RECIBIDO\\plano.pdf" DE-1708 "GARDEN HOUSE" "PICK AND PLACE"
"""

import sys
import os
import shutil
import json
import re

try:
    import pymupdf
    HAS_PYMUPDF = True
except ImportError:
    HAS_PYMUPDF = False

try:
    from PIL import Image
    HAS_PIL = True
except ImportError:
    HAS_PIL = False

TOOL_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
CSS_SRC_DIR = os.path.join(TOOL_ROOT, "css")
JS_SRC_DIR = os.path.join(TOOL_ROOT, "js")
TEMPLATE_HTML = os.path.join(TOOL_ROOT, "plantilla_multilamina", "index.html")
if not os.path.exists(TEMPLATE_HTML):
    TEMPLATE_HTML = os.path.join(TOOL_ROOT, "plantilla.html")

def resolver_directorio_destino(origen_path):
    origen_abs = os.path.abspath(origen_path)
    
    # Caso 1: Archivo PDF
    if origen_abs.lower().endswith(".pdf"):
        destino = os.path.dirname(origen_abs)
        return destino, "pdf", origen_abs
        
    # Caso 2: Ruta que contiene una carpeta BOSQUEJO
    partes = origen_abs.replace("\\", "/").rstrip("/").split("/")
    idx_bosquejo = -1
    for i, p in enumerate(partes):
        if p.upper() == "BOSQUEJO" or p.upper().startswith("BOSQUEJO"):
            idx_bosquejo = i
            break
            
    if idx_bosquejo != -1:
        # La raíz es el directorio padre de la carpeta BOSQUEJO
        raiz_partes = partes[:idx_bosquejo]
        raiz = "/".join(raiz_partes)
        if os.name == "nt" and len(raiz_partes) == 1 and raiz_partes[0].endswith(":"):
            raiz += "/"
        destino = os.path.abspath(raiz)
        bosquejo_dir = os.path.abspath("/".join(partes[:idx_bosquejo + 1]))
        return destino, "bosquejo", bosquejo_dir

    # Caso 3: Carpeta que contiene adentro una subcarpeta BOSQUEJO
    if os.path.isdir(origen_abs):
        sub_bosquejo = os.path.join(origen_abs, "BOSQUEJO")
        if os.path.exists(sub_bosquejo) and os.path.isdir(sub_bosquejo):
            return origen_abs, "bosquejo", sub_bosquejo
        return origen_abs, "carpeta", origen_abs

    # Fallback genérico
    if os.path.isfile(origen_abs):
        return os.path.dirname(origen_abs), "archivo", origen_abs
    return os.path.dirname(origen_abs), "desconocido", origen_abs

def inferir_metadatos(destino_path, arg_cod=None, arg_cli=None, arg_tit=None):
    partes = destino_path.replace("\\", "/").split("/")
    
    cod = arg_cod
    cli = arg_cli
    tit = arg_tit
    
    # Intentar inferir de la ruta
    # Formato habitual AXON: .../<CLIENTE>/<NUM> <CLIENTE> - <NOMBRE>/...
    for p in reversed(partes):
        m = re.match(r"^(\d{4,5})\s+([^-]+)\s*-\s*(.+)$", p)
        if m:
            if not cod:
                cod = f"DE-{m.group(1)}"
            if not cli:
                cli = m.group(2).strip()
            if not tit:
                tit = m.group(3).strip()
            break
        # Formato alternativo: .../<NUM> <NOMBRE>/...
        m2 = re.match(r"^(\d{4,5})\s+(.+)$", p)
        if m2 and not cod:
            cod = f"DE-{m2.group(1)}"
            if not tit:
                tit = m2.group(2).strip()
                
    if not cod:
        cod = "DE-PROYECTO"
    if not cli:
        cli = "CLIENTE AXON"
    if not tit:
        tit = "DIAGRAMA ELECTRICO INDUSTRIAL"
        
    return cod, cli, tit

def copiar_dependencias_base(destino):
    dep_dir = os.path.join(destino, "dependencias")
    css_dir = os.path.join(dep_dir, "css")
    js_dir = os.path.join(dep_dir, "js")
    hojas_dir = os.path.join(dep_dir, "hojas")
    thumbs_dir = os.path.join(hojas_dir, "miniaturas")
    bocetos_dir = os.path.join(dep_dir, "bocetos_originales")
    
    for d in [dep_dir, css_dir, js_dir, hojas_dir, thumbs_dir, bocetos_dir]:
        os.makedirs(d, exist_ok=True)
        
    # Copiar CSS
    for f in ["layout-a3.css", "presentador-ppt.css", "print-a3.css"]:
        src = os.path.join(CSS_SRC_DIR, f)
        if os.path.exists(src):
            shutil.copy2(src, os.path.join(css_dir, f))
            
    # Copiar JS base
    for f in ["presentador.js", "editor_textos.js", "editor_simbolos.js", "zoom-pan.js", "exportador_dxf.js", "configurador_colores.js"]:
        src = os.path.join(JS_SRC_DIR, f)
        if os.path.exists(src):
            shutil.copy2(src, os.path.join(js_dir, f))
            
    # Copiar activos vectoriales base (logo AXON corporativo)
    logo_src = os.path.join(TOOL_ROOT, "simbologia", "cajetines_marcos", "axon_logo_vector.svg")
    if os.path.exists(logo_src):
        shutil.copy2(logo_src, os.path.join(dep_dir, "axon_logo_vector.svg"))
            
    return dep_dir, css_dir, js_dir, hojas_dir, thumbs_dir, bocetos_dir

def procesar_origen(origen, arg_cod=None, arg_cli=None, arg_tit=None):
    destino, tipo_origen, ruta_efectiva = resolver_directorio_destino(origen)
    cod, cli, tit = inferir_metadatos(destino, arg_cod, arg_cli, arg_tit)
    
    print("=================================================================")
    print("   AXON CAD — INICIALIZADOR DE PROYECTO DIAGRAMA-HTML")
    print("=================================================================")
    print(f" -> Insumo de origen:  {origen}")
    print(f" -> Tipo detectado:    {tipo_origen.upper()}")
    print(f" -> Destino obligatorio: {destino}")
    print(f" -> Código Proyecto:   {cod}")
    print(f" -> Cliente:           {cli}")
    print(f" -> Título:            {tit}")
    print("=================================================================")
    
    dep_dir, css_dir, js_dir, hojas_dir, thumbs_dir, bocetos_dir = copiar_dependencias_base(destino)
    
    hojas_data = []
    hojas_svg_dict = {}
    
    # PROCESAMIENTO SEGÚN TIPO
    if tipo_origen == "pdf" and HAS_PYMUPDF:
        print(f"\n[1/3] Extrayendo páginas vectoriales desde PDF: {ruta_efectiva}")
        doc = pymupdf.open(ruta_efectiva)
        total_pags = len(doc)
        print(f" -> Total páginas: {total_pags}")
        
        for i in range(total_pags):
            num = i + 1
            num_str = f"{num:02d}"
            page = doc[i]
            
            # SVG
            svg_content = page.get_svg_image()
            svg_file = f"hoja_{num_str}.svg"
            svg_path = os.path.join(hojas_dir, svg_file)
            with open(svg_path, "w", encoding="utf-8") as f:
                f.write(svg_content)
            hojas_svg_dict[num] = svg_content
            
            # Thumb PNG
            thumb_file = f"thumb_{num_str}.png"
            thumb_path = os.path.join(thumbs_dir, thumb_file)
            pix = page.get_pixmap(dpi=72)
            pix.save(thumb_path)
            
            hojas_data.append({
                "numero": num,
                "codigo_lamina": num_str,
                "titulo_corto": f"LÁMINA {num_str}",
                "titulo_largo": f"Diagrama Eléctrico - Lámina {num_str}",
                "disciplina": "General",
                "archivo_svg": f"dependencias/hojas/{svg_file}",
                "archivo_thumb": f"dependencias/hojas/miniaturas/{thumb_file}"
            })
            print(f"    - Página {num_str}/{total_pags:02d} extraída OK")
            
    elif tipo_origen == "bosquejo":
        print(f"\n[1/3] Procesando bocetos desde carpeta: {ruta_efectiva}")
        archivos = sorted(os.listdir(ruta_efectiva))
        img_exts = [".png", ".jpg", ".jpeg", ".webp", ".bmp", ".tif", ".tiff"]
        bocetos_encontrados = [f for f in archivos if os.path.splitext(f)[1].lower() in img_exts]
        
        num_hojas = max(len(bocetos_encontrados), 1)
        print(f" -> Bocetos de imagen encontrados: {len(bocetos_encontrados)}")
        
        for i, b_file in enumerate(bocetos_encontrados):
            num = i + 1
            num_str = f"{num:02d}"
            src_b = os.path.join(ruta_efectiva, b_file)
            dst_b = os.path.join(bocetos_dir, f"boceto_{num_str}.png")
            
            # Convertir a PNG si es necesario
            if HAS_PIL:
                try:
                    with Image.open(src_b) as im:
                        im.convert("RGB").save(dst_b, "PNG")
                except Exception:
                    shutil.copy2(src_b, dst_b)
            else:
                shutil.copy2(src_b, dst_b)
                
        # Verificar o crear plantillas de hojas SVG
        for num in range(1, num_hojas + 1):
            num_str = f"{num:02d}"
            svg_file = f"hoja_{num_str}.svg"
            svg_path = os.path.join(hojas_dir, svg_file)
            
            if os.path.exists(svg_path):
                with open(svg_path, "r", encoding="utf-8") as f:
                    hojas_svg_dict[num] = f.read()
            else:
                # Crear plantilla base
                svg_template = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1191 842" width="1191" height="842" style="background:#ffffff;" id="svg_sheet_{num}">
  <defs>
    <style>
      .cad-border {{ stroke: #0f172a; stroke-width: 1.5; fill: none; }}
      .cad-thin {{ stroke: #334155; stroke-width: 0.8; fill: none; }}
      .grid-label {{ font-family: 'Segoe UI', Arial, sans-serif; font-size: 13px; font-weight: bold; fill: #0f172a; text-anchor: middle; dominant-baseline: middle; }}
      .title-label {{ font-size: 10px; fill: #475569; font-weight: 700; text-transform: uppercase; }}
      .title-value {{ font-size: 12px; fill: #0f172a; font-weight: bold; }}
      .title-main {{ font-family: 'Segoe UI', Arial, sans-serif; fill: #0284c7; font-weight: 800; letter-spacing: 0.5px; }}
      .tag {{ font-family: 'Segoe UI', Arial, sans-serif; font-size: 12px; font-weight: bold; fill: #0f172a; }}
      .subtag {{ font-family: 'Segoe UI', Arial, sans-serif; font-size: 10px; fill: #475569; }}
      .draggable-text {{ cursor: move; user-select: none; }}
      .draggable-text:hover {{ fill: #0284c7; }}
    </style>
  </defs>
  <rect x="15" y="15" width="1161" height="812" class="cad-thin"/>
  <rect x="40" y="30" width="1125" height="782" class="cad-border"/>
  <line x1="40" y1="45" x2="1165" y2="45" class="cad-thin"/>
  <line x1="40" y1="797" x2="1165" y2="797" class="cad-thin"/>
  <text x="600" y="38" class="grid-label">CUADRÍCULA NORMALIZADA DIN A3 (420 x 297 mm)</text>
  <g id="cajetin_axon">
    <rect x="280" y="705" width="870" height="90" fill="#ffffff" stroke="#0f172a" stroke-width="1.8"/>
    <text x="290" y="730" class="title-label">CLIENTE:</text>
    <text x="350" y="732" class="title-value draggable-text">{cli}</text>
    <text x="290" y="755" class="title-main draggable-text" font-size="15">{cod} - {tit}</text>
    <text x="290" y="780" class="title-value draggable-text" fill="#0284c7">LÁMINA {num_str}: ESQUEMA ELÉCTRICO DE CONTROL</text>
    <text x="1040" y="735" class="title-label">LÁMINA</text>
    <text x="1080" y="760" class="title-value draggable-text" font-size="20" fill="#0284c7">{num_str} / {num_hojas:02d}</text>
  </g>
  <g id="circuit_layer">
    <text x="600" y="380" class="tag draggable-text" font-size="16" fill="#64748b" text-anchor="middle">LÁMINA {num_str} DIGITALIZADA DESDE BOCETO A MANO ALZADA</text>
  </g>
</svg>'''
                with open(svg_path, "w", encoding="utf-8") as f:
                    f.write(svg_template)
                hojas_svg_dict[num] = svg_template
                
            # Generar miniatura básica
            thumb_file = f"thumb_{num_str}.png"
            thumb_path = os.path.join(thumbs_dir, thumb_file)
            if not os.path.exists(thumb_path) and HAS_PIL:
                img_t = Image.new("RGB", (320, 226), color=(240, 244, 248))
                img_t.save(thumb_path)
                
            boceto_ref = f"dependencias/bocetos_originales/boceto_{num_str}.png"
            hojas_data.append({
                "numero": num,
                "codigo_lamina": num_str,
                "titulo_corto": f"LÁMINA {num_str}",
                "titulo_largo": f"Diagrama Eléctrico - Lámina {num_str}",
                "disciplina": "Control",
                "archivo_svg": f"dependencias/hojas/{svg_file}",
                "archivo_thumb": f"dependencias/hojas/miniaturas/{thumb_file}",
                "boceto_original": boceto_ref if os.path.exists(os.path.join(destino, boceto_ref)) else None
            })
            
    # GUARDAR METADATOS JS
    print("\n[2/3] Generando bases de datos JavaScript offline...")
    datos_js_path = os.path.join(js_dir, "datos_proyecto.js")
    with open(datos_js_path, "w", encoding="utf-8") as f:
        f.write(f"// Metadatos Generados para {cod} - {tit}\n")
        f.write("const PROYECTO_INFO = {\n")
        f.write(f"  codigo: '{cod}',\n")
        f.write(f"  nombre: '{tit}',\n")
        f.write(f"  cliente: '{cli}',\n")
        f.write(f"  total_hojas: {len(hojas_data)},\n")
        f.write("  formato: 'A3 Horizontal (420 x 297 mm)',\n")
        f.write("  norma: 'IEC 60617 / EPLAN Style',\n")
        f.write("  version: 'Rev. 0',\n")
        f.write("  fecha: '2026-10-17'\n")
        f.write("};\n\n")
        f.write("const HOJAS_DATA = " + json.dumps(hojas_data, indent=2, ensure_ascii=False) + ";\n")
        
    inline_js_path = os.path.join(js_dir, "hojas_svg_inline.js")
    with open(inline_js_path, "w", encoding="utf-8") as f:
        f.write("// Base de datos de SVG embebidos para interactividad DOM y edición de textos\n")
        f.write("const HOJAS_SVG_CONTENT = {\n")
        for num, svg_c in hojas_svg_dict.items():
            f.write(f"  {num}: {json.dumps(svg_c)},\n")
        f.write("};\n")
        
    # GENERAR VISORES HTML EN LA RAÍZ DEL DESTINO
    print("\n[3/3] Creando archivos HTML en la carpeta raíz de destino...")
    slug_nombre = re.sub(r"[^a-zA-Z0-9]+", "_", f"{cod}_{tit}").strip("_").lower()
    html_nombrado = os.path.join(destino, f"diagrama_{slug_nombre}.html")
    html_index = os.path.join(destino, "index.html")
    
    # Leer plantilla base
    if os.path.exists(TEMPLATE_HTML):
        with open(TEMPLATE_HTML, "r", encoding="utf-8") as f:
            html_content = f.read()
    else:
        # Template fallback
        html_content = "<!DOCTYPE html><html><head><meta charset='UTF-8'><title>Visor CAD</title></head><body><h1>Visor</h1></body></html>"
        
    # Reemplazar títulos y metadatos en plantilla
    total_str = f"{len(hojas_data):02d}"
    html_content = re.sub(r"<title>.*?</title>", f"<title>{cod} {tit} - AXON CAD</title>", html_content)
    html_content = html_content.replace("{{CODIGO}}", cod).replace("DE-4710", cod).replace("DE-XXXX", cod)
    html_content = html_content.replace("{{TITULO}}", tit)
    html_content = html_content.replace("{{CLIENTE}}", cli)
    html_content = html_content.replace("{{TOTAL_HOJAS}}", total_str)
    html_content = html_content.replace("GARDEN HOUSE - CONTROL SEMÁFORO AGUA", f"{cli} - {tit}")
    html_content = html_content.replace("DATOS DEL PROYECTO DE-4710", f"DATOS DEL PROYECTO {cod}")
    html_content = re.sub(r'📄 Ver (?:todas las )?Láminas', f'📄 Ver {len(hojas_data)} Láminas', html_content)
    html_content = re.sub(r'Láminas \(\d+\)', f'Láminas ({total_str})', html_content)
    
    with open(html_nombrado, "w", encoding="utf-8") as f:
        f.write(html_content)
        
    with open(html_index, "w", encoding="utf-8") as f:
        f.write(html_content)
        
    print("\n✅ PROYECTO GENERADO CON ÉXITO EN EL DESTINO CORRECTO:")
    print(f" -> Carpeta raíz:   {destino}")
    print(f" -> Visor Index:    {html_index}")
    print(f" -> Visor Proyecto: {html_nombrado}")
    print(f" -> Dependencias:   {dep_dir}")
    print("=================================================================\n")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Uso: python iniciar_proyecto.py <ruta_origen_bosquejo_o_pdf> [codigo] [cliente] [titulo]")
        sys.exit(1)
        
    orig = sys.argv[1]
    c = sys.argv[2] if len(sys.argv) > 2 else None
    cl = sys.argv[3] if len(sys.argv) > 3 else None
    t = sys.argv[4] if len(sys.argv) > 4 else None
    
    procesar_origen(orig, c, cl, t)
