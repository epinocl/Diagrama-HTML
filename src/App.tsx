import React, { useRef } from 'react';
import { Toolbar } from './components/Toolbar';
import { CadCanvas } from './components/CadCanvas';
import { PropertyInspector } from './components/PropertyInspector';
import { useCadStore } from './store/useCadStore';
import { ZoomIn, ZoomOut, RotateCcw, ShieldCheck, FolderUp, Download, CheckCircle2 } from 'lucide-react';

export const App: React.FC = () => {
  const { 
    theme, 
    zoom, 
    setZoom, 
    tool, 
    selectedIds,
    projectCode,
    projectName,
    importZipFile,
    exportCurrentZip,
    notification
  } = useCadStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isDark = theme === 'dark_autocad';
  const headerBg = isDark ? '#0b1324' : '#ffffff';
  const borderColor = isDark ? '#1e2f50' : '#e2e8f0';
  const textColor = isDark ? '#f8fafc' : '#0f172a';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await importZipFile(e.target.files[0]);
      e.target.value = '';
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      backgroundColor: isDark ? '#070c18' : '#f8fafc',
      color: textColor,
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Barra Superior Corporativa */}
      <header style={{
        height: '48px',
        backgroundColor: headerBg,
        borderBottom: `1px solid ${borderColor}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        zIndex: 30
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #0284c7, #0369a1)',
            color: '#ffffff',
            padding: '3px 8px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: 800,
            letterSpacing: '0.5px'
          }}>
            AXON CAD
          </div>
          <span style={{ fontWeight: 700, fontSize: '13px' }}>
            {projectCode} — {projectName}
          </span>
          <span style={{
            fontSize: '11px',
            color: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            padding: '2px 8px',
            borderRadius: '12px',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <ShieldCheck size={12} /> GAMP 5 Cat. 4
          </span>
        </div>

        {/* Acciones de Paquete Portable y Zoom */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Botón Importar ZIP */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".zip,.axon.zip"
            style={{ display: 'none' }}
          />
          <button
            title="Importar proyecto desde paquete .axon.zip o .zip"
            onClick={() => fileInputRef.current?.click()}
            style={{
              background: isDark ? '#14223d' : '#f1f5f9',
              border: `1px solid ${borderColor}`,
              color: '#38bdf8',
              borderRadius: '6px',
              padding: '5px 10px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <FolderUp size={14} /> Importar .axon.zip
          </button>

          {/* Botón Exportar ZIP */}
          <button
            title="Descargar paquete portable .axon.zip para trabajo offline o servidor"
            onClick={exportCurrentZip}
            style={{
              background: 'linear-gradient(135deg, #0284c7, #0369a1)',
              border: 'none',
              color: '#ffffff',
              borderRadius: '6px',
              padding: '5px 12px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 0 10px rgba(2, 132, 199, 0.3)'
            }}
          >
            <Download size={14} /> Exportar .axon.zip
          </button>

          <div style={{ width: '1px', height: '20px', backgroundColor: borderColor, margin: '0 2px' }} />

          {/* Zoom */}
          <button
            title="Reducir Zoom"
            onClick={() => setZoom(zoom - 0.1)}
            style={{
              background: 'transparent',
              border: `1px solid ${borderColor}`,
              color: textColor,
              borderRadius: '6px',
              padding: '4px 8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <ZoomOut size={14} />
          </button>
          <span style={{ fontSize: '12px', fontWeight: 600, minWidth: '40px', textAlign: 'center' }}>
            {Math.round(zoom * 100)}%
          </span>
          <button
            title="Aumentar Zoom"
            onClick={() => setZoom(zoom + 0.1)}
            style={{
              background: 'transparent',
              border: `1px solid ${borderColor}`,
              color: textColor,
              borderRadius: '6px',
              padding: '4px 8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <ZoomIn size={14} />
          </button>
          <button
            title="Restablecer 100%"
            onClick={() => setZoom(1.0)}
            style={{
              background: 'transparent',
              border: `1px solid ${borderColor}`,
              color: mutedColor,
              borderRadius: '6px',
              padding: '4px 8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </header>

      {/* Área de Trabajo Principal */}
      <div style={{ display: 'flex', flex: 1, position: 'relative', overflow: 'hidden' }}>
        <Toolbar />
        <CadCanvas />
        <PropertyInspector />

        {/* Notificación Toast Flotante */}
        {notification && (
          <div style={{
            position: 'absolute',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#0f172a',
            border: '1px solid #10b981',
            borderRadius: '10px',
            padding: '10px 18px',
            color: '#ffffff',
            fontSize: '13px',
            fontWeight: 600,
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            zIndex: 100,
            animation: 'fadeIn 0.25s ease'
          }}>
            <CheckCircle2 size={16} color="#10b981" />
            {notification}
          </div>
        )}
      </div>

      {/* Barra de Estado Inferior */}
      <footer style={{
        height: '26px',
        backgroundColor: headerBg,
        borderTop: `1px solid ${borderColor}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        fontSize: '11px',
        color: mutedColor,
        zIndex: 30
      }}>
        <div style={{ display: 'flex', gap: '16px' }}>
          <span>Herramienta: <strong style={{ color: textColor }}>{tool.toUpperCase()}</strong></span>
          <span>Seleccionados: <strong style={{ color: '#38bdf8' }}>{selectedIds.length}</strong></span>
          <span>Formato: <strong>DIN ISO 5457 A3 (420 x 297 mm)</strong></span>
        </div>
        <div>
          <span>Lámina: <strong>01 / 11 — Circuito Fuerza</strong></span>
          <span style={{ margin: '0 8px' }}>•</span>
          <span>Audit Trail: <strong style={{ color: '#10b981' }}>ALCOA+ Activo</strong></span>
        </div>
      </footer>
    </div>
  );
};

export default App;
