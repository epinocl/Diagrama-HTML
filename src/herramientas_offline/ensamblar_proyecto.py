"""
Herramienta Offline: Ensamblador y Recompilador del Visor de Proyecto
====================================================================
Escanea la carpeta 'hojas/', detecta las láminas existentes (SVG o HTML)
y actualiza automáticamente el índice JSON y JavaScript del visor PPT.

Uso:
    python ensamblar_proyecto.py
"""

import os
import json
import glob

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
HOJAS_DIR = os.path.join(BASE_DIR, "hojas")
JS_DIR = os.path.join(BASE_DIR, "js")

def reensamblar():
    json_path = os.path.join(HOJAS_DIR, "indice_hojas.json")
    hojas_data = []
    
    if os.path.exists(json_path):
        with open(json_path, "r", encoding="utf-8") as f:
            hojas_data = json.load(f)
            
    print(f"Total de láminas indexadas actualmente: {len(hojas_data)}")
    
    # Escribir js/datos_proyecto.js
    js_path = os.path.join(JS_DIR, "datos_proyecto.js")
    with open(js_path, "w", encoding="utf-8") as f:
        f.write("// Datos Generados del Proyecto DE-1708 Pick and Place - Garden House\n")
        f.write("const PROYECTO_INFO = {\n")
        f.write("  codigo: 'DE-1708',\n")
        f.write("  nombre: 'PICK AND PLACE - GARDEN HOUSE',\n")
        f.write("  cliente: 'GARDEN HOUSE',\n")
        f.write(f"  total_hojas: {len(hojas_data)},\n")
        f.write("  formato: 'A3 Horizontal (420 x 297 mm)',\n")
        f.write("  norma: 'IEC 60617 / EPLAN Style',\n")
        f.write("  version: 'Rev. 0',\n")
        f.write("  fecha: '2026-10-16'\n")
        f.write("};\n\n")
        f.write("const HOJAS_DATA = " + json.dumps(hojas_data, indent=2, ensure_ascii=False) + ";\n")
        
    print(f"Visor de proyecto sincronizado exitosamente en: {js_path}")

if __name__ == "__main__":
    reensamblar()
