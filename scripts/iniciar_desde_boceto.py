# -*- coding: utf-8 -*-
"""
AXON CAD Web — Inicializador de Proyecto desde Bocetos o PDFs
============================================================
Toma una carpeta con imágenes de bocetos a mano alzada o un archivo PDF de cliente,
extrae las páginas/imágenes, calcula hashes SHA-256 (ALCOA+), crea el `project.json`
normalizado y genera el paquete `.axon.zip` listo para importar en la web.

Uso:
    python scripts/iniciar_desde_boceto.py <RUTA_BOCETOS_O_PDF> [CODIGO] [CLIENTE] [NOMBRE_PROYECTO]

Ejemplos:
    python scripts/iniciar_desde_boceto.py "C:\...\BOSQUEJO" DE-5266 "EUROFARMA" "CONTROL VISION BLISTERA 3"
    python scripts/iniciar_desde_boceto.py "C:\...\plano.pdf" DE-1708 "GARDEN HOUSE" "PICK AND PLACE"
"""

import sys
import os
import shutil
import json
import hashlib
from datetime import datetime, timezone

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

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

# Importar el empaquetador del mismo directorio
from empaquetar_proyecto import empaquetar, calcular_sha256

def extraer_desde_pdf(pdf_path, temp_bocetos_dir):
    if not HAS_PYMUPDF:
        print("[ERROR] PyMuPDF no está instalado. Ejecuta: pip install pymupdf")
        sys.exit(1)

    doc = pymupdf.open(pdf_path)
    os.makedirs(temp_bocetos_dir, exist_ok=True)
    boceto_files = []

    print(f"[*] Extrayendo {len(doc)} páginas desde '{os.path.basename(pdf_path)}'...")
    for i, page in enumerate(doc):
        pix = page.get_pixmap(dpi=150)
        fname = f"boceto_{i+1:02d}.png"
        out_path = os.path.join(temp_bocetos_dir, fname)
        pix.save(out_path)
        boceto_files.append(fname)

    return boceto_files

def procesar_carpeta_imagenes(dir_path, temp_bocetos_dir):
    os.makedirs(temp_bocetos_dir, exist_ok=True)
    valid_exts = ('.png', '.jpg', '.jpeg', '.webp')
    archivos = [f for f in sorted(os.listdir(dir_path)) if f.lower().endswith(valid_exts)]
    
    if not archivos:
        print(f"[ERROR] No se encontraron imágenes válidas en '{dir_path}'.")
        sys.exit(1)

    boceto_files = []
    for i, fname in enumerate(archivos):
        src_path = os.path.join(dir_path, fname)
        dest_fname = f"boceto_{i+1:02d}.png"
        dest_path = os.path.join(temp_bocetos_dir, dest_fname)
        
        # Convertir a PNG estándar si es necesario
        if HAS_PIL:
            with Image.open(src_path) as im:
                im.convert("RGB").save(dest_path, "PNG")
        else:
            shutil.copy2(src_path, dest_path)
            
        boceto_files.append(dest_fname)

    return boceto_files

def iniciar_proyecto(origen_path, codigo="DE-5266", cliente="EUROFARMA", nombre="CONTROL VISION BLISTERA 3", salida_zip=None):
    origen_abs = os.path.abspath(origen_path)
    if not os.path.exists(origen_abs):
        print(f"[ERROR] La ruta de origen '{origen_abs}' no existe.")
        sys.exit(1)

    # Carpeta temporal de trabajo
    carpeta_trabajo = os.path.abspath(f"temp_proyecto_{codigo}")
    if os.path.exists(carpeta_trabajo):
        shutil.rmtree(carpeta_trabajo)
    os.makedirs(carpeta_trabajo, exist_ok=True)

    bocetos_dest_dir = os.path.join(carpeta_trabajo, "bocetos")

    # 1. Extraer o copiar bocetos
    if origen_abs.lower().endswith(".pdf"):
        boceto_files = extraer_desde_pdf(origen_abs, bocetos_dest_dir)
    elif os.path.isdir(origen_abs):
        boceto_files = procesar_carpeta_imagenes(origen_abs, bocetos_dest_dir)
    else:
        print("[ERROR] El origen debe ser una carpeta de imágenes o un archivo PDF.")
        sys.exit(1)

    print(f"[OK] {len(boceto_files)} bocetos preparados en '{bocetos_dest_dir}'.")

    # 2. Generar hojas en project.json
    sheets = []
    for i, bfile in enumerate(boceto_files):
        num_hoja = i + 1
        titulo_hoja = "Portada" if num_hoja == 1 else f"Circuito Lámina {num_hoja:02d}"
        disciplina = "General" if num_hoja == 1 else "Fuerza & Control"

        sheets.append({
            "id": f"sheet_{num_hoja:02d}",
            "meta": {
                "sheetNumber": num_hoja,
                "sheetCode": f"{num_hoja:02d}",
                "titleShort": titulo_hoja,
                "titleLong": f"{nombre} — {titulo_hoja}",
                "discipline": disciplina,
                "date": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
                "designer": "AXON Ingeniería",
                "revision": "Rev. 1.0"
            },
            "sketchFile": f"bocetos/{bfile}",
            "components": [],
            "wires": [],
            "geometries": []
        })

    # 3. Estructurar project.json
    project_doc = {
        "schemaVersion": "1.0",
        "projectCode": codigo,
        "projectName": nombre,
        "client": cliente,
        "standard": "IEC_60617",
        "format": "DIN_ISO_5457_A3",
        "activeSheetId": "sheet_01",
        "sheets": sheets
    }

    project_json_path = os.path.join(carpeta_trabajo, "project.json")
    with open(project_json_path, "w", encoding="utf-8") as f:
        json.dump(project_doc, f, ensure_ascii=False, indent=2)

    # 4. Empaquetar a .axon.zip
    if not salida_zip:
        salida_zip = f"{codigo}_{cliente.replace(' ', '_')}.axon.zip"

    empaquetar(carpeta_trabajo, salida_zip)

    # Limpieza de temporal
    shutil.rmtree(carpeta_trabajo)

    print("\n" + "="*70)
    print(f"✨ PROYECTO INICIALIZADO CON ÉXITO")
    print(f"📦 Paquete Generado: {os.path.abspath(salida_zip)}")
    print(f"📄 Total Láminas A3: {len(sheets)}")
    print(f"🚀 Para abrir y editar: Arrastra '{salida_zip}' a http://localhost:3000/")
    print("="*70)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Uso: python scripts/iniciar_desde_boceto.py <RUTA_BOCETOS_O_PDF> [CODIGO] [CLIENTE] [NOMBRE_PROYECTO] [--salida <ZIP>]")
        sys.exit(1)

    origen = sys.argv[1]
    cod = sys.argv[2] if len(sys.argv) > 2 else "DE-5266"
    cli = sys.argv[3] if len(sys.argv) > 3 else "EUROFARMA"
    nom = sys.argv[4] if len(sys.argv) > 4 else "CONTROL VISION BLISTERA 3"
    
    out = None
    if "--salida" in sys.argv:
        idx = sys.argv.index("--salida")
        if idx + 1 < len(sys.argv):
            out = sys.argv[idx + 1]

    iniciar_proyecto(origen, cod, cli, nom, out)
