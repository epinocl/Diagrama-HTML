import { create } from 'zustand';
import { 
  Point2D, 
  ComponentEntity, 
  WireNet, 
  WireSegment, 
  GeometryEntity, 
  ProjectDocument,
  SheetDocument,
  ConnectionPort
} from '../cad/types';
import { splitWireSegment, extendWireSegment, snapToGrid } from '../cad/topology';
import { exportProjectToZip, importProjectFromZip, downloadBlob } from '../cad/zipPackage';

export type CadTool = 'select' | 'wire' | 'cut' | 'extend' | 'component' | 'text' | 'rect' | 'pan';
export type CadTheme = 'dark_autocad' | 'print_white';

interface CadState {
  // Metadatos del proyecto
  projectCode: string;
  projectName: string;
  client: string;
  activeSheetId: string;
  activeSheetIndex: number;
  sheets: SheetDocument[];
  sketches: Record<string, string>;

  // Capa de Boceto de Referencia (Underlay)
  showSketchUnderlay: boolean;
  sketchOpacity: number;
  isPaletteOpen: boolean;

  // Notificaciones de usuario
  notification: string | null;

  // Configuración de visualización
  tool: CadTool;
  theme: CadTheme;
  zoom: number;
  pan: Point2D;
  gridSize: number;
  snapGridEnabled: boolean;
  snapPortEnabled: boolean;

  // Inspector de propiedades
  isInspectorOpen: boolean;
  isInspectorFloating: boolean;

  // Entidades del plano activo
  selectedIds: string[];
  components: ComponentEntity[];
  wires: WireNet[];
  geometries: GeometryEntity[];

  // Acciones UI
  setTool: (tool: CadTool) => void;
  setTheme: (theme: CadTheme) => void;
  setZoom: (zoom: number) => void;
  setPan: (pan: Point2D) => void;
  toggleInspector: () => void;
  setInspectorFloating: (floating: boolean) => void;
  toggleSketchUnderlay: () => void;
  setSketchOpacity: (opacity: number) => void;
  togglePalette: () => void;
  showNotification: (msg: string) => void;
  
  // Selección
  selectEntity: (id: string, multiple?: boolean) => void;
  clearSelection: () => void;

  // Modificación de componentes y símbolos IEC
  addComponent: (comp: ComponentEntity) => void;
  insertIecSymbol: (symbolId: string, name: string, category: string) => void;
  updateComponentPosition: (id: string, pos: Point2D) => void;
  updateComponentProperty: (id: string, key: string, value: string) => void;
  deleteSelected: () => void;

  // Modificación de cables
  addWireSegment: (netCode: string, p1: Point2D, p2: Point2D, potential?: WireNet['potential']) => void;
  splitSegmentAtPoint: (segmentId: string, point: Point2D) => void;
  extendSegment: (segmentId: string, endToExtend: 'p1' | 'p2', targetPoint: Point2D) => void;

  // Operaciones de Contenedor Portable .axon.zip
  loadProjectDocument: (doc: ProjectDocument, sketches?: Record<string, string>) => void;
  importZipFile: (file: File | Blob) => Promise<void>;
  exportCurrentZip: () => Promise<void>;
  setActiveSheetIndex: (idx: number) => void;
}

