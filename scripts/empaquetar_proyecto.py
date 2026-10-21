# -*- coding: utf-8 -*-
"""
AXON CAD Web — Utilidad CLI para Agente IA: Empaquetador de Proyectos (.axon.zip)
Estándar: GAMP 5 / ALCOA+ (Trazabilidad con SHA-256)
"""

import sys
import os
import json
import zipfile
import hashlib
from datetime import datetime, timezone

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def calcular_sha256(filepath):
    h = hashlib.sha256()
    with open(filepath, 'rb') as f:
        while chunk := f.read(8192):
            h.update(chunk)
    return h.hexdigest()

def empaquetar(directorio_proyecto, ruta_salida=None):
    if not os.path.exists(directorio_proyecto):
        print(f"[ERROR] El directorio '{directorio_proyecto}' no existe.")
        sys.exit(1)

    project_json_path = os.path.join(directorio_proyecto, "project.json")
    if not os.path.exists(project_json_path):
        print(f"[ERROR] No se encontró 'project.json' en '{directorio_proyecto}'.")
        sys.exit(1)

    with open(project_json_path, "r", encoding="utf-8-sig") as f:
        try:
            project_data = json.load(f)
        except Exception as e:
            print(f"[ERROR] Error al parsear 'project.json': {e}")
            sys.exit(1)

    codigo_proyecto = project_data.get("projectCode", "PROYECTO_AXON")

    if not ruta_salida:
        ruta_salida = f"{codigo_proyecto}.axon.zip"

    # Revisar carpeta bocetos
    bocetos_dir = os.path.join(directorio_proyecto, "bocetos")
    bocetos_meta = []
    if os.path.exists(bocetos_dir) and os.path.isdir(bocetos_dir):
        for fname in sorted(os.listdir(bocetos_dir)):
            fpath = os.path.join(bocetos_dir, fname)
            if os.path.isfile(fpath) and fname.lower().endswith(('.png', '.jpg', '.jpeg', '.pdf', '.webp')):
                sha = calcular_sha256(fpath)
                bocetos_meta.append({
                    "file": f"bocetos/{fname}",
                    "sha256": sha
                })

    # Preparar metadata.json ALCOA+
    metadata = {
        "projectCode": codigo_proyecto,
        "projectName": project_data.get("projectName", ""),
        "client": project_data.get("client", ""),
        "version": "Rev. 1.0",
        "createdAt": datetime.now(timezone.utc).isoformat(),
        "createdBy": "Agente IA Local / CLI Empaquetador",
        "gampCategory": 4,
        "totalSheets": len(project_data.get("sheets", [])),
        "bocetos": bocetos_meta
    }

    metadata_json_path = os.path.join(directorio_proyecto, "metadata.json")
    with open(metadata_json_path, "w", encoding="utf-8") as f:
        json.dump(metadata, f, ensure_ascii=False, indent=2)

    # Crear el archivo ZIP
    print(f"[*] Empaquetando '{codigo_proyecto}' hacia '{ruta_salida}'...")
    with zipfile.ZipFile(ruta_salida, "w", zipfile.ZIP_DEFLATED, compresslevel=6) as z:
        z.write(project_json_path, "project.json")
        z.write(metadata_json_path, "metadata.json")

        if os.path.exists(bocetos_dir):
            for fname in os.listdir(bocetos_dir):
                fpath = os.path.join(bocetos_dir, fname)
                if os.path.isfile(fpath):
                    z.write(fpath, f"bocetos/{fname}")

        preview_dir = os.path.join(directorio_proyecto, "preview")
        if os.path.exists(preview_dir):
            for fname in os.listdir(preview_dir):
                fpath = os.path.join(preview_dir, fname)
                if os.path.isfile(fpath):
                    z.write(fpath, f"preview/{fname}")

    print(f"[OK] Paquete creado exitosamente: {ruta_salida} ({os.path.getsize(ruta_salida)} bytes)")
    print(f"[OK] Bocetos registrados con hash SHA-256: {len(bocetos_meta)}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Uso: python scripts/empaquetar_proyecto.py <CARPETA_PROYECTO> [--salida <ARCHIVO.axon.zip>]")
        sys.exit(1)

    dir_proy = sys.argv[1]
    out_file = None
    if len(sys.argv) >= 4 and sys.argv[2] in ["--salida", "-o"]:
        out_file = sys.argv[3]

    empaquetar(dir_proy, out_file)
