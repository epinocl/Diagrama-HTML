// Base de datos de Simbologia Industrial AXON (Carga Offline Directa)
const BASE_DATOS_SIMBOLOS = [
  {
    "id": "fuente_poder_24v",
    "nombre": "Fuente de Poder 24VDC",
    "categoria": "fuerza",
    "descripcion": "Fuente switching 24VDC para alimentación de control y sensores",
    "tags": [
      "PS",
      "24VDC",
      "GND",
      "L",
      "N"
    ],
    "archivo_png": "simbologia/fuerza/fuente_poder_24v.png",
    "archivo_svg": "simbologia/fuerza/fuente_poder_24v.svg",
    "ancho_px": 459,
    "alto_px": 239
  },
  {
    "id": "disyuntor_diferencial",
    "nombre": "Disyuntor con Diferencial",
    "categoria": "fuerza",
    "descripcion": "Interruptor termomagnético bifásico/trifásico con protección diferencial",
    "tags": [
      "QA1",
      "Id",
      "2P",
      "Diferencial"
    ],
    "archivo_png": "simbologia/fuerza/disyuntor_diferencial.png",
    "archivo_svg": "simbologia/fuerza/disyuntor_diferencial.svg",
    "ancho_px": 459,
    "alto_px": 238
  },
  {
    "id": "optocupla_bobina",
    "nombre": "Optocupla Bobina",
    "categoria": "control",
    "descripcion": "Bobina de excitación de optoacoplador o relé de interfaz 24VDC",
    "tags": [
      "OP",
      "A1",
      "A2",
      "24V"
    ],
    "archivo_png": "simbologia/control/optocupla_bobina.png",
    "archivo_svg": "simbologia/control/optocupla_bobina.svg",
    "ancho_px": 459,
    "alto_px": 239
  },
  {
    "id": "bobina_electrovalvula",
    "nombre": "Bobina de Electroválvula",
    "categoria": "neumatica",
    "descripcion": "Solenoide de accionamiento para válvula neumática",
    "tags": [
      "V",
      "A1",
      "A2",
      "Solenoide"
    ],
    "archivo_png": "simbologia/neumatica/bobina_electrovalvula.png",
    "archivo_svg": "simbologia/neumatica/bobina_electrovalvula.svg",
    "ancho_px": 459,
    "alto_px": 238
  },
  {
    "id": "contacto_no_optocupla",
    "nombre": "Contacto NO de Optocupla",
    "categoria": "control",
    "descripcion": "Contacto normalmente abierto (13-14) de optoacoplador o relé",
    "tags": [
      "OP",
      "13",
      "14",
      "NO"
    ],
    "archivo_png": "simbologia/control/contacto_no_optocupla.png",
    "archivo_svg": "simbologia/control/contacto_no_optocupla.svg",
    "ancho_px": 459,
    "alto_px": 239
  },
  {
    "id": "valvula_3_2",
    "nombre": "Válvula Neumática 3/2",
    "categoria": "neumatica",
    "descripcion": "Válvula direccional 3 vías 2 posiciones monoestable",
    "tags": [
      "V",
      "Pneumatic",
      "3/2"
    ],
    "archivo_png": "simbologia/neumatica/valvula_3_2.png",
    "archivo_svg": "simbologia/neumatica/valvula_3_2.svg",
    "ancho_px": 459,
    "alto_px": 239
  },
  {
    "id": "valvula_5_2",
    "nombre": "Válvula Neumática 5/2",
    "categoria": "neumatica",
    "descripcion": "Válvula direccional 5 vías 2 posiciones biestable/monoestable",
    "tags": [
      "V",
      "Pneumatic",
      "5/2"
    ],
    "archivo_png": "simbologia/neumatica/valvula_5_2.png",
    "archivo_svg": "simbologia/neumatica/valvula_5_2.svg",
    "ancho_px": 459,
    "alto_px": 238
  },
  {
    "id": "in_out_modulo_plc",
    "nombre": "IN/OUT Módulo PLC",
    "categoria": "plc_io",
    "descripcion": "Punto de conexión de entrada o salida de PLC Siemens con LED",
    "tags": [
      "DI",
      "DQ",
      "PLC",
      "I/O"
    ],
    "archivo_png": "simbologia/plc_io/in_out_modulo_plc.png",
    "archivo_svg": "simbologia/plc_io/in_out_modulo_plc.svg",
    "ancho_px": 459,
    "alto_px": 239
  },
  {
    "id": "motor_trifasico_pe",
    "nombre": "Motor Trifásico con PE",
    "categoria": "fuerza",
    "descripcion": "Motor eléctrico asíncrono trifásico con conexión de puesta a tierra",
    "tags": [
      "M",
      "3~",
      "PE",
      "U",
      "V",
      "W"
    ],
    "archivo_png": "simbologia/fuerza/motor_trifasico_pe.png",
    "archivo_svg": "simbologia/fuerza/motor_trifasico_pe.svg",
    "ancho_px": 459,
    "alto_px": 238
  },
  {
    "id": "conector_macho_hembra",
    "nombre": "Conector Macho y Hembra",
    "categoria": "bornas_conexiones",
    "descripcion": "Clavija y base de conexión multiconductor desacoplable",
    "tags": [
      "X",
      "Macho",
      "Hembra",
      "Harting"
    ],
    "archivo_png": "simbologia/bornas_conexiones/conector_macho_hembra.png",
    "archivo_svg": "simbologia/bornas_conexiones/conector_macho_hembra.svg",
    "ancho_px": 459,
    "alto_px": 239
  },
  {
    "id": "referencia_cordon_multipar",
    "nombre": "Referencia a Cordón Multipar",
    "categoria": "bornas_conexiones",
    "descripcion": "Identificador de manguera o cordón multinúcleo apantallado",
    "tags": [
      "W",
      "Cordón",
      "Multipar",
      "Cable"
    ],
    "archivo_png": "simbologia/bornas_conexiones/referencia_cordon_multipar.png",
    "archivo_svg": "simbologia/bornas_conexiones/referencia_cordon_multipar.svg",
    "ancho_px": 460,
    "alto_px": 239
  },
  {
    "id": "encoder_electrico",
    "nombre": "Encoder Eléctrico",
    "categoria": "sensores_campo",
    "descripcion": "Encoder incremental con señales A, B, Z (+, -, 0, 1, 2)",
    "tags": [
      "ENC",
      "Incremental",
      "A/B/Z",
      "24V"
    ],
    "archivo_png": "simbologia/sensores_campo/encoder_electrico.png",
    "archivo_svg": "simbologia/sensores_campo/encoder_electrico.svg",
    "ancho_px": 460,
    "alto_px": 238
  },
  {
    "id": "referencia_ida_vuelta_cable",
    "nombre": "Referencia Ida/Vuelta Cable",
    "categoria": "bornas_conexiones",
    "descripcion": "Flecha de salto de señal / potencial hacia otra lámina del plano",
    "tags": [
      "REF",
      "Cruzada",
      "Interrupción",
      "Potencial"
    ],
    "archivo_png": "simbologia/bornas_conexiones/referencia_ida_vuelta_cable.png",
    "archivo_svg": "simbologia/bornas_conexiones/referencia_ida_vuelta_cable.svg",
    "ancho_px": 460,
    "alto_px": 239
  },
  {
    "id": "bornera_paso",
    "nombre": "Bornera de Paso",
    "categoria": "bornas_conexiones",
    "descripcion": "Borne seccionable o de paso montado en riel DIN",
    "tags": [
      "X",
      "Borne",
      "Riel DIN"
    ],
    "archivo_png": "simbologia/bornas_conexiones/bornera_paso.png",
    "archivo_svg": "simbologia/bornas_conexiones/bornera_paso.svg",
    "ancho_px": 460,
    "alto_px": 238
  },
  {
    "id": "variador_frecuencia_vdf",
    "nombre": "Variador de Frecuencia VDF",
    "categoria": "accionamientos_vdf",
    "descripcion": "Convertidor de frecuencia para control de velocidad de motores",
    "tags": [
      "VDF",
      "Mitsubishi",
      "D700",
      "Inverter"
    ],
    "archivo_png": "simbologia/accionamientos_vdf/variador_frecuencia_vdf.png",
    "archivo_svg": "simbologia/accionamientos_vdf/variador_frecuencia_vdf.svg",
    "ancho_px": 460,
    "alto_px": 239
  },
  {
    "id": "cajetin_rotulo_axon",
    "nombre": "Cajetín / Rótulo de Proyecto A3",
    "categoria": "cajetines_marcos",
    "descripcion": "Rótulo técnico normalizado con campos de proyecto, cliente, fecha, lámina y aprobación",
    "tags": [
      "Cajetín",
      "Rótulo",
      "A3",
      "Título",
      "Norma"
    ],
    "archivo_png": "simbologia/cajetines_marcos/cajetin_rotulo_axon.png",
    "archivo_svg": "simbologia/cajetines_marcos/cajetin_rotulo_axon.svg",
    "ancho_px": 1813,
    "alto_px": 355
  }
];
