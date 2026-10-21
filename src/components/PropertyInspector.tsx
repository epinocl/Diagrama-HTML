import React from 'react';
import { useCadStore } from '../store/useCadStore';
import { X, ExternalLink, Minimize2, Tag, Layers, Cpu, Waypoints, Info } from 'lucide-react';

export const PropertyInspector: React.FC = () => {
  const { 
    isInspectorOpen, 
    isInspectorFloating, 
    toggleInspector, 
    setInspectorFloating,
    selectedIds,
    components,
    wires,
    theme,
    updateComponentProperty
  } = useCadStore();

  if (!isInspectorOpen) return null;

  // Encontrar entidad seleccionada
  const selectedComponent = components.find(c => selectedIds.includes(c.id));
  const selectedWire = wires.find(w => w.segments.some(s => selectedIds.includes(s.id)));
  const selectedSegment = selectedWire?.segments.find(s => selectedIds.includes(s.id));

  const isDark = theme === 'dark_autocad';
  const bgColor = isDark ? '#0f172a' : '#ffffff';
  const borderColor = isDark ? '#1e2f50' : '#e2e8f0';
  const textColor = isDark ? '#f8fafc' : '#0f172a';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';

  const containerStyle: React.CSSProperties = isInspectorFloating
    ? {
        position: 'fixed',
        top: '80px',
        right: '24px',
        width: '320px',
        maxHeight: '80vh',
        backgroundColor: bgColor,
        border: `1px solid ${borderColor}`,
        borderRadius: '12px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.45)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }
    : {
        width: '320px',
        backgroundColor: bgColor,
        borderLeft: `1px solid ${borderColor}`,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 20
      };

  return (
    <aside style={containerStyle}>
      {/* Header del Inspector */}
      <div style={{
        padding: '12px 16px',
        borderBottom: `1px solid ${borderColor}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: isDark ? 'rgba(30, 41, 59, 0.5)' : '#f8fafc'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Tag size={16} color="#38bdf8" />
          <span style={{ fontWeight: 700, fontSize: '13px', color: textColor }}>
            Inspector de Propiedades
          </span>
        </div>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            title={isInspectorFloating ? 'Acoplar a la derecha' : 'Desacoplar ventana flotante'}
            onClick={() => setInspectorFloating(!isInspectorFloating)}
            style={{
              background: 'transparent',
              border: 'none',
              color: mutedColor,
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            {isInspectorFloating ? <Minimize2 size={15} /> : <ExternalLink size={15} />}
          </button>
          <button
            title="Cerrar inspector"
            onClick={toggleInspector}
            style={{
              background: 'transparent',
              border: 'none',
              color: mutedColor,
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Contenido del Inspector */}
      <div style={{ padding: '16px', overflowY: 'auto', flex: 1, fontSize: '13px' }}>
        {selectedComponent ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Cpu size={18} color="#10b981" />
              <div>
                <strong style={{ display: 'block', color: textColor, fontSize: '14px' }}>
                  {selectedComponent.tag}
                </strong>
                <span style={{ fontSize: '11px', color: mutedColor }}>
                  {selectedComponent.symbolId}
                </span>
              </div>
            </div>

            {/* Designador (Tag) */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '11px', color: mutedColor, marginBottom: '4px', fontWeight: 600 }}>
                DESIGNADOR (TAG)
              </label>
              <input
                type="text"
                value={selectedComponent.tag}
                onChange={(e) => updateComponentProperty(selectedComponent.id, 'tag', e.target.value)}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '7px 10px',
                  borderRadius: '6px',
                  border: `1px solid ${borderColor}`,
                  backgroundColor: isDark ? '#090e1a' : '#ffffff',
                  color: textColor,
                  fontSize: '13px',
                  fontWeight: 600
                }}
              />
            </div>

            {/* Función Técnica */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '11px', color: mutedColor, marginBottom: '4px', fontWeight: 600 }}>
                TEXTO DE FUNCIÓN
              </label>
              <input
                type="text"
                value={selectedComponent.functionText || ''}
                onChange={(e) => updateComponentProperty(selectedComponent.id, 'functionText', e.target.value)}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '7px 10px',
                  borderRadius: '6px',
                  border: `1px solid ${borderColor}`,
                  backgroundColor: isDark ? '#090e1a' : '#ffffff',
                  color: textColor,
                  fontSize: '13px'
                }}
              />
            </div>

            {/* Coordenadas */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: mutedColor, marginBottom: '4px' }}>POS X (mm)</label>
                <div style={{ padding: '6px 10px', background: isDark ? '#090e1a' : '#f1f5f9', borderRadius: '6px', color: textColor, fontWeight: 600 }}>
                  {selectedComponent.position.x}
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: mutedColor, marginBottom: '4px' }}>POS Y (mm)</label>
                <div style={{ padding: '6px 10px', background: isDark ? '#090e1a' : '#f1f5f9', borderRadius: '6px', color: textColor, fontWeight: 600 }}>
                  {selectedComponent.position.y}
                </div>
              </div>
            </div>

            {/* Bornas / Puertos Magnéticos */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '11px', color: mutedColor, marginBottom: '6px', fontWeight: 700 }}>
                BORNAS / TERMINALES IEC ({selectedComponent.ports.length})
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {selectedComponent.ports.map(p => (
                  <div key={p.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '6px 10px',
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : '#f8fafc',
                    borderRadius: '6px',
                    fontSize: '12px'
                  }}>
                    <span style={{ fontWeight: 700, color: '#38bdf8' }}>Borne {p.label}</span>
                    <span style={{ color: mutedColor, fontSize: '11px' }}>{p.direction} • {p.type}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Atributos Industriales */}
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: mutedColor, marginBottom: '6px', fontWeight: 700 }}>
                ATRIBUTOS TÉCNICOS
              </label>
              {Object.entries(selectedComponent.attributes).map(([k, v]) => (
                <div key={k} style={{ marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', color: mutedColor, display: 'block' }}>{k}</span>
                  <input
                    type="text"
                    value={v}
                    onChange={(e) => updateComponentProperty(selectedComponent.id, k, e.target.value)}
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '5px 8px',
                      borderRadius: '4px',
                      border: `1px solid ${borderColor}`,
                      backgroundColor: isDark ? '#090e1a' : '#ffffff',
                      color: textColor,
                      fontSize: '12px'
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : selectedSegment ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Waypoints size={18} color="#38bdf8" />
              <div>
                <strong style={{ display: 'block', color: textColor, fontSize: '14px' }}>
                  Conductor: {selectedWire?.code}
                </strong>
                <span style={{ fontSize: '11px', color: mutedColor }}>
                  {selectedWire?.potential}
                </span>
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '11px', color: mutedColor, marginBottom: '4px', fontWeight: 600 }}>
                CÓDIGO DE RED / CABLE
              </label>
              <div style={{ padding: '7px 10px', background: isDark ? '#090e1a' : '#f1f5f9', borderRadius: '6px', color: textColor, fontWeight: 600 }}>
                {selectedWire?.code}
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '11px', color: mutedColor, marginBottom: '4px', fontWeight: 600 }}>
                SECCIÓN / CALIBRE
              </label>
              <div style={{ padding: '7px 10px', background: isDark ? '#090e1a' : '#f1f5f9', borderRadius: '6px', color: textColor }}>
                {selectedSegment.calibre || '1.5 mm²'}
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '11px', color: mutedColor, marginBottom: '4px', fontWeight: 600 }}>
                EXTREMOS DEL TRAMO
              </label>
              <div style={{ fontSize: '12px', color: textColor }}>
                De: ({selectedSegment.p1.x}, {selectedSegment.p1.y})<br/>
                A: ({selectedSegment.p2.x}, {selectedSegment.p2.y})
              </div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 10px', color: mutedColor }}>
            <Info size={28} style={{ opacity: 0.5, marginBottom: '8px' }} />
            <div>Ninguna entidad seleccionada</div>
            <div style={{ fontSize: '11px', marginTop: '4px' }}>
              Haz clic en un componente o cable en el plano para editar sus propiedades.
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
