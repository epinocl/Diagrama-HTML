"""
Herramienta Offline: Extraer Hojas de PDF a SVG y Miniaturas PNG
================================================================
Regla de ubicación obligatoria:
- Cuando se procesa un PDF, por defecto todos los archivos generados
  (HTML, dependencias, hojas SVG, miniaturas y scripts) se guardan en
  la MISMA CARPETA donde está ubicado dicho PDF.

Uso:
    python extraer_hojas_pdf.py [ruta_pdf] [directorio_salida_opcional]

Ejemplo:
    python extraer_hojas_pdf.py "C:\\...\\CAD\\ELECTRICAL\\plano.pdf"
"""

import sys
import os
import shutil
import json
import re

try:
    import pymupdf
except ImportError:
    print("Error: Se requiere pymupdf (pip install pymupdf)")
    sys.exit(1)

TOOL_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
CSS_SRC_DIR = os.path.join(TOOL_ROOT, "css")
JS_SRC_DIR = os.path.join(TOOL_ROOT, "js")
TEMPLATE_HTML = os.path.join(TOOL_ROOT, "plantilla_multilamina", "index.html")
if not os.path.exists(TEMPLATE_HTML):
    TEMPLATE_HTML = os.path.join(TOOL_ROOT, "plantilla.html")

