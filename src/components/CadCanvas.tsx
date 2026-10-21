import React, { useRef, useState } from 'react';
import { useCadStore } from '../store/useCadStore';
import { Point2D } from '../cad/types';
import { snapToGrid, snapToNearestPort, routeOrthoWire } from '../cad/topology';

export const CadCanvas: React.FC = () => {
  const { 
    theme, 
    zoom, 
    pan, 
    setPan,
    tool, 
    components, 
    wires, 
    selectedIds, 
    selectEntity, 
    clearSelection,
    updateComponentPosition,
    addWireSegment,
    splitSegmentAtPoint,
    gridSize,
    snapGridEnabled,
    snapPortEnabled
  } = useCadStore();

  const svgRef = useRef<SVGSVGElement>(null);

  // Estados interactivos locales para dibujo y arrastre
  const [draggingCompId, setDraggingCompId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<Point2D>({ x: 0, y: 0 });
  const [wireStartPoint, setWireStartPoint] = useState<Point2D | null>(null);
  const [mousePos, setMousePos] = useState<Point2D>({ x: 0, y: 0 });
  const [snappedPos, setSnappedPos] = useState<Point2D>({ x: 0, y: 0 });
  const [activePortId, setActivePortId] = useState<string | null>(null);

  // Convertir coordenadas del evento de ratón a coordenadas del plano A3
  const getCanvasCoords = (e: React.MouseEvent): Point2D => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    const rawX = (clientX - pan.x) / zoom;
    const rawY = (clientY - pan.y) / zoom;

    return { x: Math.round(rawX), y: Math.round(rawY) };
  };

  // Colectar todos los puertos magnéticos en coordenadas absolutas del plano
  const allPorts = components.flatMap(c => 
    c.ports.map(p => ({
      port: p,
      absolutePos: {
        x: c.position.x + p.relPosition.x,
        y: c.position.y + p.relPosition.y
      }
    }))
  );

  const handleMouseMove = (e: React.MouseEvent) => {
    const rawPos = getCanvasCoords(e);
    setMousePos(rawPos);

    let finalPos = { ...rawPos };

    // Snap magnético a puertos de componentes
    if (snapPortEnabled) {
      const snapResult = snapToNearestPort(rawPos, allPorts, 8);
      if (snapResult.port) {
        finalPos = snapResult.snappedPoint;
        setActivePortId(snapResult.port.id);
      } else {
        setActivePortId(null);
        if (snapGridEnabled) {
          finalPos = snapToGrid(rawPos, gridSize);
        }
      }
    } else if (snapGridEnabled) {
      finalPos = snapToGrid(rawPos, gridSize);
    }

    setSnappedPos(finalPos);

    // Si estamos arrastrando un componente
    if (draggingCompId) {
      const targetPos = {
        x: finalPos.x - dragOffset.x,
        y: finalPos.y - dragOffset.y
      };
      updateComponentPosition(draggingCompId, targetPos);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Si la herramienta es dibujar cable
    if (tool === 'wire') {
      if (!wireStartPoint) {
        setWireStartPoint(snappedPos);
      } else {
        // Segundo clic: trazar y agregar segmento ortogonal
        const points = routeOrthoWire(wireStartPoint, snappedPos, 'horizontal_first');
        for (let i = 0; i < points.length - 1; i++) {
          addWireSegment('W-NEW', points[i], points[i + 1], 'SIGNAL');
        }
        setWireStartPoint(null);
      }
      return;
    }

    // Clic en el fondo deselecciona
    if (e.target === svgRef.current) {
      clearSelection();
    }
  };

  const handleMouseUp = () => {
    if (draggingCompId) {
      setDraggingCompId(null);
    }
  };

  const isDark = theme === 'dark_autocad';
  const canvasBg = isDark ? '#0b1324' : '#ffffff';
  const gridColor = isDark ? '#1a2744' : '#e2e8f0';
  const sheetBorder = isDark ? '#38bdf8' : '#0f172a';

  return (
    <main 
      style={{
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: isDark ? '#060b14' : '#f1f5f9',
        cursor: tool === 'wire' ? 'crosshair' : tool === 'cut' ? 'pointer' : 'default',
        userSelect: 'none'
      }}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        style={{ display: 'block' }}
      >
        <defs>
          {/* Patrón de Cuadrícula Métrica DIN A3 */}
          <pattern id="cadGrid" width={gridSize * 4} height={gridSize * 4} patternUnits="userSpaceOnUse">
            <circle cx={gridSize * 2} cy={gridSize * 2} r="0.75" fill={gridColor} />
          </pattern>
        </defs>

        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          {/* Hoja Normalizada DIN ISO 5457 A3 (420 x 297 mm escalada) */}
          <rect
            x="0"
            y="0"
            width="420"
            height="297"
            fill={canvasBg}
            stroke={sheetBorder}
            strokeWidth="1.5"
            style={{ filter: 'drop-shadow(0 15px 35px rgba(0,0,0,0.5))' }}
          />

          {/* Cuadrícula interna */}
          <rect x="0" y="0" width="420" height="297" fill="url(#cadGrid)" />

          {/* Marco y Cajetín Normalizado A3 */}
          <rect x="10" y="10" width="400" height="277" fill="none" stroke={sheetBorder} strokeWidth="1" />
          
          {/* Cajetín DIN ISO 5457 */}
          <g transform="translate(230, 247)">
            <rect width="180" height="40" fill={isDark ? '#0d1a30' : '#f8fafc'} stroke={sheetBorder} strokeWidth="1" />
            <line x1="0" y1="20" x2="180" y2="20" stroke={sheetBorder} strokeWidth="0.75" />
            <line x1="90" y1="0" x2="90" y2="40" stroke={sheetBorder} strokeWidth="0.75" />
            <text x="6" y="13" fill={isDark ? '#94a3b8' : '#64748b'} fontSize="7" fontWeight="bold">PROYECTO: DE-5266</text>
            <text x="6" y="32" fill={isDark ? '#ffffff' : '#0f172a'} fontSize="8" fontWeight="bold">CONTROL VISIÓN BLISTERA 3</text>
            <text x="96" y="13" fill={isDark ? '#38bdf8' : '#0284c7'} fontSize="7" fontWeight="bold">AXON INGENIERÍA</text>
            <text x="96" y="32" fill={isDark ? '#10b981' : '#059669'} fontSize="7">GAMP 5 / IEC 60617</text>
          </g>

          {/* Renderizado de Conductores Eléctricos */}
          {wires.map(net => 
            net.segments.map(seg => {
              const isSelected = selectedIds.includes(seg.id);
              return (
                <g 
                  key={seg.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (tool === 'cut') {
                      splitSegmentAtPoint(seg.id, snappedPos);
                    } else {
                      selectEntity(seg.id);
                    }
                  }}
                >
                  <line
                    x1={seg.p1.x}
                    y1={seg.p1.y}
                    x2={seg.p2.x}
                    y2={seg.p2.y}
                    stroke={isSelected ? '#38bdf8' : (seg.color || '#ff4444')}
                    strokeWidth={isSelected ? 3 : (seg.strokeWidth || 2)}
                    strokeLinecap="round"
                    style={{ cursor: tool === 'cut' ? 'cell' : 'pointer' }}
                  />
                  {/* Halo de selección */}
                  {isSelected && (
                    <line
                      x1={seg.p1.x}
                      y1={seg.p1.y}
                      x2={seg.p2.x}
                      y2={seg.p2.y}
                      stroke="rgba(56, 189, 248, 0.4)"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                  )}
                </g>
              );
            })
          )}

          {/* Renderizado de Componentes IEC */}
          {components.map(comp => {
            const isSelected = selectedIds.includes(comp.id);
            return (
              <g
                key={comp.id}
                transform={`translate(${comp.position.x}, ${comp.position.y}) rotate(${comp.rotation})`}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  selectEntity(comp.id);
                  if (tool === 'select') {
                    setDraggingCompId(comp.id);
                    const currentCoords = getCanvasCoords(e);
                    setDragOffset({
                      x: currentCoords.x - comp.position.x,
                      y: currentCoords.y - comp.position.y
                    });
                  }
                }}
                style={{ cursor: tool === 'select' ? 'move' : 'pointer' }}
              >
                {/* Cuerpo del Símbolo Vectorial */}
                <rect
                  x="-20"
                  y="-24"
                  width="40"
                  height="48"
                  rx="4"
                  fill={isDark ? '#15243d' : '#ffffff'}
                  stroke={isSelected ? '#38bdf8' : (isDark ? '#60a5fa' : '#1e3a8a')}
                  strokeWidth={isSelected ? 2.5 : 1.5}
                />

                {/* Tag y Designador */}
                <text
                  x="0"
                  y="-4"
                  fill={isDark ? '#ffffff' : '#0f172a'}
                  fontSize="9"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {comp.tag}
                </text>
                <text
                  x="0"
                  y="10"
                  fill={isDark ? '#94a3b8' : '#64748b'}
                  fontSize="6"
                  textAnchor="middle"
                >
                  {comp.attributes['Modelo']?.split(' ')[0] || comp.symbolId}
                </text>

                {/* Bornas / Puertos Magnéticos */}
                {comp.ports.map(port => {
                  const isHovered = activePortId === port.id;
                  return (
                    <g key={port.id} transform={`translate(${port.relPosition.x}, ${port.relPosition.y})`}>
                      <circle
                        r={isHovered ? 4 : 2.5}
                        fill={isHovered ? '#10b981' : '#38bdf8'}
                        stroke="#ffffff"
                        strokeWidth="1"
                      />
                      <text
                        x={port.direction === 'top' ? 0 : 0}
                        y={port.direction === 'top' ? -5 : 9}
                        fill={isDark ? '#38bdf8' : '#0369a1'}
                        fontSize="6"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {port.label}
                      </text>
                    </g>
                  );
                })}
              </g>
            );
          })}

          {/* Previsualización de Trazo de Cable (Ruteo Ortogonal 90°) */}
          {tool === 'wire' && wireStartPoint && (
            <polyline
              points={routeOrthoWire(wireStartPoint, snappedPos, 'horizontal_first').map(p => `${p.x},${p.y}`).join(' ')}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2"
              strokeDasharray="4,3"
            />
          )}

          {/* Indicador de Cursor con Snap */}
          <circle
            cx={snappedPos.x}
            cy={snappedPos.y}
            r="3"
            fill="none"
            stroke="#10b981"
            strokeWidth="1.5"
          />
        </g>
      </svg>
    </main>
  );
};
