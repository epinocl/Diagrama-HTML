import { describe, it, expect } from 'vitest';
import { 
  snapToGrid, 
  routeOrthoWire, 
  splitWireSegment, 
  extendWireSegment, 
  findIntersection,
  snapToNearestPort
} from '../src/cad/topology';
import { WireSegment, ConnectionPort } from '../src/cad/types';

describe('Motor Topológico CAD — Algoritmos de Líneas y Puertos (Fase 2)', () => {

  it('snapToGrid ancla coordenadas a múltiplos de 4 mm', () => {
    expect(snapToGrid({ x: 10.3, y: 19.8 }, 4)).toEqual({ x: 12, y: 20 });
    expect(snapToGrid({ x: 0, y: 1.8 }, 4)).toEqual({ x: 0, y: 0 });
    expect(snapToGrid({ x: 0, y: 2.1 }, 4)).toEqual({ x: 0, y: 4 });
    expect(snapToGrid({ x: 15, y: 31 }, 8)).toEqual({ x: 16, y: 32 });
  });

  it('routeOrthoWire genera esquinas limpias en 90°', () => {
    const start = { x: 100, y: 50 };
    const end = { x: 200, y: 150 };

    const path = routeOrthoWire(start, end, 'horizontal_first');
    expect(path).toHaveLength(3);
    expect(path[0]).toEqual(start);
    expect(path[1]).toEqual({ x: 200, y: 50 }); // Codo en 90°
    expect(path[2]).toEqual(end);
  });

  it('splitWireSegment corta un cable en dos segmentos independientes', () => {
    const seg: WireSegment = {
      id: 'seg_orig',
      netId: 'NET_24V',
      p1: { x: 0, y: 100 },
      p2: { x: 200, y: 100 },
      calibre: '1.5 mm²',
      color: '#00bfff'
    };

    const splitPoint = { x: 80, y: 100 };
    const [s1, s2] = splitWireSegment(seg, splitPoint);

    expect(s1.netId).toBe('NET_24V');
    expect(s1.p1).toEqual({ x: 0, y: 100 });
    expect(s1.p2).toEqual({ x: 80, y: 100 });

    expect(s2.netId).toBe('NET_24V');
    expect(s2.p1).toEqual({ x: 80, y: 100 });
    expect(s2.p2).toEqual({ x: 200, y: 100 });
  });

  it('extendWireSegment proyecta un extremo hacia el objetivo', () => {
    const seg: WireSegment = {
      id: 'seg_1',
      netId: 'NET_L1',
      p1: { x: 100, y: 100 },
      p2: { x: 200, y: 100 }
    };

    const extended = extendWireSegment(seg, 'p2', { x: 350, y: 100 });
    expect(extended.p1).toEqual({ x: 100, y: 100 });
    expect(extended.p2).toEqual({ x: 350, y: 100 });
  });

  it('findIntersection detecta correctamente cruce perpendicular de cables', () => {
    const s1: WireSegment = {
      id: 's1', netId: 'n1',
      p1: { x: 0, y: 50 }, p2: { x: 100, y: 50 }
    };
    const s2: WireSegment = {
      id: 's2', netId: 'n2',
      p1: { x: 50, y: 0 }, p2: { x: 50, y: 100 }
    };

    const cross = findIntersection(s1, s2);
    expect(cross).toEqual({ x: 50, y: 50 });
  });

  it('snapToNearestPort atrae el puntero magnéticamente a un borne IEC', () => {
    const mockPort: ConnectionPort = {
      id: 'port_A1',
      componentId: 'comp_KM1',
      label: 'A1',
      relPosition: { x: 0, y: -20 },
      direction: 'top',
      type: 'power_in',
      connectedWireIds: []
    };

    const portItems = [
      { port: mockPort, absolutePos: { x: 150, y: 100 } }
    ];

    const snapResult = snapToNearestPort({ x: 153, y: 104 }, portItems, 8);
    expect(snapResult.port?.id).toBe('port_A1');
    expect(snapResult.snappedPoint).toEqual({ x: 150, y: 100 });

    const noSnap = snapToNearestPort({ x: 170, y: 100 }, portItems, 8);
    expect(noSnap.port).toBeNull();
  });

});
