/**
 * AXON CAD Web — Modelos de Datos Topológicos y Geométricos
 * Estándar: IEC 60617 / DIN ISO 5457 A3 / GAMP 5
 */

export interface Point2D {
  x: number;
  y: number;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type WirePotential = 
  | 'PHASE_L1' 
  | 'PHASE_L2' 
  | 'PHASE_L3' 
  | 'NEUTRAL' 
  | 'PE' 
  | 'DC_24V' 
  | 'DC_0V' 
  | 'SIGNAL' 
  | 'CONTROL';

export interface WireSegment {
  id: string;
  netId: string;
  p1: Point2D;
  p2: Point2D;
  calibre?: string;
  color?: string;
  strokeWidth?: number;
  dashArray?: string;
  isSelected?: boolean;
}

export interface WireNet {
  id: string;
  code: string;
  potential: WirePotential;
  segments: WireSegment[];
  connectedPortIds: string[];
}

export type PortDirection = 'top' | 'bottom' | 'left' | 'right';
export type PortType = 'power_in' | 'power_out' | 'signal_in' | 'signal_out' | 'neutral' | 'pe' | 'generic';

export interface ConnectionPort {
  id: string;
  componentId: string;
  label: string;
  relPosition: Point2D;
  direction: PortDirection;
  type: PortType;
  connectedWireIds: string[];
}

export interface ComponentEntity {
  id: string;
  type: 'iec_component';
  symbolId: string;
  tag: string;
  functionText?: string;
  position: Point2D;
  rotation: 0 | 90 | 180 | 270;
  scale: number;
  ports: ConnectionPort[];
  attributes: Record<string, string | undefined>;
  layer: string;
  isSelected?: boolean;
}

export type PrimitiveType = 'rect' | 'circle' | 'polyline' | 'path' | 'text' | 'dimension';

export interface GeometryEntity {
  id: string;
  type: PrimitiveType;
  position: Point2D;
  rotation?: number;
  width?: number;
  height?: number;
  radius?: number;
  points?: Point2D[];
  text?: string;
  fontSize?: number;
  stroke: string;
  fill: string;
  strokeWidth: number;
  layer: string;
  isSelected?: boolean;
}

export interface GroupEntity {
  id: string;
  type: 'group';
  name: string;
  childrenIds: string[];
  position: Point2D;
  rotation: number;
  isSelected?: boolean;
}

export type CanvasEntity = ComponentEntity | GeometryEntity | GroupEntity;

export interface SheetMetadata {
  sheetNumber: number;
  sheetCode: string;
  titleShort: string;
  titleLong: string;
  discipline: string;
  date?: string;
  designer?: string;
  reviewer?: string;
  revision?: string;
}

export interface SheetDocument {
  id: string;
  meta: SheetMetadata;
  components: ComponentEntity[];
  wires: WireNet[];
  geometries: GeometryEntity[];
  groups?: GroupEntity[];
}

export interface ProjectDocument {
  schemaVersion: string; // ej. "1.0"
  projectCode: string;   // ej. "DE-5266"
  projectName: string;   // ej. "CONTROL VISION BLISTERA 3"
  client: string;        // ej. "EUROFARMA CHILE SPA"
  standard: 'IEC_60617' | 'DIN_ISO_5457';
  format: 'DIN_ISO_5457_A3';
  activeSheetId: string;
  sheets: SheetDocument[];
}

export interface SketchReference {
  filename: string;
  sha256?: string;
  uploadedAt?: string;
}

export interface PackageMetadata {
  projectCode: string;
  version: string;
  createdAt: string;
  createdBy: string;
  gampCategory: number;
  bocetos: SketchReference[];
}
