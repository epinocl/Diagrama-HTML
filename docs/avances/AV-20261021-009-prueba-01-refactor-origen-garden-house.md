# AV-20261021-009: Prueba 01 - Refactorización de Proyecto Origen (DE-4710 Garden House)

**Fecha:** 2026-10-21  
**Autor:** Antigravity / AXON Industrial Engineering  
**Hito:** PRUEBAS-01 / Refactorización Integral de Origen  
**Estado:** COMPLETADO Y VERIFICADO (100% Ignorado de Git, ZIP portable generado)

---

## 1. Resumen Ejecutivo
Se creó la carpeta aislada de pruebas:  
C:\\IA EPINO LOCAL\\DIAGRAMA-HTML\\pruebas\\prueba_01_refactor_origen\\  
(100% excluida de Git vía .gitignore para cumplir con las directrices de confidencialidad de cliente y buenas prácticas de ingeniería).

En esta carpeta se ejecutó la **refactorización completa del proyecto legado origen/ (DE-4710: 4710 GARDEN - CONTROL SEMAFORO-AGUA)**, transformándolo desde un conjunto de SVGs monolíticos y JavaScripts estáticos a la nueva arquitectura estructurada de **AXON CAD Web v3.1**.

---

## 2. Entidades y Láminas Refactorizadas

Se extrajeron, normalizaron y desacoplaron todos los componentes y cables del diagrama original en 4 láminas A3:

| Lámina | Título Normalizado | Disciplina | Componentes Independientes | Conductores Modelados |
|---|---|---|---|---|
| **01** | FUERZA 220V/24V | Fuerza | -F0 (Fusible 2A), -P0 (Piloto Blanca Red), -Q0 (Diferencial 2P 16A), -PS0 (Fuente Switching 24V 5A Mean Well) | Fases 220VAC (L, N), Rieles +24VDC y 0VDC |
| **02** | ENTRADAS PLC | PLC & I/O | -S1 (Bajo), -S2 (Medio), -S3 (Alto), -S4 (Rebalse), -S5 (Selector M/A), -PLC1 (Siemens LOGO! 24CE) | Distribución 24VDC, retorno de señales a I1..I5 |
| **03** | SALIDAS PLC | PLC & I/O | LOGO! Q1..Q4, -R1 (Alarma), -R2 (Bomba 1), -R3 (Bomba 2), -R4 (Desagüe) | Alimentación 24VDC a comunes, comando a bobinas A1/A2 |
| **04** | CONTROL SEMAFOROS | Control | -P1 (Verde), -P2 (Rojo), -P3 (Amarillo), -P4..-P7 (Bombas y Desagüe), contactos de relé | Líneas de enclavamiento y retornos 0V |

---

## 3. Trazabilidad Criptográfica ALCOA+ (Hashes SHA-256)
Se copiaron y verificaron los 4 bocetos originales de terreno a pruebas/prueba_01_refactor_origen/bocetos/:
- oceto_01.png: 040b206774e12e1ec73f707f1d4399e82110ea4ec93e36e35588301550c6fb0
- oceto_02.png: c6f24e9ae4fa06013a7bcfd8b3c675fc06346b856cbf0946261295b9d750cbb9
- oceto_03.png: e62c8fa40e0cf449219bfeea6a77d704ba4e320f78c800b70d4734b22c710214
- oceto_04.png: ba375c3db6d41ea9b0dd6bf1cc43270bb3f0683050fb2e26065584bf6041ec6

---

## 4. Artefactos de la Prueba Generados
- project.json: Esquema completo v1.0 estructurado con las 4 láminas y 21 componentes con bornas.
- metadata.json: Registro de autoría, versión, origen legado y hashes ALCOA+.
- DE-4710_GARDEN_HOUSE.axon.zip: Archivo comprimido portable de **1.33 MB** listo para Drag & Drop.
- README.md: Bitácora técnica de la prueba 01.
