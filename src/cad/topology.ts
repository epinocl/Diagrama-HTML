import { Point2D, WireSegment, ConnectionPort, PortDirection } from './types';

/**
 * Ancla un punto a la cuadrícula métrica (defecto 4 mm / 8 mm).
 */
export function snapToGrid(point: Point2D, gridSize: number = 4): Point2D {
  return {
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
  };
}

/**
 * Distancia euclidiana entre dos puntos.
 */
export function distance(p1: Point2D, p2: Point2D): number {
  return Math.hypot(p2.x - p1.x, p2.y - p1.y);
}

/**
 * Busca el puerto más cercano dentro de un radio umbral (snap to pin).
 */
export function snapToNearestPort(
  point: Point2D,
  ports: { port: ConnectionPort; absolutePos: Point2D }[],
  threshold: number = 8
): { port: ConnectionPort | null; snappedPoint: Point2D } {
  let closestPort: ConnectionPort | null = null;
  let minDistance = threshold;
  let bestPoint = { ...point };

  for (const item of ports) {
    const d = distance(point, item.absolutePos);
    if (d <= minDistance) {
      minDistance = d;
      closestPort = item.port;
      bestPoint = { ...item.absolutePos };
    }
  }

  return { port: closestPort, snappedPoint: bestPoint };
}

/**
 * Ruteo ortogonal adaptativo en 90° (Manhattan Routing).
 * Genera esquinas limpias perpendiculares según la dirección de salida/llegada.
 */
export function routeOrthoWire(
  start: Point2D,
  end: Point2D,
  preferredAxis: 'horizontal_first' | 'vertical_first' = 'horizontal_first'
): Point2D[] {
  // Si ya son colineales en X o Y, es una línea recta
  if (start.x === end.x || start.y === end.y) {
    return [start, end];
  }

  if (preferredAxis === 'horizontal_first') {
    const corner: Point2D = { x: end.x, y: start.y };
    return [start, corner, end];
  } else {
    const corner: Point2D = { x: start.x, y: end.y };
    return [start, corner, end];
  }
}

/**
 * Corta (Split) un segmento de cable en dos subtramos al hacer clic en un punto intermedio.
 */
export function splitWireSegment(
  segment: WireSegment,
  splitPoint: Point2D,
  newIdPrefix: string = 'seg_split_'
): [WireSegment, WireSegment] {
  const seg1: WireSegment = {
    ...segment,
    id: `${newIdPrefix}1_${Date.now()}`,
    p1: { ...segment.p1 },
    p2: { ...splitPoint }
  };

  const seg2: WireSegment = {
    ...segment,
    id: `${newIdPrefix}2_${Date.now()}`,
    p1: { ...splitPoint },
    p2: { ...segment.p2 }
  };

  return [seg1, seg2];
}

/**
 * Extiende un extremo de un segmento de cable hacia un punto objetivo.
 */
export function extendWireSegment(
  segment: WireSegment,
  endToExtend: 'p1' | 'p2',
  targetPoint: Point2D
): WireSegment {
  if (endToExtend === 'p1') {
    return { ...segment, p1: { ...targetPoint } };
  } else {
    return { ...segment, p2: { ...targetPoint } };
  }
}

/**
 * Detecta intersección geométrica entre dos segmentos de cable (para auto-nodos o puentes).
 */
export function findIntersection(s1: WireSegment, s2: WireSegment): Point2D | null {
  const x1 = s1.p1.x, y1 = s1.p1.y;
  const x2 = s1.p2.x, y2 = s1.p2.y;
  const x3 = s2.p1.x, y3 = s2.p1.y;
  const x4 = s2.p2.x, y4 = s2.p2.y;

  const denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
  if (denom === 0) return null; // Paralelas

  const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
  const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;

  if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
    return {
      x: Math.round(x1 + ua * (x2 - x1)),
      y: Math.round(y1 + ua * (y2 - y1))
    };
  }

  return null;
}
