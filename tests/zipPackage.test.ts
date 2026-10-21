import { describe, it, expect } from 'vitest';
import { exportProjectToZip, importProjectFromZip } from '../src/cad/zipPackage';
import { ProjectDocument } from '../src/cad/types';

describe('Contenedor Portable .axon.zip — Empaquetado e Importación (ZIP-03)', () => {

  const sampleProject: ProjectDocument = {
    schemaVersion: '1.0',
    projectCode: 'DE-5266',
    projectName: 'CONTROL VISION BLISTERA 3',
    client: 'EUROFARMA CHILE SPA',
    standard: 'IEC_60617',
    format: 'DIN_ISO_5457_A3',
    activeSheetId: 'sheet_01',
    sheets: [
      {
        id: 'sheet_01',
        meta: {
          sheetNumber: 1,
          sheetCode: '01',
          titleShort: 'Fuerza',
          titleLong: 'Circuito Alimentación Principal 380V',
          discipline: 'Fuerza',
          designer: 'E. Pino',
          revision: 'Rev. 1.0'
        },
        components: [
          {
            id: 'km1',
            type: 'iec_component',
            symbolId: 'contactor_potencia',
            tag: '-KM1',
            position: { x: 120, y: 160 },
            rotation: 0,
            scale: 1,
            layer: 'Fuerza',
            attributes: { 'Fabricante': 'Siemens', 'Modelo': '3RT2015' },
            ports: [
              { id: 'p_A1', componentId: 'km1', label: 'A1', relPosition: { x: 0, y: -24 }, direction: 'top', type: 'power_in', connectedWireIds: [] }
            ]
          }
        ],
        wires: [
          {
            id: 'net_L1',
            code: 'L1',
            potential: 'PHASE_L1',
            connectedPortIds: ['p_A1'],
            segments: [
              { id: 's1', netId: 'net_L1', p1: { x: 120, y: 80 }, p2: { x: 120, y: 136 }, calibre: '2.5 mm²' }
            ]
          }
        ],
        geometries: []
      }
    ]
  };

  it('exportProjectToZip genera un Blob comprimido válido con project.json y metadata.json', async () => {
    const zipBlob = await exportProjectToZip(sampleProject, { createdBy: 'Test Runner' });
    expect(zipBlob).toBeDefined();
    expect(zipBlob.size).toBeGreaterThan(100);
  });

  it('importProjectFromZip desempaqueta y reconstituye el proyecto con fidelidad total', async () => {
    const zipBlob = await exportProjectToZip(sampleProject, {
      version: 'Rev. 2.0',
      createdBy: 'Agente IA Antigravity'
    });

    const unpacked = await importProjectFromZip(zipBlob);

    expect(unpacked.project.projectCode).toBe('DE-5266');
    expect(unpacked.project.client).toBe('EUROFARMA CHILE SPA');
    expect(unpacked.project.sheets).toHaveLength(1);

    const sheet = unpacked.project.sheets[0];
    expect(sheet.components).toHaveLength(1);
    expect(sheet.components[0].tag).toBe('-KM1');
    expect(sheet.components[0].ports).toHaveLength(1);
    expect(sheet.components[0].ports[0].label).toBe('A1');

    expect(sheet.wires).toHaveLength(1);
    expect(sheet.wires[0].code).toBe('L1');
    expect(sheet.wires[0].segments[0].calibre).toBe('2.5 mm²');

    expect(unpacked.metadata.createdBy).toBe('Agente IA Antigravity');
    expect(unpacked.metadata.gampCategory).toBe(4);
  });

  it('importProjectFromZip arroja error si el ZIP no contiene project.json', async () => {
    const JSZip = (await import('jszip')).default;
    const emptyZip = new JSZip();
    emptyZip.file('archivo_invalido.txt', 'contenido');
    const emptyBlob = await emptyZip.generateAsync({ type: 'blob' });

    await expect(importProjectFromZip(emptyBlob)).rejects.toThrow(
      'El archivo ZIP no contiene un "project.json" válido'
    );
  });

});