def procesar_pdf(pdf_path, base_dir=None):
    pdf_abs = os.path.abspath(pdf_path)
    if not os.path.exists(pdf_abs):
        print(f"Error: No se encontró el archivo PDF en: {pdf_abs}")
        return

    # REGLA OBLIGATORIA: Si no se especifica base_dir, la carpeta es la del PDF
    if not base_dir:
        base_dir = os.path.dirname(pdf_abs)
    else:
        base_dir = os.path.abspath(base_dir)

    print("=================================================================")
    print("   AXON CAD — PROCESAMIENTO Y EXTRACCIÓN DE PLANO PDF")
    print("=================================================================")
    print(f" -> Archivo PDF:     {pdf_abs}")
    print(f" -> Carpeta destino: {base_dir}")
    print("=================================================================")

    dep_dir = os.path.join(base_dir, 'dependencias')
    hojas_dir = os.path.join(dep_dir, 'hojas')
    thumbs_dir = os.path.join(hojas_dir, 'miniaturas')
    js_dir = os.path.join(dep_dir, 'js')
    css_dir = os.path.join(dep_dir, 'css')

    for d in [dep_dir, hojas_dir, thumbs_dir, js_dir, css_dir]:
        os.makedirs(d, exist_ok=True)

    # Copiar CSS base de la herramienta
    for f in ["layout-a3.css", "presentador-ppt.css", "print-a3.css"]:
        src = os.path.join(CSS_SRC_DIR, f)
        if os.path.exists(src):
            shutil.copy2(src, os.path.join(css_dir, f))

    # Copiar JS base de la herramienta
    for f in ["presentador.js", "editor_textos.js", "zoom-pan.js"]:
        src = os.path.join(JS_SRC_DIR, f)
        if os.path.exists(src):
            shutil.copy2(src, os.path.join(js_dir, f))

    print(f"\n[1/3] Abriendo y analizando PDF...")
    doc = pymupdf.open(pdf_abs)
    total_paginas = len(doc)
    print(f" -> Total de páginas encontradas: {total_paginas}")

    hojas_data = []
    hojas_svg_dict = {}

    for i in range(total_paginas):
        page = doc[i]
        num = i + 1
        num_str = f"{num:02d}"

        # 1. Exportar SVG vectorial nativo
        svg_filename = f"hoja_{num_str}.svg"
        svg_path = os.path.join(hojas_dir, svg_filename)
        svg_content = page.get_svg_image()
        with open(svg_path, "w", encoding="utf-8") as f:
            f.write(svg_content)
        hojas_svg_dict[num] = svg_content

        # 2. Renderizar miniatura PNG a 72 dpi para la tira inferior
        thumb_filename = f"thumb_{num_str}.png"
        thumb_path = os.path.join(thumbs_dir, thumb_filename)
        pix = page.get_pixmap(dpi=72)
        pix.save(thumb_path)

        hojas_data.append({
            "numero": num,
            "codigo_lamina": num_str,
            "titulo_corto": f"LÁMINA {num_str}",
            "titulo_largo": f"Diagrama Eléctrico - Lámina {num_str}",
            "disciplina": "General",
            "archivo_svg": f"dependencias/hojas/{svg_filename}",
            "archivo_thumb": f"dependencias/hojas/miniaturas/{thumb_filename}"
        })
        print(f"    - [{num_str}/{total_paginas:02d}] Exportada página {num_str} ({len(svg_content)//1024} KB)")

    # 3. Inferir metadatos del nombre del PDF o carpeta
    nombre_pdf = os.path.splitext(os.path.basename(pdf_abs))[0]
    m_cod = re.search(r"(\d{4,5})", nombre_pdf)
    codigo_proj = f"DE-{m_cod.group(1)}" if m_cod else "DE-CAD"

    # 4. Guardar bases de datos JavaScript offline
    print(f"\n[2/3] Generando bases de datos JavaScript...")
    js_path = os.path.join(js_dir, "datos_proyecto.js")
    with open(js_path, "w", encoding="utf-8") as f:
        f.write("// ==========================================================================\n")
        f.write(f"// Datos Generados del Proyecto {nombre_pdf}\n")
        f.write("// ==========================================================================\n\n")
        f.write("const PROYECTO_INFO = {\n")
        f.write(f"  codigo: '{codigo_proj}',\n")
        f.write(f"  nombre: '{nombre_pdf}',\n")
        f.write("  cliente: 'AXON INGENIERÍA',\n")
        f.write(f"  total_hojas: {total_paginas},\n")
        f.write("  formato: 'A3 Horizontal (420 x 297 mm)',\n")
        f.write("  norma: 'IEC 60617 / EPLAN Style',\n")
        f.write("  version: 'Rev. 0',\n")
        f.write("  fecha: '2026-10-17'\n")
        f.write("};\n\n")
        f.write("const HOJAS_DATA = ")
        json.dump(hojas_data, f, indent=2, ensure_ascii=False)
        f.write(";\n")

    inline_js_path = os.path.join(js_dir, "hojas_svg_inline.js")
    with open(inline_js_path, "w", encoding="utf-8") as f:
        f.write("// Base de datos de SVG embebidos para manipulación y visualización\n")
        f.write("const HOJAS_SVG_CONTENT = {\n")
        for num, svg_c in hojas_svg_dict.items():
            f.write(f"  {num}: {json.dumps(svg_c)},\n")
        f.write("};\n")

    # 5. Generar index.html y diagrama_<nombre>.html en la carpeta del PDF
    print(f"\n[3/3] Creando visor interactivo HTML en la carpeta del PDF...")
    slug_pdf = re.sub(r"[^a-zA-Z0-9]+", "_", nombre_pdf).strip("_").lower()
    html_nombrado = os.path.join(base_dir, f"diagrama_{slug_pdf}.html")
    html_index = os.path.join(base_dir, "index.html")

    if os.path.exists(TEMPLATE_HTML):
        with open(TEMPLATE_HTML, "r", encoding="utf-8") as f:
            html_content = f.read()
    else:
        html_content = "<!DOCTYPE html><html><head><meta charset='UTF-8'><title>Visor PDF</title></head><body><h1>Visor</h1></body></html>"

    html_content = re.sub(r"<title>.*?</title>", f"<title>{nombre_pdf} - Visor A3 AXON</title>", html_content)
    html_content = html_content.replace("DE-4710", codigo_proj)
    html_content = html_content.replace("GARDEN HOUSE - CONTROL SEMÁFORO AGUA", nombre_pdf)
    html_content = html_content.replace("DATOS DEL PROYECTO DE-4710", f"DATOS DE {codigo_proj}")

    with open(html_nombrado, "w", encoding="utf-8") as f:
        f.write(html_content)
    with open(html_index, "w", encoding="utf-8") as f:
        f.write(html_content)

    print("\n✅ EXTRACCIÓN Y VISOR FINALIZADOS EXITOSAMENTE:")
    print(f" -> Ubicación:    {base_dir}")
    print(f" -> Visor Index:  {html_index}")
    print(f" -> Visor Nombr:  {html_nombrado}")
    print(f" -> Dependencias: {dep_dir}")
    print("=================================================================\n")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Uso: python extraer_hojas_pdf.py <ruta_pdf> [directorio_salida_opcional]")
        sys.exit(1)

    target_pdf = sys.argv[1]
    target_base = sys.argv[2] if len(sys.argv) > 2 else None

    procesar_pdf(target_pdf, target_base)
