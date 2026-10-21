"""
Herramienta Offline: Generador de Nueva Lámina A3 desde Plantilla
==================================================================
Crea una nueva lámina de plano eléctrico en formato HTML/SVG A3 lista para
editar y dibujar a partir de un boceto a mano alzada.

Regla de ubicación obligatoria:
- Se guarda en la carpeta del proyecto o en la raíz del bosquejo, nunca
  en HERRAMIENTAS salvo prueba interna.

Uso:
    python crear_nueva_hoja.py [num_hoja] [codigo_proyecto] [cliente] [titulo] [disciplina] [ruta_destino_o_bosquejo]

Ejemplo:
    python crear_nueva_hoja.py 5 DE-5266 "EUROFARMA" "CIRCUITO INTERLOCK" "Control" "C:\\...\\CAD\\BOSQUEJO"
"""

import sys
import os

TOOL_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
TEMPLATE_PATH = os.path.join(TOOL_ROOT, "plantilla.html")

def resolver_carpeta_hojas(destino_arg=None):
    if not destino_arg:
        # Usar directorio actual de trabajo
        cwd = os.getcwd()
        if "HERRAMIENTAS" in cwd:
            return os.path.join(TOOL_ROOT, "hojas")
        destino_arg = cwd

    destino_abs = os.path.abspath(destino_arg)
    
    # Si es carpeta BOSQUEJO o archivo dentro
    folder_name = os.path.basename(destino_abs).upper()
    if folder_name == "BOSQUEJO" or folder_name.startswith("BOSQUEJO"):
        raiz = os.path.dirname(destino_abs)
    elif os.path.isfile(destino_abs):
        parent = os.path.dirname(destino_abs)
        if os.path.basename(parent).upper().startswith("BOSQUEJO"):
            raiz = os.path.dirname(parent)
        else:
            raiz = parent
    else:
        raiz = destino_abs

    hojas_dir = os.path.join(raiz, "dependencias", "hojas")
    os.makedirs(hojas_dir, exist_ok=True)
    return hojas_dir

def crear_hoja(num_hoja=1, codigo="DE-PROYECTO", cliente="CLIENTE AXON", titulo="NUEVO CIRCUITO", disciplina="Control", ruta_destino=None):
    num_str = f"{int(num_hoja):02d}"
    hojas_dir = resolver_carpeta_hojas(ruta_destino)
    out_file = os.path.join(hojas_dir, f"hoja_{num_str}.html")
    
    with open(TEMPLATE_PATH, "r", encoding="utf-8") as f:
        content = f.read()
        
    # Reemplazar campos del cajetín
    content = content.replace("GARDEN HOUSE", cliente)
    content = content.replace("DE-XXXX", codigo)
    content = content.replace("NUEVA MAQUINA / PROYECTO", titulo)
    content = content.replace("01 / 01", f"{num_str} / --")
    content = content.replace('id="cajetinDisciplina">Control<', f'id="cajetinDisciplina">{disciplina}<')
    clean_cod = codigo.replace("DE-", "").replace(" ", "")
    content = content.replace("XXXX-E-001", f"{clean_cod}-E-0{num_str}")
    content = content.replace("<title>Plantilla A3 - Plano Eléctrico Industrial AXON</title>",
                              f"<title>Lámina {num_str} - {titulo} ({codigo})</title>")
                              
    with open(out_file, "w", encoding="utf-8") as f:
        f.write(content)
        
    print(f"Lámina creada exitosamente:")
    print(f" -> Archivo: {out_file}")
    print(f" -> Hoja N°: {num_str}")
    print(f" -> Título: {titulo}")
    print(f" -> Proyecto: {codigo} ({cliente})")

if __name__ == "__main__":
    num = sys.argv[1] if len(sys.argv) > 1 else 1
    cod = sys.argv[2] if len(sys.argv) > 2 else "DE-PROYECTO"
    cli = sys.argv[3] if len(sys.argv) > 3 else "CLIENTE AXON"
    tit = sys.argv[4] if len(sys.argv) > 4 else "CIRCUITO NUEVO"
    dis = sys.argv[5] if len(sys.argv) > 5 else "Control"
    dest = sys.argv[6] if len(sys.argv) > 6 else None
    
    crear_hoja(num, cod, cli, tit, dis, dest)
