import React, { useRef, useState, useEffect } from 'react';
import { useCadStore } from '../store/useCadStore';
import { Point2D } from '../cad/types';
import { snapToGrid, snapToNearestPort, routeOrthoWire } from '../cad/topology';
import { UploadCloud } from 'lucide-react';

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
    snapPortEnabled,
    importZipFile,
    setZoom,
    fitToScreen,
    projectCode,
    projectName,
    client,
    sheets,
    activeSheetIndex,
    activeSheetId,
    sketches,
    showSketchUnderlay,
    sketchOpacity
  } = useCadStore();

  const activeSheet = sheets[activeSheetIndex] || sheets.find(s => s.id === activeSheetId);
  const sketchFileName = activeSheet?.sketchFile?.replace("bocetos/", "");
  const activeSketchUrl = (sketchFileName && sketches[sketchFileName]) || (sketches[Object.keys(sketches)[activeSheetIndex]]) || Object.values(sketches)[0];

  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const doFit = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        if (rect.width > 200 && rect.height > 200) {
          fitToScreen(rect.width, rect.height);
        }
      }
    };
    doFit();
    window.addEventListener('resize', doFit);
    return () => window.removeEventListener('resize', doFit);
  }, [activeSheetId, projectCode]);

  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [panStart, setPanStart] = useState<Point2D>({ x: 0, y: 0 });

  // Estados interactivos locales
  const [draggingCompId, setDraggingCompId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<Point2D>({ x: 0, y: 0 });
  const [wireStartPoint, setWireStartPoint] = useState<Point2D | null>(null);
  const [mousePos, setMousePos] = useState<Point2D>({ x: 0, y: 0 });
  const [snappedPos, setSnappedPos] = useState<Point2D>({ x: 0, y: 0 });
  const [activePortId, setActivePortId] = useState<string | null>(null);

  // Estado de Drag & Drop de archivo .axon.zip
  const [isDragOverFile, setIsDragOverFile] = useState<boolean>(false);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.12 : 0.88;
    const newZoom = Math.min(Math.max(zoom * zoomFactor, 0.3), 6.0);
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const newPanX = mouseX - (mouseX - pan.x) * (newZoom / zoom);
    const newPanY = mouseY - (mouseY - pan.y) * (newZoom / zoom);
    setZoom(parseFloat(newZoom.toFixed(2)));
    setPan({ x: Math.round(newPanX), y: Math.round(newPanY) });
  };

  const getCanvasCoords = (e: React.MouseEvent): Point2D => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    const rawX = (clientX - pan.x) / zoom;
    const rawY = (clientY - pan.y) / zoom;

    return { x: Math.round(rawX), y: Math.round(rawY) };
  };

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
    if (isPanning) {
      setPan({
        x: Math.round(e.clientX - panStart.x),
        y: Math.round(e.clientY - panStart.y)
      });
      return;
    }
    const rawPos = getCanvasCoords(e);
    setMousePos(rawPos);

    let finalPos = { ...rawPos };

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

    if (draggingCompId) {
      const targetPos = {
        x: finalPos.x - dragOffset.x,
        y: finalPos.y - dragOffset.y
      };
      updateComponentPosition(draggingCompId, targetPos);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || e.button === 2 || e.altKey) {
      e.preventDefault();
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      return;
    }
    if (tool === 'wire') {
      if (!wireStartPoint) {
        setWireStartPoint(snappedPos);
      } else {
        const points = routeOrthoWire(wireStartPoint, snappedPos, 'horizontal_first');
        for (let i = 0; i < points.length - 1; i++) {
          addWireSegment('W-NEW', points[i], points[i + 1], 'SIGNAL');
        }
        setWireStartPoint(null);
      }
      return;
    }

    if (e.target === svgRef.current) {
      clearSelection();
    }
  };

  const handleMouseUp = () => {
    if (isPanning) setIsPanning(false);
    if (draggingCompId) setDraggingCompId(null);
  };

  // Manejadores de Drag & Drop para archivos .axon.zip
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragOverFile) setIsDragOverFile(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOverFile(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOverFile(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.zip') || file.name.endsWith('.axon.zip')) {
        await importZipFile(file);
      } else {
        alert('Por favor arrastra un archivo comprimido .axon.zip o .zip válido.');
      }
    }
  };

  const isDark = theme === 'dark_autocad';
  const canvasBg = isDark ? '#0b1324' : '#ffffff';
  const gridColor = isDark ? '#1a2744' : '#e2e8f0';
  const sheetBorder = isDark ? '#38bdf8' : '#0f172a';

  return (
    <main 
      ref={containerRef}
      onWheel={handleWheel}
      onContextMenu={(e) => e.preventDefault()}
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
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Overlay Visual de Zona Drag & Drop */}
      {isDragOverFile && (
        <div style={{
          position: 'absolute',
          inset: '20px',
          border: '3px dashed #38bdf8',
          borderRadius: '16px',
          backgroundColor: isDark ? 'rgba(15, 23, 42, 0.85)' : 'rgba(240, 249, 255, 0.9)',
          backdropFilter: 'blur(8px)',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#38bdf8',
          pointerEvents: 'none',
          animation: 'pulse 1.5s infinite'
        }}>
          <UploadCloud size={64} style={{ marginBottom: '16px', filter: 'drop-shadow(0 0 12px rgba(56, 189, 248, 0.5))' }} />
          <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 800 }}>
            Suelta tu archivo .axon.zip aquí
          </h2>
          <p style={{ margin: 0, fontSize: '14px', color: isDark ? '#94a3b8' : '#64748b' }}>
            Carga instantánea de esquemas, bornas IEC y bocetos de terreno en memoria
          </p>
        </div>
      )}

      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        style={{ display: 'block' }}
      >
        <defs>
          <pattern id="cadGrid" width={gridSize * 4} height={gridSize * 4} patternUnits="userSpaceOnUse">
            <circle cx={gridSize * 2} cy={gridSize * 2} r="0.75" fill={gridColor} />
          </pattern>
        </defs>

        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          {/* Hoja Normalizada DIN ISO 5457 A3 (420 x 297 mm) */}
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

          <rect x="0" y="0" width="420" height="297" fill="url(#cadGrid)" />
          <rect x="10" y="10" width="400" height="277" fill="none" stroke={sheetBorder} strokeWidth="1" />
          
          {/* Capa de Cotejo: Boceto o PDF */}
          {showSketchUnderlay && activeSketchUrl && (
            <g id="sketchUnderlayLayer" opacity={sketchOpacity} style={{ pointerEvents: "none", filter: isDark ? "invert(0.9) contrast(1.25)" : "none" }}>
              <image
                href={activeSketchUrl}
                x="10"
                y="10"
                width="400"
                height="277"
                preserveAspectRatio="xMidYMid meet"
              />
            </g>
          )}
          
          {/* Esquema Electrico Vectorial Completo (Generado por el Agente / Estandar CAD AXON) */}
          {activeSheet?.svgContent && (
            <svg
              x="0"
              y="0"
              width="420"
              height="297"
              viewBox="0 0 1191 842"
              style={{ overflow: 'visible', pointerEvents: 'none' }}
              dangerouslySetInnerHTML={{
                __html: activeSheet.svgContent
                  .replace(/<svg[^>]*>/i, '')
                  .replace(/<\/svg>/i, '')
              }}
            />
          )}

          {/* Cajetín Normalizado A3 Fallback */}
          {!activeSheet?.svgContent && (
          <g transform="translate(230, 247)">
            <rect width="180" height="40" fill={isDark ? '#0d1a30' : '#f8fafc'} stroke={sheetBorder} strokeWidth="1" />
            <line x1="0" y1="20" x2="180" y2="20" stroke={sheetBorder} strokeWidth="0.75" />
            <line x1="110" y1="0" x2="110" y2="40" stroke={sheetBorder} strokeWidth="0.75" />
            <text x="6" y="13" fill={isDark ? '#94a3b8' : '#64748b'} fontSize="7" fontWeight="bold">PROYECTO: {projectCode}</text>
            <text x="6" y="32" fill={isDark ? '#ffffff' : '#0f172a'} fontSize="8" fontWeight="bold">{projectName.length > 25 ? projectName.slice(0, 24) + '…' : projectName}</text>
            <text x="116" y="13" fill={isDark ? '#38bdf8' : '#0284c7'} fontSize="7" fontWeight="bold">{client.length > 20 ? client.slice(0, 19) + '…' : client}</text>
            <text x="116" y="32" fill={isDark ? '#10b981' : '#059669'} fontSize="7">{activeSheet?.meta.discipline || 'IEC 60617'} · Lám. {activeSheet?.meta.sheetCode || (activeSheetIndex + 1)}</text>
          </g>
          )}

          {/* Conductores Eléctricos */}
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

          {/* Componentes IEC */}
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

                <text x="0" y="-4" fill={isDark ? '#ffffff' : '#0f172a'} fontSize="9" fontWeight="bold" textAnchor="middle">
                  {comp.tag}
                </text>
                <text x="0" y="10" fill={isDark ? '#94a3b8' : '#64748b'} fontSize="6" textAnchor="middle">
                  {comp.attributes['Modelo']?.split(' ')[0] || comp.symbolId}
                </text>

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
                        x={0}
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

          {/* Previsualización Ortogonal 90° */}
          {tool === 'wire' && wireStartPoint && (
            <polyline
              points={routeOrthoWire(wireStartPoint, snappedPos, 'horizontal_first').map(p => `${p.x},${p.y}`).join(' ')}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2"
              strokeDasharray="4,3"
            />
          )}

          {/* Snap Pointer */}
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
