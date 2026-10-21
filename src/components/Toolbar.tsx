import React from 'react';
import { useCadStore, CadTool } from '../store/useCadStore';
import { 
  MousePointer, 
  Waypoints, 
  Scissors, 
  Maximize2, 
  SlidersHorizontal, 
  Sun, 
  Moon, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Trash2,
  Magnet,
  Grid,
  Cpu,
  Image as ImageIcon
} from 'lucide-react';

export const Toolbar: React.FC = () => {
  const { 
    tool, 
    setTool, 
    theme, 
    setTheme, 
    zoom, 
    setZoom, 
    pan, 
    setPan,
    isInspectorOpen,
    toggleInspector,
    snapGridEnabled,
    snapPortEnabled,
    deleteSelected,
    selectedIds,
    isPaletteOpen,
    togglePalette,
    showSketchUnderlay,
    toggleSketchUnderlay
  } = useCadStore();

  const tools: { id: CadTool; label: string; icon: React.ReactNode }[] = [
    { id: 'select', label: 'Seleccionar (V)', icon: <MousePointer size={18} /> },
    { id: 'wire', label: 'Dibujar Cable 90° (W)', icon: <Waypoints size={18} /> },
    { id: 'cut', label: 'Cortar / Split (C)', icon: <Scissors size={18} /> },
    { id: 'extend', label: 'Extender (E)', icon: <Maximize2 size={18} /> },
  ];

  return (
    <aside style={{
      width: '54px',
      backgroundColor: theme === 'dark_autocad' ? '#0d1527' : '#f8fafc',
      borderRight: `1px solid ${theme === 'dark_autocad' ? '#1e2f50' : '#e2e8f0'}`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '12px 0',
      gap: '8px',
      zIndex: 20
    }}>
      {/* Herramientas de Edición CAD */}
      {tools.map((t) => {
        const isActive = tool === t.id;
        return (
          <button
            key={t.id}
            title={t.label}
            onClick={() => setTool(t.id)}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              border: isActive ? '1px solid #38bdf8' : '1px solid transparent',
              backgroundColor: isActive 
                ? (theme === 'dark_autocad' ? '#1e3a63' : '#e0f2fe')
                : 'transparent',
              color: isActive 
                ? '#38bdf8' 
                : (theme === 'dark_autocad' ? '#94a3b8' : '#64748b'),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {t.icon}
          </button>
        );
      })}

      <div style={{ width: '32px', height: '1px', backgroundColor: theme === 'dark_autocad' ? '#1e2f50' : '#e2e8f0', margin: '4px 0' }} />

      {/* Snap Magnético y Rejilla */}
      <button
        title="Snap Magnético a Bornas IEC"
        onClick={() => useCadStore.setState({ snapPortEnabled: !snapPortEnabled })}
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '8px',
          border: snapPortEnabled ? '1px solid #10b981' : '1px solid transparent',
          backgroundColor: snapPortEnabled ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
          color: snapPortEnabled ? '#10b981' : '#64748b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}
      >
        <Magnet size={18} />
      </button>

      <button
        title="Snap a Cuadrícula Métrica (4 mm)"
        onClick={() => useCadStore.setState({ snapGridEnabled: !snapGridEnabled })}
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '8px',
          border: snapGridEnabled ? '1px solid #38bdf8' : '1px solid transparent',
          backgroundColor: snapGridEnabled ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
          color: snapGridEnabled ? '#38bdf8' : '#64748b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}
      >
        <Grid size={18} />
      </button>

      {/* Catalogo de Simbolos IEC */}
      <button title='Catalogo de Simbolos IEC 60617' onClick={togglePalette} style={{ width: '40px', height: '40px', borderRadius: '8px', border: isPaletteOpen ? '1px solid #38bdf8' : '1px solid transparent', backgroundColor: isPaletteOpen ? 'rgba(56, 189, 248, 0.15)' : 'transparent', color: isPaletteOpen ? '#38bdf8' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Cpu size={18} /></button>

      {/* Alternar Boceto */}
      <button title={showSketchUnderlay ? 'Ocultar Boceto de Fondo' : 'Mostrar Boceto de Fondo'} onClick={toggleSketchUnderlay} style={{ width: '40px', height: '40px', borderRadius: '8px', border: showSketchUnderlay ? '1px solid #eab308' : '1px solid transparent', backgroundColor: showSketchUnderlay ? 'rgba(234, 179, 8, 0.15)' : 'transparent', color: showSketchUnderlay ? '#eab308' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><ImageIcon size={18} /></button>

      <div style={{ flex: 1 }} />

      {/* Borrar Selección */}
      {selectedIds.length > 0 && (
        <button
          title="Eliminar Selección (Supr)"
          onClick={deleteSelected}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            border: '1px solid #f43f5e',
            backgroundColor: 'rgba(244, 63, 94, 0.15)',
            color: '#f43f5e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <Trash2 size={18} />
        </button>
      )}

      {/* Alternar Tema (Oscuro AutoCAD vs Impresión Blanco) */}
      <button
        title={theme === 'dark_autocad' ? 'Cambiar a Modo Impresión (Blanco)' : 'Cambiar a Modo AutoCAD (Oscuro)'}
        onClick={() => setTheme(theme === 'dark_autocad' ? 'print_white' : 'dark_autocad')}
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '8px',
          border: '1px solid transparent',
          backgroundColor: 'transparent',
          color: theme === 'dark_autocad' ? '#f59e0b' : '#334155',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}
      >
        {theme === 'dark_autocad' ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      {/* Toggle Inspector Lateral */}
      <button
        title="Inspector de Propiedades (F2)"
        onClick={toggleInspector}
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '8px',
          border: isInspectorOpen ? '1px solid #818cf8' : '1px solid transparent',
          backgroundColor: isInspectorOpen ? 'rgba(129, 140, 248, 0.15)' : 'transparent',
          color: isInspectorOpen ? '#818cf8' : '#64748b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}
      >
        <SlidersHorizontal size={18} />
      </button>
    </aside>
  );
};