export const useCadStore = create<CadState>((set, get) => ({
  projectCode: 'DE-5266',
  projectName: 'Control Visión Blistera 3',
  client: 'Eurofarma Chile SpA',
  activeSheetId: 'sheet_01',
  activeSheetIndex: 0,
  sheets: [],
  sketches: {},
  showSketchUnderlay: true,
  sketchOpacity: 0.35,
  isPaletteOpen: false,
  notification: null,

  tool: 'select',
  theme: 'dark_autocad',
  zoom: 1.0,
  pan: { x: 0, y: 0 },
  gridSize: 4,
  snapGridEnabled: true,
  snapPortEnabled: true,

  isInspectorOpen: true,
  isInspectorFloating: false,

  selectedIds: [],
  components: [
    {
      id: 'comp_km1',
      type: 'iec_component',
      symbolId: 'contactor_potencia',
      tag: '-KM1',
      functionText: 'Contactor Principal M1',
      position: { x: 120, y: 160 },
      rotation: 0,
      scale: 1,
      layer: 'Maniobra',
      attributes: {
        'Fabricante': 'Siemens',
        'Modelo': '3RT2015-1BB41',
        'Tensión Bobina': '24 VDC',
        'Corriente Ie': '7 A'
      },
      ports: [
        { id: 'km1_A1', componentId: 'comp_km1', label: 'A1', relPosition: { x: 0, y: -24 }, direction: 'top', type: 'power_in', connectedWireIds: [] },
        { id: 'km1_A2', componentId: 'comp_km1', label: 'A2', relPosition: { x: 0, y: 24 }, direction: 'bottom', type: 'power_out', connectedWireIds: [] },
        { id: 'km1_13', componentId: 'comp_km1', label: '13', relPosition: { x: 20, y: -24 }, direction: 'top', type: 'signal_in', connectedWireIds: [] },
        { id: 'km1_14', componentId: 'comp_km1', label: '14', relPosition: { x: 20, y: 24 }, direction: 'bottom', type: 'signal_out', connectedWireIds: [] }
      ]
    },
    {
      id: 'comp_q1',
      type: 'iec_component',
      symbolId: 'disyuntor_magnetotermico',
      tag: '-Q1',
      functionText: 'Protección Motor M1',
      position: { x: 120, y: 60 },
      rotation: 0,
      scale: 1,
      layer: 'Fuerza',
      attributes: {
        'Fabricante': 'Schneider Electric',
        'Modelo': 'GV2ME08',
        'Rango Ajuste': '2.5 - 4.0 A'
      },
      ports: [
        { id: 'q1_1', componentId: 'comp_q1', label: '1/L1', relPosition: { x: 0, y: -24 }, direction: 'top', type: 'power_in', connectedWireIds: [] },
        { id: 'q1_2', componentId: 'comp_q1', label: '2/T1', relPosition: { x: 0, y: 24 }, direction: 'bottom', type: 'power_out', connectedWireIds: [] }
      ]
    }
  ],
  wires: [
    {
      id: 'net_L1',
      code: 'L1',
      potential: 'PHASE_L1',
      connectedPortIds: ['q1_2', 'km1_A1'],
      segments: [
        { id: 'seg_1', netId: 'net_L1', p1: { x: 120, y: 84 }, p2: { x: 120, y: 136 }, calibre: '2.5 mm²', color: '#ff4444' }
      ]
    }
  ],
  geometries: [],

  setTool: (tool) => set({ tool }),
  setTheme: (theme) => set({ theme }),
  setZoom: (zoom) => set({ zoom: Math.min(Math.max(zoom, 0.2), 5.0) }),
  setPan: (pan) => set({ pan }),
  toggleInspector: () => set((s) => ({ isInspectorOpen: !s.isInspectorOpen })),
  setInspectorFloating: (isInspectorFloating) => set({ isInspectorFloating }),
  toggleSketchUnderlay: () => set((s) => ({ showSketchUnderlay: !s.showSketchUnderlay })),
  setSketchOpacity: (sketchOpacity) => set({ sketchOpacity }),
  togglePalette: () => set((s) => ({ isPaletteOpen: !s.isPaletteOpen })),

  showNotification: (msg: string) => {
    set({ notification: msg });
    setTimeout(() => {
      if (get().notification === msg) set({ notification: null });
    }, 3000);
  },

  selectEntity: (id, multiple = false) => set((s) => ({
    selectedIds: multiple ? (s.selectedIds.includes(id) ? s.selectedIds.filter(x => x !== id) : [...s.selectedIds, id]) : [id]
  })),

  clearSelection: () => set({ selectedIds: [] }),

  addComponent: (comp) => set((s) => ({ components: [...s.components, comp] })),

  insertIecSymbol: (symbolId, name, category) => set((s) => {
    const id = `comp_${Date.now()}`;
    const nextNum = s.components.filter(c => c.symbolId === symbolId).length + 1;
    const tagPrefix = symbolId.includes('contactor') ? '-KM' : 
                      symbolId.includes('disyuntor') ? '-Q' : 
                      symbolId.includes('fuente') ? '-PS' : 
                      symbolId.includes('motor') ? '-M' : 
                      symbolId.includes('variador') ? '-U' : '-X';

    // Crear bornas por defecto según categoría
    const ports: ConnectionPort[] = [
      { id: `${id}_1`, componentId: id, label: '1', relPosition: { x: 0, y: -24 }, direction: 'top', type: 'power_in', connectedWireIds: [] },
      { id: `${id}_2`, componentId: id, label: '2', relPosition: { x: 0, y: 24 }, direction: 'bottom', type: 'power_out', connectedWireIds: [] }
    ];

    const newComp: ComponentEntity = {
      id,
      type: 'iec_component',
      symbolId,
      tag: `${tagPrefix}${nextNum}`,
      functionText: name,
      position: { x: 200, y: 150 },
      rotation: 0,
      scale: 1,
      layer: category === 'fuerza' ? 'Fuerza' : 'Control',
      attributes: {
        'Tipo': name,
        'Fabricante': 'AXON Estándar'
      },
      ports
    };

    return {
      components: [...s.components, newComp],
      selectedIds: [id],
      isPaletteOpen: false
    };
  }),

  updateComponentPosition: (id, pos) => set((s) => {
    const { gridSize, snapGridEnabled } = s;
    const finalPos = snapGridEnabled ? snapToGrid(pos, gridSize) : pos;
    const comp = s.components.find(c => c.id === id);
    if (!comp) return s;

    const deltaX = finalPos.x - comp.position.x;
    const deltaY = finalPos.y - comp.position.y;

    const updatedComponents = s.components.map(c => 
      c.id === id ? { ...c, position: finalPos } : c
    );

    const portIds = comp.ports.map(p => p.id);
    const updatedWires = s.wires.map(net => {
      const hasConnection = net.connectedPortIds.some(pid => portIds.includes(pid));
      if (!hasConnection) return net;

      const updatedSegments = net.segments.map(seg => {
        let newP1 = { ...seg.p1 };
        let newP2 = { ...seg.p2 };

        comp.ports.forEach(port => {
          const oldAbsPortPos = { x: comp.position.x + port.relPosition.x, y: comp.position.y + port.relPosition.y };
          if (Math.hypot(seg.p1.x - oldAbsPortPos.x, seg.p1.y - oldAbsPortPos.y) < 2) {
            newP1 = { x: newP1.x + deltaX, y: newP1.y + deltaY };
          }
          if (Math.hypot(seg.p2.x - oldAbsPortPos.x, seg.p2.y - oldAbsPortPos.y) < 2) {
            newP2 = { x: newP2.x + deltaX, y: newP2.y + deltaY };
          }
        });

        return { ...seg, p1: newP1, p2: newP2 };
      });

      return { ...net, segments: updatedSegments };
    });

    return { components: updatedComponents, wires: updatedWires };
  }),

  updateComponentProperty: (id, key, value) => set((s) => ({
    components: s.components.map(c => {
      if (c.id !== id) return c;
      if (key === 'tag') return { ...c, tag: value };
      if (key === 'functionText') return { ...c, functionText: value };
      return { ...c, attributes: { ...c.attributes, [key]: value } };
    })
  })),

  deleteSelected: () => set((s) => ({
    components: s.components.filter(c => !s.selectedIds.includes(c.id)),
    wires: s.wires.map(w => ({
      ...w,
      segments: w.segments.filter(seg => !s.selectedIds.includes(seg.id))
    })).filter(w => w.segments.length > 0),
    geometries: s.geometries.filter(g => !s.selectedIds.includes(g.id)),
    selectedIds: []
  })),

  addWireSegment: (netCode, p1, p2, potential = 'SIGNAL') => set((s) => {
    const newSeg: WireSegment = {
      id: `seg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      netId: netCode,
      p1,
      p2,
      calibre: '1.5 mm²',
      color: potential === 'PHASE_L1' ? '#ff4444' : potential === 'NEUTRAL' ? '#00bfff' : '#10b981'
    };

    const existingNet = s.wires.find(w => w.code === netCode);
    if (existingNet) {
      return {
        wires: s.wires.map(w => w.code === netCode ? { ...w, segments: [...w.segments, newSeg] } : w)
      };
    } else {
      const newNet: WireNet = {
        id: `net_${Date.now()}`,
        code: netCode,
        potential,
        segments: [newSeg],
        connectedPortIds: []
      };
      return { wires: [...s.wires, newNet] };
    }
  }),

  splitSegmentAtPoint: (segmentId, point) => set((s) => {
    let targetSegment: WireSegment | null = null;
    let parentNet: WireNet | null = null;

    for (const net of s.wires) {
      const found = net.segments.find(seg => seg.id === segmentId);
      if (found) {
        targetSegment = found;
        parentNet = net;
        break;
      }
    }

    if (!targetSegment || !parentNet) return s;

    const [s1, s2] = splitWireSegment(targetSegment, point);

    return {
      wires: s.wires.map(net => {
        if (net.id !== parentNet!.id) return net;
        return {
          ...net,
          segments: net.segments.flatMap(seg => seg.id === segmentId ? [s1, s2] : [seg])
        };
      })
    };
  }),

  extendSegment: (segmentId, endToExtend, targetPoint) => set((s) => ({
    wires: s.wires.map(net => ({
      ...net,
      segments: net.segments.map(seg => 
        seg.id === segmentId ? extendWireSegment(seg, endToExtend, targetPoint) : seg
      )
    }))
  })),

  // Cargar Documento Completo
  loadProjectDocument: (doc, sketches = {}) => {
    const sheets = doc.sheets || [];
    const activeSheet = sheets.find(s => s.id === doc.activeSheetId) || sheets[0];
    const sheetIdx = sheets.findIndex(s => s.id === activeSheet?.id);

    set({
      projectCode: doc.projectCode,
      projectName: doc.projectName,
      client: doc.client,
      sheets,
      activeSheetIndex: sheetIdx >= 0 ? sheetIdx : 0,
      activeSheetId: activeSheet?.id || 'sheet_01',
      components: activeSheet?.components || [],
      wires: activeSheet?.wires || [],
      geometries: activeSheet?.geometries || [],
      sketches,
      selectedIds: []
    });
    get().showNotification(`✓ Proyecto ${doc.projectCode} cargado (${sheets.length} láminas)`);
  },

  setActiveSheetIndex: (idx) => {
    const { sheets } = get();
    if (idx >= 0 && idx < sheets.length) {
      const targetSheet = sheets[idx];
      set({
        activeSheetIndex: idx,
        activeSheetId: targetSheet.id,
        components: targetSheet.components || [],
        wires: targetSheet.wires || [],
        geometries: targetSheet.geometries || [],
        selectedIds: []
      });
    }
  },

  // Importar desde archivo .axon.zip
  importZipFile: async (file) => {
    try {
      const { project, sketches } = await importProjectFromZip(file);
      get().loadProjectDocument(project, sketches);
    } catch (err: any) {
      console.error('Error importando ZIP:', err);
      get().showNotification(`❌ Error importando paquete: ${err.message}`);
    }
  },

  // Exportar proyecto actual a .axon.zip
  exportCurrentZip: async () => {
    const state = get();
    const currentDoc: ProjectDocument = {
      schemaVersion: '1.0',
      projectCode: state.projectCode,
      projectName: state.projectName,
      client: state.client,
      standard: 'IEC_60617',
      format: 'DIN_ISO_5457_A3',
      activeSheetId: state.activeSheetId,
      sheets: state.sheets.length > 0 ? state.sheets.map((s, idx) => 
        idx === state.activeSheetIndex ? {
          ...s,
          components: state.components,
          wires: state.wires,
          geometries: state.geometries
        } : s
      ) : [
        {
          id: state.activeSheetId,
          meta: {
            sheetNumber: 1,
            sheetCode: '01',
            titleShort: 'Circuito',
            titleLong: state.projectName,
            discipline: 'Fuerza & Control',
            date: new Date().toISOString().split('T')[0]
          },
          components: state.components,
          wires: state.wires,
          geometries: state.geometries
        }
      ]
    };

    const zipBlob = await exportProjectToZip(currentDoc, {
      projectCode: state.projectCode,
      createdBy: 'AXON CAD Web'
    });

    downloadBlob(zipBlob, `${state.projectCode}_AXON_CAD.axon.zip`);
    get().showNotification(`📦 ${state.projectCode}_AXON_CAD.axon.zip exportado`);
  }
}));
